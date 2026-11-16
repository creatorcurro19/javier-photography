import Image from "next/image";
import Link from "next/link";
import Container from "@/components/ui/Container";
import { buildPageMetadata } from "@/lib/metadata";
import { getPrintablePhotos } from "@/lib/photos";

export const metadata = buildPageMetadata({
  title: "Copias Fine Art | Javier Espinosa",
  description:
    "Ediciones limitadas de autor sobre papel de algodón Hahnemühle Photo Rag 308g. Impresión con tintas de pigmento mineral de conservación museística.",
  path: "/prints",
});

const SIZES = [
  {
    name: "Formato Estudio (A3+)",
    dims: "33 × 48 cm",
    imageSize: "aprox. 30 × 45 cm",
    idealFor: "Estudios, despachos, librerías y composiciones murales combinadas.",
    edition: "Serie numerada de 50 ejemplares",
    packaging: "Embalaje plano rígido reforzado con paspartú de conservación.",
  },
  {
    name: "Formato Galería",
    dims: "50 × 70 cm",
    imageSize: "aprox. 40 × 60 cm",
    idealFor: "Salones, recepciones y espacios expositivos principales.",
    edition: "Serie numerada de 25 ejemplares",
    packaging: "Tubo rígido protector de alta densidad libre de ácido.",
  },
  {
    name: "Gran Colección",
    dims: "70 × 100 cm",
    imageSize: "aprox. 60 × 90 cm",
    idealFor: "Piezas centrales de interiorismo y coleccionismo institucional.",
    edition: "Serie exclusiva de 10 ejemplares",
    packaging: "Caja de madera o tubo técnico de máxima resistencia.",
  },
];

const SPECS = [
  {
    title: "Soporte Hahnemühle",
    desc: "Papel de algodón 100% Hahnemühle Photo Rag® de 308 g/m², con superficie mate aterciopelada y tacto sublime.",
  },
  {
    title: "Tintas Minerales Pigmentadas",
    desc: "Impresión de 12 tintas pigmentadas UltraChrome PRO. Rango cromático extendido y negros profundos con D-Max excepcional.",
  },
  {
    title: "Certificado de Autenticidad",
    desc: "Cada copia se entrega con certificado firmado a mano, numerado y con holograma de seguridad intransferible.",
  },
  {
    title: "Conservación Museística",
    desc: "Conformidad estricta con la norma ISO 9706. Garantía de resistencia al envejecimiento superior a 100 años sin decoloración.",
  },
];

