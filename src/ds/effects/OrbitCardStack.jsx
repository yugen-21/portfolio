import React from "react";
import { motion, useScroll, useTransform, useMotionValue, useReducedMotion, cubicBezier } from "framer-motion";
import { LuArrowUpRight } from "react-icons/lu";
import { EyebrowLabel } from "../core/EyebrowLabel.jsx";
import "./OrbitCardStack.css";

/**
 * A tight deck of link cards that scatters as you scroll down through it and
 * gathers back into the deck as you scroll up. Ported from Componentry's Orbit
 * Card Stack (https://componentry.dev/docs/components/orbit-card-stack); the
 * deck and fan geometry are the original's, the trigger is not.
 *
 * Departures from the original, all deliberate:
 * - The fan is driven by scroll progress, not hover or focus. It is fully
 *   reversible, so scrolling back up re-forms the deck.
 * - Each card is a link, so the arrow-key roving and the "active card" state
 *   are gone; Tab moves through them in order. Hover or focus only lifts the
 *   card a few pixels and brings it to the front (see OrbitCardStack.css).
 * - Where the fan cannot fit side by side (phones), the cards cascade down
 *   instead, each lower card over the one above, so every card's icon and name
 *   stay visible.
 * - Portraits are replaced by an icon panel; styling is inline against the
 *   tokens because nothing under ds/ is scanned by Tailwind.
 *
 * The outer box sets the scroll distance (240vh by default, override through
 * `style`). Progress runs 0..1 from its top meeting the viewport top to its
 * bottom meeting the viewport bottom:
 *   0 – 0.12  deck pinned and closed
 *   0.12 – 0.7  cards scatter
 *   0.7 – 1  scattered, held
 * With reduced motion the cards sit scattered and nothing moves.
 */

const CARD_WIDTH = "min(76vw, 20rem)";
const PANEL_HEIGHT = "clamp(88px, min(20vw, 22vh), 180px)";
const EDGE = 16;
const SCATTER_EASE = cubicBezier(0.65, 0, 0.35, 1);

const lerp = (a, b, t) => a + (b - a) * t;

function OrbitCard({ item, index, count, restingIndex, layout, t, raised, onRaise }) {
  const orbit = index - (count - 1) / 2;
  const stack = index - restingIndex;
  const fan = layout.mode === "fan";

  const closed = { x: stack * 10, y: Math.abs(stack) * 5, rotate: stack * 2.8 };
  const open = fan
    ? { x: orbit * layout.spreadX, y: Math.abs(orbit) * 30 + Math.max(0, Math.abs(orbit) - 1) * 10, rotate: orbit * 8.5 }
    : { x: orbit * layout.spreadX, y: orbit * layout.spreadY, rotate: orbit * 3 };

  const x = useTransform(t, (v) => lerp(closed.x, open.x, v));
  const y = useTransform(t, (v) => lerp(closed.y, open.y, v));
  const rotate = useTransform(t, (v) => lerp(closed.rotate, open.rotate, v));
  const scale = useTransform(t, (v) => lerp(0.97, 0.985, v));

  // Deck: resting card on top. Cascade: each lower card over the one above.
  const deckZ = index === restingIndex ? 80 : 50 - Math.abs(stack);
  const openZ = fan ? deckZ : 50 + index;
  const zIndex = useTransform(t, (v) => (v < 0.5 ? deckZ : openZ));

  const hair = item.light ? "rgba(0,0,0,0.1)" : "rgba(255,255,255,0.09)";

  return (
    <motion.li
      data-orbit-card=""
      style={{
        gridArea: "1 / 1",
        width: CARD_WIDTH,
        listStyle: "none",
        transformOrigin: "50% 100%",
        x,
        y,
        rotate,
        scale,
        zIndex: raised ? 90 : zIndex,
      }}
    >
      <a
        className="orbit-card"
        href={item.href}
        target={item.external ? "_blank" : undefined}
        rel={item.external ? "noopener noreferrer" : undefined}
        aria-label={`${item.name}, ${item.handle}${item.external ? " (opens in a new tab)" : ""}`}
        onMouseEnter={() => onRaise(index)}
        onMouseLeave={() => onRaise(null)}
        onFocus={() => onRaise(index)}
        onBlur={() => onRaise(null)}
      >
        <div
          className="orbit-card__face"
          style={{
            padding: 14,
            borderRadius: 26,
            border: `1px solid ${hair}`,
            background: item.bg,
            color: item.fg,
          }}
        >
          <div
            style={{
              position: "relative",
              height: PANEL_HEIGHT,
              overflow: "hidden",
              borderRadius: "var(--radius-md)",
              border: `1px solid ${hair}`,
              background: item.light ? "rgba(0,0,0,0.045)" : "rgba(255,255,255,0.04)",
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: 0,
                opacity: 0.5,
                background: `radial-gradient(circle at 22% 24%, ${item.accent}, transparent 48%), radial-gradient(circle at 86% 80%, ${item.light ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.14)"}, transparent 40%)`,
              }}
            />
            <span style={{ position: "absolute", left: 18, bottom: 14, display: "flex", fontSize: "clamp(32px, 3.2vw, 46px)" }}>
              {item.icon}
            </span>
            <span
              style={{
                position: "absolute",
                right: 12,
                top: 12,
                display: "grid",
                placeItems: "center",
                width: 42,
                height: 42,
                borderRadius: "50%",
                background: item.light ? "var(--ink-600)" : item.fg,
                color: item.bg,
                boxShadow: "0 8px 18px -8px rgba(0,0,0,0.5)",
              }}
            >
              <LuArrowUpRight size={18} aria-hidden="true" />
            </span>
          </div>

          <div style={{ padding: "18px 6px 4px" }}>
            <EyebrowLabel color={item.fg} style={{ opacity: 0.62 }}>{item.role}</EyebrowLabel>
            <h3
              style={{
                margin: "8px 0 0",
                fontFamily: "var(--font-display)",
                fontWeight: 400,
                fontSize: "clamp(28px, 2.4vw, 34px)",
                lineHeight: 1,
                letterSpacing: "var(--track-snug)",
              }}
            >
              {item.name}
            </h3>
            <p
              style={{
                margin: "12px 0 0",
                fontSize: "var(--text-list)",
                lineHeight: 1.45,
                opacity: 0.78,
                textWrap: "pretty",
              }}
            >
              {item.description}
            </p>
            <div
              style={{
                marginTop: 16,
                paddingTop: 12,
                borderTop: `1px solid ${hair}`,
                fontSize: "var(--text-meta)",
                letterSpacing: "0.02em",
                opacity: 0.72,
                overflowWrap: "anywhere",
              }}
            >
              {item.handle}
            </div>
          </div>
        </div>
      </a>
    </motion.li>
  );
}

