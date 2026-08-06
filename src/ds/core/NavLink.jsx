import React from "react";

export function NavLink({ children, href, emphasis = "quiet", external = false }) {
  const [hover, setHover] = React.useState(false);
  const quiet = {
    fontSize: "var(--text-ui)",
    padding: "9px 14px",
    borderRadius: "var(--radius-pill)",
    color: hover ? "var(--white-pure)" : "#d9c8f5",
    background: hover ? "var(--tint-hover)" : "transparent",
  };
  const strong = {
    fontSize: "var(--text-ui)",
    fontWeight: "var(--weight-medium)",
    padding: "10px 20px",
    borderRadius: "var(--radius-pill)",
    background: hover ? "var(--fill-light-hover)" : "var(--fill-light)",
    color: hover ? "var(--text-on-light-strong)" : "var(--text-on-light)",
    border: "1px solid var(--border-on-light-strong)",
  };
  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noreferrer" : undefined}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        fontFamily: "var(--font-sans)",
        textDecoration: "none",
        transition: "background var(--dur-fast) ease, color var(--dur-fast) ease",
        ...(emphasis === "strong" ? strong : quiet),
      }}
    >
      {children}
    </a>
  );
}
