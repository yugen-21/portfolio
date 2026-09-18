import React from "react";
import PixelSnow from "./PixelSnow.jsx";
import { OnLanding, Bare } from "../../stories/_backdrop.jsx";
import { LILAC_300, VIOLET_050, VIOLET_400 } from "../../styles/palette.js";

export default {
  title: "Backdrop/PixelSnow",
  component: PixelSnow,
  parameters: {
    layout: "fullscreen",
    docs: {
      story: { inline: false, height: "680px" },
      description: {
        component: [
          "Voxel-marched falling flakes rendered with `three`, vendored verbatim from [React Bits](https://reactbits.dev). The retro chunk comes from `pixelResolution`, which quantises the fragment grid — lower values mean bigger pixels.",
          "",
          "Stories render it behind the **real landing page**. Worth watching here specifically: the site already runs a `Particles` layer, and two independent particle fields can read as noise rather than depth.",
          "",
          "**Palette inheritance is clean.** `color` takes any CSS colour string and goes through `new THREE.Color(...)`, so token hex drops straight in.",
          "",
          "The component pauses rendering when scrolled out of view via `IntersectionObserver`, and builds its scene once — prop changes update uniforms in place rather than rebuilding the context.",
        ].join("\n"),
      },
    },
  },
  args: {
    color: LILAC_300,
    flakeSize: 0.01,
    minFlakeSize: 1.25,
    pixelResolution: 200,
    speed: 1.25,
    density: 0.3,
    direction: 125,
    brightness: 1,
    depthFade: 8,
    farPlane: 20,
    gamma: 0.4545,
    variant: "square",
  },
  argTypes: {
    color: { control: "color", description: "Flake colour. Takes token hex directly.", table: { category: "Colour" } },
    variant: { control: "inline-radio", options: ["square", "round", "snowflake"], description: "Flake shape.", table: { category: "Appearance" } },
    pixelResolution: { control: { type: "range", min: 40, max: 600, step: 10 }, description: "Lower = chunkier pixels.", table: { category: "Appearance" } },
    density: { control: { type: "range", min: 0, max: 1, step: 0.02 }, description: "Probability a cell holds a flake.", table: { category: "Appearance" } },
    speed: { control: { type: "range", min: 0, max: 4, step: 0.05 }, table: { category: "Motion" } },
    direction: { control: { type: "range", min: 0, max: 360, step: 5 }, description: "Wind angle in degrees.", table: { category: "Motion" } },
    flakeSize: { control: { type: "range", min: 0.001, max: 0.1, step: 0.001 }, table: { category: "Appearance" } },
    minFlakeSize: { control: { type: "range", min: 0.5, max: 6, step: 0.05 }, description: "Floor on screen size, in pixels.", table: { category: "Appearance" } },
    brightness: { control: { type: "range", min: 0, max: 3, step: 0.05 }, table: { category: "Colour" } },
    depthFade: { control: { type: "range", min: 1, max: 20, step: 0.5 }, description: "Higher = distant flakes fade faster.", table: { category: "Colour" } },
    farPlane: { control: { type: "range", min: 5, max: 60, step: 1 }, description: "How deep the march runs. Costs fill rate.", table: { category: "Performance" } },
  },
};

export const Sparse = {
  name: "Sparse, on the landing page",
  args: { color: VIOLET_050, density: 0.12, brightness: 0.6, speed: 0.8, pixelResolution: 340 },
  parameters: { docs: { description: { story: "Thinned and dimmed until it reads as ambient dust rather than snow. This is the only configuration that leaves the intro copy fully legible." } } },
  render: (args) => <OnLanding><PixelSnow {...args} /></OnLanding>,
};

export const Lilac = {
  name: "Lilac, on the landing page",
  parameters: { docs: { description: { story: "`--lilac-300` at shipped density — the same value `App.jsx` already gives the shared particle layer. Note how it competes with the particle wordmark; both are light specks at similar scale." } } },
  render: (args) => <OnLanding><PixelSnow {...args} /></OnLanding>,
};

export const Retro = {
  name: "Retro chunk, on the landing page",
  args: { color: VIOLET_400, pixelResolution: 70, density: 0.45, minFlakeSize: 2, variant: "round" },
  parameters: { docs: { description: { story: "`pixelResolution: 70` blows the fragment grid into visible blocks. The most stylised end of the component, and the furthest from the site's current restraint." } } },
  render: (args) => <OnLanding><PixelSnow {...args} /></OnLanding>,
};

export const Snowflakes = {
  name: "Snowflake glyphs",
  args: { color: VIOLET_050, variant: "snowflake", density: 0.18, pixelResolution: 400, minFlakeSize: 3, speed: 0.7 },
  parameters: { docs: { description: { story: "The `snowflake` variant runs a six-fold SDF per flake — noticeably heavier per fragment than `square` or `round`. Shown bare so the glyph shape is actually visible." } } },
  render: (args) => <Bare><PixelSnow {...args} /></Bare>,
};
