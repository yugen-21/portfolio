import React from "react";
import GridMotion from "./GridMotion.jsx";
import { TECH } from "../../data/about.js";
import { OnLanding } from "../../stories/_backdrop.jsx";
import { VIOLET_950, INK_700 } from "../../styles/palette.js";

/** GridMotion draws exactly 4 rows of 7. TECH has 12 entries, so cycle to fill 28. */
const techNames = TECH.map((t) => t.title);
const STACK_ITEMS = Array.from({ length: 28 }, (_, i) => techNames[i % techNames.length]);

export default {
  title: "Backdrop/GridMotion",
  component: GridMotion,
  parameters: {
    layout: "fullscreen",
    docs: {
      story: { inline: false, height: "620px" },
      description: {
        component: [
          "Four rows of seven tiles on a -15deg rotated plane, each row tracking the pointer at a different inertia. Driven by `gsap`, vendored verbatim from [React Bits](https://reactbits.dev). **Move the pointer horizontally** — the rows slide in alternating directions.",
          "",
          "The stack story below fills it with `TECH` from `data/about.js`, cycled to 28 because the grid is a fixed 4x7 and the stack has 12 entries.",
          "",
          "### Two things block a clean palette pass",
          "",
          "- **Tile colour is hardcoded.** `row__item-inner` carries an inline `style={{ backgroundColor: '#111' }}`, which beats the stylesheet. `gradientColor` only controls the radial wash behind the grid, not the tiles. Tinting tiles to `--ink-700` means editing the component.",
          "- **The class names are generic.** It ships `.row`, `.intro`, `.noscroll` and `.fullview` as global selectors. Nothing in this project collides with them today, but `.row` is one utility away from trouble — worth scoping before it goes into a page.",
          "",
          "Also note `.intro` is hard-coded to `height: 100vh`, so the component always claims a full viewport regardless of its container.",
        ].join("\n"),
      },
    },
  },
  argTypes: {
    items: { control: false, description: "Up to 28 entries. Strings starting with `http` render as background images, anything else as text or JSX." },
    gradientColor: { control: "color", description: "Radial wash behind the grid. Does not affect tile colour." },
  },
};

export const TechStack = {
  name: "Tech stack",
  args: { items: STACK_ITEMS, gradientColor: VIOLET_950 },
  parameters: { docs: { description: { story: "Shama's twelve stack entries cycled across the grid, on a `--violet-950` wash. This is the shape the About page section would take. Move the pointer to see the rows separate." } } },
  render: (args) => <GridMotion {...args} />,
};

export const VendoredDefault = {
  name: "Vendored default",
  args: { items: [], gradientColor: "black" },
  parameters: { docs: { description: { story: "No items and the stock black wash — the component falls back to `Item 1`…`Item 28`. Shown so the tile colour is visible for comparison: those `#111` tiles are the hardcoded value." } } },
  render: (args) => <GridMotion {...args} />,
};

export const InkWash = {
  name: "Ink wash",
  args: { items: STACK_ITEMS, gradientColor: INK_700 },
  parameters: { docs: { description: { story: "The same grid on `--ink-700`. Far quieter than the violet wash, and closer to the page ground — but it also shows how little `gradientColor` can do while the tiles stay `#111`." } } },
  render: (args) => <GridMotion {...args} />,
};

export const BehindLanding = {
  name: "On the landing page",
  args: { items: STACK_ITEMS, gradientColor: VIOLET_950 },
  parameters: { docs: { description: { story: "The stack grid used as a full backdrop behind the real landing content. Included for completeness, but this is the weakest fit of the set — the tiles carry text of their own, so they fight the wordmark rather than sit behind it. The tech-stack section on About is the honest home for this component." } } },
  render: (args) => <OnLanding><GridMotion {...args} /></OnLanding>,
};
