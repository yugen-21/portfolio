import React from "react";
import { ParticleText } from "./ParticleText.jsx";

/** ParticleText fills its parent, so every story needs a sized stage. */
const Stage = ({ height = 200, width = 900, children }) => (
  <div style={{ width: "100%", maxWidth: width, height, fontFamily: "var(--font-display)" }}>{children}</div>
);

export default {
  title: "Effects/ParticleText",
  component: ParticleText,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: [
          "Renders text to an offscreen canvas, samples the glyph bitmap on a grid, and flies a particle into every opaque pixel it finds.",
          "",
          "**Every prop is in the effect's dependency array**, so changing any control rebuilds the particle field and replays the gather from scratch — which is exactly what you want when tuning it.",
          "",
          "Particle count is capped by area (`width * height / 90`, between 900 and 5200), so `density` trades sharpness against how many particles the cap will actually allow. Honours `prefers-reduced-motion` by snapping straight to the assembled text.",
        ].join("\n"),
      },
    },
  },
  args: {
    text: "A. Shama Anjum",
    particleSize: 2,
    density: 3,
    color: "#faf6ff",
    highlightColor: "#a855f7",
    scatter: 200,
    gatherDuration: 1700,
    stagger: 460,
    pointerRepel: 40,
    repelRadius: 120,
    idleDrift: 0.7,
    trigger: "mount",
    align: "left",
    fontSize: "clamp(46px, 8vw, 110px)",
    fontWeight: 400,
    fontFamily: "'Instrument Serif', Georgia, serif",
    glow: true,
  },
  argTypes: {
    text: { control: "text", table: { category: "Content" } },
    align: { control: "inline-radio", options: ["left", "center"], table: { category: "Content" } },
    fontSize: { control: "text", description: "Any CSS length, including clamp(). Auto-shrinks if the text would overflow its container.", table: { category: "Content" } },
    fontWeight: { control: { type: "range", min: 100, max: 900, step: 100 }, table: { category: "Content" } },
    fontFamily: { control: "text", description: "`inherit` picks up the container's computed family.", table: { category: "Content" } },

    density: { control: { type: "range", min: 2, max: 12, step: 1 }, description: "Sampling step in px — lower means more particles and crisper glyphs.", table: { category: "Particles" } },
    particleSize: { control: { type: "range", min: 0.5, max: 8, step: 0.1 }, description: "Base particle size. At or below 2.1 they draw as squares, above that as circles.", table: { category: "Particles" } },
    color: { control: "color", description: "Colour at the left edge of the text.", table: { category: "Particles" } },
    highlightColor: { control: "color", description: "Colour at the right edge — particles blend between the two across the width.", table: { category: "Particles" } },
    glow: { control: "boolean", description: "Canvas shadow blur tinted with highlightColor. The single most expensive option here.", table: { category: "Particles" } },

    trigger: {
      control: "inline-radio",
      options: ["mount", "hover", "click"],
      description: "`mount` gathers once. `hover` and `click` re-scatter and re-gather on that interaction.",
      table: { category: "Motion" },
    },
    scatter: { control: { type: "range", min: 0, max: 600, step: 10 }, description: "How far particles start from their target, in px.", table: { category: "Motion" } },
    gatherDuration: { control: { type: "range", min: 200, max: 5000, step: 100 }, description: "Flight time per particle, in ms.", table: { category: "Motion" } },
    stagger: { control: { type: "range", min: 0, max: 2000, step: 20 }, description: "Spread of start delays across the field, in ms.", table: { category: "Motion" } },
    idleDrift: { control: { type: "range", min: 0, max: 6, step: 0.1 }, description: "Amplitude of the resting shimmer once assembled.", table: { category: "Motion" } },

    pointerRepel: { control: { type: "range", min: 0, max: 200, step: 5 }, description: "How hard the pointer pushes particles away.", table: { category: "Pointer" } },
    repelRadius: { control: { type: "range", min: 0, max: 500, step: 10 }, description: "Radius of the pointer's influence, in px.", table: { category: "Pointer" } },

    style: { control: "object", table: { category: "Escape hatches" } },
    className: { control: "text", table: { category: "Escape hatches" } },
  },
};

export const Playground = {
  render: (args) => <Stage><ParticleText {...args} /></Stage>,
};

export const LandingHeadline = {
  name: "In context — landing headline",
  parameters: { docs: { description: { story: "The landing page settings exactly: left aligned, density 3, a 1.7s gather with 460ms of stagger. Reload the story to replay the assembly." } } },
  render: (args) => (
    <Stage height={168}>
      <ParticleText {...args} />
    </Stage>
  ),
};

export const GatherOnHover = {
  name: "Gather on hover",
  args: { trigger: "hover", text: "Hover me", align: "center" },
  parameters: { docs: { description: { story: "`trigger: \"hover\"` re-scatters and re-gathers every time the pointer enters. Move away and back to replay it." } } },
  render: (args) => <Stage height={200} width={620}><ParticleText {...args} /></Stage>,
};

export const GatherOnClick = {
  name: "Gather on click",
  args: { trigger: "click", text: "Click me", align: "center" },
  parameters: { docs: { description: { story: "Same idea, driven by click — steadier if the text sits somewhere the pointer crosses often." } } },
  render: (args) => <Stage height={200} width={620}><ParticleText {...args} /></Stage>,
};

export const DensityLadder = {
  name: "Density ladder",
  parameters: { docs: { description: { story: "The same word at four sampling steps. Below about 3 the area cap starts thinning the field anyway, so the gain flattens out while the cost does not." } } },
  render: (args) => (
    <div style={{ display: "grid", gap: 8, width: "100%", maxWidth: 760 }}>
      {[2, 3, 5, 8].map((d) => (
        <div key={d}>
          <div style={{ fontSize: "var(--text-meta)", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "var(--track-caps)" }}>density {d}</div>
          <Stage height={110}>
            <ParticleText {...args} density={d} text="Shama" align="left" fontSize="86px" />
          </Stage>
        </div>
      ))}
    </div>
  ),
};

export const NoGlow = {
  name: "Without glow",
  args: { glow: false, align: "center", text: "No glow" },
  parameters: { docs: { description: { story: "Glow costs a canvas shadow per particle. Turning it off is the first thing to try if the effect stutters on a weak GPU." } } },
  render: (args) => <Stage height={200} width={620}><ParticleText {...args} /></Stage>,
};

export const Assembled = {
  name: "Assembled (no flight)",
  args: { scatter: 0, gatherDuration: 200, stagger: 0, idleDrift: 0, align: "center" },
  parameters: { docs: { description: { story: "Scatter and drift at zero, so the text sits still. This is roughly what a reduced-motion visitor sees, and it is the story to use for a stable screenshot." } } },
  render: (args) => <Stage height={200}><ParticleText {...args} /></Stage>,
};
