import type { Metadata } from "next";
import { notFound } from "next/navigation";
import AboutInteractiveStudio from "@/components/about/AboutInteractiveStudio";
import ClientPortal from "@/components/client/ClientPortal";
import ContactPageContent from "@/components/contact/ContactPageContent";
import DossierPageContent from "@/components/dossier/DossierPageContent";
import CondicionesPageContent from "@/components/legal/CondicionesPageContent";
import LegalPageContent from "@/components/legal/LegalPageContent";
import LicensingPageContent from "@/components/licensing/LicensingPageContent";
import CategoryGalleryContent from "@/components/portfolio/CategoryGalleryContent";
import PhotoDetailContent from "@/components/portfolio/PhotoDetailContent";
import PortfolioPageContent from "@/components/portfolio/PortfolioPageContent";
import SelectedWorkContent from "@/components/portfolio/SelectedWorkContent";
import PrintsPageContent from "@/components/prints/PrintsPageContent";
import ProjectDetailContent from "@/components/projects/ProjectDetailContent";
import ProjectsPageContent from "@/components/projects/ProjectsPageContent";
import JsonLd from "@/components/seo/JsonLd";
import ServiceLandingContent from "@/components/servicios/ServiceLandingContent";
import ServiciosPageContent from "@/components/servicios/ServiciosPageContent";
import CuadernoPageContent from "@/components/stories/CuadernoPageContent";
import CuadernoPostContent from "@/components/stories/CuadernoPostContent";
import StoriesPageContent from "@/components/stories/StoriesPageContent";
import Hero from "@/components/home/Hero";
import CollectionsOverview from "@/components/home/CollectionsOverview";
import SelectedFilmstrip from "@/components/home/SelectedFilmstrip";
import Container from "@/components/ui/Container";
import { AndalusianPageBackdrop } from "@/components/ui/AndalusianMotif";
import { getAllCuadernoPosts, getCuadernoPostBySlug } from "@/data/cuaderno";
import { getFormatPriceRanges } from "@/data/formatos";
import { getPlazos } from "@/data/plazos";
import { getServiceLandingBySlug, SERVICE_AREA } from "@/data/service-landings";
import { getLocalizedServiceLanding, SERVICE_AREA_EN } from "@/data/service-landings-en";
import { getLocalizedCuadernoPost } from "@/data/site-config";
import { WORKS } from "@/data/works";
import type { SiteLang } from "@/lib/i18n-helpers";
import { getLocalizedProject } from "@/lib/i18n-works";
import { absoluteUrl, buildPageMetadata, buildPhotoMetadata } from "@/lib/metadata";
import {
  getAdjacentPhotos,
  getAllPhotos,
  getAllProjects,
  getFeaturedPhotos,
  getLicensedPhotos,
  getPhotoBySlug,
  getPhotosByCategory,
  getPhotosWithStory,
  getPrintablePhotos,
  getProjectBySlug,
  getProjectPhotos,
  isPhotoCategory,
  PHOTO_CATEGORIES,
} from "@/lib/photos";
import {
  generateBreadcrumbSchema,
  generateCategoryCollectionSchema,
  generateFAQSchema,
  generatePersonSchema,
  generatePhotoSchema,
  generateProjectSchema,
  generateServiceSchema,
  generateWebSiteSchema,
} from "@/lib/schema";
import { CATEGORY_METADATA, type PhotoCategory } from "@/types/photo";

/* -------------------------------------------------------------------------- */
/* Home                                                                       */
/* -------------------------------------------------------------------------- */

export function getHomeMetadata(lang: SiteLang): Metadata {
  return buildPageMetadata({
    lang,
    title:
      lang === "en"
        ? "Fine Art Photographer & Prints | Javier Espinosa"
        : "Fotógrafo en Tenerife | Javier Espinosa",
    description:
      lang === "en"
        ? "Limited edition wildlife, landscape, classic rally & architecture Fine Art prints on cotton rag paper. Museum quality, shipped in rigid tubes to the US."
        : "Fotografía de fauna, paisaje, rally histórico, arquitectura y documental desde Tenerife. Copias Fine Art, encargos y licencias.",
    path: "/",
  });
}

