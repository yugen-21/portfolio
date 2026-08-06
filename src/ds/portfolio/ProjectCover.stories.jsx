import React from "react";
import { fn } from "storybook/test";
import { ProjectCover } from "./ProjectCover.jsx";
import { PROJECTS } from "../../data/projects.js";
import { COVER_ART } from "../../data/coverArt.jsx";
import { ShelfScene } from "../../stories/_shelf.jsx";

const P = PROJECTS[0];

/** Props that shape the motion and the action pills, for the shelf scenes. */
const motionArgs = (a) => ({
  actions: a.actions,
  liftSplit: a.liftSplit,
  depthPop: a.depthPop,
  liftedDepthPop: a.liftedDepthPop,
  tilt: a.tilt,
  restTiltX: a.restTiltX,
  restTiltY: a.restTiltY,
  lift: a.lift,
  liftedLift: a.liftedLift,
  hoverScale: a.hoverScale,
  liftedScale: a.liftedScale,
  perspective: a.perspective,
  pivot: a.pivot,
  tiltDuration: a.tiltDuration,
  liftDuration: a.liftDuration,
  overlap: a.overlap,
});

export default {
  title: "Portfolio/ProjectCover",
  component: ProjectCover,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: [
          "A square project cover, styled as a record sleeve: hard corners and a heavy layered shadow.",
          "",
          "**The hover is a two-part move, not one.** At rest the cover stands square but leans back against the wall. Hovering picks it up the way a hand would.",
          "",
          "Move one is Z **and** Y together: the cover comes off the wall toward you, stands upright, and is already on its way up — `liftSplit` decides how much of the rise belongs to this move. Move two is pure Y, straight up the rest of the way. Splitting the rise across both is what stops it popping out of the shelf as one jerk. Setting it down mirrors it: down to the hand-off height, then back to the wall.",
          "",
          "Interrupting works from anywhere. Leave mid-lift and it reverses from exactly where it got to; leave before it has left the shelf and it skips straight to leaning back rather than waiting out a move it never made.",
          "",
          "The transform is driven by an anime.js timeline; the two moves overlap by `overlap` so they read as one gesture rather than two beats. Only the shadow crossfades in CSS.",
          "",
          "`perspective` sits on a wrapper element rather than on the shelf, so each cover carries its own depth and the component works anywhere. `lifted` is the deeper pulled-out state the Work page holds for 300ms after a click, before the panel opens.",
          "",
          "Honours `prefers-reduced-motion` by jumping straight to the end state.",
        ].join("\n"),
      },
    },
  },
  args: {
    year: P.year,
    caption: P.caption,
    background: P.bg,
    lifted: false,
    actions: [{ label: "Open" }, { label: "Details" }],
    tilt: true,
    restTiltX: 14,
    restTiltY: 0,
    lift: 14,
    liftedLift: 24,
    liftSplit: 0.4,
    depthPop: 30,
    liftedDepthPop: 48,
    hoverScale: 1,
    liftedScale: 1.02,
    perspective: 1000,
    pivot: "bottom center",
    tiltDuration: 420,
    liftDuration: 560,
    overlap: 0.4,
    onClick: fn(),
  },
  argTypes: {
    year: { control: "text", description: "Top-left label.", table: { category: "Content" } },
    caption: { control: "text", description: "Bottom label.", table: { category: "Content" } },
    children: { control: false, description: "Cover art, absolutely positioned behind the labels.", table: { category: "Content" } },

    background: { control: "text", description: "Any CSS background — the projects use both flat colours and gradients.", table: { category: "Appearance" } },
    captionColor: { control: "color", description: "Overrides both labels. Needed on light covers such as Medibase.", table: { category: "Appearance" } },
    lifted: { control: "boolean", description: "Pulled-out state — a deeper lift than hover, held for 300ms before the panel opens.", table: { category: "State" } },
    actions: {
      control: "object",
      description: "Pills revealed on the scrim, as `[{ label, onClick }]`. Each stops propagation and falls back to the cover's own `onClick`. Pass `[]` to drop them.",
      table: { category: "Content" },
    },

    tilt: { control: "boolean", description: "Off, the cover rests flat and the hover is a plain vertical lift.", table: { category: "Rest pose" } },
    restTiltX: { control: { type: "range", min: -20, max: 20, step: 0.5 }, description: "Lean back, in degrees. Positive tips the top away from you, as if propped against a wall.", table: { category: "Rest pose" } },
    restTiltY: { control: { type: "range", min: -30, max: 30, step: 0.5 }, description: "Sideways skew, in degrees. Kept at 0 so covers rest square left-to-right; anything else turns them into leaning trapezoids.", table: { category: "Rest pose" } },
    perspective: { control: { type: "range", min: 300, max: 4000, step: 50 }, description: "Depth of the projection, in px. Lower is a stronger, more theatrical 3D.", table: { category: "Rest pose" } },
    pivot: {
      control: "inline-radio",
      options: ["bottom center", "bottom left", "bottom right", "center"],
      description: "transform-origin. Bottom edges pivot on the shelf; the left and right options read like turning on a book's spine.",
      table: { category: "Rest pose" },
    },

    lift: { control: { type: "range", min: 0, max: 90, step: 1 }, description: "Total hover rise, in px.", table: { category: "Motion" } },
    liftedLift: { control: { type: "range", min: 0, max: 120, step: 1 }, description: "Total rise for the pulled-out `lifted` state, in px.", table: { category: "Motion" } },
    liftSplit: { control: { type: "range", min: 0, max: 1, step: 0.05 }, description: "Share of the rise that happens during move one, while the cover is still coming off the wall. At 0 the cover leaves the wall flat and then jumps, which is what reads as popping out of the shelf.", table: { category: "Motion" } },
    depthPop: { control: { type: "range", min: 0, max: 120, step: 2 }, description: "How far the cover travels toward you on the Z axis as it leaves the wall, in px. Perspective does the growing, which is why `hoverScale` sits at 1.", table: { category: "Motion" } },
    liftedDepthPop: { control: { type: "range", min: 0, max: 160, step: 2 }, description: "Z travel for the pulled-out `lifted` state, in px.", table: { category: "Motion" } },
    hoverScale: { control: { type: "range", min: 1, max: 1.3, step: 0.01 }, table: { category: "Motion" } },
    liftedScale: { control: { type: "range", min: 1, max: 1.4, step: 0.01 }, table: { category: "Motion" } },
    tiltDuration: { control: { type: "range", min: 60, max: 1200, step: 10 }, description: "Length of move one — off the wall and square to you, in ms.", table: { category: "Motion" } },
    liftDuration: { control: { type: "range", min: 60, max: 1200, step: 10 }, description: "Length of move two — the rise, in ms.", table: { category: "Motion" } },
    overlap: { control: { type: "range", min: 0, max: 1, step: 0.05 }, description: "How far into the pivot the rise begins. At 0 the two moves are strictly sequential; at 1 they run together and the gesture collapses into a plain lift.", table: { category: "Motion" } },

    onClick: { action: "clicked", table: { category: "Events" } },
  },
  // Isolated stories need room for the lift and the tilt so neither is clipped;
  // the fullscreen in-context stories supply their own page padding.
  decorators: [
    (Story, ctx) =>
      ctx.parameters.layout === "fullscreen"
        ? <Story />
        : <div style={{ padding: "90px 70px" }}><Story /></div>,
  ],
};

