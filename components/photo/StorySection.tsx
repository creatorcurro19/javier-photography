import type { Photo } from "@/types/photo";

type StorySectionProps = {
  photo: Photo;
};

export default function StorySection({ photo }: StorySectionProps) {
  if (!photo.story || !photo.story.trim()) {
    return null;
  }

  return (
    <section
      id="story"
      aria-labelledby="story-heading"
      className="border-t border-[#1D2021] pt-12"
    >
      <span className="text-xs font-mono uppercase tracking-[0.35em] text-[#95836B]">
        Notas de Campo
      </span>
      <h2
        id="story-heading"
        className="mt-2 font-serif text-3xl font-light text-[#D8D5CD]"
      >
        Detrás del Disparo
      </h2>
      <p className="mt-6 max-w-3xl text-lg font-light leading-relaxed text-[#D8D5CD]/80">
        {photo.story}
      </p>
    </section>
  );
}
