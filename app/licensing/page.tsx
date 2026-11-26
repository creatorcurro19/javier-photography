import Image from "next/image";
import Link from "next/link";
import Container from "@/components/ui/Container";
import LicenseConfigurator from "@/components/licensing/LicenseConfigurator";
import {
  AndalusianCenefa,
  AndalusianPageBackdrop,
} from "@/components/ui/AndalusianMotif";
import JsonLd from "@/components/seo/JsonLd";
import { buildPageMetadata } from "@/lib/metadata";
import { getLicensedPhotos } from "@/lib/photos";
import { generateBreadcrumbSchema } from "@/lib/schema";

export const metadata = buildPageMetadata({
  title: "Licencias de Imagen Editorial y Comercial (Image Licensing) | Javier Espinosa",
  description:
    "Cesión de derechos y licencias Rights-Managed de fotografía en alta resolución (32,5 MP TIFF/JPEG) para usos editoriales, prensa, campañas comerciales y decoración corporativa.",
  path: "/licensing",
  keywords: [
    "licencias de fotografía",
    "image licensing spain",
    "cesión de derechos fotográficos",
    "editorial photography licensing",
    "rights managed photography",
    "banco de imágenes autor",
  ],
});

const TIERS = [
  {
    name: "Editorial y Prensa",
    priceFrom: "Desde\u00A060\u00A0€",
    scope: "Publicaciones impresas y digitales",
    uses: "Artículos de prensa, revistas de naturaleza y motor, monográficos de viaje, libros temáticos y divulgación.",
    specs: "Archivos TIFF 16-bit y JPEG máxima calidad a 300 DPI, perfil Adobe RGB con metadatos IPTC completos.",
    pricing: "Tarifas basadas en tirada, posición (portada/interior) y territorio.",
  },
  {
    name: "Comercial y Publicidad",
    priceFrom: "Desde\u00A0150\u00A0€",
    scope: "Campañas de marca y producto",
    uses: "Publicidad exterior, catálogos comerciales, comunicación corporativa para automoción, arquitectura o turismo.",
    specs: "Archivos TIFF 16-bit máster sin compresión ni recorte destructivo.",
    pricing: "Presupuesto a medida según duración de campaña, medios y exclusividad sectorial.",
  },
  {
    name: "Digital y Audiovisual",
    priceFrom: "Desde\u00A045\u00A0€",
    scope: "Plataformas web, redes y vídeo",
    uses: "Cabeceras web, piezas audiovisuales, documentales y campañas en entornos digitales de alta exigencia.",
    specs: "Máster TIFF 16-bit + entregas en sRGB optimizadas para pantallas de alta densidad.",
    pricing: "Cesiones temporales o indefinidas según el alcance del proyecto.",
  },
  {
    name: "Espacios Corporativos",
    priceFrom: "Desde\u00A0250\u00A0€",
    scope: "Decoración interior y sedes",
    uses: "Murales de gran formato para recepciones empresariales, hoteles boutique y estudios de arquitectura.",
    specs: "Archivos TIFF 16-bit optimizados para gran formato y soportes expositivos.",
    pricing: "Tarifa fija por ubicación y dimensiones del soporte expositivo.",
  },
];

const TECHNICAL_SPECS = [
  {
    label: "Resolución Nativa",
    value: "32,5 Megapíxeles (6960 × 4640 píxeles)",
  },
  {
    label: "Sensor & Sistema",
    value: "Canon Dual Pixel CMOS AF II (APS-C)",
  },
  {
    label: "Espacio de Color",
    value: "Adobe RGB (1998) / ProPhoto RGB / sRGB",
  },
  {
    label: "Formatos de Entrega",
    value: "TIFF 16-bit sin comprimir o JPEG máxima calidad",
  },
  {
    label: "Metadatos Incrustados",
    value: "IPTC completo: Autoría, Copyright, EXIF y pie descriptivo",
  },
  {
    label: "Tiempo de Respuesta",
    value: "Entrega electrónica estimada en 24 horas laborables",
  },
];

