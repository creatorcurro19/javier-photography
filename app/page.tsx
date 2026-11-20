import Hero from "@/components/home/Hero";
import TrustBadgeStrip from "@/components/home/TrustBadgeStrip";
import SelectedWork from "@/components/home/SelectedWork";
import SocialProofSection from "@/components/home/SocialProofSection";
import JsonLd from "@/components/seo/JsonLd";
import { buildPageMetadata } from "@/lib/metadata";
import { getFeaturedPhotos } from "@/lib/photos";
import { generatePersonSchema } from "@/lib/schema";
import type { Photo } from "@/types/photo";

export const metadata = buildPageMetadata({
  title: "Javier Espinosa | Fotógrafo en Tenerife · Copias y Encargos",
  description:
    "Fotógrafo de autor afincado en Tenerife. Fauna, paisaje, rally y arquitectura. Venta de copias Fine Art de conservación y encargos fotográficos a medida.",
  path: "/",
});

const HERO_IMAGES = new Set([
  "/images/portfolio/viajes-cultura/ocaso-sobre-el-erg.jpg",
  "/images/portfolio/fauna-naturaleza/mirada-del-lince-boreal.jpg",
  "/images/portfolio/paisajes-documental/cumbre-nevada-al-alba.jpg",
  "/images/portfolio/coches-rally/cruzada-sobre-el-asfalto.jpg",
  "/images/portfolio/viajes-cultura/el-oficio-y-la-chispa.jpg",
]);

/** Selecciona 6 piezas equilibradas sin repetir ninguna fotografía del Hero */
function pickHomePreview(featured: Photo[]): Photo[] {
  const uniqueFeatured = featured.filter((p) => !HERO_IMAGES.has(p.image));
  const seenCategories = new Set<string>();
  const picked: Photo[] = [];

  for (const photo of uniqueFeatured) {
    if (!seenCategories.has(photo.category)) {
      seenCategories.add(photo.category);
      picked.push(photo);
    }
    if (picked.length === 5) break;
  }

  for (const photo of uniqueFeatured) {
    if (picked.length >= 6) break;
    if (!picked.some((p) => p.id === photo.id)) {
      picked.push(photo);
    }
  }

  return picked;
}

export default function Home() {
  const featuredPhotos = getFeaturedPhotos();
  const homePreview = pickHomePreview(featuredPhotos);

  return (
    <>
      <JsonLd data={generatePersonSchema()} />
      <Hero />
      <TrustBadgeStrip />
      <SelectedWork photos={homePreview} totalCount={featuredPhotos.length} />
      <SocialProofSection />
    </>
  );
}
