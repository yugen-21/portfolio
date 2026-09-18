import React from "react";
import { AuroraLayer, WORK_BLOBS } from "../components/AuroraLayer.jsx";
import { NavLink } from "../ds/core/NavLink.jsx";
import { ProjectCover } from "../ds/portfolio/ProjectCover.jsx";
import { ShelfRail } from "../ds/portfolio/ShelfRail.jsx";
import { deriveLayout, shelfBox } from "../ds/portfolio/bookLayout.js";
import { IndexRow } from "../ds/portfolio/IndexRow.jsx";
import { ProjectPanel } from "../ds/portfolio/ProjectPanel.jsx";
import { BookSpread } from "../ds/portfolio/BookSpread.jsx";
import { PROJECTS } from "../data/projects.js";
import { COVER_ART } from "../data/coverArt.jsx";
import { useCoverArtScale } from "../hooks/useShelfFit.js";

// three.js arrives with the Books view rather than with the landing page
const ShelfBooks = React.lazy(() => import("../ds/portfolio/ShelfBooks.jsx").then((m) => ({ default: m.ShelfBooks })));

const SHELVES = [
  { offset: 0, projects: PROJECTS.slice(0, 4) },
  { offset: 4, projects: PROJECTS.slice(4, 7) },
];

// Every project on one shelf. Built once so ShelfBooks sees stable items and never rebuilds its scene on a re-render
const BOOKS = PROJECTS.map((p) => ({ id: p.name, title: p.name, date: p.year, subtitle: p.caption, color: p.book }));

// Holds the shelf at its loaded height and base line while the renderer downloads, so the rail does not jump
const BOOK_LAYOUT = deriveLayout(BOOKS);
const BOOK_PLACEHOLDER = shelfBox(BOOK_LAYOUT);

const VIEWS = [
  { id: "covers", label: "Covers" },
  { id: "books", label: "Books" },
];
const VIEW_KEY = "work-shelf-view";

// Lets the lifted cover or the turned book register before the panel covers it
const OPEN_DELAY = { covers: 300, books: 420 };

const readView = () => {
  try {
    const stored = window.sessionStorage.getItem(VIEW_KEY);
    return VIEWS.some((v) => v.id === stored) ? stored : "books";
  } catch {
    return "books";
  }
};

function CoverShelf({ projects, offset, liftedIndex, onCoverClick, artScale }) {
  return (
    <>
      <section className="flex items-end justify-center flex-wrap" style={{ gap: "var(--gap-shelf)" }}>
        {projects.map((p, i) => (
          <ProjectCover
            key={p.name}
            year={p.year}
            caption={p.caption}
            background={p.bg}
            captionColor={p.light ? "#5b3a92" : undefined}
            lifted={liftedIndex === offset + i}
            onClick={() => onCoverClick(offset + i)}
          >
            <div style={{ position: "absolute", inset: 0, transform: `scale(${artScale})`, transformOrigin: "center" }}>
              {COVER_ART[p.art]}
            </div>
          </ProjectCover>
        ))}
      </section>
      <ShelfRail />
    </>
  );
}

function BookShelf({ liftedIndex, onBookClick }) {
  return (
    <div className="flex flex-col">
      <React.Suspense fallback={<div style={BOOK_PLACEHOLDER} />}>
        <ShelfBooks books={BOOKS} brand="A. Shama Anjum" selectedIndex={liftedIndex} onSelect={onBookClick} />
      </React.Suspense>
      {/* ShelfBooks ends on the books' base line. The rail's top surface projects to 20px, so
          pulling it up 14 seats the spines on it with 6px of shelf showing in front. */}
      <ShelfRail pullUp={14} />
    </div>
  );
}

function ViewToggle({ value, onChange }) {
  const refs = React.useRef({});
  const [hover, setHover] = React.useState(null);

  const onKeyDown = (event) => {
    const step = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[event.key];
    if (!step) return;
    event.preventDefault();
    const index = VIEWS.findIndex((v) => v.id === value);
    const next = VIEWS[(index + step + VIEWS.length) % VIEWS.length].id;
    onChange(next);
    refs.current[next]?.focus();
  };

  return (
    <div
      role="radiogroup"
      aria-label="Show projects as"
      onKeyDown={onKeyDown}
      style={{
        display: "inline-flex",
        padding: 3,
        gap: 2,
        borderRadius: "var(--radius-pill)",
        border: "1px solid var(--border-hairline)",
        background: "var(--tint-ghost)",
      }}
    >
      {VIEWS.map((view) => {
        const checked = view.id === value;
        return (
          <button
            key={view.id}
            ref={(node) => { refs.current[view.id] = node; }}
            type="button"
            role="radio"
            aria-checked={checked}
            tabIndex={checked ? 0 : -1}
            onClick={() => onChange(view.id)}
            onMouseEnter={() => setHover(view.id)}
            onMouseLeave={() => setHover(null)}
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "var(--text-ui)",
              fontWeight: checked ? "var(--weight-medium)" : "var(--weight-regular)",
              padding: "7px 16px",
              border: 0,
              borderRadius: "var(--radius-pill)",
              cursor: "pointer",
              background: checked ? "var(--fill-light)" : hover === view.id ? "var(--tint-hover)" : "transparent",
              color: checked ? "var(--text-on-light)" : "var(--text-primary)",
              transition: "background var(--dur-fast) ease, color var(--dur-fast) ease",
            }}
          >
            {view.label}
          </button>
        );
      })}
    </div>
  );
}

