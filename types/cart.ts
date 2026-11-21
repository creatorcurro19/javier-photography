import type { Photo } from "@/types/photo";

export type ShippingZoneId = "canarias" | "peninsula" | "internacional";

export interface ShippingZone {
  id: ShippingZoneId;
  label: string;
  cost: number;
  taxNote: string;
  deliveryDays: string;
}

export const SHIPPING_ZONES: Record<ShippingZoneId, ShippingZone> = {
  canarias: {
    id: "canarias",
    label: "Tenerife e Islas Canarias",
    cost: 0,
    taxNote: "Precio final · Venta de autor sin recargo de IGIC (envío en tubo incluido)",
    deliveryDays: "5–7 días laborables (entrega en tubo rígido)",
  },
  peninsula: {
    id: "peninsula",
    label: "España Peninsular y Baleares",
    cost: 15,
    taxNote: "Precio final + 15 € envío en tubo rígido certificado",
    deliveryDays: "6–9 días laborables (correo certificado en tubo rígido)",
  },
  internacional: {
    id: "internacional",
    label: "Unión Europea e Internacional",
    cost: 28,
    taxNote: "Precio final + 28 € envío internacional certificado en tubo rígido",
    deliveryDays: "8–12 días laborables (envío internacional en tubo rígido)",
  },
};

export interface PrintFormat {
  id: "estudio" | "galeria" | "coleccion";
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
    name: "Formato Estudio",
    dimensions: "30 × 45 cm",
    imageDimensions: "Mancha 24 × 36 cm (margen blanco 3–4,5 cm)",
    price: 120,
    framePrice: 0,
    editionLimit: 25,
  },
  galeria: {
    id: "galeria",
    name: "Formato Galería",
    dimensions: "50 × 70 cm",
    imageDimensions: "Mancha 40 × 60 cm (margen blanco 5 cm)",
    price: 220,
    framePrice: 0,
    editionLimit: 25,
  },
  coleccion: {
    id: "coleccion",
    name: "Gran Colección",
    dimensions: "70 × 100 cm",
    imageDimensions: "Mancha 60 × 90 cm (margen blanco 5 cm)",
    price: 380,
    framePrice: 0,
    editionLimit: 25,
  },
};

function computeImageArea(paperDims: string, tier: "estudio" | "galeria" | "coleccion"): string {
  if (paperDims.includes("30 × 40")) return "Mancha 24 × 32 cm (margen blanco 3–4 cm)";
  if (paperDims.includes("30 × 45")) return "Mancha 24 × 36 cm (margen blanco 3–4,5 cm)";
  if (paperDims.includes("45 × 60")) return "Mancha 36 × 48 cm (margen blanco 4,5–6 cm)";
  if (paperDims.includes("50 × 70")) return "Mancha 40 × 60 cm (margen blanco 5 cm)";
  if (paperDims.includes("60 × 90")) return "Mancha 50 × 75 cm (margen blanco 5–7,5 cm)";
  if (paperDims.includes("70 × 100")) return "Mancha 60 × 90 cm (margen blanco 5 cm)";
  return PRINT_FORMATS[tier].imageDimensions;
}

/**
 * Devuelve los 3 formatos con el precio, dimensiones exactas (papel vs mancha),
 * límite de edición y restricción de formato máximo según resolución e ISO.
 */
export function getFormatsForPhoto(
  photo: Pick<Photo, "pricing" | "maxRecommendedFormat" | "maxFormatReason" | "iso" | "camera">
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

  return {
    estudio: {
      id: "estudio",
      name: "Formato Estudio",
      dimensions: estudioDims,
      imageDimensions: computeImageArea(estudioDims, "estudio"),
      price: p?.estudio ?? PRINT_FORMATS.estudio.price,
      framePrice: 0,
      editionLimit,
    },
    galeria: {
      id: "galeria",
      name: "Formato Galería",
      dimensions: galeriaDims,
      imageDimensions: computeImageArea(galeriaDims, "galeria"),
      price: p?.galeria ?? PRINT_FORMATS.galeria.price,
      framePrice: 0,
      editionLimit,
    },
    coleccion: {
      id: "coleccion",
      name: "Gran Colección",
      dimensions: coleccionDims,
      imageDimensions: computeImageArea(coleccionDims, "coleccion"),
      price: p?.coleccion ?? PRINT_FORMATS.coleccion.price,
      framePrice: 0,
      editionLimit,
      disabled: isColeccionDisabled,
      disabledReason: isColeccionDisabled
        ? photo.maxFormatReason ??
          "Por resolución nativa o sensibilidad ISO elevada, esta obra se limita a Formato Galería (50 × 70 cm) para garantizar máxima nitidez."
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
