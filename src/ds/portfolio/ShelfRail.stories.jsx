import React from "react";
import { ShelfRail } from "./ShelfRail.jsx";
import { PROJECTS } from "../../data/projects.js";
import { ShelfScene } from "../../stories/_shelf.jsx";

export default {
  title: "Portfolio/ShelfRail",
  component: ShelfRail,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: [
          "The ledge the project covers stand on, built from two planes: a 12px front lip using `--rail-face`, and a top surface using `--rail-top` that recedes toward the wall.",
          "",
          "The surface is absolutely positioned rather than stacked in flow, so the rail's layout box stays exactly 12px tall. That matters: `pullUp` is a negative top margin calibrated against the shelf column's `--gap-section`, and the two cancel to -4px so the covers overlap the lip. Give the rail real height in flow and that calibration drifts.",
          "",
          "Because the rail paints above a resting cover, the surface reads as a lip the covers stand behind — which is what gives the lean and the lift something to work against.",
        ].join("\n"),
      },
    },
  },
  args: { pullUp: 66, depth: 26, surfaceTilt: 74, perspective: 900 },
  argTypes: {
    pullUp: {
      control: { type: "range", min: 0, max: 140, step: 2 },
      description: "Negative top margin in px. 66 is the app default.",
      table: { category: "Layout", defaultValue: { summary: "66" } },
    },
    depth: {
      control: { type: "range", min: 0, max: 90, step: 2 },
      description: "How far the shelf runs back toward the wall, in px. 0 drops the surface and leaves the flat bar.",
      table: { category: "Depth" },
    },
    surfaceTilt: {
      control: { type: "range", min: 40, max: 89, step: 1 },
      description: "Angle of the top surface, in degrees. Higher lies flatter, so less of it is visible — the projected band is roughly depth × cos(tilt).",
      table: { category: "Depth" },
    },
    perspective: {
      control: { type: "range", min: 200, max: 3000, step: 50 },
      description: "Depth of the projection on the surface, in px.",
      table: { category: "Depth" },
    },
  },
};

export const Default = {
  parameters: { docs: { description: { story: "The bar in isolation, to look at `--rail-face` and `--shadow-rail` on their own. Width is `--rail-width` — `min(1340px, 96%)`. There is no shelf above it here, so `pullUp` just eats into the wrapper's padding; see **Under covers** for what it actually does." } } },
  render: (args) => (
    <div style={{ padding: "120px var(--gutter-page)" }}>
      <ShelfRail {...args} />
    </div>
  ),
};

export const UnderCovers = {
  name: "Under covers",
  parameters: { docs: { description: { story: "The rail doing its actual job. At the default 66 the covers overlap its top edge by 4px, so they read as standing on it. Drag `pullUp` down and they float above the rail; drag it up and the rail climbs into them." } } },
  render: (args) => <ShelfScene groups={[PROJECTS.slice(0, 4)]} railProps={args} />,
};

export const TwoShelves = {
  name: "Two shelves",
  parameters: { docs: { description: { story: "How the Work page stacks them — four covers, rail, then three covers and a second rail. All four elements are direct children of one flex column, exactly as `Work` renders its two `Shelf` fragments, so `--gap-section` sets both the rail offset and the space between shelves." } } },
  render: (args) => (
    <ShelfScene groups={[PROJECTS.slice(0, 4), PROJECTS.slice(4, 7)]} railProps={args} />
  ),
};
