import Container from "@/components/ui/Container";
import CategoryNav from "@/components/portfolio/CategoryNav";
import ExhibitionGallery from "@/components/portfolio/ExhibitionGallery";
import { buildPageMetadata } from "@/lib/metadata";
import { getAllPhotos } from "@/lib/photos";

export const metadata = buildPageMetadata({
  title: "Portfolio | Colecciones Fotográficas",
  description:
    "Archivo fotográfico de autor por Javier Espinosa Martínez — Fauna y Naturaleza, Paisajes Documentales, Coches y Rally Histórico, Arquitectura Urbana y Viajes.",
  path: "/portfolio",
});

export default function PortfolioPage() {
  const photos = getAllPhotos();

  return (
    <div className="min-h-screen bg-[#101112] pt-36 pb-28 text-[#D8D5CD]">
      <Container>
        <header className="max-w-3xl">
          <p className="text-xs font-mono uppercase tracking-[0.4em] text-[#95836B]">
            Archivo de Autor
          </p>
          <h1 className="mt-4 font-serif text-5xl font-light tracking-tight md:text-6xl text-[#D8D5CD]">
            Colecciones Fotográficas
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-[#D8D5CD]/80 font-light">
            Una mirada pausada sobre el territorio, la memoria, la velocidad y la naturaleza.
            Explora las cinco grandes disciplinas fotográficas o navega por el archivo completo.
          </p>
        </header>

        <div className="mt-12">
          <CategoryNav />
        </div>

        <div className="mt-16">
          <ExhibitionGallery photos={photos} />
        </div>
      </Container>
    </div>
  );
}
