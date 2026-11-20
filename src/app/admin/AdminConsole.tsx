"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import type { Product } from "@/content/products";
const ContentManager=dynamic(()=>import("./ContentManager").then(m=>m.ContentManager),{loading:LoadingPanel});
const MediaManager=dynamic(()=>import("./MediaManager").then(m=>m.MediaManager),{loading:LoadingPanel});
const CategoryManager=dynamic(()=>import("./CategoryManager").then(m=>m.CategoryManager),{loading:LoadingPanel});
const AdminUsers=dynamic(()=>import("./AdminUsers").then(m=>m.AdminUsers),{loading:LoadingPanel});
const WebsiteSections=dynamic(()=>import("./WebsiteSections").then(m=>m.WebsiteSections),{loading:LoadingPanel});
const BlogManager=dynamic(()=>import("./BlogManager").then(m=>m.BlogManager),{loading:LoadingPanel});

function LoadingPanel(){return <section className="admin-card"><p role="status">Loading section…</p></section>;}

type Tab = "blogs" | "blog-categories" | "blog-media" | "blog-seo" | "products" | "categories" | "home" | "sections" | "enquiries" | "users";
type ProductRecord = { id: string; slug: string; category: string; status: string; displayOrder: number; draft: Product; published: Product | null; updatedAt: string };
type EnquiryRecord = { id: string; type: string; customer_name: string; company_name: string; email: string; phone: string; country: string; product_names: string[] | string; message: string; status: string; created_at: string };
type EnquiryNote = { id:string; note:string; created_at:string; email:string|null };
type AdminCategory={id:string;slug:string;name:string;status:string};

const blank: Product = { slug: "", name: "", shortName: "", category: "onion", form: "flakes", description: "", overview: "", forms: [], applications: [], image: "", imageAlt: "", galleryImages: [], seoTitle: "", seoDescription: "" };
const tabs: { id: Tab; label: string; mark: string }[] = [{id:"blogs",label:"Blogs",mark:"▤"},{id:"blog-categories",label:"Blog Categories",mark:"◈"},{id:"blog-media",label:"Blog Media",mark:"▣"},{id:"blog-seo",label:"Blog SEO Settings",mark:"⚙"},{ id: "products", label: "Products", mark: "▧" }, { id: "categories", label: "Categories", mark: "◈" }, { id: "home", label: "Homepage", mark: "⌂" }, { id: "sections", label: "Website Sections", mark: "▤" }, { id: "enquiries", label: "Enquiries", mark: "✉" }, { id: "users", label: "Admin Users", mark: "♙" }, ];
// Keep the shared desktop/mobile navigation alphabetical, including future sections.
tabs.sort((a, b) => a.label.localeCompare(b.label, "en"));

