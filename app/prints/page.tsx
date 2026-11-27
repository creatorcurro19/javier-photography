import { Suspense } from "react";
import Container from "@/components/ui/Container";
import DirectPrintsCatalog from "@/components/prints/DirectPrintsCatalog";
import PaymentFeedback from "@/components/prints/PaymentFeedback";
import JsonLd from "@/components/seo/JsonLd";
import { PLAZOS } from "@/data/plazos";
import {
  BASE_PRINT_FORMATS,
  PRINT_FORMAT_ORDER,
  computeManchaDimensions,
  getFormatPriceRanges,
} from "@/data/formatos";
import { PAGOS_ACTIVOS } from "@/data/site-config";
import { buildPageMetadata } from "@/lib/metadata";
import { getPrintablePhotos } from "@/lib/photos";
import {
  generateBreadcrumbSchema,
  generateFAQSchema,
  generatePersonSchema,
} from "@/lib/schema";

export const metadata = buildPageMetadata({
  title: "Copias Fine Art Hahnemühle & Ediciones Limitadas (Fine Art Prints) | Javier Espinosa",
  description:
    "Adquisición de copias Fine Art de edición limitada sobre papel 100% algodón Hahnemühle Photo Rag 308g (ISO 9706). Obra fotográfica de autor numerada y firmada para coleccionismo e interiorismo.",
  path: "/prints",
  keywords: [
    "copias Fine Art",
    "Fine Art photography prints",
    "Hahnemühle Photo Rag 308g",
    "ediciones limitadas fotografía",
    "limited edition photography prints",
    "fotografía de autor para interiorismo",
    "museum grade archival prints",
  ],
});

export default function PrintsPage() {
  const printable = getPrintablePhotos();
  const priceRanges = getFormatPriceRanges(printable);
  const printFaqs = [
    {
      q: "¿Cómo se entrega y protege cada copia Fine Art?",
      a: "Todas las fotografías se comercializan exclusivamente como lámina Fine Art sin enmarcar. Se envían envueltas en papel seda libre de ácido dentro de un tubo rígido de alta densidad (3-4 mm de grosor) desde Tenerife, eliminando cualquier riesgo de rotura de cristal durante el transporte.",
    },
    {
      q: "¿Por qué cada fotografía tiene un precio y soporte específico?",
      a: "Cada obra del catálogo se valora individualmente según la complejidad técnica de la captura, la singularidad del momento, el tamaño de su edición limitada (entre 12 y 30 ejemplares máximos) y el soporte asignado: papel 100% algodón mate (Hahnemühle Photo Rag® 308g / Canson Rag Photographique 310g) o papel baritado de alto contraste (Baryta 340g).",
    },
    {
      q: "¿Qué incluye el Certificado de Autenticidad?",
      a: "Cada obra va acompañada de un documento firmado y numerado de puño y letra por Javier Espinosa Martínez indicando título, fecha, soporte empleado y número de ejemplar dentro de la edición limitada.",
    },
    {
      q: "¿Cuál es el plazo habitual de producción y entrega?",
      a: `Cada copia se imprime bajo demanda en laboratorio Fine Art con revisión directa de prueba de color y firma manuscrita. ${PLAZOS.copias}`,
    },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0B0C0E] pt-28 pb-24 text-[#EBE7DF]">
      <JsonLd
        data={[
          generateFAQSchema(printFaqs),
          generatePersonSchema(),
          generateBreadcrumbSchema([
            { name: "Inicio", path: "/" },
            { name: "Copias Fine Art", path: "/prints" },
          ]),
        ]}
      />
      <Container className="relative z-10">
        <Suspense fallback={null}>
          <PaymentFeedback />
        </Suspense>

        {/* Cabecera Minimalista e Intuitiva */}
        <div className="max-w-2xl">
          <p className="font-mono text-xs uppercase tracking-[0.28em] text-[#C5A880]">
            {PAGOS_ACTIVOS
              ? "Tienda Online · Envío gratis en Canarias"
              : "Copias Fine Art por encargo · Envío gratis en Canarias"}
          </p>
          <h1 className="mt-2 font-serif text-3xl sm:text-5xl font-light tracking-tight text-[#EBE7DF]">
            Comprar Láminas
          </h1>
          <p className="mt-3 text-sm sm:text-base leading-relaxed text-[#A39E93] font-light">
            Elige la foto que te guste, selecciona el tamaño (Estudio, Galería o Gran Colección) y recíbela sin enmarcar en tubo rígido protector.
          </p>
        </div>

        {/* Proceso en 3 pasos + Tabla unificada desde data/formatos.ts */}
        {!PAGOS_ACTIVOS && (
          <div className="mt-8 grid grid-cols-1 gap-4 border-y border-white/[0.08] py-5 sm:grid-cols-3 text-xs">
            <div>
              <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#C5A880]">
                01 · Elige obra y formato
              </span>
              <p className="mt-1 text-[#A39E93] font-light">
                Selecciona fotografía y tamaño estándar en papel algodón 308g o baritado 340g.
              </p>
            </div>
            <div>
              <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#C5A880]">
                02 · Solicita tu copia
              </span>
              <p className="mt-1 text-[#A39E93] font-light">
                Confirmamos disponibilidad de edición, total con envío e impuestos aplicables.
              </p>
            </div>
            <div>
              <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#C5A880]">
                03 · Producción y envío
              </span>
              <p className="mt-1 text-[#A39E93] font-light">
                {PLAZOS.copias} Envío en tubo rígido sin marco (Canarias 0 € · Península 15 € · UE 28 €).
              </p>
            </div>
          </div>
        )}

        {/* Tabla discreta de formatos, medidas (mancha = papel − 2 × margen) y precios */}
        <div className="mt-6 overflow-x-auto border border-white/[0.08] bg-[#151618]/50">
          <table className="w-full text-left font-mono text-[11px]">
            <thead className="border-b border-white/[0.08] text-[10px] uppercase tracking-[0.2em] text-[#A39E93]">
              <tr>
                <th className="px-4 py-2.5 font-normal">Formato</th>
                <th className="px-4 py-2.5 font-normal">Papel</th>
                <th className="px-4 py-2.5 font-normal">Mancha de imagen</th>
                <th className="px-4 py-2.5 font-normal">Precio</th>
                <th className="px-4 py-2.5 font-normal">Plazo</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.06] text-[#D4CEC3]">
              {PRINT_FORMAT_ORDER.map((id) => {
                const spec = BASE_PRINT_FORMATS[id];
                const mancha = computeManchaDimensions(spec.dimensions, id);
                const range = priceRanges[id];
                return (
                  <tr key={id}>
                    <td className="px-4 py-2.5 text-[#EBE7DF]">{spec.name}</td>
                    <td className="px-4 py-2.5">{spec.dimensions}</td>
                    <td className="px-4 py-2.5">{mancha.label}</td>
                    <td className="px-4 py-2.5 text-[#C5A880] whitespace-nowrap">
                      {range.min === range.max ? `${range.min} €` : `${range.min}–${range.max} €`}
                    </td>
                    <td className="px-4 py-2.5 text-[#8E8A80]">{PLAZOS.tabla}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Catálogo de Compra Directa inmediatamente visible arriba */}
        <Suspense fallback={null}>
          <DirectPrintsCatalog allPhotos={printable} />
        </Suspense>
      </Container>
    </div>
  );
}
