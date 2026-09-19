/**
 * Pixel art for the nudge cat that sits beside "View my work": a cat facing you,
 * one paw held out to the right toward the button. Its own drawing, unrelated to
 * the footer game's cat, which sits side-on.
 *
 * Each character is one sprite pixel:
 *   #  fur   o  darker fur (stripes, tail)   x  dark (eyes, mouth)
 *   p  pink (ear insides, nose, tongue)      w  white (eye whites, paws)
 *   .  empty
 */

export const PALETTE = {
  "#": "#c4b5fd",
  o: "#8b5cf6",
  x: "#07020f",
  p: "#f0abfc",
  w: "#faf6ff",
};

/** Body, head and ears. Everything that moves is patched on top of this. */
const BODY = [
  "......#............#......",
  "......##..........##......",
  "......#p#........#p#......",
  "......#pp#......#pp#......",
  ".....################.....",
  "....##################....",
  "....##################....",
  "....##www######www####....",
  "....##www######www####....",
  "....##www######www####....",
  "....##################....",
  "....########pp########....",
  "....##################....",
  "....##################....",
  "....##################....",
  ".....################.....",
  "......##############......",
  ".....################.....",
  "....##################....",
  "....##################....",
  "....##################....",
  "....##################....",
  "...####################...",
  "...####################...",
  "...####################...",
  "...####################...",
  "...###ww##########ww###...",
  "...###ww##########ww###...",
].map((row) => `${row}...`); // spare columns on the right for the paw's reach

export const GRID_W = BODY[0].length; // 29
export const GRID_H = BODY.length; // 28

const paint = (rows, cells) => {
  const grid = rows.map((row) => row.split(""));
  for (const [r, c, ch] of cells) {
    if (grid[r] && grid[r][c] !== undefined) grid[r][c] = ch;
  }
  return grid.map((row) => row.join(""));
};

/* --- Tail: curls out of the bottom-left and sweeps up; it flicks at the tip --- */
const TAIL = [
  [27, 2, "o"],
  [26, 1, "o"], [26, 2, "o"],
  [25, 0, "o"], [25, 1, "o"],
  [24, 0, "o"],
  [23, 0, "o"],
  [22, 0, "o"], [22, 1, "o"],
  [21, 1, "o"], [21, 2, "o"],
];
const TAIL_FLICK = [...TAIL, [20, 2, "o"], [20, 3, "o"]];

/* --- A paler bib down the chest, so the body is not one flat shape --- */
const CHEST = [
  [20, 12, "w"], [20, 13, "w"],
  [21, 11, "w"], [21, 12, "w"], [21, 13, "w"], [21, 14, "w"],
  [22, 11, "w"], [22, 12, "w"], [22, 13, "w"], [22, 14, "w"],
  [23, 12, "w"], [23, 13, "w"],
];

/* --- The held-out paw: a level arm off the shoulder, reaching right at the
       button. `reach` 1 stretches it a pixel further, so it taps the air. --- */
const arm = (reach) => {
  const cells = [];
  const tip = 27 + reach;
  // Starts inside the body edge so the shoulder joins rather than floats
  for (let c = 21; c <= tip - 2; c += 1) cells.push([18, c, "#"], [19, c, "#"]);
  for (const c of [tip - 1, tip]) cells.push([18, c, "w"], [19, c, "w"]);
  // Shadow under the arm only, so it lifts off the body without being boxed in
  for (let c = 22; c <= tip; c += 1) cells.push([20, c, "o"]);
  return cells;
};

/* --- Eyes. Whites are in the base art; the pupil is one pixel that moves. --- */
const LEFT_EYE = { row: 8, col: 7 };
const RIGHT_EYE = { row: 8, col: 16 };

const pupils = (dx, dy) => [
  [LEFT_EYE.row + dy, LEFT_EYE.col + dx, "x"],
  [RIGHT_EYE.row + dy, RIGHT_EYE.col + dx, "x"],
];

