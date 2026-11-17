import Image from "next/image";
import Link from "next/link";
import SectionHeader from "@/components/ui/SectionHeader";
import Container from "@/components/ui/Container";
import { getFeaturedPhotos, getAllPhotos } from "@/lib/photos";
import { CATEGORY_METADATA } from "@/types/photo";

export default function SelectedWork() {
  const featuredPhotos = getFeaturedPhotos().slice(0, 6);
  const totalPhotos = getAllPhotos().length;

  return (
    <section className="bg-[#0B0C0E] py-28 md:py-36 border-t border-[#202226]">
      <Container>
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <SectionHeader
            label="Obras de Autor"
            title="Selección y Territorio"
            description="Una cuidada selección de obras representativas que sintetizan la búsqueda de atmósferas, la tensión del instante y la luz natural."
          />
          <Link
            href="/portfolio"
            className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.25em] text-[#8E8A80] hover:text-[#EBE7DF] transition group shrink-0"
          >
            <span>Ver Archivo Completo ({totalPhotos} obras)</span>
            <span className="transition-transform group-hover:translate-x-1">→</span>
          </Link>
        </div>

        {/* Editorial Masonry: cada obra conserva su proporción original */}
        <div className="mt-16 columns-1 gap-8 md:columns-2 lg:columns-3">
          {featuredPhotos.map((photo) => {
            const categoryInfo = CATEGORY_METADATA[photo.category];

            return (
              <article
                key={photo.id}
                className="group mb-8 flex break-inside-avoid flex-col justify-between rounded-lg border border-[#202226] bg-[#202226]/40 p-6 sm:p-7 transition-all duration-300 hover:border-[#8E8A80]/60 hover:bg-[#202226]/70"
              >
                <Link
                  href={`/portfolio/${photo.slug}`}
                  className="relative block overflow-hidden rounded-md bg-[#202226] focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
                >
                  <Image
                    src={photo.image}
                    alt={photo.alt}
                    width={photo.width}
                    height={photo.height}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="h-auto w-full transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                </Link>

                <div className="mt-5 border-t border-[#202226] pt-4">
                  <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-[0.2em] text-[#8E8A80]">
                    <span>{categoryInfo?.title ?? photo.category}</span>
                    <span>{photo.year}</span>
                  </div>

                  <h3 className="mt-2 font-serif text-2xl font-light text-[#EBE7DF] group-hover:text-white transition-colors">
                    <Link href={`/portfolio/${photo.slug}`}>{photo.title}</Link>
                  </h3>

                  <p className="mt-2 text-xs font-mono text-neutral-400">
                    {photo.location ? photo.location : `${photo.camera} · ${photo.focalLength} · ${photo.aperture}`}
                  </p>

                  <p className="mt-3 text-sm font-light text-neutral-400 line-clamp-2 leading-relaxed">
                    {photo.description}
                  </p>

                  <div className="mt-5 border-t border-[#202226] pt-3 text-xs font-mono uppercase tracking-wider text-[#8E8A80] group-hover:text-[#EBE7DF] transition-colors flex items-center justify-between">
                    <span>Ver obra</span>
                    <span className="transition-transform group-hover:translate-x-1">→</span>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
