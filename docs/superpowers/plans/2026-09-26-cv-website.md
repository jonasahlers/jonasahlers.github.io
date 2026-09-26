# CV Website Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** A one-page CV site for Jonas Ahlers ("Night Shift" split layout, light default with dark toggle) that deploys to https://jonasahlers.github.io from GitHub Actions.

**Architecture:** Astro 7 renders static HTML from one typed content module (`src/data/profile.ts`). Small single-purpose components each receive only their slice of the data; the few interactive touches (scroll-spy, theme toggle, copy email, cursor spotlight) are component-owned progressive enhancements. Build = type-check + unit tests + static build, so bad content never deploys.

**Tech Stack:** Astro 7.3, TypeScript 6 (`@astrojs/check` does not support TS 7 yet), Inter via Astro's Fonts API (Fontsource provider), Node's built-in test runner, GitHub Actions (`withastro/action@v6`, `actions/deploy-pages@v5`).

**Spec:** `docs/superpowers/specs/2026-09-26-cv-website-design.md`

## Global Constraints

- Node `>=22.12.0` (Astro's floor); CI builds on Node 24.
- No client framework, no CSS framework, no runtime dependencies beyond `astro`.
- Content lives only in `src/data/profile.ts`; components never hard-code personal text.
- Dates are `"YYYY"` or `"YYYY-MM"`.
- Light theme is the default (`<html data-theme="light">`); dark is opt-in via the toggle and persisted in `localStorage` under `theme`.
- Text contrast ≥4.5:1 in every state, both themes; every hover effect has a `:focus-visible` equivalent; all motion is gated by `prefers-reduced-motion`.
- External links open in a new tab with `rel="noreferrer"` and an sr-only "(opens in a new tab)".
- Commits are authored as `Jonas Ahlers <jonasahlers@gmail.com>` (repo-local git config) and end with `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.

## File map

| File | Responsibility |
|---|---|
| `package.json`, `astro.config.mjs`, `tsconfig.json` | Tooling: scripts, site URL, font config, strict TS |
| `src/data/types.ts` | Content model types |
| `src/data/profile.ts` | The content (placeholder until real CV details arrive) |
| `src/lib/format.ts` (+ `.test.ts`) | `formatPeriod`, `initials` |
| `src/lib/seo.ts` | `personJsonLd` (schema.org Person) |
| `src/lib/icons.ts` | Icon SVG bodies + `IconName` |
| `src/styles/global.css` | Tokens for both themes, reset, focus, skip link, `.link` |
| `src/layouts/Base.astro` | `<html>`/`<head>`: meta, OG, fonts, pre-paint theme, JSON-LD |
| `src/pages/index.astro` | Page shell; decides which sections exist |
| `src/pages/favicon.svg.ts` | Monogram favicon from the profile name |
| `src/components/Icon.astro`, `TagList.astro`, `Period.astro`, `Section.astro`, `Entry.astro` | Building blocks |
| `src/components/Sidebar.astro`, `SocialLinks.astro`, `ThemeToggle.astro`, `Spotlight.astro` | Identity column + global enhancements |
| `src/components/About.astro`, `Experience.astro`, `Projects.astro`, `Skills.astro`, `Education.astro`, `Contact.astro` | One component per section |
| `.github/workflows/deploy.yml` | Build + deploy to Pages on push to `main` |
| `README.md` | How to edit, run, test, deploy |

---

### Task 1: Scaffold the Astro project

**Files:**
- Create: `package.json`, `astro.config.mjs`, `tsconfig.json`, `src/pages/index.astro` (temporary)

**Interfaces:**
- Produces: `npm run dev|build|preview|test`; CSS variable `--font-inter` available once `<Font>` is rendered (Task 3).

- [ ] **Step 1: Write `package.json`**

```json
{
  "name": "jonasahlers.github.io",
  "type": "module",
  "version": "1.0.0",
  "private": true,
  "engines": {
    "node": ">=22.12.0"
  },
  "scripts": {
    "dev": "astro dev",
    "build": "astro check && npm test && astro build",
    "preview": "astro preview",
    "test": "node --test \"src/**/*.test.ts\"",
    "astro": "astro"
  }
}
```

- [ ] **Step 2: Install dependencies**

Run: `npm install astro@^7.3.5 && npm install -D @astrojs/check typescript@^6 @types/node@^24`
Expected: `package-lock.json` created; `astro`, `@astrojs/check`, `typescript`, `@types/node` listed.

- [ ] **Step 3: Write `astro.config.mjs`**

```js
// @ts-check
import { defineConfig, fontProviders } from 'astro/config';

export default defineConfig({
  // User site (repo "jonasahlers.github.io"), so no `base` path is needed.
  site: 'https://jonasahlers.github.io',
  fonts: [
    {
      provider: fontProviders.fontsource(),
      name: 'Inter',
      cssVariable: '--font-inter',
      weights: ['100 900'],
      styles: ['normal'],
      subsets: ['latin'],
      fallbacks: ['system-ui', 'sans-serif'],
    },
  ],
});
```

- [ ] **Step 4: Write `tsconfig.json`**

```json
{
  "extends": "astro/tsconfigs/strict"
}
```

(Astro's base config already sets `allowImportingTsExtensions`, `noEmit`, and the include/exclude paths, which the `.ts`-extension import in the tests relies on.)

- [ ] **Step 5: Write a temporary `src/pages/index.astro`**

```astro
<h1>Scaffold works</h1>
```

- [ ] **Step 6: Build**

Run: `npx astro check && npx astro build`
Expected: `0 errors`, then `1 page(s) built`, `dist/index.html` exists. (`npm run build` would fail here: no test files exist yet.)

- [ ] **Step 7: Commit**

```bash
git add package.json package-lock.json astro.config.mjs tsconfig.json src/pages/index.astro
git commit -m "Scaffold Astro 7 project"
```

---

### Task 2: Content model and date formatting (TDD)

**Files:**
- Create: `src/data/types.ts`, `src/lib/format.ts`, `src/lib/format.test.ts`, `src/data/profile.ts`

**Interfaces:**
- Produces: types `YearMonth`, `SocialIcon`, `SocialLink`, `Job`, `Project`, `SkillGroup`, `Education`, `Profile`; `formatPeriod(start: YearMonth, end?: YearMonth, separator = ' — '): string`; `initials(name: string): string`; `profile: Profile`.

- [ ] **Step 1: Write `src/data/types.ts`**

```ts
/** A date as "YYYY" or "YYYY-MM", e.g. "2023" or "2023-04". */
export type YearMonth = `${number}` | `${number}-${number}`;

export type SocialIcon = 'github' | 'linkedin' | 'x' | 'mail' | 'globe';

export interface SocialLink {
  label: string;
  href: string;
  icon: SocialIcon;
}

export interface Job {
  role: string;
  company: string;
  /** Company website; makes the whole entry a link. */
  href?: string;
  start: YearMonth;
  /** Leave out for your current job. */
  end?: YearMonth;
  summary: string;
  tech?: string[];
}

export interface Project {
  name: string;
  description: string;
  /** Live site or demo. */
  href?: string;
  /** Source code. */
  repo?: string;
  /** Screenshot imported from src/assets, e.g. `import shot from '../assets/app.png'`. */
  image?: ImageMetadata;
  tech?: string[];
}

export interface SkillGroup {
  label: string;
  items: string[];
}

export interface Education {
  degree: string;
  school: string;
  href?: string;
  start: YearMonth;
  end?: YearMonth;
  details?: string;
}

export interface Profile {
  name: string;
  role: string;
  /** One sentence under your name; also the page's meta description. */
  tagline: string;
  location?: string;
  /** Paragraphs of the About section. */
  about: string[];
  email: string;
  /** The sentence that opens the Contact section. */
  contactNote: string;
  socials: SocialLink[];
  experience: Job[];
  projects: Project[];
  skills: SkillGroup[];
  education: Education[];
}
```

- [ ] **Step 2: Write the failing tests `src/lib/format.test.ts`**

```ts
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { formatPeriod, initials } from './format.ts';

test('formats a range of years', () => {
  assert.equal(formatPeriod('2021', '2023'), '2021 — 2023');
});

test('uses "Present" for an ongoing period', () => {
  assert.equal(formatPeriod('2023'), '2023 — Present');
  assert.equal(formatPeriod('2023-04'), 'Apr 2023 — Present');
});

test('shows months when they are given', () => {
  assert.equal(formatPeriod('2021-06', '2023-03'), 'Jun 2021 — Mar 2023');
});

test('collapses a period within one year', () => {
  assert.equal(formatPeriod('2022', '2022'), '2022');
  assert.equal(formatPeriod('2022-06', '2022-08'), 'Jun — Aug 2022');
  assert.equal(formatPeriod('2022-06', '2022-06'), 'Jun 2022');
  assert.equal(formatPeriod('2022-06', '2022'), '2022');
});

test('accepts a custom separator for screen-reader text', () => {
  assert.equal(formatPeriod('2021', '2023', ' to '), '2021 to 2023');
  assert.equal(formatPeriod('2022-06', '2022-08', ' to '), 'Jun to Aug 2022');
});

test('rejects malformed dates with a helpful message', () => {
  assert.throws(() => formatPeriod('2021-13'), /Invalid date "2021-13"/);
  assert.throws(() => formatPeriod('2021-6'), /Invalid date "2021-6"/);
  assert.throws(() => formatPeriod('21'), /Invalid date "21"/);
});

test('rejects an end date before the start date', () => {
  assert.throws(() => formatPeriod('2023', '2021'), /ends before it starts/);
  assert.throws(() => formatPeriod('2022-08', '2022-06'), /ends before it starts/);
});

test('initials use the first and last name', () => {
  assert.equal(initials('Jonas Ahlers'), 'JA');
  assert.equal(initials('  ada  '), 'A');
  assert.equal(initials('Mary Jane Watson'), 'MW');
});
```

- [ ] **Step 3: Run the tests to verify they fail**

Run: `npm test`
Expected: FAIL — `Cannot find module '.../src/lib/format.ts'`.

- [ ] **Step 4: Write `src/lib/format.ts`**

```ts
import type { YearMonth } from '../data/types';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

interface ParsedDate {
  year: number;
  month?: number;
}

function parse(value: string): ParsedDate {
  const match = /^(\d{4})(?:-(\d{2}))?$/.exec(value);
  const month = match?.[2] === undefined ? undefined : Number(match[2]);
  if (!match || (month !== undefined && (month < 1 || month > 12))) {
    throw new Error(`Invalid date "${value}": use "YYYY" or "YYYY-MM", e.g. "2023" or "2023-04".`);
  }
  return { year: Number(match[1]), month };
}

function monthName(month: number): string {
  return MONTHS[month - 1]!;
}

function label({ year, month }: ParsedDate): string {
  return month === undefined ? `${year}` : `${monthName(month)} ${year}`;
}

/**
 * Formats a date range for display: "2021 — 2023", "Jun 2021 — Present",
 * "Jun — Aug 2022", or just "2022" when it starts and ends in the same year.
 */
export function formatPeriod(start: YearMonth, end?: YearMonth, separator = ' — '): string {
  const from = parse(start);
  if (end === undefined) return `${label(from)}${separator}Present`;

  const to = parse(end);
  if (to.year < from.year || (to.year === from.year && (to.month ?? 12) < (from.month ?? 1))) {
    throw new Error(`The period "${start}" to "${end}" ends before it starts.`);
  }
  if (from.year !== to.year) return `${label(from)}${separator}${label(to)}`;
  if (from.month === undefined || to.month === undefined) return `${from.year}`;
  if (from.month === to.month) return label(from);
  return `${monthName(from.month)}${separator}${label(to)}`;
}

/** "Jonas Ahlers" → "JA": the first letters of the first and last name. */
export function initials(name: string): string {
  const parts = name.trim().split(/\s+/);
  const picked = parts.length > 1 ? [parts[0]!, parts[parts.length - 1]!] : parts;
  return picked.map((part) => part.charAt(0).toUpperCase()).join('');
}
```

- [ ] **Step 5: Run the tests to verify they pass**

Run: `npm test`
Expected: `# pass 8`, `# fail 0`.

- [ ] **Step 6: Write the placeholder `src/data/profile.ts`**

```ts
import type { Profile } from './types';

// Placeholder content — replace every value with your own. The build type-checks this file,
// so a missing field or a malformed date ("2023" or "2023-04") stops it with a clear error.
export const profile: Profile = {
  name: 'Jonas Ahlers',
  role: 'Software Engineer',
  tagline:
    'I build reliable, thoughtfully designed software, from backend services to the interfaces people use every day.',
  location: 'Denmark',
  about: [
    'I’m a software engineer who enjoys turning messy, real-world problems into simple and dependable products. I care about clean architecture, fast feedback loops, and interfaces that feel effortless.',
    'Right now I work on e-commerce systems that serve customers in many markets. Before that I built internal tools and APIs, and taught algorithms and data structures at university.',
    'Away from the keyboard you’ll find me on a trail, tinkering with side projects, or reading about how great engineering teams work.',
  ],
  email: 'jonasahlers@gmail.com',
  contactNote:
    'I’m always happy to talk about new opportunities, interesting problems, or just say hello. Email is the quickest way to reach me.',
  socials: [
    { label: 'GitHub', href: 'https://github.com/jonasahlers', icon: 'github' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/jonasahlers', icon: 'linkedin' },
  ],
  experience: [
    {
      role: 'Software Engineer',
      company: 'Northwind Traders',
      href: 'https://example.com',
      start: '2023-08',
      summary:
        'Build and maintain the e-commerce platform behind online sales in 30+ markets. Led the move of checkout to a modern React stack, cutting page load times by 40%.',
      tech: ['TypeScript', 'React', 'Node.js', 'PostgreSQL', 'Azure'],
    },
    {
      role: 'Software Developer, part-time',
      company: 'Contoso',
      href: 'https://example.com',
      start: '2021-09',
      end: '2023-06',
      summary:
        'Developed internal tools and REST APIs used daily by 300+ employees, and set up automated testing and deployments for the team.',
      tech: ['C#', '.NET', 'SQL Server', 'Docker'],
    },
    {
      role: 'Teaching Assistant',
      company: 'Northbridge University',
      start: '2020-02',
      end: '2021-06',
      summary: 'Taught weekly exercise classes in algorithms and data structures and graded assignments for 40 students.',
      tech: ['Java', 'Python'],
    },
  ],
  projects: [
    {
      name: 'Trail Planner',
      description: 'An offline-first route planner with elevation profiles and GPX export.',
      href: 'https://example.com',
      repo: 'https://github.com/jonasahlers',
      tech: ['TypeScript', 'React Native', 'SQLite'],
    },
    {
      name: 'budget-cli',
      description: 'A fast terminal tool for tracking expenses, with monthly reports and CSV import.',
      repo: 'https://github.com/jonasahlers',
      tech: ['Rust'],
    },
    {
      name: 'This website',
      description: 'A one-page CV built with Astro: no JavaScript required, deployed to GitHub Pages on every push.',
      repo: 'https://github.com/jonasahlers/jonasahlers.github.io',
      tech: ['Astro', 'TypeScript', 'CSS'],
    },
  ],
  skills: [
    { label: 'Languages', items: ['TypeScript', 'JavaScript', 'C#', 'Python', 'SQL'] },
    { label: 'Frameworks', items: ['React', 'Node.js', '.NET', 'Astro'] },
    { label: 'Tools', items: ['Git', 'Docker', 'Azure', 'GitHub Actions', 'PostgreSQL'] },
    { label: 'Practices', items: ['Testing', 'CI/CD', 'Accessibility', 'API design'] },
  ],
  education: [
    {
      degree: 'MSc in Computer Science',
      school: 'Northbridge University',
      start: '2021',
      end: '2023',
      details: 'Specialised in distributed systems and human–computer interaction.',
    },
    { degree: 'BSc in Computer Science', school: 'Northbridge University', start: '2018', end: '2021' },
  ],
};
```

- [ ] **Step 7: Type-check**

Run: `npx astro check`
Expected: `0 errors`.

- [ ] **Step 8: Commit**

```bash
git add src/data src/lib/format.ts src/lib/format.test.ts
git commit -m "Add content model, placeholder profile, and date formatting"
```

---

### Task 3: Design tokens, base layout, favicon

**Files:**
- Create: `src/styles/global.css`, `src/lib/seo.ts`, `src/layouts/Base.astro`, `src/pages/favicon.svg.ts`
- Modify: `src/pages/index.astro` (temporary content wrapped in `Base`)

**Interfaces:**
- Consumes: `Profile`, `profile`, `initials`.
- Produces: `Base` props `{ title: string; description: string; jsonLd: Record<string, unknown> }`; `personJsonLd(profile: Profile, url: string)`; tokens `--bg --surface --text --muted --border --accent --accent-soft --selection --spotlight --card-shadow --radius --gutter`; global classes `.sr-only`, `.link`, `.skip-link`; `main#content` is the skip-link target.

- [ ] **Step 1: Write `src/styles/global.css`**

```css
/* Design tokens. Light is the default theme; [data-theme='dark'] overrides it. */
:root {
  color-scheme: light;
  --bg: #f7f9fb;
  --surface: #ffffff;
  --text: #0b1220;
  --muted: #526071;
  --border: #dfe5ec;
  --accent: #047857;
  --accent-soft: rgb(4 120 87 / 0.08);
  --selection: rgb(4 120 87 / 0.18);
  --spotlight: rgb(4 120 87 / 0.06);
  --card-shadow: 0 1px 2px rgb(11 18 32 / 0.04), 0 12px 32px -16px rgb(11 18 32 / 0.18);
  --radius: 0.5rem;
  --gutter: 1.5rem;
}

:root[data-theme='dark'] {
  color-scheme: dark;
  --bg: #0b0f14;
  --surface: #131922;
  --text: #e7ecf2;
  --muted: #93a1b0;
  --border: #1f2a36;
  --accent: #6ee7b7;
  --accent-soft: rgb(110 231 183 / 0.1);
  --selection: rgb(110 231 183 / 0.25);
  --spotlight: rgb(110 231 183 / 0.06);
  --card-shadow: inset 0 1px 0 rgb(148 163 184 / 0.08);
}

@media (min-width: 768px) {
  :root {
    --gutter: 3rem;
  }
}

*,
*::before,
*::after {
  box-sizing: border-box;
}

html {
  -webkit-text-size-adjust: 100%;
  text-size-adjust: 100%;
  scroll-padding-top: 4.5rem;
}

@media (prefers-reduced-motion: no-preference) {
  html {
    scroll-behavior: smooth;
  }
}

body {
  margin: 0;
  min-height: 100vh;
  background: var(--bg);
  color: var(--muted);
  font-family: var(--font-inter, system-ui, sans-serif);
  font-size: 1rem;
  line-height: 1.625;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

h1,
h2,
h3,
p,
dl,
dd {
  margin: 0;
}

:where(ul, ol)[role='list'] {
  list-style: none;
  margin: 0;
  padding: 0;
}

a {
  color: inherit;
  text-decoration: none;
}

img {
  display: block;
  max-width: 100%;
}

button {
  font: inherit;
}

::selection {
  background: var(--selection);
  color: var(--text);
}

:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 3px;
  border-radius: 2px;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  margin: -1px;
  padding: 0;
  overflow: hidden;
  clip: rect(0 0 0 0);
  white-space: nowrap;
  border: 0;
}

.skip-link {
  position: absolute;
  top: 1rem;
  left: 1rem;
  z-index: 100;
  padding: 0.5rem 1rem;
  border-radius: var(--radius);
  background: var(--text);
  color: var(--bg);
  font-weight: 600;
  transform: translateY(-200%);
}

.skip-link:focus {
  transform: none;
}

/* Inline text links in running copy. */
.link {
  color: var(--text);
  font-weight: 500;
  text-decoration: underline;
  text-decoration-color: color-mix(in srgb, var(--accent) 45%, transparent);
  text-decoration-thickness: 1px;
  text-underline-offset: 0.2em;
  transition:
    color 150ms ease,
    text-decoration-color 150ms ease;
}

.link:hover {
  color: var(--accent);
  text-decoration-color: currentColor;
}

@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

- [ ] **Step 2: Write `src/lib/seo.ts`**

```ts
import type { Profile } from '../data/types';

/** schema.org Person markup, so search engines can show a rich profile result. */
export function personJsonLd(profile: Profile, url: string) {
  const currentJob = profile.experience.find((job) => job.end === undefined);
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: profile.name,
    jobTitle: profile.role,
    description: profile.tagline,
    url,
    sameAs: profile.socials.map((link) => link.href),
    knowsAbout: profile.skills.flatMap((group) => group.items),
    ...(profile.location ? { homeLocation: { '@type': 'Place', name: profile.location } } : {}),
    ...(currentJob ? { worksFor: { '@type': 'Organization', name: currentJob.company } } : {}),
    ...(profile.education.length > 0
      ? { alumniOf: profile.education.map((entry) => ({ '@type': 'CollegeOrUniversity', name: entry.school })) }
      : {}),
  };
}
```

- [ ] **Step 3: Write `src/layouts/Base.astro`**

```astro
---
import { Font } from 'astro:assets';
import '../styles/global.css';

