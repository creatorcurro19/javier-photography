import Link from "next/link";
import Container from "@/components/ui/Container";
import CategoryNav from "@/components/portfolio/CategoryNav";
import ExhibitionGallery from "@/components/portfolio/ExhibitionGallery";
import JsonLd from "@/components/seo/JsonLd";
import { buildPageMetadata } from "@/lib/metadata";
import {
  getAllPhotos,
  getPhotosByCategory,
  PHOTO_CATEGORIES,
} from "@/lib/photos";
import { generateBreadcrumbSchema } from "@/lib/schema";
import { CATEGORY_METADATA } from "@/types/photo";

export const metadata = buildPageMetadata({
  title: `Colecciones Fotográficas & Archivo de Autor (${getAllPhotos().length} Obras) | Javier Espinosa`,
  description: `Archivo fotográfico de autor por Javier Espinosa Martínez — ${getAllPhotos().length} obras en ${PHOTO_CATEGORIES.length} disciplinas: Fauna Salvaje (Wildlife), Paisajes (Landscapes), Rally Histórico (Motorsport), Arquitectura y Documental.`,
  path: "/portfolio",
  keywords: [
    "portfolio fotográfico",
    "archivo fotográfico de autor",
    "fine art photography portfolio",
    "wildlife photography",
    "landscape photography",
    "motorsport rally photography",
    "architectural photography",
    "documentary photography",
    "Javier Espinosa Martínez",
  ],
});

export default function PortfolioPage() {
  const photos = getAllPhotos();
  const breadcrumb = generateBreadcrumbSchema([
    { name: "Inicio", path: "/" },
    { name: "Colecciones Fotográficas", path: "/portfolio" },
  ]);

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0B0C0E] pt-28 pb-24 text-[#EBE7DF]">
      <JsonLd data={breadcrumb} />

      <Container className="relative z-10">
        <header className="max-w-2xl">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-[#C5A880]">
            Galería Fotográfica · {photos.length} fotos
          </p>
          <h1 className="mt-2 font-serif text-3xl sm:text-5xl font-light tracking-tight text-[#EBE7DF]">
            Todas las Fotos
          </h1>
          <p className="mt-3 text-sm sm:text-base leading-relaxed text-[#A39E93] font-light">
            Elige un tema arriba para filtrar o toca cualquier foto para abrir su ficha completa.
          </p>
        </header>

        <div className="mt-6">
          <CategoryNav />
        </div>

        <div className="mt-8">
          <ExhibitionGallery photos={photos} />
        </div>

        {/* Índice Curatorial Completo de las Obras (oculto visualmente con sr-only para conservar SEO SSR al 100%) */}
        <section
          aria-label="Índice completo del archivo catalogado"
          className="sr-only"
        >
          <details className="group">
            <summary className="flex cursor-pointer list-none flex-col justify-between gap-3 sm:flex-row sm:items-center">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-[#C5A880]">
                  Catalogación Museística · Full Archival Index ({photos.length} Works)
                </p>
                <h2 className="mt-1 font-serif text-2xl font-light text-[#EBE7DF]">
                  Índice Completo del Archivo por Disciplina
                </h2>
              </div>
              <span className="inline-flex items-center gap-2 border border-white/15 bg-[#0B0C0E] px-4 py-2 font-mono text-[10px] uppercase tracking-[0.25em] text-[#EBE7DF] transition group-hover:border-[#C5A880]">
                <span>Desplegar catálogo ({photos.length} obras)</span>
                <span className="transition group-open:rotate-45">+</span>
              </span>
            </summary>

            <div className="mt-8 grid grid-cols-1 gap-10 border-t border-white/[0.08] pt-8 md:grid-cols-2 lg:grid-cols-3">
              {PHOTO_CATEGORIES.map((category) => {
                const info = CATEGORY_METADATA[category];
                const catPhotos = getPhotosByCategory(category);
                return (
                  <div key={category} className="space-y-3">
                    <div className="border-b border-white/[0.08] pb-2">
                      <Link
                        href={`/portfolio/${category}`}
                        className="font-serif text-lg font-light text-[#EBE7DF] hover:text-[#C5A880] transition"
                      >
                        {info.title} ({catPhotos.length})
                      </Link>
                      <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#8E8A80]">
                        {info.titleEn}
                      </p>
                    </div>
                    <ul className="space-y-1.5 text-xs">
                      {catPhotos.map((p) => (
                        <li key={p.id} className="flex items-baseline justify-between gap-2">
                          <Link
                            href={`/portfolio/${p.slug}`}
                            className="truncate text-[#8E8A80] hover:text-[#EBE7DF] transition"
                          >
                            {p.title}
                          </Link>
                          <span className="shrink-0 font-mono text-[10px] text-[#8E8A80]/60">
                            {p.location?.split(",")[0]} · {p.focalLength}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          </details>
        </section>
      </Container>
    </div>
  );
}
