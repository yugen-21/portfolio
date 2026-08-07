import React from "react";

/**
 * Shared presentation primitives for the Foundations stories.
 *
 * Every value shown is read live off `:root` with getComputedStyle, so these
 * pages cannot drift from src/styles/tokens/*.css — edit a token, the story
 * updates. Nothing here is hardcoded except the token *names*.
 */

/** Resolves a custom property, following `var(--x)` indirection a few hops. */
export function readVar(name, depth = 4) {
  if (typeof window === "undefined") return "";
  let value = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  let hops = 0;
  while (value.startsWith("var(") && hops < depth) {
    const inner = value.slice(4, value.indexOf(")")).trim();
    const next = getComputedStyle(document.documentElement).getPropertyValue(inner).trim();
    if (!next) break;
    value = next;
    hops += 1;
  }
  return value;
}

/** Re-reads token values after mount so SSR/first paint never shows blanks. */
export function useVars(names) {
  const [values, setValues] = React.useState({});
  // Token name lists are module constants, so a joined key is a stable dep.
  const key = names.join("|");
  React.useEffect(() => {
    const read = () => {
      const next = {};
      key.split("|").forEach((n) => { next[n] = readVar(n); });
      setValues(next);
    };
    read();
    // Fonts can shift computed sizes that use ch/em units.
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(read).catch(() => {});
  }, [key]);
  return values;
}

export const Page = ({ title, intro, children }) => (
  <div style={{ fontFamily: "var(--font-sans)", color: "var(--text-primary)", maxWidth: 1100 }}>
    <h1 style={{
      margin: 0, fontFamily: "var(--font-display)", fontWeight: 400,
      fontSize: "var(--text-h2)", lineHeight: "var(--leading-heading)", color: "var(--text-display)",
    }}>{title}</h1>
    {intro && (
      <p style={{
        margin: "14px 0 0", maxWidth: "62ch", fontSize: "var(--text-panel)",
        lineHeight: "var(--leading-panel)", color: "var(--text-body)", textWrap: "pretty",
      }}>{intro}</p>
    )}
    <div style={{ marginTop: 36 }}>{children}</div>
  </div>
);

export const Section = ({ title, note, children }) => (
  <section style={{ marginBottom: 48 }}>
    <div style={{
      fontSize: "var(--text-eyebrow)", letterSpacing: "var(--track-eyebrow)",
      textTransform: "uppercase", color: "var(--text-muted)",
    }}>{title}</div>
    {note && (
      <div style={{ marginTop: 8, fontSize: "var(--text-ui)", color: "var(--text-body)", maxWidth: "70ch" }}>{note}</div>
    )}
    <div style={{ marginTop: 18 }}>{children}</div>
  </section>
);

export const Mono = ({ children, dim }) => (
  <code style={{
    fontFamily: "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace",
    fontSize: 11.5,
    color: dim ? "var(--text-muted)" : "var(--text-accent)",
    wordBreak: "break-all",
  }}>{children}</code>
);

export const Grid = ({ min = 180, gap = 14, children }) => (
  <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fill, minmax(${min}px, 1fr))`, gap }}>
    {children}
  </div>
);

/** A colour chip with its token name and resolved value. */
export const Swatch = ({ name, value }) => {
  const [copied, setCopied] = React.useState(false);
  const copy = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(`var(${name})`).then(() => {
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1100);
      }).catch(() => {});
    }
  };
  return (
    <button
      onClick={copy}
      title={`Copy var(${name})`}
      style={{
        display: "block", textAlign: "left", padding: 0, cursor: "pointer",
        border: "1px solid var(--border-hairline)", borderRadius: "var(--radius-sm)",
        background: "rgba(255,255,255,0.02)", overflow: "hidden", font: "inherit", color: "inherit",
      }}
    >
      <div style={{ height: 62, background: value, borderBottom: "1px solid var(--border-hairline)" }} />
      <div style={{ padding: "9px 10px 10px" }}>
        <div style={{ fontSize: "var(--text-meta)", color: "var(--text-display)" }}>{name.replace(/^--/, "")}</div>
        <div style={{ marginTop: 3 }}><Mono dim>{copied ? "copied" : value || "—"}</Mono></div>
      </div>
    </button>
  );
};

/** Name / value / preview row used by the scale tables. */
export const TokenRow = ({ name, value, children, labelWidth = 190 }) => (
  <div style={{
    display: "grid", gridTemplateColumns: `${labelWidth}px 110px 1fr`, gap: 18,
    alignItems: "center", padding: "12px 0", borderTop: "1px solid var(--border-hairline)",
  }}>
    <Mono>{name}</Mono>
    <Mono dim>{value || "—"}</Mono>
    <div style={{ minWidth: 0 }}>{children}</div>
  </div>
);
