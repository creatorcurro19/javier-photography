"use client";

import Link from "@/components/ui/LocalizedLink";
import Container from "@/components/ui/Container";
import { AndalusianCenefa } from "@/components/ui/AndalusianMotif";
import CategoryNav from "@/components/portfolio/CategoryNav";
import ExhibitionGallery from "@/components/portfolio/ExhibitionGallery";
import { useLanguage } from "@/lib/i18n";
import { CATEGORY_METADATA, type Photo, type PhotoCategory } from "@/types/photo";

interface CategoryGalleryContentProps {
  category: PhotoCategory;
  photos: Photo[];
}

export default function CategoryGalleryContent({
  category,
  photos,
}: CategoryGalleryContentProps) {
  const { lang, t } = useLanguage();
  const info = CATEGORY_METADATA[category];
  const isSebka =
    category === "arquitectura-urbana" || category === "viajes-cultura";

  const title = lang === "en" ? info.titleEn : info.title;
  const description = lang === "en" ? info.descriptionEn : info.description;

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0B0C0E] pb-28 text-[#EBE7DF]">
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
            <span className="text-[#EBE7DF] truncate">{title}</span>
          </nav>
        </Container>
      </div>

      <Container className="relative z-10 mt-10">
        <header className="max-w-2xl">
          <p className="font-mono text-xs uppercase tracking-[0.28em] text-[#C5A880]">
            {photos.length} {t("fotos", "photos")}
          </p>
          <h1 className="mt-2 font-serif text-3xl sm:text-5xl font-light text-[#EBE7DF]">
            {title}
          </h1>
          <p className="mt-3 text-sm sm:text-base leading-relaxed text-[#A39E93] font-light">
            {description}
          </p>
        </header>

        <div className="mt-6">
          <CategoryNav activeCategory={category} />
        </div>

        <div className="mt-8">
          <ExhibitionGallery photos={photos} />
        </div>

        <AndalusianCenefa
          variant={isSebka ? "sebka" : "estrella"}
          className="mt-16 text-[#C5A880]/28"
        />
      </Container>
    </div>
  );
}
