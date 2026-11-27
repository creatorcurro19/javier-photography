"use client";

import Link from "next/link";
import Container from "@/components/ui/Container";
import FieldJournalExplorer from "@/components/stories/FieldJournalExplorer";
import {
  AndalusianCenefa,
  AndalusianCornerOrnaments,
  AndalusianPageBackdrop,
  AndalusianStarMark,
} from "@/components/ui/AndalusianMotif";
import { useLanguage } from "@/lib/i18n";
import type { Photo } from "@/types/photo";

interface StoriesPageContentProps {
  stories: Photo[];
  totalWorksCount: number;
}

export default function StoriesPageContent({
  stories,
  totalWorksCount,
}: StoriesPageContentProps) {
  const { t } = useLanguage();

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0B0C0E] pt-36 pb-28 text-[#EBE7DF]">
      <AndalusianPageBackdrop variant="sebka" />
      <Container className="relative z-10">
        {/* Header */}
        <div className="max-w-3xl">
          <div className="flex items-center gap-2.5">
            <AndalusianStarMark className="h-3.5 w-3.5 text-[#C5A880]/75" />
            <p className="font-mono text-xs uppercase tracking-[0.4em] text-[#C5A880]/85">
              {t(
                "The Art of Seeing · Notas de Campo",
                "The Art of Seeing · Field Notes"
              )}
            </p>
          </div>
          <h1 className="mt-4 font-serif text-4xl sm:text-5xl lg:text-6xl font-light tracking-tight text-[#EBE7DF]">
            {t("Cuaderno de campo", "Field journal")}
          </h1>
          <p className="mt-6 text-base sm:text-lg leading-relaxed text-[#8E8A80] font-light">
            {t(
              "Detrás de algunas fotografías hay horas de espera en el monte, una luz que duró pocos minutos o una escena encontrada casi por casualidad. Aquí recojo breves apuntes sobre dónde y cómo se tomaron varias imágenes del archivo, junto con sus datos técnicos reales.",
              "Behind certain photographs lie hours waiting in the mountains, fleeting light that lasted only minutes, or scenes stumbled upon unexpectedly. Here I share short field notes on where and how select archive photographs were made, alongside their camera data."
            )}
          </p>
        </div>

        <AndalusianCenefa
          variant="sebka"
          className="mt-10 text-[#C5A880]/38"
        />

        {/* Interactive Explorer */}
        <div className="mt-10">
          <FieldJournalExplorer stories={stories} />
        </div>

        {/* Archive CTA */}
        <div className="relative mt-20 border border-[#C5A880]/25 bg-[#151618]/95 p-8 text-center sm:p-14">
          <AndalusianCornerOrnaments className="text-[#C5A880]/50" />
          <p className="font-mono text-xs uppercase tracking-[0.35em] text-[#8E8A80]">
            {t("Archivo Completo", "Complete Archive")}
          </p>
          <h2 className="mt-2 font-serif text-3xl font-light text-[#EBE7DF]">
            {t(
              `Explorar las ${totalWorksCount} obras del catálogo`,
              `Explore all ${totalWorksCount} cataloged works`
            )}
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-sm text-[#8E8A80] font-light">
            {t(
              "Recorre las 5 salas de exposición organizadas por disciplinas temáticas, focales ópticas y visor de alta resolución.",
              "Browse all 5 exhibition collections organized by subject, focal length, and high-resolution viewing."
            )}
          </p>
          <div className="mt-8">
            <Link
              href="/portfolio"
              className="inline-flex border border-[#EBE7DF] bg-[#EBE7DF] px-8 py-3.5 font-mono text-xs uppercase tracking-[0.28em] text-[#0B0C0E] font-medium transition-all duration-300 hover:bg-transparent hover:text-white"
            >
              {t("Ir al Catálogo Completo", "Go to Full Archive")}
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
}
