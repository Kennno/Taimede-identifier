"use client";

import Link from "next/link";
import { createClient } from "../../supabase/client";
import { useEffect, useState } from "react";
import UserProfile from "./user-profile";
import Logo from "./logo";
import { Button } from "./ui/button";
import { AuthModal } from "./auth-modal";
import AuthButton from "./auth-button";
import ThemeToggle from "./theme-toggle";
import { useLanguage } from "./language-context";

export default function Navbar({
  user: propUser,
  isPremium,
}: {
  user?: any;
  isPremium?: boolean;
}) {
  const supabase = createClient();
  const [user, setUser] = useState<any>(propUser || null);
  const [loading, setLoading] = useState(!propUser);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<"sign-in" | "sign-up">(
    "sign-in",
  );
  const { t } = useLanguage();
  // Always use Estonian translations
  const translations = {
    prices: "Hinnad",
    about_us: "Meist",
    roadmap: "Tegevuskava",
    contact: "Kontakt",
    sign_in: "Logi sisse",
    register: "Registreeru",
  };

  useEffect(() => {
    const getUser = async () => {
      if (!propUser) {
        const {
          data: { user: currentUser },
        } = await supabase.auth.getUser();
        setUser(currentUser);
        setLoading(false);
      }
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
  }, [propUser]);

  // Update user state when propUser changes
  useEffect(() => {
    if (propUser) {
      setUser(propUser);
      setLoading(false);
    }
  }, [propUser]);

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
      <nav className="w-full border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 py-4 sticky top-0 z-50 backdrop-blur-sm bg-white/90 dark:bg-gray-900/90">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link href="/" prefetch>
              <Logo />
            </Link>
            <div className="hidden md:flex space-x-6 ml-10">
              <a
                href="/#pricing"
                className="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors"
                onClick={(e) => {
                  e.preventDefault();
                  if (window.location.pathname !== "/") {
                    window.location.href = "/#pricing";
                  } else {
                    const pricingSection = document.getElementById("pricing");
                    if (pricingSection) {
                      pricingSection.scrollIntoView({ behavior: "smooth" });
                    }
                  }
                }}
              >
                {translations.prices}
              </a>
              <a
                href="/#about"
                className="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors"
                onClick={(e) => {
                  e.preventDefault();
                  const aboutSection = document.getElementById("about");
                  if (aboutSection) {
                    aboutSection.scrollIntoView({ behavior: "smooth" });
                  }
                }}
              >
                {translations.about_us}
              </a>
              <Link
                href="/tegevuskava"
                className="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors"
              >
                {translations.roadmap}
              </Link>
              <Link
                href="/kontakt"
                className="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors"
              >
                {translations.contact}
              </Link>
            </div>
          </div>
          <div className="flex gap-4 items-center">
            <ThemeToggle />
            {!loading && (
              <>
                {user ? (
                  <div className="flex items-center gap-3 border border-gray-200 rounded-full py-1 px-2 pr-3 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800 transition-colors cursor-pointer">
                    <UserProfile />
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={openSignIn}>
                      {translations.sign_in}
                    </Button>
                    <Button onClick={openSignUp}>
                      {translations.register}
                    </Button>
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
