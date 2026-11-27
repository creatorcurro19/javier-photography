"use client";

import { useState } from "react";
import Image from "next/image";
import { BASE_PRINT_FORMATS, type PrintFormatId } from "@/data/formatos";
import type { SiteLang } from "@/lib/i18n-helpers";
import type { PrintFormat } from "@/types/cart";
import type { Photo } from "@/types/photo";

interface PrintWallPreviewProps {
  photo: Photo;
  formats: Record<PrintFormatId, PrintFormat>;
  selectedFormatId: PrintFormatId;
  onSelectFormat: (id: PrintFormatId) => void;
  lang: SiteLang;
}

const WALL_WIDTH_CM = 260;
const CONSOLE_WIDTH_CM = 180;

function parsePaperCm(dimensions: string, fallbackId: PrintFormatId): [number, number] {
  const nums = dimensions.match(/\d+(?:[.,]\d+)?/g);
  if (nums && nums.length >= 2) {
    const a = parseFloat(nums[0].replace(",", "."));
    const b = parseFloat(nums[1].replace(",", "."));
    if (Number.isFinite(a) && Number.isFinite(b) && a > 0 && b > 0) {
      return [a, b];
    }
  }
  const spec = BASE_PRINT_FORMATS[fallbackId].dimensions.match(/\d+/g) ?? ["30", "45"];
  return [parseInt(spec[0], 10), parseInt(spec[1], 10)];
}

