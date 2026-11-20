import type { Metadata } from "next";
import { Logo } from "@/components/Logo";
import { AdminLoginForm } from "./AdminLoginForm";
import { currentAdmin } from "@/lib/admin/auth.server";
import { redirect } from "next/navigation";

export const metadata: Metadata = { title: "Admin sign in | OM Food and Spices LLP", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function AdminLoginPage() {
  let signedIn = false;
  try { signedIn = Boolean(await currentAdmin()); } catch { /* login page explains missing database setup */ }
  if (signedIn) redirect("/admin");
  return <div className="admin-login-page" data-admin-root>
    <div className="admin-login-card">
      <Logo className="admin-login-logo" />
      <p className="admin-eyebrow">Secure owner access</p>
      <h1>Welcome back</h1>
      <p className="admin-muted">Sign in to manage your website and customer enquiries.</p>
      <AdminLoginForm />
      <p className="admin-security-note">Protected access · Secure server-side session</p>
    </div>
  </div>;
}
