"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import MobileNav from "@/components/layout/MobileNav";

const links = [
  { href: "/portfolio", label: "Portfolio" },
  { href: "/servicios", label: "Encargos" },
  { href: "/prints", label: "Fine Art" },
  { href: "/stories", label: "Historias" },
  { href: "/about", label: "Sobre mí" },
  { href: "/contact", label: "Contacto" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className="fixed left-0 top-0 z-50 w-full border-b border-white/10 bg-neutral-950/85 backdrop-blur-md transition-colors">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 sm:px-10 md:px-16 lg:px-20 xl:px-24">
        <Link
          href="/"
          className="group flex flex-col focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
        >
          <span className="font-serif text-base tracking-[0.25em] text-neutral-100 transition group-hover:text-white sm:text-lg">
            JAVIER ESPINOSA
          </span>
          <span className="text-[9px] tracking-[0.4em] text-neutral-400 uppercase transition group-hover:text-neutral-300">
            Fotografía de autor
          </span>
        </Link>

        <nav
          aria-label="Navegación principal"
          className="hidden items-center gap-8 text-[11px] uppercase tracking-[0.3em] md:flex"
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
                    ? "text-neutral-100 font-medium"
                    : "text-neutral-400 hover:text-neutral-200"
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-px bg-neutral-300" />
                )}
              </Link>
            );
          })}
        </nav>

        <MobileNav />
      </div>
    </header>
  );
}
