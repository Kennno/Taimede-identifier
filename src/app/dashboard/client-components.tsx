"use client";

import { useEffect } from "react";

export function SubscriptionButtonHandler() {
  useEffect(() => {
    // Add event listener for the subscription buttons
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const button = target.closest(
        '[data-action="manage-subscription"], [data-action="view-pricing-plans"]',
      );

      if (button) {
        e.preventDefault();
        window.dispatchEvent(new CustomEvent("openCheckoutPopup"));
      }
    };

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  return null;
}
