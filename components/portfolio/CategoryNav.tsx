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
      className="flex items-center gap-x-6 gap-y-3 overflow-x-auto no-scrollbar scroll-smooth whitespace-nowrap border-b border-[#1D2021] pb-4 -mx-4 px-4 md:mx-0 md:px-0 md:flex-wrap md:overflow-visible md:pb-6"
    >
      <Link
        href="/portfolio"
        className={`shrink-0 text-xs uppercase tracking-[0.25em] transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white ${
          activeCategory ? "text-neutral-400 hover:text-[#D8D5CD]" : "text-[#D8D5CD] font-medium border-b-2 border-[#95836B] pb-1"
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
                ? "text-[#D8D5CD] font-medium border-b-2 border-[#95836B] pb-1"
                : "text-neutral-400 hover:text-[#D8D5CD]"
            }`}
          >
            <span>{info?.title ?? category}</span>
            <span className="ml-1.5 font-mono text-[10px] text-[#95836B]">({count})</span>
          </Link>
        );
      })}
    </nav>
  );
}
