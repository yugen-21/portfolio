import React from "react";
import { FeedTheCat } from "./FeedTheCat.jsx";

/**
 * Shared by every view: a one-line credit on the left and the feed-the-cat
 * game in the right-hand corner. On a narrow screen the game wraps above the
 * credit (wrap-reverse) so it stays the first thing you reach.
 */
export function SiteFooter() {
  return (
    <footer
      style={{
        position: "relative",
        zIndex: 3,
        display: "flex",
        flexWrap: "wrap-reverse",
        alignItems: "flex-end",
        justifyContent: "space-between",
        gap: 28,
        padding: "clamp(56px, 8vw, 110px) var(--gutter-page) 32px",
      }}
    >
      <p style={{ margin: 0, fontSize: "var(--text-meta)", letterSpacing: "0.02em", color: "var(--text-muted)" }}>
        Designed and built by A. Shama Anjum, {new Date().getFullYear()}.
      </p>
      <FeedTheCat />
    </footer>
  );
}
