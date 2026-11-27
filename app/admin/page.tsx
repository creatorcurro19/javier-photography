import type { Metadata } from "next";
import { cookies } from "next/headers";
import { WORKS, SERIES } from "@/data/works";
import { SITE_SETTINGS, CUADERNO_POSTS } from "@/data/site-config";
import { INITIAL_INBOX_ITEMS } from "@/data/inbox";
import { isValidSessionToken } from "@/lib/server/admin-auth";
import AdminPortal from "@/components/admin/AdminPortal";
import { AndalusianPageBackdrop } from "@/components/ui/AndalusianMotif";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Estudio de Autor · Panel de Gestión | Javier Espinosa",
  description: "Portal privado de gestión editorial, obras, títulos, descripciones y precios Fine Art.",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminPage() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("admin_session")?.value;
  const isAuth = isValidSessionToken(sessionToken);

  return (
    <div className="relative min-h-screen overflow-x-clip bg-[#0B0C0E] text-[#EBE7DF] pt-24 sm:pt-28">
      <AndalusianPageBackdrop variant="laceria" />
      <div className="relative z-10">
        <AdminPortal
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
