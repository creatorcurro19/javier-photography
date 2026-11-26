"use client";

import { useState } from "react";
import Image from "next/image";
import { WORKS } from "@/data/works";

const SAMPLE_CONFIGS = [
  {
    id: "lince",
    slug: "mirada-del-lince-boreal",
    category: "fauna-naturaleza",
    label: "Lince Boreal",
    title: "Mirada del Lince Boreal",
    image: "/images/portfolio/fauna-naturaleza/mirada-del-lince-boreal.jpg",
    width: 2200,
    height: 1238,
    note: "Nitidez milimétrica en el iris y el pelaje sobre algodón Hahnemühle 308 g/m².",
  },
  {
    id: "garza",
    slug: "garza-blanca-al-sol",
    category: "fauna-naturaleza",
    label: "Garza Blanca",
    title: "Garza Blanca al Sol",
    image: "/images/portfolio/fauna-naturaleza/garza-blanca-al-sol.jpg",
    width: 1760,
    height: 2200,
    note: "Separación natural en cada hebra del plumaje iluminado a contraluz.",
  },
  {
    id: "fragua",
    slug: "el-oficio-y-la-chispa",
    category: "viajes-cultura",
    label: "El Oficio",
    title: "El Oficio y la Chispa",
    image: "/images/portfolio/viajes-cultura/el-oficio-y-la-chispa.jpg",
    width: 2200,
    height: 1650,
    note: "Profundidad de negros y detalle en las sombras en gran formato.",
  },
] as const;

const SAMPLES = SAMPLE_CONFIGS.map((cfg) => {
  const w =
    WORKS.find((item) => item.slug === cfg.slug) ??
    WORKS.find((item) => item.category === cfg.category) ??
    WORKS[0];
  return {
    ...cfg,
    title: w?.title ?? cfg.title,
    image: w?.image ?? cfg.image,
    width: w?.width ?? cfg.width,
    height: w?.height ?? cfg.height,
  };
});

const ZOOM = 2.6;
const LENS_SIZE = 196;

export default function OpticalLoupeInspector() {
  const [selected, setSelected] = useState<(typeof SAMPLES)[number]>(SAMPLES[0]);
  const [lens, setLens] = useState<{
    active: boolean;
    x: number;
    y: number;
    w: number;
    h: number;
  }>({ active: false, x: 0, y: 0, w: 0, h: 0 });

  const updateLens = (clientX: number, clientY: number, rect: DOMRect) => {
    const x = Math.min(rect.width, Math.max(0, clientX - rect.left));
    const y = Math.min(rect.height, Math.max(0, clientY - rect.top));
    setLens({ active: true, x, y, w: rect.width, h: rect.height });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    updateLens(e.clientX, e.clientY, e.currentTarget.getBoundingClientRect());
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length === 0) return;
    const touch = e.touches[0];
    updateLens(touch.clientX, touch.clientY, e.currentTarget.getBoundingClientRect());
  };

  return (
    <section
      aria-labelledby="loupe-heading"
      className="mt-24 border border-white/[0.08] bg-[#151618] p-6 sm:p-10"
    >
      <div className="flex flex-col justify-between gap-5 pb-6 sm:flex-row sm:items-end">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-[#8E8A80]">
            Detalle de Impresión
          </p>
          <h2 id="loupe-heading" className="mt-2 font-serif text-2xl font-light text-[#EBE7DF] sm:text-3xl">
            Lupa de Nitidez
          </h2>
          <p className="mt-2 text-xs font-light text-[#8E8A80]">
            Pasa el cursor o desliza el dedo sobre la fotografía para ver el detalle real de impresión.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {SAMPLES.map((item) => {
            const active = selected.id === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setSelected(item);
                  setLens((prev) => ({ ...prev, active: false }));
                }}
                className={`px-3.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.2em] transition ${
                  active
                    ? "border border-[#EBE7DF] bg-[#EBE7DF] text-[#0B0C0E] font-medium"
                    : "border border-white/[0.08] bg-[#0B0C0E] text-[#8E8A80] hover:border-white/30 hover:text-[#EBE7DF]"
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Marco limpio que respeta las proporciones reales sin recorte */}
      <div className="flex justify-center border border-white/[0.06] bg-[#0B0C0E] p-3 sm:p-5">
        <div
          onMouseEnter={handleMouseMove}
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setLens((prev) => ({ ...prev, active: false }))}
          onTouchStart={handleTouchMove}
          onTouchMove={handleTouchMove}
          onTouchEnd={() => setLens((prev) => ({ ...prev, active: false }))}
          className="relative inline-block cursor-none overflow-hidden select-none touch-none"
        >
          <Image
            src={selected.image}
            alt={selected.title}
            width={selected.width}
            height={selected.height}
            sizes="(max-width: 1024px) 100vw, 896px"
            quality={90}
            className="block h-auto max-h-[65vh] w-auto max-w-full"
          />

          {/* Lente circular de aumento directo bajo el cursor o dedo */}
          {lens.active && lens.w > 0 && (
            <div
              aria-hidden="true"
              style={{
                width: `${LENS_SIZE}px`,
                height: `${LENS_SIZE}px`,
                left: `${lens.x}px`,
                top: `${lens.y}px`,
                backgroundImage: `url(${selected.image})`,
                backgroundSize: `${lens.w * ZOOM}px ${lens.h * ZOOM}px`,
                backgroundPosition: `${-(lens.x * ZOOM - LENS_SIZE / 2)}px ${-(lens.y * ZOOM - LENS_SIZE / 2)}px`,
              }}
              className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#EBE7DF]/80 bg-[#0B0C0E] bg-no-repeat shadow-[0_16px_50px_rgba(0,0,0,0.85)] ring-1 ring-black/50"
            />
          )}

          {/* Indicación discreta en reposo */}
          {!lens.active && (
            <div className="pointer-events-none absolute bottom-4 left-4 border border-white/[0.1] bg-[#0B0C0E]/80 px-3.5 py-1.5 backdrop-blur-md">
              <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#EBE7DF]">
                Toca o pasa el ratón para activar la lupa
              </span>
            </div>
          )}
        </div>
      </div>

      <p className="mt-4 text-xs font-light text-[#8E8A80]">
        <span className="text-[#EBE7DF]">{selected.title}</span> — {selected.note}
      </p>
    </section>
  );
}
