"use client";

import Image from "next/image";
import Link from "next/link";
import {
  AndalusianBackgroundPattern,
  AndalusianCenefa,
} from "@/components/ui/AndalusianMotif";
import { SERIES } from "@/data/works";
import { useLanguage } from "@/lib/i18n";

const collections = [
  { href: "/portfolio/fauna-naturaleza", es: "Fauna y Naturaleza", en: "Wildlife & Nature" },
  { href: "/portfolio/paisajes-documental", es: "Paisajes y Territorio", en: "Landscapes & Territory" },
  { href: "/portfolio/coches-rally", es: "Coches y Rally", en: "Cars & Historic Rally" },
  { href: "/portfolio/arquitectura-urbana", es: "Arquitectura y Espacio Urbano", en: "Architecture & Urban Space" },
  { href: "/portfolio/viajes-cultura", es: "Documental y Tradición", en: "Documentary & Everyday Life" },
];

const projectLinks = SERIES.map((series) => ({
  href: `/projects/${series.slug}`,
  label: series.title,
}));

const commercialLinks = [
  { href: "/portfolio", es: "Obra", en: "Works" },
  { href: "/projects", es: "Series", en: "Series" },
  { href: "/prints", es: "Copias", en: "Prints" },
  { href: "/servicios", es: "Encargos", en: "Commissions" },
  { href: "/about", es: "Sobre mí", en: "About" },
  { href: "/contact", es: "Contacto", en: "Contact" },
  { href: "/licensing", es: "Licencias Editoriales y Comerciales", en: "Editorial & Commercial Licensing" },
  { href: "/dossier", es: "Dossier de Autor (PDF)", en: "Author Dossier (PDF)" },
];

