"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { Language } from "@/lib/translations";

type LanguageContextType = {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
};

const LanguageContext = createContext<LanguageContextType>({
  language: "et",
  setLanguage: () => {},
  t: (key) => key,
});

export const useLanguage = () => useContext(LanguageContext);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("et");
  const [translations, setTranslations] = useState<any>(null);

  useEffect(() => {
    // Always use Estonian
    setLanguage("et");

    // Dynamically import translations
    import("@/lib/translations").then((module) => {
      setTranslations(module.translations);
    });
  }, []);

  const handleSetLanguage = (lang: Language) => {
    // Always keep Estonian regardless of what's passed
    setLanguage("et");
  };

  const t = (key: string): string => {
    if (!translations || !translations[language]) {
      return key; // Fallback to key if translations not loaded yet
    }
    return translations[language][key] || key; // Fallback to key if translation not found
  };

  return (
    <LanguageContext.Provider
      value={{ language, setLanguage: handleSetLanguage, t }}
    >
      {children}
    </LanguageContext.Provider>
  );
}
