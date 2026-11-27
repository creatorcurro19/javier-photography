"use client";

import Image from "next/image";
import Link from "next/link";
import Container from "@/components/ui/Container";
import LicenseConfigurator from "@/components/licensing/LicenseConfigurator";
import {
  AndalusianCenefa,
  AndalusianPageBackdrop,
} from "@/components/ui/AndalusianMotif";
import { getPlazos } from "@/data/plazos";
import { SITE_CONFIG } from "@/data/site-config";
import { useLanguage } from "@/lib/i18n";
import { getLocalizedPhoto } from "@/lib/i18n-works";
import { CATEGORY_METADATA, type Photo } from "@/types/photo";

interface LicensingPageContentProps {
  totalLicensedCount: number;
  featuredLicensed: Photo[];
}

export default function LicensingPageContent({
  totalLicensedCount,
  featuredLicensed,
}: LicensingPageContentProps) {
  const { lang, t } = useLanguage();
  const plazos = getPlazos(lang);

  const tiers = [
    {
      name: t("Editorial y Prensa", "Editorial & Press"),
      priceFrom: t("Desde\u00A060\u00A0€", "From\u00A0€60"),
      scope: t("Publicaciones impresas y digitales", "Print and digital publications"),
      uses: t(
        "Artículos de prensa, revistas de naturaleza y motor, monográficos de viaje, libros temáticos y divulgación.",
        "Newspaper features, wildlife and motorsport magazines, travel monographs, specialist books, and cultural features."
      ),
      specs: t(
        "Archivos TIFF 16-bit y JPEG máxima calidad a 300 DPI, perfil Adobe RGB con metadatos IPTC completos.",
        "16-bit TIFF and maximum-quality 300 DPI JPEG files in Adobe RGB profile with complete IPTC metadata."
      ),
      pricing: t(
        "Tarifas basadas en tirada, posición (portada/interior) y territorio.",
        "Fees calculated by print run, placement (cover/interior), and territory."
      ),
    },
    {
      name: t("Comercial y Publicidad", "Commercial & Advertising"),
      priceFrom: t("Desde\u00A0150\u00A0€", "From\u00A0€150"),
      scope: t("Campañas de marca y producto", "Brand and product campaigns"),
      uses: t(
        "Publicidad exterior, catálogos comerciales, comunicación corporativa para automoción, arquitectura o turismo.",
        "Outdoor campaigns, brand catalogs, and corporate communications for automotive, architecture, or hospitality."
      ),
      specs: t(
        "Archivos TIFF 16-bit máster sin compresión ni recorte destructivo.",
        "Uncompressed 16-bit master TIFF files with full dynamic range and uncropped resolution."
      ),
      pricing: t(
        "Presupuesto a medida según duración de campaña, medios y exclusividad sectorial.",
        "Custom quote tailored to campaign term, media channels, and category exclusivity."
      ),
    },
    {
      name: t("Digital y Audiovisual", "Digital & Audiovisual"),
      priceFrom: t("Desde\u00A045\u00A0€", "From\u00A0€45"),
      scope: t("Plataformas web, redes y vídeo", "Web platforms, social media & video"),
      uses: t(
        "Cabeceras web, piezas audiovisuales, documentales y campañas en entornos digitales de alta exigencia.",
        "Website hero banners, documentary productions, streaming graphics, and high-impact digital campaigns."
      ),
      specs: t(
        "Máster TIFF 16-bit + entregas en sRGB optimizadas para pantallas de alta densidad.",
        "16-bit TIFF master plus color-calibrated sRGB exports optimized for retina displays."
      ),
      pricing: t(
        "Cesiones temporales o indefinidas según el alcance del proyecto.",
        "Fixed-term or perpetual digital licenses scaled to project scope."
      ),
    },
    {
      name: t("Espacios Corporativos", "Corporate Spaces & Interiors"),
      priceFrom: t("Desde\u00A0250\u00A0€", "From\u00A0€250"),
      scope: t("Decoración interior y sedes", "Interior design & headquarters"),
      uses: t(
        "Murales de gran formato para recepciones empresariales, hoteles boutique y estudios de arquitectura.",
        "Large-scale architectural murals for corporate lobbies, boutique hotels, and design studios."
      ),
      specs: t(
        "Archivos TIFF 16-bit optimizados para gran formato y soportes expositivos.",
        "16-bit TIFF masters prepared for large-format display and exhibition substrates."
      ),
      pricing: t(
        "Tarifa fija por ubicación y dimensiones del soporte expositivo.",
        "Flat license rate based on location and display physical dimensions."
      ),
    },
  ];

  const technicalSpecs = [
    {
      label: t("Resolución Nativa", "Native Resolution"),
      value: t("32,5 Megapíxeles (6960 × 4640 píxeles)", "32.5 Megapixels (6960 × 4640 px)"),
    },
    {
      label: t("Sensor & Sistema", "Sensor & System"),
      value: "Canon Dual Pixel CMOS AF II (APS-C)",
    },
    {
      label: t("Espacio de Color", "Color Space"),
      value: "Adobe RGB (1998) / ProPhoto RGB / sRGB",
    },
    {
      label: t("Formatos de Entrega", "Delivery Formats"),
      value: t(
        "TIFF 16-bit sin comprimir o JPEG máxima calidad",
        "Uncompressed 16-bit TIFF or maximum-quality JPEG"
      ),
    },
    {
      label: t("Metadatos Incrustados", "Embedded Metadata"),
      value: t(
        "IPTC completo: Autoría, Copyright, EXIF y pie descriptivo",
        "Complete IPTC: Authorship, Copyright, EXIF & captioning"
      ),
    },
    {
      label: t("Tiempo de Respuesta", "Response Time"),
      value: plazos.respuesta,
    },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0B0C0E] pt-36 pb-28 text-[#EBE7DF]">
      <AndalusianPageBackdrop variant="laceria" />
      <Container className="relative z-10">
        {/* Header */}
        <div className="max-w-3xl">
          <p className="text-xs uppercase tracking-[0.4em] text-[#C5A880]/85 font-mono">
            {t("Cesión de Derechos & Uso Profesional", "Rights Clearance & Commercial Usage")}
          </p>
          <h1 className="mt-4 font-serif text-4xl font-light tracking-wide text-[#EBE7DF] sm:text-5xl lg:text-6xl">
            {t("Licencias de Imagen", "Image Licensing")}
          </h1>
          <p className="mt-6 text-base leading-relaxed text-[#EBE7DF]/80 sm:text-lg font-light">
            {t(
              "Todas las fotografías del archivo están disponibles bajo licencia para revistas, libros, prensa, proyectos culturales o campañas comerciales. Los archivos se entregan a resolución completa (32,5 MP) con revelado cuidado y datos de catalogación listos para publicación.",
              "Every photograph in the archive is available for Rights-Managed licensing across magazines, books, cultural institutions, and commercial campaigns. Masters are delivered at full 32.5 MP resolution with color grading and press-ready IPTC cataloging."
            )}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              href="/contact?motivo=licencia"
              className="inline-flex min-h-[44px] items-center gap-2 border border-[#C5A880] bg-[#C5A880] px-6 py-3 text-xs font-mono uppercase tracking-[0.25em] text-[#0B0C0E] font-semibold transition hover:bg-white hover:border-white"
            >
              <span>
                {t(
                  "Solicitar Licencia Directa al Autor (Canal Principal)",
                  "Request Direct Author License (Primary Channel)"
                )}
              </span>
              <span>→</span>
            </Link>
            <a
              href={SITE_CONFIG.social.getty}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[44px] items-center gap-2 border border-[#202226] bg-[#202226]/60 px-6 py-3 text-xs font-mono uppercase tracking-[0.25em] text-[#EBE7DF] transition hover:border-[#A39E93] hover:text-white"
            >
              <span>
                {t("Canal Secundario: Getty Images / iStock", "Secondary Channel: Getty Images / iStock")}
              </span>
              <span>↗</span>
            </a>
          </div>
        </div>

        <AndalusianCenefa
          variant="estrella"
          className="mt-12 text-[#C5A880]/38"
        />

        {/* Interactive Commercial Licensing Configurator */}
        <LicenseConfigurator />

        {/* Technical Specs Banner */}
        <div className="mt-16 rounded-xl border border-[#202226] bg-[#202226]/40 p-8 sm:p-10">
          <div className="border-b border-[#202226] pb-4">
            <h2 className="text-xs uppercase tracking-[0.35em] text-[#8E8A80] font-mono">
              {t("Estándar de Calidad de los Archivos Master", "Master File Quality Standard")}
            </h2>
            <p className="mt-1 font-serif text-xl text-[#EBE7DF]">
              {t("Especificaciones técnicas de entrega directa", "Direct Delivery Technical Specifications")}
            </p>
          </div>
          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {technicalSpecs.map((spec) => (
              <div key={spec.label} className="border-l border-[#202226] pl-4">
                <p className="text-[10px] uppercase tracking-[0.25em] text-[#8E8A80] font-mono">
                  {spec.label}
                </p>
                <p className="mt-1 font-mono text-xs text-[#EBE7DF]">
                  {spec.value}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Licensing Tiers */}
        <div className="mt-20">
          <div className="border-b border-[#202226] pb-4">
            <h2 className="text-xs uppercase tracking-[0.35em] text-[#8E8A80] font-mono">
              {t("Modalidades de Licenciamiento", "Licensing Tiers")}
            </h2>
            <p className="mt-1 font-serif text-2xl text-[#EBE7DF]">
              {t(
                "Términos adaptados al tipo de difusión y alcance",
                "Terms tailored to distribution channels and campaign scope"
              )}
            </p>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
            {tiers.map((tier) => (
              <div
                key={tier.name}
                className="flex flex-col justify-between rounded-lg border border-[#202226] bg-[#202226]/40 p-8 sm:p-10 transition hover:border-[#8E8A80]/60"
              >
                <div>
                  <div className="flex items-start sm:items-center justify-between gap-3">
                    <span className="min-w-0 text-[10px] uppercase tracking-[0.22em] sm:tracking-[0.3em] leading-snug text-[#A39E93] font-mono">
                      {tier.scope}
                    </span>
                    <span className="shrink-0 whitespace-nowrap border border-[#C5A880]/35 bg-[#0B0C0E] px-2.5 py-1 font-mono text-[10px] font-semibold text-[#C5A880]">
                      {tier.priceFrom}
                    </span>
                  </div>
                  <h3 className="mt-2 font-serif text-2xl text-[#EBE7DF]">{tier.name}</h3>
                  <p className="mt-4 text-xs leading-relaxed text-[#EBE7DF]/80 font-light">
                    <strong className="text-[#EBE7DF]">
                      {t("Aplicaciones:", "Applications:")}
                    </strong>{" "}
                    {tier.uses}
                  </p>
                  <p className="mt-3 text-xs leading-relaxed text-neutral-400 font-light">
                    <strong className="text-[#EBE7DF]">
                      {t("Formato:", "Deliverables:")}
                    </strong>{" "}
                    {tier.specs}
                  </p>
                </div>

                <div className="mt-8 border-t border-[#202226] pt-6">
                  <p className="text-[11px] text-neutral-400">
                    <strong className="text-[#EBE7DF]">
                      {t("Tarificación:", "Fee Structure:")}
                    </strong>{" "}
                    {tier.pricing}
                  </p>
                  <Link
                    href={`/contact?motivo=licencia&tipo=${encodeURIComponent(tier.name)}`}
                    className="mt-5 inline-flex w-full items-center justify-center border border-[#202226] bg-[#202226]/60 py-3 text-xs uppercase tracking-[0.3em] text-[#EBE7DF] transition hover:border-[#8E8A80] hover:text-white"
                  >
                    {t("Solicitar cotización", "Request a quote")}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Licensed Works Catalog */}
        <div className="mt-24">
          <div className="flex flex-col justify-between gap-4 border-b border-[#202226] pb-6 sm:flex-row sm:items-end">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-[#8E8A80] font-mono">
                {t("Obras Destacadas para Licencia", "Featured Works Available to License")}
              </p>
              <h2 className="mt-2 font-serif text-3xl font-light text-[#EBE7DF]">
                {t(
                  `Selección destacada del banco de imágenes (${totalLicensedCount} obras en archivo)`,
                  `Curated highlights from the image archive (${totalLicensedCount} cataloged works)`
                )}
              </h2>
            </div>
            <p className="text-xs text-[#8E8A80] font-mono">
              {t(
                "Cesión gestionada directamente o mediante agencia asociada.",
                "Managed directly with the author or via partner stock agency."
              )}
            </p>
          </div>

          <div className="mt-10 columns-1 gap-8 sm:columns-2 lg:columns-3">
            {featuredLicensed.map((raw) => {
              const photo = getLocalizedPhoto(raw, lang);
              const badgeLabel =
                lang === "en"
                  ? CATEGORY_METADATA[photo.category]?.titleEn ?? photo.category
                  : photo.category.replace("-", " ");

              return (
                <div
                  key={photo.id}
                  className="group mb-8 flex break-inside-avoid flex-col justify-between rounded-lg border border-[#202226] bg-[#202226]/40 transition hover:border-[#8E8A80]/60 overflow-hidden"
                >
                  <div>
                    <div className="relative w-full overflow-hidden rounded-t-lg bg-[#202226]">
                      <Image
                        src={photo.image}
                        alt={photo.alt}
                        width={photo.width}
                        height={photo.height}
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        quality={85}
                        className="h-auto w-full transition duration-500 group-hover:scale-[1.02]"
                      />
                      <div className="absolute left-3 top-3">
                        <span className="bg-[#0B0C0E]/90 border border-[#202226] px-2.5 py-1 text-[9px] uppercase tracking-[0.25em] text-[#EBE7DF] backdrop-blur-sm font-mono">
                          {badgeLabel}
                        </span>
                      </div>
                    </div>

                    <div className="p-6 sm:p-7">
                      <p className="text-[10px] uppercase tracking-[0.3em] text-[#8E8A80] font-mono">
                        {photo.location ? `${photo.location} · ` : ""}
                        {photo.year} · {t("Archivo Master 32,5 MP", "32.5 MP Master File")}
                      </p>
                      <h3 className="mt-2 font-serif text-xl font-light text-[#EBE7DF]">
                        {photo.title}
                      </h3>
                      <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-[#EBE7DF]/80 font-light">
                        {photo.description}
                      </p>
                      <div className="mt-4 flex flex-wrap gap-2 text-[10px] text-[#8E8A80]">
                        <span className="border border-[#202226] bg-[#0B0C0E] px-2 py-0.5 font-mono">
                          {photo.camera}
                        </span>
                        <span className="border border-[#202226] bg-[#0B0C0E] px-2 py-0.5 font-mono">
                          {photo.lens}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t border-[#202226] p-6 pt-4 bg-[#202226]/20">
                    <Link
                      href={`/portfolio/${photo.slug}`}
                      className="text-xs uppercase tracking-[0.25em] text-[#8E8A80] hover:text-[#EBE7DF] transition"
                    >
                      {t("Ver ficha", "View sheet")}
                    </Link>
                    <Link
                      href={`/contact?motivo=licencia&obra=${encodeURIComponent(raw.title)}`}
                      className="border border-[#202226] bg-[#202226]/60 px-4 py-2 text-[11px] uppercase tracking-[0.25em] text-[#EBE7DF] transition hover:border-[#8E8A80] hover:text-white"
                    >
                      {t("Solicitar licencia", "Request license")}
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Agency Note & Direct CTA */}
        <div className="mt-24 rounded-xl border border-[#202226] bg-[#202226]/30 p-8 sm:p-14">
          <div className="max-w-2xl">
            <span className="text-xs uppercase tracking-[0.35em] text-[#8E8A80] font-mono">
              {t("Agencias & Gestores de Derechos", "Agencies & Rights Buyers")}
            </span>
            <h2 className="mt-3 font-serif text-2xl text-[#EBE7DF] sm:text-3xl">
              {t(
                "¿Representa a una agencia editorial o gabinete de prensa?",
                "Representing a publishing group or press office?"
              )}
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-[#EBE7DF]/80 font-light">
              {t(
                "Facilitamos acuerdos marco anuales para grupos editoriales y departamentos de comunicación, así como paquetes de imágenes con derechos mundiales para campañas globales.",
                "We arrange annual master agreements for editorial groups and communications teams, as well as multi-image bundles with worldwide rights for international campaigns."
              )}
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/contact?motivo=licencia"
                className="inline-flex border border-[#EBE7DF] bg-[#EBE7DF] px-8 py-3.5 text-xs uppercase tracking-[0.3em] text-[#0B0C0E] font-semibold transition hover:bg-transparent hover:text-white"
              >
                {t("Iniciar solicitud de derechos", "Start rights request")}
              </Link>
              <a
                href={`mailto:${SITE_CONFIG.contactEmail}?subject=${encodeURIComponent(
                  t("Solicitud de Licencia de Imagen", "Image Licensing Inquiry")
                )}`}
                className="inline-flex border border-[#202226] bg-[#202226]/60 px-8 py-3.5 text-xs uppercase tracking-[0.3em] text-[#EBE7DF] transition hover:border-[#8E8A80] hover:text-white"
              >
                {t("Enviar briefing por email", "Email project brief")}
              </a>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
