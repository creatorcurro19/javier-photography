import Link from "next/link";
import Container from "@/components/ui/Container";
import SectionHeader from "@/components/ui/SectionHeader";
import CommissionConfigurator from "@/components/servicios/CommissionConfigurator";
import UpcomingEventsSection from "@/components/events/UpcomingEventsSection";
import {
  AndalusianCenefa,
  AndalusianPageBackdrop,
  AndalusianStarMark,
} from "@/components/ui/AndalusianMotif";
import JsonLd from "@/components/seo/JsonLd";
import { buildPageMetadata } from "@/lib/metadata";
import { generateFAQSchema, generateServiceSchema } from "@/lib/schema";

export const metadata = buildPageMetadata({
  title: "Servicios y Encargos Fotográficos",
  description:
    "Encargos profesionales de fotografía por Javier Espinosa Martínez: automovilismo y rally histórico, arquitectura y patrimonio, proyectos documentales y fotografía editorial.",
  path: "/servicios",
});

const servicios = [
  {
    id: "rally-motor",
    landingSlug: "fotografo-rally-motorsport",
    title: "Automovilismo y Rally Histórico",
    kicker: "Competición y Motor",
    description:
      "Cobertura fotográfica en tramos cronometrados, parques de asistencia y presentaciones de vehículos clásicos y de competición. Captura de la velocidad, la tensión mecánica y el factor humano en rallyes históricos de España y Europa.",
    features: [
      "Cobertura completa en tramos cerrados y horquillas técnicas",
      "Fotografía de paddock, mecánicos, verificaciones y detalles de ingeniería",
      "Entrega rápida para notas de prensa, equipos y patrocinadores",
      "Archivos en máxima resolución optimizados para cartelería y redes sociales",
    ],
    ideal: "Equipos de competición, organizadores de rallyes, marcas y coleccionistas de vehículos clásicos.",
  },
  {
    id: "arquitectura-territorio",
    landingSlug: "fotografo-arquitectura-espacio-urbano",
    title: "Arquitectura, Espacios y Patrimonio",
    kicker: "Espacio y Memoria",
    description:
      "Documentación fotográfica rigurosa de obras arquitectónicas, patrimonio histórico, intervenciones rurales y diseño de espacios. Tratamiento escrupuloso de la luz natural, la geometría y la textura de los materiales.",
    features: [
      "Estudio previo de la orientación solar y horarios de luz óptimos",
      "Fotografía diurna y nocturna con control estricto de perspectivas",
      "Detalles constructivos, materiales vernáculos y relación con el entorno",
      "Imágenes listas para publicaciones editoriales, catálogos y portfolios de arquitectos",
    ],
    ideal: "Estudios de arquitectura, constructoras, fundaciones de patrimonio e interioristas.",
  },
  {
    id: "documental-editorial",
    landingSlug: "proyectos-documentales-fotografia-editorial",
    title: "Proyectos Documentales y Fotografía Editorial",
    kicker: "Narrativa Visual",
    description:
      "Ensayos fotográficos sobre tradiciones populares, oficios artesanales en peligro de extinción, memoria rural y territorio. Una mirada documental honesta que no busca la puesta en escena, sino la verdad de lo cotidiano.",
    features: [
      "Investigación etnográfica previa e inmersión sobre el terreno",
      "Reportajes de media y larga duración para prensa y revistas",
      "Textos de contexto y fichas testimoniales de los protagonistas",
      "Capacidad para convertir el proyecto en exposición o publicación monográfica",
    ],
    ideal: "Editoriales, revistas culturales y de viajes, instituciones públicas y proyectos etnográficos.",
  },
  {
    id: "prints-interiorismo",
    landingSlug: "copias-fine-art-coleccionismo",
    title: "Copia de Autor para Coleccionismo e Interiorismo",
    kicker: "Fine Art",
    description:
      "Asesoramiento y suministro de impresiones Fine Art en papel de conservación para proyectos de decoración de interiores, oficinas corporativas, hoteles con encanto y coleccionistas privados.",
    features: [
      "Selección personalizada de obras según la paleta y escala del espacio",
      "Papeles baritados o 100% algodón Hahnemühle con tintas de museo",
      "Opciones de enmarcado a medida con maderas nobles y paspartú libre de ácido",
      "Certificado de autenticidad y numeración de tirada firmado por el autor",
    ],
    ideal: "Interioristas, despachos profesionales, hoteles boutique y coleccionistas particulares.",
  },
];

