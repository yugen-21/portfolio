import React from "react";
import { fn } from "storybook/test";
import { IndexRow } from "./IndexRow.jsx";
import { PROJECTS } from "../../data/projects.js";

export default {
  title: "Portfolio/IndexRow",
  component: IndexRow,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "A two-line entry — year over name — used in the index strip along the bottom of the Work page. It opens the same panel as the cover above it, so the page stays usable as a list for anyone who would rather scan text than artwork.",
      },
    },
  },
  args: { year: "2026", name: "MedullaAI", onClick: fn() },
  argTypes: {
    year: { control: "text", table: { category: "Content" } },
    name: { control: "text", table: { category: "Content" } },
    onClick: { action: "clicked", table: { category: "Events" } },
  },
};

export const Playground = {};

export const LongName = {
  name: "Long name",
  args: { year: "2023", name: "University Outpass System" },
  parameters: { docs: { description: { story: "The longest name in the set. The row does not clamp, so a longer one would widen the strip and force an earlier wrap." } } },
};

export const IndexStrip = {
  name: "In context — index strip",
  parameters: {
    layout: "fullscreen",
    docs: { description: { story: "All seven projects as the Work page lays them out: a hairline rule above, then the rows spread across the full width with `justify-content: space-between`." } },
  },
  render: (args) => (
    <div style={{ padding: "60px var(--gutter-page)" }}>
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap",
        padding: "18px 0", columnGap: 32, rowGap: 16,
        borderTop: "1px solid var(--border-hairline)",
      }}>
        {PROJECTS.map((p) => (
          <IndexRow key={p.name} year={p.year} name={p.name} onClick={args.onClick} />
        ))}
      </div>
    </div>
  ),
};
