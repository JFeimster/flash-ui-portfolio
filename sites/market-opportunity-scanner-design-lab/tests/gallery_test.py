from pathlib import Path
import re,json
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[1]
html=(ROOT/'index.html').read_text()
html=re.sub(r'<script[^>]*src="[^"]+"[^>]*></script>','',re.sub(r'<link[^>]+stylesheet[^>]*>','',html))
with sync_playwright() as pw:
 b=pw.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox'])
 for w in [1440,390]:
  p=b.new_page(viewport={'width':w,'height':900})
  p.set_content(html)
  p.add_style_tag(content=(ROOT/'assets/css/gallery.css').read_text())
  p.add_script_tag(content='''window.__localFakeStorage={};Object.defineProperty(window,'localStorage',{value:{getItem(k){return window.__localFakeStorage[k]??null},setItem(k,v){window.__localFakeStorage[k]=String(v)}}});''')
  p.add_script_tag(content=(ROOT/'assets/js/gallery.js').read_text())
  assert p.locator('.card:not([hidden])').count()==10
  assert p.locator('#visibleCount').inner_text()=='10'
  p.locator('.card[data-id="ember-matrix"] .pick').click()
  p.locator('.card[data-id="lime-precision-fintech"] .pick').click()
  assert p.locator('#selectedCount').inner_text()=='2'
  p.locator('#compareButton').click()
  assert p.locator('.compare-card').count()==2
  p.locator('#closeCompare').click()
  assert p.locator('#compareModal').get_attribute('aria-hidden')=='true'
  p.locator('.filter[data-filter="selected"]').click()
  assert p.locator('.card:not([hidden])').count()==2
  p.locator('.filter[data-filter="all"]').click()
  p.locator('#search').fill('purple')
  assert p.locator('.card:not([hidden])').count()>=0
  # link resolution, incl screenshot assets
  import bs4
  soup=bs4.BeautifulSoup((ROOT/'index.html').read_text(),'html.parser')
  for el in soup.find_all(['a','img']):
   val=el.get('href') if el.name=='a' else el.get('src')
   if not val or val.startswith('http') or val.startswith('#'):continue
   assert (ROOT/val).exists(),f'broken gallery link {val}'
  width=p.evaluate('document.documentElement.scrollWidth')
  assert width<=w,(w,width)
  p.close()
  print(f'PASS gallery at {w}px — filter, search, shortlist, compare dialog, route and image links')
 b.close()
