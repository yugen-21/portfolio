import React from "react";

const KF = `
@keyframes ds-rt-in{from{transform:translateY(100%);opacity:0}to{transform:translateY(0);opacity:1}}
@keyframes ds-rt-out{from{transform:translateY(0);opacity:1}to{transform:translateY(-120%);opacity:0}}
`;
if (typeof document !== "undefined" && !document.getElementById("ds-rt-kf")) {
  const el = document.createElement("style");
  el.id = "ds-rt-kf";
  el.textContent = KF;
  document.head.appendChild(el);
}

const splitIntoCharacters = (text) => {
  if (typeof Intl !== "undefined" && Intl.Segmenter) {
    const seg = new Intl.Segmenter("en", { granularity: "grapheme" });
    return Array.from(seg.segment(text), (s) => s.segment);
  }
  return Array.from(text);
};

export function RotatingText({
  texts = [],
  rotationInterval = 2400,
  duration = 520,
  easing = "cubic-bezier(0.16, 1, 0.3, 1)",
  staggerDuration = 0.025,
  staggerFrom = "last",
  loop = true,
  auto = true,
  splitBy = "characters",
  animateWidth = true,
  onNext,
  className = "",
  style,
  charStyle,
}) {
  const [index, setIndex] = React.useState(0);
  const [phase, setPhase] = React.useState("in");
  const [widths, setWidths] = React.useState([]);
  const ghostRef = React.useRef(null);
  const info = React.useRef({});
  const reduced =
    typeof window !== "undefined" && window.matchMedia
      ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
      : false;

  const list = texts.length ? texts : [""];
  const nextIndex = index === list.length - 1 ? (loop ? 0 : index) : index + 1;

  const elements = React.useMemo(() => {
    const current = list[index] || "";
    if (splitBy === "characters") {
      const words = current.split(" ");
      return words.map((word, i) => ({ characters: splitIntoCharacters(word), needsSpace: i !== words.length - 1 }));
    }
    if (splitBy === "words") {
      const words = current.split(" ");
      return words.map((word, i) => ({ characters: [word], needsSpace: i !== words.length - 1 }));
    }
    const parts = current.split(splitBy);
    return parts.map((part, i) => ({ characters: [part], needsSpace: i !== parts.length - 1 }));
  }, [list, index, splitBy]);

  const totalChars = elements.reduce((sum, e) => sum + e.characters.length, 0);
  const staggerMs = staggerDuration * 1000;

  const delayFor = (i) => {
    if (reduced) return 0;
    if (staggerFrom === "first") return i * staggerMs;
    if (staggerFrom === "last") return (totalChars - 1 - i) * staggerMs;
    if (staggerFrom === "center") return Math.abs(Math.floor(totalChars / 2) - i) * staggerMs;
    if (staggerFrom === "random") return Math.floor(Math.random() * totalChars) * staggerMs;
    return Math.abs(Number(staggerFrom) - i) * staggerMs;
  };

  const measure = React.useCallback(() => {
    const ghost = ghostRef.current;
    if (!ghost) return;
    setWidths(Array.from(ghost.children).map((c) => Math.ceil(c.getBoundingClientRect().width)));
  }, []);

  React.useLayoutEffect(() => {
    measure();
    if (typeof document !== "undefined" && document.fonts && document.fonts.ready) {
      document.fonts.ready.then(measure).catch(() => {});
    }
    if (typeof window === "undefined") return undefined;
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [measure, list.join("|")]);

  info.current = { widths, nextIndex, totalChars, staggerMs, duration, reduced, onNext, rotationInterval };

  const w = widths.length ? widths[phase === "out" ? nextIndex : index] : null;

  React.useEffect(() => {
    if (!auto || list.length < 2) return undefined;
    const c = info.current;
    if (phase === "in") {
      const t = setTimeout(() => setPhase("out"), c.rotationInterval);
      return () => clearTimeout(t);
    }
    const outMs = c.reduced ? 0 : c.duration + Math.max(0, c.totalChars - 1) * c.staggerMs;
    const t = setTimeout(() => {
      setIndex(c.nextIndex);
      setPhase("in");
      if (c.onNext) c.onNext(c.nextIndex);
    }, outMs);
    return () => clearTimeout(t);
  }, [phase, index, auto, list.length]);

  const wrap = {
    position: "relative",
    display: "inline-flex",
    verticalAlign: "baseline",
    whiteSpace: "pre",
    overflow: "hidden",
    ...(animateWidth && w != null
      ? { width: w + "px", transition: reduced ? "none" : `width ${duration}ms ${easing}` }
      : null),
    ...style,
  };

  let charIndex = -1;

  return (
    <span className={className} style={wrap}>
      <span
        ref={ghostRef}
        aria-hidden="true"
        style={{ position: "absolute", left: 0, top: 0, visibility: "hidden", pointerEvents: "none", whiteSpace: "pre", display: "block" }}
      >
        {list.map((t, i) => (
          <span key={i} style={{ display: "block", width: "max-content" }}>{t}</span>
        ))}
      </span>
      <span style={{ position: "absolute", width: 1, height: 1, overflow: "hidden", clip: "rect(0 0 0 0)" }}>{list[index]}</span>
      <span aria-hidden="true" style={{ display: "inline-flex", whiteSpace: "pre" }}>
        {elements.map((wordObj, wordIndex) => (
          <span key={wordIndex} style={{ display: "inline-flex", overflow: "hidden", paddingBottom: "0.08em" }}>
            {wordObj.characters.map((char, ci) => {
              charIndex += 1;
              const d = delayFor(charIndex);
              return (
                <span
                  key={index + "-" + phase + "-" + wordIndex + "-" + ci}
                  style={{
                    display: "inline-block",
                    opacity: 1,
                    willChange: "transform, opacity",
                    animation: reduced ? "none" : `ds-rt-${phase} ${duration}ms ${easing} ${d}ms ${phase === "out" ? "forwards" : "backwards"}`,
                    ...charStyle,
                  }}
                >
                  {char}
                </span>
              );
            })}
            {wordObj.needsSpace ? <span style={{ whiteSpace: "pre" }}> </span> : null}
          </span>
        ))}
      </span>
    </span>
  );
}
