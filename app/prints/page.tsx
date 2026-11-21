import Image from "next/image";
import Link from "next/link";
import Container from "@/components/ui/Container";
import {
  AndalusianCollectionBackdrop,
  AndalusianCenefa,
} from "@/components/ui/AndalusianMotif";
import PrintScaleVisualizer from "@/components/prints/PrintScaleVisualizer";
import OpticalLoupeInspector from "@/components/prints/OpticalLoupeInspector";
import CertificateOfAuthenticityModal from "@/components/prints/CertificateOfAuthenticityModal";
import PrintCardAction from "@/components/cart/PrintCardAction";
import JsonLd from "@/components/seo/JsonLd";
import { buildPageMetadata } from "@/lib/metadata";
import { getPrintablePhotos } from "@/lib/photos";
import { generateBreadcrumbSchema, generateFAQSchema } from "@/lib/schema";

export const metadata = buildPageMetadata({
  title: "Copias Fine Art Hahnemühle & Ediciones Limitadas (Fine Art Prints) | Javier Espinosa",
  description:
    "Adquisición de copias Fine Art de edición limitada sobre papel 100% algodón Hahnemühle Photo Rag 308g (ISO 9706). Obra fotográfica de autor numerada y firmada para coleccionismo e interiorismo.",
  path: "/prints",
  keywords: [
    "copias Fine Art",
    "Fine Art photography prints",
    "Hahnemühle Photo Rag 308g",
    "ediciones limitadas fotografía",
    "limited edition photography prints",
    "fotografía de autor para interiorismo",
    "museum grade archival prints",
  ],
});

