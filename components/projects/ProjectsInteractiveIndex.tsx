"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Photo, Project } from "@/types/photo";
import { useLanguage } from "@/lib/i18n";
import { getLocalizedPhoto, getLocalizedProject } from "@/lib/i18n-works";

type EnrichedProject = Project & {
  resolvedPhotos: Photo[];
};

const DISCIPLINE_FILTERS = [
  { id: "all", labelEs: "Todas las Series", labelEn: "All Series" },
  { id: "fauna-naturaleza", labelEs: "Fauna & Biodiversidad", labelEn: "Wildlife & Nature" },
  { id: "paisajes-documental", labelEs: "Paisaje & Desierto", labelEn: "Landscapes & Desert" },
  { id: "arquitectura-urbana", labelEs: "Patrimonio & Arquitectura", labelEn: "Heritage & Architecture" },
  { id: "viajes-cultura", labelEs: "Oficios & Tradición", labelEn: "Crafts & Documentary" },
  { id: "coches-rally", labelEs: "Rally Histórico", labelEn: "Historic Rally" },
];

export default function ProjectsInteractiveIndex({
  projects,
}: {
  projects: EnrichedProject[];
}) {
  const { lang, t } = useLanguage();
  const [activeCategory, setActiveCategory] = useState<string>("all");
  // Track which photo index is currently previewed per project id
  const [activePreviewByProject, setActivePreviewByProject] = useState<
    Record<string, number>
  >({});

  const filtered = useMemo(() => {
    if (activeCategory === "all") return projects;
    return projects.filter((p) => p.category === activeCategory);
  }, [projects, activeCategory]);

  return (
    <div className="mt-14">
      {/* Interactive Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-y border-[#202226] bg-[#151618]/50 px-5 py-4">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar scroll-smooth py-1 -mx-5 px-5 sm:mx-0 sm:px-0 sm:flex-wrap">
          {DISCIPLINE_FILTERS.map((f) => {
            const active = activeCategory === f.id;
            return (
              <button
                key={f.id}
                type="button"
                onClick={() => setActiveCategory(f.id)}
                className={`shrink-0 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.22em] transition ${
                  active
                    ? "border border-[#8E8A80] bg-[#8E8A80]/20 text-[#EBE7DF]"
                    : "border border-transparent text-neutral-400 hover:border-[#202226] hover:text-[#EBE7DF]"
                }`}
              >
                {lang === "en" ? f.labelEn : f.labelEs}
              </button>
            );
          })}
        </div>

        <span className="shrink-0 font-mono text-[10px] uppercase tracking-[0.25em] text-[#8E8A80]">
          {filtered.length} {t("ensayos monográficos", "monographic essays")}
        </span>
      </div>

      {/* Interactive Project List */}
      <div className="mt-16 space-y-20">
        {filtered.map((rawProject, index) => {
          const project = getLocalizedProject(rawProject, lang);
          const previewIndex = activePreviewByProject[project.id] ?? -1;
          const rawActivePhoto =
            previewIndex >= 0 ? rawProject.resolvedPhotos[previewIndex] : null;
          const activePhoto = rawActivePhoto ? getLocalizedPhoto(rawActivePhoto, lang) : null;
          const stageImage = activePhoto ? activePhoto.image : project.coverImage;
          const stageTitle = activePhoto ? activePhoto.title : project.title;
          const stageSub = activePhoto
            ? `${activePhoto.focalLength} · ${activePhoto.aperture} · ${activePhoto.shutter}`
            : project.discipline;

          return (
            <article
              key={project.id}
              className="grid grid-cols-1 items-center gap-10 border border-[#202226] bg-[#151618]/40 p-6 transition duration-500 hover:border-[#8E8A80]/60 sm:p-10 lg:grid-cols-12 lg:gap-14"
            >
              {/* Cover + Interactive Filmstrip side (7 cols) */}
              <div
                className={`lg:col-span-7 ${
                  index % 2 === 1 ? "lg:order-2" : "lg:order-1"
                }`}
              >
                <Link
                  href={`/projects/${project.slug}`}
                  className="group relative block aspect-[3/2] w-full overflow-hidden border border-[#202226] bg-[#0B0C0E]"
                >
                  <Image
                    key={stageImage}
                    src={stageImage}
                    alt={stageTitle}
                    fill
                    sizes="(max-width: 1024px) 100vw, 60vw"
                    quality={85}
                    className="object-cover transition duration-700 group-hover:scale-[1.03]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0B0C0E] via-transparent to-transparent" />

                  <div className="absolute top-4 left-4 flex items-center gap-2">
                    <span className="border border-[#202226] bg-[#0B0C0E]/90 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.25em] text-[#8E8A80] backdrop-blur-md">
                      {t("ENSAYO", "ESSAY")} 0{index + 1} · {project.discipline}
                    </span>
                  </div>

                  <div className="absolute right-4 bottom-4 left-4 flex items-end justify-between">
                    <div className="border border-[#202226] bg-[#0B0C0E]/85 px-3.5 py-2 backdrop-blur-md">
                      <p className="font-serif text-base text-[#EBE7DF]">
                        {stageTitle}
                      </p>
                      <p className="font-mono text-[9px] uppercase tracking-wider text-[#8E8A80]">
                        {stageSub}
                      </p>
                    </div>
                  </div>
                </Link>

                {/* Interactive Sequence Filmstrip */}
                {rawProject.resolvedPhotos.length > 0 && (
                  <div className="mt-3">
                    <div className="mb-1.5 flex items-center justify-between font-mono text-[9px] uppercase tracking-[0.22em] text-neutral-500">
                      <span>
                        {t(
                          "Secuencia del Ensayo (toca o pasa el cursor para previsualizar)",
                          "Essay Sequence (tap or hover to preview)"
                        )}
                      </span>
                      {previewIndex >= 0 && (
                        <button
                          type="button"
                          onClick={() =>
                            setActivePreviewByProject((prev) => ({
                              ...prev,
                              [project.id]: -1,
                            }))
                          }
                          className="text-[#8E8A80] hover:text-white"
                        >
                          {t("Restaurar portada", "Reset cover")}
                        </button>
                      )}
                    </div>
                    <div className="grid grid-cols-6 gap-2">
                      {rawProject.resolvedPhotos.slice(0, 6).map((rawPhoto, pIdx) => {
                        const photo = getLocalizedPhoto(rawPhoto, lang);
                        const isCurrent = previewIndex === pIdx;
                        return (
                          <button
                            key={photo.id}
                            type="button"
                            onMouseEnter={() =>
                              setActivePreviewByProject((prev) => ({
                                ...prev,
                                [project.id]: pIdx,
                              }))
                            }
                            onClick={() =>
                              setActivePreviewByProject((prev) => ({
                                ...prev,
                                [project.id]: pIdx,
                              }))
                            }
                            className={`relative aspect-[3/2] overflow-hidden border transition ${
                              isCurrent
                                ? "border-[#8E8A80] ring-1 ring-[#8E8A80]"
                                : "border-[#202226] opacity-75 hover:opacity-100"
                            }`}
                          >
                            <Image
                              src={photo.image}
                              alt={photo.alt}
                              fill
                              sizes="110px"
                              className="object-cover"
                            />
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Text side (5 cols) */}
              <div
                className={`lg:col-span-5 ${
                  index % 2 === 1 ? "lg:order-1" : "lg:order-2"
                }`}
              >
                <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.25em] text-[#8E8A80]">
                  <span>
                    {project.location ? `${project.location} · ` : ""}
                    {project.year}
                  </span>
                </div>

                <h2 className="mt-3 font-serif text-3xl font-light text-[#EBE7DF] sm:text-4xl">
                  <Link
                    href={`/projects/${project.slug}`}
                    className="transition hover:text-white"
                  >
                    {project.title}
                  </Link>
                </h2>

                <p className="mt-2 font-mono text-xs text-neutral-400">
                  {project.subtitle}
                </p>

                <p className="mt-6 text-sm font-light leading-relaxed text-[#EBE7DF]/80 sm:text-base sm:leading-7">
                  {project.description}
                </p>

                <div className="mt-6 flex flex-wrap items-center gap-3 font-mono text-xs text-neutral-400">
                  <span className="border border-[#202226] bg-[#0B0C0E] px-3 py-1">
                    {project.photoIds.length} {t("Fotografías en serie", "Photographs in series")}
                  </span>
                  <span className="border border-[#202226] bg-[#0B0C0E] px-3 py-1 text-[#8E8A80]">
                    {t("Modo Papel Museo Disponible", "Museum Paper Reading Mode")}
                  </span>
                </div>

                <div className="mt-8 flex items-center gap-6">
                  <Link
                    href={`/projects/${project.slug}`}
                    className="inline-flex border border-[#EBE7DF] bg-[#EBE7DF] px-7 py-3 font-mono text-xs font-semibold uppercase tracking-[0.25em] text-[#0B0C0E] transition hover:bg-transparent hover:text-white"
                  >
                    {t("Abrir Ensayo Completo →", "Open Full Essay →")}
                  </Link>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
