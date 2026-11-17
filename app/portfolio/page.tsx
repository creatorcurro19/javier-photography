import Container from "@/components/ui/Container";
import CategoryNav from "@/components/portfolio/CategoryNav";
import ExhibitionGallery from "@/components/portfolio/ExhibitionGallery";
import ExpeditionMap from "@/components/portfolio/ExpeditionMap";
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
    <div className="min-h-screen bg-[#0B0C0E] pt-36 pb-28 text-[#EBE7DF]">
      <Container>
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

        <div className="mt-12">
          <CategoryNav />
        </div>

        <div className="mt-16">
          <ExhibitionGallery photos={photos} />
        </div>

        <ExpeditionMap />
      </Container>
    </div>
  );
}
