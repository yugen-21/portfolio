import React from "react";
import { fn } from "storybook/test";
import { Work } from "./Work.jsx";
import { PROJECTS } from "../data/projects.js";

/** Work is a controlled component — the panel index lives in App. This restores that loop. */
function StatefulWork(props) {
  const [selected, setSelected] = React.useState(props.selected ?? null);
  React.useEffect(() => { setSelected(props.selected ?? null); }, [props.selected]);
  React.useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") setSelected(null); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);
  return (
    <Work
      {...props}
      selected={selected}
      onOpen={(i) => { setSelected(i); if (props.onOpen) props.onOpen(i); }}
      onClose={() => { setSelected(null); if (props.onClose) props.onClose(); }}
    />
  );
}

export default {
  title: "Pages/Work",
  component: Work,
  parameters: {
    layout: "fullscreen",
    docs: {
      story: { inline: false, height: "860px" },
      description: {
        component: [
          "The portfolio index. Seven covers on two shelves, a text index strip along the bottom, and the detail panel over the top.",
          "",
          "`Work` is **controlled** — it does not own which project is open. `selected` comes in as a prop and `onOpen` / `onClose` go back out, because `App` also binds Escape and resets the selection when navigating away. These stories re-create that loop so clicking a cover actually opens its panel.",
          "",
          "Clicking a cover lifts it for 300ms before the panel opens; that delay is why the lift reads as pulling a record off a shelf rather than as a hover state.",
        ].join("\n"),
      },
    },
  },
  args: { onBrand: fn(), onOpen: fn(), onClose: fn(), selected: null },
  argTypes: {
    selected: {
      control: { type: "select" },
      options: [null, 0, 1, 2, 3, 4, 5, 6],
      description: "Index into PROJECTS, or null for no panel.",
      table: { category: "State" },
    },
    onBrand: { action: "brand clicked", description: "Fired by the name in the header — App routes it back to the landing page.", table: { category: "Events" } },
    onOpen: { action: "opened", description: "Fired 300ms after a cover or index row is clicked.", table: { category: "Events" } },
    onClose: { action: "closed", table: { category: "Events" } },
  },
  render: (args) => <StatefulWork {...args} />,
};

export const Default = {
  parameters: { docs: { description: { story: "The shelf at rest. Click any cover or index row — it lifts, then the panel opens." } } },
};

export const PanelOpen = {
  name: "With a panel open",
  args: { selected: 5 },
  parameters: { docs: { description: { story: "Landing straight on an open panel, as if a cover had just been clicked. Escape or a click on the backdrop closes it." } } },
};

export const LightCoverPanel = {
  name: "Light cover open",
  args: { selected: 2 },
  parameters: { docs: { description: { story: "Medibase — the one light cover. Useful for checking the backdrop blur reads correctly when the cover behind it is pale." } } },
};

export const Narrow = {
  globals: { viewport: { value: "phone" } },
  parameters: { docs: { description: { story: "At 390px the covers hit the 180px floor of `--cover-size`, `--gap-shelf` drops to 18px, and the shelves reflow to two per row. The `useCoverArtScale` hook scales the artwork down to match rather than cropping it." } } },
};

export const Tablet = {
  globals: { viewport: { value: "tablet" } },
  parameters: { docs: { description: { story: "834px — the width where the first shelf breaks from four covers to three plus one. The most awkward layout on the site." } } },
};

export const EveryPanel = {
  name: "Every panel, one per story arg",
  parameters: {
    docs: { description: { story: `All seven projects are reachable through the \`selected\` control: ${PROJECTS.map((p, i) => `${i} = ${p.name}`).join(", ")}.` } },
  },
  args: { selected: 0 },
};
