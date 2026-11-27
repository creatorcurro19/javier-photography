import CondicionesPageContent from "@/components/legal/CondicionesPageContent";
import JsonLd from "@/components/seo/JsonLd";
import { buildPageMetadata } from "@/lib/metadata";
import { generateBreadcrumbSchema } from "@/lib/schema";

export const metadata = buildPageMetadata({
  title: "Condiciones de Compra y Licencias | Javier Espinosa",
  description:
    "Condiciones generales de venta de copias Fine Art en tubo rígido, impuestos aplicables, envío, derecho de desistimiento, devoluciones y licencias.",
  path: "/condiciones",
});

export default function CondicionesPage() {
  return (
    <>
      <JsonLd
        data={generateBreadcrumbSchema([
          { name: "Inicio", path: "/" },
          { name: "Condiciones de Compra y Licencias", path: "/condiciones" },
        ])}
      />
      <CondicionesPageContent />
    </>
  );
}
