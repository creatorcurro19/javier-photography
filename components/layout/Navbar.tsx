"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "@/components/ui/LocalizedLink";
import { usePathname } from "next/navigation";
import MobileNav from "@/components/layout/MobileNav";
import LanguageToggle from "@/components/layout/LanguageToggle";
import CartButton from "@/components/cart/CartButton";
import { SITE_CONFIG, SITE_SETTINGS } from "@/data/site-config";
import { useLanguage } from "@/lib/i18n";
import { normalizeRoutePath } from "@/lib/i18n-helpers";

export default function Navbar() {
  const pathname = normalizeRoutePath(usePathname() || "/");
  const { t } = useLanguage();
  const progressRef = useRef<HTMLDivElement | null>(null);
  const backdropRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let frame = 0;

    const updateScrollUi = () => {
      frame = 0;
      const doc = document.documentElement;
      const maxScroll = Math.max(0, doc.scrollHeight - window.innerHeight);
      const ratio = maxScroll > 0 ? Math.min(1, Math.max(0, window.scrollY / maxScroll)) : 0;
      if (progressRef.current) {
        progressRef.current.style.transform = `scaleX(${ratio.toFixed(4)})`;
      }
      if (backdropRef.current) {
        backdropRef.current.style.opacity = window.scrollY > 32 ? "0.96" : "0.86";
      }
    };

    const onScroll = () => {
      if (!frame) {
        frame = window.requestAnimationFrame(updateScrollUi);
      }
    };

    updateScrollUi();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [pathname]);

  return (
    <header className="fixed left-0 top-0 z-50 w-full transition-all duration-300 print:hidden">
      <div
        ref={backdropRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[#0B0C0E] opacity-[0.86] backdrop-blur-2xl transition-opacity duration-500"
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

        {/* Menú Principal Minimalista leído desde SITE_CONFIG.navigation */}
        <nav
          aria-label={t("Navegación principal", "Primary navigation")}
          className="hidden items-center gap-6 xl:gap-8 text-xs uppercase tracking-[0.2em] lg:flex shrink-0"
        >
          {[
            ...SITE_CONFIG.navigation,
            ...(SITE_SETTINGS.showCuaderno
              ? [{ href: "/cuaderno", labelEs: "Cuaderno", labelEn: "Journal" }]
              : []),
          ].map((item) => {
            const isActive =
              item.href === "/portfolio"
                ? pathname === "/portfolio" ||
                  pathname.startsWith("/portfolio/") ||
                  pathname === "/selected-work"
                : pathname === item.href || pathname.startsWith(`${item.href}/`);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative inline-flex min-h-[44px] items-center whitespace-nowrap py-2 transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#C5A880] ${
                  isActive
                    ? "text-[#EBE7DF] font-medium"
                    : "text-[#EBE7DF]/85 hover:text-white"
                }`}
              >
                <span>{t(item.labelEs, item.labelEn)}</span>
                {isActive && (
                  <span className="absolute bottom-1 left-0 right-0 h-px bg-[#C5A880]" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Acciones del encabezado */}
        <div className="flex shrink-0 items-center gap-2">
          <LanguageToggle />
          <CartButton />
          <MobileNav />
        </div>
      </div>

      <div className="relative border-b border-white/[0.08]">
        <div
          ref={progressRef}
          aria-hidden="true"
          style={{ transform: "scaleX(0)" }}
          className="pointer-events-none absolute bottom-0 left-0 h-[1.5px] w-full origin-left bg-gradient-to-r from-[#C5A880]/60 via-[#C5A880] to-[#E5CCA8]"
        />
      </div>
    </header>
  );
}
