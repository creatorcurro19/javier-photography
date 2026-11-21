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
    codeEn: string;
    title: string;
    titleEn: string;
    subtitle: string;
    subtitleEn: string;
    description: string;
    descriptionEn: string;
    seoTitle: string;
    seoDescription: string;
    seoKeywords: string[];
    coverImage: string;
  }
> = {
  "fauna-naturaleza": {
    code: "FAUNA SALVAJE",
    codeEn: "WILDLIFE & NATURAL HISTORY",
    title: "Fauna y Naturaleza",
    titleEn: "Wildlife & Biodiversity",
    subtitle: "Fauna salvaje, biodiversidad y comportamiento animal en libertad",
    subtitleEn: "Untamed wildlife, insular biodiversity, and animal behavior in the wild",
    description:
      "Aproximación respetuosa a la fauna silvestre y la biodiversidad en su hábitat natural. Instantes capturados con paciencia, luz natural y teleobjetivo de 600mm en condiciones de campo.",
    descriptionEn:
      "Ethical field observation of Iberian, Alpine, and Macaronesian wildlife in its natural habitat. Captured with available light and a 600mm super-telephoto lens without habitat disturbance.",
    seoTitle: "Fotografía de Fauna Salvaje y Naturaleza (Wildlife Photography) | Javier Espinosa",
    seoDescription:
      "Colección de fotografía de fauna salvaje, aves y biodiversidad en libertad (Tenerife, Monfragüe, Sierra de Gredos). Capturas a 600mm con luz natural, copias Fine Art Hahnemühle y licencias editoriales.",
    seoKeywords: [
      "fotografía de fauna salvaje",
      "fotógrafo de naturaleza españa",
      "wildlife photography spain",
      "bird photography 600mm",
      "fauna canaria tenerife",
      "fine art wildlife prints",
      "canon eos r7 wildlife",
    ],
    coverImage: "/images/portfolio/fauna-naturaleza/mirada-del-lince-boreal.jpg",
  },
  "paisajes-documental": {
    code: "PAISAJE & TERRITORIO",
    codeEn: "LANDSCAPES & TERRITORY",
    title: "Paisajes y Territorio",
    titleEn: "Landscapes & Geological Territory",
    subtitle: "Territorios, montañas, desiertos y el pulso geológico del paisaje",
    subtitleEn: "Volcanic summits, desert ergs, cloud forests, and geological stillness",
    description:
      "Una mirada contemplativa al territorio: cumbres de alta montaña, horizontes desérticos, formaciones geológicas y el diálogo silencioso entre la tierra y la atmósfera.",
    descriptionEn:
      "A contemplative study of territory: snow-capped volcanic peaks in Tenerife, Saharan dune ridges, High Atlas reliefs, and the silent dialogue between geology and natural light.",
    seoTitle: "Fotografía de Paisaje y Territorio (Fine Art Landscape Photography) | Javier Espinosa",
    seoDescription:
      "Fotografía de paisaje de autor en Tenerife (Teide, Anaga), Desierto del Sahara, Alto Atlas y Península Ibérica. Obra gráfica Fine Art sobre papel de algodón Hahnemühle Photo Rag 308g.",
    seoKeywords: [
      "fotografía de paisaje",
      "fine art landscape photography",
      "paisajes volcánicos tenerife",
      "fotografía desierto del sahara",
      "copias fine art paisajes",
      "landscape photographer canary islands",
    ],
    coverImage: "/images/portfolio/paisajes-documental/cumbre-nevada-al-alba.jpg",
  },
  "coches-rally": {
    code: "AUTOMOVILISMO & RALLY",
    codeEn: "HISTORIC MOTORSPORT & RALLY",
    title: "Coches y Rally",
    titleEn: "Classic Motorsport & Rally",
    subtitle: "Rally histórico, velocidad, mecánica de precisión y tensión cinética",
    subtitleEn: "Timed mountain stages, paddock craftsmanship, and classic racing mechanics",
    description:
      "La energía cinética del automovilismo en tramos cerrados y el ambiente técnico del paddock. Clásicos de competición, tensión mecánica y precisión de pilotaje.",
    descriptionEn:
      "The kinetic tension of historic tarmac rallies and the intimate human ritual of the service park. Classic competition machines—Porsche 911, Golf Mk1, Autobianchi A112, BMW E30—at the limit of grip.",
    seoTitle: "Fotografía de Rally Histórico y Automovilismo (Motorsport Photography) | Javier Espinosa",
    seoDescription:
      "Archivo y encargos de fotografía de automovilismo, rally histórico, clásicos de competición y parque de asistencia en Tenerife y España. Láminas Fine Art de motor y cobertura para equipos.",
    seoKeywords: [
      "fotografía de rally",
      "fotógrafo de automovilismo",
      "historic rally photography",
      "motorsport fine art prints",
      "coches clásicos competición",
      "porsche 911 rally print",
      "rally tenerife canarias",
    ],
    coverImage: "/images/portfolio/coches-rally/cruzada-sobre-el-asfalto.jpg",
  },
  "arquitectura-urbana": {
    code: "ARQUITECTURA",
    codeEn: "ARCHITECTURE & URBAN SPACE",
    title: "Arquitectura y Espacio Urbano",
    titleEn: "Vernacular & Urban Architecture",
    subtitle: "Arquitectura tradicional y contemporánea, geometrías y luces nocturnas",
    subtitleEn: "Vernacular stone and timber heritage, Islamic geometry, and nocturnal urban space",
    description:
      "Exploración de la geometría urbana, la arquitectura popular de piedra y entramado de madera, la fotografía nocturna y el diálogo entre el espacio construido y el paso del tiempo.",
    descriptionEn:
      "An architectural inquiry into spatial geometry, vernacular granite-and-timber construction in La Vera, Islamic zellij courtyards in Marrakech, and nocturnal urban atmospheres.",
    seoTitle: "Fotografía de Arquitectura, Patrimonio y Espacio Urbano | Javier Espinosa",
    seoDescription:
      "Fotografía de arquitectura vernácula, patrimonio histórico, geometría islámica y paisaje urbano nocturno por Javier Espinosa Martínez. Reportajes para arquitectos y obra Fine Art.",
    seoKeywords: [
      "fotografía de arquitectura",
      "fotógrafo de arquitectura y patrimonio",
      "architectural photography spain",
      "arquitectura vernácula",
      "urban night photography",
      "fine art architectural prints",
    ],
    coverImage: "/images/portfolio/arquitectura-urbana/ventanas-tomadas-por-el-bosque.jpg",
  },
  "viajes-cultura": {
    code: "DOCUMENTAL",
    codeEn: "DOCUMENTARY & LIVING HERITAGE",
    title: "Documental y Tradición",
    titleEn: "Documentary & Living Heritage",
    subtitle: "Oficios, tradiciones, memoria popular, devoción y vida cotidiana",
    subtitleEn: "Traditional crafts, ethnographic memory, souk workshops, and everyday dignity",
    description:
      "Crónica documental de la memoria colectiva: oficios tradicionales, celebraciones populares, retratos de calle y la dignidad de lo cotidiano sin artificios.",
    descriptionEn:
      "A documentary chronicle of collective memory: traditional blacksmiths, cedar woodturners in Marrakech, paprika drying in Villanueva de la Vera, and unposed street portraits in available light.",
    seoTitle: "Fotografía Documental, Etnografía y Viajes (Documentary Photography) | Javier Espinosa",
    seoDescription:
      "Ensayos de fotografía documental sobre oficios tradicionales, memoria rural, cultura popular en España y zocos históricos de Marruecos. Captura con luz natural sin artificio.",
    seoKeywords: [
      "fotografía documental",
      "documentary photography spain",
      "fotografía etnográfica y oficios",
      "travel documentary photography",
      "villanueva de la vera fotografía",
      "marrakech documentary photos",
    ],
    coverImage: "/images/portfolio/viajes-cultura/el-oficio-y-la-chispa.jpg",
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
