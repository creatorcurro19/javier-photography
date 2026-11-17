"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

const links = [
  { href: "/selected-work", label: "Selected Works", note: "15 obras maestras" },
  { href: "/portfolio", label: "Colecciones", note: "100 obras archivadas" },
  { href: "/projects", label: "Series", note: "8 ensayos monográficos" },
  { href: "/prints", label: "Copias Fine Art", note: "Hahnemühle Photo Rag 308g" },
  { href: "/stories", label: "Cuaderno", note: "Notas de campo & óptica" },
  { href: "/servicios", label: "Encargos", note: "Proyectos & licencias" },
  { href: "/about", label: "El Autor", note: "The Art of Seeing" },
  { href: "/contact", label: "Contacto", note: "Tenerife & Internacional" },
];

export default function MobileNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const [prevPathname, setPrevPathname] = useState(pathname);

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
        aria-label={open ? "Cerrar menú" : "Abrir menú de navegación"}
        onClick={() => setOpen((value) => !value)}
        className="flex items-center gap-2 border border-white/[0.1] bg-[#151618] px-3.5 py-1.5 text-[11px] uppercase tracking-[0.3em] text-[#EBE7DF] transition hover:border-white/30 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white font-mono"
      >
        <span>{open ? "Cerrar" : "Menú"}</span>
      </button>
      {open ? (
        <nav
          id="mobile-menu"
          aria-label="Navegación móvil"
          className="fixed inset-x-0 top-20 bottom-0 z-50 flex flex-col justify-between border-b border-white/[0.08] bg-[#0B0C0E]/98 px-6 py-6 shadow-2xl backdrop-blur-2xl overflow-y-auto no-scrollbar sm:px-8 sm:py-8"
        >
          <div>
            {/* Quick Mobile Search Trigger */}
            <button
              type="button"
              onClick={triggerSearch}
              className="mb-6 flex w-full items-center justify-between border border-white/[0.08] bg-[#151618] px-4 py-3 text-left transition hover:border-white/30"
            >
              <div className="flex items-center gap-3">
                <svg
                  className="h-4 w-4 text-[#8E8A80]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.6}
                    d="M21 21l-5.2-5.2m1.7-4.3a6 6 0 11-12 0 6 6 0 0112 0z"
                  />
                </svg>
                <span className="font-mono text-xs text-[#8E8A80]">
                  Buscar en el archivo (100 obras)...
                </span>
              </div>
              <span className="font-mono text-[9px] uppercase tracking-widest text-[#8E8A80] border border-white/[0.08] px-2 py-0.5">
                Índice
              </span>
            </button>

            {/* Navigation Links with Editorial Notes */}
            <ul className="flex flex-col gap-4">
              {links.map((link) => {
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
                          ? "text-[#EBE7DF] font-medium border-l-2 border-[#EBE7DF] pl-3"
                          : "text-[#8E8A80] hover:text-[#EBE7DF]"
                      }`}
                    >
                      <span className="text-base uppercase tracking-[0.22em]">
                        {link.label}
                      </span>
                      <span className="font-mono text-[10px] tracking-wider text-[#8E8A80]/70 transition group-hover:text-[#EBE7DF]">
                        {link.note}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Bottom Dossier & Contact Strip */}
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
                className="border border-[#EBE7DF] bg-[#EBE7DF] px-3.5 py-1.5 font-mono text-[10px] uppercase font-semibold tracking-wider text-[#0B0C0E]"
              >
                Escribir →
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
