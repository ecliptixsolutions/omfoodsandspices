import { NextResponse } from "next/server";
import { requireSameOrigin, signOut } from "@/lib/admin/auth.server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    await requireSameOrigin(request);
    await signOut();
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false, message: "Could not securely end the session." }, { status: 403 });
  }
}
