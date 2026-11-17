import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Container from "@/components/ui/Container";
import {
  AndalusianCollectionBackdrop,
  AndalusianCenefa,
} from "@/components/ui/AndalusianMotif";
import ExhibitionGallery from "@/components/portfolio/ExhibitionGallery";
import ProjectEssayContainer from "@/components/portfolio/ProjectEssayContainer";
import JsonLd from "@/components/seo/JsonLd";
import { buildPageMetadata } from "@/lib/metadata";
import { getAllProjects, getProjectBySlug, getProjectPhotos } from "@/lib/photos";
import { generateBreadcrumbSchema, generateProjectSchema } from "@/lib/schema";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return getAllProjects().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    return {};
  }

  return buildPageMetadata({
    title: `${project.title} | Javier Espinosa`,
    description: project.description,
    path: `/projects/${project.slug}`,
    image: project.coverImage,
  });
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  const projectPhotos = getProjectPhotos(project);
  const allProjects = getAllProjects();
  const currentIndex = allProjects.findIndex((p) => p.slug === slug);
  const prevProject = currentIndex > 0 ? allProjects[currentIndex - 1] : undefined;
  const nextProject =
    currentIndex < allProjects.length - 1 ? allProjects[currentIndex + 1] : undefined;

  return (
    <ProjectEssayContainer>
      <JsonLd data={generateProjectSchema(project, projectPhotos)} />
      <JsonLd
        data={generateBreadcrumbSchema([
          { name: "Inicio", path: "/" },
          { name: "Proyectos", path: "/projects" },
          { name: project.title, path: `/projects/${project.slug}` },
        ])}
      />
      {/* Breadcrumb Bar */}
      <div className="border-b border-white/[0.08] bg-[#0B0C0E]/80 backdrop-blur-md">
        <Container className="py-4">
          <nav aria-label="Miga de pan" className="flex items-center gap-2 text-xs font-mono text-[#8E8A80]">
            <Link href="/" className="hover:text-[#EBE7DF] transition">Inicio</Link>
            <span className="text-white/20">/</span>
            <Link href="/projects" className="hover:text-[#EBE7DF] transition">Series Monográficas</Link>
            <span className="text-white/20">/</span>
            <span className="text-[#EBE7DF] truncate">{project.title}</span>
          </nav>
        </Container>
      </div>

      <div className="relative overflow-hidden">
        {/* Filigrana andalusí y cenefas laterales discretas en el fondo de la serie */}
        <AndalusianCollectionBackdrop variant="laceria" />

        <Container className="relative z-10 mt-12">
          {/* Project Header */}
          <header className="max-w-4xl pb-10">
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full border border-white/[0.1] bg-[#151618] px-3.5 py-1 text-xs font-mono uppercase tracking-[0.2em] text-[#8E8A80]">
              {project.discipline}
            </span>
            <span className="text-xs font-mono text-white/20">·</span>
            <span className="text-xs font-mono uppercase tracking-wider text-[#8E8A80]">
              {project.year}
            </span>
            {project.location && (
              <>
                <span className="text-xs font-mono text-white/20">·</span>
                <span className="text-xs font-mono text-[#8E8A80]">{project.location}</span>
              </>
            )}
          </div>

          <h1 className="mt-6 font-serif text-4xl font-light text-[#EBE7DF] sm:text-5xl md:text-6xl tracking-wide leading-[1.15]">
            {project.title}
          </h1>

          <p className="mt-3 font-mono text-sm uppercase tracking-[0.15em] text-[#8E8A80]">
            {project.subtitle}
          </p>

          <p className="mt-6 text-lg sm:text-xl font-light leading-relaxed text-[#EBE7DF]/90">
            {project.description}
          </p>

          {/* Curatorial Statement */}
          <div className="mt-8 space-y-4 border border-white/[0.08] bg-[#151618] p-8 sm:p-10">
            <h2 className="text-xs font-mono uppercase tracking-[0.3em] text-[#8E8A80]">
              Declaración del Proyecto
            </h2>
            {project.statement.map((paragraph, i) => (
              <p key={i} className="text-sm sm:text-base font-light leading-relaxed text-[#8E8A80]">
                {paragraph}
              </p>
            ))}
          </div>

          <div className="mt-6 flex items-center justify-between text-xs font-mono text-[#8E8A80]">
            <span>Secuencia narrativa: {projectPhotos.length} obras</span>
            <span>Canon EOS R7 · Luz Natural</span>
          </div>
        </header>

        <AndalusianCenefa
          variant="estrella"
          className="text-[#C5A880]/32"
        />

        {/* Exhibition Sequence */}
        <section className="mt-14" aria-label={`Secuencia fotográfica del proyecto ${project.title}`}>
          <div className="mb-8 flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-[0.3em] text-[#8E8A80]">
              Obras del Proyecto ({projectPhotos.length})
            </span>
            <span className="text-xs font-mono text-[#8E8A80]/70 hidden sm:inline">
              Haga clic sobre cualquier imagen para ver a pantalla completa
            </span>
          </div>

          <ExhibitionGallery photos={projectPhotos} showMeta />
        </section>

        {/* Adjacent Project Navigation */}
        <nav aria-label="Navegación entre proyectos" className="mt-24 border-t border-white/[0.08] pt-12">
          <div className="flex items-center justify-between gap-4 text-xs font-mono uppercase tracking-[0.2em]">
            {prevProject ? (
              <Link
                href={`/projects/${prevProject.slug}`}
                className="group flex flex-col items-start gap-1 text-[#8E8A80] hover:text-[#EBE7DF] transition"
              >
                <span className="text-[10px] text-[#8E8A80]">← Proyecto Anterior</span>
                <span className="font-serif text-base normal-case tracking-normal text-[#EBE7DF] group-hover:text-white truncate max-w-[200px] sm:max-w-xs">
                  {prevProject.title}
                </span>
              </Link>
            ) : <div />}

            <Link
              href="/projects"
              className="hidden sm:inline-flex items-center gap-1.5 text-[#8E8A80] hover:text-[#EBE7DF] transition text-xs font-mono"
            >
              <span>Ver Todos los Proyectos ({allProjects.length})</span>
            </Link>

            {nextProject ? (
              <Link
                href={`/projects/${nextProject.slug}`}
                className="group flex flex-col items-end gap-1 text-[#8E8A80] hover:text-[#EBE7DF] transition text-right"
              >
                <span className="text-[10px] text-[#8E8A80]">Siguiente Proyecto →</span>
                <span className="font-serif text-base normal-case tracking-normal text-[#EBE7DF] group-hover:text-white truncate max-w-[200px] sm:max-w-xs">
                  {nextProject.title}
                </span>
              </Link>
            ) : <div />}
          </div>
        </nav>
        </Container>
      </div>
    </ProjectEssayContainer>
  );
}
