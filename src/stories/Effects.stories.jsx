import React from "react";
import { Page, Section, Mono, TokenRow, useVars } from "./_helpers.jsx";

const SHADOWS = ["--shadow-cover", "--shadow-cover-lift", "--shadow-panel", "--shadow-rail"];
const BLURS = ["--blur-backdrop", "--blur-scrim", "--blur-aurora-tight", "--blur-aurora", "--blur-nebula"];
const EASINGS = ["--ease-out-expo", "--ease-cover", "--ease-rise"];
const DURATIONS = ["--dur-fast", "--dur-hover", "--dur-rise", "--dur-swap", "--dur-cover", "--dur-word"];
const DRIFTS = ["--drift-slow", "--drift-mid", "--drift-fast"];
const SURFACES = ["--rail-face", "--scanlines"];

const ALL = SHADOWS.concat(BLURS, EASINGS, DURATIONS, DRIFTS, SURFACES);

/** A dot that runs the given easing on a loop so curves can be compared directly. */
function EasingTrack({ token, duration = 1400 }) {
  const [on, setOn] = React.useState(false);
  React.useEffect(() => {
    const id = window.setInterval(() => setOn((v) => !v), duration + 700);
    const kick = window.setTimeout(() => setOn(true), 60);
    return () => { window.clearInterval(id); window.clearTimeout(kick); };
  }, [duration]);
  return (
    <div style={{ position: "relative", height: 26, background: "rgba(168,85,247,0.07)", borderRadius: "var(--radius-pill)", overflow: "hidden" }}>
      <div style={{
        position: "absolute", top: 5, left: on ? "calc(100% - 21px)" : 5,
        width: 16, height: 16, borderRadius: "50%",
        background: "var(--violet-300)", boxShadow: "0 0 14px var(--violet-400)",
        transition: `left ${duration}ms var(${token})`,
      }} />
    </div>
  );
}

