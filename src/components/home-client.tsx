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

    document.addEventListener("click", handleAnchorClick);
    document.addEventListener("click", handleCreateAccountClick);

    return () => {
      document.removeEventListener("click", handleAnchorClick);
      document.removeEventListener("click", handleCreateAccountClick);
    };
  }, []);

  return null;
}
