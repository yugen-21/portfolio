import React from "react";
import { fn } from "storybook/test";
import { Landing } from "./Landing.jsx";
import { Particles } from "../ds/backdrop/Particles.jsx";

export default {
  title: "Pages/Landing",
  component: Landing,
  parameters: {
    layout: "fullscreen",
    docs: {
      story: { inline: false, height: "760px" },
      description: {
        component: [
          "The entry page. Four things stacked in a single centred column: the nav, the name assembled from particles, the rotating role line, a one-paragraph summary, and two calls to action.",
          "",
          "The page owns its own `AuroraLayer` with `LANDING_BLOBS`. It does **not** own the `Particles` field — `App` mounts that above every page — so the default story here is the page as the component actually defines it. The last story adds the particle layer back to show the composed result.",
        ].join("\n"),
      },
    },
  },
  args: { onViewWork: fn(), onViewAbout: fn() },
  argTypes: {
    onViewWork: { action: "view work", description: "Fired by the solid primary button.", table: { category: "Events" } },
    onViewAbout: { action: "view about", description: "Fired by the violet secondary button.", table: { category: "Events" } },
  },
};

export const Default = {};

export const WithParticleField = {
  name: "With particle field (as shipped)",
  parameters: { docs: { description: { story: "The page plus the fixed `Particles` layer that `App` mounts over it — what a visitor actually sees at `/`." } } },
  render: (args) => (
    <>
      <div style={{ position: "fixed", inset: 0, zIndex: 1, pointerEvents: "none" }}>
        <Particles
          particleColors={["#c4a6ff", "#a855f7", "#ede4ff"]}
          particleCount={140}
          particleSpread={14}
          speed={0.06}
          particleBaseSize={60}
          sizeRandomness={1}
          alphaParticles
          moveParticlesOnHover
          particleHoverFactor={0.4}
          pixelRatio={1}
        />
      </div>
      <Landing {...args} />
    </>
  ),
};

export const Narrow = {
  globals: { viewport: { value: "phone" } },
  parameters: {
    docs: { description: { story: "At a phone width the nav wraps and the fluid type drops to its clamp floor. The role line uses `white-space: nowrap`, so it is the first thing to overflow — worth watching here." } },
  },
};
