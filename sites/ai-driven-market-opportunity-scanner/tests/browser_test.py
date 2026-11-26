"""Browser-level regression suite with assets injected directly into Chromium.
Useful in sandboxes that prohibit local HTTP and file:// navigation.
Usage: python tests/browser_test.py
Requires: pip install playwright; system Chromium installed.
"""
from pathlib import Path
import json
from playwright.sync_api import sync_playwright

ROOT=Path(__file__).resolve().parents[1]
HTML=(ROOT/'index.html').read_text().replace('<link rel="stylesheet" href="./styles.css">','').replace('<script src="./data/fixtures.js" defer></script>','').replace('<script src="./app.js" defer></script>','')


def boot(browser, viewport=None, storage=None):
    page=browser.new_page(viewport=viewport or {'width':1440,'height':900}, accept_downloads=True)
    errors=[]
    page.on('pageerror',lambda err:errors.append(str(err)))
    page.set_content(HTML)
    # This sandbox blocks storage at the opaque about:blank origin. Stub only the
    # Storage API so localStorage-based behavior can still be regression-tested.
    seeded=json.dumps({'jf-opportunity-scanner-v1': storage} if storage is not None else {})
    page.add_script_tag(content=f"const _demoStore={seeded};Object.defineProperty(window,'localStorage',{{configurable:true,value:{{getItem:(k)=>_demoStore[k]??null,setItem:(k,v)=>{{_demoStore[k]=String(v)}},removeItem:(k)=>{{delete _demoStore[k]}}}}}});")
    page.add_style_tag(content=(ROOT/'styles.css').read_text())
    page.add_script_tag(content=(ROOT/'data'/'fixtures.js').read_text())
    page.add_script_tag(content=(ROOT/'app.js').read_text())
    assert not errors, f'JS errors: {errors}'
    return page,errors


def check(page,condition,message):
    assert condition,message
    print('PASS:',message)


