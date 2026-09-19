import React from "react";
import { motion, useScroll, useTransform, useMotionTemplate } from "framer-motion";
import { EyebrowLabel } from "../core/EyebrowLabel.jsx";

/**
 * One image that splits into three panels as you scroll, then flips each panel
 * over to reveal a card. Ported from Componentry's Scroll Split Card
 * (https://componentry.dev/docs/components/scroll-split-card); the motion curve
 * is unchanged, the styling is rewritten inline against the tokens because
 * nothing under ds/ is scanned by Tailwind.
 *
 * Departures from the original, all deliberate:
 * - The image is `cover`, not stretched `100% 100%`, so a painting keeps its
 *   proportions. Each panel holds a 300%-wide copy offset by its index, so the
 *   three slices still line up into one picture before the split.
 * - Card height and the final lift are viewport-relative, so a short screen
 *   does not push the cards off the top.
 * - The grain is an inline SVG turbulence rather than a remote PNG.
 * - The start and end captions are props.
 *
 * The outer box sets the scroll distance (500vh by default, override through
 * `style`). Progress runs 0..1 from its top meeting the viewport top to its
 * bottom meeting the viewport bottom:
 *   0 – 0.4  panels separate and scale down
 *   0.4 – 0.8  panels flip, then close back in
 *   0.8 – 1  cards lift and the end caption rises
 */

const GRAIN = `url("data:image/svg+xml;utf8,${encodeURIComponent(
  "<svg xmlns='http://www.w3.org/2000/svg' width='256' height='256'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/></filter><rect width='100%' height='100%' filter='url(#n)'/></svg>",
)}")`;

const CARD_HEIGHT = "clamp(340px, 56vh, 440px)";

