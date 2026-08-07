import React from "react";

/**
 * The ledge the covers stand on, seen from slightly above.
 *
 * Two planes stacked in flow: a top surface running back toward the wall, then
 * the front lip. Because the camera sits a little above the shelf, a cover
 * stands at the *back* of the surface — so the surface is visible in front of
 * it and the lip sits below that. The surface therefore paints behind the
 * covers and only the lip paints in front, which is what stops the rail
 * reading as a line drawn across the artwork.
 *
 * The wrapper's height covers surface + lip, so `pullUp` positions the back
 * edge of the shelf against the covers' base and stays correct as `depth` and
 * `surfaceTilt` change — the shelf grows downward, not upward.
 */
export function ShelfRail({
  pullUp = 64,
  depth = 46,
  surfaceTilt = 64,
  perspective = 1400,
  lipHeight = 12,
}) {
  // Screen height of the surface once rotated away and projected: the far edge
  // rises by depth·cos(θ) and recedes by depth·sin(θ), which perspective then
  // foreshortens.
  const projected = React.useMemo(() => {
    if (depth <= 0) return 0;
    const rad = (surfaceTilt * Math.PI) / 180;
    const rise = depth * Math.cos(rad);
    const back = depth * Math.sin(rad);
    return Math.max(0, Math.round(rise * (perspective / (perspective + back))));
  }, [depth, surfaceTilt, perspective]);

  return (
    <div
      style={{
        position: "relative",
        width: "var(--rail-width)",
        margin: `-${pullUp}px auto 0`,
        perspective: `${perspective}px`,
      }}
    >
      {projected > 0 && (
        <div style={{ position: "relative", height: projected, zIndex: 0 }}>
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              bottom: 0,
              height: depth,
              transform: `rotateX(${surfaceTilt}deg)`,
              transformOrigin: "bottom center",
              background: "var(--rail-top)",
            }}
          />
        </div>
      )}
      <div
        style={{
          position: "relative",
          zIndex: 4,
          height: lipHeight,
          borderRadius: "var(--radius-rail)",
          background: "var(--rail-face)",
          boxShadow: "var(--shadow-rail)",
        }}
      />
    </div>
  );
}
