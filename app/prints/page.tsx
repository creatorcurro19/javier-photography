import PrintsPageContent from "@/components/prints/PrintsPageContent";
import JsonLd from "@/components/seo/JsonLd";
import { PLAZOS } from "@/data/plazos";
import { getFormatPriceRanges } from "@/data/formatos";
import { buildPageMetadata } from "@/lib/metadata";
import { getPrintablePhotos } from "@/lib/photos";
import {
  generateBreadcrumbSchema,
  generateFAQSchema,
  generatePersonSchema,
} from "@/lib/schema";

export const metadata = buildPageMetadata({
  title: "Comprar Láminas Fine Art | Javier Espinosa",
  description:
    "Copias Fine Art de edición limitada sobre papel 100% algodón Hahnemühle Photo Rag 308g (ISO 9706). Obra numerada y firmada, enviada sin marco.",
  path: "/prints",
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
    <>
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
      <PrintsPageContent printable={printable} priceRanges={priceRanges} />
    </>
  );
}