interface Props {
  title: string;
  description: string;
  jsonLd: Record<string, unknown>;
}

const { title, description, jsonLd } = Astro.props;
const canonical = new URL(Astro.url.pathname, Astro.site);
const base = import.meta.env.BASE_URL.replace(/\/?$/, '/');
// Escape "<" so profile text can never end the JSON-LD <script> early.
const structuredData = JSON.stringify(jsonLd).replace(/</g, '\\u003c');
---

<!doctype html>
<html lang="en" data-theme="light">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>{title}</title>
    <meta name="description" content={description} />
    <link rel="canonical" href={canonical} />
    <link rel="icon" type="image/svg+xml" href={`${base}favicon.svg`} />
    <meta name="theme-color" content="#f7f9fb" />
    <meta property="og:type" content="profile" />
    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
    <meta property="og:url" content={canonical} />
    <meta name="twitter:card" content="summary" />
    <meta name="generator" content={Astro.generator} />
    <Font cssVariable="--font-inter" preload />
    <script is:inline>
      // Apply a saved dark theme before first paint so the page never flashes light.
      // Keep the color in sync with --bg in global.css.
      try {
        if (localStorage.getItem('theme') === 'dark') {
          document.documentElement.dataset.theme = 'dark';
          document.querySelector('meta[name="theme-color"]').content = '#0b0f14';
        }
      } catch {}
    </script>
    <script type="application/ld+json" set:html={structuredData} />
  </head>
  <body>
    <a class="skip-link" href="#content">Skip to content</a>
    <slot />
  </body>
