import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {chromium} from 'playwright';
const base=process.env.PLAYWRIGHT_BASE_URL||'http://127.0.0.1:4173';
const registry=JSON.parse(await readFile(new URL('../data/collections-registry.json',import.meta.url),'utf8'));
const browser=await chromium.launch({headless:true});
const page=await browser.newPage({viewport:{width:1365,height:850}});
const errors=[];page.on('pageerror',e=>errors.push(e.message));
const visit=async path=>{const result=await page.goto(new URL(path,base).href,{waitUntil:'domcontentloaded'});assert.equal(result?.status(),200,'route should serve HTML: '+path)};
try{
 await visit('/collections/');
 await page.locator('#count').getByText('20 of 20 collections').waitFor();
 await page.locator('#search').fill('automation');
 assert.ok(Number((await page.locator('#count').textContent()).split(' ')[0])>0,'collection search narrows results');
 await page.locator('#reset').click();
 for(const group of registry.collections.filter(x=>x.dataPath.startsWith('/data/collections/'))){
  await visit(group.url);
  await page.locator('#count').getByText(group.count+' of '+group.count+' product ideas').waitFor();
  await page.locator('#cards .idea-card').first().click();
  assert.ok((await page.locator('#inspector').textContent()).includes('Acceptance criteria'),'specification should include practical acceptance criteria');
  await page.locator('#search').fill('zz-no-match-'+group.id);
  await page.locator('#count').getByText('0 of '+group.count+' product ideas').waitFor();
 }
 const uniquePaths=new Set();
 for(const group of registry.collections){
  const data=JSON.parse(await readFile(new URL('..'+group.dataPath,import.meta.url),'utf8'));
  for(const item of data.entries.filter(x=>x.status==='functional-prototype')){
   assert.ok(item.demoPath);
   assert.ok(!uniquePaths.has(item.demoPath),'unique tool path');
   uniquePaths.add(item.demoPath);
   await visit(item.demoPath);
   if(item.demoPath.includes('missed-call')||item.demoPath.includes('invoice-follow')||item.demoPath.includes('onboarding')||item.demoPath.includes('qualification')||item.demoPath.includes('roi-calculator')||item.demoPath.includes('quote-widget')||item.demoPath.includes('agency-launch')){
    await page.locator('#workflowJSON').waitFor();
    assert.ok((await page.locator('#workflowJSON').inputValue()).includes('"metrics"'),'working structured workflow output');
    assert.equal(await page.locator('#download').isDisabled(),false,'JSON export enabled');
   }else{
    await page.locator('#results .metric').first().waitFor();
    assert.ok((await page.locator('#resultStatus').textContent()).includes('calculated locally'));
   }
  }
 }
 assert.equal(uniquePaths.size,17);
 await visit('/collections/ai-automation-workflows/');
 await page.setViewportSize({width:390,height:840});
 assert.ok((await page.evaluate(()=>document.documentElement.scrollWidth))<=392,'no mobile horizontal overflow');
 assert.deepEqual(errors,[],'no browser JS errors');
 console.log('Collections browser smoke passed: 20 collections, 178 ideas, 17 working tools, search, specs, exports and mobile.');
}finally{await browser.close()}
