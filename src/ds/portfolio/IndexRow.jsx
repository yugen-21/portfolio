import React from "react";

export function IndexRow({ year, name, onClick }) {
  const [hover, setHover] = React.useState(false);
  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: "block",
        margin: 0,
        border: 0,
        textAlign: "left",
        color: "inherit",
        cursor: "pointer",
        padding: "8px 10px",
        borderRadius: "var(--radius-sm)",
        background: hover ? "var(--tint-row-hover)" : "transparent",
        transition: "background var(--dur-fast)",
        fontFamily: "var(--font-sans)",
      }}
    >
      <div style={{ fontSize: "var(--text-meta)", color: "var(--text-muted)", letterSpacing: "0.04em" }}>{year}</div>
      <div style={{ fontSize: "var(--text-list)", color: "var(--white-dim)", marginTop: 4 }}>{name}</div>
    </button>
  );
}
