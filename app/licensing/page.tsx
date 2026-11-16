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
  const allLicensed = getLicensedPhotos();
  const licensed = allLicensed.filter((p) => p.prints || p.featured).slice(0, 18);

  return (
    <div className="min-h-screen bg-[#101112] pt-36 pb-28 text-[#D8D5CD]">
      <Container>
        {/* Header */}
        <div className="max-w-3xl">
          <p className="text-xs uppercase tracking-[0.4em] text-[#95836B] font-mono">
            Cesión de Derechos & Uso Profesional
          </p>
          <h1 className="mt-4 font-serif text-4xl font-light tracking-wide text-[#D8D5CD] sm:text-5xl lg:text-6xl">
            Licencias de Imagen
          </h1>
          <p className="mt-6 text-base leading-relaxed text-[#D8D5CD]/80 sm:text-lg font-light">
            Las fotografías del archivo de Javier Espinosa están disponibles para licenciamiento 
            editorial, publicitario y corporativo. Cada imagen cuenta con archivo master de 32,5 MP 
            de resolución nativa, revelado profesional riguroso y metadatos de catalogación completos.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <a
              href="https://www.istockphoto.com/portfolio/JavierEspinosa?sort=purerecency&assettype=image"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 border border-[#D8D5CD] bg-[#D8D5CD] px-6 py-3 text-xs uppercase tracking-[0.25em] text-[#101112] font-semibold transition hover:bg-transparent hover:text-white"
            >
              <span>Portfolio Oficial en Getty Images / iStock</span>
              <span>↗</span>
            </a>
            <Link
              href="/contact?motivo=licencia"
              className="inline-flex items-center gap-2 border border-[#1D2021] bg-[#1D2021]/60 px-6 py-3 text-xs uppercase tracking-[0.25em] text-[#D8D5CD] transition hover:border-[#95836B] hover:text-white"
            >
              Licencia Directa o Exclusividad
            </Link>
          </div>
        </div>

        {/* Technical Specs Banner */}
        <div className="mt-16 rounded-xl border border-[#1D2021] bg-[#1D2021]/40 p-8 sm:p-10">
          <div className="border-b border-[#1D2021] pb-4">
            <h2 className="text-xs uppercase tracking-[0.35em] text-[#95836B] font-mono">
              Estándar de Calidad de los Archivos Master
            </h2>
            <p className="mt-1 font-serif text-xl text-[#D8D5CD]">
              Especificaciones técnicas de entrega directa
            </p>
          </div>
          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {TECHNICAL_SPECS.map((spec) => (
              <div key={spec.label} className="border-l border-[#1D2021] pl-4">
                <p className="text-[10px] uppercase tracking-[0.25em] text-[#95836B] font-mono">
                  {spec.label}
                </p>
                <p className="mt-1 font-mono text-xs text-[#D8D5CD]">
                  {spec.value}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Licensing Tiers */}
        <div className="mt-20">
          <div className="border-b border-[#1D2021] pb-4">
            <h2 className="text-xs uppercase tracking-[0.35em] text-[#95836B] font-mono">
              Modalidades de Licenciamiento
            </h2>
            <p className="mt-1 font-serif text-2xl text-[#D8D5CD]">
              Términos adaptados al tipo de difusión y alcance
            </p>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
            {TIERS.map((tier) => (
              <div
                key={tier.name}
                className="flex flex-col justify-between rounded-lg border border-[#1D2021] bg-[#1D2021]/40 p-8 sm:p-10 transition hover:border-[#95836B]/60"
              >
                <div>
                  <span className="text-[10px] uppercase tracking-[0.3em] text-[#95836B] font-mono">
                    {tier.scope}
                  </span>
                  <h3 className="mt-2 font-serif text-2xl text-[#D8D5CD]">{tier.name}</h3>
                  <p className="mt-4 text-xs leading-relaxed text-[#D8D5CD]/80 font-light">
                    <strong className="text-[#D8D5CD]">Aplicaciones:</strong> {tier.uses}
                  </p>
                  <p className="mt-3 text-xs leading-relaxed text-neutral-400 font-light">
                    <strong className="text-[#D8D5CD]">Formato:</strong> {tier.specs}
                  </p>
                </div>

                <div className="mt-8 border-t border-[#1D2021] pt-6">
                  <p className="text-[11px] text-neutral-400">
                    <strong className="text-[#D8D5CD]">Tarificación:</strong> {tier.pricing}
                  </p>
                  <Link
                    href={`/contact?motivo=licencia&tipo=${encodeURIComponent(tier.name)}`}
                    className="mt-5 inline-flex w-full items-center justify-center border border-[#1D2021] bg-[#1D2021]/60 py-3 text-xs uppercase tracking-[0.3em] text-[#D8D5CD] transition hover:border-[#95836B] hover:text-white"
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
          <div className="flex flex-col justify-between gap-4 border-b border-[#1D2021] pb-6 sm:flex-row sm:items-end">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-[#95836B] font-mono">
                Obras Destacadas para Licencia
              </p>
              <h2 className="mt-2 font-serif text-3xl font-light text-[#D8D5CD]">
                Selección destacada del banco de imágenes ({allLicensed.length} obras en archivo)
              </h2>
            </div>
            <p className="text-xs text-[#95836B] font-mono">
              Cesión gestionada directamente o mediante agencia asociada.
            </p>
          </div>

          <div className="mt-10 columns-1 gap-8 sm:columns-2 lg:columns-3">
            {licensed.map((photo) => (
              <div
                key={photo.id}
                className="group mb-8 flex break-inside-avoid flex-col justify-between rounded-lg border border-[#1D2021] bg-[#1D2021]/40 transition hover:border-[#95836B]/60 overflow-hidden"
              >
                <div>
                  <div className="relative w-full overflow-hidden rounded-t-lg bg-[#1D2021]">
                    <Image
                      src={photo.image}
                      alt={photo.alt}
                      width={photo.width}
                      height={photo.height}
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="h-auto w-full transition duration-500 group-hover:scale-[1.02]"
                    />
                    <div className="absolute left-3 top-3">
                      <span className="bg-[#101112]/90 border border-[#1D2021] px-2.5 py-1 text-[9px] uppercase tracking-[0.25em] text-[#D8D5CD] backdrop-blur-sm font-mono">
                        {photo.category.replace("-", " ")}
                      </span>
                    </div>
                  </div>

                  <div className="p-6 sm:p-7">
                    <p className="text-[10px] uppercase tracking-[0.3em] text-[#95836B] font-mono">
                      {photo.location ? `${photo.location} · ` : ""}{photo.year} · Archivo Master 32,5 MP
                    </p>
                    <h3 className="mt-2 font-serif text-xl font-light text-[#D8D5CD]">
                      {photo.title}
                    </h3>
                    <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-[#D8D5CD]/80 font-light">
                      {photo.description}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2 text-[10px] text-[#95836B]">
                      <span className="border border-[#1D2021] bg-[#101112] px-2 py-0.5 font-mono">
                        {photo.camera}
                      </span>
                      <span className="border border-[#1D2021] bg-[#101112] px-2 py-0.5 font-mono">
                        {photo.lens}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-[#1D2021] p-6 pt-4 bg-[#1D2021]/20">
                  <Link
                    href={`/portfolio/${photo.slug}`}
                    className="text-xs uppercase tracking-[0.25em] text-[#95836B] hover:text-[#D8D5CD] transition"
                  >
                    Ver ficha
                  </Link>
                  <Link
                    href={`/contact?motivo=licencia&obra=${encodeURIComponent(photo.title)}`}
                    className="border border-[#1D2021] bg-[#1D2021]/60 px-4 py-2 text-[11px] uppercase tracking-[0.25em] text-[#D8D5CD] transition hover:border-[#95836B] hover:text-white"
                  >
                    Solicitar licencia
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Agency Note & Direct CTA */}
        <div className="mt-24 rounded-xl border border-[#1D2021] bg-[#1D2021]/30 p-8 sm:p-14">
          <div className="max-w-2xl">
            <span className="text-xs uppercase tracking-[0.35em] text-[#95836B] font-mono">
              Agencias & Gestores de Derechos
            </span>
            <h2 className="mt-3 font-serif text-2xl text-[#D8D5CD] sm:text-3xl">
              ¿Representa a una agencia editorial o gabinete de prensa?
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-[#D8D5CD]/80 font-light">
              Facilitamos acuerdos marco anuales para grupos editoriales y departamentos de comunicación, 
              así como paquetes de imágenes con derechos mundiales para campañas globales.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/contact?motivo=licencia"
                className="inline-flex border border-[#D8D5CD] bg-[#D8D5CD] px-8 py-3.5 text-xs uppercase tracking-[0.3em] text-[#101112] font-semibold transition hover:bg-transparent hover:text-white"
              >
                Iniciar solicitud de derechos
              </Link>
              <a
                href="mailto:hello@javierespinosa.com?subject=Solicitud%20de%20Licencia%20de%20Imagen"
                className="inline-flex border border-[#1D2021] bg-[#1D2021]/60 px-8 py-3.5 text-xs uppercase tracking-[0.3em] text-[#D8D5CD] transition hover:border-[#95836B] hover:text-white"
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
