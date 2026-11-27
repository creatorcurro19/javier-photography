"use client";

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
import { getPlazos } from "@/data/plazos";
import { useLanguage } from "@/lib/i18n";

export default function ServiciosPageContent() {
  const { lang, t } = useLanguage();
  const plazos = getPlazos(lang);

  const servicios = [
    {
      id: "rally-motor",
      landingSlug: "fotografo-rally-motorsport",
      title: t(
        "Automovilismo y Rally Histórico",
        "Motorsport & Historic Rally"
      ),
      kicker: t("Competición y Motor", "Competition & Motorsport"),
      description: t(
        "Cobertura fotográfica en tramos cronometrados, parques de asistencia y presentaciones de vehículos clásicos y de competición. Captura de la velocidad, la tensión mecánica y el factor humano en rallyes históricos.",
        "Photographic coverage across timed special stages, service parks, and classic or competition car launches. Capturing speed, mechanical tension, and the human element in historic rallies."
      ),
      features: [
        t(
          "Cobertura completa en tramos cerrados y horquillas técnicas",
          "Full coverage on closed road stages and technical hairpins"
        ),
        t(
          "Fotografía de paddock, mecánicos, verificaciones y detalles de ingeniería",
          "Paddock, mechanics, scrutineering, and engineering detail photography"
        ),
        t(
          "Entrega rápida para notas de prensa, equipos y patrocinadores",
          "Fast-turnaround selection for press releases, crews, and sponsors"
        ),
        t(
          "Archivos en máxima resolución optimizados para cartelería y redes sociales",
          "Full-resolution master files optimized for print posters and social media"
        ),
      ],
      ideal: t(
        "Equipos de competición, organizadores de rallyes, marcas y coleccionistas de vehículos clásicos.",
        "Racing teams, rally organizers, heritage brands, and classic car collectors."
      ),
    },
    {
      id: "arquitectura-territorio",
      landingSlug: "fotografo-arquitectura-espacio-urbano",
      title: t(
        "Arquitectura, Espacios y Patrimonio",
        "Architecture, Spaces & Heritage"
      ),
      kicker: t("Espacio y Memoria", "Space & Memory"),
      description: t(
        "Documentación fotográfica rigurosa de obras arquitectónicas, patrimonio histórico, intervenciones rurales y diseño de espacios. Tratamiento escrupuloso de la luz natural, la geometría y la textura de los materiales.",
        "Disciplined photographic documentation of architectural works, historic heritage, rural interventions, and interior spaces—crafted with close attention to natural light, geometry, and material textures."
      ),
      features: [
        t(
          "Estudio previo de la orientación solar y horarios de luz óptimos",
          "Advance study of solar orientation and optimal daylight windows"
        ),
        t(
          "Fotografía diurna y nocturna con control estricto de perspectivas",
          "Daylight and twilight photography with strict perspective control"
        ),
        t(
          "Detalles constructivos, materiales vernáculos y relación con el entorno",
          "Construction details, vernacular materials, and relationship with surroundings"
        ),
        t(
          "Imágenes listas para publicaciones editoriales, catálogos y portfolios de arquitectos",
          "Publication-ready imagery for architectural portfolios, books, and design press"
        ),
      ],
      ideal: t(
        "Estudios de arquitectura, constructoras, fundaciones de patrimonio e interioristas.",
        "Architecture studios, builders, heritage foundations, and interior designers."
      ),
    },
    {
      id: "documental-editorial",
      landingSlug: "proyectos-documentales-fotografia-editorial",
      title: t(
        "Proyectos Documentales y Fotografía Editorial",
        "Documentary Projects & Editorial Photography"
      ),
      kicker: t("Narrativa Visual", "Visual Narrative"),
      description: t(
        "Ensayos fotográficos sobre tradiciones populares, oficios artesanales en peligro de extinción, memoria rural y territorio. Una mirada documental honesta que no busca la puesta en escena, sino la verdad de lo cotidiano.",
        "Photographic essays on living traditions, vanishing artisan trades, rural memory, and territory—an honest documentary approach focused on unhurried presence rather than staging."
      ),
      features: [
        t(
          "Investigación etnográfica previa e inmersión sobre el terreno",
          "Prior field research and unhurried on-location immersion"
        ),
        t(
          "Reportajes de media y larga duración para prensa y revistas",
          "Medium- and long-form essays for magazines and cultural press"
        ),
        t(
          "Textos de contexto y fichas testimoniales de los protagonistas",
          "Contextual notes and subject documentation"
        ),
        t(
          "Capacidad para convertir el proyecto en exposición o publicación monográfica",
          "Structured sequencing suited for exhibitions or monographic publications"
        ),
      ],
      ideal: t(
        "Editoriales, revistas culturales y de viajes, instituciones públicas y proyectos etnográficos.",
        "Publishers, cultural and travel magazines, public institutions, and ethnographic archives."
      ),
    },
    {
      id: "prints-interiorismo",
      landingSlug: "copias-fine-art-coleccionismo",
      title: t(
        "Copia de Autor para Coleccionismo e Interiorismo",
        "Fine Art Prints for Collecting & Interiors"
      ),
      kicker: "Fine Art",
      description: t(
        "Asesoramiento y suministro de impresiones Fine Art en papel de conservación para proyectos de decoración de interiores, oficinas corporativas, hoteles con encanto y coleccionistas privados.",
        "Advisory and supply of archival museum-grade Fine Art prints for interior architecture projects, corporate spaces, boutique hotels, and private collectors."
      ),
      features: [
        t(
          "Selección personalizada de obras según la paleta y escala del espacio",
          "Curated selection of works tailored to spatial palette and wall scale"
        ),
        t(
          "Papeles baritados o 100% algodón Hahnemühle con tintas de museo",
          "100% cotton Hahnemühle or museum-grade baryta papers with archival pigment inks"
        ),
        t(
          "Copias sin enmarcar enviadas en tubo rígido protector, listas para el enmarcado que elijas",
          "Unframed prints shipped inside rigid protective tubes, ready for custom framing"
        ),
        t(
          "Certificado de autenticidad y numeración de tirada firmado por el autor",
          "Signed and numbered Certificate of Authenticity included with each edition"
        ),
      ],
      ideal: t(
        "Interioristas, despachos profesionales, hoteles boutique y coleccionistas particulares.",
        "Interior designers, architectural practices, boutique hotels, and private collectors."
      ),
    },
  ];

  const faqItems = [
    {
      q: t(
        "¿Cómo se planifica la cobertura de un rally o evento de motor?",
        "How is coverage of a rally or motorsport event planned?"
      ),
      a: t(
        "Antes de la prueba se estudian el rutómetro, los horarios de corte y la orientación solar de cada tramo. Se combinan tomas en el parque de asistencia (ambiente, detalles mecánicos y pilotos) con disparos en curva y horquilla hasta 600mm.",
        "Before the rally, the roadbook, road-closure schedules, and sun position at each stage are mapped out. Coverage combines service park atmosphere, mechanical details, and driver portraits with cornering action up to 600mm."
      ),
    },
    {
      q: t(
        "¿En qué formato y plazo se entregan los reportajes?",
        "In what format and timeframe are commissioned shoots delivered?"
      ),
      a: t(
        `Se entrega una galería privada en alta resolución (archivos máster de 32,5 MP revelados individualmente y versiones optimizadas para prensa/web). ${plazos.rallyPrensa} ${plazos.reportajes}`,
        `Delivered via a private high-resolution gallery (individually graded 32.5 MP master files plus web/press-ready versions). ${plazos.rallyPrensa} ${plazos.reportajes}`
      ),
    },
    {
      q: t(
        "¿Realizas desplazamientos fuera de tu provincia o a las islas?",
        "Do you travel outside Tenerife or internationally for commissions?"
      ),
      a: t(
        "Sí. Con base en Tenerife (Islas Canarias), tengo disponibilidad para desplazamientos a Península y otras localizaciones bajo encargo.",
        "Yes. Based in Tenerife (Canary Islands), I am available to travel to mainland Spain and other destinations on commission."
      ),
    },
    {
      q: t(
        "¿Los encargos de arquitectura y turismo incluyen licencia de uso comercial?",
        "Do architectural and tourism commissions include commercial usage licensing?"
      ),
      a: t(
        "Sí, cada presupuesto incluye por escrito la cesión de derechos adaptada a las necesidades del cliente (web corporativa, catálogos impresos, campañas editoriales o promoción institucional).",
        "Yes. Every quote specifies written usage licensing tailored to your project scope (corporate website, printed catalogs, editorial campaigns, or institutional promotion)."
      ),
    },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0B0C0E] pt-36 pb-28 text-[#EBE7DF]">
      <AndalusianPageBackdrop variant="sebka" />
      <Container className="relative z-10">
        {/* Header */}
        <header className="max-w-3xl">
          <div className="flex items-center gap-2.5">
            <AndalusianStarMark className="h-3.5 w-3.5 text-[#C5A880]/75" />
            <p className="text-xs font-mono uppercase tracking-[0.4em] text-[#C5A880]/85">
              {t("Comercialización y Encargos", "Commissions & Services")}
            </p>
          </div>
          <h1 className="mt-4 text-4xl sm:text-5xl md:text-6xl font-light tracking-tight text-[#EBE7DF]">
            {t("Encargos y Proyectos Fotográficos", "Photography Commissions & Projects")}
          </h1>
          <p className="mt-6 text-lg font-light leading-relaxed text-[#EBE7DF]/80">
            {t(
              "Realizo encargos fotográficos para quienes buscan imágenes con personalidad propia y sin poses forzadas: desde la cobertura de un rally de clásicos o la documentación de una obra de arquitectura hasta reportajes editoriales y selección de copias para interiorismo.",
              "Available for photography commissions built around authenticity and natural light: from historic rally coverage and architectural documentation to editorial essays and curated Fine Art prints for interiors."
            )}
          </p>

          <div className="mt-7 flex flex-wrap items-center gap-3">
            <Link
              href="/dossier"
              className="inline-flex items-center gap-2 border border-[#EBE7DF] bg-[#EBE7DF] px-5 py-2.5 font-mono text-[10px] uppercase tracking-[0.25em] font-medium text-[#0B0C0E] transition hover:bg-transparent hover:text-white"
            >
              <span>{t("Dossier de Autor (PDF)", "Author Dossier (PDF)")}</span>
              <span>→</span>
            </Link>
            <Link
              href="/cliente"
              className="inline-flex items-center gap-2 border border-[#C5A880]/40 bg-[#151618] px-5 py-2.5 font-mono text-[10px] uppercase tracking-[0.25em] text-[#EBE7DF] transition hover:border-[#C5A880] hover:text-white"
            >
              <span>{t("Portal Privado de Clientes", "Private Client Portal")}</span>
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
                    <span className="font-mono uppercase tracking-wider text-[#8E8A80]">
                      {t("Dirigido a:", "Ideal for:")}
                    </span>{" "}
                    {s.ideal}
                  </div>
                </div>

                <div className="lg:max-w-md w-full border-t border-[#202226] pt-6 lg:border-t-0 lg:border-l lg:pl-8 lg:pt-0">
                  <h3 className="text-xs font-mono uppercase tracking-[0.2em] text-[#8E8A80]">
                    {t("Qué incluye la propuesta:", "Scope & deliverables:")}
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
                      {t("Solicitar Propuesta", "Request Proposal")}
                    </Link>
                    <Link
                      href={`/servicios/${s.landingSlug}`}
                      className="inline-flex w-full items-center justify-center border border-white/15 bg-[#0B0C0E]/70 px-6 py-2.5 text-[11px] font-mono uppercase tracking-[0.22em] text-[#C5A880] transition hover:border-[#C5A880] hover:text-white"
                    >
                      {t(
                        "Ver Dossier y Especificaciones →",
                        "View Dossier & Specifications →"
                      )}
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
            label={t("Metodología de Trabajo", "Workflow & Methodology")}
            title={t("Cómo Desarrollamos Cada Encargo", "How Every Commission Unfolds")}
            description={t(
              "Un proceso estructurado para garantizar resultados excepcionales y entrega cuidada en cada proyecto.",
              "A clear, structured process ensuring consistent craft and careful delivery on every assignment."
            )}
          />

          <div className="mt-12 grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="rounded-lg border border-[#202226] bg-[#202226]/30 p-6">
              <span className="font-mono text-2xl font-light text-[#8E8A80]">01</span>
              <h3 className="mt-3 font-serif text-lg text-[#EBE7DF]">
                {t("Briefing y Planificación", "Briefing & Planning")}
              </h3>
              <p className="mt-2 text-xs font-light leading-relaxed text-neutral-400">
                {t(
                  "Definición de objetivos, horarios de luz, localizaciones y estilo visual requerido antes de salir al campo.",
                  "Defining goals, daylight windows, locations, and visual direction prior to going on location."
                )}
              </p>
            </div>

            <div className="rounded-lg border border-[#202226] bg-[#202226]/30 p-6">
              <span className="font-mono text-2xl font-light text-[#8E8A80]">02</span>
              <h3 className="mt-3 font-serif text-lg text-[#EBE7DF]">
                {t("Producción en Campo", "On-Location Production")}
              </h3>
              <p className="mt-2 text-xs font-light leading-relaxed text-neutral-400">
                {t(
                  "Jornada de disparo con equipo Canon EOS R7, ópticas profesionales y adaptación constante a la luz natural.",
                  "Field production with Canon EOS R7 systems, pro glass, and continuous adaptation to natural light."
                )}
              </p>
            </div>

            <div className="rounded-lg border border-[#202226] bg-[#202226]/30 p-6">
              <span className="font-mono text-2xl font-light text-[#8E8A80]">03</span>
              <h3 className="mt-3 font-serif text-lg text-[#EBE7DF]">
                {t("Revelado de Autor", "Author Color Grading")}
              </h3>
              <p className="mt-2 text-xs font-light leading-relaxed text-neutral-400">
                {t(
                  "Edición digital en Lightroom Classic, calibración de color precisa y corrección óptica individualizada.",
                  "Digital editing in Lightroom Classic, calibrated color grading, and individual optical correction."
                )}
              </p>
            </div>

            <div className="rounded-lg border border-[#202226] bg-[#202226]/30 p-6">
              <span className="font-mono text-2xl font-light text-[#8E8A80]">04</span>
              <h3 className="mt-3 font-serif text-lg text-[#EBE7DF]">
                {t("Entrega y Licencia", "Delivery & Licensing")}
              </h3>
              <p className="mt-2 text-xs font-light leading-relaxed text-neutral-400">
                {t(
                  "Galería privada para descarga de archivos maestros en alta resolución y formatos web optimizados con contrato de cesión.",
                  "Private gallery for downloading full-resolution masters and web-ready derivatives with clear licensing terms."
                )}
              </p>
            </div>
          </div>
        </section>

        {/* CTA Banner */}
        <section className="mt-24 rounded-2xl border border-[#202226] bg-[#202226]/40 p-10 md:p-14 text-center">
          <h2 className="font-serif text-3xl font-light text-[#EBE7DF] md:text-4xl">
            {t("Conversemos sobre tu proyecto", "Let's discuss your project")}
          </h2>
          <p className="mt-4 max-w-xl mx-auto text-sm font-light text-[#EBE7DF]/80">
            {t(
              "Cuéntame las fechas, la localización y el objetivo de tu encargo.",
              "Tell me your planned dates, location, and project brief."
            )}{" "}
            {plazos.respuesta}
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Link
              href="/contact"
              className="border border-[#EBE7DF] bg-[#EBE7DF] px-8 py-3.5 text-xs font-mono uppercase tracking-[0.25em] text-[#0B0C0E] font-semibold transition hover:bg-transparent hover:text-white"
            >
              {t("Iniciar Conversación", "Start a Conversation")}
            </Link>
          </div>
        </section>

        {/* FAQ de Clientes y Encargos */}
        <section aria-labelledby="servicios-faq" className="mt-24 border-t border-[#202226] pt-16">
          <div className="max-w-2xl">
            <p className="text-xs uppercase tracking-[0.35em] text-[#8E8A80]">
              {t(
                "Preguntas Frecuentes sobre Coberturas y Encargos",
                "Frequently Asked Questions on Coverage & Commissions"
              )}
            </p>
            <h2 id="servicios-faq" className="mt-2 font-serif text-3xl font-light text-[#EBE7DF]">
              {t(
                "Metodología de trabajo, entregas y licencias",
                "Workflow, deliverables & licensing"
              )}
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
