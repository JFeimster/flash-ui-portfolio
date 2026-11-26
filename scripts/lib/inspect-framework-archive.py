#!/usr/bin/env python3
"""Read bounded package metadata from a named review archive without extraction."""
import hashlib
import json
import os
import re
import sys
import zipfile

MAX_ENTRIES = 5000
MAX_TOTAL = 200_000_000
MAX_MEMBER = 2_000_000
MAX_RATIO = 200


def safe_name(name):
    value = name.replace('\\', '/')
    if value.startswith('/') or re.match(r'^[a-zA-Z]:', value):
        return False
    parts = value.split('/')
    return all(part not in ('', '.', '..') for part in parts if part)


def main():
    archive = sys.argv[1]
    result = {"status": "inspected", "frameworks": [], "packages": [], "entrypoints": [], "reason": ""}
    if not os.path.isfile(archive):
        result.update(status="deferred", reason="archive unavailable")
        print(json.dumps(result))
        return
    try:
        with zipfile.ZipFile(archive) as source:
            entries = source.infolist()
            if len(entries) > MAX_ENTRIES or sum(x.file_size for x in entries) > MAX_TOTAL:
                raise ValueError("archive exceeds metadata inspection limits")
            if any(not safe_name(x.filename) for x in entries if not x.is_dir()):
                raise ValueError("archive contains an unsafe path; ZIP protections retained")
            package_files = [x for x in entries if not x.is_dir() and x.filename.lower().endswith('/package.json') or not x.is_dir() and x.filename.lower() == 'package.json']
            package_data = []
            for info in package_files[:50]:
                if info.file_size > MAX_MEMBER or info.file_size / max(1, info.compress_size) > MAX_RATIO:
                    raise ValueError("package metadata exceeds inspection limits")
                try:
                    value = json.loads(source.read(info).decode('utf-8-sig'))
                    package_data.append((info.filename, value))
                except Exception:
                    continue
            names = [x.filename for x in entries if not x.is_dir()]
            roots = [name for name in names if name.lower().endswith('/index.html') or name.lower() == 'index.html']
            result["entrypoints"] = roots[:40]
            result["packages"] = [{"path": file, "name": data.get("name", ""), "version": data.get("version", "")} for file, data in package_data]
            deps = {dep.lower() for _, data in package_data for dep in list((data.get("dependencies") or {}).keys()) + list((data.get("devDependencies") or {}).keys())}
            archive_lower = os.path.basename(archive).lower()
            path_lower = ' '.join(names).lower()
            if 'next' in deps or '@next/' in ' '.join(deps):
                result["frameworks"].append('Next.js')
            if ('react' in deps or 'vite' in deps) and 'next' not in deps:
                result["frameworks"].append('React/Vite')
            if 'vue' in deps or 'nuxt' in deps:
                result["frameworks"].append('Vue')
            if 'svelte' in deps or any(x.startswith('@sveltejs/') for x in deps):
                result["frameworks"].append('Svelte')
            wix = 'wix' in archive_lower or bool(re.search(r'(^|/)(wix|wix-site|wix-export)(/|\.|$)', path_lower)) or any('wix.config' in x.lower() for x in names)
            known = {'next', 'react', 'vite', 'vue', 'nuxt', 'svelte', '@sveltejs/kit'}
            other = sorted(x for x in deps if x in {'astro', '@astrojs/next', 'angular', '@angular/core', 'gatsby', 'solid-js', '@solidjs/start', 'remix', '@remix-run/react', 'qwik', '@builder.io/qwik'})
            if wix:
                result["frameworks"].append('Wix')
            if other:
                result["frameworks"].append('Other')
            if not result["frameworks"] and roots:
                result["frameworks"].append('Static HTML')
            if not result["frameworks"]:
                result["frameworks"].append('Other')
            result["frameworks"] = list(dict.fromkeys(result["frameworks"]))
    except (zipfile.BadZipFile, OSError, ValueError, RuntimeError) as error:
        result.update(status="deferred", reason=str(error))
    print(json.dumps(result))


if __name__ == '__main__':
    main()
