import React from "react";
import { Page, Section, Mono, useVars } from "./_helpers.jsx";

const DISPLAY_SIZES = [
  "--text-hero",
  "--text-lead",
  "--text-title",
  "--text-h2",
  "--text-cover-xl",
  "--text-cover-lg",
  "--text-cover-md",
  "--text-cover-sm",
];
const UI_SIZES = [
  "--text-body",
  "--text-panel",
  "--text-nav-brand",
  "--text-list",
  "--text-ui",
  "--text-button",
  "--text-button-sm",
  "--text-chip",
  "--text-meta",
  "--text-eyebrow",
  "--text-caps",
  "--text-caps-xs",
];
const LEADING = [
  "--leading-hero",
  "--leading-cover",
  "--leading-title",
  "--leading-heading",
  "--leading-snug",
  "--leading-list",
  "--leading-panel",
  "--leading-body",
];
const TRACKING = [
  "--track-tighter",
  "--track-tight",
  "--track-snug",
  "--track-neat",
  "--track-caps",
  "--track-eyebrow",
  "--track-cover",
  "--track-wide",
];
const WEIGHTS = [
  "--weight-light",
  "--weight-regular",
  "--weight-medium",
  "--weight-semibold",
  "--weight-bold",
];

const ALL = DISPLAY_SIZES.concat(UI_SIZES, LEADING, TRACKING, WEIGHTS, [
  "--font-display",
  "--font-sans",
]);

const CAPS_TRACKS = [
  "--track-caps",
  "--track-eyebrow",
  "--track-cover",
  "--track-wide",
];

const DISPLAY_SAMPLES = {
  "--text-hero": "Shama Anjum",
  "--text-lead": "Full Stack Engineer",
  "--text-title": "Making solutions to real-world problems since 2023.",
  "--text-h2": "Where I have worked",
  "--text-cover-xl": "AD LOOM",
  "--text-cover-lg": "OUT PASS",
  "--text-cover-md": "VOTE CHAIN",
  "--text-cover-sm": "MEDULLA",
};

const UI_SAMPLES = {
  "--text-body": "I turn messy problems into products people can actually use.",
  "--text-panel": "An AI governance platform for hospitals.",
  "--text-nav-brand": "Shama Anjum",
  "--text-list":
    "Nine intelligence domains, from clinical safety to cybersecurity.",
  "--text-ui": "LinkedIn",
  "--text-button": "View work",
  "--text-button-sm": "Open",
  "--text-chip": "PostgreSQL",
  "--text-meta": "2026",
  "--text-eyebrow": "THE PROBLEM",
  "--text-caps": "STUDENT DASHBOARD",
  "--text-caps-xs": "2023",
};

const PARA =
  "I turn messy problems into products people can actually use. Seven of them since 2023, from a campus outpass system to a platform that diagnoses hospitals.";

/** Renders a specimen at the token size and reports what it actually resolves to. */
function SizeSpecimen({ token, spec, display, sample }) {
  const ref = React.useRef(null);
  const [px, setPx] = React.useState("");

  React.useEffect(() => {
    const measure = () => {
      if (ref.current) setPx(getComputedStyle(ref.current).fontSize);
    };
    measure();
    window.addEventListener("resize", measure);
    if (document.fonts && document.fonts.ready)
      document.fonts.ready.then(measure).catch(() => {});
    return () => window.removeEventListener("resize", measure);
  }, []);

  return (
    <div
      style={{
        padding: "20px 0",
        borderTop: "1px solid var(--border-hairline)",
      }}
    >
      <div
        style={{
          display: "flex",
          gap: 16,
          alignItems: "baseline",
          flexWrap: "wrap",
          marginBottom: 10,
        }}
      >
        <Mono>{token}</Mono>
        <Mono dim>{spec}</Mono>
        <span
          style={{ fontSize: "var(--text-meta)", color: "var(--text-muted)" }}
        >
          renders at{" "}
          <span style={{ color: "var(--text-accent)" }}>{px || "…"}</span> at
          this width
        </span>
      </div>
      <div
        ref={ref}
        style={{
          fontFamily: display ? "var(--font-display)" : "var(--font-sans)",
          fontSize: `var(${token})`,
          fontWeight: display ? 400 : undefined,
          lineHeight: display
            ? "var(--leading-heading)"
            : "var(--leading-body)",
          color: "var(--text-display)",
          textWrap: "pretty",
        }}
      >
        {sample}
      </div>
    </div>
  );
}

