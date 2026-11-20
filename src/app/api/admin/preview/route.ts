import { NextResponse } from "next/server";
import { requireAdmin, requireSameOrigin, setAdminPreview } from "@/lib/admin/auth.server";
export const runtime="nodejs";export const dynamic="force-dynamic";
export async function POST(request:Request){try{await requireSameOrigin(request);await requireAdmin(["owner","manager","editor"]);await setAdminPreview(true);return NextResponse.json({ok:true});}catch(e){const message=e instanceof Error?e.message:"Request failed.";const status=message==="Unauthorized"?401:403;return NextResponse.json({message},{status});}}
export async function DELETE(request:Request){try{await requireSameOrigin(request);await requireAdmin();await setAdminPreview(false);return NextResponse.json({ok:true});}catch(e){const message=e instanceof Error?e.message:"Request failed.";const status=message==="Unauthorized"?401:403;return NextResponse.json({message},{status});}}
