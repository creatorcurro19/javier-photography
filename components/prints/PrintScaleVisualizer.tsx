"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/lib/i18n";
import { AndalusianStarMark } from "@/components/ui/AndalusianMotif";
import AddToCartModal from "@/components/cart/AddToCartModal";
import type { Photo } from "@/types/photo";

// Formatos normalizados de escala museística
const FORMATS = [
  {
    id: "estudio",
    label: "Formato Estudio (A3+)",
    dims: "33 × 48 cm",
    outerDims: "43 × 58 cm (con marco y paspartú)",
    widthPctSingle: 25,
    widthPctDiptych: 22,
    edition: "Serie numerada de 50 ejemplares",
    descEs: "Ideal para despachos, estudios, librerías y composiciones en pareja.",
    descEn: "Ideal for studies, libraries, desks and paired diptych compositions.",
  },
  {
    id: "galeria",
    label: "Formato Galería",
    dims: "50 × 70 cm",
    outerDims: "62 × 82 cm (con marco y paspartú)",
    widthPctSingle: 38,
    widthPctDiptych: 33,
    edition: "Serie numerada de 25 ejemplares",
    descEs: "Proporción equilibrada de galería para salones y paredes principales.",
    descEn: "Balanced gallery proportion for living rooms and main feature walls.",
  },
  {
    id: "coleccion",
    label: "Gran Colección",
    dims: "70 × 100 cm",
    outerDims: "84 × 114 cm (con marco y paspartú)",
    widthPctSingle: 52,
    widthPctDiptych: 44,
    edition: "Serie exclusiva de 10 ejemplares",
    descEs: "Pieza central monumental de gran formato con máxima presencia arquitectónica.",
    descEn: "Monumental large-format centerpiece with maximum architectural presence.",
  },
] as const;

// Obras representativas del archivo fotográfico de Javier Espinosa
const SAMPLE_WORKS = [
  {
    id: "dunas-atardecer",
    title: "Horizonte de Dunas al Atardecer",
    image: "/images/portfolio/viajes-cultura/horizonte-de-dunas-al-atardecer.jpg",
    category: "viajes-cultura" as const,
    location: "Desierto del Sahara · Marruecos",
    year: 2024,
    focalLength: "70mm",
    camera: "Canon EOS R7",
  },
  {
    id: "ocaso-erg",
    title: "Ocaso sobre el Erg",
    image: "/images/portfolio/viajes-cultura/ocaso-sobre-el-erg.jpg",
    category: "viajes-cultura" as const,
    location: "Erg Chebbi · Marruecos",
    year: 2024,
    focalLength: "200mm",
    camera: "Canon EOS R7",
  },
  {
    id: "lince-boreal",
    title: "Mirada del Lince Boreal",
    image: "/images/portfolio/fauna-naturaleza/mirada-del-lince-boreal.jpg",
    category: "fauna-naturaleza" as const,
    location: "Taiga Boreal · España",
    year: 2023,
    focalLength: "400mm",
    camera: "Canon EOS R7",
  },
  {
    id: "paso-lobo",
    title: "El Paso del Lobo",
    image: "/images/portfolio/fauna-naturaleza/el-paso-del-lobo.jpg",
    category: "fauna-naturaleza" as const,
    location: "Cordillera Cantábrica",
    year: 2023,
    focalLength: "300mm",
    camera: "Canon EOS R7",
  },
  {
    id: "cumbre-nevada",
    title: "Cumbre Nevada al Alba",
    image: "/images/portfolio/paisajes-documental/cumbre-nevada-al-alba.jpg",
    category: "paisajes-documental" as const,
    location: "Macizo Central · Alta Montaña",
    year: 2024,
    focalLength: "24mm",
    camera: "Canon EOS R7",
  },
  {
    id: "cruzada-rally",
    title: "Cruzada sobre el Asfalto",
    image: "/images/portfolio/coches-rally/cruzada-sobre-el-asfalto.jpg",
    category: "coches-rally" as const,
    location: "Rally Histórico de España",
    year: 2023,
    focalLength: "135mm",
    camera: "Canon EOS R7",
  },
  {
    id: "soldador-chispa",
    title: "El Oficio y la Chispa",
    image: "/images/portfolio/viajes-cultura/el-oficio-y-la-chispa.jpg",
    category: "viajes-cultura" as const,
    location: "Herrería Tradicional · Memoria Rural",
    year: 2023,
    focalLength: "50mm",
    camera: "Canon EOS R7",
  },
  {
    id: "arquitectura-vera",
    title: "Campanario y Nieve",
    image: "/images/portfolio/arquitectura-urbana/columnata-de-la-madrasa.jpg",
    category: "arquitectura-urbana" as const,
    location: "Villanueva de la Vera",
    year: 2024,
    focalLength: "85mm",
    camera: "Canon EOS R7",
  },
];

