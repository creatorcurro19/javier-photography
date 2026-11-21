import Link from "next/link";
import Hero from "@/components/home/Hero";
import TrustBadgeStrip from "@/components/home/TrustBadgeStrip";
import SelectedWork from "@/components/home/SelectedWork";
import AboutPreview from "@/components/home/AboutPreview";
import SocialProofSection from "@/components/home/SocialProofSection";
import PrintAlertsForm from "@/components/newsletter/PrintAlertsForm";
import HomeQuickContact from "@/components/home/HomeQuickContact";
import Container from "@/components/ui/Container";
import JsonLd from "@/components/seo/JsonLd";
import { buildPageMetadata } from "@/lib/metadata";
import { getAllPhotos, getFeaturedPhotos } from "@/lib/photos";
import { generateWebSiteSchema } from "@/lib/schema";
import type { Photo } from "@/types/photo";

export const metadata = buildPageMetadata({
  title: "Javier Espinosa | Fotografía de Autor & Fine Art Photography (Tenerife · España)",
  description:
    "Portfolio oficial de Javier Espinosa Martínez. Fotógrafo de autor afincado en Tenerife: fauna salvaje (Wildlife), paisaje (Landscape), rally histórico (Motorsport), arquitectura y documental. Ediciones limitadas Fine Art en papel Hahnemühle Photo Rag 308g y encargos.",
  path: "/",
  keywords: [
    "Javier Espinosa Photography",
    "Javier Espinosa Martínez",
    "fotógrafo en Tenerife",
    "fotografía de autor",
    "Fine Art Photography",
    "Wildlife Photography",
    "Landscape Photography",
    "Motorsport Photography",
    "Architectural Photography",
    "Documentary Photography",
    "copias Fine Art Hahnemühle",
  ],
});

const HERO_IMAGES = new Set([
  "/images/portfolio/paisajes-documental/ocaso-sobre-el-erg.jpg",
  "/images/portfolio/fauna-naturaleza/mirada-del-lince-boreal.jpg",
  "/images/portfolio/paisajes-documental/cumbre-nevada-al-alba.jpg",
  "/images/portfolio/coches-rally/cruzada-sobre-el-asfalto.jpg",
  "/images/portfolio/viajes-cultura/el-oficio-y-la-chispa.jpg",
]);

/** Selecciona 6 piezas equilibradas sin repetir ninguna fotografía del Hero */
function pickHomePreview(featured: Photo[]): Photo[] {
  const uniqueFeatured = featured.filter((p) => !HERO_IMAGES.has(p.image));
  const seenCategories = new Set<string>();
  const picked: Photo[] = [];

  for (const photo of uniqueFeatured) {
    if (!seenCategories.has(photo.category)) {
      seenCategories.add(photo.category);
      picked.push(photo);
    }
    if (picked.length === 5) break;
  }

  for (const photo of uniqueFeatured) {
    if (picked.length >= 6) break;
    if (!picked.some((p) => p.id === photo.id)) {
      picked.push(photo);
    }
  }

  return picked;
}

const HOME_SERVICES = [
  {
    id: "copias",
    kicker: "01 · Obra Impresa Certificada",
    title: "Copias Fine Art en Papel de Algodón y Baritado",
    priceFrom: "Desde 95 €",
    description:
      "Ediciones limitadas (12 a 30 ejemplares) impresas en Hahnemühle Photo Rag® 308g o Canson Baryta II 340g. Firmadas a mano y enviadas en tubo rígido de alta densidad desde Tenerife.",
    ctaLabel: "Explorar Catálogo de Copias",
    href: "/prints",
  },
  {
    id: "encargos",
    kicker: "02 · Producción por Encargo",
    title: "Encargos de Rally, Arquitectura y Documental",
    priceFrom: "Desde 150 €",
    description:
      "Coberturas de tramo y asistencia en rally histórico, documentación arquitectónica con luz natural y reportajes editoriales en Canarias y Península.",
    ctaLabel: "Ver Servicios y Solicitar Propuesta",
    href: "/servicios",
  },
  {
    id: "licencias",
    kicker: "03 · Derechos de Reproducción",
    title: "Licencias Editoriales y Comerciales (TIFF 16-bit)",
    priceFrom: "Desde 45 €",
    description: `Cesión de derechos Rights-Managed del archivo de ${getAllPhotos().length} obras en máxima resolución (32,5 MP · TIFF 16-bit) para editoriales, revistas, libros y campañas.`,
    ctaLabel: "Configurar Licencia Directa",
    href: "/licensing",
  },
];

export default function Home() {
  const featuredPhotos = getFeaturedPhotos();
  const homePreview = pickHomePreview(featuredPhotos);

  return (
    <>
      <JsonLd data={generateWebSiteSchema()} />
      <Hero />
      <TrustBadgeStrip />
      <SelectedWork photos={homePreview} totalCount={featuredPhotos.length} />

      {/* Bloque de 3 Servicios con "desde X €" */}
      <section
        id="servicios-principales"
        aria-label="Servicios y Tarifas Base"
        className="border-t border-white/[0.08] bg-[#0B0C0E] py-24"
      >
        <Container>
          <div className="max-w-2xl">
            <p className="font-mono text-xs uppercase tracking-[0.35em] text-[#C5A880]">
              Adquisición, Encargos y Licencias
            </p>
            <h2 className="mt-3 font-serif text-3xl sm:text-4xl font-light text-[#EBE7DF]">
              Tres formas de trabajar con el archivo
            </h2>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-3">
            {HOME_SERVICES.map((svc) => (
              <article
                key={svc.id}
                className="flex flex-col justify-between border border-white/[0.08] bg-[#151618] p-7 sm:p-8 transition hover:border-[#C5A880]/50"
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#A39E93]">
                      {svc.kicker}
                    </span>
                    <span className="border border-[#C5A880]/35 bg-[#0B0C0E] px-2.5 py-1 font-mono text-[11px] font-semibold text-[#C5A880]">
                      {svc.priceFrom}
                    </span>
                  </div>
                  <h3 className="mt-4 font-serif text-2xl font-light text-[#EBE7DF]">
                    {svc.title}
                  </h3>
                  <p className="mt-3 text-xs sm:text-sm font-light leading-relaxed text-[#A39E93]">
                    {svc.description}
                  </p>
                </div>

                <div className="mt-8 pt-4 border-t border-white/[0.06]">
                  <Link
                    href={svc.href}
                    className="inline-flex min-h-[44px] items-center gap-2 font-mono text-xs uppercase tracking-[0.22em] text-[#EBE7DF] hover:text-[#C5A880] transition"
                  >
                    <span>{svc.ctaLabel}</span>
                    <span>→</span>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </Container>
      </section>

      <AboutPreview />
      <SocialProofSection />
      <PrintAlertsForm />
      <HomeQuickContact />
    </>
  );
}
