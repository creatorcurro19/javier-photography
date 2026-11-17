import Hero from "@/components/home/Hero";
import SelectedWork from "@/components/home/SelectedWork";
import { buildPageMetadata } from "@/lib/metadata";
import { getFeaturedPhotos } from "@/lib/photos";
import type { Photo } from "@/types/photo";

export const metadata = buildPageMetadata({
  title: "Javier Espinosa | The Art of Seeing — Fotografía de Autor",
  description:
    "Galería y museo digital de fotografía de autor por Javier Espinosa Martínez. Fauna salvaje, paisaje documental, automovilismo clásico y rally histórico, arquitectura vernácula y etnografía.",
  path: "/",
});

const HERO_IMAGES = new Set([
  "/images/portfolio/viajes-cultura/B51A7341.jpg",
  "/images/portfolio/fauna-naturaleza/B51A1823-Mejorado-NR.jpg",
  "/images/portfolio/paisajes-documental/B51A0149.jpg",
  "/images/portfolio/coches-rally/B51A9718.jpg",
  "/images/portfolio/viajes-cultura/soldador.jpg",
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
      <Hero />
      <SelectedWork photos={homePreview} totalCount={featuredPhotos.length} />
    </>
  );
}
