import React from "react";
import { Page, Section, Grid, Swatch, Mono, useVars } from "./_helpers.jsx";

const RAMPS = [
  {
    title: "Void / ink",
    note: "Near-black purples used for page and card grounds. --void is the page background.",
    names: ["--void", "--ink-900", "--ink-800", "--ink-700", "--ink-650", "--ink-600", "--ink-500", "--ink-450", "--ink-400", "--ink-350", "--ink-300"],
  },
  {
    title: "Violet",
    note: "The single chromatic family. Everything accent-coloured on the site comes from this ramp.",
    names: ["--violet-950", "--violet-900", "--violet-850", "--violet-800", "--violet-700", "--violet-650", "--violet-600", "--violet-550", "--violet-500", "--violet-400", "--violet-300", "--violet-200", "--violet-100", "--violet-050"],
  },
  {
    title: "Lilac / mauve",
    note: "Muted violets for secondary text and quiet UI.",
    names: ["--lilac-400", "--lilac-300", "--lilac-200", "--mauve-600", "--mauve-500", "--mauve-400", "--mauve-300", "--mauve-200"],
  },
  {
    title: "Warm whites",
    note: "Never pure white for body copy — every white carries a little violet.",
    names: ["--white-pure", "--white-warm", "--white-page", "--white-soft", "--white-dim", "--white-mist", "--white-fog", "--white-haze", "--white-dusk"],
  },
];

const SEMANTIC = [
  { title: "Surfaces", names: ["--bg-page", "--bg-card-dark", "--surface-panel", "--surface-backdrop", "--surface-cover-scrim"] },
  { title: "Text", names: ["--text-display", "--text-primary", "--text-body", "--text-panel-body", "--text-list", "--text-muted", "--text-meta", "--text-accent", "--text-eyebrow", "--text-link", "--text-link-hover", "--text-on-light", "--text-on-light-strong"] },
  { title: "Accent & fills", names: ["--accent", "--accent-strong", "--selection-bg", "--fill-light", "--fill-light-hover", "--tint-hover", "--tint-row-hover", "--tint-chip", "--tint-ghost"] },
  { title: "Borders & rules", names: ["--border-hairline", "--border-panel", "--border-chip", "--border-on-light", "--border-on-light-strong", "--border-close", "--rule-quote"] },
];

const ALL = RAMPS.concat(SEMANTIC).reduce((acc, g) => acc.concat(g.names), []);

const TEXT_TOKENS = ["--text-display", "--text-primary", "--text-body", "--text-panel-body", "--text-list", "--text-muted", "--text-meta", "--text-accent", "--text-eyebrow", "--text-link"];

/* Story bodies are named components so the token hooks run inside a real
   component — an inline `render` arrow does not satisfy rules-of-hooks. */

function RampsView() {
  const vars = useVars(ALL);
  return (
    <Page
      title="Colour ramps"
      intro="Four families: near-black grounds, one chromatic violet ramp, muted lilacs for secondary text, and warm whites. There is no second hue anywhere in the system."
    >
      {RAMPS.map((group) => (
        <Section key={group.title} title={group.title} note={group.note}>
          <Grid min={150}>
            {group.names.map((n) => <Swatch key={n} name={n} value={vars[n]} />)}
          </Grid>
        </Section>
      ))}
    </Page>
  );
}

function SemanticView() {
  const vars = useVars(ALL);
  return (
    <Page
      title="Semantic aliases"
      intro="Prefer these over raw ramp values in components — they carry intent, so a re-theme touches one file. Gradients and translucent fills render over the page ground."
    >
      {SEMANTIC.map((group) => (
        <Section key={group.title} title={group.title}>
          <Grid min={190}>
            {group.names.map((n) => <Swatch key={n} name={n} value={vars[n]} />)}
          </Grid>
        </Section>
      ))}
    </Page>
  );
}

function TextOnGroundView() {
  const vars = useVars(TEXT_TOKENS);
  return (
    <Page
      title="Text colours in place"
      intro="The same specimen at every text token, over the page ground it is actually used on. Use this to judge hierarchy — each step down should read as quieter, not just lighter."
    >
      <Section title="On --void">
        <div style={{ background: "var(--void)", border: "1px solid var(--border-hairline)", borderRadius: "var(--radius-sm)", padding: "8px 20px" }}>
          {TEXT_TOKENS.map((n) => (
            <div key={n} style={{ display: "grid", gridTemplateColumns: "210px 1fr", gap: 20, alignItems: "baseline", padding: "13px 0", borderTop: "1px solid var(--border-hairline)" }}>
              <div><Mono>{n}</Mono><div style={{ marginTop: 3 }}><Mono dim>{vars[n]}</Mono></div></div>
              <div style={{ color: `var(${n})`, fontSize: "var(--text-body)", lineHeight: "var(--leading-body)" }}>
                I turn messy problems into products people can actually use.
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section title="On --surface-panel" note="The ground inside an open project panel.">
        <div style={{ background: "var(--surface-panel)", border: "1px solid var(--border-panel)", borderRadius: "var(--radius-md)", padding: "8px 20px" }}>
          {TEXT_TOKENS.slice(0, 6).map((n) => (
            <div key={n} style={{ display: "grid", gridTemplateColumns: "210px 1fr", gap: 20, alignItems: "baseline", padding: "13px 0", borderTop: "1px solid var(--border-hairline)" }}>
              <Mono>{n}</Mono>
              <div style={{ color: `var(${n})`, fontSize: "var(--text-panel)", lineHeight: "var(--leading-panel)" }}>
                One event enters once and lands everywhere it matters.
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section title="On --fill-light" note="Light surfaces: the solid button face and the Medibase cover.">
        <div style={{ background: "var(--fill-light)", borderRadius: "var(--radius-sm)", padding: "8px 20px" }}>
          {["--text-on-light", "--text-on-light-strong", "--ink-500"].map((n) => (
            <div key={n} style={{ display: "grid", gridTemplateColumns: "210px 1fr", gap: 20, alignItems: "baseline", padding: "13px 0", borderTop: "1px solid rgba(26,6,48,0.14)" }}>
              <code style={{ fontFamily: "ui-monospace, Menlo, Consolas, monospace", fontSize: 11.5, color: "#5b3a92" }}>{n}</code>
              <div style={{ color: `var(${n})`, fontSize: "var(--text-body)" }}>View work</div>
            </div>
          ))}
        </div>
      </Section>
    </Page>
  );
}

export default {
  title: "Foundations/Colors",
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Every colour in the system, read live from `src/styles/tokens/colors.css`. Click any swatch to copy its `var(--name)`.",
      },
    },
  },
};

export const Ramps = { render: () => <RampsView /> };

export const Semantic = { render: () => <SemanticView /> };

export const TextOnGround = {
  name: "Text on ground",
  render: () => <TextOnGroundView />,
};
