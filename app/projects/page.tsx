import Container from "@/components/ui/Container";
import ProjectsInteractiveIndex from "@/components/projects/ProjectsInteractiveIndex";
import ExpeditionMap from "@/components/portfolio/ExpeditionMap";
import { buildPageMetadata } from "@/lib/metadata";
import { getAllProjects, getProjectPhotos } from "@/lib/photos";

export const metadata = buildPageMetadata({
  title: "Series Monográficas & Ensayos | Javier Espinosa",
  description:
    "Series fotográficas y ensayos documentales por Javier Espinosa Martínez. Narrativas visuales sobre memoria, oficios tradicionales, orografía del territorio y automovilismo.",
  path: "/projects",
});

export default function ProjectsPage() {
  const projects = getAllProjects().map((proj) => ({
    ...proj,
    resolvedPhotos: getProjectPhotos(proj),
  }));

  return (
    <div className="min-h-screen bg-[#0B0C0E] pt-36 pb-28 text-[#EBE7DF]">
      <Container>
        {/* Header */}
        <header className="max-w-3xl">
          <div className="flex items-center gap-3">
            <span className="h-px w-6 bg-white/30" />
            <p className="font-mono text-xs uppercase tracking-[0.4em] text-[#8E8A80]">
              The Art of Seeing · Ensayos de Autor
            </p>
          </div>
          <h1 className="mt-4 font-serif text-4xl sm:text-5xl md:text-6xl font-light tracking-tight leading-[1.12] text-[#EBE7DF]">
            Series Monográficas
          </h1>
          <p className="mt-6 text-base sm:text-lg leading-relaxed text-[#8E8A80] font-light">
            Cuerpos de obra articulados con una intención documental y estética específica.
            Cada proyecto constituye una secuencia visual meditada donde el contexto humano, el territorio
            y la técnica dialogan con el espectador.
          </p>
        </header>

        {/* Interactive Series Index with Sequence Filmstrip */}
        <div className="mt-12">
          <ProjectsInteractiveIndex projects={projects} />
        </div>

        {/* Interactive Expedition Map */}
        <div className="mt-24">
          <ExpeditionMap />
        </div>
      </Container>
    </div>
  );
}
