"use client";

import Link from "next/link";
import type { Photo } from "@/types/photo";
import { CATEGORY_METADATA } from "@/types/photo";
import FavoriteButton from "@/components/photo/FavoriteButton";
import ShareButton from "@/components/photo/ShareButton";
import { useLanguage } from "@/lib/i18n";
import { translateCondiciones } from "@/lib/i18n-helpers";
import { getLocalizedPhoto } from "@/lib/i18n-works";

type PhotoMetaProps = {
  photo: Photo;
};

export default function PhotoMeta({ photo: rawPhoto }: PhotoMetaProps) {
  const { lang, t } = useLanguage();
  const photo = getLocalizedPhoto(rawPhoto, lang);
  const categoryInfo = CATEGORY_METADATA[photo.category];
  const categoryTitle = lang === "en" ? categoryInfo?.titleEn : categoryInfo?.title;
  const condLabel = translateCondiciones(photo.condiciones, lang);
  const locLower = (photo.location ?? "").toLowerCase();
  const extraParts = [
    photo.evento,
    photo.lugar,
    photo.category === "coches-rally" && (photo.evento || photo.lugar) && photo.year
      ? String(photo.year)
      : undefined,
  ].filter(
    (part): part is string =>
      Boolean(part) && !locLower.includes(String(part).split(",")[0].trim().toLowerCase())
  );

  return (
    <header className="border-b border-white/[0.08] pb-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2.5 text-xs font-mono uppercase tracking-[0.2em] text-[#C5A880]">
          <Link
            href={`/portfolio/${photo.category}`}
            className="hover:text-[#EBE7DF] transition"
          >
            {categoryTitle ?? photo.category}
          </Link>
          {photo.location && (
            <>
              <span className="text-white/25">·</span>
              <span className="text-[#A39E93]">{photo.location}</span>
            </>
          )}
          {photo.category === "fauna-naturaleza" && condLabel && (
            <>
              <span className="text-white/25">·</span>
              <span className="text-[#C5A880]/90">
                {t("Condiciones:", "Conditions:")} {condLabel}
              </span>
            </>
          )}
          {extraParts.length > 0 && (
            <>
              <span className="text-white/25">·</span>
              <span className="text-[#A39E93]">
                {extraParts.join(" · ")}
              </span>
            </>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <ShareButton title={photo.title} slug={photo.slug} location={photo.location} />
          <FavoriteButton title={rawPhoto.title} />
        </div>
      </div>

      <h1 className="mt-3 font-serif text-3xl sm:text-4xl md:text-5xl font-light tracking-tight text-[#EBE7DF] leading-[1.12]">
        {photo.title}
      </h1>

      <p className="mt-4 max-w-2xl text-base sm:text-lg leading-relaxed text-[#EBE7DF]/80 font-light">
        {photo.description}
      </p>
    </header>
  );
}
