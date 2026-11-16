import Image from "next/image";
import Link from "next/link";
import Container from "@/components/ui/Container";

export default function AboutPreview() {
  return (
    <section className="bg-black py-28 md:py-36 border-t border-neutral-900">
      <Container>
        <div className="grid gap-16 lg:grid-cols-12 items-center">
          <div className="lg:col-span-5">
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-sm border border-neutral-800 bg-neutral-900">
              <Image
                src="/images/portfolio/fauna-naturaleza/B51A8662.jpg"
                alt="Fotografía de naturaleza por Javier Espinosa Martínez"
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-xs font-mono text-neutral-300">
                <span className="text-neutral-500 uppercase tracking-widest block text-[10px]">Filosofía</span>
                &ldquo;El instante decisivo donde la luz y la memoria confluyen.&rdquo;
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 lg:pl-8">
            <p className="text-xs font-mono uppercase tracking-[0.4em] text-neutral-500">
              Declaración de Autor
            </p>
            <h2 className="mt-4 font-serif text-4xl font-light leading-tight text-neutral-100 md:text-5xl">
              Detrás de cada imagen,
              <br />
              <span className="italic text-neutral-400">existe una mirada propia.</span>
            </h2>

            <div className="mt-8 space-y-6 text-base font-light leading-relaxed text-neutral-300">
              <p>
                Soy Javier Espinosa Martínez, fotógrafo español. Concibo la fotografía no como un ejercicio
                de artificio, sino como un acto de paciencia y respeto por lo observado: la vibración de una curva
                en el rally histórico, la dignidad silenciosa de un artesano, o la silueta de un animal salvaje
                en su hábitat.
              </p>
              <p>
                Trabajo con luz natural disponible, sin filtros que desvirtúen la verdad cromática de la escena.
                Cada imagen es el resultado de esperar el momento en que la atmósfera, la composición y la emoción
                se equilibran de forma inevitable.
              </p>
            </div>

            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                href="/about"
                className="inline-flex items-center justify-center border border-neutral-200 bg-neutral-100 px-8 py-3.5 text-xs font-mono uppercase tracking-[0.25em] text-neutral-950 font-medium transition hover:bg-white hover:text-black hover:border-white"
              >
                Conocer al Autor
              </Link>
              <Link
                href="/servicios"
                className="inline-flex items-center justify-center border border-neutral-700 bg-neutral-900/60 px-8 py-3.5 text-xs font-mono uppercase tracking-[0.25em] text-neutral-200 transition hover:border-neutral-400 hover:text-white"
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
