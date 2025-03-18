"use client";
import {
  UserCircle,
  Settings,
  LogOut,
  Leaf,
  History,
  CreditCard,
  Lock,
  LayoutDashboard,
} from "lucide-react";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "./ui/dropdown-menu";
import { createClient } from "../../supabase/client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import CheckoutPopup from "./checkout-popup";
import ResetPasswordDialog from "./reset-password-dialog";

export default function UserProfile() {
  const supabase = createClient();
  const router = useRouter();
  const [isPremium, setIsPremium] = useState(false);
  const [usageCount, setUsageCount] = useState(0);
  const [usageLimit, setUsageLimit] = useState(5);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isResetPasswordOpen, setIsResetPasswordOpen] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const checkSubscription = async () => {
      try {
        const {
          data: { user: currentUser },
        } = await supabase.auth.getUser();
        if (!currentUser) return;

        setUser(currentUser);

        // Check subscription status
        const { data: subscription } = await supabase
          .from("subscriptions")
          .select("*")
          .eq("user_id", currentUser?.id || "")
          .eq("status", "active")
          .single();

        const hasPremium = !!subscription;
        setIsPremium(hasPremium);

        // Get usage count based on subscription type
        if (hasPremium) {
          // For premium users, get from premium_usage table
          const { data: premiumUsage } = await supabase.rpc(
            "get_premium_usage",
            {
              user_uuid: currentUser.id,
            },
          );
          setUsageCount(premiumUsage || 0);
        } else {
          // For regular users, count from recent_searches
          const { data: searches } = await supabase
            .from("recent_searches")
            .select("id")
            .eq("user_id", currentUser.id);

          setUsageCount(searches?.length || 0);
        }

        // Update usage limit based on subscription status
        setUsageLimit(hasPremium ? Infinity : 20);
      } catch (error) {
        console.error("Error checking subscription:", error);
      }
    };

    checkSubscription();

    // Listen for custom event to open checkout popup
    const handleOpenCheckout = () => setIsCheckoutOpen(true);
    window.addEventListener("openCheckoutPopup", handleOpenCheckout);

    return () => {
      window.removeEventListener("openCheckoutPopup", handleOpenCheckout);
    };
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    // Clear all local storage data to reset user state completely
    localStorage.clear();
    // Ensure we redirect to home page
    router.push("/");
    // Force page reload to ensure all state is reset
    setTimeout(() => window.location.reload(), 100);
  };

  return (
    <>
      <CheckoutPopup
        user={user}
        open={isCheckoutOpen}
        onOpenChange={setIsCheckoutOpen}
      />
      <ResetPasswordDialog
        open={isResetPasswordOpen}
        onOpenChange={setIsResetPasswordOpen}
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <UserCircle className="h-6 w-6" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium">
                {user?.user_metadata?.username || user?.email || "My Account"}
              </p>
              <div className="flex items-center">
                <span
                  className={`text-xs ${isPremium ? "text-green-600" : "text-gray-500"}`}
                >
                  {isPremium ? "Premium" : "Free Plan"}
                </span>
              </div>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => router.push("/toolaud")}>
            <LayoutDashboard className="mr-2 h-4 w-4" />
            <span>Töölaud</span>
          </DropdownMenuItem>

          {!isPremium && (
            <DropdownMenuItem onClick={() => setIsCheckoutOpen(true)}>
              <CreditCard className="mr-2 h-4 w-4" />
              <span>Uuenda Premium-paketile</span>
            </DropdownMenuItem>
          )}
          <DropdownMenuSeparator />
          {!user?.app_metadata?.provider ||
          user?.app_metadata?.provider === "email" ? (
            <DropdownMenuItem onClick={() => setIsResetPasswordOpen(true)}>
              <Lock className="mr-2 h-4 w-4" />
              <span>Muuda parooli</span>
            </DropdownMenuItem>
          ) : null}
          <DropdownMenuItem onClick={() => router.push("/toolaud")}>
            <Settings className="mr-2 h-4 w-4" />
            <span>Konto seaded</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleSignOut}>
            <LogOut className="mr-2 h-4 w-4" />
            <span>Logi välja</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
