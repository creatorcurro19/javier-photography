"use client";

import Link from "@/components/ui/LocalizedLink";
import Container from "@/components/ui/Container";
import {
  AndalusianCollectionBackdrop,
  AndalusianCenefa,
} from "@/components/ui/AndalusianMotif";
import ExhibitionGallery from "@/components/portfolio/ExhibitionGallery";
import { useLanguage } from "@/lib/i18n";
import type { Photo } from "@/types/photo";

interface SelectedWorkContentProps {
  featuredPhotos: Photo[];
  totalArchiveCount: number;
}

export default function SelectedWorkContent({
  featuredPhotos,
  totalArchiveCount,
}: SelectedWorkContentProps) {
  const { t } = useLanguage();

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0B0C0E] pt-36 pb-28 text-[#EBE7DF]">
      {/* Filigrana andalusí y cenefas laterales discretas en el fondo */}
      <AndalusianCollectionBackdrop variant="laceria" />

      <Container className="relative z-10">
        {/* Curatorial Header */}
        <header className="max-w-3xl">
          <div className="flex items-center gap-3">
            <span className="h-px w-6 bg-white/30" />
            <p className="font-mono text-xs uppercase tracking-[0.4em] text-[#A39E93]">
              {t(
                "Archivo Fotográfico · Selección Principal",
                "Photographic Archive · Curated Selection"
              )}
            </p>
          </div>
          <h1 className="mt-4 font-serif text-4xl sm:text-5xl md:text-6xl font-light tracking-tight leading-[1.12] text-[#EBE7DF]">
            {t("Obras Seleccionadas", "Selected Works")}
          </h1>
          <p className="mt-2 font-mono text-xs uppercase tracking-[0.25em] text-[#C5A880]">
            {featuredPhotos.length}{" "}
            {t("Fotografías del Archivo", "Archive Photographs")}
          </p>
          <p className="mt-6 text-base sm:text-lg leading-relaxed text-[#8E8A80] font-light">
            {t(
              `${featuredPhotos.length} fotografías elegidas entre distintas series y lugares. Hay fauna, montaña, asfalto, callejones en penumbra y talleres donde todavía se trabaja a mano. No responden a un único tema, pero sí a una misma costumbre: detenerse, esperar a que la luz acompañe y observar con calma lo que ocurre delante.`,
              `${featuredPhotos.length} photographs selected across different series and places — wildlife, high mountains, tarmac, shadowed alleyways, and workshops where craft is still done by hand. Rather than one single theme, they share one habit: stopping, waiting for the right light, and observing quietly.`
            )}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4 text-xs font-mono uppercase tracking-[0.25em]">
            <Link
              href="/portfolio"
              className="text-[#8E8A80] transition-colors hover:text-[#EBE7DF]"
            >
              {t(
                `← Ver el Archivo Completo (${totalArchiveCount} Fotografías)`,
                `← View Full Archive (${totalArchiveCount} Photographs)`
              )}
            </Link>
            <span className="text-white/20">·</span>
            <Link
              href="/projects"
              className="text-[#8E8A80] transition-colors hover:text-[#EBE7DF]"
            >
              {t("Ver Series y Proyectos →", "View Series & Projects →")}
            </Link>
          </div>
        </header>

        <AndalusianCenefa
          variant="estrella"
          className="mt-12 text-[#C5A880]/32"
        />

        {/* Selected Artworks Gallery */}
        <div className="mt-14">
          <ExhibitionGallery photos={featuredPhotos} showMeta />
        </div>

        {/* Curatorial Note & Archival Assurance */}
        <div className="mt-24 border border-white/[0.08] bg-[#151618] p-8 sm:p-12 lg:p-16">
          <div className="max-w-2xl">
            <span className="font-mono text-xs uppercase tracking-[0.35em] text-[#8E8A80]">
              {t("Sobre esta selección", "About this selection")}
            </span>
            <h2 className="mt-3 font-serif text-2xl sm:text-3xl font-light text-[#EBE7DF]">
              {t("Observar antes de disparar", "Observing before pressing the shutter")}
            </h2>
            <p className="mt-4 text-sm sm:text-base leading-relaxed text-[#8E8A80] font-light">
              {t(
                "A veces una fotografía aparece después de horas esperando en el campo; otras, al doblar una esquina y encontrar cómo entra el sol en una calle estrecha. Todas las imágenes de esta página están tomadas con luz natural y pueden encargarse como copia sobre papel de algodón Hahnemühle Photo Rag® 308g o bajo licencia editorial.",
                "Sometimes a photograph appears after hours waiting in the field; at other times, when turning a corner and finding sunlight cutting through a narrow street. Every image on this page is captured in natural light and available as a Fine Art print on Hahnemühle Photo Rag® 308g cotton paper or under editorial licensing."
              )}
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                href="/prints"
                className="inline-flex border border-[#EBE7DF] bg-[#EBE7DF] px-8 py-3.5 font-mono text-xs uppercase tracking-[0.28em] text-[#0B0C0E] font-medium transition-all duration-300 hover:bg-transparent hover:text-white"
              >
                {t(
                  "Ver Copias en Papel Hahnemühle",
                  "View Hahnemühle Cotton Prints"
                )}
              </Link>
              <Link
                href="/contact"
                className="inline-flex border border-white/20 bg-transparent px-8 py-3.5 font-mono text-xs uppercase tracking-[0.28em] text-[#EBE7DF] transition-all duration-300 hover:border-white/50 hover:text-white"
              >
                {t("Consultar", "Inquire")}
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
