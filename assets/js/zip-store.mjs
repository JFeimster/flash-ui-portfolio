const encoder = new TextEncoder();
const table = Uint32Array.from({ length: 256 }, (_, n) => {
  let crc = n;
  for (let i = 0; i < 8; i++) crc = crc & 1 ? 0xedb88320 ^ (crc >>> 1) : crc >>> 1;
  return crc >>> 0;
});
function crc32(bytes) {
  let crc = 0xffffffff;
  for (const byte of bytes) crc = table[(crc ^ byte) & 255] ^ (crc >>> 8);
  return (crc ^ 0xffffffff) >>> 0;
}
function header(length) { return new Uint8Array(length); }
function write(view, offset, value, size) {
  if (size === 2) view.setUint16(offset, value, true);
  else view.setUint32(offset, value, true);
}

// ZIP store format keeps the original source bytes intact and needs no CDN or package dependency.
export function createZip(files) {
  if (files.length > 65535) throw new Error('Too many files for a ZIP package.');
  const local = [];
  const central = [];
  let offset = 0;
  for (const file of files) {
    const name = encoder.encode(file.name);
    const bytes = file.bytes instanceof Uint8Array ? file.bytes : encoder.encode(String(file.bytes));
    if (!name.length || name.length > 65535 || bytes.length > 0xffffffff) throw new Error('File exceeds ZIP limits.');
    const crc = crc32(bytes);
    const prefix = header(30 + name.length);
    const p = new DataView(prefix.buffer);
    write(p, 0, 0x04034b50, 4); write(p, 4, 20, 2); write(p, 6, 0x0800, 2);
    write(p, 14, crc, 4); write(p, 18, bytes.length, 4); write(p, 22, bytes.length, 4);
    write(p, 26, name.length, 2); prefix.set(name, 30);
    local.push(prefix, bytes);
    const record = header(46 + name.length);
    const c = new DataView(record.buffer);
    write(c, 0, 0x02014b50, 4); write(c, 4, 20, 2); write(c, 6, 20, 2); write(c, 8, 0x0800, 2);
    write(c, 16, crc, 4); write(c, 20, bytes.length, 4); write(c, 24, bytes.length, 4);
    write(c, 28, name.length, 2); write(c, 42, offset, 4); record.set(name, 46);
    central.push(record);
    offset += prefix.length + bytes.length;
  }
  const centralSize = central.reduce((sum, record) => sum + record.length, 0);
  if (offset + centralSize > 0xffffffff) throw new Error('ZIP package exceeds size limit.');
  const end = header(22);
  const e = new DataView(end.buffer);
  write(e, 0, 0x06054b50, 4); write(e, 8, files.length, 2); write(e, 10, files.length, 2);
  write(e, 12, centralSize, 4); write(e, 16, offset, 4);
  return new Blob([...local, ...central, end], { type: 'application/zip' });
}
