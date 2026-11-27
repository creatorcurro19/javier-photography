import Hero from "@/components/home/Hero";
import CollectionsOverview from "@/components/home/CollectionsOverview";
import JsonLd from "@/components/seo/JsonLd";
import { buildPageMetadata } from "@/lib/metadata";
import { generatePersonSchema, generateWebSiteSchema } from "@/lib/schema";

export const metadata = buildPageMetadata({
  title: "Javier Espinosa | Fotografía de Autor & Fine Art Photography (Tenerife · España)",
  description:
    "Soy Javier Espinosa, fotógrafo independiente afincado en Tenerife. Naturaleza, paisajes, arquitectura y cultura con luz natural y copias Fine Art.",
  path: "/",
  keywords: [
    "Javier Espinosa Photography",
    "Javier Espinosa Martínez",
    "fotógrafo en Tenerife",
    "fotografía de autor",
    "Fine Art Photography",
    "Wildlife Photography",
    "Landscape Photography",
    "Motorsport Photography",
    "Architectural Photography",
    "Documentary Photography",
    "copias Fine Art Hahnemühle",
  ],
});

export default function Home() {
  return (
    <>
      <JsonLd data={[generateWebSiteSchema(), generatePersonSchema()]} />
      <Hero />
      <CollectionsOverview />
    </>
  );
}
