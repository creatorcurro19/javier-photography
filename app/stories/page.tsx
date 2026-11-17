import Link from "next/link";
import Container from "@/components/ui/Container";
import FieldJournalExplorer from "@/components/stories/FieldJournalExplorer";
import { buildPageMetadata } from "@/lib/metadata";
import { getPhotosWithStory } from "@/lib/photos";

export const metadata = buildPageMetadata({
  title: "Cuaderno de Campo & Historias | Javier Espinosa",
  description:
    "Detrás de la lente: notas de campo, contexto técnico y relatos sobre fauna salvaje, tramos de rally y viajes por Javier Espinosa.",
  path: "/stories",
});

export default function StoriesPage() {
  const stories = getPhotosWithStory();

  return (
    <div className="min-h-screen bg-[#101112] pt-36 pb-28 text-[#D8D5CD]">
      <Container>
        {/* Header */}
        <div className="max-w-3xl">
          <p className="text-xs uppercase tracking-[0.4em] text-[#95836B] font-mono">
            Diario Visual & Notas de Campo
          </p>
          <h1 className="mt-4 text-4xl sm:text-5xl lg:text-6xl font-light tracking-tight text-[#D8D5CD]">
            Historias detrás del visor
          </h1>
          <p className="mt-6 text-base leading-relaxed text-[#D8D5CD]/80 sm:text-lg font-light">
            Una fotografía es el punto culminante de un proceso previo: horas de exploración,
            estudio de las condiciones meteorológicas, posicionamiento estratégico y comprensión del
            comportamiento de la luz y el sujeto. Este cuaderno recoge las anotaciones y vivencias
            de cada toma.
          </p>
        </div>

        {/* Interactive Explorer */}
        <FieldJournalExplorer stories={stories} />

        {/* Archive CTA */}
        <div className="mt-20 border border-[#1D2021] bg-[#141617]/40 p-8 text-center sm:p-14">
          <p className="text-xs uppercase tracking-[0.35em] text-[#95836B] font-mono">
            Archivo Completo
          </p>
          <h2 className="mt-2 font-serif text-3xl font-light text-[#D8D5CD]">
            Explorar las 100 obras del catálogo
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-sm text-[#D8D5CD]/80 font-light">
            Recorre las 5 colecciones completas organizadas por disciplinas temáticas, focales ópticas y visor de alta resolución.
          </p>
          <div className="mt-8">
            <Link
              href="/portfolio"
              className="inline-flex border border-[#1D2021] bg-[#1D2021]/60 px-8 py-3.5 text-xs uppercase tracking-[0.3em] text-[#D8D5CD] transition hover:border-[#95836B] hover:text-white"
            >
              Ir al Portfolio Completo
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
}
