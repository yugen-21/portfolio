import React from "react";
import { drawMotif } from "./motifs.js";
import { groupStack } from "./stackLayers.js";

/**
 * A project opened like the book it stands as on the shelf: two leaves bound in
 * that book's cloth, the left page carrying its stamped symbol and the facts of
 * the build, the right page the story.
 *
 * Paper is warm cream — the colour of the page edges the shelf books show — with
 * ink text and violet accents. Light pages against the black site are what make
 * this read as an open book rather than one more dark panel, and the book's own
 * cloth still frames them.
 *
 * Wide screens: two leaves, each scrolling on its own, and the book opens — the
 * front board swings off the right-hand page about the spine while the book slides
 * to centre. Narrow screens: one board, one scrolling page, the leaves stacked
 * with a fold between them. Reduced motion: a fade either way.
 *
 * It owns the dialog behaviour: focus moves in and is trapped, Escape and a
 * backdrop click close it (after the closing animation), page scroll is locked,
 * and focus goes back to `returnFocus` (an element, or a function returning one)
 * when it unmounts.
 */

const PAPER = "#f3ede1";
const INK = "var(--ink-500)";        // 16:1 on the paper
const ACCENT = "var(--violet-800)";  // 7.7:1
const ACCENT_HEX = "#5b21b6";        // the same, for canvas
const MUTED = "#665478";             // 5.8:1 — the site's muted tokens are tuned for a dark ground

const OPEN_MS = 680;
const CLOSE_MS = 440;
const EASE = "cubic-bezier(0.65, 0, 0.35, 1)";
const STACK_BELOW = 820; // viewport width under which the two leaves stack

const GRAIN = `url("data:image/svg+xml;utf8,${encodeURIComponent(
  "<svg xmlns='http://www.w3.org/2000/svg' width='220' height='220'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/></filter><rect width='100%' height='100%' filter='url(#n)'/></svg>",
)}")`;

// The cloth's weave, after drawClothWeave: dark warp threads, light weft
const CLOTH =
  "repeating-linear-gradient(90deg, rgba(0,0,0,0.07) 0 1px, transparent 1px 3px), repeating-linear-gradient(0deg, rgba(255,255,255,0.05) 0 1px, transparent 1px 3px)";
const BOARD_SHADOW = "0 40px 90px -30px rgba(0,0,0,0.95), 0 0 90px -40px rgba(168,85,247,0.55)";
const PAGE_EDGE = ["#e6dfd1", "#c9bfac", "#e3dccd", "#c1b6a1", "#ded6c6"];

const stackedNow = () => typeof window !== "undefined" && window.innerWidth < STACK_BELOW;
const reducedMotion = () => window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;

function useStacked() {
  const [stacked, setStacked] = React.useState(stackedNow);
  React.useEffect(() => {
    const onResize = () => setStacked(stackedNow());
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);
  return stacked;
}

function Motif({ motif, color, size }) {
  const ref = React.useRef(null);
  React.useLayoutEffect(() => {
    const canvas = ref.current;
    const context = canvas?.getContext("2d");
    if (!context) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 3);
    canvas.width = Math.round(size * dpr);
    canvas.height = Math.round(size * dpr);
    context.setTransform(dpr, 0, 0, dpr, 0, 0);
    context.clearRect(0, 0, size, size);
    drawMotif(context, motif, 0, 0, size, color);
  }, [motif, color, size]);
  return <canvas ref={ref} aria-hidden="true" style={{ display: "block", width: size, height: size }} />;
}

/** The book's symbol, stamped in its foil on a square of its cloth. */
function Emblem({ book, size = 92 }) {
  return (
    <div
      aria-hidden="true"
      style={{
        position: "relative",
        width: size,
        height: size,
        display: "grid",
        placeItems: "center",
        borderRadius: 16,
        background: book.color,
        backgroundImage: CLOTH,
        boxShadow: "0 14px 26px -14px rgba(26,6,48,0.6), inset 0 1px 0 rgba(255,255,255,0.18)",
      }}
    >
      <div style={{ position: "absolute", inset: 7, borderRadius: 11, border: `1px solid ${book.foil}`, opacity: 0.45 }} />
      <Motif motif={book.motif} color={book.foil} size={Math.round(size * 0.6)} />
    </div>
  );
}

