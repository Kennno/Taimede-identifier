"use client";

import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { X } from "lucide-react";

export default function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);
  const [cookiePreferences, setCookiePreferences] = useState({
    essential: true,
    analytics: false,
    marketing: false,
  });
  const [showPreferences, setShowPreferences] = useState(false);

  useEffect(() => {
    // Check if user has already made a choice
    const consentGiven = localStorage.getItem("cookieConsent");
    if (!consentGiven) {
      // Show banner after a short delay
      const timer = setTimeout(() => setIsVisible(true), 1000);
      return () => clearTimeout(timer);
    } else {
      // Load saved preferences
      try {
        const savedPreferences = JSON.parse(
          localStorage.getItem("cookiePreferences") || "{}",
        );
        setCookiePreferences({
          ...cookiePreferences,
          ...savedPreferences,
        });
      } catch (e) {
        console.error("Error parsing cookie preferences", e);
      }
    }
  }, []);

  const handleAcceptAll = () => {
    const allAccepted = {
      essential: true,
      analytics: true,
      marketing: true,
    };
    setCookiePreferences(allAccepted);
    localStorage.setItem("cookieConsent", "true");
    localStorage.setItem("cookiePreferences", JSON.stringify(allAccepted));
    setIsVisible(false);

    // Apply cookie settings
    applyCookieSettings(allAccepted);
  };

  const handleAcceptEssential = () => {
    const essentialOnly = {
      essential: true,
      analytics: false,
      marketing: false,
    };
    setCookiePreferences(essentialOnly);
    localStorage.setItem("cookieConsent", "true");
    localStorage.setItem("cookiePreferences", JSON.stringify(essentialOnly));
    setIsVisible(false);

    // Apply cookie settings
    applyCookieSettings(essentialOnly);
  };

  const handleSavePreferences = () => {
    localStorage.setItem("cookieConsent", "true");
    localStorage.setItem(
      "cookiePreferences",
      JSON.stringify(cookiePreferences),
    );
    setIsVisible(false);
    setShowPreferences(false);

    // Apply cookie settings
    applyCookieSettings(cookiePreferences);
  };

  const handlePreferenceChange = (key: keyof typeof cookiePreferences) => {
    setCookiePreferences((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // Function to apply cookie settings
  const applyCookieSettings = (preferences: typeof cookiePreferences) => {
    // Essential cookies are always enabled

    // Analytics cookies (e.g., Google Analytics)
    if (preferences.analytics) {
      // Enable analytics cookies
      // This would typically involve initializing analytics services
      console.log("Analytics cookies enabled");
    } else {
      // Disable analytics cookies
      // This would typically involve removing or not initializing analytics services
      console.log("Analytics cookies disabled");
    }

    // Marketing cookies
    if (preferences.marketing) {
      // Enable marketing cookies
      console.log("Marketing cookies enabled");
    } else {
      // Disable marketing cookies
      console.log("Marketing cookies disabled");
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50 p-4 md:p-6">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold mb-2">Cookie Consent</h3>
            <p className="text-gray-600 text-sm md:text-base">
              We use cookies to enhance your browsing experience, serve
              personalized ads or content, and analyze our traffic. By clicking
              "Accept All", you consent to our use of cookies.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 mt-2 md:mt-0">
            {!showPreferences ? (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowPreferences(true)}
                >
                  Preferences
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleAcceptEssential}
                >
                  Essential Only
                </Button>
                <Button
                  size="sm"
                  className="bg-green-600 hover:bg-green-700"
                  onClick={handleAcceptAll}
                >
                  Accept All
                </Button>
              </>
            ) : (
              <Button
                size="sm"
                className="bg-green-600 hover:bg-green-700"
                onClick={handleSavePreferences}
              >
                Save Preferences
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2"
              onClick={() => setIsVisible(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {showPreferences && (
          <div className="mt-4 border-t pt-4">
            <h4 className="font-medium mb-2">Cookie Settings</h4>
            <div className="space-y-2">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="essential-cookies"
                  checked={cookiePreferences.essential}
                  disabled
                  className="mr-2"
                />
                <label htmlFor="essential-cookies" className="text-sm">
                  <span className="font-medium">Essential Cookies</span> -
                  Required for the website to function properly
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="analytics-cookies"
                  checked={cookiePreferences.analytics}
                  onChange={() => handlePreferenceChange("analytics")}
                  className="mr-2"
                />
                <label htmlFor="analytics-cookies" className="text-sm">
                  <span className="font-medium">Analytics Cookies</span> - Help
                  us improve our website by collecting anonymous usage
                  information
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="marketing-cookies"
                  checked={cookiePreferences.marketing}
                  onChange={() => handlePreferenceChange("marketing")}
                  className="mr-2"
                />
                <label htmlFor="marketing-cookies" className="text-sm">
                  <span className="font-medium">Marketing Cookies</span> - Used
                  to track visitors across websites to display relevant
                  advertisements
                </label>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
