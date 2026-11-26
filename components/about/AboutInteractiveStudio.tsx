"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { getAllPhotos } from "@/lib/photos";
import { WORKS, SERIES } from "@/data/works";
import { SITE_SETTINGS } from "@/data/site-config";

const VIEWFINDER_SLIDES = [
  {
    id: "autor",
    code: "01 / MIRADA",
    label: "Observar en Campo",
    title: "Detenerse a mirar",
    location: "Tenerife, Islas Canarias",
    image:
      SITE_SETTINGS.showAuthorPortrait && SITE_SETTINGS.authorPortraitUrl
        ? SITE_SETTINGS.authorPortraitUrl
        : "/images/portfolio/hero/hero.jpg",
    secondaryImage: "/images/portfolio/paisajes-documental/cumbre-nevada-al-alba.jpg",
    secondaryCaption: "Cumbre Nevada al Alba · 115mm · f/6.3",
    exif: "EOS R7 · 115mm · f/6.3 · 1/400s · ISO 320",
    aspect: "aspect-[4/5]",
    note: "La fotografía empieza bastante antes de levantar la cámara: empieza al fijarse en cómo cae la luz, en el silencio de un lugar o en un detalle que a simple vista pasaría de largo.",
  },
  {
    id: "fauna",
    code: "02 / FAUNA",
    label: "Fauna a 600mm",
    title: "Mirada del Lince Boreal",
    location: "Observación a 600mm · Reserva de Fauna",
    image: "/images/portfolio/fauna-naturaleza/mirada-del-lince-boreal.jpg",
    secondaryImage: "/images/portfolio/fauna-naturaleza/garza-blanca-al-sol.jpg",
    secondaryCaption: "Garza Blanca al Sol · EOS 750D · 600mm · f/6.3",
    exif: "EOS R7 · 600mm · f/6.3 · 1/1250s · ISO 1250",
    aspect: "aspect-[4/5]",
    note: "Esperar a distancia con el 600mm hasta que el animal sigue a lo suyo y te regala unos segundos de calma.",
  },
  {
    id: "rally",
    code: "03 / RALLY",
    label: "Motor y Acción",
    title: "Cruzada sobre el Asfalto",
    location: "Tramo Cronometrado · Rally Histórico",
    image: "/images/portfolio/coches-rally/cruzada-sobre-el-asfalto.jpg",
    secondaryImage: "/images/portfolio/coches-rally/leyenda-con-librea-martini.jpg",
    secondaryCaption: "Apoyo en Curva · 150-600mm",
    exif: "EOS R7 · 200mm · f/5.6 · 1/1000s · ISO 400",
    aspect: "aspect-[4/5]",
    note: "De la quietud del monte al ruido de un motor clásico: tanto me interesa el coche apoyando al límite en una horquilla como las manos del mecánico en la asistencia.",
  },
  {
    id: "patrimonio",
    code: "04 / ARQUITECTURA",
    label: "Piedra y Tiempo",
    title: "Ventanas Tomadas por el Bosque",
    location: "Lugares Abandonados y Arquitectura",
    image: "/images/portfolio/arquitectura-urbana/ventanas-tomadas-por-el-bosque.jpg",
    secondaryImage: "/images/portfolio/viajes-cultura/el-oficio-y-la-chispa.jpg",
    secondaryCaption: "Oficios de Forja · Luz Natural",
    exif: "EOS R7 · 18mm · f/5.0 · 1/30s · ISO 100",
    aspect: "aspect-[4/5]",
    note: "La madera vieja, el granito, los muros descascarillados y los lugares abandonados donde el tiempo y la vegetación van recuperando su sitio.",
  },
  {
    id: "documental",
    code: "05 / DOCUMENTAL",
    label: "Oficios y Calle",
    title: "El Oficio y la Chispa",
    location: "Fragua Tradicional · Vida Cotidiana",
    image: "/images/portfolio/viajes-cultura/el-oficio-y-la-chispa.jpg",
    secondaryImage: "/images/portfolio/viajes-cultura/tornero-de-madera-en-el-zoco.jpg",
    secondaryCaption: "Tornero en el Zoco · 32mm",
    exif: "EOS R7 · 18mm · f/3.5 · 1/60s · ISO 1600",
    aspect: "aspect-[4/5]",
    note: "Registrar talleres, mercados y escenas de calle tal como suceden, sin pedir que nadie pose para la cámara.",
  },
];

