import React from "react";
import { AuroraLayer, WORK_BLOBS } from "../components/AuroraLayer.jsx";
import { NavLink } from "../ds/core/NavLink.jsx";
import { ProjectCover } from "../ds/portfolio/ProjectCover.jsx";
import { ShelfRail } from "../ds/portfolio/ShelfRail.jsx";
import { IndexRow } from "../ds/portfolio/IndexRow.jsx";
import { ProjectPanel } from "../ds/portfolio/ProjectPanel.jsx";
import { PROJECTS } from "../data/projects.js";
import { COVER_ART } from "../data/coverArt.jsx";
import { useCoverArtScale } from "../hooks/useShelfFit.js";

function Shelf({ projects, offset, liftedIndex, onCoverClick, artScale }) {
  return (
    <>
      <section
        className="flex items-end justify-center flex-wrap"
        style={{ gap: "var(--gap-shelf)" }}
      >
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
            <div
              style={{
                position: "absolute",
                inset: 0,
                transform: `scale(${artScale})`,
                transformOrigin: "center",
              }}
            >
              {COVER_ART[p.art]}
            </div>
          </ProjectCover>
        ))}
      </section>
      <ShelfRail />
    </>
  );
}

export function Work({ onBrand, onAbout, selected, onOpen, onClose }) {
  const [liftedIndex, setLiftedIndex] = React.useState(null);
  const artScale = useCoverArtScale();

  React.useEffect(() => {
    if (selected == null) setLiftedIndex(null);
  }, [selected]);

  const handleCoverClick = (i) => {
    setLiftedIndex(i);
    window.setTimeout(() => onOpen(i), 300);
  };

  return (
    <div className="relative min-h-screen flex flex-col">
      <AuroraLayer blobs={WORK_BLOBS} parallax />

      <header className="relative z-[3] flex items-center gap-6 flex-wrap px-[34px] py-[14px] shrink-0">
        <div
          className="flex items-baseline gap-3.5 cursor-pointer"
          onClick={onBrand}
        >
          <span
            style={{
              fontSize: "var(--text-nav-brand)",
              fontWeight: 600,
              letterSpacing: "var(--track-neat)",
              color: "var(--text-display)",
            }}
          >
            Shama Anjum
          </span>
          <span
            style={{
              fontSize: 13,
              color: "var(--mauve-400)",
              letterSpacing: "0.02em",
            }}
          >
            Software Engineer
          </span>
        </div>
        <nav className="flex items-center gap-2 ml-auto">
          <a
            onClick={(e) => {
              e.preventDefault();
              onAbout();
            }}
            href="#"
            style={{
              fontSize: "var(--text-ui)",
              padding: "9px 14px",
              borderRadius: "var(--radius-pill)",
              color: "#d9c8f5",
            }}
          >
            About
          </a>
          <NavLink href="mailto:shamaazath@gmail.com">Email</NavLink>
          <NavLink href="https://www.linkedin.com/in/a-shama-anjum/" external>
            LinkedIn
          </NavLink>
          <NavLink
            href="https://github.com/yugen-21"
            external
            emphasis="strong"
          >
            GitHub
          </NavLink>
        </nav>
      </header>

      <div className="relative z-[3] px-[34px] shrink-0">
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
          Making solutions to real-world problems{" "}
          <span style={{ color: "var(--mauve-300)" }}>since 2023.</span>
        </h1>
      </div>

      <div
        className="relative z-[3] flex flex-col px-[34px] pt-9 shrink-0"
        style={{ gap: "var(--gap-section)" }}
      >
        <Shelf
          projects={PROJECTS.slice(0, 4)}
          offset={0}
          liftedIndex={liftedIndex}
          onCoverClick={handleCoverClick}
          artScale={artScale}
        />
        <Shelf
          projects={PROJECTS.slice(4, 7)}
          offset={4}
          liftedIndex={liftedIndex}
          onCoverClick={handleCoverClick}
          artScale={artScale}
        />
      </div>

      <div
        className="relative z-[3] flex items-center justify-between flex-wrap mt-10 mb-10 px-[34px] py-[18px] shrink-0 gap-x-8 gap-y-4"
        style={{ borderTop: "1px solid var(--border-hairline)" }}
      >
        {PROJECTS.map((p, i) => (
          <IndexRow
            key={p.name}
            year={p.year}
            name={p.name}
            onClick={() => handleCoverClick(i)}
          />
        ))}
      </div>

      {selected != null && (
        <ProjectPanel project={PROJECTS[selected]} onClose={onClose} />
      )}
    </div>
  );
}