export default function ServiciosPage() {
  const faqItems = [
    {
      q: "¿Cómo se planifica la cobertura de un rally o evento de motor?",
      a: "Antes de la prueba se estudian el rutómetro, los horarios de corte y la orientación solar de cada tramo. Se combinan tomas en el parque de asistencia (ambiente, detalles mecánicos y pilotos) con disparos en curva y horquilla hasta 600mm.",
    },
    {
      q: "¿En qué formato y plazo se entregan los reportajes?",
      a: "Se entrega una galería privada en alta resolución (archivos máster de 32,5 MP revelados individualmente y versiones optimizadas para prensa/web). Para eventos de automoción y cobertura de prensa se proporciona un adelanto urgente prioritario en 24 horas, mientras que la galería completa calibrada se entrega de forma orientativa en un plazo de 3 a 5 días laborables según el volumen de tomas.",
    },
    {
      q: "¿Realizas desplazamientos fuera de tu provincia o a las islas?",
      a: "Sí. Con base en Tenerife (Islas Canarias), trabajo habitualmente tanto en el archipiélago como en la Península Ibérica (Extremadura, Salamanca, Madrid, Gredos) y proyectos internacionales.",
    },
    {
      q: "¿Los encargos de arquitectura y turismo incluyen licencia de uso comercial?",
      a: "Sí, cada presupuesto incluye por escrito la cesión de derechos adaptada a las necesidades del cliente (web corporativa, catálogos impresos, campañas editoriales o promoción institucional).",
    },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0B0C0E] pt-36 pb-28 text-[#EBE7DF]">
      <AndalusianPageBackdrop variant="sebka" />
      <JsonLd data={generateServiceSchema()} />
      <JsonLd data={generateFAQSchema(faqItems)} />
      <Container className="relative z-10">
        {/* Header */}
        <header className="max-w-3xl">
          <div className="flex items-center gap-2.5">
            <AndalusianStarMark className="h-3.5 w-3.5 text-[#C5A880]/75" />
            <p className="text-xs font-mono uppercase tracking-[0.4em] text-[#C5A880]/85">
              Comercialización y Encargos
            </p>
          </div>
          <h1 className="mt-4 text-4xl sm:text-5xl md:text-6xl font-light tracking-tight text-[#EBE7DF]">
            Encargos y Proyectos Fotográficos
          </h1>
          <p className="mt-6 text-lg font-light leading-relaxed text-[#EBE7DF]/80">
            Realizo encargos fotográficos para quienes buscan imágenes con personalidad propia y sin poses forzadas: desde la cobertura de un rally de clásicos o la documentación de una obra de arquitectura hasta reportajes editoriales y selección de copias para interiorismo.
          </p>

          <div className="mt-7 flex flex-wrap items-center gap-3">
            <Link
              href="/dossier"
              className="inline-flex items-center gap-2 border border-[#EBE7DF] bg-[#EBE7DF] px-5 py-2.5 font-mono text-[10px] uppercase tracking-[0.25em] font-medium text-[#0B0C0E] transition hover:bg-transparent hover:text-white"
            >
              <span>Dossier &amp; Press Kit (PDF)</span>
              <span>→</span>
            </Link>
            <Link
              href="/cliente"
              className="inline-flex items-center gap-2 border border-[#C5A880]/40 bg-[#151618] px-5 py-2.5 font-mono text-[10px] uppercase tracking-[0.25em] text-[#EBE7DF] transition hover:border-[#C5A880] hover:text-white"
            >
              <span>Portal Privado de Clientes</span>
              <span>→</span>
            </Link>
          </div>
        </header>

        <AndalusianCenefa
          variant="sebka"
          className="mt-10 text-[#C5A880]/38"
        />

        {/* Interactive Commission Brief Builder */}
        <CommissionConfigurator />

        {/* Calendario de próximas coberturas confirmadas (se oculta automáticamente si no hay eventos futuros) */}
        <UpcomingEventsSection />

        {/* Services Grid */}
        <div className="mt-20 space-y-16">
          {servicios.map((s, idx) => (
            <section
              key={s.id}
              className="rounded-xl border border-[#202226] bg-[#202226]/40 p-8 sm:p-10 md:p-12 transition hover:border-[#8E8A80]/60"
            >
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8">
                <div className="lg:max-w-xl">
                  <span className="text-[11px] font-mono uppercase tracking-[0.3em] text-[#8E8A80]">
                    0{idx + 1} · {s.kicker}
                  </span>
                  <h2 className="mt-2 font-serif text-3xl font-light text-[#EBE7DF] md:text-4xl">
                    {s.title}
                  </h2>
                  <p className="mt-4 text-base font-light leading-relaxed text-[#EBE7DF]/80">
                    {s.description}
                  </p>

                  <div className="mt-6 rounded-md border border-[#202226] bg-[#0B0C0E]/60 p-4 text-xs text-neutral-400">
                    <span className="font-mono uppercase tracking-wider text-[#8E8A80]">Dirigido a:</span>{" "}
                    {s.ideal}
                  </div>
                </div>

                <div className="lg:max-w-md w-full border-t border-[#202226] pt-6 lg:border-t-0 lg:border-l lg:pl-8 lg:pt-0">
                  <h3 className="text-xs font-mono uppercase tracking-[0.2em] text-[#8E8A80]">
                    Qué incluye la propuesta:
                  </h3>
                  <ul className="mt-4 space-y-3 text-sm text-[#EBE7DF]/80">
                    {s.features.map((f, i) => (
                      <li key={i} className="flex items-start gap-2.5">
                        <span className="text-[#8E8A80] mt-0.5">—</span>
                        <span className="font-light">{f}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-8 space-y-2.5">
                    <Link
                      href={`/contact?servicio=${s.id}`}
                      className="inline-flex w-full items-center justify-center border border-[#EBE7DF] bg-[#EBE7DF] px-6 py-3 text-xs font-mono uppercase tracking-[0.25em] text-[#0B0C0E] font-semibold transition hover:bg-transparent hover:text-white"
                    >
                      Solicitar Propuesta
                    </Link>
                    <Link
                      href={`/servicios/${s.landingSlug}`}
                      className="inline-flex w-full items-center justify-center border border-white/15 bg-[#0B0C0E]/70 px-6 py-2.5 text-[11px] font-mono uppercase tracking-[0.22em] text-[#C5A880] transition hover:border-[#C5A880] hover:text-white"
                    >
                      Ver Dossier y Especificaciones →
                    </Link>
                  </div>
                </div>
              </div>
            </section>
          ))}
        </div>

        {/* Methodology */}
        <section className="mt-28 border-t border-[#202226] pt-20">
          <SectionHeader
            label="Metodología de Trabajo"
            title="Cómo Desarrollamos Cada Encargo"
            description="Un proceso estructurado para garantizar resultados excepcionales y cumplimiento riguroso de plazos."
          />

          <div className="mt-12 grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="rounded-lg border border-[#202226] bg-[#202226]/30 p-6">
              <span className="font-mono text-2xl font-light text-[#8E8A80]">01</span>
              <h3 className="mt-3 font-serif text-lg text-[#EBE7DF]">Briefing y Planificación</h3>
              <p className="mt-2 text-xs font-light leading-relaxed text-neutral-400">
                Definición de objetivos, horarios de luz, localizaciones y estilo visual requerido antes de salir al campo.
              </p>
            </div>

            <div className="rounded-lg border border-[#202226] bg-[#202226]/30 p-6">
              <span className="font-mono text-2xl font-light text-[#8E8A80]">02</span>
              <h3 className="mt-3 font-serif text-lg text-[#EBE7DF]">Producción en Campo</h3>
              <p className="mt-2 text-xs font-light leading-relaxed text-neutral-400">
                Jornada de disparo con equipo Canon EOS R7, ópticas profesionales y adaptación constante a la luz natural.
              </p>
            </div>

            <div className="rounded-lg border border-[#202226] bg-[#202226]/30 p-6">
              <span className="font-mono text-2xl font-light text-[#8E8A80]">03</span>
              <h3 className="mt-3 font-serif text-lg text-[#EBE7DF]">Revelado de Autor</h3>
              <p className="mt-2 text-xs font-light leading-relaxed text-neutral-400">
                Edición digital en Lightroom Classic, calibración de color precisa y corrección óptica individualizada.
              </p>
            </div>

            <div className="rounded-lg border border-[#202226] bg-[#202226]/30 p-6">
              <span className="font-mono text-2xl font-light text-[#8E8A80]">04</span>
              <h3 className="mt-3 font-serif text-lg text-[#EBE7DF]">Entrega y Licencia</h3>
              <p className="mt-2 text-xs font-light leading-relaxed text-neutral-400">
                Galería privada para descarga de archivos maestros en alta resolución y formatos web optimizados con contrato de cesión.
              </p>
            </div>
          </div>
        </section>

        {/* CTA Banner */}
        <section className="mt-24 rounded-2xl border border-[#202226] bg-[#202226]/40 p-10 md:p-14 text-center">
          <h2 className="font-serif text-3xl font-light text-[#EBE7DF] md:text-4xl">
            Conversemos sobre tu proyecto
          </h2>
          <p className="mt-4 max-w-xl mx-auto text-sm font-light text-[#EBE7DF]/80">
            Cuéntame las fechas, la localización y el objetivo de tu encargo. Recibirás una respuesta o propuesta inicial orientativa habitualmente en un plazo de 24 a 48 horas laborables.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Link
              href="/contact"
              className="border border-[#EBE7DF] bg-[#EBE7DF] px-8 py-3.5 text-xs font-mono uppercase tracking-[0.25em] text-[#0B0C0E] font-semibold transition hover:bg-transparent hover:text-white"
            >
              Iniciar Conversación
            </Link>
          </div>
        </section>

        {/* FAQ de Clientes y Encargos */}
        <section aria-labelledby="servicios-faq" className="mt-24 border-t border-[#202226] pt-16">
          <div className="max-w-2xl">
            <p className="text-xs uppercase tracking-[0.35em] text-[#8E8A80]">
              Preguntas Frecuentes sobre Coberturas y Encargos
            </p>
            <h2 id="servicios-faq" className="mt-2 font-serif text-3xl font-light text-[#EBE7DF]">
              Metodología de trabajo, entregas y licencias
            </h2>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-4 lg:grid-cols-2">
            {faqItems.map((item) => (
              <details
                key={item.q}
                className="group rounded-lg border border-[#202226] bg-[#202226]/30 p-6 transition hover:border-[#8E8A80]/50"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-serif text-lg text-[#EBE7DF]">
                  <span>{item.q}</span>
                  <span className="text-xs text-[#8E8A80] transition group-open:rotate-45">+</span>
                </summary>
                <p className="mt-4 text-xs leading-relaxed text-[#EBE7DF]/80 font-light">
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
