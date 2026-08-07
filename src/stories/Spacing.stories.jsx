import React from "react";
import { Page, Section, TokenRow, useVars } from "./_helpers.jsx";

const SPACE = ["--space-1", "--space-2", "--space-3", "--space-4", "--space-5", "--space-6", "--space-7", "--space-8", "--space-9", "--space-10", "--space-11", "--space-12", "--space-14", "--space-16"];
const LAYOUT = ["--gutter-page", "--pad-header-y", "--pad-panel", "--gap-nav", "--gap-shelf", "--gap-section"];
const SIZES = ["--cover-size", "--panel-width", "--rail-width", "--measure-body", "--measure-title"];
const RADII = ["--radius-rail", "--radius-sm", "--radius-md", "--radius-pill", "--radius-cover"];

const ALL = SPACE.concat(LAYOUT, SIZES, RADII);

/** Measures what a fluid token resolves to right now, by rendering it. */
function Measured({ token, axis = "width" }) {
  const ref = React.useRef(null);
  const [px, setPx] = React.useState("");
  React.useEffect(() => {
    const measure = () => {
      if (!ref.current) return;
      const r = ref.current.getBoundingClientRect();
      setPx(Math.round(axis === "width" ? r.width : r.height) + "px");
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [axis]);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <div
        ref={ref}
        style={{
          [axis]: `var(${token})`,
          height: axis === "width" ? 14 : `var(${token})`,
          maxWidth: "100%",
          background: "linear-gradient(90deg, var(--violet-400), var(--violet-700))",
          borderRadius: 2,
          flex: "none",
        }}
      />
      <code style={{ fontFamily: "ui-monospace, Menlo, Consolas, monospace", fontSize: 11.5, color: "var(--text-muted)" }}>{px}</code>
    </div>
  );
}

function ScaleView() {
  const vars = useVars(ALL);
  return (
    <Page
      title="Spacing scale"
      intro="A 14-step scale from 4px to 70px. It is not a strict geometric ramp — the middle steps were tuned by eye against the type sizes they sit next to."
    >
      <Section title="Steps">
        {SPACE.map((t) => (
          <TokenRow key={t} name={t} value={vars[t]}>
            <div style={{ width: vars[t] || 0, height: 16, background: "linear-gradient(90deg, var(--violet-400), var(--violet-700))", borderRadius: 2 }} />
          </TokenRow>
        ))}
      </Section>
    </Page>
  );
}

function LayoutView() {
  const vars = useVars(ALL);
  return (
    <Page
      title="Layout constants"
      intro="Page gutters, section rhythm, and the measures that cap line length. --gap-shelf and --cover-size are fluid, so the album shelf reflows without a media query."
    >
      <Section title="Gutters & gaps">
        {LAYOUT.map((t) => (
          <TokenRow key={t} name={t} value={vars[t]}>
            {t === "--pad-panel"
              ? <span style={{ fontSize: "var(--text-ui)", color: "var(--text-muted)" }}>shorthand — top / sides / bottom</span>
              : <Measured token={t} />}
          </TokenRow>
        ))}
      </Section>

      <Section title="Component sizes & measures" note="--measure-body and --measure-title are in ch, so they track the font, not the pixel grid.">
        {SIZES.map((t) => (
          <TokenRow key={t} name={t} value={vars[t]}>
            <Measured token={t} />
          </TokenRow>
        ))}
      </Section>

      <Section title="Body measure in practice">
        <p style={{ maxWidth: "var(--measure-body)", margin: 0, fontSize: "var(--text-body)", lineHeight: "var(--leading-body)", color: "var(--text-body)", borderRight: "1px dashed var(--border-chip)", paddingRight: 12, textWrap: "pretty" }}>
          I turn messy problems into products people can actually use. Seven of them since 2023, from a campus outpass system to a platform that diagnoses hospitals. The dashed rule marks where --measure-body cuts the line.
        </p>
      </Section>
    </Page>
  );
}

function RadiiView() {
  const vars = useVars(ALL);
  return (
    <Page
      title="Corner radii"
      intro="Pills for anything interactive, 18px for panels, 8px for quiet rows. Covers are deliberately hard-edged squares — a record sleeve has no rounded corners."
    >
      <Section title="Radii">
        {RADII.map((t) => (
          <TokenRow key={t} name={t} value={vars[t]}>
            <div style={{
              width: 130, height: 46, borderRadius: `var(${t})`,
              background: "var(--tint-chip)", border: "1px solid var(--border-chip)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "var(--text-chip)", color: "var(--text-accent)",
            }}>{t.replace("--radius-", "")}</div>
          </TokenRow>
        ))}
      </Section>
    </Page>
  );
}

export default {
  title: "Foundations/Spacing & layout",
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "The spacing scale, page layout constants, and corner radii from `src/styles/tokens/spacing.css`. Fluid tokens report what they resolve to at the current preview width.",
      },
    },
  },
};

export const Scale = { render: () => <ScaleView /> };

export const Layout = { render: () => <LayoutView /> };

export const Radii = { render: () => <RadiiView /> };