</html>
```

- [ ] **Step 4: Write `src/pages/favicon.svg.ts`**

```ts
import type { APIRoute } from 'astro';
import { profile } from '../data/profile';
import { initials } from '../lib/format';

// A monogram favicon, generated from the profile name at build time.
export const GET: APIRoute = () => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <rect width="64" height="64" rx="14" fill="#0b1220"/>
  <text x="32" y="42" text-anchor="middle" font-family="system-ui, -apple-system, 'Segoe UI', sans-serif" font-size="27" font-weight="700" letter-spacing="-1" fill="#6ee7b7">${initials(profile.name)}</text>
</svg>`;
  return new Response(svg, { headers: { 'Content-Type': 'image/svg+xml' } });
};
```

- [ ] **Step 5: Replace `src/pages/index.astro` with a temporary page using `Base`**

```astro
---
import { profile } from '../data/profile';
import Base from '../layouts/Base.astro';
import { personJsonLd } from '../lib/seo';
---

<Base title={`${profile.name} — ${profile.role}`} description={profile.tagline} jsonLd={personJsonLd(profile, Astro.site?.href ?? '')}>
  <main id="content"><h1>{profile.name}</h1></main>
</Base>
```

- [ ] **Step 6: Build and inspect**

Run: `npm run build && ls dist && grep -o '<link rel="preload"[^>]*>' dist/index.html && grep -c 'application/ld+json' dist/index.html`
Expected: build passes; `dist/favicon.svg` exists; one font preload link (woff2 under `/_astro/fonts/`); `1`.

