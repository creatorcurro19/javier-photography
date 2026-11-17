"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

const TERRITORIES = [
  {
    id: "la-vera",
    name: "Villanueva de la Vera, Cáceres",
    region: "Extremadura · España",
    coords: "40°07′N · 05°27′W",
    svgX: 37,
    svgY: 44,
    discipline: "Arquitectura Verata & Tradición",
    projectSlug: "villanueva-de-la-vera",
    summary:
      "Conjunto Histórico de arquitectura popular de piedra de granito, adobe y entramados de madera al pie de la Sierra de Gredos.",
    samples: [
      {
        title: "Plaza de Villanueva de la Vera",
        slug: "Mirada Infantil",
        href: "/projects/villanueva-de-la-vera",
        image: "/images/portfolio/viajes-cultura/B51A7089.jpg",
      },
      {
        title: "Secadero de Pimientos en La Vera",
        slug: "Paseo al Atardecer",
        href: "/projects/villanueva-de-la-vera",
        image: "/images/portfolio/viajes-cultura/B51A6798.jpg",
      },
      {
        title: "Entramados de Villanueva de la Vera",
        slug: "Detalle de Forja",
        href: "/projects/villanueva-de-la-vera",
        image: "/images/portfolio/viajes-cultura/B51A6915.jpg",
      },
    ],
  },
  {
    id: "canarias",
    name: "Islas Canarias: El Teide & Anaga",
    region: "Atlántico Macaronésico · España",
    coords: "28°16′N · 16°38′W",
    svgX: 16,
    svgY: 74,
    discipline: "Paisaje Volcánico, Laurisilva & Rally",
    projectSlug: "la-gomera",
    summary:
      "Cumbres volcánicas por encima de los 3.700 metros, bosques terciarios de laurisilva envueltos por la bruma del alisio y tramos de rally histórico.",
    samples: [
      {
        title: "Cumbre Nevada al Alba",
        slug: "linea-de-asfalto-en-la-penumbra-pd-2",
        href: "/projects/la-gomera",
        image: "/images/portfolio/paisajes-documental/B51A0149.jpg",
      },
      {
        title: "Túnel de Laurisilva en la Bruma",
        slug: "diagonales-en-la-fachada-au-4",
        href: "/projects/la-gomera",
        image: "/images/portfolio/arquitectura-urbana/B51A4877.jpg",
      },
      {
        title: "Cruzada sobre el Asfalto",
        slug: "trazada-en-el-tramo-humedo-cr-13",
        href: "/projects/trazadas-rally",
        image: "/images/portfolio/coches-rally/B51A9718.jpg",
      },
    ],
  },
  {
    id: "sahara",
    name: "Desierto del Sahara & Erg Chebbi",
    region: "Sur del Magreb · Marruecos",
    coords: "31°08′N · 03°58′W",
    svgX: 42,
    svgY: 78,
    discipline: "Paisaje Desértico & Minimalismo",
    projectSlug: "silencio-del-desierto",
    summary:
      "Cordilleras de dunas modeladas por el viento donde la luz rasante del crepúsculo dibuja aristas entre el oro y la sombra.",
    samples: [
      {
        title: "Horizonte de Dunas al Atardecer",
        slug: "horizonte-calido-vc-39",
        href: "/projects/silencio-del-desierto",
        image: "/images/portfolio/viajes-cultura/B51A7335.jpg",
      },
      {
        title: "Ocaso sobre el Erg",
        slug: "olas-de-arena-vc-42",
        href: "/projects/silencio-del-desierto",
        image: "/images/portfolio/viajes-cultura/B51A7341.jpg",
      },
      {
        title: "Arista de Arena y Sombra",
        slug: "arista-de-arena-y-sombra-pd-12",
        href: "/portfolio/arista-de-arena-y-sombra-pd-12",
        image: "/images/portfolio/paisajes-documental/B51A7284.jpg",
      },
    ],
  },
  {
    id: "marrakech-atlas",
    name: "Marrakech & Alto Atlas",
    region: "Región de Marrakech-Safí · Marruecos",
    coords: "31°37′N · 07°59′W",
    svgX: 33,
    svgY: 69,
    discipline: "Documental, Oficios & Arquitectura Islámica",
    projectSlug: "medina-y-kasbah",
    summary:
      "Talleres de artesanos de la madera y el textil en los callejones del zoco, simetría de madrasas y valles bereberes al pie del Alto Atlas.",
    samples: [
      {
        title: "Oasis y Cumbres del Atlas",
        slug: "oasis-y-cumbres-del-atlas-pd-11",
        href: "/projects/medina-y-kasbah",
        image: "/images/portfolio/paisajes-documental/B51A7099.jpg",
      },
      {
        title: "Tornero de Madera en el Zoco",
        slug: "tornero-de-madera-en-el-zoco-vc-45",
        href: "/portfolio/tornero-de-madera-en-el-zoco-vc-45",
        image: "/images/portfolio/viajes-cultura/B51A6369.jpg",
      },
      {
        title: "Columnata de la Madrasa",
        slug: "columnata-de-la-madrasa-au-8",
        href: "/portfolio/columnata-de-la-madrasa-au-8",
        image: "/images/portfolio/arquitectura-urbana/B51A6080.jpg",
      },
    ],
  },
  {
    id: "alpes-iberia",
    name: "Bosques Alpinos & Sierras Ibéricas",
    region: "Austria & Península Ibérica",
    coords: "47°15′N · 11°24′E",
    svgX: 64,
    svgY: 24,
    discipline: "Fauna Salvaje a 600mm",
    projectSlug: "miradas-en-libertad",
    summary:
      "Seguimiento con superteleobjetivo de 600mm de grandes mamíferos y aves en su hábitat: lince boreal, lobo europeo, cabra montés, venado y garza blanca.",
    samples: [
      {
        title: "Mirada del Lince Boreal",
        slug: "mirada-del-lince-boreal-fn-4",
        href: "/portfolio/mirada-del-lince-boreal-fn-4",
        image: "/images/portfolio/fauna-naturaleza/B51A1823-Mejorado-NR.jpg",
      },
      {
        title: "El Paso del Lobo",
        slug: "el-paso-del-lobo-fn-8",
        href: "/portfolio/el-paso-del-lobo-fn-8",
        image: "/images/portfolio/fauna-naturaleza/B51A1865-Mejorado-NR.jpg",
      },
      {
        title: "Garza Blanca al Sol",
        slug: "garza-blanca-al-sol-fn-3",
        href: "/portfolio/garza-blanca-al-sol-fn-3",
        image: "/images/portfolio/fauna-naturaleza/IMG_8446-Mejorado-NR.jpg",
      },
    ],
  },
] as const;

