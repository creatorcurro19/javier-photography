import Link from "next/link";
import Container from "@/components/ui/Container";

export default function NotFound() {
  return (
    <div className="flex min-h-[85vh] items-center justify-center bg-[#0B0C0E] pt-24 pb-20 text-[#EBE7DF]">
      <Container className="text-center max-w-2xl">
        <p className="text-xs uppercase tracking-[0.4em] text-[#8E8A80]">
          Error 404 · Fotograma no encontrado
        </p>
        <h1 className="mt-4 font-serif text-4xl font-light tracking-wide text-[#EBE7DF] sm:text-6xl">
          Fuera de encuadre
        </h1>
        <p className="mt-6 text-base font-light leading-relaxed text-[#EBE7DF]/80">
          La página o fotografía que busca no se encuentra en esta dirección. Puede explorar
          el archivo completo de 100 obras o acceder a las series documentales.
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/portfolio"
            className="border border-[#EBE7DF] bg-[#EBE7DF] px-8 py-3.5 text-xs uppercase tracking-[0.28em] text-[#0B0C0E] font-semibold transition hover:bg-transparent hover:text-white"
          >
            Ir al Portfolio
          </Link>
          <Link
            href="/projects"
            className="border border-[#202226] bg-[#202226]/60 px-8 py-3.5 text-xs uppercase tracking-[0.28em] text-[#EBE7DF] transition hover:border-[#8E8A80] hover:text-white"
          >
            Proyectos Narrativos
          </Link>
        </div>
      </Container>
    </div>
  );
}
