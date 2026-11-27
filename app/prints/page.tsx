import { Suspense } from "react";
import Container from "@/components/ui/Container";
import DirectPrintsCatalog from "@/components/prints/DirectPrintsCatalog";
import PaymentFeedback from "@/components/prints/PaymentFeedback";
import JsonLd from "@/components/seo/JsonLd";
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
      a: "Dado que cada copia se imprime bajo demanda en laboratorio Fine Art en Tenerife con revisión directa de prueba de color y firma manuscrita, el plazo habitual de expedición en tubo rígido es de 5 a 8 días laborables.",
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
            Tienda Online · Envío gratis en Canarias
          </p>
          <h1 className="mt-2 font-serif text-3xl sm:text-5xl font-light tracking-tight text-[#EBE7DF]">
            Comprar Láminas
          </h1>
          <p className="mt-3 text-sm sm:text-base leading-relaxed text-[#A39E93] font-light">
            Elige la foto que te guste, selecciona el tamaño (pequeño, mediano o grande) y recíbela en casa en un tubo rígido protector.
          </p>
        </div>

        {/* Catálogo de Compra Directa inmediatamente visible arriba */}
        <Suspense fallback={null}>
          <DirectPrintsCatalog allPhotos={printable} />
        </Suspense>
      </Container>
    </div>
  );
}
