import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const file=path.join(root,'assets/js/site-generator.js');
const old='handleEvents(); sourceFilterOptions(); renderAllControls(); renderSourcePicker(); syncFieldsFromState(); updateOutput(true);';
const add=`${old}\n      const requestedIdea = new URLSearchParams(location.search).get('idea');\n      if (requestedIdea && library.some(item => item.id === requestedIdea)) selectSource(requestedIdea);`;
const current=fs.readFileSync(file,'utf8');
if(current.includes('const requestedIdea = new URLSearchParams(location.search)')) {console.log('Deep link already installed');process.exit(0);}
if(!current.includes(old)) throw new Error('Unknown Site Generator init structure; no changes made.');
fs.writeFileSync(file,current.replace(old,add));
console.log('Added ?idea=<id> support to Site Generator');
