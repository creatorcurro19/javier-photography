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
    <div className="min-h-screen bg-black pt-36 pb-28 text-neutral-300">
      <Container>
        {/* Header Section */}
        <div className="max-w-3xl">
          <p className="text-xs uppercase tracking-[0.4em] text-neutral-500">
            Ediciones de Colección & Obra Gráfica
          </p>
          <h1 className="mt-4 font-serif text-4xl font-light tracking-wide text-neutral-100 sm:text-5xl lg:text-6xl">
            Copias Fine Art de Autor
          </h1>
          <p className="mt-6 text-base leading-relaxed text-neutral-400 sm:text-lg">
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
              className="rounded-lg border border-neutral-800 bg-neutral-950/60 p-7 sm:p-8 transition hover:border-neutral-700"
            >
              <h2 className="font-serif text-lg text-neutral-100">{spec.title}</h2>
              <p className="mt-3 text-xs leading-relaxed text-neutral-400">
                {spec.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Formats Table */}
        <div className="mt-24">
          <div className="border-b border-neutral-800 pb-5">
            <h2 className="text-xs uppercase tracking-[0.35em] text-neutral-500">
              Formatos de Tirada Disponibles
            </h2>
            <p className="mt-1 font-serif text-2xl text-neutral-100">
              Dimensiones y especificaciones de edición
            </p>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
            {SIZES.map((item) => (
              <div
                key={item.name}
                className="flex flex-col justify-between rounded-lg border border-neutral-800 bg-neutral-950/40 p-8 sm:p-10"
              >
                <div>
                  <span className="text-[10px] uppercase tracking-[0.3em] text-neutral-500">
                    {item.edition}
                  </span>
                  <h3 className="mt-2 font-serif text-2xl text-neutral-100">{item.name}</h3>
                  <p className="mt-1 font-mono text-sm text-neutral-300">
                    {item.dims} <span className="text-neutral-500">({item.imageSize})</span>
                  </p>
                  <p className="mt-5 text-xs leading-relaxed text-neutral-400">
                    {item.idealFor}
                  </p>
                </div>

                <div className="mt-8 border-t border-neutral-900 pt-6">
                  <p className="text-[11px] text-neutral-400">
                    <strong className="text-neutral-300">Embalaje:</strong> {item.packaging}
                  </p>
                  <Link
                    href={`/contact?motivo=print&formato=${encodeURIComponent(item.name)}`}
                    className="mt-6 inline-flex w-full items-center justify-center border border-neutral-700 bg-neutral-900/60 py-3 text-xs uppercase tracking-[0.3em] text-neutral-200 transition hover:border-white hover:text-white"
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
          <div className="flex flex-col justify-between gap-4 border-b border-neutral-800 pb-6 sm:flex-row sm:items-end">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-neutral-500">
                Catálogo de Obras Disponibles
              </p>
              <h2 className="mt-2 font-serif text-3xl font-light text-neutral-100">
                Obras seleccionadas para impresión ({printable.length} fotografías)
              </h2>
            </div>
            <p className="text-xs text-neutral-500">
              Todas las copias incluyen margen blanco de seguridad y firma manuscrita.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {printable.map((photo) => (
              <div
                key={photo.id}
                className="group flex flex-col justify-between rounded-lg border border-neutral-900 bg-neutral-950/80 transition hover:border-neutral-700 overflow-hidden"
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
                      <span className="bg-black/80 px-2.5 py-1 text-[9px] uppercase tracking-[0.25em] text-neutral-300 backdrop-blur-sm">
                        {photo.category.replace("-", " ")}
                      </span>
                    </div>
                  </div>

                  <div className="p-6 sm:p-7">
                    <p className="text-[10px] uppercase tracking-[0.3em] text-neutral-500 font-mono">
                      {photo.location ? `${photo.location} · ` : ""}{photo.year} · Edición Fine Art
                    </p>
                    <h3 className="mt-2 font-serif text-xl font-light text-neutral-100 transition group-hover:text-white">
                      {photo.title}
                    </h3>
                    <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-neutral-400">
                      {photo.description}
                    </p>
                    <div className="mt-4 flex items-center gap-3 font-mono text-[11px] text-neutral-500">
                      <span>{photo.camera}</span>
                      <span>·</span>
                      <span>{photo.focalLength}</span>
                      <span>·</span>
                      <span>{photo.aperture}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-neutral-900 p-6 pt-4">
                  <Link
                    href={`/portfolio/${photo.slug}`}
                    className="text-xs uppercase tracking-[0.25em] text-neutral-400 transition hover:text-white"
                  >
                    Ver detalles
                  </Link>
                  <Link
                    href={`/contact?motivo=print&obra=${encodeURIComponent(photo.title)}`}
                    className="border border-neutral-700 bg-neutral-900/60 px-4 py-2 text-[11px] uppercase tracking-[0.25em] text-neutral-200 transition hover:border-white hover:text-white"
                  >
                    Encargar copia
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Framing & Shipping Guarantee */}
        <div className="mt-28 rounded-lg border border-neutral-800 bg-neutral-950/40 p-8 sm:p-12 lg:p-14">
          <div className="max-w-2xl">
            <span className="text-xs uppercase tracking-[0.35em] text-neutral-500">
              Garantía y Logística
            </span>
            <h2 className="mt-3 font-serif text-2xl text-neutral-100 sm:text-3xl">
              Asesoramiento en enmarcado y envíos internacionales
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-neutral-400">
              Cada fotografía se entrega con instrucciones detalladas de conservación preventiva. 
              Si desea recibir la obra ya montada en marco de madera maciza (roble, fresno o negro mate) 
              con cristal museo antirreflejos de protección UV al 99%, indíquelo al realizar su consulta.
            </p>
            <div className="mt-8">
              <Link
                href="/contact?motivo=print"
                className="inline-flex border border-neutral-200 bg-neutral-100 px-8 py-3.5 text-xs uppercase tracking-[0.3em] text-neutral-950 font-medium transition hover:bg-white hover:text-black hover:border-white"
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
