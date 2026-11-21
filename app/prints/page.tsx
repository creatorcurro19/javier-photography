import { Suspense } from "react";
import Link from "next/link";
import Container from "@/components/ui/Container";
import {
  AndalusianCollectionBackdrop,
  AndalusianCenefa,
} from "@/components/ui/AndalusianMotif";
import PrintScaleVisualizer from "@/components/prints/PrintScaleVisualizer";
import OpticalLoupeInspector from "@/components/prints/OpticalLoupeInspector";
import CertificateOfAuthenticityModal from "@/components/prints/CertificateOfAuthenticityModal";
import DirectPrintsCatalog from "@/components/prints/DirectPrintsCatalog";
import JsonLd from "@/components/seo/JsonLd";
import { buildPageMetadata } from "@/lib/metadata";
import { getAllPhotos, getPrintablePhotos } from "@/lib/photos";
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
    name: "Formato Estudio",
    dims: "30 × 45 cm (o según proporción)",
    imageSize: "Con margen blanco de conservación",
    price: "95 € — 175 €",
    framedNote: "Valoración individual según la obra · Envío en tubo rígido",
    idealFor: "Estudios, despachos, librerías y composiciones murales combinadas.",
    edition: "Edición limitada (12 a 30 ej. totales por obra)",
    packaging: "Papel seda libre de ácido dentro de tubo rígido protector de alta densidad.",
  },
  {
    name: "Formato Galería",
    dims: "50 × 70 cm (o según proporción)",
    imageSize: "Con margen blanco de conservación",
    price: "165 € — 310 €",
    framedNote: "Valoración individual según la obra · Envío en tubo rígido",
    idealFor: "Salones, recepciones y espacios expositivos principales.",
    edition: "Edición limitada (12 a 30 ej. totales por obra)",
    packaging: "Tubo rígido cilíndrico de alta densidad (3-4 mm) con tapas selladas.",
  },
  {
    name: "Gran Colección",
    dims: "70 × 100 cm (o 60 × 90 cm)",
    imageSize: "Con margen blanco de conservación",
    price: "280 € — 510 €",
    framedNote: "Valoración individual según la obra · Envío en tubo rígido",
    idealFor: "Piezas centrales de interiorismo y coleccionismo.",
    edition: "Edición limitada (12 a 30 ej. totales por obra)",
    packaging: "Tubo técnico de gran formato libre de ácido y seguro de transporte.",
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
  const allPhotos = getAllPhotos();
  const printFaqs = [
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
      a: "Cada obra va acompañada de un documento firmado de puño y letra por Javier Espinosa Martínez indicando título, fecha, soporte empleado, número de ejemplar dentro de la edición limitada y doble holograma numerado.",
    },
    {
      q: "¿Cuál es el plazo habitual de producción y entrega?",
      a: "Dado que cada copia se imprime bajo demanda en laboratorio Fine Art en Tenerife con revisión directa de prueba de color y firma manuscrita, el plazo habitual de expedición en tubo rígido es de 5 a 8 días laborables.",
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
            Copias Fine Art en Papel de Algodón
          </h1>
          <p className="mt-6 text-base leading-relaxed text-[#8E8A80] sm:text-lg font-light">
            Una fotografía cambia cuando pasa de la pantalla al papel. Cada copia se imprime bajo pedido sobre algodón 100% Hahnemühle Photo Rag® de 308 g/m², revisando las pruebas de color para que las sombras, las texturas y la luz se vean tal como fueron pensadas. Se entregan numeradas, firmadas a mano y listas para conservar o enmarcar.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <a
              href="#catalogo-fine-art"
              className="inline-flex items-center gap-2 border border-[#C5A880] bg-[#C5A880] px-6 py-3 font-mono text-xs uppercase tracking-[0.25em] text-[#0B0C0E] font-semibold transition-all duration-300 hover:bg-white hover:border-white"
            >
              <span>Comprar Directamente en la Web</span>
              <span>↓</span>
            </a>
            {printable.length > 0 && (
              <CertificateOfAuthenticityModal
                photo={printable[0]}
                buttonLabel="Inspeccionar Certificado de Autenticidad (ISO 9706)"
              />
            )}
            <Link
              href="/contact?motivo=print"
              className="inline-flex items-center gap-2 border border-white/20 bg-[#151618] px-6 py-3 font-mono text-xs uppercase tracking-[0.25em] text-[#EBE7DF] transition hover:border-white/40 hover:text-white"
            >
              Formato Especial o Interiorismo
            </Link>
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
                  <a
                    href="#catalogo-fine-art"
                    className="mt-6 inline-flex w-full items-center justify-center border border-[#C5A880]/40 bg-[#0B0C0E] py-3 font-mono text-xs uppercase tracking-[0.26em] text-[#EBE7DF] transition hover:border-[#C5A880] hover:bg-[#C5A880] hover:text-[#0B0C0E]"
                  >
                    Elegir Obra en este Formato ↓
                  </a>
                </div>
              </div>
            ))}
          </div>

          {/* Tabla Única de Formatos, Medidas (Papel vs Mancha), Plazos, Impuestos y Envío */}
          <div className="mt-10 overflow-x-auto border border-white/[0.08] bg-[#151618]">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-white/[0.08] bg-[#0B0C0E] font-mono text-[10px] uppercase tracking-[0.22em] text-[#C5A880]">
                <tr>
                  <th className="py-3.5 px-4">Formato</th>
                  <th className="py-3.5 px-4">Papel Total</th>
                  <th className="py-3.5 px-4">Mancha de Imagen</th>
                  <th className="py-3.5 px-4">Precio (según obra)</th>
                  <th className="py-3.5 px-4">Enmarcado / Entrega</th>
                  <th className="py-3.5 px-4">Plazo Producción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.06] font-mono text-xs text-[#EBE7DF]">
                <tr>
                  <td className="py-3.5 px-4 font-serif text-base">Formato Estudio</td>
                  <td className="py-3.5 px-4">30 × 45 cm (o 30 × 40 cm)</td>
                  <td className="py-3.5 px-4 text-[#A39E93]">24 × 36 cm (o 24 × 32 cm) · Margen blanco 3–4,5 cm</td>
                  <td className="py-3.5 px-4 text-[#C5A880] font-semibold">95 € — 175 €</td>
                  <td className="py-3.5 px-4 text-[#A39E93]">Sin enmarcar · Tubo rígido de alta densidad</td>
                  <td className="py-3.5 px-4 text-[#A39E93]">5–7 días laborables</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 font-serif text-base">Formato Galería</td>
                  <td className="py-3.5 px-4">50 × 70 cm (o 45 × 60 cm)</td>
                  <td className="py-3.5 px-4 text-[#A39E93]">40 × 60 cm (o 36 × 48 cm) · Margen blanco 4,5–6 cm</td>
                  <td className="py-3.5 px-4 text-[#C5A880] font-semibold">165 € — 310 €</td>
                  <td className="py-3.5 px-4 text-[#A39E93]">Sin enmarcar · Tubo rígido de alta densidad</td>
                  <td className="py-3.5 px-4 text-[#A39E93]">5–7 días laborables</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 font-serif text-base">Gran Colección*</td>
                  <td className="py-3.5 px-4">70 × 100 cm (o 60 × 90 cm)</td>
                  <td className="py-3.5 px-4 text-[#A39E93]">60 × 90 cm (o 50 × 75 cm) · Margen blanco 5–7,5 cm</td>
                  <td className="py-3.5 px-4 text-[#C5A880] font-semibold">280 € — 510 €</td>
                  <td className="py-3.5 px-4 text-[#A39E93]">Sin enmarcar · Tubo rígido de gran formato</td>
                  <td className="py-3.5 px-4 text-[#A39E93]">5–7 días laborables</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-4 border border-white/[0.08] bg-[#0B0C0E] p-5 font-mono text-[11px] text-[#A39E93] sm:grid-cols-2">
            <div>
              <strong className="text-[#EBE7DF] block uppercase tracking-wider">
                Coste de envío asegurado en tubo rígido por zona:
              </strong>
              <span className="mt-1 block">
                · Tenerife e Islas Canarias: <strong className="text-[#EBE7DF]">0 € (Incluido)</strong> · Entrega 5–7 días laborables.
              </span>
              <span className="block">
                · España Peninsular y Baleares: <strong className="text-[#EBE7DF]">+15 €</strong> · Entrega 6–9 días laborables.
              </span>
              <span className="block">
                · Unión Europea e Internacional: <strong className="text-[#EBE7DF]">+28 €</strong> · Entrega 8–12 días laborables.
              </span>
            </div>
            <div>
              <strong className="text-[#EBE7DF] block uppercase tracking-wider">
                Impuestos y Formato Máximo Recomendado:
              </strong>
              <span className="mt-1 block">
                · Régimen fiscal: {"{{DATO_PENDIENTE: confirmar mención fiscal exacta IGIC / REPEP / IVA Objeto de Arte}}"}.
              </span>
              <span className="block">
                · *En fotografías capturadas a ISO ≥ 3200 o con sensor de 24 MP (EOS 750D), el formato 70 × 100 cm se deshabilita automáticamente recomendando hasta Galería (50 × 70 cm).
              </span>
            </div>
          </div>
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

        {/* Visual Catalog with Direct Purchase for All 100 Artworks */}
        <Suspense fallback={null}>
          <DirectPrintsCatalog allPhotos={allPhotos} featuredPrints={printable} />
        </Suspense>

        {/* Shipping in Rigid Tube Guarantee */}
        <div className="mt-28 border border-white/[0.08] bg-[#151618] p-8 sm:p-12 lg:p-14">
          <div className="max-w-2xl">
            <span className="font-mono text-xs uppercase tracking-[0.35em] text-[#8E8A80]">
              Garantía y Logística desde Tenerife
            </span>
            <h2 className="mt-3 font-serif text-2xl font-light text-[#EBE7DF] sm:text-3xl">
              Envío en tubo rígido de alta densidad y conservación
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-[#8E8A80] font-light">
              Todas las copias se comercializan sin marco para garantizar un transporte seguro y sin riesgo de rotura de cristal desde Puerto de la Cruz (Tenerife) hacia cualquier destino de Canarias, Península o Europa. Cada lámina incluye un margen blanco perimetral para que puedas enmarcarla fácilmente en tu taller de confianza junto a las instrucciones de conservación preventiva.
            </p>
            <div className="mt-8">
              <Link
                href="/contact?motivo=print"
                className="inline-flex border border-[#EBE7DF] bg-[#EBE7DF] px-8 py-3.5 font-mono text-xs uppercase tracking-[0.3em] text-[#0B0C0E] font-medium transition-all duration-300 hover:bg-transparent hover:text-white"
              >
                Consultar encargo o serie para interiorismo
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
