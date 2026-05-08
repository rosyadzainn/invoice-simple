"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { Language, Translations, translations } from "@/lib/i18n";

interface LanguageContextValue {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextValue>({
  language: "en",
  setLanguage: () => {},
  t: translations.en,
});

const STORAGE_KEY = "simple_lang";

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en");

  // Restore saved language on first render (client-only)
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY) as Language | null;
    if (saved && saved in translations) {
      setLanguageState(saved);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem(STORAGE_KEY, lang);
  };

  return (
    <LanguageContext.Provider
      value={{ language, setLanguage, t: translations[language] }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
