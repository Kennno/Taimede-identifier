"use client";

import Link from "next/link";
import { createClient } from "../../supabase/client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuPortal,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import {
  UserCircle,
  Home,
  Settings,
  LogOut,
  Leaf,
  History,
  CreditCard,
  Lock,
  Globe,
  LayoutDashboard,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import CheckoutPopup from "./checkout-popup";
import Logo from "./logo";

export default function DashboardNavbar() {
  const supabase = createClient();
  const router = useRouter();
  const [isPremium, setIsPremium] = useState(false);
  const [usageCount, setUsageCount] = useState(0);
  const [usageLimit, setUsageLimit] = useState(20);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Listen for custom event to open checkout popup
    const handleOpenCheckout = () => setIsCheckoutOpen(true);
    window.addEventListener("openCheckoutPopup", handleOpenCheckout);

    return () => {
      window.removeEventListener("openCheckoutPopup", handleOpenCheckout);
    };
  }, []);

  useEffect(() => {
    const checkSubscription = async () => {
      const {
        data: { user: currentUser },
      } = await supabase.auth.getUser();
      if (!currentUser) return;

      setUser(currentUser);

      // Check subscription status
      const { data: subscription } = await supabase
        .from("subscriptions")
        .select("*")
        .eq("user_id", currentUser.id)
        .eq("status", "active")
        .single();

      setIsPremium(!!subscription);

      // Get usage count
      const { data: searches } = await supabase
        .from("recent_searches")
        .select("id")
        .eq("user_id", currentUser.id);

      setUsageCount(searches?.length || 0);
      setUsageLimit(!!subscription ? Infinity : 20);
    };

    checkSubscription();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    // Clear local storage for unregistered user tracking
    localStorage.removeItem("unregisteredIdentificationCount");
    router.push("/");
  };

  return (
    <>
      <CheckoutPopup
        user={user}
        open={isCheckoutOpen}
        onOpenChange={setIsCheckoutOpen}
      />
      <nav className="w-full border-b border-gray-200 bg-white py-4">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link href="/" prefetch>
              <Logo />
            </Link>
          </div>
          <div className="flex gap-4 items-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <UserCircle className="h-6 w-6" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium">My Account</p>
                    <div className="flex items-center">
                      <span
                        className={`text-xs ${isPremium ? "text-green-600" : "text-gray-500"}`}
                      >
                        {isPremium ? "Premium" : "Free"} Plan
                      </span>
                      {!isPremium && (
                        <span className="text-xs text-gray-500 ml-2">
                          ({usageCount}/{usageLimit} identifications)
                        </span>
                      )}
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => router.push("/dashboard")}>
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  <span>My Dashboard</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push("/dashboard")}>
                  <History className="mr-2 h-4 w-4" />
                  <span>Recent Searches</span>
                </DropdownMenuItem>
                {!isPremium && (
                  <DropdownMenuItem onClick={() => setIsCheckoutOpen(true)}>
                    <CreditCard className="mr-2 h-4 w-4" />
                    <span>Upgrade to Premium</span>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => router.push("/dashboard/reset-password")}
                >
                  <Lock className="mr-2 h-4 w-4" />
                  <span>Change Password</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push("/dashboard")}>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Account Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sign out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </nav>
    </>
  );
}
