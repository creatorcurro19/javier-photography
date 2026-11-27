import { StoriesView, getStoriesMetadata } from "@/lib/page-views";

export const metadata = getStoriesMetadata("en");

export default function EnStoriesPage() {
  return <StoriesView />;
}
