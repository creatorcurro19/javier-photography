"use client";

import {
  createContext,
  createElement,
  useCallback,
  useContext,
  useEffect,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { usePathname } from "next/navigation";
import { localizeHref, type SiteLang } from "@/lib/i18n-helpers";

export type { SiteLang };

const LANG_KEY = "javier_site_lang";
const LANG_EVENT = "javier-lang-changed";

const LangContext = createContext<SiteLang | undefined>(undefined);

function getStoredLang(): SiteLang {
  if (typeof window === "undefined") return "es";
  try {
    if (
      window.location.pathname === "/en" ||
      window.location.pathname.startsWith("/en/")
    ) {
      return "en";
    }
    const params = new URLSearchParams(window.location.search);
    const urlLang = params.get("lang");
    if (urlLang === "en" || urlLang === "es") {
      window.localStorage.setItem(LANG_KEY, urlLang);
      return urlLang;
    }
    const val = window.localStorage.getItem(LANG_KEY);
    return val === "en" ? "en" : "es";
  } catch {
    return "es";
  }
}

function getServerLangFallback(): SiteLang {
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

export function LangProvider({
  lang,
  children,
}: {
  lang: SiteLang;
  children: ReactNode;
}) {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (document.documentElement.lang !== lang) {
      document.documentElement.lang = lang;
    }
    try {
      window.localStorage.setItem(LANG_KEY, lang);
    } catch {
      // Ignore storage errors
    }

    // Fallback for legacy ?lang=en links if reached via client navigation
    if (lang === "es") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("lang") === "en") {
        params.delete("lang");
        const query = params.toString();
        const target = localizeHref(
          `${pathname || "/"}${query ? `?${query}` : ""}${window.location.hash || ""}`,
          "en"
        );
        window.location.replace(target);
      }
    }
  }, [lang, pathname]);

  return createElement(LangContext.Provider, { value: lang }, children);
}

export function getServerLang(): SiteLang {
  return "es";
}

export function useLanguage() {
  const ctxLang = useContext(LangContext);
  const storedLang = useSyncExternalStore(
    subscribeLang,
    getStoredLang,
    getServerLangFallback
  );
  const lang: SiteLang = ctxLang ?? storedLang;

  const setLang = useCallback((nextLang: SiteLang) => {
    setSiteLang(nextLang);
    if (typeof window !== "undefined") {
      const target = localizeHref(
        `${window.location.pathname}${window.location.search}${window.location.hash}`,
        nextLang
      );
      if (target !== `${window.location.pathname}${window.location.search}${window.location.hash}`) {
        window.location.assign(target);
      }
    }
  }, []);

  const toggleLang = useCallback(() => {
    setLang(lang === "es" ? "en" : "es");
  }, [lang, setLang]);

  const t = useCallback(
    <T extends string>(es: T, en: string): string => (lang === "en" ? en : es),
    [lang]
  );

  const href = useCallback(
    (path: string): string => localizeHref(path, lang),
    [lang]
  );

  return { lang, setLang, toggleLang, t, href };
}
