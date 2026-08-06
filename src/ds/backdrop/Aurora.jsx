import React from "react";

const NEBULA = [
  { style: { left: "calc(8% + var(--mx,0px) * 0.9)", top: "calc(-18% + var(--my,0px) * 0.7)", width: "70vw", height: "70vw", background: "radial-gradient(circle, rgba(139,60,255,0.42) 0%, rgba(139,60,255,0.14) 42%, rgba(139,60,255,0) 68%)", filter: "blur(70px)", animation: "drift1 22s ease-in-out infinite" } },
  { style: { right: "calc(-10% - var(--mx,0px) * 1.2)", top: "calc(6% + var(--my,0px) * -0.5)", width: "62vw", height: "62vw", background: "radial-gradient(circle, rgba(196,90,255,0.34) 0%, rgba(120,40,220,0.12) 45%, rgba(120,40,220,0) 70%)", filter: "blur(80px)", animation: "drift2 28s ease-in-out infinite" } },
  { style: { left: "calc(22% + var(--mx,0px) * -0.6)", bottom: "calc(-24% + var(--my,0px) * -0.8)", width: "86vw", height: "52vw", background: "radial-gradient(ellipse, rgba(88,28,190,0.40) 0%, rgba(60,16,140,0.16) 46%, rgba(60,16,140,0) 72%)", filter: "blur(90px)", animation: "drift3 34s ease-in-out infinite" } },
  { style: { left: "calc(50% + var(--mx,0px) * 1.6)", top: "calc(34% + var(--my,0px) * 1.2)", width: "34vw", height: "34vw", background: "radial-gradient(circle, rgba(232,160,255,0.26) 0%, rgba(232,160,255,0) 66%)", filter: "blur(60px)", animation: "drift2 19s ease-in-out infinite" } },
];

const SHAFTS = [
  { left: "calc(-6% + var(--mx,0px) * 0.5)", top: "-46%", width: "30vw", rotate: "-16deg", grad: "rgba(168,85,247,0) 0%, rgba(147,51,234,0.55) 34%, rgba(216,140,255,0.42) 62%, rgba(88,28,190,0) 92%", blur: "30px", anim: "sway1 17s ease-in-out infinite" },
  { left: "calc(16% + var(--mx,0px) * 0.9)", top: "-52%", width: "20vw", rotate: "-8deg", grad: "rgba(192,132,252,0) 0%, rgba(192,132,252,0.5) 40%, rgba(126,34,206,0.35) 70%, rgba(76,29,149,0) 95%", blur: "24px", anim: "sway2 23s ease-in-out infinite" },
  { left: "calc(44% + var(--mx,0px) * -0.7)", top: "-58%", width: "34vw", rotate: "12deg", grad: "rgba(139,92,246,0) 0%, rgba(168,85,247,0.42) 38%, rgba(233,180,255,0.34) 66%, rgba(60,16,140,0) 94%", blur: "34px", anim: "sway3 29s ease-in-out infinite" },
  { right: "calc(4% - var(--mx,0px) * 1.1)", top: "-50%", width: "26vw", rotate: "20deg", grad: "rgba(147,51,234,0) 0%, rgba(180,90,255,0.48) 36%, rgba(120,40,220,0.3) 68%, rgba(60,16,140,0) 94%", blur: "26px", anim: "sway2 21s ease-in-out infinite reverse" },
];

/** Requires @keyframes drift1/2/3 (nebula) and sway1/2/3 (shafts) in the host page. */
export function Aurora({ variant = "nebula", intensity = 1, parallax = true }) {
  const ref = React.useRef(null);

  React.useEffect(() => {
    if (!parallax) return undefined;
    const onMove = (e) => {
      const el = ref.current;
      if (!el) return;
      el.style.setProperty("--mx", ((e.clientX / window.innerWidth - 0.5) * 90).toFixed(1) + "px");
      el.style.setProperty("--my", ((e.clientY / window.innerHeight - 0.5) * 70).toFixed(1) + "px");
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, [parallax]);

  return (
    <div ref={ref} style={{ position: "fixed", inset: 0, pointerEvents: "none", overflow: "hidden", zIndex: 0, opacity: intensity }}>
      {variant === "nebula"
        ? NEBULA.map((b, i) => <div key={i} style={{ position: "absolute", borderRadius: "50%", ...b.style }} />)
        : SHAFTS.map((s, i) => (
            <div key={i} style={{
              position: "absolute", left: s.left, right: s.right, top: s.top, width: s.width, height: "150vh",
              transform: `rotate(${s.rotate})`, transformOrigin: "top center",
              background: `linear-gradient(to bottom, ${s.grad})`, filter: `blur(${s.blur})`, animation: s.anim,
            }} />
          ))}
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 50% 40%, rgba(5,1,7,0) 30%, rgba(5,1,7,0.65) 78%, #050107 100%)" }} />
      <div style={{ position: "absolute", inset: 0, opacity: 0.5, background: "var(--scanlines)" }} />
    </div>
  );
}
