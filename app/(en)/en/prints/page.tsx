import { PrintsView, getPrintsMetadata } from "@/lib/page-views";

export const metadata = getPrintsMetadata("en");

export default function EnPrintsPage() {
  return <PrintsView lang="en" />;
}
