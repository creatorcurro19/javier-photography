"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const USAGE_TYPES = [
  {
    id: "Editorial & Prensa",
    label: "Editorial & Prensa",
    format: "JPEG Máxima Calidad / TIFF 8-bit · 300 DPI · Adobe RGB",
    rights: "Derechos de reproducción no exclusivos para una edición/artículo.",
  },
  {
    id: "Campaña Digital & Web",
    label: "Campaña Digital & Web",
    format: "Master sRGB + WebP Retina · 6960 × 4640 px",
    rights: "Uso en cabeceras corporativas, redes sociales y medios digitales.",
  },
  {
    id: "Publicidad & Marca",
    label: "Publicidad & Marca",
    format: "TIFF 16-bit Sin Comprimir · ProPhoto / Adobe RGB · 32.5 MP",
    rights: "Cesión comercial multiplataforma para campañas de marca y exterior.",
  },
  {
    id: "Exclusividad / Buyout Temporal",
    label: "Exclusividad Sectorial",
    format: "Archivo Master RAW/TIFF 16-bit + Certificado de Exclusividad",
    rights: "Bloqueo temporal de la obra para competidores del mismo sector.",
  },
];

const TERRITORIES = ["España (Nacional)", "Unión Europea", "Mundial (Worldwide)"];
const DURATIONS = ["1 Año", "3 Años", "Perpetua (Proyecto Único)"];

export default function LicenseConfigurator() {
  const router = useRouter();
  const [usage, setUsage] = useState(USAGE_TYPES[0].id);
  const [territory, setTerritory] = useState(TERRITORIES[1]);
  const [duration, setDuration] = useState(DURATIONS[0]);

  const currentUsage =
    USAGE_TYPES.find((u) => u.id === usage) ?? USAGE_TYPES[0];

  const handleRequestLicense = () => {
    const summary = `${currentUsage.label} · Territorio: ${territory} · Duración: ${duration}`;
    router.push(
      `/contact?motivo=licencia&tipo=${encodeURIComponent(summary)}`
    );
  };

  return (
    <section className="mt-16 border border-[#1D2021] bg-[#141617]/50 p-6 sm:p-10">
      <div className="flex flex-col justify-between gap-4 border-b border-[#1D2021] pb-5 sm:flex-row sm:items-end">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.35em] text-[#95836B]">
            Calculadora de Derechos de Reproducción
          </p>
          <h2 className="mt-2 font-serif text-3xl font-light text-[#D8D5CD]">
            Configurador de Licencia Comercial y Editorial
          </h2>
        </div>
        <a
          href="https://www.istockphoto.com/portfolio/JavierEspinosa?sort=purerecency&assettype=image"
          target="_blank"
          rel="noopener noreferrer"
          className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#95836B] underline decoration-[#95836B]/50 underline-offset-4 hover:text-white"
        >
          ¿Licencia estándar inmediata? Ir a Getty Images / iStock ↗
        </a>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Controls (7 cols) */}
        <div className="space-y-6 lg:col-span-7">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#95836B]">
              01 · Modalidad de Uso
            </p>
            <div className="mt-2.5 grid grid-cols-1 gap-2 sm:grid-cols-2">
              {USAGE_TYPES.map((u) => {
                const active = u.id === usage;
                return (
                  <button
                    key={u.id}
                    type="button"
                    onClick={() => setUsage(u.id)}
                    className={`border p-3.5 text-left transition ${
                      active
                        ? "border-[#95836B] bg-[#1D2021]/90 text-white"
                        : "border-[#1D2021] bg-[#101112]/70 text-[#D8D5CD]/75 hover:border-[#95836B]/50"
                    }`}
                  >
                    <p className="font-serif text-lg text-[#D8D5CD]">
                      {u.label}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#95836B]">
                02 · Alcance Geográfico
              </p>
              <div className="mt-2.5 flex flex-col gap-2">
                {TERRITORIES.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTerritory(t)}
                    className={`border px-3.5 py-2 text-left font-mono text-xs transition ${
                      territory === t
                        ? "border-[#95836B] bg-[#1D2021]/80 text-[#D8D5CD]"
                        : "border-[#1D2021] bg-[#101112]/60 text-neutral-400 hover:text-white"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#95836B]">
                03 · Duración de la Cesión
              </p>
              <div className="mt-2.5 flex flex-col gap-2">
                {DURATIONS.map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setDuration(d)}
                    className={`border px-3.5 py-2 text-left font-mono text-xs transition ${
                      duration === d
                        ? "border-[#95836B] bg-[#1D2021]/80 text-[#D8D5CD]"
                        : "border-[#1D2021] bg-[#101112]/60 text-neutral-400 hover:text-white"
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Summary Output (5 cols) */}
        <div className="flex flex-col justify-between border border-[#1D2021] bg-[#101112] p-6 sm:p-8 lg:col-span-5">
          <div>
            <div className="flex items-center justify-between border-b border-[#1D2021] pb-3 font-mono text-[10px] uppercase tracking-[0.25em] text-[#95836B]">
              <span>Certificado de Entrega</span>
              <span>32.5 MP MASTER</span>
            </div>

            <h3 className="mt-4 font-serif text-2xl text-[#D8D5CD]">
              {currentUsage.label}
            </h3>
            <p className="mt-2 text-xs font-light leading-relaxed text-[#D8D5CD]/80">
              {currentUsage.rights}
            </p>

            <div className="mt-5 space-y-2.5 border-t border-[#1D2021] pt-4 font-mono text-xs">
              <div>
                <span className="block text-[9px] uppercase tracking-wider text-[#95836B]">
                  Archivo Entregado
                </span>
                <span className="text-[#D8D5CD]">{currentUsage.format}</span>
              </div>
              <div className="flex justify-between">
                <div>
                  <span className="block text-[9px] uppercase tracking-wider text-[#95836B]">
                    Territorio
                  </span>
                  <span className="text-[#D8D5CD]">{territory}</span>
                </div>
                <div>
                  <span className="block text-[9px] uppercase tracking-wider text-[#95836B]">
                    Vigencia
                  </span>
                  <span className="text-[#D8D5CD]">{duration}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-2.5 border-t border-[#1D2021] pt-5">
            <button
              type="button"
              onClick={handleRequestLicense}
              className="w-full border border-[#D8D5CD] bg-[#D8D5CD] px-5 py-3 font-mono text-xs font-semibold uppercase tracking-[0.22em] text-[#101112] transition hover:bg-transparent hover:text-white"
            >
              Solicitar Cotización Directa →
            </button>
            <a
              href="https://www.istockphoto.com/portfolio/JavierEspinosa?sort=purerecency&assettype=image"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full border border-[#1D2021] bg-[#141617] px-5 py-2.5 text-center font-mono text-[10px] uppercase tracking-[0.22em] text-[#D8D5CD] transition hover:border-[#95836B]"
            >
              Licenciar en Getty Images / iStock ↗
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
