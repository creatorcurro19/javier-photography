"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { useLanguage } from "@/lib/i18n";
import { SITE_CONFIG } from "@/data/site-config";
import { WORKS } from "@/data/works";
import { PHOTO_CATEGORIES } from "@/types/photo";

const primaryLinks = SITE_CONFIG.navigation.map((item) => {
  const notes: Record<string, { noteEs: string; noteEn: string }> = {
    "/portfolio": {
      noteEs: `${WORKS.length} fotos (${PHOTO_CATEGORIES.length} colecciones)`,
      noteEn: `${WORKS.length} photos (${PHOTO_CATEGORIES.length} collections)`,
    },
    "/prints": {
      noteEs: "Copias en papel de algodón",
      noteEn: "Hahnemühle cotton paper editions",
    },
    "/about": {
      noteEs: "Mirada, equipo y forma de trabajar",
      noteEn: "Approach, gear & way of working",
    },
    "/contact": {
      noteEs: "Tenerife · Disponibilidad",
      noteEn: "Tenerife · Availability",
    },
  };
  return {
    href: item.href,
    es: item.labelEs,
    en: item.labelEn,
    ...(notes[item.href] ?? { noteEs: "", noteEn: "" }),
  };
});

export default function MobileNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const [prevPathname, setPrevPathname] = useState(pathname);
  const { lang, t } = useLanguage();

  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    setOpen(false);
  }

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        aria-expanded={open}
        aria-controls="mobile-menu"
        aria-label={open ? (lang === "en" ? "Close menu" : "Cerrar menú") : (lang === "en" ? "Open navigation menu" : "Abrir menú de navegación")}
        onClick={() => setOpen((value) => !value)}
        className="flex min-h-[44px] min-w-[44px] items-center justify-center gap-2 border border-white/[0.12] bg-[#151618] px-3 py-2 sm:px-3.5 text-[11px] uppercase tracking-[0.26em] text-[#EBE7DF] transition hover:border-white/30 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#C5A880] font-mono"
      >
        {open ? (
          <svg className="h-4 w-4 sm:hidden" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="h-4 w-4 sm:hidden" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6} d="M4 8h16M4 16h16" />
          </svg>
        )}
        <span className="hidden sm:inline">{open ? (lang === "en" ? "Close" : "Cerrar") : (lang === "en" ? "Menu" : "Menú")}</span>
      </button>
      {open ? (
        <nav
          id="mobile-menu"
          aria-label={lang === "en" ? "Mobile navigation" : "Navegación móvil"}
          className="fixed inset-x-0 top-[71px] sm:top-[87px] bottom-0 z-50 flex flex-col justify-between border-b border-white/[0.08] bg-[#0B0C0E]/98 px-5 py-6 shadow-2xl backdrop-blur-2xl overflow-y-auto no-scrollbar sm:px-8 sm:py-8"
        >
          <div>
            {/* Acceso a Cesta */}
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                setTimeout(() => {
                  window.dispatchEvent(new Event("open-cart-drawer"));
                }, 120);
              }}
              className="mb-6 flex w-full items-center justify-between rounded-lg border border-[#C5A880]/30 bg-[#151618] px-4 py-3.5 text-left transition hover:border-[#C5A880]"
            >
              <div className="flex items-center gap-3">
                <svg className="h-4 w-4 text-[#C5A880]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                <span className="font-mono text-xs uppercase tracking-wider text-[#EBE7DF]">
                  {t("Ver Cesta de Compra", "View Shopping Bag")}
                </span>
              </div>
              <span className="font-mono text-xs text-[#C5A880]">
                →
              </span>
            </button>

            {/* 4 Enlaces Principales Claros */}
            <ul className="flex flex-col gap-2">
              {primaryLinks.map((link) => {
                const isActive =
                  pathname === link.href || pathname.startsWith(`${link.href}/`);

                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className={`group flex min-h-[54px] items-center justify-between rounded-lg border px-4 py-3 transition ${
                        isActive
                          ? "border-[#C5A880] bg-[#C5A880]/10 text-[#EBE7DF] font-medium"
                          : "border-white/[0.08] bg-[#151618]/60 text-[#EBE7DF] hover:border-white/25"
                      }`}
                    >
                      <span className="text-base uppercase tracking-[0.18em]">
                        {lang === "en" ? link.en : link.es}
                      </span>
                      <span className="font-mono text-[11px] text-[#A39E93] transition group-hover:text-[#EBE7DF]">
                        {lang === "en" ? link.noteEn : link.noteEs} →
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Bloque de Contacto Directo al Pie */}
          <div className="border-t border-white/[0.08] pt-6 text-xs text-[#8E8A80] space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-serif text-sm text-[#EBE7DF]">Javier Espinosa Martínez</p>
                <a
                  href={`mailto:${SITE_CONFIG.contactEmail}`}
                  className="mt-0.5 block font-mono text-[11px] text-[#8E8A80] hover:text-[#EBE7DF]"
                >
                  {SITE_CONFIG.contactEmail}
                </a>
              </div>
              <Link
                href="/contact"
                onClick={() => setOpen(false)}
                className="border border-[#C5A880] bg-[#C5A880] px-3.5 py-1.5 font-mono text-[10px] uppercase font-semibold tracking-wider text-[#0B0C0E]"
              >
                {t("Escribir →", "Contact →")}
              </Link>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-1 text-[11px] uppercase tracking-wider text-[#EBE7DF]">
              <a
                href={SITE_CONFIG.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white"
              >
                Instagram ↗
              </a>
              <span className="text-white/20">·</span>
              <a
                href={SITE_CONFIG.social.saatchi}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white"
              >
                Saatchi Art ↗
              </a>
              <span className="text-white/20">·</span>
              <a
                href={SITE_CONFIG.social.getty}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white"
              >
                Getty / iStock ↗
              </a>
            </div>
          </div>
        </nav>
      ) : null}
    </div>
  );
}
