import Container from "@/components/ui/Container";
import CategoryNav from "@/components/portfolio/CategoryNav";
import ExhibitionGallery from "@/components/portfolio/ExhibitionGallery";
import ExpeditionMap from "@/components/portfolio/ExpeditionMap";
import {
  AndalusianBackgroundPattern,
  AndalusianCenefa,
} from "@/components/ui/AndalusianMotif";
import { buildPageMetadata } from "@/lib/metadata";
import { getAllPhotos } from "@/lib/photos";

export const metadata = buildPageMetadata({
  title: "Colecciones Fotográficas | Javier Espinosa",
  description:
    "Archivo fotográfico de autor por Javier Espinosa Martínez — Fauna y Naturaleza, Paisajes Documentales, Coches y Rally Histórico, Arquitectura Vernácula y Etnografía.",
  path: "/portfolio",
});

export default function PortfolioPage() {
  const photos = getAllPhotos();

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0B0C0E] pt-36 pb-28 text-[#EBE7DF]">
      {/* Filigrana andalusí discreta en el fondo de cabecera */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[460px]">
        <AndalusianBackgroundPattern
          variant="laceria"
          mask="top"
          className="text-[#C5A880]/[0.055]"
        />
      </div>

      <Container className="relative z-10">
        <header className="max-w-3xl">
          <div className="flex items-center gap-3">
            <span className="h-px w-6 bg-white/30" />
            <p className="font-mono text-xs uppercase tracking-[0.4em] text-[#8E8A80]">
              The Art of Seeing · Archivo Permanente
            </p>
          </div>
          <h1 className="mt-4 font-serif text-4xl sm:text-5xl md:text-6xl font-light tracking-tight leading-[1.12] text-[#EBE7DF]">
            Colecciones Fotográficas
          </h1>
          <p className="mt-6 text-base sm:text-lg leading-relaxed text-[#8E8A80] font-light">
            Una mirada pausada sobre el territorio, la memoria, la velocidad y la naturaleza salvaje.
            Explora las cinco grandes disciplinas fotográficas o recorre las 100 obras archivadas en alta resolución.
          </p>
        </header>

        <AndalusianCenefa
          variant="estrella"
          className="mt-10 text-[#C5A880]/22"
        />

        <div className="mt-8">
          <CategoryNav />
        </div>

        <div className="mt-16">
          <ExhibitionGallery photos={photos} />
        </div>

        <AndalusianCenefa
          variant="sebka"
          className="mt-20 text-[#C5A880]/18"
        />

        <ExpeditionMap />
      </Container>
    </div>
  );
}
