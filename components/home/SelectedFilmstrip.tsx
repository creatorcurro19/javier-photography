"use client";

import Image from "next/image";
import Link from "@/components/ui/LocalizedLink";
import ChillReveal from "@/components/ui/ChillReveal";
import Container from "@/components/ui/Container";
import { useLanguage } from "@/lib/i18n";
import { getLocalizedPhoto } from "@/lib/i18n-works";
import { getAllPhotos, getFeaturedPhotos } from "@/lib/photos";
import { CATEGORY_METADATA, type Photo } from "@/types/photo";

const EXCLUDED_SLUGS = new Set([
  "mar-de-dunas-al-ocaso",
  "cumbre-nevada-al-alba",
  "mirada-del-lince-boreal",
  "cuervo-canario-ante-las-cumbres",
  "el-oficio-y-la-chispa",
]);

function pickCuratedStrip(): Photo[] {
  const featured = getFeaturedPhotos().filter((p) => !EXCLUDED_SLUGS.has(p.slug));
  const pool = featured.length >= 6 ? featured : [...featured, ...getAllPhotos()];
  const seen = new Set<string>();
  const picked: Photo[] = [];

  for (const photo of pool) {
    if (seen.has(photo.slug) || EXCLUDED_SLUGS.has(photo.slug)) continue;
    seen.add(photo.slug);
    picked.push(photo);
    if (picked.length === 8) break;
  }

  return picked;
}

const CURATED_STRIP = pickCuratedStrip();

export default function SelectedFilmstrip() {
  const { lang, t } = useLanguage();
  if (CURATED_STRIP.length === 0) return null;

  // Duplicamos los marcos para lograr un desplazamiento continuo sin saltos y pausable al pasar el cursor.
  const loopFrames = [...CURATED_STRIP, ...CURATED_STRIP];

  return (
    <section
      className="relative overflow-hidden border-t border-white/[0.08] bg-[#0B0C0E] py-10 sm:py-14"
      aria-label={t("Cinta curatorial de archivo", "Curated archive filmstrip")}
    >
      <Container>
        <ChillReveal className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.28em] text-[#C5A880]">
              {t("Paseo visual · Archivo", "Visual Drift · Archive")}
            </p>
            <h2 className="mt-1.5 font-serif text-2xl sm:text-3xl font-light text-[#EBE7DF] tracking-tight">
              {t("Obras destacadas en tirada limitada", "Selected limited edition frames")}
            </h2>
          </div>

          <Link
            href="/selected-work"
            className="group inline-flex min-h-[44px] items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-[#EBE7DF] transition-colors hover:text-[#C5A880]"
          >
            <span>{t("Sala seleccionada", "Selected room")}</span>
            <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
          </Link>
        </ChillReveal>
      </Container>

      <ChillReveal delayMs={120} className="relative mt-7">
        {/* Veladuras laterales para fundir los bordes suavemente con el fondo obsidiana */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 left-0 z-10 w-10 sm:w-24 bg-gradient-to-r from-[#0B0C0E] to-transparent"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 right-0 z-10 w-10 sm:w-24 bg-gradient-to-l from-[#0B0C0E] to-transparent"
        />

        <div className="group/marquee overflow-x-auto no-scrollbar sm:overflow-hidden">
          <div className="flex w-max gap-4 sm:gap-5 px-4 sm:px-0 animate-[gallery-drift_68s_linear_infinite] group-hover/marquee:[animation-play-state:paused] motion-reduce:animate-none">
            {loopFrames.map((rawPhoto, idx) => {
              const photo = getLocalizedPhoto(rawPhoto, lang);
              const cat = CATEGORY_METADATA[rawPhoto.category];
              const catLabel = cat ? (lang === "en" ? cat.titleEn : cat.title) : "";
              const isClone = idx >= CURATED_STRIP.length;

              return (
                <Link
                  key={`${rawPhoto.slug}-${idx}`}
                  href={`/portfolio/${rawPhoto.slug}`}
                  tabIndex={isClone ? -1 : undefined}
                  aria-hidden={isClone || undefined}
                  className="group relative block w-[240px] sm:w-[300px] shrink-0 overflow-hidden border border-white/[0.08] bg-[#151618] transition-all duration-500 hover:border-[#C5A880]/55"
                >
                  <div className="relative aspect-[3/2] w-full overflow-hidden">
                    <Image
                      src={rawPhoto.image}
                      alt={isClone ? "" : `${photo.title} — ${catLabel}`}
                      fill
                      loading="eager"
                      sizes="(max-width: 640px) 240px, 300px"
                      quality={75}
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                    />
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0B0C0E]/90 via-transparent to-transparent opacity-80 transition-opacity duration-500 group-hover:opacity-95" />
                  </div>

                  <div className="flex items-center justify-between gap-3 px-4 py-3 border-t border-white/[0.06]">
                    <div className="min-w-0">
                      <p className="truncate font-serif text-base font-light text-[#F7F4EE] group-hover:text-white transition-colors">
                        {photo.title}
                      </p>
                      <p className="truncate font-mono text-[10px] uppercase tracking-[0.18em] text-[#C5A880]/90">
                        {catLabel}
                      </p>
                    </div>
                    <span className="shrink-0 font-mono text-[11px] text-[#A39E93] transition-transform duration-300 group-hover:translate-x-1 group-hover:text-[#C5A880]">
                      →
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </ChillReveal>
    </section>
  );
}
