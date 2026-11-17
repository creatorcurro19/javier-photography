"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const SCOPES = [
  {
    id: "rally-motor",
    label: "Rally & Automovilismo",
    opticalKit: "Canon EOS R7 + Sigma 150–600mm + RF-S 18–150mm",
    turnaround: "Adelanto prensa 24h · Galería completa 48–72h",
    summary:
      "Cobertura en tramos cerrados, horquillas técnicas, asistencia mecánica y presentaciones de vehículos clásicos o de competición.",
  },
  {
    id: "arquitectura-territorio",
    label: "Arquitectura & Patrimonio",
    opticalKit: "Canon EOS R7 + EF-S 10–18mm + RF-S 18–150mm",
    turnaround: "Entrega calibrada en 3 a 5 días laborables",
    summary:
      "Estudio lumínico diurno/crepuscular, control de fugas geométricas y texturas constructivas para estudios, hoteles y patrimonio.",
  },
  {
    id: "documental-editorial",
    label: "Documental & Editorial",
    opticalKit: "Canon EOS R7 + RF-S 18–150mm + Teleobjetivo 600mm",
    turnaround: "Según extensión del reportaje (4 a 7 días)",
    summary:
      "Crónica visual en localización sobre territorio, naturaleza, oficios y reportajes para revistas, editoriales e instituciones.",
  },
  {
    id: "prints-interiorismo",
    label: "Fine Art & Interiorismo",
    opticalKit: "Impresión Giclée 12 tintas · Hahnemühle Photo Rag 308g",
    turnaround: "Producción de laboratorio y envío en 5–10 días",
    summary:
      "Comisariado a medida de obra gráfica firmada y seriada para proyectos de interiorismo residencial, corporativo u hotelero.",
  },
];

const DURATIONS = [
  { id: "Media jornada (4h)", label: "Media Jornada", detail: "Sesión focalizada (4 horas)" },
  { id: "Jornada completa (1 día)", label: "Jornada Completa", detail: "Luz de mañana a crepúsculo (1 día)" },
  { id: "Evento / Expedición (2-4 días)", label: "Múltiples Jornadas", detail: "Cobertura integral (2 a 4 días)" },
];

const DELIVERABLES = [
  "Galería Privada Máster 32.5 MP (TIFF/JPEG)",
  "Adelanto Express para Prensa (24h)",
  "Licencia de Uso Comercial / Editorial",
  "Copias Físicas Fine Art Hahnemühle 308g",
];

export default function CommissionConfigurator() {
  const router = useRouter();
  const [selectedScope, setSelectedScope] = useState(SCOPES[0].id);
  const [selectedDuration, setSelectedDuration] = useState(DURATIONS[1].id);
  const [selectedDeliverables, setSelectedDeliverables] = useState<string[]>([
    DELIVERABLES[0],
    DELIVERABLES[2],
  ]);

  const currentScope =
    SCOPES.find((s) => s.id === selectedScope) ?? SCOPES[0];

  const toggleDeliverable = (item: string) => {
    setSelectedDeliverables((prev) =>
      prev.includes(item) ? prev.filter((x) => x !== item) : [...prev, item]
    );
  };

  const handleLaunchBrief = () => {
    const refText = `${currentScope.label} · ${selectedDuration} · Entregables: ${
      selectedDeliverables.join(" + ") || "Estándar"
    }`;
    router.push(
      `/contact?servicio=${encodeURIComponent(
        currentScope.id
      )}&formato=${encodeURIComponent(refText)}`
    );
  };

  return (
    <section className="mt-20 border border-[#202226] bg-[#151618]/50 p-6 sm:p-10 lg:p-12">
      <div className="flex flex-col justify-between gap-4 border-b border-[#202226] pb-6 sm:flex-row sm:items-end">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.35em] text-[#8E8A80]">
            Planificador Interactivo de Proyecto
          </p>
          <h2 className="mt-2 font-serif text-3xl font-light text-[#EBE7DF] sm:text-4xl">
            Configura el alcance de tu encargo
          </h2>
        </div>
        <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-neutral-400">
          Prepara tu solicitud en 3 pasos →
        </span>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-12">
        {/* Left: Interactive Controls (7 cols) */}
        <div className="space-y-8 lg:col-span-7">
          {/* Step 1 */}
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-[#8E8A80]">
              01 · Selecciona la Disciplina del Encargo
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
                      {scope.label}
                    </p>
                    <p className="mt-1 line-clamp-1 font-mono text-[10px] text-neutral-400">
                      {scope.turnaround}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 2 */}
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-[#8E8A80]">
              02 · Duración o Escala de Producción
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
                      {dur.label}
                    </p>
                    <p className="mt-0.5 font-mono text-[10px] text-neutral-400">
                      {dur.detail}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 3 */}
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-[#8E8A80]">
              03 · Entregables y Licencias Requeridas
            </p>
            <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
              {DELIVERABLES.map((item) => {
                const checked = selectedDeliverables.includes(item);
                return (
                  <button
                    key={item}
                    type="button"
                    onClick={() => toggleDeliverable(item)}
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
                    <span className="font-light">{item}</span>
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
              <span>Ficha de Producción</span>
              <span>EOS R7 SYSTEM</span>
            </div>

            <h3 className="mt-5 font-serif text-2xl text-[#EBE7DF]">
              {currentScope.label}
            </h3>
            <p className="mt-2 text-xs font-light leading-relaxed text-[#EBE7DF]/75">
              {currentScope.summary}
            </p>

            <div className="mt-6 space-y-3 border-t border-[#202226] pt-5 font-mono text-xs">
              <div>
                <span className="block text-[9px] uppercase tracking-[0.22em] text-[#8E8A80]">
                  Despliegue Óptico Previsto
                </span>
                <span className="text-[#EBE7DF]">{currentScope.opticalKit}</span>
              </div>
              <div>
                <span className="block text-[9px] uppercase tracking-[0.22em] text-[#8E8A80]">
                  Escala Temporal
                </span>
                <span className="text-[#EBE7DF]">{selectedDuration}</span>
              </div>
              <div>
                <span className="block text-[9px] uppercase tracking-[0.22em] text-[#8E8A80]">
                  Plazo de Entrega Estimado
                </span>
                <span className="text-[#EBE7DF]">{currentScope.turnaround}</span>
              </div>
              <div>
                <span className="block text-[9px] uppercase tracking-[0.22em] text-[#8E8A80]">
                  Entregables Seleccionados ({selectedDeliverables.length})
                </span>
                <span className="text-[11px] text-neutral-300">
                  {selectedDeliverables.join(" · ") || "A definir en consulta"}
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
              Solicitar Presupuesto con esta Ficha →
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
