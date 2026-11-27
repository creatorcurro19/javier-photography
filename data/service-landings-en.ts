import type { ServiceLanding } from "@/data/service-landings";
import { getFormatPriceRanges } from "@/data/formatos";
import { PLAZOS_EN } from "@/data/plazos";
import { WORKS } from "@/data/works";
import type { SiteLang } from "@/lib/i18n-helpers";

const FORMAT_RANGES = getFormatPriceRanges(WORKS);

export const SERVICE_AREA_EN = {
  base: "Tenerife (Canary Islands)",
  primaryRegions: [
    "Tenerife & Canary Islands",
    "Madrid",
    "Salamanca & Castile and León",
    "Extremadura & Sierra de Gredos",
  ],
  scope: "Canary Islands · Available to travel",
} as const;

type ServiceLandingTranslation = Pick<
  ServiceLanding,
  | "kicker"
  | "title"
  | "subtitle"
  | "intro"
  | "deliverables"
  | "idealFor"
  | "technicalSpecs"
  | "process"
  | "faqs"
  | "primaryCta"
  | "secondaryCta"
>;

export const SERVICE_LANDINGS_EN: Record<string, ServiceLandingTranslation> = {
  "fotografo-rally-motorsport": {
    kicker: "Motorsport · Historic Rally & Competition",
    title: "Rally, Motorsport & Classic Car Photography",
    subtitle: `Full special-stage, service park, and paddock coverage for rally teams, drivers, and organizers from ${SERVICE_AREA_EN.base} with travel across Spain.`,
    intro: [
      "On a rally stage things unfold in fractions of a second, so knowing the terrain before car one arrives makes all the difference. I work both trackside and inside the service park to capture not only hard braking and cornering lines, but also mechanics under the canopy, pacenotes on a hood, and the lived-in details of each classic machine.",
      "Based in Tenerife (Canary Islands) and available to travel across mainland Spain, I pair a 600mm super-telephoto on stage with wider optics in paddock to deliver complete coverage for drivers, teams, organizers, and press.",
    ],
    deliverables: [
      "Multi-location special stage coverage (hairpins, loaded bends, crests, and starts)",
      "Documentary coverage in the service park, scrutineering, and crew briefings",
      PLAZOS_EN.rallyPrensa,
      "Private Client Gallery delivery (/cliente) with calibrated 32.5 MP master files (TIFF / JPEG 300 DPI)",
      "Optional certified Fine Art enlargement on Hahnemühle Photo Rag 308g cotton paper",
    ],
    idealFor:
      "Historic and speed rally teams, privateer drivers, event organizers, technical sponsors, and classic competition car owners.",
    technicalSpecs: [
      { label: "Primary body", value: "Canon EOS R7 (32.5 MP · High-speed AF II burst)" },
      { label: "Stage telephoto", value: "Sigma 150-600mm f/5-6.3 DG OS HSM Contemporary" },
      { label: "Paddock optics", value: "Canon RF-S 18-150mm & EF-S 10-18mm" },
      { label: "Coverage area", value: SERVICE_AREA_EN.scope },
    ],
    process: [
      {
        step: "01",
        title: "Roadbook & Entry List Study",
        description:
          "Advance review of stages, road-closure schedules, sun orientation, and priority team or car numbers.",
      },
      {
        step: "02",
        title: "Paddock & Special Stage",
        description:
          "Coverage from scrutineering and service park work right through key technical corners on every pass.",
      },
      {
        step: "03",
        title: "Priority Press Selection",
        description: `${PLAZOS_EN.rallyPrensa} Priority edit for sponsor updates and media coverage.`,
      },
      {
        step: "04",
        title: "Private Master Gallery",
        description:
          "Password-protected Client Portal access to select final high-resolution frames or commission archival prints.",
      },
    ],
    faqs: [
      {
        q: "Can we book dedicated coverage for a single car or race number during a rally?",
        a: "Yes. You can commission dedicated coverage for a single crew or team (service marquee, mechanics, and every stage pass) as well as full event documentation for organizers.",
      },
      {
        q: "When do we receive images for our sponsors?",
        a: `${PLAZOS_EN.rallyPrensa} ${PLAZOS_EN.reportajes} Delivered through the Private Client Portal.`,
      },
      {
        q: "Do you cover events outside Tenerife?",
        a: "Yes. Based in Tenerife (Canary Islands), I am available to travel by commission to historic rally events elsewhere.",
      },
    ],
    primaryCta: {
      label: "Request Rally Coverage",
      href: "/contact?servicio=rally-motor&motivo=Encargo",
    },
    secondaryCta: {
      label: "View Cars & Rally Archive",
      href: "/portfolio/coches-rally",
    },
  },
  "fotografo-arquitectura-espacio-urbano": {
    kicker: "Architecture · Heritage & Urban Geometry",
    title: "Architecture, Heritage & Interior Photography",
    subtitle:
      "Considered visual documentation of built architecture, heritage restoration, and interior spaces—respecting geometry, scale, and natural light.",
    intro: [
      "Architectural photography calls for patience with light and geometric discipline. Every building or heritage site has a brief hour when concrete, granite, timber, and shadow align cleanly without artificial distortion.",
      "I document projects for architectural practices, heritage foundations, boutique hotels, and interior designers across the Canary Islands, Madrid, Castile and León, and Extremadura for competition panels, editorial features, and project archives.",
    ],
    deliverables: [
      "Advance solar study planning daytime, blue-hour, and night exposures",
      "Strict control of verticals, perspective alignment, and natural material color",
      "Site-context views paired with architectural joinery and material details",
      "Calibrated 32.5 MP master files ready for print monographs, awards, and web",
      "Written commercial and editorial usage license tailored to the studio's scope",
    ],
    idealFor:
      "Architectural practices, building engineers, design developers, boutique hotels, heritage foundations, and interior designers.",
    technicalSpecs: [
      { label: "Architectural wide angle", value: "Canon EF-S 10-18mm f/4.5-5.6 IS STM" },
      { label: "Detail & context lens", value: "Canon RF-S 18-150mm f/3.5-6.3 IS STM" },
      { label: "Sensor & dynamic range", value: "Canon EOS R7 (14-bit RAW · 32.5 MP)" },
      { label: "Regular areas", value: "Canary Islands, Madrid, Salamanca, Extremadura" },
    ],
    process: [
      {
        step: "01",
        title: "Drawings & Sun Orientation",
        description:
          "Review of elevations, facades, and materials to plan shoot timing around daylight direction.",
      },
      {
        step: "02",
        title: "Daylight & Dusk Shoot",
        description:
          "Unhurried exposures working with grazing daylight and balanced twilight interiors.",
      },
      {
        step: "03",
        title: "Precision Post-Production",
        description:
          "Individual optical correction, color-cast neutralization, and faithful stone, timber, and plaster textures.",
      },
      {
        step: "04",
        title: "Delivery & Editorial License",
        description:
          "Private gallery download with reproduction rights configured for portfolios, press, and awards.",
      },
    ],
    faqs: [
      {
        q: "How are usage rights structured between the architecture studio and collaborators?",
        a: "The agreement defines editorial and promotional usage for the commissioning practice and allows shared licensing if builders, engineers, or material suppliers also wish to use the shoot.",
      },
      {
        q: "Do you include blue-hour or nighttime photography?",
        a: "Yes. Dusk transition is often essential to balance exterior sky luminance with warm interior architectural lighting.",
      },
    ],
    primaryCta: {
      label: "Inquire Architecture Shoot",
      href: "/contact?servicio=arquitectura-territorio&motivo=Encargo",
    },
    secondaryCta: {
      label: "View Architecture Archive",
      href: "/portfolio/arquitectura-urbana",
    },
  },
  "proyectos-documentales-fotografia-editorial": {
    kicker: "Documentary · Crafts, Territory & Editorial",
    title: "Documentary Projects & Editorial Photography",
    subtitle:
      "Medium- and long-form photographic essays on traditional crafts, living heritage, and place for magazines, publishers, and cultural institutions.",
    intro: [
      "Documentary photography asks for time and discretion: stepping into a workshop or town square without disrupting what unfolds, working with available light and letting people continue their work unposed.",
      "I produce commissioned visual essays and editorial features for cultural publications, book publishers, foundations, and public institutions recording craftsmanship, vernacular heritage, and everyday life.",
    ],
    deliverables: [
      "Unstaged field documentation working strictly with ambient natural light",
      "Edited and sequenced visual stories ready for print layout or exhibition",
      "Calibrated master files (16-bit TIFF / 300 DPI JPEG) with contextual captions",
      "Written editorial or institutional reproduction rights scaled to the project",
    ],
    idealFor:
      "Book and magazine publishers, cultural and travel journals, public institutions, ethnographic museums, and foundations.",
    technicalSpecs: [
      { label: "Primary body", value: "Canon EOS R7 (14-bit RAW · 32.5 MP)" },
      { label: "Reportage lenses", value: "Canon RF-S 18-150mm & EF 50mm f/1.8 STM" },
      { label: "Master delivery", value: "16-bit TIFF / 300 DPI JPEG via Client Portal (/cliente)" },
      { label: "Coverage area", value: "Tenerife, Canary Islands, Iberian Peninsula & travel" },
    ],
    process: [
      {
        step: "01",
        title: "Research & Visual Brief",
        description:
          "Defining narrative angle, workshops or subjects, and shooting schedule on location.",
      },
      {
        step: "02",
        title: "Quiet Fieldwork",
        description:
          "Unhurried shooting in existing light to record both human craft gestures and surrounding place.",
      },
      {
        step: "03",
        title: "Editing & Sequencing",
        description:
          "Cohesive edit and toning paired with authentic field notes for each photographed scene.",
      },
      {
        step: "04",
        title: "Editorial or Exhibition Output",
        description:
          "Private gallery access for print-ready masters and optional Fine Art exhibition prints.",
      },
    ],
    faqs: [
      {
        q: "Can we commission multi-day documentary assignments outside Tenerife?",
        a: "Yes. I travel across the Canary Islands, mainland Spain, and abroad for documentary essays and editorial assignments.",
      },
      {
        q: "Can a commissioned story later become an exhibition or printed catalog?",
        a: "Yes. Every frame is shot in 32.5 MP RAW and can be delivered both for print layout and as Fine Art cotton prints.",
      },
    ],
    primaryCta: {
      label: "Request Documentary Proposal",
      href: "/contact?servicio=documental-editorial&motivo=Encargo",
    },
    secondaryCta: {
      label: "View Documentary Archive",
      href: "/portfolio/viajes-cultura",
    },
  },
  "licencias-fotografia-fauna-naturaleza": {
    kicker: "Wildlife & Nature · 600mm Archive",
    title: "Wildlife Photography & Nature Editorial Licensing",
    subtitle:
      "Rights-Managed editorial licensing and field documentation at 600mm, transparently indicating real location and conditions on every work.",
    intro: [
      "Every wildlife and nature photograph in this archive is captured with natural light and zero generative alterations, working at distance with a 600mm telephoto lens across open habitats, parks, and wildlife sanctuaries—with exact location and capture conditions stated clearly on each sheet.",
      "The collection is available under Rights-Managed (RM) licensing for publishers, science and nature magazines, visitor centers, national parks, and cultural publications.",
    ],
    deliverables: [
      "Archive Rights-Managed (RM) licenses with optional sector or term exclusivity",
      "300 DPI calibrated master files with intact EXIF telemetry and location notes",
      "Commissioned biodiversity, reserve, and nature-heritage documentation",
      "Field-journal notes detailing real capture context and conditions",
    ],
    idealFor:
      "Science and travel publishers, conservation foundations, natural parks, museums, environmental agencies, and cultural media.",
    technicalSpecs: [
      { label: "Optical reach", value: "Sigma 150-600mm f/5-6.3 Contemporary (960mm eq. APS-C)" },
      { label: "Archive resolution", value: "32.5 Megapixels · Genuine RAW capture" },
      { label: "Documented areas", value: "Monfragüe, Sierra de Gredos, Candelario, Canary Islands" },
      { label: "License model", value: "Editorial & Commercial Rights-Managed (RM)" },
    ],
    process: [
      {
        step: "01",
        title: "Work or Species Selection",
        description:
          "Choose frames directly from the online archive (/portfolio/fauna-naturaleza) or scope a dedicated field brief.",
      },
      {
        step: "02",
        title: "RM Fee Calculation",
        description:
          "Transparent quote based on print run, media (print, digital, display), territory, and license duration.",
      },
      {
        step: "03",
        title: "Master TIFF / JPEG Delivery",
        description:
          "High-resolution calibrated file sent with signed reproduction license certificate.",
      },
    ],
    faqs: [
      {
        q: "Under what conditions are wildlife photographs taken, and is AI ever used?",
        a: "Never any generative alterations: every image has verifiable camera EXIF data and natural-light color work. Location and conditions (wild, sanctuary, or unspecified) are disclosed on each work sheet.",
      },
      {
        q: "How can I license an image urgently for a magazine or book?",
        a: "Send the work title or code through Licensing (/licensing) or the contact form. Availability and file delivery are arranged directly when confirming the license.",
      },
    ],
    primaryCta: {
      label: "Request License or Commission",
      href: "/licensing",
    },
    secondaryCta: {
      label: "Explore Wildlife & Nature Archive",
      href: "/portfolio/fauna-naturaleza",
    },
  },
  "copias-fine-art-coleccionismo": {
    kicker: "Limited Editions · Hahnemühle Photo Rag® 308g",
    title: "Fine Art Editions for Collectors & Interiors",
    subtitle:
      "Signed and numbered archival museum-grade prints (ISO 9706) produced for private collectors, interior design studios, and hospitality spaces.",
    intro: [
      "Every Fine Art print is crafted as an enduring physical object. Each piece is printed to order on 12-pigment archival Giclée systems onto acid-free, OBA-free 100% cotton Hahnemühle Photo Rag® 308 gsm paper compliant with ISO 9706 permanence.",
      "I work with interior designers, offices, boutique hotels, and collectors to curate individual prints, diptychs, or cohesive room sequences scaled cleanly to architectural light and proportion.",
    ],
    deliverables: [
      `Individual edition pricing: Studio (€${FORMAT_RANGES.estudio.min}–€${FORMAT_RANGES.estudio.max}), Gallery (€${FORMAT_RANGES.galeria.min}–€${FORMAT_RANGES.galeria.max}), Grand Collection (€${FORMAT_RANGES.coleccion.min}–€${FORMAT_RANGES.coleccion.max})`,
      "Paper matched to light and contrast: 100% Cotton Matte (308g) or Baryta Satin (340g)",
      "Hand-signed and numbered Certificate of Authenticity (editions of 12 to 30 total prints)",
      "Interactive format selection in the Fine Art catalog (/prints)",
      "Shipped unframed wrapped in acid-free tissue inside a high-density rigid tube",
    ],
    idealFor:
      "Photography collectors, interior design practices, architects, boutique hotels, and corporate headquarters.",
    technicalSpecs: [
      { label: "Museum papers", value: "Hahnemühle Photo Rag® 308g & Canson Baryta II 340g" },
      { label: "Archival standard", value: "ISO 9706 · Archival pigment inks" },
      { label: "Maximum editions", value: "12 to 30 signed prints total per work" },
      { label: "Delivery format", value: "Unframed Fine Art print with white border · Rigid tube" },
    ],
    process: [
      {
        step: "01",
        title: "Curation & Sizing",
        description:
          "Browse prints and compare dimensions in the catalog (/prints) or request tailored recommendations for your space.",
      },
      {
        step: "02",
        title: "Color Proof & Giclée Print",
        description:
          "Printed under calibrated ICC profiles specific to matte cotton or baryta paper in a specialist Tenerife lab.",
      },
      {
        step: "03",
        title: "Signature, Numbering & Certificate",
        description:
          "Entered in the author edition ledger with a hand-signed Certificate of Authenticity.",
      },
      {
        step: "04",
        title: "Insured Tube Dispatch",
        description:
          "Dispatched wrapped in acid-free tissue inside a crush-resistant protective shipping tube.",
      },
    ],
    faqs: [
      {
        q: "Why are works shipped unframed in a rigid tube by default?",
        a: "Rolling unframed Fine Art prints in acid-free tissue inside a thick-walled tube prevents glass breakage in transit from Tenerife, avoids bulky crate freight surcharges, and lets collectors choose custom framing locally.",
      },
      {
        q: "Do you offer tailored quotes for interior design studios or multi-print orders?",
        a: "Yes. For interior design projects, hotels, or acquisitions of 3 or more prints (series and diptychs), we prepare a tailored specification and paper proposal.",
      },
      {
        q: `Are all ${WORKS.length} works available to order online?`,
        a: `Every eligible Fine Art edition in the ${WORKS.length}-work archive shows its individual sizing and pricing on its sheet and in the Prints catalog (/prints).`,
      },
    ],
    primaryCta: {
      label: "Browse Fine Art Prints",
      href: "/prints",
    },
    secondaryCta: {
      label: "Inquire Interior Project",
      href: "/contact?servicio=prints-interiorismo&motivo=Print%20Fine%20Art",
    },
  },
};

export function getLocalizedServiceLanding(landing: ServiceLanding, lang: SiteLang): ServiceLanding {
  if (lang !== "en") return landing;
  const tr = SERVICE_LANDINGS_EN[landing.slug];
  if (!tr) return landing;
  return { ...landing, ...tr };
}
