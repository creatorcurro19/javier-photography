import type { Project } from "@/types/photo";

export const PROJECTS: Project[] = [
  {
    id: "custodios",
    slug: "custodios",
    title: "Custodios: Memoria, Oficios y Tradición",
    subtitle: "Los guardianes de las técnicas manuales, el comercio tradicional y los ritos populares",
    discipline: "DOCUMENTARY",
    category: "viajes-cultura",
    year: "2024 — 2026",
    location: "España & Marruecos",
    coverImage: "/images/portfolio/viajes-cultura/soldador.jpg",
    description:
      "Un ensayo documental sobre la vigencia de los oficios artesanales y las costumbres arraigadas: chispas en la penumbra de la fragua, mercados de especias, secaderos al sol y celebraciones populares.",
    statement: [
      "En un mundo gobernado por la inmediatez, existen espacios y personas cuyos gestos conservan el pulso de generaciones. Este proyecto reúne escenas donde el trabajo manual, el comercio de proximidad y la tradición rural mantienen viva la identidad de cada lugar.",
      "Cada fotografía fue tomada con luz disponible y sin alterar la escena, buscando que la atmósfera real del taller, la plaza o el mercado hable por sí misma.",
    ],
    photoIds: ["vc-44", "vc-25", "vc-05", "vc-01", "vc-15", "vc-31", "vc-22", "vc-04"],
  },
  {
    id: "la-gomera",
    slug: "la-gomera",
    title: "Entre la Bruma y el Volcán: Paisaje Insular",
    subtitle: "Cumbres nevadas, túneles de laurisilva y el horizonte infinito del Atlántico",
    discipline: "LANDSCAPES",
    category: "paisajes-documental",
    year: "2025 — 2026",
    location: "Islas Canarias",
    coverImage: "/images/portfolio/paisajes-documental/B51A0149.jpg",
    description:
      "Recorrido visual por los contrastes geológicos y climáticos del archipiélago: desde el cono nevado del Teide al amanecer y los senderos de laurisilva envueltos en niebla en Anaga hasta los acantilados bañados por el ocaso atlántico.",
    statement: [
      "El territorio insular concentra en pocos kilómetros una diversidad paisajística extraordinaria. En las cumbres domina el silencio mineral del volcán bajo las primeras luces del alba; en las crestas medias, el alisio envuelve los bosques de laurisilva en una penumbra húmeda y ancestral.",
      "La serie sigue esa transición lumínica desde la alta montaña hasta la costa, donde el sol se funde con el océano entre siluetas de palmeras y acantilados.",
    ],
    photoIds: ["pd-02", "au-04", "au-05", "pd-04", "pd-01", "pd-06"],
  },
  {
    id: "trazadas-rally",
    slug: "trazadas-rally",
    title: "Trazadas y Paddock: Rally Histórico",
    subtitle: "Competición en tramo cerrado, preparación en asistencia y cultura del motor clásico",
    discipline: "MOTORSPORT",
    category: "coches-rally",
    year: "2024 — 2026",
    location: "Tramos de Montaña & Parque de Asistencia",
    coverImage: "/images/portfolio/coches-rally/B51A9718.jpg",
    description:
      "Doble mirada al automovilismo histórico: la adrenalina del derrapaje y los apoyos al límite en pleno tramo frente a la concentración previa, los detalles mecánicos y el ambiente humano del parque de asistencia.",
    statement: [
      "Un rally se vive tanto en la calma tensa de las carpas de asistencia —donde pilotos y mecánicos revisan notas, neumáticos y carrocerías clásicas— como en la fracción de segundo en que el vehículo se rebela contra la adherencia del asfalto.",
      "Combinando aproximaciones de detalle en el paddock con disparos a 600mm en curva, la serie retrata la pasión técnica y estética por los automóviles de competición clásicos.",
    ],
    photoIds: ["cr-13", "cr-14", "cr-12", "cr-11", "cr-02", "cr-09", "cr-10", "cr-06"],
  },
  {
    id: "silencio-del-desierto",
    slug: "silencio-del-desierto",
    title: "El Silencio del Desierto",
    subtitle: "La escala humana frente a la inmensidad mineral de las dunas en el crepúsculo",
    discipline: "LANDSCAPES",
    category: "paisajes-documental",
    year: "2024 — 2025",
    location: "Desierto del Sahara",
    coverImage: "/images/portfolio/viajes-cultura/B51A7335.jpg",
    description:
      "Surcos de viento sobre la arena rojiza y figuras recortadas contra el sol poniente en un horizonte de dunas donde el tiempo parece suspenderse.",
    statement: [
      "Frente al océano de dunas, cualquier noción de prisa desaparece. Este ensayo explora la abstracción del paisaje desértico: cómo la luz rasante del ocaso dibuja aristas nítidas entre el oro y la sombra y cómo las siluetas humanas revelan la verdadera escala del erg.",
    ],
    photoIds: ["vc-39", "vc-42", "vc-38", "vc-40", "vc-41", "pd-07"],
  },
  {
    id: "miradas-en-libertad",
    slug: "miradas-en-libertad",
    title: "Miradas en Libertad: Fauna Silvestre",
    subtitle: "Paciencia en el aguardo y observación de aves, mamíferos de montaña y microfauna",
    discipline: "WILDLIFE",
    category: "fauna-naturaleza",
    year: "2025 — 2026",
    location: "Península Ibérica",
    coverImage: "/images/portfolio/fauna-naturaleza/B51A4628.jpg",
    description:
      "Aproximaciones a la biodiversidad ibérica con teleobjetivo de 600mm y óptica macro: desde el equilibrio de la cabra montés y la vigilia del buitre leonado hasta la delicadeza del plumaje y la microfauna.",
    statement: [
      "La fotografía de naturaleza exige adaptarse al ritmo del entorno. Ya sea aguardando con el 600mm el salto de una cabra montés entre bloques de granito o acercándose a ras de suelo a un anfibio en el arroyo, el objetivo es siempre retratar al animal con respeto y luz natural.",
    ],
    photoIds: ["fn-01", "fn-02", "fn-05", "fn-06", "fn-07", "vc-10", "vc-17"],
  },
];
