import React from "react";
import { Landing } from "./pages/Landing.jsx";
import { Work } from "./pages/Work.jsx";
import { Starfield } from "./ds/backdrop/Starfield.jsx";
import { SiteFooter } from "./components/SiteFooter.jsx";

/**
 * Two views: the landing page, which carries the about content in its own
 * section, and the work page. "About" anywhere is a jump to that section, not
 * a page of its own.
 */
export default function App() {
  const [view, setView] = React.useState("landing");
  const [selected, setSelected] = React.useState(null);
  // Set when a navigation should land on a section rather than the top
  const anchor = React.useRef(null);

  const closePanel = React.useCallback(() => setSelected(null), []);

  React.useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") closePanel(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [closePanel]);

  // After the view has swapped, either go to the requested section or to the top
  React.useLayoutEffect(() => {
    const target = anchor.current;
    anchor.current = null;
    if (!target) return;
    document.getElementById(target)?.scrollIntoView({ behavior: "auto", block: "start" });
  }, [view]);

  const goto = (next, section) => {
    setSelected(null);
    setView(next);
    if (section) anchor.current = section;
    else window.scrollTo(0, 0);
  };

  return (
    <>
      <div style={{ position: "fixed", inset: 0, zIndex: 1, pointerEvents: "none" }}>
        <Starfield />
      </div>

      {view === "landing" && <Landing onViewWork={() => goto("work")} />}
      {view === "work" && (
        <Work
          onBrand={() => goto("landing")}
          onAbout={() => goto("landing", "about")}
          selected={selected}
          onOpen={setSelected}
          onClose={closePanel}
        />
      )}

      {/* The work view is the one page without it: the footer's credit line
          and cat game sit under the landing page only */}
      {view !== "work" && <SiteFooter />}
    </>
  );
}
