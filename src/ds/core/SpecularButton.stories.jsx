import React from "react";
import { fn } from "storybook/test";
import { SpecularButton } from "./SpecularButton.jsx";

const VARIANTS = ["solid", "violet", "deep", "outline", "ghost"];

export default {
  title: "Core/SpecularButton",
  component: SpecularButton,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: [
          "The primary call to action. A WebGL2 fragment shader draws a specular highlight that rides the button's rounded-rect edge and steers toward the pointer.",
          "",
          "The shader reads its uniforms from a ref that updates every render, so **every control below is live** — drag `intensity` or `shineSize` and the highlight responds without remounting. `size` and `radius` change layout and re-render normally.",
          "",
          "Requires WebGL2. Without it the button still renders and is fully clickable, just without the highlight.",
        ].join("\n"),
      },
    },
  },
  args: {
    children: "View work",
    variant: "violet",
    size: "lg",
    radius: 999,
    blur: 0,
    shineSize: 10,
    shineFade: 40,
    thickness: 1,
    speed: 0.35,
    followMouse: true,
    proximity: 250,
    autoAnimate: false,
    disabled: false,
    onClick: fn(),
  },
  argTypes: {
    children: { control: "text", description: "Button label", table: { category: "Content" } },
    href: { control: "text", description: "Renders an <a> instead of a <button>. http(s) links open in a new tab.", table: { category: "Content" } },
    title: { control: "text", table: { category: "Content" } },
    type: { control: "inline-radio", options: ["button", "submit", "reset"], table: { category: "Content" } },

    variant: { control: "inline-radio", options: VARIANTS, description: "Preset bundle of tint / text / line / base colours.", table: { category: "Appearance" } },
    size: { control: "inline-radio", options: ["sm", "md", "lg"], table: { category: "Appearance" } },
    radius: { control: { type: "range", min: 0, max: 999, step: 1 }, description: "Corner radius in px. Clamped to half the shortest side by the shader.", table: { category: "Appearance" } },
    blur: { control: { type: "range", min: 0, max: 30, step: 1 }, description: "backdrop-filter blur behind the button face.", table: { category: "Appearance" } },
    disabled: { control: "boolean", table: { category: "Appearance" } },

    tint: { control: "color", description: "Overrides the variant's face colour.", table: { category: "Colour override" } },
    tintOpacity: { control: { type: "range", min: 0, max: 1, step: 0.01 }, table: { category: "Colour override" } },
    textColor: { control: "color", table: { category: "Colour override" } },
    lineColor: { control: "color", description: "Colour of the specular highlight itself.", table: { category: "Colour override" } },
    baseColor: { control: "color", description: "Colour of the dim always-on edge under the highlight.", table: { category: "Colour override" } },

    intensity: { control: { type: "range", min: 0, max: 3, step: 0.05 }, description: "Brightness multiplier on the highlight.", table: { category: "Shader" } },
    shineSize: { control: { type: "range", min: 0, max: 90, step: 1 }, description: "Angular half-width of the lit arc, in degrees.", table: { category: "Shader" } },
    shineFade: { control: { type: "range", min: 0, max: 90, step: 1 }, description: "How softly the arc falls off at its ends, in degrees.", table: { category: "Shader" } },
    thickness: { control: { type: "range", min: 0.1, max: 6, step: 0.1 }, description: "Gaussian width of the highlight line, in device pixels.", table: { category: "Shader" } },

    speed: { control: { type: "range", min: 0, max: 3, step: 0.05 }, description: "Idle rotation rate of the light, in radians per second.", table: { category: "Motion" } },
    followMouse: { control: "boolean", description: "Light steers toward the pointer instead of rotating on its own.", table: { category: "Motion" } },
    proximity: { control: { type: "range", min: 0, max: 800, step: 10 }, description: "Distance in px at which the button starts brightening.", table: { category: "Motion" } },
    autoAnimate: { control: "boolean", description: "Stay lit at full brightness regardless of pointer distance.", table: { category: "Motion" } },

    onClick: { action: "clicked", table: { category: "Events" } },
    style: { control: "object", table: { category: "Escape hatches" } },
    className: { control: "text", table: { category: "Escape hatches" } },
  },
};

export const Playground = {};

export const AllVariants = {
  name: "All variants",
  parameters: { docs: { description: { story: "The five presets at their intended sizes. `solid` is the primary action, `violet` the secondary; `outline` is what project panel links use." } } },
  render: (args) => (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 18, alignItems: "center" }}>
      {VARIANTS.map((v) => (
        <SpecularButton key={v} {...args} variant={v}>{v}</SpecularButton>
      ))}
    </div>
  ),
};

export const Sizes = {
  parameters: { docs: { description: { story: "`sm` is used for links inside a project panel, `lg` for the landing page calls to action." } } },
  render: (args) => (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 18, alignItems: "center" }}>
      {["sm", "md", "lg"].map((s) => (
        <SpecularButton key={s} {...args} size={s}>{s}</SpecularButton>
      ))}
    </div>
  ),
};

export const Radii = {
  parameters: { docs: { description: { story: "The shader clamps radius to half the shortest side, so 999 always yields a true pill." } } },
  render: (args) => (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 18, alignItems: "center" }}>
      {[0, 6, 18, 999].map((r) => (
        <SpecularButton key={r} {...args} radius={r}>radius {r}</SpecularButton>
      ))}
    </div>
  ),
};

export const AlwaysLit = {
  name: "Always lit",
  args: { autoAnimate: true, followMouse: false, speed: 0.8 },
  parameters: { docs: { description: { story: "`autoAnimate` pins brightness at full and `followMouse: false` lets the light rotate on its own at `speed`. Useful for a hero button that should catch the eye before the pointer arrives." } } },
};

export const Disabled = {
  args: { disabled: true },
  parameters: { docs: { description: { story: "Drops opacity to 0.55, removes the press transform, and forces a `<button>` even when `href` is set." } } },
};

export const AsLink = {
  name: "As a link",
  args: { href: "https://medulla-ai-frontend.vercel.app", variant: "outline", size: "sm", children: "View live" },
  parameters: { docs: { description: { story: "With `href` the component renders an anchor. Absolute http(s) URLs get `target=\"_blank\"` and `rel=\"noreferrer\"` automatically." } } },
};

export const OnTheLandingPage = {
  name: "In context — landing page",
  parameters: {
    backgrounds: { value: "void" },
    docs: { description: { story: "The exact pairing used on the landing page: a solid primary next to a violet secondary, both fully rounded." } },
  },
  render: (args) => (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
      <SpecularButton {...args} variant="solid" size="lg" radius={999}>View work</SpecularButton>
      <SpecularButton {...args} variant="violet" size="lg" radius={999}>About me</SpecularButton>
    </div>
  ),
};
