import Image from "next/image";
import Link from "next/link";
import Container from "@/components/ui/Container";
import SectionHeader from "@/components/ui/SectionHeader";
import { PHOTO_CATEGORIES, CATEGORY_METADATA } from "@/types/photo";
import { getPhotosByCategory } from "@/lib/photos";

export default function CollectionsOverview() {
  return (
    <section
      id="colecciones"
      className="bg-[#101112] py-28 md:py-36 border-t border-[#1D2021] scroll-mt-20"
    >
      <Container>
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <SectionHeader
            label="Disciplinas Fotográficas"
            title="Cinco Colecciones Principales"
            description="Estructuradas en torno a ejes temáticos complementarios, manteniendo una identidad visual coherente y una mirada documental honesta."
          />
          <Link
            href="/portfolio"
            className="group inline-flex shrink-0 items-center gap-2 font-mono text-xs uppercase tracking-[0.25em] text-[#95836B] transition hover:text-[#D8D5CD]"
          >
            <span>Explorar las 100 obras del archivo</span>
            <span className="transition-transform group-hover:translate-x-1">→</span>
          </Link>
        </div>

        {/* Asymmetric 12-col Editorial Grid (2 large + 3 medium = zero empty gaps) */}
        <div className="mt-16 grid grid-cols-1 gap-7 lg:grid-cols-12">
          {PHOTO_CATEGORIES.map((category, idx) => {
            const info = CATEGORY_METADATA[category];
            const categoryPhotos = getPhotosByCategory(category);
            const count = categoryPhotos.length;
            const previewThumbs = categoryPhotos.slice(0, 3);
            const isTopRow = idx < 2;

            return (
              <Link
                key={category}
                href={`/portfolio/${category}`}
                className={`group relative flex flex-col overflow-hidden border border-[#1D2021] bg-[#141617]/60 transition-all duration-500 hover:border-[#95836B]/70 hover:bg-[#1D2021]/70 hover:shadow-[0_25px_60px_rgba(0,0,0,0.65)] ${
                  isTopRow ? "lg:col-span-6" : "lg:col-span-4"
                }`}
              >
                <div
                  className={`relative w-full overflow-hidden bg-[#1D2021] ${
                    isTopRow ? "aspect-[16/10]" : "aspect-[3/2]"
                  }`}
                >
                  <Image
                    src={info.coverImage}
                    alt={info.title}
                    fill
                    sizes={
                      isTopRow
                        ? "(max-width: 1024px) 100vw, 50vw"
                        : "(max-width: 1024px) 100vw, 33vw"
                    }
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#101112] via-[#101112]/25 to-transparent" />

                  <div className="absolute top-4 left-4 flex items-center gap-2">
                    <span className="border border-[#1D2021] bg-[#101112]/90 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.25em] text-[#95836B] backdrop-blur-md">
                      0{idx + 1} · {info.code}
                    </span>
                  </div>

                  <span className="absolute top-4 right-4 border border-[#1D2021] bg-[#101112]/90 px-3 py-1 font-mono text-[10px] tracking-wider text-[#D8D5CD] backdrop-blur-md">
                    {count} {count === 1 ? "obra" : "obras"}
                  </span>

                  {/* Mini Filmstrip Preview on Hover */}
                  <div className="absolute right-4 bottom-4 flex items-center gap-1.5 opacity-85 transition-opacity duration-300 group-hover:opacity-100">
                    {previewThumbs.map((thumb) => (
                      <div
                        key={thumb.id}
                        className="relative h-9 w-12 overflow-hidden border border-[#D8D5CD]/30 bg-[#101112] shadow-md"
                      >
                        <Image
                          src={thumb.image}
                          alt={thumb.alt}
                          fill
                          sizes="48px"
                          className="object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex flex-1 flex-col justify-between p-6 sm:p-8">
                  <div>
                    <h3 className="font-serif text-2xl font-light text-[#D8D5CD] transition-colors group-hover:text-white sm:text-3xl">
                      {info.title}
                    </h3>
                    <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.18em] text-[#95836B]">
                      {info.subtitle}
                    </p>
                    <p className="mt-4 line-clamp-2 text-sm font-light leading-relaxed text-[#D8D5CD]/75">
                      {info.description}
                    </p>
                  </div>

                  <div className="mt-6 flex items-center justify-between border-t border-[#1D2021] pt-4 font-mono text-[11px] uppercase tracking-[0.22em] text-[#95836B] transition-colors group-hover:text-[#D8D5CD]">
                    <span>Adentrarse en la Colección</span>
                    <span className="transition-transform duration-300 group-hover:translate-x-1.5">
                      →
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
