import { ClienteView, getClienteMetadata } from "@/lib/page-views";

export const metadata = getClienteMetadata("en");

export default function EnClientePage() {
  return <ClienteView />;
}
