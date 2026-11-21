import type { PhotoCategory } from "@/types/photo";

export interface AdminSeries {
  slug: string;
  title: string;
  category: PhotoCategory;
  photoIds: string[];
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
