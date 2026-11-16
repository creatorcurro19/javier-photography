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
    <div className="min-h-screen bg-black pt-36 pb-28 text-neutral-300">
      <Container>
        {/* Header */}
        <div className="max-w-3xl">
          <p className="text-xs uppercase tracking-[0.4em] text-neutral-400">
            Diario Visual & Notas de Campo
          </p>
          <h1 className="mt-4 font-serif text-4xl font-light tracking-wide text-neutral-100 sm:text-5xl lg:text-6xl">
            Historias detrás del visor
          </h1>
          <p className="mt-6 text-base leading-relaxed text-neutral-300 sm:text-lg">
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
              className={`grid grid-cols-1 items-center gap-12 border-b border-neutral-900 pb-20 lg:grid-cols-12 lg:gap-16 ${
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
                  className="group relative block aspect-[16/10] w-full overflow-hidden rounded-lg border border-neutral-800 bg-neutral-900"
                >
                  <Image
                    src={photo.image}
                    alt={photo.alt}
                    fill
                    sizes="(max-width: 1024px) 100vw, 60vw"
                    className="object-cover transition duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/10 transition group-hover:bg-transparent" />
                  <div className="absolute bottom-4 left-4">
                    <span className="bg-black/85 px-3 py-1 text-[10px] uppercase tracking-[0.25em] text-neutral-300 backdrop-blur-sm">
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
                <div className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-neutral-400">
                  {photo.location ? (
                    <>
                      <span>{photo.location}</span>
                      <span>·</span>
                    </>
                  ) : null}
                  <span>{photo.year}</span>
                  <span>·</span>
                  <span className="font-mono text-[11px] text-neutral-500">{photo.camera}</span>
                </div>

                <h2 className="mt-3 font-serif text-2xl font-light text-neutral-100 sm:text-3xl">
                  <Link
                    href={`/portfolio/${photo.slug}`}
                    className="transition hover:text-white"
                  >
                    {photo.title}
                  </Link>
                </h2>

                <p className="mt-6 text-sm leading-relaxed text-neutral-300 sm:text-base sm:leading-7">
                  {photo.story}
                </p>

                {/* Technical EXIF pill */}
                <div className="mt-6 rounded-lg border border-neutral-800 bg-neutral-950/60 p-5">
                  <p className="text-[10px] uppercase tracking-[0.25em] text-neutral-400">
                    Anotaciones Técnicas de Toma
                  </p>
                  <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 font-mono text-xs text-neutral-300">
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
                    className="inline-flex border border-neutral-200 bg-neutral-100 px-7 py-3 text-xs uppercase tracking-[0.25em] text-neutral-950 font-medium transition hover:bg-white hover:text-black hover:border-white"
                  >
                    Ver en detalle
                  </Link>
                  {photo.prints && (
                    <Link
                      href={`/prints`}
                      className="text-xs uppercase tracking-[0.25em] text-neutral-400 transition hover:text-neutral-200"
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
        <div className="mt-20 rounded-xl border border-neutral-800 bg-neutral-950/60 p-8 text-center sm:p-14">
          <p className="text-xs uppercase tracking-[0.35em] text-neutral-400">
            Archivo Completo
          </p>
          <h2 className="mt-2 font-serif text-3xl font-light text-neutral-100">
            Explorar todas las fotografías del portfolio
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-sm text-neutral-300">
            Vea las 5 colecciones completas organizadas por disciplinas temáticas y con visor lightbox de alta resolución.
          </p>
          <div className="mt-8">
            <Link
              href="/portfolio"
              className="inline-flex border border-neutral-700 bg-neutral-900/60 px-8 py-3.5 text-xs uppercase tracking-[0.3em] text-neutral-200 transition hover:border-neutral-400 hover:text-white"
            >
              Ir al Portfolio Completo
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
}
