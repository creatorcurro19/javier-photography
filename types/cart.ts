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
    name: "Formato Estudio (A3+)",
    dimensions: "33 × 48 cm",
    imageDimensions: "aprox. 30 × 45 cm",
    price: 240,
    framePrice: 110,
    editionLimit: 50,
  },
  galeria: {
    id: "galeria",
    name: "Formato Galería",
    dimensions: "50 × 70 cm",
    imageDimensions: "aprox. 40 × 60 cm",
    price: 480,
    framePrice: 190,
    editionLimit: 25,
  },
  coleccion: {
    id: "coleccion",
    name: "Gran Colección",
    dimensions: "70 × 100 cm",
    imageDimensions: "aprox. 60 × 90 cm",
    price: 890,
    framePrice: 290,
    editionLimit: 10,
  },
};

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
