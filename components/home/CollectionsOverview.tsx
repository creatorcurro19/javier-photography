import Image from "next/image";
import Link from "next/link";
import Container from "@/components/ui/Container";
import SectionHeader from "@/components/ui/SectionHeader";
import { PHOTO_CATEGORIES, CATEGORY_METADATA } from "@/types/photo";
import { getPhotosByCategory } from "@/lib/photos";

export default function CollectionsOverview() {
  return (
    <section id="colecciones" className="bg-[#101112] py-28 md:py-36 border-t border-[#1D2021] scroll-mt-20">
      <Container>
        <SectionHeader
          label="Disciplinas Fotográficas"
          title="Cinco Colecciones Principales"
          description="Estructuradas en torno a ejes temáticos complementarios, manteniendo una identidad visual coherente y una mirada documental honesta."
        />

        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {PHOTO_CATEGORIES.map((category) => {
            const info = CATEGORY_METADATA[category];
            const count = getPhotosByCategory(category).length;

            return (
              <Link
                key={category}
                href={`/portfolio/${category}`}
                className="group relative flex flex-col overflow-hidden rounded-lg border border-[#1D2021] bg-[#1D2021]/50 transition duration-500 hover:border-[#95836B]/60 hover:bg-[#1D2021]/80 hover:shadow-2xl"
              >
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-neutral-900">
                  <Image
                    src={info.coverImage}
                    alt={info.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#101112] via-[#101112]/30 to-transparent" />
                  
                  <div className="absolute top-4 left-4">
                    <span className="rounded-full border border-neutral-800 bg-[#101112]/85 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.25em] text-[#95836B] backdrop-blur-md">
                      {info.code}
                    </span>
                  </div>

                  <span className="absolute top-4 right-4 rounded-full border border-neutral-800 bg-black/80 px-3 py-1 font-mono text-[11px] text-[#D8D5CD] backdrop-blur-md">
                    {count} {count === 1 ? "obra" : "obras"}
                  </span>
                </div>

                <div className="flex flex-1 flex-col justify-between p-6 sm:p-8">
                  <div>
                    <h3 className="font-serif text-2xl font-light text-[#D8D5CD] group-hover:text-white transition-colors">
                      {info.title}
                    </h3>
                    <p className="mt-2 text-xs font-mono uppercase tracking-[0.15em] text-[#95836B]">
                      {info.subtitle}
                    </p>
                    <p className="mt-4 text-sm font-light text-neutral-400 line-clamp-2 leading-relaxed">
                      {info.description}
                    </p>
                  </div>

                  <div className="mt-6 flex items-center justify-between border-t border-[#1D2021] pt-4 text-xs font-mono uppercase tracking-wider text-[#95836B] group-hover:text-[#D8D5CD] transition-colors">
                    <span>Explorar Disciplina</span>
                    <span className="transition-transform group-hover:translate-x-1">→</span>
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
