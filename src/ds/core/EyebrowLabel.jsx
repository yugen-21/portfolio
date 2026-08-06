import React from "react";

const TONES = {
  section: { fontSize: "var(--text-eyebrow)", letterSpacing: "var(--track-eyebrow)", color: "var(--text-muted)" },
  year:    { fontSize: "var(--text-caps-xs)", letterSpacing: "var(--track-cover)", color: "var(--text-eyebrow)" },
  caption: { fontSize: "var(--text-caps)", letterSpacing: "var(--track-caps)", color: "var(--mauve-500)" },
  lockup:  { fontSize: "var(--text-caps-xs)", letterSpacing: "var(--track-wide)", color: "var(--lilac-300)", paddingLeft: "0.42em" },
};

export function EyebrowLabel({ children, tone = "section", color, style }) {
  return (
    <div style={{
      fontFamily: "var(--font-sans)",
      textTransform: "uppercase",
      ...TONES[tone],
      ...(color ? { color } : null),
      ...style,
    }}>{children}</div>
  );
}
