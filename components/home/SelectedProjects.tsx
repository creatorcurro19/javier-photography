import Image from "next/image";
import Link from "next/link";
import Container from "@/components/ui/Container";
import { getAllProjects } from "@/lib/photos";

export default function SelectedProjects() {
  const allProjects = getAllProjects();
  const featuredIds = ["villanueva-de-la-vera", "silencio-del-desierto", "trazadas-rally"];
  const featured = featuredIds
    .map((id) => allProjects.find((p) => p.id === id))
    .filter((p): p is (typeof allProjects)[number] => Boolean(p));

  return (
    <section id="proyectos" className="bg-[#101112] py-24 sm:py-32 border-t border-[#1D2021] scroll-mt-20">
      <Container>
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <p className="text-[10px] uppercase tracking-[0.35em] text-[#95836B]">
              Ensayos Documentales
            </p>
            <h2 className="mt-2 text-3xl sm:text-4xl lg:text-5xl font-light tracking-tight text-[#D8D5CD]">
              Series Monográficas
            </h2>
          </div>
          <Link
            href="/projects"
            className="group inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-[#95836B] hover:text-[#D8D5CD] transition"
          >
            <span>Ver las {allProjects.length} series →</span>
          </Link>
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {featured.map((project) => (
            <article
              key={project.id}
              className="group flex flex-col justify-between overflow-hidden border border-[#1D2021] bg-[#141617]/50 transition duration-500 hover:border-[#95836B]/60"
            >
              <div>
                <Link
                  href={`/projects/${project.slug}`}
                  className="block relative aspect-[3/2] w-full overflow-hidden bg-[#101112]"
                >
                  <Image
                    src={project.coverImage}
                    alt={project.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#101112] via-transparent to-transparent" />
                  
                  <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between font-mono text-[9px] uppercase tracking-widest text-[#95836B]">
                    <span>{project.discipline}</span>
                    <span>{project.year}</span>
                  </div>
                </Link>

                <div className="p-6">
                  <h3 className="text-xl font-light text-[#D8D5CD] group-hover:text-white transition-colors">
                    <Link href={`/projects/${project.slug}`}>
                      {project.title}
                    </Link>
                  </h3>
                  <p className="mt-2 text-xs text-neutral-400 font-light line-clamp-2">
                    {project.description}
                  </p>
                </div>
              </div>

              <div className="px-6 pb-6 pt-2 border-t border-[#1D2021]/60 flex items-center justify-between">
                <Link
                  href={`/projects/${project.slug}`}
                  className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.22em] text-[#95836B] group-hover:text-[#D8D5CD] transition-colors"
                >
                  <span>Explorar Ensayo</span>
                  <span className="transition-transform group-hover:translate-x-1">→</span>
                </Link>
                <span className="font-mono text-[10px] text-neutral-500">
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
