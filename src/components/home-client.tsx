"use client";

import { useEffect } from "react";

export function HomeClientHandler() {
  useEffect(() => {
    // Add smooth scrolling for anchor links
    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest('a[href*="#"]');

      if (anchor && anchor.getAttribute("href")?.startsWith("#")) {
        e.preventDefault();
        const id = anchor.getAttribute("href")?.substring(1);
        const element = document.getElementById(id || "");

        if (element) {
          window.scrollTo({
            top: element.offsetTop,
            behavior: "smooth",
          });
        }
      }
    };

    // Add event listener for the create account button
    const handleCreateAccountClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const button = target.closest('[data-action="create-account"]');

      if (button) {
        e.preventDefault();
        window.dispatchEvent(
          new CustomEvent("openAuthModal", { detail: { tab: "sign-up" } }),
        );
      }
    };

    // Check if URL has hash and scroll to that section
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash) {
        const id = hash.substring(1);
        const element = document.getElementById(id);
        if (element) {
          setTimeout(() => {
            window.scrollTo({
              top: element.offsetTop,
              behavior: "smooth",
            });
          }, 100);
        }
      }
    };

    // Initial check for hash in URL
    handleHashChange();

    document.addEventListener("click", handleAnchorClick);
    document.addEventListener("click", handleCreateAccountClick);
    window.addEventListener("hashchange", handleHashChange);

    return () => {
      document.removeEventListener("click", handleAnchorClick);
      document.removeEventListener("click", handleCreateAccountClick);
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, []);

  return null;
}
