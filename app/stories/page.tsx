import Link from "next/link";
import Container from "@/components/ui/Container";
import FieldJournalExplorer from "@/components/stories/FieldJournalExplorer";
import { buildPageMetadata } from "@/lib/metadata";
import { getPhotosWithStory } from "@/lib/photos";

export const metadata = buildPageMetadata({
  title: "Cuaderno de Campo & Diario Visual | Javier Espinosa",
  description:
    "Detrás de la lente: notas de campo, contexto técnico y relatos sobre fauna salvaje, tramos de rally y viajes por Javier Espinosa.",
  path: "/stories",
});

export default function StoriesPage() {
  const stories = getPhotosWithStory();

  return (
    <div className="min-h-screen bg-[#0B0C0E] pt-36 pb-28 text-[#EBE7DF]">
      <Container>
        {/* Header */}
        <div className="max-w-3xl">
          <div className="flex items-center gap-3">
            <span className="h-px w-6 bg-white/30" />
            <p className="font-mono text-xs uppercase tracking-[0.4em] text-[#8E8A80]">
              The Art of Seeing · Notas de Campo
            </p>
          </div>
          <h1 className="mt-4 font-serif text-4xl sm:text-5xl lg:text-6xl font-light tracking-tight text-[#EBE7DF]">
            Historias detrás del visor
          </h1>
          <p className="mt-6 text-base sm:text-lg leading-relaxed text-[#8E8A80] font-light">
            Una fotografía es el punto culminante de un proceso previo: horas de exploración silenciosa,
            estudio de las condiciones meteorológicas, posicionamiento milimétrico y comprensión del
            comportamiento de la luz y el sujeto. Este cuaderno recoge las anotaciones y vivencias
            de cada toma.
          </p>
        </div>

        {/* Interactive Explorer */}
        <div className="mt-12">
          <FieldJournalExplorer stories={stories} />
        </div>

        {/* Archive CTA */}
        <div className="mt-20 border border-white/[0.08] bg-[#151618] p-8 text-center sm:p-14">
          <p className="font-mono text-xs uppercase tracking-[0.35em] text-[#8E8A80]">
            Archivo Completo
          </p>
          <h2 className="mt-2 font-serif text-3xl font-light text-[#EBE7DF]">
            Explorar las 100 obras del catálogo
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-sm text-[#8E8A80] font-light">
            Recorre las 5 salas de exposición organizadas por disciplinas temáticas, focales ópticas y visor de alta resolución.
          </p>
          <div className="mt-8">
            <Link
              href="/portfolio"
              className="inline-flex border border-[#EBE7DF] bg-[#EBE7DF] px-8 py-3.5 font-mono text-xs uppercase tracking-[0.28em] text-[#0B0C0E] font-medium transition-all duration-300 hover:bg-transparent hover:text-white"
            >
              Ir al Catálogo Completo
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
}
