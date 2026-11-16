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
    <section className="bg-black py-28 md:py-36 border-t border-neutral-900">
      <Container>
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <SectionHeader
            label="Obras Seleccionadas"
            title="Mirada y Territorio"
            description="Una selección cuidada de obras clave que sintetizan la búsqueda de atmósferas, la tensión del instante y la luz natural."
          />
          <Link
            href="/portfolio"
            className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.25em] text-neutral-400 hover:text-neutral-200 transition group shrink-0"
          >
            <span>Ver Archivo Completo ({totalPhotos} obras)</span>
            <span className="transition-transform group-hover:translate-x-1">→</span>
          </Link>
        </div>

        {/* Editorial Asymmetric Grid */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredPhotos.map((photo) => {
            const isVertical = photo.height > photo.width;
            const categoryInfo = CATEGORY_METADATA[photo.category];

            return (
              <article
                key={photo.id}
                className="group flex flex-col justify-between rounded-lg border border-neutral-900 bg-neutral-950/70 p-6 sm:p-7 transition-all duration-300 hover:border-neutral-800 hover:bg-neutral-900/40"
              >
                <Link
                  href={`/portfolio/${photo.slug}`}
                  className="block overflow-hidden rounded-md bg-neutral-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
                >
                  <div
                    className={`relative w-full overflow-hidden ${
                      isVertical ? "aspect-[3/4]" : "aspect-[3/2]"
                    }`}
                  >
                    <Image
                      src={photo.image}
                      alt={photo.alt}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  </div>
                </Link>

                <div className="mt-5 border-t border-neutral-800/80 pt-4">
                  <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-[0.2em] text-neutral-500">
                    <span>{categoryInfo?.title ?? photo.category}</span>
                    <span>{photo.year}</span>
                  </div>

                  <h3 className="mt-2 font-serif text-2xl font-light text-neutral-100 group-hover:text-white transition-colors">
                    <Link href={`/portfolio/${photo.slug}`}>{photo.title}</Link>
                  </h3>

                  <p className="mt-2 text-xs font-mono text-neutral-500">
                    {photo.location ? photo.location : `${photo.camera} · ${photo.focalLength} · ${photo.aperture}`}
                  </p>

                  <p className="mt-3 text-sm font-light text-neutral-400 line-clamp-2 leading-relaxed">
                    {photo.description}
                  </p>

                  <div className="mt-5 border-t border-neutral-900 pt-3 text-xs font-mono uppercase tracking-wider text-neutral-500 group-hover:text-neutral-300 transition-colors flex items-center justify-between">
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