const SIZES = [
  {
    name: "Formato Estudio (A3+)",
    dims: "33 × 48 cm",
    imageSize: "aprox. 30 × 45 cm",
    price: "Desde 240 €",
    framedNote: "Enmarcado museo opcional (+110 €)",
    idealFor: "Estudios, despachos, librerías y composiciones murales combinadas.",
    edition: "Serie numerada de 50 ejemplares",
    packaging: "Embalaje plano rígido reforzado con paspartú de conservación.",
  },
  {
    name: "Formato Galería",
    dims: "50 × 70 cm",
    imageSize: "aprox. 40 × 60 cm",
    price: "Desde 480 €",
    framedNote: "Enmarcado museo opcional (+190 €)",
    idealFor: "Salones, recepciones y espacios expositivos principales.",
    edition: "Serie numerada de 25 ejemplares",
    packaging: "Tubo rígido protector de alta densidad libre de ácido.",
  },
  {
    name: "Gran Colección",
    dims: "70 × 100 cm",
    imageSize: "aprox. 60 × 90 cm",
    price: "Desde 890 €",
    framedNote: "Acabado expositivo a medida bajo consulta",
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
  const printFaqs = [
    {
      q: "¿Cómo se entrega y protege cada copia Fine Art?",
      a: "Las copias sin enmarcar se envían envueltas en papel seda libre de ácido dentro de un tubo rígido de alta densidad (o carpeta plana rígida para formato Estudio). Las obras enmarcadas viajan en cajón protegido a medida con seguro a todo riesgo.",
    },
    {
      q: "¿Qué incluye el Certificado de Autenticidad?",
      a: "Cada obra va acompañada de un documento firmado de puño y letra por Javier Espinosa Martínez indicando título, fecha, soporte Hahnemühle Photo Rag® 308g, número de ejemplar dentro de la edición limitada y holograma numerado.",
    },
    {
      q: "¿Cuál es el plazo habitual de producción y entrega?",
      a: "Dado que cada copia se imprime bajo demanda con supervisión directa de prueba de color en laboratorio profesional, el plazo de entrega es de 5 a 8 días laborables para láminas sueltas y de 10 a 14 días laborables para obras enmarcadas a medida.",
    },
    {
      q: "¿Puedo solicitar una fotografía del archivo que no aparezca en esta selección?",
      a: "Sí. Aunque esta página reúne las 20 obras principales de edición limitada, cualquiera de las 100 obras del archivo puede producirse bajo pedido en papel Hahnemühle o en formato díptico indicando su título en el formulario de contacto.",
    },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0B0C0E] pt-36 pb-28 text-[#EBE7DF]">
      {/* Filigrana andalusí y cenefas laterales discretas en el fondo de la colección Fine Art */}
      <AndalusianCollectionBackdrop variant="sebka" />

      <JsonLd
        data={[
          generateFAQSchema(printFaqs),
          generateBreadcrumbSchema([
            { name: "Inicio", path: "/" },
            { name: "Copias Fine Art", path: "/prints" },
          ]),
        ]}
      />
      <Container className="relative z-10">
        {/* Header Section */}
        <div className="max-w-3xl">
          <div className="flex items-center gap-3">
            <span className="h-px w-6 bg-white/30" />
            <p className="font-mono text-xs uppercase tracking-[0.4em] text-[#8E8A80]">
              The Art of Seeing · Ediciones de Autor
            </p>
          </div>
          <h1 className="mt-4 font-serif text-4xl sm:text-5xl lg:text-6xl font-light tracking-tight text-[#EBE7DF]">
            Copias Fine Art de Autor
          </h1>
          <p className="mt-6 text-base leading-relaxed text-[#8E8A80] sm:text-lg font-light">
            Cada copia es producida bajo demanda individual con supervisión directa de calibración 
            y perfilado cromático. Una traslación física precisa de la luz natural sobre soportes de fibra 
            de algodón de la máxima calidad museística europea.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <a
              href="https://www.saatchiart.com/javier-espinosa-photography"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 border border-[#EBE7DF] bg-[#EBE7DF] px-6 py-3 font-mono text-xs uppercase tracking-[0.25em] text-[#0B0C0E] font-medium transition-all duration-300 hover:bg-transparent hover:text-white"
            >
              <span>Galería Oficial en Saatchi Art</span>
              <span>↗</span>
            </a>
            <Link
              href="/contact?motivo=print"
              className="inline-flex items-center gap-2 border border-white/20 bg-[#151618] px-6 py-3 font-mono text-xs uppercase tracking-[0.25em] text-[#EBE7DF] transition hover:border-white/40 hover:text-white"
            >
              Encargo Directo al Autor
            </Link>
            {printable.length > 0 && (
              <CertificateOfAuthenticityModal
                photo={printable[0]}
                buttonLabel="Inspeccionar Certificado de Autenticidad (ISO 9706)"
              />
            )}
          </div>
        </div>

        {/* Quality Specs Grid */}
        <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {SPECS.map((spec) => (
            <div
              key={spec.title}
              className="border border-white/[0.08] bg-[#151618] p-7 sm:p-8 transition hover:border-white/30"
            >
              <h2 className="font-serif text-lg font-light text-[#EBE7DF]">{spec.title}</h2>
              <p className="mt-3 text-xs leading-relaxed text-[#8E8A80] font-light">
                {spec.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Formats Table */}
        <div className="mt-24">
          <div className="border-b border-white/[0.08] pb-5">
            <h2 className="font-mono text-xs uppercase tracking-[0.35em] text-[#8E8A80]">
              Formatos de Tirada Disponibles
            </h2>
            <p className="mt-1 font-serif text-2xl font-light text-[#EBE7DF]">
              Dimensiones y especificaciones de edición
            </p>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
            {SIZES.map((item) => (
              <div
                key={item.name}
                className="flex flex-col justify-between border border-white/[0.08] bg-[#151618] p-8 sm:p-10"
              >
                <div>
                  <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#8E8A80]">
                    {item.edition}
                  </span>
                  <div className="mt-2 flex items-baseline justify-between gap-2">
                    <h3 className="font-serif text-2xl font-light text-[#EBE7DF]">{item.name}</h3>
                    <span className="font-serif text-xl text-[#EBE7DF]">{item.price}</span>
                  </div>
                  <p className="mt-1 font-mono text-sm text-[#8E8A80]">
                    {item.dims} <span className="text-[#8E8A80]/70">({item.imageSize})</span>
                  </p>
                  <p className="mt-1 font-mono text-[10px] text-[#8E8A80]/70">
                    {item.framedNote}
                  </p>
                  <p className="mt-5 text-xs leading-relaxed text-[#8E8A80] font-light">
                    {item.idealFor}
                  </p>
                </div>

                <div className="mt-8 border-t border-white/[0.08] pt-6">
                  <p className="text-[11px] text-[#8E8A80]">
                    <strong className="text-[#EBE7DF]">Embalaje:</strong> {item.packaging}
                  </p>
                  <Link
                    href={`/contact?motivo=print&formato=${encodeURIComponent(item.name)}`}
                    className="mt-6 inline-flex w-full items-center justify-center border border-white/[0.08] bg-[#0B0C0E] py-3 font-mono text-xs uppercase tracking-[0.3em] text-[#EBE7DF] transition hover:border-white/30 hover:text-white"
                  >
                    Consultar disponibilidad
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <p className="mt-4 font-mono text-[11px] text-[#8E8A80] leading-relaxed">
            * Tarifas base orientativas para lámina suelta sobre papel 100% algodón Hahnemühle Photo Rag® 308 g/m² sin enmarcar. El presupuesto definitivo se confirma individualmente según disponibilidad de la serie, opciones de enmarcado a medida con cristal museo antirreflejos UV 99% y costes de transporte con seguro a todo riesgo.
          </p>
        </div>

        {/* Distinction between Fine Art, Licensing, and Commissions */}
        <section className="mt-28 border-t border-white/[0.08] pt-16">
          <div className="max-w-2xl">
            <p className="font-mono text-xs uppercase tracking-[0.35em] text-[#8E8A80]">
              Claridad y Rigor Profesional
            </p>
            <h2 className="mt-2 font-serif text-3xl font-light text-[#EBE7DF]">
              Tres modalidades de relación con la obra
            </h2>
            <p className="mt-3 text-sm text-[#8E8A80] font-light leading-relaxed">
              Distinción transparente entre la adquisición de piezas físicas de autor, la cesión de derechos de uso digital y la contratación de servicios fotográficos en campo.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="border border-white/[0.08] bg-[#151618] p-8 flex flex-col justify-between">
              <div>
                <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#8E8A80]">
                  MODALIDAD 01
                </span>
                <h3 className="mt-2 font-serif text-xl font-light text-[#EBE7DF]">
                  Obra Fine Art de Colección
                </h3>
                <p className="mt-3 text-xs text-[#8E8A80] font-light leading-relaxed">
                  Pieza física original producida en laboratorio bajo norma ISO 9706. Papel de algodón Hahnemühle Photo Rag® 308g, numeración limitada, firma manuscrita y certificado de autenticidad.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-white/[0.06]">
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#EBE7DF]">
                  Uso: Coleccionismo e Interiorismo
                </span>
              </div>
            </div>

            <div className="border border-white/[0.08] bg-[#151618] p-8 flex flex-col justify-between">
              <div>
                <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#8E8A80]">
                  MODALIDAD 02
                </span>
                <h3 className="mt-2 font-serif text-xl font-light text-[#EBE7DF]">
                  Licencias de Imagen
                </h3>
                <p className="mt-3 text-xs text-[#8E8A80] font-light leading-relaxed">
                  Cesión de derechos de explotación para prensa, publicaciones editoriales, campañas publicitarias o plataformas digitales. Archivo RAW revelado en TIFF/JPEG máxima resolución.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-white/[0.06] flex items-center justify-between">
                <Link
                  href="/licensing"
                  className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#EBE7DF] hover:underline underline-offset-4"
                >
                  Ver Banco de Licencias →
                </Link>
              </div>
            </div>

            <div className="border border-white/[0.08] bg-[#151618] p-8 flex flex-col justify-between">
              <div>
                <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#8E8A80]">
                  MODALIDAD 03
                </span>
                <h3 className="mt-2 font-serif text-xl font-light text-[#EBE7DF]">
                  Encargos en Campo
                </h3>
                <p className="mt-3 text-xs text-[#8E8A80] font-light leading-relaxed">
                  Contratación de producción fotográfica para campeonatos de rally, documentación arquitectónica, patrimonio territorial o reportajes de autor desde Tenerife y con movilidad internacional.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-white/[0.06] flex items-center justify-between">
                <Link
                  href="/servicios"
                  className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#EBE7DF] hover:underline underline-offset-4"
                >
                  Servicios y Comisiones →
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Interactive Wall Scale Comparator */}
        <PrintScaleVisualizer />

        {/* 32.5 MP Optical Loupe Inspector */}
        <OpticalLoupeInspector />

        <AndalusianCenefa
          variant="estrella"
          className="mt-24 text-[#C5A880]/32"
        />

        {/* Visual Catalog */}
        <div className="mt-14">
          <div className="flex flex-col justify-between gap-4 border-b border-white/[0.08] pb-6 sm:flex-row sm:items-end">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.35em] text-[#8E8A80]">
                Catálogo de Obras Disponibles
              </p>
              <h2 className="mt-2 font-serif text-3xl font-light text-[#EBE7DF]">
                Obras seleccionadas para impresión ({printable.length} fotografías)
              </h2>
            </div>
            <p className="font-mono text-xs text-[#8E8A80]">
              Todas las copias incluyen margen blanco de seguridad y firma manuscrita.
            </p>
          </div>

          <div className="mt-12 columns-1 gap-8 sm:columns-2 lg:columns-3">
            {printable.map((photo) => (
              <div
                key={photo.id}
                className="group mb-8 flex break-inside-avoid flex-col justify-between border border-white/[0.08] bg-[#151618] transition hover:border-white/30 overflow-hidden"
              >
                <div>
                  <div className="relative w-full overflow-hidden bg-[#0B0C0E]">
                    <Image
                      src={photo.image}
                      alt={photo.alt}
                      width={photo.width}
                      height={photo.height}
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="h-auto w-full transition duration-500 group-hover:scale-[1.02] brightness-[0.92] group-hover:brightness-100"
                    />
                    <div className="absolute left-3 top-3">
                      <span className="bg-[#0B0C0E]/90 border border-white/[0.08] px-2.5 py-1 text-[9px] uppercase tracking-[0.25em] text-[#EBE7DF] backdrop-blur-sm font-mono">
                        {photo.category.replace("-", " ")}
                      </span>
                    </div>
                  </div>

                  <div className="p-6 sm:p-7">
                    <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#8E8A80]">
                      {photo.location ? `${photo.location} · ` : ""}{photo.year} · Edición Fine Art
                    </p>
                    <h3 className="mt-2 font-serif text-xl font-light text-[#EBE7DF] transition group-hover:text-white">
                      {photo.title}
                    </h3>
                    <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-[#8E8A80] font-light">
                      {photo.description}
                    </p>
                    <div className="mt-4 flex items-center gap-3 font-mono text-[11px] text-[#8E8A80]">
                      <span>{photo.camera}</span>
                      <span>·</span>
                      <span>{photo.focalLength}</span>
                      <span>·</span>
                      <span>{photo.aperture}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-white/[0.08] p-6 pt-4 bg-[#0B0C0E]/40">
                  <Link
                    href={`/portfolio/${photo.slug}`}
                    className="font-mono text-xs uppercase tracking-[0.25em] text-[#8E8A80] hover:text-[#EBE7DF] transition"
                  >
                    Ficha de Obra →
                  </Link>
                  <PrintCardAction photo={photo} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Framing & Shipping Guarantee */}
        <div className="mt-28 border border-white/[0.08] bg-[#151618] p-8 sm:p-12 lg:p-14">
          <div className="max-w-2xl">
            <span className="font-mono text-xs uppercase tracking-[0.35em] text-[#8E8A80]">
              Garantía y Logística
            </span>
            <h2 className="mt-3 font-serif text-2xl font-light text-[#EBE7DF] sm:text-3xl">
              Asesoramiento en enmarcado y envíos internacionales
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-[#8E8A80] font-light">
              Cada fotografía se entrega con instrucciones detalladas de conservación preventiva. 
              Si desea recibir la obra ya montada en marco de madera maciza (roble, fresno o negro mate) 
              con cristal museo antirreflejos de protección UV al 99%, indíquelo al realizar su consulta.
            </p>
            <div className="mt-8">
              <Link
                href="/contact?motivo=print"
                className="inline-flex border border-[#EBE7DF] bg-[#EBE7DF] px-8 py-3.5 font-mono text-xs uppercase tracking-[0.3em] text-[#0B0C0E] font-medium transition-all duration-300 hover:bg-transparent hover:text-white"
              >
                Solicitar presupuesto personalizado
              </Link>
            </div>
          </div>
        </div>

        {/* FAQ de Coleccionistas */}
        <section aria-labelledby="prints-faq" className="mt-24 border-t border-white/[0.08] pt-16">
          <div className="max-w-2xl">
            <p className="font-mono text-xs uppercase tracking-[0.35em] text-[#8E8A80]">
              Preguntas Frecuentes de Coleccionistas
            </p>
            <h2 id="prints-faq" className="mt-2 font-serif text-3xl font-light text-[#EBE7DF]">
              Conservación, tiradas, plazos y envíos asegurados
            </h2>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-4 lg:grid-cols-2">
            {printFaqs.map((item) => (
              <details
                key={item.q}
                className="group border border-white/[0.08] bg-[#151618] p-6 transition hover:border-white/30"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-serif text-lg font-light text-[#EBE7DF]">
                  <span>{item.q}</span>
                  <span className="text-xs text-[#8E8A80] transition group-open:rotate-45">+</span>
                </summary>
                <p className="mt-4 text-xs leading-relaxed text-[#8E8A80] font-light">
                  {item.a}
                </p>
              </details>
            ))}
          </div>
        </section>
      </Container>
    </div>
  );
}
