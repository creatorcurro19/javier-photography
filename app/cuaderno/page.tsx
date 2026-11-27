import CuadernoPageContent from "@/components/stories/CuadernoPageContent";
import JsonLd from "@/components/seo/JsonLd";
import { getAllCuadernoPosts } from "@/data/cuaderno";
import { buildPageMetadata } from "@/lib/metadata";
import { getPhotosWithStory } from "@/lib/photos";
import { generateBreadcrumbSchema } from "@/lib/schema";

export const metadata = buildPageMetadata({
  title: "Cuaderno de Campo | Javier Espinosa",
  description:
    "Cuaderno y artículos de Javier Espinosa Martínez: notas de campo sobre fotografía de naturaleza, paisaje en Tenerife, rally histórico y oficios.",
  path: "/cuaderno",
});

export default function CuadernoPage() {
  const posts = getAllCuadernoPosts();
  const stories = getPhotosWithStory();

  return (
    <>
      <JsonLd
        data={generateBreadcrumbSchema([
          { name: "Inicio", path: "/" },
          { name: "Cuaderno", path: "/cuaderno" },
        ])}
      />
      <CuadernoPageContent posts={posts} stories={stories} />
    </>
  );
}
