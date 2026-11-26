import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {chromium} from 'playwright';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const browser=await chromium.launch({headless:true});
const page=await browser.newPage();
const errors=[];page.on('pageerror',error=>errors.push(error.message));
await page.route('http://app.test/**',async route=>{
 const pathname=decodeURIComponent(new URL(route.request().url()).pathname);
 const file=path.resolve(root,'.'+pathname,(pathname.endsWith('/')?'index.html':''));
 if(!file.startsWith(root+path.sep)||!fs.existsSync(file)||!fs.statSync(file).isFile())return route.fulfill({status:404,body:'Not found'});
 return route.fulfill({path:file});
});
try{
 await page.goto('http://app.test/ecosystem/?asset=site:commission-estimator',{waitUntil:'networkidle'});
 assert.match(await page.locator('#totalCount').innerText(),/products/);
 assert.match(await page.locator('#detail h2').innerText(),/Commission Estimator/i);
 assert.ok(await page.locator('#detail .variant-tile').count()>=4);
 assert.ok(await page.locator('#detail').innerText().then(text=>text.includes('Integration & MCP Advisor')));
 await page.locator('.comparison select').selectOption('jester-quotes');
 assert.ok(await page.locator('.comparison table tr').count()>=5);
 await page.goto('http://app.test/themes/',{waitUntil:'networkidle'});
 assert.ok(await page.locator('.theme-card').count()>=20);
 assert.ok(await page.locator('#detail h2').count());
 await page.locator('#projectIdea').fill('editorial collage');await page.locator('#recommend').click();assert.ok(await page.locator('.recommendation').count());
 assert.deepEqual(errors,[]);
 console.log('Asset studio smoke: explorer and canonical theme gallery rendered without page errors');
}finally{await browser.close()}
