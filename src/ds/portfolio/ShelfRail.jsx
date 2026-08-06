import React from "react";

/**
 * The ledge the covers stand on.
 *
 * Two planes: a front lip, and a top surface that recedes toward the wall. The
 * surface is absolutely positioned rather than stacked in flow, so the rail's
 * layout box stays exactly 12px tall and the -66px `pullUp` keeps landing 4px
 * inside the covers above it. Give it depth and the calibration would drift.
 *
 * Because the rail paints above a resting cover, the surface reads as a lip the
 * covers are standing behind — which is what sells both the lean and the lift.
 */
export function ShelfRail({ pullUp = 66, depth = 26, surfaceTilt = 74, perspective = 900 }) {
  return (
    <div
      style={{
        position: "relative",
        height: 12,
        width: "var(--rail-width)",
        margin: `-${pullUp}px auto 0`,
        zIndex: 4,
        perspective: `${perspective}px`,
      }}
    >
      {depth > 0 && (
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: "100%",
            height: depth,
            transform: `rotateX(${surfaceTilt}deg)`,
            transformOrigin: "bottom center",
            background: "var(--rail-top)",
          }}
        />
      )}
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "var(--radius-rail)",
          background: "var(--rail-face)",
          boxShadow: "var(--shadow-rail)",
        }}
      />
    </div>
  );
}
