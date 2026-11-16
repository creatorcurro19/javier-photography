import Image from "next/image";
import Link from "next/link";
import Container from "@/components/ui/Container";
import { buildPageMetadata } from "@/lib/metadata";
import { getLicensedPhotos } from "@/lib/photos";

export const metadata = buildPageMetadata({
  title: "Licencias de Imagen | Javier Espinosa",
  description:
    "Cesión de derechos y licencias de fotografía de alta resolución para usos editoriales, comerciales, corporativos y publicitarios.",
  path: "/licensing",
});

const TIERS = [
  {
    name: "Editorial & Prensa",
    scope: "Publicaciones impresas y digitales",
    uses: "Artículos de prensa, revistas de naturaleza y motor, monográficos de viaje, libros temáticos y divulgación.",
    specs: "Archivos a 300 DPI, perfil Adobe RGB con metadatos IPTC completos.",
    pricing: "Tarifas basadas en tirada, posición (portada/interior) y territorio.",
  },
  {
    name: "Comercial & Publicidad",
    scope: "Campañas de marca y producto",
    uses: "Publicidad exterior, catálogos comerciales, comunicación corporativa para automoción, arquitectura o turismo.",
    specs: "Archivos TIFF 16-bit master sin compresión ni recorte destructivo.",
    pricing: "Presupuesto a medida según duración de campaña, medios y exclusivity.",
  },
  {
    name: "Digital & Audiovisual",
    scope: "Plataformas web, redes y vídeo",
    uses: "Cabeceras web, piezas audiovisuales, documentales y campañas en entornos digitales de alta exigencia.",
    specs: "Entregas en sRGB optimizadas para renderizado en pantallas retina.",
    pricing: "Cesiones temporales o indefinidas según el alcance del proyecto.",
  },
  {
    name: "Espacios Corporativos",
    scope: "Decoración interior y sedes",
    uses: "Murales gran formato para recepciones empresariales, hoteles boutique y oficinas de arquitectura.",
    specs: "Archivos optimizados para gigantografía y soportes rígidos retroiluminados.",
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
    value: "Entrega electrónica en menos de 24 horas",
  },
];