const BLINK = [
  [7, 6, "#"], [7, 7, "#"], [7, 8, "#"], [7, 15, "#"], [7, 16, "#"], [7, 17, "#"],
  [8, 6, "x"], [8, 7, "x"], [8, 8, "x"], [8, 15, "x"], [8, 16, "x"], [8, 17, "x"],
  [9, 6, "#"], [9, 7, "#"], [9, 8, "#"], [9, 15, "#"], [9, 16, "#"], [9, 17, "#"],
];

/* --- Eyebrows, on the same mood scale as the mouths. Worried brows tip up at
       the inner corners; a happy cat's sit high and level. Row 6 is theirs. --- */
export const BROWS = [
  // Miserable: steeply worried, inner ends pushed right up to the nose
  [[5, 9, "o"], [6, 8, "o"], [6, 7, "o"], [6, 6, "o"], [5, 14, "o"], [6, 15, "o"], [6, 16, "o"], [6, 17, "o"]],
  // Glum: the same tilt, gentler
  [[5, 8, "o"], [6, 7, "o"], [6, 6, "o"], [5, 15, "o"], [6, 16, "o"], [6, 17, "o"]],
  // Level
  [[6, 6, "o"], [6, 7, "o"], [6, 8, "o"], [6, 15, "o"], [6, 16, "o"], [6, 17, "o"]],
  // Easing off: inner ends settle, outer ends lift
  [[5, 6, "o"], [6, 7, "o"], [6, 8, "o"], [5, 17, "o"], [6, 16, "o"], [6, 15, "o"]],
  // Delighted: both brows up and clear of the eyes
  [[5, 6, "o"], [5, 7, "o"], [5, 8, "o"], [5, 15, "o"], [5, 16, "o"], [5, 17, "o"]],
];

/* --- Mouths, saddest to happiest. The index is what the pointer's distance
       from the button picks, so the cat cheers up as you close in. --- */
export const MOUTHS = [
  // Miserable: a deep upside-down arc
  [[12, 12, "x"], [12, 13, "x"], [13, 11, "x"], [13, 14, "x"], [14, 10, "x"], [14, 15, "x"]],
  // Glum
  [[12, 12, "x"], [12, 13, "x"], [13, 11, "x"], [13, 14, "x"]],
  // Level
  [[13, 11, "x"], [13, 12, "x"], [13, 13, "x"], [13, 14, "x"]],
  // A small smile
  [[12, 11, "x"], [12, 14, "x"], [13, 12, "x"], [13, 13, "x"]],
  // A wide one, open, with a bit of tongue
  [
    [12, 10, "x"], [12, 15, "x"],
    [13, 11, "x"], [13, 14, "x"], [13, 12, "p"], [13, 13, "p"],
    [14, 12, "x"], [14, 13, "x"],
  ],
];

/**
 * The chest rising: everything from the neck up slides down a pixel, so the cat
 * settles into its shoulders and comes back. Applied to the finished frame, so
 * the eyes, brows and mouth move with the head while the paw stays put.
 */
const HEAD_ROWS = 17;
const exhale = (grid) => [
  grid[0].replace(/[^.]/g, "."),
  ...grid.slice(0, HEAD_ROWS),
  ...grid.slice(HEAD_ROWS + 1),
];

/**
 * One frame of the cat.
 *   mood    0 (miserable) to 4 (delighted); picks the brows and the mouth
 *   dx,dy   pupil offset, each -1, 0 or 1
 *   blink   eyes shut
 *   reach   0 or 1, the paw's bob
 *   flick   tail up
 *   breath  the chest at the bottom of a breath
 */
export function catFrame({ mood = 2, dx = 0, dy = 0, blink = false, reach = 0, flick = false, breath = false }) {
  const grid = paint(BODY, [
    ...CHEST,
    ...(flick ? TAIL_FLICK : TAIL),
    ...arm(reach),
    ...BROWS[mood],
    ...MOUTHS[mood],
    ...(blink ? BLINK : pupils(dx, dy)),
  ]);
  return breath ? exhale(grid) : grid;
}
