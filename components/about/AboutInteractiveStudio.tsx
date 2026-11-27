"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { SITE_SETTINGS } from "@/data/site-config";

const PORTRAIT_IMAGE =
  SITE_SETTINGS.showAuthorPortrait && SITE_SETTINGS.authorPortraitUrl
    ? SITE_SETTINGS.authorPortraitUrl
    : "/images/portfolio/hero/hero.jpg";

const ETHICAL_PILLARS = [
  {
    num: "01",
    title: "Luz natural",
  },
  {
    num: "02",
    title: "Fotografía real, sin nada inventado",
  },
  {
    num: "03",
    title: "Respeto por el lugar y la escena",
  },
];

export default function AboutInteractiveStudio() {
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
              Sobre mí
            </p>
            <h1 className="mt-3 font-serif text-3xl font-light leading-[1.1] tracking-wide text-[#EBE7DF] sm:text-5xl">
              Observar antes de{" "}
              <span className="italic text-[#C5A880]">disparar</span>
            </h1>

            <blockquote className="mt-6 border-l-2 border-[#C5A880] pl-5 font-serif text-lg italic leading-relaxed text-[#EBE7DF]/90 sm:text-xl">
              «La fotografía no tiene que demostrar constantemente lo impresionante que es el mundo. A veces basta con detenerse a observarlo.»
            </blockquote>

            <div className="mt-6 space-y-4 text-sm font-light leading-relaxed text-[#EBE7DF]/80 sm:text-base sm:leading-7">
              <p>
                Soy <strong className="font-medium text-[#EBE7DF]">Javier Espinosa</strong>, fotógrafo independiente, actualmente residiendo en Tenerife.
              </p>
              <p>
                Me gusta perderme en lugares nuevos, observar lo que normalmente pasa desapercibido y encontrar imágenes en situaciones cotidianas. Mi fotografía se mueve entre la naturaleza, los paisajes, la arquitectura y la cultura, sin demasiadas etiquetas ni límites.
              </p>
              <p>
                Más que especializarme en una sola forma de fotografiar, me interesa seguir descubriendo nuevas maneras de mirar.
              </p>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-3 print:hidden">
              <Link
                href="/portfolio"
                className="inline-flex min-h-[46px] items-center gap-2 rounded-lg border border-[#C5A880] bg-[#C5A880] px-7 py-3 text-xs font-semibold uppercase tracking-[0.22em] text-[#0B0C0E] transition hover:bg-white hover:border-white"
              >
                <span>Ver todas las fotos</span>
                <span>→</span>
              </Link>
              <Link
                href="/contact"
                className="inline-flex min-h-[46px] items-center gap-2 rounded-lg border border-white/20 bg-[#151618] px-6 py-3 text-xs uppercase tracking-[0.22em] text-[#EBE7DF] transition hover:border-white/40 hover:text-white"
              >
                <span>Contacto</span>
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
              <div className="relative aspect-[4/5] w-full overflow-hidden rounded-lg border border-white/[0.08] bg-[#151618] shadow-2xl">
                <Image
                  src={PORTRAIT_IMAGE}
                  alt="Javier Espinosa — Fotógrafo en Tenerife"
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 42vw"
                  className="object-cover transition-all duration-700"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Cómo trabajo */}
      <section className="border-t border-white/[0.08] pt-12">
        <p className="font-mono text-xs uppercase tracking-[0.28em] text-[#C5A880]">
          Cómo trabajo
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
                {pillar.title}
              </h2>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
