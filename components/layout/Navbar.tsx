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

// Submenú curatorial de "Obra": unifica Colecciones, Series y Obras Seleccionadas
const obraSublinks = [
  {
    href: "/portfolio",
    es: "Colecciones Archivadas",
    en: "Archived Collections",
    descEs: "100 obras maestras en 5 disciplinas",
    descEn: "100 masterworks across 5 disciplines",
  },
  {
    href: "/projects",
    es: "Series Monográficas",
    en: "Monograph Series",
    descEs: "8 ensayos visuales en profundidad",
    descEn: "8 deep visual photographic essays",
  },
  {
    href: "/selected-work",
    es: "Obras Seleccionadas",
    en: "Selected Works",
    descEs: "Antología de 15 piezas fundamentales",
    descEn: "Curated anthology of 15 signature pieces",
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

  const isObraActive =
    pathname === "/portfolio" ||
    pathname.startsWith("/portfolio/") ||
    pathname === "/projects" ||
    pathname.startsWith("/projects/") ||
    pathname === "/selected-work";

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
          className="group flex shrink-0 items-center gap-2.5 sm:gap-3 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
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
            <span className="whitespace-nowrap text-[7.5px] tracking-[0.24em] text-[#C5A880]/85 uppercase transition group-hover:text-[#EBE7DF] sm:text-[8.5px] sm:tracking-[0.38em]">
              The Art of Seeing
            </span>
          </div>
        </Link>

        {/* Menú Principal Reducido: Obra, Copias, Encargos, Sobre mí, Contacto */}
        <nav
          aria-label="Navegación principal"
          className="hidden items-center gap-6 xl:gap-8 text-[11px] xl:text-[12px] uppercase tracking-[0.22em] xl:tracking-[0.26em] lg:flex shrink-0"
        >
          {/* 1. Obra (con submenú curatorial para Colecciones, Series y Seleccionadas) */}
          <div
            ref={obraMenuRef}
            className="relative"
            onMouseEnter={() => setObraMenuOpen(true)}
            onMouseLeave={() => setObraMenuOpen(false)}
          >
            <Link
              href="/portfolio"
              onClick={() => setObraMenuOpen(false)}
              className={`group inline-flex items-center gap-1.5 py-1 whitespace-nowrap transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white ${
                isObraActive
                  ? "text-[#EBE7DF] font-medium"
                  : "text-[#EBE7DF]/75 hover:text-white"
              }`}
            >
              <span>{t("Obra", "Works")}</span>
              <svg
                className={`h-3 w-3 text-[#C5A880] transition-transform duration-200 ${
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
              {isObraActive && (
                <span className="absolute bottom-0 left-0 right-0 h-px bg-[#C5A880]" />
              )}
            </Link>

            {/* Submenú desplegable de Obra */}
            {obraMenuOpen && (
              <div className="absolute left-0 top-full pt-2.5 z-50">
                <div className="w-64 rounded-xl border border-[#C5A880]/25 bg-[#0E1012]/96 p-2 shadow-2xl backdrop-blur-2xl ring-1 ring-black/50">
                  <div className="px-3 py-1.5 border-b border-white/[0.06] flex items-center gap-2">
                    <AndalusianStarMark className="h-2.5 w-2.5 text-[#C5A880]" />
                    <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-[#C5A880]">
                      {t("Archivo & Series", "Archive & Series")}
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
                          <span className="font-mono text-[9px] text-[#8E8A80] transition group-hover/item:text-[#C5A880]">
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

          {/* 2. Copias (Fine Art Prints) */}
          <Link
            href="/prints"
            className={`relative whitespace-nowrap py-1 transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white ${
              pathname === "/prints"
                ? "text-[#EBE7DF] font-medium"
                : "text-[#EBE7DF]/75 hover:text-white"
            }`}
          >
            {t("Copias", "Prints")}
            {pathname === "/prints" && (
              <span className="absolute bottom-0 left-0 right-0 h-px bg-[#C5A880]" />
            )}
          </Link>

          {/* 3. Encargos (Commissions & Projects) */}
          <Link
            href="/servicios"
            className={`relative whitespace-nowrap py-1 transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white ${
              pathname === "/servicios"
                ? "text-[#EBE7DF] font-medium"
                : "text-[#EBE7DF]/75 hover:text-white"
            }`}
          >
            {t("Encargos", "Commissions")}
            {pathname === "/servicios" && (
              <span className="absolute bottom-0 left-0 right-0 h-px bg-[#C5A880]" />
            )}
          </Link>

          {/* 4. Sobre mí (About) */}
          <Link
            href="/about"
            className={`relative whitespace-nowrap py-1 transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white ${
              pathname === "/about"
                ? "text-[#EBE7DF] font-medium"
                : "text-[#EBE7DF]/75 hover:text-white"
            }`}
          >
            {t("Sobre mí", "About")}
            {pathname === "/about" && (
              <span className="absolute bottom-0 left-0 right-0 h-px bg-[#C5A880]" />
            )}
          </Link>

          {/* 5. Contacto (Contact) */}
          <Link
            href="/contact"
            className={`relative whitespace-nowrap py-1 transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white ${
              pathname === "/contact"
                ? "text-[#EBE7DF] font-medium"
                : "text-[#EBE7DF]/75 hover:text-white"
            }`}
          >
            {t("Contacto", "Contact")}
            {pathname === "/contact" && (
              <span className="absolute bottom-0 left-0 right-0 h-px bg-[#C5A880]" />
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
