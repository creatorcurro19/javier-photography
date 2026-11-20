"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import BwToggle from "@/components/ui/BwToggle";
import LanguageToggle from "@/components/layout/LanguageToggle";
import { useLanguage } from "@/lib/i18n";

// 5 enlaces principales unificados
const primaryLinks = [
  {
    href: "/portfolio",
    es: "Obra",
    en: "Works",
    noteEs: "Colecciones, series y antología",
    noteEn: "Collections, series & anthology",
  },
  {
    href: "/prints",
    es: "Copias",
    en: "Prints",
    noteEs: "Ediciones en papel de algodón",
    noteEn: "Hahnemühle cotton paper editions",
  },
  {
    href: "/servicios",
    es: "Encargos",
    en: "Commissions",
    noteEs: "Proyectos y presupuestos",
    noteEn: "Projects & assignments",
  },
  {
    href: "/about",
    es: "Sobre mí",
    en: "About",
    noteEs: "Trayectoria y método de autor",
    noteEn: "Biography & optical method",
  },
  {
    href: "/contact",
    es: "Contacto",
    en: "Contact",
    noteEs: "Tenerife & Internacional",
    noteEn: "Tenerife & Worldwide",
  },
];

// Enlaces secundarios de archivo y servicios editoriales
const secondaryLinks = [
  { href: "/selected-work", es: "Obras Seleccionadas", en: "Selected Works" },
  { href: "/projects", es: "Series Monográficas", en: "Monograph Series" },
  { href: "/stories", es: "Cuaderno de Campo", en: "Field Journal" },
  { href: "/licensing", es: "Licencias Editoriales", en: "Licensing" },
  { href: "/cliente", es: "Acceso Clientes", en: "Client Portal" },
  { href: "/dossier", es: "Dossier de Autor (PDF)", en: "Press Kit (PDF)" },
];

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

  const triggerSearch = () => {
    setOpen(false);
    setTimeout(() => {
      window.dispatchEvent(new Event("open-visual-search"));
    }, 120);
  };

  return (
    <div className="lg:hidden">
      <button
        type="button"
        aria-expanded={open}
        aria-controls="mobile-menu"
        aria-label={open ? (lang === "en" ? "Close menu" : "Cerrar menú") : (lang === "en" ? "Open navigation menu" : "Abrir menú de navegación")}
        onClick={() => setOpen((value) => !value)}
        className="flex items-center justify-center gap-2 border border-white/[0.1] bg-[#151618] px-2.5 py-1.5 sm:px-3.5 text-[11px] uppercase tracking-[0.26em] text-[#EBE7DF] transition hover:border-white/30 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white font-mono"
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
            {/* Idioma y Modo Monocromo en móvil */}
            <div className="mb-3 flex items-center justify-between gap-3 border border-white/[0.08] bg-[#151618] px-4 py-2.5">
              <span className="font-mono text-xs text-[#8E8A80]">
                {t("Idioma & Visión", "Language & View")}
              </span>
              <div className="flex items-center gap-2">
                <LanguageToggle />
                <div className="sm:hidden">
                  <BwToggle />
                </div>
              </div>
            </div>

            {/* Acceso a Cesta */}
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                setTimeout(() => {
                  window.dispatchEvent(new Event("open-cart-drawer"));
                }, 120);
              }}
              className="mb-3 flex w-full items-center justify-between border border-white/[0.08] bg-[#151618] px-4 py-2.5 text-left transition hover:border-white/30"
            >
              <div className="flex items-center gap-3">
                <svg className="h-4 w-4 text-[#EBE7DF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                <span className="font-mono text-xs text-[#EBE7DF]">
                  {t("Cesta de Compra", "Collector's Bag")}
                </span>
              </div>
              <span className="font-mono text-[9px] uppercase tracking-widest text-[#C5A880] border border-[#C5A880]/30 px-2 py-0.5">
                {t("Copias", "Prints")}
              </span>
            </button>

            {/* Búsqueda Rápida */}
            <button
              type="button"
              onClick={triggerSearch}
              className="mb-6 flex w-full items-center justify-between border border-white/[0.08] bg-[#151618] px-4 py-3 text-left transition hover:border-white/30"
            >
              <div className="flex items-center gap-3">
                <svg
                  className="h-4 w-4 text-[#8E8A80]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.6}
                    d="M21 21l-5.2-5.2m1.7-4.3a6 6 0 11-12 0 6 6 0 0112 0z"
                  />
                </svg>
                <span className="font-mono text-xs text-[#8E8A80]">
                  {t("Buscar fotografías o colecciones...", "Search photographs or collections...")}
                </span>
              </div>
              <span className="font-mono text-[10px] text-[#8E8A80]">
                →
              </span>
            </button>

            {/* 5 Enlaces Principales */}
            <ul className="flex flex-col gap-4">
              {primaryLinks.map((link) => {
                const isActive =
                  pathname === link.href ||
                  (link.href !== "/" && pathname.startsWith(link.href));

                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className={`group flex items-baseline justify-between py-1 transition ${
                        isActive
                          ? "text-[#EBE7DF] font-medium border-l-2 border-[#C5A880] pl-3"
                          : "text-[#8E8A80] hover:text-[#EBE7DF]"
                      }`}
                    >
                      <span className="text-base uppercase tracking-[0.22em]">
                        {lang === "en" ? link.en : link.es}
                      </span>
                      <span className="font-mono text-[10px] tracking-wider text-[#8E8A80]/70 transition group-hover:text-[#EBE7DF]">
                        {lang === "en" ? link.noteEn : link.noteEs}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>

            {/* Enlaces Secundarios de Archivo y Servicios */}
            <div className="mt-6 pt-5 border-t border-white/[0.08]">
              <p className="font-mono text-[9px] uppercase tracking-[0.25em] text-[#C5A880] mb-3">
                {t("Archivo & Recursos", "Archive & Resources")}
              </p>
              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                {secondaryLinks.map((sub) => (
                  <Link
                    key={sub.href}
                    href={sub.href}
                    onClick={() => setOpen(false)}
                    className="rounded border border-white/[0.06] bg-[#151719] px-2.5 py-2 text-[10px] uppercase tracking-wider text-[#8E8A80] hover:text-[#EBE7DF] hover:border-white/20 transition"
                  >
                    {lang === "en" ? sub.en : sub.es}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Bloque de Contacto Directo al Pie */}
          <div className="border-t border-white/[0.08] pt-6 text-xs text-[#8E8A80] space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-serif text-sm text-[#EBE7DF]">Javier Espinosa Martínez</p>
                <a
                  href="mailto:javierespinosa1995@hotmail.com"
                  className="mt-0.5 block font-mono text-[11px] text-[#8E8A80] hover:text-[#EBE7DF]"
                >
                  javierespinosa1995@hotmail.com
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
                href="https://www.instagram.com/Javier.espinosa19/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white"
              >
                Instagram ↗
              </a>
              <span className="text-white/20">·</span>
              <a
                href="https://www.saatchiart.com/javier-espinosa-photography"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white"
              >
                Saatchi Art ↗
              </a>
              <span className="text-white/20">·</span>
              <a
                href="https://www.istockphoto.com/portfolio/JavierEspinosa?sort=purerecency&assettype=image"
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
