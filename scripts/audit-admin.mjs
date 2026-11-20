import { writeFile, mkdir } from 'node:fs/promises';
const base=process.env.AUDIT_BASE||'https://om-food-exact-preview.vercel.app';
const results=[]; let cookie=''; const cleanup=[];
async function request(path,method='GET',body,auth=true){
 const r=await fetch(base+path,{method,headers:{Origin:base,...(auth&&cookie?{Cookie:cookie}:{}),...(body?{'Content-Type':'application/json'}:{})},body:body?JSON.stringify(body):undefined,redirect:'manual',signal:AbortSignal.timeout(60000)});
 const text=await r.text();let data;try{data=JSON.parse(text)}catch{}
 return {status:r.status,data,text,cookies:r.headers.getSetCookie()};
}
function check(feature,ok,proof){results.push({feature,status:ok?'PASS':'FAILED',proof});console.log(`${ok?'PASS':'FAIL'} ${feature}`)}
async function login(){const r=await request('/api/admin/auth/login','POST',{email:process.env.AUDIT_EMAIL,password:process.env.AUDIT_PASSWORD},false);cookie=r.cookies.map(c=>c.split(';')[0]).join('; ');check('Owner login',r.data?.ok===true,`HTTP ${r.status}`);if(!r.data?.ok)throw Error('Login failed');}
const marker='QA-AUDIT-'+Date.now();
try{
 for(const route of ['dashboard','products','categories','content','enquiries','media','users','security','backups']){const r=await request('/api/admin/'+route,'GET',null,false);check('Unauthenticated '+route,r.status===401,`HTTP ${r.status}`)}
 await login();
 const originalProducts=(await request('/api/admin/products')).data.products;
 for(const route of ['dashboard','categories','content','enquiries','media','users','security','backups']){const r=await request('/api/admin/'+route);check('Authenticated '+route,r.status===200&&!!r.data,`HTTP ${r.status}; response parsed`)}
 const prod={...structuredClone(originalProducts[0].draft),slug:marker.toLowerCase(),name:marker,shortName:marker,description:marker,overview:marker,seoTitle:marker,seoDescription:marker};
 const created=await request('/api/admin/products','POST',{product:prod,publish:false,displayOrder:9000});const id=created.data?.id;if(!id)throw Error('Temporary product creation failed');cleanup.push(()=>request('/api/admin/products','DELETE',{id}));
 let publicPage=await request('/products/'+prod.slug,'GET',null,false);check('Draft product hidden publicly',publicPage.status===404,`HTTP ${publicPage.status}`);
 const preview=await request('/api/admin/preview','POST',{}); const previewCookie=preview.cookies.map(c=>c.split(';')[0]).join('; ');cookie+='; '+previewCookie;
 const draftPage=await request('/products/'+prod.slug);check('Authorized product draft preview',draftPage.status===200&&draftPage.text.includes(marker),`HTTP ${draftPage.status}; marker ${draftPage.text.includes(marker)}`);
 await request('/api/admin/preview','DELETE',{});cookie=cookie.split('; ').filter(c=>!c.startsWith('om_admin_preview=')).join('; ');
 const pub=await request('/api/admin/products','POST',{id,product:prod,publish:true,displayOrder:9000});check('Publish temporary product',pub.data?.ok===true,`HTTP ${pub.status}`);
 for(const path of ['/products/'+prod.slug,'/products','/dehydrated-'+(prod.category==='onion'?'onions':'garlic'),'/enquiry']){const r=await request(path,'GET',null,false);check('Published product reflected '+path,r.status===200&&r.text.includes(marker),`HTTP ${r.status}; marker ${r.text.includes(marker)}`)}
 const duplicate=await request('/api/admin/products','POST',{product:prod,publish:false});check('Duplicate product slug rejected',duplicate.status===409,`HTTP ${duplicate.status}; returned same id ${duplicate.data?.id===id}`);
 const invalid=await request('/api/admin/products','POST',{product:{slug:'invalid'}});check('Invalid product rejected',invalid.status===422,`HTTP ${invalid.status}`);
 const cat=await request('/api/admin/categories','POST',{value:{slug:marker.toLowerCase(),name:marker,description:marker,image:''},publish:false});if(cat.data?.id){const cid=cat.data.id;cleanup.push(()=>request('/api/admin/categories','DELETE',{id:cid}));const rows=(await request('/api/admin/categories')).data.categories;check('Category draft persisted',rows.some(c=>c.id===cid&&c.status==='draft'),`temporary id verified`);const p=await request('/api/admin/categories','POST',{id:cid,value:{slug:marker.toLowerCase(),name:marker,description:marker,image:''},publish:true});check('Category publish persisted',p.data?.ok===true,`HTTP ${p.status}`)}
 for(const [key,field,path] of [['home','heroNote','/'],['contact','hoursNote','/'],['general','websiteTitle','/'],['page:/about','intro','/about'],...['plant','process','quality-food-safety','responsible-manufacturing','packaging-export'].map(s=>['page:/about/'+s,'intro','/about/'+s]),['page:/sourcing','intro','/sourcing']]){
  const original=(await request('/api/admin/content?key='+encodeURIComponent(key))).data.content;const value=structuredClone(original.draft);const contentMarker=marker+'-'+key.replace(/[^a-z]/g,'');value[field]=contentMarker;
  try{
   const saved=await request('/api/admin/content','PATCH',{key,value,publish:false});check('Save draft '+key,saved.data?.ok===true,`HTTP ${saved.status}`);
   let page=await request(path,'GET',null,false);check('Draft isolated '+key,!page.text.includes(contentMarker),`marker absent ${!page.text.includes(contentMarker)}`);
   const published=await request('/api/admin/content','PATCH',{key,value,publish:true});page=await request(path,'GET',null,false);check('Publish visible '+key,published.data?.ok===true&&page.text.includes(contentMarker),`HTTP ${published.status}; marker ${page.text.includes(contentMarker)}`);
  }finally{await request('/api/admin/content','PATCH',{key,value:original.published||original.draft,publish:true});await request('/api/admin/content','PATCH',{key,value:original.draft,publish:false});const restored=await request(path,'GET',null,false);check('Restored original '+key,!restored.text.includes(contentMarker),'temporary marker removed')}
 }
 const logout=await request('/api/admin/auth/logout','POST',{});const after=await request('/api/admin/dashboard');check('Logout invalidates session',logout.status===200&&after.status===401,`logout ${logout.status}; protected ${after.status}`);
 await login();
}catch(e){results.push({feature:'Audit execution',status:'FAILED',proof:e.message});console.log('AUDIT_ERROR '+e.message)}finally{
 for(const fn of cleanup.reverse()){try{const r=await fn();check('Temporary record cleanup',r.data?.ok===true,`HTTP ${r.status}`)}catch(e){check('Temporary record cleanup',false,e.message)}}
 await mkdir('audit',{recursive:true});await writeFile('audit/admin-functional-results.json',JSON.stringify({base,marker,generatedAt:new Date().toISOString(),results},null,2));
}


