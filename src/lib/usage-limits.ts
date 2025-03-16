import { createClient } from "../../supabase/client";
import {
  getDeviceId,
  getUnregisteredIdentificationCount,
  incrementUnregisteredIdentificationCount,
} from "./local-storage";

export interface UsageLimit {
  tier: "unregistered" | "registered" | "premium";
  maxIdentifications: number;
}

export const USAGE_LIMITS: Record<string, UsageLimit> = {
  unregistered: {
    tier: "unregistered",
    maxIdentifications: 3,
  },
  registered: {
    tier: "registered",
    maxIdentifications: 5,
  },
  premium: {
    tier: "premium",
    maxIdentifications: Infinity,
  },
};

export async function getUserUsageCount(userId?: string): Promise<number> {
  if (!userId) {
    // For unregistered users, use localStorage to track usage
    return getUnregisteredIdentificationCount();
  }

  // For registered users, check the database
  const supabase = createClient();
  const { data, error } = await supabase
    .from("recent_searches")
    .select("id")
    .eq("user_id", userId);

  if (error) {
    console.error("Error fetching usage count:", error);
    return 0;
  }

  return data?.length || 0;
}

export async function incrementUsageCount(userId?: string): Promise<void> {
  if (!userId) {
    // For unregistered users, use localStorage
    incrementUnregisteredIdentificationCount();
    return;
  }

  // For registered users, the count is automatically incremented when a new record is added to recent_searches
}

export async function getUserTier(
  userId?: string,
  isPremium = false,
): Promise<"unregistered" | "registered" | "premium"> {
  if (isPremium) return "premium";
  if (userId) return "registered";
  return "unregistered";
}

export async function canUserIdentifyMore(
  userId?: string,
  isPremium = false,
): Promise<boolean> {
  const tier = await getUserTier(userId, isPremium);
  const usageCount = await getUserUsageCount(userId);

  return usageCount < USAGE_LIMITS[tier].maxIdentifications;
}

// Track device usage in the database for better persistence
export async function trackDeviceUsage(userId?: string): Promise<void> {
  if (!userId) {
    const deviceId = getDeviceId();
    const supabase = createClient();

    try {
      // Get the current count from localStorage
      const localCount = getUnregisteredIdentificationCount();

      // Check if device exists in the database
      const { data } = await supabase
        .from("device_usage")
        .select("*")
        .eq("device_id", deviceId)
        .single();

      if (!data) {
        // Create new device record
        await supabase.from("device_usage").insert({
          device_id: deviceId,
          usage_count: localCount,
          last_used: new Date().toISOString(),
        });
      } else {
        // Update existing device record with the higher count (local or DB)
        const updatedCount = Math.max(localCount, data.usage_count);

        // Update the database
        await supabase
          .from("device_usage")
          .update({
            usage_count: updatedCount,
            last_used: new Date().toISOString(),
          })
          .eq("device_id", deviceId);

        // Also update localStorage to keep them in sync
        if (updatedCount > localCount) {
          const now = new Date();
          const monthKey = `${now.getFullYear()}-${now.getMonth() + 1}`;
          const key = `unregisteredIdentificationCount_${monthKey}`;
          localStorage.setItem(key, updatedCount.toString());
        }
      }
    } catch (error) {
      console.error("Error tracking device usage:", error);
    }
  }
}

// Sync device usage from database to localStorage
export async function syncDeviceUsageFromDB(): Promise<void> {
  if (typeof window === "undefined") return;

  try {
    const deviceId = getDeviceId();
    const supabase = createClient();

    // Get device usage from database
    const { data } = await supabase
      .from("device_usage")
      .select("*")
      .eq("device_id", deviceId)
      .single();

    if (data) {
      // Update localStorage with the database count if it's higher
      const localCount = getUnregisteredIdentificationCount();
      if (data.usage_count > localCount) {
        const now = new Date();
        const monthKey = `${now.getFullYear()}-${now.getMonth() + 1}`;
        const key = `unregisteredIdentificationCount_${monthKey}`;
        localStorage.setItem(key, data.usage_count.toString());
      }
    }
  } catch (error) {
    console.error("Error syncing device usage from database:", error);
  }
}
