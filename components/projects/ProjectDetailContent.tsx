"use client";

import Link from "@/components/ui/LocalizedLink";
import Container from "@/components/ui/Container";
import {
  AndalusianCollectionBackdrop,
  AndalusianCenefa,
} from "@/components/ui/AndalusianMotif";
import ExhibitionGallery from "@/components/portfolio/ExhibitionGallery";
import ProjectEssayContainer from "@/components/portfolio/ProjectEssayContainer";
import { useLanguage } from "@/lib/i18n";
import { getLocalizedProject } from "@/lib/i18n-works";
import type { Photo, Project } from "@/types/photo";

interface ProjectDetailContentProps {
  rawProject: Project;
  projectPhotos: Photo[];
  prevProject?: Project;
  nextProject?: Project;
  totalProjects: number;
}

export default function ProjectDetailContent({
  rawProject,
  projectPhotos,
  prevProject,
  nextProject,
  totalProjects,
}: ProjectDetailContentProps) {
  const { lang, t } = useLanguage();
  const project = getLocalizedProject(rawProject, lang);
  const prevLoc = prevProject ? getLocalizedProject(prevProject, lang) : undefined;
  const nextLoc = nextProject ? getLocalizedProject(nextProject, lang) : undefined;

  return (
    <ProjectEssayContainer>
      {/* Breadcrumb Bar */}
      <div className="border-b border-white/[0.08] bg-[#0B0C0E]/80 backdrop-blur-md">
        <Container className="py-4">
          <nav
            aria-label={t("Miga de pan", "Breadcrumb")}
            className="flex items-center gap-2 text-xs font-mono text-[#A39E93]"
          >
            <Link href="/" className="hover:text-[#EBE7DF] transition">
              {t("Inicio", "Home")}
            </Link>
            <span className="text-white/25">/</span>
            <Link href="/projects" className="hover:text-[#EBE7DF] transition">
              {t("Series", "Series")}
            </Link>
            <span className="text-white/25">/</span>
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
                  <span className="text-xs font-mono text-[#8E8A80]">
                    {project.location}
                  </span>
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
                {t("Declaración del Proyecto", "Project Statement")}
              </h2>
              {project.statement.map((paragraph, i) => (
                <p
                  key={i}
                  className="text-sm sm:text-base font-light leading-relaxed text-[#8E8A80]"
                >
                  {paragraph}
                </p>
              ))}
            </div>

            <div className="mt-6 flex items-center justify-between text-xs font-mono text-[#8E8A80]">
              <span>
                {t(
                  `Secuencia narrativa: ${projectPhotos.length} obras`,
                  `Narrative sequence: ${projectPhotos.length} works`
                )}
              </span>
              <span>{t("Canon EOS R7 · Luz Natural", "Canon EOS R7 · Natural Light")}</span>
            </div>
          </header>

          <AndalusianCenefa
            variant="estrella"
            className="text-[#C5A880]/32"
          />

          {/* Exhibition Sequence */}
          <section
            className="mt-14"
            aria-label={t(
              `Secuencia fotográfica del proyecto ${project.title}`,
              `Photographic sequence for ${project.title}`
            )}
          >
            <div className="mb-8 flex items-center justify-between">
              <span className="text-xs font-mono uppercase tracking-[0.3em] text-[#8E8A80]">
                {t(
                  `Obras del Proyecto (${projectPhotos.length})`,
                  `Project Works (${projectPhotos.length})`
                )}
              </span>
              <span className="text-xs font-mono text-[#8E8A80]/70 hidden sm:inline">
                {t(
                  "Haz clic sobre cualquier fotografía para abrir su ficha completa",
                  "Click any photograph to open its full sheet"
                )}
              </span>
            </div>

            <ExhibitionGallery photos={projectPhotos} showMeta />
          </section>

          {/* Adjacent Project Navigation */}
          <nav
            aria-label={t(
              "Navegación entre proyectos",
              "Navigation between series"
            )}
            className="mt-24 border-t border-white/[0.08] pt-12"
          >
            <div className="flex items-center justify-between gap-4 text-xs font-mono uppercase tracking-[0.2em]">
              {prevLoc ? (
                <Link
                  href={`/projects/${prevLoc.slug}`}
                  className="group flex flex-col items-start gap-1 text-[#8E8A80] hover:text-[#EBE7DF] transition"
                >
                  <span className="text-[10px] text-[#8E8A80]">
                    {t("← Proyecto Anterior", "← Previous Series")}
                  </span>
                  <span className="font-serif text-base normal-case tracking-normal text-[#EBE7DF] group-hover:text-white truncate max-w-[200px] sm:max-w-xs">
                    {prevLoc.title}
                  </span>
                </Link>
              ) : (
                <div />
              )}

              <Link
                href="/projects"
                className="hidden sm:inline-flex items-center gap-1.5 text-[#8E8A80] hover:text-[#EBE7DF] transition text-xs font-mono"
              >
                <span>
                  {t(
                    `Ver Todos los Proyectos (${totalProjects})`,
                    `View All Series (${totalProjects})`
                  )}
                </span>
              </Link>

              {nextLoc ? (
                <Link
                  href={`/projects/${nextLoc.slug}`}
                  className="group flex flex-col items-end gap-1 text-[#8E8A80] hover:text-[#EBE7DF] transition text-right"
                >
                  <span className="text-[10px] text-[#8E8A80]">
                    {t("Siguiente Proyecto →", "Next Series →")}
                  </span>
                  <span className="font-serif text-base normal-case tracking-normal text-[#EBE7DF] group-hover:text-white truncate max-w-[200px] sm:max-w-xs">
                    {nextLoc.title}
                  </span>
                </Link>
              ) : (
                <div />
              )}
            </div>
          </nav>
        </Container>
      </div>
    </ProjectEssayContainer>
  );
}
