import React from "react";
import Hyperspeed from "./Hyperspeed.jsx";
import { OnLanding, Bare } from "../../stories/_backdrop.jsx";
import { VOID, INK_800, INK_700, VIOLET_050, VIOLET_200, VIOLET_300, VIOLET_500, VIOLET_400, VIOLET_600, VIOLET_700, VIOLET_950, LILAC_300, asInt } from "../../styles/palette.js";


/**
 * effectOptions identity drives the setup effect — a fresh object literal on
 * every render tears down and rebuilds the whole WebGL scene. Module-level
 * constants keep the reference stable.
 */
const VIOLET_OPTIONS = {
  distortion: "turbulentDistortion",
  length: 400,
  roadWidth: 10,
  islandWidth: 2,
  lanesPerRoad: 3,
  fov: 90,
  fovSpeedUp: 150,
  speedUp: 2,
  carLightsFade: 0.4,
  totalSideLightSticks: 20,
  lightPairsPerRoadWay: 40,
  colors: {
    roadColor: asInt(INK_800),
    islandColor: asInt(INK_700),
    background: asInt(VOID),
    shoulderLines: asInt(VIOLET_050),
    brokenLines: asInt(VIOLET_200),
    leftCars: [asInt(VIOLET_400), asInt(VIOLET_600), asInt(VIOLET_300)],
    rightCars: [asInt(VIOLET_500), asInt(VIOLET_700), asInt(VIOLET_950)],
    sticks: asInt(LILAC_300),
  },
};

const STOCK_OPTIONS = {
  distortion: "turbulentDistortion",
  length: 400,
  roadWidth: 10,
  islandWidth: 2,
  lanesPerRoad: 4,
  fov: 90,
  colors: {
    roadColor: 0x080808,
    islandColor: 0x0a0a0a,
    background: 0x000000,
    shoulderLines: 0xffffff,
    brokenLines: 0xffffff,
    leftCars: [0xd856bf, 0x6750a2, 0xc247ac],
    rightCars: [0x03b3c3, 0x0e5ea5, 0x324555],
    sticks: 0x03b3c3,
  },
};

const CALM_OPTIONS = {
  ...VIOLET_OPTIONS,
  distortion: "deepDistortion",
  lanesPerRoad: 2,
  lightPairsPerRoadWay: 18,
  totalSideLightSticks: 10,
  speedUp: 1,
};

export default {
  title: "Backdrop/Hyperspeed",
  component: Hyperspeed,
  parameters: {
    layout: "fullscreen",
    docs: {
      story: { inline: false, height: "620px" },
      description: {
        component: [
          "An infinite night-drive built on `three` plus `postprocessing` (bloom + SMAA). Vendored verbatim from [React Bits](https://reactbits.dev). **Press and hold** anywhere on the canvas to accelerate — FOV widens and the road speeds up until you release.",
          "",
          "**Palette inheritance is clean but unusual**: every colour is a `0x` integer, not a string. `styles/palette.js` exports `asInt()` to convert our token hex, so `roadColor: asInt(INK_800)` reads as a token rather than a magic number.",
          "",
          "Two things to know before this goes near a page:",
          "",
          "- **The CSS was edited.** The vendored `Hyperspeed.css` ships a bare `canvas { width: 100%; height: 100% }` rule. Left alone it also matches `ParticleText` and the `Particles` backdrop, which size their own canvases. It is scoped to `#lights canvas` here — behaviour inside the component is identical.",
          "- **It mounts on `id=\"lights\"`.** IDs must be unique, so only one instance can exist per page.",
          "",
          "This is also the heaviest component in the set: three shader materials, instanced geometry and two post passes per frame.",
        ].join("\n"),
      },
    },
  },
  argTypes: {
    effectOptions: { control: false, description: "Config object. Memoize it — a new reference rebuilds the whole scene." },
  },
};

export const Calm = {
  name: "Calm, on the landing page",
  args: { effectOptions: CALM_OPTIONS },
  parameters: { docs: { description: { story: "`deepDistortion` with two lanes and roughly half the light pairs. Cheaper per frame and far less busy — the only configuration here that leaves the intro copy readable." } } },
  render: (args) => <OnLanding interactive><Hyperspeed {...args} /></OnLanding>,
};

export const Violet = {
  name: "Violet, on the landing page",
  args: { effectOptions: VIOLET_OPTIONS },
  parameters: { docs: { description: { story: "Road and island on `--ink-800`/`--ink-700`, lane markings on `--violet-050`/`--violet-200`, both car-light banks pulled onto the violet ramp so the oncoming lane no longer reads teal. Full speed under real copy — check whether the bloom washes out the body text." } } },
  render: (args) => <OnLanding interactive><Hyperspeed {...args} /></OnLanding>,
};

export const VendoredDefault = {
  name: "Vendored default, on the landing page",
  args: { effectOptions: STOCK_OPTIONS },
  parameters: { docs: { description: { story: "React Bits' shipped colours — magenta left, cyan right, pure black ground. The cyan bank is the most obviously off-brand part against our page." } } },
  render: (args) => <OnLanding interactive><Hyperspeed {...args} /></OnLanding>,
};

export const BareLayer = {
  name: "Bare layer",
  args: { effectOptions: VIOLET_OPTIONS },
  parameters: { docs: { description: { story: "Nothing above it, so press-and-hold to accelerate works everywhere on the frame. Use this to judge the drive itself." } } },
  render: (args) => <Bare><Hyperspeed {...args} /></Bare>,
};