- [ ] **Step 7: Commit**

```bash
git add src/styles src/lib/seo.ts src/layouts src/pages
git commit -m "Add design tokens, base layout with SEO and theme bootstrapping, and favicon"
```

---

### Task 4: Building blocks

**Files:**
- Create: `src/lib/icons.ts`, `src/components/Icon.astro`, `src/components/TagList.astro`, `src/components/Period.astro`, `src/components/Section.astro`, `src/components/Entry.astro`

**Interfaces:**
- Consumes: `SocialIcon`, `YearMonth`, `formatPeriod`.
- Produces:
  - `IconName`, `icons`; `<Icon name size? class? />` (decorative, `aria-hidden`).
  - `<TagList tags label? />` → `ul.tags`.
  - `<Period start end? />` → visible "2021 — 2023" + sr-only "2021 to 2023".
  - `<Section id label>` → `section#id` with an `h2` (sticky bar on mobile, sr-only on desktop).
  - `<Entry title href?>` with optional `slot="aside"`; renders an `li`, so callers wrap entries in `<ol role="list">`. Slotted paragraphs use class `entry-text`.

- [ ] **Step 1: Write `src/lib/icons.ts`**

```ts
import type { SocialIcon } from '../data/types';

type UiIcon = 'arrow-up-right' | 'copy' | 'check' | 'sun' | 'moon' | 'map-pin';
export type IconName = SocialIcon | UiIcon;

interface IconDef {
  /** SVG markup inside a 24×24 viewBox. */
  body: string;
  /** Brand marks are filled shapes; interface icons are 2px strokes. */
  filled?: boolean;
}

// Brand marks from Simple Icons (CC0); interface icons from Lucide (ISC).
export const icons: Record<IconName, IconDef> = {
  github: {
    filled: true,
    body: '<path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>',
  },
  linkedin: {
    filled: true,
    body: '<path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 1 1 0-4.125 2.062 2.062 0 0 1 0 4.125zM7.119 20.452H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>',
  },
  x: {
    filled: true,
    body: '<path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z"/>',
  },
  mail: { body: '<rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>' },
  globe: {
    body: '<circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/>',
  },
  'arrow-up-right': { body: '<path d="M7 7h10v10"/><path d="M7 17 17 7"/>' },
  copy: {
    body: '<rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>',
  },
  check: { body: '<path d="M20 6 9 17l-5-5"/>' },
  sun: {
    body: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/>',
  },
  moon: { body: '<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>' },
  'map-pin': {
    body: '<path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/>',
  },
};
```

- [ ] **Step 2: Write `src/components/Icon.astro`**

```astro
---
import { icons, type IconName } from '../lib/icons';

interface Props {
  name: IconName;
  size?: number;
  class?: string;
}

const { name, size = 20, class: className } = Astro.props;
const { body, filled } = icons[name];
---

<svg
  class={className}
  width={size}
  height={size}
  viewBox="0 0 24 24"
  fill={filled ? 'currentColor' : 'none'}
  stroke={filled ? undefined : 'currentColor'}
  stroke-width={filled ? undefined : 2}
  stroke-linecap="round"
  stroke-linejoin="round"
  aria-hidden="true"
  focusable="false"
  set:html={body}
/>
```

- [ ] **Step 3: Write `src/components/TagList.astro`**

```astro
---
interface Props {
  tags: string[];
  label?: string;
}

const { tags, label = 'Technologies' } = Astro.props;
---

<ul class="tags" role="list" aria-label={label}>
  {tags.map((tag) => <li class="tag">{tag}</li>)}
</ul>

<style>
  .tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  .tag {
    padding: 0.25rem 0.75rem;
    border-radius: 999px;
    background: var(--accent-soft);
    color: var(--accent);
    font-size: 0.75rem;
    font-weight: 500;
    line-height: 1.25rem;
  }
</style>
```

- [ ] **Step 4: Write `src/components/Period.astro`**

```astro
---
import type { YearMonth } from '../data/types';
import { formatPeriod } from '../lib/format';

interface Props {
  start: YearMonth;
  end?: YearMonth;
}

const { start, end } = Astro.props;
---

<p class="period">
  <span aria-hidden="true">{formatPeriod(start, end)}</span>
  <span class="sr-only">{formatPeriod(start, end, ' to ')}</span>
</p>

<style>
  .period {
    padding-top: 0.125rem;
    color: var(--muted);
    font-size: 0.75rem;
    font-weight: 600;
    font-variant-numeric: tabular-nums;
    letter-spacing: 0.05em;
    line-height: 1.5;
    text-transform: uppercase;
  }
</style>
```

- [ ] **Step 5: Write `src/components/Section.astro`**

```astro
---
interface Props {
  id: string;
  label: string;
}

const { id, label } = Astro.props;
---

<section id={id} class="section" aria-labelledby={`${id}-heading`}>
  <h2 id={`${id}-heading`} class="heading">{label}</h2>
  <slot />
</section>

<style>
  .section {
    margin-bottom: 6rem;
  }

  /* Mobile: a sticky, translucent label bar per section. */
  .heading {
    position: sticky;
    top: 0;
    z-index: 20;
    margin: 0 calc(var(--gutter) * -1) 1rem;
    padding: 1.25rem var(--gutter);
    background: color-mix(in srgb, var(--bg) 80%, transparent);
    backdrop-filter: blur(8px);
    color: var(--text);
    font-size: 0.75rem;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
  }

  /* Desktop: the sidebar nav names the sections, so headings stay for screen readers only. */
  @media (min-width: 1024px) {
    .section {
      margin-bottom: 9rem;
    }

    .heading {
      position: absolute;
      width: 1px;
      height: 1px;
      margin: -1px;
      padding: 0;
      overflow: hidden;
      clip: rect(0 0 0 0);
      white-space: nowrap;
    }
  }
</style>
```