export function HomeView({ lang }: { lang: SiteLang }) {
  return (
    <>
      <JsonLd data={[generateWebSiteSchema(lang), generatePersonSchema(lang)]} />
      <Hero />
      <CollectionsOverview />
      <SelectedFilmstrip />
    </>
  );
}

/* -------------------------------------------------------------------------- */
/* Portfolio index                                                            */
/* -------------------------------------------------------------------------- */

export function getPortfolioMetadata(lang: SiteLang): Metadata {
  const total = getAllPhotos().length;
  return buildPageMetadata({
    lang,
    title:
      lang === "en"
        ? `Photography Archive (${total} Works) | Javier Espinosa`
        : `Colecciones y Archivo (${total} obras) | Javier Espinosa`,
    description:
      lang === "en"
        ? `Explore ${total} Fine Art photographs across ${PHOTO_CATEGORIES.length} themes: wildlife, volcanic landscapes, classic rally, architecture, and crafts. Prints shipped to the US.`
        : `Archivo fotográfico de Javier Espinosa Martínez: ${total} obras en ${PHOTO_CATEGORIES.length} colecciones de fauna, paisajes, rally, arquitectura y documental.`,
    path: "/portfolio",
  });
}

export function PortfolioView({ lang }: { lang: SiteLang }) {
  const photos = getAllPhotos();
  const buckets = PHOTO_CATEGORIES.map((category) => ({
    category,
    photos: getPhotosByCategory(category),
  }));
  const breadcrumb = generateBreadcrumbSchema(
    [
      { name: lang === "en" ? "Home" : "Inicio", path: "/" },
      {
        name: lang === "en" ? "Photo Collections" : "Colecciones Fotográficas",
        path: "/portfolio",
      },
    ],
    lang
  );

  return (
    <>
      <JsonLd data={breadcrumb} />
      <PortfolioPageContent photos={photos} buckets={buckets} />
    </>
  );
}

/* -------------------------------------------------------------------------- */
/* Portfolio [slug] (Category & Photo Detail)                                 */
/* -------------------------------------------------------------------------- */

export function getPortfolioSlugMetadata(slug: string, lang: SiteLang): Metadata {
  if (isPhotoCategory(slug)) {
    const meta = CATEGORY_METADATA[slug];
    return buildPageMetadata({
      lang,
      title: lang === "en" ? meta.seoTitleEn : meta.seoTitle,
      description: lang === "en" ? meta.seoDescriptionEn : meta.seoDescription,
      path: `/portfolio/${slug}`,
      image: meta.coverImage,
    });
  }

  const photo = getPhotoBySlug(slug);
  if (!photo) return {};
  return buildPhotoMetadata(photo, lang);
}

function CategoryGalleryServer({
  category,
  lang,
}: {
  category: PhotoCategory;
  lang: SiteLang;
}) {
  const photos = getPhotosByCategory(category);
  const info = CATEGORY_METADATA[category];
  const breadcrumb = generateBreadcrumbSchema(
    [
      { name: lang === "en" ? "Home" : "Inicio", path: "/" },
      { name: lang === "en" ? "Photos" : "Obra", path: "/portfolio" },
      {
        name: lang === "en" ? info.titleEn : info.title,
        path: `/portfolio/${category}`,
      },
    ],
    lang
  );

  return (
    <>
      <JsonLd
        data={[generateCategoryCollectionSchema(category, photos, lang), breadcrumb]}
      />
      <CategoryGalleryContent category={category} photos={photos} />
    </>
  );
}

function PhotoDetailServer({ slug, lang }: { slug: string; lang: SiteLang }) {
  const photo = getPhotoBySlug(slug);
  if (!photo) notFound();

  const categoryInfo = CATEGORY_METADATA[photo.category];
  const categoryPhotos = getPhotosByCategory(photo.category);
  const { prev, next } = getAdjacentPhotos(photo);
  const totalInCat = categoryPhotos.length;

  const breadcrumb = generateBreadcrumbSchema(
    [
      { name: lang === "en" ? "Home" : "Inicio", path: "/" },
      { name: lang === "en" ? "Photos" : "Obra", path: "/portfolio" },
      {
        name:
          (lang === "en" ? categoryInfo?.titleEn : categoryInfo?.title) ??
          photo.category,
        path: `/portfolio/${photo.category}`,
      },
      { name: photo.title, path: `/portfolio/${photo.slug}` },
    ],
    lang
  );

  return (
    <>
      <JsonLd data={[generatePhotoSchema(photo, lang), breadcrumb]} />
      <PhotoDetailContent
        rawPhoto={photo}
        categoryPhotos={categoryPhotos}
        prev={prev}
        next={next}
        totalInCat={totalInCat}
      />
    </>
  );
}

