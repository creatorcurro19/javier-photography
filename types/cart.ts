import type { Photo } from "@/types/photo";

export interface PrintFormat {
  id: "estudio" | "galeria" | "coleccion";
  name: string;
  dimensions: string;
  imageDimensions: string;
  price: number;
  framePrice: number;
  editionLimit: number;
}

export const PRINT_FORMATS: Record<PrintFormat["id"], PrintFormat> = {
  estudio: {
    id: "estudio",
    name: "Formato Estudio",
    dimensions: "30 × 45 cm",
    imageDimensions: "Margen blanco de conservación incluido",
    price: 120,
    framePrice: 0,
    editionLimit: 25,
  },
  galeria: {
    id: "galeria",
    name: "Formato Galería",
    dimensions: "50 × 70 cm",
    imageDimensions: "Margen blanco de conservación incluido",
    price: 220,
    framePrice: 0,
    editionLimit: 25,
  },
  coleccion: {
    id: "coleccion",
    name: "Gran Colección",
    dimensions: "70 × 100 cm",
    imageDimensions: "Margen blanco de conservación incluido",
    price: 380,
    framePrice: 0,
    editionLimit: 25,
  },
};

/**
 * Devuelve los 3 formatos con el precio, dimensiones exactas y límite de edición
 * propios e individuales de la fotografía indicada (solo impresión en tubo, sin marco).
 */
export function getFormatsForPhoto(
  photo: Pick<Photo, "pricing">
): Record<PrintFormat["id"], PrintFormat> {
  const p = photo.pricing;
  const editionLimit = p?.editionTotal ?? 25;
  return {
    estudio: {
      id: "estudio",
      name: "Formato Estudio",
      dimensions: p?.dimensions.estudio ?? PRINT_FORMATS.estudio.dimensions,
      imageDimensions: "Lámina con margen blanco · Envío en tubo rígido",
      price: p?.estudio ?? PRINT_FORMATS.estudio.price,
      framePrice: 0,
      editionLimit,
    },
    galeria: {
      id: "galeria",
      name: "Formato Galería",
      dimensions: p?.dimensions.galeria ?? PRINT_FORMATS.galeria.dimensions,
      imageDimensions: "Lámina con margen blanco · Envío en tubo rígido",
      price: p?.galeria ?? PRINT_FORMATS.galeria.price,
      framePrice: 0,
      editionLimit,
    },
    coleccion: {
      id: "coleccion",
      name: "Gran Colección",
      dimensions: p?.dimensions.coleccion ?? PRINT_FORMATS.coleccion.dimensions,
      imageDimensions: "Lámina con margen blanco · Envío en tubo rígido",
      price: p?.coleccion ?? PRINT_FORMATS.coleccion.price,
      framePrice: 0,
      editionLimit,
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
  createdAt: string;
}
