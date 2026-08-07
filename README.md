# Shama Anjum — portfolio

A single-page portfolio built with React 19, Vite and Tailwind 4. Three views —
landing, work and about — with state-based navigation rather than a router.

## Running it

```bash
npm install
npm run dev          # app on http://localhost:5173
npm run storybook    # component library on http://localhost:6006
```

| Script                    | What it does                            |
| ------------------------- | --------------------------------------- |
| `npm run dev`             | Vite dev server                         |
| `npm run build`           | Production build to `dist/`             |
| `npm run preview`         | Serve the production build              |
| `npm run lint`            | Oxlint                                  |
| `npm run storybook`       | Storybook dev server                    |
| `npm run build-storybook` | Static Storybook to `storybook-static/` |

## Storybook

Every component and page has stories, plus four Foundations pages that render
the design tokens live from `src/styles/tokens/*.css`. Start at **Introduction**
in the sidebar.

```
Foundations   colours, typography, spacing & layout, effects & motion
Core          SpecularButton, NavLink, EyebrowLabel, Tag
Effects       ParticleText, RotatingText, LogoLoop
Backdrop      Aurora, AuroraLayer, Particles
Portfolio     ProjectCover, ShelfRail, IndexRow, ProjectPanel, StackGroups
Pages         Landing, Work, About, and the full site composed
```

Stories sit next to the components they document (`Foo.jsx` → `Foo.stories.jsx`);
the Foundations pages live in `src/stories/`.

Two things worth knowing:

- `LogoLoop` and the About page fetch icons from the jsDelivr CDN, so those
  stories need network access to show real logos.
- `SpecularButton` and `Particles` need WebGL2 and WebGL respectively. Without
  it the button still renders and clicks — it just loses its highlight.

## Design tokens

Components are styled inline against CSS custom properties rather than utility
classes, so the tokens are the real API. They are split across four files:

```
src/styles/tokens/colors.css       ramps + semantic aliases
src/styles/tokens/typography.css   families, sizes, leading, tracking
src/styles/tokens/spacing.css      scale, layout constants, radii
src/styles/tokens/effects.css      shadows, blurs, easings, durations
```

`src/index.css` imports those, pulls in Tailwind, and defines the `@keyframes`
(`drift1-3`, `sway1-3`, `rise`) that the backdrop and panel components animate
against — a component moved out of this project needs those keyframes to come
with it.

Note the `@source not` rules in `src/index.css`: Tailwind's scanner reads bare
strings out of inline style objects, so without them the story files inflate the
shipped stylesheet with utilities the site never uses.

## Layout

```
src/
  App.jsx              view + panel state, mounts the shared particle layer
  pages/               Landing, Work, About
  components/          AuroraLayer + the three blob presets
  ds/
    core/              buttons, links, labels, chips
    effects/           canvas and rAF-driven text effects
    backdrop/          fixed light layers
    portfolio/         the shelf and the project panel
  data/                projects, about copy, cover art
  hooks/               useCoverArtScale
  stories/             Foundations pages + Introduction.mdx
```

There are no media queries anywhere — every responsive step is a `clamp()`, so
resizing is the only way to observe breakpoint behaviour.
