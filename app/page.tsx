import Hero from "@/components/home/Hero";
import SelectedWork from "@/components/home/SelectedWork";
import Container from "@/components/ui/Container";
import {
  AndalusianCornerOrnaments,
  AndalusianDivider,
  AndalusianPageBackdrop,
  AndalusianStarMark,
} from "@/components/ui/AndalusianMotif";
import Link from "next/link";
import { buildPageMetadata } from "@/lib/metadata";
import { getFeaturedPhotos } from "@/lib/photos";
import type { Photo } from "@/types/photo";

export const metadata = buildPageMetadata({
  title: "Javier Espinosa | The Art of Seeing — Fotografía de Autor",
  description:
    "Galería y museo digital de fotografía de autor por Javier Espinosa Martínez. Fauna salvaje, paisaje documental, automovilismo clásico y rally histórico, arquitectura vernácula y etnografía.",
  path: "/",
});

/** Selecciona 6 piezas equilibradas entre todas las disciplinas para una portada concisa */
function pickHomePreview(featured: Photo[]): Photo[] {
  const seenCategories = new Set<string>();
  const picked: Photo[] = [];

  for (const photo of featured) {
    if (!seenCategories.has(photo.category)) {
      seenCategories.add(photo.category);
      picked.push(photo);
    }
    if (picked.length === 5) break;
  }

  for (const photo of featured) {
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

      {/* Cierre Editorial Conciso: El Autor, Series & Obra Fine Art */}
      <section
        className="relative overflow-hidden bg-[#0B0C0E] py-20 sm:py-24"
        aria-label="Autor, Series y Obra Fine Art"
      >
        <AndalusianPageBackdrop variant="laceria" />

        <Container className="relative z-10">
          <div className="relative grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12 border border-[#C5A880]/25 bg-[#151618]/95 p-8 sm:p-12 shadow-[0_24px_70px_rgba(0,0,0,0.65)]">
            <AndalusianCornerOrnaments className="text-[#C5A880]/55" />

            {/* Columna Izquierda: Autor y Series */}
            <div className="flex flex-col justify-between lg:pr-8 lg:border-r lg:border-[#C5A880]/15">
              <div>
                <div className="flex items-center gap-2">
                  <AndalusianStarMark className="h-3 w-3 text-[#C5A880]/80" />
                  <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-[#C5A880]/85">
                    Javier Espinosa Martínez
                  </p>
                </div>
                <h2 className="mt-3 font-serif text-2xl sm:text-3xl font-light text-[#EBE7DF] tracking-tight">
                  La mirada antes que el artificio
                </h2>
                <p className="mt-4 text-sm font-light leading-relaxed text-[#8E8A80]">
                  Fotografía independiente realizada exclusivamente con luz natural. Explora las series monográficas y la trayectoria de autor.
                </p>
              </div>

              <div className="mt-7 flex flex-wrap items-center gap-6 font-mono text-[11px] uppercase tracking-[0.24em]">
                <Link
                  href="/projects"
                  className="text-[#EBE7DF] transition hover:text-white underline underline-offset-4 decoration-[#C5A880]/50"
                >
                  Series Monográficas →
                </Link>
                <Link
                  href="/about"
                  className="text-[#8E8A80] transition hover:text-[#EBE7DF]"
                >
                  Sobre el Autor →
                </Link>
              </div>
            </div>

            {/* Columna Derecha: Copias Fine Art y Contacto */}
            <div className="flex flex-col justify-between pt-8 border-t border-[#C5A880]/15 lg:pt-0 lg:border-t-0">
              <div>
                <div className="flex items-center gap-2">
                  <AndalusianStarMark className="h-3 w-3 text-[#C5A880]/80" />
                  <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-[#C5A880]/85">
                    Ediciones Limitadas · ISO 9706
                  </p>
                </div>
                <h2 className="mt-3 font-serif text-2xl sm:text-3xl font-light text-[#EBE7DF] tracking-tight">
                  Copias Fine Art & Encargos
                </h2>
                <p className="mt-4 text-sm font-light leading-relaxed text-[#8E8A80]">
                  Tiradas numeradas y firmadas sobre algodón Hahnemühle Photo Rag® 308 g/m², listas para colección privada o licencia editorial.
                </p>
              </div>

              <div className="mt-7 flex flex-wrap items-center gap-3">
                <Link
                  href="/prints"
                  className="inline-flex items-center gap-2 border border-[#EBE7DF] bg-[#EBE7DF] px-6 py-2.5 font-mono text-[10px] uppercase tracking-[0.25em] font-medium text-[#0B0C0E] transition hover:bg-transparent hover:text-white"
                >
                  <span>Catálogo Fine Art</span>
                  <span>→</span>
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 border border-[#C5A880]/35 px-6 py-2.5 font-mono text-[10px] uppercase tracking-[0.25em] text-[#EBE7DF] transition hover:border-[#C5A880] hover:text-white"
                >
                  Contacto
                </Link>
              </div>
            </div>
          </div>

          <AndalusianDivider className="mt-12" />
        </Container>
      </section>
    </>
  );
}
