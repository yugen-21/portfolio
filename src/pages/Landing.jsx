import React from "react";
import { AuroraLayer, LANDING_BLOBS } from "../components/AuroraLayer.jsx";
import { NavLink } from "../ds/core/NavLink.jsx";
import { SpecularButton } from "../ds/core/SpecularButton.jsx";
import { ParticleText } from "../ds/effects/ParticleText.jsx";
import { RotatingText } from "../ds/effects/RotatingText.jsx";
import { ROLES } from "../data/projects.js";

export function Landing({ onViewWork, onViewAbout }) {
  return (
    <div className="relative min-h-screen flex flex-col">
      <AuroraLayer blobs={LANDING_BLOBS} scan parallax />

      <header className="relative z-[3] flex items-center justify-end gap-6 flex-wrap px-[34px] py-[22px]">
        <nav className="flex items-center gap-2">
          <NavLink href="mailto:shamaazath@gmail.com">Email</NavLink>
          <NavLink href="https://www.linkedin.com/in/a-shama-anjum/" external>LinkedIn</NavLink>
          <NavLink href="https://github.com/yugen-21" external emphasis="strong">GitHub</NavLink>
        </nav>
      </header>

      <main className="relative z-[3] flex-1 flex flex-col justify-center px-[34px] pt-[6vh] pb-[10vh]">
        <div
          className="mt-[22px]"
          style={{ height: "clamp(92px,13vw,168px)", fontFamily: "var(--font-display)" }}
          aria-label="A. Shama Anjum"
        >
          <ParticleText
            text="A. Shama Anjum"
            align="left"
            trigger="mount"
            density={3}
            particleSize={2}
            scatter={200}
            gatherDuration={1700}
            stagger={460}
            fontFamily="'Instrument Serif', Georgia, serif"
            fontWeight={400}
            fontSize="clamp(46px, 8vw, 110px)"
            color="#faf6ff"
            highlightColor="#a855f7"
          />
        </div>

        <div
          className="mt-[30px] flex items-baseline whitespace-nowrap"
          style={{ fontSize: "var(--text-lead)", lineHeight: "var(--leading-snug)", letterSpacing: "var(--track-snug)" }}
        >
          <RotatingText
            texts={ROLES}
            staggerFrom="last"
            staggerDuration={0.025}
            rotationInterval={2400}
            charStyle={{ color: "var(--text-accent)" }}
          />
          <span className="inline-block pl-[0.3em]" style={{ color: "var(--text-primary)" }}>Engineer</span>
        </div>

        <p
          className="mt-[34px]"
          style={{ maxWidth: "var(--measure-body)", fontSize: "var(--text-body)", lineHeight: "var(--leading-body)", color: "var(--text-body)", textWrap: "pretty" }}
        >
          I turn messy problems into products people can actually use. Seven of them since 2023, from a campus outpass system to a platform that diagnoses hospitals.
        </p>

        <div className="mt-[44px] flex flex-wrap gap-3">
          <SpecularButton variant="solid" size="lg" radius={999} onClick={onViewWork}>View work</SpecularButton>
          <SpecularButton variant="violet" size="lg" radius={999} onClick={onViewAbout}>About me</SpecularButton>
        </div>
      </main>
    </div>
  );
}
