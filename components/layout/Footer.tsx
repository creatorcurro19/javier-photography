import Link from "next/link";

const collections = [
  { href: "/portfolio/fauna-naturaleza", label: "Fauna y Naturaleza (Wildlife)" },
  { href: "/portfolio/paisajes-documental", label: "Paisajes y Territorio (Landscapes)" },
  { href: "/portfolio/coches-rally", label: "Coches y Rally (Motorsport)" },
  { href: "/portfolio/arquitectura-urbana", label: "Arquitectura Urbana" },
  { href: "/portfolio/viajes-cultura", label: "Documental y Tradición" },
];

const projectLinks = [
  { href: "/projects/custodios", label: "Custodios: Memoria y Oficios" },
  { href: "/projects/la-gomera", label: "La Gomera: Territorio y Tradición" },
  { href: "/projects/trazadas-rally", label: "Trazadas: Rally Histórico" },
  { href: "/projects/silencio-del-desierto", label: "El Silencio del Desierto" },
  { href: "/projects", label: "Ver Todos los Proyectos →" },
];

const commercialLinks = [
  { href: "/servicios", label: "Encargos y Coberturas" },
  { href: "/prints", label: "Copias Fine Art" },
  { href: "/licensing", label: "Licencias de Uso" },
  { href: "/stories", label: "Cuaderno de Campo" },
];

export default function Footer() {
  return (
    <footer className="border-t border-[#1D2021] bg-[#101112] text-neutral-400">
      <div className="mx-auto max-w-7xl px-6 sm:px-10 md:px-16 lg:px-20 xl:px-24 py-16 lg:py-24">
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-5">
          {/* Brand Col */}
          <div className="lg:col-span-2">
            <Link
              href="/"
              className="inline-flex flex-col focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
            >
              <span className="font-serif text-xl tracking-[0.25em] text-[#D8D5CD]">
                JAVIER ESPINOSA
              </span>
              <span className="text-[10px] tracking-[0.4em] text-[#95836B] uppercase">
                Fotografía de autor & documental
              </span>
            </Link>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-neutral-400 font-light">
              Práctica visual basada en la luz natural, la geometría cotidiana y la observación paciente. 
              Capturas con sistema Canon EOS R7 y ópticas de alta fidelidad.
            </p>
            <div className="mt-6 flex flex-wrap gap-2 text-[10px] tracking-wider uppercase text-neutral-400">
              <span className="border border-[#1D2021] px-3 py-1 bg-[#1D2021]/60 text-neutral-300">Canon EOS R7</span>
              <span className="border border-[#1D2021] px-3 py-1 bg-[#1D2021]/60 text-neutral-300">Hahnemühle 308g</span>
              <span className="border border-[#1D2021] px-3 py-1 bg-[#1D2021]/60 text-neutral-300">España</span>
            </div>
          </div>

          {/* Colecciones */}
          <div>
            <h3 className="text-xs font-medium uppercase tracking-[0.3em] text-[#D8D5CD]">
              Disciplinas
            </h3>
            <ul className="mt-5 space-y-3 text-xs tracking-wider">
              {collections.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-neutral-400 transition hover:text-[#D8D5CD] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Proyectos Narrativos */}
          <div>
            <h3 className="text-xs font-medium uppercase tracking-[0.3em] text-[#D8D5CD]">
              Proyectos
            </h3>
            <ul className="mt-5 space-y-3 text-xs tracking-wider">
              {projectLinks.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-neutral-400 transition hover:text-[#D8D5CD] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Profesional & Contacto */}
          <div>
            <h3 className="text-xs font-medium uppercase tracking-[0.3em] text-[#D8D5CD]">
              Servicios & Obra
            </h3>
            <ul className="mt-5 space-y-3 text-xs tracking-wider">
              {commercialLinks.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-neutral-400 transition hover:text-[#D8D5CD] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-6 border-t border-[#1D2021] pt-4 text-xs text-neutral-400">
              <a
                href="mailto:hello@javierespinosa.com"
                className="transition hover:text-[#D8D5CD] font-mono"
              >
                hello@javierespinosa.com
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-[#1D2021] pt-8 text-[11px] tracking-wider text-neutral-500 sm:flex-row">
          <p>© {new Date().getFullYear()} Javier Espinosa Martínez. Obra fotográfica original protegida por derechos de autor.</p>
          <div className="flex gap-4">
            <Link href="/about" className="hover:text-neutral-300 transition">Biografía</Link>
            <span>·</span>
            <Link href="/contact" className="hover:text-neutral-300 transition">Contacto</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
