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
    </section>
  );
}
