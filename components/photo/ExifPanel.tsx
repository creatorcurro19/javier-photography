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

  return (
    <section
      aria-labelledby="exif-heading"
      className="rounded-lg border border-[#1D2021] bg-[#1D2021]/30 p-7 sm:p-8"
    >
      <h2
        id="exif-heading"
        className="text-[11px] font-mono uppercase tracking-[0.3em] text-[#95836B]"
      >
        Parámetros de Disparo (EXIF)
      </h2>
      <dl className="mt-6 grid grid-cols-2 gap-x-8 gap-y-6">
        {items.map((item) => (
          <div key={item.label} className="border-l border-[#1D2021] pl-4">
            <dt className="text-[11px] font-mono uppercase tracking-[0.15em] text-[#95836B]">
              {item.label}
            </dt>
            <dd className="mt-1.5 font-mono text-base font-light text-[#D8D5CD]">
              {item.value}
            </dd>
          </div>
        ))}
      </dl>

      {/* Esquema visual del espectro óptico (10mm Ultra Angular a 600mm Superteleobjetivo) */}
      <div className="mt-7 border-t border-[#1D2021] pt-5">
        <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.2em] text-[#95836B]">
          <span>10mm · Gran Angular</span>
          <span className="text-[#D8D5CD] font-medium">Óptica: {photo.focalLength}</span>
          <span>600mm · Superteleobjetivo</span>
        </div>
        <div className="relative mt-2.5 h-1.5 w-full rounded-full bg-[#101112] border border-[#1D2021]">
          <div
            style={{ width: `${focalPct}%` }}
            className="h-full rounded-full bg-gradient-to-r from-[#95836B]/40 to-[#D8D5CD]"
          />
          <span
            style={{ left: `${focalPct}%` }}
            className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 h-3 w-3 rounded-full border-2 border-[#101112] bg-[#D8D5CD] shadow"
          />
        </div>
      </div>
    </section>
  );
}
