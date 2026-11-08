/* Captures actual deployed source pages as compact WebP preview assets. Run on CI or locally. */
import { mkdir, readFile } from "node:fs/promises";
import { chromium } from "playwright";
import sharp from "sharp";
const base = process.env.PREVIEW_BASE_URL || "https://flash-ui-portfolio.vercel.app";
const config = JSON.parse(await readFile("data/asset-previews.json","utf8"));
await mkdir("assets/previews",{recursive:true});
const browser = await chromium.launch({headless:true,args:["--no-sandbox"]});
const context = await browser.newContext({viewport:{width:1280,height:800},deviceScaleFactor:1,reducedMotion:"reduce"});
let failed = 0,passed = 0;
try {
  for (const [id,entry] of Object.entries(config.projects)) {
    const url = new URL(entry.target,base).href;
    const filename = "assets/previews/" + id + ".webp";
    const page = await context.newPage();
    try {
      const response = await page.goto(url,{waitUntil:"domcontentloaded",timeout:45000});
      if (!response || !response.ok()) throw new Error("HTTP " + (response?.status() ?? "unknown"));
      await page.waitForTimeout(1800);
      const shot = await page.screenshot({type:"png",animations:"disabled",caret:"hide",fullPage:false});
      await sharp(shot).resize({width:960,withoutEnlargement:true}).webp({quality:77,effort:4}).toFile(filename);
      passed += 1;
      console.log("CAPTURED " + id + " " + url + " => " + filename);
    } catch (error) {
      failed += 1;
      console.error("FAILED " + id + ": " + error.message);
    } finally { await page.close(); }
  }
} finally { await browser.close(); }
console.log("Preview captures: " + passed + " passed, " + failed + " failed");
if (failed) process.exitCode = 1;
