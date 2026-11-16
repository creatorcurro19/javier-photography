import Link from "next/link";
import Container from "@/components/ui/Container";

export default function NotFound() {
  return (
    <div className="flex min-h-[85vh] items-center justify-center bg-[#101112] pt-24 pb-20 text-[#D8D5CD]">
      <Container className="text-center max-w-2xl">
        <p className="text-xs uppercase tracking-[0.4em] text-[#95836B]">
          Error 404 · Fotograma no encontrado
        </p>
        <h1 className="mt-4 font-serif text-4xl font-light tracking-wide text-[#D8D5CD] sm:text-6xl">
          Fuera de encuadre
        </h1>
        <p className="mt-6 text-base font-light leading-relaxed text-[#D8D5CD]/80">
          La página o fotografía que busca no se encuentra en esta dirección. Puede explorar
          el archivo completo de 100 obras o acceder a las series documentales.
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/portfolio"
            className="border border-[#D8D5CD] bg-[#D8D5CD] px-8 py-3.5 text-xs uppercase tracking-[0.28em] text-[#101112] font-semibold transition hover:bg-transparent hover:text-white"
          >
            Ir al Portfolio
          </Link>
          <Link
            href="/projects"
            className="border border-[#1D2021] bg-[#1D2021]/60 px-8 py-3.5 text-xs uppercase tracking-[0.28em] text-[#D8D5CD] transition hover:border-[#95836B] hover:text-white"
          >
            Proyectos Narrativos
          </Link>
        </div>
      </Container>
    </div>
  );
}
