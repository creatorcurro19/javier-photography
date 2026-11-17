"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { getAllPhotos } from "@/lib/photos";

const VIEWFINDER_SLIDES = [
  {
    id: "autor",
    code: "01 / AUTOR",
    label: "El Autor en Campo",
    title: "Silencio, espera y horizonte",
    location: "Costa Atlántica & Península Ibérica",
    image: "/images/portfolio/hero/hero.jpg",
    secondaryImage: "/images/portfolio/paisajes-documental/B51A0149.jpg",
    secondaryCaption: "Cumbre del Teide · 24mm · Luz cenital",
    exif: "EOS R7 · 50mm · f/4.0 · 1/500s · ISO 100",
    aspect: "aspect-[4/5]",
    note: "La fotografía comienza mucho antes de levantar la cámara: empieza al leer la dirección del viento, la caída del sol y el ritmo del territorio.",
  },
  {
    id: "fauna",
    code: "02 / FAUNA",
    label: "Fauna a 600mm",
    title: "Mirada del Lince Boreal",
    location: "Bosque Boreal · Aproximación Silenciosa",
    image: "/images/portfolio/fauna-naturaleza/B51A1823-Mejorado-NR.jpg",
    secondaryImage: "/images/portfolio/fauna-naturaleza/IMG_8446-Mejorado-NR.jpg",
    secondaryCaption: "Garza Blanca al Sol · 600mm · f/6.3",
    exif: "EOS R7 · 232mm · f/5.0 · 1/800s · ISO 2000",
    aspect: "aspect-[4/5]",
    note: "Horas de inmovilidad absoluta hasta que el animal olvida la presencia humana y regala un instante de contacto visual irrepetible.",
  },
  {
    id: "rally",
    code: "03 / RALLY",
    label: "Tensión Cinética",
    title: "Vértigo en Tramo Cerrado",
    location: "Campeonato de Rally · Asfalto y Tierra",
    image: "/images/portfolio/coches-rally/B51A9718.jpg",
    secondaryImage: "/images/portfolio/coches-rally/B51A9118.jpg",
    secondaryCaption: "Compresión en Curva · 150-600mm",
    exif: "EOS R7 · 200mm · f/5.6 · 1/1000s · ISO 400",
    aspect: "aspect-[4/5]",
    note: "Del silencio del bosque al rugido mecánico: congelar la deformación del neumático o barrer el fondo a 1/60s exige reflejos milimétricos.",
  },
  {
    id: "patrimonio",
    code: "04 / MEMORIA",
    label: "Arquitectura & Raíz",
    title: "Entramados de La Vera",
    location: "Villanueva de la Vera, Cáceres",
    image: "/images/portfolio/arquitectura-urbana/B51A4685.jpg",
    secondaryImage: "/images/portfolio/viajes-cultura/soldador.jpg",
    secondaryCaption: "Oficios de Forja · Crónica Documental",
    exif: "EOS R7 · 35mm · f/5.6 · 1/250s · ISO 200",
    aspect: "aspect-[4/5]",
    note: "La madera de castaño, el granito y los oficios tradicionales conservan la huella del tiempo sin necesidad de artificios escenográficos.",
  },
];

