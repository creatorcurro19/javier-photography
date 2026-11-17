import ExhibitionGallery from "@/components/portfolio/ExhibitionGallery";
import SectionHeader from "@/components/ui/SectionHeader";
import { getRelatedPhotos } from "@/lib/photos";
import type { Photo } from "@/types/photo";

type RelatedPhotosProps = {
  photo: Photo;
};

export default function RelatedPhotos({ photo }: RelatedPhotosProps) {
  const related = getRelatedPhotos(photo);

  if (related.length === 0) {
    return null;
  }

  return (
    <section aria-labelledby="related-heading" className="border-t border-[#202226] pt-16">
      <SectionHeader label="Colección" title="Obras Relacionadas" />
      <div className="mt-12">
        <ExhibitionGallery photos={related} showMeta />
      </div>
    </section>
  );
}