export const Playground = {
  parameters: { docs: { description: { story: "Hover the cover to run the pickup. Every value in **Rest pose** and **Motion** is live — the most useful ones to feel out are `restTiltY`, which sets how much horizontal turn there is to undo, and `overlap`, which decides whether the two moves read as one gesture or two." } } },
  render: (args) => <ProjectCover {...args}>{COVER_ART[P.art]}</ProjectCover>,
};

export const ArtMotion = {
  name: "Art motion — all seven",
  parameters: {
    layout: "fullscreen",
    docs: { description: { story: "Each cover's artwork has its own motion, picked to say something about the project rather than one shared effect reskinned seven times. Hover across the row: the outpass form scrolls and its rule draws, Votechain's ledger grid drifts while CHAIN opens out, Medibase resolves out of a blur, Adloom's horizon sweeps and its light spills, Shelvefy's three rails slot in from alternating sides, Medulla's rings push outward, and BlockMove's cargo shifts. Every resting value matches the authored artwork, so a cover at rest is unchanged." } },
  },
  render: (args) => (
    <div style={{ padding: "110px var(--gutter-page)", display: "flex", flexWrap: "wrap", gap: "var(--gap-shelf)", alignItems: "flex-end", justifyContent: "center" }}>
      {PROJECTS.map((p) => (
        <ProjectCover
          key={p.name}
          {...motionArgs(args)}
          year={p.year}
          caption={p.caption}
          background={p.bg}
          captionColor={p.light ? "#5b3a92" : undefined}
          onClick={args.onClick}
        >
          {COVER_ART[p.art]}
        </ProjectCover>
      ))}
    </div>
  ),
};

