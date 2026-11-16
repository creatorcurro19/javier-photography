import Image from "next/image";
import Link from "next/link";
import Container from "@/components/ui/Container";

export default function AboutPreview() {
  return (
    <section className="bg-[#101112] py-28 md:py-36 border-t border-[#1D2021]">
      <Container>
        <div className="grid gap-16 lg:grid-cols-12 items-center">
          {/* Left: Overlapped Editorial Diptych Composition */}
          <div className="lg:col-span-5">
            <div className="relative pb-10 sm:pr-10">
              <div className="relative aspect-[4/5] w-full overflow-hidden border border-[#1D2021] bg-[#141617] shadow-2xl">
                <Image
                  src="/images/portfolio/fauna-naturaleza/B51A8662.jpg"
                  alt="Fotografía de naturaleza por Javier Espinosa Martínez"
                  fill
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#101112]/85 via-transparent to-transparent" />
                <div className="absolute top-4 left-4 border border-[#1D2021] bg-[#101112]/85 px-3 py-1 font-mono text-[9px] uppercase tracking-[0.25em] text-[#95836B] backdrop-blur-sm">
                  Canon EOS R7 · 600mm
                </div>
                <div className="absolute bottom-6 left-6 right-6 font-mono text-xs text-[#D8D5CD]">
                  <span className="block text-[10px] uppercase tracking-widest text-[#95836B]">
                    Manifiesto Visual
                  </span>
                  &ldquo;El instante decisivo donde la luz natural y la memoria confluyen.&rdquo;
                </div>
              </div>

              {/* Floating Secondary Overlap Frame */}
              <div className="hidden sm:block absolute -bottom-2 right-0 w-48 overflow-hidden border border-[#95836B]/50 bg-[#101112] p-2 shadow-[0_20px_50px_rgba(0,0,0,0.85)]">
                <div className="relative aspect-[3/2] w-full overflow-hidden">
                  <Image
                    src="/images/portfolio/coches-rally/B51A9718.jpg"
                    alt="Fotografía de rally por Javier Espinosa"
                    fill
                    sizes="192px"
                    className="object-cover"
                  />
                </div>
                <p className="mt-1.5 font-mono text-[9px] uppercase tracking-[0.2em] text-[#95836B]">
                  Tensión Cinética · Rally
                </p>
              </div>
            </div>
          </div>

          {/* Right: Editorial Statement & Official Representation */}
          <div className="lg:col-span-7 lg:pl-8">
            <p className="text-xs font-mono uppercase tracking-[0.4em] text-[#95836B]">
              Declaración de Autor
            </p>
            <h2 className="mt-4 font-serif text-4xl font-light leading-tight text-[#D8D5CD] md:text-5xl">
              Detrás de cada imagen,
              <br />
              <span className="italic text-[#95836B]">existe una mirada propia.</span>
            </h2>

            <div className="mt-8 space-y-6 text-base font-light leading-relaxed text-[#D8D5CD]/80 sm:text-lg">
              <p>
                Soy <strong className="font-medium text-[#D8D5CD]">Javier Espinosa Martínez</strong>,
                fotógrafo español. Concibo la fotografía no como un ejercicio
                de artificio, sino como un acto de paciencia y respeto por lo observado: la vibración de una curva
                en el rally histórico, la dignidad silenciosa de un artesano en La Vera, o la silueta de un animal salvaje
                en su hábitat.
              </p>
              <p>
                Trabajo con luz natural disponible, sin manipulaciones generativas que desvirtúen la verdad cromática de la escena.
                Cada imagen es el resultado de esperar el segundo en que la atmósfera, la composición y la emoción
                se equilibran de forma inevitable.
              </p>
            </div>

            {/* Verified Representation Strip */}
            <div className="mt-8 flex flex-wrap items-center gap-3 border-y border-[#1D2021] py-4 font-mono text-[10px] uppercase tracking-[0.22em]">
              <span className="text-[#95836B]">Perfiles Oficiales:</span>
              <a
                href="https://www.saatchiart.com/javier-espinosa-photography"
                target="_blank"
                rel="noopener noreferrer"
                className="border border-[#1D2021] bg-[#141617] px-3 py-1.5 text-[#D8D5CD] transition hover:border-[#95836B] hover:text-white"
              >
                Saatchi Art ↗
              </a>
              <a
                href="https://www.istockphoto.com/portfolio/JavierEspinosa?sort=purerecency&assettype=image"
                target="_blank"
                rel="noopener noreferrer"
                className="border border-[#1D2021] bg-[#141617] px-3 py-1.5 text-[#D8D5CD] transition hover:border-[#95836B] hover:text-white"
              >
                Getty Images / iStock ↗
              </a>
              <a
                href="https://www.instagram.com/Javier.espinosa19/"
                target="_blank"
                rel="noopener noreferrer"
                className="border border-[#1D2021] bg-[#141617] px-3 py-1.5 text-[#D8D5CD] transition hover:border-[#95836B] hover:text-white"
              >
                @Javier.espinosa19 ↗
              </a>
            </div>

            <div className="mt-9 flex flex-wrap gap-4">
              <Link
                href="/about"
                className="inline-flex items-center justify-center border border-[#D8D5CD] bg-[#D8D5CD] px-8 py-3.5 text-xs font-mono uppercase tracking-[0.25em] text-[#101112] font-semibold transition hover:bg-transparent hover:text-white"
              >
                Explorar Monografía & Equipo
              </Link>
              <Link
                href="/servicios"
                className="inline-flex items-center justify-center border border-[#1D2021] bg-[#1D2021]/60 px-8 py-3.5 text-xs font-mono uppercase tracking-[0.25em] text-[#D8D5CD] transition hover:border-[#95836B] hover:text-white"
              >
                Encargos y Proyectos
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
