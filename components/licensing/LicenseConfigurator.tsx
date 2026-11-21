"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { WORKS } from "@/data/works";
import { CATEGORY_METADATA } from "@/types/photo";

const USAGE_TYPES = [
  {
    id: "Editorial y Prensa",
    label: "Editorial y Prensa",
    priceFrom: "Desde 60 €",
    format: "TIFF 16-bit Sin Comprimir / JPEG Máxima Calidad · 300 DPI · Adobe RGB",
    rights: "Derechos de reproducción no exclusivos para una edición o artículo editorial.",
  },
  {
    id: "Campaña Digital y Web",
    label: "Campaña Digital y Web",
    priceFrom: "Desde 45 €",
    format: "TIFF 16-bit Máster + sRGB / WebP Alta Densidad · 6960 × 4640 px",
    rights: "Uso en cabeceras corporativas, redes sociales y medios digitales.",
  },
  {
    id: "Publicidad y Marca",
    label: "Publicidad y Marca",
    priceFrom: "Desde 150 €",
    format: "TIFF 16-bit Sin Comprimir · ProPhoto / Adobe RGB · 32,5 MP",
    rights: "Cesión comercial multiplataforma para campañas de marca y exterior.",
  },
  {
    id: "Exclusividad Sectorial",
    label: "Exclusividad Sectorial",
    priceFrom: "Desde 350 €",
    format: "Archivo Máster RAW / TIFF 16-bit + Certificado de Exclusividad",
    rights: "Bloqueo temporal de la obra para competidores del mismo sector.",
  },
];

const TERRITORIES = ["España (Nacional)", "Unión Europea", "Mundial"];
const DURATIONS = ["1 Año", "3 Años", "Perpetua (Proyecto Único)"];

