"use client";

import { useState, useEffect } from "react";
import { Globe } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { useLanguage } from "./language-context";
import { Language } from "@/lib/translations";

interface LanguageSelectorProps {
  currentLanguage: string;
}

export function LanguageSelector({ currentLanguage }: LanguageSelectorProps) {
  const { language, setLanguage } = useLanguage();

  useEffect(() => {
    // If no language is set, try to detect from geolocation
    if (!currentLanguage) {
      detectUserCountry();
    }
  }, [currentLanguage]);

  const detectUserCountry = async () => {
    try {
      const response = await fetch("https://ipapi.co/json/");
      const data = await response.json();

      // Set language to Estonian if user is in Estonia
      if (data.country_code === "EE") {
        changeLanguage("et" as Language);
      } else {
        changeLanguage("en" as Language);
      }
    } catch (error) {
      console.error("Error detecting country:", error);
      // Default to English if detection fails
      changeLanguage("en" as Language);
    }
  };

  const changeLanguage = (lang: Language) => {
    setLanguage(lang);
    document.cookie = `language=${lang};path=/;max-age=31536000`; // 1 year
    localStorage.setItem("language", lang);
    window.location.reload();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-9 w-9 relative">
          {language === "en" ? (
            <span className="text-lg">🇺🇸</span>
          ) : (
            <span className="text-lg">🇪🇪</span>
          )}
          <span className="sr-only">Vali keel</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={() => changeLanguage("en" as Language)}
          className={language === "en" ? "bg-gray-100 font-medium" : ""}
        >
          <span className="mr-2">🇺🇸</span> English
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => changeLanguage("et" as Language)}
          className={language === "et" ? "bg-gray-100 font-medium" : ""}
        >
          <span className="mr-2">🇪🇪</span> Eesti
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
