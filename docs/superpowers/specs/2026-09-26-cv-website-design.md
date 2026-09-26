# CV website — design spec

Date: 2026-09-26 · Status: approved (user chose every option below; "no more questions")

## Goal

A one-page personal CV site for a software engineer, hosted free on GitHub Pages. It shows who they
are, their jobs, projects, skills, education, and how to reach them (email, LinkedIn, GitHub). It
must look polished, load instantly, and let the owner swap in their real details by editing one file.

## Decisions

| Topic | Decision | Why |
|---|---|---|
| Framework | Astro 7, static output, TypeScript | Official GitHub Pages guide and action; zero client JS by default ([research](../../research/github-pages-hosting.md)) |
| Content | One typed module, `src/data/profile.ts` | Simplest idiom for a single record; type errors fail the build |
| Design | "Night Shift" split layout ([survey §B1](../../research/portfolio-design-survey.md)) | Chosen by the user from three mockups |
| Theme | **Light by default**, toggle to dark, choice remembered | User's explicit choice |
| Sections | About, Experience, Projects, Skills, Education, Contact | User's choice (no PDF CV) |
| Hosting | GitHub Actions → Pages, repo `jonasahlers.github.io` → `https://jonasahlers.github.io` | Root URL, no `base` path needed |
| Git identity | `Jonas Ahlers <jonasahlers@gmail.com>` (repo-local config) | The GitHub account's email, so commits link to the profile |

## Layout and behavior

- **≥1024 px:** max width 1280 px, two columns (48% / 52%) sharing one top padding
  (`--page-top`, scales with window height). The left column is `position: sticky`, full viewport
  height: name (h1), role, tagline, location, section nav, social links, theme toggle; if its
  content is taller than the window it scrolls, and below 640 px of height it isn't pinned at all.
  The right column scrolls: About → Experience → Projects → Skills → Education → Contact, then a
  `footer` landmark (colophon).
- **<1024 px:** one column. The sidebar becomes a normal header (the nav is hidden); each section's
  label becomes a sticky translucent bar. `scroll-padding-top` keeps focused items clear of it.
- **Scroll-spy nav:** the active section is the last one whose top has passed 30% of the viewport,
  or the final one at the page bottom. A section picked from the nav (click, Back/Forward, or a deep
  link such as `/#education`) stays active until the visitor scrolls by hand. The active item's
  line grows 32 → 64 px and turns full-contrast (not color alone).
- **Rows** (jobs, projects, education): a 1 : 3 grid — muted date or thumbnail on the left,
  content on the right; the left column stays even when empty so every title shares one axis. On pointer hover or keyboard focus, the row shows a surface that extends past the
  text edge, and sibling rows dim **by color** (title → muted), never below 4.5:1. Linked rows are
  clickable as a whole card while keeping a real title link; the ↗ arrow nudges on hover/focus.
- **Cursor spotlight:** fixed radial gradient in the accent color, only for `(hover: hover) and
  (pointer: fine)`, ≥1024 px, and no `prefers-reduced-motion`.
- **Contact:** a closing sentence, an email link plus a copy-email button whose "Copied" state is
  announced via `aria-live="polite"`, and LinkedIn/GitHub text links.
- **Theme:** `data-theme` on `<html>`; default `light`. An inline pre-paint script applies a saved
  choice from `localStorage` so the wrong theme never flashes. The toggle is hidden without JS.
  `<meta name="theme-color">` and `color-scheme` follow the theme.
- **Empty sections:** a section with an empty list renders nothing, and its nav item disappears
  (`visibleSections(profile)`, unit-tested).
- **Entrance:** one staggered 10 px fade-up on load, CSS only, and only under
  `prefers-reduced-motion: no-preference`, so content never depends on it.

## Visual tokens

Inter (variable, Latin subset) self-hosted via Astro's Fonts API. Tabular figures on dates.

| Token | Light (default) | Dark |
|---|---|---|
| `--bg` | `#f7f9fb` | `#0b0f14` |
| `--surface` | `#ffffff` | `#131922` |
| `--text` | `#0b1220` | `#e7ecf2` |
| `--muted` | `#526071` | `#93a1b0` |
| `--border` | `#dfe5ec` | `#1f2a36` |
| `--accent` | `#03704f` | `#6ee7b7` |

