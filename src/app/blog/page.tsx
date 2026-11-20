import {publicRows} from "@/lib/public-db.server";
import {publicBlogCards,publicBlogCategories} from "@/lib/blog.server";
import {buildMetadata} from "@/lib/seo";
import {PageHero} from "@/components/PageHero";
import {BlogListing} from "@/components/BlogListing";
export const dynamic="force-dynamic";
async function settings(){try{const rows=await publicRows("SELECT content_json FROM om_blog_settings WHERE id=1");const raw=rows[0]?.content_json;return raw?(typeof raw==="string"?JSON.parse(raw):raw):{title:"Insights & Updates",description:"Practical onion and garlic ingredient guides for food manufacturers and bulk buyers."};}catch{return {title:"Insights & Updates",description:"Practical onion and garlic ingredient guides for food manufacturers and bulk buyers."};}}
export async function generateMetadata(){const s=await settings();return buildMetadata({title:`${s.title} | OM Food and Spices LLP`,description:s.description,path:"/blog"});}
export default async function BlogPage({searchParams}:{searchParams:Promise<{q?:string;category?:string;page?:string}>}){
 const params=await searchParams;
 const [records,categories,s]=await Promise.all([publicBlogCards(),publicBlogCategories(),settings()]);
 // Send published fields only: editable drafts must never enter the client payload.
 const posts=records;
 return <><PageHero eyebrow="Ingredient knowledge" line1={s.title} intro={s.description} crumbs={[{label:"Home",href:"/"},{label:"Blog"}]} cta={false}/><BlogListing posts={posts} categories={categories} initial={{q:(params.q||"").slice(0,120),category:params.category||"",page:Math.max(1,parseInt(params.page||"1")||1)}}/></>;
}
