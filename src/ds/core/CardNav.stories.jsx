import React from "react";
import CardNav from "./CardNav.jsx";
import { VOID, INK_700, INK_500, VIOLET_950, VIOLET_800, VIOLET_050 } from "../../styles/palette.js";

const PALETTE_ITEMS = [
  {
    label: "Work",
    bgColor: INK_700,
    textColor: VIOLET_050,
    links: [
      { label: "Medulla AI", ariaLabel: "Medulla AI project" },
      { label: "BlockMove", ariaLabel: "BlockMove project" },
      { label: "Shelvefy", ariaLabel: "Shelvefy project" },
    ],
  },
  {
    label: "About",
    bgColor: VIOLET_950,
    textColor: VIOLET_050,
    links: [
      { label: "Experience", ariaLabel: "Work history" },
      { label: "Education", ariaLabel: "Education" },
      { label: "Stack", ariaLabel: "Tech stack" },
    ],
  },
  {
    label: "Contact",
    bgColor: VIOLET_800,
    textColor: VIOLET_050,
    links: [
      { label: "Email", ariaLabel: "Email Shama", href: "mailto:shamaazath@gmail.com" },
      { label: "LinkedIn", ariaLabel: "LinkedIn", href: "https://www.linkedin.com/in/a-shama-anjum/" },
      { label: "GitHub", ariaLabel: "GitHub", href: "https://github.com/yugen-21" },
    ],
  },
];

const STOCK_ITEMS = [
  { label: "About", bgColor: "#1B1722", textColor: "#fff", links: [{ label: "Company", ariaLabel: "About Company" }, { label: "Careers", ariaLabel: "About Careers" }] },
  { label: "Projects", bgColor: "#2F293A", textColor: "#fff", links: [{ label: "Featured", ariaLabel: "Featured Projects" }, { label: "Case Studies", ariaLabel: "Project Case Studies" }] },
  { label: "Contact", bgColor: "#2F293A", textColor: "#fff", links: [{ label: "Email", ariaLabel: "Email us" }, { label: "Twitter", ariaLabel: "Twitter" }, { label: "LinkedIn", ariaLabel: "LinkedIn" }] },
];

/** .card-nav-container is position:absolute — it needs a positioned ancestor with room below it. */
const Stage = ({ children }) => (
  <div style={{ position: "relative", minHeight: "100vh", background: VOID }}>{children}</div>
);

export default {
  title: "Core/CardNav",
  component: CardNav,
  parameters: {
    layout: "fullscreen",
    docs: {
      story: { inline: false, height: "460px" },
      description: {
        component: [
          "A pill navbar that expands into three colour cards. Uses `gsap` for the height tween and `react-icons` for the link arrow. Vendored verbatim from [React Bits](https://reactbits.dev). **Click the hamburger** to expand.",
          "",
          "**Palette inheritance is clean** — `baseColor`, `menuColor`, `buttonBgColor`, `buttonTextColor` and per-card `bgColor`/`textColor` are all plain colour strings, so the whole component maps onto tokens without touching the source.",
          "",
          "### Before this replaces the current nav",
          "",
          "- **The CTA label is hardcoded** to `Get Started` in the JSX. There is no prop for it, so making it say *Email* or *Resume* means editing the component.",
          "- **It renders exactly three cards.** `items` is `.slice(0, 3)`-ed; a fourth is silently dropped.",
          "- **`logo` is required as an image URL.** It renders `<img src={logo}>` unconditionally, so with no logo you get a broken-image icon. The current site uses a text wordmark, not a mark.",
          "- **The hamburger is a `div` with `role=\"button\"`.** Keyboard handling is wired up (Enter/Space), but it is not a real `<button>`, so it misses native semantics.",
          "",
          "Positioning is `position: absolute; top: 2em`, so it needs a positioned ancestor — not `fixed`, so it scrolls away with the page.",
        ].join("\n"),
      },
    },
  },
  args: {
    logo: "/favicon.svg",
    logoAlt: "Shama Anjum",
    items: PALETTE_ITEMS,
    baseColor: INK_700,
    menuColor: VIOLET_050,
    buttonBgColor: VIOLET_050,
    buttonTextColor: INK_500,
    ease: "power3.out",
  },
  argTypes: {
    baseColor: { control: "color", description: "Pill background.", table: { category: "Colour" } },
    menuColor: { control: "color", description: "Hamburger line colour.", table: { category: "Colour" } },
    buttonBgColor: { control: "color", table: { category: "Colour" } },
    buttonTextColor: { control: "color", table: { category: "Colour" } },
    ease: { control: "text", description: "GSAP ease for the expand tween.", table: { category: "Motion" } },
    items: { control: false, description: "Max 3 — extras are dropped." },
    logo: { control: "text", description: "Image URL. Required; renders an <img> unconditionally." },
  },
};

export const Violet = {
  name: "Violet (palette)",
  parameters: { docs: { description: { story: "Dark pill on `--ink-700` with a light `--violet-050` CTA, matching the existing GitHub button on the site. Cards step down the violet ramp. Click the hamburger to expand." } } },
  render: (args) => <Stage><CardNav {...args} /></Stage>,
};

export const VendoredDefault = {
  name: "Vendored default",
  args: { items: STOCK_ITEMS, baseColor: "#fff", menuColor: "#000", buttonBgColor: "#111", buttonTextColor: "#fff" },
  parameters: { docs: { description: { story: "As React Bits ships it — white pill, black CTA, grey-brown cards. Included to show how far the palette pass moves it." } } },
  render: (args) => <Stage><CardNav {...args} /></Stage>,
};

export const LightPill = {
  name: "Light pill",
  args: { baseColor: VIOLET_050, menuColor: INK_500, buttonBgColor: VIOLET_800, buttonTextColor: VIOLET_050 },
  parameters: { docs: { description: { story: "Inverted: a light pill on the dark page, echoing the primary `SpecularButton` face. Higher contrast against the backdrop, but it competes with the hero for attention." } } },
  render: (args) => <Stage><CardNav {...args} /></Stage>,
};