export default function PrintWallPreview({
  photo,
  formats,
  selectedFormatId,
  onSelectFormat,
  lang,
}: PrintWallPreviewProps) {
  const [open, setOpen] = useState(true);
  const [wallTone, setWallTone] = useState<"light" | "dark">("light");

  const t = (es: string, en: string) => (lang === "en" ? en : es);
  const currentFormat = formats[selectedFormatId];
  const spec = BASE_PRINT_FORMATS[selectedFormatId];

  const [dimA, dimB] = parsePaperCm(currentFormat.dimensions, selectedFormatId);
  const isLandscape = photo.width >= photo.height;
  const paperWidthCm = isLandscape ? Math.max(dimA, dimB) : Math.min(dimA, dimB);
  const paperHeightCm = isLandscape ? Math.min(dimA, dimB) : Math.max(dimA, dimB);

  const printWidthPct = (paperWidthCm / WALL_WIDTH_CM) * 100;
  const consoleWidthPct = (CONSOLE_WIDTH_CM / WALL_WIDTH_CM) * 100;
  // En CSS los % de padding se calculan sobre el ancho del bloque contenedor (WALL_WIDTH_CM)
  const matPaddingPct = (spec.marginCm / WALL_WIDTH_CM) * 100;

  return (
    <div className="mt-5 rounded-xl border border-white/[0.08] bg-[#0E0F12]/90 overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 border-b border-white/[0.06]">
        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          aria-expanded={open}
          className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-[#C5A880] hover:text-white transition cursor-pointer"
        >
          <span className="inline-block h-2 w-2 rounded-full bg-[#C5A880]" />
          <span>{t("Ver en pared a escala", "View to scale on wall")}</span>
          <span className="text-[#8E8A80]">{open ? "▾" : "▸"}</span>
        </button>

        {open && (
          <div className="flex items-center gap-1.5 font-mono text-[10px]">
            <button
              type="button"
              onClick={() => setWallTone("light")}
              className={`rounded-md px-2.5 py-1 transition cursor-pointer ${
                wallTone === "light"
                  ? "bg-[#EAE5DC] text-[#0B0C0E] font-semibold"
                  : "border border-white/10 text-[#A39E93] hover:text-white"
              }`}
            >
              {t("Pared galería", "Gallery light")}
            </button>
            <button
              type="button"
              onClick={() => setWallTone("dark")}
              className={`rounded-md px-2.5 py-1 transition cursor-pointer ${
                wallTone === "dark"
                  ? "bg-[#C5A880] text-[#0B0C0E] font-semibold"
                  : "border border-white/10 text-[#A39E93] hover:text-white"
              }`}
            >
              {t("Estudio oscuro", "Studio dark")}
            </button>
          </div>
        )}
      </div>

      {open && (
        <div className="p-3 sm:p-5 space-y-3">
          {/* Escena de pared a proporción física real (260 × 173 cm) */}
          <div
            className={`relative mx-auto w-full aspect-[3/2] overflow-hidden rounded-lg border transition-colors duration-300 ${
              wallTone === "light"
                ? "border-[#D6CFC3] bg-gradient-to-b from-[#EDE9E1] via-[#E5E0D5] to-[#D6CFC2]"
                : "border-white/10 bg-gradient-to-b from-[#1A1C21] via-[#15161B] to-[#0E0F12]"
            }`}
          >
            {/* Iluminación cenital sutil de galería */}
            <div
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  wallTone === "light"
                    ? "radial-gradient(circle at 50% 28%, rgba(255,255,255,0.55) 0%, rgba(0,0,0,0.06) 100%)"
                    : "radial-gradient(circle at 50% 28%, rgba(197,168,128,0.12) 0%, rgba(0,0,0,0.45) 100%)",
              }}
            />

            {/* Lámina Fine Art a escala real centrada sobre el aparador/sofá */}
            <div className="absolute inset-x-0 bottom-[30%] top-[6%] flex items-center justify-center">
              <div
                style={{
                  width: `${printWidthPct}%`,
                  aspectRatio: `${paperWidthCm} / ${paperHeightCm}`,
                  padding: `${matPaddingPct}%`,
                }}
                className="relative bg-[#F6F3EC] transition-all duration-300 ease-out shadow-[0_14px_30px_rgba(0,0,0,0.32)] ring-1 ring-black/10"
              >
                <div className="relative h-full w-full overflow-hidden bg-[#111215]">
                  <Image
                    src={photo.image}
                    alt={photo.alt}
                    fill
                    sizes="(max-width: 640px) 220px, 340px"
                    className="object-cover pointer-events-none select-none"
                  />
                </div>
              </div>
            </div>

            {/* Zócalo / Aparador minimalista de referencia de 180 cm */}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 flex flex-col items-center">
              <div
                style={{ width: `${consoleWidthPct}%` }}
                className={`relative h-10 sm:h-14 rounded-t-md border-t border-x transition-colors ${
                  wallTone === "light"
                    ? "border-[#8C8376]/35 bg-[#3B3936] shadow-[0_-4px_18px_rgba(0,0,0,0.08)]"
                    : "border-white/10 bg-[#212329] shadow-[0_-4px_18px_rgba(0,0,0,0.35)]"
                }`}
              >
                <div className="flex h-full items-center justify-center">
                  <span className="font-mono text-[9px] uppercase tracking-[0.22em] text-white/55">
                    {t("Referencia: 180 cm", "Reference: 180 cm / 70.9 in")}
                  </span>
                </div>
              </div>
              <div
                className={`h-3 sm:h-4 w-full ${
                  wallTone === "light" ? "bg-[#C7BEB0]" : "bg-[#090A0C]"
                }`}
              />
            </div>
          </div>

          {/* Barra inferior interactiva de comparación rápida entre tamaños */}
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap items-center gap-1.5">
              {(Object.keys(formats) as PrintFormatId[]).map((fmtId) => {
                const fmt = formats[fmtId];
                const isSelected = fmtId === selectedFormatId;
                const isDisabled = Boolean(fmt.disabled);
                return (
                  <button
                    key={fmtId}
                    type="button"
                    disabled={isDisabled}
                    onClick={() => !isDisabled && onSelectFormat(fmtId)}
                    className={`rounded-md px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider transition ${
                      isDisabled
                        ? "cursor-not-allowed border border-white/5 text-white/25"
                        : isSelected
                        ? "bg-[#C5A880] text-[#0B0C0E] font-semibold cursor-pointer"
                        : "border border-white/10 bg-[#15161B] text-[#A39E93] hover:text-white cursor-pointer"
                    }`}
                  >
                    {lang === "en"
                      ? BASE_PRINT_FORMATS[fmtId].shortNameEn
                      : BASE_PRINT_FORMATS[fmtId].shortName}
                  </button>
                );
              })}
            </div>

            <span className="font-mono text-[10px] text-[#8E8A80]">
              {t(
                `Escala orientativa · ${currentFormat.dimensions} (margen ${spec.marginCm} cm) sin enmarcar`,
                `Approximate true scale · ${currentFormat.dimensions} (${spec.marginCm} cm white border) unframed`
              )}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
