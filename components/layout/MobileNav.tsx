"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

const links = [
  { href: "/portfolio", label: "Portfolio" },
  { href: "/servicios", label: "Encargos" },
  { href: "/prints", label: "Copias Fine Art" },
  { href: "/stories", label: "Historias" },
  { href: "/about", label: "Sobre el Autor" },
  { href: "/contact", label: "Contacto" },
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

  return (
    <div className="md:hidden">
      <button
        type="button"
        aria-expanded={open}
        aria-controls="mobile-menu"
        aria-label={open ? "Cerrar menú" : "Abrir menú de navegación"}
        onClick={() => setOpen((value) => !value)}
        className="flex items-center gap-2 border border-neutral-700 bg-neutral-900/60 px-3.5 py-1.5 text-[11px] uppercase tracking-[0.3em] text-neutral-300 transition hover:border-neutral-500 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
      >
        <span>{open ? "Cerrar" : "Menú"}</span>
      </button>
      {open ? (
        <nav
          id="mobile-menu"
          aria-label="Navegación móvil"
          className="fixed inset-x-0 top-20 bottom-0 z-50 flex flex-col justify-between border-b border-white/10 bg-neutral-950/98 px-8 py-10 shadow-2xl backdrop-blur-2xl overflow-y-auto"
        >
          <ul className="flex flex-col gap-6">
            {links.map((link) => {
              const isActive =
                pathname === link.href ||
                (link.href !== "/" && pathname.startsWith(link.href));

              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className={`block text-base uppercase tracking-[0.3em] transition ${
                      isActive
                        ? "text-neutral-100 font-medium pl-3 border-l-2 border-neutral-300"
                        : "text-neutral-400 hover:text-neutral-200"
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="border-t border-neutral-900 pt-8 text-xs text-neutral-500">
            <p className="font-serif text-neutral-300">Javier Espinosa Martínez</p>
            <p className="mt-1 font-mono text-[11px]">hello@javierespinosa.com</p>
          </div>
        </nav>
      ) : null}
    </div>
  );
}
