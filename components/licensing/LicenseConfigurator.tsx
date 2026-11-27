"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SITE_CONFIG } from "@/data/site-config";
import { WORKS } from "@/data/works";
import { CATEGORY_METADATA } from "@/types/photo";
import { useLanguage } from "@/lib/i18n";
import { getLocalizedPhoto } from "@/lib/i18n-works";

const USAGE_TYPES = [
  {
    id: "Editorial y Prensa",
    labelEs: "Editorial y Prensa",
    labelEn: "Editorial & Press",
    priceFromEs: "Desde\u00A060\u00A0€",
    priceFromEn: "From\u00A0€60",
    formatEs: "TIFF 16-bit Sin Comprimir / JPEG Máxima Calidad · 300 DPI · Adobe RGB",
    formatEn: "Uncompressed 16-bit TIFF / Max-Quality JPEG · 300 DPI · Adobe RGB",
    rightsEs: "Derechos de reproducción no exclusivos para una edición o artículo editorial.",
    rightsEn: "Non-exclusive reproduction rights for a print/digital issue or editorial article.",
  },
  {
    id: "Campaña Digital y Web",
    labelEs: "Campaña Digital y Web",
    labelEn: "Digital & Web Campaign",
    priceFromEs: "Desde\u00A045\u00A0€",
    priceFromEn: "From\u00A0€45",
    formatEs: "TIFF 16-bit Máster + sRGB / WebP Alta Densidad · 6960 × 4640 px",
    formatEn: "16-bit Master TIFF + High-DPI sRGB / WebP · 6960 × 4640 px",
    rightsEs: "Uso en cabeceras corporativas, redes sociales y medios digitales.",
    rightsEn: "Usage across corporate headers, social media, and digital publications.",
  },
  {
    id: "Publicidad y Marca",
    labelEs: "Publicidad y Marca",
    labelEn: "Commercial & Advertising",
    priceFromEs: "Desde\u00A0150\u00A0€",
    priceFromEn: "From\u00A0€150",
    formatEs: "TIFF 16-bit Sin Comprimir · ProPhoto / Adobe RGB · 32,5 MP",
    formatEn: "Uncompressed 16-bit TIFF · ProPhoto / Adobe RGB · 32.5 MP",
    rightsEs: "Cesión comercial multiplataforma para campañas de marca y exterior.",
    rightsEn: "Multi-channel commercial license for brand campaigns and out-of-home display.",
  },
  {
    id: "Exclusividad Sectorial",
    labelEs: "Exclusividad Sectorial",
    labelEn: "Sector Exclusivity",
    priceFromEs: "Desde\u00A0350\u00A0€",
    priceFromEn: "From\u00A0€350",
    formatEs: "Archivo Máster RAW / TIFF 16-bit + Certificado de Exclusividad",
    formatEn: "Master RAW / 16-bit TIFF File + Exclusivity Certificate",
    rightsEs: "Bloqueo temporal de la obra para competidores del mismo sector.",
    rightsEn: "Timed exclusivity blocking competing usage within the same industry.",
  },
];

const TERRITORIES = [
  { id: "España (Nacional)", es: "España (Nacional)", en: "Spain (National)" },
  { id: "Unión Europea", es: "Unión Europea", en: "European Union" },
  { id: "Mundial", es: "Mundial", en: "Worldwide (incl. US)" },
];

const DURATIONS = [
  { id: "1 Año", es: "1 Año", en: "1 Year" },
  { id: "3 Años", es: "3 Años", en: "3 Years" },
  { id: "Perpetua (Proyecto Único)", es: "Perpetua (Proyecto Único)", en: "Perpetual (Single Project)" },
];

