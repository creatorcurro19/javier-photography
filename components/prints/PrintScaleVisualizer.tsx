"use client";

import { useState } from "react";
import Image from "next/image";

const FORMATS = [
  {
    id: "estudio",
    label: "Formato Estudio (A3+)",
    dims: "33 × 48 cm",
    widthPct: 24,
    edition: "Serie de 50 ejemplares",
    desc: "Ideal para despachos, estudios y composiciones combinadas.",
  },
  {
    id: "galeria",
    label: "Formato Galería",
    dims: "50 × 70 cm",
    widthPct: 35,
    edition: "Serie de 25 ejemplares",
    desc: "Proporción equilibrada para salones y espacios principales.",
  },
  {
    id: "coleccion",
    label: "Gran Colección",
    dims: "70 × 100 cm",
    widthPct: 50,
    edition: "Serie exclusiva de 10 ejemplares",
    desc: "Pieza central de gran formato con máxima presencia espacial.",
  },
] as const;

const SAMPLE_WORKS = [
  {
    title: "Horizonte de Dunas al Atardecer",
    image: "/images/portfolio/viajes-cultura/B51A7335.jpg",
  },
  {
    title: "Cumbre Nevada al Alba",
    image: "/images/portfolio/paisajes-documental/B51A0149.jpg",
  },
  {
    title: "Mirada del Lince Boreal",
    image: "/images/portfolio/fauna-naturaleza/B51A1823-Mejorado-NR.jpg",
  },
  {
    title: "El Oficio y la Chispa",
    image: "/images/portfolio/viajes-cultura/soldador.jpg",
  },
];

export default function PrintScaleVisualizer() {
  const [selectedFormat, setSelectedFormat] = useState<(typeof FORMATS)[number]>(FORMATS[1]);
  const [frameType, setFrameType] = useState<"black" | "oak" | "unframed">("black");
  const [sampleIdx, setSampleIdx] = useState(0);

  const currentWork = SAMPLE_WORKS[sampleIdx];

  return (
    <section className="mt-24 rounded-xl border border-[#1D2021] bg-[#1D2021]/25 p-6 sm:p-10 lg:p-12">
      <div className="flex flex-col justify-between gap-6 border-b border-[#1D2021] pb-6 lg:flex-row lg:items-end">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-[#95836B]">
            Simulador de Escala Real
          </p>
          <h2 className="mt-2 font-serif text-3xl font-light text-[#D8D5CD]">
            Comparador de tamaños sobre pared (Sofá de referencia: 200 cm)
          </h2>
        </div>

        {/* Controles de Formato y Marco */}
        <div className="flex flex-wrap items-center gap-2 text-[11px] uppercase tracking-wider">
          {FORMATS.map((fmt) => (
            <button
              key={fmt.id}
              type="button"
              onClick={() => setSelectedFormat(fmt)}
              className={`rounded-full px-3.5 py-1.5 transition ${
                selectedFormat.id === fmt.id
                  ? "bg-[#D8D5CD] text-[#101112] font-medium"
                  : "border border-[#1D2021] bg-[#101112] text-[#D8D5CD]/80 hover:border-[#95836B]"
              }`}
            >
              {fmt.dims}
            </button>
          ))}
        </div>
      </div>

      {/* Controles secundarios de Obra y Acabado */}
      <div className="mt-5 flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[11px] uppercase tracking-wider text-[#95836B]">Obra de muestra:</span>
          {SAMPLE_WORKS.map((w, idx) => (
            <button
              key={w.title}
              type="button"
              onClick={() => setSampleIdx(idx)}
              className={`rounded px-2.5 py-1 text-[11px] transition ${
                sampleIdx === idx
                  ? "bg-[#1D2021] text-[#D8D5CD] font-medium border border-[#95836B]/50"
                  : "text-neutral-400 hover:text-[#D8D5CD]"
              }`}
            >
              {w.title}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] uppercase tracking-wider text-[#95836B]">Acabado:</span>
          {(
            [
              { id: "black", label: "Marco Negro" },
              { id: "oak", label: "Marco Roble" },
              { id: "unframed", label: "Solo Papel" },
            ] as const
          ).map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setFrameType(f.id)}
              className={`rounded px-2.5 py-1 text-[11px] transition ${
                frameType === f.id
                  ? "bg-[#1D2021] text-[#D8D5CD] font-medium border border-[#95836B]/50"
                  : "text-neutral-400 hover:text-[#D8D5CD]"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Escenario de Pared de Galería */}
      <div className="relative mt-8 flex min-h-[380px] sm:min-h-[460px] flex-col items-center justify-between overflow-hidden rounded-lg border border-[#1D2021] bg-gradient-to-b from-[#232629] via-[#1C1E20] to-[#141617] px-6 pt-12 pb-6">
        {/* Cuadro a escala proporcional respecto al sofá de 200cm */}
        <div className="flex flex-1 items-center justify-center w-full">
          <div
            style={{ width: `${selectedFormat.widthPct}%` }}
            className={`relative transition-all duration-500 shadow-[0_25px_60px_rgba(0,0,0,0.85)] ${
              frameType === "black"
                ? "border-[6px] sm:border-[10px] border-[#121314] bg-[#F3EFE6] p-2.5 sm:p-5"
                : frameType === "oak"
                ? "border-[6px] sm:border-[10px] border-[#654830] bg-[#F3EFE6] p-2.5 sm:p-5"
                : "bg-[#F3EFE6] p-2 sm:p-4"
            }`}
          >
            <div className="relative aspect-[3/2] w-full overflow-hidden bg-neutral-900">
              <Image
                src={currentWork.image}
                alt={currentWork.title}
                fill
                sizes="50vw"
                className="object-cover"
              />
            </div>
            <span className="absolute -bottom-7 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-[#101112]/90 px-2.5 py-0.5 text-[10px] tracking-widest text-[#D8D5CD] border border-[#1D2021]">
              {selectedFormat.label} · {selectedFormat.dims}
            </span>
          </div>
        </div>

        {/* Silueta arquitectónica minimalista de sofá de 200 cm como referencia de escala */}
        <div className="mt-12 flex w-full flex-col items-center">
          <div className="relative w-full max-w-md">
            {/* Respaldo del sofá */}
            <div className="mx-auto h-10 w-[88%] rounded-t-md border border-white/10 bg-[#181A1C] shadow-inner" />
            {/* Brazos y asiento del sofá */}
            <div className="mx-auto -mt-2 flex h-9 w-full items-center justify-between rounded-md border border-white/10 bg-[#1D2022] px-2 shadow-lg">
              <div className="h-full w-4 rounded-sm bg-[#151719]" />
              <div className="h-2 w-full mx-2 border-t border-white/5" />
              <div className="h-full w-4 rounded-sm bg-[#151719]" />
            </div>
            {/* Cota de 200 cm */}
            <div className="mt-2 flex items-center justify-between text-[10px] tracking-[0.25em] text-[#95836B]">
              <span>├──────────</span>
              <span>REFERENCIA: 200 CM</span>
              <span>──────────┤</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 flex flex-col justify-between gap-2 text-xs text-neutral-400 sm:flex-row sm:items-center">
        <p>
          <strong className="text-[#D8D5CD]">{selectedFormat.label}:</strong> {selectedFormat.desc}
        </p>
        <span className="text-[#95836B] uppercase tracking-wider text-[11px]">
          {selectedFormat.edition}
        </span>
      </div>
    </section>
  );
}
