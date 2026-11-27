import type { ReactNode } from "react";
import { buildRootMetadata, sharedViewport, SiteRootShell } from "@/lib/root-layout";

export const viewport = sharedViewport;
export const metadata = buildRootMetadata("en");

export default function EnRootLayout({ children }: { children: ReactNode }) {
  return <SiteRootShell lang="en">{children}</SiteRootShell>;
}
