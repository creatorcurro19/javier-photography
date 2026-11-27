import Container from "@/components/ui/Container";
import AboutInteractiveStudio from "@/components/about/AboutInteractiveStudio";
import JsonLd from "@/components/seo/JsonLd";
import { buildPageMetadata } from "@/lib/metadata";
import { generateBreadcrumbSchema } from "@/lib/schema";

export const metadata = buildPageMetadata({
  title: "Sobre mí | Javier Espinosa",
  description:
    "Soy Javier Espinosa, fotógrafo independiente en Tenerife. Naturaleza, paisajes, arquitectura y cultura buscando nuevas maneras de mirar.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0B0C0E] pt-32 pb-28 text-[#EBE7DF]">
      <JsonLd
        data={generateBreadcrumbSchema([
          { name: "Inicio", path: "/" },
          { name: "Sobre el Autor", path: "/about" },
        ])}
      />
      <Container className="relative z-10">
        <AboutInteractiveStudio />
      </Container>
    </div>
  );
}
