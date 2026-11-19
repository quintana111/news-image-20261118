// main.ts — news-image-20261118 v4 entry runner (Node 22, stdlib only).
// Copies entry.png to /output/entry.png with read-back byte-length + sha256
// verification, validates PNG magic + 1024x1024 dimensions, logs the
// dimensions explicitly, creates the output dir if missing, rejects files
// over 1 MiB. Exit 0 on success.
import { mkdirSync, readFileSync, writeFileSync, statSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { dirname } from 'node:path';

const SRC = 'entry.png';
const DEST = '/output/entry.png';
const MAX_BYTES = 1024 * 1024;
const PNG_MAGIC = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

const buf = readFileSync(SRC);
if (buf.length > MAX_BYTES) {
  console.error(`entry.png is ${buf.length} bytes, over the 1 MiB limit`);
  process.exit(1);
}
if (!buf.subarray(0, 8).equals(PNG_MAGIC)) {
  console.error('entry.png is not a PNG (bad magic bytes)');
  process.exit(1);
}
// PNG IHDR: width at bytes 16-19, height at 20-23, big-endian.
const width = buf.readUInt32BE(16);
const height = buf.readUInt32BE(20);
console.log(`entry.png dimensions: ${width}x${height}`);
if (width !== 1024 || height !== 1024) {
  console.error(`expected 1024x1024, got ${width}x${height}`);
  process.exit(1);
}
mkdirSync(dirname(DEST), { recursive: true });
writeFileSync(DEST, buf);
// Read back and verify byte-length + sha256 match the source.
const back = readFileSync(DEST);
const sha = (b: Buffer) => createHash('sha256').update(b).digest('hex');
if (back.length !== buf.length || sha(back) !== sha(buf)) {
  console.error('read-back verification failed: /output/entry.png differs from entry.png');
  process.exit(1);
}
console.log(`wrote ${DEST} (${back.length} bytes, sha256=${sha(back)})`);
console.log(`verified: ${statSync(DEST).size} bytes on disk, matches entry.png`);
