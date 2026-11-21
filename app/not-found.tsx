import Link from "next/link";
import Container from "@/components/ui/Container";

const QUICK_LINKS = [
  { href: "/portfolio", label: "Archivo de 100 Obras" },
  { href: "/projects", label: "8 Series Monográficas" },
  { href: "/prints", label: "Copias Fine Art en Tubo" },
  { href: "/servicios", label: "Encargos Fotográficos" },
  { href: "/licensing", label: "Licencias TIFF 16-bit" },
  { href: "/cuaderno", label: "Cuaderno de Campo" },
  { href: "/contact", label: "Contacto Directo" },
];

const DISCIPLINES = [
  { href: "/portfolio/fauna-naturaleza", label: "Fauna y Naturaleza" },
  { href: "/portfolio/paisajes-documental", label: "Paisajes y Territorio" },
  { href: "/portfolio/coches-rally", label: "Coches y Rally" },
  { href: "/portfolio/arquitectura-urbana", label: "Arquitectura y Espacio Urbano" },
  { href: "/portfolio/viajes-cultura", label: "Documental y Tradición" },
];

export default function NotFound() {
  return (
    <div className="flex min-h-[85vh] items-center justify-center bg-[#0B0C0E] pt-28 pb-20 text-[#EBE7DF]">
      <Container className="max-w-3xl text-center">
        <p className="font-mono text-xs uppercase tracking-[0.4em] text-[#C5A880]">
          Error 404 · Fotograma no encontrado
        </p>
        <h1 className="mt-4 font-serif text-4xl font-light tracking-wide text-[#EBE7DF] sm:text-6xl">
          Fuera de encuadre
        </h1>
        <p className="mt-5 text-base font-light leading-relaxed text-[#A39E93]">
          La página o fotografía que buscas ha cambiado de dirección o no existe. Desde aquí puedes volver directamente a cualquiera de las secciones principales o colecciones del archivo:
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          {QUICK_LINKS.map((item, idx) => (
            <Link
              key={item.href}
              href={item.href}
              className={`inline-flex min-h-[44px] items-center px-5 py-2.5 font-mono text-xs uppercase tracking-[0.2em] transition ${
                idx === 0
                  ? "border border-[#C5A880] bg-[#C5A880] font-semibold text-[#0B0C0E] hover:bg-white hover:border-white"
                  : "border border-white/15 bg-[#151618] text-[#EBE7DF] hover:border-[#C5A880] hover:text-white"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>

        <div className="mt-10 border-t border-white/[0.08] pt-8">
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#A39E93]">
            Explorar por Disciplina Fotográfica
          </p>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2.5">
            {DISCIPLINES.map((cat) => (
              <Link
                key={cat.href}
                href={cat.href}
                className="inline-flex min-h-[44px] items-center border border-white/[0.08] bg-[#0B0C0E] px-4 py-2 font-mono text-[11px] text-[#A39E93] transition hover:border-white/30 hover:text-[#EBE7DF]"
              >
                {cat.label} →
              </Link>
            ))}
          </div>
        </div>
      </Container>
    </div>
  );
}
