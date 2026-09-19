import React from "react";
import { SpecularButton } from "../ds/core/SpecularButton.jsx";
import { PALETTE, GRID_W, GRID_H, BROWS, catFrame } from "./workCatSprite.js";

/**
 * A pixel cat sitting beside the "View my work" button with a paw held out
 * toward it, saying in a bubble that you have not looked at the work yet.
 *
 * It reads the pointer and reacts:
 *   eyes   the pupils follow the pointer around the page
 *   mood   the nearer the pointer gets to the button, the happier the cat: the
 *          mouth lifts and the brows come down off their worried tilt. Drift
 *          away and it goes glum again
 *   idle   it breathes, blinks, bobs the held-out paw and flicks its tail
 *
 * The canvas takes no pointer events and nothing here calls preventDefault, so
 * the section scrolls like any other. The loop only runs while the cat is on
 * screen, and a frame is only painted when the art actually changes; under
 * reduced motion it is drawn once and left alone.
 */

const LINE = "it seems like you haven't viewed my work yet...";

const SCALE = 10; // CSS px per sprite pixel
const CAT_W = GRID_W * SCALE;
const CAT_H = GRID_H * SCALE;

// Pointer distance from the button, in px, at each step from grinning to glum
const MOOD_STEPS = [70, 150, 280, 460];

const moodFor = (distance) => {
  if (distance === null) return 1;
  for (let i = 0; i < MOOD_STEPS.length; i += 1) {
    if (distance <= MOOD_STEPS[i]) return BROWS.length - 1 - i;
  }
  return 0;
};

function drawGrid(ctx, grid) {
  ctx.clearRect(0, 0, CAT_W, CAT_H);
  for (let r = 0; r < grid.length; r += 1) {
    for (let c = 0; c < grid[r].length; c += 1) {
      const colour = PALETTE[grid[r][c]];
      if (!colour) continue;
      ctx.fillStyle = colour;
      ctx.fillRect(c * SCALE, r * SCALE, SCALE, SCALE);
    }
  }
}

function Cat({ buttonRef }) {
  const canvasRef = React.useRef(null);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!ctx) return undefined;

    const dpr = Math.min(window.devicePixelRatio || 1, 3);
    canvas.width = Math.round(CAT_W * dpr);
    canvas.height = Math.round(CAT_H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.imageSmoothingEnabled = false;

    const still = window.matchMedia?.(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (still) {
      drawGrid(ctx, catFrame({ mood: 1 }));
      return undefined;
    }

    const pointer = { x: null, y: null };
    let visible = true;
    let frame = 0;
    let painted = "";

    // Blink and flick on their own clocks, so the two never lock into a pattern
    const blinkAt = { next: performance.now() + 2600, until: 0 };
    const flickAt = { next: performance.now() + 4200, until: 0 };

    const roll = (clock, now, gapMin, gapSpan, hold) => {
      if (now >= clock.next) {
        clock.until = now + hold;
        clock.next = now + gapMin + Math.random() * gapSpan;
      }
      return now < clock.until;
    };

    const tick = (now) => {
      frame = visible ? requestAnimationFrame(tick) : 0;

      const button = buttonRef.current?.getBoundingClientRect();
      const eyes = canvas.getBoundingClientRect();
      let distance = null;
      let dx = 0;
      let dy = 0;

      if (pointer.x !== null) {
        if (button) {
          distance = Math.hypot(
            pointer.x - (button.left + button.width / 2),
            pointer.y - (button.top + button.height / 2),
          );
        }
        // The pupil steps to whichever of the nine positions points at the pointer
        const ex = eyes.left + eyes.width / 2;
        const ey = eyes.top + (8.5 / GRID_H) * eyes.height;
        dx = Math.sign(Math.abs(pointer.x - ex) > 16 ? pointer.x - ex : 0);
        dy = Math.sign(Math.abs(pointer.y - ey) > 16 ? pointer.y - ey : 0);
      }

      const next = {
        mood: moodFor(distance),
        // ~3.4s in and out; the chest settles for the second half of each cycle
        breath: Math.floor(now / 1700) % 2 === 1,
        dx,
        dy,
        blink: roll(blinkAt, now, 2200, 3200, 130),
        reach: Math.floor(now / 520) % 2,
        flick: roll(flickAt, now, 3600, 3600, 420),
      };
      const key = `${next.mood}${next.dx}${next.dy}${next.blink}${next.reach}${next.flick}${next.breath}`;
      if (key === painted) return;
      painted = key;
      drawGrid(ctx, catFrame(next));
    };

    const onPointerMove = (event) => {
      pointer.x = event.clientX;
      pointer.y = event.clientY;
    };

    const start = () => {
      if (!frame) frame = requestAnimationFrame(tick);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible) start();
      },
      { rootMargin: "140px" },
    );
    observer.observe(canvas);

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    start();
    return () => {
      observer.disconnect();
      window.removeEventListener("pointermove", onPointerMove);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [buttonRef]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        display: "block",
        width: CAT_W,
        height: CAT_H,
        imageRendering: "pixelated",
        pointerEvents: "none",
      }}
    />
  );
}