export default function ExpeditionMap() {
  const [activeId, setActiveId] = useState<string>(TERRITORIES[0].id);
  const current = TERRITORIES.find((t) => t.id === activeId) ?? TERRITORIES[0];

  return (
    <section
      aria-labelledby="map-expedition-heading"
      className="mt-20 border border-white/[0.08] bg-[#151618] p-6 sm:p-10"
    >
      <div className="flex flex-col justify-between gap-4 border-b border-white/[0.08] pb-6 md:flex-row md:items-end">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.35em] text-[#8E8A80]">
            Cartografía de Campo & Expediciones
          </p>
          <h2
            id="map-expedition-heading"
            className="mt-2 font-serif text-3xl font-light text-[#EBE7DF]"
          >
            Territorios Fotografiados
          </h2>
        </div>

        <div className="flex flex-wrap gap-2">
          {TERRITORIES.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setActiveId(t.id)}
              className={`rounded-full px-3.5 py-1.5 font-mono text-[10px] uppercase tracking-wider transition ${
                activeId === t.id
                  ? "bg-[#EBE7DF] text-[#0B0C0E] font-medium"
                  : "border border-white/[0.08] bg-[#0B0C0E] text-[#8E8A80] hover:border-white/30 hover:text-[#EBE7DF]"
              }`}
            >
              {t.name.split(":")[0].split(",")[0]}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-12 items-center">
        {/* Mapa Cartográfico Estilizado con Pines Interactivos (5 cols) */}
        <div className="relative aspect-[4/3] w-full overflow-hidden border border-white/[0.08] bg-[#0B0C0E] p-4 lg:col-span-5">
          {/* Retícula de latitud/longitud */}
          <svg
            viewBox="0 0 100 100"
            className="h-full w-full opacity-85"
            aria-label="Mapa de localizaciones fotográficas entre Europa y el Norte de África"
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

            {/* Trazos esquemáticos de costas (Península Ibérica, Centroeuropa, Norte de África y Canarias) */}
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
            {TERRITORIES.map((t) => {
              const isSelected = t.id === activeId;
              return (
                <g
                  key={t.id}
                  onClick={() => setActiveId(t.id)}
                  className="cursor-pointer"
                >
                  {isSelected && (
                    <circle
                      cx={t.svgX}
                      cy={t.svgY}
                      r="5.5"
                      fill="none"
                      stroke="#EBE7DF"
                      strokeWidth="0.6"
                      opacity="0.7"
                    />
                  )}
                  <circle
                    cx={t.svgX}
                    cy={t.svgY}
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

          <div className="grid grid-cols-3 gap-3 sm:gap-4">
            {current.samples.map((s) => (
              <Link
                key={s.image}
                href={s.href}
                className="group relative aspect-[3/2] overflow-hidden border border-white/[0.08] bg-[#0B0C0E]"
              >
                <Image
                  src={s.image}
                  alt={s.title}
                  fill
                  sizes="220px"
                  className="object-cover transition duration-500 group-hover:scale-105 brightness-[0.92] group-hover:brightness-100"
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
              <span>Ver Proyecto de este Territorio</span>
              <span>→</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
