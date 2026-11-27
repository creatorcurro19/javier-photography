import { ServiciosView, getServiciosMetadata } from "@/lib/page-views";

export const metadata = getServiciosMetadata("es");

export default function ServiciosPage() {
  return <ServiciosView lang="es" />;
}
