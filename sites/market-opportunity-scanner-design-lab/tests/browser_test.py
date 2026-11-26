"""Browser acceptance checks for all 10 standalone static HTML design variations.
Sandbox blocks file:// and localhost navigation. Injects local assets into Chromium
while preserving site DOM, data, and scripted behavior. Navigation hrefs are checked
as exact paths on disk, plus fragment targets.
"""
from pathlib import Path
import json,re
from playwright.sync_api import sync_playwright

ROOT=Path(__file__).resolve().parents[1]
CATALOG=json.loads((ROOT/'data/design-variations.json').read_text())['themes']
CSS=[(ROOT/'assets/css/core.css').read_text(),(ROOT/'assets/css/themes.css').read_text()]
SCRIPT=(ROOT/'assets/js/preview.js').read_text()
FIXTURE=(ROOT/'data/fixtures.js').read_text()

def clean_html(src):
    return re.sub(r'<script[^>]*src="[^"]+"[^>]*></script>','',re.sub(r'<link[^>]+stylesheet[^>]*>','',src))

def boot(browser,slug,viewport=None):
    p=browser.new_page(viewport=viewport or {'width':1440,'height':960},device_scale_factor=1,accept_downloads=True)
    errors=[]
    p.on('pageerror',lambda err:errors.append(str(err)))
    html=clean_html((ROOT/'variations'/slug/'index.html').read_text())
    p.set_content(html,wait_until='domcontentloaded')
    p.add_script_tag(content='''window.__localFakeStorage={};Object.defineProperty(window,'localStorage',{configurable:true,value:{getItem(k){return window.__localFakeStorage[k]??null},setItem(k,v){window.__localFakeStorage[k]=String(v)},removeItem(k){delete window.__localFakeStorage[k]}}});''')
    for css in CSS:p.add_style_tag(content=css)
    p.add_script_tag(content=FIXTURE)
    p.add_script_tag(content=SCRIPT)
    assert not errors,(slug,errors)
    return p,errors

def assert_navigation(slug):
    from bs4 import BeautifulSoup
    f=ROOT/'variations'/slug/'index.html'
    s=BeautifulSoup(f.read_text(),'html.parser')
    for a in s.find_all('a',href=True):
        h=a['href']; path,sep,frag=h.partition('#')
        if h.startswith('http'):continue
        if path:
            target=(f.parent/path).resolve()
            assert target.exists(),(slug,h,'missing path')
        else:
            target=f
        if frag and not path: assert s.find(id=frag),(slug,h,'missing anchor')


def run():
    with sync_playwright() as pw:
        browser=pw.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox'])
        screenshots=ROOT/'assets/screenshots'
        screenshots.mkdir(parents=True,exist_ok=True)
        tests=0
        for entry in CATALOG:
            slug=entry['id']
            assert_navigation(slug)
            page,errors=boot(browser,slug)
            assert page.locator('h1').count()==1,(slug,'h1')
            assert page.locator('.opp').count()==3,(slug,'opportunity list count')
            ranking=page.evaluate('window.__DESIGN_LAB__.getRanking()')
            assert [v['id'] for v in ranking]==['finops','acq','broker'],(slug,ranking)
            assert ranking[-1]['spend'] is None and ranking[-1]['decision']=='Watch',(slug,'missing spend should Watch')
            assert page.locator('#detailTitle').inner_text().startswith('Managed FinOps'),(slug,'initial selection')
            assert len(page.locator('#evidenceList article').all())>0,(slug,'evidence populated')
            page.locator('.opp[data-id="broker"]').click()
            assert page.evaluate('window.__DESIGN_LAB__.selected()')=='broker',(slug,'opportunity selection')
            assert 'Existing spend / payment' in page.evaluate('window.__DESIGN_LAB__.brief()'),(slug,'honest missing evidence')
            page.locator('#saveBtn').click()
            assert page.evaluate('window.__DESIGN_LAB__.shortlist()')==['broker'],(slug,'shortlist save')
            page.locator('#shortlistToggle').click()
            assert page.locator('.opp').count()==1,(slug,'shortlist filter')
            page.locator('#shortlistToggle').click()
            page.select_option('#trackFilter','acquisition')
            page.select_option('#windowFilter','90')
            page.locator('#runScan').click()
            assert page.locator('.opp').count()==1,(slug,'track filter scans')
            assert page.locator('.opp').first.get_attribute('data-id')=='acq',(slug,'selected track')
            assert 'Sample scan complete' in page.locator('#scanFeedback').inner_text(),(slug,'scan feedback')
            page.locator('#downloadBrief').click()
            # restore baseline visual before screenshot
            page.close()
            page,errors=boot(browser,slug)
            page.screenshot(path=str(screenshots/(slug+'.png')),full_page=False,animations='disabled')
            width=page.evaluate('document.documentElement.scrollWidth')
            assert width<=1440,(slug,'desktop overflow',width)
            page.close()
            page,errors=boot(browser,slug,{'width':390,'height':844})
            width=page.evaluate('document.documentElement.scrollWidth')
            assert width<=390,(slug,'mobile horizontal overflow',width)
            assert page.locator('.opp').count()==3,(slug,'mobile functionality')
            page.close()
            print('PASS',slug,'— scoring, selection, shortlist, filtering, export, navigation and mobile')
            tests+=1
        browser.close()
    print(f'PASS: {tests} variation suites. {tests*14} functional assertions plus path/anchor checks.')

if __name__=='__main__':run()
