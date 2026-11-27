import Container from "@/components/ui/Container";
import {
  AndalusianCollectionBackdrop,
  AndalusianCenefa,
} from "@/components/ui/AndalusianMotif";
import ProjectsInteractiveIndex from "@/components/projects/ProjectsInteractiveIndex";
import ExpeditionMap from "@/components/portfolio/ExpeditionMap";
import JsonLd from "@/components/seo/JsonLd";
import { buildPageMetadata } from "@/lib/metadata";
import { getAllProjects, getProjectPhotos } from "@/lib/photos";
import { generateBreadcrumbSchema } from "@/lib/schema";

export const metadata = buildPageMetadata({
  title: "Series Fotográficas Documentales | Javier Espinosa",
  description:
    "Series fotográficas y ensayos documentales de Javier Espinosa: La Vera, paisaje volcánico de Canarias, rally histórico, Marrakech, Sahara y fauna.",
  path: "/projects",
});

export default function ProjectsPage() {
  const projects = getAllProjects().map((proj) => ({
    ...proj,
    resolvedPhotos: getProjectPhotos(proj),
  }));

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0B0C0E] pt-36 pb-28 text-[#EBE7DF]">
      <JsonLd
        data={generateBreadcrumbSchema([
          { name: "Inicio", path: "/" },
          { name: "Series Monográficas", path: "/projects" },
        ])}
      />
      {/* Fondo discreto de sebka y cenefas laterales andalusíes */}
      <AndalusianCollectionBackdrop variant="sebka" />

      <Container className="relative z-10">
        {/* Header */}
        <header className="max-w-3xl">
          <div className="flex items-center gap-3">
            <span className="h-px w-6 bg-white/30" />
            <p className="font-mono text-xs uppercase tracking-[0.4em] text-[#8E8A80]">
              The Art of Seeing · Proyectos y Series
            </p>
          </div>
          <h1 className="mt-4 font-serif text-4xl sm:text-5xl md:text-6xl font-light tracking-tight leading-[1.12] text-[#EBE7DF]">
            Series Fotográficas
          </h1>
          <p className="mt-6 text-base sm:text-lg leading-relaxed text-[#8E8A80] font-light">
            Hay lugares y temas que no caben en una sola foto. Esta sección reúne {projects.length} series trabajadas con más calma: oficios que siguen vivos, pueblos de piedra y madera en La Vera, la niebla y la costa volcánica de Canarias, los talleres de Marrakech, el desierto, la fauna y los rallies de clásicos.
          </p>
        </header>

        <AndalusianCenefa
          variant="sebka"
          className="mt-10 text-[#C5A880]/32"
        />

        {/* Interactive Series Index with Sequence Filmstrip */}
        <div className="mt-10">
          <ProjectsInteractiveIndex projects={projects} />
        </div>

        <AndalusianCenefa
          variant="estrella"
          className="mt-20 text-[#C5A880]/28"
        />

        {/* Interactive Expedition Map */}
        <div className="mt-16">
          <ExpeditionMap />
        </div>
      </Container>
    </div>
  );
}
