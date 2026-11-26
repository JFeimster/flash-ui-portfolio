"""Bounded ZIP staging for the existing static intake. Never writes source/repo files."""
import sys, os, stat, json, zipfile, hashlib, pathlib, re

source, destination = sys.argv[1:]
if os.path.getsize(source) > 50_000_000:
    raise ValueError('Archive exceeds compressed size limit')
with open(source, 'rb') as handle:
    if handle.read(4) != b'PK\x03\x04':
        raise ValueError('Unsupported archive signature')
with zipfile.ZipFile(source) as archive:
    entries = archive.infolist()
    if len(entries) > 3000 or sum(e.file_size for e in entries) > 200_000_000:
        raise ValueError('Archive exceeds file count or expanded size limit')
    seen = set()
    prefixes = {}
    for entry in entries:
        name = entry.filename
        parts = name.rstrip('/').split('/')
        if not name or name.startswith('/') or '\\' in name or any(p in ('', '.', '..') or ':' in p or re.search(r'[<>"|?*\x00-\x1f]',p) or p.endswith((' ','.')) or re.match(r'^(CON|PRN|AUX|NUL|COM[1-9]|LPT[1-9])(?:\.|$)',p,re.I) for p in parts):
            raise ValueError('Unsafe archive path: '+name)
        if stat.S_ISLNK(entry.external_attr >> 16) or entry.flag_bits & 1:
            raise ValueError('Unsafe symlink or encrypted entry')
        if entry.file_size > 20_000_000 or entry.file_size / max(entry.compress_size,1) > 200:
            raise ValueError('Archive entry exceeds size or compression-ratio limit')
        key = name.rstrip('/').casefold()
        if key in seen:
            raise ValueError('Case-insensitive archive collision: '+name)
        seen.add(key)
        for i in range(1,len(parts)+1):
            prefix = '/'.join(parts[:i]); lower = prefix.casefold()
            if lower in prefixes and prefixes[lower] != prefix:
                raise ValueError('Case-insensitive directory collision: '+name)
            prefixes[lower] = prefix
    base = pathlib.Path(destination).resolve()
    for entry in entries:
        target = base.joinpath(*entry.filename.rstrip('/').split('/'))
        if not target.resolve().is_relative_to(base):
            raise ValueError('Archive escaped staging root')
        if entry.is_dir():
            target.mkdir(parents=True,exist_ok=True)
            continue
        target.parent.mkdir(parents=True,exist_ok=True)
        with archive.open(entry) as incoming, open(target,'xb') as outgoing:
            count = 0
            while True:
                chunk = incoming.read(65536)
                if not chunk: break
                count += len(chunk)
                if count > entry.file_size or count > 20_000_000:
                    raise ValueError('Expanded entry exceeds declared size')
                outgoing.write(chunk)
print(json.dumps({'archiveSha256':hashlib.sha256(pathlib.Path(source).read_bytes()).hexdigest()}))
