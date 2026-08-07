import React from "react";
import { StackGroups } from "./StackGroups.jsx";
import { PROJECTS } from "../../data/projects.js";

export default {
  title: "Portfolio/StackGroups",
  component: StackGroups,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: [
          "Sorts a flat list of technologies into labelled layers — Frontend, Backend, Data, AI, Infra — and drops any layer nothing landed in. Anything it does not recognise is collected into a trailing “Other” row rather than being silently dropped.",
          "",
          "Order comes from the `layers` table, not from the input array, so every project panel lists its stack in the same sequence. Returns `null` when there is nothing to show.",
        ].join("\n"),
      },
    },
  },
  args: { stack: PROJECTS[5].stack },
  argTypes: {
    stack: { control: "object", description: "Flat array of technology names.", table: { category: "Content" } },
    layers: {
      control: "object",
      description: "[label, members[]] pairs. Defaults to the site's five layers.",
      table: { category: "Content" },
    },
    style: { control: "object", table: { category: "Escape hatches" } },
  },
  decorators: [(Story) => <div style={{ minWidth: 520, fontFamily: "var(--font-sans)" }}><Story /></div>],
};

export const Playground = {};

export const AllLayers = {
  name: "All five layers",
  args: { stack: ["React JS", "Tailwind CSS", "Storybook", "Node.js", "Express", "Python FastAPI", "PostgreSQL", "MongoDB", "Claude", "Azure Cloud"] },
  parameters: { docs: { description: { story: "Every layer populated at once. No real project uses this many — it exists to check the label column stays aligned as rows are added." } } },
};

export const SingleLayer = {
  name: "Frontend only",
  args: { stack: ["React JS", "CSS", "styled-components"] },
  parameters: { docs: { description: { story: "Empty layers are filtered out entirely, so a frontend-only project shows one row rather than four empty ones." } } },
};

export const WithUnknown = {
  name: "With unrecognised entries",
  args: { stack: ["React JS", "PostgreSQL", "Rust", "Kubernetes", "Redis"] },
  parameters: { docs: { description: { story: "Names absent from the layer table are gathered into “Other” at the end. Seeing something there is the signal to add it to the `LAYERS` table in `StackGroups.jsx`." } } },
};

export const CustomLayers = {
  name: "Custom layer table",
  args: {
    stack: ["React JS", "Figma", "Storybook", "PostgreSQL"],
    layers: [
      ["Design", ["Figma", "Storybook"]],
      ["Build", ["React JS"]],
    ],
  },
  parameters: { docs: { description: { story: "The `layers` prop replaces the default table wholesale — the same component can group by any taxonomy. PostgreSQL is unmatched here, so it falls to “Other”." } } },
};

export const Empty = {
  args: { stack: [] },
  parameters: { docs: { description: { story: "An empty stack renders `null`. Intentionally blank." } } },
};

export const EveryProjectStack = {
  name: "Every project's stack",
  parameters: { docs: { description: { story: "All seven stacks in one view. The label column is a fixed 76px, so rows line up across projects — that consistency is the point of grouping at all." } } },
  render: (args) => (
    <div style={{ display: "grid", gap: 34, minWidth: 560 }}>
      {PROJECTS.map((p) => (
        <div key={p.name}>
          <div style={{ fontSize: "var(--text-eyebrow)", letterSpacing: "var(--track-eyebrow)", textTransform: "uppercase", color: "var(--text-eyebrow)" }}>
            {p.year} — {p.name}
          </div>
          <StackGroups {...args} stack={p.stack} />
        </div>
      ))}
    </div>
  ),
};