export function PortfolioSlugView({
  slug,
  lang,
}: {
  slug: string;
  lang: SiteLang;
}) {
  if (isPhotoCategory(slug)) {
    return <CategoryGalleryServer category={slug} lang={lang} />;
  }
  return <PhotoDetailServer slug={slug} lang={lang} />;
}

/* -------------------------------------------------------------------------- */
/* Selected Work                                                              */
/* -------------------------------------------------------------------------- */

export function getSelectedWorkMetadata(lang: SiteLang): Metadata {
  return buildPageMetadata({
    lang,
    title:
      lang === "en"
        ? "Selected Works · Portfolio | Javier Espinosa"
        : "Obras Seleccionadas | Javier Espinosa",
    description:
      lang === "en"
        ? "Curated Fine Art highlights across wildlife, volcanic landscapes, classic rally, architecture, and documentary craft. Archival prints shipped worldwide."
        : "Fotografías seleccionadas del archivo de Javier Espinosa Martínez: fauna, paisaje, automovilismo, arquitectura y fotografía documental.",
    path: "/selected-work",
  });
}

export function SelectedWorkView({ lang }: { lang: SiteLang }) {
  const featuredPhotos = getFeaturedPhotos();
  const totalArchiveCount = getAllPhotos().length;

  return (
    <>
      <JsonLd
        data={generateBreadcrumbSchema(
          [
            { name: lang === "en" ? "Home" : "Inicio", path: "/" },
            {
              name: lang === "en" ? "Selected Works" : "Obras Seleccionadas",
              path: "/selected-work",
            },
          ],
          lang
        )}
      />
      <SelectedWorkContent
        featuredPhotos={featuredPhotos}
        totalArchiveCount={totalArchiveCount}
      />
    </>
  );
}

/* -------------------------------------------------------------------------- */
/* Projects                                                                   */
/* -------------------------------------------------------------------------- */

export function getProjectsMetadata(lang: SiteLang): Metadata {
  return buildPageMetadata({
    lang,
    title:
      lang === "en"
        ? "Documentary Photo Series | Javier Espinosa"
        : "Series Fotográficas Documentales | Javier Espinosa",
    description:
      lang === "en"
        ? "Monographic documentary series from Tenerife volcanic peaks, the Sahara Desert, rural Spanish villages, classic historic rallies, wildlife, and craftsmen."
        : "Series fotográficas y ensayos documentales de Javier Espinosa: La Vera, paisaje volcánico de Canarias, rally histórico, Marrakech, Sahara y fauna.",
    path: "/projects",
  });
}

export function ProjectsView({ lang }: { lang: SiteLang }) {
  const projects = getAllProjects().map((proj) => ({
    ...proj,
    resolvedPhotos: getProjectPhotos(proj),
  }));

  return (
    <>
      <JsonLd
        data={generateBreadcrumbSchema(
          [
            { name: lang === "en" ? "Home" : "Inicio", path: "/" },
            {
              name: lang === "en" ? "Photo Series" : "Series Monográficas",
              path: "/projects",
            },
          ],
          lang
        )}
      />
      <ProjectsPageContent projects={projects} />
    </>
  );
}

export function getProjectDetailMetadata(slug: string, lang: SiteLang): Metadata {
  const raw = getProjectBySlug(slug);
  if (!raw) return {};
  const project = getLocalizedProject(raw, lang);
  return buildPageMetadata({
    lang,
    title: `${project.title} | Javier Espinosa`,
    description: project.description,
    path: `/projects/${project.slug}`,
    image: project.coverImage,
  });
}