export function Work({ onBrand, selected, onOpen, onClose }) {
  const [liftedIndex, setLiftedIndex] = React.useState(null);
  const openerRef = React.useRef(null);
  const [view, setView] = React.useState(readView);
  const artScale = useCoverArtScale();

  React.useEffect(() => {
    if (selected == null) setLiftedIndex(null);
  }, [selected]);

  const changeView = (next) => {
    setView(next);
    try {
      window.sessionStorage.setItem(VIEW_KEY, next);
    } catch {
      // Private mode or blocked storage: the choice just won't outlive the page
    }
  };

  const handleCoverClick = (i) => {
    // Whatever opened the project gets focus back when it closes: the book, or its index row
    const active = document.activeElement;
    openerRef.current = active && active !== document.body ? active : null;
    setLiftedIndex(i);
    window.setTimeout(() => onOpen(i), OPEN_DELAY[view]);
  };

  return (
    <div className="relative min-h-screen flex flex-col">
      <AuroraLayer blobs={WORK_BLOBS} parallax />

      <header className="relative z-[3] flex items-center gap-6 flex-wrap px-[34px] py-[14px] shrink-0">
        <div className="flex items-baseline gap-3.5 cursor-pointer" onClick={onBrand}>
          <span style={{ fontSize: "var(--text-nav-brand)", fontWeight: 600, letterSpacing: "var(--track-neat)", color: "var(--text-display)" }}>A. Shama Anjum</span>
          <span style={{ fontSize: 13, color: "var(--mauve-400)", letterSpacing: "0.02em" }}>Software Engineer</span>
        </div>
        <nav className="flex items-center gap-2 ml-auto">
          <NavLink href="mailto:shamaazath@gmail.com">Email</NavLink>
          <NavLink href="https://www.linkedin.com/in/a-shama-anjum/" external>LinkedIn</NavLink>
          <NavLink href="https://github.com/yugen-21" external emphasis="strong">GitHub</NavLink>
        </nav>
      </header>

      <div className="relative z-[3] px-[34px] shrink-0 flex items-end justify-between flex-wrap gap-x-8 gap-y-4">
        <h1
          style={{
            margin: 0,
            fontFamily: "var(--font-display)",
            fontWeight: 400,
            fontSize: "var(--text-title)",
            lineHeight: "var(--leading-title)",
            letterSpacing: "var(--track-neat)",
            color: "var(--white-page)",
            maxWidth: "var(--measure-title)",
            textWrap: "pretty",
          }}
        >
          Making solutions to real-world problems <span style={{ color: "var(--mauve-300)" }}>since 2023.</span>
        </h1>
        <ViewToggle value={view} onChange={changeView} />
      </div>

      <div
        key={view}
        className="relative z-[3] flex flex-col px-[34px] pt-9 shrink-0"
        style={{ gap: "var(--gap-section)", animation: "rise var(--dur-rise) var(--ease-rise)" }}
      >
        {view === "books"
          ? <BookShelf liftedIndex={liftedIndex} onBookClick={handleCoverClick} />
          : SHELVES.map(({ offset, projects }) => (
              <CoverShelf key={offset} projects={projects} offset={offset} liftedIndex={liftedIndex} onCoverClick={handleCoverClick} artScale={artScale} />
            ))}
      </div>

      <div
        className="relative z-[3] flex items-center justify-between flex-wrap mt-10 mb-10 px-[34px] py-[18px] shrink-0 gap-x-8 gap-y-4"
        style={{ borderTop: "1px solid var(--border-hairline)" }}
      >
        {PROJECTS.map((p, i) => (
          <IndexRow key={p.name} year={p.year} name={p.name} onClick={() => handleCoverClick(i)} />
        ))}
      </div>

      {selected != null && (view === "books" ? (
        <BookSpread
          project={PROJECTS[selected]}
          book={BOOK_LAYOUT[selected]}
          onClose={onClose}
          // Safari does not focus a clicked button, so fall back to the book itself
          returnFocus={() => (openerRef.current?.isConnected ? openerRef.current : document.querySelector(`[data-book-index="${selected}"]`))}
        />
      ) : (
        <ProjectPanel project={PROJECTS[selected]} onClose={onClose} />
      ))}
    </div>
  );
}
