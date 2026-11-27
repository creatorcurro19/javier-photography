"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "@/components/ui/LocalizedLink";
import { getPhotoBySlug, getProjectBySlug, getProjectPhotos } from "@/lib/photos";
import { useLanguage } from "@/lib/i18n";
import { getLocalizedPhoto } from "@/lib/i18n-works";

const TERRITORIES = [
  {
    id: "la-vera",
    nameEs: "Villanueva de la Vera, Cáceres",
    nameEn: "Villanueva de la Vera, Cáceres",
    regionEs: "Extremadura · España",
    regionEn: "Extremadura · Spain",
    coords: "40°07′N · 05°27′W",
    svgX: 37,
    svgY: 44,
    disciplineEs: "Arquitectura Verata & Tradición",
    disciplineEn: "Vernacular Architecture & Tradition",
    projectSlug: "villanueva-de-la-vera",
    summaryEs:
      "Conjunto Histórico de arquitectura popular de piedra de granito, adobe y entramados de madera al pie de la Sierra de Gredos.",
    summaryEn:
      "Historic Quarter preserving granite masonry, adobe, and timber-framed vernacular architecture along the southern slopes of Sierra de Gredos.",
    samples: [
      {
        title: "Plaza de Villanueva de la Vera",
        slug: "plaza-de-villanueva-de-la-vera",
        href: "/portfolio/plaza-de-villanueva-de-la-vera",
        image: "/images/portfolio/viajes-cultura/plaza-de-villanueva-de-la-vera.jpg",
      },
      {
        title: "Secadero de Pimientos en La Vera",
        slug: "secadero-de-pimientos-en-la-vera",
        href: "/portfolio/secadero-de-pimientos-en-la-vera",
        image: "/images/portfolio/viajes-cultura/secadero-de-pimientos-en-la-vera.jpg",
      },
      {
        title: "Entramados de Villanueva de la Vera",
        slug: "entramados-de-villanueva-de-la-vera",
        href: "/portfolio/entramados-de-villanueva-de-la-vera",
        image: "/images/portfolio/arquitectura-urbana/entramados-de-villanueva-de-la-vera.jpg",
      },
    ],
  },
  {
    id: "canarias",
    nameEs: "Islas Canarias: El Teide y Anaga",
    nameEn: "Canary Islands: Mount Teide & Anaga",
    regionEs: "Atlántico Macaronésico · España",
    regionEn: "Macaronesian Atlantic · Spain",
    coords: "28°16′N · 16°38′W",
    svgX: 16,
    svgY: 74,
    disciplineEs: "Paisaje Volcánico, Laurisilva y Rally",
    disciplineEn: "Volcanic Landscape, Laurel Forest & Rally",
    projectSlug: "entre-la-bruma-y-el-volcan",
    summaryEs:
      "Cumbres volcánicas por encima de los 3.700 metros, bosques terciarios de laurisilva envueltos por la bruma del alisio y tramos de rally histórico.",
    summaryEn:
      "Volcanic peaks rising above 3,700 meters, ancient cloud-draped laurel forests shaped by trade winds, and historic rally stages.",
    samples: [
      {
        title: "Cumbre Nevada al Alba",
        slug: "cumbre-nevada-al-alba",
        href: "/portfolio/cumbre-nevada-al-alba",
        image: "/images/portfolio/paisajes-documental/cumbre-nevada-al-alba.jpg",
      },
      {
        title: "Túnel de Laurisilva en la Bruma",
        slug: "tunel-de-laurisilva-en-la-bruma",
        href: "/portfolio/tunel-de-laurisilva-en-la-bruma",
        image: "/images/portfolio/paisajes-documental/tunel-de-laurisilva-en-la-bruma.jpg",
      },
      {
        title: "Cruzada sobre el Asfalto",
        slug: "cruzada-sobre-el-asfalto",
        href: "/portfolio/cruzada-sobre-el-asfalto",
        image: "/images/portfolio/coches-rally/cruzada-sobre-el-asfalto.jpg",
      },
    ],
  },
  {
    id: "sahara",
    nameEs: "Desierto del Sahara y Erg Chebbi",
    nameEn: "Sahara Desert & Erg Chebbi",
    regionEs: "Sur del Magreb · Marruecos",
    regionEn: "Southern Maghreb · Morocco",
    coords: "31°08′N · 03°58′W",
    svgX: 42,
    svgY: 78,
    disciplineEs: "Paisaje Desértico y Minimalismo",
    disciplineEn: "Desert Landscape & Minimalism",
    projectSlug: "silencio-del-desierto",
    summaryEs:
      "Cordilleras de dunas modeladas por el viento donde la luz rasante del crepúsculo dibuja aristas entre el oro y la sombra.",
    summaryEn:
      "Wind-sculpted dune ridges where low twilight casts razor lines dividing glowing gold and deep shadow.",
    samples: [
      {
        title: "Horizonte de Dunas al Atardecer",
        slug: "horizonte-de-dunas-al-atardecer",
        href: "/portfolio/horizonte-de-dunas-al-atardecer",
        image: "/images/portfolio/paisajes-documental/horizonte-de-dunas-al-atardecer.jpg",
      },
      {
        title: "Ocaso sobre el Erg",
        slug: "ocaso-sobre-el-erg",
        href: "/portfolio/ocaso-sobre-el-erg",
        image: "/images/portfolio/paisajes-documental/ocaso-sobre-el-erg.jpg",
      },
      {
        title: "Arista de Arena y Sombra",
        slug: "arista-de-arena-y-sombra",
        href: "/portfolio/arista-de-arena-y-sombra",
        image: "/images/portfolio/paisajes-documental/arista-de-arena-y-sombra.jpg",
      },
    ],
  },
  {
    id: "marrakech-atlas",
    nameEs: "Marrakech & Alto Atlas",
    nameEn: "Marrakech & High Atlas",
    regionEs: "Región de Marrakech-Safí · Marruecos",
    regionEn: "Marrakech-Safi Region · Morocco",
    coords: "31°37′N · 07°59′W",
    svgX: 33,
    svgY: 69,
    disciplineEs: "Documental, Oficios & Arquitectura Islámica",
    disciplineEn: "Documentary, Crafts & Islamic Architecture",
    projectSlug: "medina-y-kasbah",
    summaryEs:
      "Talleres de artesanos de la madera y el textil en los callejones del zoco, simetría de madrasas y valles bereberes al pie del Alto Atlas.",
    summaryEn:
      "Woodturners and textile workshops in narrow souk lanes, serene madrasa courtyards, and High Atlas foothill valleys.",
    samples: [
      {
        title: "Oasis y Cumbres del Atlas",
        slug: "oasis-y-cumbres-del-atlas",
        href: "/portfolio/oasis-y-cumbres-del-atlas",
        image: "/images/portfolio/paisajes-documental/oasis-y-cumbres-del-atlas.jpg",
      },
      {
        title: "Tornero de Madera en el Zoco",
        slug: "tornero-de-madera-en-el-zoco",
        href: "/portfolio/tornero-de-madera-en-el-zoco",
        image: "/images/portfolio/viajes-cultura/tornero-de-madera-en-el-zoco.jpg",
      },
      {
        title: "Columnata de la Madrasa",
        slug: "columnata-de-la-madrasa",
        href: "/portfolio/columnata-de-la-madrasa",
        image: "/images/portfolio/arquitectura-urbana/columnata-de-la-madrasa.jpg",
      },
    ],
  },
  {
    id: "alpes-iberia",
    nameEs: "Bosques Alpinos & Sierras Ibéricas",
    nameEn: "Alpine Forests & Iberian Ranges",
    regionEs: "Austria & Península Ibérica",
    regionEn: "Austria & Iberian Peninsula",
    coords: "47°15′N · 11°24′E",
    svgX: 64,
    svgY: 24,
    disciplineEs: "Fauna a 600mm",
    disciplineEn: "Wildlife at 600mm",
    projectSlug: "miradas-en-libertad",
    summaryEs:
      "Observación a distancia con teleobjetivo de 600mm de mamíferos y aves en medio natural y santuarios: lince boreal, lobo europeo, cabra montés, venado y garza blanca.",
    summaryEn:
      "Long-lens 600mm wildlife observation across open mountains and sanctuaries: Eurasian lynx, wolf, Spanish ibex, red deer, and great white egret.",
    samples: [
      {
        title: "Mirada del Lince Boreal",
        slug: "mirada-del-lince-boreal",
        href: "/portfolio/mirada-del-lince-boreal",
        image: "/images/portfolio/fauna-naturaleza/mirada-del-lince-boreal.jpg",
      },
      {
        title: "El Paso del Lobo",
        slug: "el-paso-del-lobo",
        href: "/portfolio/el-paso-del-lobo",
        image: "/images/portfolio/fauna-naturaleza/el-paso-del-lobo.jpg",
      },
      {
        title: "Garza Blanca al Sol",
        slug: "garza-blanca-al-sol",
        href: "/portfolio/garza-blanca-al-sol",
        image: "/images/portfolio/fauna-naturaleza/garza-blanca-al-sol.jpg",
      },
    ],
  },
] as const;

