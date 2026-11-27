"use client";

import Image from "next/image";
import Link from "@/components/ui/LocalizedLink";
import Container from "@/components/ui/Container";
import {
  AndalusianCenefa,
  AndalusianPageBackdrop,
  AndalusianStarMark,
} from "@/components/ui/AndalusianMotif";
import FieldJournalExplorer from "@/components/stories/FieldJournalExplorer";
import { getLocalizedCuadernoPost, type CuadernoPost } from "@/data/site-config";
import { useLanguage } from "@/lib/i18n";
import { getLocalizedPhoto } from "@/lib/i18n-works";
import type { Photo } from "@/types/photo";

type CuadernoPostWithWork = CuadernoPost & { relatedWork?: Photo };

interface CuadernoPageContentProps {
  posts: CuadernoPostWithWork[];
  stories: Photo[];
}

export default function CuadernoPageContent({
  posts,
  stories,
}: CuadernoPageContentProps) {
  const { lang, t } = useLanguage();

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0B0C0E] pt-36 pb-28 text-[#EBE7DF]">
      <AndalusianPageBackdrop variant="laceria" />

      <Container className="relative z-10">
        <header className="max-w-3xl">
          <div className="flex items-center gap-2.5">
            <AndalusianStarMark className="h-3.5 w-3.5 text-[#C5A880]" />
            <p className="font-mono text-xs uppercase tracking-[0.4em] text-[#C5A880]">
              {t(
                "Cuaderno de Campo · Artículos de Autor",
                "Field Journal · Author Articles"
              )}
            </p>
          </div>
          <h1 className="mt-4 font-serif text-4xl font-light tracking-wide text-[#EBE7DF] sm:text-5xl lg:text-6xl">
            {t("Cuaderno", "Journal")}
          </h1>
          <p className="mt-6 text-base leading-relaxed text-[#A39E93] sm:text-lg font-light">
            {t(
              "Artículos, borradores en preparación y apuntes de campo sobre cómo se hicieron las fotografías del archivo: la espera con el teleobjetivo de 600mm, la luz de primera hora en las cumbres de Tenerife o el ambiente en un parque de asistencia.",
              "Articles, drafts in progress, and field notes on how the archive's photographs came to be: patient waiting at 600mm, early light across Tenerife's peaks, or the atmosphere inside a rally service park."
            )}
          </p>
        </header>

        <AndalusianCenefa variant="estrella" className="mt-10 text-[#C5A880]/38" />

        {/* Borradores de Artículos (/cuaderno/[slug]) */}
        <section aria-label={t("Artículos del Cuaderno", "Journal Articles")} className="mt-14">
          <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
            <h2 className="font-mono text-xs uppercase tracking-[0.3em] text-[#C5A880]">
              {t(
                `Artículos Individuales (/cuaderno/[slug]) · ${posts.length} Borradores Preparados`,
                `Individual Articles (/cuaderno/[slug]) · ${posts.length} Drafts Prepared`
              )}
            </h2>
            <span className="font-mono text-[11px] text-[#A39E93]">
              {t("Autor: Javier Espinosa Martínez", "Author: Javier Espinosa Martínez")}
            </span>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
            {posts.map((rawPost) => {
              const post = getLocalizedCuadernoPost(rawPost, lang);
              const relatedWork = rawPost.relatedWork
                ? getLocalizedPhoto(rawPost.relatedWork, lang)
                : undefined;

              return (
                <article
                  key={post.slug}
                  className="flex flex-col justify-between border border-white/[0.08] bg-[#151618] transition hover:border-[#C5A880]/50"
                >
                  <div>
                    {relatedWork && (
                      <Link
                        href={`/cuaderno/${post.slug}`}
                        className="relative block w-full overflow-hidden bg-[#0B0C0E]"
                      >
                        <Image
                          src={relatedWork.image}
                          alt={relatedWork.alt}
                          width={rawPost.relatedWork?.width ?? 1600}
                          height={rawPost.relatedWork?.height ?? 1067}
                          sizes="(max-width: 1024px) 100vw, 33vw"
                          quality={85}
                          className="block h-auto w-full"
                        />
                        <span className="absolute top-3 left-3 border border-[#C5A880]/40 bg-[#0B0C0E]/90 px-2.5 py-1 font-mono text-[9px] uppercase tracking-widest text-[#C5A880]">
                          {t("Borrador", "Draft")} {post.number} · {post.categoryLabel}
                        </span>
                      </Link>
                    )}

                    <div className="p-6">
                      <div className="flex flex-wrap items-center gap-2 font-mono text-[10px] text-[#A39E93]">
                        <span>
                          {t("Fecha", "Date")}: {post.date}
                        </span>
                        <span>·</span>
                        <span>{post.author}</span>
                      </div>

                      <h3 className="mt-3 font-serif text-xl font-light text-[#EBE7DF]">
                        <Link
                          href={`/cuaderno/${post.slug}`}
                          className="hover:underline underline-offset-4"
                        >
                          {post.title}
                        </Link>
                      </h3>

                      <p className="mt-2 text-xs font-light leading-relaxed text-[#A39E93]">
                        {post.subtitle}
                      </p>

                      {relatedWork && (
                        <p className="mt-3 border-t border-white/[0.06] pt-3 font-mono text-[10px] text-[#A39E93]">
                          {t("Obra relacionada:", "Related work:")}{" "}
                          <Link
                            href={`/portfolio/${relatedWork.slug}`}
                            className="text-[#EBE7DF] underline underline-offset-4 hover:text-[#C5A880]"
                          >
                            {relatedWork.title} ({relatedWork.focalLength})
                          </Link>
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="border-t border-white/[0.08] bg-[#0B0C0E]/50 px-6 py-4 flex items-center justify-between">
                    <Link
                      href={`/cuaderno/${post.slug}`}
                      className="inline-flex min-h-[44px] items-center font-mono text-xs uppercase tracking-[0.22em] text-[#C5A880] hover:text-white transition"
                    >
                      {t("Abrir Borrador →", "Open Draft →")}
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        {/* Notas breves vinculadas a las obras del archivo */}
        <section
          aria-label={t("Notas de campo por obra", "Field notes per work")}
          className="mt-24 border-t border-white/[0.08] pt-16"
        >
          <h2 className="font-serif text-2xl sm:text-3xl font-light text-[#EBE7DF]">
            {t(
              `Notas de campo del archivo (${stories.length} obras comentadas)`,
              `Archive field notes (${stories.length} annotated works)`
            )}
          </h2>
          <FieldJournalExplorer stories={stories} />
        </section>
      </Container>
    </div>
  );
}
