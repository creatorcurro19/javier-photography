"use client";

import ExhibitionGallery from "@/components/portfolio/ExhibitionGallery";
import SectionHeader from "@/components/ui/SectionHeader";
import { getRelatedPhotos } from "@/lib/photos";
import type { Photo } from "@/types/photo";
import { useLanguage } from "@/lib/i18n";

type RelatedPhotosProps = {
  photo: Photo;
};

export default function RelatedPhotos({ photo }: RelatedPhotosProps) {
  const { t } = useLanguage();
  const related = getRelatedPhotos(photo);

  if (related.length === 0) {
    return null;
  }

  return (
    <section aria-labelledby="related-heading" className="border-t border-[#202226] pt-16">
      <SectionHeader
        label={t("Colección", "Collection")}
        title={t("Obras Relacionadas", "Related Works")}
      />
      <div className="mt-12">
        <ExhibitionGallery photos={related} showMeta />
      </div>
    </section>
  );
}
