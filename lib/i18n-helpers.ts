import type { FaunaCondiciones } from "@/types/photo";

export type SiteLang = "es" | "en";

export function pickLang<T>(lang: SiteLang, es: T, en: T): T {
  return lang === "en" ? en : es;
}

const COUNTRY_EN: Record<string, string> = {
  España: "Spain",
  Alemania: "Germany",
  Marruecos: "Morocco",
  Austria: "Austria",
};

export function translateCountry(country: string | undefined, lang: SiteLang): string | undefined {
  if (!country || lang !== "en") return country;
  return COUNTRY_EN[country] ?? country;
}

const CONDICIONES_EN: Record<FaunaCondiciones, string> = {
  silvestre: "Wild",
  santuario: "Sanctuary",
  cautiverio: "Captivity",
  "sin indicar": "Unspecified",
};

export function translateCondiciones(
  condiciones: FaunaCondiciones | undefined,
  lang: SiteLang
): string | undefined {
  if (!condiciones) return undefined;
  if (lang !== "en") return condiciones;
  return CONDICIONES_EN[condiciones] ?? condiciones;
}

const LOCATION_EN: Record<string, string> = {
  "Tenerife, Islas Canarias": "Tenerife, Canary Islands",
  "Humedal Ibérico": "Iberian Wetland",
  "Santuario de Fauna Salvaje, Austria": "Wildlife Sanctuary, Austria",
  "Parque Nacional de Monfragüe, Cáceres": "Monfragüe National Park, Cáceres",
  "Sierra de Gredos": "Sierra de Gredos",
  "Costa de Tenerife, Islas Canarias": "Coast of Tenerife, Canary Islands",
  "Parque Nacional del Teide, Tenerife": "Teide National Park, Tenerife",
  "Litoral Atlántico, Canarias": "Atlantic Coast, Canary Islands",
  "Costa Norte de Tenerife, Canarias": "North Coast of Tenerife, Canary Islands",
  "Costa Atlántica, Tenerife": "Atlantic Coast, Tenerife",
  "Desierto del Sahara": "Sahara Desert",
  "Cordillera Ibérica": "Iberian System",
  "52º Rallye Orvecame Isla Tenerife Histórico · Tenerife":
    "52nd Rallye Orvecame Isla Tenerife Histórico · Tenerife",
  "Tramo de El Tanque · 52º Rallye Orvecame Isla Tenerife Histórico":
    "El Tanque Stage · 52nd Rallye Orvecame Isla Tenerife Histórico",
  "El Puerto de Santa María, Cádiz": "El Puerto de Santa María, Cádiz",
  "Monte de Laurisilva, Canarias": "Laurel Forest, Canary Islands",
  "Macizo de Anaga, Tenerife": "Anaga Massif, Tenerife",
  "Jardín Histórico": "Historic Garden",
  "Paseo Urbano": "Urban Promenade",
  "Cruces de Mayo · Los Realejos, Tenerife": "May Crosses · Los Realejos, Tenerife",
  "Plaza Jemaa el-Fna, Marrakech": "Jemaa el-Fna Square, Marrakech",
  "Bosque Caducifolio Ibérico": "Iberian Deciduous Forest",
  "Selva Negra, Alemania": "Black Forest, Germany",
  "Medina de Marrakech": "Medina of Marrakech",
  "Garganta de la Sierra de Gredos": "Sierra de Gredos Gorge",
  "Dehesa Ibérica, Extremadura": "Iberian Dehesa, Extremadura",
  "Villanueva de la Vera, Cáceres": "Villanueva de la Vera, Cáceres",
  "Madrasa de Marrakech": "Marrakech Madrasa",
  "Monte Mediterráneo": "Mediterranean Scrubland",
  "Zoco de Marrakech": "Marrakech Souk",
  "Costa Volcánica, Islas Canarias": "Volcanic Coast, Canary Islands",
  Marrakech: "Marrakech",
  "Kasbah del Alto Atlas": "High Atlas Kasbah",
  "Palacio de la Bahía, Marrakech": "Bahia Palace, Marrakech",
  "Zoco de los Carpinteros, Marrakech": "Carpenters' Souk, Marrakech",
  "Cordillera del Alto Atlas": "High Atlas Mountains",
  "Valle del Sur y Alto Atlas": "Southern Valley & High Atlas",
  "Costa Atlántica, Islas Canarias": "Atlantic Coast, Canary Islands",
  "Costa Volcánica, Tenerife": "Volcanic Coast, Tenerife",
  "Encinar Ibérico": "Iberian Holm Oak Woodland",
  "Puerto de la Cruz, Tenerife": "Puerto de la Cruz, Tenerife",
  // realLocation / lugar / evento
  "Tenerife, Islas Canarias (medianías y zonas arboladas)":
    "Tenerife, Canary Islands (midlands & wooded areas)",
  "Tenerife, Islas Canarias (costas y zonas arboladas)":
    "Tenerife, Canary Islands (coasts & wooded areas)",
  "Humedal acuático en medio natural": "Natural wetland habitat",
  "Santuario de fauna salvaje, Austria": "Wildlife sanctuary, Austria",
  "Parque Nacional de Monfragüe, Cáceres (Salto del Gitano)":
    "Monfragüe National Park, Cáceres (Salto del Gitano)",
  "Sierra de Gredos, Ávila / Cáceres": "Sierra de Gredos, Ávila / Cáceres",
  "Puerto de la Cruz / Norte de Tenerife, Islas Canarias":
    "Puerto de la Cruz / North Tenerife, Canary Islands",
  "Estanque y humedal natural, Península Ibérica":
    "Natural pond & wetland, Iberian Peninsula",
  "Bosque caducifolio, Península Ibérica": "Deciduous forest, Iberian Peninsula",
  "Selva Negra (Schwarzwald), Alemania": "Black Forest (Schwarzwald), Germany",
  "Garganta de la Sierra de Gredos, Cáceres / Ávila":
    "Sierra de Gredos Gorge, Cáceres / Ávila",
  "Dehesa de Extremadura": "Extremadura Dehesa",
  "Sierra de Gredos / La Vera, Cáceres": "Sierra de Gredos / La Vera, Cáceres",
  "Parque Rural de Anaga, Tenerife": "Anaga Rural Park, Tenerife",
  "Costa Norte de Tenerife, Islas Canarias": "North Coast of Tenerife, Canary Islands",
  "Costa Volcánica de Tenerife, Islas Canarias": "Volcanic Coast of Tenerife, Canary Islands",
  "Litoral Atlántico de Tenerife, Islas Canarias": "Atlantic Coast of Tenerife, Canary Islands",
  "Encinar y dehesa ibérica": "Iberian holm oak woodland & dehesa",
  "Tenerife, Islas Canarias (zonas arboladas)": "Tenerife, Canary Islands (wooded areas)",
  "Tramo de El Tanque, Tenerife": "El Tanque Stage, Tenerife",
  Tenerife: "Tenerife",
  "52º Rallye Orvecame Isla Tenerife Histórico":
    "52nd Rallye Orvecame Isla Tenerife Histórico",
};

