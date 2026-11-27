import type { PhotoCategory } from "@/types/photo";
import { getFormatPriceRanges } from "@/data/formatos";
import { PLAZOS } from "@/data/plazos";
import { WORKS } from "@/data/works";

const FORMAT_RANGES = getFormatPriceRanges(WORKS);

/**
 * Zonas geográficas verificadas en el archivo y biografía del autor.
 * Para ampliar o ajustar la cobertura geográfica, edita este objeto.
 */
export const SERVICE_AREA = {
  base: "Tenerife (Islas Canarias)",
  primaryRegions: [
    "Tenerife e Islas Canarias",
    "Madrid",
    "Salamanca y Castilla y León",
    "Extremadura y Sierra de Gredos",
  ],
  scope: "Canarias · Disponibilidad para desplazamientos",
} as const;

export interface ServiceLanding {
  slug: string;
  serviceId: string;
  kicker: string;
  title: string;
  seoTitle: string;
  seoDescription: string;
  subtitle: string;
  category: PhotoCategory;
  heroImage: string;
  intro: string[];
  deliverables: string[];
  idealFor: string;
  technicalSpecs: {
    label: string;
    value: string;
  }[];
  process: {
    step: string;
    title: string;
    description: string;
  }[];
  faqs: {
    q: string;
    a: string;
  }[];
  primaryCta: {
    label: string;
    href: string;
  };
  secondaryCta: {
    label: string;
    href: string;
  };
}

