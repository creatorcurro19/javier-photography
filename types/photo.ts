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

export interface PhotoPricing {
  estudio: number;
  galeria: number;
  coleccion: number;
  dimensions: {
    estudio: string;
    galeria: string;
    coleccion: string;
  };
  paper: string;
  editionTotal: number;
  score: number;
}

export type MaxPrintFormatId = "estudio" | "galeria" | "coleccion";

export type WildlifeCondition = "libre" | "parque" | "centro";

export type FaunaCondiciones = "silvestre" | "santuario" | "cautiverio" | "sin indicar";

export interface Photo {
  id: string;
  slug: string;
  title: string;
  series?: string;
  seriesSlug?: string;
  category: PhotoCategory;
  image: string;
  width: number;
  height: number;
  alt: string;
  location?: string;
  realLocation?: string;
  condiciones?: FaunaCondiciones;
  wildlifeCondition?: WildlifeCondition;
  evento?: string;
  lugar?: string;
  country?: string;
  coordinates?: PhotoCoordinates;
  camera: string;
  lens: string;
  iso: number;
  aperture: string;
  shutter: string;
  focalLength: string;
  exifWarning?: string;
  maxRecommendedFormat: MaxPrintFormatId;
  maxFormatReason?: string;
  description: string;
  story?: string;
  year: number;
  featured: boolean;
  featuredOrder?: number;
  /** Posición (1 a 5) en el carrusel principal (Hero) de la portada */
  heroOrder?: number;
  /** Si es true, esta foto es la portada de su categoría en la web */
  categoryCover?: boolean;
  prints: boolean;
  pricing?: PhotoPricing;
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
    code: "FAUNA & NATURALEZA",
    codeEn: "WILDLIFE & NATURE",
    title: "Fauna y Naturaleza",
    titleEn: "Wildlife & Nature",
    subtitle: "Mamíferos, aves y pequeños detalles del entorno natural a 600mm",
    subtitleEn: "Mammals, birdlife, and quiet details of the natural world at 600mm",
    description:
      "Fotografiar animales exige paciencia y distancia. Con el teleobjetivo de 600mm trabajo en distintos entornos: lugar y condiciones se indican en cada ficha.",
    descriptionEn:
      "Photographing wildlife takes patience and distance. Location and conditions are indicated on each work's sheet.",
    seoTitle: "Fauna y Naturaleza | Javier Espinosa",
    seoDescription:
      "Fotografía de fauna, aves y naturaleza a 600mm con luz natural. Lugar y condiciones indicados en cada ficha. Copias Fine Art y licencias.",
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
    codeEn: "LANDSCAPES",
    title: "Paisajes y Territorio",
    titleEn: "Landscapes & Territory",
    subtitle: "Montañas, costas volcánicas, niebla y desierto",
    subtitleEn: "Mountains, volcanic coasts, cloud forests, and desert dunes",
    description:
      "Un paisaje no necesita grandes artificios cuando la luz acompaña. Desde el Teide al amanecer o la niebla cerrada en los montes de Anaga hasta las dunas del Sahara y el relieve del Atlas, son lugares donde apetece detenerse a mirar.",
    descriptionEn:
      "A landscape needs very little when the light is right. From Mount Teide at dawn and the mist in Anaga's laurel forests to the dunes of the Sahara and the ridges of the High Atlas—places that invite you to stop and look.",
    seoTitle: "Paisajes y Territorio | Javier Espinosa",
    seoDescription:
      "Fotografía de paisaje en Tenerife (Teide, Anaga), Sahara, Alto Atlas y Península. Copias Fine Art en papel Hahnemühle Photo Rag 308g.",
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
    codeEn: "MOTORSPORT & RALLY",
    title: "Coches y Rally",
    titleEn: "Cars & Historic Rally",
    subtitle: "Tramos de montaña, clásicos de competición y ambiente de asistencia",
    subtitleEn: "Mountain rally stages, classic competition cars, and the service park",
    description:
      "En un rally pasan muchas cosas fuera de la trazada. Están los coches clásicos apurando una frenada o levantando rueda en una horquilla, pero también los mecánicos bajo la carpa, las notas sobre el capó y los detalles de carrocerías con décadas de historia.",
    descriptionEn:
      "There is more to a rally than the racing line. There are classic cars braking late into a hairpin or lifting an inside wheel, but also mechanics working under the tent, pacenotes spread across a hood, and the worn details of bodywork with decades of history.",
    seoTitle: "Coches y Rally Histórico | Javier Espinosa",
    seoDescription:
      "Fotografía de rally histórico en Tenerife (52º Rallye Orvecame Isla Tenerife Histórico, El Tanque), vehículos clásicos y asistencia.",
    seoKeywords: [
      "fotografía de rally",
      "52 rallye orvecame isla tenerife histórico",
      "tramo de el tanque rally",
      "fotógrafo de automovilismo tenerife",
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
    codeEn: "ARCHITECTURE & URBAN",
    title: "Arquitectura y Espacio Urbano",
    titleEn: "Architecture & Urban Space",
    subtitle: "Piedra, madera, lugares abandonados y calles de noche",
    subtitleEn: "Stone, timber, abandoned places, and quiet streets at night",
    description:
      "Me atraen los edificios que guardan la huella del tiempo: casas de granito y entramado de madera en pueblos antiguos, patios de azulejo y yeso, ruinas tomadas por la vegetación o la luz de una farola sobre una fachada a medianoche.",
    descriptionEn:
      "I am drawn to buildings that show the passage of time: granite and timber houses in old villages, tiled courtyards, ruins slowly reclaimed by vegetation, or the warm glow of a streetlamp against a facade late at night.",
    seoTitle: "Arquitectura y Espacio Urbano | Javier Espinosa",
    seoDescription:
      "Fotografía de arquitectura tradicional y espacio urbano en Villanueva de la Vera, Cádiz, Tenerife y Marrakech por Javier Espinosa.",
    seoKeywords: [
      "fotografía de arquitectura",
      "fotógrafo de arquitectura y patrimonio",
      "architectural photography spain",
      "arquitectura vernácula villanueva de la vera",
      "el puerto de santa maría fotografía nocturna",
      "urban night photography",
      "fine art architectural prints",
    ],
    coverImage: "/images/portfolio/arquitectura-urbana/ventanas-tomadas-por-el-bosque.jpg",
  },
  "viajes-cultura": {
    code: "DOCUMENTAL",
    codeEn: "DOCUMENTARY",
    title: "Documental y Tradición",
    titleEn: "Documentary & Everyday Life",
    subtitle: "Oficios manuales, mercados, costumbres y escenas cotidianas",
    subtitleEn: "Handcrafts, markets, local traditions, and everyday scenes",
    description:
      "Talleres donde se sigue trabajando el hierro o la madera a mano, secaderos de pimientos al sol, mercados de barrio y escenas de calle sin posar. Fotografías que buscan registrar cómo son los lugares y quienes los habitan sin interrumpir lo que está pasando.",
    descriptionEn:
      "Workshops where iron and cedar are still shaped by hand, peppers drying in the sun, neighborhood markets, and unposed street scenes. Photographs meant to record places and the people in them without interrupting what is happening.",
    seoTitle: "Documental y Tradición | Javier Espinosa",
    seoDescription:
      "Fotografía documental sobre oficios manuales, Cruces de Mayo en Los Realejos, vida rural en La Vera y talleres de Marrakech.",
    seoKeywords: [
      "fotografía documental",
      "cruces de mayo los realejos tenerife",
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
