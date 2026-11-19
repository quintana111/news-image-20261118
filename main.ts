// main.ts — v3 entry runner (Node 22, stdlib only).
// Copies entry.png to /output/entry.png, verifying PNG magic bytes,
// 1024x1024 dimensions, <=1 MiB size, and read-back byte-length + sha256.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(fileURLToPath(import.meta.url));
const src = join(root, 'entry.png');
const outDir = '/output';
const dst = join(outDir, 'entry.png');
const MAX_BYTES = 1024 * 1024;

const buf = readFileSync(src);
if (buf.length > MAX_BYTES) {
  console.error(`entry.png is ${buf.length} bytes, over the 1 MiB limit`);
  process.exit(1);
}
const MAGIC = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
if (!buf.subarray(0, 8).equals(MAGIC)) {
  console.error('entry.png is not a PNG (bad magic bytes)');
  process.exit(1);
}
if (buf.readUInt32BE(16) !== 1024 || buf.readUInt32BE(20) !== 1024) {
  console.error(`entry.png is ${buf.readUInt32BE(16)}x${buf.readUInt32BE(20)}, expected 1024x1024`);
  process.exit(1);
}
mkdirSync(outDir, { recursive: true });
writeFileSync(dst, buf);
const back = readFileSync(dst);
const sha = (b) => createHash('sha256').update(b).digest('hex');
if (back.length !== buf.length || sha(back) !== sha(buf)) {
  console.error('read-back verification failed');
  process.exit(1);
}
console.log(`OK: entry.png ${buf.length} bytes, 1024x1024, sha256 ${sha(buf)}`);
console.log(`copied to ${dst} (read-back verified)`);