export const NoActions = {
  name: "Without action pills",
  args: { actions: [] },
  parameters: { docs: { description: { story: "`actions: []` leaves the scrim bare, so the artwork motion is the whole of the hover. Useful for judging the art animation on its own." } } },
  render: (args) => <ProjectCover {...args}>{COVER_ART[P.art]}</ProjectCover>,
};

export const Slow = {
  name: "Slowed down",
  args: { tiltDuration: 900, liftDuration: 1100, overlap: 0.25 },
  parameters: { docs: { description: { story: "The same motion at roughly a third speed with the two moves pulled apart. Hover and watch the order: the cover comes off the wall and squares up, *then* rises. On leave it reverses — down first, then it leans back." } } },
  render: (args) => <ProjectCover {...args}>{COVER_ART[P.art]}</ProjectCover>,
};

export const NoTilt = {
  name: "Without the tilt",
  args: { tilt: false },
  parameters: { docs: { description: { story: "`tilt: false` leaves a flat cover and a plain vertical lift — the behaviour before the pickup motion existed. Worth flicking between this and **Playground** to see what the pivot is actually adding." } } },
  render: (args) => <ProjectCover {...args}>{COVER_ART[P.art]}</ProjectCover>,
};

export const PivotOnTheSpine = {
  name: "Pivot on the spine",
  args: { pivot: "bottom left", restTiltY: -16 },
  parameters: { docs: { description: { story: "Origin moved to the bottom-left corner with a heavier rest angle, so the cover swings open from its spine rather than turning about its centre. More book, less record sleeve." } } },
  render: (args) => <ProjectCover {...args}>{COVER_ART[P.art]}</ProjectCover>,
};

export const Lifted = {
  args: { lifted: true },
  parameters: { docs: { description: { story: "The pulled-out state, held without hover. `Work` sets this for 300ms after a click before the panel opens." } } },
  render: (args) => <ProjectCover {...args}>{COVER_ART[P.art]}</ProjectCover>,
};

export const LightCover = {
  name: "Light cover",
  args: { year: PROJECTS[2].year, caption: PROJECTS[2].caption, background: PROJECTS[2].bg, captionColor: "#5b3a92" },
  parameters: { docs: { description: { story: "Medibase is the one light cover, so `Work` passes `captionColor` to keep its labels readable. Without it the default lilac would nearly vanish." } } },
  render: (args) => <ProjectCover {...args}>{COVER_ART[PROJECTS[2].art]}</ProjectCover>,
};

export const AllCovers = {
  name: "All seven covers",
  parameters: {
    layout: "fullscreen",
    docs: { description: { story: "Every project cover with its real art, all leaning at the same rest angle. Hover across the row to check the pickup reads the same on a light cover as on a dark one." } },
  },
  render: (args) => (
    <div style={{ padding: "100px var(--gutter-page)", display: "flex", flexWrap: "wrap", gap: "var(--gap-shelf)", alignItems: "flex-end", justifyContent: "center" }}>
      {PROJECTS.map((p) => (
        <ProjectCover
          key={p.name}
          {...motionArgs(args)}
          year={p.year}
          caption={p.caption}
          background={p.bg}
          captionColor={p.light ? "#5b3a92" : undefined}
          onClick={args.onClick}
        >
          {COVER_ART[p.art]}
        </ProjectCover>
      ))}
    </div>
  ),
};

export const OnAShelf = {
  name: "In context — on a shelf",
  parameters: {
    layout: "fullscreen",
    docs: { description: { story: "Four covers leaning on a `ShelfRail` over the Work page's aurora backdrop. Hover one and it comes off the wall while its neighbours stay leaning — the contrast against the row is most of the effect." } },
  },
  render: (args) => (
    <ShelfScene groups={[PROJECTS.slice(0, 4)]} coverProps={motionArgs(args)} onCoverClick={args.onClick} />
  ),
};

export const OnAShelfLifted = {
  name: "In context — one cover pulled out",
  parameters: {
    layout: "fullscreen",
    docs: { description: { story: "The same shelf with the second cover held in the `lifted` state, so the pulled-out pose can be compared against its seated neighbours without having to hover." } },
  },
  render: (args) => (
    <ShelfScene groups={[PROJECTS.slice(0, 4)]} liftedIndex={1} coverProps={motionArgs(args)} onCoverClick={args.onClick} />
  ),
};

export const BothShelves = {
  name: "In context — both shelves",
  parameters: {
    layout: "fullscreen",
    docs: { description: { story: "All seven covers across the two shelves, as the Work page lays them out: four, then three." } },
  },
  render: (args) => (
    <ShelfScene groups={[PROJECTS.slice(0, 4), PROJECTS.slice(4, 7)]} coverProps={motionArgs(args)} onCoverClick={args.onClick} />
  ),
};