- [ ] **Step 6: Write `src/components/Entry.astro`**

```astro
---
import Icon from './Icon.astro';

interface Props {
  title: string;
  /** Makes the whole entry a link. */
  href?: string;
}

const { title, href } = Astro.props;
const hasAside = Astro.slots.has('aside');
---

<li class:list={['entry', { 'has-aside': hasAside }]}>
  {hasAside && <div class="aside"><slot name="aside" /></div>}
  <div class="body">
    <h3 class="title">
      {
        href ? (
          <a class="title-link" href={href} target="_blank" rel="noreferrer">
            {title}&nbsp;<Icon name="arrow-up-right" size={14} class="arrow" />
            <span class="sr-only"> (opens in a new tab)</span>
          </a>
        ) : (
          title
        )
      }
    </h3>
    <slot />
  </div>
</li>

<style>
  .entry {
    position: relative;
    isolation: isolate;
    display: grid;
    gap: 0.5rem;
    padding-block: 1rem;
  }

  .entry + .entry {
    margin-top: 1rem;
  }

  @media (min-width: 640px) {
    .entry.has-aside {
      grid-template-columns: minmax(0, 1fr) minmax(0, 3fr);
      gap: 1.5rem;
    }
  }

  /* Hover surface: extends past the text edge so the text never moves. */
  .entry::before {
    content: '';
    position: absolute;
    inset: 0 -1rem;
    z-index: -1;
    border-radius: var(--radius);
    background: var(--surface);
    box-shadow: var(--card-shadow);
    opacity: 0;
    transition: opacity 150ms ease;
  }

  .entry:focus-within::before {
    opacity: 1;
  }

  @media (hover: hover) {
    .entry:hover::before {
      opacity: 1;
    }
  }

  @media (min-width: 1024px) {
    .entry::before,
    .title-link::after {
      inset-inline: -1.5rem;
    }
  }

  .title {
    color: var(--text);
    font-size: 1rem;
    font-weight: 500;
    line-height: 1.4;
    transition: color 150ms ease;
  }

  /* The title link stretches over the whole card. */
  .title-link::after {
    content: '';
    position: absolute;
    inset: 0 -1rem;
    border-radius: var(--radius);
  }

  .title-link:focus-visible {
    outline: none;
  }

  .title-link:focus-visible::after {
    outline: 2px solid var(--accent);
    outline-offset: 2px;
  }

  .title-link :global(.arrow) {
    display: inline-block;
    vertical-align: -0.1em;
    transition: transform 150ms ease;
  }

  .entry:has(.title-link:focus-visible) .title {
    color: var(--accent);
  }

  .title-link:focus-visible :global(.arrow) {
    transform: translate(2px, -2px);
  }

  @media (hover: hover) {
    .entry:has(.title-link):hover .title {
      color: var(--accent);
    }

    .entry:hover .title-link :global(.arrow) {
      transform: translate(2px, -2px);
    }
  }

  /* While one entry is hovered, dim its siblings by color (never below 4.5:1 contrast). */
  @media (hover: hover) and (pointer: fine) {
    :global(:has(> .entry:hover)) > .entry:not(:hover) .title {
      color: var(--muted);
    }
  }

  .body :global(.entry-text) {
    margin-top: 0.5rem;
    font-size: 0.875rem;
    line-height: 1.6;
    text-wrap: pretty;
  }

  .body :global(.tags) {
    margin-top: 1rem;
  }
</style>
```

- [ ] **Step 7: Type-check**

Run: `npx astro check`
Expected: `0 errors`.

- [ ] **Step 8: Commit**

```bash
git add src/lib/icons.ts src/components
git commit -m "Add building blocks: icons, tags, period, section, and entry card"
```

---

### Task 5: Sidebar, theme toggle, spotlight, and page shell

**Files:**
- Create: `src/components/SocialLinks.astro`, `src/components/ThemeToggle.astro`, `src/components/Spotlight.astro`, `src/components/Sidebar.astro`
- Modify: `src/pages/index.astro` (final shell; sections are added in Task 6)

**Interfaces:**
- Consumes: `Profile`, `SocialLink`, `Icon`, `personJsonLd`, `Base`.
- Produces: `<Sidebar profile sections />` where `sections: { id: string; label: string }[]`; nav links carry `data-section={id}` and get `aria-current="true"` when active; `<ThemeToggle />`; `<Spotlight />`; `<SocialLinks links email />`.

- [ ] **Step 1: Write `src/components/SocialLinks.astro`**

```astro
---
import type { SocialLink } from '../data/types';
import Icon from './Icon.astro';

interface Props {
  links: SocialLink[];
  email: string;
}

const { links, email } = Astro.props;
---

<ul class="socials" role="list">
  {
    links.map(({ label, href, icon }) => (
      <li>
        <a class="social" href={href} target="_blank" rel="noreferrer" title={label}>
          <Icon name={icon} size={22} />
          <span class="sr-only">{label} (opens in a new tab)</span>
        </a>
      </li>
    ))
  }
  <li>
    <a class="social" href={`mailto:${email}`} title="Email">
      <Icon name="mail" size={22} />
      <span class="sr-only">Email</span>
    </a>
  </li>
</ul>

<style>
  .socials {
    display: flex;
    align-items: center;
    gap: 1.25rem;
  }

  .social {
    display: block;
    margin: -0.25rem;
    padding: 0.25rem;
    color: var(--muted);
    transition: color 150ms ease;
  }

  .social:hover {
    color: var(--text);
  }
</style>
```

- [ ] **Step 2: Write `src/components/ThemeToggle.astro`**

```astro
---
import Icon from './Icon.astro';
---

<button class="toggle" type="button" aria-pressed="false" title="Toggle dark theme" data-theme-toggle hidden>
  <span class="sr-only">Dark theme</span>
  <span class="moon"><Icon name="moon" size={18} /></span>
  <span class="sun"><Icon name="sun" size={18} /></span>
</button>

<script>
  const root = document.documentElement;
  const themeColor = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
  const buttons = document.querySelectorAll<HTMLButtonElement>('[data-theme-toggle]');

  function sync() {
    for (const button of buttons) button.setAttribute('aria-pressed', String(root.dataset.theme === 'dark'));
    themeColor?.setAttribute('content', getComputedStyle(root).getPropertyValue('--bg').trim());
  }

  for (const button of buttons) {
    button.hidden = false;
    button.addEventListener('click', () => {
      const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
      root.dataset.theme = next;
      try {
        localStorage.setItem('theme', next);
      } catch {
        // Storage can be blocked (e.g. private mode); the toggle still works for this visit.
      }
      sync();
    });
  }

  sync();
</script>

<style>
  .toggle {
    display: grid;
    place-items: center;
    width: 2.25rem;
    height: 2.25rem;
    padding: 0;
    border: 1px solid var(--border);
    border-radius: 999px;
    background: var(--surface);
    color: var(--muted);
    cursor: pointer;
    transition:
      color 150ms ease,
      border-color 150ms ease;
  }

  .toggle[hidden] {
    display: none;
  }

  .toggle:hover {
    border-color: var(--muted);
    color: var(--text);
  }

  .sun {
    display: none;
  }

  :global([data-theme='dark']) .sun {
    display: block;
  }

  :global([data-theme='dark']) .moon {
    display: none;
  }
</style>
```

- [ ] **Step 3: Write `src/components/Spotlight.astro`**

