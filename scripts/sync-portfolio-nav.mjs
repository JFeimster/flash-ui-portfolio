import fs from 'node:fs';
import { execFileSync } from 'node:child_process';
import { isPortfolioPage, pageRoute, applyPortfolioNav } from '../assets/js/portfolio-nav.mjs';
const paths=execFileSync('git',['ls-files','-z'],{encoding:'utf8'}).split('\0').filter(isPortfolioPage);
let drift=0;
for(const path of paths){const old=fs.readFileSync(path,'utf8');const next=applyPortfolioNav(old,pageRoute(path));if(old!==next){drift++;console.log(path);if(!process.argv.includes('--check'))fs.writeFileSync(path,next);}}
console.log(paths.length+' portfolio pages; '+drift+' navigation differences');
if(drift&&process.argv.includes('--check'))process.exitCode=1;
