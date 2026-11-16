import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Container from "@/components/ui/Container";
import ExhibitionGallery from "@/components/portfolio/ExhibitionGallery";
import { buildPageMetadata } from "@/lib/metadata";
import { getAllProjects, getProjectBySlug, getProjectPhotos } from "@/lib/photos";

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
    <article className="min-h-screen bg-[#101112] pt-32 pb-28 text-[#D8D5CD]">
      {/* Breadcrumb Bar */}
      <div className="border-b border-[#1D2021] bg-[#101112]/60">
        <Container className="py-4">
          <nav aria-label="Miga de pan" className="flex items-center gap-2 text-xs font-mono text-neutral-400">
            <Link href="/" className="hover:text-[#D8D5CD] transition">Inicio</Link>
            <span className="text-[#95836B]">/</span>
            <Link href="/projects" className="hover:text-[#D8D5CD] transition">Proyectos</Link>
            <span className="text-[#95836B]">/</span>
            <span className="text-[#D8D5CD] truncate">{project.title}</span>
          </nav>
        </Container>
      </div>

      <Container className="mt-12">
        {/* Project Header */}
        <header className="max-w-4xl border-b border-[#1D2021] pb-12">
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full border border-[#1D2021] bg-[#1D2021] px-3.5 py-1 text-xs font-mono uppercase tracking-[0.2em] text-[#95836B]">
              {project.discipline}
            </span>
            <span className="text-xs font-mono text-neutral-600">·</span>
            <span className="text-xs font-mono uppercase tracking-wider text-neutral-400">
              {project.year}
            </span>
            {project.location && (
              <>
                <span className="text-xs font-mono text-neutral-600">·</span>
                <span className="text-xs font-mono text-neutral-400">{project.location}</span>
              </>
            )}
          </div>

          <h1 className="mt-6 font-serif text-4xl font-light text-[#D8D5CD] sm:text-5xl md:text-6xl tracking-tight">
            {project.title}
          </h1>

          <p className="mt-3 font-mono text-sm uppercase tracking-[0.15em] text-[#95836B]">
            {project.subtitle}
          </p>

          <p className="mt-6 text-lg sm:text-xl font-light leading-relaxed text-[#D8D5CD]/90">
            {project.description}
          </p>

          {/* Curatorial Statement */}
          <div className="mt-8 space-y-4 rounded-xl border border-[#1D2021] bg-[#1D2021]/30 p-8 sm:p-10">
            <h2 className="text-xs font-mono uppercase tracking-[0.3em] text-[#95836B]">
              Declaración del Proyecto
            </h2>
            {project.statement.map((paragraph, i) => (
              <p key={i} className="text-sm sm:text-base font-light leading-relaxed text-neutral-300">
                {paragraph}
              </p>
            ))}
          </div>

          <div className="mt-6 flex items-center justify-between text-xs font-mono text-neutral-400">
            <span>Secuencia narrativa: {projectPhotos.length} obras</span>
            <span>Canon EOS R7 · Luz Natural</span>
          </div>
        </header>

        {/* Exhibition Sequence */}
        <section className="mt-16" aria-label={`Secuencia fotográfica del proyecto ${project.title}`}>
          <div className="mb-8 flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-[0.3em] text-[#95836B]">
              Obras del Proyecto ({projectPhotos.length})
            </span>
            <span className="text-xs font-mono text-neutral-500">
              Haga clic sobre cualquier imagen para ver a pantalla completa
            </span>
          </div>

          <ExhibitionGallery photos={projectPhotos} showMeta />
        </section>

        {/* Adjacent Project Navigation */}
        <nav aria-label="Navegación entre proyectos" className="mt-24 border-t border-[#1D2021] pt-12">
          <div className="flex items-center justify-between gap-4 text-xs font-mono uppercase tracking-[0.2em]">
            {prevProject ? (
              <Link
                href={`/projects/${prevProject.slug}`}
                className="group flex flex-col items-start gap-1 text-neutral-400 hover:text-[#D8D5CD] transition"
              >
                <span className="text-[10px] text-[#95836B]">← Proyecto Anterior</span>
                <span className="font-serif text-base normal-case tracking-normal text-[#D8D5CD] group-hover:text-white truncate max-w-[200px] sm:max-w-xs">
                  {prevProject.title}
                </span>
              </Link>
            ) : <div />}

            <Link
              href="/projects"
              className="hidden sm:inline-flex items-center gap-1.5 text-neutral-400 hover:text-[#D8D5CD] transition text-xs"
            >
              <span>Ver Todos los Proyectos ({allProjects.length})</span>
            </Link>

            {nextProject ? (
              <Link
                href={`/projects/${nextProject.slug}`}
                className="group flex flex-col items-end gap-1 text-neutral-400 hover:text-[#D8D5CD] transition text-right"
              >
                <span className="text-[10px] text-[#95836B]">Siguiente Proyecto →</span>
                <span className="font-serif text-base normal-case tracking-normal text-[#D8D5CD] group-hover:text-white truncate max-w-[200px] sm:max-w-xs">
                  {nextProject.title}
                </span>
              </Link>
            ) : <div />}
          </div>
        </nav>
      </Container>
    </article>
  );
}
