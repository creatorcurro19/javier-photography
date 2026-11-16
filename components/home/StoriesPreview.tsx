import Link from "next/link";
import Image from "next/image";
import Container from "@/components/ui/Container";
import SectionHeader from "@/components/ui/SectionHeader";
import { getPhotosWithStory } from "@/lib/photos";
import { CATEGORY_METADATA } from "@/types/photo";

export default function StoriesPreview() {
  const stories = getPhotosWithStory().slice(0, 3);

  if (stories.length === 0) {
    return null;
  }

  return (
    <section className="border-t border-[#1D2021] bg-[#101112] py-28 md:py-36">
      <Container>
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <SectionHeader
            label="Detrás de la Lente"
            title="Cuaderno y Notas de Campo"
            description="El contexto, la espera y las circunstancias humanas que rodearon la captura de cada fotografía."
          />
          <Link
            href="/stories"
            className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.25em] text-[#95836B] hover:text-[#D8D5CD] transition group shrink-0"
          >
            <span>Ver Todas las Historias</span>
            <span className="transition-transform group-hover:translate-x-1">→</span>
          </Link>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          {stories.map((photo) => {
            const categoryInfo = CATEGORY_METADATA[photo.category];

            return (
              <article
                key={photo.id}
                className="group flex flex-col justify-between rounded-lg border border-[#1D2021] bg-[#1D2021]/40 p-6 sm:p-7 transition duration-300 hover:border-[#95836B]/60 hover:bg-[#1D2021]/70"
              >
                <div>
                  <Link
                    href={`/portfolio/${photo.slug}`}
                    className="block relative aspect-[16/10] overflow-hidden rounded-md bg-neutral-900"
                  >
                    <Image
                      src={photo.image}
                      alt={photo.alt}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                  </Link>

                  <div className="mt-6 flex items-center justify-between text-[11px] font-mono uppercase tracking-[0.2em] text-[#95836B]">
                    <span>{categoryInfo?.title ?? photo.category}</span>
                    <span>{photo.year}</span>
                  </div>

                  <h3 className="mt-2 font-serif text-2xl font-light text-[#D8D5CD] group-hover:text-white transition-colors">
                    <Link href={`/portfolio/${photo.slug}`}>{photo.title}</Link>
                  </h3>

                  <p className="mt-2 text-xs font-mono text-neutral-400">
                    {photo.location ? photo.location : `${photo.focalLength} · ${photo.aperture} · ISO ${photo.iso}`}
                  </p>

                  <p className="mt-4 text-sm font-light leading-relaxed text-[#D8D5CD]/80 line-clamp-4">
                    {photo.story}
                  </p>
                </div>

                <div className="mt-6 border-t border-[#1D2021] pt-4">
                  <Link
                    href={`/portfolio/${photo.slug}#story`}
                    className="inline-flex text-xs font-mono uppercase tracking-wider text-[#95836B] group-hover:text-[#D8D5CD] transition"
                  >
                    Leer Historia Completa →
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