def run():
    with sync_playwright() as p:
        browser=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox'])
        page,errors=boot(browser)
        initial=page.evaluate('window.__SCANNER_DIAGNOSTICS__.getRanking()')
        check(page,len(initial)==3,'three demo research tracks available')
        check(page,initial[0]['id']=='finops' and initial[-1]['id']=='broker','ranking orders strong spend evidence over trend-only technology')
        check(page,initial[-1]['spend'] is None and initial[-1]['decision']=='Watch','no payer signals stays Watch with unknown spend')
        check(page,'Missing evidence dimensions: Existing spend / payment' in page.evaluate('''() => { document.querySelector('[data-select="broker"]').click(); return window.__SCANNER_DIAGNOSTICS__.briefMarkdown() }'''),'honest broker brief exports missing payer evidence')
        # Run sample scan and verify filtered opportunities, coverage and explicit missing categories.
        page.select_option('#trackSelect','brokertech')
        page.click('#runScan')
        check(page,page.locator('#opportunitiesBody tr').count()==1,'sample scan filters opportunities by track')
        check(page,'Missing' in page.locator('#coverageList').inner_text(),'coverage shows missing source categories')
        page.select_option('#trackSelect','all')
        page.click('#runScan')
        # Invalid CSV rejected atomically.
        before=page.evaluate('window.__SCANNER_DIAGNOSTICS__.getEvidenceCount()')
        broken=b'opportunity_id,source,source_category,date,geography,evidence_type,excerpt,event_key,signal,stance\nbroker,Buyer,buyer,2026-99-77,US,measured,This date is invalid,x-001,spend,support\n'
        page.locator('#csvFile').set_input_files({'name':'bad.csv','mimeType':'text/csv','buffer':broken})
        page.wait_for_function("!document.querySelector('#importFeedback').hidden")
        page.wait_for_timeout(50)
        check(page,'Row 2' in page.locator('#importFeedback').inner_text() and 'Nothing was imported' in page.locator('#importFeedback').inner_text(),'invalid CSV shows row-level errors and atomic failure')
        check(page,page.evaluate('window.__SCANNER_DIAGNOSTICS__.getEvidenceCount()')==before,'failed CSV does not alter evidence')
        # Valid CSV makes broker top-ranked because paid buyer signals and cost evidence now present.
        page.locator('#csvFile').set_input_files(str(ROOT/'data'/'example-broker-import.csv'))
        page.wait_for_function("document.querySelector('#importFeedback').classList.contains('success')")
        after=page.evaluate('window.__SCANNER_DIAGNOSTICS__.getRanking()')
        check(page,after[0]['id']=='broker' and after[0]['priority']>initial[-1]['priority'],'CSV import changes ranking and broker moves to first')
        check(page,after[0]['decision']=='Test' and after[0]['spend'] is not None,'imported payer evidence changes decision to Test')
        count_after=page.evaluate('window.__SCANNER_DIAGNOSTICS__.getEvidenceCount()')
        page.locator('#csvFile').set_input_files(str(ROOT/'data'/'example-broker-import.csv'))
        page.wait_for_function("document.querySelector('#importFeedback').textContent.includes('6 exact duplicate')")
        check(page,page.evaluate('window.__SCANNER_DIAGNOSTICS__.getEvidenceCount()')==count_after,'exact re-import skips duplicate reports')
        # Distinct repeated report with same event key must not change priority.
        old=page.evaluate('window.__SCANNER_DIAGNOSTICS__.getRanking()[0].priority')
        page.click('#addEvidence')
        page.locator('#addEvidenceForm [name="opportunity_id"]').select_option('broker')
        page.locator('#addEvidenceForm [name="source"]').fill('Separate analyst of same pilot')
        page.locator('#addEvidenceForm [name="geography"]').fill('US — National')
        page.locator('#addEvidenceForm [name="signal"]').select_option('spend')
        page.locator('#addEvidenceForm [name="evidence_type"]').select_option('measured')
        page.locator('#addEvidenceForm [name="event_key"]').fill('broker-paid-1')
        page.locator('#addEvidenceForm [name="excerpt"]').fill('Another report about the same underlying paid pilot; should not inflate priority.')
        page.locator('#addEvidenceForm button[type="submit"]').click()
        check(page,page.evaluate('window.__SCANNER_DIAGNOSTICS__.getRanking()[0].priority')==old,'repeat report same event does not inflate priority')
        # Shortlist/edit persistence after reload via saving localStorage and reinjecting app.
        page.locator('[data-shortlist="broker"]').click()
        page.locator('[data-select="broker"]').click()
        page.locator('#sizeCount').fill('850')
        page.locator('#experimentOwner').fill('Juliet Foxtrot venture lead')
        check(page,'850 reachable brokerage accounts' in page.evaluate('window.__SCANNER_DIAGNOSTICS__.briefMarkdown()'),'editing market assumptions updates exported brief')
        check(page,'Juliet Foxtrot venture lead' in page.evaluate('window.__SCANNER_DIAGNOSTICS__.briefMarkdown()'),'editing experiment owner updates exported brief')
        saved=page.evaluate('localStorage.getItem("jf-opportunity-scanner-v1")')
        reloaded,reloaded_errors=boot(browser,{'width':1200,'height':900},saved)
        check(reloaded,reloaded.locator('#sizeCount').input_value()=='850','market sizing persists after reload')
        check(reloaded,reloaded.locator('#experimentOwner').input_value()=='Juliet Foxtrot venture lead','experiment edits persist after reload')
        check(reloaded,reloaded.locator('#shortlistCount').inner_text()=='1','shortlist persists after reload')
        # Honest export with user selected broker before import (fresh page).
        fresh,errs=boot(browser)
        fresh.locator('[data-select="broker"]').click()
        brief=fresh.evaluate('window.__SCANNER_DIAGNOSTICS__.briefMarkdown()')
        check(fresh,'Missing evidence dimensions: Existing spend / payment' in brief,'unfunded opportunity still generates an honest brief')
        with fresh.expect_download() as info:
            fresh.click('#downloadBrief')
        download=info.value
        check(fresh,download.suggested_filename=='jf-opportunity-brief-broker.md','Markdown export produces named file')
        # Responsive width: no overall document overflow, and mobile evidence is stacked.
        mobile,merrors=boot(browser,{'width':390,'height':844})
        overflow=mobile.evaluate('document.documentElement.scrollWidth - window.innerWidth')
        check(mobile,overflow<=2,f'mobile layout fits viewport (overflow {overflow}px)')
        check(mobile,mobile.locator('.opps-table tbody tr').first.evaluate('(r) => getComputedStyle(r).display')=='block','opportunity table stacks as cards on mobile')
        check(mobile,mobile.locator('.evidence-table tbody tr').first.evaluate('(r) => getComputedStyle(r).display')=='block','evidence table stacks as records on mobile')
        check(mobile,not (errors+reloaded_errors+errs+merrors),'no browser JavaScript exceptions')
        print('All browser acceptance tests passed.')
        browser.close()

if __name__=='__main__':run()
