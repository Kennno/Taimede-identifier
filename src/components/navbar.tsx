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
import { LanguageSelector } from "./language-selector";
import { useLanguage } from "./language-context";
import { translations } from "@/lib/translations";

export default function Navbar() {
  const supabase = createClient();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<"sign-in" | "sign-up">(
    "sign-in",
  );
  const { language } = useLanguage();
  const t = translations[language];

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
                  const pricingSection = document.getElementById("pricing");
                  if (pricingSection) {
                    pricingSection.scrollIntoView({ behavior: "smooth" });
                  }
                }}
              >
                {t.pricing}
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
                {t.about_us}
              </a>
              <Link
                href="/roadmap"
                className="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors"
              >
                {t.roadmap}
              </Link>
              <Link
                href="/contact"
                className="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors"
              >
                {t.contact}
              </Link>
            </div>
          </div>
          <div className="flex gap-4 items-center">
            <LanguageSelector currentLanguage={language} />
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
                      {t.sign_in}
                    </Button>
                    <Button onClick={openSignUp}>{t.sign_up}</Button>
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
