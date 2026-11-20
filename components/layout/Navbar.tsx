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

// 5 enlaces principales: menú simplificado, limpio y con máxima presencia museística
const primaryLinks = [
  { href: "/portfolio", es: "Galería", en: "Gallery" },
  { href: "/projects", es: "Series", en: "Series" },
  { href: "/prints", es: "Fine Art", en: "Fine Art" },
  { href: "/about", es: "El Autor", en: "About" },
  { href: "/contact", es: "Contacto", en: "Contact" },
];

// Enlaces secundarios organizados en un discreto desplegable de archivo
const secondaryLinks = [
  {
    href: "/selected-work",
    es: "Selected Works",
    en: "Selected Works",
    descEs: "15 obras maestras permanentes",
    descEn: "15 signature permanent works",
  },
  {
    href: "/stories",
    es: "Cuaderno de Campo",
    en: "Field Journal",
    descEs: "Diario visual & apuntes ópticos",
    descEn: "Visual diary & optical notes",
  },
  {
    href: "/servicios",
    es: "Encargos & Licencias",
    en: "Commissions",
    descEs: "Proyectos editoriales y comerciales",
    descEn: "Editorial & commercial assignments",
  },
  {
    href: "/cliente",
    es: "Portal Clientes",
    en: "Client Portal",
    descEs: "Galerías privadas de entrega",
    descEn: "Private client deliveries",
  },
  {
    href: "/dossier",
    es: "Dossier de Autor (PDF)",
    en: "Press Kit (PDF)",
    descEs: "Biografía, exposiciones y fichas",
    descEn: "Biography, exhibitions & sheets",
  },
];

export default function Navbar() {
  const pathname = usePathname();
  const { lang, t } = useLanguage();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Cerrar desplegable al hacer clic fuera o navegar
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const isSecondaryActive = secondaryLinks.some(
    (item) =>
      pathname === item.href ||
      (item.href !== "/" && pathname.startsWith(item.href))
  );

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

        {/* Navegación principal simplificada (5 enlaces esenciales + Más) */}
        <nav
          aria-label="Navegación principal"
          className="hidden items-center gap-6 xl:gap-8 text-[11px] xl:text-[12px] uppercase tracking-[0.22em] xl:tracking-[0.26em] lg:flex shrink-0"
        >
          {primaryLinks.map((link) => {
            const isActive =
              pathname === link.href ||
              (link.href !== "/" && pathname.startsWith(link.href));

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative whitespace-nowrap py-1 transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white ${
                  isActive
                    ? "text-[#EBE7DF] font-medium"
                    : "text-[#EBE7DF]/70 hover:text-white"
                }`}
              >
                {lang === "en" ? link.en : link.es}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-px bg-[#C5A880]" />
                )}
              </Link>
            );
          })}

          {/* Menú Desplegable "+ Más" para Archivo, Cuaderno y Servicios */}
          <div
            ref={dropdownRef}
            className="relative"
            onMouseEnter={() => setDropdownOpen(true)}
            onMouseLeave={() => setDropdownOpen(false)}
          >
            <button
              type="button"
              onClick={() => setDropdownOpen((prev) => !prev)}
              aria-expanded={dropdownOpen}
              aria-haspopup="true"
              className={`group inline-flex items-center gap-1.5 py-1 whitespace-nowrap transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white ${
                isSecondaryActive || dropdownOpen
                  ? "text-[#EBE7DF] font-medium"
                  : "text-[#EBE7DF]/70 hover:text-white"
              }`}
            >
              <span>{t("+ Más", "+ More")}</span>
              <svg
                className={`h-3 w-3 text-[#C5A880] transition-transform duration-200 ${
                  dropdownOpen ? "rotate-180" : ""
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
              {isSecondaryActive && (
                <span className="absolute bottom-0 left-0 right-0 h-px bg-[#C5A880]" />
              )}
            </button>

            {/* Panel flotante del desplegable */}
            {dropdownOpen && (
              <div className="absolute right-0 top-full pt-2.5 z-50">
                <div className="w-64 rounded-xl border border-[#C5A880]/25 bg-[#0E1012]/96 p-2 shadow-2xl backdrop-blur-2xl ring-1 ring-black/50">
                  <div className="px-3 py-1.5 border-b border-white/[0.06] flex items-center gap-2">
                    <AndalusianStarMark className="h-2.5 w-2.5 text-[#C5A880]" />
                    <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-[#C5A880]">
                      {t("Archivo & Proyectos", "Archive & Projects")}
                    </span>
                  </div>

                  <div className="mt-1 flex flex-col gap-1">
                    {secondaryLinks.map((item) => {
                      const active =
                        pathname === item.href ||
                        (item.href !== "/" && pathname.startsWith(item.href));

                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setDropdownOpen(false)}
                          className={`group/item flex flex-col rounded-lg px-3 py-2 text-left transition-colors ${
                            active
                              ? "bg-[#C5A880]/15 text-[#EBE7DF]"
                              : "text-[#EBE7DF]/80 hover:bg-white/[0.06] hover:text-white"
                          }`}
                        >
                          <span className="text-[11px] font-medium uppercase tracking-[0.16em] text-[#EBE7DF] group-hover/item:text-white">
                            {lang === "en" ? item.en : item.es}
                          </span>
                          <span className="font-mono text-[9px] text-[#8E8A80] transition group-hover/item:text-[#C5A880]">
                            {lang === "en" ? item.descEn : item.descEs}
                          </span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
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
