import React from "react";
import App from "./App.jsx";

export default {
  title: "Pages/App (full site)",
  component: App,
  parameters: {
    layout: "fullscreen",
    docs: {
      story: { inline: false, height: "860px" },
      description: {
        component: [
          "The whole site in one frame, with navigation working. `App` holds two pieces of state — which view is showing and which project is open — mounts the shared `Particles` layer above every page, and binds Escape to close the panel.",
          "",
          "Routing is state, not URLs: there is no router and no history, so a view change is a `setState` plus `window.scrollTo(0, 0)`. Deep links are not possible by design.",
          "",
          "Use this story to check flows end to end; use the individual page stories to work on one page in isolation.",
        ].join("\n"),
      },
    },
  },
};

export const FullSite = {
  name: "Full site",
};

export const Narrow = {
  globals: { viewport: { value: "phone" } },
  parameters: { docs: { description: { story: "The whole site at 390px. Walk landing → work → open a panel → back to check the flow holds together on a phone." } } },
};

export const Wide = {
  globals: { viewport: { value: "wide" } },
};