export default function LicensingPage() {
  const licensed = getLicensedPhotos();

  return (
    <div className="min-h-screen bg-black pt-36 pb-28 text-neutral-300">
      <Container>
        {/* Header */}
        <div className="max-w-3xl">
          <p className="text-xs uppercase tracking-[0.4em] text-neutral-400">
            Cesión de Derechos & Uso Profesional
          </p>
          <h1 className="mt-4 font-serif text-4xl font-light tracking-wide text-neutral-100 sm:text-5xl lg:text-6xl">
            Licencias de Imagen
          </h1>
          <p className="mt-6 text-base leading-relaxed text-neutral-300 sm:text-lg">
            Las fotografías del archivo de Javier Espinosa están disponibles para licenciamiento 
            editorial, publicitario y corporativo. Cada imagen cuenta con archivo master de 32,5 MP 
            de resolución nativa, revelado profesional riguroso y metadatos de catalogación completos.
          </p>
        </div>

        {/* Technical Specs Banner */}
        <div className="mt-16 rounded-xl border border-neutral-800 bg-neutral-950/60 p-8 sm:p-10">
          <div className="border-b border-neutral-800 pb-4">
            <h2 className="text-xs uppercase tracking-[0.35em] text-neutral-400">
              Estándar de Calidad de los Archivos Master
            </h2>
            <p className="mt-1 font-serif text-xl text-neutral-100">
              Especificaciones técnicas de entrega directa
            </p>
          </div>
          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {TECHNICAL_SPECS.map((spec) => (
              <div key={spec.label} className="border-l border-neutral-800 pl-4">
                <p className="text-[10px] uppercase tracking-[0.25em] text-neutral-400">
                  {spec.label}
                </p>
                <p className="mt-1 font-mono text-xs text-neutral-200">
                  {spec.value}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Licensing Tiers */}
        <div className="mt-20">
          <div className="border-b border-neutral-800 pb-4">
            <h2 className="text-xs uppercase tracking-[0.35em] text-neutral-400">
              Modalidades de Licenciamiento
            </h2>
            <p className="mt-1 font-serif text-2xl text-neutral-100">
              Términos adaptados al tipo de difusión y alcance
            </p>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
            {TIERS.map((tier) => (
              <div
                key={tier.name}
                className="flex flex-col justify-between rounded-lg border border-neutral-800 bg-neutral-950/60 p-8 sm:p-10 transition hover:border-neutral-700"
              >
                <div>
                  <span className="text-[10px] uppercase tracking-[0.3em] text-neutral-400">
                    {tier.scope}
                  </span>
                  <h3 className="mt-2 font-serif text-2xl text-neutral-100">{tier.name}</h3>
                  <p className="mt-4 text-xs leading-relaxed text-neutral-300">
                    <strong className="text-neutral-200">Aplicaciones:</strong> {tier.uses}
                  </p>
                  <p className="mt-3 text-xs leading-relaxed text-neutral-400">
                    <strong className="text-neutral-300">Formato:</strong> {tier.specs}
                  </p>
                </div>

                <div className="mt-8 border-t border-neutral-900 pt-6">
                  <p className="text-[11px] text-neutral-400">
                    <strong className="text-neutral-300">Tarificación:</strong> {tier.pricing}
                  </p>
                  <Link
                    href={`/contact?motivo=licencia&tipo=${encodeURIComponent(tier.name)}`}
                    className="mt-5 inline-flex w-full items-center justify-center border border-neutral-700 bg-neutral-900/60 py-3 text-xs uppercase tracking-[0.3em] text-neutral-200 transition hover:border-neutral-400 hover:text-white"
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
          <div className="flex flex-col justify-between gap-4 border-b border-neutral-800 pb-6 sm:flex-row sm:items-end">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-neutral-400">
                Obras Destacadas para Licencia
              </p>
              <h2 className="mt-2 font-serif text-3xl font-light text-neutral-100">
                Catálogo de imágenes disponibles ({licensed.length} fotografías)
              </h2>
            </div>
            <p className="text-xs text-neutral-400">
              Cesión gestionada directamente o mediante agencia asociada.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {licensed.map((photo) => (
              <div
                key={photo.id}
                className="group flex flex-col justify-between rounded-lg border border-neutral-900 bg-neutral-950/80 transition hover:border-neutral-700 overflow-hidden"
              >
                <div>
                  <div className="relative aspect-[3/2] w-full overflow-hidden rounded-t-lg bg-neutral-900">
                    <Image
                      src={photo.image}
                      alt={photo.alt}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition duration-500 group-hover:scale-105"
                    />
                    <div className="absolute left-3 top-3">
                      <span className="bg-black/80 px-2.5 py-1 text-[9px] uppercase tracking-[0.25em] text-neutral-300 backdrop-blur-sm">
                        {photo.category.replace("-", " ")}
                      </span>
                    </div>
                  </div>

                  <div className="p-6 sm:p-7">
                    <p className="text-[10px] uppercase tracking-[0.3em] text-neutral-400">
                      {photo.location ? `${photo.location} · ` : ""}{photo.year} · Archivo Master 32,5 MP
                    </p>
                    <h3 className="mt-2 font-serif text-xl font-light text-neutral-100">
                      {photo.title}
                    </h3>
                    <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-neutral-400">
                      {photo.description}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2 text-[10px] text-neutral-400">
                      <span className="border border-neutral-800 px-2 py-0.5 font-mono">
                        {photo.camera}
                      </span>
                      <span className="border border-neutral-800 px-2 py-0.5 font-mono">
                        {photo.lens}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-neutral-900 p-6 pt-4">
                  <Link
                    href={`/portfolio/${photo.slug}`}
                    className="text-xs uppercase tracking-[0.25em] text-neutral-400 transition hover:text-neutral-200"
                  >
                    Ver ficha
                  </Link>
                  <Link
                    href={`/contact?motivo=licencia&obra=${encodeURIComponent(photo.title)}`}
                    className="border border-neutral-700 bg-neutral-900/60 px-4 py-2 text-[11px] uppercase tracking-[0.25em] text-neutral-200 transition hover:border-neutral-400 hover:text-white"
                  >
                    Solicitar licencia
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Agency Note & Direct CTA */}
        <div className="mt-24 rounded-xl border border-neutral-800 bg-neutral-950/60 p-8 sm:p-14">
          <div className="max-w-2xl">
            <span className="text-xs uppercase tracking-[0.35em] text-neutral-400">
              Agencias & Gestores de Derechos
            </span>
            <h2 className="mt-3 font-serif text-2xl text-neutral-100 sm:text-3xl">
              ¿Representa a una agencia editorial o gabinete de prensa?
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-neutral-300">
              Facilitamos acuerdos marco anuales para grupos editoriales y departamentos de comunicación, 
              así como paquetes de imágenes con derechos mundiales para campañas globales.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/contact?motivo=licencia"
                className="inline-flex border border-neutral-200 bg-neutral-100 px-8 py-3.5 text-xs uppercase tracking-[0.3em] text-neutral-950 font-medium transition hover:bg-white hover:text-black hover:border-white"
              >
                Iniciar solicitud de derechos
              </Link>
              <a
                href="mailto:hello@javierespinosa.com?subject=Solicitud%20de%20Licencia%20de%20Imagen"
                className="inline-flex border border-neutral-700 bg-neutral-900/60 px-8 py-3.5 text-xs uppercase tracking-[0.3em] text-neutral-200 transition hover:border-neutral-400 hover:text-white"
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
