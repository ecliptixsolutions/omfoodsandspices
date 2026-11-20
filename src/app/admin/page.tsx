import { redirect } from "next/navigation";
import { currentAdmin } from "@/lib/admin/auth.server";
import { AdminConsole } from "./AdminConsole";

export const dynamic = "force-dynamic";
export const metadata = { title: "Website Admin | OM Food and Spices LLP", robots: { index: false, follow: false } };

export default async function AdminPage() {
  let admin;
  try { admin = await currentAdmin(); } catch { redirect("/admin/login?setup=database"); }
  if (!admin) redirect("/admin/login");
  return <AdminConsole email={admin.email} role={admin.role} />;
}
