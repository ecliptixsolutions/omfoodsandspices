import assert from 'node:assert/strict';import recovery from '../src/content/blog-public-recovery.json';import {selectBlogCards,type PublicBlogCard,type BlogPost} from '../src/lib/blog';
const template=recovery.posts[0].published as BlogPost;
const posts:PublicBlogCard[]=Array.from({length:14},(_,i)=>({id:String(i),publishedAt:'2026-11-17T00:00:00Z',published:{...template,title:`Ingredient ${i}`,slug:`ingredient-${i}`,category:i%2?'garlic':'onion',tags:[i===7?'seasonings':'industry'],featured:i===0}}));
const all={q:'',category:'',page:1};const ids:string[]=[];
for(let page=1;page<=3;page++){const selected=selectBlogCards(posts,{...all,page});assert.equal(selected.pages,3);assert.equal(selected.featured?.id,'0');ids.push(...selected.visible.map(p=>p.id));}
assert.equal(ids.length,13);assert.equal(new Set(ids).size,13);assert(!ids.includes('0'));
assert.deepEqual(selectBlogCards(posts,{q:'seasonings',category:'garlic',page:1}).visible.map(p=>p.id),['7']);
assert.equal(selectBlogCards(posts,{q:'seasonings',category:'onion',page:1}).latest.length,0);
assert.equal(selectBlogCards(posts,{...all,category:'garlic',page:99}).page,2);
assert.equal(selectBlogCards(posts,all).latest.length,13);
assert.equal(selectBlogCards([],all).visible.length,0);
console.log('PASS: all 14 eligible fixture cards accounted for, no featured duplication across pages, combined search/category, page clamp and empty state. No fixture records were published.');
