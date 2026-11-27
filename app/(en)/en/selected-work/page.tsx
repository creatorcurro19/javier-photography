import { SelectedWorkView, getSelectedWorkMetadata } from "@/lib/page-views";

export const metadata = getSelectedWorkMetadata("en");

export default function EnSelectedWorkPage() {
  return <SelectedWorkView lang="en" />;
}
