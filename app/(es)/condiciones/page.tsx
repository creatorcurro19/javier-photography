import { CondicionesView, getCondicionesMetadata } from "@/lib/page-views";

export const metadata = getCondicionesMetadata("es");

export default function CondicionesPage() {
  return <CondicionesView lang="es" />;
}
