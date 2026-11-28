import { PLAZOS } from "@/data/plazos";
import type { SiteLang } from "@/lib/i18n-helpers";

export interface CuadernoPostTranslationEn {
  title?: string;
  subtitle?: string;
  date?: string;
  categoryLabel?: string;
  body?: string[];
  ctaLabel?: string;
}

export interface CuadernoPost {
  slug: string;
  number: string;
  title: string;
  subtitle: string;
  date: string;
  author: string;
  categoryLabel: string;
  relatedWorkSlug: string;
  status: "borrador" | "publicado";
  body: string[];
  cta: {
    label: string;
    href: string;
  };
  en?: CuadernoPostTranslationEn;
}

export interface SiteSettings {
  authorPortraitUrl: string;
  showAuthorPortrait: boolean;
  showCuaderno: boolean;
  contactEmail: string;
  whatsappNumber: string;
  instagramUrl: string;
  locationLabel: string;
  basePrintPrice: number;
  baseCommissionPrice: number;
  baseLicensePrice: number;
}

export const SITE_SETTINGS: SiteSettings = {
  "authorPortraitUrl": "/images/portfolio/hero/hero.jpg",
  "showAuthorPortrait": false,
  "showCuaderno": true,
  "contactEmail": "javierespinosa1995@hotmail.com",
  "whatsappNumber": "",
  "instagramUrl": "https://www.instagram.com/Javier.espinosa19/",
  "locationLabel": "Puerto de la Cruz · Tenerife (Islas Canarias)",
  "basePrintPrice": 95,
  "baseCommissionPrice": 150,
  "baseLicensePrice": 45
};

export const PAGOS_ACTIVOS: boolean =
  process.env.NEXT_PUBLIC_STRIPE_ACTIVE === "true";

const DEFAULT_SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "https://javier-photography.vercel.app");

