"use client";

import { useEffect } from "react";

export function AccountClient() {
  // Setup event handlers for subscription buttons
  useEffect(() => {
    const setupEventHandlers = () => {
      // Handle subscription management buttons
      const manageSubBtn = document.querySelector(
        "[data-action='manage-subscription']",
      );
      const viewPricingBtn = document.querySelector(
        "[data-action='view-pricing-plans']",
      );

      if (manageSubBtn) {
        manageSubBtn.addEventListener("click", (e) => {
          e.preventDefault();
          // Dispatch custom event to open checkout popup
          window.dispatchEvent(new CustomEvent("openCheckoutPopup"));
        });
      }

      if (viewPricingBtn) {
        viewPricingBtn.addEventListener("click", (e) => {
          e.preventDefault();
          // Dispatch custom event to open checkout popup
          window.dispatchEvent(new CustomEvent("openCheckoutPopup"));
        });
      }
    };

    // Run once after component mounts
    setupEventHandlers();
  }, []);

  return null;
}
