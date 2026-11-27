import {
  BASE_PRINT_FORMATS,
  computeManchaDimensions,
  type PrintFormatId,
} from "@/data/formatos";
import { getPlazos, PLAZOS } from "@/data/plazos";
import { translateMaxFormatReason, type SiteLang } from "@/lib/i18n-helpers";
import type { Photo } from "@/types/photo";

export type ShippingZoneId = "canarias" | "peninsula" | "internacional";

export interface ShippingZone {
  id: ShippingZoneId;
  label: string;
  cost: number;
  taxNote: string;
  deliveryDays: string;
}

// PENDIENTE: confirmar con gestor el encuadre fiscal (IGIC / IVA / REPEP)
export const SHIPPING_ZONES: Record<ShippingZoneId, ShippingZone> = {
  canarias: {
    id: "canarias",
    label: "Tenerife e Islas Canarias",
    cost: 0,
    taxNote: "Envío en tubo incluido · Los impuestos aplicables se indican al confirmar el pedido",
    deliveryDays: `Envío en tubo rígido · ${PLAZOS.tabla}`,
  },
  peninsula: {
    id: "peninsula",
    label: "España Peninsular y Baleares",
    cost: 15,
    taxNote: "+ 15 € envío en tubo rígido · Los impuestos aplicables se indican al confirmar el pedido",
    deliveryDays: `Correo certificado en tubo rígido · ${PLAZOS.tabla}`,
  },
  internacional: {
    id: "internacional",
    label: "Unión Europea e Internacional",
    cost: 28,
    taxNote: "+ 28 € envío internacional en tubo rígido · Los impuestos aplicables se indican al confirmar el pedido",
    deliveryDays: `Envío internacional en tubo rígido · ${PLAZOS.tabla}`,
  },
};

export function getShippingZones(lang: SiteLang): Record<ShippingZoneId, ShippingZone> {
  if (lang !== "en") return SHIPPING_ZONES;
  const p = getPlazos("en");
  return {
    canarias: {
      id: "canarias",
      label: "Tenerife & Canary Islands",
      cost: 0,
      taxNote: "Tube shipping included · Applicable taxes are confirmed upon order confirmation",
      deliveryDays: `Rigid tube shipping · ${p.tabla}`,
    },
    peninsula: {
      id: "peninsula",
      label: "Mainland Spain & Balearic Islands",
      cost: 15,
      taxNote: "+ €15 rigid tube shipping · Applicable taxes are confirmed upon order confirmation",
      deliveryDays: `Registered post in rigid tube · ${p.tabla}`,
    },
    internacional: {
      id: "internacional",
      label: "European Union & International",
      cost: 28,
      taxNote: "+ €28 international rigid tube shipping · Applicable taxes are confirmed upon order confirmation",
      deliveryDays: `International rigid tube shipping · ${p.tabla}`,
    },
  };
}

export interface PrintFormat {
  id: PrintFormatId;
  name: string;
  dimensions: string;
  imageDimensions: string;
  price: number;
  framePrice: number;
  editionLimit: number;
  disabled?: boolean;
  disabledReason?: string;
}

export const PRINT_FORMATS: Record<PrintFormat["id"], PrintFormat> = {
  estudio: {
    id: "estudio",
    name: BASE_PRINT_FORMATS.estudio.name,
    dimensions: BASE_PRINT_FORMATS.estudio.dimensions,
    imageDimensions: computeManchaDimensions(
      BASE_PRINT_FORMATS.estudio.dimensions,
      "estudio"
    ).label,
    price: BASE_PRINT_FORMATS.estudio.defaultPrice,
    framePrice: 0,
    editionLimit: BASE_PRINT_FORMATS.estudio.defaultEdition,
  },
  galeria: {
    id: "galeria",
    name: BASE_PRINT_FORMATS.galeria.name,
    dimensions: BASE_PRINT_FORMATS.galeria.dimensions,
    imageDimensions: computeManchaDimensions(
      BASE_PRINT_FORMATS.galeria.dimensions,
      "galeria"
    ).label,
    price: BASE_PRINT_FORMATS.galeria.defaultPrice,
    framePrice: 0,
    editionLimit: BASE_PRINT_FORMATS.galeria.defaultEdition,
  },
  coleccion: {
    id: "coleccion",
    name: BASE_PRINT_FORMATS.coleccion.name,
    dimensions: BASE_PRINT_FORMATS.coleccion.dimensions,
    imageDimensions: computeManchaDimensions(
      BASE_PRINT_FORMATS.coleccion.dimensions,
      "coleccion"
    ).label,
    price: BASE_PRINT_FORMATS.coleccion.defaultPrice,
    framePrice: 0,
    editionLimit: BASE_PRINT_FORMATS.coleccion.defaultEdition,
  },
};

