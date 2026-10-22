import type { Piece } from 'ascii.rest';

const TAU = Math.PI * 2;
const SURF = "_.-'"; // a ridge's glyph by where it crosses its cell, bottom to top

// Back to front. base: still line as a fraction of the height; amp: rows;
// waves: [length in columns, cycles a second, share of amp]; fill: stipple glyph
// and how much of the body under the ridge it covers.
const LAYERS = [
  {
    base: 0.34,
    amp: 1.4,
    waves: [
      [140, 0.012, 0.7],
      [53, -0.021, 0.3],
    ],
    fill: '.',
    density: 0.1,
  },
  {
    base: 0.55,
    amp: 2,
    waves: [
      [110, -0.016, 0.65],
      [41, 0.027, 0.35],
    ],
    fill: ':',
    density: 0.16,
  },
  {
    base: 0.78,
    amp: 2.4,
    waves: [
      [90, 0.02, 0.6],
      [33, -0.034, 0.4],
    ],
    fill: '+',
    density: 0.22,
  },
] as const;

function hash(x: number, y: number) {
  let h = Math.imul(x, 0x27d4eb2d) ^ Math.imul(y, 0x165667b1);
  h = Math.imul(h ^ (h >>> 15), 0x85ebca77);
  return ((h ^ (h >>> 13)) >>> 0) / 4294967296;
}

/** Layered ridges of swell drifting past each other, sized to any grid. */
export function tide(cols: number, rows: number): Piece {
  return {
    meta: {
      name: 'tide',
      category: 'nature',
      note: 'layered ridges of swell drifting past each other',
      cols,
      rows,
      fps: 12,
    },
    default: () => (t: number) => {
      const surfaces = LAYERS.map((layer) =>
        Float32Array.from({ length: cols }, (_, x) => {
          let s = 0;
          for (const [len, rate, share] of layer.waves) {
            s += share * Math.sin(TAU * (x / len - rate * t));
          }
          return layer.base * rows + layer.amp * s;
        }),
      );

      let out = '';
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          let ch = ' ';
          for (let i = LAYERS.length - 1; i >= 0; i--) {
            const s = surfaces[i][x];
            if (y + 1 <= s) continue;
            if (y <= s) {
              const f = s - y;
              ch = SURF[Math.min(3, Math.floor((1 - f) * 4))];
            } else {
              const layer = LAYERS[i];
              const shimmer = 0.5 + 0.5 * Math.sin(x * 0.21 - y * 0.6 + t * 0.8 + i);
              ch = hash(x, y * 7 + i) < layer.density * (0.6 + 0.8 * shimmer) ? layer.fill : ' ';
            }
            break;
          }
          out += ch;
        }
        if (y < rows - 1) out += '\n';
      }
      return out;
    },
  };
}
