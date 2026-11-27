import { HomeView, getHomeMetadata } from "@/lib/page-views";

export const metadata = getHomeMetadata("es");

export default function Home() {
  return <HomeView lang="es" />;
}
