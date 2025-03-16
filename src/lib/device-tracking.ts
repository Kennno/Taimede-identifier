import { createClient } from "../../supabase/client";
import { getDeviceId } from "./local-storage";

// Function to get a unique device fingerprint
export async function getDeviceFingerprint(): Promise<string> {
  // Get the device ID from local storage
  const deviceId = getDeviceId();

  // Get additional browser information to make the fingerprint more unique
  const userAgent = navigator.userAgent;
  const language = navigator.language;
  const screenWidth = window.screen.width;
  const screenHeight = window.screen.height;
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  // Create a fingerprint string by combining all the information
  const fingerprintData = [
    deviceId,
    userAgent,
    language,
    `${screenWidth}x${screenHeight}`,
    timeZone,
  ].join("|");

  // Create a hash of the fingerprint data
  const encoder = new TextEncoder();
  const data = encoder.encode(fingerprintData);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);

  // Convert the hash to a hex string
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  return hashHex;
}

// Function to track device usage across accounts
export async function trackDeviceAcrossAccounts(
  userId?: string,
): Promise<void> {
  try {
    // Get device fingerprint
    const deviceFingerprint = await getDeviceFingerprint();
    const supabase = createClient();

    // Check if this device exists in the database
    const { data: existingDevice } = await supabase
      .from("device_tracking")
      .select("*")
      .eq("device_fingerprint", deviceFingerprint)
      .single();

    const now = new Date().toISOString();

    if (existingDevice) {
      // Update existing device record
      await supabase
        .from("device_tracking")
        .update({
          last_used: now,
          user_ids: userId
            ? [...new Set([...existingDevice.user_ids, userId])]
            : existingDevice.user_ids,
        })
        .eq("device_fingerprint", deviceFingerprint);
    } else {
      // Create new device record
      await supabase.from("device_tracking").insert({
        device_fingerprint: deviceFingerprint,
        user_ids: userId ? [userId] : [],
        created_at: now,
        last_used: now,
      });
    }
  } catch (error) {
    console.error("Error tracking device:", error);
  }
}

// Function to check if device has reached identification limit
export async function hasDeviceReachedLimit(): Promise<boolean> {
  try {
    const deviceFingerprint = await getDeviceFingerprint();
    const supabase = createClient();

    // Get device usage from database
    const { data: deviceData } = await supabase
      .from("device_usage")
      .select("*")
      .eq("device_fingerprint", deviceFingerprint)
      .single();

    if (deviceData && deviceData.usage_count >= 5) {
      return true; // Device has reached limit
    }

    // Also check all associated user accounts
    const { data: deviceTracking } = await supabase
      .from("device_tracking")
      .select("*")
      .eq("device_fingerprint", deviceFingerprint)
      .single();

    if (deviceTracking && deviceTracking.user_ids.length > 0) {
      // Check usage for all associated users
      const { data: userUsage } = await supabase
        .from("recent_searches")
        .select("user_id, count")
        .in("user_id", deviceTracking.user_ids)
        .group("user_id");

      // If any user has reached the limit, consider the device at limit
      if (userUsage && userUsage.some((u) => u.count >= 5)) {
        return true;
      }
    }

    return false;
  } catch (error) {
    console.error("Error checking device limit:", error);
    return false;
  }
}
