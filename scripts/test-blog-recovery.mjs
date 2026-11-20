import {chromium} from '@playwright/test';
import {writeFile,mkdir} from 'node:fs/promises';
const base='https://om-food-exact-preview.vercel.app';
const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});
const page=await browser.newPage({viewport:{width:1440,height:1000}});const errors=[];const checks=[];
page.on('pageerror',e=>errors.push(e.message));
try{
for(const path of ['/blog','/blog/dehydrated-onion-types-uses-benefits','/blog','/blog','/products/dehydrated-onion-flakes']){
const r=await page.goto(base+path,{waitUntil:'domcontentloaded',timeout:60000});
await page.locator('h1').waitFor({timeout:15000});
const text=await page.locator('body').innerText();
const ok=r.status()===200&&!text.includes('Application error:')&&!text.includes('Our articles are temporarily unavailable.');
checks.push({path,status:r.status(),ok,h1:await page.locator('h1').innerText()});
if(!ok)throw Error('Public page did not recover: '+path);
}
const future=await page.request.get(base+'/blog/onion-flakes-vs-kibbled-onion');checks.push({check:'Scheduled article stays private',ok:future.status()===404});
await page.goto(base+'/blog',{waitUntil:'networkidle',timeout:60000});
await mkdir('audit/blog',{recursive:true});
await page.screenshot({path:'audit/blog/blog-recovery-desktop.png',fullPage:true});
await page.setViewportSize({width:390,height:844});
await page.screenshot({path:'audit/blog/blog-recovery-mobile.png',fullPage:true});
checks.push({check:'Mobile no overflow',ok:await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)});
checks.push({check:'No client exceptions',ok:errors.length===0});
console.log(JSON.stringify(checks,null,2));
await writeFile('audit/blog/recovery-results.json',JSON.stringify({checkedAt:new Date().toISOString(),checks},null,2));
}finally{await browser.close();}
