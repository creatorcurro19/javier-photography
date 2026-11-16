"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

const FORMATS = [
  {
    id: "estudio",
    label: "Formato Estudio (A3+)",
    dims: "33 × 48 cm",
    outerDims: "43 × 58 cm (con marco y paspartú)",
    widthPct: 24,
    edition: "Serie numerada de 50 ejemplares",
    desc: "Ideal para despachos, estudios, librerías y composiciones en pareja (dípticos).",
  },
  {
    id: "galeria",
    label: "Formato Galería",
    dims: "50 × 70 cm",
    outerDims: "62 × 82 cm (con marco y paspartú)",
    widthPct: 34,
    edition: "Serie numerada de 25 ejemplares",
    desc: "Proporción equilibrada de galería para salones y espacios principales.",
  },
  {
    id: "coleccion",
    label: "Gran Colección",
    dims: "70 × 100 cm",
    outerDims: "84 × 114 cm (con marco y paspartú)",
    widthPct: 46,
    edition: "Serie exclusiva de 10 ejemplares",
    desc: "Pieza central de gran formato con máxima presencia arquitectónica.",
  },
] as const;

const SAMPLE_WORKS = [
  {
    title: "Horizonte de Dunas al Atardecer",
    image: "/images/portfolio/viajes-cultura/B51A7335.jpg",
  },
  {
    title: "Ocaso sobre el Erg",
    image: "/images/portfolio/viajes-cultura/B51A7341.jpg",
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
    title: "El Paso del Lobo",
    image: "/images/portfolio/fauna-naturaleza/B51A1865-Mejorado-NR.jpg",
  },
  {
    title: "El Oficio y la Chispa",
    image: "/images/portfolio/viajes-cultura/soldador.jpg",
  },
];

const FINISHES = [
  {
    id: "black",
    label: "Marco Negro Galería + Cristal Museo UV",
    note: "Madera maciza lacada en negro mate, paspartú algodón 5 cm y cristal antirreflejos UV 99%.",
  },
  {
    id: "oak",
    label: "Marco Roble Natural + Cristal Museo UV",
    note: "Madera maciza de roble europeo, paspartú algodón 5 cm y cristal antirreflejos UV 99%.",
  },
  {
    id: "unframed",
    label: "Solo Copia en Tubo Libre de Ácido",
    note: "Lámina Hahnemühle Photo Rag 308g con margen blanco de 5 cm firmada y certificada.",
  },
] as const;

