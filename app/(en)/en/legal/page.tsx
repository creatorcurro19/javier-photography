import { LegalView, getLegalMetadata } from "@/lib/page-views";

export const metadata = getLegalMetadata("en");

export default function EnLegalPage() {
  return <LegalView lang="en" />;
}
