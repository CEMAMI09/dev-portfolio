/**
 * Deterministic circuit-board generator for the desktop background.
 *
 * Produces PCB-style traces on a grid (orthogonal runs with 45° bends), pads
 * at trace ends, and a few IC footprints with traces fanning out from their
 * pins. Everything is computed at build time from a fixed seed, so the output
 * is stable between builds and costs nothing at runtime beyond a handful of
 * CSS animations.
 */

export interface CircuitOptions {
  width: number;
  height: number;
  /** Grid pitch in px. */
  pitch: number;
  seed: number;
  traceCount: number;
  chipCount: number;
  /** Fraction of traces that carry a moving pulse. */
  pulseRatio: number;
  /** Pulse speed in px per second. */
  pulseSpeed: number;
}

export interface Trace {
  d: string;
  length: number;
  pulse?: {
    /** Dash gap so the pulse appears once per cycle, then rests. */
    cycle: number;
    duration: number;
    delay: number;
  };
}

export interface Pad {
  x: number;
  y: number;
  kind: 'via' | 'square';
}

export interface Chip {
  x: number;
  y: number;
  width: number;
  height: number;
  /** Pin stubs as line segments. */
  pins: Array<{ x1: number; y1: number; x2: number; y2: number }>;
}

export interface Circuit {
  width: number;
  height: number;
  traces: Trace[];
  pads: Pad[];
  chips: Chip[];
}

type Point = { c: number; r: number };

/** Eight compass directions, clockwise from east. */
const DIRS: ReadonlyArray<readonly [number, number]> = [
  [1, 0],
  [1, 1],
  [0, 1],
  [-1, 1],
  [-1, 0],
  [-1, -1],
  [0, -1],
  [1, -1],
];

/** Small, fast seeded PRNG (mulberry32). */
function rng(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function generateCircuit(options: CircuitOptions): Circuit {
  const { width, height, pitch, seed, traceCount, chipCount, pulseRatio, pulseSpeed } = options;
  const random = rng(seed);
  const randInt = (min: number, max: number) => min + Math.floor(random() * (max - min + 1));
  const pick = <T>(items: readonly T[]): T => items[Math.floor(random() * items.length)] as T;

  const cols = Math.floor(width / pitch);
  const rows = Math.floor(height / pitch);

  const occupied = new Set<string>();
  const diagonalCells = new Set<string>();
  const key = (p: Point) => `${p.c},${p.r}`;
  const inBounds = (p: Point) => p.c >= 1 && p.c < cols && p.r >= 1 && p.r < rows;
  const px = (p: Point) => ({ x: p.c * pitch, y: p.r * pitch });

  const traces: Trace[] = [];
  const pads: Pad[] = [];
  const chips: Chip[] = [];

  /** Step one node in a direction, refusing to cross another trace. */
  function step(from: Point, dir: number): Point | null {
    const [dc, dr] = DIRS[dir] as readonly [number, number];
    const to = { c: from.c + dc, r: from.r + dr };
    if (!inBounds(to) || occupied.has(key(to))) return null;
    if (dc !== 0 && dr !== 0) {
      // Diagonal: block if another diagonal already passes through this cell.
      const cell = `${Math.min(from.c, to.c)},${Math.min(from.r, to.r)}`;
      if (diagonalCells.has(cell)) return null;
      diagonalCells.add(cell);
    }
    return to;
  }

  function routeTrace(start: Point, startDir: number, minNodes: number): Point[] | null {
    const points: Point[] = [start];
    let current = start;
    let dir = startDir;
    let nodes = 1;
    const segments = randInt(2, 5);

    for (let s = 0; s < segments; s++) {
      const target = randInt(2, 7);
      let walked = 0;
      for (let i = 0; i < target; i++) {
        const next = step(current, dir);
        if (!next) break;
        occupied.add(key(next));
        current = next;
        walked++;
        nodes++;
      }
      if (walked === 0) break;
      points.push(current);
      // Mostly 45° bends, occasionally 90°; never reverse.
      dir = (dir + pick([-1, 1, -1, 1, -1, 1, -2, 2]) + 8) % 8;
    }

    return nodes >= minNodes ? points : null;
  }

  function commitTrace(points: Point[], startPad: boolean) {
    const coords = points.map(px);
    let length = 0;
    for (let i = 1; i < coords.length; i++) {
      const a = coords[i - 1]!;
      const b = coords[i]!;
      length += Math.hypot(b.x - a.x, b.y - a.y);
    }
    const d = coords.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x} ${p.y}`).join(' ');

    const trace: Trace = { d, length };
    if (random() < pulseRatio) {
      const rest = length * (1 + random() * 2.5);
      const cycle = length + rest;
      trace.pulse = {
        cycle,
        duration: cycle / pulseSpeed,
        delay: -random() * (cycle / pulseSpeed),
      };
    }
    traces.push(trace);

    const first = coords[0]!;
    const last = coords[coords.length - 1]!;
    if (startPad) pads.push({ ...first, kind: random() < 0.6 ? 'via' : 'square' });
    pads.push({ ...last, kind: random() < 0.6 ? 'via' : 'square' });
  }

  // 1. Chips: reserve their footprint (plus a margin) and fan traces out of the pins.
  for (let n = 0; n < chipCount; n++) {
    const w = randInt(1, 2);
    const h = randInt(2, 3);
    const c0 = randInt(3, cols - w - 4);
    const r0 = randInt(3, rows - h - 4);

    let clear = true;
    for (let c = c0 - 2; c <= c0 + w + 2 && clear; c++) {
      for (let r = r0 - 1; r <= r0 + h + 1; r++) {
        if (occupied.has(`${c},${r}`)) {
          clear = false;
          break;
        }
      }
    }
    if (!clear) continue;

    for (let c = c0 - 1; c <= c0 + w + 1; c++) {
      for (let r = r0 - 1; r <= r0 + h + 1; r++) occupied.add(`${c},${r}`);
    }

    const origin = px({ c: c0, r: r0 });
    const chip: Chip = {
      x: origin.x - pitch * 0.35,
      y: origin.y - pitch * 0.35,
      width: w * pitch + pitch * 0.7,
      height: h * pitch + pitch * 0.7,
      pins: [],
    };

    // Pins on the left and right edges, one per row node.
    for (let r = r0; r <= r0 + h; r++) {
      const y = r * pitch;
      const leftNode = { c: c0 - 1, r };
      const rightNode = { c: c0 + w + 1, r };
      chip.pins.push({ x1: chip.x, y1: y, x2: px(leftNode).x, y2: y });
      chip.pins.push({ x1: chip.x + chip.width, y1: y, x2: px(rightNode).x, y2: y });

      if (random() < 0.55) {
        const route = routeTrace(leftNode, pick([4, 5, 3]), 3);
        if (route) commitTrace(route, false);
      }
      if (random() < 0.55) {
        const route = routeTrace(rightNode, pick([0, 1, 7]), 3);
        if (route) commitTrace(route, false);
      }
    }

    chips.push(chip);
  }

  // 2. Free-standing traces.
  let attempts = 0;
  while (traces.length < traceCount && attempts < traceCount * 20) {
    attempts++;
    const start = { c: randInt(1, cols - 1), r: randInt(1, rows - 1) };
    if (occupied.has(key(start))) continue;
    occupied.add(key(start));
    const route = routeTrace(start, randInt(0, 7), 4);
    if (route) commitTrace(route, true);
  }

  return { width, height, traces, pads, chips };
}