export default function LicenseConfigurator() {
  const router = useRouter();
  const [selectedWork, setSelectedWork] = useState<string>("Por definir (Consulta general de archivo)");
  const [usage, setUsage] = useState(USAGE_TYPES[0].id);
  const [territory, setTerritory] = useState(TERRITORIES[1]);
  const [duration, setDuration] = useState(DURATIONS[0]);

  const currentUsage =
    USAGE_TYPES.find((u) => u.id === usage) ?? USAGE_TYPES[0];

  const handleRequestLicense = () => {
    router.push(
      `/contact?motivo=licencia&obra=${encodeURIComponent(selectedWork)}&uso=${encodeURIComponent(currentUsage.label)}&territorio=${encodeURIComponent(territory)}&duracion=${encodeURIComponent(duration)}`
    );
  };

  return (
    <section className="mt-16 border border-[#202226] bg-[#151618]/50 p-6 sm:p-10">
      <div className="flex flex-col justify-between gap-4 border-b border-[#202226] pb-5 sm:flex-row sm:items-end">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.35em] text-[#8E8A80]">
            Calculadora de Derechos de Reproducción
          </p>
          <h2 className="mt-2 font-serif text-3xl font-light text-[#EBE7DF]">
            Configurador de Licencia Comercial y Editorial
          </h2>
        </div>
        <a
          href="https://www.istockphoto.com/portfolio/JavierEspinosa?sort=purerecency&assettype=image"
          target="_blank"
          rel="noopener noreferrer"
          className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#8E8A80] underline decoration-[#8E8A80]/50 underline-offset-4 hover:text-white"
        >
          ¿Licencia estándar inmediata? Ir a Getty Images / iStock ↗
        </a>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Controls (7 cols) */}
        <div className="space-y-6 lg:col-span-7">
          <div>
            <label
              htmlFor="license-work-select"
              className="block font-mono text-[10px] uppercase tracking-[0.25em] text-[#A39E93]"
            >
              00 · Obra del Archivo a Licenciar
            </label>
            <select
              id="license-work-select"
              value={selectedWork}
              onChange={(e) => setSelectedWork(e.target.value)}
              className="mt-2 w-full border border-[#202226] bg-[#0B0C0E] px-4 py-3 font-mono text-xs text-[#EBE7DF] focus:border-[#C5A880] focus:outline-none"
            >
              <option value="Por definir (Consulta general de archivo)">
                Por definir (Consulta general de archivo)
              </option>
              {WORKS.map((w) => (
                <option key={w.id} value={`${w.title} (${w.id})`}>
                  {w.title} — {w.location ?? CATEGORY_METADATA[w.category]?.title ?? w.category} ({w.year})
                </option>
              ))}
            </select>
          </div>

          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#A39E93]">
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
                        ? "border-[#C5A880] bg-[#202226]/90 text-white"
                        : "border-[#202226] bg-[#0B0C0E]/70 text-[#EBE7DF]/75 hover:border-[#A39E93]/50"
                    }`}
                  >
                    <p className="font-serif text-lg text-[#EBE7DF]">
                      {u.label}
                    </p>
                    <p className="mt-1 font-mono text-[10px] text-[#C5A880]">
                      {u.priceFrom}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#8E8A80]">
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
                        ? "border-[#8E8A80] bg-[#202226]/80 text-[#EBE7DF]"
                        : "border-[#202226] bg-[#0B0C0E]/60 text-neutral-400 hover:text-white"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#8E8A80]">
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
                        ? "border-[#8E8A80] bg-[#202226]/80 text-[#EBE7DF]"
                        : "border-[#202226] bg-[#0B0C0E]/60 text-neutral-400 hover:text-white"
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
        <div className="flex flex-col justify-between border border-[#202226] bg-[#0B0C0E] p-6 sm:p-8 lg:col-span-5">
          <div>
            <div className="flex items-center justify-between border-b border-[#202226] pb-3 font-mono text-[10px] uppercase tracking-[0.25em] text-[#8E8A80]">
              <span>Certificado de Entrega</span>
              <span>32.5 MP MASTER</span>
            </div>

            <h3 className="mt-4 font-serif text-2xl text-[#EBE7DF]">
              {currentUsage.label}
            </h3>
            <p className="mt-2 text-xs font-light leading-relaxed text-[#EBE7DF]/80">
              {currentUsage.rights}
            </p>

            <div className="mt-5 space-y-2.5 border-t border-[#202226] pt-4 font-mono text-xs">
              <div>
                <span className="block text-[9px] uppercase tracking-wider text-[#A39E93]">
                  Obra Seleccionada
                </span>
                <span className="text-[#EBE7DF]">{selectedWork}</span>
              </div>
              <div>
                <span className="block text-[9px] uppercase tracking-wider text-[#A39E93]">
                  Tarifa Base Orientativa
                </span>
                <span className="text-[#C5A880]">{currentUsage.priceFrom}</span>
              </div>
              <div>
                <span className="block text-[9px] uppercase tracking-wider text-[#A39E93]">
                  Archivo Entregado (Unificado TIFF 16-bit)
                </span>
                <span className="text-[#EBE7DF]">{currentUsage.format}</span>
              </div>
              <div className="flex justify-between">
                <div>
                  <span className="block text-[9px] uppercase tracking-wider text-[#8E8A80]">
                    Territorio
                  </span>
                  <span className="text-[#EBE7DF]">{territory}</span>
                </div>
                <div>
                  <span className="block text-[9px] uppercase tracking-wider text-[#8E8A80]">
                    Vigencia
                  </span>
                  <span className="text-[#EBE7DF]">{duration}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-2.5 border-t border-[#202226] pt-5">
            <button
              type="button"
              onClick={handleRequestLicense}
              className="w-full border border-[#EBE7DF] bg-[#EBE7DF] px-5 py-3 font-mono text-xs font-semibold uppercase tracking-[0.22em] text-[#0B0C0E] transition hover:bg-transparent hover:text-white"
            >
              Solicitar Cotización Directa →
            </button>
            <a
              href="https://www.istockphoto.com/portfolio/JavierEspinosa?sort=purerecency&assettype=image"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full border border-[#202226] bg-[#151618] px-5 py-2.5 text-center font-mono text-[10px] uppercase tracking-[0.22em] text-[#EBE7DF] transition hover:border-[#8E8A80]"
            >
              Licenciar en Getty Images / iStock ↗
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
