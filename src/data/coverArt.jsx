const wm = { position: "absolute", left: 18, right: 18, bottom: 44 };

export const COVER_ART = {
  outpass: (
    <>
      <div style={{ position: "absolute", inset: 0, background: "repeating-linear-gradient(90deg, rgba(255,255,255,0.05) 0 1px, transparent 1px 34px)" }} />
      <div style={wm}>
        <div style={{ fontSize: "var(--text-cover-lg)", fontWeight: 700, lineHeight: 0.9, letterSpacing: "var(--track-tight)", color: "#fff" }}>OUT</div>
        <div style={{ fontSize: "var(--text-cover-lg)", fontWeight: 300, lineHeight: 0.9, letterSpacing: "var(--track-tight)", color: "var(--lilac-300)" }}>PASS</div>
        <div style={{ marginTop: 12, height: 1, background: "rgba(196,166,255,0.4)" }} />
      </div>
    </>
  ),
  votechain: (
    <>
      <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(168,85,247,0.16) 1px,transparent 1px),linear-gradient(90deg,rgba(168,85,247,0.16) 1px,transparent 1px)", backgroundSize: "28px 28px" }} />
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 70% 25%, rgba(192,132,252,0.35), transparent 60%)" }} />
      <div style={wm}>
        <div style={{ fontSize: "var(--text-cover-md)", fontWeight: 600, lineHeight: 0.92, letterSpacing: "var(--track-snug)", color: "#fff" }}>VOTE</div>
        <div style={{ fontSize: "var(--text-cover-md)", fontWeight: 600, lineHeight: 0.92, letterSpacing: "0.16em", color: "transparent", WebkitTextStroke: "1px var(--violet-300)" }}>CHAIN</div>
      </div>
    </>
  ),
  medibase: (
    <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontSize: "clamp(32px,3.4vw,48px)", color: "#2a0f52", letterSpacing: "var(--track-neat)" }}>Medibase</div>
    </div>
  ),
  adloom: (
    <>
      <div style={{ position: "absolute", left: 0, right: 0, top: "38%", height: 1, background: "rgba(233,213,255,0.35)" }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: "38%", height: "34%", background: "linear-gradient(180deg, rgba(233,213,255,0.12), transparent)" }} />
      <div style={{ ...wm, bottom: 48 }}>
        <div style={{ fontSize: "var(--text-cover-xl)", fontWeight: 700, lineHeight: 0.85, letterSpacing: "var(--track-tighter)", color: "#fff" }}>AD</div>
        <div style={{ fontSize: "clamp(30px,3.1vw,42px)", fontWeight: 700, lineHeight: 0.9, letterSpacing: "-0.04em", color: "transparent", WebkitTextStroke: "1.2px var(--violet-100)" }}>LOOM</div>
      </div>
    </>
  ),
  shelvefy: (
    <>
      <div style={{ position: "absolute", left: 0, right: 0, top: "22%", height: 6, background: "linear-gradient(90deg,#8b5cf6,#e9d5ff)" }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: "47%", height: 6, background: "linear-gradient(90deg,#e9d5ff,#8b5cf6)" }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: "72%", height: 6, background: "linear-gradient(90deg,#8b5cf6,#c084fc)" }} />
      <div style={{ position: "absolute", left: 18, right: 18, top: "52%", fontSize: "var(--text-cover-sm)", fontWeight: 600, letterSpacing: "var(--track-tight)", color: "#fff" }}>Shelvefy</div>
    </>
  ),
  medulla: (
    <>
      <div style={{ position: "absolute", inset: 0, background: "repeating-radial-gradient(circle at 50% 50%, rgba(168,85,247,0.30) 0 1px, transparent 1px 17px)" }} />
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 50% 50%, rgba(216,180,254,0.28), transparent 55%)" }} />
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8 }}>
        <div style={{ fontFamily: "var(--font-display)", fontSize: "clamp(28px,2.9vw,40px)", color: "#fff" }}>Medulla</div>
        <div style={{ fontSize: "var(--text-caps-xs)", letterSpacing: "var(--track-wide)", color: "var(--lilac-300)", textTransform: "uppercase", paddingLeft: "0.42em" }}>Governance</div>
      </div>
    </>
  ),
  blockmove: (
    <>
      <div style={{ position: "absolute", right: "-6%", top: "6%", width: "40%", aspectRatio: "1", background: "linear-gradient(135deg,#a855f7,#5b21b6)", transform: "rotate(14deg)" }} />
      <div style={{ position: "absolute", right: "22%", top: "22%", width: "26%", aspectRatio: "1", border: "1px solid rgba(233,213,255,0.55)", transform: "rotate(-8deg)" }} />
      <div style={wm}>
        <div style={{ fontSize: "var(--text-cover-md)", fontWeight: 700, lineHeight: 0.9, letterSpacing: "-0.035em", color: "#fff" }}>BLOCK</div>
        <div style={{ fontSize: "var(--text-cover-md)", fontWeight: 300, lineHeight: 0.9, letterSpacing: "-0.035em", color: "var(--violet-200)" }}>MOVE</div>
      </div>
    </>
  ),
};
