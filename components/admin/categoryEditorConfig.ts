import type { Photo, PhotoCategory } from "@/types/photo";

export interface AdminSeries {
  slug: string;
  title: string;
  category: PhotoCategory;
  photoIds: string[];
}

export const CATEGORY_ID_PREFIX: Record<PhotoCategory, string> = {
  "fauna-naturaleza": "fn",
  "paisajes-documental": "pd",
  "coches-rally": "cr",
  "arquitectura-urbana": "au",
  "viajes-cultura": "vc",
};

export function slugifyTitle(input: string): string {
  return input
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function generateNextPhotoId(
  category: PhotoCategory,
  existingWorks: Photo[]
): string {
  const prefix = CATEGORY_ID_PREFIX[category];
  let maxNum = 0;
  const used = new Set(existingWorks.map((w) => w.id));
  for (const w of existingWorks) {
    const match = w.id.match(new RegExp(`^${prefix}-(\\d+)$`));
    if (match) {
      const n = parseInt(match[1], 10);
      if (n > maxNum) maxNum = n;
    }
  }
  let candidateNum = maxNum + 1;
  let candidate = `${prefix}-${String(candidateNum).padStart(2, "0")}`;
  while (used.has(candidate)) {
    candidateNum += 1;
    candidate = `${prefix}-${String(candidateNum).padStart(2, "0")}`;
  }
  return candidate;
}

export function createBlankPhoto(
  category: PhotoCategory,
  existingWorks: Photo[]
): Photo {
  const id = generateNextPhotoId(category, existingWorks);
  return {
    id,
    slug: "",
    title: "",
    category,
    image: "",
    width: 2200,
    height: 1467,
    alt: "",
    location: "",
    country: "España",
    camera: "Canon EOS R7",
    lens:
      category === "fauna-naturaleza"
        ? "Sigma 150-600mm f/5-6.3 DG OS HSM Contemporary"
        : "Canon RF-S 18-150mm f/3.5-6.3 IS STM",
    iso: 400,
    aperture: "f/5.6",
    shutter: "1/500s",
    focalLength: category === "fauna-naturaleza" ? "600mm" : "35mm",
    maxRecommendedFormat: "coleccion",
    description: "",
    story: "",
    year: new Date().getFullYear(),
    featured: false,
    prints: true,
    licensing: true,
    keywords: [],
    pricing: {
      estudio: 95,
      galeria: 175,
      coleccion: 290,
      dimensions: {
        estudio: "30 × 45 cm",
        galeria: "50 × 70 cm",
        coleccion: "70 × 100 cm",
      },
      paper: "Hahnemühle Photo Rag 308g (100% Algodón)",
      editionTotal: 25,
      score: 85,
    },
    ...(category === "fauna-naturaleza" ? { wildlifeCondition: "libre" as const } : {}),
  };
}

interface CategoryEditorConfig {
  /** Solo la fauna tiene condición (libre / parque / centro) y lugar exacto del avistamiento */
  showWildlife: boolean;
  locationLabel: string;
  locationPlaceholder: string;
  descriptionPlaceholder: string;
  storyLabel: string;
  storyPlaceholder: string;
  altPlaceholder: string;
  keywordsPlaceholder: string;
}

export const CATEGORY_EDITOR_CONFIG: Record<PhotoCategory, CategoryEditorConfig> = {
  "fauna-naturaleza": {
    showWildlife: true,
    locationLabel: "Ubicación pública",
    locationPlaceholder: "Ej. Anaga, Tenerife",
    descriptionPlaceholder: "Qué animal aparece, qué está haciendo y cómo es la luz…",
    storyLabel: "Historia de campo",
    storyPlaceholder: "La espera, la distancia con el animal, la luz del momento…",
    altPlaceholder: "Ej. Garza blanca posada en la orilla al atardecer",
    keywordsPlaceholder: "aves, fauna salvaje, tenerife, 600mm",
  },
  "paisajes-documental": {
    showWildlife: false,
    locationLabel: "Ubicación",
    locationPlaceholder: "Ej. Parque Nacional del Teide, Tenerife",
    descriptionPlaceholder: "Qué se ve en el paisaje, la hora y las condiciones de luz…",
    storyLabel: "Historia de la toma",
    storyPlaceholder: "Cómo llegaste al lugar, la hora, la niebla o el viento…",
    altPlaceholder: "Ej. Cumbre nevada del Teide al amanecer",
    keywordsPlaceholder: "paisaje, volcán, niebla, amanecer",
  },
  "coches-rally": {
    showWildlife: false,
    locationLabel: "Prueba / tramo",
    locationPlaceholder: "Ej. Rally, tramo o parque de asistencia",
    descriptionPlaceholder: "Coche, momento de la prueba y lo que transmite la imagen…",
    storyLabel: "Historia de la toma",
    storyPlaceholder: "Posición en la curva, el paso del coche, la velocidad de obturación…",
    altPlaceholder: "Ej. Coche de rally clásico trazando una curva en asfalto",
    keywordsPlaceholder: "rally histórico, motorsport, coche clásico",
  },
  "arquitectura-urbana": {
    showWildlife: false,
    locationLabel: "Ubicación",
    locationPlaceholder: "Ej. Casco histórico, ciudad",
    descriptionPlaceholder: "Edificio o espacio, materiales, geometría y luz…",
    storyLabel: "Historia de la toma",
    storyPlaceholder: "Qué te llamó la atención del lugar, la hora, la luz sobre las fachadas…",
    altPlaceholder: "Ej. Fachada de piedra con balcones de madera",
    keywordsPlaceholder: "arquitectura, fachada, piedra, casco histórico",
  },
  "viajes-cultura": {
    showWildlife: false,
    locationLabel: "Ubicación",
    locationPlaceholder: "Ej. Mercado, barrio o ciudad",
    descriptionPlaceholder: "La escena, el oficio o la tradición que muestra…",
    storyLabel: "Historia de la toma",
    storyPlaceholder: "El contexto de la escena, las personas, la luz del lugar…",
    altPlaceholder: "Ej. Herrero trabajando en la fragua a contraluz",
    keywordsPlaceholder: "documental, oficio, tradición, mercado",
  },
};

/** Series que tiene sentido ofrecer: las de su categoría y aquellas a las que ya pertenece. */
export function getRelevantSeries(
  allSeries: AdminSeries[],
  category: PhotoCategory,
  photoId: string
): AdminSeries[] {
  return allSeries.filter((s) => s.category === category || s.photoIds.includes(photoId));
}
