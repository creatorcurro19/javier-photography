import Image from "next/image";
import Link from "next/link";
import Container from "@/components/ui/Container";
import SectionHeader from "@/components/ui/SectionHeader";
import { getAllProjects } from "@/lib/photos";

export default function SelectedProjects() {
  const projects = getAllProjects().slice(0, 4);

  return (
    <section id="proyectos" className="bg-[#101112] py-28 md:py-36 border-t border-[#1D2021] scroll-mt-20">
      <Container>
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <SectionHeader
            label="Ensayos & Narrativa Visual"
            title="Proyectos Seleccionados"
            description="Series monográficas articuladas con una intención conceptual y documental: la dignidad de los oficios, la orografía del territorio y la tensión del instante."
          />
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.25em] text-[#95836B] hover:text-[#D8D5CD] transition group shrink-0"
          >
            <span>Índice de Proyectos</span>
            <span className="transition-transform group-hover:translate-x-1">→</span>
          </Link>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-10">
          {projects.map((project, idx) => (
            <article
              key={project.id}
              className="group flex flex-col justify-between overflow-hidden rounded-xl border border-[#1D2021] bg-[#1D2021]/40 transition duration-500 hover:border-[#95836B]/60 hover:bg-[#1D2021]/70"
            >
              <div>
                <Link
                  href={`/projects/${project.slug}`}
                  className="block relative aspect-[16/10] w-full overflow-hidden bg-neutral-900"
                >
                  <Image
                    src={project.coverImage}
                    alt={project.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#101112] via-[#101112]/20 to-transparent" />
                  
                  <div className="absolute top-4 left-4 flex items-center gap-2">
                    <span className="rounded-full border border-[#1D2021] bg-[#101112]/90 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.25em] text-[#95836B] backdrop-blur-md">
                      0{idx + 1} · {project.discipline}
                    </span>
                  </div>

                  <span className="absolute top-4 right-4 rounded-full border border-[#1D2021] bg-[#101112]/90 px-3 py-1 font-mono text-[11px] text-[#D8D5CD] backdrop-blur-md">
                    {project.photoIds.length} fotografías
                  </span>
                </Link>

                <div className="p-8 sm:p-10">
                  <div className="flex items-center gap-2 text-xs font-mono text-[#95836B]">
                    <span>{project.location ? `${project.location} · ` : ""}{project.year}</span>
                  </div>

                  <h3 className="mt-3 font-serif text-3xl font-light text-[#D8D5CD] group-hover:text-white transition-colors">
                    <Link href={`/projects/${project.slug}`}>
                      {project.title}
                    </Link>
                  </h3>

                  <p className="mt-2 text-xs font-mono text-neutral-400">
                    {project.subtitle}
                  </p>

                  <p className="mt-4 text-sm font-light leading-relaxed text-[#D8D5CD]/80 line-clamp-3">
                    {project.description}
                  </p>
                </div>
              </div>

              <div className="px-8 pb-8 sm:px-10 sm:pb-10 pt-2 border-t border-[#1D2021]/80 flex items-center justify-between">
                <Link
                  href={`/projects/${project.slug}`}
                  className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.25em] text-[#95836B] group-hover:text-[#D8D5CD] transition-colors"
                >
                  <span>Explorar Ensayo Completo</span>
                  <span className="transition-transform group-hover:translate-x-1">→</span>
                </Link>
                <span className="font-mono text-xs text-neutral-500">
                  {project.photoIds.length} obras
                </span>
              </div>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
