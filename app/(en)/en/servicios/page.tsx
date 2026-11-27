import { ServiciosView, getServiciosMetadata } from "@/lib/page-views";

export const metadata = getServiciosMetadata("en");

export default function EnServiciosPage() {
  return <ServiciosView lang="en" />;
}
