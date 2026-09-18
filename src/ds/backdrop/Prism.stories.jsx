import React from "react";
import Prism from "./Prism.jsx";
import { OnLanding, Bare } from "../../stories/_backdrop.jsx";

export default {
  title: "Backdrop/Prism",
  component: Prism,
  parameters: {
    layout: "fullscreen",
    docs: {
      story: { inline: false, height: "680px" },
      description: {
        component: [
          "Raymarched pyramid rendered with `ogl`, vendored verbatim from [React Bits](https://reactbits.dev). Requires WebGL — without it the canvas mounts but stays black.",
          "",
          "Stories render it behind the **real landing page**, so the wordmark, role rotator and intro copy are the actual thing sitting on top.",
          "",
          "### This one fails the palette rule",
          "",
          "Prism has no colour prop. Its bands come from `sin((p.y + z) * colorFrequency + vec4(0,1,2,3))` — a rainbow by construction — and the only lever is `hueShift`, a hue rotation in **radians**.",
          "",
          "**Sweeping `hueShift` through a full turn never reaches violet.** See the Hue sweep story: the rotation runs cyan → green → yellow → orange and back to cyan. The two axes it can actually reach are the yellow-blue and green-magenta ones, and the `tanh` tone-map blows the core out to white before any of it saturates. Widening the bands (`colorFrequency` toward 0.35) narrows it to a single hue but does not move which hues are available.",
          "",
          "So there is no setting of this component that sits on the violet ramp. The closest is `hueShift: 0` at a higher band density, which puts blue and magenta in the upper body but keeps a white-hot core and green edges.",
          "",
          "**If you want this silhouette in our palette, `Strands` gets there natively** — it takes a `colors` array and accepts our tokens directly. Making Prism comply would mean editing the fragment shader to sample a palette instead of a sine rainbow, which is no longer vendoring it.",
        ].join("\n"),
      },
    },
  },
  args: {
    animationType: "rotate",
    timeScale: 0.5,
    height: 3.5,
    baseWidth: 5.5,
    scale: 3.6,
    hueShift: 0,
    colorFrequency: 1,
    noise: 0.5,
    glow: 1,
    bloom: 1,
    transparent: true,
    suspendWhenOffscreen: false,
  },
  argTypes: {
    animationType: { control: "inline-radio", options: ["rotate", "hover", "3drotate"], description: "Shader wobble, pointer tilt, or full 3D rotation.", table: { category: "Motion" } },
    timeScale: { control: { type: "range", min: 0, max: 2, step: 0.05 }, description: "0 freezes the effect.", table: { category: "Motion" } },
    hueShift: { control: { type: "range", min: 0, max: 6.28, step: 0.05 }, description: "Hue rotation in radians. The only colour control.", table: { category: "Colour" } },
    colorFrequency: { control: { type: "range", min: 0, max: 3, step: 0.05 }, description: "Band density. Lower = fewer, wider bands.", table: { category: "Colour" } },
    noise: { control: { type: "range", min: 0, max: 1, step: 0.05 }, description: "Film grain. 0 disables it.", table: { category: "Colour" } },
    glow: { control: { type: "range", min: 0, max: 3, step: 0.1 }, table: { category: "Colour" } },
    bloom: { control: { type: "range", min: 0, max: 3, step: 0.1 }, table: { category: "Colour" } },
    scale: { control: { type: "range", min: 0.5, max: 8, step: 0.1 }, table: { category: "Geometry" } },
    height: { control: { type: "range", min: 0.5, max: 8, step: 0.1 }, table: { category: "Geometry" } },
    baseWidth: { control: { type: "range", min: 0.5, max: 10, step: 0.1 }, table: { category: "Geometry" } },
    suspendWhenOffscreen: { control: "boolean", description: "Pause the rAF loop when scrolled out of view.", table: { category: "Performance" } },
  },
};

export const ClosestToPalette = {
  name: "Closest to palette, on the landing page",
  args: { hueShift: 0, colorFrequency: 1.6, noise: 0.22, glow: 1.15, timeScale: 0.32, scale: 4.2 },
  parameters: { docs: { description: { story: "The nearest this component gets to the ramp: blue and magenta in the upper body, but a white core and green fringes that no `hueShift` removes. Shown under real copy so the mismatch is judged in context rather than in isolation. This is **not** a palette match — see the component notes and the Hue sweep." } } },
  render: (args) => <OnLanding><Prism {...args} /></OnLanding>,
};

export const VendoredDefault = {
  name: "Vendored default, on the landing page",
  parameters: { docs: { description: { story: "Exactly as React Bits ships it — `hueShift: 0`, full rainbow. Under real copy the green and orange bands are the obvious problem." } } },
  render: (args) => <OnLanding><Prism {...args} /></OnLanding>,
};

export const Frozen = {
  name: "Frozen, on the landing page",
  args: { hueShift: 0, colorFrequency: 1.6, timeScale: 0, scale: 4.2 },
  parameters: { docs: { description: { story: "`timeScale: 0` stops the rAF loop after one frame — good for judging composition, and the honest fallback for `prefers-reduced-motion`." } } },
  render: (args) => <OnLanding><Prism {...args} /></OnLanding>,
};

const HUES = [0, 1.05, 2.1, 3.14, 4.19, 5.24];

export const HueSweep = {
  name: "Hue sweep",
  args: { colorFrequency: 1.6, timeScale: 0, scale: 2.2, noise: 0.15 },
  parameters: {
    docs: { story: { inline: false, height: "560px" }, description: { story: "`hueShift` stepped through a full turn, frozen so the frames are comparable. **This is the entire colour vocabulary of the component** — and none of it is violet. That is the evidence behind the note above. Each frame is its own WebGL context, so keep this story closed when you are not reading it." } },
  },
  render: (args) => (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, padding: 12, background: "#050107" }}>
      {HUES.map((h) => (
        <div key={h}>
          <div style={{ position: "relative", height: 210, overflow: "hidden", borderRadius: "var(--radius-sm, 8px)" }}>
            <Prism {...args} hueShift={h} />
          </div>
          <div style={{ marginTop: 6, fontSize: 12, letterSpacing: "0.08em", color: "var(--text-meta)" }}>
            hueShift {h.toFixed(2)} rad
          </div>
        </div>
      ))}
    </div>
  ),
};

export const BareLayer = {
  name: "Bare layer",
  args: { hueShift: 0, colorFrequency: 1.6, scale: 3.6 },
  parameters: { docs: { description: { story: "The layer on its own, no content over it. Use this one to judge the shader itself; use the landing stories to decide whether it can ship." } } },
  render: (args) => <Bare><Prism {...args} /></Bare>,
};
