import { ContactView, getContactMetadata } from "@/lib/page-views";

export const metadata = getContactMetadata("en");

export default function EnContactPage() {
  return <ContactView lang="en" />;
}
