import { StoriesView, getStoriesMetadata } from "@/lib/page-views";

export const metadata = getStoriesMetadata("es");

export default function StoriesPage() {
  return <StoriesView />;
}
