export type BlogPost = {
  title:string;slug:string;excerpt:string;content:string;thumbnail:string;imageAlt:string;category:string;
  tags:string[];primaryKeyword:string;secondaryKeywords:string[];longTailKeywords:string[];commercialKeywords:string[];
  informationalKeywords:string[];semanticKeywords:string[];industryKeywords:string[];metaTitle:string;metaDescription:string;
  canonicalUrl:string;author:string;relatedProducts:string[];relatedPosts:string[];featured:boolean;displayDate?:string;
};
export type BlogRecord={id:string;status:"draft"|"scheduled"|"published";scheduledAt:string|null;publishedAt:string|null;updatedAt:string;draft:BlogPost;published:BlogPost|null};
export type BlogCardContent=Pick<BlogPost,"title"|"slug"|"excerpt"|"thumbnail"|"imageAlt"|"category"|"tags"|"featured"|"displayDate"> & {content?:string;readingMinutes?:number};
export type PublicBlogCard=Pick<BlogRecord,"id"|"publishedAt"> & {published:BlogCardContent|null};
export type BlogCategory={id:string;slug:string;name:string;description:string;is_visible:boolean;display_order:number};
export function selectBlogCards(posts:PublicBlogCard[],filters:{q:string;category:string;page:number},pageSize=6){
 const matches=posts.filter(({published:p})=>p&&(!filters.category||p.category===filters.category)&&(!filters.q||`${p.title} ${p.excerpt} ${p.tags.join(" ")}`.toLowerCase().includes(filters.q.toLowerCase())));
 const featured=!filters.q&&!filters.category?posts.find(p=>p.published?.featured):undefined;
 const latest=featured?matches.filter(p=>p.id!==featured.id):matches;
 const pages=Math.ceil(latest.length/pageSize),page=Math.min(Math.max(1,filters.page),Math.max(1,pages));
 return {featured,latest,pages,page,visible:latest.slice((page-1)*pageSize,page*pageSize)};
}
export function readingTime(content:string){return Math.max(1,Math.ceil(content.split(/\s+/).filter(Boolean).length/220));}
export const blogDate=(date:string)=>new Intl.DateTimeFormat("en-IN",{day:"numeric",month:"long",year:"numeric",timeZone:"Asia/Kolkata"}).format(new Date(date));
export const blogDisplayDate=(post:Pick<BlogPost,"displayDate">,actualDate:string)=>blogDate(post.displayDate?`${post.displayDate}T00:00:00+05:30`:actualDate);
export function validBlogDisplayDate(value:unknown){if(value===undefined||value==="")return true;if(typeof value!=="string"||!/^\d{4}-\d{2}-\d{2}$/.test(value))return false;const date=new Date(`${value}T00:00:00Z`);return Number.isFinite(date.getTime())&&date.toISOString().slice(0,10)===value;}
export const headingId=(text:string)=>text.toLowerCase().replace(/[^a-z0-9\s-]/g,"").trim().replace(/\s+/g,"-");
export function validBlog(value:unknown):value is BlogPost{
  if(!value||typeof value!=="object")return false;const p=value as BlogPost;if(!validBlogDisplayDate(p.displayDate))return false;
  return [p.title,p.slug,p.excerpt,p.content,p.thumbnail,p.imageAlt,p.category,p.metaTitle,p.metaDescription,p.author,p.primaryKeyword,p.canonicalUrl].every(x=>typeof x==="string")&&[p.title,p.excerpt,p.imageAlt,p.category,p.metaTitle,p.metaDescription,p.author,p.primaryKeyword].every(x=>x.trim().length>0)&&p.title.trim().length>0&&p.title.length<=200&&/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(p.slug)&&p.slug.length<=180&&p.excerpt.length<=600&&p.content.length<=150000&&p.content.trim().length>0&&p.metaTitle.length<=200&&p.metaDescription.length<=500&&p.imageAlt.length<=500&&/^\/(?!\/)/.test(p.thumbnail)&&(!p.canonicalUrl||/^https:\/\//.test(p.canonicalUrl))&&[p.tags,p.secondaryKeywords,p.longTailKeywords,p.commercialKeywords,p.informationalKeywords,p.semanticKeywords,p.industryKeywords,p.relatedProducts,p.relatedPosts].every(a=>Array.isArray(a)&&a.length<=40&&a.every(x=>typeof x==="string"&&x.length<=300))&&typeof p.featured==="boolean";
}

