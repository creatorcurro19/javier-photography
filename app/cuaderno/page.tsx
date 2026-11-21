import Image from "next/image";
import Link from "next/link";
import Container from "@/components/ui/Container";
import {
  AndalusianCenefa,
  AndalusianPageBackdrop,
  AndalusianStarMark,
} from "@/components/ui/AndalusianMotif";
import FieldJournalExplorer from "@/components/stories/FieldJournalExplorer";
import JsonLd from "@/components/seo/JsonLd";
import { getAllCuadernoPosts } from "@/data/cuaderno";
import { buildPageMetadata } from "@/lib/metadata";
import { getPhotosWithStory } from "@/lib/photos";
import { generateBreadcrumbSchema } from "@/lib/schema";

export const metadata = buildPageMetadata({
  title: "Cuaderno de Campo | Javier Espinosa",
  description:
    "Cuaderno y artículos de Javier Espinosa Martínez: notas de campo sobre fotografía de naturaleza, paisaje en Tenerife, rally histórico y oficios.",
  path: "/cuaderno",
});

export default function CuadernoPage() {
  const posts = getAllCuadernoPosts();
  const stories = getPhotosWithStory();

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0B0C0E] pt-36 pb-28 text-[#EBE7DF]">
      <JsonLd
        data={generateBreadcrumbSchema([
          { name: "Inicio", path: "/" },
          { name: "Cuaderno", path: "/cuaderno" },
        ])}
      />
      <AndalusianPageBackdrop variant="laceria" />

      <Container className="relative z-10">
        <header className="max-w-3xl">
          <div className="flex items-center gap-2.5">
            <AndalusianStarMark className="h-3.5 w-3.5 text-[#C5A880]" />
            <p className="font-mono text-xs uppercase tracking-[0.4em] text-[#C5A880]">
              Cuaderno de Campo · Artículos de Autor
            </p>
          </div>
          <h1 className="mt-4 font-serif text-4xl font-light tracking-wide text-[#EBE7DF] sm:text-5xl lg:text-6xl">
            Cuaderno
          </h1>
          <p className="mt-6 text-base leading-relaxed text-[#A39E93] sm:text-lg font-light">
            Artículos, borradores en preparación y apuntes de campo sobre cómo se hicieron las fotografías del archivo: la espera con el teleobjetivo de 600mm, la luz de primera hora en las cumbres de Tenerife o el ambiente en un parque de asistencia.
          </p>
        </header>

        <AndalusianCenefa variant="estrella" className="mt-10 text-[#C5A880]/38" />

        {/* 3 Borradores de Artículos (/cuaderno/[slug]) */}
        <section aria-label="Artículos del Cuaderno" className="mt-14">
          <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
            <h2 className="font-mono text-xs uppercase tracking-[0.3em] text-[#C5A880]">
              Artículos Individuales (/cuaderno/[slug]) · 3 Borradores Preparados
            </h2>
            <span className="font-mono text-[11px] text-[#A39E93]">
              Autor: Javier Espinosa Martínez
            </span>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
            {posts.map((post) => (
              <article
                key={post.slug}
                className="flex flex-col justify-between border border-white/[0.08] bg-[#151618] transition hover:border-[#C5A880]/50"
              >
                <div>
                  {post.relatedWork && (
                    <Link
                      href={`/cuaderno/${post.slug}`}
                      className="relative block aspect-[16/10] w-full overflow-hidden bg-[#0B0C0E]"
                    >
                      <Image
                        src={post.relatedWork.image}
                        alt={post.relatedWork.alt}
                        fill
                        sizes="(max-width: 1024px) 100vw, 33vw"
                        className="object-cover"
                      />
                      <span className="absolute top-3 left-3 border border-[#C5A880]/40 bg-[#0B0C0E]/90 px-2.5 py-1 font-mono text-[9px] uppercase tracking-widest text-[#C5A880]">
                        Borrador {post.number} · {post.categoryLabel}
                      </span>
                    </Link>
                  )}

                  <div className="p-6">
                    <div className="flex flex-wrap items-center gap-2 font-mono text-[10px] text-[#A39E93]">
                      <span>Fecha: {post.date}</span>
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

                    {post.relatedWork && (
                      <p className="mt-3 border-t border-white/[0.06] pt-3 font-mono text-[10px] text-[#A39E93]">
                        Obra relacionada:{" "}
                        <Link
                          href={`/portfolio/${post.relatedWork.slug}`}
                          className="text-[#EBE7DF] underline underline-offset-4 hover:text-[#C5A880]"
                        >
                          {post.relatedWork.title} ({post.relatedWork.focalLength})
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
                    Abrir Borrador →
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Notas breves vinculadas a las obras del archivo */}
        <section aria-label="Notas de campo por obra" className="mt-24 border-t border-white/[0.08] pt-16">
          <h2 className="font-serif text-2xl sm:text-3xl font-light text-[#EBE7DF]">
            Notas de campo del archivo ({stories.length} obras comentadas)
          </h2>
          <FieldJournalExplorer stories={stories} />
        </section>
      </Container>
    </div>
  );
}
