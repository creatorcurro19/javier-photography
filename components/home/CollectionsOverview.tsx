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
  roomNumber: string;
  aspectClass: string;
  colSpanClass: string;
  subtitle: string;
  excerpt: string;
}

const WINGS_CONFIG: CuratedWing[] = [
  {
    category: "paisajes-documental",
    roomRoman: "SALA I",
    roomNumber: "01",
    aspectClass: "aspect-[16/10]",
    colSpanClass: "lg:col-span-7",
    subtitle: "Territorio & Silencio Mineral",
    excerpt: "Grandes extensiones, silencios del desierto y cumbres nevadas capturadas con luz natural y rigor cromático.",
  },
  {
    category: "fauna-naturaleza",
    roomRoman: "SALA II",
    roomNumber: "02",
    aspectClass: "aspect-[4/5]",
    colSpanClass: "lg:col-span-5",
    subtitle: "Fauna en Libertad",
    excerpt: "Aproximaciones éticas sin alteración de hábitat. El lince ibérico, la garza y la cabra montés en su entorno salvaje.",
  },
  {
    category: "coches-rally",
    roomRoman: "SALA III",
    roomNumber: "03",
    aspectClass: "aspect-[16/11]",
    colSpanClass: "lg:col-span-4",
    subtitle: "Geometría de la Velocidad",
    excerpt: "Tramos cronometrados, derrapes sobre asfalto y la liturgia mecánica del parque de asistencia.",
  },
  {
    category: "arquitectura-urbana",
    roomRoman: "SALA IV",
    roomNumber: "04",
    aspectClass: "aspect-[16/11]",
    colSpanClass: "lg:col-span-4",
    subtitle: "Entramados & Patrimonio",
    excerpt: "La memoria constructiva de La Vera, entramados de madera de castaño y la abstracción de la piedra vernácula.",
  },
  {
    category: "viajes-cultura",
    roomRoman: "SALA V",
    roomNumber: "05",
    aspectClass: "aspect-[16/11]",
    colSpanClass: "lg:col-span-4",
    subtitle: "Crónica & Oficios Tradicionales",
    excerpt: "El fuego del soldador, mercados de la medina y retratos de oficios que resisten al paso del tiempo.",
  },
];

export default function CollectionsOverview() {
  return (
    <section
      id="colecciones"
      className="relative overflow-hidden bg-[#0B0C0E] py-28 sm:py-36 border-t border-white/[0.08] scroll-mt-20"
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
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end pb-12 border-b border-white/[0.08]">
          <div className="max-w-2xl">
            <div className="flex items-center gap-3">
              <span className="h-px w-6 bg-white/30" />
              <p className="font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.4em] text-[#8E8A80]">
                Colección Permanente
              </p>
            </div>
            <h2 className="mt-3 font-serif text-3xl sm:text-4xl lg:text-5xl font-light text-[#EBE7DF] tracking-tight">
              Cinco Disciplinas, Un Mismo Rigor
            </h2>
            <p className="mt-4 text-sm sm:text-base font-light text-[#8E8A80] leading-relaxed">
              Cada disciplina responde a una liturgia visual: la paciencia ante la fauna salvaje, la precisión en la línea de meta, la escala humana del patrimonio y la inmensidad del territorio.
            </p>
          </div>

          <Link
            href="/portfolio"
            className="group inline-flex items-center gap-2.5 font-mono text-[11px] uppercase tracking-[0.28em] text-[#8E8A80] transition-colors duration-300 hover:text-[#EBE7DF]"
          >
            <span>Ver Catálogo Completo (100 Obras)</span>
            <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
          </Link>
        </div>

        {/* Asymmetric Curatorial Installation */}
        <div className="mt-16 grid grid-cols-1 gap-8 sm:gap-10 lg:grid-cols-12">
          {WINGS_CONFIG.map((wing) => {
            const info = CATEGORY_METADATA[wing.category];
            const photos = getPhotosByCategory(wing.category);
            const count = photos.length;

            return (
              <div
                key={wing.category}
                className={`group flex flex-col justify-between ${wing.colSpanClass}`}
              >
                <Link
                  href={`/portfolio/${wing.category}`}
                  className="block relative w-full overflow-hidden border border-white/[0.08] bg-[#151618] transition-all duration-500 hover:border-white/30"
                  aria-label={`${wing.roomRoman}: ${info.title} (${count} obras)`}
                >
                  <div className={`relative w-full overflow-hidden ${wing.aspectClass}`}>
                    <Image
                      src={info.coverImage}
                      alt={`${info.title} — ${wing.subtitle}`}
                      fill
                      sizes={
                        wing.colSpanClass.includes("col-span-7")
                          ? "(max-width: 1024px) 100vw, 58vw"
                          : wing.colSpanClass.includes("col-span-5")
                          ? "(max-width: 1024px) 100vw, 42vw"
                          : "(max-width: 1024px) 100vw, 33vw"
                      }
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03] brightness-[0.92] group-hover:brightness-100"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0B0C0E]/80 via-transparent to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-500" />
                  </div>

                  {/* Museum Plaque on Artwork */}
                  <div className="p-6 sm:p-7 bg-[#151618]/90 border-t border-white/[0.06] flex flex-col justify-between">
                    <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.28em] text-[#8E8A80]">
                      <span>{wing.roomRoman} · {info.code}</span>
                      <span>{count} Obras</span>
                    </div>

                    <h3 className="mt-3 font-serif text-xl sm:text-2xl font-light text-[#EBE7DF] transition-colors duration-300 group-hover:text-white">
                      {info.title}
                    </h3>

                    <p className="mt-2 text-xs font-light text-[#8E8A80] leading-relaxed line-clamp-2">
                      {wing.excerpt}
                    </p>

                    <div className="mt-5 flex items-center justify-between pt-4 border-t border-white/[0.05] text-[10px] uppercase font-mono tracking-[0.24em] text-[#8E8A80]">
                      <span className="transition-colors duration-300 group-hover:text-[#EBE7DF]">
                        Entrar a la Sala
                      </span>
                      <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                    </div>
                  </div>
                </Link>
              </div>
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
