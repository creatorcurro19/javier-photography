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
      className="border-t border-neutral-900 pt-12"
    >
      <span className="text-xs font-mono uppercase tracking-[0.35em] text-neutral-500">
        Notas de Campo
      </span>
      <h2
        id="story-heading"
        className="mt-2 font-serif text-3xl font-light text-neutral-100"
      >
        Detrás del Disparo
      </h2>
      <p className="mt-6 max-w-3xl text-lg font-light leading-relaxed text-neutral-300">
        {photo.story}
      </p>
    </section>
  );
}
