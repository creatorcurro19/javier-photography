import Image from "next/image";
import Link from "next/link";
import Container from "@/components/ui/Container";
import { buildPageMetadata } from "@/lib/metadata";

export const metadata = buildPageMetadata({
  title: "Sobre el Autor | Javier Espinosa",
  description:
    "Biografía y declaración artística de Javier Espinosa Martínez. Fotógrafo español especializado en fauna, rally, arquitectura y narrativa documental con sistema Canon EOS R7.",
  path: "/about",
});

const GEAR = [
  {
    category: "Cuerpo de Cámara",
    item: "Canon EOS R7",
    desc: "Sensor APS-C Dual Pixel CMOS AF II de 32,5 Megapíxeles. Estabilización de sensor de 5 ejes y ráfaga de alta cadencia para captura de acción y fauna en condiciones límite.",
  },
  {
    category: "Teleobjetivo de Precisión",
    item: "Sigma 150-600mm F5-6.3 DG OS HSM Contemporary",
    desc: "Óptica principal para seguimiento de fauna salvaje en libertad y planos cerrados de alta compresión visual en tramos de rally.",
  },
  {
    category: "Zoom Documental & Reportaje",
    item: "Canon RF-S 18-150mm F3.5-6.3 IS STM",
    desc: "Versatilidad, ligereza y respuesta instantánea para fotografía de viajes, escenas costumbristas y narrativa de campo.",
  },
  {
    category: "Gran Angular de Arquitectura",
    item: "Canon EF-S 10-18mm F4.5-5.6 IS STM",
    desc: "Perspectiva espacial limpia y control de fugas lineales en composiciones urbanas e interiores patrimoniales.",
  },
];