The accent is a single token per theme; its final hue is tuned during visual iteration, but any
replacement must keep ≥4.5:1 against `--bg` and `--surface`. Type scale: name 48/52 (mobile 36/40),
role 20/28, labels 12/16 uppercase +0.1em, entry title 16/20, body 16/26, descriptions 14/21,
dates 12/16. Spacing on a 4 px base; sections 96–144 px apart, entries 48 px apart.

## Architecture

```
src/data/types.ts        Profile, Job, Project, SkillGroup, Education, SocialLink types
src/data/profile.ts      the content (placeholder until the owner sends real details)
src/lib/format.ts        formatPeriod(start, end?) → "2021 — 2023" | "2023 — Present" | "2022"
src/layouts/Base.astro   <html>/<head>: meta, Open Graph, JSON-LD Person, fonts, theme script
src/lib/seo.ts           personJsonLd(profile, url) → schema.org Person
src/lib/sections.ts      visibleSections(profile) → the sections (and nav items) that have content
src/lib/icons.ts         inline SVG icon bodies (Simple Icons brands, Lucide UI icons)
src/components/          Sidebar, Section, About, Experience, Projects, Skills, Education,
                         Contact, Entry (shared row card), Period, TagList, SocialLinks, Icon,
                         ThemeToggle, Spotlight
src/styles/global.css    tokens (both themes), reset, base typography, focus ring, skip link
src/pages/index.astro    composes the sections in order
src/pages/favicon.svg.ts monogram favicon generated from the owner's initials at build time
.github/workflows/deploy.yml   official Astro workflow (checkout@v7, withastro/action@v6, deploy-pages@v5)
```

**Content model** (`?` = optional; omitted optional fields simply don't render):

- `Profile`: `name`, `role`, `tagline`, `location?`, `about: string[]` (paragraphs), `email`,
  `socials: SocialLink[]`, `experience: Job[]`, `projects: Project[]`, `skills: SkillGroup[]`,
  `education: Education[]`
- `SocialLink`: `label`, `href`, `icon` (`'github' | 'linkedin' | 'x' | 'mail' | 'globe'`)
- `Job`: `role`, `company`, `href?`, `start`, `end?` (omitted = current),
  `summary`, `tech?: string[]`
- `Project`: `name`, `description`, `href?` (live), `repo?` (source), `image?` (imported asset,
  shown as the row's left-column thumbnail; without it that column stays empty, so every row's
  text shares one axis), `tech?`
- `SkillGroup`: `label`, `items: string[]` — rendered as label column + tags
- `Education`: `degree`, `school`, `href?`, `start`, `end?`, `details?`

Data flows one way: `profile.ts` → `index.astro` → each component receives only its slice as
props → static HTML. Components own their scripts (scroll-spy in Sidebar, spotlight in Spotlight,
theme in ThemeToggle); there is no shared client bundle. Dates are `"YYYY"` or `"YYYY-MM"` strings
(template-literal type). Each range renders twice: visibly ("Sep 2021 — Jun 2023", month and year
joined by a no-break space) and as sr-only text ("Sep 2021 to Jun 2023").

## Error handling and testing

- `npm run build` = `astro check && npm test && astro build`: a content typo or a failing test
  fails the build, so the deploy job never runs and the live site stays on the last good version.
- `npm test` runs the unit tests (`formatPeriod`, `initials`, `personJsonLd`, `visibleSections`)
  with Node's built-in test runner (no extra deps; needs Node 22.18+ for TypeScript stripping).
- Visual QA in the preview browser: desktop and mobile widths, light and dark, keyboard-only pass,
  reduced-motion check. Iterate on the design from screenshots until it holds up.

## Accessibility baseline (WCAG 2.2 AA)

One `<h1>`; `header`/`nav[aria-label]`/`main`/`footer` landmarks; a labelled `section` per block;
skip link first in tab order; visible `:focus-visible` ring; every hover effect has a focus
equivalent; icon links have accessible names; targets ≥24×24 px; text ≥4.5:1 in every state,
including dimmed rows; all motion gated by `prefers-reduced-motion`.

## Out of scope (for now)

Blog, PDF résumé, project archive page, analytics, Open Graph image generation, custom domain,
i18n. Each can be added later without restructuring.

## Owner's remaining steps

No GitHub connector exists in the connector directory, so the GitHub CLI stands in for one.

1. `gh auth login` once (browser flow; no token is pasted anywhere). Claude installs `gh`.
2. Send real CV content; it replaces the placeholder `profile.ts`.

Claude then creates the public repo `jonasahlers/jonasahlers.github.io`, pushes, and enables Pages
with `build_type=workflow` via `gh api`.
