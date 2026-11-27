import PortfolioPageContent from "@/components/portfolio/PortfolioPageContent";
import JsonLd from "@/components/seo/JsonLd";
import { buildPageMetadata } from "@/lib/metadata";
import {
  getAllPhotos,
  getPhotosByCategory,
  PHOTO_CATEGORIES,
} from "@/lib/photos";
import { generateBreadcrumbSchema } from "@/lib/schema";

export const metadata = buildPageMetadata({
  title: `Colecciones y Archivo (${getAllPhotos().length} obras) | Javier Espinosa`,
  description: `Archivo fotográfico de Javier Espinosa Martínez: ${getAllPhotos().length} obras en ${PHOTO_CATEGORIES.length} colecciones de fauna, paisajes, rally, arquitectura y documental.`,
  path: "/portfolio",
});

export default function PortfolioPage() {
  const photos = getAllPhotos();
  const buckets = PHOTO_CATEGORIES.map((category) => ({
    category,
    photos: getPhotosByCategory(category),
  }));
  const breadcrumb = generateBreadcrumbSchema([
    { name: "Inicio", path: "/" },
    { name: "Colecciones Fotográficas", path: "/portfolio" },
  ]);

  return (
    <>
      <JsonLd data={breadcrumb} />
      <PortfolioPageContent photos={photos} buckets={buckets} />
    </>
  );
}
