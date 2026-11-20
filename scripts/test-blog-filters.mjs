import {chromium} from '@playwright/test';import assert from 'node:assert/strict';import {mkdir,writeFile} from 'node:fs/promises';
const base='https://om-food-exact-preview.vercel.app';const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});const page=await browser.newPage({viewport:{width:1440,height:1000}});const results=[];const errors=[];page.on('pageerror',e=>errors.push(e.message));
function check(name,ok){results.push({name,status:ok?'PASS':'FAIL'});console.log((ok?'PASS ':'FAIL ')+name);assert(ok,name);}
try{
 await page.goto(base+'/blog',{waitUntil:'networkidle',timeout:60000});
 await page.locator('#blog-category').waitFor();
 const labels=await page.locator('#blog-category option').allTextContents();check('All five category options in requested order',JSON.stringify(labels)===JSON.stringify(['All Categories','Onion','Garlic','Food Processing','Industry & Sourcing']));
 const documents=[];page.on('request',r=>{if(r.resourceType()==='document')documents.push(r.url())});await page.evaluate(()=>{window.__blogFilterAudit='same document'});
 check('One featured article today',await page.locator('article').count()===1);
 for(const [slug,label] of [['garlic','Garlic'],['processing','Food Processing'],['sourcing','Industry & Sourcing']]){await page.locator('#blog-category').selectOption(slug);await page.getByText('No articles match your search.',{exact:false}).waitFor();check(label+' filter contains no future articles',await page.locator('article').count()===0);}
 await page.locator('#blog-category').selectOption('onion');check('Onion filter displays published article',await page.locator('article').count()===1);
 await page.locator('#blog-search').fill('not-a-real-ingredient');await page.getByRole('button',{name:'Find articles',exact:true}).click();check('Search and category combine',await page.locator('article').count()===0&&new URL(page.url()).searchParams.get('category')==='onion');
 await page.getByRole('button',{name:'Clear',exact:true}).click();check('Clear resets category search and URL',await page.locator('#blog-category').inputValue()===''&&await page.locator('#blog-search').inputValue()===''&&new URL(page.url()).search==='');
 check('No full document reload for filters or Clear',documents.length===0&&await page.evaluate(()=>window.__blogFilterAudit==='same document'));
 check('Featured is not duplicated in Latest',await page.locator('article').count()===1);
 await page.locator('#blog-category').selectOption('onion');await page.locator('#blog-search').fill('dehydrated onion');await page.getByRole('button',{name:'Find articles',exact:true}).click();check('Valid combined search finds current article',await page.locator('article').count()===1);
 await page.reload({waitUntil:'networkidle'});check('Filters persist through refresh',await page.locator('#blog-category').inputValue()==='onion'&&await page.locator('#blog-search').inputValue()==='dehydrated onion'&&await page.locator('article').count()===1);
 await page.getByRole('button',{name:'Clear',exact:true}).click();
 const html=await page.content();check('Future article title absent from public HTML/client payload',!html.includes('Onion Flakes vs Kibbled Onion: Understanding the Differences'));
 for(const slug of ['onion-flakes-vs-kibbled-onion','dehydrated-garlic-food-manufacturing']){const r=await page.request.get(base+'/blog/'+slug);check('Future URL remains private: '+slug,r.status()===404);}
 await mkdir('audit/blog',{recursive:true});await page.screenshot({path:'audit/blog/categories-desktop.png',fullPage:true});
 for(const width of [390,768,1280,1440]){await page.setViewportSize({width,height:900});check('No horizontal overflow '+width,await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));if(width===390)await page.screenshot({path:'audit/blog/categories-mobile.png',fullPage:true});}
 check('No browser runtime exceptions',errors.length===0);
}finally{await writeFile('audit/blog/category-filter-results.json',JSON.stringify({at:new Date().toISOString(),results},null,2));await browser.close();}
