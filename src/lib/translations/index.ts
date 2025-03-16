import { et } from "./et";
import { en } from "./en";

export type Language = "et" | "en";

export const translations = {
  et,
  en,
  // Add other languages here as needed
};

export function getTranslation(lang: Language, key: string): string {
  if (!translations[lang]) {
    return key; // Fallback to key if language not found
  }

  return translations[lang][key] || key; // Fallback to key if translation not found
}

export function t(lang: Language, key: string): string {
  return getTranslation(lang, key);
}
