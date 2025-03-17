"use client";

import { useEffect } from "react";
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
  const { language, setLanguage, t } = useLanguage();

  useEffect(() => {
    // If no language is set, default to Estonian
    if (!currentLanguage) {
      changeLanguage("et" as Language);
    }
  }, [currentLanguage]);

  const changeLanguage = (lang: Language) => {
    if (lang === language) return; // Don't reload if language is the same

    setLanguage(lang);
    // No need to reload the page - the context will update all components
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
          <span className="sr-only">{t("select_language")}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={() => changeLanguage("en" as Language)}
          className={
            language === "en" ? "bg-gray-100 dark:bg-gray-800 font-medium" : ""
          }
        >
          <span className="mr-2">🇺🇸</span> English
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => changeLanguage("et" as Language)}
          className={
            language === "et" ? "bg-gray-100 dark:bg-gray-800 font-medium" : ""
          }
        >
          <span className="mr-2">🇪🇪</span> Eesti
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
