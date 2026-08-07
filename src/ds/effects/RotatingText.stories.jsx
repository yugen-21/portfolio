import React from "react";
import { fn } from "storybook/test";
import { RotatingText } from "./RotatingText.jsx";
import { ROLES } from "../../data/projects.js";

export default {
  title: "Effects/RotatingText",
  component: RotatingText,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: [
          "Swaps one phrase for the next, animating each character on its own delay. The wrapper measures every phrase against a hidden ghost element and animates its own width, so the text that follows it slides rather than jumping.",
          "",
          "Honours `prefers-reduced-motion`: with it set, characters appear instantly and the width transition is dropped.",
        ].join("\n"),
      },
    },
  },
  args: {
    texts: ROLES,
    rotationInterval: 2400,
    duration: 520,
    easing: "cubic-bezier(0.16, 1, 0.3, 1)",
    staggerDuration: 0.025,
    staggerFrom: "last",
    loop: true,
    auto: true,
    splitBy: "characters",
    animateWidth: true,
    onNext: fn(),
  },
  argTypes: {
    texts: { control: "object", description: "The phrases to cycle through.", table: { category: "Content" } },
    splitBy: {
      control: "inline-radio",
      options: ["characters", "words"],
      description: "Animation granularity. Any other string is used as a literal separator.",
      table: { category: "Content" },
    },

    rotationInterval: { control: { type: "range", min: 400, max: 8000, step: 100 }, description: "How long a phrase rests before it starts leaving, in ms.", table: { category: "Timing" } },
    duration: { control: { type: "range", min: 80, max: 2000, step: 20 }, description: "Per-character animation length, in ms.", table: { category: "Timing" } },
    staggerDuration: { control: { type: "range", min: 0, max: 0.2, step: 0.005 }, description: "Delay added per character, in seconds.", table: { category: "Timing" } },
    staggerFrom: {
      control: "inline-radio",
      options: ["first", "last", "center", "random"],
      description: "Which character leads the wave. A number is also accepted as an index.",
      table: { category: "Timing" },
    },
    easing: { control: "text", table: { category: "Timing" } },

    auto: { control: "boolean", description: "Rotate on a timer. Off, it holds on the first phrase.", table: { category: "Behaviour" } },
    loop: { control: "boolean", description: "Wrap around at the end of the list.", table: { category: "Behaviour" } },
    animateWidth: { control: "boolean", description: "Transition the wrapper width between phrases.", table: { category: "Behaviour" } },
    onNext: { action: "next", description: "Called with the new index after each swap.", table: { category: "Events" } },

    charStyle: { control: "object", description: "Merged into every character span.", table: { category: "Escape hatches" } },
    style: { control: "object", table: { category: "Escape hatches" } },
  },
  decorators: [
    (Story) => (
      <div style={{ fontSize: "var(--text-lead)", lineHeight: "var(--leading-snug)", letterSpacing: "var(--track-snug)", color: "var(--text-primary)", minWidth: 420 }}>
        <Story />
      </div>
    ),
  ],
};

export const Playground = {
  args: { charStyle: { color: "var(--text-accent)" } },
};

export const LandingHeadline = {
  name: "In context — landing headline",
  args: { charStyle: { color: "var(--text-accent)" } },
  parameters: { docs: { description: { story: "The exact composition from the landing page: the rotating role in lilac, then a static “Engineer” that gets pushed along as the width animates." } } },
  render: (args) => (
    <div style={{ display: "flex", alignItems: "baseline", whiteSpace: "nowrap" }}>
      <RotatingText {...args} />
      <span style={{ display: "inline-block", paddingLeft: "0.3em", color: "var(--text-primary)" }}>Engineer</span>
    </div>
  ),
};

export const StaggerDirections = {
  name: "Stagger directions",
  parameters: { docs: { description: { story: "The same phrases at each `staggerFrom`. Slowed to 900ms with a heavier stagger so the wave direction is obvious." } } },
  render: (args) => (
    <div style={{ display: "grid", gap: 26 }}>
      {["first", "last", "center", "random"].map((from) => (
        <div key={from} style={{ display: "flex", alignItems: "baseline", gap: 18 }}>
          <span style={{ fontSize: "var(--text-meta)", color: "var(--text-muted)", width: 66, flex: "none", textTransform: "uppercase", letterSpacing: "var(--track-caps)" }}>{from}</span>
          <RotatingText {...args} staggerFrom={from} duration={900} staggerDuration={0.05} charStyle={{ color: "var(--text-accent)" }} />
        </div>
      ))}
    </div>
  ),
};

export const SplitByWords = {
  name: "Split by words",
  args: {
    texts: ["Product First Engineer", "Founding Engineer", "AI First Engineer"],
    splitBy: "words",
    staggerDuration: 0.08,
    charStyle: { color: "var(--text-accent)" },
  },
  parameters: { docs: { description: { story: "Whole words move as units instead of individual characters — calmer, and better for longer phrases." } } },
};

export const Paused = {
  args: { auto: false },
  parameters: { docs: { description: { story: "With `auto: false` the component holds the first phrase. Useful for visual regression shots, or for driving the index yourself." } } },
};

export const NoWidthAnimation = {
  name: "Without width animation",
  args: { animateWidth: false, charStyle: { color: "var(--text-accent)" } },
  parameters: { docs: { description: { story: "Anything after the component snaps to the new width instead of sliding. Compare against the landing headline story." } } },
  render: (args) => (
    <div style={{ display: "flex", alignItems: "baseline", whiteSpace: "nowrap" }}>
      <RotatingText {...args} />
      <span style={{ display: "inline-block", paddingLeft: "0.3em", color: "var(--text-primary)" }}>Engineer</span>
    </div>
  ),
};