export function ProjectDetailView({
  slug,
  lang,
}: {
  slug: string;
  lang: SiteLang;
}) {
  const raw = getProjectBySlug(slug);
  if (!raw) notFound();

  const project = getLocalizedProject(raw, lang);
  const projectPhotos = getProjectPhotos(raw);
  const allProjects = getAllProjects();
  const currentIndex = allProjects.findIndex((p) => p.slug === slug);
  const prevProject = currentIndex > 0 ? allProjects[currentIndex - 1] : undefined;
  const nextProject =
    currentIndex < allProjects.length - 1 ? allProjects[currentIndex + 1] : undefined;

  return (
    <>
      <JsonLd data={generateProjectSchema(raw, projectPhotos, lang)} />
      <JsonLd
        data={generateBreadcrumbSchema(
          [
            { name: lang === "en" ? "Home" : "Inicio", path: "/" },
            { name: lang === "en" ? "Series" : "Series", path: "/projects" },
            { name: project.title, path: `/projects/${project.slug}` },
          ],
          lang
        )}
      />
      <ProjectDetailContent
        rawProject={raw}
        projectPhotos={projectPhotos}
        prevProject={prevProject}
        nextProject={nextProject}
        totalProjects={allProjects.length}
      />
    </>
  );
}

/* -------------------------------------------------------------------------- */
/* Prints                                                                     */
/* -------------------------------------------------------------------------- */

export function getPrintsMetadata(lang: SiteLang): Metadata {
  return buildPageMetadata({
    lang,
    title:
      lang === "en"
        ? "Buy Limited Edition Fine Art Prints | Javier Espinosa"
        : "Comprar Láminas Fine Art | Javier Espinosa",
    description:
      lang === "en"
        ? "Signed limited edition Fine Art photography prints on 100% cotton Hahnemuhle Photo Rag 308g paper. Shipped unframed in rigid tubes to the US & worldwide."
        : "Copias Fine Art de edición limitada sobre papel 100% algodón Hahnemühle Photo Rag 308g (ISO 9706). Obra numerada y firmada, enviada sin marco.",
    path: "/prints",
  });
}

export function PrintsView({ lang }: { lang: SiteLang }) {
  const printable = getPrintablePhotos();
  const priceRanges = getFormatPriceRanges(printable);
  const plazos = getPlazos(lang);

  const printFaqs =
    lang === "en"
      ? [
          {
            q: "How are Fine Art prints packaged and shipped to the US and worldwide?",
            a: "All photographs are sold exclusively as unframed Fine Art prints. Each print ships wrapped in acid-free tissue paper inside a high-density 3–4 mm protective rigid tube from Tenerife to the US, Europe, and worldwide, eliminating glass breakage risks in transit.",
          },
          {
            q: "What sizes and papers are available?",
            a: "Three standard archival sizes are offered: Studio 30×45 cm (11.8×17.7 in), Gallery 50×70 cm (19.7×27.6 in), and Grand Collection 70×100 cm (27.6×39.4 in) on 100% cotton Hahnemühle Photo Rag 308g / Canson Rag 310g or Canson Baryta 340g.",
          },
          {
            q: "Does every print come signed and numbered?",
            a: "Yes. Every work includes a hand-signed and numbered Certificate of Authenticity by Javier Espinosa Martínez specifying title, year, archival paper, and edition number (editions capped at 12 to 30 prints).",
          },
          {
            q: "What is the production and shipping timeframe?",
            a: `Each print is crafted to order in a Fine Art lab with color-proof inspection and hand signature. ${plazos.copias}`,
          },
        ]
      : [
          {
            q: "¿Cómo se entrega y protege cada copia Fine Art?",
            a: "Todas las fotografías se comercializan exclusivamente como lámina Fine Art sin enmarcar. Se envían envueltas en papel seda libre de ácido dentro de un tubo rígido de alta densidad (3-4 mm de grosor) desde Tenerife, eliminando cualquier riesgo de rotura de cristal durante el transporte.",
          },
          {
            q: "¿Por qué cada fotografía tiene un precio y soporte específico?",
            a: "Cada obra del catálogo se valora individualmente según la complejidad técnica de la captura, la singularidad del momento, el tamaño de su edición limitada (entre 12 y 30 ejemplares máximos) y el soporte asignado: papel 100% algodón mate (Hahnemühle Photo Rag® 308g / Canson Rag Photographique 310g) o papel baritado de alto contraste (Baryta 340g).",
          },
          {
            q: "¿Qué incluye el Certificado de Autenticidad?",
            a: "Cada obra va acompañada de un documento firmado y numerado de puño y letra por Javier Espinosa Martínez indicando título, fecha, soporte empleado y número de ejemplar dentro de la edición limitada.",
          },
          {
            q: "¿Cuál es el plazo habitual de producción y entrega?",
            a: `Cada copia se imprime bajo demanda en laboratorio Fine Art con revisión directa de prueba de color y firma manuscrita. ${plazos.copias}`,
          },
        ];

  return (
    <>
      <JsonLd
        data={[
          generateFAQSchema(printFaqs),
          generatePersonSchema(lang),
          generateBreadcrumbSchema(
            [
              { name: lang === "en" ? "Home" : "Inicio", path: "/" },
              {
                name: lang === "en" ? "Fine Art Prints" : "Copias Fine Art",
                path: "/prints",
              },
            ],
            lang
          ),
        ]}
      />
      <PrintsPageContent printable={printable} priceRanges={priceRanges} />
    </>
  );
}

