import "server-only";
import recovery from "@/content/blog-public-recovery.json";
import {getAdminDb,type DbRow} from "./admin/db.server";
import {currentAdmin} from "./admin/auth.server";
import {readingTime,type BlogRecord,type BlogPost,type BlogCategory,type PublicBlogCard} from "./blog";
import {publicRows,invalidatePublicContent} from "./public-db.server";
export const decodeBlog=(x:unknown):BlogPost|null=>typeof x==="string"?JSON.parse(x):x as BlogPost|null;
export function blogRecord(r:DbRow):BlogRecord{return {id:r.id,status:r.status,scheduledAt:r.scheduled_at?new Date(r.scheduled_at).toISOString():null,publishedAt:r.published_at?new Date(r.published_at).toISOString():null,updatedAt:new Date(r.updated_at).toISOString(),draft:decodeBlog(r.draft_json)!,published:decodeBlog(r.published_json)};}
const publishedWhere="status='published' AND published_json IS NOT NULL AND published_at<=UTC_TIMESTAMP()";
function recoveryPosts(error:unknown):BlogRecord[]{if((error as {code?:string}).code==="ER_USER_LIMIT_REACHED"&&Date.now()<Date.parse(recovery.expiresAt))return recovery.posts as BlogRecord[];throw error;}
function card(id:string,publishedAt:string,p:BlogPost):PublicBlogCard{return {id,publishedAt,published:{title:p.title,slug:p.slug,excerpt:p.excerpt,thumbnail:p.thumbnail,imageAlt:p.imageAlt,category:p.category,tags:p.tags,featured:p.featured,displayDate:p.displayDate,readingMinutes:readingTime(p.content)}};}
export async function publicBlogCards(relatedTo?:BlogPost,excludeId=""):Promise<PublicBlogCard[]>{
 const related=relatedTo?.relatedPosts||[];
 const extra=relatedTo?` AND id<>? AND (JSON_UNQUOTE(JSON_EXTRACT(published_json,'$.category'))=?${related.length?` OR JSON_UNQUOTE(JSON_EXTRACT(published_json,'$.slug')) IN (${related.map(()=>"?").join(",")})`:""})`:"";
 const values=relatedTo?[excludeId,relatedTo.category,...related]:[];
 try{
  // Reading time uses the body on the server; never send bodies or SEO keyword arrays to card clients.
  const rows=await publicRows(`SELECT id,published_at,JSON_REMOVE(published_json,'$.secondaryKeywords','$.longTailKeywords','$.commercialKeywords','$.informationalKeywords','$.semanticKeywords','$.industryKeywords','$.primaryKeyword','$.metaTitle','$.metaDescription','$.canonicalUrl','$.author','$.relatedProducts','$.relatedPosts') AS card_json FROM om_blog_posts WHERE ${publishedWhere}${extra} ORDER BY published_at DESC,id${relatedTo?" LIMIT 3":""}`,values);
  return rows.map(r=>card(r.id,new Date(r.published_at).toISOString(),decodeBlog(r.card_json)!));
 }catch(error){const rows=recoveryPosts(error).filter(r=>!relatedTo||r.id!==excludeId&&(r.published!.category===relatedTo.category||related.includes(r.published!.slug)));return (relatedTo?rows.slice(0,3):rows).map(r=>card(r.id,r.publishedAt!,r.published!));}
}
export async function publicBlogLinks(productSlug?:string){
 try{const rows=await publicRows(`SELECT id,JSON_UNQUOTE(JSON_EXTRACT(published_json,'$.slug')) AS slug,JSON_UNQUOTE(JSON_EXTRACT(published_json,'$.title')) AS title FROM om_blog_posts WHERE ${publishedWhere}${productSlug?" AND JSON_CONTAINS(JSON_EXTRACT(published_json,'$.relatedProducts'),JSON_QUOTE(?))":""} ORDER BY published_at DESC,id${productSlug?" LIMIT 3":""}`,productSlug?[productSlug]:[]);return rows.map(r=>({id:String(r.id),slug:String(r.slug),title:String(r.title)}));}
 catch(error){const rows=recoveryPosts(error).filter(r=>!productSlug||r.published!.relatedProducts.includes(productSlug));return (productSlug?rows.slice(0,3):rows).map(r=>({id:r.id,slug:r.published!.slug,title:r.published!.title}));}
}
export async function publicBlogCategories():Promise<BlogCategory[]>{
 try{const rows=await publicRows("SELECT id,slug,name,description,is_visible,display_order FROM om_blog_categories WHERE is_visible=TRUE ORDER BY display_order,name");return rows.map(c=>({...c,is_visible:Boolean(c.is_visible)}) as BlogCategory);}
 catch(error){const snapshot=recovery as {expiresAt:string;categories?:BlogCategory[]};if((error as {code?:string}).code==="ER_USER_LIMIT_REACHED"&&Date.now()<Date.parse(snapshot.expiresAt)&&snapshot.categories)return snapshot.categories;throw error;}
}
export async function findBlog(slug:string,preview=false){
 if(preview){const admin=await currentAdmin();if(!admin||!["owner","manager","editor"].includes(admin.role))return null;const [rows]=await getAdminDb().execute<DbRow[]>("SELECT * FROM om_blog_posts WHERE slug=?",[slug]);return rows[0]?blogRecord(rows[0]):null;}
 try{const rows=await publicRows(`SELECT id,published_at,COALESCE((SELECT MAX(v.created_at) FROM om_blog_versions v WHERE v.blog_id=om_blog_posts.id AND v.action='published'),published_at) AS updated_at,published_json FROM om_blog_posts WHERE ${publishedWhere} AND JSON_UNQUOTE(JSON_EXTRACT(published_json,'$.slug'))=? LIMIT 1`,[slug]);const r=rows[0];if(!r)return null;const p=decodeBlog(r.published_json)!;return {id:r.id,status:"published" as const,scheduledAt:null,publishedAt:new Date(r.published_at).toISOString(),updatedAt:new Date(r.updated_at).toISOString(),published:p,draft:p};}
 catch(error){return recoveryPosts(error).find(r=>r.published?.slug===slug)||null;}
}
export async function publishDueBlogs(){
 const connection=await getAdminDb().getConnection();
 try{await connection.beginTransaction();const [rows]=await connection.query<DbRow[]>("SELECT id,draft_json FROM om_blog_posts WHERE status='scheduled' AND scheduled_at<=UTC_TIMESTAMP() FOR UPDATE");
 for(const row of rows){for(const match of JSON.stringify(row.draft_json).matchAll(/\/api\/media\/([0-9a-f-]{36})/gi))await connection.execute("UPDATE om_media SET is_public=TRUE WHERE id=?",[match[1]]);}
 await connection.execute("UPDATE om_blog_posts SET status='published',published_json=draft_json,published_at=scheduled_at WHERE status='scheduled' AND scheduled_at<=UTC_TIMESTAMP()");await connection.commit();if(rows.length)invalidatePublicContent();return rows.length;
 }catch(error){await connection.rollback();throw error;}finally{connection.release();}
}

