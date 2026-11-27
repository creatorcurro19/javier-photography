import { AboutView, getAboutMetadata } from "@/lib/page-views";

export const metadata = getAboutMetadata("es");

export default function AboutPage() {
  return <AboutView lang="es" />;
}
