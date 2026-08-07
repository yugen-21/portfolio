import React from "react";
import { Particles } from "./Particles.jsx";

/** Particles fills its parent, and the app mounts it as a fixed full-viewport layer. */
const FixedLayer = ({ children }) => (
  <div style={{ position: "fixed", inset: 0, zIndex: 1, pointerEvents: "none" }}>{children}</div>
);

const Caption = ({ title, note }) => (
  <div style={{ position: "relative", zIndex: 3, minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 var(--gutter-page)" }}>
    <div style={{ fontFamily: "var(--font-display)", fontWeight: 400, fontSize: "var(--text-title)", color: "var(--text-display)", lineHeight: "var(--leading-title)" }}>{title}</div>
    <div style={{ marginTop: 14, maxWidth: "var(--measure-body)", fontSize: "var(--text-body)", lineHeight: "var(--leading-body)", color: "var(--text-body)", textWrap: "pretty" }}>{note}</div>
  </div>
);

export default {
  title: "Backdrop/Particles",
  component: Particles,
  parameters: {
    layout: "fullscreen",
    docs: {
      story: { inline: false, height: "560px" },
      description: {
        component: [
          "A WebGL1 point cloud that sits above the aurora and below the content, on every page. Points are distributed uniformly in a sphere, then each one wanders on its own sine offsets driven by four random seeds.",
          "",
          "The app mounts it inside a `position: fixed`, `pointer-events: none` wrapper at `z-index: 1`, which is what these stories reproduce.",
          "",
          "**`particleCount` and `particleColors` rebuild the geometry buffers**, so changing them remounts the effect. The rest are live uniforms.",
        ].join("\n"),
      },
    },
  },
  args: {
    particleCount: 140,
    particleSpread: 14,
    speed: 0.06,
    particleColors: ["#c4a6ff", "#a855f7", "#ede4ff"],
    moveParticlesOnHover: true,
    particleHoverFactor: 0.4,
    alphaParticles: true,
    particleBaseSize: 60,
    sizeRandomness: 1,
    cameraDistance: 20,
    disableRotation: false,
    pixelRatio: 1,
  },
  argTypes: {
    particleCount: { control: { type: "range", min: 10, max: 1200, step: 10 }, description: "Rebuilds geometry — remounts the effect.", table: { category: "Field" } },
    particleSpread: { control: { type: "range", min: 1, max: 40, step: 0.5 }, description: "Radius of the sphere the points are scattered through.", table: { category: "Field" } },
    particleColors: { control: "object", description: "Hex strings sampled at random per particle. Rebuilds geometry.", table: { category: "Field" } },
    cameraDistance: { control: { type: "range", min: 4, max: 60, step: 1 }, table: { category: "Field" } },

    particleBaseSize: { control: { type: "range", min: 4, max: 400, step: 2 }, description: "Point size before the per-particle random factor.", table: { category: "Appearance" } },
    sizeRandomness: { control: { type: "range", min: 0, max: 3, step: 0.05 }, description: "At 0 every point is exactly particleBaseSize and depth stops affecting size.", table: { category: "Appearance" } },
    alphaParticles: { control: "boolean", description: "Soft round sprites instead of hard-cut discs.", table: { category: "Appearance" } },
    pixelRatio: { control: { type: "range", min: 0.5, max: 3, step: 0.25 }, description: "Render scale. 1 is deliberate — the field is soft enough that 2 buys nothing.", table: { category: "Appearance" } },

    speed: { control: { type: "range", min: 0, max: 1, step: 0.01 }, description: "Time multiplier for the wander.", table: { category: "Motion" } },
    disableRotation: { control: "boolean", description: "Stops the slow whole-field tumble.", table: { category: "Motion" } },
    moveParticlesOnHover: { control: "boolean", table: { category: "Pointer" } },
    particleHoverFactor: { control: { type: "range", min: 0, max: 5, step: 0.1 }, description: "How far the field slides with the pointer.", table: { category: "Pointer" } },

    style: { control: "object", table: { category: "Escape hatches" } },
    className: { control: "text", table: { category: "Escape hatches" } },
  },
};

export const AppDefaults = {
  name: "App defaults",
  parameters: { docs: { description: { story: "Exactly what `App.jsx` mounts: 140 particles in the violet palette, drifting slowly and sliding a little with the pointer." } } },
  render: (args) => (
    <>
      <FixedLayer><Particles {...args} /></FixedLayer>
      <Caption title="Particles" note="140 points in three violets, spread 14, speed 0.06. Move the pointer to slide the field." />
    </>
  ),
};

export const Dense = {
  args: { particleCount: 700, particleBaseSize: 34, speed: 0.12 },
  parameters: { docs: { description: { story: "Seven hundred smaller, quicker points — closer to a starfield than to dust. Watch the frame rate before shipping something like this." } } },
  render: (args) => (
    <>
      <FixedLayer><Particles {...args} /></FixedLayer>
      <Caption title="Dense field" note="700 particles at half the base size." />
    </>
  ),
};

export const Sparse = {
  args: { particleCount: 30, particleBaseSize: 160, speed: 0.03, sizeRandomness: 0.4 },
  parameters: { docs: { description: { story: "Thirty large, slow motes. Reads as bokeh rather than as stars." } } },
  render: (args) => (
    <>
      <FixedLayer><Particles {...args} /></FixedLayer>
      <Caption title="Sparse field" note="30 particles at 160 base size." />
    </>
  ),
};

export const HardEdged = {
  name: "Without alpha",
  args: { alphaParticles: false },
  parameters: { docs: { description: { story: "`alphaParticles: false` cuts each point to a hard disc. Sharper, and noticeably harsher against a dark ground." } } },
  render: (args) => (
    <>
      <FixedLayer><Particles {...args} /></FixedLayer>
      <Caption title="Hard-edged" note="Discs with a hard cut instead of soft alpha sprites." />
    </>
  ),
};

export const Still = {
  args: { speed: 0, disableRotation: true, moveParticlesOnHover: false },
  parameters: { docs: { description: { story: "Everything frozen. The story to use for a stable screenshot, and a quick way to judge the field's density on its own." } } },
  render: (args) => (
    <>
      <FixedLayer><Particles {...args} /></FixedLayer>
      <Caption title="Still" note="Speed 0, rotation off, pointer tracking off." />
    </>
  ),
};

export const Monochrome = {
  args: { particleColors: ["#ffffff"], particleCount: 260, particleBaseSize: 40 },
  parameters: { docs: { description: { story: "A single colour, which is also what the component falls back to when `particleColors` is empty." } } },
  render: (args) => (
    <>
      <FixedLayer><Particles {...args} /></FixedLayer>
      <Caption title="Monochrome" note="One white; the component's own default is three whites." />
    </>
  ),
};
