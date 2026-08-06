import React from "react";
import { animate, stagger, utils } from "animejs";
import { useCoverRaised, prefersReducedMotion } from "./coverMotion.js";

/**
 * Cover artwork. Each piece animates when its cover is picked up, and the
 * motion is chosen to say something about the project rather than being one
 * shared effect reskinned seven times: the outpass form scrolls, the shelves
 * slide in, the blocks move.
 *
 * Every resting value here matches the authored artwork, so a cover at rest
 * looks exactly as it did before any of this existed.
 *
 * These are components rather than plain markup because each one subscribes to
 * CoverMotionContext; `src/data/coverArt.jsx` maps them to project keys.
 */

const wm = { position: "absolute", left: 18, right: 18, bottom: 44 };

const q = (root, name) => root.querySelectorAll(`[data-art="${name}"]`);

/**
 * Runs `motion(root, raised, ms)` whenever the cover is raised or set down.
 * `motion` must be defined at module scope so the dependency is stable.
 */
function useArtMotion(motion) {
  const ref = React.useRef(null);
  const { raised, ms } = useCoverRaised();
  const first = React.useRef(true);

  React.useEffect(() => {
    const root = ref.current;
    if (!root || prefersReducedMotion()) return undefined;
    // Nothing to play into on first paint unless it mounted already raised.
    if (first.current) {
      first.current = false;
      if (!raised) return undefined;
    }
    motion(root, raised, ms);
    return undefined;
  }, [raised, ms, motion]);

  return ref;
}

/* ---------------------------------------------------------------- outpass --
   A form scrolling past: the ruled column marches sideways, the underline
   draws itself, and the wordmark lifts a line at a time. */
const outpassMotion = (root, raised, ms) => {
  animate(q(root, "rules"), {
    translateX: raised ? 34 : 0, // exactly one period, so the pattern lands where it started
    opacity: raised ? 0.9 : 0.5,
    duration: ms, ease: "outQuart",
  });
  animate(q(root, "word"), {
    translateY: raised ? -7 : 0,
    duration: ms, delay: stagger(70), ease: "outBack",
  });
  if (raised) animate(q(root, "rule"), { scaleX: [0, 1], duration: ms, ease: "outQuart" });
};

function Outpass() {
  const ref = useArtMotion(outpassMotion);
  return (
    <div ref={ref} style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
      <div data-art="rules" style={{ position: "absolute", top: 0, bottom: 0, left: -40, right: -40, background: "repeating-linear-gradient(90deg, rgba(255,255,255,0.05) 0 1px, transparent 1px 34px)" }} />
      <div style={wm}>
        <div data-art="word" style={{ fontSize: "var(--text-cover-lg)", fontWeight: 700, lineHeight: 0.9, letterSpacing: "var(--track-tight)", color: "#fff" }}>OUT</div>
        <div data-art="word" style={{ fontSize: "var(--text-cover-lg)", fontWeight: 300, lineHeight: 0.9, letterSpacing: "var(--track-tight)", color: "var(--lilac-300)" }}>PASS</div>
        <div data-art="rule" style={{ marginTop: 12, height: 1, background: "rgba(196,166,255,0.4)", transformOrigin: "left center" }} />
      </div>
    </div>
  );
}

/* -------------------------------------------------------------- votechain --
   The chain links up: the ledger grid drifts, the glow blooms, and CHAIN's
   outline opens out. */
const votechainMotion = (root, raised, ms) => {
  animate(q(root, "grid"), {
    translateX: raised ? 14 : 0,
    translateY: raised ? -14 : 0,
    opacity: raised ? 1 : 0.75,
    duration: ms, ease: "outQuart",
  });
  animate(q(root, "glow"), {
    scale: raised ? 1.3 : 1,
    opacity: raised ? 1 : 0.7,
    duration: ms, ease: "outQuad",
  });
  animate(q(root, "chain"), {
    letterSpacing: raised ? "0.28em" : "0.16em",
    duration: ms, ease: "outQuart",
  });
};

