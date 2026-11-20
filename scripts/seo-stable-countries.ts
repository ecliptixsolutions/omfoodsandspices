import {COUNTRIES} from '../src/lib/countries';
import {writeFileSync} from 'node:fs';
writeFileSync('src/lib/countries.json',JSON.stringify(COUNTRIES,null,2)+'\n');
console.log('Saved '+COUNTRIES.length+' deterministic country labels for server and browser.');
