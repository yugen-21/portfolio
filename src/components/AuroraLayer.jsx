import React from "react";

function useParallax(ref, enabled) {
  React.useEffect(() => {
    if (!enabled) return undefined;
    const onMove = (e) => {
      const el = ref.current;
      if (!el) return;
      el.style.setProperty("--mx", ((e.clientX / window.innerWidth - 0.5) * 90).toFixed(1) + "px");
      el.style.setProperty("--my", ((e.clientY / window.innerHeight - 0.5) * 70).toFixed(1) + "px");
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, [ref, enabled]);
}

const VIGNETTE = {
  position: "absolute",
  inset: 0,
  background: "radial-gradient(ellipse at 50% 40%, rgba(5,1,7,0) 30%, rgba(5,1,7,0.65) 78%, #050107 100%)",
};

const SCAN = {
  position: "absolute",
  inset: 0,
  opacity: 0.5,
  background: "var(--scanlines)",
};

export const LANDING_BLOBS = [
  { left: "calc(-6% + var(--mx,0px) * 0.5)", top: "-46%", width: "30vw", height: "150vh", transform: "rotate(-16deg)", transformOrigin: "top center", background: "linear-gradient(to bottom, rgba(168,85,247,0) 0%, rgba(147,51,234,0.55) 34%, rgba(216,140,255,0.42) 62%, rgba(88,28,190,0) 92%)", filter: "blur(30px)", animation: "sway1 17s ease-in-out infinite" },
  { left: "calc(16% + var(--mx,0px) * 0.9)", top: "-52%", width: "20vw", height: "150vh", transform: "rotate(-8deg)", transformOrigin: "top center", background: "linear-gradient(to bottom, rgba(192,132,252,0) 0%, rgba(192,132,252,0.5) 40%, rgba(126,34,206,0.35) 70%, rgba(76,29,149,0) 95%)", filter: "blur(24px)", animation: "sway2 23s ease-in-out infinite" },
  { left: "calc(44% + var(--mx,0px) * -0.7)", top: "-58%", width: "34vw", height: "155vh", transform: "rotate(12deg)", transformOrigin: "top center", background: "linear-gradient(to bottom, rgba(139,92,246,0) 0%, rgba(168,85,247,0.42) 38%, rgba(233,180,255,0.34) 66%, rgba(60,16,140,0) 94%)", filter: "blur(34px)", animation: "sway3 29s ease-in-out infinite" },
  { right: "calc(4% - var(--mx,0px) * 1.1)", top: "-50%", width: "26vw", height: "150vh", transform: "rotate(20deg)", transformOrigin: "top center", background: "linear-gradient(to bottom, rgba(147,51,234,0) 0%, rgba(180,90,255,0.48) 36%, rgba(120,40,220,0.3) 68%, rgba(60,16,140,0) 94%)", filter: "blur(26px)", animation: "sway2 21s ease-in-out infinite reverse" },
  { left: "calc(10% + var(--mx,0px) * 0.6)", top: "calc(-24% + var(--my,0px) * 0.6)", width: "64vw", height: "64vw", borderRadius: "50%", background: "radial-gradient(circle, rgba(139,60,255,0.30) 0%, rgba(139,60,255,0.10) 44%, rgba(139,60,255,0) 68%)", filter: "blur(80px)", animation: "drift1 22s ease-in-out infinite" },
];

export const WORK_BLOBS = [
  { left: "calc(8% + var(--mx,0px) * 0.9)", top: "calc(-18% + var(--my,0px) * 0.7)", width: "70vw", height: "70vw", borderRadius: "50%", background: "radial-gradient(circle, rgba(139,60,255,0.42) 0%, rgba(139,60,255,0.14) 42%, rgba(139,60,255,0) 68%)", filter: "blur(70px)", animation: "drift1 22s ease-in-out infinite" },
  { right: "calc(-10% - var(--mx,0px) * 1.2)", top: "calc(6% + var(--my,0px) * -0.5)", width: "62vw", height: "62vw", borderRadius: "50%", background: "radial-gradient(circle, rgba(196,90,255,0.34) 0%, rgba(120,40,220,0.12) 45%, rgba(120,40,220,0) 70%)", filter: "blur(80px)", animation: "drift2 28s ease-in-out infinite" },
  { left: "calc(22% + var(--mx,0px) * -0.6)", bottom: "calc(-24% + var(--my,0px) * -0.8)", width: "86vw", height: "52vw", borderRadius: "50%", background: "radial-gradient(ellipse, rgba(88,28,190,0.40) 0%, rgba(60,16,140,0.16) 46%, rgba(60,16,140,0) 72%)", filter: "blur(90px)", animation: "drift3 34s ease-in-out infinite" },
];

export const ABOUT_BLOBS = [
  { left: "calc(-6% + var(--mx,0px) * 0.8)", top: "calc(-14% + var(--my,0px) * 0.6)", width: "66vw", height: "66vw", borderRadius: "50%", background: "radial-gradient(circle, rgba(139,60,255,0.38) 0%, rgba(139,60,255,0.12) 44%, rgba(139,60,255,0) 70%)", filter: "blur(74px)", animation: "drift1 24s ease-in-out infinite" },
  { right: "calc(-12% - var(--mx,0px) * 1.1)", bottom: "calc(-16% + var(--my,0px) * -0.4)", width: "58vw", height: "58vw", borderRadius: "50%", background: "radial-gradient(circle, rgba(196,90,255,0.30) 0%, rgba(120,40,220,0.10) 46%, rgba(120,40,220,0) 72%)", filter: "blur(82px)", animation: "drift2 30s ease-in-out infinite" },
];

export function AuroraLayer({ blobs, scan = false, parallax = true }) {
  const ref = React.useRef(null);
  useParallax(ref, parallax);
  return (
    <div ref={ref} style={{ position: "fixed", inset: 0, pointerEvents: "none", overflow: "hidden", zIndex: 0 }}>
      {blobs.map((b, i) => (
        <div key={i} style={{ position: "absolute", ...b }} />
      ))}
      <div style={VIGNETTE} />
      {scan && <div style={SCAN} />}
    </div>
  );
}