// Acabados de enmarcado museístico
const FINISHES = [
  {
    id: "black",
    label: "Marco Negro Galería",
    tag: "Negro Mate + Cristal UV 99%",
    note: "Madera maciza lacada en negro mate, paspartú algodón 5 cm y cristal antirreflejos UV 99%.",
  },
  {
    id: "oak",
    label: "Marco Roble Natural",
    tag: "Roble Macizo + Cristal UV 99%",
    note: "Madera maciza de roble europeo claro, paspartú algodón 5 cm y cristal antirreflejos UV 99%.",
  },
  {
    id: "walnut",
    label: "Marco Nogal Tostado",
    tag: "Nogal Escandinavo + Cristal UV 99%",
    note: "Madera de nogal cálido con veta noble, paspartú algodón 5 cm y cristal antirreflejos UV 99%.",
  },
  {
    id: "unframed",
    label: "Lámina Suelta en Tubo",
    tag: "Papel Hahnemühle 308g",
    note: "Copia sobre Hahnemühle Photo Rag 308g con 5 cm de margen perimetral, firmada y certificada.",
  },
] as const;

// Estilos de Sofá solicitados por el usuario
export type SofaStyleId = "nordic" | "leather" | "boucle" | "velvet";

interface SofaStyleConfig {
  id: SofaStyleId;
  labelEs: string;
  labelEn: string;
  descEs: string;
  descEn: string;
  icon: string;
}

const SOFA_STYLES: SofaStyleConfig[] = [
  {
    id: "nordic",
    labelEs: "Lino Nórdico",
    labelEn: "Nordic Linen",
    descEs: "Líneas rectas contemporáneas, doble cojín acolchado y patas de madera clara.",
    descEn: "Clean contemporary lines, dual tailored cushions and light oak legs.",
    icon: "🛋️",
  },
  {
    id: "leather",
    labelEs: "Cuero Vintage",
    labelEn: "Vintage Leather",
    descEs: "Cuero envejecido con pátina natural, apoyabrazos redondeados y patas en nogal.",
    descEn: "Aged Italian leather with natural patina, rolled arms and turned walnut feet.",
    icon: "👞",
  },
  {
    id: "boucle",
    labelEs: "Bouclé Curvo",
    labelEn: "Curved Bouclé",
    descEs: "Silueta orgánica escultórica, asiento continuo de bouclé y base suspendida.",
    descEn: "Sculptural organic silhouette, continuous textured bouclé bench and floating base.",
    icon: "☁️",
  },
  {
    id: "velvet",
    labelEs: "Terciopelo Museo",
    labelEn: "Museum Velvet",
    descEs: "Corte parisino de alta costura, cojines de rulo cilíndricos y patas en latón dorado.",
    descEn: "Tailored Parisian silhouette, cylindrical bolster pillows and slender brass stiletto legs.",
    icon: "✨",
  },
];

// Colores de Tapicería de alta gama solicitados por el usuario
export type SofaColorId =
  | "sand"
  | "cognac"
  | "charcoal"
  | "olive"
  | "navy"
  | "terracotta";

interface SofaColorConfig {
  id: SofaColorId;
  nameEs: string;
  nameEn: string;
  subEs: string;
  subEn: string;
  hexPrimary: string;
  hexSecondary: string;
  hexBorder: string;
  pillowColor1: string;
  pillowColor2: string;
  legsColor: string;
}

const SOFA_COLORS: SofaColorConfig[] = [
  {
    id: "sand",
    nameEs: "Lino Arena",
    nameEn: "Sand Linen",
    subEs: "Blanco roto cálido y fibra vegetal",
    subEn: "Warm off-white & natural weave",
    hexPrimary: "#DDD5C7",
    hexSecondary: "#C9C0B0",
    hexBorder: "rgba(180, 168, 150, 0.45)",
    pillowColor1: "#B48B5D", // Cognac accent
    pillowColor2: "#6B7A6A", // Sage accent
    legsColor: "#A68969", // Light oak
  },
  {
    id: "cognac",
    nameEs: "Cuero Coñac",
    nameEn: "Cognac Leather",
    subEs: "Caramelo tostado y carácter noble",
    subEn: "Toasted caramel & rich character",
    hexPrimary: "#9A5726",
    hexSecondary: "#7A3F15",
    hexBorder: "rgba(130, 65, 20, 0.5)",
    pillowColor1: "#D5CCBC", // Ivory linen
    pillowColor2: "#2A2F35", // Slate accent
    legsColor: "#3F2617", // Dark walnut
  },
  {
    id: "charcoal",
    nameEs: "Gris Carbón",
    nameEn: "Charcoal Slate",
    subEs: "Antracita profundo arquitectónico",
    subEn: "Deep architectural anthracite",
    hexPrimary: "#2A2C32",
    hexSecondary: "#1E2024",
    hexBorder: "rgba(255, 255, 255, 0.12)",
    pillowColor1: "#C5A880", // Gold accent
    pillowColor2: "#E5E1D8", // Crisp ivory
    legsColor: "#111215", // Matte black steel
  },
  {
    id: "olive",
    nameEs: "Verde Oliva",
    nameEn: "Olive Sage",
    subEs: "Bosque templado y calma botánica",
    subEn: "Deep temperate forest & botanical calm",
    hexPrimary: "#3F4F3E",
    hexSecondary: "#2E3A2E",
    hexBorder: "rgba(90, 115, 90, 0.4)",
    pillowColor1: "#D5CAAF", // Warm linen
    pillowColor2: "#9C5726", // Warm cognac
    legsColor: "#2A2016", // Dark oak
  },
  {
    id: "navy",
    nameEs: "Azul Petróleo",
    nameEn: "Midnight Navy",
    subEs: "Noche atlántica y contraste sublime",
    subEn: "Deep Atlantic night & rich contrast",
    hexPrimary: "#1D2B3A",
    hexSecondary: "#141E28",
    hexBorder: "rgba(50, 75, 105, 0.45)",
    pillowColor1: "#C5A880", // Gold velvet
    pillowColor2: "#E0D8CB", // Sand linen
    legsColor: "#C5A880", // Brass
  },
  {
    id: "terracotta",
    nameEs: "Terracota",
    nameEn: "Terracotta",
    subEs: "Teja andalusí y calidez mediterránea",
    subEn: "Andalusian clay & Mediterranean warmth",
    hexPrimary: "#9E4E38",
    hexSecondary: "#7A3825",
    hexBorder: "rgba(160, 75, 55, 0.45)",
    pillowColor1: "#EADCCB", // Natural cream
    pillowColor2: "#3D4E41", // Olive accent
    legsColor: "#3A2417", // Walnut
  },
];

