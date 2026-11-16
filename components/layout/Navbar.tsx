"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import MobileNav from "@/components/layout/MobileNav";
import SearchModal from "@/components/layout/SearchModal";

const links = [
  { href: "/portfolio", label: "Colecciones" },
  { href: "/projects", label: "Proyectos" },
  { href: "/servicios", label: "Encargos" },
  { href: "/prints", label: "Fine Art" },
  { href: "/stories", label: "Cuaderno" },
  { href: "/about", label: "Sobre mí" },
  { href: "/contact", label: "Contacto" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className="fixed left-0 top-0 z-50 w-full border-b border-[#1D2021] transition-colors">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[#101112]/90 backdrop-blur-md"
      />
      <div className="relative mx-auto flex h-20 max-w-7xl items-center justify-between px-6 sm:px-10 md:px-16 lg:px-20 xl:px-24">
        <Link
          href="/"
          className="group flex flex-col focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
        >
          <span className="font-serif text-base tracking-[0.25em] text-[#D8D5CD] transition group-hover:text-white sm:text-lg">
            JAVIER ESPINOSA
          </span>
          <span className="text-[9px] tracking-[0.4em] text-[#95836B] uppercase transition group-hover:text-[#D8D5CD]">
            Fotografía de autor
          </span>
        </Link>

        <nav
          aria-label="Navegación principal"
          className="hidden items-center gap-7 text-[11px] uppercase tracking-[0.25em] lg:flex"
        >
          {links.map((link) => {
            const isActive =
              pathname === link.href ||
              (link.href !== "/" && pathname.startsWith(link.href));

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative py-1 transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white ${
                  isActive
                    ? "text-[#D8D5CD] font-medium"
                    : "text-[#D8D5CD]/70 hover:text-[#D8D5CD]"
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-px bg-[#95836B]" />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <SearchModal />
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
