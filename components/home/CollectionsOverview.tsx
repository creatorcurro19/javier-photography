import Image from "next/image";
import Link from "next/link";
import Container from "@/components/ui/Container";
import {
  AndalusianBackgroundPattern,
  AndalusianCenefa,
} from "@/components/ui/AndalusianMotif";
import { PHOTO_CATEGORIES, CATEGORY_METADATA } from "@/types/photo";
import { getPhotosByCategory } from "@/lib/photos";

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
        mask="radial"
        className="text-[#C5A880]/[0.045]"
      />

      {/* Cenefa superior discreta */}
      <div className="absolute inset-x-0 top-0">
        <AndalusianCenefa variant="estrella" className="text-[#C5A880]/20" />
      </div>

      <Container className="relative z-10">
        {/* Curatorial Header */}
        <div className="flex flex-col justify-between gap-4 pb-8 border-b border-white/[0.08] md:flex-row md:items-end">
          <div className="max-w-xl">
            <div className="flex items-center gap-3">
              <span className="h-px w-6 bg-white/30" />
              <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-[#8E8A80]">
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
            <span>Ver archivo completo (100)</span>
            <span className="transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>
          </Link>
        </div>

        {/* Compact Architectural 5-Room Grid */}
        <div className="mt-10 grid grid-cols-1 gap-5 sm:gap-6 lg:grid-cols-12">
          {WINGS_CONFIG.map((wing) => {
            const info = CATEGORY_METADATA[wing.category];
            const count = getPhotosByCategory(wing.category).length;

            return (
              <Link
                key={wing.category}
                href={`/portfolio/${wing.category}`}
                className={`group relative block overflow-hidden border border-white/[0.08] bg-[#151618] transition-all duration-500 hover:border-white/30 ${wing.colSpanClass}`}
                aria-label={`${wing.roomRoman}: ${info.title} (${count} obras)`}
              >
                <div className={`relative w-full overflow-hidden ${wing.aspectClass}`}>
                  <Image
                    src={info.coverImage}
                    alt={`${info.title} — ${wing.subtitle}`}
                    fill
                    sizes={
                      wing.colSpanClass.includes("col-span-6")
                        ? "(max-width: 1024px) 100vw, 50vw"
                        : "(max-width: 1024px) 100vw, 33vw"
                    }
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03] brightness-[0.85] group-hover:brightness-95"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0B0C0E]/90 via-[#0B0C0E]/25 to-transparent" />

                  {/* Clean Integrated Plaque */}
                  <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-5 sm:p-6">
                    <div>
                      <p className="font-mono text-[9px] uppercase tracking-[0.28em] text-[#EBE7DF]/70">
                        {wing.roomRoman} · {count} Obras
                      </p>
                      <h3 className="mt-1 font-serif text-xl sm:text-2xl font-light text-[#EBE7DF] transition-colors group-hover:text-white">
                        {info.title}
                      </h3>
                    </div>
                    <span className="font-mono text-xs text-[#EBE7DF]/75 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-white">
                      →
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </Container>

      {/* Cenefa inferior discreta */}
      <div className="absolute inset-x-0 bottom-0">
        <AndalusianCenefa variant="estrella" className="text-[#C5A880]/20" />
      </div>
    </section>
  );
}