// Ambientes de Pared de Exposición
const WALL_COLORS = [
  {
    id: "dark",
    labelEs: "Galería Carbón",
    labelEn: "Charcoal Gallery",
    bgClass: "bg-gradient-to-b from-[#1E2125] via-[#16181B] to-[#111215]",
    floorClass: "bg-gradient-to-b from-[#1C1815] to-[#120F0D]",
    borderClass: "border-[#2A2E33]",
    dotHex: "#1E2125",
  },
  {
    id: "ivory",
    labelEs: "Blanco Museo",
    labelEn: "Museum White",
    bgClass: "bg-gradient-to-b from-[#F5F2EC] via-[#EBE6DD] to-[#DDD7CC]",
    floorClass: "bg-gradient-to-b from-[#B09E8B] to-[#8C7A68]",
    borderClass: "border-[#D6CEC1]",
    dotHex: "#F5F2EC",
  },
  {
    id: "greige",
    labelEs: "Piedra Caliza",
    labelEn: "Limestone Greige",
    bgClass: "bg-gradient-to-b from-[#D8D0C3] via-[#CBC1B2] to-[#B7ABA0]",
    floorClass: "bg-gradient-to-b from-[#8E7E70] to-[#6E5F52]",
    borderClass: "border-[#B5A898]",
    dotHex: "#D8D0C3",
  },
  {
    id: "sage",
    labelEs: "Verde Salvia",
    labelEn: "Sage Architectural",
    bgClass: "bg-gradient-to-b from-[#2B352E] via-[#212A24] to-[#171E19]",
    floorClass: "bg-gradient-to-b from-[#1A1F1B] to-[#111512]",
    borderClass: "border-[#3A473E]",
    dotHex: "#2B352E",
  },
] as const;

