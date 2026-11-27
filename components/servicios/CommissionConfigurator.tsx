"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getPlazos } from "@/data/plazos";
import { useLanguage } from "@/lib/i18n";

const SCOPES = [
  {
    id: "rally-motor",
    labelEs: "Rally & Automovilismo",
    labelEn: "Rally & Motorsport",
    opticalKitEs: "Canon EOS R7 + Sigma 150–600mm + RF-S 18–150mm",
    opticalKitEn: "Canon EOS R7 + Sigma 150–600mm + RF-S 18–150mm",
    getTurnaround: (lang: "es" | "en") => {
      const p = getPlazos(lang);
      return `${p.rallyPrensa} · ${p.reportajes}`;
    },
    summaryEs:
      "Cobertura en tramos cerrados, horquillas técnicas, asistencia mecánica y presentaciones de vehículos clásicos o de competición.",
    summaryEn:
      "Coverage across closed special stages, hairpins, service park mechanics, and classic or competition vehicle launches.",
  },
  {
    id: "arquitectura-territorio",
    labelEs: "Arquitectura & Patrimonio",
    labelEn: "Architecture & Heritage",
    opticalKitEs: "Canon EOS R7 + EF-S 10–18mm + RF-S 18–150mm",
    opticalKitEn: "Canon EOS R7 + EF-S 10–18mm + RF-S 18–150mm",
    getTurnaround: (lang: "es" | "en") => getPlazos(lang).reportajes,
    summaryEs:
      "Estudio lumínico diurno/crepuscular, control de fugas geométricas y texturas constructivas para estudios, hoteles y patrimonio.",
    summaryEn:
      "Daylight and twilight lighting study, strict perspective alignment, and material detail for architects, boutique hotels, and heritage.",
  },
  {
    id: "documental-editorial",
    labelEs: "Documental & Editorial",
    labelEn: "Documentary & Editorial",
    opticalKitEs: "Canon EOS R7 + RF-S 18–150mm + Teleobjetivo 600mm",
    opticalKitEn: "Canon EOS R7 + RF-S 18–150mm + 600mm Telephoto",
    getTurnaround: (lang: "es" | "en") => getPlazos(lang).reportajes,
    summaryEs:
      "Crónica visual en localización sobre territorio, naturaleza, oficios y reportajes para revistas, editoriales e instituciones.",
    summaryEn:
      "On-location visual chronicle exploring place, nature, crafts, and features for magazines, publishers, and institutions.",
  },
  {
    id: "prints-interiorismo",
    labelEs: "Fine Art & Interiorismo",
    labelEn: "Fine Art & Interiors",
    opticalKitEs: "Impresión Giclée 12 tintas · Hahnemühle Photo Rag 308g",
    opticalKitEn: "12-pigment Giclée Print · Hahnemühle Photo Rag 308g",
    getTurnaround: (lang: "es" | "en") => getPlazos(lang).copias,
    summaryEs:
      "Comisariado a medida de obra gráfica firmada y seriada para proyectos de interiorismo residencial, corporativo u hotelero.",
    summaryEn:
      "Tailored curation of signed limited-edition prints for residential, corporate, and hospitality interiors.",
  },
];

const DURATIONS = [
  { id: "Media jornada", es: "Media Jornada", en: "Half Day", detailEs: "Sesión focalizada de medio día", detailEn: "Focused half-day session" },
  { id: "Jornada completa", es: "Jornada Completa", en: "Full Day", detailEs: "Luz de mañana a crepúsculo", detailEn: "Morning light through dusk" },
  { id: "Múltiples jornadas", es: "Múltiples Jornadas", en: "Multi-Day", detailEs: "Cobertura integral en varias jornadas", detailEn: "Comprehensive multi-day assignment" },
];

const DELIVERABLES = [
  {
    id: "gallery",
    es: "Galería Privada Máster 32.5 MP (TIFF/JPEG)",
    en: "Private 32.5 MP Master Gallery (TIFF/JPEG)",
  },
  {
    id: "press",
    es: "Selección prioritaria para prensa (a convenir)",
    en: "Priority press selection (by arrangement)",
  },
  {
    id: "license",
    es: "Licencia de Uso Comercial / Editorial",
    en: "Commercial / Editorial Usage License",
  },
  {
    id: "prints",
    es: "Copias Físicas Fine Art Hahnemühle 308g",
    en: "Physical Fine Art Prints on Hahnemühle 308g",
  },
];

