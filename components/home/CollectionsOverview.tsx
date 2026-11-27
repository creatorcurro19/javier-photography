"use client";

import Image from "next/image";
import Link from "@/components/ui/LocalizedLink";
import Container from "@/components/ui/Container";
import { PHOTO_CATEGORIES, CATEGORY_METADATA } from "@/types/photo";
import { getAllPhotos, getPhotosByCategory } from "@/lib/photos";
import { useLanguage } from "@/lib/i18n";

interface CuratedWing {
  category: (typeof PHOTO_CATEGORIES)[number];
  roomRoman: string;
  roomRomanEn: string;
  aspectClass: string;
  colSpanClass: string;
  subtitle: string;
  subtitleEn: string;
}

const WINGS_CONFIG: CuratedWing[] = [
  {
    category: "paisajes-documental",
    roomRoman: "Colección 01",
    roomRomanEn: "Collection 01",
    aspectClass: "aspect-[16/9]",
    colSpanClass: "lg:col-span-6",
    subtitle: "Territorio & Silencio Mineral",
    subtitleEn: "Territory & Mineral Silence",
  },
  {
    category: "fauna-naturaleza",
    roomRoman: "Colección 02",
    roomRomanEn: "Collection 02",
    aspectClass: "aspect-[16/9]",
    colSpanClass: "lg:col-span-6",
    subtitle: "Observación & Fauna",
    subtitleEn: "Observation & Wildlife",
  },
  {
    category: "coches-rally",
    roomRoman: "Colección 03",
    roomRomanEn: "Collection 03",
    aspectClass: "aspect-[16/10]",
    colSpanClass: "lg:col-span-4",
    subtitle: "Geometría de la Velocidad",
    subtitleEn: "Geometry of Speed",
  },
  {
    category: "arquitectura-urbana",
    roomRoman: "Colección 04",
    roomRomanEn: "Collection 04",
    aspectClass: "aspect-[16/10]",
    colSpanClass: "lg:col-span-4",
    subtitle: "Entramados & Patrimonio",
    subtitleEn: "Timberwork & Heritage",
  },
  {
    category: "viajes-cultura",
    roomRoman: "Colección 05",
    roomRomanEn: "Collection 05",
    aspectClass: "aspect-[16/10]",
    colSpanClass: "lg:col-span-4",
    subtitle: "Crónica & Oficios Tradicionales",
    subtitleEn: "Chronicle & Traditional Crafts",
  },
];

const HERO_SLUGS = new Set([
  "mar-de-dunas-al-ocaso",
  "cumbre-nevada-al-alba",
  "mirada-del-lince-boreal",
  "cuervo-canario-ante-las-cumbres",
  "el-oficio-y-la-chispa",
]);

export default function CollectionsOverview() {
  const { lang, t } = useLanguage();
  const totalPhotos = getAllPhotos().length;

  return (
    <section
      id="colecciones"
      className="relative overflow-hidden bg-[#0B0C0E] py-12 sm:py-16 border-t border-white/[0.08] scroll-mt-20"
      aria-label={t("Colecciones de fotografía", "Photography collections")}
    >
      <Container className="relative z-10">
        {/* Cabecera Simple y Directa */}
        <div className="flex flex-col justify-between gap-4 pb-6 border-b border-white/[0.08] md:flex-row md:items-end">
          <div className="max-w-xl">
            <p className="font-mono text-xs uppercase tracking-[0.28em] text-[#C5A880]">
              {t("Explorar por tema", "Browse by theme")}
            </p>
            <h2 className="mt-2 font-serif text-3xl sm:text-4xl font-light text-[#EBE7DF] tracking-tight">
              {t("Elige qué fotos quieres ver", "Choose which photographs to explore")}
            </h2>
          </div>

          <Link
            href="/portfolio"
            className="group inline-flex min-h-[44px] items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-[#EBE7DF] transition-colors hover:text-[#C5A880]"
          >
            <span>{t(`Ver las ${totalPhotos} fotos`, `View all ${totalPhotos} photos`)}</span>
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
            const nonHeroCover =
              catPhotos.find((p) => p.featured && !p.heroOrder && !HERO_SLUGS.has(p.slug)) ??
              catPhotos.find((p) => !p.heroOrder && !HERO_SLUGS.has(p.slug));
            const validCover = customCoverPhoto
              ? customCoverPhoto.image
              : nonHeroCover
              ? nonHeroCover.image
              : catPhotos[0]?.image ?? info.coverImage;
            const title = lang === "en" ? info.titleEn : info.title;
            const subtitle = lang === "en" ? wing.subtitleEn : wing.subtitle;
            const roomLabel = lang === "en" ? wing.roomRomanEn : wing.roomRoman;

            return (
              <Link
                key={wing.category}
                href={`/portfolio/${wing.category}`}
                className={`group relative block overflow-hidden border border-[#C5A880]/18 bg-[#151618] transition-all duration-500 hover:border-[#C5A880]/55 ${wing.colSpanClass}`}
                aria-label={t(`${roomLabel}: ${title} (${count} obras)`, `${roomLabel}: ${title} (${count} works)`)}
              >
                <div className={`relative w-full overflow-hidden ${wing.aspectClass}`}>
                  <Image
                    src={validCover}
                    alt={`${title} — ${subtitle}`}
                    fill
                    sizes={
                      wing.colSpanClass.includes("col-span-6")
                        ? "(max-width: 1024px) 100vw, 50vw"
                        : "(max-width: 1024px) 100vw, 33vw"
                    }
                    quality={85}
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                  />
                  {/* Veladura inferior solo en pantallas sm+ donde la cartela se superpone */}
                  <div className="hidden sm:block absolute inset-0 bg-gradient-to-t from-[#0B0C0E] via-[#0B0C0E]/65 via-40% to-transparent" />
                </div>

                {/* Cartela simple y clara */}
                <div className="flex items-end justify-between gap-4 border-t border-white/[0.08] bg-[#151618] px-5 py-4 sm:absolute sm:inset-x-0 sm:bottom-0 sm:bg-[#0B0C0E]/75 sm:px-6 sm:py-5 sm:backdrop-blur-sm">
                  <div className="min-w-0">
                    <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#C5A880]">
                      {count} {t("fotos", "photos")}
                    </p>
                    <h3 className="mt-1 truncate font-serif text-lg sm:text-2xl font-light text-[#F7F4EE] sm:[text-shadow:0_2px_12px_rgba(0,0,0,0.85)] transition-colors group-hover:text-white">
                      {title}
                    </h3>
                  </div>
                  <span className="shrink-0 font-mono text-xs uppercase tracking-wider text-[#C5A880] transition-transform duration-300 group-hover:translate-x-1 group-hover:text-[#F7F4EE]">
                    {t("Ver →", "View →")}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