/* -------------------------------------------------------------------------- */
/* Servicios                                                                  */
/* -------------------------------------------------------------------------- */

export function getServiciosMetadata(lang: SiteLang): Metadata {
  return buildPageMetadata({
    lang,
    title:
      lang === "en"
        ? "Photography Commissions & Licensing | Javier Espinosa"
        : "Servicios y Encargos | Javier Espinosa",
    description:
      lang === "en"
        ? "Commission photography across historic rally, architecture, documentary projects, and curated Fine Art interior prints from Javier Espinosa."
        : "Encargos fotográficos de Javier Espinosa Martínez: rally histórico, arquitectura y patrimonio, proyectos documentales y copias Fine Art.",
    path: "/servicios",
  });
}

export function ServiciosView({ lang }: { lang: SiteLang }) {
  const plazos = getPlazos(lang);
  const faqItems =
    lang === "en"
      ? [
          {
            q: "How is coverage of a rally or motorsport event planned?",
            a: "Before the rally, the roadbook, road-closure schedules, and sun position at each stage are mapped out. Coverage combines service park atmosphere, mechanical details, and cornering action up to 600mm.",
          },
          {
            q: "In what format and timeframe are commissioned shoots delivered?",
            a: `Delivered via a private high-resolution gallery (individually graded 32.5 MP master files plus web/press-ready versions). ${plazos.rallyPrensa} ${plazos.reportajes}`,
          },
          {
            q: "Do you travel outside Tenerife for commissions?",
            a: "Yes. Based in Tenerife (Canary Islands), I am available to travel to mainland Spain and other locations on commission.",
          },
          {
            q: "Do architectural commissions include commercial usage licensing?",
            a: "Yes. Every quote specifies written usage licensing tailored to corporate websites, printed catalogs, editorial campaigns, or architectural awards.",
          },
        ]
      : [
          {
            q: "¿Cómo se planifica la cobertura de un rally o evento de motor?",
            a: "Antes de la prueba se estudian el rutómetro, los horarios de corte y la orientación solar de cada tramo. Se combinan tomas en el parque de asistencia (ambiente, detalles mecánicos y pilotos) con disparos en curva y horquilla hasta 600mm.",
          },
          {
            q: "¿En qué formato y plazo se entregan los reportajes?",
            a: `Se entrega una galería privada en alta resolución (archivos máster de 32,5 MP revelados individualmente y versiones optimizadas para prensa/web). ${plazos.rallyPrensa} ${plazos.reportajes}`,
          },
          {
            q: "¿Realizas desplazamientos fuera de tu provincia o a las islas?",
            a: "Sí. Con base en Tenerife (Islas Canarias), tengo disponibilidad para desplazamientos a Península y otras localizaciones bajo encargo.",
          },
          {
            q: "¿Los encargos de arquitectura y turismo incluyen licencia de uso comercial?",
            a: "Sí, cada presupuesto incluye por escrito la cesión de derechos adaptada a las necesidades del cliente (web corporativa, catálogos impresos, campañas editoriales o promoción institucional).",
          },
        ];

  return (
    <>
      <JsonLd data={generateServiceSchema(lang)} />
      <JsonLd data={generateFAQSchema(faqItems)} />
      <ServiciosPageContent />
    </>
  );
}