export default function ExpeditionMap() {
  const { lang, t } = useLanguage();
  const [activeId, setActiveId] = useState<string>(TERRITORIES[0].id);
  const rawCurrent = TERRITORIES.find((item) => item.id === activeId) ?? TERRITORIES[0];

  const resolvedSamples = (() => {
    const project = getProjectBySlug(rawCurrent.projectSlug);
    const projectPhotos = project ? getProjectPhotos(project) : [];
    const seen = new Set<string>();
    const list: {
      title: string;
      slug: string;
      href: string;
      image: string;
      width: number;
      height: number;
    }[] = [];

    for (const s of rawCurrent.samples) {
      const work = getPhotoBySlug(s.slug);
      if (work && !seen.has(work.slug)) {
        seen.add(work.slug);
        const lw = getLocalizedPhoto(work, lang);
        list.push({
          title: lw.title,
          slug: lw.slug,
          href: `/portfolio/${lw.slug}`,
          image: lw.image,
          width: work.width,
          height: work.height,
        });
      }
    }

    for (const work of projectPhotos) {
      if (list.length >= 3) break;
      if (!seen.has(work.slug)) {
        seen.add(work.slug);
        const lw = getLocalizedPhoto(work, lang);
        list.push({
          title: lw.title,
          slug: lw.slug,
          href: `/portfolio/${lw.slug}`,
          image: lw.image,
          width: work.width,
          height: work.height,
        });
      }
    }

    return list;
  })();

  const current = {
    ...rawCurrent,
    name: lang === "en" ? rawCurrent.nameEn : rawCurrent.nameEs,
    region: lang === "en" ? rawCurrent.regionEn : rawCurrent.regionEs,
    discipline: lang === "en" ? rawCurrent.disciplineEn : rawCurrent.disciplineEs,
    summary: lang === "en" ? rawCurrent.summaryEn : rawCurrent.summaryEs,
    samples: resolvedSamples,
  };

  return (
    <section
      aria-labelledby="map-expedition-heading"
      className="mt-20 border border-white/[0.08] bg-[#151618] p-6 sm:p-10"
    >
      <div className="flex flex-col justify-between gap-4 border-b border-white/[0.08] pb-6 md:flex-row md:items-end">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.35em] text-[#8E8A80]">
            {t("Cartografía de Campo & Expediciones", "Field Cartography & Expeditions")}
          </p>
          <h2
            id="map-expedition-heading"
            className="mt-2 font-serif text-3xl font-light text-[#EBE7DF]"
          >
            {t("Territorios Fotografiados", "Photographed Territories")}
          </h2>
        </div>

        <div className="flex flex-wrap gap-2">
          {TERRITORIES.map((territoryItem) => {
            const label = lang === "en" ? territoryItem.nameEn : territoryItem.nameEs;
            return (
              <button
                key={territoryItem.id}
                type="button"
                onClick={() => setActiveId(territoryItem.id)}
                className={`rounded-full px-3.5 py-1.5 font-mono text-[10px] uppercase tracking-wider transition ${
                  activeId === territoryItem.id
                    ? "bg-[#EBE7DF] text-[#0B0C0E] font-medium"
                    : "border border-white/[0.08] bg-[#0B0C0E] text-[#8E8A80] hover:border-white/30 hover:text-[#EBE7DF]"
                }`}
              >
                {label.split(":")[0].split(",")[0]}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-12 items-center">
        {/* Mapa Cartográfico Estilizado con Pines Interactivos (5 cols) */}
        <div className="relative aspect-[4/3] w-full overflow-hidden border border-white/[0.08] bg-[#0B0C0E] p-4 lg:col-span-5">
          {/* Retícula de latitud/longitud */}
          <svg
            viewBox="0 0 100 100"
            className="h-full w-full opacity-85"
            aria-label={t(
              "Mapa de localizaciones fotográficas entre Europa y el Norte de África",
              "Map of photography locations across Europe and North Africa"
            )}
          >
            <defs>
              <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path
                  d="M 20 0 L 0 0 0 20"
                  fill="none"
                  stroke="rgba(255,255,255,0.06)"
                  strokeWidth="0.4"
                />
              </pattern>
            </defs>
            <rect width="100" height="100" fill="url(#grid)" />

            {/* Trazos esquemáticos de costas */}
            <path
              d="M 30 34 L 47 35 L 49 48 L 36 55 L 29 48 Z"
              fill="#151618"
              stroke="#8E8A80"
              strokeWidth="0.5"
              strokeOpacity="0.5"
            />
            <path
              d="M 47 16 L 78 14 L 82 36 L 52 38 Z"
              fill="#151618"
              stroke="#8E8A80"
              strokeWidth="0.5"
              strokeOpacity="0.4"
            />
            <path
              d="M 24 62 L 62 59 L 68 92 L 20 92 Z"
              fill="#151618"
              stroke="#8E8A80"
              strokeWidth="0.5"
              strokeOpacity="0.5"
            />
            <circle cx="16" cy="74" r="3.2" fill="#151618" stroke="#8E8A80" strokeWidth="0.5" />

            {/* Líneas de ruta entre expediciones */}
            <polyline
              points="64,24 37,44 33,69 42,78"
              fill="none"
              stroke="#8E8A80"
              strokeWidth="0.4"
              strokeDasharray="1.5 1.5"
              strokeOpacity="0.6"
            />
            <line
              x1="37"
              y1="44"
              x2="16"
              y2="74"
              stroke="#8E8A80"
              strokeWidth="0.4"
              strokeDasharray="1.5 1.5"
              strokeOpacity="0.6"
            />

            {/* Pines interactivos */}
            {TERRITORIES.map((territoryItem) => {
              const isSelected = territoryItem.id === activeId;
              return (
                <g
                  key={territoryItem.id}
                  onClick={() => setActiveId(territoryItem.id)}
                  className="cursor-pointer"
                >
                  {isSelected && (
                    <circle
                      cx={territoryItem.svgX}
                      cy={territoryItem.svgY}
                      r="5.5"
                      fill="none"
                      stroke="#EBE7DF"
                      strokeWidth="0.6"
                      opacity="0.7"
                    />
                  )}
                  <circle
                    cx={territoryItem.svgX}
                    cy={territoryItem.svgY}
                    r={isSelected ? "2.6" : "1.8"}
                    fill={isSelected ? "#EBE7DF" : "#8E8A80"}
                  />
                </g>
              );
            })}
          </svg>

          <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between font-mono text-[10px] tracking-[0.2em] text-[#8E8A80]">
            <span>{current.coords}</span>
            <span>{current.region}</span>
          </div>
        </div>

        {/* Detalle del Territorio Seleccionado y Obras (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div>
            <div className="flex flex-wrap items-center gap-3 font-mono text-xs uppercase tracking-[0.25em] text-[#8E8A80]">
              <span>{current.discipline}</span>
              <span>·</span>
              <span>{current.coords}</span>
            </div>
            <h3 className="mt-2 font-serif text-2xl sm:text-3xl font-light text-[#EBE7DF]">
              {current.name}
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-[#8E8A80] font-light">
              {current.summary}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-end gap-3 sm:gap-4">
            {current.samples.map((s) => (
              <Link
                key={s.image}
                href={s.href}
                style={{
                  flexGrow: Number((s.width / s.height).toFixed(3)),
                  aspectRatio: `${s.width} / ${s.height}`,
                }}
                className="group relative w-full sm:w-0 sm:shrink overflow-hidden border border-white/[0.08] bg-[#0B0C0E]"
              >
                <Image
                  src={s.image}
                  alt={s.title}
                  width={s.width}
                  height={s.height}
                  sizes="(max-width: 640px) 100vw, 240px"
                  quality={85}
                  className="block h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B0C0E]/90 via-transparent to-transparent" />
                <span className="absolute bottom-2 left-2 right-2 truncate font-serif text-xs text-[#EBE7DF]">
                  {s.title}
                </span>
              </Link>
            ))}
          </div>

          <div className="pt-2">
            <Link
              href={`/projects/${current.projectSlug}`}
              className="inline-flex items-center gap-2 border border-white/[0.08] bg-[#0B0C0E] px-5 py-2.5 font-mono text-xs uppercase tracking-[0.25em] text-[#EBE7DF] transition hover:border-white/30 hover:text-white"
            >
              <span>{t("Ver Proyecto de este Territorio", "View Territory Series")}</span>
              <span>→</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
