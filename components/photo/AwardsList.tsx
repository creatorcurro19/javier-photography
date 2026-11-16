import type { Photo } from "@/types/photo";

type AwardsListProps = {
  photo: Photo;
};

export default function AwardsList({ photo }: AwardsListProps) {
  if (!photo.awards || photo.awards.length === 0) {
    return null;
  }

  return (
    <section aria-labelledby="awards-heading">
      <h2
        id="awards-heading"
        className="text-xs uppercase tracking-[0.4em] text-[#95836B]"
      >
        Reconocimientos & Publicaciones
      </h2>
      <ul className="mt-6 space-y-3 text-[#D8D5CD]/80">
        {photo.awards.map((award) => (
          <li key={award} className="border-l border-[#95836B]/60 pl-4 font-light text-sm">
            {award}
          </li>
        ))}
      </ul>
    </section>
  );
}
