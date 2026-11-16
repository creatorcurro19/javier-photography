import type { Photo } from "@/types/photo";

type EquipmentPanelProps = {
  photo: Photo;
};

export default function EquipmentPanel({ photo }: EquipmentPanelProps) {
  return (
    <section
      aria-labelledby="equipment-heading"
      className="rounded-lg border border-[#1D2021] bg-[#1D2021]/30 p-7 sm:p-8"
    >
      <h2
        id="equipment-heading"
        className="text-[11px] font-mono uppercase tracking-[0.3em] text-[#95836B]"
      >
        Equipo Técnico Utilizado
      </h2>
      <dl className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
        <div className="border-l border-[#1D2021] pl-4">
          <dt className="text-[11px] font-mono uppercase tracking-[0.15em] text-[#95836B]">
            Cuerpo de Cámara
          </dt>
          <dd className="mt-1.5 font-mono text-base font-light text-[#D8D5CD]">
            {photo.camera}
          </dd>
        </div>
        <div className="border-l border-[#1D2021] pl-4">
          <dt className="text-[11px] font-mono uppercase tracking-[0.15em] text-[#95836B]">
            Óptica
          </dt>
          <dd className="mt-1.5 font-mono text-sm font-light text-[#D8D5CD]">
            {photo.lens}
          </dd>
        </div>
      </dl>
    </section>
  );
}
