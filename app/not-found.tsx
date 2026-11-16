import Link from "next/link";
import Container from "@/components/ui/Container";

export default function NotFound() {
  return (
    <div className="flex min-h-[75vh] items-center bg-black pt-36 pb-20 text-neutral-300">
      <Container className="max-w-2xl text-center">
        <p className="text-xs uppercase tracking-[0.5em] text-neutral-400">Error 404</p>
        <h1 className="mt-4 font-serif text-4xl font-light text-neutral-100 sm:text-5xl">
          Contenido no encontrado
        </h1>
        <p className="mt-6 text-sm leading-relaxed text-neutral-300 sm:text-base">
          La fotografía, serie o recurso que está buscando no existe o ha sido reubicada en el archivo.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Link
            href="/portfolio"
            className="inline-flex border border-neutral-200 bg-neutral-100 px-8 py-3.5 text-xs uppercase tracking-[0.3em] text-neutral-950 font-medium transition hover:bg-white hover:text-black hover:border-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
          >
            Volver al Portfolio
          </Link>
          <Link
            href="/"
            className="inline-flex border border-neutral-700 bg-neutral-900/60 px-8 py-3.5 text-xs uppercase tracking-[0.3em] text-neutral-200 transition hover:border-neutral-400 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
          >
            Ir a Inicio
          </Link>
        </div>
      </Container>
    </div>
  );
}