export default function Footer() {
  const { lang, t } = useLanguage();

  return (
    <footer className="relative overflow-hidden border-t border-[#C5A880]/20 bg-[#0B0C0E] text-[#8E8A80] print:hidden">
      {/* Filigrana geométrica andalusí de fondo */}
      <AndalusianBackgroundPattern
        variant="laceria"
        mask="radial"
        className="text-[#C5A880]/[0.075]"
      />

      {/* Cenefa coronando el pie de página */}
      <AndalusianCenefa
        variant="estrella"
        fadeEdges={false}
        className="relative z-10 text-[#C5A880]/38"
      />

      <div className="relative z-10 mx-auto max-w-7xl px-6 sm:px-10 md:px-16 lg:px-20 xl:px-24 py-16 lg:py-24">
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-5">
          {/* Columna de Autor & Marca */}
          <div className="lg:col-span-2">
            <Link
              href="/"
              className="group inline-flex items-center gap-3.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
            >
              <Image
                src="/icon.svg"
                alt="Monograma JE"
                width={42}
                height={42}
                className="h-10 w-10 rounded-xl ring-1 ring-[#C5A880]/35 transition-transform duration-300 group-hover:scale-105"
              />
              <div className="flex flex-col">
                <span className="font-sans font-medium text-lg tracking-[0.28em] text-[#EBE7DF]">
                  JAVIER ESPINOSA
                </span>
                <span className="text-[9px] tracking-[0.42em] text-[#C5A880]/80 uppercase mt-0.5">
                  The Art of Seeing · {t("Fotografía de Autor", "Fine Art Photography")}
                </span>
              </div>
            </Link>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-[#8E8A80] font-light">
              {t(
                "Fotografía desde Tenerife, Canarias. Naturaleza, paisajes, arquitectura, motor clásico y vida cotidiana trabajados con luz natural. Copias en papel de algodón Hahnemühle 308g y encargos.",
                "Photography from Tenerife, Canary Islands. Wildlife, landscapes, architecture, classic motorsport, and everyday life shot in natural light. Hahnemühle 308g cotton prints and commissions."
              )}
            </p>

            <div className="mt-6 flex flex-wrap gap-2 text-[10px] font-mono tracking-wider uppercase text-[#8E8A80]">
              <span className="border border-white/[0.08] px-3 py-1 bg-[#151618] text-[#EBE7DF]">Canon EOS R7</span>
              <span className="border border-white/[0.08] px-3 py-1 bg-[#151618] text-[#EBE7DF]">Hahnemühle 308g</span>
              <span className="border border-white/[0.08] px-3 py-1 bg-[#151618] text-[#EBE7DF]">ISO 9706</span>
              <span className="border border-white/[0.08] px-3 py-1 bg-[#151618] text-[#EBE7DF]">Tenerife · Canarias</span>
            </div>

            {/* Perfiles Oficiales Verificados */}
            <div className="mt-6 flex flex-wrap items-center gap-3 text-[10px] uppercase font-mono tracking-[0.22em]">
              <a
                href="https://www.instagram.com/Javier.espinosa19/"
                target="_blank"
                rel="noopener noreferrer"
                className="border border-white/[0.08] bg-[#151618] px-3.5 py-1.5 text-[#EBE7DF] transition hover:border-white/30 hover:text-white"
              >
                Instagram ↗
              </a>
              <a
                href="https://www.saatchiart.com/javier-espinosa-photography"
                target="_blank"
                rel="noopener noreferrer"
                className="border border-white/[0.08] bg-[#151618] px-3.5 py-1.5 text-[#EBE7DF] transition hover:border-white/30 hover:text-white"
              >
                Saatchi Art ↗
              </a>
              <a
                href="https://www.istockphoto.com/portfolio/JavierEspinosa?sort=purerecency&assettype=image"
                target="_blank"
                rel="noopener noreferrer"
                className="border border-white/[0.08] bg-[#151618] px-3.5 py-1.5 text-[#EBE7DF] transition hover:border-white/30 hover:text-white"
              >
                Getty / iStock ↗
              </a>
            </div>
          </div>

          {/* Colecciones */}
          <div>
            <h3 className="text-xs font-mono font-medium uppercase tracking-[0.3em] text-[#EBE7DF]">
              {t("Disciplinas", "Disciplines")}
            </h3>
            <ul className="mt-5 space-y-3 text-xs tracking-wider">
              {collections.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-[#8E8A80] transition hover:text-[#EBE7DF] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
                  >
                    {lang === "en" ? item.en : item.es}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Series Monográficas */}
          <div>
            <h3 className="text-xs font-mono font-medium uppercase tracking-[0.3em] text-[#EBE7DF]">
              {t("Series Monográficas", "Monograph Series")}
            </h3>
            <ul className="mt-5 space-y-3 text-xs tracking-wider">
              {projectLinks.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-[#8E8A80] transition hover:text-[#EBE7DF] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Adquisiciones & Contacto */}
          <div>
            <h3 className="text-xs font-mono font-medium uppercase tracking-[0.3em] text-[#EBE7DF]">
              {t("Adquisiciones & Obra", "Acquisitions & Works")}
            </h3>
            <ul className="mt-5 space-y-3 text-xs tracking-wider">
              {commercialLinks.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-[#8E8A80] transition hover:text-[#EBE7DF] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
                  >
                    {lang === "en" ? item.en : item.es}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-6 border-t border-white/[0.08] pt-4 text-xs">
              <a
                href="mailto:javierespinosa1995@hotmail.com"
                className="text-[#8E8A80] transition hover:text-[#EBE7DF] font-mono break-all"
              >
                javierespinosa1995@hotmail.com
              </a>
            </div>
          </div>
        </div>

        {/* Barra Inferior */}
        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-white/[0.08] pt-8 text-[11px] font-mono tracking-wider text-[#8E8A80]/70 sm:flex-row">
          <p>© {new Date().getFullYear()} Javier Espinosa Martínez. {t("Archivo fotográfico original protegido por derechos de autor.", "Original photographic archive protected by copyright.")}</p>
          <div className="flex flex-wrap items-center gap-4">
            <Link href="/about" className="hover:text-[#EBE7DF] transition">{t("Sobre mí", "About")}</Link>
            <span>·</span>
            <Link href="/contact" className="hover:text-[#EBE7DF] transition">{t("Contacto", "Contact")}</Link>
            <span>·</span>
            <Link href="/legal" className="hover:text-[#EBE7DF] transition">{t("Aviso Legal y Privacidad", "Legal Notice & Privacy")}</Link>
            <span>·</span>
            <Link href="/condiciones" className="hover:text-[#EBE7DF] transition">{t("Condiciones de Compra y Licencia", "Terms & Conditions")}</Link>
            <span>·</span>
            <Link href="/admin" className="hover:text-[#C5A880] transition">{t("Acceso Autor", "Creator Access")}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
