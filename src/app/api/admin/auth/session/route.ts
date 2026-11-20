import { NextResponse } from "next/server";
import { currentAdmin } from "@/lib/admin/auth.server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try { return NextResponse.json({ admin: await currentAdmin() }); }
  catch { return NextResponse.json({ admin: null }, { status: 503 }); }
}
