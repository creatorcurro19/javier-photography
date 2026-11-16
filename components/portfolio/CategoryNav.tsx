import Link from "next/link";
import { getCategoriesWithCount } from "@/lib/photos";
import { CATEGORY_METADATA } from "@/types/photo";
import type { PhotoCategory } from "@/types/photo";

type CategoryNavProps = {
  activeCategory?: PhotoCategory;
};

export default function CategoryNav({ activeCategory }: CategoryNavProps) {
  const categories = getCategoriesWithCount();

  return (
    <nav
      aria-label="Colecciones de fotografía"
      className="flex items-center gap-x-6 gap-y-3 overflow-x-auto whitespace-nowrap border-b border-neutral-800 pb-4 md:flex-wrap md:overflow-visible md:pb-6"
    >
      <Link
        href="/portfolio"
        className={`shrink-0 text-xs uppercase tracking-[0.25em] transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white ${
          activeCategory ? "text-neutral-400 hover:text-neutral-200" : "text-neutral-100 font-medium border-b border-neutral-300 pb-1"
        }`}
      >
        Todas las Obras
      </Link>

      {categories.map(({ category, count }) => {
        const info = CATEGORY_METADATA[category];
        const isActive = activeCategory === category;

        return (
          <Link
            key={category}
            href={`/portfolio/${category}`}
            className={`shrink-0 text-xs uppercase tracking-[0.25em] transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white ${
              isActive
                ? "text-neutral-100 font-medium border-b border-neutral-300 pb-1"
                : "text-neutral-400 hover:text-neutral-200"
            }`}
          >
            {info?.title ?? category}
            <span className="ml-1.5 font-mono text-[11px] text-neutral-600">({count})</span>
          </Link>
        );
      })}
    </nav>
  );
}
