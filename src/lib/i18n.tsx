"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Language } from "./types";
import enMessages from "../../messages/en.json";
import hiMessages from "../../messages/hi.json";
import paMessages from "../../messages/pa.json";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  isLargeText: boolean;
  toggleLargeText: () => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

const messagesMap: Record<Language, any> = {
  en: enMessages,
  hi: hiMessages,
  pa: paMessages,
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("pa"); // Default to Punjabi for Punjab villagers
  const [isLargeText, setIsLargeText] = useState<boolean>(false);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
    // Load persisted preferences
    const savedLang = localStorage.getItem("organigen_lang") as Language;
    if (savedLang && ["en", "hi", "pa"].includes(savedLang)) {
      setLanguageState(savedLang);
    }

    const savedLargeText = localStorage.getItem("organigen_largetext");
    if (savedLargeText === "true") {
      setIsLargeText(true);
      document.documentElement.classList.add("text-large");
    }

    const savedDark = localStorage.getItem("organigen_dark");
    if (savedDark === "true") {
      setIsDarkMode(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    if (typeof window !== "undefined") {
      localStorage.setItem("organigen_lang", lang);
      document.documentElement.lang = lang;
    }
  };

  const toggleLargeText = () => {
    setIsLargeText((prev) => {
      const next = !prev;
      if (typeof window !== "undefined") {
        localStorage.setItem("organigen_largetext", String(next));
        if (next) {
          document.documentElement.classList.add("text-large");
        } else {
          document.documentElement.classList.remove("text-large");
        }
      }
      return next;
    });
  };

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => {
      const next = !prev;
      if (typeof window !== "undefined") {
        localStorage.setItem("organigen_dark", String(next));
        if (next) {
          document.documentElement.classList.add("dark");
        } else {
          document.documentElement.classList.remove("dark");
        }
      }
      return next;
    });
  };

  const t = (key: string): string => {
    const keys = key.split(".");
    let current: any = messagesMap[language] || messagesMap.en;
    for (const k of keys) {
      if (current && typeof current === "object" && k in current) {
        current = current[k];
      } else {
        // Fallback to English
        let fallbackCurrent: any = messagesMap.en;
        for (const fbKey of keys) {
          if (fallbackCurrent && typeof fallbackCurrent === "object" && fbKey in fallbackCurrent) {
            fallbackCurrent = fallbackCurrent[fbKey];
          } else {
            return key;
          }
        }
        return typeof fallbackCurrent === "string" ? fallbackCurrent : key;
      }
    }
    return typeof current === "string" ? current : key;
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t,
        isLargeText,
        toggleLargeText,
        isDarkMode,
        toggleDarkMode,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useI18n must be used within a LanguageProvider");
  }
  return context;
}
