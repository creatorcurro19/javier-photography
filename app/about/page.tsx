import Link from "next/link";
import Container from "@/components/ui/Container";
import AboutInteractiveStudio from "@/components/about/AboutInteractiveStudio";
import {
  AndalusianCenefa,
  AndalusianPageBackdrop,
} from "@/components/ui/AndalusianMotif";
import JsonLd from "@/components/seo/JsonLd";
import { buildPageMetadata } from "@/lib/metadata";
import { generateBreadcrumbSchema } from "@/lib/schema";

export const metadata = buildPageMetadata({
  title: "Sobre mí · Biografía y Equipo",
  description:
    "Trayectoria y forma de trabajar de Javier Espinosa Martínez en Tenerife: fauna, paisaje, rally histórico, arquitectura y documental con Canon EOS R7.",
  path: "/about",
  keywords: [
    "Javier Espinosa Martínez",
    "Javier Espinosa biografía",
    "fotógrafo de autor Tenerife",
    "Canon EOS R7 fotógrafo",
  ],
});

export default function AboutPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0B0C0E] pt-32 pb-28 text-[#EBE7DF]">
      <JsonLd
        data={generateBreadcrumbSchema([
          { name: "Inicio", path: "/" },
          { name: "Sobre el Autor", path: "/about" },
        ])}
      />
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
            className="inline-flex min-h-[44px] items-center gap-2 border border-[#EBE7DF] bg-[#EBE7DF] px-6 py-2.5 font-mono text-[10px] uppercase tracking-[0.25em] font-medium text-[#0B0C0E] transition hover:bg-transparent hover:text-white"
          >
            <span>Dossier de Autor (PDF)</span>
            <span>→</span>
          </Link>
        </div>

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link
            href="/cuaderno"
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
