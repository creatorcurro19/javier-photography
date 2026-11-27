"use client";

import { Suspense } from "react";
import Container from "@/components/ui/Container";
import DirectPrintsCatalog from "@/components/prints/DirectPrintsCatalog";
import PaymentFeedback from "@/components/prints/PaymentFeedback";
import { getPlazos } from "@/data/plazos";
import {
  BASE_PRINT_FORMATS,
  PRINT_FORMAT_ORDER,
  computeManchaDimensions,
  formatPaperDimensions,
  type PrintFormatId,
} from "@/data/formatos";
import { PAGOS_ACTIVOS } from "@/data/site-config";
import { useLanguage } from "@/lib/i18n";
import {
  formatApproxUsd,
  formatApproxUsdRange,
  useUsdRate,
} from "@/lib/currency";
import type { Photo } from "@/types/photo";

interface PrintsPageContentProps {
  printable: Photo[];
  priceRanges: Record<PrintFormatId, { min: number; max: number }>;
}

export default function PrintsPageContent({
  printable,
  priceRanges,
}: PrintsPageContentProps) {
  const { lang, t } = useLanguage();
  const plazos = getPlazos(lang);
  const usdRate = useUsdRate(lang === "en");

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0B0C0E] pt-28 pb-24 text-[#EBE7DF]">
      <Container className="relative z-10">
        <Suspense fallback={null}>
          <PaymentFeedback />
        </Suspense>

        {/* Cabecera Minimalista e Intuitiva */}
        <div className="max-w-2xl">
          <p className="font-mono text-xs uppercase tracking-[0.28em] text-[#C5A880]">
            {PAGOS_ACTIVOS
              ? t(
                  "Tienda Online · Envío gratis en Canarias",
                  "Online Store · Worldwide & US Shipping"
                )
              : t(
                  "Copias Fine Art por encargo · Envío gratis en Canarias",
                  "Limited Fine Art Prints · Worldwide & US Rigid Tube Shipping"
                )}
          </p>
          <h1 className="mt-2 font-serif text-3xl sm:text-5xl font-light tracking-tight text-[#EBE7DF]">
            {t("Comprar Láminas", "Buy Prints")}
          </h1>
          <p className="mt-3 text-sm sm:text-base leading-relaxed text-[#A39E93] font-light">
            {t(
              "Elige la foto que te guste, selecciona el tamaño (Estudio, Galería o Gran Colección) y recíbela sin enmarcar en tubo rígido protector.",
              "Choose the photograph you like, select a size (Studio, Gallery, or Grand Collection), and receive it unframed inside a rigid protective tube shipped to the US, Europe, or worldwide."
            )}
          </p>
        </div>

        {/* Proceso en 3 pasos + Tabla unificada desde data/formatos.ts */}
        {!PAGOS_ACTIVOS && (
          <div className="mt-8 grid grid-cols-1 gap-4 border-y border-white/[0.08] py-5 sm:grid-cols-3 text-xs">
            <div>
              <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#C5A880]">
                {t("01 · Elige obra y formato", "01 · Choose work and format")}
              </span>
              <p className="mt-1 text-[#A39E93] font-light">
                {t(
                  "Selecciona fotografía y tamaño estándar en papel algodón 308g o baritado 340g.",
                  "Select a photograph and standard size on 308g cotton or 340g baryta paper."
                )}
              </p>
            </div>
            <div>
              <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#C5A880]">
                {t("02 · Solicita tu copia", "02 · Request your print")}
              </span>
              <p className="mt-1 text-[#A39E93] font-light">
                {t(
                  "Confirmamos disponibilidad de edición, total con envío e impuestos aplicables.",
                  "We confirm edition availability, total with shipping, and applicable taxes."
                )}
              </p>
            </div>
            <div>
              <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#C5A880]">
                {t("03 · Producción y envío", "03 · Production & shipping")}
              </span>
              <p className="mt-1 text-[#A39E93] font-light">
                {plazos.copias}{" "}
                {t(
                  "Envío en tubo rígido sin marco (Canarias 0 € · Península 18 € · UE 32 € · EE. UU. y Resto 48 €).",
                  `Unframed rigid tube shipping (Canary Islands €0 · Mainland Spain €18 · Europe €32 · United States & Worldwide €48 / ${formatApproxUsd(48, usdRate)}).`
                )}
              </p>
            </div>
          </div>
        )}

        {/* Tabla discreta de formatos, medidas (mancha = papel − 2 × margen) y precios */}
        <div className="mt-6 overflow-x-auto border border-white/[0.08] bg-[#151618]/50">
          <table className="w-full text-left font-mono text-[11px]">
            <thead className="border-b border-white/[0.08] text-[10px] uppercase tracking-[0.2em] text-[#A39E93]">
              <tr>
                <th className="px-4 py-2.5 font-normal">
                  {t("Formato", "Format")}
                </th>
                <th className="px-4 py-2.5 font-normal">
                  {t("Papel", "Paper")}
                </th>
                <th className="px-4 py-2.5 font-normal">
                  {t("Mancha de imagen", "Image area")}
                </th>
                <th className="px-4 py-2.5 font-normal">
                  {t("Precio", "Price")}
                </th>
                <th className="px-4 py-2.5 font-normal">
                  {t("Plazo", "Lead time")}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.06] text-[#D4CEC3]">
              {PRINT_FORMAT_ORDER.map((id) => {
                const spec = BASE_PRINT_FORMATS[id];
                const mancha = computeManchaDimensions(spec.dimensions, id, lang);
                const range = priceRanges[id];
                return (
                  <tr key={id}>
                    <td className="px-4 py-2.5 text-[#EBE7DF]">
                      {lang === "en" ? spec.nameEn : spec.name}
                    </td>
                    <td className="px-4 py-2.5">{formatPaperDimensions(spec.dimensions, lang)}</td>
                    <td className="px-4 py-2.5">{mancha.label}</td>
                    <td className="px-4 py-2.5 text-[#C5A880] whitespace-nowrap">
                      {range.min === range.max
                        ? `${range.min} €`
                        : `${range.min}–${range.max} €`}
                      {lang === "en" && (
                        <span className="block text-[10px] text-[#8E8A80]">
                          ({formatApproxUsdRange(range.min, range.max, usdRate)})
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-2.5 text-[#8E8A80]">{plazos.tabla}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {PAGOS_ACTIVOS && (
          <p className="mt-2 font-mono text-[10px] text-[#A39E93]">
            {t(
              "Envío en tubo rígido desde Tenerife: Canarias 0 € · Península y Baleares 18 € · Europa 32 € · EE. UU. y Resto del Mundo 48 €.",
              `Insured rigid tube shipping from Tenerife: Canary Islands €0 · Mainland Spain €18 · Europe €32 (${formatApproxUsd(32, usdRate)}) · United States & Worldwide €48 (${formatApproxUsd(48, usdRate)}).`
            )}
          </p>
        )}
        {lang === "en" && (
          <p className="mt-1.5 font-mono text-[10px] text-[#8E8A80]">
            Approximate USD equivalents use the European Central Bank reference rate; final checkout is billed in EUR.
          </p>
        )}

        {/* Catálogo de Compra Directa inmediatamente visible arriba */}
        <Suspense fallback={null}>
          <DirectPrintsCatalog allPhotos={printable} />
        </Suspense>
      </Container>
    </div>
  );
}
