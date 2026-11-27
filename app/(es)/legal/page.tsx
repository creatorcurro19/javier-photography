import { LegalView, getLegalMetadata } from "@/lib/page-views";

export const metadata = getLegalMetadata("es");

export default function LegalPage() {
  return <LegalView />;
}
