// main.ts — Node 22, stdlib only.
// Copies entry.png (next to this file) to /output/entry.png, then reads it back
// and verifies byte-length + sha256 match, PNG magic bytes, and 1024x1024 size.
import { createHash } from 'node:crypto';
import { mkdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const src = join(here, 'entry.png');
const dst = '/output/entry.png';

const data = readFileSync(src);
if (data.length === 0) throw new Error('entry.png is empty');
const PNG_MAGIC = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
if (!data.subarray(0, 8).equals(PNG_MAGIC)) throw new Error('not a PNG file');
// IHDR: width/height are big-endian uint32 at offsets 16/20.
const width = data.readUInt32BE(16);
const height = data.readUInt32BE(20);
if (width !== 1024 || height !== 1024) throw new Error(`bad dimensions ${width}x${height}, want 1024x1024`);
const digest = createHash('sha256').update(data).digest('hex');

mkdirSync('/output', { recursive: true });
writeFileSync(dst, data);

const back = readFileSync(dst);
if (back.length !== data.length) throw new Error(`read-back length ${back.length} != ${data.length}`);
const backDigest = createHash('sha256').update(back).digest('hex');
if (backDigest !== digest) throw new Error('read-back sha256 mismatch');
console.log(`ok: ${dst} ${back.length} bytes sha256 ${backDigest} ${width}x${height}`);
console.log(`source: ${src} ${statSync(src).size} bytes`);