export function getServiceLandingMetadata(slug: string, lang: SiteLang): Metadata {
  const raw = getServiceLandingBySlug(slug);
  if (!raw) return {};
  const landing = getLocalizedServiceLanding(raw, lang);
  return buildPageMetadata({
    lang,
    title: landing.seoTitle,
    description: landing.seoDescription,
    path: `/servicios/${landing.slug}`,
    image: landing.heroImage,
  });
}

export function ServiceLandingView({
  slug,
  lang,
}: {
  slug: string;
  lang: SiteLang;
}) {
  const raw = getServiceLandingBySlug(slug);
  if (!raw) notFound();

  const landing = getLocalizedServiceLanding(raw, lang);
  const samplePhotos = getPhotosByCategory(raw.category).slice(0, 6);
  const isEn = lang === "en";
  const area = isEn ? SERVICE_AREA_EN : SERVICE_AREA;

  const serviceJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: landing.title,
    description: landing.seoDescription,
    url: absoluteUrl(
      isEn ? `/en/servicios/${landing.slug}` : `/servicios/${landing.slug}`
    ),
    image: absoluteUrl(landing.heroImage),
    provider: {
      "@type": "Person",
      "@id": absoluteUrl("/#author"),
      name: "Javier Espinosa Martínez",
      url: absoluteUrl(isEn ? "/en/about" : "/about"),
    },
    areaServed: [
      { "@type": "Place", name: area.base },
      ...area.primaryRegions.map((name) => ({ "@type": "Place", name })),
      { "@type": "Country", name: isEn ? "Spain" : "España" },
    ],
  };

  return (
    <>
      <JsonLd data={serviceJsonLd} />
      <JsonLd data={generateFAQSchema(landing.faqs)} />
      <JsonLd
        data={generateBreadcrumbSchema(
          [
            { name: isEn ? "Home" : "Inicio", path: "/" },
            { name: isEn ? "Services" : "Servicios", path: "/servicios" },
            { name: landing.title, path: `/servicios/${landing.slug}` },
          ],
          lang
        )}
      />
      <ServiceLandingContent rawLanding={raw} samplePhotos={samplePhotos} />
    </>
  );
}

/* -------------------------------------------------------------------------- */
/* Licensing                                                                  */
/* -------------------------------------------------------------------------- */

export function getLicensingMetadata(lang: SiteLang): Metadata {
  return buildPageMetadata({
    lang,
    title:
      lang === "en"
        ? "Image Licensing · 16-bit TIFF | Javier Espinosa"
        : "Licencias de Imagen Editorial | Javier Espinosa",
    description:
      lang === "en"
        ? "Rights-Managed editorial, book, and commercial image licensing. 32.5 MP uncompressed 16-bit TIFF and 300 DPI masters available worldwide."
        : "Cesión de derechos y licencias Rights-Managed en alta resolución (TIFF y JPEG) para editoriales, prensa, campañas e interiorismo.",
    path: "/licensing",
  });
}

export function LicensingView({ lang }: { lang: SiteLang }) {
  const allLicensed = getLicensedPhotos();
  const licensed = allLicensed.filter((p) => p.prints || p.featured).slice(0, 18);

  return (
    <>
      <JsonLd
        data={generateBreadcrumbSchema(
          [
            { name: lang === "en" ? "Home" : "Inicio", path: "/" },
            {
              name: lang === "en" ? "Image Licensing" : "Licencias de Imagen",
              path: "/licensing",
            },
          ],
          lang
        )}
      />
      <LicensingPageContent
        totalLicensedCount={allLicensed.length}
        featuredLicensed={licensed}
      />
    </>
  );
}

/* -------------------------------------------------------------------------- */
/* About, Contact, Dossier, Condiciones, Legal, Cliente                       */
/* -------------------------------------------------------------------------- */

export function getAboutMetadata(lang: SiteLang): Metadata {
  return buildPageMetadata({
    lang,
    title:
      lang === "en"
        ? "About Javier Espinosa | Fine Art Photographer"
        : "Sobre mí | Javier Espinosa",
    description:
      lang === "en"
        ? "Javier Espinosa Martinez is an independent Fine Art and documentary photographer based in Tenerife capturing wildlife, landscapes, historic rallies, and crafts."
        : "Soy Javier Espinosa, fotógrafo independiente en Tenerife. Naturaleza, paisajes, arquitectura y cultura buscando nuevas maneras de mirar.",
    path: "/about",
  });
}