const DISCIPLINES = [
  {
    id: "paisajes-documental",
    roman: "I",
    code: "LANDSCAPES",
    title: "Paisajes y Territorio",
    subtitle: "Montaña, niebla, costa y desierto",
    image: "/images/portfolio/paisajes-documental/cumbre-nevada-al-alba.jpg",
    telemetry: "10–150mm · Luz Natural · Canarias, Península y Sahara",
    description:
      "Lugares abiertos donde la luz y el relieve hacen todo el trabajo: las cumbres volcánicas de Tenerife al amanecer, los bosques húmedos de laurisilva o las dunas del Sahara al caer la tarde.",
    href: "/portfolio/paisajes-documental",
  },
  {
    id: "fauna-naturaleza",
    roman: "II",
    code: "WILDLIFE",
    title: "Fauna y Naturaleza",
    subtitle: "Observación en libertad a distancia",
    image: "/images/portfolio/fauna-naturaleza/mirada-del-lince-boreal.jpg",
    telemetry: "600mm · f/6.3 · Luz Natural · Sin Alterar el Entorno",
    description:
      "Fotografiar fauna consiste en saber esperar sin molestar. Con el teleobjetivo de 600mm busco aislar al animal en su propio entorno —desde un ave en los riscos de Anaga hasta un lobo o un ciervo en el monte— sin interferir en lo que hace.",
    href: "/portfolio/fauna-naturaleza",
  },
  {
    id: "coches-rally",
    roman: "III",
    code: "MOTORSPORT",
    title: "Coches y Rally",
    subtitle: "Tramos, paddock y clásicos con historia",
    image: "/images/portfolio/coches-rally/cruzada-sobre-el-asfalto.jpg",
    telemetry: "150–600mm · 1/60s–1/2000s · Tramo y Parque de Trabajo",
    description:
      "En las carreras de clásicos conviven la velocidad del tramo cerrado y la calma tensa de las carpas de asistencia: frenadas en horquilla, ruedas en el aire, faros supletorios, notas sobre el capó y olor a gasolina.",
    href: "/portfolio/coches-rally",
  },
  {
    id: "arquitectura-urbana",
    roman: "IV",
    code: "ARCHITECTURE",
    title: "Arquitectura y Espacio Urbano",
    subtitle: "Huella del tiempo, piedra y calles nocturnas",
    image: "/images/portfolio/arquitectura-urbana/ventanas-tomadas-por-el-bosque.jpg",
    telemetry: "10–35mm · f/8.0 · Luz Lateral y Nocturna",
    description:
      "Edificios y rincones que cuentan cómo se construía antes o cómo pasa el tiempo por ellos: soportales de granito y entramados de madera en La Vera, patios antiguos, lugares abandonados y calles solitarias de noche.",
    href: "/portfolio/arquitectura-urbana",
  },
  {
    id: "viajes-cultura",
    roman: "V",
    code: "DOCUMENTARY",
    title: "Documental y Tradición",
    subtitle: "Oficios, mercados y escenas cotidianas",
    image: "/images/portfolio/viajes-cultura/el-oficio-y-la-chispa.jpg",
    telemetry: "18–150mm · Luz Disponible · Sin Posados",
    description:
      "Historias pequeñas y oficios que resisten: el interior oscuro de una fragua, un tornero de madera en Marrakech, secaderos de pimientos al sol y escenas cotidianas donde la presencia humana forma parte natural del lugar.",
    href: "/portfolio/viajes-cultura",
  },
];

const OPTICAL_BENCH = [
  {
    id: "r7",
    tag: "CUERPO PRINCIPAL",
    name: "Canon EOS R7",
    spec: "32.5 MP APS-C · Dual Pixel CMOS AF II · IBIS 7 pasos",
    angleDeg: 46,
    focalRange: "Factor 1.6× · 15 fps Mecánico",
    role: "Cuerpo sellado de alta densidad de píxeles e inteligencia de seguimiento ocular para capturar fracciones de segundo en fauna y motorsport.",
    highlights: [
      "Sensor de 32,5 megapíxeles con margen de recorte editorial y ampliación Fine Art hasta 105 cm.",
      "Estabilización en el cuerpo (IBIS) coordinada de hasta 7 pasos para disparar a pulso en penumbra.",
      "Obturador mecánico de 15 fps y electrónico de 30 fps para secuencias críticas de acción.",
    ],
    filterMatch: (lens: string) => lens.length > 0,
  },
  {
    id: "sigma600",
    tag: "SUPERTELEOBJETIVO",
    name: "Sigma 150–600mm f/5–6.3 DG OS HSM Contemporary",
    spec: "Equivalente 240–960mm en 35mm · Estabilizador Óptico OS",
    angleDeg: 4,
    focalRange: "150mm — 600mm (2.5° de visión)",
    role: "La herramienta esencial de aislamiento óptico: comprime planos distantes, desenfoca fondos complejos y permite observar sin invadir el espacio vital.",
    highlights: [
      "Alcance real equivalente a 960mm en formato completo gracias al factor 1.6× de la EOS R7.",
      "Compresión espacial extrema ideal para retratos de fauna salvaje, aves en vuelo y salidas de curva en rally.",
      "Cristales FLD y SLD que mantienen microcontraste en plumaje, pelaje y calima desértica.",
    ],
    filterMatch: (lens: string) => lens.includes("150-600"),
  },
  {
    id: "rf18150",
    tag: "ÓPTICA DE EXPEDICIÓN",
    name: "Canon RF-S 18–150mm f/3.5–6.3 IS STM",
    spec: "Equivalente 29–240mm · 310 g · Estabilización Dinámica",
    angleDeg: 28,
    focalRange: "18mm — 150mm (Todoterreno Documental)",
    role: "Agilidad pura para reportaje de calle, travesías por el Sahara, medinas marroquíes y transiciones inmediatas entre paisaje y retrato.",
    highlights: [
      "Cubre desde el plano general ambiental (29mm equiv.) hasta el detalle cerrado (240mm equiv.) sin cambiar de óptica bajo tormentas de arena o polvo.",
      "Discreción absoluta en fotografía documental y costumbrista.",
      "Enfoque STM silencioso y mínima distancia de enfoque para texturas artesanales.",
    ],
    filterMatch: (lens: string) => lens.includes("18-150"),
  },
  {
    id: "efs1018",
    tag: "GRAN ANGULAR ARQUITECTÓNICO",
    name: "Canon EF-S 10–18mm f/4.5–5.6 IS STM",
    spec: "Equivalente 16–29mm · Ángulo Ultraancho de 107°",
    angleDeg: 88,
    focalRange: "10mm — 18mm (Geometría y Espacio)",
    role: "Inmersión espacial en callejones históricos, arquitectura vernácula, bóvedas e inmensidad geológica de alta montaña.",
    highlights: [
      "Ángulo de visión de hasta 107° para capturar interiores estrechos y entramados urbanos de La Vera.",
      "Control riguroso de líneas de fuga y profundidad de campo extendida de primer plano a infinito.",
      "Recubrimiento Super Spectra para evitar destellos parasitarios en tomas nocturnas.",
    ],
    filterMatch: (lens: string) => lens.includes("10-18"),
  },
];

