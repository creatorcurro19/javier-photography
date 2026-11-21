import Image from "next/image";
import Link from "next/link";
import Container from "@/components/ui/Container";
import {
  AndalusianBackgroundPattern,
  AndalusianCenefa,
  AndalusianStarMark,
  AndalusianVerticalCenefa,
} from "@/components/ui/AndalusianMotif";
import { PHOTO_CATEGORIES, CATEGORY_METADATA } from "@/types/photo";
import { getAllPhotos, getPhotosByCategory } from "@/lib/photos";

interface CuratedWing {
  category: (typeof PHOTO_CATEGORIES)[number];
  roomRoman: string;
  aspectClass: string;
  colSpanClass: string;
  subtitle: string;
}

const WINGS_CONFIG: CuratedWing[] = [
  {
    category: "paisajes-documental",
    roomRoman: "SALA I",
    aspectClass: "aspect-[16/9]",
    colSpanClass: "lg:col-span-6",
    subtitle: "Territorio & Silencio Mineral",
  },
  {
    category: "fauna-naturaleza",
    roomRoman: "SALA II",
    aspectClass: "aspect-[16/9]",
    colSpanClass: "lg:col-span-6",
    subtitle: "Fauna en Libertad",
  },
  {
    category: "coches-rally",
    roomRoman: "SALA III",
    aspectClass: "aspect-[16/10]",
    colSpanClass: "lg:col-span-4",
    subtitle: "Geometría de la Velocidad",
  },
  {
    category: "arquitectura-urbana",
    roomRoman: "SALA IV",
    aspectClass: "aspect-[16/10]",
    colSpanClass: "lg:col-span-4",
    subtitle: "Entramados & Patrimonio",
  },
  {
    category: "viajes-cultura",
    roomRoman: "SALA V",
    aspectClass: "aspect-[16/10]",
    colSpanClass: "lg:col-span-4",
    subtitle: "Crónica & Oficios Tradicionales",
  },
];

export default function CollectionsOverview() {
  return (
    <section
      id="colecciones"
      className="relative overflow-hidden bg-[#0B0C0E] py-20 sm:py-24 border-t border-white/[0.08] scroll-mt-20"
      aria-label="Salas de Exposición Permanente"
    >
      {/* Fondo discreto de lacería andalusí */}
      <AndalusianBackgroundPattern
        variant="laceria"
        mask="none"
        className="text-[#C5A880]/[0.055]"
      />
      <AndalusianBackgroundPattern
        variant="laceria"
        mask="radial"
        className="text-[#C5A880]/[0.09]"
      />

      {/* Cenefa superior */}
      <div className="absolute inset-x-0 top-0">
        <AndalusianCenefa variant="estrella" className="text-[#C5A880]/40" />
      </div>

      {/* Cenefas verticales laterales (alfiz) */}
      <div className="pointer-events-none absolute inset-y-8 left-2.5 hidden lg:block">
        <AndalusianVerticalCenefa className="text-[#C5A880]/28" />
      </div>
      <div className="pointer-events-none absolute inset-y-8 right-2.5 hidden lg:block">
        <AndalusianVerticalCenefa className="text-[#C5A880]/28" />
      </div>

      <Container className="relative z-10">
        {/* Curatorial Header */}
        <div className="flex flex-col justify-between gap-4 pb-8 border-b border-[#C5A880]/20 md:flex-row md:items-end">
          <div className="max-w-xl">
            <div className="flex items-center gap-2.5">
              <AndalusianStarMark className="h-3.5 w-3.5 text-[#C5A880]/75" />
              <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-[#C5A880]/85">
                Colección Permanente
              </p>
            </div>
            <h2 className="mt-2.5 font-serif text-3xl sm:text-4xl font-light text-[#EBE7DF] tracking-tight">
              Cinco Disciplinas
            </h2>
          </div>

          <Link
            href="/portfolio"
            className="group inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.26em] text-[#8E8A80] transition-colors hover:text-[#EBE7DF]"
          >
            <span>Ver archivo completo ({getAllPhotos().length})</span>
            <span className="transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>
          </Link>
        </div>

        {/* Compact Architectural 5-Room Grid */}
        <div className="mt-10 grid grid-cols-1 gap-5 sm:gap-6 lg:grid-cols-12">
          {WINGS_CONFIG.map((wing) => {
            const info = CATEGORY_METADATA[wing.category];
            const catPhotos = getPhotosByCategory(wing.category);
            const count = catPhotos.length;
            const customCoverPhoto = catPhotos.find((p) => p.categoryCover);
            const validCover = customCoverPhoto
              ? customCoverPhoto.image
              : catPhotos.some((p) => p.image === info.coverImage)
              ? info.coverImage
              : catPhotos[0]?.image ?? info.coverImage;

            return (
              <Link
                key={wing.category}
                href={`/portfolio/${wing.category}`}
                className={`group relative block overflow-hidden border border-[#C5A880]/18 bg-[#151618] transition-all duration-500 hover:border-[#C5A880]/55 ${wing.colSpanClass}`}
                aria-label={`${wing.roomRoman}: ${info.title} (${count} obras)`}
              >
                <div className={`relative w-full overflow-hidden ${wing.aspectClass}`}>
                  <Image
                    src={validCover}
                    alt={`${info.title} — ${wing.subtitle}`}
                    fill
                    sizes={
                      wing.colSpanClass.includes("col-span-6")
                        ? "(max-width: 1024px) 100vw, 50vw"
                        : "(max-width: 1024px) 100vw, 33vw"
                    }
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03] brightness-[0.9] sm:brightness-[0.84] group-hover:brightness-95"
                  />
                  {/* Veladura inferior solo en pantallas sm+ donde la cartela se superpone */}
                  <div className="hidden sm:block absolute inset-0 bg-gradient-to-t from-[#0B0C0E] via-[#0B0C0E]/65 via-40% to-transparent" />
                </div>

                {/* Cartela: debajo de la foto en móvil (cero obstrucción), superpuesta abajo en sm+ */}
                <div className="flex items-end justify-between gap-4 border-t border-[#C5A880]/15 bg-[#151618] px-5 py-4 sm:absolute sm:inset-x-0 sm:bottom-0 sm:bg-[#0B0C0E]/70 sm:px-6 sm:py-5 sm:backdrop-blur-sm">
                  <div className="min-w-0">
                    <p className="font-mono text-[10px] uppercase tracking-[0.26em] text-[#E5D3B3]">
                      {wing.roomRoman} · {count} Obras
                    </p>
                    <h3 className="mt-1 truncate font-serif text-lg sm:text-2xl font-light text-[#F7F4EE] sm:[text-shadow:0_2px_12px_rgba(0,0,0,0.85)] transition-colors group-hover:text-white">
                      {info.title}
                    </h3>
                  </div>
                  <span className="shrink-0 font-mono text-sm text-[#C5A880] transition-transform duration-300 group-hover:translate-x-1 group-hover:text-[#F7F4EE]">
                    →
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </Container>

      {/* Cenefa inferior discreta */}
      <div className="absolute inset-x-0 bottom-0">
        <AndalusianCenefa variant="estrella" className="text-[#C5A880]/30" />
      </div>
    </section>
  );
}
