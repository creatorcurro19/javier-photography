"use client";

import Image from "next/image";
import Link from "@/components/ui/LocalizedLink";
import Container from "@/components/ui/Container";
import {
  AndalusianCenefa,
  AndalusianPageBackdrop,
  AndalusianStarMark,
} from "@/components/ui/AndalusianMotif";
import { getLocalizedCuadernoPost, type CuadernoPost } from "@/data/site-config";
import { useLanguage } from "@/lib/i18n";
import { getLocalizedPhoto } from "@/lib/i18n-works";
import type { Photo } from "@/types/photo";

interface CuadernoPostContentProps {
  rawPost: CuadernoPost & { relatedWork?: Photo };
}

export default function CuadernoPostContent({
  rawPost,
}: CuadernoPostContentProps) {
  const { lang, t } = useLanguage();
  const post = getLocalizedCuadernoPost(rawPost, lang);
  const relatedWork = rawPost.relatedWork
    ? getLocalizedPhoto(rawPost.relatedWork, lang)
    : undefined;

  return (
    <article className="relative min-h-screen overflow-hidden bg-[#0B0C0E] pb-28 text-[#EBE7DF]">
      <AndalusianPageBackdrop variant="laceria" />

      {/* Breadcrumb Bar */}
      <div className="relative z-10 pt-24 border-b border-[#C5A880]/15 bg-[#0B0C0E]/80 backdrop-blur-md">
        <Container className="py-4">
          <nav
            aria-label={t("Miga de pan", "Breadcrumb")}
            className="flex items-center gap-2 text-xs font-mono text-[#A39E93]"
          >
            <Link href="/" className="hover:text-[#EBE7DF] transition">
              {t("Inicio", "Home")}
            </Link>
            <span className="text-white/25">/</span>
            <Link href="/cuaderno" className="hover:text-[#EBE7DF] transition">
              {t("Cuaderno", "Journal")}
            </Link>
            <span className="text-white/25">/</span>
            <span className="text-[#EBE7DF] truncate">
              {t("Borrador", "Draft")} {post.number}
            </span>
          </nav>
        </Container>
      </div>

      <Container className="relative z-10 mt-12 max-w-4xl">
        <header className="border-b border-white/[0.08] pb-8">
          <div className="flex flex-wrap items-center gap-3 font-mono text-xs uppercase tracking-[0.25em] text-[#C5A880]">
            <AndalusianStarMark className="h-3 w-3 text-[#C5A880]" />
            <span>
              {t("Cuaderno", "Journal")} #{post.number}
            </span>
            <span>·</span>
            <span>{post.categoryLabel}</span>
            <span>·</span>
            <span className="border border-[#C5A880]/40 px-2 py-0.5 text-[10px]">
              {t(
                `Estado: ${post.status.toUpperCase()}`,
                `Status: ${post.status === "borrador" ? "DRAFT" : "PUBLISHED"}`
              )}
            </span>
          </div>

          <h1 className="mt-5 font-serif text-3xl sm:text-4xl md:text-5xl font-light text-[#EBE7DF] leading-tight">
            {post.title}
          </h1>

          <p className="mt-3 text-base sm:text-lg font-light text-[#A39E93]">
            {post.subtitle}
          </p>

          <dl className="mt-6 grid grid-cols-1 gap-4 border-t border-white/[0.08] pt-5 font-mono text-xs sm:grid-cols-3">
            <div>
              <dt className="text-[10px] uppercase tracking-wider text-[#A39E93]">
                {t("Autor", "Author")}
              </dt>
              <dd className="mt-1 text-[#EBE7DF]">{post.author}</dd>
            </div>
            <div>
              <dt className="text-[10px] uppercase tracking-wider text-[#A39E93]">
                {t("Fecha", "Date")}
              </dt>
              <dd className="mt-1 text-[#EBE7DF]">{post.date}</dd>
            </div>
            {relatedWork && (
              <div>
                <dt className="text-[10px] uppercase tracking-wider text-[#A39E93]">
                  {t("Obra Relacionada", "Related Work")}
                </dt>
                <dd className="mt-1">
                  <Link
                    href={`/portfolio/${relatedWork.slug}`}
                    className="text-[#C5A880] underline underline-offset-4 hover:text-white"
                  >
                    {relatedWork.title} →
                  </Link>
                </dd>
              </div>
            )}
          </dl>
        </header>

        {/* Obra Relacionada del Archivo (/data/works.ts) */}
        {relatedWork && (
          <figure className="mt-10 border border-white/[0.08] bg-[#151618] p-4 sm:p-6">
            <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#0B0C0E]">
              <Image
                src={relatedWork.image}
                alt={relatedWork.alt}
                fill
                sizes="(max-width: 1024px) 100vw, 860px"
                quality={85}
                className="object-contain"
              />
            </div>
            <figcaption className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-white/[0.06] pt-3 font-mono text-xs text-[#A39E93]">
              <span>
                {relatedWork.title} · {relatedWork.location} ({relatedWork.year})
              </span>
              <span>
                {relatedWork.camera} · {relatedWork.focalLength} · {relatedWork.aperture} ·{" "}
                {relatedWork.shutter} · ISO {relatedWork.iso}
              </span>
            </figcaption>
          </figure>
        )}

        {/* Cuerpo del Artículo (Borrador vacío para redacción del autor) */}
        <div className="mt-10 space-y-6 border border-dashed border-[#C5A880]/35 bg-[#151618]/60 p-8 sm:p-10">
          <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-[#C5A880]">
            {t(
              "Cuerpo del Artículo (Borrador para redacción del autor)",
              "Article Body (Draft in preparation by the author)"
            )}
          </p>
          {post.body.map((paragraph, idx) => (
            <p key={idx} className="font-mono text-sm leading-relaxed text-[#EBE7DF]">
              {paragraph}
            </p>
          ))}
        </div>

        <AndalusianCenefa variant="estrella" className="mt-12 text-[#C5A880]/35" />

        {/* CTA al pie del artículo */}
        <footer className="mt-10 flex flex-wrap items-center justify-between gap-4 border border-white/[0.08] bg-[#151618] p-6 sm:p-8">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#C5A880]">
              {t("Obra y Adquisición", "Work & Acquisition")}
            </p>
            <p className="mt-1 font-serif text-xl font-light text-[#EBE7DF]">
              {t(
                "¿Te interesa la obra o serie vinculada a este artículo?",
                "Interested in the work or series featured in this entry?"
              )}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href={post.cta.href}
              className="inline-flex min-h-[44px] items-center border border-[#C5A880] bg-[#C5A880] px-6 py-3 font-mono text-xs uppercase tracking-[0.22em] font-semibold text-[#0B0C0E] transition hover:bg-white hover:border-white"
            >
              {post.cta.label} →
            </Link>
            <Link
              href="/cuaderno"
              className="inline-flex min-h-[44px] items-center border border-white/20 bg-[#0B0C0E] px-5 py-3 font-mono text-xs uppercase tracking-[0.2em] text-[#EBE7DF] transition hover:border-white/50"
            >
              {t("← Volver al Cuaderno", "← Back to Journal")}
            </Link>
          </div>
        </footer>
      </Container>
    </article>
  );
}
