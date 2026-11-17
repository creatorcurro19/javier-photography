"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import MobileNav from "@/components/layout/MobileNav";
import SearchModal from "@/components/layout/SearchModal";
import CartButton from "@/components/cart/CartButton";
import BwToggle from "@/components/ui/BwToggle";
import { AndalusianMicroCenefa } from "@/components/ui/AndalusianMotif";

const links = [
  { href: "/selected-work", label: "Selected Works" },
  { href: "/portfolio", label: "Colecciones" },
  { href: "/projects", label: "Series" },
  { href: "/prints", label: "Fine Art" },
  { href: "/stories", label: "Cuaderno" },
  { href: "/servicios", label: "Encargos" },
  { href: "/about", label: "El Autor" },
  { href: "/contact", label: "Contacto" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className="fixed left-0 top-0 z-50 w-full transition-all duration-300">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[#0B0C0E]/88 backdrop-blur-2xl"
      />
      <div className="relative mx-auto flex h-16 sm:h-20 max-w-7xl items-center justify-between gap-2 px-4 sm:px-10 md:px-16 lg:px-20 xl:px-24">
        <Link
          href="/"
          className="group flex min-w-0 items-center gap-2.5 sm:gap-3 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
        >
          <Image
            src="/icon.svg"
            alt="Monograma JE"
            width={34}
            height={34}
            className="h-8 w-8 shrink-0 sm:h-9 sm:w-9 rounded-lg ring-1 ring-[#C5A880]/30 transition-transform duration-300 group-hover:scale-105"
          />
          <div className="flex min-w-0 flex-col">
            <span className="whitespace-nowrap font-sans font-medium text-xs tracking-[0.16em] text-[#EBE7DF] transition group-hover:text-white sm:text-base sm:tracking-[0.28em]">
              JAVIER ESPINOSA
            </span>
            <span className="whitespace-nowrap text-[7.5px] tracking-[0.24em] text-[#C5A880]/80 uppercase transition group-hover:text-[#EBE7DF] sm:text-[9px] sm:tracking-[0.42em]">
              The Art of Seeing
            </span>
          </div>
        </Link>

        <nav
          aria-label="Navegación principal"
          className="hidden items-center gap-7 text-[10px] xl:text-[11px] uppercase tracking-[0.24em] xl:tracking-[0.26em] lg:flex"
        >
          {links.map((link) => {
            const isActive =
              pathname === link.href ||
              (link.href !== "/" && pathname.startsWith(link.href));

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative py-1 transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white ${
                  isActive
                    ? "text-[#EBE7DF] font-medium"
                    : "text-[#EBE7DF]/65 hover:text-white"
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-px bg-[#C5A880]" />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="flex shrink-0 items-center gap-1.5 sm:gap-3">
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
