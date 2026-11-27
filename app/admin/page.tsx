import type { Metadata } from "next";
import { cookies } from "next/headers";
import { WORKS, SERIES } from "@/data/works";
import { SITE_SETTINGS, CUADERNO_POSTS } from "@/data/site-config";
import { INITIAL_INBOX_ITEMS } from "@/data/inbox";
import { isValidSessionToken } from "@/lib/server/admin-auth";
import AdminPortal from "@/components/admin/AdminPortal";
import type { AdminSectionTab } from "@/components/admin/AdminMobileTabBar";
import { AndalusianPageBackdrop } from "@/components/ui/AndalusianMotif";

export const dynamic = "force-dynamic";

const ALLOWED_TABS = new Set<AdminSectionTab>(["photos", "series", "inbox", "alerts", "settings"]);

export const metadata: Metadata = {
  title: {
    absolute: "Panel de Gestión | Javier Espinosa",
  },
  description: "Portal privado de gestión editorial, obras, títulos, descripciones y precios Fine Art.",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("admin_session")?.value;
  const isAuth = isValidSessionToken(sessionToken);
  const resolvedParams = await searchParams;
  const rawTab = typeof resolvedParams?.tab === "string" ? resolvedParams.tab : "";
  const initialTab: AdminSectionTab = ALLOWED_TABS.has(rawTab as AdminSectionTab)
    ? (rawTab as AdminSectionTab)
    : "photos";

  return (
    <div className="relative min-h-[100dvh] overflow-x-clip bg-[#0B0C0E] text-[#EBE7DF]">
      <AndalusianPageBackdrop variant="laceria" />
      <div className="relative z-10">
        <AdminPortal
          initialTab={initialTab}
          initialWorks={isAuth ? WORKS : []}
          initialSeries={isAuth ? SERIES : []}
          initialSiteSettings={
            isAuth
              ? SITE_SETTINGS
              : {
                  authorPortraitUrl: "",
                  showAuthorPortrait: false,
                  showCuaderno: false,
                  contactEmail: "",
                  whatsappNumber: "",
                  instagramUrl: "",
                  locationLabel: "",
                  basePrintPrice: 0,
                  baseCommissionPrice: 0,
                  baseLicensePrice: 0,
                }
          }
          initialCuadernoPosts={isAuth ? CUADERNO_POSTS : []}
          initialInboxItems={isAuth ? INITIAL_INBOX_ITEMS : []}
        />
      </div>
    </div>
  );
}
