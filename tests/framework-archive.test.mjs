import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const inspector = path.join(root, 'scripts/lib/inspect-framework-archive.py');
const py = process.platform === 'win32' ? 'py' : 'python3';
const pyArgs = process.platform === 'win32' ? ['-3'] : [];
function makeArchive(file, members) {
  const source = 'import sys,zipfile,json; z=zipfile.ZipFile(sys.argv[1],"w"); [z.writestr(n,v) for n,v in json.loads(sys.argv[2])]; z.close()';
  const result = spawnSync(py, [...pyArgs, '-c', source, file, JSON.stringify(members)], { encoding: 'utf8' });
  assert.equal(result.status, 0, result.stderr);
}
function inspect(file) {
  const result = spawnSync(py, [...pyArgs, inspector, file], { encoding: 'utf8' });
  assert.equal(result.status, 0, result.stderr);
  return JSON.parse(result.stdout);
}

test('bounded framework inspection recognizes package metadata without extraction', () => {
  const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'flash-framework-inspect-'));
  try {
    const next = path.join(temp, 'next.zip');
    makeArchive(next, [['package.json', JSON.stringify({ name: 'funding-portal', dependencies: { next: '15', react: '19' } })], ['public/index.html', '<html></html>']]);
    const result = inspect(next);
    assert.equal(result.status, 'inspected');
    assert.deepEqual(result.frameworks, ['Next.js']);
    assert.equal(result.packages[0].name, 'funding-portal');
    const unsafe = path.join(temp, 'unsafe.zip');
    makeArchive(unsafe, [['../escape.txt', 'no extraction']]);
    const blocked = inspect(unsafe);
    assert.equal(blocked.status, 'deferred');
    assert.match(blocked.reason, /unsafe path/i);
  } finally { fs.rmSync(temp, { recursive: true, force: true }); }
});