```astro
<div class="spotlight" aria-hidden="true"></div>

<script>
  const spotlight = document.querySelector<HTMLElement>('.spotlight');
  const enabled = window.matchMedia(
    '(hover: hover) and (pointer: fine) and (min-width: 1024px) and (prefers-reduced-motion: no-preference)',
  );

  if (spotlight) {
    let frame = 0;
    window.addEventListener(
      'pointermove',
      (event) => {
        if (!enabled.matches) return;
        cancelAnimationFrame(frame);
        frame = requestAnimationFrame(() => {
          spotlight.style.setProperty('--x', `${event.clientX}px`);
          spotlight.style.setProperty('--y', `${event.clientY}px`);
          spotlight.classList.add('is-active');
        });
      },
      { passive: true },
    );
  }
</script>

<style>
  .spotlight {
    display: none;
    position: fixed;
    inset: 0;
    z-index: -1;
    pointer-events: none;
    background: radial-gradient(600px circle at var(--x) var(--y), var(--spotlight), transparent 80%);
    opacity: 0;
    transition: opacity 300ms ease;
  }

  @media (hover: hover) and (pointer: fine) and (min-width: 1024px) and (prefers-reduced-motion: no-preference) {
    .spotlight {
      display: block;
    }
  }

  .spotlight.is-active {
    opacity: 1;
  }
</style>
```

- [ ] **Step 4: Write `src/components/Sidebar.astro`**

```astro
---
import type { Profile } from '../data/types';
import Icon from './Icon.astro';
import SocialLinks from './SocialLinks.astro';
import ThemeToggle from './ThemeToggle.astro';

interface Props {
  profile: Profile;
  sections: { id: string; label: string }[];
}

const { profile, sections } = Astro.props;
---

<header class="sidebar">
  <div>
    <h1 class="name">{profile.name}</h1>
    <p class="role">{profile.role}</p>
    <p class="tagline">{profile.tagline}</p>
    {
      profile.location && (
        <p class="location">
          <Icon name="map-pin" size={16} />
          {profile.location}
        </p>
      )
    }
    <nav class="nav" aria-label="Sections">
      <ul role="list">
        {
          sections.map(({ id, label }) => (
            <li>
              <a class="nav-link" href={`#${id}`} data-section={id}>
                <span class="nav-line" aria-hidden="true" />
                {label}
              </a>
            </li>
          ))
        }
      </ul>
    </nav>
  </div>
  <div class="footer">
    <SocialLinks links={profile.socials} email={profile.email} />
    <ThemeToggle />
  </div>
</header>

<script>
  // Scroll-spy: highlight the nav link of the section crossing the upper third of the viewport.
  const links = new Map(
    [...document.querySelectorAll<HTMLAnchorElement>('[data-section]')].map((link) => [link.dataset.section, link]),
  );

  function activate(id: string | undefined) {
    for (const [sectionId, link] of links) {
      if (sectionId === id) link.setAttribute('aria-current', 'true');
      else link.removeAttribute('aria-current');
    }
  }

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) if (entry.isIntersecting) activate(entry.target.id);
    },
    { rootMargin: '-25% 0px -70% 0px' },
  );

  for (const id of links.keys()) {
    const section = id ? document.getElementById(id) : null;
    if (section) observer.observe(section);
  }

  // The last section is often too short to reach the trigger line, so activate it at the bottom.
  window.addEventListener(
    'scroll',
    () => {
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2) {
        activate([...links.keys()].at(-1));
      }
    },
    { passive: true },
  );
</script>

<style>
  .sidebar {
    padding-top: 4rem;
  }

  @media (min-width: 1024px) {
    .sidebar {
      position: sticky;
      top: 0;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      width: 48%;
      max-height: 100vh;
      padding-block: clamp(3rem, 12vh, 6rem);
    }
  }

  .name {
    color: var(--text);
    font-size: clamp(2.25rem, 1.6rem + 2.4vw, 3rem);
    font-weight: 700;
    letter-spacing: -0.025em;
    line-height: 1.1;
    text-wrap: balance;
  }

  .role {
    margin-top: 0.75rem;
    color: var(--text);
    font-size: 1.125rem;
    font-weight: 500;
    letter-spacing: -0.01em;
  }

  @media (min-width: 640px) {
    .role {
      font-size: 1.25rem;
    }
  }

  .tagline {
    max-width: 20rem;
    margin-top: 1rem;
    line-height: 1.6;
    text-wrap: pretty;
  }

  .location {
    display: flex;
    align-items: center;
    gap: 0.375rem;
    margin-top: 1rem;
    font-size: 0.875rem;
  }

  .nav {
    display: none;
  }

  @media (min-width: 1024px) {
    .nav {
      display: block;
      margin-top: 4rem;
    }
  }

  .nav-link {
    display: inline-flex;
    align-items: center;
    gap: 1rem;
    padding-block: 0.75rem;
    color: var(--muted);
    font-size: 0.75rem;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    transition: color 150ms ease;
  }

  .nav-line {
    width: 2rem;
    height: 1px;
    background: currentColor;
    transition: width 150ms ease;
  }

  .nav-link:hover,
  .nav-link:focus-visible,
  .nav-link[aria-current] {
    color: var(--text);
  }

  .nav-link:hover .nav-line,
  .nav-link:focus-visible .nav-line,
  .nav-link[aria-current] .nav-line {
    width: 4rem;
  }

  .footer {
    display: flex;
    align-items: center;
    gap: 1.5rem;
    margin-top: 2rem;
  }
</style>
```

- [ ] **Step 5: Replace `src/pages/index.astro` with the page shell**

```astro
---
import Sidebar from '../components/Sidebar.astro';
import Spotlight from '../components/Spotlight.astro';
import { profile } from '../data/profile';
import Base from '../layouts/Base.astro';
import { personJsonLd } from '../lib/seo';

// A section with no content is left out of both the page and the nav.
const sections = [
  profile.about.length > 0 && { id: 'about', label: 'About' },
  profile.experience.length > 0 && { id: 'experience', label: 'Experience' },
  profile.projects.length > 0 && { id: 'projects', label: 'Projects' },
  profile.skills.length > 0 && { id: 'skills', label: 'Skills' },
  profile.education.length > 0 && { id: 'education', label: 'Education' },
  { id: 'contact', label: 'Contact' },
].filter((section) => section !== false);
---

<Base
  title={`${profile.name} — ${profile.role}`}
  description={profile.tagline}
  jsonLd={personJsonLd(profile, Astro.site?.href ?? '')}
>
  <Spotlight />
  <div class="page">
    <Sidebar profile={profile} sections={sections} />
    <main id="content" tabindex="-1">
      <p>Sections arrive in the next task.</p>
    </main>
  </div>
</Base>

<style>
  .page {
    max-width: 80rem;
    margin-inline: auto;
    padding-inline: var(--gutter);
  }

  main {
    padding-block: 4rem 0;
  }

  main:focus {
    outline: none;
  }

  @media (min-width: 1024px) {
    .page {
      display: flex;
      justify-content: space-between;
      gap: 1rem;
    }

    main {
      width: 52%;
      padding-block: 6rem 0;
    }
  }
