import React from "react";
import { Aurora } from "./Aurora.jsx";

/** Backdrops are position:fixed and paint nothing but light — give them something to sit behind. */
const Caption = ({ title, note }) => (
  <div style={{ position: "relative", zIndex: 3, minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 var(--gutter-page)" }}>
    <div style={{ fontFamily: "var(--font-display)", fontWeight: 400, fontSize: "var(--text-title)", color: "var(--text-display)", lineHeight: "var(--leading-title)" }}>{title}</div>
    <div style={{ marginTop: 14, maxWidth: "var(--measure-body)", fontSize: "var(--text-body)", lineHeight: "var(--leading-body)", color: "var(--text-body)", textWrap: "pretty" }}>{note}</div>
  </div>
);

export default {
  title: "Backdrop/Aurora",
  component: Aurora,
  parameters: {
    layout: "fullscreen",
    docs: {
      // Fixed-position layers would stack on top of each other in the docs
      // page — give each story its own iframe.
      story: { inline: false, height: "560px" },
      description: {
        component: [
          "A fixed, pointer-transparent light layer at `z-index: 0`. Two variants: `nebula` (four soft radial blooms) and `shafts` (four tilted light columns). Both finish with a vignette and a scanline texture.",
          "",
          "Movement comes from `@keyframes drift1/2/3` and `sway1/2/3`, which live in `src/index.css` — **the host page must define them** or the layer renders static.",
          "",
          "Parallax writes `--mx` / `--my` on the root element from pointer position; the blob offsets are `calc()` expressions that read those variables at different multipliers, so layers separate in depth.",
          "",
          "Note this is the self-contained sibling of `AuroraLayer`, which takes its blobs as a prop instead. The pages use `AuroraLayer`.",
        ].join("\n"),
      },
    },
  },
  args: { variant: "nebula", intensity: 1, parallax: true },
  argTypes: {
    variant: {
      control: "inline-radio",
      options: ["nebula", "shafts"],
      description: "`nebula` blooms, `shafts` tilted columns.",
      table: { category: "Appearance" },
    },
    intensity: { control: { type: "range", min: 0, max: 1, step: 0.05 }, description: "Opacity of the whole layer.", table: { category: "Appearance" } },
    parallax: { control: "boolean", description: "Track the pointer and offset the layers by depth.", table: { category: "Motion" } },
  },
};

export const Nebula = {
  args: { variant: "nebula" },
  render: (args) => (
    <>
      <Aurora {...args} />
      <Caption title="Nebula" note="Four radial blooms drifting on 19 to 34 second cycles. This is the calmer variant — it reads as depth rather than as a light source." />
    </>
  ),
};

export const Shafts = {
  args: { variant: "shafts" },
  render: (args) => (
    <>
      <Aurora {...args} />
      <Caption title="Shafts" note="Four tilted columns swaying and stretching. Directional and much more present — it wants a page with room at the top." />
    </>
  ),
};

export const IntensityLadder = {
  name: "Intensity",
  args: { intensity: 0.35 },
  parameters: { docs: { description: { story: "Dropping intensity is the simplest way to quiet the backdrop behind dense content. Below about 0.3 the vignette does most of the work." } } },
  render: (args) => (
    <>
      <Aurora {...args} />
      <Caption title="Intensity 0.35" note="Drag the intensity control to find the level where the backdrop stops competing with body copy." />
    </>
  ),
};

export const NoParallax = {
  name: "Without parallax",
  args: { parallax: false },
  parameters: { docs: { description: { story: "No pointer listener at all. The blobs still drift on their own timers — parallax only adds the depth offset." } } },
  render: (args) => (
    <>
      <Aurora {...args} />
      <Caption title="No parallax" note="The --mx and --my variables are never written, so every calc() falls back to 0px." />
    </>
  ),
};
