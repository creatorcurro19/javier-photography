import Image from "next/image";
import Link from "next/link";
import Container from "@/components/ui/Container";
import { buildPageMetadata } from "@/lib/metadata";
import { getAllProjects } from "@/lib/photos";

export const metadata = buildPageMetadata({
  title: "Proyectos Seleccionados | Javier Espinosa",
  description:
    "Series fotográficas y ensayos documentales por Javier Espinosa Martínez. Narrativas visuales sobre memoria, oficios tradicionales, orografía del territorio y automovilismo.",
  path: "/projects",
});

export default function ProjectsPage() {
  const projects = getAllProjects();

  return (
    <div className="min-h-screen bg-[#101112] pt-36 pb-28 text-[#D8D5CD]">
      <Container>
        {/* Header */}
        <header className="max-w-3xl">
          <p className="text-xs font-mono uppercase tracking-[0.4em] text-[#95836B]">
            Narrativa Visual & Ensayos
          </p>
          <h1 className="mt-4 font-serif text-5xl font-light tracking-tight md:text-6xl text-[#D8D5CD]">
            Proyectos Seleccionados
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-[#D8D5CD]/80 font-light">
            Cuerpos de obra articulados con una intención documental y estética específica.
            Cada proyecto constituye una secuencia visual meditada donde el contexto humano, el territorio
            y la técnica dialogan con el espectador.
          </p>
        </header>

        {/* Project List */}
        <div className="mt-20 space-y-20">
          {projects.map((project, index) => (
            <article
              key={project.id}
              className="grid grid-cols-1 items-center gap-10 rounded-2xl border border-[#1D2021] bg-[#1D2021]/30 p-8 sm:p-12 lg:grid-cols-12 lg:gap-14 hover:border-[#95836B]/50 transition duration-500"
            >
              {/* Cover side (7 cols) */}
              <div
                className={`lg:col-span-7 ${
                  index % 2 === 1 ? "lg:order-2" : "lg:order-1"
                }`}
              >
                <Link
                  href={`/projects/${project.slug}`}
                  className="group relative block aspect-[16/10] w-full overflow-hidden rounded-xl border border-[#1D2021] bg-neutral-900"
                >
                  <Image
                    src={project.coverImage}
                    alt={project.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 60vw"
                    className="object-cover transition duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#101112] via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4">
                    <span className="rounded-full border border-[#1D2021] bg-[#101112]/90 px-3.5 py-1 text-[10px] uppercase tracking-[0.25em] text-[#95836B] backdrop-blur-md">
                      {project.discipline}
                    </span>
                  </div>
                </Link>
              </div>

              {/* Text side (5 cols) */}
              <div
                className={`lg:col-span-5 ${
                  index % 2 === 1 ? "lg:order-1" : "lg:order-2"
                }`}
              >
                <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-[0.25em] text-[#95836B]">
                  <span>{project.location ? `${project.location} · ` : ""}{project.year}</span>
                </div>

                <h2 className="mt-3 font-serif text-3xl font-light text-[#D8D5CD] sm:text-4xl">
                  <Link
                    href={`/projects/${project.slug}`}
                    className="transition hover:text-white"
                  >
                    {project.title}
                  </Link>
                </h2>

                <p className="mt-2 text-xs font-mono text-neutral-400">
                  {project.subtitle}
                </p>

                <p className="mt-6 text-sm leading-relaxed text-[#D8D5CD]/80 sm:text-base sm:leading-7 font-light">
                  {project.description}
                </p>

                <div className="mt-6 flex items-center gap-4 text-xs font-mono text-neutral-400">
                  <span className="border border-[#1D2021] px-3 py-1 bg-[#101112]">
                    {project.photoIds.length} Fotografías en serie
                  </span>
                </div>

                <div className="mt-8 flex items-center gap-6">
                  <Link
                    href={`/projects/${project.slug}`}
                    className="inline-flex border border-[#D8D5CD] bg-[#D8D5CD] px-7 py-3 text-xs uppercase tracking-[0.25em] text-[#101112] font-semibold transition hover:bg-transparent hover:text-white"
                  >
                    Ver Ensayo Completo
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </Container>
    </div>
  );
}
