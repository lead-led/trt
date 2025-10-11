import { mkdirSync, readFileSync, writeFileSync, copyFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import * as png2icons from 'png2icons';

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = join(__dirname, '..');

const sourcePng = join(projectRoot, 'static', 'icon.png');
const outputDir = join(projectRoot, 'build');

mkdirSync(outputDir, { recursive: true });

const pngBuffer = readFileSync(sourcePng);

const icnsBuffer = png2icons.createICNS(pngBuffer, png2icons.BICUBIC, 0, false);
if (!icnsBuffer) {
	throw new Error('Failed to create ICNS from static/icon.png');
}
writeFileSync(join(outputDir, 'icon.icns'), icnsBuffer);

const icoBuffer = png2icons.createICO(pngBuffer, png2icons.BILINEAR, 0, false);
if (!icoBuffer) {
	throw new Error('Failed to create ICO from static/icon.png');
}
writeFileSync(join(outputDir, 'icon.ico'), icoBuffer);

copyFileSync(sourcePng, join(outputDir, 'icon.png'));

console.log('Generated build/icon.icns, build/icon.ico, and copied build/icon.png');
