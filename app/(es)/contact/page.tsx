import { ContactView, getContactMetadata } from "@/lib/page-views";

export const metadata = getContactMetadata("es");

export default function ContactPage() {
  return <ContactView />;
}
