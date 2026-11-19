"""Classify the supplied Flash UI source inventory without modifying source files."""
import collections
import hashlib
import json
import os
from pathlib import Path
import re
import zipfile

repo = Path(__file__).resolve().parent.parent
inventory = json.loads((Path(os.environ['TEMP']) / 'flash-ui-batches-19b-20-inventory.json').read_text(encoding='utf-8'))
source = Path(inventory['sourceRoot'])
imports = json.loads((repo / 'data/batch-19c-import-mapping.json').read_text(encoding='utf-8'))['imports']
imported_zips = {row['sourceZip']: row for row in imports}
duplicate_zips = {name: row for row in imports for name in row['matchingZipExports'][1:]}
imported_dirs = {row['sourceDirectory']: row for row in imports}
sha = lambda data: hashlib.sha256(data).hexdigest()
repo_pages = collections.defaultdict(list)
for page in (repo / 'sites').rglob('*.html'):
    repo_pages[sha(page.read_bytes())].append(page.relative_to(repo).as_posix())

records = []
for item in inventory['zipCandidates']:
    archive = Path(item['path'])
    relative = archive.relative_to(source).as_posix()
    record = {'source': relative, 'kind': 'zip', 'bytes': item['bytes']}
    if relative in imported_zips:
        row = imported_zips[relative]
        record.update(status='imported', destination=row['destination'], entrySha256=row['entrySha256'])
    elif relative in duplicate_zips:
        row = duplicate_zips[relative]
        record.update(status='duplicate', matches=row['destination'], reason='Same entrypoint as imported source ZIP.')
    else:
        try:
            with zipfile.ZipFile(archive) as package:
                names = [name.replace('\\', '/') for name in package.namelist() if not name.endswith('/')]
                if any(name.startswith('/') or '..' in Path(name).parts or re.match(r'^[A-Za-z]:', name) for name in names):
                    record.update(status='unsupported or failed', reason='Unsafe archive path.')
                else:
                    entrypoints = [name for name in names if name.lower().endswith('index.html')]
                    apps = bool(re.search(r'next|react|svelte|wix|notion', archive.name, re.I)) or any(name.lower().endswith(('package.json', 'next.config.js', 'next.config.mjs', 'vite.config.js', 'vite.config.ts')) for name in names)
                    if apps:
                        record.update(status='standalone application', reason='Framework or platform export; no static-site import.')
                    elif not entrypoints:
                        record.update(status='unsupported or failed', reason='No static index.html entrypoint.')
                    elif len(entrypoints) > 1:
                        record.update(status='needs classification', reason=f'{len(entrypoints)} HTML entrypoints in one archive.')
                    else:
                        digest = sha(package.read(entrypoints[0]))
                        matches = repo_pages.get(digest, [])
                        record['entrySha256'] = digest
                        if matches:
                            record.update(status='already present', matches=matches[0], reason='Entrypoint content hash matches repository page.')
                        else:
                            record.update(status='needs classification', reason='Static entrypoint differs from repository pages; source ownership or dependencies require review.')
        except (OSError, zipfile.BadZipFile, RuntimeError) as error:
            record.update(status='unsupported or failed', reason=str(error))
    records.append(record)

for item in inventory['htmlCandidates']:
    page = Path(item['path'])
    relative = page.relative_to(source).as_posix()
    digest = sha(page.read_bytes())
    imported = next((row for directory, row in imported_dirs.items() if relative.startswith(directory + '/')), None)
    record = {'source': relative, 'kind': 'html', 'entrySha256': digest}
    if imported:
        record.update(status='imported', destination=imported['destination'])
    elif repo_pages.get(digest):
        record.update(status='already present', matches=repo_pages[digest][0])
    else:
        record.update(status='needs classification', reason='HTML differs from indexed repository source; review ownership and dependencies.')
    records.append(record)

counts = dict(collections.Counter(item['status'] for item in records))
report = {'version': 1, 'inventoryGeneratedAt': inventory['generatedAt'], 'sourceRoot': str(source), 'summary': counts, 'candidates': records}
(repo / 'data/batch-19c-import-review.json').write_text(json.dumps(report, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
print(json.dumps(counts))
