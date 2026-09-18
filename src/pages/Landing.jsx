import React from "react";
import { DitherPrism } from "../ds/backdrop/DitherPrism.jsx";
import { NavLink } from "../ds/core/NavLink.jsx";
import { SpecularButton } from "../ds/core/SpecularButton.jsx";
import { ParticleText } from "../ds/effects/ParticleText.jsx";
import { RotatingText } from "../ds/effects/RotatingText.jsx";
import { ScrollSplitCard } from "../ds/effects/ScrollSplitCard.jsx";
import { ROLES } from "../data/projects.js";
import { SKILLS, SKILLS_COVER, SKILLS_COVER_POSITION } from "../data/skills.jsx";
import { OrbitCardStack } from "../ds/effects/OrbitCardStack.jsx";
import { CONTACT } from "../data/contact.jsx";

/**
 * Only the hero has a light layer: a dithered black-to-violet field that fades
 * out at the hero's foot. Everything below sits on the pitch-black page and the
 * starfield App mounts behind every view. The hero is z-[2]; the field's dark
 * pixels are transparent, so the stars (z-index 1) still show through it.
 *
 * `backdrop` swaps the hero's light layer without touching the content; the
 * Backdrop stories pass candidate layers through it so they are judged against
 * real copy rather than a placeholder.
 */
const HERO_FADE = "linear-gradient(to bottom, #000 72%, transparent 100%)";

export function Landing({ onViewWork, onViewAbout, backdrop }) {
  return (
    <div className="relative">
      <div className="relative z-[2] min-h-screen flex flex-col">
        {backdrop ?? (
          <DitherPrism
            color1="#000000"
            color2="#07020f"
            color3="#3b0f7a"
            glow="#9d84c9"
            speed={0.6}
            ditherIntensity={0.12}
            prismIntensity={0.25}
            mouseIntensity={0}
            style={{ maskImage: HERO_FADE, WebkitMaskImage: HERO_FADE }}
          />
        )}

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
            aria-label="Shama Anjum"
          >
            <ParticleText
              text="Shama Anjum"
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

      <section className="relative z-[3]">
        <ScrollSplitCard
          imageSrc={SKILLS_COVER}
          imagePosition={SKILLS_COVER_POSITION}
          cards={SKILLS}
          startLabel="Core skills"
          endLabel="From messy problem to shipped product."
        />
      </section>

      <section className="relative z-[3]">
        <OrbitCardStack items={CONTACT} eyebrow="Contact" title="Where to find me" />
      </section>
    </div>
  );
}
