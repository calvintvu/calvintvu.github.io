import { writeFile } from 'node:fs/promises';
import sharp from 'sharp';

const GROUND = '#141a1a';
const INK = '#8cc6c0';
const OUT = new URL('../public/', import.meta.url);

// A ":)" on a 64-unit grid, centred on (32, 32).
const MARK = `
  <circle cx="22" cy="23" r="5.5" fill="${INK}" />
  <circle cx="22" cy="41" r="5.5" fill="${INK}" />
  <path d="M34 13 Q53 32 34 51" fill="none" stroke="${INK}" stroke-width="6.5" stroke-linecap="round" />`;

/** rounded: a tab icon with its own corners. Otherwise full bleed with the mark inset, for platforms that crop. */
function svg({ rounded, scale = 1 }: { rounded: boolean; scale?: number }) {
  const inset = 32 * (1 - scale);
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <rect width="64" height="64" rx="${rounded ? 14 : 0}" fill="${GROUND}" />
  <g transform="translate(${inset} ${inset}) scale(${scale})">${MARK}</g>
</svg>
`;
}

const png = (source: string, size: number) =>
  sharp(Buffer.from(source), { density: (72 * size) / 64 })
    .resize(size, size)
    .png()
    .toBuffer();

async function write(name: string, data: Buffer | string) {
  await writeFile(new URL(name, OUT), data);
}

/** A .ico of PNG images, which every current browser reads. */
function ico(images: { size: number; data: Buffer }[]) {
  const header = Buffer.alloc(6 + 16 * images.length);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(images.length, 4);
  let offset = header.length;
  images.forEach(({ size, data }, i) => {
    const entry = 6 + 16 * i;
    header.writeUInt8(size % 256, entry);
    header.writeUInt8(size % 256, entry + 1);
    header.writeUInt16LE(1, entry + 4);
    header.writeUInt16LE(32, entry + 6);
    header.writeUInt32LE(data.length, entry + 8);
    header.writeUInt32LE(offset, entry + 12);
    offset += data.length;
  });
  return Buffer.concat([header, ...images.map((image) => image.data)]);
}

const tab = svg({ rounded: true });
const tile = svg({ rounded: false, scale: 0.78 });
const maskable = svg({ rounded: false, scale: 0.62 });

await write('favicon.svg', tab);
for (const size of [16, 32, 96]) await write(`favicon-${size}x${size}.png`, await png(tab, size));
await write(
  'favicon.ico',
  ico(await Promise.all([16, 32, 48].map(async (size) => ({ size, data: await png(tab, size) })))),
);

for (const size of [57, 60, 72, 76, 114, 120, 144, 152, 180]) {
  await write(`apple-icon-${size}x${size}.png`, await png(tile, size));
}
await write('apple-touch-icon.png', await png(tile, 180));
await write('apple-icon.png', await png(tile, 192));
await write('apple-icon-precomposed.png', await png(tile, 192));

for (const size of [36, 48, 72, 96, 144, 192]) {
  await write(`android-icon-${size}x${size}.png`, await png(tile, size));
}
for (const size of [70, 144, 150, 310]) {
  await write(`ms-icon-${size}x${size}.png`, await png(tile, size));
}
for (const size of [192, 512]) {
  await write(`web-app-manifest-${size}x${size}.png`, await png(maskable, size));
}
