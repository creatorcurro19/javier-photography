import { HomeView, getHomeMetadata } from "@/lib/page-views";

export const metadata = getHomeMetadata("en");

export default function EnHome() {
  return <HomeView lang="en" />;
}
