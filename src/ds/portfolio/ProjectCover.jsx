import React from "react";
import { EyebrowLabel } from "../core/EyebrowLabel.jsx";

export function ProjectCover({ year, caption, background, captionColor, children, lifted = false, onClick }) {
  const [hover, setHover] = React.useState(false);
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        position: "relative",
        width: "var(--cover-size)",
        aspectRatio: "1",
        overflow: "hidden",
        cursor: "pointer",
        background,
        transformOrigin: "bottom center",
        transform: lifted ? "translateY(-22px) scale(1.06)" : hover ? "scale(1.04)" : "none",
        boxShadow: lifted ? "var(--shadow-cover-lift)" : "var(--shadow-cover)",
        transition: "transform var(--dur-cover) var(--ease-cover), box-shadow var(--dur-cover) ease",
      }}
    >
      {children}
      <EyebrowLabel tone="year" color={captionColor} style={{ position: "absolute", left: 18, top: 18 }}>{year}</EyebrowLabel>
      <EyebrowLabel tone="caption" color={captionColor} style={{ position: "absolute", left: 18, right: 18, bottom: 20 }}>{caption}</EyebrowLabel>
      <div style={{
        position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center",
        background: "var(--surface-cover-scrim)", backdropFilter: "blur(var(--blur-scrim))",
        opacity: hover ? 1 : 0, transition: "opacity var(--dur-hover)",
      }}>
        <span style={{
          fontSize: "var(--text-button-sm)", fontWeight: "var(--weight-medium)",
          padding: "11px 24px", borderRadius: "var(--radius-pill)",
          background: "rgba(245,238,255,0.95)", color: "var(--text-on-light)",
        }}>Open</span>
      </div>
    </div>
  );
}
