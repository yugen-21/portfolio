import React from "react";
import { animate, createTimeline, stagger, utils } from "animejs";
import { EyebrowLabel } from "../core/EyebrowLabel.jsx";
import { CoverMotionContext, prefersReducedMotion } from "./coverMotion.js";

/**
 * Defaults for the shelf-pickup motion. A cover rests standing straight but
 * leaning back against the wall. Picking it up is two moves, not one: it comes
 * off the wall and stands upright, and only then rises — the order a hand does
 * it in. The rise is deliberately small; the lean coming out is what reads as
 * the pickup, not the height.
 */
const REST_TILT_X = 14;  // the lean — top resting back against the wall
const REST_TILT_Y = 0;   // square left-to-right; no sideways skew
const TILT_MS = 420;
const LIFT_MS = 560;
const OVERLAP = 0.4;     // fraction of the first move the second starts inside

const DEFAULT_ACTIONS = [{ label: "Open" }, { label: "Details" }];

/** Current translateY of an element, so an interrupted move can be reversed from where it is. */
const currentY = (el) => {
  try {
    return new DOMMatrix(getComputedStyle(el).transform).m42;
  } catch {
    return 0;
  }
};

export function ProjectCover({
  year,
  caption,
  background,
  captionColor,
  children,
  lifted = false,
  onClick,
  actions = DEFAULT_ACTIONS,
  tilt = true,
  restTiltX = REST_TILT_X,
  restTiltY = REST_TILT_Y,
  lift = 14,
  liftedLift = 24,
  liftSplit = 0.4,
  depthPop = 30,
  liftedDepthPop = 48,
  hoverScale = 1,
  liftedScale = 1.02,
  perspective = 1000,
  pivot = "bottom center",
  tiltDuration = TILT_MS,
  liftDuration = LIFT_MS,
  overlap = OVERLAP,
}) {
  const [hover, setHover] = React.useState(false);
  const cardRef = React.useRef(null);
  const actionsRef = React.useRef(null);
  const first = React.useRef(true);
  const raised = lifted || hover;

  React.useEffect(() => {
    const el = cardRef.current;
    if (!el) return undefined;

    const restX = tilt ? restTiltX : 0;
    const restY = tilt ? restTiltY : 0;
    const up = lifted ? liftedLift : lift;
    const z = tilt ? (lifted ? liftedDepthPop : depthPop) : 0;
    const scale = lifted ? liftedScale : hoverScale;
    // Part of the rise belongs to the first move, so the cover is already on
    // its way up as it leaves the wall instead of jumping once it gets there.
    const partial = up * liftSplit;

    const restState = { rotateX: restX, rotateY: restY, translateY: 0, translateZ: 0, scale: 1 };
    const raisedState = { rotateX: 0, rotateY: 0, translateY: -up, translateZ: z, scale };
    const pills = actionsRef.current ? actionsRef.current.children : null;

    // First paint and reduced-motion visitors get the end state outright.
    if (first.current || prefersReducedMotion()) {
      first.current = false;
      utils.set(el, raised ? raisedState : restState);
      if (pills && pills.length) utils.set(pills, { opacity: raised ? 1 : 0, translateY: 0 });
      return undefined;
    }

    // anime.js replaces conflicting tweens, so an interrupted move reverses
    // from wherever it got to rather than snapping. On the way back the
    // timeline also writes the rest pose exactly on completion, so repeated
    // interrupted hovers can never leave the lean a fraction off where it
    // started.
    const timeline = createTimeline(
      raised ? {} : { onComplete: () => utils.set(el, restState) }
    );
    if (raised) {
      // One: off the wall and forward, already rising. Two: straight up.
      timeline
        .add(
          el,
          { rotateX: 0, rotateY: 0, translateZ: z, translateY: -partial, duration: tiltDuration, ease: "outQuart" },
          0
        )
        .add(
          el,
          { translateY: -up, scale, duration: liftDuration, ease: "outBack" },
          Math.round(tiltDuration * (1 - overlap))
        );
    } else {
      // Mirror image: come down to the hand-off height, then back to the wall.
      // If it was caught before it ever left the shelf there is nothing to set
      // down, so it goes straight back rather than waiting out a no-op segment.
      const airborne = Math.abs(currentY(el)) > partial + 1.5;
      if (airborne) {
        timeline
          .add(el, { translateY: -partial, scale: 1, duration: liftDuration, ease: "inQuad" }, 0)
          .add(
            el,
            { rotateX: restX, rotateY: restY, translateZ: 0, translateY: 0, duration: tiltDuration, ease: "outQuart" },
            Math.round(liftDuration * (1 - overlap))
          );
      } else {
        timeline.add(
          el,
          { rotateX: restX, rotateY: restY, translateZ: 0, translateY: 0, scale: 1, duration: tiltDuration, ease: "outQuart" },
          0
        );
      }
    }

    // The pills arrive once the cover is off the wall, one after the other.
    if (pills && pills.length) {
      animate(pills, {
        opacity: raised ? 1 : 0,
        translateY: raised ? [12, 0] : 8,
        duration: Math.round(liftDuration * 0.6),
        delay: raised ? stagger(70, { start: Math.round(tiltDuration * 0.55) }) : stagger(40),
        ease: raised ? "outBack" : "inQuad",
      });
    }

    return () => timeline.pause();
  }, [
    raised, lifted, tilt, restTiltX, restTiltY, lift, liftedLift, liftSplit,
    depthPop, liftedDepthPop, hoverScale, liftedScale,
    tiltDuration, liftDuration, overlap,
  ]);

  const motion = React.useMemo(() => ({ raised, ms: liftDuration }), [raised, liftDuration]);

  return (
    <div
      // Hover lives on this wrapper, which never transforms. On the card itself
      // a lift can carry the artwork out from under a stationary pointer, and
      // the browser only reports that on the next mouse move — so the cover
      // sticks raised, or flickers as it settles back under the cursor.
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        position: "relative",
        width: "var(--cover-size)",
        flex: "none",
        // Perspective must sit on the parent of the transformed element, and
        // keeping it here rather than on the shelf means the component carries
        // its own depth wherever it is used.
        perspective: `${perspective}px`,
        zIndex: raised ? 5 : 1,
      }}
    >
      <div
        ref={cardRef}
        onClick={onClick}
        style={{
          position: "relative",
          width: "100%",
          aspectRatio: "1",
          overflow: "hidden",
          cursor: "pointer",
          background,
          transformOrigin: pivot,
          willChange: "transform",
          boxShadow: raised ? "var(--shadow-cover-lift)" : "var(--shadow-cover)",
          // Transform is driven by anime.js; only the shadow crossfades in CSS.
          transition: "box-shadow var(--dur-cover) ease",
        }}
      >
        <CoverMotionContext.Provider value={motion}>{children}</CoverMotionContext.Provider>

        <EyebrowLabel tone="year" color={captionColor} style={{ position: "absolute", left: 18, top: 18 }}>{year}</EyebrowLabel>
        <EyebrowLabel tone="caption" color={captionColor} style={{ position: "absolute", left: 18, right: 18, bottom: 20 }}>{caption}</EyebrowLabel>

        <div
          aria-hidden={!raised}
          style={{
            position: "absolute", inset: 0,
            // Weighted to the bottom, and no blur: the pills get their contrast
            // while the artwork above stays legible enough to watch it move.
            background: "linear-gradient(180deg, rgba(10,2,20,0) 34%, rgba(10,2,20,0.55) 62%, rgba(10,2,20,0.82) 100%)",
            opacity: raised ? 1 : 0,
            pointerEvents: raised ? "auto" : "none",
            transition: "opacity var(--dur-hover)",
          }}
        >
          <div
            ref={actionsRef}
            style={{
              position: "absolute", left: 0, right: 0, bottom: "17%",
              display: "flex", justifyContent: "center", gap: 10, flexWrap: "wrap",
            }}
          >
            {actions.map((action) => (
              <button
                key={action.label}
                type="button"
                tabIndex={raised ? 0 : -1}
                onClick={(e) => {
                  e.stopPropagation();
                  (action.onClick || onClick || (() => {}))(e);
                }}
                style={{
                  opacity: 0,
                  fontFamily: "var(--font-sans)",
                  fontSize: "var(--text-button-sm)",
                  fontWeight: "var(--weight-medium)",
                  padding: "11px 22px",
                  border: "1px solid rgba(255,255,255,0.55)",
                  borderRadius: "var(--radius-pill)",
                  background: "rgba(245,238,255,0.95)",
                  color: "var(--text-on-light)",
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                }}
              >
                {action.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
