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
console.log(`copied entry.png -> /output/entry.png bytes=${after.length} sha256=${sha256(after)}`);
