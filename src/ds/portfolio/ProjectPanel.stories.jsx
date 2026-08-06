import React from "react";
import { fn } from "storybook/test";
import { ProjectPanel } from "./ProjectPanel.jsx";
import { PROJECTS } from "../../data/projects.js";

export default {
  title: "Portfolio/ProjectPanel",
  component: ProjectPanel,
  parameters: {
    layout: "fullscreen",
    docs: {
      story: { inline: false, height: "760px" },
      description: {
        component: [
          "The full-screen project detail overlay. Fixed at `z-index: 50` over a blurred backdrop; clicking anywhere outside `[data-panel]` closes it, and `App` also binds Escape.",
          "",
          "Structure is fixed: year, name and role at the top with a close button, then optional links, then four labelled sections — the problem (set off by a left rule), what it does, highlights, and the stack grouped by `StackGroups`.",
          "",
          "Returns `null` when `project` is missing, so the caller can render it unconditionally.",
        ].join("\n"),
      },
    },
  },
  args: { project: PROJECTS[5], onClose: fn() },
  argTypes: {
    project: {
      control: "object",
      description: "A PROJECTS entry: { year, name, role, problem, blurb, bullets, stack, links }.",
      table: { category: "Content" },
    },
    onClose: { action: "closed", description: "Fired by the close button and by a click on the backdrop.", table: { category: "Events" } },
  },
};

export const Playground = {};

export const Medulla = {
  name: "MedullaAI — longest content",
  args: { project: PROJECTS[5] },
  parameters: { docs: { description: { story: "The heaviest panel on the site: six stack entries across four layer groups, a live link, and the longest problem statement. Use it to check the panel's scroll behaviour." } } },
};

export const Medibase = {
  name: "Medibase — long problem",
  args: { project: PROJECTS[2] },
  parameters: { docs: { description: { story: "A four-sentence problem statement against the left rule — the case where that quote treatment earns its keep." } } },
};

export const NoLinks = {
  name: "Without links",
  args: { project: PROJECTS[4] },
  parameters: { docs: { description: { story: "Shelvefy has no public link, so the entire button row is skipped and “The problem” moves up. Two of the seven projects are in this state." } } },
};

export const MultipleLinks = {
  name: "With multiple links",
  args: {
    project: {
      ...PROJECTS[0],
      links: [
        { label: "GitHub", href: "https://github.com/yugen-21/Out-pass-system-student-dashboard" },
        { label: "View live", href: "https://example.com", variant: "solid" },
        { label: "Case study", href: "https://example.com", variant: "deep" },
      ],
    },
  },
  parameters: { docs: { description: { story: "Links wrap onto a second line and each accepts its own `variant`. No project currently ships more than one, so this is the untested path — worth a look before adding a second." } } },
};

export const Empty = {
  name: "No project (renders nothing)",
  args: { project: null },
  parameters: { docs: { description: { story: "With a null project the component returns `null`, which is why `Work` can render `{selected != null && <ProjectPanel …/>}` without a second guard. This story is intentionally blank." } } },
};

export const EveryProject = {
  name: "Every project",
  parameters: {
    docs: { description: { story: "All seven panels stacked as static blocks — the overlay positioning is dropped here so they can be compared in one scroll. Section rhythm should stay identical no matter how uneven the content is." } },
  },
  render: (args) => (
    <div style={{ background: "var(--void)" }}>
      {PROJECTS.map((p) => (
        <div key={p.name} style={{ position: "relative", height: 780, overflow: "hidden", borderBottom: "1px solid var(--border-hairline)" }}>
          <div style={{ position: "absolute", inset: 0, transform: "scale(1)" }}>
            <ProjectPanel {...args} project={p} />
          </div>
        </div>
      ))}
    </div>
  ),
};