export const SERVICE_LANDINGS: ServiceLanding[] = [
  {
    slug: "fotografo-rally-motorsport",
    serviceId: "rally-motor",
    kicker: "Motorsport · Rally Histórico & Competición",
    title: "Fotografía de Rally, Motorsport y Automovilismo Clásico",
    seoTitle: "Fotógrafo de Rally y Motorsport en Tenerife, Canarias y España",
    seoDescription:
      "Cobertura fotográfica profesional de rallyes, tramos cronometrados, parques de asistencia y vehículos clásicos en Tenerife, Islas Canarias y Península Ibérica. Sistema Canon EOS R7 + 150-600mm.",
    subtitle: `Cobertura integral de tramo cronometrado, asistencia y paddock para escuderías, pilotos y organizadores desde ${SERVICE_AREA.base} con desplazamientos a toda España.`,
    category: "coches-rally",
    heroImage: "/images/portfolio/coches-rally/parque-de-trabajo.jpg",
    intro: [
      "En un rally de tramo las cosas pasan muy deprisa y conviene conocer bien el terreno antes de que pase el primer coche. Trabajo tanto a pie de curva como dentro del parque de asistencia para recoger no solo la frenada o el apoyo del vehículo, sino también el ambiente del equipo: los mecánicos bajo la carpa, las notas sobre el capó y los detalles de cada coche.",
      "Desde Tenerife (Islas Canarias) y con desplazamientos a pruebas en la Península, combino el teleobjetivo de 600mm en tramo con ópticas más abiertas en el paddock para entregar un reportaje completo pensado para pilotos, escuderías, organizadores y prensa.",
    ],
    deliverables: [
      "Cobertura en múltiples ubicaciones de tramo (horquillas, apoyos, rasantes y salidas)",
      "Reportaje documental en parque de asistencia, verificaciones técnicas y briefing",
      PLAZOS.rallyPrensa,
      "Entrega en Sala Privada (/cliente) con archivos máster calibrados de 32,5 MP (TIFF/JPEG 300 DPI)",
      "Opción de ampliación Fine Art certificada en papel algodón Hahnemühle Photo Rag 308g",
    ],
    idealFor:
      "Escuderías de rally histórico y velocidad, pilotos privados, organizadores de pruebas automovilísticas, patrocinadores técnicos y propietarios de clásicos de competición.",
    technicalSpecs: [
      { label: "Cuerpo principal", value: "Canon EOS R7 (32,5 MP · Ráfaga de alta velocidad AF II)" },
      { label: "Teleobjetivo de tramo", value: "Sigma 150-600mm f/5-6.3 DG OS HSM Contemporary" },
      { label: "Óptica de paddock", value: "Canon RF-S 18-150mm & EF-S 10-18mm" },
      { label: "Ámbito geográfico", value: SERVICE_AREA.scope },
    ],
    process: [
      {
        step: "01",
        title: "Estudio de Rutómetro y Dorsales",
        description:
          "Análisis previo de los tramos, horarios de cierre de carretera, orientación solar y dorsales prioritarios del equipo o evento.",
      },
      {
        step: "02",
        title: "Paddock y Tramo Cronometrado",
        description:
          "Seguimiento desde las verificaciones y el parque de trabajo hasta los puntos técnicos clave de cada pasada.",
      },
      {
        step: "03",
        title: "Adelanto Rápido para Prensa",
        description: `${PLAZOS.rallyPrensa} Selección prioritaria para comunicación con patrocinadores y medios.`,
      },
      {
        step: "04",
        title: "Galería Máster Privada",
        description:
          "Acceso con clave al Portal de Clientes para elegir las fotografías finales en máxima resolución o encargar obra impresa.",
      },
    ],
    faqs: [
      {
        q: "¿Podemos contratar la cobertura para un único coche o dorsal durante un rally?",
        a: "Sí. Se puede contratar tanto el seguimiento dedicado a un dorsal o escudería concreta (incluyendo su carpa de asistencia, mecánicos y todas las pasadas por tramo) como la cobertura completa de una prueba para la organización.",
      },
      {
        q: "¿En cuánto tiempo recibimos las fotos para nuestros patrocinadores?",
        a: `${PLAZOS.rallyPrensa} ${PLAZOS.reportajes} Acceso mediante el Portal Privado de Clientes.`,
      },
      {
        q: "¿Realizas coberturas fuera de Tenerife?",
        a: "Sí. Con base en Tenerife (Islas Canarias), tengo disponibilidad para desplazamientos bajo encargo a pruebas de rally histórico.",
      },
    ],
    primaryCta: {
      label: "Solicitar Cobertura de Rally",
      href: "/contact?servicio=rally-motor&motivo=Encargo",
    },
    secondaryCta: {
      label: "Ver Archivo de Coches y Rally",
      href: "/portfolio/coches-rally",
    },
  },
  {
    slug: "fotografo-arquitectura-espacio-urbano",
    serviceId: "arquitectura-territorio",
    kicker: "Arquitectura · Patrimonio & Geometría Urbana",
    title: "Fotografía de Arquitectura, Patrimonio e Interiorismo",
    seoTitle: "Fotógrafo de Arquitectura y Patrimonio en Canarias, Madrid y España",
    seoDescription:
      "Documentación fotográfica de arquitectura contemporánea, patrimonio histórico, hoteles y espacio urbano por Javier Espinosa Martínez. Control riguroso de luz natural y geometría.",
    subtitle:
      "Documentación visual rigurosa de obra construida, rehabilitación patrimonial y proyectos de interiorismo con respeto absoluto por la geometría, la escala y la luz natural.",
    category: "arquitectura-urbana",
    heroImage: "/images/portfolio/arquitectura-urbana/ventanas-tomadas-por-el-bosque.jpg",
    intro: [
      "La fotografía de arquitectura requiere paciencia lumínica y rigor geométrico. Cada edificio o intervención patrimonial posee una hora exacta en la que los volúmenes, el hormigón, la piedra o la madera dialogan con la atmósfera circundante sin distorsiones artificiales.",
      "Documento proyectos para estudios de arquitectura, instituciones de patrimonio, hoteles con identidad propia e interioristas en Canarias, Madrid, Castilla y León y Extremadura, entregando reportajes listos para memoria de proyecto, publicación editorial y archivo corporativo.",
    ],
    deliverables: [
      "Estudio solar previo para planificar tomas diurnas, hora azul y fotografía nocturna",
      "Control estricto de verticales, fugas geométricas y fidelidad cromática de materiales",
      "Vistas generales de implantación en el territorio y detalles constructivos de acabado",
      "Archivos máster de 32,5 MP en alta resolución para imprenta, paneles de concurso y web",
      "Licencia de uso comercial y editorial adaptada por escrito al alcance del estudio",
    ],
    idealFor:
      "Estudios de arquitectura, arquitectos técnicos, promotoras de diseño, hoteles boutique, fundaciones de patrimonio histórico e interioristas.",
    technicalSpecs: [
      { label: "Angular arquitectónico", value: "Canon EF-S 10-18mm f/4.5-5.6 IS STM" },
      { label: "Óptica de detalle y escala", value: "Canon RF-S 18-150mm f/3.5-6.3 IS STM" },
      { label: "Sensor y rango dinámico", value: "Canon EOS R7 (RAW 14-bit · 32,5 MP)" },
      { label: "Zonas habituales", value: "Canarias, Madrid, Salamanca, Extremadura" },
    ],
    process: [
      {
        step: "01",
        title: "Lectura de Planos y Orientación",
        description:
          "Revisión de las fachadas, alzados y materiales del proyecto para fijar la carta solar de la jornada de rodaje.",
      },
      {
        step: "02",
        title: "Sesión Diurna y Crepuscular",
        description:
          "Tomas pausadas aprovechando la incidencia lateral de la luz natural y el equilibrio con la iluminación interior al anochecer.",
      },
      {
        step: "03",
        title: "Revelado de Precisión",
        description:
          "Corrección óptica individual, neutralización de dominantes parasitarias y preservación de la textura real del material.",
      },
      {
        step: "04",
        title: "Entrega y Cesión Editorial",
        description:
          "Entrega mediante galería privada de selección con licencia de reproducción para dossieres, premios y prensa arquitectónica.",
      },
    ],
    faqs: [
      {
        q: "¿Cómo se gestionan los derechos de uso entre el estudio de arquitectura y otros colaboradores?",
        a: "El contrato especifica claramente los derechos de comunicación pública y editorial del estudio, y permite acordar licencias compartidas si constructoras, ingenierías o fabricantes de materiales desean adquirir el reportaje.",
      },
      {
        q: "¿Incluyes fotografía nocturna o en hora azul?",
        a: "Sí. La transición crepuscular es fundamental en arquitectura para equilibrar la luminancia del cielo con la iluminación artificial interior y exterior del edificio.",
      },
    ],
    primaryCta: {
      label: "Consultar Reportaje de Arquitectura",
      href: "/contact?servicio=arquitectura-territorio&motivo=Encargo",
    },
    secondaryCta: {
      label: "Ver Archivo de Arquitectura",
      href: "/portfolio/arquitectura-urbana",
    },
  },
  {
    slug: "proyectos-documentales-fotografia-editorial",
    serviceId: "documental-editorial",
    kicker: "Documental · Oficios, Territorio y Editorial",
    title: "Proyectos Documentales y Fotografía Editorial",
    seoTitle: "Proyectos Documentales y Fotografía Editorial | Javier Espinosa",
    seoDescription:
      "Encargos de fotografía documental, reportajes de oficios tradicionales, memoria rural y cobertura editorial por Javier Espinosa Martínez desde Tenerife.",
    subtitle:
      "Reportajes de media y larga duración sobre oficios manuales, patrimonio vivo y territorio para editoriales, instituciones culturales y publicaciones.",
    category: "viajes-cultura",
    heroImage: "/images/portfolio/viajes-cultura/el-oficio-y-la-chispa.jpg",
    intro: [
      "El trabajo documental pide tiempo y discreción: entrar en un taller o en una plaza sin alterar lo que ocurre, aprovechar la luz que hay y dejar que las personas sigan con su tarea habitual sin posar para la cámara.",
      "Desarrollo ensayos fotográficos y reportajes por encargo para revistas culturales, editoriales, fundaciones e instituciones públicas que necesitan documentar oficios artesanales, arquitectura vernácula y vida cotidiana con rigor y mirada propia.",
    ],
    deliverables: [
      "Inmersión y documentación en campo con luz natural sin puestas en escena forzadas",
      "Reportajes completos editados y secuenciados para publicación impresa o exposición",
      "Archivos máster calibrados (TIFF 16-bit / JPEG 300 DPI) con metadatos y pies de foto contextuales",
      "Cesión de derechos editoriales o institucionales por escrito según el alcance del proyecto",
    ],
    idealFor:
      "Editoriales, revistas culturales y de viajes, instituciones públicas, museos etnográficos y fundaciones culturales.",
    technicalSpecs: [
      { label: "Cuerpo principal", value: "Canon EOS R7 (RAW 14-bit · 32,5 MP)" },
      { label: "Ópticas de reportaje", value: "Canon RF-S 18-150mm & EF 50mm f/1.8 STM" },
      { label: "Entrega máster", value: "TIFF 16-bit / JPEG 300 DPI en Sala Privada (/cliente)" },
      { label: "Ámbito geográfico", value: "Tenerife, Canarias, Península Ibérica y desplazamientos" },
    ],
    process: [
      {
        step: "01",
        title: "Documentación Previa y Guion Visual",
        description:
          "Definición del enfoque narrativo, localización de talleres o protagonistas y planificación de jornadas de trabajo.",
      },
      {
        step: "02",
        title: "Rodaje Discreto en Terreno",
        description:
          "Trabajo pausado con luz ambiente para recoger tanto los gestos del oficio como el contexto espacial que lo rodea.",
      },
      {
        step: "03",
        title: "Edición y Secuencia Narrativa",
        description:
          "Selección y revelado coherente de la serie junto a notas de campo sobre cada escena fotografiada.",
      },
      {
        step: "04",
        title: "Entrega Editorial o Expositiva",
        description:
          "Acceso privado para descarga de másters de imprenta y opción de producción de copias Fine Art para exposición.",
      },
    ],
    faqs: [
      {
        q: "¿Se pueden encargar reportajes de varios días fuera de Tenerife?",
        a: "Sí. Realizo desplazamientos tanto entre islas como a la Península Ibérica y el extranjero para proyectos documentales y reportajes editoriales.",
      },
      {
        q: "¿El reportaje puede adaptarse después a una exposición o catálogo impreso?",
        a: "Sí. Todos los archivos se trabajan en RAW de 32,5 MP y pueden entregarse tanto para maquetación editorial como en copias Fine Art sobre papel de algodón Hahnemühle 308g.",
      },
    ],
    primaryCta: {
      label: "Solicitar Propuesta Documental",
      href: "/contact?servicio=documental-editorial&motivo=Encargo",
    },
    secondaryCta: {
      label: "Ver Archivo Documental",
      href: "/portfolio/viajes-cultura",
    },
  },
  {
    slug: "licencias-fotografia-fauna-naturaleza",
    serviceId: "licencias-fauna",
    kicker: "Fauna y Naturaleza · Archivo a 600mm",
    title: "Fotografía de Fauna y Licencias Editoriales de Naturaleza",
    seoTitle: "Fotografía de Fauna y Licencias Editoriales | Javier Espinosa",
    seoDescription:
      "Archivo fotográfico y licencias editoriales de fauna, aves y espacios naturales (Tenerife, Monfragüe, Sierra de Gredos) capturados a 600mm con luz natural.",
    subtitle:
      "Licencias de reproducción editorial y encargos de documentación ambiental a 600mm, indicando en cada obra el lugar real y las condiciones de la toma.",
    category: "fauna-naturaleza",
    heroImage: "/images/portfolio/fauna-naturaleza/mirada-del-lince-boreal.jpg",
    intro: [
      "Todas las imágenes de fauna y naturaleza de este archivo han sido tomadas con luz natural y sin manipulaciones generativas, trabajando a distancia con teleobjetivo de 600mm tanto en entorno natural abierto como en parques y centros de fauna, detallando con transparencia en cada ficha el lugar y las condiciones de captura.",
      "El catálogo está disponible bajo licencia Rights-Managed (RM) para editoriales, revistas científicas y de naturaleza, centros de interpretación ambiental, parques naturales y publicaciones culturales.",
    ],
    deliverables: [
      "Licencias Rights-Managed (RM) de archivo con exclusividad sectorial o temporal opcional",
      "Archivos máster a 300 DPI con registro EXIF íntegro y trazabilidad geográfica",
      "Encargos de documentación de biodiversidad, reservas naturales y turismo ornitológico",
      "Textos técnicos y notas de cuaderno de campo sobre las condiciones reales de captura",
    ],
    idealFor:
      "Editoriales científicas y de viajes, fundaciones de conservación, parques naturales, museos, agencias de comunicación ambiental y publicaciones culturales.",
    technicalSpecs: [
      { label: "Alcance óptico", value: "Sigma 150-600mm f/5-6.3 Contemporary (960mm equiv. APS-C)" },
      { label: "Resolución de archivo", value: "32,5 Megapíxeles · RAW sin alteración generativa" },
      { label: "Enclaves documentados", value: "Monfragüe, Sierra de Gredos, Candelario, Canarias" },
      { label: "Modalidad de cesión", value: "Licencia Editorial y Comercial Rights-Managed" },
    ],
    process: [
      {
        step: "01",
        title: "Identificación de Obras o Especie",
        description:
          "Selección directa desde el archivo online (/portfolio/fauna-naturaleza) o definición de un encargo de campo específico.",
      },
      {
        step: "02",
        title: "Cálculo de Licencia RM",
        description:
          "Presupuesto transparente según tirada, soporte (impreso, digital, expositivo), territorio y duración temporal.",
      },
      {
        step: "03",
        title: "Entrega de Máster TIFF / JPEG",
        description:
          "Envío inmediato del archivo de máxima resolución calibrado junto al certificado de licencia de reproducción.",
      },
    ],
    faqs: [
      {
        q: "¿En qué condiciones están tomadas las fotografías de fauna y llevan IA?",
        a: "Sin alteraciones ni elementos generados por IA: todas las imágenes cuentan con metadatos EXIF verificables y revelado respetuoso con la luz natural original. Lugar y condiciones se indican en cada ficha.",
      },
      {
        q: "¿Cómo puedo solicitar una licencia urgente para una revista o libro?",
        a: "Puedes indicar el título o código de la obra desde la página de Licencias (/licensing) o el formulario de contacto. La disponibilidad y envío de los archivos se coordinan directamente al formalizar la licencia.",
      },
    ],
    primaryCta: {
      label: "Solicitar Licencia o Encargo",
      href: "/licensing",
    },
    secondaryCta: {
      label: "Explorar Archivo de Fauna y Naturaleza",
      href: "/portfolio/fauna-naturaleza",
    },
  },
  {
    slug: "copias-fine-art-coleccionismo",
    serviceId: "prints-interiorismo",
    kicker: "Ediciones Limitadas · Hahnemühle Photo Rag® 308g",
    title: "Obra Gráfica Fine Art para Coleccionismo e Interiorismo",
    seoTitle: "Copias Fine Art Hahnemühle y Fotografía de Autor para Interiorismo",
    seoDescription:
      "Impresiones Fine Art de edición limitada sobre papel 100% algodón Hahnemühle Photo Rag 308 g/m² (ISO 9706). Asesoramiento para coleccionistas, estudios de interiorismo y hoteles boutique.",
    subtitle:
      "Series numeradas y firmadas sobre papel 100% algodón de calidad museo (norma ISO 9706), producidas para coleccionistas privados, estudios de interiorismo y espacios corporativos.",
    category: "paisajes-documental",
    heroImage: "/images/portfolio/paisajes-documental/cumbre-nevada-al-alba.jpg",
    intro: [
      "Cada copia Fine Art se concibe como un objeto físico perdurable. Se imprime por encargo individual mediante sistema Giclée de 12 tintas pigmentadas sobre papel 100% algodón Hahnemühle Photo Rag® de 308 g/m², libre de ácidos y blanqueadores ópticos conforme a la norma de conservación ISO 9706.",
      "Colaboro con estudios de interiorismo, despachos profesionales, hoteles boutique y coleccionistas particulares para comisariar obras individuales, dípticos o series completas adaptadas a la escala arquitectónica y temperatura lumínica de cada estancia.",
    ],
    deliverables: [
      `Valoración individualizada por obra: Estudio (${FORMAT_RANGES.estudio.min}–${FORMAT_RANGES.estudio.max} €), Galería (${FORMAT_RANGES.galeria.min}–${FORMAT_RANGES.galeria.max} €) y Gran Colección (${FORMAT_RANGES.coleccion.min}–${FORMAT_RANGES.coleccion.max} €)`,
      "Soporte asignado según la luz de cada captura: Algodón 100% Mate (308g) o Baritado Satinado de Sulfato de Bario (340g)",
      "Certificado de autenticidad numerado y firmado a mano por Javier Espinosa Martínez (máximo 12 a 30 copias por obra)",
      "Asesoramiento visual y simulación a escala real en sala (/prints)",
      "Expedición exclusiva en tubo rígido de alta densidad (sin enmarcar) con papel tisú libre de ácido y envío asegurado",
    ],
    idealFor:
      "Coleccionistas de fotografía contemporánea, estudios de diseño de interiores, arquitectos, hoteles con encanto y sedes corporativas.",
    technicalSpecs: [
      { label: "Soportes museo", value: "Hahnemühle Photo Rag® 308g & Canson Baryta II 340g" },
      { label: "Longevidad certificada", value: "Norma ISO 9706 · Tintas pigmentadas de archivo" },
      { label: "Tiradas máximas", value: "12 a 30 ejemplares totales por obra (Objeto de Arte Original)" },
      { label: "Modalidad de entrega", value: "Impresión Fine Art con margen blanco · Envío en tubo rígido" },
    ],
    process: [
      {
        step: "01",
        title: "Comisariado y Simulación en Sala",
        description:
          "Selección de la obra o díptico en el simulador interactivo de escala (/prints) o mediante asesoramiento directo según tu espacio.",
      },
      {
        step: "02",
        title: "Prueba de Color e Impresión Giclée",
        description:
          "Impresión bajo perfil ICC específico para papel de algodón mate o baritado satinado en laboratorio especializado de Tenerife.",
      },
      {
        step: "03",
        title: "Firma, Numeración y Certificado",
        description:
          "Registro en el libro de ediciones del autor y emisión del Certificado de Autenticidad firmado.",
      },
      {
        step: "04",
        title: "Envío Asegurado en Tubo Rígido",
        description:
          "Expedición de la lámina protegida con papel tisú neutro dentro de un tubo rígido indeformable de alta densidad.",
      },
    ],
    faqs: [
      {
        q: "¿Por qué las obras se envían únicamente en tubo rígido sin enmarcar?",
        a: "Enviar la lámina Fine Art enrollada con papel tisú libre de ácido en un tubo rígido de alta densidad evita roturas de cristal en tránsito desde Tenerife, elimina sobrecostes volumétricos de transporte y permite al coleccionista enmarcar la obra en su ciudad con total seguridad.",
      },
      {
        q: "¿Ofreces condiciones especiales para estudios de interiorismo o proyectos de varias obras?",
        a: "Sí. Para proyectos de interiorismo, hoteles o adquisiciones de 3 o más obras (series y dípticos), se elabora una propuesta a medida con asesoramiento de formatos y papeles.",
      },
      {
        q: `¿Puedo adquirir cualquiera de las ${WORKS.length} obras directamente online?`,
        a: `Sí. Las ${WORKS.length} obras del archivo cuentan con valoración individual desde su ficha o desde el catálogo Fine Art (/prints).`,
      },
    ],
    primaryCta: {
      label: "Abrir Catálogo y Simulador Fine Art",
      href: "/prints",
    },
    secondaryCta: {
      label: "Consultar Proyecto de Interiorismo",
      href: "/contact?servicio=prints-interiorismo&motivo=Print%20Fine%20Art",
    },
  },
];

export function getServiceLandingBySlug(slug: string): ServiceLanding | undefined {
  return SERVICE_LANDINGS.find((s) => s.slug === slug);
}
