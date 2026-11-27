import type { Photo } from "@/types/photo";
import type { SiteLang } from "@/lib/i18n-helpers";

export type PrintFormatId = "estudio" | "galeria" | "coleccion";

export interface BasePrintFormatSpec {
  id: PrintFormatId;
  name: string;
  nameEn: string;
  shortName: string;
  shortNameEn: string;
  dimensions: string;
  marginCm: number;
  defaultPrice: number;
  defaultEdition: number;
  maxWidthCm: number;
}

/**
 * ÚNICA FUENTE DE VERDAD PARA FORMATOS, MEDIDAS Y MÁRGENES FINE ART (/data/formatos.ts)
 * La mancha de imagen se calcula estrictamente como: papel - 2 × margen en ambos ejes.
 */
export const BASE_PRINT_FORMATS: Record<PrintFormatId, BasePrintFormatSpec> = {
  estudio: {
    id: "estudio",
    name: "Formato Estudio",
    nameEn: "Studio Format",
    shortName: "Estudio",
    shortNameEn: "Studio",
    dimensions: "30 × 45 cm",
    marginCm: 3,
    defaultPrice: 100,
    defaultEdition: 25,
    maxWidthCm: 45,
  },
  galeria: {
    id: "galeria",
    name: "Formato Galería",
    nameEn: "Gallery Format",
    shortName: "Galería",
    shortNameEn: "Gallery",
    dimensions: "50 × 70 cm",
    marginCm: 5,
    defaultPrice: 185,
    defaultEdition: 25,
    maxWidthCm: 70,
  },
  coleccion: {
    id: "coleccion",
    name: "Gran Colección",
    nameEn: "Grand Collection",
    shortName: "Gran Colección",
    shortNameEn: "Grand Collection",
    dimensions: "70 × 100 cm",
    marginCm: 5,
    defaultPrice: 305,
    defaultEdition: 25,
    maxWidthCm: 100,
  },
};

export const PRINT_FORMAT_ORDER: PrintFormatId[] = ["estudio", "galeria", "coleccion"];

/**
 * Calcula las medidas de mancha de imagen a partir del papel y el margen perimetral:
 * mancha = papel − 2 × margen
 */
export function computeManchaDimensions(
  paperDims: string,
  formatId: PrintFormatId,
  lang: SiteLang = "es"
): { widthCm: number; heightCm: number; marginCm: number; label: string } {
  const spec = BASE_PRINT_FORMATS[formatId];
  const nums = paperDims.match(/\d+(?:[.,]\d+)?/g);
  const w = nums && nums.length >= 2 ? parseFloat(nums[0].replace(",", ".")) : NaN;
  const h = nums && nums.length >= 2 ? parseFloat(nums[1].replace(",", ".")) : NaN;

  const widthCm =
    Number.isFinite(w) && Number.isFinite(h)
      ? Math.round((w - 2 * spec.marginCm) * 10) / 10
      : parseInt((spec.dimensions.match(/\d+/g) ?? ["30", "45"])[0], 10) - 2 * spec.marginCm;

  const heightCm =
    Number.isFinite(w) && Number.isFinite(h)
      ? Math.round((h - 2 * spec.marginCm) * 10) / 10
      : parseInt((spec.dimensions.match(/\d+/g) ?? ["30", "45"])[1], 10) - 2 * spec.marginCm;

  return {
    widthCm,
    heightCm,
    marginCm: spec.marginCm,
    label:
      lang === "en"
        ? `Image ${widthCm} × ${heightCm} cm (${spec.marginCm} cm white border)`
        : `Mancha ${widthCm} × ${heightCm} cm (margen blanco ${spec.marginCm} cm)`,
  };
}

export function getFormatPriceRanges(
  works: ReadonlyArray<Pick<Photo, "prints" | "pricing">>
): Record<PrintFormatId, { min: number; max: number; editionMin: number; editionMax: number }> {
  const printable = works.filter((w) => w.prints && w.pricing);
  const summarize = (id: PrintFormatId) => {
    const vals = printable.map((w) => w.pricing![id]);
    const editions = printable.map((w) => w.pricing!.editionTotal);
    return {
      min: vals.length > 0 ? Math.min(...vals) : BASE_PRINT_FORMATS[id].defaultPrice,
      max: vals.length > 0 ? Math.max(...vals) : BASE_PRINT_FORMATS[id].defaultPrice,
      editionMin: editions.length > 0 ? Math.min(...editions) : BASE_PRINT_FORMATS[id].defaultEdition,
      editionMax: editions.length > 0 ? Math.max(...editions) : BASE_PRINT_FORMATS[id].defaultEdition,
    };
  };

  return {
    estudio: summarize("estudio"),
    galeria: summarize("galeria"),
    coleccion: summarize("coleccion"),
  };
}
