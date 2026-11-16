"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

const links = [
  { href: "/portfolio", label: "Colecciones" },
  { href: "/projects", label: "Proyectos" },
  { href: "/servicios", label: "Encargos" },
  { href: "/prints", label: "Copias Fine Art" },
  { href: "/stories", label: "Cuaderno" },
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
    <div className="lg:hidden">
      <button
        type="button"
        aria-expanded={open}
        aria-controls="mobile-menu"
        aria-label={open ? "Cerrar menú" : "Abrir menú de navegación"}
        onClick={() => setOpen((value) => !value)}
        className="flex items-center gap-2 border border-[#1D2021] bg-[#1D2021]/60 px-3.5 py-1.5 text-[11px] uppercase tracking-[0.3em] text-[#D8D5CD] transition hover:border-[#95836B] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white font-mono"
      >
        <span>{open ? "Cerrar" : "Menú"}</span>
      </button>
      {open ? (
        <nav
          id="mobile-menu"
          aria-label="Navegación móvil"
          className="fixed inset-x-0 top-20 bottom-0 z-50 flex flex-col justify-between border-b border-[#1D2021] bg-[#101112]/98 px-8 py-10 shadow-2xl backdrop-blur-2xl overflow-y-auto"
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
                    className={`block text-base uppercase tracking-[0.25em] transition ${
                      isActive
                        ? "text-[#D8D5CD] font-medium pl-3 border-l-2 border-[#95836B]"
                        : "text-neutral-400 hover:text-[#D8D5CD]"
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="border-t border-[#1D2021] pt-8 text-xs text-neutral-500">
            <p className="font-serif text-[#D8D5CD]">Javier Espinosa Martínez</p>
            <p className="mt-1 font-mono text-[11px] text-[#95836B]">hello@javierespinosa.com</p>
          </div>
        </nav>
      ) : null}
    </div>
  );
}
