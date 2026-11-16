import Link from "next/link";

const collections = [
  { href: "/portfolio/fauna-naturaleza", label: "Fauna y Naturaleza" },
  { href: "/portfolio/paisajes-documental", label: "Paisajes y Documental" },
  { href: "/portfolio/coches-rally", label: "Coches y Rally" },
  { href: "/portfolio/arquitectura-urbana", label: "Arquitectura Urbana" },
  { href: "/portfolio/viajes-cultura", label: "Viajes y Cultura" },
];

const commercialLinks = [
  { href: "/servicios", label: "Encargos y Coberturas" },
  { href: "/prints", label: "Copias Fine Art" },
  { href: "/licensing", label: "Licencias de Uso" },
  { href: "/stories", label: "Cuaderno de Campo" },
];

const generalLinks = [
  { href: "/about", label: "Sobre el Autor" },
  { href: "/contact", label: "Contacto Directo" },
  { href: "/portfolio", label: "Archivo Completo" },
];

export default function Footer() {
  return (
    <footer className="border-t border-neutral-900 bg-black text-neutral-400">
      <div className="mx-auto max-w-7xl px-6 sm:px-10 md:px-16 lg:px-20 xl:px-24 py-16 lg:py-24">
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-5">
          {/* Brand Col */}
          <div className="lg:col-span-2">
            <Link
              href="/"
              className="inline-flex flex-col focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
            >
              <span className="font-serif text-xl tracking-[0.25em] text-neutral-100">
                JAVIER ESPINOSA
              </span>
              <span className="text-[10px] tracking-[0.4em] text-neutral-500 uppercase">
                Fotografía de autor & documental
              </span>
            </Link>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-neutral-400">
              Práctica visual basada en la luz natural, la geometría cotidiana y la observación paciente. 
              Capturas con sistema Canon EOS R7 y ópticas de alta fidelidad.
            </p>
            <div className="mt-6 flex flex-wrap gap-2 text-[10px] tracking-wider uppercase text-neutral-400">
              <span className="border border-neutral-800 px-3 py-1 bg-neutral-950">Canon EOS R7</span>
              <span className="border border-neutral-800 px-3 py-1 bg-neutral-950">Fine Art Archival</span>
              <span className="border border-neutral-800 px-3 py-1 bg-neutral-950">España</span>
            </div>
          </div>

          {/* Colecciones */}
          <div>
            <h3 className="text-xs font-medium uppercase tracking-[0.3em] text-neutral-300">
              Colecciones
            </h3>
            <ul className="mt-5 space-y-3 text-xs tracking-wider">
              {collections.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-neutral-400 transition hover:text-neutral-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Profesional */}
          <div>
            <h3 className="text-xs font-medium uppercase tracking-[0.3em] text-neutral-300">
              Servicios & Obra
            </h3>
            <ul className="mt-5 space-y-3 text-xs tracking-wider">
              {commercialLinks.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-neutral-400 transition hover:text-neutral-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Info & Contacto */}
          <div>
            <h3 className="text-xs font-medium uppercase tracking-[0.3em] text-neutral-300">
              Contacto
            </h3>
            <ul className="mt-5 space-y-3 text-xs tracking-wider">
              {generalLinks.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-neutral-400 transition hover:text-neutral-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-6 border-t border-neutral-900 pt-4 text-xs text-neutral-400">
              <a
                href="mailto:hello@javierespinosa.com"
                className="transition hover:text-neutral-200 font-mono"
              >
                hello@javierespinosa.com
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-neutral-900 pt-8 text-[11px] tracking-wider text-neutral-500 sm:flex-row">
          <p>© {new Date().getFullYear()} Javier Espinosa Martínez. Todos los derechos reservados.</p>
          <p className="text-neutral-500">
            Obra fotográfica original protegida por derechos de autor.
          </p>
        </div>
      </div>
    </footer>
  );
}