export function AboutView({ lang }: { lang: SiteLang }) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0B0C0E] pt-32 pb-28 text-[#EBE7DF]">
      <JsonLd
        data={generateBreadcrumbSchema(
          [
            { name: lang === "en" ? "Home" : "Inicio", path: "/" },
            {
              name: lang === "en" ? "About the Author" : "Sobre el Autor",
              path: "/about",
            },
          ],
          lang
        )}
      />
      <Container className="relative z-10">
        <AboutInteractiveStudio />
      </Container>
    </div>
  );
}

export function getContactMetadata(lang: SiteLang): Metadata {
  return buildPageMetadata({
    lang,
    title:
      lang === "en"
        ? "Contact & Print Inquiries | Javier Espinosa"
        : "Contacto y Consultas | Javier Espinosa",
    description:
      lang === "en"
        ? "Contact Javier Espinosa to order limited edition Fine Art prints shipped to the US & worldwide, request image licensing, or discuss a commission."
        : "Contacta con Javier Espinosa en Tenerife para solicitar una copia Fine Art, pedir presupuesto para un reportaje o resolver cualquier duda.",
    path: "/contact",
  });
}

export function ContactView() {
  return <ContactPageContent />;
}

export function getDossierMetadata(lang: SiteLang): Metadata {
  return buildPageMetadata({
    lang,
    title:
      lang === "en"
        ? "Author & Press Dossier | Javier Espinosa"
        : "Dossier de Autor y Prensa | Javier Espinosa",
    description:
      lang === "en"
        ? "Printable A4 author dossier featuring selected Fine Art works, gear specifications, edition sizes, and direct contact for galleries and press."
        : "Dossier editorial de Javier Espinosa Martínez: enfoque, colecciones, selección de obra Fine Art, equipo y contacto para prensa y galerías.",
    path: "/dossier",
  });
}

export function DossierView() {
  const plates = getFeaturedPhotos().slice(0, 6);
  const priceRanges = getFormatPriceRanges(WORKS);
  return <DossierPageContent plates={plates} priceRanges={priceRanges} />;
}

export function getCondicionesMetadata(lang: SiteLang): Metadata {
  return buildPageMetadata({
    lang,
    title:
      lang === "en"
        ? "Shipping, Returns & Licensing | Javier Espinosa"
        : "Condiciones de Compra y Licencias | Javier Espinosa",
    description:
      lang === "en"
        ? "Terms for limited edition Fine Art prints: rigid tube shipping to US & worldwide, applicable taxes, 14-day return policy, and Rights-Managed licenses."
        : "Condiciones generales de venta de copias Fine Art en tubo rígido, impuestos aplicables, envío, derecho de desistimiento, devoluciones y licencias.",
    path: "/condiciones",
  });
}

export function CondicionesView({ lang }: { lang: SiteLang }) {
  return (
    <>
      <JsonLd
        data={generateBreadcrumbSchema(
          [
            { name: lang === "en" ? "Home" : "Inicio", path: "/" },
            {
              name:
                lang === "en"
                  ? "Terms & Conditions"
                  : "Condiciones de Compra y Licencias",
              path: "/condiciones",
            },
          ],
          lang
        )}
      />
      <CondicionesPageContent />
    </>
  );
}

export function getLegalMetadata(lang: SiteLang): Metadata {
  return buildPageMetadata({
    lang,
    title:
      lang === "en"
        ? "Legal Notice & Privacy Policy | Javier Espinosa"
        : "Aviso Legal y Privacidad | Javier Espinosa",
    description:
      lang === "en"
        ? "Legal notice, GDPR privacy terms, AI TDM copyright reservation, and trademark/personality disclosures for Javier Espinosa Photography."
        : "Información legal, política de privacidad RGPD y protección de derechos de autor sobre el archivo fotográfico de Javier Espinosa Martínez.",
    path: "/legal",
  });
}

export function LegalView() {
  return <LegalPageContent />;
}

