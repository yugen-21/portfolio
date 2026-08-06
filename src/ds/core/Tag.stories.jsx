import React from "react";
import { Tag } from "./Tag.jsx";
import { PROJECTS } from "../../data/projects.js";

export default {
  title: "Core/Tag",
  component: Tag,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "A non-wrapping chip for a single technology. Fixed styling by design — there are no variants, so a stack list always reads as one uniform row. Note that the project panel currently groups its stack with `StackGroups` rather than rendering Tags; this component is available for flatter layouts.",
      },
    },
  },
  args: { children: "PostgreSQL" },
  argTypes: {
    children: { control: "text", table: { category: "Content" } },
  },
};

export const Playground = {};

export const AStack = {
  name: "A project stack",
  parameters: { docs: { description: { story: "MedullaAI's stack rendered as chips. `white-space: nowrap` means a long name pushes the row rather than breaking mid-word." } } },
  render: () => (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 10, maxWidth: 520 }}>
      {PROJECTS[5].stack.map((s) => <Tag key={s}>{s}</Tag>)}
    </div>
  ),
};

export const EveryTechnology = {
  name: "Every technology on the site",
  parameters: { docs: { description: { story: "The union of every stack entry across all seven projects — useful for spotting a name that wraps badly or sits oddly against its neighbours." } } },
  render: () => {
    const all = Array.from(new Set(PROJECTS.reduce((acc, p) => acc.concat(p.stack), []))).sort();
    return (
      <div style={{ display: "flex", flexWrap: "wrap", gap: 10, maxWidth: 620 }}>
        {all.map((s) => <Tag key={s}>{s}</Tag>)}
      </div>
    );
  },
};
