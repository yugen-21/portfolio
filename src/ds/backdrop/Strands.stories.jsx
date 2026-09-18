import React from "react";
import Strands from "./Strands.jsx";
import { OnLanding, Bare } from "../../stories/_backdrop.jsx";
import { VIOLET_400, VIOLET_600, VIOLET_050, LILAC_300 } from "../../styles/palette.js";

export default {
  title: "Backdrop/Strands",
  component: Strands,
  parameters: {
    layout: "fullscreen",
    docs: {
      story: { inline: false, height: "680px" },
      description: {
        component: [
          "Woven glowing ribbons rendered with `ogl`, vendored verbatim from [React Bits](https://reactbits.dev). WebGL2 — the shader is `#version 300 es`.",
          "",
          "Stories render it behind the **real landing page**, so the ribbons are judged against the actual wordmark and copy.",
          "",
          "**Palette inheritance is clean.** `colors` takes an array of hex strings the shader cycles across the strands, so it maps straight onto our ramp — the Violet story passes `[--violet-400, --violet-600, --lilac-300]` from `styles/palette.js`. Pass `[]` for the built-in rainbow.",
          "",
          "The setup effect has an empty dependency array but reads props from a ref each frame, so changing colours updates live without rebuilding the WebGL context.",
        ].join("\n"),
      },
    },
  },
  args: {
    colors: [VIOLET_400, VIOLET_600, LILAC_300],
    count: 3,
    speed: 0.5,
    amplitude: 1,
    waviness: 1,
    thickness: 0.7,
    glow: 2.6,
    taper: 3,
    spread: 1,
    intensity: 0.6,
    saturation: 1.5,
    opacity: 1,
    scale: 1.5,
    glass: false,
  },
  argTypes: {
    colors: { control: "object", description: "Hex palette cycled across strands. Empty array = built-in rainbow.", table: { category: "Colour" } },
    count: { control: { type: "range", min: 1, max: 12, step: 1 }, description: "Strand count. Capped at 12 by the shader.", table: { category: "Geometry" } },
    speed: { control: { type: "range", min: 0, max: 2, step: 0.05 }, table: { category: "Motion" } },
    amplitude: { control: { type: "range", min: 0, max: 3, step: 0.05 }, table: { category: "Motion" } },
    waviness: { control: { type: "range", min: 0, max: 3, step: 0.05 }, table: { category: "Motion" } },
    thickness: { control: { type: "range", min: 0.1, max: 3, step: 0.05 }, table: { category: "Geometry" } },
    glow: { control: { type: "range", min: 0, max: 6, step: 0.1 }, table: { category: "Colour" } },
    taper: { control: { type: "range", min: 0, max: 8, step: 0.1 }, description: "How sharply strands fade at the edges.", table: { category: "Geometry" } },
    saturation: { control: { type: "range", min: 0, max: 3, step: 0.05 }, description: "Below 1 fades toward greyscale.", table: { category: "Colour" } },
    scale: { control: { type: "range", min: 0.2, max: 4, step: 0.05 }, table: { category: "Geometry" } },
    glass: { control: "boolean", description: "Render the strands inside a refractive glass ball.", table: { category: "Glass" } },
  },
};

export const Violet = {
  name: "Violet, on the landing page",
  parameters: { docs: { description: { story: "Our three-stop violet sweep passed straight into `colors`. No approximation needed — this is what clean palette inheritance looks like. The ribbons band horizontally, which is worth watching against the wordmark." } } },
  render: (args) => <OnLanding><Strands {...args} /></OnLanding>,
};

export const Quiet = {
  name: "Quiet, on the landing page",
  args: { colors: [VIOLET_600, VIOLET_400], count: 2, intensity: 0.32, glow: 1.5, speed: 0.22, opacity: 0.65, saturation: 1.1, taper: 4 },
  parameters: { docs: { description: { story: "Two strands, dimmer and slower, tapered harder at the edges. The version that can actually sit under body copy." } } },
  render: (args) => <OnLanding><Strands {...args} /></OnLanding>,
};

export const VendoredDefault = {
  name: "Vendored default, on the landing page",
  args: { colors: ["#FF4242", "#7C3AED", "#06B6D4", "#EAB308"] },
  parameters: { docs: { description: { story: "React Bits' shipped palette — red, violet, cyan, yellow. Only the violet stop belongs to our ramp, and it shows immediately against the page." } } },
  render: (args) => <OnLanding><Strands {...args} /></OnLanding>,
};

export const Glass = {
  name: "Glass ball",
  args: { colors: [VIOLET_400, VIOLET_050, VIOLET_600], glass: true, glassSize: 1, refraction: 1, dispersion: 1 },
  parameters: { docs: { description: { story: "Strands rendered to a texture then refracted through a sphere — two draw calls per frame. Shown bare because it is a focal object, not a wash, and would fight the wordmark head-on." } } },
  render: (args) => <Bare><Strands {...args} /></Bare>,
};
