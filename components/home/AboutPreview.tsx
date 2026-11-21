import Image from "next/image";
import Link from "next/link";
import Container from "@/components/ui/Container";

export default function AboutPreview() {
  return (
    <section
      id="sobre-mi"
      className="bg-[#0B0C0E] py-24 sm:py-32 border-t border-white/[0.08]"
      aria-label="Sobre mí — Javier Espinosa Martínez"
    >
      <Container>
        <div className="grid gap-12 lg:gap-16 lg:grid-cols-12 items-center">
          {/* Retrato del Autor */}
          <div className="lg:col-span-5">
            <div className="relative aspect-[4/5] w-full overflow-hidden border border-white/[0.12] bg-[#151618] shadow-[0_20px_60px_rgba(0,0,0,0.6)]">
              <Image
                src="/images/portfolio/hero/hero.jpg"
                alt="Retrato y trabajo de campo de Javier Espinosa Martínez en Tenerife"
                fill
                sizes="(max-width: 1024px) 100vw, 42vw"
                className="object-cover brightness-[0.92] contrast-[1.04]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B0C0E]/85 via-transparent to-transparent pointer-events-none" />

              <div className="absolute bottom-4 left-5 right-5 flex flex-col gap-1 font-mono text-[10px] text-[#EBE7DF]">
                <span className="bg-[#0B0C0E]/90 px-2.5 py-1 border border-white/[0.1] uppercase tracking-wider">
                  Javier Espinosa Martínez · Tenerife
                </span>
                <span className="bg-[#0B0C0E]/90 px-2.5 py-1 border border-[#C5A880]/30 text-[#C5A880]">
                  {"{{DATO_PENDIENTE: sustituir por retrato personal de Javier Espinosa con cámara}}"}
                </span>
              </div>
            </div>
          </div>

          {/* Bio y Filosofía de Trabajo */}
          <div className="lg:col-span-7 lg:pl-4">
            <div className="flex items-center gap-3">
              <span className="h-px w-6 bg-white/30" />
              <p className="font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.4em] text-[#C5A880]">
                Sobre mí · Observar antes de disparar
              </p>
            </div>

            <h2 className="mt-3 font-serif text-3xl sm:text-4xl lg:text-5xl font-light text-[#EBE7DF] tracking-tight">
              Javier Espinosa Martínez
            </h2>

            <blockquote className="mt-6 border-l-2 border-[#C5A880]/60 pl-5 font-serif text-lg sm:text-xl font-light italic leading-relaxed text-[#EBE7DF]/90">
              &ldquo;La fotografía no tiene que demostrar constantemente lo impresionante que es el mundo. A veces basta con detenerse a observarlo.&rdquo;
            </blockquote>

            <p className="mt-6 text-sm sm:text-base font-light leading-relaxed text-[#A39E93]">
              Trabajo desde Tenerife (Islas Canarias) en cinco ámbitos que comparten una misma forma de mirar: fauna y naturaleza a 600mm, paisaje volcánico y desértico, automovilismo clásico y rally, arquitectura con huella del tiempo y fotografía documental de oficios. Siempre con luz natural disponible y sin alterar la escena.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                href="/about"
                className="group inline-flex min-h-[44px] items-center gap-2 border border-[#EBE7DF] bg-[#EBE7DF] px-7 py-3 text-[11px] font-mono uppercase tracking-[0.24em] font-semibold text-[#0B0C0E] transition-all duration-300 hover:bg-transparent hover:text-white"
              >
                <span>Biografía y Equipo</span>
                <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
              </Link>
              <Link
                href="/contact"
                className="inline-flex min-h-[44px] items-center gap-2 border border-white/20 bg-transparent px-7 py-3 text-[11px] font-mono uppercase tracking-[0.24em] text-[#EBE7DF] transition-all duration-300 hover:border-white/50 hover:text-white"
              >
                Contacto Directo
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
