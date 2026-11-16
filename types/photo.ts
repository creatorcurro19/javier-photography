export type PhotoCategory =
  | "fauna-naturaleza"
  | "paisajes-documental"
  | "coches-rally"
  | "arquitectura-urbana"
  | "viajes-cultura";

export interface PhotoCoordinates {
  lat: number;
  lng: number;
}

export interface Photo {
  id: string;
  slug: string;
  title: string;
  category: PhotoCategory;
  image: string;
  width: number;
  height: number;
  alt: string;
  location?: string;
  country?: string;
  coordinates?: PhotoCoordinates;
  camera: string;
  lens: string;
  iso: number;
  aperture: string;
  shutter: string;
  focalLength: string;
  description: string;
  story?: string;
  year: number;
  featured: boolean;
  featuredOrder?: number;
  prints: boolean;
  licensing?: boolean;
  getty?: boolean;
  shutterstock?: boolean;
  awards?: string[];
  keywords: string[];
}

export const PHOTO_CATEGORIES: PhotoCategory[] = [
  "fauna-naturaleza",
  "paisajes-documental",
  "coches-rally",
  "arquitectura-urbana",
  "viajes-cultura",
];

export const CATEGORY_METADATA: Record<
  PhotoCategory,
  {
    code: string;
    title: string;
    subtitle: string;
    description: string;
    coverImage: string;
  }
> = {
  "fauna-naturaleza": {
    code: "WILDLIFE",
    title: "Fauna y Naturaleza",
    subtitle: "Fauna salvaje, biodiversidad y comportamiento animal en libertad",
    description:
      "Aproximación respetuosa a la fauna silvestre y la biodiversidad en su hábitat natural. Instantes capturados con paciencia, luz natural y teleobjetivo en condiciones de campo.",
    coverImage: "/images/portfolio/fauna-naturaleza/B51A4853.jpg",
  },
  "paisajes-documental": {
    code: "LANDSCAPES",
    title: "Paisajes y Territorio",
    subtitle: "Territorios, montañas, desiertos y el pulso geológico del paisaje",
    description:
      "Una mirada contemplativa al territorio: cumbres de alta montaña, horizontes desérticos, formaciones geológicas y el diálogo silencioso entre la tierra y la atmósfera.",
    coverImage: "/images/portfolio/paisajes-documental/B51A0149.jpg",
  },
  "coches-rally": {
    code: "MOTORSPORT",
    title: "Coches y Rally",
    subtitle: "Rally histórico, velocidad, mecánica de precisión y tensión cinética",
    description:
      "La energía cinética del automovilismo en tramos cerrados y el ambiente técnico del paddock. Clásicos de competición, tensión mecánica y precisión de pilotaje.",
    coverImage: "/images/portfolio/coches-rally/B51A9718.jpg",
  },
  "arquitectura-urbana": {
    code: "URBAN & ARCHITECTURE",
    title: "Arquitectura y Espacio Urbano",
    subtitle: "Arquitectura tradicional y contemporánea, geometrías y luces nocturnas",
    description:
      "Exploración de la geometría urbana, la arquitectura popular de piedra y entramado de madera, la fotografía nocturna y el diálogo entre el espacio construido y el paso del tiempo.",
    coverImage: "/images/portfolio/arquitectura-urbana/B51A4685.jpg",
  },
  "viajes-cultura": {
    code: "DOCUMENTARY",
    title: "Documental y Tradición",
    subtitle: "Oficios, tradiciones, memoria popular, devoción y vida cotidiana",
    description:
      "Crónica documental de la memoria colectiva: oficios tradicionales, celebraciones populares, retratos de calle y la dignidad de lo cotidiano sin artificios.",
    coverImage: "/images/portfolio/viajes-cultura/soldador.jpg",
  },
};

export interface Project {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  discipline: string;
  category: PhotoCategory;
  year: string;
  location?: string;
  description: string;
  statement: string[];
  coverImage: string;
  photoIds: string[];
}
