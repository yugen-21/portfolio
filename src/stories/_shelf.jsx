import React from "react";
import { AuroraLayer, WORK_BLOBS } from "../components/AuroraLayer.jsx";
import { ProjectCover } from "../ds/portfolio/ProjectCover.jsx";
import { ShelfRail } from "../ds/portfolio/ShelfRail.jsx";
import { COVER_ART } from "../data/coverArt.jsx";
import { useCoverArtScale } from "../hooks/useShelfFit.js";

/**
 * A faithful copy of the Work page's shelf, shared by the in-context stories so
 * they cannot drift from the real page.
 *
 * The load-bearing detail is the layout: the <section> of covers and the
 * <ShelfRail> must be *siblings in a flex column carrying --gap-section*
 * (62px). ShelfRail's -66px pullUp is calibrated against that gap, so the two
 * cancel to -4px and the covers overlap the rail's top edge by 4px — which is
 * what makes them read as standing on it. Put them in a plain block and the
 * full -66px applies, slicing the rail through the middle of the artwork.
 *
 * Cover art is scaled by useCoverArtScale for the same reason the page does it:
 * --cover-size clamps down on narrow viewports, and the art was authored at the
 * 246px maximum, so without the scale it gets cropped rather than fitted.
 */
export function ShelfScene({
  groups,
  railProps,
  liftedIndex = null,
  onCoverClick,
  coverProps,
  backdrop = true,
  minHeight = "100vh",
}) {
  const artScale = useCoverArtScale();
  let index = -1;

  return (
    <div style={{ position: "relative", minHeight }}>
      {backdrop && <AuroraLayer blobs={WORK_BLOBS} parallax />}

      <div
        style={{
          position: "relative",
          zIndex: 3,
          padding: "70px var(--gutter-page) 60px",
          display: "flex",
          flexDirection: "column",
          gap: "var(--gap-section)",
        }}
      >
        {groups.map((group, gi) => (
          <React.Fragment key={gi}>
            <section
              style={{
                display: "flex",
                alignItems: "flex-end",
                justifyContent: "center",
                flexWrap: "wrap",
                gap: "var(--gap-shelf)",
              }}
            >
              {group.map((p) => {
                index += 1;
                const i = index;
                return (
                  <ProjectCover
                    key={p.name}
                    {...coverProps}
                    year={p.year}
                    caption={p.caption}
                    background={p.bg}
                    captionColor={p.light ? "#5b3a92" : undefined}
                    lifted={liftedIndex === i}
                    onClick={onCoverClick ? () => onCoverClick(i) : undefined}
                  >
                    <div style={{ position: "absolute", inset: 0, transform: `scale(${artScale})`, transformOrigin: "center" }}>
                      {COVER_ART[p.art]}
                    </div>
                  </ProjectCover>
                );
              })}
            </section>
            <ShelfRail {...railProps} />
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
