import React from "react";
import { EyebrowLabel } from "./EyebrowLabel.jsx";

const TONES = ["section", "year", "caption", "lockup"];

const TONE_NOTES = {
  section: "Section headings inside the project panel — “The problem”, “Stack”. 11px at 0.20em.",
  year: "The year in a cover's top-left corner. 10px at 0.22em, the widest of the small sizes.",
  caption: "The caption along a cover's bottom edge. 10.5px at 0.14em in mauve.",
  lockup: "Extreme 0.42em tracking with a compensating left indent, so the optical block stays aligned.",
};

export default {
  title: "Core/EyebrowLabel",
  component: EyebrowLabel,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "All-caps micro-label used for section headings, cover metadata and lockups. `tone` picks a bundle of size, tracking and colour; `color` overrides just the colour, and `style` merges last so it can override anything.",
      },
    },
  },
  args: { children: "The problem", tone: "section" },
  argTypes: {
    children: { control: "text", table: { category: "Content" } },
    tone: {
      control: "inline-radio",
      options: TONES,
      description: "Size / tracking / colour preset.",
      table: { category: "Appearance", defaultValue: { summary: "section" } },
    },
    color: { control: "color", description: "Overrides the tone's colour only.", table: { category: "Appearance" } },
    style: { control: "object", description: "Merged last — wins over the tone preset.", table: { category: "Escape hatches" } },
  },
};

export const Playground = {};

export const AllTones = {
  name: "All tones",
  render: (args) => (
    <div style={{ display: "grid", gap: 30, minWidth: 460 }}>
      {TONES.map((tone) => (
        <div key={tone}>
          <EyebrowLabel {...args} tone={tone}>
            {tone === "year" ? "2026" : tone === "caption" ? "Encrypted Medical Records" : tone === "lockup" ? "Portfolio" : "The problem"}
          </EyebrowLabel>
          <div style={{ marginTop: 8, fontSize: "var(--text-ui)", color: "var(--text-muted)", maxWidth: "52ch", lineHeight: "var(--leading-list)" }}>
            {TONE_NOTES[tone]}
          </div>
        </div>
      ))}
    </div>
  ),
};

export const CustomColour = {
  name: "Custom colour",
  args: { tone: "caption", color: "#5b3a92", children: "Student Dashboard" },
  parameters: {
    backgrounds: { value: "light" },
    docs: { description: { story: "The Medibase cover is light, so `Work` passes `captionColor=\"#5b3a92\"` to keep the caption legible against it." } },
  },
};

export const OnACover = {
  name: "In context — on a cover",
  parameters: { docs: { description: { story: "How `year` and `caption` sit on a project cover: year top-left, caption pinned along the bottom edge." } } },
  render: () => (
    <div style={{
      position: "relative", width: 246, aspectRatio: "1",
      background: "linear-gradient(155deg,#1b0b3a 0%,#2d1063 55%,#160732 100%)",
      boxShadow: "var(--shadow-cover)",
    }}>
      <EyebrowLabel tone="year" style={{ position: "absolute", left: 18, top: 18 }}>2023</EyebrowLabel>
      <EyebrowLabel tone="caption" style={{ position: "absolute", left: 18, right: 18, bottom: 20 }}>Student Dashboard</EyebrowLabel>
    </div>
  ),
};
