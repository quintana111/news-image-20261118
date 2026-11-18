// main.ts — copies entry.png to /output/entry.png with read-back verification.
// Node 22+, stdlib only. No network at runtime.
import { createHash } from 'node:crypto';
import { copyFileSync, mkdirSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(fileURLToPath(import.meta.url));
const src = join(root, 'entry.png');
const dest = '/output/entry.png';

function sha256(buf: Buffer): string {
  return createHash('sha256').update(buf).digest('hex');
}

const before = readFileSync(src);
mkdirSync('/output', { recursive: true });
copyFileSync(src, dest);
const after = readFileSync(dest);

if (before.length !== after.length) {
  throw new Error(`byte-length mismatch: src=${before.length} dest=${after.length}`);
}
if (sha256(before) !== sha256(after)) {
  throw new Error(`sha256 mismatch: src=${sha256(before)} dest=${sha256(after)}`);
}

// Validate the copied bytes are a well-formed PNG or JPEG, and read the
// image dimensions, so a truncated or non-image file cannot pass silently.
const PNG_MAGIC = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
let width: number;
let height: number;
let format: string;
if (after.length >= 8 && after.subarray(0, 8).equals(PNG_MAGIC)) {
  format = 'PNG';
  if (after.length < 24 || after.toString('ascii', 12, 16) !== 'IHDR') {
    throw new Error('PNG is truncated or missing its IHDR chunk');
  }
  width = after.readUInt32BE(16);
  height = after.readUInt32BE(20);
} else if (after.length >= 2 && after[0] === 0xff && after[1] === 0xd8) {
  format = 'JPEG';
  if (after.length < 4 || after[after.length - 2] !== 0xff || after[after.length - 1] !== 0xd9) {
    throw new Error('JPEG is truncated or missing its EOI marker');
  }
  // Walk markers to the first Start-Of-Frame segment, which holds height/width.
  let offset = 2;
  let found = false;
  while (offset + 9 <= after.length) {
    if (after[offset] !== 0xff) {
      throw new Error(`JPEG marker expected at offset ${offset}`);
    }
    const marker = after[offset + 1];
    if (marker === 0xd9) break; // EOI before any SOF
    const segLen = after.readUInt16BE(offset + 2);
    if (segLen < 2 || offset + 2 + segLen > after.length) {
      throw new Error('JPEG segment length out of bounds');
    }
    const isSof =
      (marker >= 0xc0 && marker <= 0xcf && marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc);
    if (isSof) {
      height = after.readUInt16BE(offset + 5);
      width = after.readUInt16BE(offset + 7);
      found = true;
      break;
    }
    offset += 2 + segLen;
  }
  if (!found) {
    throw new Error('JPEG has no Start-Of-Frame segment');
  }
} else {
  throw new Error('output is neither PNG nor JPEG (bad magic bytes)');
}
if (width <= 0 || height <= 0) {
  throw new Error(`invalid image dimensions: ${width}x${height}`);
}
console.log(`validated ${format} ${width}x${height}`);
console.log(`copied entry.png -> /output/entry.png bytes=${after.length} sha256=${sha256(after)}`);
