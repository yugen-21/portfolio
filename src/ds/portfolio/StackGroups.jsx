import React from "react";

const LAYERS = [
  ["Frontend", ["React JS", "Tailwind CSS", "Bootstrap", "CSS", "styled-components", "Storybook"]],
  ["Backend", ["Node.js", "Express", "Python FastAPI"]],
  ["Data", ["MySQL", "PostgreSQL", "MongoDB"]],
  ["AI", ["Claude"]],
  ["Infra", ["Azure Cloud"]],
];

export function StackGroups({ stack = [], layers = LAYERS, style }) {
  const rows = layers
    .map(([label, members]) => [label, stack.filter((s) => members.indexOf(s) !== -1)])
    .filter((r) => r[1].length);
  const known = layers.reduce((all, l) => all.concat(l[1]), []);
  const other = stack.filter((s) => known.indexOf(s) === -1);
  if (other.length) rows.push(["Other", other]);
  if (!rows.length) return null;

  return (
    <div style={{ marginTop: 12, display: "grid", gap: 10, ...style }}>
      {rows.map(([label, items]) => (
        <div key={label} style={{ display: "grid", gridTemplateColumns: "76px 1fr", gap: 14, alignItems: "baseline" }}>
          <div style={{
            fontSize: "var(--text-caps-xs)", letterSpacing: "var(--track-caps)", textTransform: "uppercase",
            color: "var(--text-muted)", lineHeight: 1.5,
          }}>{label}</div>
          <div style={{ fontSize: "var(--text-ui)", lineHeight: 1.5, color: "var(--text-muted)" }}>
            {items.map((item, i) => (
              <React.Fragment key={item}>
                {i > 0 && <span style={{ color: "var(--text-muted)", padding: "0 8px" }}>·</span>}
                <span style={{ color: "var(--text-accent)" }}>{item}</span>
              </React.Fragment>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
