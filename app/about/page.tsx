import Link from "next/link";
import Container from "@/components/ui/Container";
import AboutInteractiveStudio from "@/components/about/AboutInteractiveStudio";
import {
  AndalusianCenefa,
  AndalusianPageBackdrop,
} from "@/components/ui/AndalusianMotif";
import { buildPageMetadata } from "@/lib/metadata";

export const metadata = buildPageMetadata({
  title: "El Autor & The Art of Seeing | Javier Espinosa",
  description:
    "Monografía y declaración artística de Javier Espinosa Martínez. Fotógrafo español especializado en fauna salvaje, rally, arquitectura y narrativa documental con sistema Canon EOS R7.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0B0C0E] pt-32 pb-28 text-[#EBE7DF]">
      <AndalusianPageBackdrop variant="sebka" />
      <Container className="relative z-10">
        <AboutInteractiveStudio />

        <div className="mt-16 flex flex-wrap items-center justify-between gap-4 border border-[#C5A880]/25 bg-[#151618]/90 px-6 py-5 sm:px-8">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#C5A880]">
              Prensa, Galerías &amp; Curadores
            </p>
            <p className="mt-1 text-xs font-light text-[#8E8A80]">
              Descarga el dossier editorial en formato A4 con biografía, equipo óptico y selección de obra.
            </p>
          </div>
          <Link
            href="/dossier"
            className="inline-flex items-center gap-2 border border-[#EBE7DF] bg-[#EBE7DF] px-6 py-2.5 font-mono text-[10px] uppercase tracking-[0.25em] font-medium text-[#0B0C0E] transition hover:bg-transparent hover:text-white"
          >
            <span>Dossier / Press Kit (PDF)</span>
            <span>→</span>
          </Link>
        </div>

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link
            href="/stories"
            className="group flex flex-col justify-between rounded-xl border border-white/[0.08] bg-[#121417] p-6 hover:border-[#C5A880]/50 transition"
          >
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-[#C5A880]">
                Diario Óptico &amp; Proceso
              </p>
              <h3 className="mt-1 font-serif text-lg font-light text-[#EBE7DF] group-hover:text-white">
                Cuaderno de Campo
              </h3>
              <p className="mt-2 text-xs font-light text-[#8E8A80]">
                Notas de campo sobre luz natural disponible, calibración óptica y técnica de espera en fauna y territorio.
              </p>
            </div>
            <span className="mt-4 font-mono text-[10px] uppercase tracking-wider text-[#C5A880] group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
              Leer Cuaderno →
            </span>
          </Link>

          <Link
            href="/licensing"
            className="group flex flex-col justify-between rounded-xl border border-white/[0.08] bg-[#121417] p-6 hover:border-[#C5A880]/50 transition"
          >
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-[#C5A880]">
                Uso Editorial &amp; Comercial
              </p>
              <h3 className="mt-1 font-serif text-lg font-light text-[#EBE7DF] group-hover:text-white">
                Licencias de Archivo
              </h3>
              <p className="mt-2 text-xs font-light text-[#8E8A80]">
                Condiciones de cesión de derechos para publicaciones impresas, proyectos editoriales y campañas de marca.
              </p>
            </div>
            <span className="mt-4 font-mono text-[10px] uppercase tracking-wider text-[#C5A880] group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
              Consultar Licencias →
            </span>
          </Link>
        </div>

        <AndalusianCenefa
          variant="estrella"
          className="mt-16 text-[#C5A880]/36"
        />
      </Container>
    </div>
  );
}
