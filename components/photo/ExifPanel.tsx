import type { Photo } from "@/types/photo";

type ExifPanelProps = {
  photo: Photo;
};

export default function ExifPanel({ photo }: ExifPanelProps) {
  const items = [
    { label: "Sensibilidad ISO", value: `ISO ${photo.iso}` },
    { label: "Diafragma", value: photo.aperture },
    { label: "Obturación", value: `${photo.shutter}` },
    { label: "Distancia Focal", value: photo.focalLength },
  ];

  const mmValue = Math.min(600, Math.max(10, parseInt(photo.focalLength, 10) || 50));
  // Escala logarítmica entre 10mm y 600mm para representar la compresión óptica real
  const focalPct = Math.round(
    ((Math.log(mmValue) - Math.log(10)) / (Math.log(600) - Math.log(10))) * 100
  );

  const PALETTES: Record<string, { hex: string; name: string }[]> = {
    "fauna-naturaleza": [
      { hex: "#161B15", name: "Bosque Profundo" },
      { hex: "#3A4B34", name: "Musgo" },
      { hex: "#7C6D52", name: "Liquen" },
      { hex: "#B5996D", name: "Ocre Cálido" },
      { hex: "#DFD7C8", name: "Luz Matinal" },
    ],
    "paisajes-documental": [
      { hex: "#141619", name: "Basalto" },
      { hex: "#3D2B22", name: "Tierra Umbra" },
      { hex: "#8B5A33", name: "Arena Sahariana" },
      { hex: "#C88A4B", name: "Ámbar Solar" },
      { hex: "#E6C79C", name: "Horizonte" },
    ],
    "coches-rally": [
      { hex: "#121417", name: "Neumático" },
      { hex: "#2B3036", name: "Asfalto Húmedo" },
      { hex: "#6B727A", name: "Acero" },
      { hex: "#A84232", name: "Rojo Competición" },
      { hex: "#DCD9D0", name: "Humo y Cal" },
    ],
    "arquitectura-urbana": [
      { hex: "#111214", name: "Penumbra" },
      { hex: "#332920", name: "Madera Verata" },
      { hex: "#6E5A46", name: "Granito y Adobe" },
      { hex: "#B58E58", name: "Luz de Farola" },
      { hex: "#E4DFD5", name: "Cal Blanca" },
    ],
    "viajes-cultura": [
      { hex: "#141210", name: "Fragua" },
      { hex: "#4A2E1B", name: "Cedro y Especia" },
      { hex: "#8C4A27", name: "Terracota" },
      { hex: "#C48B45", name: "Chispa Dorada" },
      { hex: "#E5DEC9", name: "Piedra" },
    ],
  };

  const swatches = PALETTES[photo.category] ?? PALETTES["paisajes-documental"];

  return (
    <section
      aria-labelledby="exif-heading"
      className="rounded-lg border border-[#202226] bg-[#202226]/30 p-7 sm:p-8"
    >
      <h2
        id="exif-heading"
        className="text-[11px] font-mono uppercase tracking-[0.3em] text-[#8E8A80]"
      >
        Parámetros de Disparo (EXIF)
      </h2>
      <dl className="mt-6 grid grid-cols-2 gap-x-8 gap-y-6">
        {items.map((item) => (
          <div key={item.label} className="border-l border-[#202226] pl-4">
            <dt className="text-[11px] font-mono uppercase tracking-[0.15em] text-[#A39E93]">
              {item.label}
            </dt>
            <dd className="mt-1.5 font-mono text-base font-light text-[#EBE7DF]">
              {item.value}
            </dd>
          </div>
        ))}
      </dl>

      {photo.exifWarning && (
        <div className="mt-5 border border-[#C5A880]/40 bg-[#C5A880]/10 p-3.5 font-mono text-[11px] leading-relaxed text-[#E5D3B3]">
          <p className="uppercase tracking-wider text-[#C5A880] font-semibold">
            Nota de verificación RAW:
          </p>
          <p className="mt-1">{photo.exifWarning}</p>
        </div>
      )}

      {/* Esquema visual del espectro óptico (10mm Ultra Angular a 600mm Superteleobjetivo) */}
      <div className="mt-7 border-t border-[#202226] pt-5">
        <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.2em] text-[#8E8A80]">
          <span>10mm · Gran Angular</span>
          <span className="text-[#EBE7DF] font-medium">Óptica: {photo.focalLength}</span>
          <span>600mm · Superteleobjetivo</span>
        </div>
        <div className="relative mt-2.5 h-1.5 w-full rounded-full bg-[#0B0C0E] border border-[#202226]">
          <div
            style={{ width: `${focalPct}%` }}
            className="h-full rounded-full bg-gradient-to-r from-[#8E8A80]/40 to-[#EBE7DF]"
          />
          <span
            style={{ left: `${focalPct}%` }}
            className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 h-3 w-3 rounded-full border-2 border-[#0B0C0E] bg-[#EBE7DF] shadow"
          />
        </div>
      </div>

      {/* Paleta Cromática Armónica para Interiorismo y Dirección de Arte */}
      <div className="mt-6 border-t border-[#202226] pt-5">
        <span className="block text-[10px] uppercase tracking-[0.2em] text-[#8E8A80]">
          Gama Tonal Dominante (Referencia de Interiorismo)
        </span>
        <div className="mt-3 grid grid-cols-5 gap-2">
          {swatches.map((s) => (
            <div key={s.hex} className="group flex flex-col items-center gap-1.5">
              <div
                style={{ backgroundColor: s.hex }}
                className="h-6 w-full rounded border border-white/10 shadow-inner"
                title={`${s.name} (${s.hex})`}
              />
              <span className="truncate max-w-full text-[9px] text-neutral-400">
                {s.hex}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
