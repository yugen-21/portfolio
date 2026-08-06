import React from "react";
// Pulls in Tailwind, the four token files, and the @keyframes (drift/sway/rise)
// that the backdrop and panel components animate against.
import "../src/index.css";

/**
 * Explicit viewport set. The site has no media queries — every breakpoint is a
 * clamp() — so these widths exist to exercise the fluid tokens, not to match
 * device bezels.
 */
const VIEWPORTS = {
  phone: { name: "Phone — 390", styles: { width: "390px", height: "844px" }, type: "mobile" },
  phablet: { name: "Phablet — 540", styles: { width: "540px", height: "900px" }, type: "mobile" },
  tablet: { name: "Tablet — 834", styles: { width: "834px", height: "1112px" }, type: "tablet" },
  laptop: { name: "Laptop — 1280", styles: { width: "1280px", height: "800px" }, type: "desktop" },
  desktop: { name: "Desktop — 1440", styles: { width: "1440px", height: "900px" }, type: "desktop" },
  wide: { name: "Wide — 1920", styles: { width: "1920px", height: "1080px" }, type: "desktop" },
};

/** Page grounds available from the toolbar. Values mirror tokens/colors.css. */
const BACKGROUNDS = {
  void: { name: "Void (page)", value: "#050107" },
  ink800: { name: "Ink 800", value: "#0b0416" },
  ink500: { name: "Ink 500", value: "#1a0630" },
  violet900: { name: "Violet 900", value: "#3b0f7a" },
  light: { name: "Light (on-light surfaces)", value: "#f7f1ff" },
};

/**
 * Fullscreen stories render bare — backdrops and pages position themselves
 * `fixed` and supply their own ground. Everything else gets a padded stage so
 * centred components are not flush against the iframe edge.
 */
const Stage = (Story, context) => {
  const fullscreen = context.parameters.layout === "fullscreen";
  if (fullscreen) return <Story />;
  return (
    <div
      style={{
        fontFamily: "var(--font-sans)",
        color: "var(--text-primary)",
        padding: 32,
      }}
    >
      <Story />
    </div>
  );
};

/** @type { import('@storybook/react-vite').Preview } */
const preview = {
  decorators: [Stage],
  parameters: {
    layout: "centered",
    controls: {
      matchers: {
        color: /(background|colou?r)$/i,
        date: /Date$/i,
      },
      expanded: true,
    },
    backgrounds: { options: BACKGROUNDS },
    viewport: { options: VIEWPORTS },
    a11y: {
      // The site is a dark, decorative canvas — surface violations as warnings
      // in the panel rather than failing the story.
      test: "todo",
    },
    docs: {
      codePanel: true,
    },
  },
  initialGlobals: {
    backgrounds: { value: "void" },
  },
  tags: ["autodocs"],
};

export default preview;