export default function LicenseConfigurator() {
  const { lang, t, href } = useLanguage();
  const router = useRouter();
  const [selectedWork, setSelectedWork] = useState<string>("_default");
  const [usage, setUsage] = useState(USAGE_TYPES[0].id);
  const [territoryId, setTerritoryId] = useState(TERRITORIES[1].id);
  const [durationId, setDurationId] = useState(DURATIONS[0].id);

  const currentUsage =
    USAGE_TYPES.find((u) => u.id === usage) ?? USAGE_TYPES[0];
  const currentTerritory =
    TERRITORIES.find((item) => item.id === territoryId) ?? TERRITORIES[1];
  const currentDuration =
    DURATIONS.find((item) => item.id === durationId) ?? DURATIONS[0];

  const selectedWorkObj = WORKS.find((w) => w.id === selectedWork);
  const selectedWorkDisplay = selectedWorkObj
    ? `${getLocalizedPhoto(selectedWorkObj, lang).title} (${selectedWorkObj.id})`
    : t("Por definir (Consulta general de archivo)", "To be defined (General archive inquiry)");

  const handleRequestLicense = () => {
    const usageLabel = lang === "en" ? currentUsage.labelEn : currentUsage.labelEs;
    const territoryLabel = lang === "en" ? currentTerritory.en : currentTerritory.es;
    const durationLabel = lang === "en" ? currentDuration.en : currentDuration.es;
    router.push(
      href(
        `/contact?motivo=licencia&obra=${encodeURIComponent(selectedWorkDisplay)}&uso=${encodeURIComponent(usageLabel)}&territorio=${encodeURIComponent(territoryLabel)}&duracion=${encodeURIComponent(durationLabel)}`
      )
    );
  };

  return (
    <section className="mt-16 border border-[#202226] bg-[#151618]/50 p-6 sm:p-10">
      <div className="flex flex-col justify-between gap-4 border-b border-[#202226] pb-5 sm:flex-row sm:items-end">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.35em] text-[#8E8A80]">
            {t("Calculadora de Derechos de Reproducción", "Reproduction Rights Estimator")}
          </p>
          <h2 className="mt-2 font-serif text-3xl font-light text-[#EBE7DF]">
            {t("Configurador de Licencia Comercial y Editorial", "Editorial & Commercial License Configurator")}
          </h2>
        </div>
        <a
          href={SITE_CONFIG.social.getty}
          target="_blank"
          rel="noopener noreferrer"
          className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#8E8A80] underline decoration-[#8E8A80]/50 underline-offset-4 hover:text-white"
        >
          {t("¿Licencia estándar inmediata? Ir a Getty Images / iStock ↗", "Need an instant standard license? Getty Images / iStock ↗")}
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
              {t("00 · Obra del Archivo a Licenciar", "00 · Archive Photograph to License")}
            </label>
            <select
              id="license-work-select"
              value={selectedWork}
              onChange={(e) => setSelectedWork(e.target.value)}
              className="mt-2 w-full border border-[#202226] bg-[#0B0C0E] px-4 py-3 font-mono text-xs text-[#EBE7DF] focus:border-[#C5A880] focus:outline-none"
            >
              <option value="_default">
                {t("Por definir (Consulta general de archivo)", "To be defined (General archive inquiry)")}
              </option>
              {WORKS.map((rawW) => {
                const w = getLocalizedPhoto(rawW, lang);
                const catTitle = lang === "en" ? CATEGORY_METADATA[w.category]?.titleEn : CATEGORY_METADATA[w.category]?.title;
                return (
                  <option key={w.id} value={w.id}>
                    {w.title} — {w.location ?? catTitle ?? w.category} ({w.year})
                  </option>
                );
              })}
            </select>
          </div>

          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#A39E93]">
              {t("01 · Modalidad de Uso", "01 · Usage Scope")}
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
                      {lang === "en" ? u.labelEn : u.labelEs}
                    </p>
                    <p className="mt-1 font-mono text-[10px] text-[#C5A880]">
                      {lang === "en" ? u.priceFromEn : u.priceFromEs}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#8E8A80]">
                {t("02 · Alcance Geográfico", "02 · Territory")}
              </p>
              <div className="mt-2.5 flex flex-col gap-2">
                {TERRITORIES.map((ter) => (
                  <button
                    key={ter.id}
                    type="button"
                    onClick={() => setTerritoryId(ter.id)}
                    className={`border px-3.5 py-2 text-left font-mono text-xs transition ${
                      territoryId === ter.id
                        ? "border-[#8E8A80] bg-[#202226]/80 text-[#EBE7DF]"
                        : "border-[#202226] bg-[#0B0C0E]/60 text-neutral-400 hover:text-white"
                    }`}
                  >
                    {lang === "en" ? ter.en : ter.es}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#8E8A80]">
                {t("03 · Duración de la Cesión", "03 · License Duration")}
              </p>
              <div className="mt-2.5 flex flex-col gap-2">
                {DURATIONS.map((dur) => (
                  <button
                    key={dur.id}
                    type="button"
                    onClick={() => setDurationId(dur.id)}
                    className={`border px-3.5 py-2 text-left font-mono text-xs transition ${
                      durationId === dur.id
                        ? "border-[#8E8A80] bg-[#202226]/80 text-[#EBE7DF]"
                        : "border-[#202226] bg-[#0B0C0E]/60 text-neutral-400 hover:text-white"
                    }`}
                  >
                    {lang === "en" ? dur.en : dur.es}
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
              <span>{t("Certificado de Entrega", "Delivery Specification")}</span>
              <span>32.5 MP MASTER</span>
            </div>

            <h3 className="mt-4 font-serif text-2xl text-[#EBE7DF]">
              {lang === "en" ? currentUsage.labelEn : currentUsage.labelEs}
            </h3>
            <p className="mt-2 text-xs font-light leading-relaxed text-[#EBE7DF]/80">
              {lang === "en" ? currentUsage.rightsEn : currentUsage.rightsEs}
            </p>

            <div className="mt-5 space-y-2.5 border-t border-[#202226] pt-4 font-mono text-xs">
              <div>
                <span className="block text-[9px] uppercase tracking-wider text-[#A39E93]">
                  {t("Obra Seleccionada", "Selected Artwork")}
                </span>
                <span className="text-[#EBE7DF]">{selectedWorkDisplay}</span>
              </div>
              <div>
                <span className="block text-[9px] uppercase tracking-wider text-[#A39E93]">
                  {t("Tarifa Base Orientativa", "Indicative Base Fee")}
                </span>
                <span className="text-[#C5A880]">
                  {lang === "en" ? currentUsage.priceFromEn : currentUsage.priceFromEs}
                </span>
              </div>
              <div>
                <span className="block text-[9px] uppercase tracking-wider text-[#A39E93]">
                  {t("Archivo Entregado (Unificado TIFF 16-bit)", "Delivered File (Unified 16-bit TIFF)")}
                </span>
                <span className="text-[#EBE7DF]">
                  {lang === "en" ? currentUsage.formatEn : currentUsage.formatEs}
                </span>
              </div>
              <div className="flex justify-between">
                <div>
                  <span className="block text-[9px] uppercase tracking-wider text-[#8E8A80]">
                    {t("Territorio", "Territory")}
                  </span>
                  <span className="text-[#EBE7DF]">
                    {lang === "en" ? currentTerritory.en : currentTerritory.es}
                  </span>
                </div>
                <div>
                  <span className="block text-[9px] uppercase tracking-wider text-[#8E8A80]">
                    {t("Vigencia", "Duration")}
                  </span>
                  <span className="text-[#EBE7DF]">
                    {lang === "en" ? currentDuration.en : currentDuration.es}
                  </span>
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
              {t("Solicitar Cotización Directa →", "Request Direct Quote →")}
            </button>
            <a
              href={SITE_CONFIG.social.getty}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full border border-[#202226] bg-[#151618] px-5 py-2.5 text-center font-mono text-[10px] uppercase tracking-[0.22em] text-[#EBE7DF] transition hover:border-[#8E8A80]"
            >
              {t("Licenciar en Getty Images / iStock ↗", "License on Getty Images / iStock ↗")}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
