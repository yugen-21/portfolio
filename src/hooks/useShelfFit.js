import React from "react";

const MAX_COVER = 246; // the size the cover art was authored for (--cover-size max), matches the clamp() in spacing.css

// Tracks how much the CSS cover-size clamp has shrunk the cover below its
// authored art size, so the art layer can be scaled down to match instead
// of getting cropped on narrower viewports.
export function useCoverArtScale() {
  const [scale, setScale] = React.useState(1);

  React.useEffect(() => {
    const compute = () => {
      const coverSize = Math.min(MAX_COVER, Math.max(180, window.innerWidth * 0.17));
      setScale(Math.min(1, coverSize / MAX_COVER));
    };
    compute();
    window.addEventListener("resize", compute);
    return () => window.removeEventListener("resize", compute);
  }, []);

  return scale;
}
