import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative min-h-[95vh] sm:min-h-screen bg-[#101112] overflow-hidden flex items-center justify-center">
      <Image
        src="/images/portfolio/viajes-cultura/hero.jpg"
        alt="Siluetas en la cresta al atardecer — Fotografía de autor por Javier Espinosa Martínez"
        fill
        priority
        sizes="100vw"
        className="object-cover object-center brightness-[0.88] contrast-[1.04]"
      />
      <div
        className="absolute inset-0 bg-gradient-to-t from-[#101112] via-[#101112]/45 to-black/60"
        aria-hidden="true"
      />

      <div className="relative z-10 flex min-h-[95vh] sm:min-h-screen w-full max-w-7xl mx-auto flex-col items-center justify-center px-6 sm:px-10 md:px-16 lg:px-20 xl:px-24 text-center text-[#D8D5CD]">
        <p className="mb-4 text-[10px] sm:text-xs font-mono uppercase tracking-[0.45em] text-[#95836B]">
          Fotografía de Autor · España
        </p>

        <h1 className="font-serif text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-light tracking-[0.04em] text-[#D8D5CD]">
          Javier Espinosa
        </h1>

        <p className="mt-4 font-mono text-xs uppercase tracking-[0.3em] text-neutral-400">
          Landscapes · Wildlife · Architecture · Motorsport · Documentary
        </p>

        <p className="mt-6 max-w-xl text-base sm:text-lg font-light text-[#D8D5CD]/80 leading-relaxed hidden sm:block">
          La luz natural como guía, el rigor geométrico del espacio y la paciente observación documental del instante decisivo.
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/portfolio"
            className="inline-flex items-center justify-center border border-[#D8D5CD] bg-[#D8D5CD] px-8 py-3.5 text-xs font-mono uppercase tracking-[0.3em] text-[#101112] font-semibold transition duration-300 hover:bg-transparent hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
          >
            Ver Colecciones
          </Link>
          <Link
            href="/projects"
            className="inline-flex items-center justify-center border border-neutral-700 bg-[#101112]/70 px-8 py-3.5 text-xs font-mono uppercase tracking-[0.3em] text-[#D8D5CD] backdrop-blur-sm transition duration-300 hover:border-[#D8D5CD] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
          >
            Proyectos Narrativos
          </Link>
        </div>

        {/* Scroll Indicator */}
        <a
          href="#colecciones"
          aria-label="Desplazarse a colecciones"
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-70 hover:opacity-100 transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
        >
          <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-[#95836B]">
            Explorar
          </span>
          <div className="h-8 w-px bg-gradient-to-b from-[#95836B] to-transparent" />
        </a>
      </div>
    </section>
  );
}
