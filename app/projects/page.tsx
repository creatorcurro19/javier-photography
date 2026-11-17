import Container from "@/components/ui/Container";
import ProjectsInteractiveIndex from "@/components/projects/ProjectsInteractiveIndex";
import ExpeditionMap from "@/components/portfolio/ExpeditionMap";
import { buildPageMetadata } from "@/lib/metadata";
import { getAllProjects, getProjectPhotos } from "@/lib/photos";

export const metadata = buildPageMetadata({
  title: "Proyectos Seleccionados | Javier Espinosa",
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
    <div className="min-h-screen bg-[#101112] pt-36 pb-28 text-[#D8D5CD]">
      <Container>
        {/* Header */}
        <header className="max-w-3xl">
          <p className="text-xs font-mono uppercase tracking-[0.4em] text-[#95836B]">
            Narrativa Visual & Ensayos
          </p>
          <h1 className="mt-4 text-4xl sm:text-5xl md:text-6xl font-light tracking-tight leading-[1.12] text-[#D8D5CD]">
            Proyectos Seleccionados
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-[#D8D5CD]/80 font-light">
            Cuerpos de obra articulados con una intención documental y estética específica.
            Cada proyecto constituye una secuencia visual meditada donde el contexto humano, el territorio
            y la técnica dialogan con el espectador.
          </p>
        </header>

        {/* Interactive Series Index with Sequence Filmstrip */}
        <ProjectsInteractiveIndex projects={projects} />

        {/* Interactive Expedition Map */}
        <div className="mt-24">
          <ExpeditionMap />
        </div>
      </Container>
    </div>
  );
}
