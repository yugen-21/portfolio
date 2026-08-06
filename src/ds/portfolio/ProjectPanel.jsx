import React from "react";
import { SpecularButton } from "../core/SpecularButton.jsx";
import { EyebrowLabel } from "../core/EyebrowLabel.jsx";
import { StackGroups } from "./StackGroups.jsx";

export function ProjectPanel({ project, onClose }) {
  if (!project) return null;
  const { year, name, role, problem, blurb, bullets = [], stack = [], links = [] } = project;
  return (
    <div
      onClick={(e) => { if (!e.target.closest("[data-panel]")) onClose && onClose(); }}
      style={{
        position: "fixed", inset: 0, zIndex: 50,
        background: "var(--surface-backdrop)", backdropFilter: "blur(var(--blur-backdrop))",
        display: "flex", alignItems: "flex-start", justifyContent: "center",
        padding: "5vh 20px", overflowY: "auto", fontFamily: "var(--font-sans)",
      }}
    >
      <div data-panel="1" style={{
        width: "var(--panel-width)", background: "var(--surface-panel)",
        border: "1px solid var(--border-panel)", borderRadius: "var(--radius-md)",
        padding: "var(--pad-panel)", boxShadow: "var(--shadow-panel)",
        animation: "rise var(--dur-rise) var(--ease-rise)",
      }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 20 }}>
          <div>
            <EyebrowLabel tone="section" style={{ color: "var(--text-eyebrow)" }}>{year}</EyebrowLabel>
            <h2 style={{ margin: "10px 0 0", fontFamily: "var(--font-display)", fontWeight: 400, fontSize: "var(--text-h2)", lineHeight: "var(--leading-heading)", color: "var(--white-pure)" }}>{name}</h2>
            <div style={{ marginTop: 8, fontSize: "var(--text-ui)", color: "var(--mauve-200)" }}>{role}</div>
          </div>
          <button onClick={onClose} style={{
            flex: "none", width: 38, height: 38, borderRadius: "var(--radius-pill)",
            border: "1px solid var(--border-close)", background: "transparent",
            color: "var(--violet-100)", fontSize: 17, lineHeight: 1, cursor: "pointer",
          }}>&times;</button>
        </div>

        {links.length > 0 && (
          <div style={{ marginTop: 22, display: "flex", flexWrap: "wrap", gap: 10 }}>
            {links.map((l) => <SpecularButton key={l.href + l.label} href={l.href} size="sm" radius={999} variant={l.variant || "outline"}>{l.label}</SpecularButton>)}
          </div>
        )}

        <EyebrowLabel style={{ marginTop: 30 }}>The problem</EyebrowLabel>
        <p style={{ margin: "12px 0 0", paddingLeft: 16, borderLeft: "2px solid var(--rule-quote)", fontSize: "var(--text-panel)", lineHeight: "var(--leading-panel)", color: "var(--text-panel-body)", textWrap: "pretty" }}>{problem}</p>

        <EyebrowLabel style={{ marginTop: 30 }}>What it does</EyebrowLabel>
        <p style={{ margin: "12px 0 0", fontSize: "var(--text-panel)", lineHeight: 1.65, color: "var(--white-fog)", textWrap: "pretty" }}>{blurb}</p>

        <EyebrowLabel style={{ marginTop: 26 }}>Highlights</EyebrowLabel>
        <ul style={{ margin: "14px 0 0", padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 10 }}>
          {bullets.map((b, i) => (
            <li key={i} style={{ display: "flex", gap: 12, fontSize: "var(--text-list)", lineHeight: "var(--leading-list)", color: "var(--text-list)" }}>
              <span style={{ flex: "none", color: "var(--accent)" }}>&mdash;</span><span>{b}</span>
            </li>
          ))}
        </ul>

        <EyebrowLabel style={{ marginTop: 30 }}>Stack</EyebrowLabel>
        <StackGroups stack={stack} />
      </div>
    </div>
  );
}