export default function LicensingPage() {
  const allLicensed = getLicensedPhotos();
  const licensed = allLicensed.filter((p) => p.prints || p.featured).slice(0, 18);

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0B0C0E] pt-36 pb-28 text-[#EBE7DF]">
      <JsonLd
        data={generateBreadcrumbSchema([
          { name: "Inicio", path: "/" },
          { name: "Licencias de Imagen", path: "/licensing" },
        ])}
      />
      <AndalusianPageBackdrop variant="laceria" />
      <Container className="relative z-10">
        {/* Header */}
        <div className="max-w-3xl">
          <p className="text-xs uppercase tracking-[0.4em] text-[#C5A880]/85 font-mono">
            Cesión de Derechos & Uso Profesional
          </p>
          <h1 className="mt-4 font-serif text-4xl font-light tracking-wide text-[#EBE7DF] sm:text-5xl lg:text-6xl">
            Licencias de Imagen
          </h1>
          <p className="mt-6 text-base leading-relaxed text-[#EBE7DF]/80 sm:text-lg font-light">
            Todas las fotografías del archivo están disponibles bajo licencia para revistas, libros, prensa, proyectos culturales o campañas comerciales. Los archivos se entregan a resolución completa (32,5 MP) con revelado cuidado y datos de catalogación listos para publicación.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              href="/contact?motivo=licencia"
              className="inline-flex min-h-[44px] items-center gap-2 border border-[#C5A880] bg-[#C5A880] px-6 py-3 text-xs font-mono uppercase tracking-[0.25em] text-[#0B0C0E] font-semibold transition hover:bg-white hover:border-white"
            >
              <span>Solicitar Licencia Directa al Autor (Canal Principal)</span>
              <span>→</span>
            </Link>
            <a
              href="https://www.istockphoto.com/portfolio/JavierEspinosa?sort=purerecency&assettype=image"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[44px] items-center gap-2 border border-[#202226] bg-[#202226]/60 px-6 py-3 text-xs font-mono uppercase tracking-[0.25em] text-[#EBE7DF] transition hover:border-[#A39E93] hover:text-white"
            >
              <span>Canal Secundario: Getty Images / iStock</span>
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
              Estándar de Calidad de los Archivos Master
            </h2>
            <p className="mt-1 font-serif text-xl text-[#EBE7DF]">
              Especificaciones técnicas de entrega directa
            </p>
          </div>
          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {TECHNICAL_SPECS.map((spec) => (
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
              Modalidades de Licenciamiento
            </h2>
            <p className="mt-1 font-serif text-2xl text-[#EBE7DF]">
              Términos adaptados al tipo de difusión y alcance
            </p>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
            {TIERS.map((tier) => (
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
                    <strong className="text-[#EBE7DF]">Aplicaciones:</strong> {tier.uses}
                  </p>
                  <p className="mt-3 text-xs leading-relaxed text-neutral-400 font-light">
                    <strong className="text-[#EBE7DF]">Formato:</strong> {tier.specs}
                  </p>
                </div>

                <div className="mt-8 border-t border-[#202226] pt-6">
                  <p className="text-[11px] text-neutral-400">
                    <strong className="text-[#EBE7DF]">Tarificación:</strong> {tier.pricing}
                  </p>
                  <Link
                    href={`/contact?motivo=licencia&tipo=${encodeURIComponent(tier.name)}`}
                    className="mt-5 inline-flex w-full items-center justify-center border border-[#202226] bg-[#202226]/60 py-3 text-xs uppercase tracking-[0.3em] text-[#EBE7DF] transition hover:border-[#8E8A80] hover:text-white"
                  >
                    Solicitar cotización
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
                Obras Destacadas para Licencia
              </p>
              <h2 className="mt-2 font-serif text-3xl font-light text-[#EBE7DF]">
                Selección destacada del banco de imágenes ({allLicensed.length} obras en archivo)
              </h2>
            </div>
            <p className="text-xs text-[#8E8A80] font-mono">
              Cesión gestionada directamente o mediante agencia asociada.
            </p>
          </div>

          <div className="mt-10 columns-1 gap-8 sm:columns-2 lg:columns-3">
            {licensed.map((photo) => (
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
                        {photo.category.replace("-", " ")}
                      </span>
                    </div>
                  </div>

                  <div className="p-6 sm:p-7">
                    <p className="text-[10px] uppercase tracking-[0.3em] text-[#8E8A80] font-mono">
                      {photo.location ? `${photo.location} · ` : ""}{photo.year} · Archivo Master 32,5 MP
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
                    Ver ficha
                  </Link>
                  <Link
                    href={`/contact?motivo=licencia&obra=${encodeURIComponent(photo.title)}`}
                    className="border border-[#202226] bg-[#202226]/60 px-4 py-2 text-[11px] uppercase tracking-[0.25em] text-[#EBE7DF] transition hover:border-[#8E8A80] hover:text-white"
                  >
                    Solicitar licencia
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Agency Note & Direct CTA */}
        <div className="mt-24 rounded-xl border border-[#202226] bg-[#202226]/30 p-8 sm:p-14">
          <div className="max-w-2xl">
            <span className="text-xs uppercase tracking-[0.35em] text-[#8E8A80] font-mono">
              Agencias & Gestores de Derechos
            </span>
            <h2 className="mt-3 font-serif text-2xl text-[#EBE7DF] sm:text-3xl">
              ¿Representa a una agencia editorial o gabinete de prensa?
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-[#EBE7DF]/80 font-light">
              Facilitamos acuerdos marco anuales para grupos editoriales y departamentos de comunicación, 
              así como paquetes de imágenes con derechos mundiales para campañas globales.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/contact?motivo=licencia"
                className="inline-flex border border-[#EBE7DF] bg-[#EBE7DF] px-8 py-3.5 text-xs uppercase tracking-[0.3em] text-[#0B0C0E] font-semibold transition hover:bg-transparent hover:text-white"
              >
                Iniciar solicitud de derechos
              </Link>
              <a
                href="mailto:javierespinosa1995@hotmail.com?subject=Solicitud%20de%20Licencia%20de%20Imagen"
                className="inline-flex border border-[#202226] bg-[#202226]/60 px-8 py-3.5 text-xs uppercase tracking-[0.3em] text-[#EBE7DF] transition hover:border-[#8E8A80] hover:text-white"
              >
                Enviar briefing por email
              </a>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
