import Hero from "@/components/home/Hero";
import CollectionsOverview from "@/components/home/CollectionsOverview";
import JsonLd from "@/components/seo/JsonLd";
import { buildPageMetadata } from "@/lib/metadata";
import { generatePersonSchema, generateWebSiteSchema } from "@/lib/schema";

export const metadata = buildPageMetadata({
  title: "Fotógrafo en Tenerife | Javier Espinosa",
  description:
    "Fotografía de fauna, paisaje, rally histórico, arquitectura y documental desde Tenerife. Copias Fine Art, encargos y licencias.",
  path: "/",
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
