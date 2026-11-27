import { PortfolioView, getPortfolioMetadata } from "@/lib/page-views";

export const metadata = getPortfolioMetadata("es");

export default function PortfolioPage() {
  return <PortfolioView lang="es" />;
}
