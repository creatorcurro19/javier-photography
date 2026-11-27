import { ClienteView, getClienteMetadata } from "@/lib/page-views";

export const metadata = getClienteMetadata("es");

export default function ClientePage() {
  return <ClienteView />;
}
