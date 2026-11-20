import Image from "next/image";
import Link from "next/link";
import Container from "@/components/ui/Container";
import { getPhotoByImage } from "@/lib/photos";

export default function AboutPreview() {
  const artwork = getPhotoByImage("/images/portfolio/fauna-naturaleza/descenso-en-la-roca.jpg");

  return (
    <section
      id="autor"
      className="bg-[#0B0C0E] py-28 sm:py-36 border-t border-white/[0.08]"
      aria-label="El Autor y Manifiesto"
    >
      <Container>
        <div className="grid gap-12 lg:gap-16 lg:grid-cols-12 items-center">
          {/* Left: Singular Exhibition Artwork Frame */}
          <div className="lg:col-span-5">
            <div className="relative aspect-[4/5] w-full overflow-hidden border border-white/[0.1] bg-[#151618] shadow-[0_20px_60px_rgba(0,0,0,0.6)]">
              <Image
                src="/images/portfolio/fauna-naturaleza/descenso-en-la-roca.jpg"
                alt="Descenso en la Roca — Obra de autor por Javier Espinosa Martínez"
                fill
                sizes="(max-width: 1024px) 100vw, 42vw"
                className="object-cover brightness-[0.92] contrast-[1.04]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B0C0E]/80 via-transparent to-transparent pointer-events-none" />
              
              <div className="absolute bottom-4 left-5 right-5 flex items-center justify-between font-mono text-[9px] uppercase tracking-widest text-[#8E8A80]">
                <span className="bg-[#0B0C0E]/85 px-2 py-0.5 border border-white/[0.08]">
                  {artwork?.title ?? "Descenso en la Roca"}
                </span>
                <span className="bg-[#0B0C0E]/85 px-2 py-0.5 border border-white/[0.08]">
                  {artwork?.camera ?? "Canon EOS R7"} · {artwork?.focalLength ?? "35mm"}
                </span>
              </div>
            </div>
          </div>

          {/* Right: Artist Statement & Manifesto */}
          <div className="lg:col-span-7 lg:pl-4">
            <div className="flex items-center gap-3">
              <span className="h-px w-6 bg-white/30" />
              <p className="font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.4em] text-[#8E8A80]">
                Declaración Artística
              </p>
            </div>

            <h2 className="mt-3 font-serif text-3xl sm:text-4xl lg:text-5xl font-light text-[#EBE7DF] tracking-tight">
              Javier Espinosa Martínez
            </h2>

            <div className="mt-2 text-xs font-mono uppercase tracking-[0.3em] text-[#8E8A80]">
              The Art of Seeing · Fotografía de Autor
            </div>

            <blockquote className="mt-8 border-l-2 border-[#EBE7DF]/40 pl-6 font-serif text-lg sm:text-xl font-light italic leading-relaxed text-[#EBE7DF]/90">
              &ldquo;Concibo la fotografía como un acto de paciencia y respeto por lo observado: la luz natural sin artificio, la verdad geométrica del espacio y el instante en que la memoria se hace tangible.&rdquo;
            </blockquote>

            <p className="mt-6 text-sm sm:text-base font-light leading-relaxed text-[#8E8A80]">
              Fotógrafo independiente con base profesional en Tenerife (Islas Canarias), especializado en cinco disciplinas fundamentales: Landscapes, Wildlife, Motorsport, Urban & Architecture y Documentary.
              Trabajo exclusivamente con luz natural disponible y rigor óptico, documentando la verdad del instante sin manipulaciones ni artificios generativos.
            </p>

            {/* Verified Institutional Badges */}
            <div className="mt-8 flex flex-wrap items-center gap-4 border-y border-white/[0.08] py-5 text-[10px] uppercase font-mono tracking-[0.24em]">
              <span className="text-[#8E8A80]">Presencia Oficial:</span>
              <a
                href="https://www.saatchiart.com/javier-espinosa-photography"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#EBE7DF] transition-colors duration-300 hover:text-white underline underline-offset-4 decoration-white/30"
              >
                Saatchi Art ↗
              </a>
              <span className="text-white/20">·</span>
              <a
                href="https://www.istockphoto.com/portfolio/JavierEspinosa?sort=purerecency&assettype=image"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#EBE7DF] transition-colors duration-300 hover:text-white underline underline-offset-4 decoration-white/30"
              >
                Getty Images / iStock ↗
              </a>
              <span className="text-white/20">·</span>
              <a
                href="https://www.instagram.com/Javier.espinosa19/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#EBE7DF] transition-colors duration-300 hover:text-white underline underline-offset-4 decoration-white/30"
              >
                Instagram ↗
              </a>
            </div>

            {/* Actions */}
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                href="/about"
                className="group inline-flex items-center gap-2 border border-[#EBE7DF] bg-[#EBE7DF] px-8 py-3.5 text-[11px] uppercase tracking-[0.26em] font-medium text-[#0B0C0E] transition-all duration-300 hover:bg-transparent hover:text-white"
              >
                <span>Conocer al Autor & Visor Óptico</span>
                <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 border border-white/20 bg-transparent px-8 py-3.5 text-[11px] uppercase tracking-[0.26em] font-light text-[#EBE7DF] transition-all duration-300 hover:border-white/50 hover:text-white"
              >
                Contacto Privado
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
