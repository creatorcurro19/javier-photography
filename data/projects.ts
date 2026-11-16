import type { Project } from "@/types/photo";

export const PROJECTS: Project[] = [
  {
    id: "custodios",
    slug: "custodios",
    title: "Custodios: Memoria y Oficios",
    subtitle: "Los guardianes de las técnicas manuales y la dignidad del trabajo cotidiano",
    discipline: "DOCUMENTARY",
    category: "viajes-cultura",
    year: "2024 — 2026",
    location: "Península Ibérica & Cuenca Mediterránea",
    coverImage: "/images/portfolio/viajes-cultura/soldador.jpg",
    description:
      "Un ensayo documental sobre la resistencia de los oficios artesanales frente a la serialización moderna: manos que trenzan fibras, chispas en la penumbra del taller y miradas cargadas de memoria.",
    statement: [
      "En un mundo gobernado por la inmediatez y la producción deslocalizada, existen personas cuyos gestos conservan el pulso de siglos. Custodios es una crónica de la memoria viva: los artesanos de la forja, los cesteros que dominan la flexibilidad vegetal y los comerciantes de abastos tradicionales.",
      "Cada toma fue realizada con luz natural disponible y en silencio, buscando que la dignidad del oficio y la concentración del protagonista prevalezcan sobre cualquier puesta en escena artificial.",
    ],
    photoIds: ["vc-44", "vc-22", "vc-23", "vc-29", "vc-30", "vc-16", "vc-20", "vc-25"],
  },
  {
    id: "la-gomera",
    slug: "la-gomera",
    title: "La Gomera: Territorio y Tradición",
    subtitle: "Orografía abrupta, niebla atlántica y senderos encajonados en el basalto",
    discipline: "LANDSCAPES",
    category: "paisajes-documental",
    year: "2025 — 2026",
    location: "Islas Canarias",
    coverImage: "/images/portfolio/paisajes-documental/B51A0149.jpg",
    description:
      "Exploración visual del relieve vertical insular: carreteras suspendidas en las crestas rocosas, barrancos donde la laurisilva retiene la bruma marina y aldeas asentadas en las laderas.",
    statement: [
      "La Gomera impone una escala geológica sobrecogedora. Su red de comunicaciones —abierta a golpe de ingeniería sobre riscos vertiginosos— funciona como un hilo conductor que revela la confrontación silenciosa entre el esfuerzo humano y la inmensidad del territorio.",
      "El proyecto documenta la transición lumínica entre la claridad de las cumbres y la penumbra cerrada de los barrancos, donde la humedad marina del alisio esculpe una atmósfera densa y casi pictórica.",
    ],
    photoIds: ["pd-01", "pd-02", "pd-03", "pd-07", "pd-08", "vc-04"],
  },
  {
    id: "trazadas-rally",
    slug: "trazadas-rally",
    title: "Trazadas: Memoria del Rally Histórico",
    subtitle: "Competición, precisión milimétrica y la poética de la velocidad mecánica",
    discipline: "MOTORSPORT",
    category: "coches-rally",
    year: "2024 — 2026",
    location: "Tramos de Asfalto & Montaña",
    coverImage: "/images/portfolio/coches-rally/B51A9718.jpg",
    description:
      "La energía cinética del automovilismo en tramos cerrados: apoyos violentos, neumáticos en el vértice del asfalto mojado y la complicidad mecánica entre máquina y piloto.",
    statement: [
      "El automovilismo clásico no es únicamente un deporte de velocidad; es una disciplina de respeto absoluto por la física y la precisión. Apostado tras el guardarraíl en el interior de una curva ciega, la cámara capta la fracción de segundo donde el peso se transfiere y la trazada se vuelve arte.",
      "A través de focales extremas (hasta 600mm) y barridos calculados, este ensayo congela la tensión en el habitáculo, el agua proyectada por el dibujo del neumático y la elegancia de carrocerías legendarias.",
    ],
    photoIds: ["cr-01", "cr-02", "cr-03", "cr-07", "cr-13", "cr-14"],
  },
  {
    id: "silencio-del-desierto",
    slug: "silencio-del-desierto",
    title: "El Silencio del Desierto",
    subtitle: "La escala humana frente a la inmensidad mineral del crepúsculo",
    discipline: "LANDSCAPES",
    category: "viajes-cultura",
    year: "2024 — 2025",
    location: "Erg Chebbi & Desierto del Sahara",
    coverImage: "/images/portfolio/viajes-cultura/B51A6734-2.jpg",
    description:
      "Surcos de viento sobre las crestas doradas y figuras recortadas contra la última luz del horizonte en un espacio donde el tiempo parece detenerse.",
    statement: [
      "Frente al océano de dunas, cualquier noción de prisa desaparece. Este ensayo explora la abstracción del paisaje desértico: cómo la luz rasante del ocaso proyecta sombras geométricas y cómo las siluetas humanas se integran con naturalidad en la quietud mineral.",
    ],
    photoIds: ["vc-14", "vc-38", "vc-39", "vc-40", "vc-42"],
  },
  {
    id: "miradas-en-libertad",
    slug: "miradas-en-libertad",
    title: "Miradas en Libertad: Fauna Silvestre",
    subtitle: "Paciencia en el aguardo y respeto por el comportamiento animal no alterado",
    discipline: "WILDLIFE",
    category: "fauna-naturaleza",
    year: "2025 — 2026",
    location: "Ecosistemas Ibéricos",
    coverImage: "/images/portfolio/fauna-naturaleza/B51A8662.jpg",
    description:
      "Aproximaciones respetuosas a la fauna salvaje con teleobjetivo Sigma 150-600mm, capturando actitudes espontáneas sin alterar el equilibrio del hábitat.",
    statement: [
      "La fotografía de fauna exige renunciar a la inmediatez. Exige horas de inmovilidad en el frío matinal, con el teleobjetivo enfocado al claro del sotobosque, aguardando el instante irrepetible en que el animal emerge sin percatarse de la presencia humana.",
    ],
    photoIds: ["fn-01", "fn-02", "fn-03", "fn-06", "fn-07", "fn-08"],
  },
];