export function getClienteMetadata(lang: SiteLang): Metadata {
  return buildPageMetadata({
    lang,
    title:
      lang === "en"
        ? "Private Client Access | Javier Espinosa"
        : "Acceso Clientes | Javier Espinosa",
    description:
      lang === "en"
        ? "Private client proof gallery and master image selection portal for commissioned shoots and press agencies."
        : "Portal privado de entrega y selección de reportajes fotográficos de autor para clientes y medios.",
    path: "/cliente",
    robots: {
      index: false,
      follow: false,
    },
  });
}

export function ClienteView() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0B0C0E] pt-36 pb-28 text-[#EBE7DF]">
      <AndalusianPageBackdrop variant="laceria" />
      <Container className="relative z-10">
        <ClientPortal />
      </Container>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Cuaderno & Stories                                                         */
/* -------------------------------------------------------------------------- */

export function getCuadernoMetadata(lang: SiteLang): Metadata {
  return buildPageMetadata({
    lang,
    title:
      lang === "en"
        ? "Field Journal & Photo Notes | Javier Espinosa"
        : "Cuaderno de Campo | Javier Espinosa",
    description:
      lang === "en"
        ? "Field notes and stories behind 600mm wildlife encounters, Tenerife mountain light, and classic rally service parks by Javier Espinosa."
        : "Cuaderno y artículos de Javier Espinosa Martínez: notas de campo sobre fotografía de naturaleza, paisaje en Tenerife, rally histórico y oficios.",
    path: "/cuaderno",
  });
}

export function CuadernoView({ lang }: { lang: SiteLang }) {
  const posts = getAllCuadernoPosts();
  const stories = getPhotosWithStory();

  return (
    <>
      <JsonLd
        data={generateBreadcrumbSchema(
          [
            { name: lang === "en" ? "Home" : "Inicio", path: "/" },
            { name: lang === "en" ? "Journal" : "Cuaderno", path: "/cuaderno" },
          ],
          lang
        )}
      />
      <CuadernoPageContent posts={posts} stories={stories} />
    </>
  );
}

export function getCuadernoPostMetadata(slug: string, lang: SiteLang): Metadata {
  const raw = getCuadernoPostBySlug(slug);
  if (!raw) return {};
  const post = getLocalizedCuadernoPost(raw, lang);
  return buildPageMetadata({
    lang,
    title:
      lang === "en"
        ? `Journal #${post.number} | Javier Espinosa`
        : `Cuaderno #${post.number} | Javier Espinosa`,
    description: post.subtitle,
    path: `/cuaderno/${post.slug}`,
    image: raw.relatedWork?.image,
  });
}

export function CuadernoPostView({
  slug,
  lang,
}: {
  slug: string;
  lang: SiteLang;
}) {
  const raw = getCuadernoPostBySlug(slug);
  if (!raw) notFound();

  const post = getLocalizedCuadernoPost(raw, lang);
  const breadcrumb = generateBreadcrumbSchema(
    [
      { name: lang === "en" ? "Home" : "Inicio", path: "/" },
      { name: lang === "en" ? "Journal" : "Cuaderno", path: "/cuaderno" },
      {
        name:
          lang === "en" ? `Draft ${post.number}` : `Borrador ${post.number}`,
        path: `/cuaderno/${post.slug}`,
      },
    ],
    lang
  );

  return (
    <>
      <JsonLd data={breadcrumb} />
      <CuadernoPostContent rawPost={raw} />
    </>
  );
}

export function getStoriesMetadata(lang: SiteLang): Metadata {
  return buildPageMetadata({
    lang,
    title:
      lang === "en"
        ? "Field Journal & Stories | Javier Espinosa"
        : "Cuaderno de Campo y Relatos | Javier Espinosa",
    description:
      lang === "en"
        ? "Technical context and field stories behind wildlife, landscape, historic rally, and cultural photographs by Javier Espinosa."
        : "Notas de campo, contexto técnico y relatos detrás de cada fotografía: fauna, paisaje, tramos de rally y cultura local por Javier Espinosa.",
    path: "/stories",
  });
}

export function StoriesView() {
  const stories = getPhotosWithStory();
  const totalWorksCount = getAllPhotos().length;
  return (
    <StoriesPageContent stories={stories} totalWorksCount={totalWorksCount} />
  );
}
