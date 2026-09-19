import React from "react";
import { EyebrowLabel } from "../ds/core/EyebrowLabel.jsx";
import { QUOTES } from "../data/about.js";

/**
 * Three lines from The Office, each with Shama's own answer ruled off beside
 * it: the quote on the left, what she stands by on the right, a hairline
 * between them. Marginalia rather than a caption, so the note reads as an
 * answer to the quote instead of an explanation of it.
 *
 * The pair is one block held in the middle of the page — the two columns sit
 * against the rule between them rather than being thrown out to either margin,
 * which is what a full-width grid does to two short columns.
 *
 * It advances on its own but holds the moment a pointer or the keyboard is on
 * it, so nothing gets pulled away mid-read. Arrows step through; the squares
 * between them say where you are.
 *
 * The Gretzky line is a whiteboard gag — Michael wrote his own name under
 * Gretzky's — so a quote can carry a second attribution, set under the first
 * and indented the way it was on the board.
 */

const HOLD_MS = 5000;
const STACK_BELOW = 820;

const reducedMotion = () => window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
const stackedNow = () => typeof window !== "undefined" && window.innerWidth < STACK_BELOW;

function useStacked() {
  const [stacked, setStacked] = React.useState(stackedNow);
  React.useEffect(() => {
    const onResize = () => setStacked(stackedNow());
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);
  return stacked;
}

function Attribution({ name, indent = 0 }) {
  return (
    <div
      style={{
        marginLeft: indent,
        fontSize: "var(--text-caps)",
        letterSpacing: "var(--track-caps)",
        textTransform: "uppercase",
        color: indent ? "var(--text-accent)" : "var(--text-muted)",
      }}
    >
      &mdash; {name}
    </div>
  );
}

function Step({ label, glyph, onClick }) {
  const [hover, setHover] = React.useState(false);
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        width: 26,
        height: 26,
        display: "grid",
        placeItems: "center",
        padding: 0,
        border: 0,
        background: "transparent",
        color: hover ? "var(--violet-300)" : "var(--text-muted)",
        fontSize: 17,
        lineHeight: 1,
        cursor: "pointer",
        transition: "color var(--dur-fast) ease",
      }}
    >
      {glyph}
    </button>
  );
}

function Controls({ count, current, onPick, onStep }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, marginTop: 30 }}>
      <Step label="Previous quote" glyph="&#8249;" onClick={() => onStep(-1)} />
      <div style={{ display: "flex", gap: 9, padding: "0 6px" }}>
        {Array.from({ length: count }, (_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => onPick(i)}
            aria-label={`Show quote ${i + 1} of ${count}`}
            aria-current={i === current}
            style={{
              width: 8,
              height: 8,
              padding: 0,
              border: `1px solid ${i === current ? "var(--violet-400)" : "var(--mauve-600)"}`,
              borderRadius: 0,
              background: i === current ? "var(--violet-400)" : "transparent",
              cursor: "pointer",
              transition: "background var(--dur-fast) ease, border-color var(--dur-fast) ease",
            }}
          />
        ))}
      </div>
      <Step label="Next quote" glyph="&#8250;" onClick={() => onStep(1)} />
    </div>
  );
}

export function AnnotatedQuotes({ quotes = QUOTES }) {
  const [index, setIndex] = React.useState(0);
  const [held, setHeld] = React.useState(false);
  const stacked = useStacked();
  const cardRef = React.useRef(null);
  const first = React.useRef(true);

  const step = React.useCallback(
    (by) => setIndex((i) => (i + by + quotes.length) % quotes.length),
    [quotes.length],
  );

  React.useEffect(() => {
    if (held || quotes.length < 2 || reducedMotion()) return undefined;
    const timer = window.setTimeout(() => step(1), HOLD_MS);
    return () => window.clearTimeout(timer);
  }, [index, held, quotes.length, step]);

  // Fade the new card in, but not the one that was there on arrival
  React.useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    if (reducedMotion()) return;
    cardRef.current?.animate(
      [
        { opacity: 0, transform: "translateY(8px)" },
        { opacity: 1, transform: "none" },
      ],
      { duration: 380, easing: "cubic-bezier(0.2, 0.8, 0.2, 1)" },
    );
  }, [index]);

  const quote = quotes[index];

  return (
    <div
      onPointerEnter={() => setHeld(true)}
      onPointerLeave={() => setHeld(false)}
      onFocusCapture={() => setHeld(true)}
      onBlurCapture={() => setHeld(false)}
    >
      <figure
        style={{
          position: "relative",
          /* The block, not the page: this is what keeps the two columns
             together in the middle instead of at either margin */
          width: "fit-content",
          maxWidth: "100%",
          margin: "0 auto",
          padding: "clamp(30px, 3.6vw, 46px) 0 clamp(22px, 2.6vw, 30px)",
          borderTop: "1px solid var(--border-hairline)",
          borderBottom: "1px solid var(--border-hairline)",
        }}
      >
        <div
          ref={cardRef}
          style={{
            display: "grid",
            gridTemplateColumns: stacked ? "minmax(0, 1fr)" : "minmax(0, 27rem) minmax(0, 21rem)",
            gap: stacked ? 26 : 0,
            alignItems: "stretch",
            minHeight: stacked ? undefined : "clamp(190px, 17vw, 230px)",
          }}
        >
          {/* The quote */}
          <div style={{ position: "relative", paddingRight: stacked ? 0 : "clamp(22px, 2.4vw, 34px)" }}>
            <span
              aria-hidden="true"
              style={{
                position: "absolute",
                top: "-0.44em",
                left: "-0.06em",
                fontFamily: "var(--font-display)",
                fontSize: "clamp(96px, 10vw, 140px)",
                lineHeight: 1,
                color: "var(--violet-600)",
                opacity: 0.14,
                pointerEvents: "none",
                userSelect: "none",
              }}
            >
              &ldquo;
            </span>
            <blockquote
              style={{
                position: "relative",
                margin: 0,
                fontFamily: "var(--font-display)",
                fontWeight: 400,
                fontSize: "clamp(24px, 2.7vw, 36px)",
                lineHeight: 1.22,
                letterSpacing: "var(--track-snug)",
                color: "var(--text-display)",
                textWrap: "pretty",
              }}
            >
              {quote.text}
            </blockquote>
            <div style={{ marginTop: 18, display: "flex", flexDirection: "column", gap: 5 }}>
              <Attribution name={quote.attribution} />
              {quote.via && <Attribution name={quote.via} indent={34} />}
            </div>
          </div>

          {/* The answer, ruled off from the quote */}
          <div
            style={{
              paddingLeft: stacked ? 0 : "clamp(22px, 2.4vw, 34px)",
              paddingTop: stacked ? 22 : 4,
              borderLeft: stacked ? "none" : "1px solid var(--border-hairline)",
              borderTop: stacked ? "1px solid var(--border-hairline)" : "none",
            }}
          >
            <EyebrowLabel style={{ color: "var(--text-accent)", marginBottom: 13 }}>
              What I stand by
            </EyebrowLabel>
            <p
              style={{
                margin: 0,
                fontSize: "var(--text-ui)",
                lineHeight: "var(--leading-list)",
                color: "var(--text-panel-body)",
                textWrap: "pretty",
              }}
            >
              {quote.note}
            </p>
          </div>
        </div>

        <Controls count={quotes.length} current={index} onPick={setIndex} onStep={step} />
      </figure>
    </div>
  );
}
