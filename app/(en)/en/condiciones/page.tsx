import { CondicionesView, getCondicionesMetadata } from "@/lib/page-views";

export const metadata = getCondicionesMetadata("en");

export default function EnCondicionesPage() {
  return <CondicionesView lang="en" />;
}
