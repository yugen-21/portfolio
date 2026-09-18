import React from "react";
import { Landing } from "./pages/Landing.jsx";
import { Work } from "./pages/Work.jsx";
import { About } from "./pages/About.jsx";
import { Starfield } from "./ds/backdrop/Starfield.jsx";
import { SiteFooter } from "./components/SiteFooter.jsx";

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
        <Starfield />
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

      <SiteFooter />
    </>
  );
}
