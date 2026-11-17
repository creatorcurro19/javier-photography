import Container from "@/components/ui/Container";
import {
  AndalusianCollectionBackdrop,
  AndalusianCenefa,
} from "@/components/ui/AndalusianMotif";
import ExhibitionGallery from "@/components/portfolio/ExhibitionGallery";
import Link from "next/link";
import { buildPageMetadata } from "@/lib/metadata";
import { getFeaturedPhotos } from "@/lib/photos";

export const metadata = buildPageMetadata({
  title: "Selected Works | Antología Fotográfica Permanente",
  description:
    "Exposición permanente de quince obras maestras de Javier Espinosa Martínez. Selección curatorial que sintetiza la mirada sobre fauna, paisaje, motorsport, arquitectura y documental.",
  path: "/selected-work",
});

export default function SelectedWorkPage() {
  const featuredPhotos = getFeaturedPhotos();

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0B0C0E] pt-36 pb-28 text-[#EBE7DF]">
      {/* Filigrana andalusí y cenefas laterales discretas en el fondo */}
      <AndalusianCollectionBackdrop variant="laceria" />

      <Container className="relative z-10">
        {/* Curatorial Header */}
        <header className="max-w-3xl">
          <div className="flex items-center gap-3">
            <span className="h-px w-6 bg-white/30" />
            <p className="font-mono text-xs uppercase tracking-[0.4em] text-[#8E8A80]">
              The Art of Seeing · Exposición Permanente
            </p>
          </div>
          <h1 className="mt-4 font-serif text-4xl sm:text-5xl md:text-6xl font-light tracking-tight leading-[1.12] text-[#EBE7DF]">
            Selected Works
          </h1>
          <p className="mt-6 text-base sm:text-lg leading-relaxed text-[#8E8A80] font-light">
            Una antología visual meditada que reúne las piezas fundamentales del archivo de Javier Espinosa Martínez.
            Quince obras que capturan la comunión entre la observación paciente, la luz natural disponible y la verdad geométrica del instante.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4 text-xs font-mono uppercase tracking-[0.25em]">
            <Link
              href="/portfolio"
              className="text-[#8E8A80] transition-colors hover:text-[#EBE7DF]"
            >
              ← Ir al Catálogo Completo (100 Obras)
            </Link>
            <span className="text-white/20">·</span>
            <Link
              href="/projects"
              className="text-[#8E8A80] transition-colors hover:text-[#EBE7DF]"
            >
              Ver Series Monográficas →
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
              Criterio de Selección
            </span>
            <h2 className="mt-3 font-serif text-2xl sm:text-3xl font-light text-[#EBE7DF]">
              La mirada antes que el artificio
            </h2>
            <p className="mt-4 text-sm sm:text-base leading-relaxed text-[#8E8A80] font-light">
              Cada fotografía incluida en esta antología cumple con una premisa ética y estética irrenunciable:
              luz natural sin manipulación compositiva, fidelidad al comportamiento del sujeto y rigor óptico
              en la captura. Disponibles como copias Fine Art sobre papel de algodón 100% Hahnemühle Photo Rag® 308g
              o bajo licencia de uso editorial.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                href="/prints"
                className="inline-flex border border-[#EBE7DF] bg-[#EBE7DF] px-8 py-3.5 font-mono text-xs uppercase tracking-[0.28em] text-[#0B0C0E] font-medium transition-all duration-300 hover:bg-transparent hover:text-white"
              >
                Catálogo de Copias Certificadas
              </Link>
              <Link
                href="/contact"
                className="inline-flex border border-white/20 bg-transparent px-8 py-3.5 font-mono text-xs uppercase tracking-[0.28em] text-[#EBE7DF] transition-all duration-300 hover:border-white/50 hover:text-white"
              >
                Consultar Adquisición
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
