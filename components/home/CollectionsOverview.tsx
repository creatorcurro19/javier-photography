import Image from "next/image";
import Link from "next/link";
import Container from "@/components/ui/Container";
import { PHOTO_CATEGORIES, CATEGORY_METADATA } from "@/types/photo";
import { getPhotosByCategory } from "@/lib/photos";

export default function CollectionsOverview() {
  return (
    <section
      id="colecciones"
      className="bg-[#101112] py-24 sm:py-32 border-t border-[#1D2021] scroll-mt-20"
    >
      <Container>
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="text-[10px] uppercase tracking-[0.35em] text-[#95836B]">
              Archivo Curado
            </p>
            <h2 className="mt-2 text-3xl sm:text-4xl lg:text-5xl font-light tracking-tight text-[#D8D5CD]">
              Cinco Disciplinas
            </h2>
          </div>
          <Link
            href="/portfolio"
            className="group inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-[#95836B] transition hover:text-[#D8D5CD]"
          >
            <span>Ver las 100 obras →</span>
          </Link>
        </div>

        {/* Clean Editorial Gallery Grid (2 large top + 3 bottom) */}
        <div className="mt-12 grid grid-cols-1 gap-6 sm:gap-8 lg:grid-cols-12">
          {PHOTO_CATEGORIES.map((category, idx) => {
            const info = CATEGORY_METADATA[category];
            const categoryPhotos = getPhotosByCategory(category);
            const count = categoryPhotos.length;
            const isTopRow = idx < 2;

            return (
              <Link
                key={category}
                href={`/portfolio/${category}`}
                className={`group relative flex flex-col overflow-hidden border border-[#1D2021] bg-[#141617]/50 transition-all duration-500 hover:border-[#95836B]/60 ${
                  isTopRow ? "lg:col-span-6" : "lg:col-span-4"
                }`}
              >
                <div
                  className={`relative w-full overflow-hidden bg-[#101112] ${
                    isTopRow ? "aspect-[16/10]" : "aspect-[4/3]"
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
                  <div className="absolute inset-0 bg-gradient-to-t from-[#101112] via-[#101112]/20 to-transparent" />

                  <div className="absolute bottom-4 left-5 right-5 flex items-end justify-between">
                    <div>
                      <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-[#95836B]">
                        0{idx + 1} · {info.code}
                      </span>
                      <h3 className="mt-1 text-xl sm:text-2xl font-light text-[#D8D5CD] transition group-hover:text-white">
                        {info.title}
                      </h3>
                    </div>
                    <span className="font-mono text-[10px] text-neutral-400">
                      {count} obras
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
