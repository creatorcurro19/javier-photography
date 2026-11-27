import { PortfolioView, getPortfolioMetadata } from "@/lib/page-views";

export const metadata = getPortfolioMetadata("en");

export default function EnPortfolioPage() {
  return <PortfolioView lang="en" />;
}