const PILLARS = [
  {
    title: "Luz Natural como Guía",
    desc: "Rechazo del artificio lumínico invasivo. Cada fotografía se construye a partir de la luz disponible: las penumbras del amanecer, la dureza del sol sahariano o el destello de los faros en el asfalto mojado.",
  },
  {
    title: "Paciencia & Observación",
    desc: "El instante decisivo solo se alcanza tras horas de espera inmóvil frente a una madriguera, o apostado tras el guardarraíl de una curva ciega anticipando el paso milimétrico de un vehículo.",
  },
  {
    title: "Honestidad Documental",
    desc: "Ninguna fotografía recurre a manipulaciones generativas ni a falsificaciones digitales. El revelado respeta el grano orgánico del sensor y el equilibrio tonal real del momento captado.",
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#101112] pt-36 pb-28 text-[#D8D5CD]">
      <Container>
        {/* Hero Artist Profile */}
        <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Portrait / Editorial Image */}
          <div className="lg:col-span-5">
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-xl border border-[#1D2021] bg-[#1D2021]/50">
              <Image
                src="/images/portfolio/hero/hero.jpg"
                alt="Javier Espinosa Martínez - Fotografía de autor"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#101112]/90 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <span className="text-[10px] uppercase tracking-[0.3em] text-[#95836B] font-mono">
                  Fotografía de Autor
                </span>
                <p className="mt-1 font-serif text-2xl text-[#D8D5CD]">
                  Javier Espinosa Martínez
                </p>
                <p className="text-xs text-neutral-400 font-mono">España · Proyectos Internacionales</p>
              </div>
            </div>

            <div className="mt-6 rounded-xl border border-[#1D2021] bg-[#1D2021]/40 p-6 sm:p-7">
              <h2 className="text-xs uppercase tracking-[0.25em] text-[#95836B] font-mono">
                Ámbitos de Práctica
              </h2>
              <div className="mt-3 flex flex-wrap gap-2 text-xs text-[#D8D5CD]">
                <span className="rounded border border-[#1D2021] px-3 py-1 bg-[#101112]">Fauna y Naturaleza</span>
                <span className="rounded border border-[#1D2021] px-3 py-1 bg-[#101112]">Coches y Rally</span>
                <span className="rounded border border-[#1D2021] px-3 py-1 bg-[#101112]">Arquitectura Urbana</span>
                <span className="rounded border border-[#1D2021] px-3 py-1 bg-[#101112]">Fotografía Documental</span>
              </div>
            </div>
          </div>

          {/* Bio text */}
          <div className="lg:col-span-7 lg:pl-6">
            <p className="text-xs uppercase tracking-[0.4em] text-[#95836B] font-mono">
              Biografía & Trayectoria
            </p>
            <h1 className="mt-4 font-serif text-4xl font-light tracking-wide text-[#D8D5CD] sm:text-5xl lg:text-6xl">
              La mirada que detiene el tiempo
            </h1>

            <div className="mt-8 space-y-6 text-base leading-relaxed text-[#D8D5CD]/80 sm:text-lg sm:leading-8 font-light">
              <p>
                Soy Javier Espinosa Martínez, fotógrafo español dedicado a la fotografía de autor, 
                documental y deportiva. Concibo la disciplina fotográfica como un ejercicio de atención 
                sostenida donde la luz natural, la geometría intrínseca del entorno y el respeto absoluto 
                por la escena priman sobre cualquier intervención artificial.
              </p>
              <p>
                Mi obra se articula en torno a contrastes intensos: desde la adrenalina técnica y el dinamismo 
                preciso de las pruebas de rally —donde la fracción de segundo y el dominio de la velocidad 
                lo deciden todo— hasta el silencio expectante de la fauna salvaje en los ecosistemas ibéricos 
                y el rigor formal de las arquitecturas contemporáneas.
              </p>
              <p>
                Cada proyecto nace en el terreno: apostado en la curva de un tramo de asfalto mojado, 
                recorriendo las texturas de la piedra en pueblos históricos o esperando la última luz en el horizonte. 
                No busco el artificio, sino la dignidad formal de lo auténtico.
              </p>
            </div>

            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                href="/portfolio"
                className="inline-flex border border-[#D8D5CD] bg-[#D8D5CD] px-8 py-3.5 text-xs uppercase tracking-[0.3em] text-[#101112] font-semibold transition hover:bg-transparent hover:text-white"
              >
                Explorar el portfolio
              </Link>
              <Link
                href="/projects"
                className="inline-flex border border-[#1D2021] bg-[#1D2021]/60 px-8 py-3.5 text-xs uppercase tracking-[0.3em] text-[#D8D5CD] transition hover:border-[#95836B] hover:text-white"
              >
                Proyectos Narrativos
              </Link>
            </div>
          </div>
        </div>

        {/* Artistic Pillars */}
        <div className="mt-24 border-t border-[#1D2021] pt-16">
          <div className="max-w-2xl">
            <p className="text-xs uppercase tracking-[0.35em] text-[#95836B] font-mono">
              Principios de Creación
            </p>
            <h2 className="mt-2 font-serif text-3xl font-light text-[#D8D5CD] sm:text-4xl">
              Filosofía visual y ética de trabajo
            </h2>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-3">
            {PILLARS.map((pillar) => (
              <div
                key={pillar.title}
                className="rounded-lg border border-[#1D2021] bg-[#1D2021]/30 p-8 sm:p-10 transition hover:border-[#95836B]/60"
              >
                <h3 className="font-serif text-xl text-[#D8D5CD]">{pillar.title}</h3>
                <p className="mt-4 text-xs leading-relaxed text-[#D8D5CD]/80 font-light">
                  {pillar.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Equipment & Technical System */}
        <div className="mt-24 border-t border-[#1D2021] pt-16">
          <div className="flex flex-col justify-between gap-4 border-b border-[#1D2021] pb-6 sm:flex-row sm:items-end">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-[#95836B] font-mono">
                Equipo Técnico
              </p>
              <h2 className="mt-2 font-serif text-3xl font-light text-[#D8D5CD]">
                Sistema óptico y herramientas de campo
              </h2>
            </div>
            <p className="text-xs text-[#95836B] font-mono">
              Transparencia técnica en cada toma registrada en los metadatos EXIF.
            </p>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
            {GEAR.map((item) => (
              <div
                key={item.item}
                className="rounded-lg border border-[#1D2021] bg-[#1D2021]/30 p-8 sm:p-10"
              >
                <span className="text-[10px] uppercase tracking-[0.3em] text-[#95836B] font-mono">
                  {item.category}
                </span>
                <h3 className="mt-2 font-serif text-2xl text-[#D8D5CD]">{item.item}</h3>
                <p className="mt-4 text-xs leading-relaxed text-[#D8D5CD]/80 font-light">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Closing Contact Banner */}
        <div className="mt-24 rounded-xl border border-[#1D2021] bg-[#1D2021]/30 p-8 sm:p-14 text-center">
          <h2 className="font-serif text-3xl text-[#D8D5CD] sm:text-4xl">
            ¿Desea colaborar en un proyecto o adquirir obra original?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-[#D8D5CD]/80 font-light">
            Disponible para encargos editoriales, pruebas de automoción, fotografía de arquitectura 
            y proyectos expositivos en cualquier localización.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Link
              href="/contact"
              className="inline-flex border border-[#D8D5CD] bg-[#D8D5CD] px-8 py-3.5 text-xs uppercase tracking-[0.3em] text-[#101112] font-semibold transition hover:bg-transparent hover:text-white"
            >
              Contactar con Javier
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
}
