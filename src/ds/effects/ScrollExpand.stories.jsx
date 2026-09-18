import React from "react";
import ScrollExpand from "./ScrollExpand.jsx";
import { VOID } from "../../styles/palette.js";

/**
 * ScrollExpand needs real media. Rather than reach for a CDN — the About page
 * already depends on jsDelivr and it makes those stories network-bound — these
 * use an inline SVG data URI in the project palette.
 */
const COVER = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="1000" viewBox="0 0 1600 1000">
  <defs>
    <radialGradient id="g" cx="30%" cy="28%" r="85%">
      <stop offset="0%" stop-color="#a855f7"/>
      <stop offset="45%" stop-color="#5b21b6"/>
      <stop offset="100%" stop-color="#0b0416"/>
    </radialGradient>
  </defs>
  <rect width="1600" height="1000" fill="url(#g)"/>
  <g fill="none" stroke="#ede4ff" stroke-opacity="0.16">
    ${Array.from({ length: 16 }, (_, i) => `<circle cx="480" cy="280" r="${60 + i * 55}"/>`).join("")}
  </g>
</svg>`)}`;

export default {
  title: "Effects/ScrollExpand",
  component: ScrollExpand,
  parameters: {
    layout: "fullscreen",
    docs: {
      story: { inline: false, height: "620px" },
      description: {
        component: [
          "A framed image that opens to full bleed as you scroll, with the title lifting away and overlay content fading in behind it. Vendored verbatim from [React Bits](https://reactbits.dev). No dependencies — plain rAF with an exponential follow.",
          "",
          "**Scroll inside the story frame** to drive it. Progress is clamped 0..1 over `scrollDistance x stage height`, then `holdDistance` keeps it pinned at full bleed before releasing.",
          "",
          "### Palette notes",
          "",
          "There are no colour props. Two values are baked into the CSS and would need editing to match tokens:",
          "",
          "- `.scroll-expand__scrim` is a black gradient. Against our `--void` ground that reads fine, but it is not token-driven.",
          "- `.scroll-expand__title` is hardcoded `#fff` at weight 700 — our display face is `--font-display` at 400, so a title here will not match the rest of the site's typography without an override.",
          "",
          "`useWindowScroll` swaps the internal scroller for the page scroll. These stories use the internal scroller so each one is self-contained; on a real page you almost certainly want `useWindowScroll`.",
        ].join("\n"),
      },
    },
  },
  args: {
    src: COVER,
    alt: "Project cover",
    title: "Medulla AI",
    scrollHint: "Scroll",
    startWidth: 42,
    startHeight: 58,
    startRadius: 24,
    endRadius: 0,
    mediaZoom: 1.35,
    scrollDistance: 1.2,
    holdDistance: 0.35,
    smoothing: 0.1,
    overlayScrim: 0.45,
    useWindowScroll: false,
    enabled: true,
  },
  argTypes: {
    title: { control: "text", table: { category: "Content" } },
    scrollHint: { control: "text", table: { category: "Content" } },
    startWidth: { control: { type: "range", min: 10, max: 100, step: 1 }, description: "Resting frame width, % of stage.", table: { category: "Frame" } },
    startHeight: { control: { type: "range", min: 10, max: 100, step: 1 }, table: { category: "Frame" } },
    startRadius: { control: { type: "range", min: 0, max: 80, step: 1 }, table: { category: "Frame" } },
    endRadius: { control: { type: "range", min: 0, max: 80, step: 1 }, table: { category: "Frame" } },
    mediaZoom: { control: { type: "range", min: 1, max: 2.5, step: 0.05 }, description: "Zoom at rest, easing to 1 when open.", table: { category: "Motion" } },
    scrollDistance: { control: { type: "range", min: 0.2, max: 3, step: 0.1 }, table: { category: "Motion" } },
    holdDistance: { control: { type: "range", min: 0, max: 2, step: 0.05 }, table: { category: "Motion" } },
    smoothing: { control: { type: "range", min: 0, max: 0.5, step: 0.01 }, description: "Follow time in seconds. 0 locks to the scrollbar.", table: { category: "Motion" } },
    overlayScrim: { control: { type: "range", min: 0, max: 1, step: 0.05 }, table: { category: "Frame" } },
    useWindowScroll: { control: "boolean", description: "Drive from page scroll instead of the internal scroller.", table: { category: "Motion" } },
  },
};

export const Default = {
  name: "Scroll to expand",
  parameters: { docs: { description: { story: "Scroll inside the frame. The cover opens to full bleed, the title lifts away, and the hint disappears in the first 12% of travel." } } },
  render: (args) => (
    <div style={{ height: "100vh", background: VOID }}>
      <ScrollExpand {...args} />
    </div>
  ),
};

export const WithOverlay = {
  name: "With overlay content",
  parameters: { docs: { description: { story: "Children fade in over the last third of the expansion. This is where a project's one-line summary would sit." } } },
  render: (args) => (
    <div style={{ height: "100vh", background: VOID }}>
      <ScrollExpand {...args} title="BlockMove">
        <div style={{ fontFamily: "var(--font-display)", fontSize: "var(--text-title)", color: "var(--text-display)", lineHeight: "var(--leading-title)" }}>
          Breakbulk logistics
        </div>
        <p style={{ marginTop: 12, maxWidth: "var(--measure-body)", fontSize: "var(--text-body)", lineHeight: "var(--leading-body)", color: "var(--text-panel-body)" }}>
          Coordination for cargo that does not fit in a container. Built solo, end to end.
        </p>
      </ScrollExpand>
    </div>
  ),
};

export const Snappy = {
  name: "Snappy",
  args: { smoothing: 0, scrollDistance: 0.6, holdDistance: 0.1, mediaZoom: 1.15, startWidth: 60, startHeight: 70 },
  parameters: { docs: { description: { story: "`smoothing: 0` locks the frame to the scrollbar with no easing, over a much shorter travel. Direct rather than cinematic — and the variant that behaves best on a trackpad." } } },
  render: (args) => (
    <div style={{ height: "100vh", background: VOID }}>
      <ScrollExpand {...args} title="Shelvefy" />
    </div>
  ),
};
