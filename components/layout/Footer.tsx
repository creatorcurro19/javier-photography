import Link from "next/link";
import {
  AndalusianBackgroundPattern,
  AndalusianCenefa,
  AndalusianStarMark,
} from "@/components/ui/AndalusianMotif";

const collections = [
  { href: "/portfolio/fauna-naturaleza", label: "Fauna y Biodiversidad (Wildlife)" },
  { href: "/portfolio/paisajes-documental", label: "Paisajes y Territorio (Landscapes)" },
  { href: "/portfolio/coches-rally", label: "Coches y Rally (Motorsport)" },
  { href: "/portfolio/arquitectura-urbana", label: "Arquitectura Vernácula & Urbana" },
  { href: "/portfolio/viajes-cultura", label: "Crónica Documental & Oficios" },
];

const projectLinks = [
  { href: "/projects/villanueva-de-la-vera", label: "Villanueva de la Vera: Tiempo y Raíz" },
  { href: "/projects/medina-y-kasbah", label: "Medina, Atlas y Kasbah" },
  { href: "/projects/custodios", label: "Custodios: Memoria y Oficios" },
  { href: "/projects/la-gomera", label: "Entre la Bruma y el Volcán" },
  { href: "/projects/trazadas-rally", label: "Trazadas: Rally Histórico" },
  { href: "/projects/silencio-del-desierto", label: "El Silencio del Desierto" },
  { href: "/projects/miradas-en-libertad", label: "Miradas en Libertad: Fauna" },
];

const commercialLinks = [
  { href: "/prints", label: "Catálogo Fine Art (Hahnemühle 308g)" },
  { href: "/servicios", label: "Encargos & Coberturas Especiales" },
  { href: "/licensing", label: "Licencias de Uso Editorial & Comercial" },
  { href: "/stories", label: "Cuaderno de Campo & Diario Óptico" },
];

export default function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-[#C5A880]/20 bg-[#0B0C0E] text-[#8E8A80]">
      {/* Filigrana geométrica andalusí de fondo */}
      <AndalusianBackgroundPattern
        variant="laceria"
        mask="radial"
        className="text-[#C5A880]/[0.075]"
      />

      {/* Cenefa coronando el pie de página */}
      <AndalusianCenefa
        variant="estrella"
        fadeEdges={false}
        className="relative z-10 text-[#C5A880]/38"
      />

      <div className="relative z-10 mx-auto max-w-7xl px-6 sm:px-10 md:px-16 lg:px-20 xl:px-24 py-16 lg:py-24">
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-5">
          {/* Brand Col */}
          <div className="lg:col-span-2">
            <Link
              href="/"
              className="group inline-flex items-center gap-3 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
            >
              <AndalusianStarMark className="h-6 w-6 text-[#C5A880]/80 transition-transform duration-500 group-hover:rotate-45" />
              <div className="flex flex-col">
                <span className="font-sans font-medium text-lg tracking-[0.28em] text-[#EBE7DF]">
                  JAVIER ESPINOSA
                </span>
                <span className="text-[9px] tracking-[0.42em] text-[#C5A880]/80 uppercase mt-0.5">
                  The Art of Seeing · Fotografía de Autor
                </span>
              </div>
            </Link>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-[#8E8A80] font-light">
              Práctica visual basada en la luz natural, la geometría espacial y la observación paciente. 
              Capturas con sistema Canon EOS R7 y ópticas de alta fidelidad.
            </p>

            <div className="mt-6 flex flex-wrap gap-2 text-[10px] font-mono tracking-wider uppercase text-[#8E8A80]">
              <span className="border border-white/[0.08] px-3 py-1 bg-[#151618] text-[#EBE7DF]">Canon EOS R7</span>
              <span className="border border-white/[0.08] px-3 py-1 bg-[#151618] text-[#EBE7DF]">Hahnemühle 308g</span>
              <span className="border border-white/[0.08] px-3 py-1 bg-[#151618] text-[#EBE7DF]">ISO 9706</span>
              <span className="border border-white/[0.08] px-3 py-1 bg-[#151618] text-[#EBE7DF]">Tenerife · Canarias</span>
            </div>

            {/* Perfiles Oficiales Verificados */}
            <div className="mt-6 flex flex-wrap items-center gap-3 text-[10px] uppercase font-mono tracking-[0.22em]">
              <a
                href="https://www.instagram.com/Javier.espinosa19/"
                target="_blank"
                rel="noopener noreferrer"
                className="border border-white/[0.08] bg-[#151618] px-3.5 py-1.5 text-[#EBE7DF] transition hover:border-white/30 hover:text-white"
              >
                Instagram ↗
              </a>
              <a
                href="https://www.saatchiart.com/javier-espinosa-photography"
                target="_blank"
                rel="noopener noreferrer"
                className="border border-white/[0.08] bg-[#151618] px-3.5 py-1.5 text-[#EBE7DF] transition hover:border-white/30 hover:text-white"
              >
                Saatchi Art ↗
              </a>
              <a
                href="https://www.istockphoto.com/portfolio/JavierEspinosa?sort=purerecency&assettype=image"
                target="_blank"
                rel="noopener noreferrer"
                className="border border-white/[0.08] bg-[#151618] px-3.5 py-1.5 text-[#EBE7DF] transition hover:border-white/30 hover:text-white"
              >
                Getty / iStock ↗
              </a>
            </div>
          </div>

          {/* Colecciones */}
          <div>
            <h3 className="text-xs font-mono font-medium uppercase tracking-[0.3em] text-[#EBE7DF]">
              Disciplinas
            </h3>
            <ul className="mt-5 space-y-3 text-xs tracking-wider">
              {collections.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-[#8E8A80] transition hover:text-[#EBE7DF] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Proyectos Narrativos */}
          <div>
            <h3 className="text-xs font-mono font-medium uppercase tracking-[0.3em] text-[#EBE7DF]">
              Series Monográficas
            </h3>
            <ul className="mt-5 space-y-3 text-xs tracking-wider">
              {projectLinks.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-[#8E8A80] transition hover:text-[#EBE7DF] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Adquisiciones & Contacto */}
          <div>
            <h3 className="text-xs font-mono font-medium uppercase tracking-[0.3em] text-[#EBE7DF]">
              Adquisiciones & Obra
            </h3>
            <ul className="mt-5 space-y-3 text-xs tracking-wider">
              {commercialLinks.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-[#8E8A80] transition hover:text-[#EBE7DF] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-6 border-t border-white/[0.08] pt-4 text-xs">
              <a
                href="mailto:javierespinosa1995@hotmail.com"
                className="text-[#8E8A80] transition hover:text-[#EBE7DF] font-mono break-all"
              >
                javierespinosa1995@hotmail.com
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-white/[0.08] pt-8 text-[11px] font-mono tracking-wider text-[#8E8A80]/70 sm:flex-row">
          <p>© {new Date().getFullYear()} Javier Espinosa Martínez. Archivo fotográfico original protegido por derechos de autor.</p>
          <div className="flex flex-wrap items-center gap-4">
            <Link href="/about" className="hover:text-[#EBE7DF] transition">Biografía</Link>
            <span>·</span>
            <Link href="/contact" className="hover:text-[#EBE7DF] transition">Contacto Privado</Link>
            <span>·</span>
            <Link href="/legal" className="hover:text-[#EBE7DF] transition">Aviso Legal, Privacidad & Copyright</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
