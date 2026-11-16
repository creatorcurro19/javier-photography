import Image from "next/image";
import Link from "next/link";
import Container from "@/components/ui/Container";
import SectionHeader from "@/components/ui/SectionHeader";
import { PHOTO_CATEGORIES, CATEGORY_METADATA } from "@/types/photo";
import { getPhotosByCategory } from "@/lib/photos";

export default function CollectionsOverview() {
  return (
    <section id="colecciones" className="bg-neutral-950 py-28 md:py-36 border-t border-neutral-900 scroll-mt-20">
      <Container>
        <SectionHeader
          label="Series Fotográficas"
          title="Cinco Colecciones Independientes"
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
                className="group relative flex flex-col overflow-hidden rounded-lg border border-neutral-900 bg-neutral-950 transition duration-500 hover:border-neutral-700 hover:shadow-2xl"
              >
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-neutral-900">
                  <Image
                    src={info.coverImage}
                    alt={info.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/30 to-transparent" />
                  
                  <span className="absolute top-4 right-4 rounded-full border border-neutral-800 bg-black/80 px-3 py-1 font-mono text-[11px] text-neutral-300 backdrop-blur-md">
                    {count} {count === 1 ? "obra" : "obras"}
                  </span>
                </div>

                <div className="flex flex-1 flex-col justify-between p-6 sm:p-8">
                  <div>
                    <h3 className="font-serif text-2xl font-light text-neutral-100 group-hover:text-white transition-colors">
                      {info.title}
                    </h3>
                    <p className="mt-2 text-xs font-mono uppercase tracking-[0.15em] text-neutral-400">
                      {info.subtitle}
                    </p>
                    <p className="mt-4 text-sm font-light text-neutral-400 line-clamp-2 leading-relaxed">
                      {info.description}
                    </p>
                  </div>

                  <div className="mt-6 flex items-center justify-between border-t border-neutral-800/80 pt-4 text-xs font-mono uppercase tracking-wider text-neutral-400 group-hover:text-neutral-200 transition-colors">
                    <span>Ver Colección</span>
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
