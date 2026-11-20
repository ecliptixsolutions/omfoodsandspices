import ts from 'typescript';
import {readdir,readFile,writeFile} from 'node:fs/promises';
import path from 'node:path';
async function files(dir){return (await Promise.all((await readdir(dir,{withFileTypes:true})).map(e=>e.isDirectory()?files(path.join(dir,e.name)):[path.join(dir,e.name)]))).flat();}
const relevant=(await files('src')).filter(p=>/\.(ts|tsx)$/.test(p)&&!/[\\/](admin|api|fonts)[\\/]|translations|locale-dictionaries|blog-public-recovery|countries/.test(p)&&(/src[\\/](content|components)[\\/]/.test(p)||/src[\\/]app/.test(p)||p.endsWith('enquiry.ts')));
const inventory=[];
for(const file of relevant){const source=await readFile(file,'utf8');const ast=ts.createSourceFile(file,source,ts.ScriptTarget.Latest,true);let before='';try{before=await readFile(path.join('audit/seo/source-before',file),'utf8');}catch{}
 function visit(node){let value;
 if(ts.isJsxText(node))value=node.text.trim().replace(/\s+/g,' ');
 else if(ts.isStringLiteral(node)||ts.isNoSubstitutionTemplateLiteral(node)){
  const parent=node.parent;
  if(file.includes(path.sep+'content'+path.sep)||file.endsWith('enquiry.ts')||ts.isJsxExpression(parent)||ts.isJsxAttribute(parent)&&['alt','title','placeholder','aria-label','eyebrow','line1','line2','intro'].includes(parent.name.getText(ast)))value=node.text;
 }
 if(value&&/[a-zA-Z]{3}/.test(value)&&!/^(@\/|\.|\/|https?:)/.test(value)){inventory.push({file:file.replaceAll('\\','/'),line:ast.getLineAndCharacterOfPosition(node.getStart(ast)).line+1,text:value,status:before.includes(value)?'Reviewed / retained':'Rewritten or added'});}
 ts.forEachChild(node,visit);
 }visit(ast);
}
await writeFile('audit/seo/source-text-inventory.json',JSON.stringify(inventory,null,2));
const quote=x=>'"'+String(x).replaceAll('"','""')+'"';
await writeFile('audit/seo/source-text-inventory.csv',['file,line,status,text',...inventory.map(x=>[x.file,x.line,x.status,x.text].map(quote).join(','))].join('\n'));
console.log(`Inventoried ${inventory.length} source text entries in ${relevant.length} public implementation files.`);