/**
 * A speech balloon built the way the cat is: square, with its border stepped out
 * of block shadows rather than drawn as a rounded outline, and a tail of two
 * shrinking blocks. No radius, no blur, no glow.
 */
const EDGE = "#8b5cf6";
const FILL = "#120429";
const STEP = 5;

// The stepped border: a block on each side, and the corners notched out
const PIXEL_BORDER = [
  `0 -${STEP}px 0 ${EDGE}`,
  `0 ${STEP}px 0 ${EDGE}`,
  `-${STEP}px 0 0 ${EDGE}`,
  `${STEP}px 0 0 ${EDGE}`,
].join(", ");

function Bubble({ lead, children }) {
  return (
    <div style={{ position: "relative", margin: `0 ${STEP}px` }}>
      <div
        style={{
          maxWidth: "32ch",
          padding: "18px 24px",
          background: FILL,
          boxShadow: PIXEL_BORDER,
          fontSize: "var(--text-panel)",
          lineHeight: 1.55,
          color: "var(--text-body)",
          textWrap: "pretty",
        }}
      >
        <span
          style={{
            color: "var(--violet-200)",
            fontWeight: "var(--weight-semibold)",
          }}
        >
          {lead}
        </span>{" "}
        {children}
      </div>
      {/* The tail: two blocks stepping down toward the cat's head */}
      <span
        aria-hidden="true"
        style={{
          position: "absolute",
          left: 10 * SCALE,
          top: "100%",
          width: 4 * STEP,
          height: STEP,
          background: FILL,
          boxShadow: `-${STEP}px 0 0 ${EDGE}, ${STEP}px 0 0 ${EDGE}`,
        }}
      />
      <span
        aria-hidden="true"
        style={{
          position: "absolute",
          left: 10 * SCALE,
          top: `calc(100% + ${STEP}px)`,
          width: 2 * STEP,
          height: STEP,
          background: FILL,
          boxShadow: `-${STEP}px 0 0 ${EDGE}, ${STEP}px 0 0 ${EDGE}, 0 ${STEP}px 0 ${EDGE}`,
        }}
      />
    </div>
  );
}

export function WorkNudgeCat({ onViewWork }) {
  const buttonRef = React.useRef(null);

  return (
    <div className="flex flex-wrap items-end justify-center gap-x-8 gap-y-8">
      <div className="flex flex-col items-start" style={{ gap: 22 }}>
        <Bubble lead="Wait,">{LINE}</Bubble>
        <Cat buttonRef={buttonRef} />
      </div>

      {/* Sat level with the held-out paw: the paw's centre is 9.5 sprite rows up
          from the cat's foot, and the button is half its own height deep */}
      <div
        ref={buttonRef}
        style={{ marginBottom: Math.round(9.5 * SCALE) - 24 }}
      >
        <SpecularButton
          variant="solid"
          size="lg"
          radius={999}
          onClick={onViewWork}
        >
          View my work
        </SpecularButton>
      </div>

      <p
        role="status"
        style={{
          position: "absolute",
          width: 1,
          height: 1,
          overflow: "hidden",
          clip: "rect(0 0 0 0)",
        }}
      >
        Wait, {LINE}
      </p>
    </div>
  );
}
