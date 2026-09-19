import React from "react";
import { CAT_FRAMES, FISH_FRAMES, GLYPHS, HEART, MOON, PALETTE } from "./feedCatSprites.js";
import "./FeedTheCat.css";

/**
 * Footer mini-game in the style of Chrome's dino game (night mode): drag the
 * flopping fish onto the cat. Everything is drawn on one canvas on a coarse
 * grid, so motion snaps pixel to pixel the way the dino's does.
 *
 * Every feed is posted to /api/feed-cat and the running total of fish shows top
 * right, dino-score style. The server also keeps a hashed set of who has fed the
 * cat, which is only used to tell a first-timer from a returning one. If the API
 * is unreachable the game still plays; only the score disappears.
 *
 * Keyboard: a real button sits over the fish — Enter or Space feeds the cat.
 */

const API = "/api/feed-cat";

/* The board, in board pixels. Sprites are drawn at 2 board pixels per sprite pixel. */
const W = 220;
const H = 88;
const P = 2;
const GROUND = 75;

const CAT_W = CAT_FRAMES.sit[0].length * P;
const CAT_H = CAT_FRAMES.sit.length * P;
const CAT_X = W - 18 - CAT_W;
const CAT_Y = GROUND - CAT_H;
const HEAD = { x: CAT_X, y: CAT_Y, w: 22, h: 22 };           // the cat's head, for hit testing
const MOUTH = { x: CAT_X + 5, y: CAT_Y + 15 };

const FISH_W = FISH_FRAMES[0][0].length * P;
const FISH_H = FISH_FRAMES[0].length * P;
const HOME = { x: 24, y: GROUND - FISH_H };

const STARS = [[58, 9], [90, 22], [118, 6], [142, 16], [46, 30], [104, 36], [196, 30], [74, 44]];
const PEBBLES = [[12, 78], [37, 80], [66, 77], [93, 81], [121, 78], [150, 80], [178, 77], [204, 81]];

const COLOR = { ground: "#8a70b0", star: "#c4a6ff", text: "#e9d5ff", hint: "#8a70b0" };

const snap = (v) => Math.round(v / P) * P;
const overlaps = (a, b) => a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;

const drawSprite = (ctx, rows, palette, x, y, s = P) => {
  for (let r = 0; r < rows.length; r++) {
    const row = rows[r];
    for (let c = 0; c < row.length; c++) {
      const ch = row[c];
      if (ch === ".") continue;
      ctx.fillStyle = palette[ch];
      ctx.fillRect(x + c * s, y + r * s, s, s);
    }
  }
};

const glyph = (ch) => GLYPHS[ch] || GLYPHS[" "];
const textWidth = (str) => [...str].reduce((w, ch) => w + glyph(ch)[0].length + 1, 0) - 1;
const drawText = (ctx, str, x, y, color) => {
  ctx.fillStyle = color;
  let cx = x;
  for (const ch of str) {
    const g = glyph(ch);
    for (let r = 0; r < g.length; r++) for (let c = 0; c < g[r].length; c++) if (g[r][c] === "#") ctx.fillRect(cx + c, y + r, 1, 1);
    cx += g[0].length + 1;
  }
};

