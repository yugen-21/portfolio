import React from "react";
import { animate, utils } from "animejs";

/**
 * A pitch-black sky: twinkling stars in three depth layers that drift a little
 * against the page scroll, and a shooting star crossing every few seconds.
 *
 * Each meteor is an anime.js tween on a plain object that the canvas reads
 * every frame. The twinkle is a per-star sine inside the one draw loop, so a
 * few hundred stars cost a single rAF rather than a few hundred tweens.
 *
 * Stars live in normalised coordinates and are generated once, so a resize —
 * including a phone's URL bar collapsing mid-scroll — rescales the sky instead
 * of reshuffling it.
 *
 * prefers-reduced-motion: stars are drawn once, with no twinkle and no meteors.
 */

const MAX_STARS = 700;
const AREA_PER_STAR = 5200; // px² of viewport per star

const LAYERS = [
  { share: 0.62, size: [0.35, 0.8], alpha: [0.22, 0.55], depth: 0.015 },
  { share: 0.3, size: [0.7, 1.15], alpha: [0.4, 0.8], depth: 0.04 },
  { share: 0.08, size: [1.1, 1.7], alpha: [0.65, 1], depth: 0.08, glint: true },
];

/* Mostly white, some violet-050 / violet-200 / lilac-300 so the sky leans purple */
const TINTS = ["255,255,255", "255,255,255", "255,255,255", "237,228,255", "216,180,254", "196,166,255"];

const toRgb = (hex) => {
  const h = String(hex).replace("#", "");
  return `${parseInt(h.slice(0, 2), 16)},${parseInt(h.slice(2, 4), 16)},${parseInt(h.slice(4, 6), 16)}`;
};

const makeStars = () => {
  const stars = [];
  LAYERS.forEach((layer) => {
    const n = Math.round(MAX_STARS * layer.share);
    for (let i = 0; i < n; i++) {
      stars.push({
        x: Math.random(),
        y: Math.random(),
        r: utils.random(layer.size[0], layer.size[1], 2),
        a: utils.random(layer.alpha[0], layer.alpha[1], 2),
        tint: `rgb(${TINTS[utils.random(0, TINTS.length - 1)]})`,
        speed: utils.random(0.5, 1.8, 2),
        phase: Math.random() * Math.PI * 2,
        depth: layer.depth,
        glint: !!layer.glint,
      });
    }
  });
  // Shuffle so the first N used at small sizes are a fair mix of all layers
  return utils.shuffle(stars);
};