</style>
```

- [ ] **Step 6: Build**

Run: `npm run build`
Expected: passes; `dist/index.html` contains `aria-label="Sections"` and `data-theme-toggle`.

- [ ] **Step 7: Commit**

```bash
git add src/components src/pages/index.astro
git commit -m "Add sticky sidebar with scroll-spy nav, theme toggle, and cursor spotlight"
```

---

### Task 6: Content sections

**Files:**
- Create: `src/components/About.astro`, `Experience.astro`, `Projects.astro`, `Skills.astro`, `Education.astro`, `Contact.astro`
- Modify: `src/pages/index.astro` (render sections + colophon)

**Interfaces:**
- Consumes: `Section`, `Entry`, `Period`, `TagList`, `Icon`, types from `src/data/types.ts`.
- Produces: `<About paragraphs />`, `<Experience jobs />`, `<Projects projects />`, `<Skills groups />`, `<Education entries />`, `<Contact email note socials />`.

- [ ] **Step 1: Write `src/components/About.astro`**

```astro
---
import Section from './Section.astro';

interface Props {
  paragraphs: string[];
}

const { paragraphs } = Astro.props;
---

<Section id="about" label="About">
  <div class="about">
    {paragraphs.map((paragraph) => <p>{paragraph}</p>)}
  </div>
</Section>

<style>
  .about {
    display: grid;
    gap: 1rem;
    text-wrap: pretty;
  }
</style>
```

- [ ] **Step 2: Write `src/components/Experience.astro`**

```astro
---
import type { Job } from '../data/types';
import Entry from './Entry.astro';
import Period from './Period.astro';
import Section from './Section.astro';
import TagList from './TagList.astro';

interface Props {
  jobs: Job[];
}

const { jobs } = Astro.props;
---

<Section id="experience" label="Experience">
  <ol role="list">
    {
      jobs.map((job) => (
        <Entry title={`${job.role} · ${job.company}`} href={job.href}>
          <Period slot="aside" start={job.start} end={job.end} />
          <p class="entry-text">{job.summary}</p>
          {job.tech && <TagList tags={job.tech} />}
        </Entry>
      ))
    }
  </ol>
</Section>
```

- [ ] **Step 3: Write `src/components/Projects.astro`**

```astro
---
import { Image } from 'astro:assets';
import type { Project } from '../data/types';
import Entry from './Entry.astro';
import Icon from './Icon.astro';
import Section from './Section.astro';
import TagList from './TagList.astro';

interface Props {
  projects: Project[];
}

const { projects } = Astro.props;
---

<Section id="projects" label="Projects">
  <ol role="list">
    {
      projects.map((project) => (
        <Entry title={project.name} href={project.href ?? project.repo}>
          {project.image && (
            <div slot="aside" class="thumb">
              <Image src={project.image} alt="" width={320} />
            </div>
          )}
          <p class="entry-text">{project.description}</p>
          {project.href && project.repo && (
            <a class="source" href={project.repo} target="_blank" rel="noreferrer">
              <Icon name="github" size={16} />
              Source code
              <span class="sr-only"> (opens in a new tab)</span>
            </a>
          )}
          {project.tech && <TagList tags={project.tech} />}
        </Entry>
      ))
    }
  </ol>
</Section>

<style>
  .thumb :global(img) {
    width: 100%;
    height: auto;
    aspect-ratio: 16 / 10;
    object-fit: cover;
    border: 2px solid var(--border);
    border-radius: 0.25rem;
    transition: border-color 150ms ease;
  }

  :global(.entry:hover) .thumb :global(img) {
    border-color: var(--muted);
  }

  /* Sits above the entry's stretched title link so it stays separately clickable. */
  .source {
    position: relative;
    z-index: 1;
    display: inline-flex;
    align-items: center;
    gap: 0.375rem;
    margin-top: 0.75rem;
    color: var(--text);
    font-size: 0.875rem;
    font-weight: 500;
    transition: color 150ms ease;
  }

  .source:hover {
    color: var(--accent);
  }
</style>
```

- [ ] **Step 4: Write `src/components/Skills.astro`**

```astro
---
import type { SkillGroup } from '../data/types';
import Section from './Section.astro';
import TagList from './TagList.astro';

interface Props {
  groups: SkillGroup[];
}

const { groups } = Astro.props;
---

<Section id="skills" label="Skills">
  <dl class="skills">
    {
      groups.map(({ label, items }) => (
        <div class="group">
          <dt class="label">{label}</dt>
          <dd>
            <TagList tags={items} label={label} />
          </dd>
        </div>
      ))
    }
  </dl>
</Section>

<style>
  .skills {
    display: grid;
    gap: 1.5rem;
  }

  .group {
    display: grid;
    gap: 0.75rem;
  }

  @media (min-width: 640px) {
    .group {
      grid-template-columns: minmax(0, 1fr) minmax(0, 3fr);
      gap: 1.5rem;
      align-items: baseline;
    }
  }

  .label {
    color: var(--muted);
    font-size: 0.75rem;
    font-weight: 600;
    letter-spacing: 0.05em;
    text-transform: uppercase;
  }
</style>
```

- [ ] **Step 5: Write `src/components/Education.astro`**

```astro
---
import type { Education as EducationEntry } from '../data/types';
import Entry from './Entry.astro';
import Period from './Period.astro';
import Section from './Section.astro';

interface Props {
  entries: EducationEntry[];
}

const { entries } = Astro.props;
---

<Section id="education" label="Education">
  <ol role="list">
    {
      entries.map((entry) => (
        <Entry title={`${entry.degree} · ${entry.school}`} href={entry.href}>
          <Period slot="aside" start={entry.start} end={entry.end} />
          {entry.details && <p class="entry-text">{entry.details}</p>}
        </Entry>
      ))
    }
  </ol>
</Section>
```

- [ ] **Step 6: Write `src/components/Contact.astro`**

```astro
---
import type { SocialLink } from '../data/types';
import Icon from './Icon.astro';
import Section from './Section.astro';

interface Props {
  email: string;
  note: string;
  socials: SocialLink[];
}

const { email, note, socials } = Astro.props;
---

<Section id="contact" label="Contact">
  <p class="note">{note}</p>
  <div class="actions">
    <a class="email" href={`mailto:${email}`}>
      <Icon name="mail" size={18} />
      {email}
    </a>
    <button class="copy" type="button" data-copy={email} hidden>
      <span class="copy-icon"><Icon name="copy" size={16} /></span>
      <span class="check-icon"><Icon name="check" size={16} /></span>
      <span data-copy-label>Copy</span>
    </button>
    <p class="sr-only" aria-live="polite" data-copy-status></p>
  </div>
  {
    socials.length > 0 && (
      <p class="elsewhere">
        Also on{' '}
        {socials.map(({ label, href }, index) => (
          <>
            {index > 0 && (index === socials.length - 1 ? ' and ' : ', ')}
            <a class="link" href={href} target="_blank" rel="noreferrer">
              {label}
              <span class="sr-only"> (opens in a new tab)</span>
            </a>
          </>
        ))}.
      </p>
    )
  }
</Section>

<script>
  for (const button of document.querySelectorAll<HTMLButtonElement>('[data-copy]')) {
    const label = button.querySelector('[data-copy-label]');
    const status = button.parentElement?.querySelector('[data-copy-status]');
    // The Clipboard API needs a secure context (HTTPS or localhost); keep the button hidden otherwise.
    if (!navigator.clipboard || !label || !status) continue;
    button.hidden = false;

    let timer = 0;
    button.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(button.dataset.copy ?? '');
        button.dataset.copied = '';
        label.textContent = 'Copied';
        status.textContent = 'Email address copied';
      } catch {
        label.textContent = 'Copy failed';
      }
      clearTimeout(timer);
      timer = window.setTimeout(() => {
        delete button.dataset.copied;
        label.textContent = 'Copy';
        status.textContent = '';
      }, 2000);
    });
  }
</script>

