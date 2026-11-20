import {chromium} from '@playwright/test';
import {mkdir,writeFile,readFile} from 'node:fs/promises';
const base=process.env.SEO_BASE||'http://localhost:3100';
const canonical='https://om-food-exact-preview.vercel.app';
const phase=process.env.SEO_PHASE||'local';
const address=base.startsWith('https://')?await fetch('https://dns.google/resolve?name=om-food-exact-preview.vercel.app&type=A').then(r=>r.json()).then(r=>r.Answer?.find(a=>a.type===1)?.data).catch(()=>null):null;
const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',args:address?[`--host-resolver-rules=MAP om-food-exact-preview.vercel.app ${address}`]:[]});
const context=await browser.newContext({javaScriptEnabled:false,userAgent:"Twitterbot/1.0"});const page=await context.newPage();
const previous=process.env.SEO_RESUME==='1'?JSON.parse(await readFile(`audit/seo/${phase}-checks.json`,'utf8')):null;
if(previous&&(previous.base!==base||previous.results.some(r=>r.status==='FAIL')))throw Error('Resume requires matching successful partial evidence.');
const results=previous?.results||[],pages=previous?.pages||[],links=new Set(),titles=new Set(pages.map(p=>p.title)),descriptions=new Set(pages.map(p=>p.description));
const navigationRetries=previous?.navigationRetries||[];
for(const p of pages)for(const href of p.links)if(href?.startsWith('/')&&!href.startsWith('//')&&!href.startsWith('/admin')&&!href.startsWith('/api/'))links.add(href.split('#')[0].split('?')[0]);
if(previous)console.log(`Resuming ${pages.length} successfully checked pages from this deployed revision.`);
function check(name,ok,detail=''){const item={name,status:ok?'PASS':'FAIL',detail};const index=results.findIndex(r=>r.name===name);if(index<0)results.push(item);else results[index]=item;if(!ok)console.log('FAIL '+name+' '+detail);}
try{
 const sitemap=await context.request.get(base+'/sitemap.xml');const xml=await sitemap.text();check('Sitemap returns HTTP 200',sitemap.status()===200);check('Sitemap contains image namespace',xml.includes('xmlns:image='));
 const blocks=[...xml.matchAll(/<url>([\s\S]*?)<\/url>/g)].map(x=>x[1]);
 const urls=blocks.map(x=>x.match(/<loc>(.*?)<\/loc>/)?.[1]);
 check('Sitemap URLs unique',new Set(urls).size===urls.length);check('Sitemap excludes private routes',urls.every(u=>u?.startsWith(canonical)&&!/[?]|\/admin|\/api\//.test(u)));check('Sitemap lastmod dates are not future dates',blocks.every(x=>{const d=x.match(/<lastmod>(.*?)<\/lastmod>/)?.[1];return d&&Date.parse(d)<=Date.now()}));
 const robots=await context.request.get(base+'/robots.txt');const robotText=await robots.text();check('Robots is available and references canonical sitemap',robots.ok()&&robotText.includes(canonical+'/sitemap.xml'));check('Robots permits rendering assets and images',!['/_next','/images/','Disallow: /\n'].some(s=>robotText.includes(s)));
 for(const url of urls){const path=new URL(url).pathname;if(pages.some(p=>p.path===path))continue;let response;for(let attempt=0;attempt<3;attempt++){try{response=await page.goto(base+path,{waitUntil:'domcontentloaded',timeout:45000});break;}catch(error){navigationRetries.push({path,attempt:attempt+1,error:error.message.split('Call log:')[0]});if(attempt===2)throw error;}};const data=await page.evaluate(()=>({title:document.title,description:document.querySelector('meta[name=description]')?.content,canonical:document.querySelector('link[rel=canonical]')?.href,canonicals:document.querySelectorAll('link[rel=canonical]').length,h1:[...document.querySelectorAll('h1')].map(x=>x.textContent.trim().replace(/\s+/g,' ')),robots:document.querySelector('meta[name=robots]')?.content,og:document.querySelector('meta[property="og:title"]')?.content,mainText:document.querySelector('main')?.textContent.trim(),images:[...document.querySelectorAll('main img')].map(x=>({src:x.getAttribute('src'),alt:x.getAttribute('alt')})),links:[...document.querySelectorAll('a[href]')].map(x=>x.getAttribute('href')),json:[...document.querySelectorAll('script[type="application/ld+json"]')].map(x=>x.textContent)}));
 check(path+' HTTP 200',response?.status()===200);check(path+' one SSR H1',data.h1.length===1);check(path+' unique title',!!data.title&&!titles.has(data.title));check(path+' unique description',!!data.description&&!descriptions.has(data.description));titles.add(data.title);descriptions.add(data.description);
 check(path+' canonical',data.canonicals===1&&data.canonical?.replace(/\/$/,'')===url.replace(/\/$/,''));check(path+' indexable',!data.robots?.includes('noindex')&&!response?.headers()['x-robots-tag']?.includes('noindex'));check(path+' SSR content and Open Graph',data.mainText?.length>150&&!!data.og);check(path+' image alt text',data.images.every(i=>i.alt!==null));
 try{const schemas=data.json.flatMap(j=>JSON.parse(j));check(path+' JSON-LD syntax and types',schemas.length>0&&schemas.every(s=>s['@context']==='https://schema.org'&&s['@type']));check(path+' no fabricated ratings/offers',schemas.every(s=>!s.aggregateRating&&!s.review&&!s.offers));}catch{check(path+' JSON-LD syntax',false);}
 for(const href of data.links){if(href?.startsWith('/')&&!href.startsWith('//')&&!href.startsWith('/admin')&&!href.startsWith('/api/'))links.add(href.split('#')[0].split('?')[0]);}
 if(path==='/'&&phase==='live')check('Protected hero headline exact',data.h1[0]==="EXPORTING INDIA'S FINEST DEHYDRATED ONION & GARLIC");
 pages.push({path,status:response?.status(),...data});console.log('Checked '+path);
 }
 check('All important sitemap pages linked',urls.every(u=>new URL(u).pathname==='/'||links.has(new URL(u).pathname)));
 for(const path of [...links].filter(Boolean)){const r=await context.request.get(base+path,{timeout:60000});check('Internal link '+path,r.status()<400,String(r.status()));}
 for(const path of ['/missing-seo-audit-page','/products/missing-seo-audit-product','/blog/missing-seo-audit-article']){const r=await context.request.get(base+path);check(path+' returns 404',r.status()===404,String(r.status()));}
 await page.goto(base+'/admin/login');check('Admin login has noindex',await page.locator('meta[name=robots]').getAttribute('content').then(s=>s.includes('noindex')));
 const visual=await browser.newContext({viewport:{width:390,height:844},reducedMotion:'reduce'});const mobile=await visual.newPage();
 for(const path of ['/','/dehydrated-onions','/enquiry','/blog']){await mobile.goto(base+path,{waitUntil:'networkidle',timeout:60000});check('Mobile overflow '+path,await mobile.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));await mobile.screenshot({path:`audit/seo/${phase}-${path==='/'?'home':path.slice(1)}-mobile.png`,fullPage:true});}
 await visual.close();
}finally{await mkdir('audit/seo',{recursive:true});await writeFile(`audit/seo/${phase}-checks.json`,JSON.stringify({at:new Date().toISOString(),base,results,pages,navigationRetries},null,2));await browser.close();}
console.log(`${results.filter(r=>r.status==='PASS').length}/${results.length} SEO checks passed`);if(results.some(r=>r.status==='FAIL'))process.exitCode=1;




