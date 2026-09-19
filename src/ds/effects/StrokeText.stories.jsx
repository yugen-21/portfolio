import React from "react";
import StrokeText from "./StrokeText.jsx";
import { VOID, VIOLET_400, LILAC_300, VIOLET_600 } from "../../styles/palette.js";

const Stage = ({ children }) => (
  <div style={{ background: VOID, padding: "8vh var(--gutter-page)", minHeight: "50vh", display: "flex", alignItems: "center" }}>
    <div style={{ width: "100%" }}>{children}</div>
  </div>
);

export default {
  title: "Effects/StrokeText",
  component: StrokeText,
  parameters: {
    layout: "fullscreen",
    docs: {
      story: { inline: false, height: "360px" },
      description: {
        component: [
          "SVG wordmark that draws its outline on, then floods with fill. Uses `gsap` + `ScrollTrigger`, vendored verbatim from [React Bits](https://reactbits.dev).",
          "",
          "**Palette inheritance is clean** — `strokeColor` and `fillColor` are plain colour strings, so token hex drops straight in. The stock `#A78BFA` is already close to `--lilac-400`; these stories use `--violet-400` and `--white-warm` equivalents from the token mirror.",
          "",
          "**How the draw works.** It measures the rendered text with `getBBox()` to build a viewBox, then animates `stroke-dashoffset` per `tspan`. Two consequences worth knowing:",
          "",
          "- It re-measures on `document.fonts.ready`, so with a webfont the first paint can shift slightly.",
          "- `dash` is `max(fontSize * 7, 200)`. For very wide glyphs at small sizes the dash may be shorter than the path, and the outline will appear already drawn.",
          "",
          "It honours `prefers-reduced-motion` by jumping straight to the finished state, and sets `role=\"img\"` with the text as `aria-label`, so the animation is not exposed to screen readers as loose characters.",
        ].join("\n"),
      },
    },
  },
  args: {
    text: "Medulla AI",
    strokeColor: VIOLET_400,
    fillColor: "#faf6ff",
    strokeWidth: 1.4,
    drawDuration: 1.6,
    fillDelay: 0.2,
    stagger: 0.05,
    ease: "power2.out",
    trigger: "mount",
    fillMode: "wipe",
    fontSize: 96,
    fontWeight: 800,
    letterSpacing: -4,
    reverse: false,
  },
  argTypes: {
    text: { control: "text" },
    strokeColor: { control: "color", table: { category: "Colour" } },
    fillColor: { control: "color", table: { category: "Colour" } },
    trigger: { control: "inline-radio", options: ["mount", "hover", "scroll", "loop"], description: "When the draw starts.", table: { category: "Motion" } },
    fillMode: { control: "inline-radio", options: ["fade", "wipe", "none"], table: { category: "Motion" } },
    drawDuration: { control: { type: "range", min: 0.2, max: 5, step: 0.1 }, table: { category: "Motion" } },
    fillDelay: { control: { type: "range", min: 0, max: 2, step: 0.05 }, table: { category: "Motion" } },
    stagger: { control: { type: "range", min: 0, max: 0.4, step: 0.01 }, table: { category: "Motion" } },
    reverse: { control: "boolean", description: "Stagger from the last character back.", table: { category: "Motion" } },
    strokeWidth: { control: { type: "range", min: 0.2, max: 6, step: 0.1 }, table: { category: "Appearance" } },
    fontSize: { control: { type: "range", min: 24, max: 240, step: 4 }, table: { category: "Appearance" } },
    fontWeight: { control: { type: "range", min: 100, max: 900, step: 100 }, table: { category: "Appearance" } },
    letterSpacing: { control: { type: "range", min: -20, max: 20, step: 1 }, table: { category: "Appearance" } },
  },
};

export const Violet = {
  name: "Violet (palette)",
  parameters: { docs: { description: { story: "`--violet-400` outline flooding to `--white-warm`. Reload the story to replay the draw." } } },
  render: (args) => <Stage><StrokeText {...args} /></Stage>,
};

export const ProjectTitles = {
  name: "Project titles",
  args: { fontSize: 72, fillMode: "wipe", drawDuration: 1.2, stagger: 0.04 },
  parameters: { docs: { description: { story: "At panel scale, which is the use you flagged — a project name drawing itself in as the modal opens. Three of the seven titles, stacked to check how varying lengths behave." } } },
  render: (args) => (
    <Stage>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <StrokeText {...args} text="Medulla AI" />
        <StrokeText {...args} text="BlockMove" strokeColor={LILAC_300} />
        <StrokeText {...args} text="University Outpass System" fontSize={48} strokeColor={VIOLET_600} />
      </div>
    </Stage>
  ),
};

export const OutlineOnly = {
  name: "Outline only",
  args: { fillMode: "none", strokeColor: LILAC_300, strokeWidth: 1.1 },
  parameters: { docs: { description: { story: "`fillMode: none` leaves the wordmark as a hairline outline. Much quieter, and it does not compete with a filled headline next to it." } } },
  render: (args) => <Stage><StrokeText {...args} /></Stage>,
};

export const OnHover = {
  name: "Redraw on hover",
  args: { trigger: "hover" },
  parameters: { docs: { description: { story: "Starts finished and redraws on `pointerenter`. Note it rebuilds the timeline on every enter, so a fast in-out-in restarts cleanly rather than queueing." } } },
  render: (args) => <Stage><StrokeText {...args} text="Hover me" /></Stage>,
};
