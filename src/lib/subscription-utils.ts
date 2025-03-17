import { createAdminClient } from "./supabase-admin";

export enum SubscriptionTier {
  FREE = "free",
  PREMIUM = "premium",
}

export async function getUserSubscriptionTier(
  userId: string | undefined,
): Promise<SubscriptionTier> {
  if (!userId) return SubscriptionTier.FREE;

  try {
    const supabase = createAdminClient();

    // Query the subscriptions table to check if the user has an active subscription
    const { data: subscription, error } = await supabase
      .from("subscriptions")
      .select("*")
      .eq("user_id", userId)
      .eq("status", "active")
      .single();

    if (error) {
      console.error("Error fetching subscription:", error);
      return SubscriptionTier.FREE;
    }

    // If the user has an active subscription, return PREMIUM, otherwise FREE
    return subscription ? SubscriptionTier.PREMIUM : SubscriptionTier.FREE;
  } catch (error) {
    console.error("Error in getUserSubscriptionTier:", error);
    return SubscriptionTier.FREE;
  }
}

export async function trackUsage(
  userId: string | undefined,
  deviceId: string,
  isPremium: boolean = false,
): Promise<boolean> {
  if (!userId && !deviceId) return false;

  try {
    const supabase = createAdminClient();

    // If user is logged in, track usage against their account
    if (userId) {
      const { error } = await supabase.from("usage_tracking").insert({
        user_id: userId,
        device_id: deviceId,
        is_premium: isPremium,
      });

      if (error) {
        console.error("Error tracking user usage:", error);
        return false;
      }

      return true;
    }
    // Otherwise track anonymous usage with device ID
    else {
      const { error } = await supabase.from("device_tracking").insert({
        device_id: deviceId,
        is_premium: false, // Anonymous users are always free tier
      });

      if (error) {
        console.error("Error tracking device usage:", error);
        return false;
      }

      return true;
    }
  } catch (error) {
    console.error("Error in trackUsage:", error);
    return false;
  }
}

export async function checkUsageLimit(
  userId: string | undefined,
  deviceId: string,
): Promise<boolean> {
  if (!userId && !deviceId) return false;

  try {
    const supabase = createAdminClient();

    // First check if user has premium subscription
    if (userId) {
      const tier = await getUserSubscriptionTier(userId);
      if (tier === SubscriptionTier.PREMIUM) {
        return true; // Premium users have unlimited usage
      }
    }

    // For free users, check usage limits
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (userId) {
      // Check logged-in user's usage
      const { count, error } = await supabase
        .from("usage_tracking")
        .select("*", { count: "exact", head: true })
        .eq("user_id", userId)
        .gte("created_at", today.toISOString());

      if (error) {
        console.error("Error checking user usage limit:", error);
        return false;
      }

      return count !== null && count < 5; // Free users get 5 identifications per day
    } else {
      // Check anonymous user's usage by device ID
      const { count, error } = await supabase
        .from("device_tracking")
        .select("*", { count: "exact", head: true })
        .eq("device_id", deviceId)
        .gte("created_at", today.toISOString());

      if (error) {
        console.error("Error checking device usage limit:", error);
        return false;
      }

      return count !== null && count < 3; // Anonymous users get 3 identifications per day
    }
  } catch (error) {
    console.error("Error in checkUsageLimit:", error);
    return false;
  }
}
