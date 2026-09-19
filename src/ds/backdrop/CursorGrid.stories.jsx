import React from "react";
import CursorGrid from "./CursorGrid.jsx";
import { OnLanding, Bare } from "../../stories/_backdrop.jsx";
import { VIOLET_400, LILAC_300, VIOLET_600 } from "../../styles/palette.js";

export default {
  title: "Backdrop/CursorGrid",
  component: CursorGrid,
  parameters: {
    layout: "fullscreen",
    docs: {
      story: { inline: false, height: "680px" },
      description: {
        component: [
          "A 2D-canvas lattice that lights cells near the pointer and fades them behind it. Vendored verbatim from [React Bits](https://reactbits.dev). No WebGL, no dependencies — the cheapest layer in this set, and the rAF loop sleeps once every cell has faded.",
          "",
          "**Move the pointer over a story** — nothing is drawn until `pointermove` fires, so an untouched story is legitimately blank unless `gridOpacity` is above zero.",
          "",
          "**A caveat specific to this one.** The component listens on its own container. On the landing stories the page content sits above it at `z-index: 3` and swallows most pointer events, so the effect only fires in the gaps. **Bare layer** below is where it actually feels alive. Wiring this into a real page means lifting the listener to `window`, the way `AuroraLayer`'s parallax already does.",
          "",
          "**Palette inheritance is clean**, with one catch: `color` is parsed by a local `hexToRgb`, so it accepts **hex only** — `rgb()` and `var(--…)` will not parse.",
        ].join("\n"),
      },
    },
  },
  args: {
    cellSize: 70,
    color: VIOLET_400,
    radius: 140,
    falloff: "smooth",
    holdTime: 400,
    fadeDuration: 800,
    lineWidth: 1.2,
    maxOpacity: 1,
    fillOpacity: 0,
    gridOpacity: 0,
    cellRadius: 0,
    clickPulse: true,
    pulseSpeed: 600,
  },
  argTypes: {
    color: { control: "color", description: "Hex only — no rgb() or CSS vars.", table: { category: "Colour" } },
    cellSize: { control: { type: "range", min: 20, max: 200, step: 5 }, description: "Changing this rebuilds the lattice.", table: { category: "Geometry" } },
    radius: { control: { type: "range", min: 40, max: 500, step: 10 }, description: "Lit radius around the pointer.", table: { category: "Interaction" } },
    falloff: { control: "inline-radio", options: ["linear", "smooth", "sharp"], description: "Distance to brightness curve.", table: { category: "Interaction" } },
    holdTime: { control: { type: "range", min: 0, max: 2000, step: 50 }, description: "Milliseconds lit before fading.", table: { category: "Motion" } },
    fadeDuration: { control: { type: "range", min: 100, max: 3000, step: 50 }, table: { category: "Motion" } },
    gridOpacity: { control: { type: "range", min: 0, max: 1, step: 0.02 }, description: "Always-visible lattice. 0 hides it.", table: { category: "Appearance" } },
    fillOpacity: { control: { type: "range", min: 0, max: 1, step: 0.02 }, description: "Translucent cell fill. 0 disables.", table: { category: "Appearance" } },
    cellRadius: { control: { type: "range", min: 0, max: 40, step: 1 }, table: { category: "Appearance" } },
    lineWidth: { control: { type: "range", min: 0.2, max: 6, step: 0.1 }, table: { category: "Appearance" } },
    clickPulse: { control: "boolean", table: { category: "Interaction" } },
    pulseSpeed: { control: { type: "range", min: 100, max: 2000, step: 50 }, description: "Ring expansion, pixels per second.", table: { category: "Interaction" } },
  },
};

export const VisibleLattice = {
  name: "Visible lattice, on the landing page",
  args: { color: LILAC_300, gridOpacity: 0.07, fillOpacity: 0.06, cellRadius: 4, cellSize: 56 },
  parameters: { docs: { description: { story: "`gridOpacity` above zero gives the layer a resting state, so it reads as structure behind the wordmark instead of being invisible until touched. This is the only variant that works under real content, because it does not depend on pointer events reaching it." } } },
  render: (args) => <OnLanding interactive><CursorGrid {...args} /></OnLanding>,
};

export const Violet = {
  name: "Violet, on the landing page",
  parameters: { docs: { description: { story: "`--violet-400` with no resting lattice. Under real content this is mostly blank — a fair illustration of why the pointer-event problem matters." } } },
  render: (args) => <OnLanding interactive><CursorGrid {...args} /></OnLanding>,
};

export const BareLayer = {
  name: "Bare layer",
  args: { color: VIOLET_400, gridOpacity: 0.05 },
  parameters: { docs: { description: { story: "Nothing above it, so every pointer event lands. Move across the frame to light it up, click for an expanding ring. This is the component as intended." } } },
  render: (args) => <Bare><CursorGrid {...args} /></Bare>,
};

export const Tight = {
  name: "Tight and fast",
  args: { color: VIOLET_600, cellSize: 34, radius: 90, falloff: "sharp", holdTime: 80, fadeDuration: 320, lineWidth: 0.8, gridOpacity: 0.04 },
  parameters: { docs: { description: { story: "Small cells, sharp falloff, quick decay — a tight halo tracking the cursor. More cells per frame, so the most expensive configuration here." } } },
  render: (args) => <Bare><CursorGrid {...args} /></Bare>,
};
