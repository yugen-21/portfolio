/**
 * JS mirror of the colour tokens in `tokens/colors.css`.
 *
 * Components styled in CSS should always read `var(--violet-400)` and friends.
 * This file exists for the ones that *can't*: WebGL shaders and 2D canvas take
 * literal colour values, so a vendored backdrop needs real hex to inherit the
 * palette. Keep these in sync with colors.css — that file is the source of truth.
 */

/* Void / ink — page and card grounds */
export const VOID = "#000000";
export const INK_800 = "#0b0416";
export const INK_700 = "#100526";
export const INK_500 = "#1a0630";

/* Violet ramp — the single chromatic family */
export const VIOLET_950 = "#3c108c";
export const VIOLET_800 = "#5b21b6";
export const VIOLET_700 = "#6d28d9";
export const VIOLET_600 = "#7c3aed";
export const VIOLET_500 = "#8b5cf6";
export const VIOLET_400 = "#a855f7";
export const VIOLET_300 = "#c084fc";
export const VIOLET_200 = "#d8b4fe";
export const VIOLET_050 = "#ede4ff";

/* Lilac — muted violets */
export const LILAC_300 = "#c4a6ff";
export const LILAC_400 = "#b79aff";

/**
 * The three-stop violet sweep. This is the same triplet `App.jsx` already hands
 * to the shared `Particles` layer, so anything using it sits in the same light
 * as the rest of the site.
 */
export const VIOLET_SWEEP = [LILAC_300, VIOLET_400, VIOLET_050];

/** Hex strings as the 0x integers three.js and ogl want for colour options. */
export const asInt = (hex) => parseInt(hex.replace("#", ""), 16);