export function AdminConsole({ email, role }: { email: string; role: string }) {
  const [tab, setTab] = useState<Tab>("products");
  const [productRows, setProductRows] = useState<ProductRecord[]>([]);
  const [categories,setCategories]=useState<AdminCategory[]>([]);
  const [enquiries, setEnquiries] = useState<EnquiryRecord[]>([]);
  const [query, setQuery] = useState("");
  const [enquiryStatus,setEnquiryStatusFilter]=useState("");
  const [enquiryPage,setEnquiryPage]=useState(1);
  const [enquiryTotal,setEnquiryTotal]=useState(0);
  const [dateFrom,setDateFrom]=useState("");
  const [dateTo,setDateTo]=useState("");
  const [selectedEnquiry,setSelectedEnquiry]=useState<EnquiryRecord|null>(null);
  const [enquiryNotes,setEnquiryNotes]=useState<EnquiryNote[]>([]);
  const [noteDraft,setNoteDraft]=useState("");
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");
  const [editing, setEditing] = useState<ProductRecord | null>(null);
  const [product, setProduct] = useState<Product>(blank);
  const canEdit = ["owner", "manager", "editor"].includes(role);

  const loadProducts = useCallback(async () => { const r = await fetch("/api/admin/products", { cache: "no-store" }); if (r.ok) setProductRows((await r.json()).products); else setNotice("Unable to load products."); }, []);
  const loadCategories = useCallback(async () => { const r=await fetch("/api/admin/categories",{cache:"no-store"});if(r.ok)setCategories((await r.json()).categories);else setNotice("Unable to load categories.");},[]);
  const loadEnquiries = useCallback(async () => { const params=new URLSearchParams({q:query,page:String(enquiryPage)});if(enquiryStatus)params.set("status",enquiryStatus);if(dateFrom)params.set("from",dateFrom);if(dateTo)params.set("to",dateTo);const r=await fetch(`/api/admin/enquiries?${params}`,{cache:"no-store"});if(r.ok){const d=await r.json();setEnquiries(d.enquiries);setEnquiryTotal(d.total);}else setNotice("Unable to load enquiries."); }, [query,enquiryPage,enquiryStatus,dateFrom,dateTo]);
  useEffect(() => { if (tab === "products") {void loadProducts();void loadCategories();} if (tab === "categories") void loadCategories(); if (tab === "enquiries") void loadEnquiries(); }, [tab, loadProducts, loadCategories, loadEnquiries]);

  const logoutDialog = useRef<HTMLDialogElement>(null);
  const [logoutError, setLogoutError] = useState("");
  async function logout() {
    setBusy(true); setLogoutError("");
    try {
      const response = await fetch("/api/admin/auth/logout", { method: "POST" });
      if (!response.ok) throw new Error("Could not securely log out. Please try again.");
      window.location.assign("/admin/login");
    } catch { setLogoutError("Could not securely log out. Please try again."); }
    finally { setBusy(false); }
  }
  async function previewWebsite(){const previewTab=window.open("about:blank","_blank");if(!previewTab){setNotice("Allow pop-ups to open the private website preview.");return;}try{const r=await fetch("/api/admin/preview",{method:"POST"});if(!r.ok){previewTab.close();setNotice("Could not start the private preview.");return;}previewTab.location.href="/";}catch{previewTab.close();setNotice("Could not start the private preview.");}}
  function edit(record?: ProductRecord) { setEditing(record ?? { id: "", slug: "", category: "onion", status: "draft", displayOrder: productRows.length, draft: { ...blank }, published: null, updatedAt: "" }); setProduct(record?.draft ? { ...record.draft } : { ...blank }); setNotice(""); }
  function setField<K extends keyof Product>(key: K, value: Product[K]) { setProduct((prev) => ({ ...prev, [key]: value })); }
  async function saveProduct(publish: boolean) {
    setBusy(true); setNotice("");
    try {
      const response = await fetch("/api/admin/products", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: editing?.id || undefined, product, publish, displayOrder: editing?.displayOrder ?? productRows.length }) });
      const result = await response.json();
      if (!response.ok) { setNotice(result.message ?? "Could not save product."); return; }
      setNotice(publish ? "Product published to the website." : "Draft saved. The live website is unchanged."); setEditing(null); await loadProducts();
    } catch { setNotice("Could not reach the server."); } finally { setBusy(false); }
  }
  async function deleteProduct(record: ProductRecord) {
    if (!window.confirm(`Delete “${record.draft.name}”? This cannot be undone.`)) return;
    setBusy(true);
    try { const response = await fetch("/api/admin/products", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: record.id }) }); const result = await response.json(); if (!response.ok) { setNotice(result.message); return; } setNotice("Product deleted."); await loadProducts(); }
    finally { setBusy(false); }
  }
  async function setEnquiryStatus(id: string, status: string) {
    const r = await fetch("/api/admin/enquiries", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, status }) });
    if (r.ok) { setEnquiries((rows) => rows.map((x) => x.id === id ? { ...x, status } : x)); if(selectedEnquiry?.id===id)setSelectedEnquiry({...selectedEnquiry,status}); } else setNotice("Could not update enquiry.");
  }
  async function openEnquiry(row:EnquiryRecord){setSelectedEnquiry(row);setNoteDraft("");const r=await fetch(`/api/admin/enquiries?id=${row.id}`,{cache:"no-store"});if(r.ok)setEnquiryNotes((await r.json()).notes);}
  async function addEnquiryNote(){if(!selectedEnquiry||!noteDraft.trim())return;const r=await fetch("/api/admin/enquiries",{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({id:selectedEnquiry.id,note:noteDraft.trim()})});const d=await r.json();if(!r.ok){setNotice(d.message??"Could not save note.");return;}setNoteDraft("");await openEnquiry(selectedEnquiry);}
  async function deleteEnquiry(){if(!selectedEnquiry||!window.confirm(`Delete this enquiry from ${selectedEnquiry.customer_name}?`))return;const r=await fetch("/api/admin/enquiries",{method:"DELETE",headers:{"Content-Type":"application/json"},body:JSON.stringify({id:selectedEnquiry.id})});const d=await r.json();if(!r.ok){setNotice(d.message??"Could not delete enquiry.");return;}setSelectedEnquiry(null);await loadEnquiries();}
  async function exportCsv() {
    const fields = ["customer_name", "company_name", "email", "phone", "country", "product_names", "status", "created_at", "message"] as const;
    const all:EnquiryRecord[]=[];for(let page=1;page<=Math.min(500,Math.ceil(enquiryTotal/50));page++){const params=new URLSearchParams({q:query,page:String(page)});if(enquiryStatus)params.set("status",enquiryStatus);if(dateFrom)params.set("from",dateFrom);if(dateTo)params.set("to",dateTo);const r=await fetch(`/api/admin/enquiries?${params}`,{cache:"no-store"});if(!r.ok)throw new Error("Could not export enquiries.");all.push(...(await r.json()).enquiries as EnquiryRecord[]);}
    const csv = [fields.join(","), ...all.map((row) => fields.map((key) => `"${String(row[key] ?? "").replace(/^[=+@\-\t\r]/, "'$&").replaceAll('"', '""')}"`).join(","))].join("\r\n");
    const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" })); a.download = "om-food-enquiries.csv"; a.click(); URL.revokeObjectURL(a.href);
  }

  return <div className="admin-root" data-admin-root>
    <aside className="admin-sidebar">
      <Link href="/admin" className="admin-brand"><span className="admin-brand-mark">OM</span><span>OM FOOD <small>WEBSITE ADMIN</small></span></Link>
      <div className="admin-sidebar-label">CONTENT MANAGEMENT &amp; WORKSPACE</div>
      <nav aria-label="Admin sections">{tabs.map((item) => <button key={item.id} onClick={() => { setTab(item.id); setEditing(null); }} className={`admin-nav-item ${tab === item.id ? "active" : ""}`}><span>{item.mark}</span>{item.label}</button>)}</nav>
      <div className="admin-sidebar-label admin-account-label">ACCOUNT</div>
      <div className="admin-sidebar-foot"><span className="admin-avatar">{email.slice(0,1).toUpperCase()}</span><span className="admin-user-copy"><b>{email}</b><small>{role}</small></span><button type="button" onClick={() => { setLogoutError(""); logoutDialog.current?.showModal(); }} disabled={busy} aria-label="Sign out" title="Sign out">⇥</button></div>
    </aside>
    <main className="admin-main">
      <header className="admin-topbar"><div><span className="admin-breadcrumb">Admin / </span><strong>{tabs.find((x) => x.id === tab)?.label ?? "Products"}</strong></div><div className="admin-top-actions"><span className="admin-live"><i /> Website connected</span><button type="button" className="admin-view-site" onClick={previewWebsite}>Preview drafts ↗</button></div></header>
      <div className="admin-content">
        <div className="admin-welcome"><div><p className="admin-eyebrow">OM FOOD AND SPICES LLP</p><h1>{tabs.find((x) => x.id === tab)?.label}</h1><p className="admin-muted">{tab === "products" ? "Manage product details and publish updates to your website." : tab === "enquiries" ? "Review buyer requests and keep follow-ups moving." : "Recent changes made in the admin panel."}</p></div>{tab === "products" && canEdit && !editing && <button className="admin-primary-button admin-add-button" onClick={() => edit()}>＋ Add product</button>}</div>
        {notice && <div className="admin-notice" role="status">{notice}<button onClick={() => setNotice("")} aria-label="Dismiss">×</button></div>}
        {(tab === "blogs" || tab === "blog-categories" || tab === "blog-seo") && <BlogManager key={tab} section={tab} role={role}/>}
        {tab === "blog-media" && <><p className="admin-hint">Upload blog images to the shared media library using the Other category, then select their URLs in the blog editor.</p><MediaManager /></>}
        {tab === "products" && (editing ? <ProductEditor product={product} categories={categories.filter(c=>c.status!=="archived")} setField={setField} onCancel={()=>setEditing(null)} onSave={saveProduct} busy={busy} isNew={!editing.id} /> : <section className="admin-card"><div className="admin-card-heading"><div><h2>Product catalogue</h2><p>{productRows.length} products in your database</p></div></div><ProductTable rows={productRows} onEdit={edit} onDelete={deleteProduct} canEdit={canEdit} busy={busy} /></section>)}
        {tab === "enquiries" && <section className="admin-card"><div className="admin-card-heading"><div><h2>Buyer enquiries</h2><p>{enquiryTotal} requests · Search, filter, add internal notes and track follow-ups.</p></div><button className="admin-secondary-button" onClick={()=>void exportCsv()}>Download CSV ↓</button></div><div className="admin-filter-row"><input value={query} onChange={(e)=>{setEnquiryPage(1);setQuery(e.target.value);}} placeholder="Search name, email or product" aria-label="Search enquiries"/><select value={enquiryStatus} aria-label="Filter by status" onChange={e=>{setEnquiryPage(1);setEnquiryStatusFilter(e.target.value);}}><option value="">All statuses</option><option value="new">New</option><option value="contacted">Contacted</option><option value="in_progress">In progress</option><option value="completed">Completed</option><option value="cancelled">Cancelled</option></select><label className="admin-date-filter">From<input type="date" value={dateFrom} onChange={e=>{setEnquiryPage(1);setDateFrom(e.target.value);}}/></label><label className="admin-date-filter">To<input type="date" value={dateTo} onChange={e=>{setEnquiryPage(1);setDateTo(e.target.value);}}/></label></div>{selectedEnquiry&&<section className="admin-enquiry-detail"><div className="admin-card-heading"><div><h2>{selectedEnquiry.customer_name}</h2><p>{selectedEnquiry.company_name} · {selectedEnquiry.email} · {selectedEnquiry.phone}</p></div><button className="admin-text-button" onClick={()=>setSelectedEnquiry(null)}>Close ×</button></div><div className="admin-enquiry-message"><b>{formatProductNames(selectedEnquiry.product_names)} · {selectedEnquiry.type} request</b><p>{selectedEnquiry.message||"No additional message."}</p><small>{selectedEnquiry.country} · {dateLabel(selectedEnquiry.created_at)}</small></div><div className="admin-note-form"><textarea rows={2} value={noteDraft} onChange={e=>setNoteDraft(e.target.value)} placeholder="Add an internal follow-up note…"/><button className="admin-primary-button" onClick={()=>void addEnquiryNote()} disabled={!noteDraft.trim()}>Add note</button></div><div className="admin-note-list">{enquiryNotes.map(n=><article key={n.id}><p>{n.note}</p><small>{n.email??"Admin"} · {dateLabel(n.created_at)}</small></article>)}</div>{role==="owner"||role==="manager"?<button className="admin-row-action danger" onClick={()=>void deleteEnquiry()}>Delete spam enquiry</button>:null}</section>}<EnquiryTable rows={enquiries} onStatus={setEnquiryStatus} onDetails={openEnquiry}/><div className="admin-pagination"><span>Page {enquiryPage} of {Math.max(1,Math.ceil(enquiryTotal/50))}</span><button className="admin-secondary-button" disabled={enquiryPage<=1} onClick={()=>setEnquiryPage(x=>x-1)}>Previous</button><button className="admin-secondary-button" disabled={enquiryPage>=Math.ceil(enquiryTotal/50)} onClick={()=>setEnquiryPage(x=>x+1)}>Next</button></div></section>}
        {tab === "home" && <ContentManager />}
        {tab === "sections" && <WebsiteSections />}
        {tab === "categories" && <section className="admin-card"><div className="admin-card-heading"><div><h2>Categories</h2><p>Create and organize the categories shown in product filters.</p></div></div><CategoryManager /></section>}
        {tab === "users" && (role === "owner" ? <AdminUsers /> : <section className="admin-card"><Empty title="Owner access required" text="Only an owner can manage admin accounts." /></section>)}
      </div>
    </main>
    <dialog ref={logoutDialog} className="admin-logout-dialog" aria-labelledby="logout-heading" aria-describedby="logout-description" onCancel={(event) => { if (busy) event.preventDefault(); }}>
      <h2 id="logout-heading">Confirm Logout</h2>
      <p id="logout-description">Are you sure you want to log out of your admin account?</p>
      {logoutError && <p className="admin-error" role="alert">{logoutError}</p>}
      <div className="admin-dialog-actions">
        <button type="button" className="admin-secondary-button" autoFocus disabled={busy} onClick={() => logoutDialog.current?.close()}>Cancel</button>
        <button type="button" className="admin-primary-button" disabled={busy} onClick={() => void logout()}>{busy ? "Logging out…" : "Yes, Logout"}</button>
      </div>
    </dialog>
  </div>;
}

