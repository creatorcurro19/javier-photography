import Image from "next/image";
import Link from "next/link";
import Container from "@/components/ui/Container";

export default function AboutPreview() {
  return (
    <section className="bg-[#101112] py-24 sm:py-32 border-t border-[#1D2021]">
      <Container>
        <div className="grid gap-12 lg:grid-cols-12 items-center">
          {/* Left: Singular Clean Exhibition Frame */}
          <div className="lg:col-span-5">
            <div className="relative aspect-[4/5] w-full overflow-hidden border border-[#1D2021] bg-[#141617]">
              <Image
                src="/images/portfolio/fauna-naturaleza/B51A8662.jpg"
                alt="Descenso en la Roca — Fotografía de fauna salvaje por Javier Espinosa Martínez"
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#101112]/75 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-5 right-5 flex items-center justify-between font-mono text-[9px] uppercase tracking-widest text-[#95836B]">
                <span>Descenso en la Roca</span>
                <span>Canon EOS R7 · 600mm</span>
              </div>
            </div>
          </div>

          {/* Right: Author Statement & Representation */}
          <div className="lg:col-span-7 lg:pl-6">
            <p className="text-[10px] uppercase tracking-[0.35em] text-[#95836B]">
              El Autor
            </p>
            <h2 className="mt-2 text-3xl sm:text-4xl lg:text-5xl font-light tracking-tight text-[#D8D5CD]">
              Javier Espinosa Martínez
            </h2>

            <blockquote className="mt-6 border-l-2 border-[#95836B]/60 pl-5 font-serif text-lg sm:text-xl font-light italic leading-relaxed text-[#D8D5CD]/90">
              &ldquo;Concibo la fotografía como un acto de paciencia y respeto por lo observado: la luz natural sin artificio, la verdad geométrica del espacio y el instante en que la memoria se hace tangible.&rdquo;
            </blockquote>

            <p className="mt-6 text-sm sm:text-base font-light leading-relaxed text-[#D8D5CD]/75">
              Fotógrafo español especializado en fauna salvaje, paisaje documental, automovilismo clásico y patrimonio etnográfico.
              Trabajo exclusivamente con luz natural disponible y rigor óptico, documentando la verdad del instante sin manipulaciones generativas.
            </p>

            {/* Verified Representation */}
            <div className="mt-8 flex flex-wrap items-center gap-3 border-y border-[#1D2021] py-4 text-[10px] uppercase tracking-[0.22em]">
              <span className="text-[#95836B]">Perfiles:</span>
              <a
                href="https://www.saatchiart.com/javier-espinosa-photography"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#D8D5CD] transition hover:text-[#95836B]"
              >
                Saatchi Art ↗
              </a>
              <span className="text-neutral-700">·</span>
              <a
                href="https://www.istockphoto.com/portfolio/JavierEspinosa?sort=purerecency&assettype=image"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#D8D5CD] transition hover:text-[#95836B]"
              >
                Getty / iStock ↗
              </a>
              <span className="text-neutral-700">·</span>
              <a
                href="https://www.instagram.com/Javier.espinosa19/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#D8D5CD] transition hover:text-[#95836B]"
              >
                Instagram ↗
              </a>
            </div>

            <div className="mt-8">
              <Link
                href="/about"
                className="inline-flex items-center gap-2 border border-[#D8D5CD] bg-[#D8D5CD] px-7 py-3 text-[11px] uppercase tracking-[0.24em] font-medium text-[#101112] transition hover:bg-transparent hover:text-white"
              >
                <span>Conocer al Autor</span>
                <span>→</span>
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