function ShadowsView() {
  const vars = useVars(ALL);
  return (
    <Page
      title="Shadows"
      intro="Each cover shadow is a stack: a dark halo above, a tight contact shadow below, and a violet bloom around. That combination is what reads as an object sitting on a shelf rather than a card floating on a page."
    >
      <Section title="Recipes">
        <div style={{ display: "flex", flexWrap: "wrap", gap: 54, padding: "30px 10px 46px" }}>
          {SHADOWS.map((t) => (
            <div key={t} style={{ textAlign: "center" }}>
              <div style={{
                width: 168, height: t === "--shadow-rail" ? 12 : 168,
                background: t === "--shadow-rail" ? "var(--rail-face)" : "linear-gradient(155deg,#1b0b3a 0%,#2d1063 55%,#160732 100%)",
                borderRadius: t === "--shadow-rail" ? "var(--radius-rail)" : 0,
                boxShadow: `var(${t})`,
                margin: "0 auto",
              }} />
              <div style={{ marginTop: 22 }}><Mono>{t}</Mono></div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 8 }}>
          {SHADOWS.map((t) => (
            <div key={t} style={{ padding: "10px 0", borderTop: "1px solid var(--border-hairline)" }}>
              <Mono>{t}</Mono>
              <div style={{ marginTop: 4 }}><Mono dim>{vars[t]}</Mono></div>
            </div>
          ))}
        </div>
      </Section>
    </Page>
  );
}

function BlursView() {
  const vars = useVars(ALL);
  return (
    <Page
      title="Blur radii"
      intro="Two jobs: backdrop-filter blurs behind panels and scrims, and filter blurs that turn hard gradients into aurora light. The nebula value is intentionally enormous."
    >
      <Section title="Backdrop blurs" note="Applied with backdrop-filter over the page.">
        {["--blur-backdrop", "--blur-scrim"].map((t) => (
          <TokenRow key={t} name={t} value={vars[t]}>
            <div style={{ position: "relative", height: 68, borderRadius: "var(--radius-sm)", overflow: "hidden", border: "1px solid var(--border-hairline)" }}>
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg,#a855f7,#3b0f7a,#c084fc,#07020f)" }} />
              <div style={{ position: "absolute", inset: 0, left: "42%", background: "var(--surface-backdrop)", backdropFilter: `blur(var(${t}))` }} />
            </div>
          </TokenRow>
        ))}
      </Section>

      <Section title="Aurora blurs" note="Applied with filter to the gradient blobs behind every page.">
        {["--blur-aurora-tight", "--blur-aurora", "--blur-nebula"].map((t) => (
          <TokenRow key={t} name={t} value={vars[t]}>
            <div style={{ position: "relative", height: 92, borderRadius: "var(--radius-sm)", overflow: "hidden", background: "var(--void)", border: "1px solid var(--border-hairline)" }}>
              <div style={{
                position: "absolute", left: "50%", top: "50%", width: 150, height: 150,
                transform: "translate(-50%,-50%)", borderRadius: "50%",
                background: "radial-gradient(circle, rgba(168,85,247,0.85) 0%, rgba(139,60,255,0.3) 50%, rgba(139,60,255,0) 72%)",
                filter: `blur(var(${t}))`,
              }} />
            </div>
          </TokenRow>
        ))}
      </Section>
    </Page>
  );
}

function MotionView() {
  const vars = useVars(ALL);
  return (
    <Page
      title="Motion"
      intro="Three easing curves and six durations. Interface feedback stays under 250ms; anything that moves an object in space — a cover lifting, a panel rising — gets 350ms or more."
    >
      <Section title="Easing curves" note="All three run the same distance over the same time. The difference is entirely in the curve.">
        {EASINGS.map((t) => (
          <div key={t} style={{ padding: "16px 0", borderTop: "1px solid var(--border-hairline)" }}>
            <div style={{ marginBottom: 10 }}><Mono>{t}</Mono> <Mono dim>{vars[t]}</Mono></div>
            <EasingTrack token={t} />
          </div>
        ))}
      </Section>

      <Section title="Durations">
        {DURATIONS.map((t) => (
          <TokenRow key={t} name={t} value={vars[t]}>
            <div style={{ height: 8, borderRadius: 4, background: "rgba(168,85,247,0.12)", position: "relative", overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${Math.min(100, (parseInt(vars[t], 10) || 0) / 6)}%`, background: "linear-gradient(90deg, var(--violet-400), var(--violet-700))" }} />
            </div>
          </TokenRow>
        ))}
      </Section>

      <Section title="Ambient drift" note="How long one full cycle of an aurora blob takes. These are slow on purpose — the backdrop should never draw the eye.">
        {DRIFTS.map((t) => (
          <TokenRow key={t} name={t} value={vars[t]}>
            <span style={{ fontSize: "var(--text-ui)", color: "var(--text-muted)" }}>one full drift cycle</span>
          </TokenRow>
        ))}
      </Section>
    </Page>
  );
}

function SurfacesView() {
  const vars = useVars(ALL);
  return (
    <Page
      title="Surface treatments"
      intro="Two named surfaces that are not colours: the metallic gradient on the shelf rail, and the barely-there scanline texture laid over the landing and about pages."
    >
      <Section title="--rail-face" note={vars["--rail-face"]}>
        <div style={{ height: 12, borderRadius: "var(--radius-rail)", background: "var(--rail-face)", boxShadow: "var(--shadow-rail)" }} />
        <div style={{ marginTop: 26, height: 60, borderRadius: "var(--radius-sm)", background: "var(--rail-face)" }} />
      </Section>

      <Section title="--scanlines" note="Repeating 1px lines at 1.4% white. Shown here at full strength; in place it sits at 0.5 opacity.">
        <div style={{ position: "relative", height: 150, borderRadius: "var(--radius-sm)", overflow: "hidden", background: "linear-gradient(135deg,#2d1063,#07020f)" }}>
          <div style={{ position: "absolute", inset: 0, background: "var(--scanlines)" }} />
        </div>
      </Section>
    </Page>
  );
}

export default {
  title: "Foundations/Effects & motion",
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Shadows, blurs, easing curves and durations from `src/styles/tokens/effects.css`. The shadow recipes are what give the project covers their record-sleeve depth.",
      },
    },
  },
};

export const Shadows = { render: () => <ShadowsView /> };

export const Blurs = { render: () => <BlursView /> };

export const Motion = { render: () => <MotionView /> };

export const Surfaces = { render: () => <SurfacesView /> };
