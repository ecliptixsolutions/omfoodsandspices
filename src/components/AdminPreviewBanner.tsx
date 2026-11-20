"use client";

export function AdminPreviewBanner(){
  async function exit(){const r=await fetch("/api/admin/preview",{method:"DELETE"});if(r.ok)window.location.reload();}
  return <div className="admin-preview-banner"><span><b>Draft preview</b> · Only visible in this signed-in admin session. Changes are not public until published.</span><button type="button" onClick={exit}>Exit preview</button></div>;
}
