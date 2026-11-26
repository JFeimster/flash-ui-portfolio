import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const py = process.platform === 'win32' ? 'py' : 'python3';
const pyArgs = process.platform === 'win32' ? ['-3'] : [];
const encoder = path.join(root, 'scripts/lib/preview-webp.py');

test('preview encoder writes optimized WebP and cache validator accepts a valid image', () => {
  const png = spawnSync(py, [...pyArgs, '-c', 'import sys;from PIL import Image;from io import BytesIO;b=BytesIO();Image.new("RGB",(1200,800),(30,60,90)).save(b,format="PNG");sys.stdout.buffer.write(b.getvalue())'], { maxBuffer: 4 * 1024 * 1024 });
  assert.equal(png.status, 0, png.stderr?.toString());
  const webp = spawnSync(py, [...pyArgs, encoder], { input: png.stdout, maxBuffer: 4 * 1024 * 1024 });
  assert.equal(webp.status, 0, webp.stderr?.toString());
  assert.equal(webp.stdout.toString('ascii', 8, 12), 'WEBP');
  const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'flash-preview-webp-'));
  try {
    const image = path.join(temp, 'preview.webp'); fs.writeFileSync(image, webp.stdout);
    const valid = spawnSync(py, [...pyArgs, encoder, 'validate'], { input: JSON.stringify([{ id: 'preview', path: image }]), encoding: 'utf8' });
    assert.equal(valid.status, 0, valid.stderr);
    assert.deepEqual(JSON.parse(valid.stdout), ['preview']);
  } finally { fs.rmSync(temp, { recursive: true, force: true }); }
});
