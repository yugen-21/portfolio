import React from "react";
import {
  Outpass, Votechain, Medibase, Adloom, Shelvefy, Medulla, Blockmove,
} from "../ds/portfolio/coverArtPieces.jsx";

/**
 * Maps a project's `art` key to its artwork. Kept as elements rather than
 * component references so every existing `{COVER_ART[p.art]}` call site works
 * unchanged — React elements are immutable descriptors, so reusing one across
 * several covers is fine.
 *
 * The artwork itself lives in ds/portfolio/coverArtPieces.jsx, since each piece
 * animates when its cover is picked up.
 */
export const COVER_ART = {
  outpass: <Outpass />,
  votechain: <Votechain />,
  medibase: <Medibase />,
  adloom: <Adloom />,
  shelvefy: <Shelvefy />,
  medulla: <Medulla />,
  blockmove: <Blockmove />,
};