const LABEL = {
  margin: 0,
  fontFamily: "var(--font-sans)",
  fontSize: "var(--text-caps)",
  fontWeight: "var(--weight-semibold)",
  letterSpacing: "var(--track-caps)",
  textTransform: "uppercase",
  color: ACCENT,
};

const BODY = {
  margin: 0,
  fontFamily: "var(--font-sans)",
  fontSize: "var(--text-panel)",
  lineHeight: 1.7,
  color: INK,
  textWrap: "pretty",
};

function Section({ title, first = false, children }) {
  return (
    <section style={{ marginTop: first ? 0 : 30 }}>
      <h3 style={LABEL}>{title}</h3>
      <div style={{ marginTop: 12 }}>{children}</div>
    </section>
  );
}

function LinkPill({ href, children }) {
  const [hover, setHover] = React.useState(false);
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        position: "relative",
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        padding: "8px 15px",
        borderRadius: "var(--radius-pill)",
        border: `1px solid ${ACCENT}`,
        background: hover ? ACCENT : "transparent",
        color: hover ? PAPER : ACCENT,
        fontFamily: "var(--font-sans)",
        fontSize: "var(--text-ui)",
        fontWeight: "var(--weight-medium)",
        textDecoration: "none",
        transition: "background var(--dur-fast) ease, color var(--dur-fast) ease",
      }}
    >
      {children}
      <span aria-hidden="true">↗</span>
      <span style={{ position: "absolute", width: 1, height: 1, overflow: "hidden", clip: "rect(0 0 0 0)" }}> (opens in a new tab)</span>
    </a>
  );
}

