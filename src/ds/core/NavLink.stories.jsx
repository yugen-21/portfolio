import React from "react";
import { NavLink } from "./NavLink.jsx";

export default {
  title: "Core/NavLink",
  component: NavLink,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "The header navigation link. Two emphases: `quiet` is a transparent pill that tints on hover, `strong` is a light filled pill used once per header for the primary destination. Hover state is React state, not CSS `:hover`, so it is inspectable in the DOM.",
      },
    },
  },
  args: { children: "LinkedIn", href: "#", emphasis: "quiet", external: false },
  argTypes: {
    children: { control: "text", table: { category: "Content" } },
    href: { control: "text", table: { category: "Content" } },
    emphasis: {
      control: "inline-radio",
      options: ["quiet", "strong"],
      description: "`strong` gets the filled light pill treatment.",
      table: { category: "Appearance", defaultValue: { summary: "quiet" } },
    },
    external: {
      control: "boolean",
      description: "Adds target=\"_blank\" and rel=\"noreferrer\".",
      table: { category: "Behaviour" },
    },
  },
};

export const Playground = {};

export const Quiet = {
  args: { emphasis: "quiet", children: "Email" },
  parameters: { docs: { description: { story: "Transparent until hover, then a violet tint at 14% and the text goes pure white." } } },
};

export const Strong = {
  args: { emphasis: "strong", children: "GitHub", external: true },
  parameters: { docs: { description: { story: "A near-white filled pill. Used once per header — for GitHub on every page of the site." } } },
};

export const HeaderNav = {
  name: "In context — header nav",
  parameters: { docs: { description: { story: "The full navigation cluster as it appears on all three pages: two quiet links then one strong." } } },
  render: () => (
    <nav style={{ display: "flex", alignItems: "center", gap: "var(--gap-nav)" }}>
      <NavLink href="mailto:shamaazath@gmail.com">Email</NavLink>
      <NavLink href="https://www.linkedin.com/in/a-shama-anjum/" external>LinkedIn</NavLink>
      <NavLink href="https://github.com/yugen-21" external emphasis="strong">GitHub</NavLink>
    </nav>
  ),
};