export default function PrintsPage() {
  const printable = getPrintablePhotos();

  return (
    <div className="min-h-screen bg-[#101112] pt-36 pb-28 text-[#D8D5CD]">
      <Container>
        {/* Header Section */}
        <div className="max-w-3xl">
          <p className="text-xs uppercase tracking-[0.4em] text-[#95836B] font-mono">
            Ediciones de Colección & Obra Gráfica
          </p>
          <h1 className="mt-4 font-serif text-4xl font-light tracking-wide text-[#D8D5CD] sm:text-5xl lg:text-6xl">
            Copias Fine Art de Autor
          </h1>
          <p className="mt-6 text-base leading-relaxed text-[#D8D5CD]/80 sm:text-lg font-light">
            Cada copia es producida bajo demanda individual con supervisión directa de calibración 
            y perfilado cromático. Una traslación física precisa de la luz natural sobre soportes de fibra 
            de algodón de la máxima calidad museística europea.
          </p>
        </div>

        {/* Quality Specs Grid */}
        <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {SPECS.map((spec) => (
            <div
              key={spec.title}
              className="rounded-lg border border-[#1D2021] bg-[#1D2021]/40 p-7 sm:p-8 transition hover:border-[#95836B]/60"
            >
              <h2 className="font-serif text-lg text-[#D8D5CD]">{spec.title}</h2>
              <p className="mt-3 text-xs leading-relaxed text-neutral-400 font-light">
                {spec.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Formats Table */}
        <div className="mt-24">
          <div className="border-b border-[#1D2021] pb-5">
            <h2 className="text-xs uppercase tracking-[0.35em] text-[#95836B] font-mono">
              Formatos de Tirada Disponibles
            </h2>
            <p className="mt-1 font-serif text-2xl text-[#D8D5CD]">
              Dimensiones y especificaciones de edición
            </p>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
            {SIZES.map((item) => (
              <div
                key={item.name}
                className="flex flex-col justify-between rounded-lg border border-[#1D2021] bg-[#1D2021]/30 p-8 sm:p-10"
              >
                <div>
                  <span className="text-[10px] uppercase tracking-[0.3em] text-[#95836B] font-mono">
                    {item.edition}
                  </span>
                  <h3 className="mt-2 font-serif text-2xl text-[#D8D5CD]">{item.name}</h3>
                  <p className="mt-1 font-mono text-sm text-[#95836B]">
                    {item.dims} <span className="text-neutral-500">({item.imageSize})</span>
                  </p>
                  <p className="mt-5 text-xs leading-relaxed text-neutral-400 font-light">
                    {item.idealFor}
                  </p>
                </div>

                <div className="mt-8 border-t border-[#1D2021] pt-6">
                  <p className="text-[11px] text-neutral-400">
                    <strong className="text-[#D8D5CD]">Embalaje:</strong> {item.packaging}
                  </p>
                  <Link
                    href={`/contact?motivo=print&formato=${encodeURIComponent(item.name)}`}
                    className="mt-6 inline-flex w-full items-center justify-center border border-[#1D2021] bg-[#1D2021]/60 py-3 text-xs uppercase tracking-[0.3em] text-[#D8D5CD] transition hover:border-[#95836B] hover:text-white"
                  >
                    Consultar disponibilidad
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Visual Catalog */}
        <div className="mt-28">
          <div className="flex flex-col justify-between gap-4 border-b border-[#1D2021] pb-6 sm:flex-row sm:items-end">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-[#95836B] font-mono">
                Catálogo de Obras Disponibles
              </p>
              <h2 className="mt-2 font-serif text-3xl font-light text-[#D8D5CD]">
                Obras seleccionadas para impresión ({printable.length} fotografías)
              </h2>
            </div>
            <p className="text-xs text-[#95836B] font-mono">
              Todas las copias incluyen margen blanco de seguridad y firma manuscrita.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {printable.map((photo) => (
              <div
                key={photo.id}
                className="group flex flex-col justify-between rounded-lg border border-[#1D2021] bg-[#1D2021]/40 transition hover:border-[#95836B]/60 overflow-hidden"
              >
                <div>
                  <div className="relative aspect-[3/2] w-full overflow-hidden bg-neutral-900">
                    <Image
                      src={photo.image}
                      alt={photo.alt}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition duration-500 group-hover:scale-105"
                    />
                    <div className="absolute left-3 top-3">
                      <span className="bg-[#101112]/90 border border-[#1D2021] px-2.5 py-1 text-[9px] uppercase tracking-[0.25em] text-[#D8D5CD] backdrop-blur-sm font-mono">
                        {photo.category.replace("-", " ")}
                      </span>
                    </div>
                  </div>

                  <div className="p-6 sm:p-7">
                    <p className="text-[10px] uppercase tracking-[0.3em] text-[#95836B] font-mono">
                      {photo.location ? `${photo.location} · ` : ""}{photo.year} · Edición Fine Art
                    </p>
                    <h3 className="mt-2 font-serif text-xl font-light text-[#D8D5CD] transition group-hover:text-white">
                      {photo.title}
                    </h3>
                    <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-[#D8D5CD]/80 font-light">
                      {photo.description}
                    </p>
                    <div className="mt-4 flex items-center gap-3 font-mono text-[11px] text-[#95836B]">
                      <span>{photo.camera}</span>
                      <span>·</span>
                      <span>{photo.focalLength}</span>
                      <span>·</span>
                      <span>{photo.aperture}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-[#1D2021] p-6 pt-4 bg-[#1D2021]/20">
                  <Link
                    href={`/portfolio/${photo.slug}`}
                    className="text-xs uppercase tracking-[0.25em] text-[#95836B] hover:text-[#D8D5CD] transition"
                  >
                    Ver detalles
                  </Link>
                  <Link
                    href={`/contact?motivo=print&obra=${encodeURIComponent(photo.title)}`}
                    className="border border-[#1D2021] bg-[#1D2021]/60 px-4 py-2 text-[11px] uppercase tracking-[0.25em] text-[#D8D5CD] transition hover:border-[#95836B] hover:text-white"
                  >
                    Encargar copia
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Framing & Shipping Guarantee */}
        <div className="mt-28 rounded-xl border border-[#1D2021] bg-[#1D2021]/30 p-8 sm:p-12 lg:p-14">
          <div className="max-w-2xl">
            <span className="text-xs uppercase tracking-[0.35em] text-[#95836B] font-mono">
              Garantía y Logística
            </span>
            <h2 className="mt-3 font-serif text-2xl text-[#D8D5CD] sm:text-3xl">
              Asesoramiento en enmarcado y envíos internacionales
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-[#D8D5CD]/80 font-light">
              Cada fotografía se entrega con instrucciones detalladas de conservación preventiva. 
              Si desea recibir la obra ya montada en marco de madera maciza (roble, fresno o negro mate) 
              con cristal museo antirreflejos de protección UV al 99%, indíquelo al realizar su consulta.
            </p>
            <div className="mt-8">
              <Link
                href="/contact?motivo=print"
                className="inline-flex border border-[#D8D5CD] bg-[#D8D5CD] px-8 py-3.5 text-xs uppercase tracking-[0.3em] text-[#101112] font-semibold transition hover:bg-transparent hover:text-white"
              >
                Solicitar presupuesto personalizado
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
