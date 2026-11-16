import Link from "next/link";
import Container from "@/components/ui/Container";
import SectionHeader from "@/components/ui/SectionHeader";
import { buildPageMetadata } from "@/lib/metadata";

export const metadata = buildPageMetadata({
  title: "Servicios y Encargos Fotográficos",
  description:
    "Encargos profesionales de fotografía por Javier Espinosa Martínez: automovilismo y rally histórico, arquitectura y patrimonio, proyectos documentales y fotografía editorial.",
  path: "/servicios",
});

const servicios = [
  {
    id: "rally-motor",
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
  return (
    <div className="min-h-screen bg-black pt-36 pb-28 text-neutral-300">
      <Container>
        {/* Header */}
        <header className="max-w-3xl">
          <p className="text-xs font-mono uppercase tracking-[0.4em] text-neutral-500">
            Comercialización y Encargos
          </p>
          <h1 className="mt-4 font-serif text-5xl font-light tracking-tight md:text-6xl text-neutral-100">
            Servicios Fotográficos de Autor
          </h1>
          <p className="mt-6 text-lg font-light leading-relaxed text-neutral-300">
            Aporto mi identidad visual y experiencia técnica para proyectos comerciales, editoriales y documentales
            que demanden una mirada personal, libre de artificios publicitarios genéricos.
          </p>
        </header>

        {/* Services Grid */}
        <div className="mt-20 space-y-16">
          {servicios.map((s, idx) => (
            <section
              key={s.id}
              className="rounded-xl border border-neutral-800 bg-neutral-950 p-8 sm:p-10 md:p-12 transition hover:border-neutral-700"
            >
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8">
                <div className="lg:max-w-xl">
                  <span className="text-[11px] font-mono uppercase tracking-[0.3em] text-neutral-400">
                    0{idx + 1} · {s.kicker}
                  </span>
                  <h2 className="mt-2 font-serif text-3xl font-light text-neutral-100 md:text-4xl">
                    {s.title}
                  </h2>
                  <p className="mt-4 text-base font-light leading-relaxed text-neutral-300">
                    {s.description}
                  </p>

                  <div className="mt-6 rounded-md border border-neutral-800 bg-neutral-900/60 p-4 text-xs text-neutral-400">
                    <span className="font-mono uppercase tracking-wider text-neutral-300">Dirigido a:</span>{" "}
                    {s.ideal}
                  </div>
                </div>

                <div className="lg:max-w-md w-full border-t border-neutral-800 pt-6 lg:border-t-0 lg:border-l lg:pl-8 lg:pt-0">
                  <h3 className="text-xs font-mono uppercase tracking-[0.2em] text-neutral-400">
                    Qué incluye la propuesta:
                  </h3>
                  <ul className="mt-4 space-y-3 text-sm text-neutral-300">
                    {s.features.map((f, i) => (
                      <li key={i} className="flex items-start gap-2.5">
                        <span className="text-neutral-500 mt-0.5">—</span>
                        <span className="font-light">{f}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-8">
                    <Link
                      href={`/contact?servicio=${s.id}`}
                      className="inline-flex w-full items-center justify-center border border-neutral-200 bg-neutral-100 px-6 py-3 text-xs font-mono uppercase tracking-[0.25em] text-neutral-950 font-medium transition hover:bg-white hover:text-black hover:border-white"
                    >
                      Solicitar Propuesta
                    </Link>
                  </div>
                </div>
              </div>
            </section>
          ))}
        </div>

        {/* Methodology */}
        <section className="mt-28 border-t border-neutral-800 pt-20">
          <SectionHeader
            label="Metodología de Trabajo"
            title="Cómo Desarrollamos Cada Encargo"
            description="Un proceso estructurado para garantizar resultados excepcionales y cumplimiento riguroso de plazos."
          />

          <div className="mt-12 grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="rounded-lg border border-neutral-800 bg-neutral-950 p-6">
              <span className="font-mono text-2xl font-light text-neutral-400">01</span>
              <h4 className="mt-3 font-serif text-lg text-neutral-100">Briefing y Planificación</h4>
              <p className="mt-2 text-xs font-light leading-relaxed text-neutral-400">
                Definición de objetivos, horarios de luz, localizaciones y estilo visual requerido antes de salir al campo.
              </p>
            </div>

            <div className="rounded-lg border border-neutral-800 bg-neutral-950 p-6">
              <span className="font-mono text-2xl font-light text-neutral-400">02</span>
              <h4 className="mt-3 font-serif text-lg text-neutral-100">Producción en Campo</h4>
              <p className="mt-2 text-xs font-light leading-relaxed text-neutral-400">
                Jornada de disparo con equipo Canon EOS R7, ópticas profesionales y adaptación constante a la luz natural.
              </p>
            </div>

            <div className="rounded-lg border border-neutral-800 bg-neutral-950 p-6">
              <span className="font-mono text-2xl font-light text-neutral-400">03</span>
              <h4 className="mt-3 font-serif text-lg text-neutral-100">Revelado de Autor</h4>
              <p className="mt-2 text-xs font-light leading-relaxed text-neutral-400">
                Edición digital en Lightroom Classic, calibración de color precisa y corrección óptica individualizada.
              </p>
            </div>

            <div className="rounded-lg border border-neutral-800 bg-neutral-950 p-6">
              <span className="font-mono text-2xl font-light text-neutral-400">04</span>
              <h4 className="mt-3 font-serif text-lg text-neutral-100">Entrega y Licencia</h4>
              <p className="mt-2 text-xs font-light leading-relaxed text-neutral-400">
                Galería privada para descarga de archivos maestros en alta resolución y formatos web optimizados con contrato de cesión.
              </p>
            </div>
          </div>
        </section>

        {/* CTA Banner */}
        <section className="mt-24 rounded-2xl border border-neutral-800 bg-neutral-950 p-10 md:p-14 text-center">
          <h2 className="font-serif text-3xl font-light text-neutral-100 md:text-4xl">
            Conversemos sobre tu proyecto
          </h2>
          <p className="mt-4 max-w-xl mx-auto text-sm font-light text-neutral-300">
            Cuéntame las fechas, la localización y el objetivo de tu encargo. Te enviaré una propuesta detallada en menos de 24 horas.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Link
              href="/contact"
              className="border border-neutral-200 bg-neutral-100 px-8 py-3.5 text-xs font-mono uppercase tracking-[0.25em] text-neutral-950 font-medium transition hover:bg-white hover:text-black hover:border-white"
            >
              Iniciar Conversación
            </Link>
          </div>
        </section>
      </Container>
    </div>
  );
}