function StackRows({ stack }) {
  const rows = groupStack(stack);
  if (!rows.length) return null;
  return (
    <div style={{ display: "grid", gap: 10 }}>
      {rows.map(([label, items]) => (
        <div key={label} style={{ display: "grid", gridTemplateColumns: "76px 1fr", gap: 14, alignItems: "baseline" }}>
          <div style={{ fontSize: "var(--text-caps-xs)", letterSpacing: "var(--track-caps)", textTransform: "uppercase", color: MUTED, lineHeight: 1.5 }}>{label}</div>
          <div style={{ fontSize: "var(--text-ui)", lineHeight: 1.5, color: INK }}>
            {items.map((item, i) => (
              <React.Fragment key={item}>
                {i > 0 && <span aria-hidden="true" style={{ color: MUTED, padding: "0 8px" }}>·</span>}
                {item}
              </React.Fragment>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

/** Left page: the symbol, then the facts of the build. */
function MetaPage({ project, book, titleId }) {
  const { year, name, caption, role, links = [], stack = [] } = project;
  return (
    <>
      <Emblem book={book} />
      <div style={{ ...LABEL, marginTop: 30, color: MUTED }}>Built in {year}</div>
      <h2
        id={titleId}
        style={{
          margin: "10px 0 0",
          fontFamily: "var(--font-display)",
          fontWeight: 400,
          fontSize: "clamp(34px, 3.4vw, 50px)",
          lineHeight: "var(--leading-heading)",
          letterSpacing: "var(--track-snug)",
          color: INK,
          textWrap: "balance",
        }}
      >
        {name}
      </h2>
      <p style={{ margin: "8px 0 0", fontFamily: "var(--font-display)", fontStyle: "italic", fontSize: 21, lineHeight: 1.3, color: MUTED }}>{caption}</p>
      <div aria-hidden="true" style={{ width: 56, height: 2, marginTop: 22, background: ACCENT, opacity: 0.8 }} />

      <div style={{ marginTop: 30 }}>
        <Section title="My role" first>
          <p style={BODY}>{role}</p>
        </Section>
        <Section title="Links">
          {links.length > 0 ? (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
              {links.map((l) => <LinkPill key={l.href} href={l.href}>{l.label}</LinkPill>)}
            </div>
          ) : (
            <p style={{ ...BODY, color: MUTED }}>No public link for this one.</p>
          )}
        </Section>
        <Section title="Stack">
          <StackRows stack={stack} />
        </Section>
      </div>
    </>
  );
}

/** Right page: the problem, what it does, and the highlights. */
function StoryPage({ project, book }) {
  const { year, name, problem, blurb, bullets = [] } = project;
  return (
    <>
      <div
        aria-hidden="true"
        style={{
          width: "min(60%, 320px)",
          margin: "0 auto 30px",
          paddingBottom: 12,
          borderBottom: "1px solid rgba(26,6,48,0.14)",
          textAlign: "center",
          fontSize: "var(--text-caps-xs)",
          letterSpacing: "var(--track-eyebrow)",
          textTransform: "uppercase",
          color: MUTED,
        }}
      >
        {name} · {year}
      </div>
      <Section title="The problem" first>
        <p
          style={{
            margin: 0,
            paddingLeft: 16,
            borderLeft: `2px solid ${ACCENT}`,
            fontFamily: "var(--font-display)",
            fontSize: "clamp(19px, 1.6vw, 22px)",
            lineHeight: 1.38,
            color: INK,
            textWrap: "pretty",
          }}
        >
          {problem}
        </p>
      </Section>
      <Section title="What it does">
        <p style={BODY}>{blurb}</p>
      </Section>
      {bullets.length > 0 && (
        <Section title="Highlights">
          <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 11 }}>
            {bullets.map((b) => (
              <li key={b} style={{ ...BODY, display: "flex", gap: 12, fontSize: "var(--text-list)", lineHeight: "var(--leading-list)" }}>
                <span aria-hidden="true" style={{ flex: "none", color: ACCENT }}>&mdash;</span>
                <span>{b}</span>
              </li>
            ))}
          </ul>
        </Section>
      )}
      <div style={{ display: "flex", justifyContent: "center", marginTop: 40, opacity: 0.7 }}>
        <Motif motif={book.motif} color={ACCENT_HEX} size={20} />
      </div>
    </>
  );
}

/** A sheet of paper that scrolls within itself, shaded toward the spine on its bound edge. */
function Leaf({ side, label, children }) {
  const [ring, setRing] = React.useState(false);
  const [more, setMore] = React.useState(false);
  const scrollRef = React.useRef(null);

  // Whether anything is still below the fold, so the page can say so
  React.useEffect(() => {
    const el = scrollRef.current;
    if (!el) return undefined;
    const check = () => setMore(el.scrollTop + el.clientHeight < el.scrollHeight - 4);
    check();
    el.addEventListener("scroll", check, { passive: true });
    const observer = new ResizeObserver(check);
    observer.observe(el);
    if (el.firstElementChild) observer.observe(el.firstElementChild);
    return () => {
      el.removeEventListener("scroll", check);
      observer.disconnect();
    };
  }, []);
  const inner = side === "left" ? "right" : side === "right" ? "left" : null;
  const edge = side === "left" ? -1 : 1;
  const padY = "clamp(26px, 3.4vw, 50px)";
  const padding =
    side === "left" ? `${padY} calc(var(--page-x) + 12px) ${padY} var(--page-x)`
    : side === "right" ? `${padY} var(--page-x) ${padY} calc(var(--page-x) + 12px)`
    : "clamp(22px, 6vw, 34px) var(--page-x) 44px";

  return (
    <div
      style={{
        position: "relative",
        height: "100%",
        background: PAPER,
        borderRadius: side === "left" ? "4px 0 0 4px" : side === "right" ? "0 4px 4px 0" : 4,
        // The page block's edge on the outer side, a few leaves deep
        boxShadow: side === "full"
          ? "0 1px 0 #c9bfac, 0 2px 0 #e3dccd, 0 3px 0 #c1b6a1"
          : PAGE_EDGE.map((c, i) => `${edge * (i + 1)}px 0 0 ${c}`).join(", "),
      }}
    >
      <div aria-hidden="true" style={{ position: "absolute", inset: 0, borderRadius: "inherit", pointerEvents: "none", opacity: 0.09, mixBlendMode: "multiply", backgroundImage: GRAIN }} />
      <div
        ref={scrollRef}
        role="region"
        aria-label={label}
        tabIndex={0}
        onFocus={(e) => setRing(e.currentTarget.matches(":focus-visible"))}
        onBlur={() => setRing(false)}
        style={{
          "--page-x": "clamp(22px, 3.6vw, 56px)",
          position: "absolute",
          inset: 0,
          overflowY: "auto",
          overscrollBehavior: "contain",
          padding,
          outline: "none",
          boxShadow: ring ? `inset 0 0 0 2px ${ACCENT}` : "none",
          borderRadius: "inherit",
          scrollbarWidth: "thin",
          scrollbarColor: "#c7bca8 transparent",
        }}
      >
        {children}
      </div>
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          height: 48,
          pointerEvents: "none",
          borderRadius: "inherit",
          background: `linear-gradient(to top, ${PAPER} 12%, rgba(243,237,225,0))`,
          opacity: more ? 1 : 0,
          transition: "opacity var(--dur-fast) ease",
        }}
      />
      {inner && (
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            [inner]: 0,
            width: "clamp(28px, 4vw, 60px)",
            pointerEvents: "none",
            background: `linear-gradient(to ${side}, rgba(56,36,14,0.22), rgba(56,36,14,0.07) 38%, rgba(56,36,14,0))`,
            borderRadius: "inherit",
          }}
        />
      )}
    </div>
  );
}

const board = (book, side) => ({
  position: "absolute",
  inset: 0,
  padding: side === "left" ? "14px 0 14px 14px" : side === "right" ? "14px 14px 14px 0" : 10,
  borderRadius: side === "left" ? "12px 2px 2px 12px" : side === "right" ? "2px 12px 12px 2px" : 12,
  background: book.color,
  backgroundImage: CLOTH,
  boxShadow: BOARD_SHADOW,
});

/** Outside of the front board, seen while the book is closed. */
function Cover({ project, book }) {
  const caps = { fontSize: "var(--text-caps)", fontWeight: "var(--weight-semibold)", letterSpacing: "var(--track-caps)", textTransform: "uppercase" };
  return (
    <div
      aria-hidden="true"
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        padding: "clamp(28px, 4.4vw, 60px)",
        borderRadius: "2px 12px 12px 2px",
        background: book.color,
        backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.28), rgba(0,0,0,0) 7%), ${CLOTH}`,
        boxShadow: BOARD_SHADOW,
        color: book.foil,
        fontFamily: "var(--font-sans)",
        transform: "rotateY(180deg)",
        backfaceVisibility: "hidden",
        WebkitBackfaceVisibility: "hidden",
      }}
    >
      <div style={caps}>{project.year}</div>
      <div style={{ marginTop: "16%", fontFamily: "var(--font-display)", fontSize: "clamp(40px, 5vw, 68px)", lineHeight: 1, letterSpacing: "var(--track-snug)" }}>{project.name}</div>
      <div style={{ width: 92, height: 4, marginTop: 22, background: book.foil }} />
      <div style={{ ...caps, marginTop: 16 }}>{project.caption}</div>
      <div style={{ marginTop: "auto", display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 20 }}>
        <div style={caps}>A. Shama Anjum</div>
        <Motif motif={book.motif} color={book.foil} size={96} />
      </div>
    </div>
  );
}

function CloseButton({ onClick, inset }) {
  const [hover, setHover] = React.useState(false);
  return (
    <button
      type="button"
      aria-label="Close"
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        position: "absolute",
        top: inset,
        right: inset,
        zIndex: 2,
        width: 38,
        height: 38,
        display: "grid",
        placeItems: "center",
        padding: 0,
        borderRadius: "var(--radius-pill)",
        border: "1px solid rgba(26,6,48,0.22)",
        background: hover ? INK : "rgba(243,237,225,0.94)",
        color: hover ? PAPER : INK,
        fontSize: 19,
        lineHeight: 1,
        cursor: "pointer",
        transition: "background var(--dur-fast) ease, color var(--dur-fast) ease",
      }}
    >
      &times;
    </button>
  );
}

const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function BookSpread({ project, book, onClose, returnFocus }) {
  const titleId = React.useId();
  const stacked = useStacked();
  const backdropRef = React.useRef(null);
  const dialogRef = React.useRef(null);
  const spreadRef = React.useRef(null);
  const leafRef = React.useRef(null);
  const closingRef = React.useRef(false);
  const downOnBackdrop = React.useRef(false);
  const closeTimer = React.useRef(null);
  const latest = React.useRef({ onClose, returnFocus });

  React.useEffect(() => {
    latest.current = { onClose, returnFocus };
  });

  // Open: set the first frame before paint so the book never flashes open
  React.useLayoutEffect(() => {
    const running = [];
    const play = (el, keyframes, options) => { if (el) running.push(el.animate(keyframes, { fill: "backwards", ...options })); };
    if (reducedMotion()) {
      play(backdropRef.current, [{ opacity: 0 }, { opacity: 1 }], { duration: 200, easing: "ease-out" });
    } else {
      play(backdropRef.current, [{ opacity: 0 }, { opacity: 1 }], { duration: 260, easing: "ease-out" });
      if (stackedNow()) {
        play(dialogRef.current, [{ opacity: 0, transform: "translateY(18px) scale(0.98)" }, { opacity: 1, transform: "none" }], { duration: 420, easing: "cubic-bezier(0.2, 0.8, 0.2, 1)" });
      } else {
        // Closed, the front board lies over the right-hand page, so the book starts a quarter-width left to sit centred
        play(spreadRef.current, [{ transform: "translateX(-25%) scale(0.94)" }, { transform: "translateX(0) scale(1)" }], { duration: OPEN_MS, delay: 80, easing: EASE });
        play(leafRef.current, [{ transform: "translateZ(1px) rotateY(180deg)" }, { transform: "translateZ(1px) rotateY(0deg)" }], { duration: OPEN_MS, delay: 80, easing: EASE });
      }
    }
    return () => running.forEach((a) => a.cancel());
  }, []);

  const requestClose = React.useCallback(() => {
    if (closingRef.current) return;
    closingRef.current = true;
    const backdrop = backdropRef.current;
    if (backdrop) backdrop.style.pointerEvents = "none";
    const opts = { fill: "forwards" };
    const running = [];
    if (reducedMotion()) {
      running.push(backdrop?.animate([{ opacity: 1 }, { opacity: 0 }], { ...opts, duration: 160, easing: "ease-in" }));
    } else if (stackedNow() || !leafRef.current) {
      running.push(dialogRef.current?.animate([{ opacity: 1, transform: "none" }, { opacity: 0, transform: "translateY(14px) scale(0.98)" }], { ...opts, duration: 260, easing: "ease-in" }));
      running.push(backdrop?.animate([{ opacity: 1 }, { opacity: 0 }], { ...opts, duration: 280, easing: "ease-in" }));
    } else {
      running.push(leafRef.current.animate([{ transform: "translateZ(1px) rotateY(0deg)" }, { transform: "translateZ(1px) rotateY(180deg)" }], { ...opts, duration: CLOSE_MS, easing: EASE }));
      running.push(spreadRef.current?.animate([{ transform: "none" }, { transform: "translateX(-25%) scale(0.94)" }], { ...opts, duration: CLOSE_MS, easing: EASE }));
      running.push(backdrop?.animate([{ opacity: 1 }, { opacity: 1, offset: 0.55 }, { opacity: 0 }], { ...opts, duration: CLOSE_MS + 80, easing: "ease-in" }));
    }
    // Whichever comes first: the animation ending, or its length plus a little. A stalled
    // frame clock (a slow device, a backgrounded tab) must not hold the dialog open.
    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      window.clearTimeout(closeTimer.current);
      latest.current.onClose?.();
    };
    Promise.all(running.filter(Boolean).map((a) => a.finished)).catch(() => {}).then(finish);
    closeTimer.current = window.setTimeout(finish, (reducedMotion() ? 160 : CLOSE_MS + 80) + 150);
  }, []);

  // Escape and Tab. Capture on window so Escape plays the close instead of reaching
  // the app's own document listener, which would unmount the spread mid-page.
  React.useEffect(() => {
    const onKey = (event) => {
      if (event.key === "Escape") {
        event.stopPropagation();
        event.preventDefault();
        requestClose();
        return;
      }
      if (event.key !== "Tab") return;
      const dialog = dialogRef.current;
      if (!dialog) return;
      const items = [...dialog.querySelectorAll(FOCUSABLE)];
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement;
      if (!dialog.contains(active) || active === dialog) {
        event.preventDefault();
        (event.shiftKey ? last : first).focus();
      } else if (event.shiftKey && active === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", onKey, true);
    return () => window.removeEventListener("keydown", onKey, true);
  }, [requestClose]);

  // Focus in, lock the page behind; undo both on the way out
  React.useEffect(() => {
    const html = document.documentElement;
    const gap = window.innerWidth - html.clientWidth;
    const previous = { overflow: html.style.overflow, paddingRight: html.style.paddingRight };
    html.style.overflow = "hidden";
    if (gap > 0) html.style.paddingRight = `${gap}px`;
    dialogRef.current?.focus({ preventScroll: true });
    return () => {
      window.clearTimeout(closeTimer.current);
      html.style.overflow = previous.overflow;
      html.style.paddingRight = previous.paddingRight;
      const { returnFocus: target } = latest.current;
      const el = typeof target === "function" ? target() : target;
      el?.focus?.({ preventScroll: true });
    };
  }, []);

  return (
    <div
      ref={backdropRef}
      onPointerDown={(e) => { downOnBackdrop.current = e.target === e.currentTarget; }}
      onClick={(e) => { if (downOnBackdrop.current && e.target === e.currentTarget) requestClose(); }}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 50,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: stacked ? "12px" : "clamp(16px, 3vw, 40px)",
        background: "var(--surface-backdrop)",
        backdropFilter: "blur(var(--blur-backdrop))",
        WebkitBackdropFilter: "blur(var(--blur-backdrop))",
        fontFamily: "var(--font-sans)",
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        style={{
          position: "relative",
          width: stacked ? "min(560px, 100%)" : "min(1120px, 100%)",
          height: stacked ? "100%" : "min(760px, 100%)",
          outline: "none",
        }}
      >
        {stacked ? (
          <div style={board(book, "full")}>
            <Leaf side="full" label={`${project.name}, the project`}>
              <MetaPage project={project} book={book} titleId={titleId} />
              <div
                aria-hidden="true"
                style={{
                  height: 36,
                  margin: "38px calc(-1 * var(--page-x))",
                  background: "linear-gradient(to bottom, rgba(56,36,14,0), rgba(56,36,14,0.12) 44%, rgba(56,36,14,0.22) 50%, rgba(56,36,14,0.12) 56%, rgba(56,36,14,0))",
                }}
              />
              <StoryPage project={project} book={book} />
            </Leaf>
            <CloseButton onClick={requestClose} inset={20} />
          </div>
        ) : (
          // Perspective here, but no shared 3D context: the swinging leaf is drawn above the
          // right-hand page by stacking order rather than depth-sorted against it, which
          // near the spine can put the page over the cover.
          <div ref={spreadRef} style={{ position: "absolute", inset: 0, display: "flex", perspective: 2400 }}>
            <div ref={leafRef} style={{ position: "relative", zIndex: 2, flex: "1 1 0", transformOrigin: "right center", transformStyle: "preserve-3d" }}>
              <div style={{ ...board(book, "left"), backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden" }}>
                <Leaf side="left" label={`${project.name}, about the build`}>
                  <MetaPage project={project} book={book} titleId={titleId} />
                </Leaf>
              </div>
              <Cover project={project} book={book} />
            </div>
            <div style={{ position: "relative", flex: "1 1 0" }}>
              <div style={board(book, "right")}>
                <Leaf side="right" label={`${project.name}, the story`}>
                  <StoryPage project={project} book={book} />
                </Leaf>
              </div>
              <CloseButton onClick={requestClose} inset={30} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
