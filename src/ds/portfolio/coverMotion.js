import React from "react";

/**
 * Lets a piece of cover art know it is being picked up, without ProjectCover
 * needing to know anything about the artwork. Each art piece subscribes and
 * runs its own characteristic motion.
 *
 * `ms` is the cover's own lift duration, so art motion stays in step when the
 * timing controls are dragged in Storybook.
 */
export const CoverMotionContext = React.createContext({ raised: false, ms: 520 });

export const useCoverRaised = () => React.useContext(CoverMotionContext);

export const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia
    ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
    : false;
