"use client";

import Link from "@/components/ui/LocalizedLink";
import ChillReveal from "@/components/ui/ChillReveal";
import Container from "@/components/ui/Container";
import PhotoHero from "@/components/photo/PhotoHero";
import PhotoKeyboardNav from "@/components/photo/PhotoKeyboardNav";
import PhotoMeta from "@/components/photo/PhotoMeta";
import MobilePhotoActionBar from "@/components/photo/MobilePhotoActionBar";
import PrintCTA from "@/components/photo/PrintCTA";
import RelatedPhotos from "@/components/photo/RelatedPhotos";
import { useLanguage } from "@/lib/i18n";
import { getLocalizedPhoto } from "@/lib/i18n-works";
import { CATEGORY_METADATA, type Photo } from "@/types/photo";

interface PhotoDetailContentProps {
  rawPhoto: Photo;
  categoryPhotos: Photo[];
  prev?: Photo;
  next?: Photo;
  totalInCat: number;
}

export default function PhotoDetailContent({
  rawPhoto,
  categoryPhotos,
  prev,
  next,
  totalInCat,
}: PhotoDetailContentProps) {
  const { lang, t } = useLanguage();
  const photo = getLocalizedPhoto(rawPhoto, lang);
  const prevLoc = prev ? getLocalizedPhoto(prev, lang) : undefined;
  const nextLoc = next ? getLocalizedPhoto(next, lang) : undefined;
  const categoryInfo = CATEGORY_METADATA[rawPhoto.category];
  const categoryTitle = categoryInfo
    ? lang === "en"
      ? categoryInfo.titleEn
      : categoryInfo.title
    : rawPhoto.category;

  return (
    <article className="relative min-h-screen overflow-hidden bg-[#0B0C0E] pb-36 lg:pb-28 text-[#EBE7DF]">
      <PhotoKeyboardNav prevSlug={prev?.slug} nextSlug={next?.slug} />
      <MobilePhotoActionBar photo={rawPhoto} />

      {/* Breadcrumb Bar */}
      <div className="relative z-10 pt-20 border-b border-white/[0.08] bg-[#0B0C0E]/80 backdrop-blur-md">
        <Container className="py-3.5">
          <nav
            aria-label={t("Miga de pan", "Breadcrumb")}
            className="flex items-center gap-2 text-xs font-mono text-[#A39E93]"
          >
            <Link href="/" className="hover:text-[#EBE7DF] transition">
              {t("Inicio", "Home")}
            </Link>
            <span className="text-white/25">/</span>
            <Link href="/portfolio" className="hover:text-[#EBE7DF] transition">
              {t("Fotos", "Photos")}
            </Link>
            <span className="text-white/25">/</span>
            <Link
              href={`/portfolio/${rawPhoto.category}`}
              className="hover:text-[#EBE7DF] transition"
            >
              {categoryTitle}
            </Link>
            <span className="text-white/25">/</span>
            <span className="text-[#EBE7DF] truncate">{photo.title}</span>
          </nav>
        </Container>
      </div>

      <div className="relative z-10 pt-4">
        <PhotoHero photo={rawPhoto} categoryPhotos={categoryPhotos} />
      </div>

      <Container className="relative z-10 mt-10 space-y-12">
        <ChillReveal>
          <PhotoMeta photo={rawPhoto} />
        </ChillReveal>

        <ChillReveal delayMs={80}>
          <PrintCTA photo={rawPhoto} />
        </ChillReveal>

        {/* Adjacent Photo Navigation */}
        <nav
          aria-label={t(
            "Navegación entre obras de la misma colección",
            "Navigation between works in this collection"
          )}
          className="pt-2"
        >
          <div className="flex items-center justify-between gap-4 text-xs font-mono uppercase tracking-[0.2em]">
            {prevLoc ? (
              <Link
                href={`/portfolio/${prevLoc.slug}`}
                className="group flex flex-col items-start gap-1 text-[#8E8A80] hover:text-[#EBE7DF] transition"
              >
                <span className="text-[10px] text-[#8E8A80] group-hover:text-[#EBE7DF]">
                  {t("← Anterior", "← Previous")}
                </span>
                <span className="font-serif text-base normal-case tracking-normal text-[#EBE7DF] group-hover:text-white truncate max-w-[180px] sm:max-w-xs">
                  {prevLoc.title}
                </span>
              </Link>
            ) : (
              <div />
            )}

            <Link
              href={`/portfolio/${rawPhoto.category}`}
              className="hidden sm:inline-flex items-center gap-1.5 text-[#8E8A80] hover:text-[#EBE7DF] transition text-xs font-mono"
            >
              <span>
                {t(
                  `Colección ${categoryTitle} (${totalInCat})`,
                  `${categoryTitle} Collection (${totalInCat})`
                )}
              </span>
            </Link>

            {nextLoc ? (
              <Link
                href={`/portfolio/${nextLoc.slug}`}
                className="group flex flex-col items-end gap-1 text-[#8E8A80] hover:text-[#EBE7DF] transition text-right"
              >
                <span className="text-[10px] text-[#8E8A80] group-hover:text-[#EBE7DF]">
                  {t("Siguiente →", "Next →")}
                </span>
                <span className="font-serif text-base normal-case tracking-normal text-[#EBE7DF] group-hover:text-white truncate max-w-[180px] sm:max-w-xs">
                  {nextLoc.title}
                </span>
              </Link>
            ) : (
              <div />
            )}
          </div>
        </nav>

        <ChillReveal delayMs={100}>
          <RelatedPhotos photo={rawPhoto} />
        </ChillReveal>
      </Container>
    </article>
  );
}