const DISCIPLINES = [
  {
    id: "fauna-naturaleza",
    roman: "I",
    code: "WILDLIFE & BIODIVERSITY",
    title: "Fauna & Naturaleza",
    subtitle: "El privilegio de ser invisible",
    image: "/images/portfolio/fauna-naturaleza/B51A1823-Mejorado-NR.jpg",
    telemetry: "600mm · f/6.3 · 1/1600s · AF Ojo Animal",
    description:
      "Trabajar con fauna salvaje en libertad impone una ética innegociable: jamás alterar el comportamiento del animal. El teleobjetivo extremo comprime la atmósfera y aísla el gesto íntimo entre la maleza o la roca.",
    href: "/portfolio?category=fauna-naturaleza",
  },
  {
    id: "coches-rally",
    roman: "II",
    code: "MOTORSPORT & DYNAMICS",
    title: "Coches & Rally",
    subtitle: "Geometría de la velocidad",
    image: "/images/portfolio/coches-rally/B51A9718.jpg",
    telemetry: "150–400mm · 1/60s–1/2000s · Ráfaga 15 fps",
    description:
      "En un tramo de rally no hay segundas tomas. La lectura previa de la trazada, la luz rasante sobre el polvo en suspensión y el control del barrido transforman la máquina en escultura cinética.",
    href: "/portfolio?category=coches-rally",
  },
  {
    id: "arquitectura-urbana",
    roman: "III",
    code: "VERNACULAR & URBAN SPACE",
    title: "Arquitectura & Espacio",
    subtitle: "Orden, piedra y entramado",
    image: "/images/portfolio/arquitectura-urbana/B51A4685.jpg",
    telemetry: "10–35mm · f/8.0 · Líneas de Fuga Controladas",
    description:
      "Desde las fachadas históricas de Villanueva de la Vera hasta la geometría contemporánea: una búsqueda del equilibrio entre masa, sombra proyectada y escala humana.",
    href: "/portfolio?category=arquitectura-urbana",
  },
  {
    id: "paisajes-documental",
    roman: "IV",
    code: "TERRITORY & EXPEDITION",
    title: "Territorio & Crónica",
    subtitle: "Del Sahara al Atlántico",
    image: "/images/portfolio/paisajes-documental/B51A0149.jpg",
    telemetry: "18–150mm · Luz Natural · Sin Filtros Artificiales",
    description:
      "Las dunas móviles del Erg marroquí, la calima sahariana, los volcanes de Canarias y los oficios artesanos documentados con fidelidad cromática y respeto antropológico.",
    href: "/projects",
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
    name: "Sigma 150–600mm F5–6.3 DG OS HSM Contemporary",
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
    name: "Canon RF-S 18–150mm F3.5–6.3 IS STM",
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
    name: "Canon EF-S 10–18mm F4.5–5.6 IS STM",
    spec: "Equivalente 16–29mm · Ángulo Ultraancho de 107°",
    angleDeg: 88,
    focalRange: "10mm — 18mm (Geometría y Espacio)",
    role: "Inmersión espacial en callejones históricos, arquitectura vernácula, bóvedas e inmensidad geológica de alta montaña.",
    highlights: [
      "Ángulo de visión de hasta 107° para capturar interiores estrechos y entramados urbanos de La Vera.",
      "Control riguroso de líneas de fuga y profundidad de campo extendida de primer plano a infinito.",
      "Recubrimiento Super Spectra para evitar destellos parasitarios en tomas nocturnas.",
    ],
    filterMatch: (lens: string) =>
      lens.includes("10-18") || lens.includes("18-55"),
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
        <div className="mb-10 flex flex-wrap items-center justify-between gap-4 border-b border-[#1D2021] pb-4 font-mono text-[10px] uppercase tracking-[0.32em] text-[#95836B]">
          <div className="flex items-center gap-3">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#95836B]" />
            <span>Monografía de Autor · N.º 01</span>
          </div>
          <span className="text-neutral-500">
            Javier Espinosa Martínez · España
          </span>
        </div>

        <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-12 lg:gap-14">
          {/* Left Column: Editorial Statement & Interactive Perspective Selector */}
          <div className="lg:col-span-7 lg:pr-4">
            <p className="font-mono text-xs uppercase tracking-[0.38em] text-[#95836B]">
              Biografía & Declaración Visual
            </p>
            <h1 className="mt-4 font-serif text-4xl font-light leading-[1.08] tracking-wide text-[#D8D5CD] sm:text-6xl lg:text-[4.25rem]">
              La mirada que detiene{" "}
              <span className="italic text-[#95836B]">el instante</span>
            </h1>

            {/* Editorial Pull Quote */}
            <blockquote className="mt-8 border-l-2 border-[#95836B] pl-6 font-serif text-xl italic leading-relaxed text-[#D8D5CD]/90 sm:text-2xl">
              «No busco el artificio ni la escena fabricada; busco el segundo
              exacto en que la luz natural, la geometría y el instinto se
              alinean en silencio.»
            </blockquote>

            <div className="mt-8 space-y-5 text-base font-light leading-relaxed text-[#D8D5CD]/80 sm:text-[17px] sm:leading-8">
              <p>
                Soy <strong className="font-medium text-[#D8D5CD]">Javier Espinosa Martínez</strong>,
                fotógrafo español especializado en fotografía de naturaleza salvaje,
                automovilismo de competición, arquitectura vernácula y narrativa
                documental. Concibo la cámara como un instrumento de observación
                paciente donde el respeto por la realidad prima sobre cualquier
                manipulación.
              </p>
              <p>
                Mi trabajo habita en la tensión entre dos ritmos opuestos: la
                quietud absoluta frente a la fauna ibérica a 600 milímetros y la
                adrenalina milimétrica a pie de cuneta en un tramo de rally, o el
                recorrido pausado por la piedra centenaria de{" "}
                <Link
                  href="/projects/villanueva-de-la-vera"
                  className="underline decoration-[#95836B]/60 underline-offset-4 transition hover:text-white"
                >
                  Villanueva de la Vera
                </Link>{" "}
                y las dunas del{" "}
                <Link
                  href="/projects/ecos-del-sahara"
                  className="underline decoration-[#95836B]/60 underline-offset-4 transition hover:text-white"
                >
                  Sahara
                </Link>
                .
              </p>
            </div>

            {/* Interactive Viewfinder Perspective Switcher */}
            <div className="mt-10 border border-[#1D2021] bg-[#141617]/50 p-5 sm:p-6">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#1D2021] pb-3.5">
                <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-[#95836B]">
                  Explorar Facetas en el Visor →
                </span>
                <button
                  type="button"
                  onClick={() => setHudEnabled((v) => !v)}
                  className={`border px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.2em] transition ${
                    hudEnabled
                      ? "border-[#95836B] bg-[#95836B]/15 text-[#D8D5CD]"
                      : "border-[#1D2021] text-neutral-500 hover:text-[#D8D5CD]"
                  }`}
                >
                  HUD Óptico: {hudEnabled ? "Activo" : "Oculto"}
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
                          ? "border-[#95836B] bg-[#1D2021]/90 text-white"
                          : "border-[#1D2021] bg-[#101112]/70 text-[#D8D5CD]/70 hover:border-[#95836B]/50 hover:text-[#D8D5CD]"
                      }`}
                    >
                      <span className="font-mono text-[9px] tracking-[0.2em] text-[#95836B]">
                        {slide.code}
                      </span>
                      <span className="mt-2 font-serif text-sm leading-snug">
                        {slide.label}
                      </span>
                    </button>
                  );
                })}
              </div>

              <p className="mt-4 text-xs font-light italic leading-relaxed text-[#D8D5CD]/75">
                {currentSlide.note}
              </p>
            </div>

            {/* Primary Actions */}
            <div className="mt-9 flex flex-wrap items-center gap-4 print:hidden">
              <Link
                href="/portfolio"
                className="inline-flex items-center gap-3 border border-[#D8D5CD] bg-[#D8D5CD] px-7 py-3.5 text-xs font-semibold uppercase tracking-[0.28em] text-[#101112] transition hover:bg-transparent hover:text-white"
              >
                <span>Explorar Archivo (100 Obras)</span>
                <span>→</span>
              </Link>
              <Link
                href="/projects"
                className="inline-flex items-center gap-2 border border-[#1D2021] bg-[#1D2021]/60 px-7 py-3.5 text-xs uppercase tracking-[0.28em] text-[#D8D5CD] transition hover:border-[#95836B] hover:text-white"
              >
                <span>8 Series Documentales</span>
              </Link>
              <button
                type="button"
                onClick={() => window.print()}
                className="inline-flex items-center gap-2 border border-[#95836B]/60 bg-[#101112] px-5 py-3.5 font-mono text-[10px] uppercase tracking-[0.24em] text-[#D8D5CD] transition hover:border-[#D8D5CD] hover:text-white"
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
              <div className="relative aspect-[4/5] w-full overflow-hidden border border-[#1D2021] bg-[#141617] shadow-[0_25px_70px_rgba(0,0,0,0.75)]">
                <Image
                  key={currentSlide.image}
                  src={currentSlide.image}
                  alt={currentSlide.title}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 42vw"
                  className="object-cover transition-all duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#101112] via-[#101112]/20 to-transparent" />

                {/* Optional Canon EOS R7 Optical Viewfinder HUD Overlay */}
                {hudEnabled && (
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-5 flex flex-col justify-between border border-[#D8D5CD]/15 p-4 transition-opacity duration-500"
                  >
                    {/* Top Viewfinder Telemetry */}
                    <div className="flex items-center justify-between font-mono text-[9px] uppercase tracking-[0.25em] text-[#D8D5CD]/80">
                      <span className="flex items-center gap-1.5 bg-[#101112]/70 px-2 py-0.5 backdrop-blur-sm">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                        AF-SERVO · RAW
                      </span>
                      <span className="bg-[#101112]/70 px-2 py-0.5 text-[#95836B] backdrop-blur-sm">
                        {currentSlide.code}
                      </span>
                    </div>

                    {/* Center AF Reticle Brackets */}
                    <div className="relative mx-auto flex h-20 w-20 items-center justify-center">
                      <span className="absolute top-0 left-0 h-3 w-3 border-t border-l border-[#95836B]" />
                      <span className="absolute top-0 right-0 h-3 w-3 border-t border-r border-[#95836B]" />
                      <span className="absolute bottom-0 left-0 h-3 w-3 border-b border-l border-[#95836B]" />
                      <span className="absolute right-0 bottom-0 h-3 w-3 border-r border-b border-[#95836B]" />
                      <span className="h-1 w-1 rounded-full bg-[#95836B]/80" />
                    </div>

                    {/* Bottom Viewfinder Caption & EXIF */}
                    <div className="space-y-1 bg-[#101112]/80 p-3.5 backdrop-blur-md border border-[#1D2021]">
                      <div className="flex items-center justify-between font-mono text-[9px] uppercase tracking-[0.22em] text-[#95836B]">
                        <span>{currentSlide.location}</span>
                        <span>[32.5 MP]</span>
                      </div>
                      <p className="font-serif text-xl text-[#D8D5CD]">
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
              <div className="mt-4 flex items-center justify-between gap-4 border border-[#1D2021] bg-[#141617]/90 p-3.5 backdrop-blur-md">
                <div className="flex items-center gap-3.5">
                  <div className="relative h-14 w-20 shrink-0 overflow-hidden border border-[#1D2021] bg-[#101112]">
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
                    <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-[#95836B]">
                      Plano Complementario
                    </span>
                    <p className="font-serif text-base text-[#D8D5CD]">
                      {currentSlide.secondaryCaption}
                    </p>
                  </div>
                </div>
                <div className="hidden pr-2 font-mono text-[10px] text-neutral-500 sm:block">
                  0{activeSlideIndex + 1} / 04
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          2. ARCHITECTURAL ARCHIVE METRICS STRIP
      ===================================================================== */}
      <section className="grid grid-cols-2 border-y border-[#1D2021] bg-[#0D0E0F]/80 sm:grid-cols-5">
        {[
          { value: "100", label: "Obras Catalogadas", sub: "Edición Verificada" },
          { value: "08", label: "Series Narrativas", sub: "Ensayos de Campo" },
          { value: "10–600", label: "Milímetros de Rango", sub: "Cobertura Óptica" },
          { value: "32.5 MP", label: "Resolución Nativa", sub: "Canon EOS R7 RAW" },
          { value: "ISO 9706", label: "Calidad Museo", sub: "Papel 100% Algodón" },
        ].map((stat, i) => (
          <div
            key={stat.label}
            className={`p-6 sm:p-8 ${
              i !== 0 ? "border-l border-[#1D2021]" : ""
            } ${i >= 2 ? "border-t border-[#1D2021] sm:border-t-0" : ""}`}
          >
            <p className="font-serif text-3xl font-light text-[#D8D5CD] sm:text-4xl">
              {stat.value}
            </p>
            <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.24em] text-[#95836B]">
              {stat.label}
            </p>
            <p className="mt-1 text-[11px] text-neutral-500">{stat.sub}</p>
          </div>
        ))}
      </section>

      {/* =====================================================================
          3. INTERACTIVE EXPANDING GALLERY CURTAIN: LAS CUATRO MIRADAS
      ===================================================================== */}
      <section>
        <div className="flex flex-col justify-between gap-4 border-b border-[#1D2021] pb-6 sm:flex-row sm:items-end">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.35em] text-[#95836B]">
              Territorios de Práctica
            </p>
            <h2 className="mt-2 font-serif text-3xl font-light text-[#D8D5CD] sm:text-5xl">
              Las cuatro miradas del archivo
            </h2>
          </div>
          <p className="font-mono text-[11px] text-[#95836B]">
            Pasa el cursor o selecciona cada disciplina para desplegar su enfoque →
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
                    ? "min-h-[380px] border-[#95836B]/80 lg:flex-[2.7]"
                    : "min-h-[130px] border-[#1D2021] opacity-80 hover:opacity-100 lg:flex-1"
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
                    <span className="font-serif text-2xl italic text-[#95836B] sm:text-3xl">
                      {item.roman}.
                    </span>
                    <span className="border border-[#1D2021] bg-[#101112]/80 px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.22em] text-[#D8D5CD]">
                      {item.code}
                    </span>
                  </div>

                  {/* Bottom Content */}
                  <div className="mt-8">
                    <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#95836B]">
                      {item.subtitle}
                    </p>
                    <h3 className="mt-1 font-serif text-2xl text-[#D8D5CD] sm:text-3xl">
                      {item.title}
                    </h3>

                    {isExpanded && (
                      <div className="mt-4 space-y-4">
                        <p className="max-w-xl text-sm font-light leading-relaxed text-[#D8D5CD]/85">
                          {item.description}
                        </p>
                        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-[#D8D5CD]/15 pt-4">
                          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#95836B]">
                            {item.telemetry}
                          </span>
                          <Link
                            href={item.href}
                            onClick={(e) => e.stopPropagation()}
                            className="inline-flex items-center gap-2 border border-[#D8D5CD] bg-[#D8D5CD] px-4 py-1.5 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#101112] transition hover:bg-transparent hover:text-white"
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
      <section className="border-t border-[#1D2021] pt-20">
        <div className="flex flex-col justify-between gap-4 border-b border-[#1D2021] pb-6 sm:flex-row sm:items-end">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.35em] text-[#95836B]">
              Ingeniería & Transparencia EXIF
            </p>
            <h2 className="mt-2 font-serif text-3xl font-light text-[#D8D5CD] sm:text-5xl">
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
                      ? "border-[#95836B] bg-[#1D2021]/70 text-white"
                      : "border-[#1D2021] bg-[#141617]/40 text-[#D8D5CD]/75 hover:border-[#95836B]/50 hover:bg-[#1D2021]/30"
                  }`}
                >
                  <div className="flex items-center justify-between font-mono text-[9px] uppercase tracking-[0.26em] text-[#95836B]">
                    <span>{gear.tag}</span>
                    <span>{gear.focalRange}</span>
                  </div>
                  <h3 className="mt-2 font-serif text-xl text-[#D8D5CD] group-hover:text-white">
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
          <div className="flex flex-col justify-between border border-[#1D2021] bg-[#141617]/40 p-6 sm:p-9 lg:col-span-7">
            <div>
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#1D2021] pb-5">
                <div>
                  <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-[#95836B]">
                    {currentGear.tag}
                  </span>
                  <h3 className="mt-1 font-serif text-2xl text-[#D8D5CD] sm:text-3xl">
                    {currentGear.name}
                  </h3>
                </div>

                {/* Live Optical Cone SVG Diagram */}
                <div className="flex items-center gap-3 border border-[#1D2021] bg-[#101112] px-4 py-2">
                  <svg
                    viewBox="0 0 80 44"
                    className="h-9 w-16 text-[#95836B]"
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
                      stroke="#1D2021"
                      strokeWidth="1"
                      strokeDasharray="2 2"
                    />
                    <line
                      x1="8"
                      y1="22"
                      x2="74"
                      y2="40"
                      stroke="#1D2021"
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
                    <span className="text-[#D8D5CD]">
                      ~{currentGear.angleDeg}° FOV
                    </span>
                  </div>
                </div>
              </div>

              <p className="mt-5 text-sm font-light leading-relaxed text-[#D8D5CD]/85 sm:text-base">
                {currentGear.role}
              </p>

              <ul className="mt-5 space-y-2.5 border-l border-[#95836B]/50 pl-4 text-xs font-light text-[#D8D5CD]/80">
                {currentGear.highlights.map((h) => (
                  <li key={h} className="leading-relaxed">
                    {h}
                  </li>
                ))}
              </ul>
            </div>

            {/* 3 Real Works Captured With This Gear */}
            <div className="mt-8 border-t border-[#1D2021] pt-6">
              <div className="mb-3 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.25em] text-[#95836B]">
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
                    className="group relative block overflow-hidden border border-[#1D2021] bg-[#101112]"
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
                      <p className="truncate font-serif text-sm text-[#D8D5CD] group-hover:text-white">
                        {photo.title}
                      </p>
                      <p className="font-mono text-[9px] text-[#95836B]">
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

      {/* =====================================================================
          5. OFFICIAL INTERNATIONAL PLATFORMS & ETHICAL PILLARS
      ===================================================================== */}
      <section className="grid grid-cols-1 gap-12 border-t border-[#1D2021] pt-20 lg:grid-cols-12">
        {/* Left: Ethical Manifesto in Numbered Editorial Format */}
        <div className="lg:col-span-6">
          <p className="font-mono text-xs uppercase tracking-[0.35em] text-[#95836B]">
            Código Deontológico
          </p>
          <h2 className="mt-2 font-serif text-3xl font-light text-[#D8D5CD] sm:text-4xl">
            Tres principios innegociables
          </h2>

          <div className="mt-8 divide-y divide-[#1D2021] border-y border-[#1D2021]">
            {[
              {
                num: "01",
                title: "Luz Natural Exclusiva",
                desc: "Ninguna obra recurre a iluminación artificial invasiva. La penumbra del alba, la calima del desierto o los faros reales de un coche de competición dictan la atmósfera.",
              },
              {
                num: "02",
                title: "Integridad Documental (Cero IA)",
                desc: "El archivo está libre de elementos generados o alterados mediante inteligencia artificial. Cada textura procede directamente del sensor RAW y del instante vivido.",
              },
              {
                num: "03",
                title: "Respeto Absoluto al Hábitat",
                desc: "En fotografía de naturaleza jamás se emplean reclamos agresivos ni se perturba la cría o el descanso de las especies observadas.",
              },
            ].map((pillar) => (
              <div key={pillar.num} className="flex gap-5 py-6">
                <span className="font-mono text-xs text-[#95836B]">
                  /{pillar.num}
                </span>
                <div>
                  <h3 className="font-serif text-xl text-[#D8D5CD]">
                    {pillar.title}
                  </h3>
                  <p className="mt-2 text-xs font-light leading-relaxed text-[#D8D5CD]/75 sm:text-sm">
                    {pillar.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Official International Representation Cards */}
        <div className="lg:col-span-6">
          <p className="font-mono text-xs uppercase tracking-[0.35em] text-[#95836B]">
            Presencia & Adquisición Global
          </p>
          <h2 className="mt-2 font-serif text-3xl font-light text-[#D8D5CD] sm:text-4xl">
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
                className="group relative block overflow-hidden border border-[#1D2021] bg-[#141617]/50 p-6 transition-all duration-300 hover:border-[#95836B] hover:bg-[#1D2021]/60"
              >
                <div className="flex items-center justify-between font-mono text-[9px] uppercase tracking-[0.26em] text-[#95836B]">
                  <span>{plat.badge}</span>
                  <span className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-0.5">
                    ↗
                  </span>
                </div>
                <div className="mt-2 flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="font-serif text-2xl text-[#D8D5CD] group-hover:text-white">
                    {plat.title}
                  </h3>
                  <span className="font-mono text-[10px] text-neutral-500">
                    {plat.subtitle}
                  </span>
                </div>
                <p className="mt-2.5 text-xs font-light leading-relaxed text-[#D8D5CD]/75">
                  {plat.desc}
                </p>
                <span className="mt-4 inline-block font-mono text-[10px] uppercase tracking-[0.22em] text-[#D8D5CD] underline decoration-[#95836B]/60 underline-offset-4 group-hover:text-white">
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
      <section className="relative overflow-hidden border border-[#1D2021] bg-[#141617]/40 p-8 sm:p-14">
        <div className="relative z-10 flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
          <div className="max-w-2xl">
            <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-[#95836B]">
              Contacto Directo & Comisiones
            </p>
            <h2 className="mt-2 font-serif text-3xl font-light text-[#D8D5CD] sm:text-4xl">
              ¿Deseas encargar un reportaje, licenciar una imagen o adquirir obra firmada?
            </h2>
            <p className="mt-3 text-sm font-light leading-relaxed text-[#D8D5CD]/80">
              Disponible para proyectos editoriales, cobertura de eventos de automoción,
              arquitectura e impresiones Fine Art a medida en España e internacionalmente.
            </p>
          </div>

          <div className="flex flex-wrap gap-4">
            <Link
              href="/contact"
              className="inline-flex border border-[#D8D5CD] bg-[#D8D5CD] px-8 py-3.5 text-xs font-semibold uppercase tracking-[0.28em] text-[#101112] transition hover:bg-transparent hover:text-white"
            >
              Iniciar Conversación
            </Link>
            <Link
              href="/prints"
              className="inline-flex border border-[#1D2021] bg-[#101112] px-7 py-3.5 text-xs uppercase tracking-[0.25em] text-[#D8D5CD] transition hover:border-[#95836B] hover:text-white"
            >
              Simulador Fine Art
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