function Votechain() {
  const ref = useArtMotion(votechainMotion);
  return (
    <div ref={ref} style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
      <div data-art="grid" style={{ position: "absolute", top: -30, bottom: -30, left: -30, right: -30, backgroundImage: "linear-gradient(rgba(168,85,247,0.16) 1px,transparent 1px),linear-gradient(90deg,rgba(168,85,247,0.16) 1px,transparent 1px)", backgroundSize: "28px 28px", opacity: 0.75 }} />
      <div data-art="glow" style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 70% 25%, rgba(192,132,252,0.35), transparent 60%)", opacity: 0.7 }} />
      <div style={wm}>
        <div style={{ fontSize: "var(--text-cover-md)", fontWeight: 600, lineHeight: 0.92, letterSpacing: "var(--track-snug)", color: "#fff" }}>VOTE</div>
        <div data-art="chain" style={{ fontSize: "var(--text-cover-md)", fontWeight: 600, lineHeight: 0.92, letterSpacing: "0.16em", color: "transparent", WebkitTextStroke: "1px var(--violet-300)" }}>CHAIN</div>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- medibase --
   A record decrypting: the wordmark resolves out of a blur and settles. */
const medibaseMotion = (root, raised, ms) => {
  if (raised) {
    animate(q(root, "mark"), {
      filter: ["blur(7px)", "blur(0px)"],
      scale: [0.94, 1.05],
      opacity: [0.45, 1],
      duration: ms, ease: "outQuart",
    });
  } else {
    animate(q(root, "mark"), { filter: "blur(0px)", scale: 1, opacity: 1, duration: ms, ease: "outQuad" });
  }
};

function Medibase() {
  const ref = useArtMotion(medibaseMotion);
  return (
    <div ref={ref} style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div data-art="mark" style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontSize: "clamp(32px,3.4vw,48px)", color: "#2a0f52", letterSpacing: "var(--track-neat)" }}>Medibase</div>
    </div>
  );
}

/* ------------------------------------------------------------------ adloom --
   A billboard lighting up: the horizon rule sweeps out from the centre and the
   light spill above it grows. */
const adloomMotion = (root, raised, ms) => {
  animate(q(root, "spill"), {
    scaleY: raised ? 1.45 : 1,
    opacity: raised ? 1 : 0.7,
    duration: ms, ease: "outQuart",
  });
  animate(q(root, "word"), {
    translateX: raised ? 8 : 0,
    duration: ms, delay: stagger(80), ease: "outBack",
  });
  if (raised) animate(q(root, "horizon"), { scaleX: [0, 1], duration: ms, ease: "outExpo" });
};