function Empty({ title, text }: { title: string; text: string }) { return <div className="admin-empty"><span>◌</span><b>{title}</b><small>{text}</small></div>; }
function ProductTable({ rows, onEdit, onDelete, canEdit, busy }: { rows: ProductRecord[]; onEdit: (p: ProductRecord)=>void; onDelete: (p: ProductRecord)=>void; canEdit: boolean; busy: boolean }) { return rows.length ? <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Product</th><th>Category</th><th>Status</th><th>Updated</th><th>Actions</th></tr></thead><tbody>{rows.map((r)=><tr key={r.id}><td><div className="admin-product-cell">{r.draft.image && <img src={r.draft.image} alt=""/>}<span><b>{r.draft.name}</b><small>/{r.slug}</small></span></div></td><td className="capitalize">{r.category}</td><td><span className={`admin-status ${r.status}`}>{statusLabel(r.status)}</span></td><td>{dateLabel(r.updatedAt)}</td><td><div className="admin-row-actions"><button disabled={!canEdit} onClick={()=>onEdit(r)}>Edit</button><button disabled={!canEdit||busy} onClick={()=>onDelete(r)}>Delete</button></div></td></tr>)}</tbody></table></div> : <Empty title="No products found" text="Add the first product to your catalogue."/>; }
function ProductEditor({ product, categories, setField, onCancel, onSave, busy, isNew }: { product: Product; categories:AdminCategory[]; setField: <K extends keyof Product>(key:K,value:Product[K])=>void; onCancel:()=>void; onSave:(publish:boolean)=>void; busy:boolean; isNew:boolean }) {
  const listValue=(v: string[]|undefined)=>v?.join(", ")??"";
  return <section className="admin-card admin-editor"><div className="admin-card-heading"><div><h2>{isNew?"Add product":"Edit product"}</h2><p>Changes stay in draft until you publish.</p></div></div><div className="admin-form-grid">
    <Field label="Product name"><input value={product.name} onChange={e=>setField("name",e.target.value)}/></Field><Field label="URL slug"><input value={product.slug} onChange={e=>setField("slug",e.target.value.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,""))}/></Field>
    <Field label="Category"><select value={product.category} onChange={e=>setField("category",e.target.value)}>{categories.map(c=><option key={c.id} value={c.slug}>{c.name}{c.status==="draft"?" · draft":""}</option>)}</select></Field><Field label="Product form"><select value={product.form} onChange={e=>setField("form",e.target.value as Product["form"])}>{["fresh","flakes","minced","granules","powder"].map(x=><option key={x} value={x}>{x}</option>)}</select></Field>
    <Field label="Short name"><input value={product.shortName} onChange={e=>setField("shortName",e.target.value)}/></Field><Field label="Image path or URL"><input value={product.image} onChange={e=>setField("image",e.target.value)} placeholder="/images/products/example.webp"/></Field>
    <Field label="Card description" wide><textarea rows={2} value={product.description} onChange={e=>setField("description",e.target.value)}/></Field><Field label="Full description" wide><textarea rows={4} value={product.overview} onChange={e=>setField("overview",e.target.value)}/></Field>
    <Field label="Forms (comma-separated)"><input value={listValue(product.forms)} onChange={e=>setField("forms",e.target.value.split(",").map(x=>x.trim()).filter(Boolean))}/></Field><Field label="Applications (comma-separated)"><input value={listValue(product.applications)} onChange={e=>setField("applications",e.target.value.split(",").map(x=>x.trim()).filter(Boolean))}/></Field>
    <Field label="Image alt text"><input value={product.imageAlt} onChange={e=>setField("imageAlt",e.target.value)}/></Field><Field label="Gallery image paths (comma-separated)"><input value={listValue(product.galleryImages)} onChange={e=>setField("galleryImages",e.target.value.split(",").map(x=>x.trim()).filter(Boolean))}/></Field>
    <Field label="SEO title"><input value={product.seoTitle} onChange={e=>setField("seoTitle",e.target.value)}/></Field><Field label="SEO description"><textarea rows={2} value={product.seoDescription} onChange={e=>setField("seoDescription",e.target.value)}/></Field>
  </div><div className="admin-editor-footer"><button className="admin-secondary-button" onClick={onCancel} disabled={busy}>Cancel</button><button className="admin-secondary-button" onClick={()=>onSave(false)} disabled={busy}>{busy?"Saving…":"Save draft"}</button><button className="admin-primary-button" onClick={()=>onSave(true)} disabled={busy}>{busy?"Saving…":"Publish to website"}</button></div></section>;
}
function Field({ label, children, wide=false }: { label:string; children:ReactNode; wide?:boolean }) { return <label className={`admin-field ${wide?"wide":""}`}><span>{label}</span>{children}</label>; }
function EnquiryTable({ rows, onStatus, onDetails }: { rows: EnquiryRecord[]; onStatus:(id:string,status:string)=>void; onDetails:(row:EnquiryRecord)=>void }) { return rows.length?<div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Buyer</th><th>Product / request</th><th>Message</th><th>Submitted</th><th>Status</th><th>Details</th></tr></thead><tbody>{rows.map(r=><tr key={r.id}><td><b>{r.customer_name}</b><small>{r.company_name||r.country} · {r.email}</small></td><td>{formatProductNames(r.product_names)}<small>{r.type === "sample"?"Sample request":"Quotation request"}</small></td><td className="admin-message-cell">{r.message||"—"}</td><td>{dateLabel(r.created_at)}</td><td><select value={r.status} onChange={e=>onStatus(r.id,e.target.value)} aria-label={`Status for ${r.customer_name}`}><option value="new">New</option><option value="contacted">Contacted</option><option value="in_progress">In progress</option><option value="completed">Completed</option><option value="cancelled">Cancelled</option></select></td><td><button className="admin-row-action" onClick={()=>onDetails(r)}>Open</button></td></tr>)}</tbody></table></div>:<Empty title="No matching enquiries" text="Submitted buyer requests will be listed here."/>; }
function formatProductNames(value: string[]|string) { if (Array.isArray(value)) return value.join(", ")||"—"; try { const p=JSON.parse(value); return Array.isArray(p)?p.join(", "):String(value||"—"); } catch { return value||"—"; } }
function dateLabel(value:string) { const date=new Date(value); return Number.isNaN(date.valueOf())?"—":new Intl.DateTimeFormat("en-IN",{dateStyle:"medium"}).format(date); }
function statusLabel(value:string) { return value.replaceAll("_"," "); }




