"use client";

import { useState } from "react";
import Image from "next/image";

const SAMPLES = [
  {
    id: "lince",
    title: "Mirada del Lince Boreal",
    specs: "Canon EOS R7 · 32,5 MP · Sigma 150-600mm + IA Denoise",
    image: "/images/portfolio/fauna-naturaleza/B51A1823-Mejorado-NR.jpg",
    focusX: 46,
    focusY: 36,
    note: "Nitidez milimétrica en el iris ámbar y el pelaje para impresiones de hasta 70×100 cm.",
  },
  {
    id: "garza",
    title: "Garza Blanca al Sol",
    specs: "600mm · f/6.3 · 1/1250s · ISO 400",
    image: "/images/portfolio/fauna-naturaleza/IMG_8446-Mejorado-NR.jpg",
    focusX: 45,
    focusY: 28,
    note: "Separación de cada hebra del plumaje iluminado a contraluz sin grano digital.",
  },
  {
    id: "fragua",
    title: "El Oficio y la Chispa",
    specs: "Claroscuro en Fragua · Alto Rango Dinámico",
    image: "/images/portfolio/viajes-cultura/soldador.jpg",
    focusX: 52,
    focusY: 54,
    note: "Riqueza tonal en las sombras profundas (D-Max) sobre algodón Hahnemühle Photo Rag 308g.",
  },
] as const;

export default function OpticalLoupeInspector() {
  const [selected, setSelected] = useState<(typeof SAMPLES)[number]>(SAMPLES[0]);
  const [zoomPos, setZoomPos] = useState<{ x: number; y: number }>({
    x: SAMPLES[0].focusX,
    y: SAMPLES[0].focusY,
  });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.min(90, Math.max(10, ((e.clientX - rect.left) / rect.width) * 100));
    const y = Math.min(90, Math.max(10, ((e.clientY - rect.top) / rect.height) * 100));
    setZoomPos({ x, y });
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length === 0) return;
    const touch = e.touches[0];
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.min(90, Math.max(10, ((touch.clientX - rect.left) / rect.width) * 100));
    const y = Math.min(90, Math.max(10, ((touch.clientY - rect.top) / rect.height) * 100));
    setZoomPos({ x, y });
  };

  return (
    <section
      aria-labelledby="loupe-heading"
      className="mt-24 rounded-xl border border-[#1D2021] bg-[#1D2021]/25 p-6 sm:p-10 lg:p-12"
    >
      <div className="flex flex-col justify-between gap-4 border-b border-[#1D2021] pb-6 lg:flex-row lg:items-end">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-[#95836B]">
            Control de Calidad Museística · 32,5 Megapíxeles
          </p>
          <h2 id="loupe-heading" className="mt-2 font-serif text-3xl font-light text-[#D8D5CD]">
            Inspector de Detalle Óptico (Lupa 300% para Gran Formato)
          </h2>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth py-1 -mx-2 px-2 sm:mx-0 sm:px-0 sm:flex-wrap">
          {SAMPLES.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                setSelected(item);
                setZoomPos({ x: item.focusX, y: item.focusY });
              }}
              className={`shrink-0 rounded-full px-3.5 py-1.5 text-[11px] uppercase tracking-wider transition ${
                selected.id === item.id
                  ? "bg-[#D8D5CD] text-[#101112] font-medium"
                  : "border border-[#1D2021] bg-[#101112] text-[#D8D5CD]/80 hover:border-[#95836B]"
              }`}
            >
              {item.title}
            </button>
          ))}
        </div>
      </div>

      <p className="mt-4 text-xs text-neutral-400">
        Desplace el cursor o deslice el dedo sobre la fotografía para examinar a la derecha la definición real de impresión sobre fibra de algodón:
      </p>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-12 items-center">
        {/* Vista Completa Interactiva (7 cols) */}
        <div
          onMouseMove={handleMouseMove}
          onTouchStart={handleTouchMove}
          onTouchMove={handleTouchMove}
          className="relative aspect-[3/2] w-full cursor-crosshair overflow-hidden rounded-lg border border-[#1D2021] bg-[#101112] select-none touch-none lg:col-span-7"
        >
          <Image
            src={selected.image}
            alt={selected.title}
            fill
            sizes="(max-width: 1024px) 100vw, 60vw"
            className="object-cover"
          />
          {/* Retícula de selección de la lupa */}
          <div
            style={{
              left: `${zoomPos.x}%`,
              top: `${zoomPos.y}%`,
            }}
            className="pointer-events-none absolute h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-[#D8D5CD] bg-white/10 shadow-[0_0_30px_rgba(0,0,0,0.8)] backdrop-blur-[1px]"
          />
          <span className="absolute bottom-3 left-3 rounded bg-[#101112]/85 px-3 py-1 text-[10px] uppercase tracking-widest text-[#D8D5CD] border border-[#1D2021]">
            Encuadre Completo · Deslice para inspeccionar
          </span>
        </div>

        {/* Vista Ampliada 300% (5 cols) */}
        <div className="flex flex-col justify-between lg:col-span-5 space-y-4">
          <div className="relative aspect-square w-full overflow-hidden rounded-lg border border-[#95836B]/50 bg-[#101112] shadow-2xl">
            <div
              style={{
                backgroundImage: `url(${selected.image})`,
                backgroundPosition: `${zoomPos.x}% ${zoomPos.y}%`,
                backgroundSize: "320%",
              }}
              className="h-full w-full bg-no-repeat transition-[background-position] duration-75"
            />
            <div className="absolute top-3 left-3 rounded bg-[#101112]/90 px-3 py-1 text-[10px] uppercase tracking-widest text-[#95836B] border border-[#1D2021]">
              Ampliación Óptica 3.2× (Detalle en 70×100 cm)
            </div>
          </div>

          <div className="rounded-lg border border-[#1D2021] bg-[#101112] p-4">
            <p className="text-[10px] uppercase tracking-[0.25em] text-[#95836B]">
              {selected.specs}
            </p>
            <p className="mt-1.5 text-xs leading-relaxed text-[#D8D5CD]/85 font-light">
              {selected.note}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
