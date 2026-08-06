import React from "react";
import { fn } from "storybook/test";
import { About } from "./About.jsx";

export default {
  title: "Pages/About",
  component: About,
  parameters: {
    layout: "fullscreen",
    docs: {
      story: { inline: false, height: "860px" },
      description: {
        component: [
          "The long-form page: two paragraphs of introduction, the technology marquee, then work history and education as timeline rows.",
          "",
          "`TimelineRow` is defined inside this file rather than in `ds/`, since nothing else uses it. It takes `when / what / where / note / list` and renders hairline rules above each row, plus one below the last.",
          "",
          "The logo strip pulls Simple Icons SVGs from jsDelivr, so **this page needs network access** to render its logos.",
        ].join("\n"),
      },
    },
  },
  args: { onBrand: fn(), onWork: fn() },
  argTypes: {
    onBrand: { action: "brand clicked", description: "Fired by the name in the header.", table: { category: "Events" } },
    onWork: { action: "work clicked", description: "Fired by the Work link in the nav.", table: { category: "Events" } },
  },
};

export const Default = {};

export const Narrow = {
  globals: { viewport: { value: "phone" } },
  parameters: { docs: { description: { story: "At a phone width the timeline's 130px date column stays fixed while the content column collapses — the point where these rows are most likely to need a stacked layout." } } },
};

export const Tablet = {
  globals: { viewport: { value: "tablet" } },
};

export const Wide = {
  globals: { viewport: { value: "wide" } },
  parameters: { docs: { description: { story: "At 1920px the body copy is held to `--measure-body` (56ch) while the logo strip runs the full bleed — the intended contrast between measured text and edge-to-edge motion." } } },
};
