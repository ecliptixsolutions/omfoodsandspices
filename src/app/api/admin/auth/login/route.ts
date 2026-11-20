import { NextResponse } from "next/server";
import { requireSameOrigin, signIn } from "@/lib/admin/auth.server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    await requireSameOrigin(request);
    const body = await request.json();
    const email = typeof body.email === "string" ? body.email.trim() : "";
    const password = typeof body.password === "string" ? body.password : "";
    if (email.length > 255 || password.length < 1 || password.length > 200 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ ok: false, message: "Enter a valid email and password." }, { status: 400 });
    }
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
    if (!(await signIn(email, password, ip))) return NextResponse.json({ ok: false, message: "Email or password is incorrect, or sign-in is temporarily locked." }, { status: 401 });
    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof Error && error.message === "Invalid request origin") return NextResponse.json({ ok: false, message: "Request could not be verified." }, { status: 403 });
    console.error("Admin sign-in failed", error);
    return NextResponse.json({ ok: false, message: "Admin sign-in is unavailable. Check that MySQL is configured." }, { status: 503 });
  }
}
