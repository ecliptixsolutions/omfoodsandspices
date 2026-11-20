import {request} from '@playwright/test';
import {readFile,writeFile} from 'node:fs/promises';
import assert from 'node:assert/strict';
import * as home from '../src/content/home';
import {products} from '../src/content/products';
import {infoPages,sourcingPage} from '../src/content/pages';
const equal=(a:unknown,b:unknown)=>JSON.stringify(a)===JSON.stringify(b);
// Three-way merge: unpublished edits remain unpublished; matching old copy follows the revision.
function draftAfter(draft:any,old:any,next:any):any{
 if(equal(draft,old))return structuredClone(next);
 if(!draft||!old||!next||typeof draft!=='object'||typeof old!=='object'||typeof next!=='object')return draft;
 if(Array.isArray(draft)){if(!Array.isArray(old)||!Array.isArray(next)||draft.length!==old.length||old.length!==next.length)return draft;return draft.map((v,i)=>draftAfter(v,old[i],next[i]));}
 return Object.fromEntries([...new Set([...Object.keys(next),...Object.keys(draft)])].map(k=>[k,k in draft?draftAfter(draft[k],old[k],next[k]):next[k]]));
}
function preserveImages(next:any,current:any):any{
 if(!next||typeof next!=='object')return next;
 if(Array.isArray(next))return next.map((v,i)=>preserveImages(v,current?.[i]));
 return Object.fromEntries(Object.entries(next).map(([k,v])=>[k,['image','imageAlt','galleryImages'].includes(k)&&current?.[k]!==undefined?current[k]:preserveImages(v,current?.[k])]));
}
async function main(){
 const base=process.env.SEO_BASE||'https://om-food-exact-preview.vercel.app';
 const apply=process.argv.includes('--apply');
 const blogs=JSON.parse(await readFile('audit/seo/blog-copy.json','utf8'));
 const report:any={at:new Date().toISOString(),base,apply,updates:[],errors:[]};
 const ctx=await request.newContext({baseURL:base,extraHTTPHeaders:{Origin:base},timeout:60000});
 async function api(method:string,path:string,data?:unknown){for(let attempt=0;attempt<3;attempt++){const r=await ctx.fetch(path,{method,data,maxRetries:2});if(r.status()===503&&attempt<2){await new Promise(resolve=>setTimeout(resolve,1000*(attempt+1)));continue;}assert(r.ok(),`${method} ${path}: HTTP ${r.status()}`);return r.json();}throw Error('API retry limit reached');}
 async function section(key:string,value:any){const {content:c}=await api('GET','/api/admin/content?key='+encodeURIComponent(key));const next=preserveImages(value,c.published||c.draft);const draft=draftAfter(c.draft,c.published||c.draft,next);report.updates.push({kind:'section',key,before:c.published,after:next,separateDraftPreserved:!equal(draft,next)});if(apply){await api('PATCH','/api/admin/content',{key,value:next,publish:true});if(!equal(draft,next))await api('PATCH','/api/admin/content',{key,value:draft,publish:false});}}
 try{
  assert(process.env.AUDIT_EMAIL&&process.env.AUDIT_PASSWORD,'Authorized admin credentials must be supplied through the environment.');
  await api('POST','/api/admin/auth/login',{email:process.env.AUDIT_EMAIL,password:process.env.AUDIT_PASSWORD});
  await section('home',home);
  for(const page of infoPages)await section('page:'+page.path,page);
  await section('page:/sourcing',sourcingPage);
  const {content:general}=await api('GET','/api/admin/content?key=general');await section('general',{...(general.published||general.draft),websiteTitle:'Dehydrated Onion & Garlic Supplier India | OM Food',seoDescription:'Source onion flakes, minced onion, granules, powder and dehydrated garlic from Gujarat, India. Request samples, specifications and bulk export quotations.'});
  const catalogue=await api('GET','/api/admin/products');
  for(const p of products){const r=catalogue.products.find((x:any)=>x.slug===p.slug);assert(r?.published&&r.status==='published',`Published product missing: ${p.slug}`);const next={...r.published,description:p.description,overview:p.overview,seoTitle:p.seoTitle,seoDescription:p.seoDescription,...(p.slug==='pink-onion'?{forms:p.forms}:{})};const draft=draftAfter(r.draft,r.published,next);report.updates.push({kind:'product',slug:p.slug,before:r.published,after:next,separateDraftPreserved:!equal(draft,next)});if(apply){await api('POST','/api/admin/products',{id:r.id,product:next,displayOrder:r.displayOrder,publish:true});if(!equal(draft,next))await api('POST','/api/admin/products',{id:r.id,product:draft,displayOrder:r.displayOrder,publish:false});}}
  const data=await api('GET','/api/admin/blogs');
  for(const b of blogs){const r=data.posts.find((x:any)=>x.published?.slug===b.slug);assert(r?.published&&r.status==='published',`Published article missing: ${b.slug}`);const next={...r.published,metaTitle:b.metaTitle,metaDescription:b.metaDescription,content:b.content,primaryKeyword:b.primaryKeyword};const draft=draftAfter(r.draft,r.published,next);report.updates.push({kind:'blog',slug:b.slug,before:r.published,after:next,separateDraftPreserved:!equal(draft,next)});if(apply){await api('POST','/api/admin/blogs',{id:r.id,post:next,status:'published'});if(!equal(draft,next))await api('POST','/api/admin/blogs',{id:r.id,post:draft,status:'draft'});}}
  const setting={title:'Onion & Garlic Ingredient Guides',description:'Compare dehydrated onion and garlic formats, food applications, processing and bulk procurement. Practical guides for manufacturers, importers and distributors.'};
  report.updates.push({kind:'blog-settings',before:data.settings,after:setting});if(apply)await api('POST','/api/admin/blogs',{kind:'settings',value:setting});
  console.log(`${apply?'Published':'Prepared dry run for'} ${report.updates.length} content updates; product order, images, titles, dates and separate drafts preserved.`);
 }catch(e){report.errors.push(e instanceof Error?e.message:'Publishing failed');throw e;}
 finally{await writeFile(`audit/seo/${apply?'published':'publish-dry-run'}.json`,JSON.stringify(report,null,2));await ctx.post('/api/admin/auth/logout').catch(()=>{});await ctx.dispose();}
}
if(process.argv.includes('--check-merge')){assert.deepEqual(draftAfter({a:'editor edit',b:'old'},{a:'old',b:'old'},{a:'new',b:'new'}),{a:'editor edit',b:'new'});assert.deepEqual(preserveImages({title:'new',image:'new.webp'},{title:'old',image:'approved.webp'}),{title:'new',image:'approved.webp'});console.log('PASS: draft isolation and approved-image preservation checks.');}
else main().catch(e=>{console.error(e.message);process.exitCode=1});
