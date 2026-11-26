import Image from "next/image";
import Link from "next/link";
import Container from "@/components/ui/Container";
import { getAllProjects } from "@/lib/photos";

export default function SelectedProjects() {
  const allProjects = getAllProjects();
  const featuredIds = ["custodios", "entre-la-bruma-y-el-volcan", "trazadas-rally"];
  const featured = featuredIds
    .map((id) => allProjects.find((p) => p.id === id))
    .filter((p): p is (typeof allProjects)[number] => Boolean(p));

  return (
    <section
      id="series"
      className="bg-[#0B0C0E] py-28 sm:py-36 border-t border-white/[0.08] scroll-mt-20"
      aria-label="Series Monográficas"
    >
      <Container>
        {/* Curatorial Header */}
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end pb-12 border-b border-white/[0.08]">
          <div className="max-w-2xl">
            <div className="flex items-center gap-3">
              <span className="h-px w-6 bg-white/30" />
              <p className="font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.4em] text-[#8E8A80]">
                Ensayos de Autor
              </p>
            </div>
            <h2 className="mt-3 font-serif text-3xl sm:text-4xl lg:text-5xl font-light text-[#EBE7DF] tracking-tight">
              Series Monográficas
            </h2>
            <p className="mt-4 text-sm sm:text-base font-light text-[#8E8A80] leading-relaxed">
              Cuerpos de obra meditados donde cada fotografía dialoga con la siguiente. Investigaciones visuales donde el territorio, la memoria colectiva y la técnica construyen una narrativa completa.
            </p>
          </div>

          <Link
            href="/projects"
            className="group inline-flex items-center gap-2.5 font-mono text-[11px] uppercase tracking-[0.28em] text-[#8E8A80] transition-colors duration-300 hover:text-[#EBE7DF]"
          >
            <span>Ver las {allProjects.length} Series Completas</span>
            <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
          </Link>
        </div>

        {/* Monograph Folios with Generous Editorial Rhythm */}
        <div className="mt-16 space-y-16 lg:space-y-24">
          {featured.map((project, idx) => {
            const isEven = idx % 2 === 1;

            return (
              <article
                key={project.id}
                className="group relative border border-white/[0.08] bg-[#151618] p-6 sm:p-10 lg:p-12 transition-all duration-500 hover:border-white/25"
              >
                <div
                  className={`grid gap-8 lg:gap-14 items-center lg:grid-cols-12 ${
                    isEven ? "lg:grid-flow-dense" : ""
                  }`}
                >
                  {/* Visual Artwork Display */}
                  <div
                    className={`lg:col-span-7 ${
                      isEven ? "lg:col-start-6" : ""
                    }`}
                  >
                    <Link
                      href={`/projects/${project.slug}`}
                      className="block relative aspect-[16/10] w-full overflow-hidden bg-[#0B0C0E]"
                    >
                      <Image
                        src={project.coverImage}
                        alt={`${project.title} — Ensayo fotográfico por Javier Espinosa`}
                        fill
                        sizes="(max-width: 1024px) 100vw, 55vw"
                        quality={85}
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0B0C0E]/60 via-transparent to-transparent pointer-events-none" />

                      <div className="absolute bottom-4 left-5 right-5 flex items-center justify-between font-mono text-[10px] uppercase tracking-widest text-[#8E8A80]">
                        <span className="bg-[#0B0C0E]/80 backdrop-blur-md px-2.5 py-1 border border-white/[0.08]">
                          {project.discipline}
                        </span>
                        <span className="bg-[#0B0C0E]/80 backdrop-blur-md px-2.5 py-1 border border-white/[0.08]">
                          {project.year}
                        </span>
                      </div>
                    </Link>
                  </div>

                  {/* Monograph Text & Curatorial Metadata */}
                  <div
                    className={`lg:col-span-5 flex flex-col justify-between ${
                      isEven ? "lg:col-start-1" : ""
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.3em] text-[#8E8A80]">
                        <span>ENSAYO 0{idx + 1}</span>
                        <span>·</span>
                        <span>{project.photoIds.length} OBRAS SELECCIONADAS</span>
                      </div>

                      <h3 className="mt-4 font-serif text-2xl sm:text-3xl lg:text-4xl font-light text-[#EBE7DF] tracking-tight leading-snug transition-colors duration-300 group-hover:text-white">
                        <Link href={`/projects/${project.slug}`}>
                          {project.title}
                        </Link>
                      </h3>

                      <p className="mt-4 text-sm sm:text-base font-light text-[#8E8A80] leading-relaxed">
                        {project.description}
                      </p>

                      <div className="mt-6 border-l-2 border-white/20 pl-4">
                        <p className="font-serif italic text-xs sm:text-sm text-[#EBE7DF]/85 font-light leading-relaxed">
                          {idx === 0 &&
                            "«En un mundo gobernado por la inmediatez, los oficios manuales y los ritos populares conservan el pulso y la dignidad de generaciones enteras.»"}
                          {idx === 1 &&
                            "«De las cumbres del Teide al alba a la penumbra de la laurisilva: la orografía volcánica modelada por el océano y la luz atlántica.»"}
                          {idx === 2 &&
                            "«La milésima de segundo donde convergen la masa en inercia, la gravilla despedida y la concentración absoluta del piloto.»"}
                        </p>
                      </div>
                    </div>

                    <div className="mt-8 pt-6 border-t border-white/[0.08] flex items-center justify-between">
                      <Link
                        href={`/projects/${project.slug}`}
                        className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.26em] text-[#EBE7DF] transition-colors duration-300 hover:text-white"
                      >
                        <span>Explorar Monografía</span>
                        <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                      </Link>

                      <span className="font-mono text-[10px] text-[#8E8A80]">
                        Canon EOS R7
                      </span>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
