import { AboutView, getAboutMetadata } from "@/lib/page-views";

export const metadata = getAboutMetadata("en");

export default function EnAboutPage() {
  return <AboutView lang="en" />;
}
