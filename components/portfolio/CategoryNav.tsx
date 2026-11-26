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
      className="flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth whitespace-nowrap pb-3 -mx-4 px-4 md:mx-0 md:px-0 md:flex-wrap md:overflow-visible"
    >
      <Link
        href="/portfolio"
        className={`shrink-0 inline-flex min-h-[44px] items-center rounded-full px-4 py-2 font-mono text-xs uppercase tracking-[0.18em] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${
          activeCategory
            ? "border border-white/[0.12] bg-[#151618] text-[#A39E93] hover:border-white/30 hover:text-white"
            : "border border-[#C5A880] bg-[#C5A880] text-[#0B0C0E] font-semibold"
        }`}
      >
        Todas
      </Link>

      {categories.map(({ category, count }) => {
        const info = CATEGORY_METADATA[category];
        const isActive = activeCategory === category;

        return (
          <Link
            key={category}
            href={`/portfolio/${category}`}
            className={`shrink-0 inline-flex min-h-[44px] items-center rounded-full px-4 py-2 font-mono text-xs uppercase tracking-[0.18em] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${
              isActive
                ? "border border-[#C5A880] bg-[#C5A880] text-[#0B0C0E] font-semibold"
                : "border border-white/[0.12] bg-[#151618] text-[#EBE7DF] hover:border-[#C5A880]/60 hover:text-white"
            }`}
          >
            <span>{info?.title ?? category}</span>
            <span className={`ml-1.5 text-[10px] ${isActive ? "text-[#0B0C0E]/75" : "text-[#8E8A80]"}`}>
              ({count})
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
