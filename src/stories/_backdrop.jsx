import React from "react";
import { Landing } from "../pages/Landing.jsx";
import { VOID } from "../styles/palette.js";

/**
 * Every Backdrop story renders its candidate behind the **real landing page** —
 * the actual particle wordmark, role rotator, intro copy and buttons — rather
 * than a placeholder caption.
 *
 * A backdrop that looks striking on its own often turns out to be unusable the
 * moment real type sits on it: the wordmark is light particles, the body copy is
 * `--white-dusk` at 65% of the display size, and both live at `z-index: 3`. If a
 * layer swamps those, that is the thing worth knowing.
 *
 * The candidate is wrapped to match how `AuroraLayer` positions itself —
 * `fixed`, `inset: 0`, `z-index: 0`.
 *
 * `interactive` leaves pointer events on for backdrops that respond to the
 * cursor. Note the landing content sits above and eats most events, so those
 * layers only feel fully alive in their own bare story.
 */
export const OnLanding = ({ children, interactive = false }) => (
  <div style={{ position: "relative", minHeight: "100vh", background: VOID, overflow: "hidden" }}>
    <Landing
      backdrop={
        <div style={{ position: "fixed", inset: 0, zIndex: 0, overflow: "hidden", pointerEvents: interactive ? "auto" : "none" }}>
          {children}
        </div>
      }
    />
  </div>
);

/** A bare full-bleed frame, for judging a layer on its own terms. */
export const Bare = ({ children }) => (
  <div style={{ position: "relative", minHeight: "100vh", background: VOID, overflow: "hidden" }}>
    <div style={{ position: "absolute", inset: 0 }}>{children}</div>
  </div>
);
