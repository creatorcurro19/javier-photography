"use client";

import React, { useMemo, useState } from "react";
import type { Photo, PhotoCategory } from "@/types/photo";
import { PHOTO_CATEGORIES, CATEGORY_METADATA } from "@/types/photo";
import { CloseIcon, CheckIcon } from "./AdminIcons";

interface BulkPricesModalProps {
  works: Photo[];
  initialScope: "all" | PhotoCategory;
  isSaving: boolean;
  onClose: () => void;
  onApply: (params: {
    scope: "all" | PhotoCategory;
    mode: "set" | "delta";
    estudio?: number;
    galeria?: number;
    coleccion?: number;
    deltaAmount?: number;
    editionTotal?: number;
    prints?: boolean;
  }) => Promise<void>;
}

const inputClass =
  "w-full rounded-lg border border-[#2D3036] bg-[#17181D] px-3.5 py-2.5 text-sm text-[#EBE7DF] placeholder-[#5E5A53] focus:border-[#C5A880] focus:outline-none";
const labelClass = "block text-xs font-mono uppercase tracking-wider text-[#A39E93] mb-1";

export default function BulkPricesModal({
  works,
  initialScope,
  isSaving,
  onClose,
  onApply,
}: BulkPricesModalProps) {
  const [scope, setScope] = useState<"all" | PhotoCategory>(initialScope);
  const [mode, setMode] = useState<"set" | "delta">("set");
  const [estudio, setEstudio] = useState(95);
  const [galeria, setGaleria] = useState(175);
  const [coleccion, setColeccion] = useState(290);
  const [editionTotal, setEditionTotal] = useState(25);
  const [deltaAmount, setDeltaAmount] = useState(10);
  const [printsAction, setPrintsAction] = useState<"keep" | "on" | "off">("keep");

  const targetCount = useMemo(() => {
    if (scope === "all") return works.length;
    return works.filter((w) => w.category === scope).length;
  }, [works, scope]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onApply({
      scope,
      mode,
      estudio: mode === "set" ? estudio : undefined,
      galeria: mode === "set" ? galeria : undefined,
      coleccion: mode === "set" ? coleccion : undefined,
      editionTotal: mode === "set" ? editionTotal : undefined,
      deltaAmount: mode === "delta" ? deltaAmount : undefined,
      prints:
        printsAction === "on"
          ? true
          : printsAction === "off"
          ? false
          : undefined,
    });
  };

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-lg rounded-2xl border border-[#2B2E36] bg-[#121316] text-[#EBE7DF] shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between border-b border-[#22242B] px-5 py-4 bg-[#16171B]">
          <div>
            <span className="font-mono text-[10px] uppercase tracking-wider text-[#C5A880]">
              Edición Masiva de Tarifas Fine Art
            </span>
            <h2 className="font-serif text-lg font-medium text-[#EBE7DF]">
              Ajustar precios en bloque
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-lg text-[#A39E93] hover:bg-[#202228] hover:text-[#EBE7DF] transition cursor-pointer"
          >
            <CloseIcon className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className={labelClass}>¿A qué fotografías aplicar el cambio?</label>
            <select
              value={scope}
              onChange={(e) => setScope(e.target.value as "all" | PhotoCategory)}
              className={inputClass}
            >
              <option value="all">Todo el catálogo ({works.length} obras)</option>
              {PHOTO_CATEGORIES.map((cat) => {
                const c = works.filter((w) => w.category === cat).length;
                return (
                  <option key={cat} value={cat}>
                    Solo {CATEGORY_METADATA[cat]?.title} ({c} obras)
                  </option>
                );
              })}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-2 rounded-xl border border-[#24262E] bg-[#16171C] p-1.5">
            <button
              type="button"
              onClick={() => setMode("set")}
              className={`rounded-lg py-2 text-xs font-medium transition cursor-pointer ${
                mode === "set"
                  ? "bg-[#C5A880] text-[#0B0C0E] font-semibold"
                  : "text-[#A39E93] hover:text-[#EBE7DF]"
              }`}
            >
              Fijar precios exactos
            </button>
            <button
              type="button"
              onClick={() => setMode("delta")}
              className={`rounded-lg py-2 text-xs font-medium transition cursor-pointer ${
                mode === "delta"
                  ? "bg-[#C5A880] text-[#0B0C0E] font-semibold"
                  : "text-[#A39E93] hover:text-[#EBE7DF]"
              }`}
            >
              Subir / bajar importe (±€)
            </button>
          </div>

          {mode === "set" ? (
            <div className="space-y-3 rounded-xl border border-[#24262E] bg-[#15161B] p-4">
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className={labelClass}>Estudio (€)</label>
                  <input
                    type="number"
                    inputMode="numeric"
                    min={20}
                    value={estudio}
                    onChange={(e) => setEstudio(parseInt(e.target.value, 10) || 95)}
                    className={`${inputClass} font-mono font-semibold`}
                  />
                </div>
                <div>
                  <label className={labelClass}>Galería (€)</label>
                  <input
                    type="number"
                    inputMode="numeric"
                    min={20}
                    value={galeria}
                    onChange={(e) => setGaleria(parseInt(e.target.value, 10) || 175)}
                    className={`${inputClass} font-mono font-semibold`}
                  />
                </div>
                <div>
                  <label className={labelClass}>Colección (€)</label>
                  <input
                    type="number"
                    inputMode="numeric"
                    min={20}
                    value={coleccion}
                    onChange={(e) => setColeccion(parseInt(e.target.value, 10) || 290)}
                    className={`${inputClass} font-mono font-semibold`}
                  />
                </div>
              </div>
              <div>
                <label className={labelClass}>Tirada máxima (copias por edición)</label>
                <input
                  type="number"
                  inputMode="numeric"
                  min={1}
                  value={editionTotal}
                  onChange={(e) => setEditionTotal(parseInt(e.target.value, 10) || 25)}
                  className={`${inputClass} font-mono`}
                />
              </div>
            </div>
          ) : (
            <div className="space-y-3 rounded-xl border border-[#24262E] bg-[#15161B] p-4">
              <label className={labelClass}>
                Importe en euros a sumar o restar a cada formato (ej. 15 o -10)
              </label>
              <input
                type="number"
                inputMode="numeric"
                value={deltaAmount}
                onChange={(e) => setDeltaAmount(parseInt(e.target.value, 10) || 0)}
                className={`${inputClass} font-mono text-base font-semibold`}
              />
              <div className="flex flex-wrap gap-2">
                {[-20, -10, -5, 5, 10, 20, 30].map((v) => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => setDeltaAmount(v)}
                    className={`rounded-lg border px-2.5 py-1 font-mono text-xs transition cursor-pointer ${
                      deltaAmount === v
                        ? "border-[#C5A880] bg-[#C5A880]/20 text-[#C5A880]"
                        : "border-[#2D3038] bg-[#191B21] text-[#A39E93] hover:text-[#EBE7DF]"
                    }`}
                  >
                    {v > 0 ? `+${v} €` : `${v} €`}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div>
            <label className={labelClass}>Estado de venta Fine Art en este grupo</label>
            <select
              value={printsAction}
              onChange={(e) => setPrintsAction(e.target.value as "keep" | "on" | "off")}
              className={inputClass}
            >
              <option value="keep">Mantener como está cada foto</option>
              <option value="on">Activar venta en todas ({targetCount} obras)</option>
              <option value="off">Pausar venta en todas ({targetCount} obras)</option>
            </select>
          </div>

          <div className="flex items-center justify-end gap-2.5 border-t border-[#22242B] pt-4">
            <button
              type="button"
              onClick={onClose}
              className="min-h-[44px] rounded-lg border border-[#30333C] px-4 text-xs font-medium text-[#A39E93] hover:text-[#EBE7DF] transition cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSaving || targetCount === 0}
              className="inline-flex min-h-[44px] items-center gap-2 rounded-lg bg-gradient-to-r from-[#C5A880] to-[#A88C64] px-5 text-xs font-semibold uppercase tracking-wider text-[#0B0C0E] hover:opacity-90 disabled:opacity-50 transition cursor-pointer"
            >
              {isSaving ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-[#0B0C0E] border-t-transparent" />
                  <span>Aplicando…</span>
                </>
              ) : (
                <>
                  <CheckIcon className="h-4 w-4 text-[#0B0C0E]" />
                  <span>Aplicar a {targetCount} obras</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
