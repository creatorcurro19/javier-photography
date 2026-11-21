import { NextResponse } from "next/server";
import { isAuthenticatedRequest } from "@/lib/server/admin-auth";
import {
  getInboxItems,
  updateInboxItem,
  deleteInboxItem,
} from "@/lib/server/inbox-store";

export async function GET(request: Request) {
  if (!isAuthenticatedRequest(request)) {
    return NextResponse.json({ ok: false, error: "No autorizado" }, { status: 401 });
  }

  const items = getInboxItems();
  return NextResponse.json({ ok: true, items });
}

export async function PATCH(request: Request) {
  if (!isAuthenticatedRequest(request)) {
    return NextResponse.json({ ok: false, error: "No autorizado" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { id, status, notes } = body;
    if (!id) {
      return NextResponse.json({ ok: false, error: "ID requerido" }, { status: 400 });
    }

    const updated = await updateInboxItem(id, { status, notes });
    if (!updated) {
      return NextResponse.json({ ok: false, error: "Registro no encontrado" }, { status: 404 });
    }

    return NextResponse.json({ ok: true, item: updated });
  } catch (err) {
    console.error("[api/admin/inbox] Error actualizando:", err);
    return NextResponse.json({ ok: false, error: "Error en el servidor" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  if (!isAuthenticatedRequest(request)) {
    return NextResponse.json({ ok: false, error: "No autorizado" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ ok: false, error: "ID requerido" }, { status: 400 });
    }

    const deleted = await deleteInboxItem(id);
    return NextResponse.json({ ok: true, deleted });
  } catch (err) {
    console.error("[api/admin/inbox] Error eliminando:", err);
    return NextResponse.json({ ok: false, error: "Error en el servidor" }, { status: 500 });
  }
}
