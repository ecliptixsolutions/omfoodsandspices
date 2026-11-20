import assert from "node:assert/strict";
import { validateEnquiry, normalizeEnquiry, sanitizePhoneInput, PACKAGING_OPTIONS, TIMELINE_OPTIONS, type EnquiryPayload } from "../src/lib/enquiry";
import { validationTranslations } from "../src/content/translations-validation";
const base: EnquiryPayload = {type:"quote",name:"Test Buyer",company:"",email:"buyer@example.invalid",phone:"",country:"India",products:["White onion flakes"],formSize:"",quantity:"1,000.5",unit:"kg",packaging:PACKAGING_OPTIONS[0],destination:"",timeline:TIMELINE_OPTIONS[0],message:"",website:"",startedAt:Date.now()-5000};
const available=base.products;
assert.deepEqual(validateEnquiry(base,available),{});
assert.equal(sanitizePhoneInput("+91abc 81407 12205"), "+91 81407 12205");
assert.equal(sanitizePhoneInput("++91+8140712205"), "+918140712205");
assert.equal(sanitizePhoneInput("12345678901234567890"), "123456789012345");
assert.ok(validateEnquiry({...base, phone:"0000000000"}).phone);
for(const name of ["વીવેક પટેલ","विवेक पटेल","O’Connor","Jean-Luc"]) assert.deepEqual(validateEnquiry({...base,name},available),{});
for(const input of [null,[],42,"text"]) assert.ok(Object.keys(validateEnquiry(input,available)).length);
const cases: [keyof EnquiryPayload,unknown[]][] = [
 ["name",[" ","12","...","A".repeat(161)]], ["email",["a@", "a b@c.com","a".repeat(256)]],
 ["phone",["-------","+91abc123","123456","1".repeat(16)]], ["country",["XX"," "]],
 ["quantity",["0","-1","+1","...","1k","1,00","1e3","Infinity"]],
 ["products",[[],["unknown"],[...available,...available],[null]]], ["unit",["litres",null]],
 ["packaging",["fake"]], ["timeline",["yesterday"]], ["company",[123,"x".repeat(201)]],
 ["message",[null,"x".repeat(2001)]], ["type",["fake"]],
];
let count=0;for(const [key,values] of cases) for(const value of values){const errors=validateEnquiry({...base,[key]:value},available);assert.ok(errors[key],`${key}: ${String(value)}`);if(typeof errors[key]==="string") for(const locale of ["hi","gu"] as const)assert.ok(validationTranslations[locale][errors[key]!],`Missing ${locale} error translation`);count++;}
assert.deepEqual(validateEnquiry({...base,type:"sample",quantity:"",unit:"Sample / Trial Order"},available),{});
assert.ok(validateEnquiry({...base,unit:"Sample / Trial Order"},available).unit);
assert.ok(validateEnquiry({...base,type:"sample",quantity:"",unit:"kg"},available).unit);
assert.deepEqual(validateEnquiry({...base,phone:"+91 (81407) 12205"},available),{});
const normalized=normalizeEnquiry({...base,name:"  Test Buyer  ",email:" BUYER@EXAMPLE.INVALID ",company:undefined});assert.equal(normalized.name,"Test Buyer");assert.equal(normalized.email,"buyer@example.invalid");assert.equal(normalized.company,"");
console.log(`Passed ${count} invalid-input cases, valid multilingual names, valid quote/sample requests, translations and normalization.`);
