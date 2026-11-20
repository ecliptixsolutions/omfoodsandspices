import net from 'node:net';
import mysql from 'mysql2/promise';
import {loadEnvConfig} from '@next/env';
import {mkdir,writeFile,access} from 'node:fs/promises';
loadEnvConfig(process.cwd());
async function main(){
 const path='audit/seo/database-content-before.json';
 try{await access(path);console.log('Original content snapshot already exists; preserved.');return;}catch{}
 const u=new URL(process.env.MYSQL_URL!);
 const db=await mysql.createConnection({host:u.hostname,stream:()=>net.connect({host:'31.97.208.37',port:Number(u.port)||3306}),user:decodeURIComponent(u.username),password:decodeURIComponent(u.password),database:u.pathname.slice(1),charset:'utf8mb4',timezone:'Z',ssl:{rejectUnauthorized:true},connectTimeout:20000});
 try{const out:Record<string,unknown>={capturedAt:new Date().toISOString()};
 for(const [table,fields] of [['om_site_content','content_key,draft_json,published_json,published_at,updated_at'],['om_products','id,slug,status,draft_json,published_json,updated_at'],['om_blog_posts','id,slug,status,draft_json,published_json,published_at,updated_at'],['om_blog_settings','id,content_json']] as const){const [rows]=await db.query(`SELECT ${fields} FROM ${table}`);out[table]=rows;}
 await mkdir('audit/seo',{recursive:true});await writeFile(path,JSON.stringify(out,null,2));
 console.log('Saved existing CMS copy and separate drafts. No credentials, enquiries or users included; no database changes.');
 }finally{await db.end();}
}
main().catch(e=>{console.error(e.code||'Content snapshot failed');process.exitCode=1});
