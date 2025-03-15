import Link from "next/link";
import { createClient } from "../../supabase/server";
import { Button } from "./ui/button";
import { User, UserCircle } from "lucide-react";
import UserProfile from "./user-profile";
import Logo from "./logo";

export default async function Navbar() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Get usage count if user is logged in
  let usageCount = 0;
  let isPremium = false;

  if (user) {
    const { data: searches } = await supabase
      .from("recent_searches")
      .select("id")
      .eq("user_id", user.id);

    usageCount = searches?.length || 0;

    // Check subscription status
    const { data: subscription } = await supabase
      .from("subscriptions")
      .select("*")
      .eq("user_id", user.id)
      .eq("status", "active")
      .single();

    isPremium = !!subscription;
  }

  return (
    <nav className="w-full border-b border-gray-200 bg-white py-2">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link href="/" prefetch>
          <Logo />
        </Link>
        <div className="flex gap-4 items-center">
          {user ? (
            <>
              <Link
                href="/dashboard"
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
              >
                <Button className="bg-green-600 hover:bg-green-700">
                  Dashboard
                </Button>
              </Link>
              {!isPremium && (
                <div className="text-sm text-gray-600 mr-2">
                  <span className="font-medium">{usageCount}/20</span>{" "}
                  identifications
                </div>
              )}
              <UserProfile />
            </>
          ) : (
            <>
              <Link
                href="/sign-in"
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
              >
                Sign In
              </Link>
              <Link
                href="/sign-up"
                className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
