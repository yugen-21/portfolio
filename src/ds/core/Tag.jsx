import React from "react";

export function Tag({ children }) {
  return (
    <span style={{
      fontFamily: "var(--font-sans)",
      fontSize: "var(--text-chip)",
      padding: "7px 14px",
      borderRadius: "var(--radius-pill)",
      border: "1px solid var(--border-chip)",
      background: "var(--tint-chip)",
      color: "#e0d1fb",
      whiteSpace: "nowrap",
    }}>{children}</span>
  );
}
