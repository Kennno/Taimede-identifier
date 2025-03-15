import { createClient } from "../../supabase/client";

export interface UsageLimit {
  tier: "unregistered" | "registered" | "premium";
  maxIdentifications: number;
}

export const USAGE_LIMITS: Record<string, UsageLimit> = {
  unregistered: {
    tier: "unregistered",
    maxIdentifications: 10,
  },
  registered: {
    tier: "registered",
    maxIdentifications: 20,
  },
  premium: {
    tier: "premium",
    maxIdentifications: Infinity,
  },
};

export async function getUserUsageCount(userId?: string): Promise<number> {
  if (!userId) {
    // For unregistered users, use localStorage to track usage
    if (typeof window !== "undefined") {
      const storedCount = localStorage.getItem(
        "unregisteredIdentificationCount",
      );
      return storedCount ? parseInt(storedCount, 10) : 0;
    }
    return 0;
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
    if (typeof window !== "undefined") {
      const currentCount = localStorage.getItem(
        "unregisteredIdentificationCount",
      );
      const newCount = (currentCount ? parseInt(currentCount, 10) : 0) + 1;
      localStorage.setItem(
        "unregisteredIdentificationCount",
        newCount.toString(),
      );
    }
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
