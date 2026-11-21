import { NextResponse } from "next/server";
import { isAuthenticatedRequest, getAdminUser } from "@/lib/server/admin-auth";

export async function GET(request: Request) {
  const isAuth = isAuthenticatedRequest(request);

  if (!isAuth) {
    return NextResponse.json({
      authenticated: false,
    });
  }

  return NextResponse.json({
    authenticated: true,
    user: getAdminUser(),
  });
}
