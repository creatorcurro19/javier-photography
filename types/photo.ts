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
    title: string;
    subtitle: string;
    description: string;
    coverImage: string;
  }
> = {
  "fauna-naturaleza": {
    title: "Fauna y Naturaleza",
    subtitle: "Fauna salvaje, biodiversidad y el reino animal en su entorno",
    description:
      "Aproximación respetuosa a la fauna silvestre y la biodiversidad en su hábitat natural. Instantes capturados con paciencia, luz natural y teleobjetivo en condiciones de campo.",
    coverImage: "/images/portfolio/fauna-naturaleza/B51A8662.jpg",
  },
  "paisajes-documental": {
    title: "Paisajes y Fotografía Documental",
    subtitle: "Territorios, montañas, desiertos y el pulso geológico del paisaje",
    description:
      "Una mirada contemplativa al territorio: cumbres de alta montaña, horizontes desérticos, formaciones geológicas y el diálogo silencioso entre la tierra y la atmósfera.",
    coverImage: "/images/portfolio/paisajes-documental/B51A0149.jpg",
  },
  "coches-rally": {
    title: "Coches y Rally",
    subtitle: "Velocidad, competición, mecánica clásica y el alma del motor histórico",
    description:
      "La energía cinética del automovilismo en tramos cerrados y el ambiente técnico del paddock. Clásicos de competición, tensión mecánica y precisión de pilotaje.",
    coverImage: "/images/portfolio/coches-rally/B51A9718.jpg",
  },
  "arquitectura-urbana": {
    title: "Arquitectura y Fotografía Urbana",
    subtitle: "Espacios habitados, geometrías, luces nocturnas y vestigios del tiempo",
    description:
      "Exploración de la geometría urbana, la fotografía nocturna bajo la luz disponible y la relación entre la arquitectura construida y el paso del tiempo.",
    coverImage: "/images/portfolio/arquitectura-urbana/B51A2679.jpg",
  },
  "viajes-cultura": {
    title: "Viajes y Cultura",
    subtitle: "Oficios, tradiciones, memoria popular, devoción y vida cotidiana",
    description:
      "Crónica documental de la memoria colectiva: oficios tradicionales, celebraciones populares, retratos de calle y la dignidad de lo cotidiano sin artificios.",
    coverImage: "/images/portfolio/viajes-cultura/soldador.jpg",
  },
};