export default function PrintScaleVisualizer() {
  const [selectedFormat, setSelectedFormat] = useState<(typeof FORMATS)[number]>(FORMATS[1]);
  const [frameType, setFrameType] = useState<(typeof FINISHES)[number]["id"]>("black");
  const [wallColor, setWallColor] = useState<"dark" | "ivory" | "sand">("dark");
  const [layoutMode, setLayoutMode] = useState<"single" | "diptych">("single");
  const [sampleIdxA, setSampleIdxA] = useState(0);
  const [sampleIdxB, setSampleIdxB] = useState(1);

  const workA = SAMPLE_WORKS[sampleIdxA];
  const workB = SAMPLE_WORKS[sampleIdxB];
  const currentFinish = FINISHES.find((f) => f.id === frameType) ?? FINISHES[0];

  const orderReference =
    layoutMode === "diptych"
      ? `Díptico: ${workA.title} + ${workB.title}`
      : workA.title;
  const orderFormat = `${selectedFormat.label} (${selectedFormat.dims}) · ${currentFinish.label}`;

  return (
    <section className="mt-24 rounded-xl border border-[#1D2021] bg-[#1D2021]/25 p-6 sm:p-10 lg:p-12">
      <div className="flex flex-col justify-between gap-6 border-b border-[#1D2021] pb-6 lg:flex-row lg:items-end">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-[#95836B]">
            Configurador de Escala & Composición en Pared
          </p>
          <h2 className="mt-2 font-serif text-3xl font-light text-[#D8D5CD]">
            Simulador de Obra Individual y Díptico (Referencia: Sofá de 200 cm)
          </h2>
        </div>

        {/* Selector Obra Única vs Díptico + Formatos */}
        <div className="flex flex-wrap items-center gap-2 text-[11px] uppercase tracking-wider">
          <button
            type="button"
            onClick={() => setLayoutMode("single")}
            className={`rounded-full px-3.5 py-1.5 transition ${
              layoutMode === "single"
                ? "bg-[#95836B] text-[#101112] font-medium"
                : "border border-[#1D2021] bg-[#101112] text-[#D8D5CD]/80 hover:border-[#95836B]"
            }`}
          >
            Obra Individual
          </button>
          <button
            type="button"
            onClick={() => setLayoutMode("diptych")}
            className={`rounded-full px-3.5 py-1.5 transition ${
              layoutMode === "diptych"
                ? "bg-[#95836B] text-[#101112] font-medium"
                : "border border-[#1D2021] bg-[#101112] text-[#D8D5CD]/80 hover:border-[#95836B]"
            }`}
          >
            Díptico (2 Obras)
          </button>
          <span className="mx-1 text-neutral-700">|</span>
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

      {/* Controles de Obras y Acabado */}
      <div className="mt-5 flex flex-col gap-4 text-xs lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[11px] uppercase tracking-wider text-[#95836B]">
            {layoutMode === "diptych" ? "Obra Izquierda:" : "Obra:"}
          </span>
          {SAMPLE_WORKS.map((w, idx) => (
            <button
              key={w.title}
              type="button"
              onClick={() => setSampleIdxA(idx)}
              className={`rounded px-2.5 py-1 text-[11px] transition ${
                sampleIdxA === idx
                  ? "bg-[#1D2021] text-[#D8D5CD] font-medium border border-[#95836B]/50"
                  : "text-neutral-400 hover:text-[#D8D5CD]"
              }`}
            >
              {w.title}
            </button>
          ))}
        </div>

        {layoutMode === "diptych" && (
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] uppercase tracking-wider text-[#95836B]">
              Obra Derecha:
            </span>
            {SAMPLE_WORKS.map((w, idx) => (
              <button
                key={w.title}
                type="button"
                onClick={() => setSampleIdxB(idx)}
                className={`rounded px-2.5 py-1 text-[11px] transition ${
                  sampleIdxB === idx
                    ? "bg-[#1D2021] text-[#D8D5CD] font-medium border border-[#95836B]/50"
                    : "text-neutral-400 hover:text-[#D8D5CD]"
                }`}
              >
                {w.title}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[11px] uppercase tracking-wider text-[#95836B]">Acabado:</span>
          {FINISHES.map((f) => (
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

        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[11px] uppercase tracking-wider text-[#95836B]">Ambiente de Pared:</span>
          {(
            [
              { id: "dark", label: "Galería Oscura", dot: "bg-[#1C1E20]" },
              { id: "ivory", label: "Blanco Museo", dot: "bg-[#F2EFE9]" },
              { id: "sand", label: "Piedra Cálida", dot: "bg-[#D2C9BC]" },
            ] as const
          ).map((w) => (
            <button
              key={w.id}
              type="button"
              onClick={() => setWallColor(w.id)}
              className={`inline-flex items-center gap-1.5 rounded px-2.5 py-1 text-[11px] transition ${
                wallColor === w.id
                  ? "bg-[#1D2021] text-[#D8D5CD] font-medium border border-[#95836B]/50"
                  : "text-neutral-400 hover:text-[#D8D5CD]"
              }`}
            >
              <span className={`h-2.5 w-2.5 rounded-full border border-white/20 ${w.dot}`} />
              <span>{w.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Escenario de Pared de Galería */}
      <div
        className={`relative mt-8 flex min-h-[390px] sm:min-h-[460px] flex-col items-center justify-between overflow-hidden rounded-lg border border-[#1D2021] px-6 pt-12 pb-6 transition-colors duration-500 ${
          wallColor === "dark"
            ? "bg-gradient-to-b from-[#232629] via-[#1C1E20] to-[#141617]"
            : wallColor === "ivory"
            ? "bg-gradient-to-b from-[#F4F2ED] via-[#EAE6DF] to-[#DCD7CE]"
            : "bg-gradient-to-b from-[#D8D0C4] via-[#CBBFB0] to-[#B8AA99]"
        }`}
      >
        <div className="flex flex-1 items-center justify-center gap-6 sm:gap-10 w-full">
          {[workA, ...(layoutMode === "diptych" ? [workB] : [])].map((work, i) => {
            const effectiveWidth =
              layoutMode === "diptych"
                ? Math.min(38, selectedFormat.widthPct * 0.85)
                : selectedFormat.widthPct;
            return (
              <div
                key={`${work.title}-${i}`}
                style={{ width: `${effectiveWidth}%` }}
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
                    src={work.image}
                    alt={work.title}
                    fill
                    sizes="45vw"
                    className="object-cover"
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Silueta arquitectónica minimalista de sofá de 200 cm como referencia de escala */}
        <div className="mt-10 flex w-full flex-col items-center">
          <div className="relative w-full max-w-md">
            <div className="mx-auto h-10 w-[88%] rounded-t-md border border-white/10 bg-[#181A1C] shadow-inner" />
            <div className="mx-auto -mt-2 flex h-9 w-full items-center justify-between rounded-md border border-white/10 bg-[#1D2022] px-2 shadow-lg">
              <div className="h-full w-4 rounded-sm bg-[#151719]" />
              <div className="h-2 w-full mx-2 border-t border-white/5" />
              <div className="h-full w-4 rounded-sm bg-[#151719]" />
            </div>
            <div className="mt-2 flex items-center justify-between text-[10px] tracking-[0.25em] text-[#95836B]">
              <span>├──────────</span>
              <span>REFERENCIA DE ESCALA: 200 CM</span>
              <span>──────────┤</span>
            </div>
          </div>
        </div>
      </div>

      {/* Resumen de Configuración & Botón Directo de Encargo */}
      <div className="mt-6 flex flex-col justify-between gap-4 rounded-lg border border-[#1D2021] bg-[#101112] p-5 sm:flex-row sm:items-center">
        <div className="space-y-1 text-xs">
          <p className="text-[#D8D5CD] font-medium">
            {layoutMode === "diptych" ? "Composición en Díptico (2 Obras)" : "Obra Individual"} ·{" "}
            {selectedFormat.label} ({selectedFormat.dims})
          </p>
          <p className="text-neutral-400">
            {currentFinish.note} · Exterior: {selectedFormat.outerDims}
          </p>
        </div>

        <Link
          href={`/contact?motivo=print&obra=${encodeURIComponent(orderReference)}&formato=${encodeURIComponent(orderFormat)}`}
          className="inline-flex shrink-0 items-center justify-center border border-[#D8D5CD] bg-[#D8D5CD] px-6 py-3 text-xs uppercase tracking-[0.25em] text-[#101112] font-semibold transition hover:bg-transparent hover:text-white"
        >
          Encargar Esta Configuración →
        </Link>
      </div>
    </section>
  );
}
