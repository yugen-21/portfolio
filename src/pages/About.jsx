import React from "react";
import { AuroraLayer, ABOUT_BLOBS } from "../components/AuroraLayer.jsx";
import { NavLink } from "../ds/core/NavLink.jsx";
import { EyebrowLabel } from "../ds/core/EyebrowLabel.jsx";
import { LogoLoop } from "../ds/effects/LogoLoop.jsx";
import { WORK_HISTORY, EDUCATION, TECH } from "../data/about.js";

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

export function About({ onBrand, onWork }) {
  return (
    <div className="relative min-h-screen">
      <AuroraLayer blobs={ABOUT_BLOBS} scan parallax />

      <header className="relative z-[3] flex items-center gap-6 flex-wrap px-[34px] py-[22px]">
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            onBrand();
          }}
          style={{
            fontSize: "var(--text-nav-brand)",
            fontWeight: 600,
            letterSpacing: "var(--track-neat)",
            color: "var(--text-display)",
          }}
        >
          Shama Anjum
        </a>
        <span
          style={{
            fontSize: 13,
            color: "var(--mauve-400)",
            letterSpacing: "0.02em",
          }}
        >
          About
        </span>
        <nav className="flex items-center gap-2 ml-auto">
          <a
            onClick={(e) => {
              e.preventDefault();
              onWork();
            }}
            href="#"
            style={{
              fontSize: "var(--text-ui)",
              padding: "9px 14px",
              borderRadius: "var(--radius-pill)",
              color: "#d9c8f5",
            }}
          >
            Work
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

      <main className="relative z-[3] px-[34px] pt-9 pb-[90px]">
        <h1
          style={{
            margin: 0,
            maxWidth: "20ch",
            fontFamily: "var(--font-display)",
            fontWeight: 400,
            fontSize: "var(--text-title)",
            lineHeight: "var(--leading-heading)",
            letterSpacing: "var(--track-snug)",
            color: "var(--text-display)",
          }}
        >
          About me
        </h1>
        <p
          className="mt-[26px]"
          style={{
            maxWidth: "var(--measure-body)",
            fontSize: "var(--text-body)",
            lineHeight: "var(--leading-body)",
            color: "var(--text-body)",
            textWrap: "pretty",
          }}
        >
          Full stack developer in Chennai. I turn messy problems into products
          people can actually use, most recently as the sole developer on two
          early-stage B2B SaaS products, and before that as a founding engineer
          building MVPs from nothing.
        </p>
        <p
          className="mt-5"
          style={{
            maxWidth: "var(--measure-body)",
            fontSize: "var(--text-body)",
            lineHeight: "var(--leading-body)",
            color: "var(--text-body)",
            textWrap: "pretty",
          }}
        >
          The teams were small, so the job was never only the code. I turned the
          CEO's business requirements into technical ones, wrote the pitch decks
          and technical scope documents, and designed the UI as well as built
          it, with Storybook for the component library.
        </p>

        <section style={{ marginTop: "var(--gap-section)" }}>
          <EyebrowLabel
            style={{ color: "var(--text-muted)", marginBottom: 20 }}
          >
            What I work with
          </EyebrowLabel>
          <div style={{ margin: "0 calc(34px * -1)" }}>
            <LogoLoop
              logos={TECH}
              speed={34}
              gap={74}
              logoHeight={36}
              hoverSpeed={0}
              scaleOnHover
              labelOnHover
              fadeOut
              fadeOutColor="#050107"
              ariaLabel="Technologies I work with"
            />
          </div>
        </section>

        <section style={{ marginTop: "var(--gap-section)" }}>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 400,
              fontSize: "var(--text-h2)",
              lineHeight: "var(--leading-heading)",
              color: "var(--text-display)",
              margin: 0,
            }}
          >
            Where I have worked
          </h2>
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

        <section style={{ marginTop: "var(--gap-section)" }}>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 400,
              fontSize: "var(--text-h2)",
              lineHeight: "var(--leading-heading)",
              color: "var(--text-display)",
              margin: 0,
            }}
          >
            Where I studied
          </h2>
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
      </main>
    </div>
  );
}
