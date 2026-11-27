import ServiciosPageContent from "@/components/servicios/ServiciosPageContent";
import JsonLd from "@/components/seo/JsonLd";
import { PLAZOS } from "@/data/plazos";
import { buildPageMetadata } from "@/lib/metadata";
import { generateFAQSchema, generateServiceSchema } from "@/lib/schema";

export const metadata = buildPageMetadata({
  title: "Servicios y Encargos | Javier Espinosa",
  description:
    "Encargos fotográficos de Javier Espinosa Martínez: rally histórico, arquitectura y patrimonio, proyectos documentales y copias Fine Art.",
  path: "/servicios",
});

export default function ServiciosPage() {
  const faqItems = [
    {
      q: "¿Cómo se planifica la cobertura de un rally o evento de motor?",
      a: "Antes de la prueba se estudian el rutómetro, los horarios de corte y la orientación solar de cada tramo. Se combinan tomas en el parque de asistencia (ambiente, detalles mecánicos y pilotos) con disparos en curva y horquilla hasta 600mm.",
    },
    {
      q: "¿En qué formato y plazo se entregan los reportajes?",
      a: `Se entrega una galería privada en alta resolución (archivos máster de 32,5 MP revelados individualmente y versiones optimizadas para prensa/web). ${PLAZOS.rallyPrensa} ${PLAZOS.reportajes}`,
    },
    {
      q: "¿Realizas desplazamientos fuera de tu provincia o a las islas?",
      a: "Sí. Con base en Tenerife (Islas Canarias), tengo disponibilidad para desplazamientos a Península y otras localizaciones bajo encargo.",
    },
    {
      q: "¿Los encargos de arquitectura y turismo incluyen licencia de uso comercial?",
      a: "Sí, cada presupuesto incluye por escrito la cesión de derechos adaptada a las necesidades del cliente (web corporativa, catálogos impresos, campañas editoriales o promoción institucional).",
    },
  ];

  return (
    <>
      <JsonLd data={generateServiceSchema()} />
      <JsonLd data={generateFAQSchema(faqItems)} />
      <ServiciosPageContent />
    </>
  );
}
