import React from "react";
import { Landing } from "./pages/Landing.jsx";
import { Work } from "./pages/Work.jsx";
import { About } from "./pages/About.jsx";
import { Particles } from "./ds/backdrop/Particles.jsx";

export default function App() {
  const [view, setView] = React.useState("landing");
  const [selected, setSelected] = React.useState(null);

  const closePanel = React.useCallback(() => setSelected(null), []);

  React.useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") closePanel(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [closePanel]);

  const goto = (next) => {
    setSelected(null);
    setView(next);
    window.scrollTo(0, 0);
  };

  return (
    <>
      <div style={{ position: "fixed", inset: 0, zIndex: 1, pointerEvents: "none" }}>
        <Particles
          particleColors={["#c4a6ff", "#a855f7", "#ede4ff"]}
          particleCount={140}
          particleSpread={14}
          speed={0.06}
          particleBaseSize={60}
          sizeRandomness={1}
          alphaParticles
          moveParticlesOnHover
          particleHoverFactor={0.4}
          pixelRatio={1}
        />
      </div>

      {view === "landing" && (
        <Landing onViewWork={() => goto("work")} onViewAbout={() => goto("about")} />
      )}
      {view === "work" && (
        <Work
          onBrand={() => goto("landing")}
          onAbout={() => goto("about")}
          selected={selected}
          onOpen={setSelected}
          onClose={closePanel}
        />
      )}
      {view === "about" && (
        <About onBrand={() => goto("landing")} onWork={() => goto("work")} />
      )}
    </>
  );
}