function Adloom() {
  const ref = useArtMotion(adloomMotion);
  return (
    <div ref={ref} style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
      <div data-art="horizon" style={{ position: "absolute", left: 0, right: 0, top: "38%", height: 1, background: "rgba(233,213,255,0.35)" }} />
      <div data-art="spill" style={{ position: "absolute", left: 0, right: 0, top: "38%", height: "34%", background: "linear-gradient(180deg, rgba(233,213,255,0.12), transparent)", transformOrigin: "top center", opacity: 0.7 }} />
      <div style={{ ...wm, bottom: 48 }}>
        <div data-art="word" style={{ fontSize: "var(--text-cover-xl)", fontWeight: 700, lineHeight: 0.85, letterSpacing: "var(--track-tighter)", color: "#fff" }}>AD</div>
        <div data-art="word" style={{ fontSize: "clamp(30px,3.1vw,42px)", fontWeight: 700, lineHeight: 0.9, letterSpacing: "-0.04em", color: "transparent", WebkitTextStroke: "1.2px var(--violet-100)" }}>LOOM</div>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- shelvefy --
   Shelves sliding into place: the three rails run in from alternating sides,
   one after the other. */
const shelvefyMotion = (root, raised, ms) => {
  const bars = q(root, "bar");
  if (raised) {
    // Alternating sides, so they read as three separate rails being slotted in.
    bars.forEach((bar, i) => utils.set(bar, { translateX: i % 2 ? 260 : -260, opacity: 0 }));
    animate(bars, { translateX: 0, opacity: 1, duration: ms, delay: stagger(90), ease: "outQuart" });
    animate(q(root, "mark"), { translateY: [10, 0], opacity: [0, 1], duration: ms, delay: 180, ease: "outBack" });
  } else {
    animate(bars, { translateX: 0, opacity: 1, duration: Math.round(ms * 0.5), ease: "outQuad" });
    animate(q(root, "mark"), { translateY: 0, opacity: 1, duration: Math.round(ms * 0.5), ease: "outQuad" });
  }
};

function Shelvefy() {
  const ref = useArtMotion(shelvefyMotion);
  return (
    <div ref={ref} style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
      <div data-art="bar" style={{ position: "absolute", left: 0, right: 0, top: "22%", height: 6, background: "linear-gradient(90deg,#8b5cf6,#e9d5ff)" }} />
      <div data-art="bar" style={{ position: "absolute", left: 0, right: 0, top: "47%", height: 6, background: "linear-gradient(90deg,#e9d5ff,#8b5cf6)" }} />
      <div data-art="bar" style={{ position: "absolute", left: 0, right: 0, top: "72%", height: 6, background: "linear-gradient(90deg,#8b5cf6,#c084fc)" }} />
      <div data-art="mark" style={{ position: "absolute", left: 18, right: 18, top: "52%", fontSize: "var(--text-cover-sm)", fontWeight: 600, letterSpacing: "var(--track-tight)", color: "#fff" }}>Shelvefy</div>
    </div>
  );
}

/* ----------------------------------------------------------------- medulla --
   A signal propagating: the concentric rings push outward from the centre and
   the core brightens under them. */
const medullaMotion = (root, raised, ms) => {
  animate(q(root, "rings"), {
    scale: raised ? 1.22 : 1,
    opacity: raised ? 1 : 0.8,
    duration: ms, ease: "outQuart",
  });
  animate(q(root, "core"), {
    scale: raised ? 1.35 : 1,
    opacity: raised ? 1 : 0.75,
    duration: Math.round(ms * 1.1), ease: "outQuad",
  });
  animate(q(root, "line"), {
    translateY: raised ? -5 : 0,
    duration: ms, delay: stagger(80), ease: "outBack",
  });
};

function Medulla() {
  const ref = useArtMotion(medullaMotion);
  return (
    <div ref={ref} style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
      <div data-art="rings" style={{ position: "absolute", inset: 0, background: "repeating-radial-gradient(circle at 50% 50%, rgba(168,85,247,0.30) 0 1px, transparent 1px 17px)", opacity: 0.8 }} />
      <div data-art="core" style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 50% 50%, rgba(216,180,254,0.28), transparent 55%)", opacity: 0.75 }} />
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8 }}>
        <div data-art="line" style={{ fontFamily: "var(--font-display)", fontSize: "clamp(28px,2.9vw,40px)", color: "#fff" }}>Medulla</div>
        <div data-art="line" style={{ fontSize: "var(--text-caps-xs)", letterSpacing: "var(--track-wide)", color: "var(--lilac-300)", textTransform: "uppercase", paddingLeft: "0.42em" }}>Governance</div>
      </div>
    </div>
  );
}

/* --------------------------------------------------------------- blockmove --
   Cargo shifting: the solid block swings further round and drifts, the outline
   counter-rotates away from it. */
const blockmoveMotion = (root, raised, ms) => {
  animate(q(root, "solid"), {
    rotate: raised ? 30 : 14,
    translateX: raised ? -16 : 0,
    translateY: raised ? 10 : 0,
    duration: ms, ease: "outBack",
  });
  animate(q(root, "outline"), {
    rotate: raised ? -24 : -8,
    translateX: raised ? 14 : 0,
    scale: raised ? 1.15 : 1,
    duration: ms, ease: "outBack",
  });
  animate(q(root, "word"), {
    translateX: raised ? 7 : 0,
    duration: ms, delay: stagger(75), ease: "outQuart",
  });
};

function Blockmove() {
  const ref = useArtMotion(blockmoveMotion);
  return (
    <div ref={ref} style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
      <div data-art="solid" style={{ position: "absolute", right: "-6%", top: "6%", width: "40%", aspectRatio: "1", background: "linear-gradient(135deg,#a855f7,#5b21b6)", transform: "rotate(14deg)" }} />
      <div data-art="outline" style={{ position: "absolute", right: "22%", top: "22%", width: "26%", aspectRatio: "1", border: "1px solid rgba(233,213,255,0.55)", transform: "rotate(-8deg)" }} />
      <div style={wm}>
        <div data-art="word" style={{ fontSize: "var(--text-cover-md)", fontWeight: 700, lineHeight: 0.9, letterSpacing: "-0.035em", color: "#fff" }}>BLOCK</div>
        <div data-art="word" style={{ fontSize: "var(--text-cover-md)", fontWeight: 300, lineHeight: 0.9, letterSpacing: "-0.035em", color: "var(--violet-200)" }}>MOVE</div>
      </div>
    </div>
  );
}

export { Outpass, Votechain, Medibase, Adloom, Shelvefy, Medulla, Blockmove };