function computeImageArea(
  paperDims: string,
  tier: "estudio" | "galeria" | "coleccion",
  lang: SiteLang = "es"
): string {
  return computeManchaDimensions(paperDims, tier, lang).label;
}

/**
 * Devuelve los 3 formatos con el precio, dimensiones exactas (papel vs mancha),
 * límite de edición y restricción de formato máximo según resolución e ISO.
 */
export function getFormatsForPhoto(
  photo: Pick<Photo, "pricing" | "maxRecommendedFormat" | "maxFormatReason" | "iso" | "camera">,
  lang: SiteLang = "es"
): Record<PrintFormat["id"], PrintFormat> {
  const p = photo.pricing;
  const editionLimit = p?.editionTotal ?? 25;
  const estudioDims = p?.dimensions.estudio ?? PRINT_FORMATS.estudio.dimensions;
  const galeriaDims = p?.dimensions.galeria ?? PRINT_FORMATS.galeria.dimensions;
  const coleccionDims = p?.dimensions.coleccion ?? PRINT_FORMATS.coleccion.dimensions;

  const isColeccionDisabled =
    photo.maxRecommendedFormat === "galeria" ||
    photo.maxRecommendedFormat === "estudio" ||
    (photo.iso !== undefined && photo.iso >= 3200) ||
    Boolean(photo.camera && photo.camera.includes("750D"));

  const fallbackDisabledReason =
    lang === "en"
      ? "Due to native sensor resolution or elevated ISO sensitivity, this work is limited to Gallery Format (50 × 70 cm) to ensure maximum print sharpness."
      : "Por resolución nativa o sensibilidad ISO elevada, esta obra se limita a Formato Galería (50 × 70 cm) para garantizar máxima nitidez.";

  return {
    estudio: {
      id: "estudio",
      name: lang === "en" ? BASE_PRINT_FORMATS.estudio.nameEn : BASE_PRINT_FORMATS.estudio.name,
      dimensions: estudioDims,
      imageDimensions: computeImageArea(estudioDims, "estudio", lang),
      price: p?.estudio ?? PRINT_FORMATS.estudio.price,
      framePrice: 0,
      editionLimit,
    },
    galeria: {
      id: "galeria",
      name: lang === "en" ? BASE_PRINT_FORMATS.galeria.nameEn : BASE_PRINT_FORMATS.galeria.name,
      dimensions: galeriaDims,
      imageDimensions: computeImageArea(galeriaDims, "galeria", lang),
      price: p?.galeria ?? PRINT_FORMATS.galeria.price,
      framePrice: 0,
      editionLimit,
    },
    coleccion: {
      id: "coleccion",
      name: lang === "en" ? BASE_PRINT_FORMATS.coleccion.nameEn : BASE_PRINT_FORMATS.coleccion.name,
      dimensions: coleccionDims,
      imageDimensions: computeImageArea(coleccionDims, "coleccion", lang),
      price: p?.coleccion ?? PRINT_FORMATS.coleccion.price,
      framePrice: 0,
      editionLimit,
      disabled: isColeccionDisabled,
      disabledReason: isColeccionDisabled
        ? translateMaxFormatReason(photo.maxFormatReason, lang) ?? fallbackDisabledReason
        : undefined,
    },
  };
}

export interface CartItem {
  id: string; // unique item id: `${photoSlug}-${formatId}-${framed ? "framed" : "print"}`
  photoId: string;
  slug: string;
  title: string;
  image: string;
  category: string;
  format: PrintFormat;
  framed: boolean;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface OrderCustomer {
  nombre: string;
  email: string;
  telefono: string;
  direccion: string;
  ciudad: string;
  codigoPostal: string;
  pais: string;
  notas?: string;
}

export interface CartOrder {
  orderId: string;
  customer: OrderCustomer;
  items: CartItem[];
  subtotal: number;
  shippingZone?: ShippingZoneId;
  shippingCost?: number;
  total?: number;
  createdAt: string;
}