export default function CommissionConfigurator() {
  const { lang, t, href } = useLanguage();
  const router = useRouter();
  const [selectedScope, setSelectedScope] = useState(SCOPES[0].id);
  const [selectedDuration, setSelectedDuration] = useState(DURATIONS[1].id);
  const [selectedDeliverables, setSelectedDeliverables] = useState<string[]>([
    "gallery",
    "license",
  ]);

  const currentScope =
    SCOPES.find((s) => s.id === selectedScope) ?? SCOPES[0];
  const currentDurationObj =
    DURATIONS.find((d) => d.id === selectedDuration) ?? DURATIONS[1];

  const toggleDeliverable = (id: string) => {
    setSelectedDeliverables((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const deliverableLabels = selectedDeliverables.map((id) => {
    const found = DELIVERABLES.find((d) => d.id === id);
    return found ? (lang === "en" ? found.en : found.es) : id;
  });

  const handleLaunchBrief = () => {
    const scopeLabel = lang === "en" ? currentScope.labelEn : currentScope.labelEs;
    const durationLabel = lang === "en" ? currentDurationObj.en : currentDurationObj.es;
    const refText = `${scopeLabel} · ${durationLabel} · ${t("Entregables:", "Deliverables:")} ${
      deliverableLabels.join(" + ") || t("Estándar", "Standard")
    }`;
    router.push(
      href(
        `/contact?servicio=${encodeURIComponent(
          currentScope.id
        )}&formato=${encodeURIComponent(refText)}`
      )
    );
  };

  return (
    <section className="mt-20 border border-[#202226] bg-[#151618]/50 p-6 sm:p-10 lg:p-12">
      <div className="flex flex-col justify-between gap-4 border-b border-[#202226] pb-6 sm:flex-row sm:items-end">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.35em] text-[#8E8A80]">
            {t("Planificador Interactivo de Proyecto", "Interactive Assignment Brief Builder")}
          </p>
          <h2 className="mt-2 font-serif text-3xl font-light text-[#EBE7DF] sm:text-4xl">
            {t("Configura el alcance de tu encargo", "Configure your commission scope")}
          </h2>
        </div>
        <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-neutral-400">
          {t("Prepara tu solicitud en 3 pasos →", "Prepare your brief in 3 steps →")}
        </span>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-12">
        {/* Left: Interactive Controls (7 cols) */}
        <div className="space-y-8 lg:col-span-7">
          {/* Step 1 */}
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-[#8E8A80]">
              {t("01 · Selecciona la Disciplina del Encargo", "01 · Select Commission Discipline")}
            </p>
            <div className="mt-3 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
              {SCOPES.map((scope) => {
                const active = scope.id === selectedScope;
                return (
                  <button
                    key={scope.id}
                    type="button"
                    onClick={() => setSelectedScope(scope.id)}
                    className={`border p-4 text-left transition-all ${
                      active
                        ? "border-[#8E8A80] bg-[#202226]/90 text-white"
                        : "border-[#202226] bg-[#0B0C0E]/70 text-[#EBE7DF]/75 hover:border-[#8E8A80]/50"
                    }`}
                  >
                    <p className="font-serif text-lg text-[#EBE7DF]">
                      {lang === "en" ? scope.labelEn : scope.labelEs}
                    </p>
                    <p className="mt-1 line-clamp-1 font-mono text-[10px] text-neutral-400">
                      {scope.getTurnaround(lang)}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 2 */}
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-[#8E8A80]">
              {t("02 · Duración o Escala de Producción", "02 · Production Duration & Scale")}
            </p>
            <div className="mt-3 grid grid-cols-1 gap-2.5 sm:grid-cols-3">
              {DURATIONS.map((dur) => {
                const active = dur.id === selectedDuration;
                return (
                  <button
                    key={dur.id}
                    type="button"
                    onClick={() => setSelectedDuration(dur.id)}
                    className={`border p-3.5 text-left transition-all ${
                      active
                        ? "border-[#8E8A80] bg-[#202226]/90 text-white"
                        : "border-[#202226] bg-[#0B0C0E]/70 text-[#EBE7DF]/75 hover:border-[#8E8A80]/50"
                    }`}
                  >
                    <p className="font-serif text-base text-[#EBE7DF]">
                      {lang === "en" ? dur.en : dur.es}
                    </p>
                    <p className="mt-0.5 font-mono text-[10px] text-neutral-400">
                      {lang === "en" ? dur.detailEn : dur.detailEs}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 3 */}
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-[#8E8A80]">
              {t("03 · Entregables y Licencias Requeridas", "03 · Deliverables & Licensing Scope")}
            </p>
            <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
              {DELIVERABLES.map((item) => {
                const checked = selectedDeliverables.includes(item.id);
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => toggleDeliverable(item.id)}
                    className={`flex items-center gap-3 border px-3.5 py-2.5 text-left text-xs transition ${
                      checked
                        ? "border-[#8E8A80]/80 bg-[#8E8A80]/15 text-[#EBE7DF]"
                        : "border-[#202226] bg-[#0B0C0E]/60 text-neutral-400 hover:border-[#8E8A80]/40"
                    }`}
                  >
                    <span
                      className={`flex h-4 w-4 shrink-0 items-center justify-center border text-[10px] ${
                        checked
                          ? "border-[#8E8A80] bg-[#8E8A80] text-[#0B0C0E]"
                          : "border-[#202226]"
                      }`}
                    >
                      {checked ? "✓" : ""}
                    </span>
                    <span className="font-light">{lang === "en" ? item.en : item.es}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right: Live Technical Specification Sheet (5 cols) */}
        <div className="flex flex-col justify-between border border-[#202226] bg-[#0B0C0E] p-6 sm:p-8 lg:col-span-5">
          <div>
            <div className="flex items-center justify-between border-b border-[#202226] pb-3 font-mono text-[10px] uppercase tracking-[0.26em] text-[#8E8A80]">
              <span>{t("Ficha de Producción", "Production Spec Sheet")}</span>
              <span>EOS R7 SYSTEM</span>
            </div>

            <h3 className="mt-5 font-serif text-2xl text-[#EBE7DF]">
              {lang === "en" ? currentScope.labelEn : currentScope.labelEs}
            </h3>
            <p className="mt-2 text-xs font-light leading-relaxed text-[#EBE7DF]/75">
              {lang === "en" ? currentScope.summaryEn : currentScope.summaryEs}
            </p>

            <div className="mt-6 space-y-3 border-t border-[#202226] pt-5 font-mono text-xs">
              <div>
                <span className="block text-[9px] uppercase tracking-[0.22em] text-[#8E8A80]">
                  {t("Despliegue Óptico Previsto", "Planned Optical Kit")}
                </span>
                <span className="text-[#EBE7DF]">
                  {lang === "en" ? currentScope.opticalKitEn : currentScope.opticalKitEs}
                </span>
              </div>
              <div>
                <span className="block text-[9px] uppercase tracking-[0.22em] text-[#8E8A80]">
                  {t("Escala Temporal", "Time Scale")}
                </span>
                <span className="text-[#EBE7DF]">
                  {lang === "en" ? currentDurationObj.en : currentDurationObj.es}
                </span>
              </div>
              <div>
                <span className="block text-[9px] uppercase tracking-[0.22em] text-[#8E8A80]">
                  {t("Plazo de Entrega", "Delivery Timeline")}
                </span>
                <span className="text-[#EBE7DF]">{currentScope.getTurnaround(lang)}</span>
              </div>
              <div>
                <span className="block text-[9px] uppercase tracking-[0.22em] text-[#8E8A80]">
                  {t(
                    `Entregables Seleccionados (${selectedDeliverables.length})`,
                    `Selected Deliverables (${selectedDeliverables.length})`
                  )}
                </span>
                <span className="text-[11px] text-neutral-300">
                  {deliverableLabels.join(" · ") || t("A definir en consulta", "To be defined upon inquiry")}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-8 border-t border-[#202226] pt-5">
            <button
              type="button"
              onClick={handleLaunchBrief}
              className="w-full border border-[#EBE7DF] bg-[#EBE7DF] px-6 py-3.5 font-mono text-xs font-semibold uppercase tracking-[0.25em] text-[#0B0C0E] transition hover:bg-transparent hover:text-white"
            >
              {t("Solicitar Presupuesto con esta Ficha →", "Request Quote from this Brief →")}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
