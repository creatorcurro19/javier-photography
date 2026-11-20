import { AndalusianStarMark } from "@/components/ui/AndalusianMotif";

export default function Loading() {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Cargando sala de exposición"
      className="flex min-h-[75vh] flex-col items-center justify-center bg-[#0B0C0E] pt-24 pb-20 text-[#EBE7DF]"
    >
      <div className="flex items-center gap-3">
        <AndalusianStarMark className="h-4 w-4 animate-pulse text-[#C5A880]" />
        <span className="font-mono text-[11px] uppercase tracking-[0.38em] text-[#8E8A80]">
          Preparando Sala...
        </span>
        <AndalusianStarMark className="h-4 w-4 animate-pulse text-[#C5A880]" />
      </div>
    </div>
  );
}