export function translateLocation(loc: string | undefined, lang: SiteLang): string | undefined {
  if (!loc || lang !== "en") return loc;
  return LOCATION_EN[loc] ?? loc;
}

export function translatePaper(paper: string, lang: SiteLang): string {
  if (lang !== "en") return paper;
  if (paper.includes("Baritado")) {
    return "Canson Infinity Baryta Photographique II 340g / Hahnemühle FineArt Baryta 325g (Baryta Satin)";
  }
  return "Hahnemühle Photo Rag® 308g / Canson Rag Photographique 310g (100% Cotton Matte)";
}

export function translateMaxFormatReason(
  reason: string | undefined,
  lang: SiteLang
): string | undefined {
  if (!reason || lang !== "en") return reason;

  let m = reason.match(
    /^Archivo máster de ([\d,]+ MP)(?: con reducción de ruido AI)? \(ISO (\d+)\) apto para ampliación hasta Gran Colección \(([^)]+)\)\.$/
  );
  if (m) {
    const aiNote = reason.includes("con reducción de ruido AI") ? " with AI noise reduction" : "";
    return `${m[1].replace(",", ".")} master file${aiNote} (ISO ${m[2]}) suitable for enlargement up to Grand Collection (${m[3]}).`;
  }

  m = reason.match(
    /^Captura nocturna o en penumbra a ISO (\d+): formato máximo recomendado Galería \(([^)]+)\).*$/
  );
  if (m) {
    return `Night or low-light capture at ISO ${m[1]}: maximum recommended format is Gallery (${m[2]}) to preserve organic film-like grain texture without over-enlarging to 70 × 100 cm.`;
  }

  m = reason.match(/^Captura en sombra densa a ISO (\d+): formato máximo recomendado Galería \(([^)]+)\).*$/);
  if (m) {
    return `Deep-shade capture at ISO ${m[1]}: maximum recommended format is Gallery (${m[2]}) to preserve fine feather detail.`;
  }

  if (reason.includes("750D")) {
    m = reason.match(/Galería \(([^)]+)\)/);
    const dims = m ? m[1] : "50 × 70 cm";
    return `Original Canon EOS 750D sensor (24.2 MP): maximum recommended format is Gallery (${dims}) to ensure optical print density ≥ 240 ppi. 70 × 100 cm is unavailable for this work.`;
  }

  return reason;
}

const DISCIPLINE_EN: Record<string, string> = {
  DOCUMENTAL: "DOCUMENTARY",
  PAISAJE: "LANDSCAPE",
  MOTOR: "MOTORSPORT",
  FAUNA: "WILDLIFE",
  ARQUITECTURA: "ARCHITECTURE",
};

export function translateDiscipline(discipline: string, lang: SiteLang): string {
  if (lang !== "en") return discipline;
  return DISCIPLINE_EN[discipline] ?? discipline;
}
