import type { Metadata } from "next";
import type { ReactNode } from "react";
import { adminViewport, buildRootMetadata, SiteRootShell } from "@/lib/root-layout";

export const viewport = adminViewport;
export const metadata: Metadata = {
  ...buildRootMetadata("es"),
  applicationName: "Estudio Javier Espinosa · Admin",
  manifest: "/admin/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    title: "J.E. Admin",
    statusBarStyle: "black-translucent",
  },
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({ children }: { children: ReactNode }) {
  return (
    <SiteRootShell lang="es" hideChrome>
      {children}
    </SiteRootShell>
  );
}
