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
      <p className="mb-3 text-[10px] sm:text-xs uppercase tracking-[0.35em] text-[#8E8A80]">
        {label}
      </p>
      <h2 className="text-3xl font-light tracking-tight leading-[1.15] text-[#EBE7DF] sm:text-4xl md:text-5xl">
        {title}
      </h2>
      {description && (
        <p className="mt-4 max-w-2xl text-sm sm:text-base leading-relaxed text-[#EBE7DF]/75 font-light">
          {description}
        </p>
      )}
    </header>
  );
}
