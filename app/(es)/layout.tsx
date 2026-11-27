import type { ReactNode } from "react";
import { buildRootMetadata, sharedViewport, SiteRootShell } from "@/lib/root-layout";

export const viewport = sharedViewport;
export const metadata = buildRootMetadata("es");

export default function EsRootLayout({ children }: { children: ReactNode }) {
  return <SiteRootShell lang="es">{children}</SiteRootShell>;
}