export const SITE_CONFIG = {
  siteUrl: DEFAULT_SITE_URL,
  siteHost: DEFAULT_SITE_URL.replace(/^https?:\/\//, "").replace(/\/$/, ""),
  siteName: "Javier Espinosa Fotografía",
  authorName: "Javier Espinosa Martínez",
  contactEmail: SITE_SETTINGS.contactEmail,
  locationLabel: SITE_SETTINGS.locationLabel,
  locationLabelEn: "Puerto de la Cruz · Tenerife (Canary Islands)",
  pagosActivos: PAGOS_ACTIVOS,
  social: {
    instagram: SITE_SETTINGS.instagramUrl,
    saatchi: "https://www.saatchiart.com/javier-espinosa-photography",
    getty:
      "https://www.istockphoto.com/portfolio/JavierEspinosa?sort=purerecency&assettype=image",
  },
  plazos: PLAZOS,
  navigation: [
    { href: "/portfolio", labelEs: "Fotos", labelEn: "Photos" },
    { href: "/prints", labelEs: "Comprar Láminas", labelEn: "Buy Prints" },
    { href: "/about", labelEs: "Sobre mí", labelEn: "About" },
    { href: "/contact", labelEs: "Contacto", labelEn: "Contact" },
  ],
} as const;

export const CUADERNO_POSTS: CuadernoPost[] = [
  {
    "slug": "borrador-01-observacion-fauna-600mm",
    "number": "01",
    "title": "Fotografía de fauna a 600mm: distancia y luz natural",
    "subtitle": "Guía de campo con Canon EOS R7 y Sigma 150-600mm sobre silencio, luz natural y comportamiento animal en libertad.",
    "date": "2026-11-28",
    "author": "Javier Espinosa Martínez",
    "categoryLabel": "Fauna y Naturaleza",
    "relatedWorkSlug": "cuervo-canario-ante-las-cumbres",
    "status": "publicado",
    "body": [
      "En fotografía de fauna salvaje, acercarse demasiado casi siempre arruina la imagen antes de pulsar el disparador. Cuando el animal detecta tensión o persecución, desaparece su conducta natural y solo queda una fotografía de huida o alerta forzada. Por eso el teleobjetivo largo no es un capricho técnico para conseguir primeros planos apretados, sino una herramienta ética para mantener distancia de respeto y dejar espacio alrededor del sujeto.",
      "Con el sensor APS-C de la Canon EOS R7 y el Sigma 150-600mm Contemporary, trabajar en los 600mm reales permite observar la escena desde lejos sin alterar el ritmo de una garza en un humedal, de una cigüeña blanca cruzando una pradera húmeda bajo la lluvia en la Selva Negra (f/6.3 · 1/1250s · ISO 2000) o de un venado erguido en lo alto de la dehesa extremeña (600mm · f/5.6 · 1/1000s · ISO 250).",
      "La regla más útil que he aprendido en el campo consiste en moverse poco y mirar mucho antes de levantar la cámara. En la costa volcánica de Tenerife o en los riscos ventosos del Macizo de Anaga, muchas veces un ave no exige 600mm si uno sabe anticipar su trayectoria con calma: «Guardián de las Cumbres» y «Abanico de Viento» nacieron a 50mm y 44mm con el Canon RF-S 18-150mm (1/800s y 1/1250s), dejando que el cuervo canario ocupara su escala exacta frente al paisaje.",
      "Respecto a la luz, nunca utilizo flash ni iluminación artificial en fauna ni empleo cebos para provocar poses. Prefiero esperar el giro de cabeza hacia un claro de luz suave o asumir ISO altos cuando cae la tarde bajo arbolado denso —como ocurre a 600mm en «Quietud Esmeralda» (1/1000s · ISO 6400) o en «Sombra entre las Hojas» (f/5.6 · 1/640s · ISO 6400)— antes que forzar artificialmente una escena que perdería su atmósfera original.",
      "Para aves y mamíferos en movimiento suelo partir de velocidades de obturación entre 1/800s y 1/1250s con apertura f/5.6 o f/6.3, priorizando la nitidez en el ojo y cuidando el fondo para que el desenfoque del teleobjetivo limpie las distracciones. Incluso un vuelvepiedras común sobre lava negra mojada a 150mm (f/5.6 · 1/1000s · ISO 400) gana presencia cuando el brillo plateado del Atlántico se convierte en un lienzo limpio detrás del plumaje.",
      "Por último, considero imprescindible la transparencia documental: cada ficha del archivo especifica si el encuentro se produjo en total libertad, en un parque natural o en un santuario de conservación como el de Austria donde retraté al lince boreal y al lobo. La fotografía de naturaleza gana valor y credibilidad cuando no oculta el contexto real en que fue tomada."
    ],
    "cta": {
      "label": "Ver colección Fauna y Naturaleza",
      "href": "/portfolio/fauna-naturaleza"
    },
    "en": {
      "title": "Wildlife photography at 600mm: distance & natural light",
      "subtitle": "Field notes with the Canon EOS R7 and Sigma 150-600mm on patience, natural light, and authentic animal behavior.",
      "date": "2026-11-28",
      "categoryLabel": "Wildlife & Nature",
      "ctaLabel": "Explore Wildlife & Nature collection",
      "body": [
        "In wildlife photography, getting too close almost always spoils the frame before the shutter is pressed. The moment an animal senses pressure, natural behavior vanishes and only a tense posture remains. That is why a long telephoto lens is not just a way to isolate a subject, but an ethical tool to keep respectful distance and preserve breathing room around the animal.",
        "Pairing the APS-C Canon EOS R7 with the Sigma 150-600mm Contemporary allows quiet observation from afar: whether following a white stork walking across a rain-soaked meadow in Germany's Black Forest at 600mm (f/6.3 · 1/1250s · ISO 2000) or waiting for a red stag standing tall in Extremadura's oak pastures (600mm · f/5.6 · 1/1000s · ISO 250).",
        "One of the most reliable field habits is moving slowly and reading the terrain before raising the camera. On Tenerife's volcanic shoreline or the windswept ridges of the Anaga massif, a bird does not always call for 600mm when you wait quietly along its flight line: both 'Guardian of the Peaks' and 'Wing Fan in the Wind' were captured at 50mm and 44mm with the Canon RF-S 18-150mm (1/800s and 1/1250s), showing the Canary raven in dialogue with the landscape.",
        "I never use flash or artificial lighting on wildlife, nor bait to stage an encounter. I would rather wait for natural light filtering through canopy gaps—even pushing ISO cleanly at 600mm in low-light woodland frames like 'Emerald Stillness' (1/1000s · ISO 6400) or 'Shadow Among the Leaves' (f/5.6 · 1/640s · ISO 6400)—than flatten the mood of the scene.",
        "For moving birds and mammals, I typically start between 1/800s and 1/1250s around f/5.6 or f/6.3, locking critical focus on the eye while watching how the background softens. Even a ruddy turnstone perched on dark wet basalt at 150mm (f/5.6 · 1/1000s · ISO 400) stands out cleanly once the Atlantic surface turns into silver bokeh behind the plumage.",
        "Finally, honest labeling matters deeply: every work sheet states openly whether the sighting occurred in full freedom, inside a reserve, or within a conservation sanctuary such as the Austrian center where the boreal lynx and wolf portraits were photographed. Documentary integrity begins with full context."
      ]
    }
  },
  {
    "slug": "borrador-02-luz-y-bruma-en-tenerife",
    "number": "02",
    "title": "Luz de alba y bruma entre el Teide y Anaga",
    "subtitle": "Del frío mineral antes del amanecer en el Teide al bosque húmedo de laurisilva en Anaga y la costa atlántica.",
    "date": "2026-11-28",
    "author": "Javier Espinosa Martínez",
    "categoryLabel": "Paisajes y Territorio",
    "relatedWorkSlug": "cumbre-nevada-al-alba",
    "status": "publicado",
    "body": [
      "Pocas islas concentran tantos climas y texturas visuales en apenas unas decenas de kilómetros como Tenerife. En una misma jornada es posible pasar de la piedra volcánica helada de las cañadas del Parque Nacional del Teide antes del amanecer a la humedad densa de la laurisilva en el Macizo de Anaga y terminar la tarde frente al basalto oscuro golpeado por el océano Atlántico.",
      "En «Alba sobre el Volcán», la clave no estuvo en el momento en que el sol ya ilumina directamente la ladera, sino unos minutos antes de la salida solar. A 115mm con el Canon RF-S 18-150mm (f/6.3 · 1/25s · ISO 320), comprimir la perspectiva permitió destacar cómo las nubes altas se teñían de naranja suave mientras el cono nevado del Teide flotaba suspendido sobre la franja aún oscura del pinar canario.",
      "Cuando los vientos alisios empujan el mar de nubes contra las crestas de Anaga, el paisaje cambia por completo de carácter. En el interior del bosque, la luz directa desaparece y da paso a una difusión natural perfecta para leer el musgo, los troncos retorcidos de la laurisilva y la profundidad de los senderos. Trabajando en gran angular a 18mm («El Aliento del Monte», f/3.5 · 1/40s · ISO 640) y a 24mm («Luz en la Laurisilva», f/4.0 · 1/40s · ISO 250), conviene medir con cuidado las altas luces de la niebla para no quemar el cielo entre las copas.",
      "Para conservar el detalle en las sombras del bosque y en las texturas minerales de la roca volcánica, evito forzar HDR agresivos o colores estridentes en edición. La fuerza de estas imágenes reside precisamente en la transición sutil de temperaturas: del azul frío de la sombra húmeda al ámbar tenue del primer rayo sobre la bruma.",
      "Al descender hacia la costa norte y oeste de la isla, el protagonismo pasa a la geología viva del litoral. En «Páginas de Tierra y Sal» (50mm · f/5.6 · 1/800s · ISO 250) y en los acantilados atlánticos al caer la tarde, la luz rasante dibuja cada estrato volcánico antes de fundirse con la espuma del mar.",
      "Todas estas fotografías forman el hilo conductor de la serie «Entre la Bruma y el Volcán», pensada como un recorrido vertical desde los más de tres mil metros de cumbre hasta la orilla negra de las Islas Canarias, y disponible en edición limitada sobre papel 100% algodón Hahnemühle Photo Rag 308g."
    ],
    "cta": {
      "label": "Explorar serie Entre la Bruma y el Volcán",
      "href": "/projects/entre-la-bruma-y-el-volcan"
    },
    "en": {
      "title": "Dawn light and trade-wind mist: Teide to Anaga",
      "subtitle": "From pre-sunrise frost on Mount Teide to misty laurel forests in Anaga and the volcanic coast.",
      "date": "2026-11-28",
      "categoryLabel": "Landscapes & Territory",
      "ctaLabel": "Explore Between Mist & Volcano series",
      "body": [
        "Few islands pack such distinct climates and visual textures within a short drive as Tenerife. In a single day, you can stand before frozen volcanic slopes in Teide National Park before sunrise, walk into cloud-soaked laurel forest trails across the Anaga massif, and watch dusk settle over black basalt cliffs along the Atlantic coast.",
        "In 'Dawn over the Volcano', the defining moment arrived minutes before the sun actually broke over the horizon. Shooting at 115mm with the Canon RF-S 18-150mm (f/6.3 · 1/25s · ISO 320), telephoto compression separated the warm high clouds and snow-dusted cone of Mount Teide from the deep shadow covering the pine ridge below.",
        "When Atlantic trade winds push mist across the ridges of Anaga, harsh contrast disappears and the forest turns into a natural softbox. Inside the ancient laurel canopy, wide focal lengths—18mm in 'Breath of the Forest' (f/3.5 · 1/40s · ISO 640) and 24mm in 'Light in the Laurel Forest' (f/4.0 · 1/40s · ISO 250)—require careful highlight metering so mist glowing between branches preserves delicate tonal detail.",
        "Rather than pushing aggressive HDR curves or oversaturated color in post-processing, I aim to respect the quiet tonal shifts found on site: cool blue shadow under damp moss balanced against subtle amber warmth filtering through drifting fog.",
        "Descending toward the shoreline shifts attention back to raw volcanic geology. In 'Pages of Earth and Salt' (50mm · f/5.6 · 1/800s · ISO 250) and coastal twilight frames, low angled sunlight reveals every layered lava stratum just above white ocean surf.",
        "Together, these photographs form the monographic series 'Between Mist & Volcano', conceived as a vertical journey from Tenerife's high volcanic summits down to black Atlantic sand, offered in signed limited editions on 100% cotton Hahnemühle Photo Rag 308g paper."
      ]
    }
  },
  {
    "slug": "borrador-03-tramo-y-asistencia-rally-historico",
    "number": "03",
    "title": "Fotografía de rally clásico: tramo y asistencia",
    "subtitle": "Crónica visual en el 52º Rallye Orvecame Isla Tenerife Histórico entre el parque de trabajo y el tramo de El Tanque.",
    "date": "2026-11-28",
    "author": "Javier Espinosa Martínez",
    "categoryLabel": "Coches y Rally",
    "relatedWorkSlug": "cruzada-sobre-el-asfalto",
    "status": "publicado",
    "body": [
      "Un rally histórico no se explica solo a través de derrapadas y frenadas al límite. La mitad de su historia ocurre horas antes o entre bucles, bajo las carpas del parque de asistencia, donde los mecánicos revisan reglajes a mano, los pilotos repasan las notas sobre el capó y la chapa veterana guarda la huella de décadas de competición.",
      "Durante la cobertura del 52º Rallye Orvecame Isla Tenerife Histórico quise contar ambas caras de la prueba. En el parque de trabajo, focales versátiles entre 18mm y 50mm con el Canon RF-S 18-150mm permiten integrarse con discreción sin estorbar al equipo: «Calma antes del Tramo» (18mm · f/8.0 · 1/800s · ISO 640) y «Últimas Notas» (44mm · f/8.0 · 1/160s · ISO 160) capturan ese instante previo de concentración antes de enfundarse el casco.",
      "Ya en el tramo de El Tanque, la prioridad absoluta es siempre la seguridad: estudiar el rutómetro con antelación, llegar antes del cierre de carretera y colocarse en zonas elevadas o exteriores seguros, nunca en escapatorias peligrosas. Desde una posición segura, el Sigma 150-600mm permite trabajar lejos de la trazada mientras transmite toda la cercanía del ataque en curva.",
      "Para transmitir carácter sin perder nitidez alterno dos enfoques muy distintos. Cuando quiero congelar el instante mecánico —una rueda interior levantada en «Al Límite del Vértice» (150mm · f/5.6 · 1/1000s · ISO 400) o el rastro de goma quemada en «Humo y Asfalto» (150mm · f/5.6 · 1/800s · ISO 400)— subo la velocidad para clavar carrocería y mirada del piloto bajo el parabrisas.",
      "En cambio, cuando el vehículo cruza en paralelo por zonas de bosque o muro cercano, bajar la obturación a 1/160s o menos acompañando el giro con barrido suave —como en «Colores de la Memoria» (50mm · f/8.0 · 1/160s · ISO 125) o en «Mirada Ámbar» sobre el frontal del BMW E30 (18mm · f/4.5 · 1/160s · ISO 800)— introduce sensación real de velocidad sobre el asfalto sin perder foco en los faros ni en la librea clásica.",
      "La serie completa «Trazadas y Paddock» reúne dieciséis escenas del rally histórico en Tenerife y sirve también como referencia de trabajo para equipos, escuderías, pilotos privados y medios de motor que necesitan reportajes fieles y entrega ágil tras cada prueba."
    ],
    "cta": {
      "label": "Consultar cobertura de Rally Histórico",
      "href": "/servicios/fotografo-rally-motorsport"
    },
    "en": {
      "title": "Classic rally photography: stage action & paddock",
      "subtitle": "Visual notes from the 52nd Rallye Orvecame Isla Tenerife Histórico across service tents and the El Tanque stage.",
      "date": "2026-11-28",
      "categoryLabel": "Cars & Historic Rally",
      "ctaLabel": "Inquire Historic Rally coverage",
      "body": [
        "A historic rally cannot be told through flat-out slides and late braking alone. Half of its character unfolds inside the service park, beneath open tents where mechanics tune carburetors by ear, crews double-check pacenotes across a warm hood, and weathered paintwork shows the honest patina of decades of competition.",
        "Covering the 52nd Rallye Orvecame Isla Tenerife Histórico meant capturing both chapters equally. In the service area, walking calmly with the Canon RF-S 18-150mm between 18mm and 50mm stays out of the mechanics' way while preserving context: 'Calm Before the Stage' (18mm · f/8.0 · 1/800s · ISO 640) and 'Final Pacenotes' (44mm · f/8.0 · 1/160s · ISO 160) record that quiet focus right before helmets go on.",
        "Out on the El Tanque special stage, safety comes before every photograph. Studying the roadbook and road-closure timings ahead of the event makes it possible to reach elevated banks well clear of run-off areas, letting the Sigma 150-600mm bridge the gap from a safe vantage point without losing cornering intensity.",
        "Technically, I alternate between two deliberate shutter speeds depending on the corner. To freeze chassis weight transfer—an inside front tire lifting cleanly in 'On the Edge of the Apex' (150mm · f/5.6 · 1/1000s · ISO 400) or drifting tire smoke in 'Smoke and Tarmac' (150mm · f/5.6 · 1/800s · ISO 400)—faster shutter speeds lock down the metalwork and driver's helmet through the windshield.",
        "Where barriers and trees sit closer to the tarmac, slowing down to 1/160s with smooth horizontal panning—seen in 'Colors of Memory' (50mm · f/8.0 · 1/160s · ISO 125) and 'Amber Gaze' on the BMW E30 front grille (18mm · f/4.5 · 1/160s · ISO 800)—preserves true wheel rotation and motion blur while keeping classic liveries and yellow rally lamps tack sharp.",
        "The full series 'Racing Lines & Paddock' brings together sixteen scenes from historic rallying in Tenerife and anchors commission coverage available for privateers, classic teams, and motorsport publications."
      ]
    }
  }
];

export const CUADERNO_POSTS_EN: Record<
  string,
  Pick<CuadernoPost, "title" | "subtitle" | "date" | "categoryLabel" | "body" | "cta">
> = Object.fromEntries(
  CUADERNO_POSTS.filter((p) => p.en).map((p) => [
    p.slug,
    {
      title: p.en?.title || p.title,
      subtitle: p.en?.subtitle || p.subtitle,
      date: p.en?.date || p.date,
      categoryLabel: p.en?.categoryLabel || p.categoryLabel,
      body: p.en?.body && p.en.body.length > 0 ? p.en.body : p.body,
      cta: {
        label: p.en?.ctaLabel || p.cta.label,
        href: p.cta.href,
      },
    },
  ])
);

export function getLocalizedCuadernoPost<T extends CuadernoPost>(post: T, lang: SiteLang): T {
  if (lang !== "en") return post;
  if (post.en) {
    return {
      ...post,
      title: post.en.title?.trim() || post.title,
      subtitle: post.en.subtitle?.trim() || post.subtitle,
      date: post.en.date?.trim() || post.date,
      categoryLabel: post.en.categoryLabel?.trim() || post.categoryLabel,
      body: post.en.body && post.en.body.length > 0 ? post.en.body : post.body,
      cta: {
        label: post.en.ctaLabel?.trim() || post.cta.label,
        href: post.cta.href,
      },
    };
  }
  const tr = CUADERNO_POSTS_EN[post.slug];
  if (!tr) return post;
  return { ...post, ...tr };
}
