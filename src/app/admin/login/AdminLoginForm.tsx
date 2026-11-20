"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

export function AdminLoginForm() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setMessage("");
    const form = new FormData(event.currentTarget);
    try {
      const response = await fetch("/api/admin/auth/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: form.get("email"), password: form.get("password") }) });
      const result = await response.json();
      if (!response.ok) { setMessage(result.message ?? "Sign in failed."); return; }
      router.replace("/admin"); router.refresh();
    } catch { setMessage("Could not connect. Check the site connection and try again."); }
    finally { setBusy(false); }
  }
  return <form className="admin-login-form" onSubmit={submit}>
    <label htmlFor="admin-email">Email address</label>
    <input id="admin-email" name="email" type="email" autoComplete="username" required maxLength={255} />
    <label htmlFor="admin-password">Password</label>
    <div className="admin-password-field">
      <input id="admin-password" name="password" type={showPassword ? "text" : "password"} autoComplete="current-password" required maxLength={200} />
      <button type="button" className="admin-password-toggle" onClick={() => setShowPassword((visible) => !visible)} aria-label={showPassword ? "Hide password" : "Show password"} aria-pressed={showPassword} aria-controls="admin-password">
        <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          {showPassword ? <><path d="M3 3l18 18"/><path d="M10.6 10.6a2 2 0 0 0 2.8 2.8"/><path d="M9.9 5.2A10.8 10.8 0 0 1 12 5c5.2 0 8.8 4.6 9.8 6.4a1.2 1.2 0 0 1 0 1.2 15 15 0 0 1-3.1 3.7"/><path d="M6.2 6.3a15.4 15.4 0 0 0-4 5.1 1.2 1.2 0 0 0 0 1.2C3.2 14.4 6.8 19 12 19a10.6 10.6 0 0 0 3.1-.5"/></> : <><path d="M2.2 12s3.5-7 9.8-7 9.8 7 9.8 7-3.5 7-9.8 7-9.8-7-9.8-7Z"/><circle cx="12" cy="12" r="3"/></>}
        </svg>
      </button>
    </div>
    {message && <p className="admin-error" role="alert">{message}</p>}
    <button type="submit" className="admin-primary-button admin-login-submit" disabled={busy}>{busy ? "Signing in…" : "Sign in to admin"}</button>
  </form>;
}
