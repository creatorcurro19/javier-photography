import Container from "@/components/ui/Container";
import {
  AndalusianCollectionBackdrop,
  AndalusianCenefa,
} from "@/components/ui/AndalusianMotif";
import ExhibitionGallery from "@/components/portfolio/ExhibitionGallery";
import Link from "next/link";
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
    <div className="relative min-h-screen overflow-hidden bg-[#0B0C0E] pt-36 pb-28 text-[#EBE7DF]">
      <JsonLd
        data={generateBreadcrumbSchema([
          { name: "Inicio", path: "/" },
          { name: "Obras Seleccionadas", path: "/selected-work" },
        ])}
      />
      {/* Filigrana andalusí y cenefas laterales discretas en el fondo */}
      <AndalusianCollectionBackdrop variant="laceria" />

      <Container className="relative z-10">
        {/* Curatorial Header */}
        <header className="max-w-3xl">
          <div className="flex items-center gap-3">
            <span className="h-px w-6 bg-white/30" />
            <p className="font-mono text-xs uppercase tracking-[0.4em] text-[#A39E93]">
              Archivo Fotográfico · Selección Principal
            </p>
          </div>
          <h1 className="mt-4 font-serif text-4xl sm:text-5xl md:text-6xl font-light tracking-tight leading-[1.12] text-[#EBE7DF]">
            Obras Seleccionadas
          </h1>
          <p className="mt-2 font-mono text-xs uppercase tracking-[0.25em] text-[#C5A880]">
            {featuredPhotos.length} Fotografías del Archivo
          </p>
          <p className="mt-6 text-base sm:text-lg leading-relaxed text-[#8E8A80] font-light">
            {featuredPhotos.length} fotografías elegidas entre distintas series y lugares. Hay fauna, montaña, asfalto, callejones en penumbra y talleres donde todavía se trabaja a mano. No responden a un único tema, pero sí a una misma costumbre: detenerse, esperar a que la luz acompañe y observar con calma lo que ocurre delante.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4 text-xs font-mono uppercase tracking-[0.25em]">
            <Link
              href="/portfolio"
              className="text-[#8E8A80] transition-colors hover:text-[#EBE7DF]"
            >
              ← Ver el Archivo Completo ({totalArchiveCount} Fotografías)
            </Link>
            <span className="text-white/20">·</span>
            <Link
              href="/projects"
              className="text-[#8E8A80] transition-colors hover:text-[#EBE7DF]"
            >
              Ver Series y Proyectos →
            </Link>
          </div>
        </header>

        <AndalusianCenefa
          variant="estrella"
          className="mt-12 text-[#C5A880]/32"
        />

        {/* The 15 Artworks Gallery */}
        <div className="mt-14">
          <ExhibitionGallery photos={featuredPhotos} showMeta />
        </div>

        {/* Curatorial Note & Archival Assurance */}
        <div className="mt-24 border border-white/[0.08] bg-[#151618] p-8 sm:p-12 lg:p-16">
          <div className="max-w-2xl">
            <span className="font-mono text-xs uppercase tracking-[0.35em] text-[#8E8A80]">
              Sobre esta selección
            </span>
            <h2 className="mt-3 font-serif text-2xl sm:text-3xl font-light text-[#EBE7DF]">
              Observar antes de disparar
            </h2>
            <p className="mt-4 text-sm sm:text-base leading-relaxed text-[#8E8A80] font-light">
              A veces una fotografía aparece después de horas esperando en el campo; otras, al doblar una esquina y encontrar cómo entra el sol en una calle estrecha. Todas las imágenes de esta página están tomadas con luz natural y pueden encargarse como copia sobre papel de algodón Hahnemühle Photo Rag® 308g o bajo licencia editorial.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                href="/prints"
                className="inline-flex border border-[#EBE7DF] bg-[#EBE7DF] px-8 py-3.5 font-mono text-xs uppercase tracking-[0.28em] text-[#0B0C0E] font-medium transition-all duration-300 hover:bg-transparent hover:text-white"
              >
                Ver Copias en Papel Hahnemühle
              </Link>
              <Link
                href="/contact"
                className="inline-flex border border-white/20 bg-transparent px-8 py-3.5 font-mono text-xs uppercase tracking-[0.28em] text-[#EBE7DF] transition-all duration-300 hover:border-white/50 hover:text-white"
              >
                Consultar
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
