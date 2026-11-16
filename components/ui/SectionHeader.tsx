type SectionHeaderProps = {
  label: string;
  title: string;
  description?: string;
  className?: string;
};

export default function SectionHeader({
  label,
  title,
  description,
  className = "",
}: SectionHeaderProps) {
  return (
    <header className={className}>
      <p className="mb-4 text-xs font-mono uppercase tracking-[0.35em] text-[#95836B]">
        {label}
      </p>
      <h2 className="font-serif text-3xl font-light tracking-wide leading-[1.15] text-[#D8D5CD] md:text-5xl">
        {title}
      </h2>
      {description && (
        <p className="mt-5 max-w-2xl text-base leading-relaxed text-[#D8D5CD]/80 font-light">
          {description}
        </p>
      )}
    </header>
  );
}
