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
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Logo from "./logo";

export default function DashboardNavbar() {
  const supabase = createClient();
  const router = useRouter();
  const [isPremium, setIsPremium] = useState(false);
  const [usageCount, setUsageCount] = useState(0);
  const [usageLimit, setUsageLimit] = useState(20);

  useEffect(() => {
    const checkSubscription = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      // Check subscription status
      const { data: subscription } = await supabase
        .from("subscriptions")
        .select("*")
        .eq("user_id", user.id)
        .eq("status", "active")
        .single();

      setIsPremium(!!subscription);

      // Get usage count
      const { data: searches } = await supabase
        .from("recent_searches")
        .select("id")
        .eq("user_id", user.id);

      setUsageCount(searches?.length || 0);
      setUsageLimit(isPremium ? Infinity : 20);
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
    <nav className="w-full border-b border-gray-200 bg-white py-4">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Link href="/" prefetch>
            <Logo />
          </Link>
        </div>
        <div className="flex gap-4 items-center">
          {!isPremium && (
            <div className="text-sm text-gray-600 mr-2">
              <span className="font-medium">{usageCount}/20</span>{" "}
              identifications
            </div>
          )}
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
                <Leaf className="mr-2 h-4 w-4" />
                <span>My Dashboard</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push("/dashboard")}>
                <History className="mr-2 h-4 w-4" />
                <span>Recent Searches</span>
              </DropdownMenuItem>
              {!isPremium && (
                <DropdownMenuItem onClick={() => router.push("/pricing")}>
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
  );
}
