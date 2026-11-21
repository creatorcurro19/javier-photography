"use client";

import { useSyncExternalStore } from "react";

export type SiteLang = "es" | "en";

const LANG_KEY = "javier_site_lang";
const LANG_EVENT = "javier-lang-changed";

function getStoredLang(): SiteLang {
  if (typeof window === "undefined") return "es";
  try {
    const params = new URLSearchParams(window.location.search);
    const urlLang = params.get("lang");
    if (urlLang === "en" || urlLang === "es") {
      window.localStorage.setItem(LANG_KEY, urlLang);
      if (document.documentElement.lang !== urlLang) {
        document.documentElement.lang = urlLang;
      }
      return urlLang;
    }
    const val = window.localStorage.getItem(LANG_KEY);
    const resolved: SiteLang = val === "en" ? "en" : "es";
    if (document.documentElement.lang !== resolved) {
      document.documentElement.lang = resolved;
    }
    return resolved;
  } catch {
    return "es";
  }
}

function getServerLang(): SiteLang {
  return "es";
}

function subscribeLang(callback: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  window.addEventListener(LANG_EVENT, callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(LANG_EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}

export function setSiteLang(lang: SiteLang): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(LANG_KEY, lang);
    document.documentElement.lang = lang;
    window.dispatchEvent(new Event(LANG_EVENT));
  } catch {
    // Ignore storage errors
  }
}

export function useLanguage() {
  const lang = useSyncExternalStore(subscribeLang, getStoredLang, getServerLang);

  const toggleLang = () => {
    setSiteLang(lang === "es" ? "en" : "es");
  };

  const t = <T extends string>(es: T, en: string): string =>
    lang === "en" ? en : es;

  return { lang, setLang: setSiteLang, toggleLang, t };
}
