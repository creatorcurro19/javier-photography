import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative min-h-svh w-full bg-[#101112] overflow-hidden flex items-center justify-center">
      {/* Imagen horizontal panorámica para escritorio y pantallas panorámicas */}
      <Image
        src="/images/portfolio/viajes-cultura/B51A7341.jpg"
        alt="Siluetas en las dunas del desierto al atardecer — Fotografía de autor por Javier Espinosa Martínez"
        fill
        priority
        sizes="100vw"
        className="hidden sm:block object-cover object-[center_38%] brightness-[0.96] contrast-[1.04]"
      />
      {/* Imagen vertical nativa para pantallas móviles */}
      <Image
        src="/images/portfolio/viajes-cultura/B51A7340.jpg"
        alt="Siluetas en las dunas del desierto al atardecer — Fotografía de autor por Javier Espinosa Martínez"
        fill
        priority
        sizes="100vw"
        className="block sm:hidden object-cover object-center brightness-[0.95] contrast-[1.04]"
      />
      <div
        className="absolute inset-0 bg-gradient-to-b from-[#101112]/40 via-[#101112]/25 to-[#101112]"
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto flex min-h-svh w-full max-w-6xl flex-col items-center justify-center px-6 pt-28 pb-24 sm:px-12 md:px-16 lg:px-20 text-center text-[#D8D5CD]">
        <p className="mb-6 text-[11px] sm:text-xs uppercase tracking-[0.45em] text-[#D8D5CD] drop-shadow-[0_1px_8px_rgba(0,0,0,0.6)] font-normal">
          Fotografía de Autor · España
        </p>

        <h1 className="font-serif text-5xl sm:text-7xl md:text-8xl lg:text-[6.5rem] font-light tracking-[0.05em] leading-[1.08] text-[#D8D5CD] drop-shadow-[0_4px_24px_rgba(0,0,0,0.65)]">
          Javier Espinosa
        </h1>

        <p className="mt-6 text-[11px] sm:text-xs uppercase tracking-[0.32em] text-[#D8D5CD]/90 drop-shadow-[0_1px_8px_rgba(0,0,0,0.6)] font-light">
          Landscapes · Wildlife · Architecture · Motorsport · Documentary
        </p>

        <p className="mt-8 max-w-2xl text-base sm:text-lg font-light text-[#D8D5CD]/90 leading-relaxed drop-shadow-[0_2px_10px_rgba(0,0,0,0.65)]">
          La luz natural como guía, el rigor geométrico del espacio y la paciente observación documental del instante decisivo.
        </p>

        <div className="mt-12 flex flex-wrap items-center justify-center gap-5">
          <Link
            href="/portfolio"
            className="inline-flex items-center justify-center border border-[#D8D5CD] bg-[#D8D5CD] px-9 py-4 text-xs uppercase tracking-[0.28em] text-[#101112] font-medium transition duration-300 hover:bg-transparent hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
          >
            Ver Colecciones
          </Link>
          <Link
            href="/projects"
            className="inline-flex items-center justify-center border border-[#D8D5CD]/40 bg-[#101112]/65 px-9 py-4 text-xs uppercase tracking-[0.28em] text-[#D8D5CD] backdrop-blur-md transition duration-300 hover:border-[#D8D5CD] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
          >
            Proyectos Narrativos
          </Link>
        </div>

        {/* Scroll Indicator */}
        <a
          href="#colecciones"
          aria-label="Desplazarse a colecciones"
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2.5 opacity-75 hover:opacity-100 transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
        >
          <span className="text-[10px] uppercase tracking-[0.35em] text-[#D8D5CD]/80 font-light">
            Explorar
          </span>
          <div className="h-7 w-px bg-gradient-to-b from-[#D8D5CD]/70 to-transparent" />
        </a>
      </div>
    </section>
  );
}
