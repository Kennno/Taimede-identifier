import { createClient } from "../../supabase/client";
import {
  getDeviceId,
  getUnregisteredIdentificationCount,
  incrementUnregisteredIdentificationCount,
} from "./local-storage";
import {
  getDeviceFingerprint,
  trackDeviceAcrossAccounts,
  hasDeviceReachedLimit,
} from "./device-tracking";

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
    return getUnregisteredIdentificationCount();
  }

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
    incrementUnregisteredIdentificationCount();
    return;
  }
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
  if (isPremium) return true;

  const deviceAtLimit = await hasDeviceReachedLimit();
  if (deviceAtLimit) return false;

  const tier = await getUserTier(userId, isPremium);
  const usageCount = await getUserUsageCount(userId);

  return usageCount < USAGE_LIMITS[tier].maxIdentifications;
}

export async function trackDeviceUsage(userId?: string): Promise<void> {
  if (!userId) {
    const deviceId = getDeviceId();
    const supabase = createClient();

    try {
      const deviceFingerprint = await getDeviceFingerprint();
      const localCount = getUnregisteredIdentificationCount();

      const { data } = await supabase
        .from("device_usage")
        .select("*")
        .eq("device_id", deviceId)
        .single();

      if (!data) {
        await supabase.from("device_usage").insert({
          device_id: deviceId,
          device_fingerprint: deviceFingerprint,
          usage_count: localCount,
          last_used: new Date().toISOString(),
        });
      } else {
        const updatedCount = Math.max(localCount, data.usage_count);

        await supabase
          .from("device_usage")
          .update({
            usage_count: updatedCount,
            device_fingerprint: deviceFingerprint,
            last_used: new Date().toISOString(),
          })
          .eq("device_id", deviceId);

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

export async function syncDeviceUsageFromDB(): Promise<void> {
  if (typeof window === "undefined") return;

  try {
    const deviceId = getDeviceId();
    const supabase = createClient();

    const { data } = await supabase
      .from("device_usage")
      .select("*")
      .eq("device_id", deviceId)
      .single();

    if (data) {
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
