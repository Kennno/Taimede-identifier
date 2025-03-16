"use client";

import Link from "next/link";
import { createClient } from "../../supabase/client";
import { useEffect, useState } from "react";
import UserProfile from "./user-profile";
import Logo from "./logo";
import { Button } from "./ui/button";
import { AuthModal } from "./auth-modal";
import AuthButton from "./auth-button";

export default function Navbar() {
  const supabase = createClient();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<"sign-in" | "sign-up">(
    "sign-in",
  );

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user: currentUser },
      } = await supabase.auth.getUser();
      setUser(currentUser);
      setLoading(false);
    };

    getUser();

    // Listen for custom event to open auth modal
    const handleOpenAuthModal = (e: any) => {
      if (e.detail?.tab) {
        setAuthModalTab(e.detail.tab);
      }
      setAuthModalOpen(true);
    };
    window.addEventListener("openAuthModal", handleOpenAuthModal);

    return () => {
      window.removeEventListener("openAuthModal", handleOpenAuthModal);
    };
  }, []);

  const openSignIn = () => {
    setAuthModalTab("sign-in");
    setAuthModalOpen(true);
  };

  const openSignUp = () => {
    setAuthModalTab("sign-up");
    setAuthModalOpen(true);
  };

  return (
    <>
      <AuthModal
        open={authModalOpen}
        onOpenChange={setAuthModalOpen}
        defaultTab={authModalTab}
      />
      <nav className="w-full border-b border-gray-200 bg-white py-4">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link href="/" prefetch>
              <Logo />
            </Link>
            <div className="hidden md:flex space-x-6 ml-10">
              <a
                href="/#pricing"
                className="text-gray-600 hover:text-green-600 transition-colors"
              >
                Pricing
              </a>
              <Link
                href="/about"
                className="text-gray-600 hover:text-green-600 transition-colors"
              >
                About Us
              </Link>
              <Link
                href="/resources/encyclopedia"
                className="text-gray-600 hover:text-green-600 transition-colors"
              >
                Encyclopedia
              </Link>
              <Link
                href="/resources/care-guides"
                className="text-gray-600 hover:text-green-600 transition-colors"
              >
                Blog
              </Link>
            </div>
          </div>
          <div className="flex gap-4 items-center">
            {!loading && (
              <>
                {user ? (
                  <div className="flex items-center gap-3 border border-gray-200 rounded-full py-1 px-2 pr-3 hover:bg-gray-50 transition-colors">
                    <UserProfile />
                    <span className="text-sm font-medium hidden sm:inline-block">
                      My Account
                    </span>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={openSignIn}>
                      Sign in
                    </Button>
                    <Button onClick={openSignUp}>Sign up</Button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </nav>
    </>
  );
}