export function ScrollSplitCard({
  imageSrc,
  imagePosition = "center",
  cards,
  containerRef: externalContainerRef,
  startLabel = "Scroll down",
  endLabel,
  className,
  style,
}) {
  const containerRef = React.useRef(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    container: externalContainerRef,
    offset: ["start start", "end end"],
  });

  // Separate (0 → 0.4), then close back in while flipping (0.4 → 0.8)
  const leftX = useTransform(scrollYProgress, [0, 0.4, 0.8], [0, -48, -24]);
  const rightX = useTransform(scrollYProgress, [0, 0.4, 0.8], [0, 48, 24]);
  const scale = useTransform(scrollYProgress, [0, 0.4], [1, 0.9]);

  // After the 180° Y flip, positive Z reads as counter-clockwise
  const rotateY = useTransform(scrollYProgress, [0.4, 0.8], [0, 180]);
  const rotateZLeft = useTransform(scrollYProgress, [0.4, 0.8], [0, 6]);
  const rotateZRight = useTransform(scrollYProgress, [0.4, 0.8], [0, -6]);

  // Square inner corners and no edge light at rest, so it reads as one flat image
  const radiusLeft = useTransform(scrollYProgress, [0, 0.2], ["18px 0px 0px 18px", "18px 18px 18px 18px"]);
  const radiusMiddle = useTransform(scrollYProgress, [0, 0.2], ["0px 0px 0px 0px", "18px 18px 18px 18px"]);
  const radiusRight = useTransform(scrollYProgress, [0, 0.2], ["0px 18px 18px 0px", "18px 18px 18px 18px"]);
  const borderOpacity = useTransform(scrollYProgress, [0, 0.2], [0, 0.2]);
  const shadowOpacity = useTransform(scrollYProgress, [0, 0.2], [0, 0.4]);
  const boxShadow = useMotionTemplate`inset 0 1px 1px rgba(255, 255, 255, ${borderOpacity}), inset 0 -24px 48px rgba(0, 0, 0, ${shadowOpacity}), 0 25px 50px -12px rgba(0, 0, 0, ${shadowOpacity})`;

  const cardsY = useTransform(scrollYProgress, [0.8, 1], ["0vh", "-22vh"]);

  const endOpacity = useTransform(scrollYProgress, [0.8, 1], [0, 1]);
  const endY = useTransform(scrollYProgress, [0.8, 1], [40, 0]);
  const startOpacity = useTransform(scrollYProgress, [0, 0.1], [1, 0]);
  const startY = useTransform(scrollYProgress, [0, 0.1], [0, 20]);

  const radiusFor = (i) => (i === 0 ? radiusLeft : i === 2 ? radiusRight : radiusMiddle);

  return (
    <div ref={containerRef} className={className} style={{ position: "relative", width: "100%", height: "500vh", ...style }}>
      <div
        className="h-screen-safe"
        style={{
          position: "sticky",
          top: 0,
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          perspective: 1200,
        }}
      >
        <motion.h2
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: `max(24px, calc(50% - ${CARD_HEIGHT} / 2 - 56px))`,
            margin: 0,
            fontWeight: 400,
            textAlign: "center",
            opacity: startOpacity,
            y: startY,
          }}
        >
          <EyebrowLabel>{startLabel}</EyebrowLabel>
        </motion.h2>

        <motion.div
          style={{
            position: "relative",
            display: "flex",
            width: "100%",
            maxWidth: 896,
            height: CARD_HEIGHT,
            padding: "0 16px",
            scale,
            y: cardsY,
            transformStyle: "preserve-3d",
          }}
        >
          {cards.slice(0, 3).map((card, i) => (
            <motion.div
              key={card.title}
              style={{
                position: "relative",
                flex: 1,
                height: "100%",
                x: i === 0 ? leftX : i === 2 ? rightX : 0,
                rotateY,
                rotateZ: i === 0 ? rotateZLeft : i === 2 ? rotateZRight : 0,
                zIndex: i, // left under middle, right over middle
                transformStyle: "preserve-3d",
              }}
            >
              {/* Front: this panel's third of the image */}
              <motion.div
                aria-hidden="true"
                style={{
                  position: "absolute",
                  inset: 0,
                  overflow: "hidden",
                  backfaceVisibility: "hidden",
                  WebkitBackfaceVisibility: "hidden",
                  zIndex: 2,
                  borderRadius: radiusFor(i),
                  boxShadow,
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: `${-100 * i}%`,
                    width: "300%",
                    height: "100%",
                    backgroundImage: `url(${imageSrc})`,
                    backgroundSize: "cover",
                    backgroundPosition: imagePosition,
                  }}
                />
              </motion.div>

              {/* Back: the card, pre-flipped so it faces forward once the panel turns */}
              <motion.div
                style={{
                  position: "absolute",
                  inset: 0,
                  overflow: "hidden",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "flex-end",
                  padding: "clamp(14px, 2.4vw, 32px)",
                  border: "1px solid rgba(255,255,255,0.05)",
                  backgroundColor: card.bgColor,
                  backgroundImage: "linear-gradient(to bottom right, rgba(255,255,255,0.1), transparent)",
                  color: card.textColor,
                  backfaceVisibility: "hidden",
                  WebkitBackfaceVisibility: "hidden",
                  willChange: "transform",
                  rotateY: 180,
                  zIndex: 1,
                  borderRadius: radiusFor(i),
                  boxShadow,
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    pointerEvents: "none",
                    opacity: 0.2,
                    mixBlendMode: "overlay",
                    backgroundImage: GRAIN,
                    backgroundRepeat: "repeat",
                  }}
                />

                <div style={{ position: "relative", marginBottom: "auto" }}>{card.icon}</div>
                <h3
                  style={{
                    position: "relative",
                    margin: "0 0 clamp(8px, 1.2vw, 16px)",
                    fontFamily: "var(--font-display)",
                    fontWeight: 400,
                    fontSize: "clamp(18px, 2.6vw, 34px)",
                    lineHeight: "var(--leading-title)",
                    letterSpacing: "var(--track-neat)",
                    textWrap: "balance",
                  }}
                >
                  {card.title}
                </h3>
                <p
                  style={{
                    position: "relative",
                    margin: 0,
                    fontSize: "clamp(11.5px, 1.25vw, 14px)",
                    lineHeight: "var(--leading-list)",
                    opacity: 0.8,
                    textWrap: "pretty",
                  }}
                >
                  {card.description}
                </p>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>

        {endLabel && (
          <motion.p
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              bottom: "20%",
              margin: 0,
              padding: "0 var(--gutter-page)",
              textAlign: "center",
              fontFamily: "var(--font-display)",
              fontStyle: "italic",
              fontSize: "clamp(24px, 3vw, 36px)",
              lineHeight: "var(--leading-title)",
              letterSpacing: "var(--track-snug)",
              color: "var(--text-primary)",
              opacity: endOpacity,
              y: endY,
            }}
          >
            {endLabel}
          </motion.p>
        )}
      </div>
    </div>
  );
}