export function OrbitCardStack({
  items,
  eyebrow,
  title,
  defaultActiveIndex,
  spread = 360,
  className,
  style,
}) {
  const reduceMotion = useReducedMotion() ?? false;
  const rootRef = React.useRef(null);
  const deckRef = React.useRef(null);
  const count = items.length;
  const restingIndex = Math.min(Math.max(0, defaultActiveIndex ?? Math.floor(count / 2)), count - 1);
  const [layout, setLayout] = React.useState({ mode: "fan", spreadX: 0, spreadY: 0 });
  const [raised, setRaised] = React.useState(null);

  const { scrollYProgress } = useScroll({ target: rootRef, offset: ["start start", "end end"] });
  const scrolled = useTransform(scrollYProgress, [0.12, 0.7], [0, 1], { ease: SCATTER_EASE });
  const settled = useMotionValue(1);
  const t = reduceMotion ? settled : scrolled;

  // Fan side by side when there is room, cascade down when there is not.
  React.useLayoutEffect(() => {
    const deck = deckRef.current;
    if (!deck) return undefined;
    const measure = () => {
      const cards = [...deck.querySelectorAll("[data-orbit-card]")];
      if (!cards.length) return;
      const w = deck.clientWidth;
      const h = deck.clientHeight;
      const cardW = cards[0].offsetWidth;
      const cardH = Math.max(...cards.map((c) => c.offsetHeight));
      const gaps = Math.max(1, count - 1);
      // an outer card tilted 8.5° about its base swings its top out by ~0.15 × its height
      const roomX = (w - EDGE * 2 - cardW - cardH * 0.3) / gaps;
      const fanX = Math.min(spread, roomX);
      // a card tilted 3° about its base lifts its far top corner by ~0.05 × its width
      const tilt = cardW * 0.05;
      const next = fanX >= cardW * 0.72
        ? { mode: "fan", spreadX: Math.round(fanX), spreadY: 0 }
        : {
            mode: "cascade",
            spreadX: Math.round(Math.max(0, Math.min(14, (w - EDGE * 2 - cardW) / gaps))),
            spreadY: Math.round(Math.max(0, Math.min(cardH * 0.6, (h - EDGE * 2 - cardH - tilt * 2) / gaps))),
          };
      setLayout((prev) => (prev.mode === next.mode && prev.spreadX === next.spreadX && prev.spreadY === next.spreadY ? prev : next));
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(deck);
    deck.querySelectorAll("[data-orbit-card]").forEach((card) => observer.observe(card));
    return () => observer.disconnect();
  }, [count, spread]);

  return (
    <div ref={rootRef} className={className} style={{ position: "relative", width: "100%", height: reduceMotion ? "auto" : "240vh", ...style }}>
      <div
        className="h-screen-safe"
        style={{ position: "sticky", top: 0, display: "flex", flexDirection: "column", overflow: "hidden" }}
      >
        {(eyebrow || title) && (
          <div style={{ padding: "clamp(40px, 11vh, 120px) var(--gutter-page) 0", textAlign: "center" }}>
            {eyebrow && <EyebrowLabel>{eyebrow}</EyebrowLabel>}
            {title && (
              <h2
                style={{
                  margin: eyebrow ? "12px 0 0" : 0,
                  fontFamily: "var(--font-display)",
                  fontWeight: 400,
                  fontSize: "var(--text-h2)",
                  lineHeight: "var(--leading-heading)",
                  letterSpacing: "var(--track-snug)",
                  color: "var(--text-display)",
                }}
              >
                {title}
              </h2>
            )}
          </div>
        )}

        <ul
          ref={deckRef}
          aria-label={title || "Links"}
          style={{
            position: "relative",
            flex: 1,
            minHeight: 0,
            margin: 0,
            padding: `${EDGE}px`,
            display: "grid",
            placeItems: "center",
          }}
        >
          {items.map((item, index) => (
            <OrbitCard
              key={item.name}
              item={item}
              index={index}
              count={count}
              restingIndex={restingIndex}
              layout={layout}
              t={t}
              raised={raised === index}
              onRaise={setRaised}
            />
          ))}
        </ul>
      </div>
    </div>
  );
}