export function Starfield({
  density = 1,
  meteorColor = "#c084fc",
  meteorEvery = [4500, 10000],
  className,
  style,
}) {
  const canvasRef = React.useRef(null);
  const [minGap, maxGap] = meteorEvery;

  React.useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!ctx) return undefined;

    const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    const stars = makeStars();
    const meteorRgb = toRgb(meteorColor);
    let w = 0, h = 0, count = 0;
    let raf = 0, launchTimer = 0, meteor = null, meteorTween = null;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = rect.width;
      h = rect.height;
      canvas.width = Math.max(1, Math.floor(w * dpr));
      canvas.height = Math.max(1, Math.floor(h * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      count = Math.min(stars.length, Math.round(((w * h) / AREA_PER_STAR) * density));
    };

    const drawStars = (t) => {
      const scroll = window.scrollY;
      for (let i = 0; i < count; i++) {
        const s = stars[i];
        const twinkle = reduced ? 1 : 0.5 + 0.5 * Math.sin(t * s.speed + s.phase);
        const alpha = s.a * (0.35 + 0.65 * twinkle);
        const x = s.x * w;
        let y = (s.y * h - scroll * s.depth) % h;
        if (y < 0) y += h;

        ctx.globalAlpha = alpha;
        ctx.fillStyle = s.tint;
        if (s.r < 0.9) {
          ctx.fillRect(x - s.r, y - s.r, s.r * 2, s.r * 2);
        } else {
          ctx.beginPath();
          ctx.arc(x, y, s.r, 0, Math.PI * 2);
          ctx.fill();
        }

        if (s.glint && twinkle > 0.55) {
          // Soft halo and a four-point glint on the brightest stars at their peak
          const k = (twinkle - 0.55) / 0.45;
          ctx.globalAlpha = alpha * 0.18 * k;
          ctx.beginPath();
          ctx.arc(x, y, s.r * 3.2, 0, Math.PI * 2);
          ctx.fill();
          ctx.globalAlpha = alpha * 0.5 * k;
          const len = s.r * 5.5;
          ctx.fillRect(x - len, y - 0.35, len * 2, 0.7);
          ctx.fillRect(x - 0.35, y - len, 0.7, len * 2);
        }
      }
      ctx.globalAlpha = 1;
    };

    const drawMeteor = () => {
      const m = meteor;
      const fade = Math.sin(Math.PI * m.p);
      if (fade <= 0) return;
      const hx = m.x0 + m.dx * m.p;
      const hy = m.y0 + m.dy * m.p;
      const tail = m.len * (0.35 + 0.65 * fade);
      const tx = hx - m.ux * tail;
      const ty = hy - m.uy * tail;

      const trail = ctx.createLinearGradient(hx, hy, tx, ty);
      trail.addColorStop(0, `rgba(255,255,255,${fade})`);
      trail.addColorStop(0.06, `rgba(${meteorRgb},${0.9 * fade})`);
      trail.addColorStop(1, `rgba(${meteorRgb},0)`);
      ctx.lineCap = "round";

      // Wide faint pass for the glow, then the bright core
      ctx.globalAlpha = 0.32;
      ctx.strokeStyle = trail;
      ctx.lineWidth = 9;
      ctx.beginPath(); ctx.moveTo(hx, hy); ctx.lineTo(tx, ty); ctx.stroke();
      ctx.globalAlpha = 1;
      ctx.lineWidth = 1.8;
      ctx.beginPath(); ctx.moveTo(hx, hy); ctx.lineTo(tx, ty); ctx.stroke();

      const head = ctx.createRadialGradient(hx, hy, 0, hx, hy, 13);
      head.addColorStop(0, `rgba(255,255,255,${fade})`);
      head.addColorStop(0.35, `rgba(${meteorRgb},${0.55 * fade})`);
      head.addColorStop(1, `rgba(${meteorRgb},0)`);
      ctx.fillStyle = head;
      ctx.beginPath(); ctx.arc(hx, hy, 13, 0, Math.PI * 2); ctx.fill();
    };

    const frame = (now) => {
      ctx.clearRect(0, 0, w, h);
      drawStars(now / 1000);
      if (meteor) drawMeteor();
      raf = requestAnimationFrame(frame);
    };

    const launch = () => {
      // Enter from the upper part of either side and fall across at 15–35°
      const fromLeft = Math.random() < 0.5;
      const angle = (utils.random(15, 35) * Math.PI) / 180;
      const travel = Math.max(w, h) * utils.random(0.45, 0.8, 2);
      const ux = Math.cos(angle) * (fromLeft ? 1 : -1);
      const uy = Math.sin(angle);
      meteor = {
        x0: fromLeft ? utils.random(0, w * 0.5) : utils.random(w * 0.5, w),
        y0: utils.random(0, h * 0.45),
        dx: ux * travel,
        dy: uy * travel,
        ux, uy,
        len: utils.random(180, 320),
        p: 0,
      };
      meteorTween = animate(meteor, {
        p: [0, 1],
        duration: utils.random(1100, 1700),
        ease: "inOutSine",
        onComplete: () => {
          meteor = null;
          launchTimer = window.setTimeout(launch, utils.random(minGap, maxGap));
        },
      });
    };

    const ro = new ResizeObserver(() => {
      resize();
      if (reduced) { ctx.clearRect(0, 0, w, h); drawStars(0); }
    });
    ro.observe(canvas);
    resize();

    if (reduced) drawStars(0);
    else {
      raf = requestAnimationFrame(frame);
      launchTimer = window.setTimeout(launch, 2500);
    }

    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(launchTimer);
      meteorTween?.cancel();
      ro.disconnect();
    };
  }, [density, meteorColor, minGap, maxGap]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={className}
      style={{ position: "absolute", inset: 0, display: "block", width: "100%", height: "100%", pointerEvents: "none", ...style }}
    />
  );
}
