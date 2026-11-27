import { NextResponse } from "next/server";
import {
  isAuthenticatedRequest,
  getAdminUser,
  isDefaultPinActive,
} from "@/lib/server/admin-auth";

export async function GET(request: Request) {
  const isAuth = isAuthenticatedRequest(request);

  if (!isAuth) {
    return NextResponse.json(
      { authenticated: false },
      { headers: { "Cache-Control": "no-store" } }
    );
  }

  return NextResponse.json(
    {
      authenticated: true,
      user: getAdminUser(),
      usingDefaultPin: isDefaultPinActive(),
    },
    { headers: { "Cache-Control": "no-store" } }
  );
}
