import type { Metadata } from "next";
import { WORKS, SERIES } from "@/data/works";
import AdminPortal from "@/components/admin/AdminPortal";
import { AndalusianPageBackdrop } from "@/components/ui/AndalusianMotif";

export const metadata: Metadata = {
  title: "Estudio de Autor · Panel de Gestión | Javier Espinosa",
  description: "Portal privado de gestión editorial, obras, títulos, descripciones y precios Fine Art.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0B0C0E] text-[#EBE7DF] pt-24 sm:pt-28">
      <AndalusianPageBackdrop variant="laceria" />
      <div className="relative z-10">
        <AdminPortal
          initialWorks={WORKS}
          initialSeries={SERIES.map((s) => ({
            slug: s.slug,
            title: s.title,
            category: s.category,
            photoIds: s.photoIds,
          }))}
        />
      </div>
    </div>
  );
}