export default function AboutInteractiveStudio() {
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [hudEnabled, setHudEnabled] = useState(true);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [activeDiscipline, setActiveDiscipline] = useState(0);
  const [activeGearId, setActiveGearId] = useState("sigma600");

  const allPhotos = useMemo(() => getAllPhotos(), []);

  const currentSlide = VIEWFINDER_SLIDES[activeSlideIndex];
  const currentGear =
    OPTICAL_BENCH.find((g) => g.id === activeGearId) ?? OPTICAL_BENCH[0];

  const gearSamplePhotos = useMemo(() => {
    const matched = allPhotos.filter((p) => currentGear.filterMatch(p.lens));
    return (matched.length >= 3 ? matched : allPhotos).slice(0, 3);
  }, [allPhotos, currentGear]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const relX = (e.clientX - rect.left) / rect.width - 0.5;
    const relY = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({
      x: Number((-relY * 5).toFixed(2)),
      y: Number((relX * 5).toFixed(2)),
    });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  return (
    <div className="space-y-28 sm:space-y-36">
      {/* =====================================================================
          1. HERO EDITORIAL MONOGRAPH & INTERACTIVE OPTICAL VIEWFINDER
      ===================================================================== */}
      <section className="relative">
        {/* Top Monograph Header Bar */}
        <div className="mb-10 flex flex-wrap items-center justify-between gap-4 border-b border-[#202226] pb-4 font-mono text-[10px] uppercase tracking-[0.32em] text-[#8E8A80]">
          <div className="flex items-center gap-3">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#8E8A80]" />
            <span>Monografía de Autor · N.º 01</span>
          </div>
          <span className="text-neutral-500">
            Javier Espinosa Martínez · Tenerife, Canarias, España
          </span>
        </div>

        <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-12 lg:gap-14">
          {/* Left Column: Editorial Statement & Interactive Perspective Selector */}
          <div className="lg:col-span-7 lg:pr-4">
            <p className="font-mono text-xs uppercase tracking-[0.38em] text-[#8E8A80]">
              Sobre mí y mi forma de mirar
            </p>
            <h1 className="mt-4 font-serif text-4xl font-light leading-[1.08] tracking-wide text-[#EBE7DF] sm:text-6xl lg:text-[4.25rem]">
              Observar antes de{" "}
              <span className="italic text-[#8E8A80]">disparar</span>
            </h1>

            {/* Editorial Pull Quote */}
            <blockquote className="mt-8 border-l-2 border-[#8E8A80] pl-6 font-serif text-xl italic leading-relaxed text-[#EBE7DF]/90 sm:text-2xl">
              «La fotografía no tiene que demostrar constantemente lo impresionante que es el mundo. A veces basta con detenerse a observarlo.»
            </blockquote>

            <div className="mt-8 space-y-5 text-base font-light leading-relaxed text-[#EBE7DF]/80 sm:text-[17px] sm:leading-8">
              <p>
                Soy <strong className="font-medium text-[#EBE7DF]">Javier Espinosa Martínez</strong>,
                fotógrafo afincado en Tenerife (Islas Canarias). Me interesa salir con la cámara a observar lo que tengo delante y encontrar carácter en cosas muy distintas: un animal en mitad del monte, la niebla entrando en un bosque, una fachada antigua o el paso de un coche clásico en un tramo de montaña.
              </p>
              <p>
                Nunca me ha interesado encasillarme en una sola disciplina. Paso con naturalidad de esperar en silencio con el 600mm a recorrer los soportales de piedra y madera de{" "}
                <Link
                  href="/projects/villanueva-de-la-vera"
                  className="underline decoration-[#8E8A80]/60 underline-offset-4 transition hover:text-white"
                >
                  Villanueva de la Vera
                </Link>
                , un edificio abandonado tomado por las plantas, los talleres de Marrakech o las dunas del{" "}
                <Link
                  href="/projects/silencio-del-desierto"
                  className="underline decoration-[#8E8A80]/60 underline-offset-4 transition hover:text-white"
                >
                  Sahara
                </Link>
                . Son temas diferentes, pero todos parten de la misma curiosidad por la luz real, la huella del tiempo y los detalles que normalmente pasan desapercibidos.
              </p>
              <p>
                Prefiero la autenticidad a la espectacularidad forzada. Cuando aparece una persona en mis fotografías —un herrero en su fragua, un vecino en la sombra de una calleja o un mecánico bajo la carpa de asistencia—, forma parte del lugar y del momento, sin necesidad de posados ni de convertirlo todo en espectáculo.
              </p>
            </div>

            {/* Interactive Viewfinder Perspective Switcher */}
            <div className="mt-10 border border-[#202226] bg-[#151618]/50 p-5 sm:p-6">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#202226] pb-3.5">
                <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-[#8E8A80]">
                  Explorar Facetas en el Visor →
                </span>
                <button
                  type="button"
                  onClick={() => setHudEnabled((v) => !v)}
                  className={`border px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.2em] transition ${
                    hudEnabled
                      ? "border-[#8E8A80] bg-[#8E8A80]/15 text-[#EBE7DF]"
                      : "border-[#202226] text-neutral-500 hover:text-[#EBE7DF]"
                  }`}
                >
                  Visor de Cámara: {hudEnabled ? "Activo" : "Oculto"}
                </button>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
                {VIEWFINDER_SLIDES.map((slide, idx) => {
                  const active = idx === activeSlideIndex;
                  return (
                    <button
                      key={slide.id}
                      type="button"
                      onMouseEnter={() => setActiveSlideIndex(idx)}
                      onClick={() => setActiveSlideIndex(idx)}
                      className={`group flex flex-col justify-between border p-3 text-left transition-all duration-300 ${
                        active
                          ? "border-[#8E8A80] bg-[#202226]/90 text-white"
                          : "border-[#202226] bg-[#0B0C0E]/70 text-[#EBE7DF]/70 hover:border-[#8E8A80]/50 hover:text-[#EBE7DF]"
                      }`}
                    >
                      <span className="font-mono text-[9px] tracking-[0.2em] text-[#8E8A80]">
                        {slide.code}
                      </span>
                      <span className="mt-2 font-serif text-sm leading-snug">
                        {slide.label}
                      </span>
                    </button>
                  );
                })}
              </div>

              <p className="mt-4 text-xs font-light italic leading-relaxed text-[#EBE7DF]/75">
                {currentSlide.note}
              </p>
            </div>

            {/* Primary Actions */}
            <div className="mt-9 flex flex-wrap items-center gap-4 print:hidden">
              <Link
                href="/portfolio"
                className="inline-flex items-center gap-3 border border-[#EBE7DF] bg-[#EBE7DF] px-7 py-3.5 text-xs font-semibold uppercase tracking-[0.28em] text-[#0B0C0E] transition hover:bg-transparent hover:text-white"
              >
                <span>Explorar Archivo ({WORKS.length} Obras)</span>
                <span>→</span>
              </Link>
              <Link
                href="/projects"
                className="inline-flex items-center gap-2 border border-[#202226] bg-[#202226]/60 px-7 py-3.5 text-xs uppercase tracking-[0.28em] text-[#EBE7DF] transition hover:border-[#8E8A80] hover:text-white"
              >
                <span>{SERIES.length} Series Documentales</span>
              </Link>
              <button
                type="button"
                onClick={() => window.print()}
                className="inline-flex items-center gap-2 border border-[#8E8A80]/60 bg-[#0B0C0E] px-5 py-3.5 font-mono text-[10px] uppercase tracking-[0.24em] text-[#EBE7DF] transition hover:border-[#EBE7DF] hover:text-white"
              >
                <span>Dossier Curatorial (PDF)</span>
                <span>↓</span>
              </button>
            </div>
          </div>

          {/* Right Column: Interactive Optical Viewfinder & Diptych Stage */}
          <div className="lg:col-span-5">
            <div
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              style={{
                transform: `perspective(1200px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
              }}
              className="relative transition-transform duration-200 ease-out"
            >
              {/* Main Optical Frame */}
              <div className="relative aspect-[4/5] w-full overflow-hidden border border-[#202226] bg-[#151618] shadow-[0_25px_70px_rgba(0,0,0,0.75)]">
                <Image
                  key={currentSlide.image}
                  src={currentSlide.image}
                  alt={currentSlide.title}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 42vw"
                  className="object-cover transition-all duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B0C0E] via-[#0B0C0E]/20 to-transparent" />

                {/* Optional Canon EOS R7 Optical Viewfinder HUD Overlay */}
                {hudEnabled && (
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-5 flex flex-col justify-between border border-[#EBE7DF]/15 p-4 transition-opacity duration-500"
                  >
                    {/* Top Viewfinder Telemetry */}
                    <div className="flex items-center justify-between font-mono text-[9px] uppercase tracking-[0.25em] text-[#EBE7DF]/80">
                      <span className="flex items-center gap-1.5 bg-[#0B0C0E]/70 px-2 py-0.5 backdrop-blur-sm">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                        AF-SERVO · RAW
                      </span>
                      <span className="bg-[#0B0C0E]/70 px-2 py-0.5 text-[#8E8A80] backdrop-blur-sm">
                        {currentSlide.code}
                      </span>
                    </div>

                    {/* Center AF Reticle Brackets */}
                    <div className="relative mx-auto flex h-20 w-20 items-center justify-center">
                      <span className="absolute top-0 left-0 h-3 w-3 border-t border-l border-[#8E8A80]" />
                      <span className="absolute top-0 right-0 h-3 w-3 border-t border-r border-[#8E8A80]" />
                      <span className="absolute bottom-0 left-0 h-3 w-3 border-b border-l border-[#8E8A80]" />
                      <span className="absolute right-0 bottom-0 h-3 w-3 border-r border-b border-[#8E8A80]" />
                      <span className="h-1 w-1 rounded-full bg-[#8E8A80]/80" />
                    </div>

                    {/* Bottom Viewfinder Caption & EXIF */}
                    <div className="space-y-1 bg-[#0B0C0E]/80 p-3.5 backdrop-blur-md border border-[#202226]">
                      <div className="flex items-center justify-between font-mono text-[9px] uppercase tracking-[0.22em] text-[#8E8A80]">
                        <span>{currentSlide.location}</span>
                        <span>[32.5 MP]</span>
                      </div>
                      <p className="font-serif text-xl text-[#EBE7DF]">
                        {currentSlide.title}
                      </p>
                      <p className="font-mono text-[10px] tracking-wider text-neutral-400">
                        {currentSlide.exif}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Floating Secondary Diptych Detail Card */}
              <div className="mt-4 flex items-center justify-between gap-4 border border-[#202226] bg-[#151618]/90 p-3.5 backdrop-blur-md">
                <div className="flex items-center gap-3.5">
                  <div className="relative h-14 w-20 shrink-0 overflow-hidden border border-[#202226] bg-[#0B0C0E]">
                    <Image
                      key={currentSlide.secondaryImage}
                      src={currentSlide.secondaryImage}
                      alt={currentSlide.secondaryCaption}
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-[#8E8A80]">
                      Plano Complementario
                    </span>
                    <p className="font-serif text-base text-[#EBE7DF]">
                      {currentSlide.secondaryCaption}
                    </p>
                  </div>
                </div>
                <div className="hidden pr-2 font-mono text-[10px] text-neutral-500 sm:block">
                  0{activeSlideIndex + 1} / 05
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          2–4. SECCIONES TÉCNICAS INTERACTIVAS (ocultas en versión minimalista sin eliminar)
      ===================================================================== */}
      <div className="hidden">
      <section className="grid grid-cols-2 border-y border-[#202226] bg-[#0D0E0F]/80 sm:grid-cols-5">
        {[
          { value: String(WORKS.length), label: "Obras Catalogadas", sub: "Edición Verificada" },
          { value: String(SERIES.length).padStart(2, "0"), label: "Series Narrativas", sub: "Ensayos de Campo" },
          { value: "3", label: "Ópticas Principales", sub: "Rango 10mm a 600mm" },
          { value: "32.5 MP", label: "Resolución Nativa", sub: "Canon EOS R7 RAW" },
          { value: "ISO 9706", label: "Calidad Museo", sub: "Papel 100% Algodón" },
        ].map((stat, i) => (
          <div
            key={stat.label}
            className={`p-6 sm:p-8 ${
              i !== 0 ? "border-l border-[#202226]" : ""
            } ${i >= 2 ? "border-t border-[#202226] sm:border-t-0" : ""}`}
          >
            <p className="font-serif text-3xl font-light text-[#EBE7DF] sm:text-4xl">
              {stat.value}
            </p>
            <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.24em] text-[#8E8A80]">
              {stat.label}
            </p>
            <p className="mt-1 text-[11px] text-neutral-500">{stat.sub}</p>
          </div>
        ))}
      </section>

      {/* =====================================================================
          3. INTERACTIVE EXPANDING GALLERY CURTAIN: LAS CINCO DISCIPLINAS
      ===================================================================== */}
      <section>
        <div className="flex flex-col justify-between gap-4 border-b border-[#202226] pb-6 sm:flex-row sm:items-end">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.35em] text-[#8E8A80]">
              Territorios de Práctica
            </p>
            <h2 className="mt-2 font-serif text-3xl font-light text-[#EBE7DF] sm:text-5xl">
              Las cinco disciplinas del archivo
            </h2>
          </div>
          <p className="font-mono text-[11px] text-[#8E8A80]">
            Pasa el cursor o selecciona cada disciplina: Landscapes, Wildlife, Motorsport, Urban &amp; Architecture, Documentary →
          </p>
        </div>

        {/* Interactive Curtain Accordion */}
        <div className="mt-10 flex flex-col gap-3 lg:h-[500px] lg:flex-row">
          {DISCIPLINES.map((item, idx) => {
            const isExpanded = activeDiscipline === idx;
            return (
              <div
                key={item.id}
                onMouseEnter={() => setActiveDiscipline(idx)}
                onClick={() => setActiveDiscipline(idx)}
                className={`group relative cursor-pointer overflow-hidden border transition-all duration-500 ease-out ${
                  isExpanded
                    ? "min-h-[380px] border-[#8E8A80]/80 lg:flex-[2.7]"
                    : "min-h-[130px] border-[#202226] opacity-80 hover:opacity-100 lg:flex-1"
                }`}
              >
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className={`object-cover transition-transform duration-700 ${
                    isExpanded ? "scale-100" : "scale-105"
                  }`}
                />
                <div
                  className={`absolute inset-0 transition-colors duration-500 ${
                    isExpanded
                      ? "bg-gradient-to-t from-[#0D0E0F] via-[#0D0E0F]/65 to-[#0D0E0F]/20"
                      : "bg-[#0D0E0F]/75 group-hover:bg-[#0D0E0F]/60"
                  }`}
                />

                <div className="relative flex h-full flex-col justify-between p-6 sm:p-8">
                  {/* Top Bar */}
                  <div className="flex items-center justify-between">
                    <span className="font-serif text-2xl italic text-[#8E8A80] sm:text-3xl">
                      {item.roman}.
                    </span>
                    <span className="border border-[#202226] bg-[#0B0C0E]/80 px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.22em] text-[#EBE7DF]">
                      {item.code}
                    </span>
                  </div>

                  {/* Bottom Content */}
                  <div className="mt-8">
                    <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#8E8A80]">
                      {item.subtitle}
                    </p>
                    <h3 className="mt-1 font-serif text-2xl text-[#EBE7DF] sm:text-3xl">
                      {item.title}
                    </h3>

                    {isExpanded && (
                      <div className="mt-4 space-y-4">
                        <p className="max-w-xl text-sm font-light leading-relaxed text-[#EBE7DF]/85">
                          {item.description}
                        </p>
                        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-[#EBE7DF]/15 pt-4">
                          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#8E8A80]">
                            {item.telemetry}
                          </span>
                          <Link
                            href={item.href}
                            onClick={(e) => e.stopPropagation()}
                            className="inline-flex items-center gap-2 border border-[#EBE7DF] bg-[#EBE7DF] px-4 py-1.5 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#0B0C0E] transition hover:bg-transparent hover:text-white"
                          >
                            <span>Ver Obras</span>
                            <span>→</span>
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* =====================================================================
          4. INTERACTIVE OPTICAL BENCH (SISTEMA CANON EOS R7 & ÓPTICAS)
      ===================================================================== */}
      <section className="border-t border-[#202226] pt-20">
        <div className="flex flex-col justify-between gap-4 border-b border-[#202226] pb-6 sm:flex-row sm:items-end">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.35em] text-[#8E8A80]">
              Ingeniería & Transparencia EXIF
            </p>
            <h2 className="mt-2 font-serif text-3xl font-light text-[#EBE7DF] sm:text-5xl">
              Laboratorio óptico de campo
            </h2>
          </div>
          <p className="font-mono text-xs text-neutral-400">
            Selecciona un instrumento para inspeccionar su ángulo óptico y obras reales
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Left Selector Tabs */}
          <div className="flex flex-col gap-3 lg:col-span-5">
            {OPTICAL_BENCH.map((gear) => {
              const active = gear.id === activeGearId;
              return (
                <button
                  key={gear.id}
                  type="button"
                  onClick={() => setActiveGearId(gear.id)}
                  className={`group relative border p-5 text-left transition-all duration-300 ${
                    active
                      ? "border-[#8E8A80] bg-[#202226]/70 text-white"
                      : "border-[#202226] bg-[#151618]/40 text-[#EBE7DF]/75 hover:border-[#8E8A80]/50 hover:bg-[#202226]/30"
                  }`}
                >
                  <div className="flex items-center justify-between font-mono text-[9px] uppercase tracking-[0.26em] text-[#8E8A80]">
                    <span>{gear.tag}</span>
                    <span>{gear.focalRange}</span>
                  </div>
                  <h3 className="mt-2 font-serif text-xl text-[#EBE7DF] group-hover:text-white">
                    {gear.name}
                  </h3>
                  <p className="mt-1 font-mono text-[10px] text-neutral-400">
                    {gear.spec}
                  </p>
                </button>
              );
            })}
          </div>

          {/* Right Live Optical Inspector Panel */}
          <div className="flex flex-col justify-between border border-[#202226] bg-[#151618]/40 p-6 sm:p-9 lg:col-span-7">
            <div>
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#202226] pb-5">
                <div>
                  <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-[#8E8A80]">
                    {currentGear.tag}
                  </span>
                  <h3 className="mt-1 font-serif text-2xl text-[#EBE7DF] sm:text-3xl">
                    {currentGear.name}
                  </h3>
                </div>

                {/* Live Optical Cone SVG Diagram */}
                <div className="flex items-center gap-3 border border-[#202226] bg-[#0B0C0E] px-4 py-2">
                  <svg
                    viewBox="0 0 80 44"
                    className="h-9 w-16 text-[#8E8A80]"
                    aria-hidden="true"
                  >
                    {/* Sensor origin */}
                    <circle cx="8" cy="22" r="2.5" fill="currentColor" />
                    {/* Reference outer guide */}
                    <line
                      x1="8"
                      y1="22"
                      x2="74"
                      y2="4"
                      stroke="#202226"
                      strokeWidth="1"
                      strokeDasharray="2 2"
                    />
                    <line
                      x1="8"
                      y1="22"
                      x2="74"
                      y2="40"
                      stroke="#202226"
                      strokeWidth="1"
                      strokeDasharray="2 2"
                    />
                    {/* Active Optical Cone */}
                    {(() => {
                      const spread = Math.max(
                        3,
                        Math.min(19, (currentGear.angleDeg / 90) * 19)
                      );
                      const yTop = 22 - spread;
                      const yBottom = 22 + spread;
                      return (
                        <>
                          <polygon
                            points={`8,22 74,${yTop} 74,${yBottom}`}
                            fill="currentColor"
                            fillOpacity="0.18"
                          />
                          <line
                            x1="8"
                            y1="22"
                            x2="74"
                            y2={yTop}
                            stroke="currentColor"
                            strokeWidth="1.5"
                          />
                          <line
                            x1="8"
                            y1="22"
                            x2="74"
                            y2={yBottom}
                            stroke="currentColor"
                            strokeWidth="1.5"
                          />
                        </>
                      );
                    })()}
                  </svg>
                  <div className="font-mono text-[9px] uppercase tracking-wider">
                    <span className="block text-neutral-500">Cono Óptico</span>
                    <span className="text-[#EBE7DF]">
                      ~{currentGear.angleDeg}° FOV
                    </span>
                  </div>
                </div>
              </div>

              <p className="mt-5 text-sm font-light leading-relaxed text-[#EBE7DF]/85 sm:text-base">
                {currentGear.role}
              </p>

              <ul className="mt-5 space-y-2.5 border-l border-[#8E8A80]/50 pl-4 text-xs font-light text-[#EBE7DF]/80">
                {currentGear.highlights.map((h) => (
                  <li key={h} className="leading-relaxed">
                    {h}
                  </li>
                ))}
              </ul>
            </div>

            {/* 3 Real Works Captured With This Gear */}
            <div className="mt-8 border-t border-[#202226] pt-6">
              <div className="mb-3 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.25em] text-[#8E8A80]">
                <span>Obras Reales Capturadas con este Sistema</span>
                <Link
                  href="/portfolio"
                  className="text-neutral-400 hover:text-white"
                >
                  Ver archivo →
                </Link>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {gearSamplePhotos.map((photo) => (
                  <Link
                    key={photo.id}
                    href={`/portfolio/${photo.slug}`}
                    className="group relative block overflow-hidden border border-[#202226] bg-[#0B0C0E]"
                  >
                    <div className="relative aspect-[4/3] w-full">
                      <Image
                        src={photo.image}
                        alt={photo.alt}
                        fill
                        sizes="200px"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    <div className="p-2.5">
                      <p className="truncate font-serif text-sm text-[#EBE7DF] group-hover:text-white">
                        {photo.title}
                      </p>
                      <p className="font-mono text-[9px] text-[#8E8A80]">
                        {photo.focalLength} · {photo.aperture} · {photo.shutter}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
      </div>

      {/* =====================================================================
          5. OFFICIAL INTERNATIONAL PLATFORMS & ETHICAL PILLARS
      ===================================================================== */}
      <section className="grid grid-cols-1 gap-12 border-t border-[#202226] pt-20 lg:grid-cols-12">
        {/* Left: Ethical Manifesto in Numbered Editorial Format */}
        <div className="lg:col-span-6">
          <p className="font-mono text-xs uppercase tracking-[0.35em] text-[#8E8A80]">
            Manera de Trabajar
          </p>
          <h2 className="mt-2 font-serif text-3xl font-light text-[#EBE7DF] sm:text-4xl">
            Tres criterios sencillos
          </h2>

          <div className="mt-8 divide-y divide-[#202226] border-y border-[#202226]">
            {[
              {
                num: "01",
                title: "Trabajar con la luz que hay",
                desc: "Prefiero adaptarme a la luz real de cada hora: la penumbra antes del amanecer, el sol filtrado en un callejón, la niebla del monte o las farolas de una calle de noche.",
              },
              {
                num: "02",
                title: "Fotografía real, sin elementos inventados",
                desc: "Lo que aparece en la imagen estaba delante del objetivo. El revelado se limita a cuidar el tono, el contraste y la limpieza del archivo para impresión, sin añadir ni generar nada artificialmente.",
              },
              {
                num: "03",
                title: "Respeto por el lugar y por lo fotografiado",
                desc: "Tanto en la naturaleza como en un taller o en la calle, procuro interferir lo mínimo posible: mantener la distancia con la fauna y dejar que las escenas ocurran a su propio ritmo.",
              },
            ].map((pillar) => (
              <div key={pillar.num} className="flex gap-5 py-6">
                <span className="font-mono text-xs text-[#8E8A80]">
                  /{pillar.num}
                </span>
                <div>
                  <h3 className="font-serif text-xl text-[#EBE7DF]">
                    {pillar.title}
                  </h3>
                  <p className="mt-2 text-xs font-light leading-relaxed text-[#EBE7DF]/75 sm:text-sm">
                    {pillar.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Official International Representation Cards */}
        <div className="lg:col-span-6">
          <p className="font-mono text-xs uppercase tracking-[0.35em] text-[#8E8A80]">
            Presencia & Adquisición Global
          </p>
          <h2 className="mt-2 font-serif text-3xl font-light text-[#EBE7DF] sm:text-4xl">
            Plataformas oficiales verificadas
          </h2>

          <div className="mt-8 space-y-4">
            {[
              {
                badge: "COLECCIONISMO & OBRA GRÁFICA",
                title: "Saatchi Art",
                subtitle: "saatchiart.com/javier-espinosa-photography",
                desc: "Adquisición internacional de obra Fine Art y ediciones para coleccionistas, interioristas y galerías con envío global asegurado.",
                href: "https://www.saatchiart.com/javier-espinosa-photography",
                cta: "Visitar Galería en Saatchi Art ↗",
              },
              {
                badge: "LICENCIAS COMERCIALES & EDITORIALES",
                title: "Getty Images / iStock",
                subtitle: "istockphoto.com/portfolio/JavierEspinosa",
                desc: "Catálogo oficial de licencias de derechos para agencias de publicidad, grupos editoriales, prensa, documentales y diseño corporativo.",
                href: "https://www.istockphoto.com/portfolio/JavierEspinosa?sort=purerecency&assettype=image",
                cta: "Explorar Portfolio en Getty / iStock ↗",
              },
              {
                badge: "DIARIO VISUAL & EXPEDICIONES",
                title: "Instagram · @Javier.espinosa19",
                subtitle: "instagram.com/Javier.espinosa19",
                desc: "Crónica activa de salidas de campo, nuevas series fotográficas, sesiones de rally y contacto directo con el autor.",
                href: "https://www.instagram.com/Javier.espinosa19/",
                cta: "Seguir @Javier.espinosa19 ↗",
              },
            ].map((plat) => (
              <a
                key={plat.title}
                href={plat.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative block overflow-hidden border border-[#202226] bg-[#151618]/50 p-6 transition-all duration-300 hover:border-[#8E8A80] hover:bg-[#202226]/60"
              >
                <div className="flex items-center justify-between font-mono text-[9px] uppercase tracking-[0.26em] text-[#8E8A80]">
                  <span>{plat.badge}</span>
                  <span className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-0.5">
                    ↗
                  </span>
                </div>
                <div className="mt-2 flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="font-serif text-2xl text-[#EBE7DF] group-hover:text-white">
                    {plat.title}
                  </h3>
                  <span className="font-mono text-[10px] text-neutral-500">
                    {plat.subtitle}
                  </span>
                </div>
                <p className="mt-2.5 text-xs font-light leading-relaxed text-[#EBE7DF]/75">
                  {plat.desc}
                </p>
                <span className="mt-4 inline-block font-mono text-[10px] uppercase tracking-[0.22em] text-[#EBE7DF] underline decoration-[#8E8A80]/60 underline-offset-4 group-hover:text-white">
                  {plat.cta}
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* =====================================================================
          6. CLOSING COMMISSION & COLLECTOR BANNER
      ===================================================================== */}
      <section className="relative overflow-hidden border border-[#202226] bg-[#151618]/40 p-8 sm:p-14">
        <div className="relative z-10 flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
          <div className="max-w-2xl">
            <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-[#8E8A80]">
              Contacto Directo & Comisiones
            </p>
            <h2 className="mt-2 font-serif text-3xl font-light text-[#EBE7DF] sm:text-4xl">
              ¿Deseas encargar un reportaje, licenciar una imagen o adquirir obra firmada?
            </h2>
            <p className="mt-3 text-sm font-light leading-relaxed text-[#EBE7DF]/80">
              Disponible para proyectos editoriales, cobertura de automovilismo,
              arquitectura vernácula y copias Fine Art de autor desde Tenerife (Islas Canarias), con disponibilidad de desplazamiento a Península y proyectos internacionales.
            </p>
          </div>

          <div className="flex flex-wrap gap-4">
            <Link
              href="/contact"
              className="inline-flex border border-[#EBE7DF] bg-[#EBE7DF] px-8 py-3.5 text-xs font-semibold uppercase tracking-[0.28em] text-[#0B0C0E] transition hover:bg-transparent hover:text-white"
            >
              Iniciar Conversación
            </Link>
            <Link
              href="/prints"
              className="inline-flex border border-[#202226] bg-[#0B0C0E] px-7 py-3.5 text-xs uppercase tracking-[0.25em] text-[#EBE7DF] transition hover:border-[#8E8A80] hover:text-white"
            >
              Simulador Fine Art
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
