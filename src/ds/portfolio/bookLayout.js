/**
 * Where the books stand and how the camera frames them — pure maths, no three.js,
 * so the Work page can size the shelf before the renderer has loaded. ShelfBooks
 * draws from the same numbers, which is what keeps the placeholder and the real
 * shelf the same height and seated at the same line.
 */

/** Fallback cloths when an item brings no colour: the violet ramp and ink grounds from tokens/colors.css. */
export const PALETTE = [
  "#1a0630", "#2d1063", "#3b0f7a", "#4c1d95", "#5b21b6", "#6d28d9",
  "#7c3aed", "#a855f7", "#c084fc", "#d8b4fe", "#e9dcff", "#ede4ff",
];

// Foil stamped on a dark cloth, and on a light one
export const FOIL_ON_DARK = "#ede4ff";
export const FOIL_ON_LIGHT = "#4c1d95";

export const FOV = 30;
export const TILT = 9;           // degrees the camera looks down, so the page edges on top show
export const TOP_ROOM = 0.8;     // world units above the tallest book: hover lift and the pulled-out turn
export const BOTTOM_ROOM = 0.3;  // below the base line, for the contact shadow
export const FRONT_Z = 0;        // the plane every spine sits in
export const GAP = 0.065;

// Also bounds the frame: a turned-out book at either end has to fit
export const PULL_TURN = -1.2;   // radians; most of the way round to the cover, the spine still in view

export function hash(input) {
  let value = 2166136261;
  for (let index = 0; index < input.length; index += 1) {
    value ^= input.charCodeAt(index);
    value = Math.imul(value, 16777619);
  }
  return value >>> 0;
}

export function seeded(seed) {
  let value = seed >>> 0;
  return () => {
    value += 0x6d2b79f5;
    let next = value;
    next = Math.imul(next ^ (next >>> 15), next | 1);
    next ^= next + Math.imul(next ^ (next >>> 7), next | 61);
    return ((next ^ (next >>> 14)) >>> 0) / 4294967296;
  };
}

export function luminance(hex) {
  const color = Number.parseInt(hex.slice(1), 16);
  const channel = (value) => {
    const normalized = value / 255;
    return normalized <= 0.03928 ? normalized / 12.92 : ((normalized + 0.055) / 1.055) ** 2.4;
  };
  return channel((color >> 16) & 255) * 0.2126 + channel((color >> 8) & 255) * 0.7152 + channel(color & 255) * 0.0722;
}

/** Whichever foil stands out more against the cloth. Mid violets sit near 0.5 luminance, where a plain threshold picks the weaker one. */
export function legibleFoil(color) {
  const cloth = luminance(color);
  const contrast = (foil) => {
    const other = luminance(foil);
    return (Math.max(cloth, other) + 0.05) / (Math.min(cloth, other) + 0.05);
  };
  return contrast(FOIL_ON_DARK) >= contrast(FOIL_ON_LIGHT) ? FOIL_ON_DARK : FOIL_ON_LIGHT;
}

export function deriveLayout(items) {
  let cursor = 0;
  const books = items.map((item) => {
    const random = seeded(hash(item.id));
    const fallbackColor = PALETTE[Math.floor(random() * PALETTE.length)];
    const width = 0.62 + random() * 0.34;
    const bookHeight = 3.65 + (random() * 2 - 1) * 0.22;
    const color = item.color ?? fallbackColor;
    const foil = item.foil ?? legibleFoil(color);
    if (random() < 0.14) cursor += 0.2;
    const x = cursor + width / 2;
    cursor += width + GAP;
    const depth = bookHeight * 0.6;
    return { ...item, x, width, bookHeight, depth, z: FRONT_Z - depth / 2, motif: Math.floor(random() * 8), color, foil };
  });
  const span = cursor - GAP;
  books.forEach((book) => { book.x -= span / 2; });
  return books;
}

/**
 * The world-space box the camera must show: the row, room above for the lift,
 * and room either side for an end book turned out toward the viewer.
 */
export function frameFor(books) {
  const tallest = Math.max(...books.map((b) => b.bookHeight));
  const first = books[0];
  const last = books[books.length - 1];
  // A turned-out book shows its depth across the frame, and it has come toward the camera, so it reads wider still
  const turnedHalf = (b) => (b.depth / 2) * Math.abs(Math.sin(PULL_TURN)) + (b.width / 2) * Math.abs(Math.cos(PULL_TURN));
  const overhang = (b) => Math.max(0, turnedHalf(b) * 1.15 - b.width / 2);
  const span = last.x + last.width / 2 - (first.x - first.width / 2);
  return { bottom: -BOTTOM_ROOM, top: tallest + TOP_ROOM, width: span + 2 * Math.max(overhang(first), overhang(last)) };
}

/** The shelf box never grows past this; on a narrow screen the aspect ratio makes it shorter. */
export const SHELF_MAX_HEIGHT = "clamp(260px, 31vw, 450px)";

/**
 * Screen distance from the bottom of the canvas up to the books’ base line,
 * as a fraction of the canvas height. The camera sits `d` back from the frame
 * centre `c`, pitched down by TILT, with d chosen so the frame fills the height:
 * projecting the point (0, 0, FRONT_Z) through that camera gives
 *   ndc.y = -c·cos(t) / ((d + c·sin(t))·tan(fov/2)),   d = (h/2) / tan(fov/2)
 * That holds while FRONT_Z is 0, the plane the camera aims into.
 */
export function baseLineRatio(box) {
  const tilt = (TILT * Math.PI) / 180;
  const half = Math.tan((FOV * Math.PI) / 360);
  const height = box.top - box.bottom;
  const center = (box.top + box.bottom) / 2;
  const ndc = (-center * Math.cos(tilt)) / (height / 2 + center * Math.sin(tilt) * half);
  return (1 + ndc) / 2;
}

/**
 * The shelf’s box: as tall as the row needs at this width, capped at maxHeight,
 * and ending on the base line. Height is min(width · h/w, maxHeight); a margin
 * percentage resolves against the width too, so the negative margin that pulls
 * the lower edge of the canvas back out can be written in plain CSS.
 */
export function shelfBox(books, maxHeight = SHELF_MAX_HEIGHT) {
  const box = frameFor(books);
  const height = box.top - box.bottom;
  const ratio = baseLineRatio(box);
  return {
    position: "relative",
    width: "100%",
    aspectRatio: `${box.width} / ${height}`,
    maxHeight,
    marginBottom: `calc(-${ratio.toFixed(5)} * min(${((100 * height) / box.width).toFixed(4)}%, ${maxHeight}))`,
  };
}
