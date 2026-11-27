"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "@/components/ui/LocalizedLink";
import TrabajosSection from "@/components/about/TrabajosSection";
import { TRABAJOS } from "@/data/trabajos";
import { SITE_SETTINGS } from "@/data/site-config";
import { useLanguage } from "@/lib/i18n";

const PORTRAIT_IMAGE =
  SITE_SETTINGS.showAuthorPortrait && SITE_SETTINGS.authorPortraitUrl
    ? SITE_SETTINGS.authorPortraitUrl
    : "/images/portfolio/hero/hero.jpg";

const ETHICAL_PILLARS = [
  {
    num: "01",
    titleEs: "Luz natural",
    titleEn: "Natural light",
  },
  {
    num: "02",
    titleEs: "Fotografía real, sin nada inventado",
    titleEn: "Genuine photography, nothing staged or generated",
  },
  {
    num: "03",
    titleEs: "Respeto por el lugar y la escena",
    titleEn: "Respect for place and scene",
  },
];

export default function AboutInteractiveStudio() {
  const { lang, t } = useLanguage();
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const relX = (e.clientX - rect.left) / rect.width - 0.5;
    const relY = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({
      x: Number((-relY * 5).toFixed(2)),
      y: Number((relX * 5).toFixed(2)),
    });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  return (
    <div className="space-y-16 sm:space-y-20">
      {/* 1. Hero Editorial & Retrato */}
      <section className="relative">
        <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-7 lg:pr-4">
            <p className="font-mono text-xs uppercase tracking-[0.28em] text-[#C5A880]">
              {t("Sobre mí", "About")}
            </p>
            <h1 className="mt-3 font-serif text-3xl font-light leading-[1.1] tracking-wide text-[#EBE7DF] sm:text-5xl">
              {t("Observar antes de ", "Observe before ")}
              <span className="italic text-[#C5A880]">
                {t("disparar", "pressing the shutter")}
              </span>
            </h1>

            <blockquote className="mt-6 border-l-2 border-[#C5A880] pl-5 font-serif text-lg italic leading-relaxed text-[#EBE7DF]/90 sm:text-xl">
              {t(
                "«La fotografía no tiene que demostrar constantemente lo impresionante que es el mundo. A veces basta con detenerse a observarlo.»",
                "\"Photography does not constantly need to prove how dramatic the world is. Sometimes it is enough simply to pause and look.\""
              )}
            </blockquote>

            <div className="mt-6 space-y-4 text-sm font-light leading-relaxed text-[#EBE7DF]/80 sm:text-base sm:leading-7">
              <p>
                {t("Soy ", "I am ")}
                <strong className="font-medium text-[#EBE7DF]">Javier Espinosa</strong>
                {t(
                  ", fotógrafo independiente, actualmente residiendo en Tenerife.",
                  ", an independent photographer currently based in Tenerife."
                )}
              </p>
              <p>
                {t(
                  "Me gusta perderme en lugares nuevos, observar lo que normalmente pasa desapercibido y encontrar imágenes en situaciones cotidianas. Mi fotografía se mueve entre la naturaleza, los paisajes, la arquitectura y la cultura, sin demasiadas etiquetas ni límites.",
                  "I enjoy getting lost in unfamiliar places, noticing what usually passes unseen, and finding frames inside quiet everyday scenes. My work moves across wildlife, landscapes, architecture, and culture without rigid boundaries."
                )}
              </p>
              <p>
                {t(
                  "Más que especializarme en una sola forma de fotografiar, me interesa seguir descubriendo nuevas maneras de mirar.",
                  "More than narrowing myself down to a single formula, I care about continuing to discover new ways of seeing."
                )}
              </p>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-3 print:hidden">
              <Link
                href="/portfolio"
                className="inline-flex min-h-[46px] items-center gap-2 rounded-lg border border-[#C5A880] bg-[#C5A880] px-7 py-3 text-xs font-semibold uppercase tracking-[0.22em] text-[#0B0C0E] transition hover:bg-white hover:border-white"
              >
                <span>{t("Ver todas las fotos", "View all photos")}</span>
                <span>→</span>
              </Link>
              <Link
                href="/contact"
                className="inline-flex min-h-[46px] items-center gap-2 rounded-lg border border-white/20 bg-[#151618] px-6 py-3 text-xs uppercase tracking-[0.22em] text-[#EBE7DF] transition hover:border-white/40 hover:text-white"
              >
                <span>{t("Contacto", "Contact")}</span>
              </Link>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              style={{
                transform: `perspective(1200px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
              }}
              className="relative transition-transform duration-200 ease-out"
            >
              <div className="relative w-full overflow-hidden rounded-lg border border-white/[0.08] bg-[#151618] shadow-2xl">
                <Image
                  src={PORTRAIT_IMAGE}
                  alt={t("Javier Espinosa — Fotógrafo en Tenerife", "Javier Espinosa — Photographer in Tenerife")}
                  width={1467}
                  height={2200}
                  priority
                  sizes="(max-width: 1024px) 100vw, 42vw"
                  className="block h-auto w-full transition-all duration-700"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Cómo trabajo */}
      <section className="border-t border-white/[0.08] pt-12">
        <p className="font-mono text-xs uppercase tracking-[0.28em] text-[#C5A880]">
          {t("Cómo trabajo", "How I work")}
        </p>

        <div className="mt-4 grid grid-cols-1 divide-y divide-white/[0.08] border-y border-white/[0.08] md:grid-cols-3 md:divide-x md:divide-y-0">
          {ETHICAL_PILLARS.map((pillar) => (
            <div
              key={pillar.num}
              className="flex items-center gap-4 py-4 md:px-6 md:py-5 md:first:pl-0 md:last:pr-0"
            >
              <span className="font-mono text-xs text-[#C5A880]">
                {pillar.num}
              </span>
              <h2 className="font-serif text-lg text-[#EBE7DF]">
                {lang === "en" ? pillar.titleEn : pillar.titleEs}
              </h2>
            </div>
          ))}
        </div>
      </section>

      <TrabajosSection items={TRABAJOS} />
    </div>
  );
}
