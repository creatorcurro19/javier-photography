import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative min-h-[92vh] sm:min-h-screen bg-black overflow-hidden flex items-center justify-center">
      <Image
        src="/images/portfolio/viajes-cultura/hero.jpg"
        alt="Siluetas en la cresta al atardecer — Fotografía de Javier Espinosa Martínez"
        fill
        priority
        sizes="100vw"
        className="object-cover object-center brightness-90 contrast-105"
      />
      <div
        className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/60"
        aria-hidden="true"
      />

      <div className="relative z-10 flex min-h-[92vh] sm:min-h-screen w-full max-w-7xl mx-auto flex-col items-center justify-center px-6 sm:px-10 md:px-16 lg:px-20 xl:px-24 text-center text-neutral-300">
        <p className="mb-6 text-[11px] font-mono uppercase tracking-[0.5em] text-neutral-400">
          Fotografía de Autor · España
        </p>

        <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-extralight tracking-tight text-neutral-100">
          Javier Espinosa
        </h1>

        <nav aria-label="Acceso directo a colecciones" className="mt-8 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs font-mono uppercase tracking-[0.25em] text-neutral-400 max-w-2xl">
          <Link href="/portfolio/fauna-naturaleza" className="hover:text-neutral-100 transition">Fauna y Naturaleza</Link>
          <span className="text-neutral-600" aria-hidden="true">·</span>
          <Link href="/portfolio/paisajes-documental" className="hover:text-neutral-100 transition">Paisajes y Documental</Link>
          <span className="text-neutral-600" aria-hidden="true">·</span>
          <Link href="/portfolio/coches-rally" className="hover:text-neutral-100 transition">Coches y Rally</Link>
          <span className="text-neutral-600" aria-hidden="true">·</span>
          <Link href="/portfolio/arquitectura-urbana" className="hover:text-neutral-100 transition">Arquitectura Urbana</Link>
          <span className="text-neutral-600" aria-hidden="true">·</span>
          <Link href="/portfolio/viajes-cultura" className="hover:text-neutral-100 transition">Viajes y Cultura</Link>
        </nav>

        <p className="mt-6 max-w-xl text-base font-light text-neutral-300 leading-relaxed hidden sm:block">
          La belleza de lo cotidiano, la tensión del instante decisivo y la paciente observación documental.
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/portfolio"
            className="inline-flex items-center justify-center border border-neutral-200 bg-neutral-100 px-8 py-4 text-xs font-mono uppercase tracking-[0.3em] text-neutral-950 font-medium transition duration-300 hover:bg-transparent hover:text-white hover:border-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
          >
            Ver Colecciones
          </Link>
          <Link
            href="/servicios"
            className="inline-flex items-center justify-center border border-neutral-700 bg-black/60 px-8 py-4 text-xs font-mono uppercase tracking-[0.3em] text-neutral-200 backdrop-blur-sm transition duration-300 hover:border-neutral-400 hover:bg-black/90 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
          >
            Encargos y Proyectos
          </Link>
        </div>

        {/* Scroll Indicator */}
        <a
          href="#colecciones"
          aria-label="Desplazarse a colecciones"
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-70 hover:opacity-100 transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
        >
          <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-neutral-400">
            Explorar
          </span>
          <div className="h-8 w-px bg-gradient-to-b from-neutral-400 to-transparent" />
        </a>
      </div>
    </section>
  );
}