export default function PrintScaleVisualizer() {
  const { lang, t } = useLanguage();
  const [selectedFormat, setSelectedFormat] = useState<(typeof FORMATS)[number]>(FORMATS[1]);
  const [frameType, setFrameType] = useState<(typeof FINISHES)[number]["id"]>("black");
  const [wallColor, setWallColor] = useState<(typeof WALL_COLORS)[number]["id"]>("dark");
  const [layoutMode, setLayoutMode] = useState<"single" | "diptych">("single");
  const [sampleIdxA, setSampleIdxA] = useState(0);
  const [sampleIdxB, setSampleIdxB] = useState(1);

  // Estados interactivos para Sofá (estilo y color)
  const [sofaStyle, setSofaStyle] = useState<SofaStyleId>("nordic");
  const [sofaColor, setSofaColor] = useState<SofaColorId>("sand");
  const [modalOpen, setModalOpen] = useState(false);

  const workA = SAMPLE_WORKS[sampleIdxA];
  const workB = SAMPLE_WORKS[sampleIdxB];
  const currentFinish = FINISHES.find((f) => f.id === frameType) ?? FINISHES[0];
  const currentWall = WALL_COLORS.find((w) => w.id === wallColor) ?? WALL_COLORS[0];
  const currentSofaStyle = SOFA_STYLES.find((s) => s.id === sofaStyle) ?? SOFA_STYLES[0];
  const currentSofaColor = SOFA_COLORS.find((c) => c.id === sofaColor) ?? SOFA_COLORS[0];

  const orderReference =
    layoutMode === "diptych"
      ? `Díptico: ${workA.title} + ${workB.title}`
      : workA.title;

  const orderFormat = `${selectedFormat.label} (${selectedFormat.dims}) · ${currentFinish.label} · Ambiente: ${currentSofaStyle.labelEs} ${currentSofaColor.nameEs}`;

  // Objeto Photo compatible con AddToCartModal
  const photoForModal: Photo = {
    id: workA.id,
    title: workA.title,
    slug: workA.id,
    image: workA.image,
    category: workA.category,
    camera: workA.camera,
    focalLength: workA.focalLength,
    aperture: "f/5.6",
    shutter: "1/500s",
    iso: 100,
    lens: "Canon RF",
    year: workA.year,
    location: workA.location,
    prints: true,
    featured: true,
    alt: workA.title,
    width: 2400,
    height: 1600,
    description: `Fotografía de autor por Javier Espinosa Martínez. ${workA.location} (${workA.year}). Copia Fine Art certificada sobre papel de algodón 100% Hahnemühle Photo Rag 308g.`,
    keywords: ["fine art", workA.category, "coleccionismo", "hahnemuhle"],
  };

  return (
    <section className="mt-24 rounded-2xl border border-[#C5A880]/20 bg-[#121316]/60 p-5 sm:p-8 lg:p-10 backdrop-blur-md">
      {/* Cabecera del Configurador */}
      <div className="flex flex-col justify-between gap-6 border-b border-[#C5A880]/15 pb-6 lg:flex-row lg:items-end">
        <div>
          <div className="flex items-center gap-2">
            <AndalusianStarMark className="h-3 w-3 text-[#C5A880]" />
            <p className="font-mono text-xs uppercase tracking-[0.35em] text-[#C5A880]">
              {t("Visualizador de Escala & Espacio Interior", "Scale Visualizer & Interior Space")}
            </p>
          </div>
          <h2 className="mt-2 font-serif text-2xl sm:text-3xl font-light text-[#EBE7DF]">
            {t(
              "Simulador en Salón de Coleccionista (Referencia: Sofá de 200 cm)",
              "Collector Living Room Simulator (200 cm Sofa Reference)"
            )}
          </h2>
          <p className="mt-1 text-xs text-[#8E8A80] font-light max-w-2xl">
            {t(
              "Comprueba el impacto visual y las proporciones físicas exactas de cada obra sobre distintos estilos y colores de sofá antes de adquirir tu copia Fine Art.",
              "Verify the visual impact and exact physical proportions of each artwork over various sofa styles and colors before acquiring your Fine Art print."
            )}
          </p>
        </div>

        {/* Selector de Composición (Individual vs Díptico) y Tamaño */}
        <div className="flex flex-wrap items-center gap-2 text-[11px] uppercase tracking-wider shrink-0">
          <div className="inline-flex rounded-full border border-white/[0.08] bg-[#0B0C0E] p-1">
            <button
              type="button"
              onClick={() => setLayoutMode("single")}
              className={`rounded-full px-3.5 py-1.5 transition ${
                layoutMode === "single"
                  ? "bg-[#C5A880] text-[#0B0C0E] font-medium"
                  : "text-[#EBE7DF]/70 hover:text-white"
              }`}
            >
              {t("Obra Individual", "Single Artwork")}
            </button>
            <button
              type="button"
              onClick={() => setLayoutMode("diptych")}
              className={`rounded-full px-3.5 py-1.5 transition ${
                layoutMode === "diptych"
                  ? "bg-[#C5A880] text-[#0B0C0E] font-medium"
                  : "text-[#EBE7DF]/70 hover:text-white"
              }`}
            >
              {t("Díptico (2 Obras)", "Diptych (2 Works)")}
            </button>
          </div>

          <div className="hidden sm:block h-5 w-px bg-white/15 mx-1" />

          {/* Formatos */}
          <div className="inline-flex flex-wrap gap-1.5">
            {FORMATS.map((fmt) => (
              <button
                key={fmt.id}
                type="button"
                onClick={() => setSelectedFormat(fmt)}
                className={`rounded-full px-3 py-1.5 font-mono text-[11px] transition ${
                  selectedFormat.id === fmt.id
                    ? "bg-[#EBE7DF] text-[#0B0C0E] font-semibold ring-2 ring-[#C5A880]"
                    : "border border-white/[0.08] bg-[#0B0C0E] text-[#EBE7DF]/70 hover:border-[#C5A880]/50 hover:text-white"
                }`}
              >
                {fmt.dims}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Selector de Estilos y Colores de Sofá (Petición Específica del Usuario) */}
      <div className="mt-6 rounded-xl border border-white/[0.08] bg-[#0E1012] p-4 sm:p-5">
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          {/* 1. Selector de Estilo de Sofá */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#C5A880]">
                {t("1. Estilo de Sofá de Referencia:", "1. Reference Sofa Style:")}
              </span>
              <span className="text-[11px] text-[#EBE7DF] font-medium">
                {lang === "en" ? currentSofaStyle.labelEn : currentSofaStyle.labelEs}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {SOFA_STYLES.map((style) => (
                <button
                  key={style.id}
                  type="button"
                  onClick={() => setSofaStyle(style.id)}
                  className={`flex flex-col items-start rounded-lg border p-2.5 text-left transition ${
                    sofaStyle === style.id
                      ? "border-[#C5A880] bg-[#C5A880]/15 ring-1 ring-[#C5A880]"
                      : "border-white/[0.06] bg-[#15171A] hover:border-white/20 text-[#8E8A80] hover:text-[#EBE7DF]"
                  }`}
                >
                  <div className="flex items-center gap-1.5 text-xs font-medium text-[#EBE7DF]">
                    <span>{style.icon}</span>
                    <span className="truncate">
                      {lang === "en" ? style.labelEn : style.labelEs}
                    </span>
                  </div>
                  <span className="mt-1 font-mono text-[9px] text-[#8E8A80] line-clamp-1">
                    {style.id === "nordic"
                      ? t("Roble claro", "Light oak")
                      : style.id === "leather"
                      ? t("Cuero añejo", "Aged patina")
                      : style.id === "boucle"
                      ? t("Escultórico", "Sculptural")
                      : t("Latón dorado", "Brass stiletto")}
                  </span>
                </button>
              ))}
            </div>
            <p className="mt-2 text-[10px] text-[#8E8A80] font-light">
              {lang === "en" ? currentSofaStyle.descEn : currentSofaStyle.descEs}
            </p>
          </div>

          {/* 2. Selector de Color de Tapicería */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#C5A880]">
                {t("2. Color de Tapicería:", "2. Upholstery Color:")}
              </span>
              <span className="text-[11px] text-[#EBE7DF] font-medium">
                {lang === "en" ? currentSofaColor.nameEn : currentSofaColor.nameEs}
              </span>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {SOFA_COLORS.map((col) => (
                <button
                  key={col.id}
                  type="button"
                  onClick={() => setSofaColor(col.id)}
                  title={lang === "en" ? `${col.nameEn} — ${col.subEn}` : `${col.nameEs} — ${col.subEs}`}
                  className={`group flex flex-col items-center justify-center rounded-lg border p-2 transition ${
                    sofaColor === col.id
                      ? "border-[#C5A880] bg-[#C5A880]/15 ring-2 ring-[#C5A880]"
                      : "border-white/[0.06] bg-[#15171A] hover:border-white/20"
                  }`}
                >
                  <div
                    className="h-5 w-5 rounded-full border border-black/40 shadow-sm transition-transform duration-200 group-hover:scale-110"
                    style={{ backgroundColor: col.hexPrimary }}
                  />
                  <span className="mt-1 font-sans text-[10px] text-[#EBE7DF] truncate w-full text-center">
                    {lang === "en" ? col.nameEn.split(" ")[0] : col.nameEs.split(" ")[0]}
                  </span>
                </button>
              ))}
            </div>
            <p className="mt-2 text-[10px] text-[#8E8A80] font-light">
              {lang === "en" ? currentSofaColor.subEn : currentSofaColor.subEs}
            </p>
          </div>
        </div>
      </div>

      {/* Controles de Selección de Fotografías */}
      <div className="mt-5 flex flex-col gap-3 rounded-lg border border-white/[0.06] bg-[#0E1012] p-4 text-xs">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center justify-between">
          <span className="font-mono text-[10px] uppercase tracking-wider text-[#C5A880]">
            {layoutMode === "diptych"
              ? t("Fotografía Izquierda:", "Left Artwork:")
              : t("Fotografía Expuesta:", "Featured Artwork:")}
          </span>
          <div className="flex flex-wrap gap-1.5">
            {SAMPLE_WORKS.map((w, idx) => (
              <button
                key={w.id}
                type="button"
                onClick={() => setSampleIdxA(idx)}
                className={`rounded px-2.5 py-1 text-[11px] transition ${
                  sampleIdxA === idx
                    ? "bg-[#C5A880] text-[#0B0C0E] font-semibold"
                    : "bg-[#15171A] text-[#8E8A80] hover:text-[#EBE7DF]"
                }`}
              >
                {w.title}
              </button>
            ))}
          </div>
        </div>

        {layoutMode === "diptych" && (
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center justify-between border-t border-white/[0.04] pt-2.5">
            <span className="font-mono text-[10px] uppercase tracking-wider text-[#C5A880]">
              {t("Fotografía Derecha (Díptico):", "Right Artwork (Diptych):")}
            </span>
            <div className="flex flex-wrap gap-1.5">
              {SAMPLE_WORKS.map((w, idx) => (
                <button
                  key={`b-${w.id}`}
                  type="button"
                  onClick={() => setSampleIdxB(idx)}
                  className={`rounded px-2.5 py-1 text-[11px] transition ${
                    sampleIdxB === idx
                      ? "bg-[#C5A880] text-[#0B0C0E] font-semibold"
                      : "bg-[#15171A] text-[#8E8A80] hover:text-[#EBE7DF]"
                  }`}
                >
                  {w.title}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Acabado de Marco & Ambiente de Pared */}
      <div className="mt-4 flex flex-col gap-3 rounded-lg border border-white/[0.06] bg-[#0E1012] p-4 text-xs lg:flex-row lg:items-center lg:justify-between">
        {/* Acabado de Marco */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-mono text-[10px] uppercase tracking-wider text-[#C5A880]">
            {t("Enmarcado:", "Framing:")}
          </span>
          {FINISHES.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setFrameType(f.id)}
              className={`rounded px-2.5 py-1 text-[11px] transition ${
                frameType === f.id
                  ? "border border-[#C5A880] bg-[#C5A880]/20 text-[#EBE7DF] font-medium"
                  : "bg-[#15171A] text-[#8E8A80] hover:text-[#EBE7DF]"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Ambiente de Pared */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-mono text-[10px] uppercase tracking-wider text-[#C5A880]">
            {t("Pared de Fondo:", "Wall Tone:")}
          </span>
          {WALL_COLORS.map((w) => (
            <button
              key={w.id}
              type="button"
              onClick={() => setWallColor(w.id)}
              className={`inline-flex items-center gap-1.5 rounded px-2.5 py-1 text-[11px] transition ${
                wallColor === w.id
                  ? "border border-[#C5A880] bg-[#C5A880]/20 text-[#EBE7DF] font-medium"
                  : "bg-[#15171A] text-[#8E8A80] hover:text-[#EBE7DF]"
              }`}
            >
              <span
                className="h-2.5 w-2.5 rounded-full border border-black/30"
                style={{ backgroundColor: w.dotHex }}
              />
              <span>{lang === "en" ? w.labelEn : w.labelEs}</span>
            </button>
          ))}
        </div>
      </div>

      {/* =========================================================================
          ESCENARIO INTERIOR ARQUITECTÓNICO A ESCALA
          Proporción: Pared de 360 cm, Sofá central de 200 cm, Obras escaladas
          ========================================================================= */}
      <div
        className={`relative mt-8 flex min-h-[440px] sm:min-h-[520px] flex-col items-center justify-between overflow-hidden rounded-xl border border-white/[0.08] pt-12 pb-0 transition-colors duration-500 shadow-2xl ${currentWall.bgClass}`}
      >
        {/* Iluminación cenital de carril de galería con dos haces cónicos sobre las obras */}
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white/12 via-white/[0.02] to-transparent"
          aria-hidden="true"
        />

        {/* Zona Superior: Las Fotografías con Marco Museístico a Escala Real */}
        <div className="relative z-10 flex flex-1 items-center justify-center gap-4 sm:gap-8 w-full px-4 pt-4 pb-8">
          {[workA, ...(layoutMode === "diptych" ? [workB] : [])].map((work, idx) => {
            const widthPct =
              layoutMode === "diptych"
                ? selectedFormat.widthPctDiptych
                : selectedFormat.widthPctSingle;

            return (
              <div
                key={`${work.id}-${idx}`}
                style={{ width: `${widthPct}%` }}
                className={`relative transition-all duration-500 select-none ${
                  frameType === "black"
                    ? "border-[6px] sm:border-[10px] border-[#121314] bg-[#F7F4EE] p-2.5 sm:p-4 shadow-[0_22px_45px_rgba(0,0,0,0.7)] ring-1 ring-white/10"
                    : frameType === "oak"
                    ? "border-[6px] sm:border-[10px] border-[#8A6343] bg-[#F7F4EE] p-2.5 sm:p-4 shadow-[0_22px_45px_rgba(0,0,0,0.7)] ring-1 ring-[#6B4B30]/30"
                    : frameType === "walnut"
                    ? "border-[6px] sm:border-[10px] border-[#4A3223] bg-[#F7F4EE] p-2.5 sm:p-4 shadow-[0_22px_45px_rgba(0,0,0,0.7)] ring-1 ring-[#362217]/40"
                    : "bg-[#FAF7F0] p-2 sm:p-3 shadow-[0_15px_35px_rgba(0,0,0,0.55)] border border-neutral-300/40"
                }`}
              >
                {/* Imagen fotográfica */}
                <div className="relative aspect-[3/2] w-full overflow-hidden bg-neutral-900 shadow-inner">
                  <Image
                    src={work.image}
                    alt={work.title}
                    fill
                    sizes="(max-width: 768px) 50vw, 35vw"
                    className="object-cover"
                  />

                  {/* Reflejo óptico sutil de cristal museo */}
                  {frameType !== "unframed" && (
                    <div
                      className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.04] to-white/[0.08]"
                      aria-hidden="true"
                    />
                  )}
                </div>

                {/* Pie de obra en lámina de autor sin marco */}
                {frameType === "unframed" && (
                  <div className="mt-1 flex items-center justify-between text-[7px] text-[#202226] font-mono px-1">
                    <span>1/50</span>
                    <span className="italic">Javier Espinosa</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Zona Inferior: El Sofá Arquitectónico y el Suelo */}
        <div className="relative z-10 w-full flex flex-col items-center">
          {/* El Sofá de 200 cm renderizado con el estilo y color seleccionados */}
          <div className="relative w-full max-w-lg px-4 sm:px-0">
            {/* Renderizado gráfico detallado según el estilo */}
            {sofaStyle === "nordic" && (
              /* Estilo 1: Lino Nórdico Contemporáneo */
              <div className="relative mx-auto w-[92%] sm:w-[94%]">
                {/* Cojines del Respaldo */}
                <div className="flex h-12 sm:h-14 w-full gap-1.5 px-3">
                  <div
                    className="flex-1 rounded-t-xl border shadow-sm transition-colors duration-300"
                    style={{
                      backgroundColor: currentSofaColor.hexPrimary,
                      borderColor: currentSofaColor.hexBorder,
                    }}
                  />
                  <div
                    className="flex-1 rounded-t-xl border shadow-sm transition-colors duration-300"
                    style={{
                      backgroundColor: currentSofaColor.hexPrimary,
                      borderColor: currentSofaColor.hexBorder,
                    }}
                  />
                </div>

                {/* Asiento con Apoyabrazos y Cojines */}
                <div
                  className="relative -mt-1 flex h-10 sm:h-12 w-full items-center justify-between rounded-md border shadow-lg transition-colors duration-300"
                  style={{
                    backgroundColor: currentSofaColor.hexSecondary,
                    borderColor: currentSofaColor.hexBorder,
                  }}
                >
                  {/* Apoyabrazos Izquierdo */}
                  <div
                    className="h-full w-5 sm:w-6 rounded-l-md border-r shadow-inner"
                    style={{
                      backgroundColor: currentSofaColor.hexPrimary,
                      borderColor: currentSofaColor.hexBorder,
                    }}
                  />

                  {/* Cojines Decorativos de Acento */}
                  <div className="flex flex-1 items-center justify-between px-2">
                    <div
                      className="h-6 w-6 -rotate-12 rounded border border-black/20 shadow-sm"
                      style={{ backgroundColor: currentSofaColor.pillowColor1 }}
                    />
                    <div className="h-0.5 flex-1 border-t border-black/10 mx-2" />
                    <div
                      className="h-6 w-6 rotate-12 rounded border border-black/20 shadow-sm"
                      style={{ backgroundColor: currentSofaColor.pillowColor2 }}
                    />
                  </div>

                  {/* Apoyabrazos Derecho */}
                  <div
                    className="h-full w-5 sm:w-6 rounded-r-md border-l shadow-inner"
                    style={{
                      backgroundColor: currentSofaColor.hexPrimary,
                      borderColor: currentSofaColor.hexBorder,
                    }}
                  />
                </div>

                {/* Patas Cónicas de Madera */}
                <div className="flex justify-between px-5 pt-0.5">
                  <div
                    className="h-3 w-1.5 rotate-6 rounded-b shadow"
                    style={{ backgroundColor: currentSofaColor.legsColor }}
                  />
                  <div
                    className="h-3 w-1.5 -rotate-6 rounded-b shadow"
                    style={{ backgroundColor: currentSofaColor.legsColor }}
                  />
                </div>
              </div>
            )}

            {sofaStyle === "leather" && (
              /* Estilo 2: Cuero Vintage Italiano */
              <div className="relative mx-auto w-[94%] sm:w-[96%]">
                {/* Respaldo Acolchado con capitoné sutil */}
                <div
                  className="relative mx-auto flex h-14 sm:h-16 w-full items-center justify-around rounded-t-2xl border px-5 shadow-inner transition-colors duration-300"
                  style={{
                    backgroundColor: currentSofaColor.hexSecondary,
                    borderColor: currentSofaColor.hexBorder,
                  }}
                >
                  <div className="h-1.5 w-1.5 rounded-full bg-black/40" />
                  <div className="h-1.5 w-1.5 rounded-full bg-black/40" />
                  <div className="h-1.5 w-1.5 rounded-full bg-black/40" />
                  <div className="h-1.5 w-1.5 rounded-full bg-black/40" />
                  <div className="h-1.5 w-1.5 rounded-full bg-black/40" />
                </div>

                {/* Asiento con Brazos Redondeados estilo Chesterfield */}
                <div
                  className="relative -mt-2 flex h-11 sm:h-13 w-full items-center justify-between rounded-xl border shadow-xl transition-colors duration-300"
                  style={{
                    backgroundColor: currentSofaColor.hexPrimary,
                    borderColor: currentSofaColor.hexBorder,
                  }}
                >
                  {/* Apoyabrazos Enrollado Izquierdo */}
                  <div
                    className="h-full w-7 sm:w-8 rounded-l-xl border-r shadow-md"
                    style={{
                      backgroundColor: currentSofaColor.hexSecondary,
                      borderColor: currentSofaColor.hexBorder,
                    }}
                  />

                  {/* Cojines de Cuero con costura central */}
                  <div className="flex flex-1 items-center justify-center gap-1 px-1">
                    <div className="h-8 flex-1 rounded border border-black/15 bg-white/[0.04] shadow-inner" />
                    <div className="h-8 flex-1 rounded border border-black/15 bg-white/[0.04] shadow-inner" />
                  </div>

                  {/* Apoyabrazos Enrollado Derecho */}
                  <div
                    className="h-full w-7 sm:w-8 rounded-r-xl border-l shadow-md"
                    style={{
                      backgroundColor: currentSofaColor.hexSecondary,
                      borderColor: currentSofaColor.hexBorder,
                    }}
                  />
                </div>

                {/* Patas Torneadas de Madera Noble */}
                <div className="flex justify-between px-6 pt-0.5">
                  <div
                    className="h-3 w-2.5 rounded-b-md shadow"
                    style={{ backgroundColor: currentSofaColor.legsColor }}
                  />
                  <div
                    className="h-3 w-2.5 rounded-b-md shadow"
                    style={{ backgroundColor: currentSofaColor.legsColor }}
                  />
                </div>
              </div>
            )}

            {sofaStyle === "boucle" && (
              /* Estilo 3: Bouclé Curvo Escultural */
              <div className="relative mx-auto w-[92%] sm:w-[94%]">
                {/* Respaldo Curvilíneo Continuo */}
                <div
                  className="relative mx-auto h-13 sm:h-15 w-full rounded-t-[2.5rem] border px-6 shadow-md transition-colors duration-300"
                  style={{
                    backgroundColor: currentSofaColor.hexPrimary,
                    borderColor: currentSofaColor.hexBorder,
                  }}
                >
                  {/* Brillo de curvatura superior */}
                  <div className="mx-auto h-2 w-3/4 rounded-full bg-white/10 mt-1" />
                </div>

                {/* Asiento Orgánico Continuo */}
                <div
                  className="relative -mt-3 flex h-11 sm:h-13 w-full items-center justify-between rounded-2xl border shadow-xl transition-colors duration-300 px-4"
                  style={{
                    backgroundColor: currentSofaColor.hexSecondary,
                    borderColor: currentSofaColor.hexBorder,
                  }}
                >
                  {/* Cojín orgánico tipo Pebble */}
                  <div
                    className="h-6 w-7 rounded-full border border-black/20 shadow-sm"
                    style={{ backgroundColor: currentSofaColor.pillowColor1 }}
                  />
                  <div className="h-1 w-1/3 rounded-full bg-black/10" />
                  <div
                    className="h-6 w-6 rounded-full border border-black/20 shadow-sm"
                    style={{ backgroundColor: currentSofaColor.pillowColor2 }}
                  />
                </div>

                {/* Zócalo Flotante Empotrado */}
                <div className="mx-auto h-2 w-4/5 rounded-b-md bg-black/60 shadow-md" />
              </div>
            )}

            {sofaStyle === "velvet" && (
              /* Estilo 4: Terciopelo Museo de Alta Costura */
              <div className="relative mx-auto w-[90%] sm:w-[92%]">
                {/* Respaldo Tuxedo Recto */}
                <div
                  className="relative mx-auto h-12 sm:h-14 w-full rounded-t-md border px-4 shadow-sm transition-colors duration-300"
                  style={{
                    backgroundColor: currentSofaColor.hexPrimary,
                    borderColor: currentSofaColor.hexBorder,
                  }}
                />

                {/* Asiento con Cojines Cilíndricos de Rulo */}
                <div
                  className="relative -mt-1 flex h-10 sm:h-12 w-full items-center justify-between rounded-md border shadow-lg transition-colors duration-300"
                  style={{
                    backgroundColor: currentSofaColor.hexSecondary,
                    borderColor: currentSofaColor.hexBorder,
                  }}
                >
                  {/* Cojín de Rulo Izquierdo */}
                  <div
                    className="h-7 w-3.5 rounded-full border shadow-inner ml-2"
                    style={{ backgroundColor: currentSofaColor.pillowColor1 }}
                  />

                  {/* Asiento central corrido */}
                  <div className="flex-1 border-t border-black/15 mx-2" />

                  {/* Cojín de Rulo Derecho */}
                  <div
                    className="h-7 w-3.5 rounded-full border shadow-inner mr-2"
                    style={{ backgroundColor: currentSofaColor.pillowColor1 }}
                  />
                </div>

                {/* Patas Finas de Latón Bruñido */}
                <div className="flex justify-between px-4 pt-0.5">
                  <div className="h-3.5 w-1 rotate-3 bg-[#C5A880] shadow" />
                  <div className="h-3.5 w-1 -rotate-3 bg-[#C5A880] shadow" />
                </div>
              </div>
            )}

            {/* Sombra de Oclusión Ambiental en el Suelo */}
            <div className="mx-auto -mt-1 h-3 w-4/5 rounded-full bg-black/65 blur-sm" />
          </div>

          {/* Rodapié Arquitectónico y Suelo */}
          <div className="w-full mt-2">
            {/* Rodapié */}
            <div className="h-2 w-full border-t border-b border-black/40 bg-[#161719]" />
            {/* Suelo del Salón */}
            <div className={`h-8 sm:h-10 w-full ${currentWall.floorClass}`}>
              {/* Regla de Escala Métrica Integrada en el Suelo */}
              <div className="flex items-center justify-center gap-2 sm:gap-4 h-full px-4 text-[9px] sm:text-[10px] font-mono tracking-[0.25em] text-[#C5A880]">
                <span>├───</span>
                <span className="font-semibold uppercase whitespace-nowrap">
                  {t(
                    "ESCALA REAL: SOFÁ DE 200 CM (PARED DE 3,6 M)",
                    "TRUE SCALE: 200 CM SOFA (3.6 M WALL)"
                  )}
                </span>
                <span>───┤</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Resumen de Configuración & Acciones Directas */}
      <div className="mt-6 flex flex-col justify-between gap-4 rounded-xl border border-white/[0.08] bg-[#0B0C0E] p-5 sm:flex-row sm:items-center">
        <div className="space-y-1 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-[#C5A880] font-mono uppercase tracking-wider text-[10px]">
              {t("Configuración seleccionada:", "Selected configuration:")}
            </span>
          </div>
          <p className="text-[#EBE7DF] font-medium text-sm">
            {layoutMode === "diptych"
              ? `${t("Composición en Díptico:", "Diptych Composition:")} ${workA.title} + ${workB.title}`
              : workA.title}{" "}
            · {selectedFormat.label} ({selectedFormat.dims})
          </p>
          <p className="text-neutral-400 text-xs">
            {currentFinish.label} · {currentFinish.note}
          </p>
          <p className="text-[#8E8A80] text-[11px] font-mono">
            {t("Ambiente:", "Environment:")}{" "}
            <span className="text-[#EBE7DF]">
              {lang === "en" ? currentSofaStyle.labelEn : currentSofaStyle.labelEs} (
              {lang === "en" ? currentSofaColor.nameEn : currentSofaColor.nameEs}) ·{" "}
              {lang === "en" ? currentWall.labelEn : currentWall.labelEs}
            </span>
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="inline-flex items-center justify-center gap-2 border border-[#C5A880] bg-[#C5A880] px-5 py-3 text-xs uppercase tracking-[0.2em] text-[#0B0C0E] font-semibold transition hover:bg-transparent hover:text-[#C5A880]"
          >
            <span>{t("+ Añadir a la Cesta", "+ Add to Bag")}</span>
          </button>

          <Link
            href={`/contact?motivo=print&obra=${encodeURIComponent(orderReference)}&formato=${encodeURIComponent(orderFormat)}`}
            className="inline-flex items-center justify-center border border-white/20 bg-[#15171A] px-5 py-3 text-xs uppercase tracking-[0.2em] text-[#EBE7DF] font-medium transition hover:border-white/40 hover:text-white text-center"
          >
            <span>{t("Consultar Encargo →", "Request Commission →")}</span>
          </Link>
        </div>
      </div>

      {/* Modal para añadir la obra configurada a la cesta */}
      <AddToCartModal
        photo={photoForModal}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </section>
  );
}
