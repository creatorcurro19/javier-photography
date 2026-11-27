import SelectedWorkContent from "@/components/portfolio/SelectedWorkContent";
import JsonLd from "@/components/seo/JsonLd";
import { buildPageMetadata } from "@/lib/metadata";
import { getAllPhotos, getFeaturedPhotos } from "@/lib/photos";
import { generateBreadcrumbSchema } from "@/lib/schema";

export const metadata = buildPageMetadata({
  title: "Obras Seleccionadas | Javier Espinosa",
  description:
    "Fotografías seleccionadas del archivo de Javier Espinosa Martínez: fauna, paisaje, automovilismo, arquitectura y fotografía documental.",
  path: "/selected-work",
});

export default function SelectedWorkPage() {
  const featuredPhotos = getFeaturedPhotos();
  const totalArchiveCount = getAllPhotos().length;

  return (
    <>
      <JsonLd
        data={generateBreadcrumbSchema([
          { name: "Inicio", path: "/" },
          { name: "Obras Seleccionadas", path: "/selected-work" },
        ])}
      />
      <SelectedWorkContent
        featuredPhotos={featuredPhotos}
        totalArchiveCount={totalArchiveCount}
      />
    </>
  );
}
