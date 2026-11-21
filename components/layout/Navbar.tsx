"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import MobileNav from "@/components/layout/MobileNav";
import SearchModal from "@/components/layout/SearchModal";
import LanguageToggle from "@/components/layout/LanguageToggle";
import CartButton from "@/components/cart/CartButton";
import BwToggle from "@/components/ui/BwToggle";
import {
  AndalusianMicroCenefa,
  AndalusianStarMark,
} from "@/components/ui/AndalusianMotif";
import { useLanguage } from "@/lib/i18n";
import { WORKS, SERIES } from "@/data/works";
import { SITE_SETTINGS } from "@/data/site-config";
import { PHOTO_CATEGORIES } from "@/types/photo";

// Submenú curatorial de "Obra": unifica Colecciones, Series y Obras Seleccionadas
const obraSublinks = [
  {
    href: "/portfolio",
    es: "Archivo por Disciplinas",
    en: "Archive by Discipline",
    descEs: `${WORKS.length} fotografías en ${PHOTO_CATEGORIES.length} ámbitos`,
    descEn: `${WORKS.length} photographs across ${PHOTO_CATEGORIES.length} fields`,
  },
  {
    href: "/projects",
    es: "Series y Proyectos",
    en: "Series & Projects",
    descEs: `${SERIES.length} reportajes y ensayos visuales`,
    descEn: `${SERIES.length} visual series and essays`,
  },
  {
    href: "/selected-work",
    es: "Obras Seleccionadas",
    en: "Selected Works",
    descEs: "Selección de 15 fotografías",
    descEn: "A selection of 15 photographs",
  },
];