<style>
  .note {
    max-width: 32rem;
    text-wrap: pretty;
  }

  .actions {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 0.75rem;
    margin-top: 1.5rem;
  }

  .email {
    display: inline-flex;
    align-items: center;
    gap: 0.625rem;
    padding: 0.75rem 1.25rem;
    border-radius: var(--radius);
    background: var(--text);
    color: var(--bg);
    font-weight: 500;
    transition: background-color 150ms ease;
  }

  .email:hover {
    background: var(--accent);
  }

  .copy {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1rem;
    border: 1px solid var(--border);
    border-radius: var(--radius);
    background: var(--surface);
    color: var(--text);
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
    transition: border-color 150ms ease;
  }

  .copy[hidden] {
    display: none;
  }

  .copy:hover {
    border-color: var(--muted);
  }

  .check-icon {
    display: none;
    color: var(--accent);
  }

  .copy[data-copied] .check-icon {
    display: block;
  }

  .copy[data-copied] .copy-icon {
    display: none;
  }

  .elsewhere {
    margin-top: 1.5rem;
  }
</style>
```

- [ ] **Step 7: Render the sections in `src/pages/index.astro`**

Add to the frontmatter imports:

```ts
import About from '../components/About.astro';
import Contact from '../components/Contact.astro';
import Education from '../components/Education.astro';
import Experience from '../components/Experience.astro';
import Projects from '../components/Projects.astro';
import Skills from '../components/Skills.astro';
```

Add after the `sections` array:

```ts
const has = (id: string) => sections.some((section) => section.id === id);
const year = new Date().getFullYear();
```

Replace the `<main>` element with:

```astro
<main id="content" tabindex="-1">
  {has('about') && <About paragraphs={profile.about} />}
  {has('experience') && <Experience jobs={profile.experience} />}
  {has('projects') && <Projects projects={profile.projects} />}
  {has('skills') && <Skills groups={profile.skills} />}
  {has('education') && <Education entries={profile.education} />}
  <Contact email={profile.email} note={profile.contactNote} socials={profile.socials} />
  <footer class="colophon">
    <p>
      © {year} {profile.name}. Built with <a class="link" href="https://astro.build" target="_blank" rel="noreferrer">Astro<span class="sr-only"> (opens in a new tab)</span></a>
      and hosted on GitHub Pages.
    </p>
  </footer>
</main>
```

Add to the `<style>` block:

```css
.colophon {
  max-width: 28rem;
  padding-bottom: 4rem;
  font-size: 0.875rem;
}
```

- [ ] **Step 8: Build and check the output**

Run: `npm run build && grep -c 'class="entry' dist/index.html`
Expected: build passes; count ≥ 8 (3 jobs + 3 projects + 2 education).

- [ ] **Step 9: Commit**

```bash
git add src/components src/pages/index.astro
git commit -m "Add About, Experience, Projects, Skills, Education, and Contact sections"
```

---

### Task 7: Deploy workflow and README

**Files:**
- Create: `.github/workflows/deploy.yml`, `README.md`

- [ ] **Step 1: Write `.github/workflows/deploy.yml`** (Astro's documented workflow, plus a concurrency guard)

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

# Never run two deployments at once; let an in-progress one finish.
concurrency:
  group: pages
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Check out the repository
        uses: actions/checkout@v7
      - name: Install, type-check, test, build, and upload the site
        uses: withastro/action@v6

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v5
```

- [ ] **Step 2: Write `README.md`**

````markdown
# jonasahlers.github.io

My personal CV site: a single page with my experience, projects, skills, education, and contact
details. Built with [Astro](https://astro.build), deployed to GitHub Pages on every push to `main`.

**Live:** https://jonasahlers.github.io

## Edit the content

Everything personal lives in one file: [`src/data/profile.ts`](src/data/profile.ts). Change it,
push, and the site redeploys. The build type-checks the file, so a missing field or a malformed
date (`"2023"` or `"2023-04"`) fails the build and the live site stays on the last good version.

- Leave a list empty (for example `education: []`) to hide that section and its menu item.
- Leave out `end` for your current job; it shows as "Present".
- To show a project screenshot, put the image in `src/assets/` and set
  `image: importedImage` on the project (`import shot from '../assets/shot.png'` at the top).

## Run it locally

Requires Node 22.12 or newer (Node 24 LTS recommended).

```sh
npm install
npm run dev      # http://localhost:4321
npm test         # unit tests
npm run build    # type-check + tests + production build into dist/
```

## Change the look

Colors, radius, and spacing are CSS variables at the top of
[`src/styles/global.css`](src/styles/global.css): light theme first, dark theme below it.

## How it's built

| Path | What it does |
|---|---|
| `src/data/` | Content (`profile.ts`) and its types (`types.ts`) |
| `src/pages/index.astro` | The page: sidebar plus sections, in order |
| `src/components/` | One component per section, plus small building blocks |
| `src/layouts/Base.astro` | `<head>`: SEO tags, fonts, theme bootstrapping |
| `src/lib/` | Date formatting, structured data, icons |
| `.github/workflows/deploy.yml` | Builds and deploys to GitHub Pages |
````

- [ ] **Step 3: Verify the full build once more**

Run: `npm run build`
Expected: `0 errors`, tests pass, `1 page(s) built` (plus the favicon route).

- [ ] **Step 4: Commit**

```bash
git add .github README.md
git commit -m "Add GitHub Pages deploy workflow and README"
```

---

### Task 8: Visual QA and design iteration

**Files:**
- Modify: any of `src/styles/global.css`, `src/components/*.astro` (design refinements only)

- [ ] **Step 1: Start the dev server in the preview browser** (`.claude/launch.json` entry `dev` → `npm run dev`, port 4321).
- [ ] **Step 2: Screenshot and critique** at 1440×900 and 1280×720 (desktop), 768×1024 (tablet), 375×812 (mobile), in light and dark. Check: hierarchy, rhythm, alignment of the aside column across Experience/Projects/Skills/Education, sidebar fit on short viewports, sticky mobile headings, hover/dim states, favicon.
- [ ] **Step 3: Keyboard pass:** Tab from the top — skip link appears and jumps to `main`; every link shows a focus ring; entry cards show the surface on focus; the theme toggle works with Enter/Space.
- [ ] **Step 4: Contrast check** of `--muted` and `--accent` against `--bg` and `--surface` in both themes (≥4.5:1), including tag text on `--accent-soft`.
- [ ] **Step 5: Reduced motion:** emulate `prefers-reduced-motion: reduce`; the spotlight is gone and nothing animates.
- [ ] **Step 6: Iterate** on whatever the screenshots show until it holds up; rebuild with `npm run build` after each round.
- [ ] **Step 7: Commit** each meaningful round: `git commit -am "Refine <what>"`.

---

### Task 9: Publish to GitHub (after the user has run `gh auth login`)

- [ ] **Step 1: Verify auth:** `gh auth status` shows `jonasahlers` with the `workflow` scope.
- [ ] **Step 2: Create the repo and push:** `gh repo create jonasahlers.github.io --public --source=. --remote=origin --push --description "Personal CV website"`
- [ ] **Step 3: Enable Pages from Actions:** `gh api -X POST repos/jonasahlers/jonasahlers.github.io/pages -f build_type=workflow` (if it reports Pages already exists, `gh api -X PUT repos/jonasahlers/jonasahlers.github.io/pages -f build_type=workflow`).
- [ ] **Step 4: Run the deploy:** `gh workflow run deploy.yml && gh run watch --exit-status`
- [ ] **Step 5: Verify:** `curl -sI https://jonasahlers.github.io | head -1` → `HTTP/2 200`, and the page shows the name.
