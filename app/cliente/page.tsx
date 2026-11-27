import Container from "@/components/ui/Container";
import ClientPortal from "@/components/client/ClientPortal";
import { AndalusianPageBackdrop } from "@/components/ui/AndalusianMotif";
import { buildPageMetadata } from "@/lib/metadata";

export const metadata = buildPageMetadata({
  title: "Acceso Clientes | Javier Espinosa",
  description:
    "Portal privado de entrega y selección de reportajes fotográficos de autor para clientes y medios.",
  path: "/cliente",
  robots: {
    index: false,
    follow: false,
  },
});

export default function ClientePage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0B0C0E] pt-36 pb-28 text-[#EBE7DF]">
      <AndalusianPageBackdrop variant="laceria" />
      <Container className="relative z-10">
        <ClientPortal />
      </Container>
    </div>
  );
}
