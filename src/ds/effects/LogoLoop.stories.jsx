import React from "react";
import { LogoLoop } from "./LogoLoop.jsx";
import { TECH } from "../../data/about.js";

const NODE_LOGOS = [
  { node: <span style={{ color: "var(--text-accent)", fontFamily: "var(--font-display)" }}>React</span>, title: "React JS" },
  { node: <span style={{ color: "var(--violet-300)", fontFamily: "var(--font-display)" }}>FastAPI</span>, title: "Python FastAPI" },
  { node: <span style={{ color: "var(--lilac-200)", fontFamily: "var(--font-display)" }}>Postgres</span>, title: "PostgreSQL" },
  { node: <span style={{ color: "var(--violet-200)", fontFamily: "var(--font-display)" }}>Azure</span>, title: "Azure Cloud" },
];

export default {
  title: "Effects/LogoLoop",
  component: LogoLoop,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: [
          "An infinitely scrolling marquee. It measures one sequence, works out how many copies are needed to cover the container, and drives a single `translate3d` on the track with rAF — so there is no CSS keyframe to fall out of sync and no layout thrash per frame.",
          "",
          "Velocity is eased toward its target rather than snapped, so hovering slows the belt down instead of stopping it dead. Honours `prefers-reduced-motion` by parking the track at the origin.",
          "",
          "Logos are either `{ src, alt, title }` images or `{ node }` React elements. The site uses Simple Icons SVGs from jsDelivr, inverted to white with a CSS filter — **these stories need network access to render the real logos**.",
        ].join("\n"),
      },
    },
  },
  args: {
    logos: TECH,
    speed: 34,
    direction: "left",
    logoHeight: 36,
    gap: 74,
    fadeOut: true,
    fadeOutColor: "#050107",
    scaleOnHover: true,
    labelOnHover: true,
    hoverSpeed: 0,
    ariaLabel: "Technologies I work with",
  },
  argTypes: {
    logos: { control: "object", description: "Array of { src, alt, title, filter } or { node, title }.", table: { category: "Content" } },
    ariaLabel: { control: "text", table: { category: "Content" } },

    speed: { control: { type: "range", min: -300, max: 300, step: 2 }, description: "px per second. Negative reverses the belt.", table: { category: "Motion" } },
    direction: { control: "inline-radio", options: ["left", "right", "up", "down"], description: "`up`/`down` switch the track to a vertical column.", table: { category: "Motion" } },
    hoverSpeed: { control: { type: "range", min: -300, max: 300, step: 2 }, description: "Speed while hovered. 0 parks it; leave undefined to fall back to pauseOnHover.", table: { category: "Motion" } },
    pauseOnHover: { control: "boolean", description: "Legacy switch — hoverSpeed wins when both are set.", table: { category: "Motion" } },

    logoHeight: { control: { type: "range", min: 12, max: 120, step: 2 }, table: { category: "Appearance" } },
    gap: { control: { type: "range", min: 0, max: 200, step: 2 }, table: { category: "Appearance" } },
    width: { control: "text", description: "Container width — a number is treated as px.", table: { category: "Appearance" } },
    fadeOut: { control: "boolean", description: "Gradient masks at both edges so logos dissolve rather than clip.", table: { category: "Appearance" } },
    fadeOutColor: { control: "color", description: "Must match the page ground behind the loop or the mask shows as a band.", table: { category: "Appearance" } },
    scaleOnHover: { control: "boolean", description: "Scales the hovered logo to 1.2.", table: { category: "Appearance" } },
    labelOnHover: { control: "boolean", description: "Reveals the logo's title underneath on hover.", table: { category: "Appearance" } },

    style: { control: "object", table: { category: "Escape hatches" } },
    className: { control: "text", table: { category: "Escape hatches" } },
  },
};

export const Playground = {};

export const AboutPageStrip = {
  name: "In context — about page",
  parameters: { docs: { description: { story: "The exact configuration from the About page: a slow 34px/s belt that parks on hover, with the technology name revealed underneath." } } },
  render: (args) => (
    <div style={{ background: "var(--void)", padding: "40px 0" }}>
      <LogoLoop {...args} />
    </div>
  ),
};

export const Directions = {
  parameters: { docs: { description: { story: "Horizontal directions on the same set. `speed` is signed too, so `direction=\"right\"` and a negative speed cancel out." } } },
  render: (args) => (
    <div style={{ display: "grid", gap: 34, background: "var(--void)", padding: "24px 0" }}>
      {["left", "right"].map((d) => (
        <div key={d}>
          <div style={{ fontSize: "var(--text-meta)", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "var(--track-caps)", marginBottom: 10 }}>{d}</div>
          <LogoLoop {...args} direction={d} labelOnHover={false} />
        </div>
      ))}
    </div>
  ),
};

export const Vertical = {
  parameters: { docs: { description: { story: "With `up`/`down` the track becomes a column and sizes itself to its parent's height — so the parent must have one." } } },
  render: (args) => (
    <div style={{ display: "flex", gap: 60, height: 380, background: "var(--void)", padding: 20 }}>
      {["up", "down"].map((d) => (
        <div key={d} style={{ height: "100%" }}>
          <LogoLoop {...args} direction={d} labelOnHover={false} scaleOnHover={false} gap={44} width={70} />
        </div>
      ))}
    </div>
  ),
};

export const NodeLogos = {
  name: "React node logos",
  args: { logos: NODE_LOGOS, logoHeight: 26, gap: 56, labelOnHover: false },
  parameters: { docs: { description: { story: "Items given as `{ node }` render arbitrary React instead of an image — wordmarks, inline SVG, anything. No network needed for this one." } } },
  render: (args) => (
    <div style={{ background: "var(--void)", padding: "40px 0" }}>
      <LogoLoop {...args} />
    </div>
  ),
};

export const NoFade = {
  name: "Without edge fade",
  args: { fadeOut: false },
  parameters: { docs: { description: { story: "Logos clip hard at the container edge. The fade exists to hide that seam, and its colour has to match the ground behind it." } } },
  render: (args) => (
    <div style={{ background: "var(--void)", padding: "40px 0" }}>
      <LogoLoop {...args} />
    </div>
  ),
};

export const Fast = {
  args: { speed: 160, labelOnHover: false, hoverSpeed: 20 },
  parameters: { docs: { description: { story: "A quick belt that eases down to 20px/s on hover rather than stopping — the 0.25s velocity smoothing makes that transition readable." } } },
  render: (args) => (
    <div style={{ background: "var(--void)", padding: "40px 0" }}>
      <LogoLoop {...args} />
    </div>
  ),
};
