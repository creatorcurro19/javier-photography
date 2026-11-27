import type { TrabajoItem } from "@/data/trabajos";

interface TrabajosSectionProps {
  items?: TrabajoItem[];
}

export default function TrabajosSection({ items = [] }: TrabajosSectionProps) {
  // No renderizar la sección mientras no existan trabajos o colaboraciones verificadas
  if (!items || items.length === 0) {
    return null;
  }

  return (
    <section
      aria-label="Trabajos y colaboraciones"
      className="border-t border-white/[0.08] pt-12"
    >
      <p className="font-mono text-xs uppercase tracking-[0.28em] text-[#C5A880]">
        Trabajos y colaboraciones
      </p>
      <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <article
            key={item.id}
            className="border border-white/[0.08] bg-[#151618] p-5"
          >
            <div className="flex items-center justify-between gap-2 font-mono text-[10px] uppercase tracking-wider text-[#A39E93]">
              <span>{item.clientOrMedium}</span>
              <span>{item.year}</span>
            </div>
            <h3 className="mt-2 font-serif text-lg text-[#EBE7DF]">
              {item.title}
            </h3>
            {item.description && (
              <p className="mt-2 text-xs font-light leading-relaxed text-[#8E8A80]">
                {item.description}
              </p>
            )}
            {item.url && (
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-block font-mono text-[10px] uppercase tracking-[0.2em] text-[#C5A880] hover:text-white"
              >
                Ver publicación ↗
              </a>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}
