"use client";

import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/lib/i18n";

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="relative overflow-hidden border-t border-white/[0.08] bg-[#0B0C0E] text-[#8E8A80] print:hidden">
      <div className="relative z-10 mx-auto max-w-7xl px-6 sm:px-10 md:px-16 lg:px-20 xl:px-24 py-12 lg:py-16">
        {/* Vista minimalista principal */}
        <div className="flex flex-col items-start justify-between gap-8 sm:flex-row sm:items-center">
          <Link
            href="/"
            className="group inline-flex items-center gap-3 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
          >
            <Image
              src="/icon.svg"
              alt="Monograma JE"
              width={36}
              height={36}
              className="h-9 w-9 rounded-lg ring-1 ring-[#C5A880]/35"
            />
            <div className="flex flex-col">
              <span className="font-sans font-medium text-sm tracking-[0.24em] text-[#EBE7DF]">
                JAVIER ESPINOSA
              </span>
              <span className="text-[10px] tracking-[0.2em] text-[#C5A880] uppercase">
                Tenerife · Fotografía
              </span>
            </div>
          </Link>

          <nav aria-label="Enlaces del pie" className="flex flex-wrap items-center gap-6 text-xs uppercase tracking-[0.2em] text-[#EBE7DF]">
            <Link href="/portfolio" className="hover:text-[#C5A880] transition">Fotos</Link>
            <Link href="/prints" className="hover:text-[#C5A880] transition">Comprar Láminas</Link>
            <Link href="/about" className="hover:text-[#C5A880] transition">Sobre mí</Link>
            <Link href="/contact" className="hover:text-[#C5A880] transition">Contacto</Link>
            <a
              href="https://www.instagram.com/Javier.espinosa19/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#C5A880] hover:text-white transition"
            >
              Instagram ↗
            </a>
          </nav>
        </div>

        {/* Barra Inferior */}
        <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-white/[0.08] pt-8 text-[11px] font-mono tracking-wider text-[#8E8A80]/75 sm:flex-row sm:items-center">
          <p>© {new Date().getFullYear()} Javier Espinosa Martínez. {t("Archivo fotográfico original protegido por derechos de autor.", "Original photographic archive protected by copyright.")}</p>
          <div className="flex flex-wrap items-center gap-x-3.5 gap-y-2">
            <a
              href="https://www.saatchiart.com/javier-espinosa-photography"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#EBE7DF] transition"
            >
              Saatchi Art ↗
            </a>
            <span aria-hidden="true">·</span>
            <a
              href="https://www.istockphoto.com/portfolio/JavierEspinosa?sort=purerecency&assettype=image"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#EBE7DF] transition"
            >
              Getty / iStock ↗
            </a>
            <span aria-hidden="true">·</span>
            <Link href="/legal" className="hover:text-[#EBE7DF] transition">{t("Aviso Legal y Privacidad", "Legal Notice & Privacy")}</Link>
            <span aria-hidden="true">·</span>
            <Link href="/condiciones" className="hover:text-[#EBE7DF] transition">{t("Condiciones de Compra y Licencia", "Terms & Conditions")}</Link>
            <span aria-hidden="true">·</span>
            <Link href="/admin" className="hover:text-[#C5A880] transition">{t("Acceso Autor", "Creator Access")}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
