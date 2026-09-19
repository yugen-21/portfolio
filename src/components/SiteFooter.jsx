import React from "react";
import { FeedTheCat } from "./FeedTheCat.jsx";
import { DitherPrism } from "../ds/backdrop/DitherPrism.jsx";

/**
 * Shared by every view: a one-line credit on the left and the feed-the-cat
 * game in the right-hand corner. On a narrow screen the game wraps above the
 * credit (wrap-reverse) so it stays the first thing you reach.
 *
 * Behind it, the hero's light layer again, to close the page the way it opened
 * — flipped, so its bright corner falls on the left rather than the right, and
 * masked the other way, so it fades in from nothing as you come down. It starts
 * above the footer's own box, so the glow reaches up under the contact section.
 *
 * The footer itself therefore carries no z-index: that would make a stacking
 * context and trap the layer inside it, painting the glow over the contact
 * cards instead of under them. The layer sits at z-2 and the footer's own
 * content at z-3, which is where the rest of the page's content lives too — so
 * the cards above win on document order, and the credit and the game still
 * read over their own glow.
 */

// Solid at the foot of the page, gone by the top of the layer
const FOOT_FADE = "linear-gradient(to top, #000 52%, transparent 100%)";

const CONTENT = { position: "relative", zIndex: 3 };

export function SiteFooter() {
  return (
    <footer
      style={{
        position: "relative",
        display: "flex",
        flexWrap: "wrap-reverse",
        /* wrap-reverse flips the cross axis, so flex-start is the visual bottom:
           this is what sits the credit on the same line as the widget's foot */
        alignItems: "flex-start",
        justifyContent: "space-between",
        gap: 28,
        /* Tight at the foot, so the credit line sits on the bottom of the page
           rather than floating above a band of empty space */
        padding: "clamp(56px, 8vw, 110px) var(--gutter-page) 14px",
      }}
    >
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          top: "clamp(-360px, -24vw, -200px)",
          zIndex: 2,
          overflow: "hidden",
          pointerEvents: "none",
        }}
      >
        <DitherPrism
          color1="#000000"
          color2="#07020f"
          color3="#3b0f7a"
          glow="#9d84c9"
          speed={0.6}
          ditherIntensity={0.12}
          prismIntensity={0.25}
          mouseIntensity={0}
          style={{
            // The 45deg gradient puts the bright corner top right; down here it
            // belongs on the left
            transform: "scaleX(-1)",
            maskImage: FOOT_FADE,
            WebkitMaskImage: FOOT_FADE,
          }}
        />
      </div>

      <p style={{ ...CONTENT, margin: 0, fontSize: "var(--text-meta)", letterSpacing: "0.02em", color: "var(--text-muted)" }}>
        Designed and built by Shama Anjum, {new Date().getFullYear()}.
      </p>
      <div style={CONTENT}>
        <FeedTheCat />
      </div>
    </footer>
  );
}
