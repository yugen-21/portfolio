import React from "react";
import { AuroraLayer, LANDING_BLOBS, WORK_BLOBS, ABOUT_BLOBS } from "./AuroraLayer.jsx";

/** Named presets, exposed as a select control on the `blobs` arg. */
const PRESETS = {
  LANDING_BLOBS,
  WORK_BLOBS,
  ABOUT_BLOBS,
  NONE: [],
};

const Caption = ({ title, note }) => (
  <div style={{ position: "relative", zIndex: 3, minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 var(--gutter-page)" }}>
    <div style={{ fontFamily: "var(--font-display)", fontWeight: 400, fontSize: "var(--text-title)", color: "var(--text-display)", lineHeight: "var(--leading-title)" }}>{title}</div>
    <div style={{ marginTop: 14, maxWidth: "var(--measure-body)", fontSize: "var(--text-body)", lineHeight: "var(--leading-body)", color: "var(--text-body)", textWrap: "pretty" }}>{note}</div>
  </div>
);

export default {
  title: "Backdrop/AuroraLayer",
  component: AuroraLayer,
  parameters: {
    layout: "fullscreen",
    docs: {
      story: { inline: false, height: "560px" },
      description: {
        component: [
          "The backdrop the three pages actually use. Unlike `Aurora`, it takes its blob definitions as a prop, so each page ships its own arrangement while sharing one renderer.",
          "",
          "Three presets are exported alongside it — `LANDING_BLOBS` (shafts plus one bloom), `WORK_BLOBS` (three wide blooms) and `ABOUT_BLOBS` (two blooms). Each blob is a raw style object, so a `blobs` entry can carry any CSS the layer should paint.",
          "",
          "Depends on `@keyframes drift1/2/3` and `sway1/2/3` from `src/index.css`.",
        ].join("\n"),
      },
    },
  },
  args: { blobs: "LANDING_BLOBS", scan: true, parallax: true },
  argTypes: {
    blobs: {
      control: "select",
      options: Object.keys(PRESETS),
      mapping: PRESETS,
      description: "Array of style objects, each rendered as an absolutely positioned div. The control switches between the three exported presets.",
      table: { category: "Content" },
    },
    scan: { control: "boolean", description: "Overlay the --scanlines texture at 0.5 opacity.", table: { category: "Appearance" } },
    parallax: { control: "boolean", description: "Write --mx / --my from pointer position.", table: { category: "Motion" } },
  },
};

export const Landing = {
  args: { blobs: "LANDING_BLOBS", scan: true },
  parameters: { docs: { description: { story: "`LANDING_BLOBS` — four tilted shafts plus a wide bloom, with scanlines on. The busiest of the three, because the landing page has the least content." } } },
  render: (args) => (
    <>
      <AuroraLayer {...args} />
      <Caption title="LANDING_BLOBS" note="Four swaying shafts and one drifting bloom. Scanlines on." />
    </>
  ),
};

export const Work = {
  args: { blobs: "WORK_BLOBS", scan: false },
  parameters: { docs: { description: { story: "`WORK_BLOBS` — three wide blooms, no scanlines. Quieter, because the shelf of covers is doing the visual work." } } },
  render: (args) => (
    <>
      <AuroraLayer {...args} />
      <Caption title="WORK_BLOBS" note="Three broad blooms and no scanline texture, so project covers keep the contrast." />
    </>
  ),
};

export const About = {
  args: { blobs: "ABOUT_BLOBS", scan: true },
  parameters: { docs: { description: { story: "`ABOUT_BLOBS` — two opposed blooms with scanlines. The lightest arrangement, sitting under a long page of text." } } },
  render: (args) => (
    <>
      <AuroraLayer {...args} />
      <Caption title="ABOUT_BLOBS" note="Two blooms pulling against each other across the diagonal." />
    </>
  ),
};

export const Bare = {
  name: "Vignette only",
  args: { blobs: "NONE", scan: false },
  parameters: { docs: { description: { story: "No blobs at all — just the radial vignette that every arrangement ends with. This is the floor the other presets are built on." } } },
  render: (args) => (
    <>
      <AuroraLayer {...args} />
      <Caption title="No blobs" note="Only the vignette remains: transparent at 30% out, solid --void by the edges." />
    </>
  ),
};
