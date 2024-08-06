import { readFile, writeFile } from 'node:fs/promises';
import ttf2woff2 from 'ttf2woff2';

const input = await readFile('思源黑体-Regular-2.otf');

await writeFile('思源黑体-Regular-2.woff2', ttf2woff2(input));
