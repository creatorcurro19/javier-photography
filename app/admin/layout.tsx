import type { ReactNode } from "react";
import { buildRootMetadata, sharedViewport, SiteRootShell } from "@/lib/root-layout";

export const viewport = sharedViewport;
export const metadata = {
  ...buildRootMetadata("es"),
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({ children }: { children: ReactNode }) {
  return <SiteRootShell lang="es">{children}</SiteRootShell>;
}
