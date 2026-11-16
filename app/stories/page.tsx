import Image from "next/image";
import Link from "next/link";
import Container from "@/components/ui/Container";
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
          <h1 className="mt-4 font-serif text-4xl font-light tracking-wide text-[#D8D5CD] sm:text-5xl lg:text-6xl">
            Historias detrás del visor
          </h1>
          <p className="mt-6 text-base leading-relaxed text-[#D8D5CD]/80 sm:text-lg font-light">
            Una fotografía es el punto culminante de un proceso previo: horas de exploración, 
            estudio de las condiciones meteorológicas, posicionamiento estratégico y comprensión del 
            comportamiento de la luz y el sujeto. Este cuaderno recoge las anotaciones y vivencias 
            de cada toma.
          </p>
        </div>

        {/* Stories List */}
        <div className="mt-20 space-y-24">
          {stories.map((photo, index) => (
            <article
              key={photo.id}
              className={`grid grid-cols-1 items-center gap-12 border-b border-[#1D2021] pb-20 lg:grid-cols-12 lg:gap-16 ${
                index % 2 === 1 ? "lg:flex-row-reverse" : ""
              }`}
            >
              {/* Image side (7 cols) */}
              <div
                className={`lg:col-span-7 ${
                  index % 2 === 1 ? "lg:order-2" : "lg:order-1"
                }`}
              >
                <Link
                  href={`/portfolio/${photo.slug}`}
                  className="group relative mx-auto block w-fit max-w-full overflow-hidden rounded-lg border border-[#1D2021] bg-[#1D2021]/50"
                >
                  <Image
                    src={photo.image}
                    alt={photo.alt}
                    width={photo.width}
                    height={photo.height}
                    sizes="(max-width: 1024px) 100vw, 60vw"
                    className="h-auto max-h-[78vh] w-auto max-w-full transition duration-700 group-hover:scale-[1.02]"
                  />
                  <div className="absolute inset-0 bg-black/10 transition group-hover:bg-transparent" />
                  <div className="absolute bottom-4 left-4">
                    <span className="bg-[#101112]/90 px-3 py-1 text-[10px] uppercase tracking-[0.25em] text-[#D8D5CD] backdrop-blur-sm border border-[#1D2021]">
                      {photo.category.replace("-", " ")}
                    </span>
                  </div>
                </Link>
              </div>

              {/* Story Narrative side (5 cols) */}
              <div
                className={`lg:col-span-5 ${
                  index % 2 === 1 ? "lg:order-1" : "lg:order-2"
                }`}
              >
                <div className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-[#95836B] font-mono">
                  {photo.location ? (
                    <>
                      <span>{photo.location}</span>
                      <span>·</span>
                    </>
                  ) : null}
                  <span>{photo.year}</span>
                  <span>·</span>
                  <span className="font-mono text-[11px] text-[#95836B]">{photo.camera}</span>
                </div>

                <h2 className="mt-3 font-serif text-2xl font-light text-[#D8D5CD] sm:text-3xl">
                  <Link
                    href={`/portfolio/${photo.slug}`}
                    className="transition hover:text-white"
                  >
                    {photo.title}
                  </Link>
                </h2>

                <p className="mt-6 text-sm leading-relaxed text-[#D8D5CD]/80 sm:text-base sm:leading-7 font-light">
                  {photo.story}
                </p>

                {/* Technical EXIF pill */}
                <div className="mt-6 rounded-lg border border-[#1D2021] bg-[#1D2021]/30 p-5">
                  <p className="text-[10px] uppercase tracking-[0.25em] text-[#95836B] font-mono">
                    Anotaciones Técnicas de Toma
                  </p>
                  <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 font-mono text-xs text-[#D8D5CD]">
                    <span>{photo.camera}</span>
                    <span>·</span>
                    <span>{photo.focalLength}</span>
                    <span>·</span>
                    <span>{photo.aperture}</span>
                    <span>·</span>
                    <span>{photo.shutter}</span>
                    <span>·</span>
                    <span>ISO {photo.iso}</span>
                  </div>
                </div>

                <div className="mt-8 flex items-center gap-6">
                  <Link
                    href={`/portfolio/${photo.slug}`}
                    className="inline-flex border border-[#D8D5CD] bg-[#D8D5CD] px-7 py-3 text-xs uppercase tracking-[0.25em] text-[#101112] font-semibold transition hover:bg-transparent hover:text-white"
                  >
                    Ver en detalle
                  </Link>
                  {photo.prints && (
                    <Link
                      href={`/prints`}
                      className="text-xs uppercase tracking-[0.25em] text-[#95836B] hover:text-[#D8D5CD] transition"
                    >
                      Solicitar copia Fine Art →
                    </Link>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Archive CTA */}
        <div className="mt-20 rounded-xl border border-[#1D2021] bg-[#1D2021]/30 p-8 text-center sm:p-14">
          <p className="text-xs uppercase tracking-[0.35em] text-[#95836B] font-mono">
            Archivo Completo
          </p>
          <h2 className="mt-2 font-serif text-3xl font-light text-[#D8D5CD]">
            Explorar todas las fotografías del portfolio
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-sm text-[#D8D5CD]/80 font-light">
            Vea las 5 colecciones completas organizadas por disciplinas temáticas y con visor lightbox de alta resolución.
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
