"use client";

import Link from "next/link";
import Container from "@/components/ui/Container";
import { WORKS, SERIES } from "@/data/works";
import { useLanguage } from "@/lib/i18n";

export default function NotFoundContent() {
  const { t } = useLanguage();

  const quickLinks = [
    {
      href: "/portfolio",
      label: t(`Archivo (${WORKS.length} Obras)`, `Archive (${WORKS.length} Works)`),
    },
    {
      href: "/projects",
      label: t(`${SERIES.length} Series Monográficas`, `${SERIES.length} Monographic Series`),
    },
    {
      href: "/prints",
      label: t("Copias Fine Art en Tubo", "Fine Art Prints in Tube"),
    },
    {
      href: "/servicios",
      label: t("Encargos Fotográficos", "Photography Commissions"),
    },
    {
      href: "/licensing",
      label: t("Licencias TIFF 16-bit", "16-bit TIFF Licensing"),
    },
    {
      href: "/cuaderno",
      label: t("Cuaderno de Campo", "Field Journal"),
    },
    {
      href: "/contact",
      label: t("Contacto Directo", "Direct Contact"),
    },
  ];

  const disciplines = [
    {
      href: "/portfolio/fauna-naturaleza",
      label: t("Fauna y Naturaleza", "Wildlife & Nature"),
    },
    {
      href: "/portfolio/paisajes-documental",
      label: t("Paisajes y Territorio", "Landscapes & Territory"),
    },
    {
      href: "/portfolio/coches-rally",
      label: t("Coches y Rally", "Cars & Historic Rally"),
    },
    {
      href: "/portfolio/arquitectura-urbana",
      label: t("Arquitectura y Espacio Urbano", "Architecture & Urban Space"),
    },
    {
      href: "/portfolio/viajes-cultura",
      label: t("Documental y Tradición", "Documentary & Tradition"),
    },
  ];

  return (
    <div className="flex min-h-[85vh] items-center justify-center bg-[#0B0C0E] pt-28 pb-20 text-[#EBE7DF]">
      <Container className="max-w-3xl text-center">
        <p className="font-mono text-xs uppercase tracking-[0.4em] text-[#C5A880]">
          {t(
            "Error 404 · Fotograma no encontrado",
            "Error 404 · Frame Not Found"
          )}
        </p>
        <h1 className="mt-4 font-serif text-4xl font-light tracking-wide text-[#EBE7DF] sm:text-6xl">
          {t("Fuera de encuadre", "Out of frame")}
        </h1>
        <p className="mt-5 text-base font-light leading-relaxed text-[#A39E93]">
          {t(
            "La página o fotografía que buscas ha cambiado de dirección o no existe. Desde aquí puedes volver directamente a cualquiera de las secciones principales o colecciones del archivo:",
            "The page or photograph you are looking for has moved or does not exist. You can return directly to any of the main sections or archive collections below:"
          )}
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          {quickLinks.map((item, idx) => (
            <Link
              key={item.href}
              href={item.href}
              className={`inline-flex min-h-[44px] items-center px-5 py-2.5 font-mono text-xs uppercase tracking-[0.2em] transition ${
                idx === 0
                  ? "border border-[#C5A880] bg-[#C5A880] font-semibold text-[#0B0C0E] hover:bg-white hover:border-white"
                  : "border border-white/15 bg-[#151618] text-[#EBE7DF] hover:border-[#C5A880] hover:text-white"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>

        <div className="mt-10 border-t border-white/[0.08] pt-8">
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#A39E93]">
            {t("Explorar por Disciplina Fotográfica", "Explore by Discipline")}
          </p>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2.5">
            {disciplines.map((cat) => (
              <Link
                key={cat.href}
                href={cat.href}
                className="inline-flex min-h-[44px] items-center border border-white/[0.08] bg-[#0B0C0E] px-4 py-2 font-mono text-[11px] text-[#A39E93] transition hover:border-white/30 hover:text-[#EBE7DF]"
              >
                {cat.label} →
              </Link>
            ))}
          </div>
        </div>
      </Container>
    </div>
  );
}
