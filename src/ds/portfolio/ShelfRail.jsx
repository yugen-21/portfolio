import React from "react";

export function ShelfRail({ pullUp = 66 }) {
  return (
    <div style={{
      height: 12,
      width: "var(--rail-width)",
      margin: `-${pullUp}px auto 0`,
      position: "relative",
      zIndex: 4,
      borderRadius: "var(--radius-rail)",
      background: "var(--rail-face)",
      boxShadow: "var(--shadow-rail)",
    }} />
  );
}
