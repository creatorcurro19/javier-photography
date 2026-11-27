import { NextResponse } from "next/server";
import {
  extractSessionToken,
  isSameOriginRequest,
  revokeSessionToken,
} from "@/lib/server/admin-auth";

export async function POST(request: Request) {
  if (!isSameOriginRequest(request)) {
    return NextResponse.json(
      { ok: false, error: "Origen de solicitud no permitido." },
      { status: 403 }
    );
  }

  revokeSessionToken(extractSessionToken(request));

  const response = NextResponse.json(
    {
      ok: true,
      message: "Sesión cerrada correctamente",
    },
    { headers: { "Cache-Control": "no-store" } }
  );

  response.cookies.set({
    name: "admin_session",
    value: "",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0,
    path: "/",
  });

  return response;
}