export default function Navbar() {
  const pathname = usePathname();
  const { lang, t } = useLanguage();
  const [obraMenuOpen, setObraMenuOpen] = useState(false);
  const obraMenuRef = useRef<HTMLDivElement>(null);

  // Cerrar submenú al hacer clic fuera
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        obraMenuRef.current &&
        !obraMenuRef.current.contains(event.target as Node)
      ) {
        setObraMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className="fixed left-0 top-0 z-50 w-full transition-all duration-300 print:hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[#0B0C0E]/90 backdrop-blur-2xl"
      />
      <div className="relative mx-auto flex h-16 sm:h-20 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12">
        {/* Logotipo y Título de Autor */}
        <Link
          href="/"
          className="group flex min-h-[44px] shrink-0 items-center gap-2.5 sm:gap-3 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#C5A880]"
        >
          <Image
            src="/icon.svg"
            alt="Monograma JE"
            width={34}
            height={34}
            className="h-8 w-8 shrink-0 sm:h-9 sm:w-9 rounded-lg ring-1 ring-[#C5A880]/30 transition-transform duration-300 group-hover:scale-105"
          />
          <div className="flex shrink-0 flex-col">
            <span className="whitespace-nowrap font-sans font-medium text-xs tracking-[0.18em] text-[#EBE7DF] transition group-hover:text-white sm:text-sm sm:tracking-[0.26em]">
              JAVIER ESPINOSA
            </span>
            <span className="whitespace-nowrap text-[8px] tracking-[0.24em] text-[#C5A880] uppercase transition group-hover:text-[#EBE7DF] sm:text-[9px] sm:tracking-[0.38em]">
              The Art of Seeing
            </span>
          </div>
        </Link>

        {/* Menú Principal Unificado: Obra, Series, Copias, Encargos, Cuaderno, Sobre mí, Contacto */}
        <nav
          aria-label="Navegación principal"
          className="hidden items-center gap-4 xl:gap-6 text-[11px] xl:text-[12px] uppercase tracking-[0.18em] xl:tracking-[0.22em] lg:flex shrink-0"
        >
          {/* 1. Obra */}
          <div
            ref={obraMenuRef}
            className="relative flex items-center"
            onMouseEnter={() => setObraMenuOpen(true)}
            onMouseLeave={() => setObraMenuOpen(false)}
          >
            <Link
              href="/portfolio"
              onClick={() => setObraMenuOpen(false)}
              className={`group inline-flex min-h-[44px] items-center gap-1 py-2 whitespace-nowrap transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#C5A880] ${
                pathname === "/portfolio" || pathname.startsWith("/portfolio/") || pathname === "/selected-work"
                  ? "text-[#EBE7DF] font-medium"
                  : "text-[#EBE7DF]/85 hover:text-white"
              }`}
            >
              <span>{t("Obra", "Works")}</span>
              {(pathname === "/portfolio" || pathname.startsWith("/portfolio/") || pathname === "/selected-work") && (
                <span className="absolute bottom-1 left-0 right-0 h-px bg-[#C5A880]" />
              )}
            </Link>
            <button
              type="button"
              aria-expanded={obraMenuOpen}
              aria-label={t("Abrir submenú de Obra", "Toggle Works submenu")}
              onClick={() => setObraMenuOpen((v) => !v)}
              className="inline-flex min-h-[44px] min-w-[28px] items-center justify-center px-1 text-[#C5A880] hover:text-white"
            >
              <svg
                className={`h-3.5 w-3.5 transition-transform duration-200 ${
                  obraMenuOpen ? "rotate-180" : ""
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {/* Submenú desplegable de Obra */}
            {obraMenuOpen && (
              <div className="absolute left-0 top-full pt-2.5 z-50">
                <div className="w-64 rounded-xl border border-[#C5A880]/25 bg-[#0E1012]/96 p-2 shadow-2xl backdrop-blur-2xl ring-1 ring-black/50">
                  <div className="px-3 py-1.5 border-b border-white/[0.06] flex items-center gap-2">
                    <AndalusianStarMark className="h-2.5 w-2.5 text-[#C5A880]" />
                    <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-[#C5A880]">
                      {t("Archivo y Series", "Archive & Series")}
                    </span>
                  </div>

                  <div className="mt-1 flex flex-col gap-1">
                    {obraSublinks.map((sub) => {
                      const active =
                        pathname === sub.href ||
                        (sub.href !== "/" && pathname.startsWith(sub.href));

                      return (
                        <Link
                          key={sub.href}
                          href={sub.href}
                          onClick={() => setObraMenuOpen(false)}
                          className={`group/item flex flex-col rounded-lg px-3 py-2 text-left transition-colors ${
                            active
                              ? "bg-[#C5A880]/15 text-[#EBE7DF]"
                              : "text-[#EBE7DF]/80 hover:bg-white/[0.06] hover:text-white"
                          }`}
                        >
                          <span className="text-[11px] font-medium uppercase tracking-[0.16em] text-[#EBE7DF] group-hover/item:text-white">
                            {lang === "en" ? sub.en : sub.es}
                          </span>
                          <span className="font-mono text-[9px] text-[#A39E93] transition group-hover/item:text-[#C5A880]">
                            {lang === "en" ? sub.descEn : sub.descEs}
                          </span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 2. Series */}
          <Link
            href="/projects"
            className={`relative inline-flex min-h-[44px] items-center whitespace-nowrap py-2 transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#C5A880] ${
              pathname === "/projects" || pathname.startsWith("/projects/")
                ? "text-[#EBE7DF] font-medium"
                : "text-[#EBE7DF]/85 hover:text-white"
            }`}
          >
            {t("Series", "Series")}
            {(pathname === "/projects" || pathname.startsWith("/projects/")) && (
              <span className="absolute bottom-1 left-0 right-0 h-px bg-[#C5A880]" />
            )}
          </Link>

          {/* 3. Copias */}
          <Link
            href="/prints"
            className={`relative inline-flex min-h-[44px] items-center whitespace-nowrap py-2 transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#C5A880] ${
              pathname === "/prints"
                ? "text-[#EBE7DF] font-medium"
                : "text-[#EBE7DF]/85 hover:text-white"
            }`}
          >
            {t("Copias", "Prints")}
            {pathname === "/prints" && (
              <span className="absolute bottom-1 left-0 right-0 h-px bg-[#C5A880]" />
            )}
          </Link>

          {/* 4. Encargos */}
          <Link
            href="/servicios"
            className={`relative inline-flex min-h-[44px] items-center whitespace-nowrap py-2 transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#C5A880] ${
              pathname === "/servicios" || pathname.startsWith("/servicios/")
                ? "text-[#EBE7DF] font-medium"
                : "text-[#EBE7DF]/85 hover:text-white"
            }`}
          >
            {t("Encargos", "Commissions")}
            {(pathname === "/servicios" || pathname.startsWith("/servicios/")) && (
              <span className="absolute bottom-1 left-0 right-0 h-px bg-[#C5A880]" />
            )}
          </Link>

          {/* 5. Cuaderno (condicionado a SITE_SETTINGS.showCuaderno) */}
          {SITE_SETTINGS.showCuaderno && (
            <Link
              href="/cuaderno"
              className={`relative inline-flex min-h-[44px] items-center whitespace-nowrap py-2 transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#C5A880] ${
                pathname === "/cuaderno" || pathname.startsWith("/cuaderno/")
                  ? "text-[#EBE7DF] font-medium"
                  : "text-[#EBE7DF]/85 hover:text-white"
              }`}
            >
              {t("Cuaderno", "Journal")}
              {(pathname === "/cuaderno" || pathname.startsWith("/cuaderno/")) && (
                <span className="absolute bottom-1 left-0 right-0 h-px bg-[#C5A880]" />
              )}
            </Link>
          )}

          {/* 6. Sobre mí */}
          <Link
            href="/about"
            className={`relative inline-flex min-h-[44px] items-center whitespace-nowrap py-2 transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#C5A880] ${
              pathname === "/about"
                ? "text-[#EBE7DF] font-medium"
                : "text-[#EBE7DF]/85 hover:text-white"
            }`}
          >
            {t("Sobre mí", "About")}
            {pathname === "/about" && (
              <span className="absolute bottom-1 left-0 right-0 h-px bg-[#C5A880]" />
            )}
          </Link>

          {/* 7. Contacto */}
          <Link
            href="/contact"
            className={`relative inline-flex min-h-[44px] items-center whitespace-nowrap py-2 transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#C5A880] ${
              pathname === "/contact"
                ? "text-[#EBE7DF] font-medium"
                : "text-[#EBE7DF]/85 hover:text-white"
            }`}
          >
            {t("Contacto", "Contact")}
            {pathname === "/contact" && (
              <span className="absolute bottom-1 left-0 right-0 h-px bg-[#C5A880]" />
            )}
          </Link>
        </nav>

        {/* Acciones del encabezado: Idioma, B/N, Búsqueda, Cesta y Menú Móvil */}
        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2.5">
          <div className="hidden md:block">
            <LanguageToggle />
          </div>
          <div className="hidden sm:block">
            <BwToggle />
          </div>
          <SearchModal />
          <CartButton />
          <MobileNav />
        </div>
      </div>

      {/* Micro-cenefa arquitectónica andalusí bajo la cabecera */}
      <div className="relative">
        <AndalusianMicroCenefa className="text-[#C5A880]/30" />
      </div>
    </header>
  );
}