function FamiliesView() {
  const vars = useVars(ALL);
  return (
    <Page
      title="Typefaces"
      intro="Instrument Serif carries the name and every heading. Switzer carries the interface. Nothing else is loaded — if a third voice is needed, it should replace one of these rather than join them."
    >
      <Section title="Display — --font-display" note={vars["--font-display"]}>
        <div
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 400,
            fontSize: "var(--text-title)",
            color: "var(--text-display)",
            lineHeight: "var(--leading-heading)",
          }}
        >
          Shama Anjum
        </div>
        <div
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 400,
            fontStyle: "italic",
            fontSize: "var(--text-h2)",
            color: "var(--text-accent)",
            marginTop: 10,
          }}
        >
          Making solutions to real-world problems since 2023.
        </div>
        <div
          style={{
            fontFamily: "var(--font-display)",
            fontSize: 22,
            color: "var(--text-body)",
            marginTop: 16,
            letterSpacing: "0.02em",
          }}
        >
          ABCDEFGHIJKLMNOPQRSTUVWXYZ
          <br />
          abcdefghijklmnopqrstuvwxyz
          <br />
          0123456789 &amp; . , ; : ! ? — –
        </div>
      </Section>

      <Section title="Sans — --font-sans" note={vars["--font-sans"]}>
        {WEIGHTS.map((w) => (
          <div
            key={w}
            style={{
              display: "grid",
              gridTemplateColumns: "200px 1fr",
              gap: 20,
              alignItems: "baseline",
              padding: "11px 0",
              borderTop: "1px solid var(--border-hairline)",
            }}
          >
            <div>
              <Mono>{w}</Mono> <Mono dim>{vars[w]}</Mono>
            </div>
            <div
              style={{
                fontFamily: "var(--font-sans)",
                fontWeight: vars[w] || 400,
                fontSize: "var(--text-body)",
                color: "var(--text-display)",
              }}
            >
              I turn messy problems into products people can actually use.
            </div>
          </div>
        ))}
      </Section>
    </Page>
  );
}

function DisplayScaleView() {
  const vars = useVars(ALL);
  return (
    <Page
      title="Display scale"
      intro="Fluid sizes built on clamp(). Resize the preview pane and watch the rendered value move between the floor and the ceiling — that is the whole point of these tokens."
    >
      <Section title="Fluid display sizes">
        {DISPLAY_SIZES.map((t) => (
          <SizeSpecimen
            key={t}
            token={t}
            spec={vars[t]}
            display
            sample={DISPLAY_SAMPLES[t]}
          />
        ))}
      </Section>
    </Page>
  );
}

function UIScaleView() {
  const vars = useVars(ALL);
  return (
    <Page
      title="UI scale"
      intro="Fixed pixel sizes, deliberately including half-pixels — 16.5px body and 13.5px UI sit between the usual steps and were chosen by eye against Switzer's metrics."
    >
      <Section title="Fixed interface sizes">
        {UI_SIZES.map((t) => (
          <SizeSpecimen
            key={t}
            token={t}
            spec={vars[t]}
            sample={UI_SAMPLES[t]}
          />
        ))}
      </Section>
    </Page>
  );
}

function LeadingAndTrackingView() {
  const vars = useVars(ALL);
  return (
    <Page
      title="Leading & tracking"
      intro="Line height tightens as type grows; letter-spacing goes negative on display sizes and strongly positive on small caps. The two move in opposite directions on purpose."
    >
      <Section title="Line height">
        {LEADING.map((t) => (
          <div
            key={t}
            style={{
              padding: "16px 0",
              borderTop: "1px solid var(--border-hairline)",
            }}
          >
            <div style={{ marginBottom: 8 }}>
              <Mono>{t}</Mono> <Mono dim>{vars[t]}</Mono>
            </div>
            <p
              style={{
                margin: 0,
                maxWidth: "56ch",
                fontSize: "var(--text-body)",
                lineHeight: vars[t] || 1.5,
                color: "var(--text-body)",
              }}
            >
              {PARA}
            </p>
          </div>
        ))}
      </Section>

      <Section title="Letter spacing">
        {TRACKING.map((t) => {
          const isCaps = CAPS_TRACKS.indexOf(t) !== -1;
          return (
            <div
              key={t}
              style={{
                padding: "16px 0",
                borderTop: "1px solid var(--border-hairline)",
              }}
            >
              <div style={{ marginBottom: 8 }}>
                <Mono>{t}</Mono> <Mono dim>{vars[t]}</Mono>
              </div>
              <div
                style={{
                  fontSize: isCaps ? "var(--text-caps)" : 30,
                  fontFamily: isCaps
                    ? "var(--font-sans)"
                    : "var(--font-display)",
                  textTransform: isCaps ? "uppercase" : "none",
                  letterSpacing: vars[t],
                  color: "var(--text-display)",
                }}
              >
                Shama Anjum
              </div>
            </div>
          );
        })}
      </Section>
    </Page>
  );
}

export default {
  title: "Foundations/Typography",
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Two families — Instrument Serif for display, Switzer for everything else. Display sizes are fluid `clamp()`; UI sizes are fixed, and the half-pixel values are deliberate.",
      },
    },
  },
};

export const Families = { render: () => <FamiliesView /> };

export const DisplayScale = {
  name: "Display scale",
  render: () => <DisplayScaleView />,
};

export const UIScale = { name: "UI scale", render: () => <UIScaleView /> };

export const LeadingAndTracking = {
  name: "Leading & tracking",
  render: () => <LeadingAndTrackingView />,
};
