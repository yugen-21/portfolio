import React from "react";
import { EyebrowLabel } from "../ds/core/EyebrowLabel.jsx";
import { LogoLoop } from "../ds/effects/LogoLoop.jsx";
import { WORK_HISTORY, EDUCATION, TECH } from "../data/about.js";
import { WorkNudgeCat } from "./WorkNudgeCat.jsx";
import { AnnotatedQuotes } from "./AnnotatedQuotes.jsx";

/**
 * The About Me content — the two intro paragraphs, the technology strip and the
 * two timelines — as one block, so the About page and the Landing page's About
 * section stay the same words rather than two copies that drift apart.
 *
 * `gutter` is the horizontal page padding of whatever mounts it, in px; the
 * LogoLoop is pulled out by that much on both sides so the strip runs full
 * bleed while the prose keeps its measure.
 *
 * Pass `onViewWork` and the page drops the nudge cat in after the work history,
 * pointing at a way through to the work. The About page, which has the work a
 * click away in its own header, leaves it out.
 */
function TimelineRow({ when, what, where, note, list, isLast }) {
  return (
    <div
      className="grid gap-[26px] py-[22px]"
      style={{
        gridTemplateColumns: "130px 1fr",
        borderTop: "1px solid var(--border-hairline)",
        borderBottom: isLast ? "1px solid var(--border-hairline)" : undefined,
      }}
    >
      <div
        style={{
          fontSize: "var(--text-caps)",
          letterSpacing: "var(--track-caps)",
          textTransform: "uppercase",
          color: "var(--text-muted)",
          paddingTop: 4,
        }}
      >
        {when}
      </div>
      <div>
        <div
          style={{
            fontSize: "var(--text-panel)",
            color: "var(--text-display)",
          }}
        >
          {what}
        </div>
        <div
          className="mt-1.5"
          style={{ fontSize: "var(--text-ui)", color: "var(--text-accent)" }}
        >
          {where}
        </div>
        {note && (
          <p
            className="mt-2.5"
            style={{
              fontSize: "var(--text-ui)",
              lineHeight: "var(--leading-list)",
              color: "var(--text-panel-body)",
              maxWidth: "60ch",
              textWrap: "pretty",
            }}
          >
            {note}
          </p>
        )}
        {list && (
          <ul
            className="mt-3 flex flex-col gap-2 p-0"
            style={{ listStyle: "none", maxWidth: "60ch" }}
          >
            {list.map((item) => (
              <li
                key={item}
                className="relative pl-[18px]"
                style={{
                  fontSize: "var(--text-ui)",
                  lineHeight: "var(--leading-list)",
                  color: "var(--text-panel-body)",
                  textWrap: "pretty",
                }}
              >
                <span
                  className="absolute left-0"
                  style={{
                    top: "0.62em",
                    width: 4,
                    height: 4,
                    borderRadius: "50%",
                    background: "var(--accent)",
                  }}
                />
                {item}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

const H2 = {
  fontFamily: "var(--font-display)",
  fontWeight: 400,
  fontSize: "var(--text-h2)",
  lineHeight: "var(--leading-heading)",
  color: "var(--text-display)",
  margin: 0,
};

const BODY = {
  maxWidth: "var(--measure-body)",
  fontSize: "var(--text-body)",
  lineHeight: "var(--leading-body)",
  color: "var(--text-body)",
  textWrap: "pretty",
};

export function AboutBlock({ gutter = 34, onViewWork }) {
  return (
    <>
      <p style={BODY}>
        Full stack developer in Chennai. Most recently the sole developer on two
        early-stage B2B SaaS products: a hospital governance platform for the
        GCC, and a logistics platform for non-containerised cargo. Before that,
        a founding engineer building MVPs from nothing.
      </p>
      <p className="mt-5" style={BODY}>
        The teams were small, so the job was never only the code. I turned the
        CEO's business requirements into technical ones, wrote the pitch decks
        and technical scope documents, and designed the UI as well as built it,
        with Storybook for the component library.
      </p>

      <section style={{ marginTop: "var(--gap-section)" }}>
        <EyebrowLabel style={{ color: "var(--text-muted)", marginBottom: 20 }}>
          What I work with
        </EyebrowLabel>
        <div style={{ margin: `0 ${-gutter}px` }}>
          <LogoLoop
            logos={TECH}
            speed={34}
            gap={74}
            logoHeight={36}
            hoverSpeed={0}
            scaleOnHover
            labelOnHover
            fadeOut
            fadeOutColor="var(--void)"
            ariaLabel="Technologies I work with"
          />
        </div>
      </section>

      <section style={{ marginTop: "var(--gap-section)" }}>
        <AnnotatedQuotes />
      </section>

      <section style={{ marginTop: "var(--gap-section)" }}>
        <h2 style={H2}>Where I have worked</h2>
        <div className="mt-6">
          {WORK_HISTORY.map((row, i) => (
            <TimelineRow
              key={row.what}
              {...row}
              isLast={i === WORK_HISTORY.length - 1}
            />
          ))}
        </div>
      </section>

      {onViewWork && (
        <section style={{ marginTop: "var(--gap-section)" }}>
          <WorkNudgeCat onViewWork={onViewWork} />
        </section>
      )}

      <section style={{ marginTop: "var(--gap-section)" }}>
        <h2 style={H2}>Where I studied</h2>
        <div className="mt-6">
          {EDUCATION.map((row, i) => (
            <TimelineRow
              key={row.what}
              {...row}
              isLast={i === EDUCATION.length - 1}
            />
          ))}
        </div>
      </section>
    </>
  );
}
