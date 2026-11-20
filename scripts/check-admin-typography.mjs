import { chromium } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';

const base = process.env.QA_BASE || 'http://localhost:3000';
const out = 'audit/admin-typography';
await mkdir(out, { recursive: true });
const args = ['--disable-gpu'];
if (base.startsWith('https:')) {
  const dns = await fetch('https://dns.google/resolve?name=om-food-exact-preview.vercel.app&type=A').then(r => r.json());
  args.push(`--host-resolver-rules=MAP om-food-exact-preview.vercel.app ${dns.Answer.find(a => a.type === 1).data}`);
}
const browser = await chromium.launch({ headless:true, executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe', args });
const context = await browser.newContext({viewport:{width:1440,height:900}});
const page = await context.newPage();
const results = [];
const errors = [];
page.on('pageerror', e => errors.push(e.message));
async function ready() {
  await page.waitForLoadState('networkidle', { timeout:15000 }).catch(() => {});
  await page.evaluate(() => document.fonts.ready);
}
async function measure(name, width) {
  await ready();
  const data = await page.evaluate(() => {
    const font = s => { const e=document.querySelector(s);return e?parseFloat(getComputedStyle(e).fontSize):null; };
    return {
      overflow:document.documentElement.scrollWidth > innerWidth + 1,
      body:font('[data-admin-root]'), nav:font('.admin-nav-item'), heading:font('.admin-welcome h1, .admin-login-card h1'),
      section:font('.admin-card-heading h2'), label:font('.admin-field, .admin-login-form label'),
      input:font('.admin-field input, .admin-login-form input'), table:font('.admin-table'),
      helper:font('.admin-hint, .admin-card-heading p'),
      tinyText:[...document.querySelectorAll('[data-admin-root] p, [data-admin-root] label, [data-admin-root] small, [data-admin-root] th, [data-admin-root] td, .admin-nav-item')].filter(e=>e.getClientRects().length && parseFloat(getComputedStyle(e).fontSize)>0 && parseFloat(getComputedStyle(e).fontSize)<13).length
    };
  });
  const pass=data.body!==null && !data.overflow && !data.tinyText && (!data.nav || data.nav>=15) && (!data.input || data.input>=15);
  results.push({name,width,...data,status:pass?'PASS':'FAIL'});
  console.log(`${pass?'PASS':'FAIL'} ${width} ${name}`);
}
async function screenshot(name) {
  await page.screenshot({path:`${out}/${process.env.QA_BASE?'live':'local'}-${name}.png`,fullPage:false,
    mask:[page.locator('.admin-user-copy'),page.locator('.admin-table tbody'),page.locator('.admin-activity-list'),page.locator('.admin-session-list')]});
}
try {
  await page.goto(base+'/admin/login',{waitUntil:'domcontentloaded',timeout:60000});
  await measure('Login',1440);
  await page.locator('#admin-email').fill(process.env.AUDIT_EMAIL);
  await page.locator('#admin-password').fill(process.env.AUDIT_PASSWORD);
  await page.getByRole('button',{name:'Sign in to admin',exact:true}).click();
  await page.waitForSelector('.admin-sidebar',{timeout:60000});
  const labels=await page.locator('nav[aria-label="Admin sections"] button').allTextContents();
  for (const width of [1440,390]) {
    await page.setViewportSize({width,height:900});
    for (let i=0;i<labels.length;i++) {
      const button=page.locator('nav[aria-label="Admin sections"] button').nth(i);
      await button.click();
      await page.waitForSelector('.admin-content .admin-card');
      await page.waitForTimeout(350);
      await measure(labels[i].slice(1).trim(),width);
      if ([0,4,5,11].includes(i)) await screenshot(`${width}-section-${i}`);
      const name=labels[i].slice(1).trim();
      if(['Products','Blogs','Categories'].includes(name)) {
        const add=page.getByRole('button',{name:/Add product|Add blog|Add category/}).first();
        await add.waitFor({state:'visible'});
        await add.click();await measure(name+' editor',width);await screenshot(`${width}-editor-${i}`);
      }
      if(name==='Website sections') {
        const select=page.getByLabel('Choose website page');
        await select.waitFor({state:'visible'});
        const options=await select.locator('option').evaluateAll(es=>es.map(e=>({value:e.value,label:e.textContent})));
        for(const option of options) {await select.selectOption(option.value);await measure('Page editor: '+option.label,width);}
      }
    }
  }
  for(const width of [1280,768]) {
    await page.setViewportSize({width,height:900});
    for(const name of ['Overview','Enquiries','Media library','Security settings']) {
      await page.locator('nav[aria-label="Admin sections"] button').filter({hasText:name}).click();
      await measure(name,width);
    }
  }
  await context.request.post(base+'/api/admin/auth/logout',{headers:{Origin:base}});
  await page.goto(base+'/admin/login');
  await page.setViewportSize({width:390,height:844});
  await measure('Login mobile',390);
  await screenshot('login-mobile');
} finally {
  await writeFile(`${out}/${process.env.QA_BASE?'live':'local'}-checks.json`,JSON.stringify({base,at:new Date().toISOString(),results,errors},null,2));
  await browser.close();
}
if(results.some(r=>r.status==='FAIL')||errors.length) process.exitCode=1;
