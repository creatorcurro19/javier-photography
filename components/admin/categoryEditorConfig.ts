import type { Photo, PhotoCategory, Project } from "@/types/photo";

export type AdminSeries = Project;

export interface BulkWorksParams {
  ids: string[];
  actionType:
    | "addToSeries"
    | "removeFromSeries"
    | "setCategory"
    | "setPrints"
    | "setFeatured"
    | "delete";
  targetSeriesSlug?: string;
  targetCategory?: PhotoCategory;
  printsValue?: boolean;
  featuredValue?: boolean;
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

export function titleFromFilename(fileName: string): string {
  const base = fileName
    .replace(/\.[^.]+$/, "")
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (!base) return "Nueva obra";
  return base
    .split(" ")
    .map((word, idx) => {
      const lower = word.toLowerCase();
      if (
        idx > 0 &&
        ["de", "del", "la", "el", "en", "y", "a", "al", "con", "por"].includes(lower)
      ) {
        return lower;
      }
      return lower.charAt(0).toUpperCase() + lower.slice(1);
    })
    .join(" ");
}

export function dimensionsForAspect(width: number, height: number) {
  const ratio = Math.max(width, height) / Math.max(1, Math.min(width, height));
  if (ratio >= 1.68) {
    return {
      estudio: "30 × 53 cm",
      galeria: "45 × 80 cm",
      coleccion: "60 × 105 cm",
    };
  }
  if (ratio <= 1.32) {
    return {
      estudio: "32 × 40 cm",
      galeria: "50 × 62 cm",
      coleccion: "70 × 88 cm",
    };
  }
  return {
    estudio: "30 × 45 cm",
    galeria: "50 × 70 cm",
    coleccion: "70 × 100 cm",
  };
}

export function generateNextPhotoId(
  category: PhotoCategory,
  existingWorks: Photo[],
  reservedIds?: Set<string>
): string {
  const prefix = CATEGORY_ID_PREFIX[category];
  let maxNum = 0;
  const used = new Set(existingWorks.map((w) => w.id));
  if (reservedIds) {
    for (const r of reservedIds) used.add(r);
  }
  for (const id of used) {
    const match = id.match(new RegExp(`^${prefix}-(\\d+)$`));
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
  existingWorks: Photo[],
  reservedIds?: Set<string>
): Photo {
  const id = generateNextPhotoId(category, existingWorks, reservedIds);
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
      category === "fauna-naturaleza" || category === "coches-rally"
        ? "Sigma 150-600mm f/5-6.3 DG OS HSM Contemporary"
        : "Canon RF-S 18-150mm f/3.5-6.3 IS STM",
    iso: 400,
    aperture: "f/5.6",
    shutter: category === "coches-rally" ? "1/1000s" : "1/500s",
    focalLength: category === "fauna-naturaleza" || category === "coches-rally" ? "600mm" : "35mm",
    maxRecommendedFormat: "coleccion",
    description: "",
    story: "",
    year: new Date().getFullYear(),
    featured: false,
    prints: category !== "coches-rally",
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

/**
 * Lee metadatos EXIF y comprime/redimensiona un archivo de imagen en el navegador
 * a máx. 2200px (JPEG 0.88). Usado tanto en subida individual como en subida por lotes.
 */
export async function processImageFileClient(file: File): Promise<{
  dataUrl: string;
  width: number;
  height: number;
  suggestedTitle: string;
  exifPatch: Partial<Photo>;
}> {
  const exifPatch: Partial<Photo> = {};
  try {
    const exifr = await import("exifr");
    const meta = await exifr.parse(file);
    if (meta) {
      if (meta.Model) {
        const m = String(meta.Model);
        exifPatch.camera = /R7/i.test(m)
          ? "Canon EOS R7"
          : /750D/i.test(m)
          ? "Canon EOS 750D"
          : m;
      }
      const focalNum = Number(meta.FocalLength);
      if (Number.isFinite(focalNum) && focalNum > 0) {
        exifPatch.focalLength = `${Math.round(focalNum)}mm`;
      }
      if (meta.LensModel || focalNum) {
        const l = String(meta.LensModel || "");
        if (/150-600/i.test(l) || focalNum > 150) {
          exifPatch.lens = "Sigma 150-600mm f/5-6.3 DG OS HSM Contemporary";
        } else if (/10-18/i.test(l) || (focalNum && focalNum < 18)) {
          exifPatch.lens = "Canon EF-S 10-18mm f/4.5-5.6 IS STM";
        } else if (l) {
          exifPatch.lens = l;
        }
      }
      if (Number.isFinite(Number(meta.ISO))) {
        exifPatch.iso = Math.round(Number(meta.ISO));
      }
      if (Number.isFinite(Number(meta.FNumber)) && Number(meta.FNumber) > 0) {
        exifPatch.aperture = `f/${Math.round(Number(meta.FNumber) * 10) / 10}`;
      }
      const exp = Number(meta.ExposureTime);
      if (Number.isFinite(exp) && exp > 0) {
        exifPatch.shutter =
          exp >= 1 ? `${Math.round(exp * 10) / 10}s` : `1/${Math.round(1 / exp)}s`;
      }
      if (
        meta.DateTimeOriginal instanceof Date &&
        !Number.isNaN(meta.DateTimeOriginal.getTime())
      ) {
        exifPatch.year = meta.DateTimeOriginal.getFullYear();
      }
    }
  } catch {
    // Continuar si no hay EXIF
  }

  const objectUrl = URL.createObjectURL(file);
  const img = await new Promise<HTMLImageElement>((resolve, reject) => {
    const el = new window.Image();
    el.onload = () => resolve(el);
    el.onerror = () => reject(new Error("No se pudo leer el archivo de imagen."));
    el.src = objectUrl;
  });

  const maxEdge = 2200;
  const scale = Math.min(1, maxEdge / Math.max(img.naturalWidth, img.naturalHeight));
  const width = Math.max(1, Math.round(img.naturalWidth * scale));
  const height = Math.max(1, Math.round(img.naturalHeight * scale));

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    URL.revokeObjectURL(objectUrl);
    throw new Error("No se pudo procesar la imagen.");
  }
  ctx.drawImage(img, 0, 0, width, height);
  URL.revokeObjectURL(objectUrl);

  const dataUrl = canvas.toDataURL("image/jpeg", 0.88);
  const suggestedTitle = titleFromFilename(file.name);

  return {
    dataUrl,
    width,
    height,
    suggestedTitle,
    exifPatch,
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