export function FeedTheCat() {
  const wrapRef = React.useRef(null);
  const canvasRef = React.useRef(null);
  const game = React.useRef(null);
  const [message, setMessage] = React.useState("");
  const [size, setSize] = React.useState({ w: W * 2, h: H * 2 });

  // Everything the canvas loop reads lives in one mutable object
  if (!game.current) {
    game.current = {
      mode: "idle",        // idle | fly | eat | happy | respawn | home
      since: 0,
      fish: { ...HOME },
      from: null,
      drag: null,
      near: false,
      hint: true,
      count: null,
      flashUntil: 0,
      reduced: false,
      k: 2,
    };
  }

  const setMode = (mode) => {
    const g = game.current;
    g.mode = mode;
    g.since = performance.now();
  };

  const post = async () => {
    const g = game.current;
    let result = null;
    try {
      const res = await fetch(API, { method: "POST" });
      if (res.ok) result = await res.json();
    } catch { /* offline — the cat still ate */ }
    if (result && typeof result.count === "number") {
      g.count = result.count;
      g.flashUntil = performance.now() + 900;
    }
    if (result?.first) setMessage(`Nom nom. Thank you! That is fish number ${result.count}, and your first.`);
    else if (result) setMessage(`Nom nom. That is ${result.count} fish my cat has had. Thanks for coming back!`);
    else setMessage("Nom nom. My cat says thank you!");
  };

  const feed = React.useCallback(() => {
    const g = game.current;
    if (g.mode !== "idle") return;
    g.hint = false;
    g.drag = null;
    g.near = false;
    g.from = { ...g.fish };
    setMode(g.reduced ? "eat" : "fly");
    post();
  }, []);

  React.useEffect(() => {
    let live = true;
    fetch(API)
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => { if (live && d && typeof d.count === "number") game.current.count = d.count; })
      .catch(() => {});
    return () => { live = false; };
  }, []);

  // Size the canvas so a board pixel is a whole number of device pixels where possible
  React.useEffect(() => {
    const wrap = wrapRef.current;
    const fit = () => {
      const dpr = window.devicePixelRatio || 1;
      const exact = (wrap.clientWidth * dpr) / W;
      const whole = Math.max(1, Math.floor(exact));
      // A whole-number scale keeps every board pixel identical; take it unless it wastes over 15% of the box
      const k = whole / exact >= 0.85 ? whole : exact;
      game.current.k = Math.ceil(k);
      setSize({ w: (W * k) / dpr, h: (H * k) / dpr });
    };
    const ro = new ResizeObserver(fit);
    ro.observe(wrap);
    fit();
    return () => ro.disconnect();
  }, []);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const g = game.current;
    const mq = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    g.reduced = !!mq?.matches;

    const draw = (now) => {
      const k = g.k;
      if (canvas.width !== W * k) { canvas.width = W * k; canvas.height = H * k; }
      ctx.setTransform(k, 0, 0, k, 0, 0);
      ctx.clearRect(0, 0, W, H);
      const t = g.reduced ? 0 : now;
      const age = now - g.since;

      // Mode timeline
      if (g.mode === "fly" && age > 380) setMode("eat");
      else if (g.mode === "eat" && age > 1300) setMode("happy");
      else if (g.mode === "happy" && age > 1500) { g.fish = { ...HOME }; setMode(g.reduced ? "idle" : "respawn"); }
      else if (g.mode === "respawn" && age > 700) setMode("idle");
      else if (g.mode === "home" && age > 220) { g.fish = { ...HOME }; setMode("idle"); }

      // Sky
      drawSprite(ctx, MOON, PALETTE.moon, 18, 8, P);
      ctx.fillStyle = COLOR.star;
      STARS.forEach(([sx, sy], i) => { if (g.reduced || Math.floor(t / 700 + i * 1.7) % 5 !== 0) ctx.fillRect(sx, sy, 1, 1); });

      // Ground, dino style: a line with pebbles
      ctx.fillStyle = COLOR.ground;
      ctx.fillRect(0, GROUND, W, 1);
      PEBBLES.forEach(([px, py], i) => ctx.fillRect(px, py, i % 3 === 0 ? 2 : 1, 1));

      // Score
      if (g.count !== null && (now > g.flashUntil || Math.floor(now / 120) % 2 === 0)) {
        const score = `FED ${String(g.count).padStart(5, "0")}`;
        drawText(ctx, score, W - 4 - textWidth(score), 4, COLOR.text);
      }

      // Cat
      let frame = "sit";
      if (g.mode === "eat") frame = Math.floor(age / 140) % 2 ? "chew" : "happy";
      else if (g.mode === "happy") frame = "happy";
      else if (g.near) frame = "open";
      else if (!g.reduced && t % 3700 < 130) frame = "blink";
      else if (!g.reduced && t % 2400 < 300) frame = "flick";
      drawSprite(ctx, CAT_FRAMES[frame], PALETTE.cat, CAT_X, CAT_Y);

      // Hearts rise from the cat while it eats
      if (g.mode === "eat" && !g.reduced) {
        [0, 200, 420].forEach((delay, i) => {
          const life = age - delay;
          if (life < 0 || life > 900) return;
          if (life > 700 && Math.floor(life / 80) % 2) return;
          drawSprite(ctx, HEART, PALETTE.heart, CAT_X + 8 + i * 9, CAT_Y - 4 - snap(life / 40), 1);
        });
      }

      // Speech
      const says = g.mode === "eat" ? "NOM NOM" : g.mode === "happy" ? "PRRR" : null;
      if (says) {
        const tw = textWidth(says);
        const bx = CAT_X - tw - 6;
        const by = CAT_Y + 6;
        ctx.fillStyle = COLOR.text;
        ctx.fillRect(bx - 3, by - 3, tw + 6, 11);
        ctx.fillRect(bx + tw + 3, by + 3, 2, 2);
        drawText(ctx, says, bx, by, "#07020f");
      }

      // Fish
      let fx = g.fish.x;
      let fy = g.fish.y;
      let show = true;
      if (g.mode === "fly") {
        const p = Math.min(1, age / 380);
        fx = snap(g.from.x + (MOUTH.x - FISH_W + 6 - g.from.x) * p);
        fy = snap(g.from.y + (MOUTH.y - FISH_H / 2 - g.from.y) * p - Math.sin(Math.PI * p) * 18);
      } else if (g.mode === "home") {
        const p = Math.min(1, age / 220);
        fx = snap(g.from.x + (HOME.x - g.from.x) * p);
        fy = snap(g.from.y + (HOME.y - g.from.y) * p);
      } else if (g.mode === "eat" || g.mode === "happy") {
        show = false;
      } else if (g.mode === "respawn") {
        show = Math.floor(age / 100) % 2 === 1;
      }
      if (show) {
        const flap = g.drag ? Math.floor(t / 110) % 2 : Math.floor(t / 280) % 2;
        const hop = !g.drag && g.mode === "idle" && !g.reduced && t % 1900 < 190 ? -4 : 0;
        drawSprite(ctx, FISH_FRAMES[flap], PALETTE.fish, fx, fy + hop);
      }

      // Hint / thanks under the ground line
      const line = g.hint ? "DRAG THE FISH TO THE CAT" : g.mode === "happy" ? "THANK YOU!" : null;
      if (line) drawText(ctx, line, Math.round((W - textWidth(line)) / 2), GROUND + 7, g.hint ? COLOR.hint : COLOR.text);
    };

    let raf = 0;
    let visible = false;
    const loop = (now) => {
      draw(now);
      raf = visible ? requestAnimationFrame(loop) : 0;
    };
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible && !raf) raf = requestAnimationFrame(loop);
    });
    io.observe(canvas);
    draw(performance.now());

    // Pointer → board coordinates
    const toBoard = (e) => {
      const r = canvas.getBoundingClientRect();
      return { x: ((e.clientX - r.left) / r.width) * W, y: ((e.clientY - r.top) / r.height) * H };
    };
    const onFish = (p) => {
      const f = g.fish;
      return p.x > f.x - 4 && p.x < f.x + FISH_W + 4 && p.y > f.y - 6 && p.y < f.y + FISH_H + 4;
    };

    const down = (e) => {
      if (g.mode !== "idle") return;
      const p = toBoard(e);
      if (!onFish(p)) return;
      e.preventDefault();
      canvas.setPointerCapture(e.pointerId);
      g.drag = { dx: p.x - g.fish.x, dy: p.y - g.fish.y };
      g.hint = false;
      canvas.style.cursor = "grabbing";
    };
    const move = (e) => {
      const p = toBoard(e);
      if (!g.drag) {
        canvas.style.cursor = g.mode === "idle" && onFish(p) ? "grab" : "default";
        return;
      }
      g.fish.x = Math.max(0, Math.min(W - FISH_W, snap(p.x - g.drag.dx)));
      g.fish.y = Math.max(0, Math.min(GROUND - FISH_H, snap(p.y - g.drag.dy)));
      const head = { x: g.fish.x + FISH_W, y: g.fish.y + FISH_H / 2 };
      g.near = Math.hypot(head.x - MOUTH.x, head.y - MOUTH.y) < 46;
    };
    const up = () => {
      if (!g.drag) return;
      g.drag = null;
      g.near = false;
      canvas.style.cursor = "default";
      const fishBox = { x: g.fish.x, y: g.fish.y, w: FISH_W, h: FISH_H };
      const target = { x: HEAD.x - 16, y: HEAD.y - 6, w: HEAD.w + 20, h: HEAD.h + 14 };
      if (overlaps(fishBox, target)) feed();
      else { g.from = { ...g.fish }; setMode(g.reduced ? "idle" : "home"); if (g.reduced) g.fish = { ...HOME }; }
    };

    canvas.addEventListener("pointerdown", down);
    canvas.addEventListener("pointermove", move);
    canvas.addEventListener("pointerup", up);
    canvas.addEventListener("pointercancel", up);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      canvas.removeEventListener("pointerdown", down);
      canvas.removeEventListener("pointermove", move);
      canvas.removeEventListener("pointerup", up);
      canvas.removeEventListener("pointercancel", up);
    };
  }, [feed]);

  return (
    <section
      aria-labelledby="ftc-title"
      style={{
        position: "relative",
        width: "min(100%, 320px)",
        padding: "12px 14px 10px",
        background: "#000",
        border: "2px solid rgba(196,166,255,0.45)",
        boxShadow: "4px 4px 0 rgba(124,58,237,0.45), 0 0 48px -14px rgba(168,85,247,0.55)",
      }}
    >
      <h2
        id="ftc-title"
        style={{ margin: "0 0 8px", fontSize: "var(--text-caps)", fontWeight: 500, letterSpacing: "var(--track-caps)", textTransform: "uppercase", color: "var(--text-muted)", textWrap: "pretty" }}
      >
        Scrolled this far? <span style={{ color: "var(--lilac-300)" }}>Feed my cat</span>
      </h2>

      <div ref={wrapRef} style={{ position: "relative" }}>
        <canvas
          ref={canvasRef}
          role="img"
          aria-label="Pixel-art game: a cat sits on the right, a fish flops on the left. Drag the fish to the cat to feed it."
          style={{ display: "block", width: size.w, height: size.h, imageRendering: "pixelated", touchAction: "none" }}
        />
        <button
          type="button"
          onClick={feed}
          aria-label="Feed the cat"
          className="ftc-key"
          style={{
            position: "absolute",
            left: `${((HOME.x - 3) / W) * 100}%`,
            top: `${((HOME.y - 3) / H) * 100}%`,
            width: `${((FISH_W + 6) / W) * 100}%`,
            height: `${((FISH_H + 6) / H) * 100}%`,
            padding: 0,
            border: 0,
            background: "transparent",
            pointerEvents: "none",
          }}
        />
      </div>

      <p aria-live="polite" style={{ position: "absolute", width: 1, height: 1, overflow: "hidden", clip: "rect(0 0 0 0)", whiteSpace: "nowrap" }}>
        {message}
      </p>
    </section>
  );
}
