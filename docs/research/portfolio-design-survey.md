# Portfolio & CV site design survey

Research date: **2026-09-26**. Scope: design research for a one-page software-engineer CV: name and short intro, work experience, projects, contact info, and LinkedIn/GitHub links.

Method:
- **Pages and CSS.** Each site's live HTML and production CSS/JS was fetched with `curl`. Open-source repos were read from their raw files on GitHub.
- **Fonts.** Self-hosted fonts were identified from their WOFF2 `name` tables with fontTools. This resolves aliases such as "Sans" and "X" to real families.
- **Colors.** Tailwind classes were converted to hex from each site's compiled CSS.
- **Contrast.** Contrast ratios were computed with the WCAG relative-luminance formula ([S33]).

Conventions:
- `≈` marks a value converted from HSL/LAB or otherwise approximate.
- **Unverified** marks something that could not be confirmed from source.
- **Judgment** marks opinion, not a sourced fact.
- Star counts come from the GitHub API on the research date ([S30]). GitHub search and star counts were used only to *discover* template candidates.

---

## TL;DR

- **The best sites are narrow and quiet.** They use one reading column of 600–720 px. Only Brittany Chiang splits the page, into a 48/52 layout. Body text is 16–17 px. Hierarchy comes from two or three text tones rather than big type. There is one accent color, or none.
- **Show experience as rows with a muted date column**, not cards or timelines. Examples: brittanychiang.com, rauchg.com, midudev's template, cv.jarocki.me.
- **Hover reveals a surface instead of adding decoration.** Hover backgrounds extend past the text edge without moving it (Brittany Chiang, Emil Kowalski, Rauch). Lists dim the rows you are not hovering (Chiang, Lee Robinson).
- **Motion is small and respects user settings.** Entrances are 8–10 px fade-ups, staggered, under a second, and turned off under `prefers-reduced-motion` on the best sites. Templates often forget that setting.
- **Even the famous sites slip on two things:**
  - Contrast of the faintest text: Chiang's dates measure 3.75:1, below the 4.5:1 AA minimum.
  - Font weight: Chiang's site preloads ≈1.18 MB of Inter.
- **Three proposed directions:**
  - **Night Shift**: dark, split layout, cursor spotlight.
  - **Paper Trail**: warm, editorial serif column.
  - **Changelog**: monospace-led, ⌘K menu, clean print.

---

## 1. At a glance

| # | Site | Layout | Fonts (verified) | Theme | Signature move |
|---|---|---|---|---|---|
| 1 | [brittanychiang.com](https://brittanychiang.com/) (v5) | Split: sticky left identity column, scrolling right column | Inter | Dark only; slate + teal | Cursor spotlight, scroll-spy nav, dims the rows you aren't hovering |
| 1b | [bchiang7/v4](https://github.com/bchiang7/v4) (8,281★) | Single column + fixed side rails | Calibre + SF Mono | Dark navy + mint | Numbered headings, job tabs, reveal on scroll |
| 2 | [leerob.com](https://leerob.com/) | 600 px column + painted side image at ≥1100 px | Iowan Old Style (`local()`) + system sans | Warm light/dark | Short/long bio toggle, logo cursors, dimmed rows |
| 3 | [rauchg.com](https://rauchg.com/) | 672 px list | Geist + Geist Mono | Follows OS light/dark | Year-grouped rows + view counts |
| 4 | [paco.me](https://paco.me/) | 640 px column in a 192/640/192 grid | Söhne + Inter + Newsreader italic | Follows OS light/dark | Staggered fade-up, blurred page edges |
| 5 | [rauno.me](https://rauno.me/) | Horizontal canvas of "frames" + minimap | PP Neue Montreal + JetBrains Mono | Gray, light/dark | Line-by-line headline reveal, copy-email button |
| 6 | [joshwcomeau.com](https://www.joshwcomeau.com/) | Blog hub + large footer | Wotfard + Cartograph CF + Sriracha | Toggle | Playful sound effects, theme toggle without flash |
| 7 | [cassidoo.co](https://cassidoo.co/) | 70ch column, sticky nav | iA Writer Mono | Warm off-white; follows OS | Personal voice, thick underlines |
| 8 | [antfu.me](https://antfu.me/) | 65ch prose column, icon nav | Inter + DM Mono | Toggle | Logo chips, circular theme reveal, generative art |
| 9 | [emilkowal.ski](https://emilkowal.ski/) | 644 px column | Inter Variable + Heldane/Tiempos + Berkeley Mono | Sand grays, light/dark | Hover background on rows, extreme restraint |
| 10 | [delba.dev](https://delba.dev/) | 2fr/1fr grid | Fraunces | Stone, light only | "Open to work" line + one call-to-action button |
| 11 | [RyanFitzgerald/devportfolio](https://github.com/RyanFitzgerald/devportfolio) (Astro, 4,974★) | Full-screen hero, then 4/8-column sections | IBM Plex Mono | Light, blue accent | Cards that lift on hover, timeline |
| 12 | [midudev/minimalist-portfolio-json](https://github.com/midudev/minimalist-portfolio-json) (Astro, 946★) | 700 px column | System mono + system-ui (no web fonts) | Light | ⌘K menu, print stylesheet, JSON Resume data |
| 13 | [BartoszJarocki/cv](https://github.com/BartoszJarocki/cv) (9,674★) | 672 px column | Geist + Geist Mono | Light (dark colors defined, never applied) | Ctrl+J menu, print-ready layout |
| + | [jsonresume-theme-even](https://github.com/rbardini/jsonresume-theme-even) | Résumé grid with headings in a narrow left column | Lato | Follows OS light/dark | Print layout, color options |

---

## 2. Site-by-site notes

### Personal sites

#### 2.1 Brittany Chiang: brittanychiang.com (v5) ([S1], [S2], [S3])

- **Layout:**
  - At ≥1024 px the page splits in two:
    - `<header>` is `lg:sticky lg:top-0 lg:max-h-screen lg:w-[48%]`.
    - `<main>` is `lg:w-[52%]`.
    - Both sit inside `max-w-screen-xl` (1280 px) with 24/48 px gutters ([S1]).
  - Sidebar order: name → role → one-line pitch → scroll-spy nav (About / Experience / Projects) → social icons.
  - Content order: About → Experience (+ "View Full Résumé", a PDF) → Projects (+ "View Full Project Archive") → Writing → colophon footer.
  - Below 1024 px the sidebar becomes a normal header. Each section label turns into a sticky translucent bar (`bg-slate-900/75 backdrop-blur`) ([S1]).
- **Type:**
  - Inter 3.19, static 400/500/600/700 plus italics, loaded via `next/font` ([S2]).
  - Name: 36→48 px, bold, `tracking-tight` (−0.025em).
  - Role: 18→20 px, medium.
  - Nav and section labels: 12 px bold uppercase, `tracking-widest` (0.1em).
  - Body: 16 px / 1.625. Descriptions: 14 px.
  - Dates: 12 px semibold uppercase ([S1]).
- **Color (dark only):**
  - Background `#0f172a` (slate-900, also the `theme-color`); body text `#94a3b8`; headings `#e2e8f0`; metadata `#64748b`.
  - Accent `#5eead4` on tag background `rgba(45,212,191,.1)`; hover card `rgba(30,41,59,.5)`; text selection is teal ([S1], [S2]).
- **Signature interactions:**
  - **Cursor spotlight.** A fixed layer of `radial-gradient(600px circle at x y, rgba(29,78,216,.15), transparent 80%)` follows the mouse. It is turned off below 1024 px ([S3]).
  - **Scroll-spy nav.** An IntersectionObserver with `rootMargin: "0% 0% -70% 0%"` tracks the current section. The active item's line grows from 32 to 64 px and brightens ([S2], [S3]).
  - **Dim the other rows.** Hovering one entry sets its siblings to `opacity-50` and shows a card behind it. The card extends past the text edge (`-inset-x-6`, inset top highlight, drop shadow) ([S1]).
  - **Arrow nudge.** The ↗ arrow moves on hover *and* on `focus-visible`, with `motion-reduce:transition-none` ([S1]).
  - **Easter eggs.** Rainbow "Korok seeds" letters on hover and a Tardis button ([S1]).
- **Experience:**
  - An `<ol>` of 8-column grids. The date is a `<header>` spanning two columns, with `aria-label="2024 to Present"`.
  - The content spans six columns:
    - A single "Role · Company ↗" link. An absolutely positioned span stretches its click area over the whole card.
    - Earlier titles at the same company stacked in muted text.
    - A two- or three-sentence description.
    - Rounded 12 px teal tech tags ([S1]).
- **Projects:** the same row grid with a 200×48 `aspect-video` thumbnail on the left. Its 2 px border goes from 10% to 30% opacity on hover. Then title, description and tags ([S1]).
- **Contact/footer:** there is no contact section. Social icons live in the sidebar, and the footer is a colophon (Figma, VS Code, Next.js, Tailwind, Vercel, Inter) ([S1]).
- **Polished vs generic:**
  - *Polished:*
    - A strict three-tone text hierarchy.
    - Whole-card click areas that keep a real title link.
    - Hover effects also work on keyboard focus.
    - Headings that are visually hidden on desktop but still read by screen readers, plus a skip link.
  - *Caveats:*
    - The 12 px dates are `#64748b` on `#0f172a`, 3.75:1, which fails AA ([S33]).
    - The server-rendered HTML wraps the whole header+main in `style="opacity:0"`, so nothing shows until JS runs ([S1]).
    - Nine *unsubsetted* static Inter files are preloaded, ≈1.18 MB including four italics (measured from the preloaded files, [S1]).

#### 2.1b bchiang7/v4 (8,281★, 4,210 forks) ([S4])

- **Layout:** a single column with fixed rails on both sides: social icons on the left, the email address set vertically on the right (`writing-mode: vertical-rl`). Sections in order:
  1. Hero: "Hi, my name is" in green monospace, then the big name, "I build things for the web.", and a call-to-action button.
  2. 01 About: a tinted photo with an offset green outline that shifts on hover.
  3. 02 Where I've Worked: tabs.
  4. 03 Some Things I've Built: featured projects.
  5. Other Noteworthy Projects: card grid with a "Show More" button.
  6. 04 What's Next? / Get In Touch: a "Say Hello" email button.
  7. Footer showing live GitHub stars and forks ([S4]).
- **Type:**
  - Calibre (Klim, commercial) and SF Mono.
  - Sizes 12–22 px; section headings 32 px; hero `clamp(40px, 8vw, 80px)`.
  - "01." numbering comes from CSS counters ([S4]).
- **Color:**
  - Backgrounds `#0a192f` (navy) and `#112240` (lighter navy).
  - Text `#8892b0` (body) and `#ccd6f6` (headings); accent `#64ffda` (mint green) ([S4]).
- **Interactions:**
  - ScrollReveal fade-up: 20 px, 500 ms, `cubic-bezier(0.645,0.045,0.355,1)`.
  - Job tabs are a proper ARIA tablist. Arrow Up/Down move between tabs, and only the active tab is in the Tab order (roving `tabIndex`). A 2 px marker slides `translateY(n × 42px)` to the active tab.
  - Featured images are green-tinted (grayscale + multiply) until hover. Cards lift 7 px.
  - A `usePrefersReducedMotion` hook turns off the hero animation ([S4]).
- **Why it matters (Judgment):** it is the most-forked developer portfolio. Its look (navy + mint + numbered headings) now reads as a template. Borrow the mechanics (tabs, focus styles), not the look.

#### 2.2 Lee Robinson: leerob.com ([S5], [S6])

- **Layout:**
  - A centered 600 px column. At ≥1100 px it becomes a grid, `minmax(0,1.75fr) minmax(380px,1fr)`. The right side is a hand-painted San Francisco/Iowa collage in a bordered box with 10 px corners: a still image layered over a muted video, both with 0.24 s opacity transitions ([S5], [S6]).
  - Order: `@leerob` title (links to X) → bio with a **Default / Long** toggle → Notes (two-column square-bullet list) → Blogs (ruled rows, month and year on the right) ([S5]).
- **Type:**
  - Body text is **Iowan Old Style**, loaded with `local()` only. That is zero bytes on Apple devices; elsewhere it falls back to Palatino or Georgia. 17 px / 1.6.
  - UI text uses the system sans stack at 14 px.
  - Title: `clamp(2.2rem, 3.5vw, 2.65rem)`, weight 600, −0.02em, `text-wrap: balance`. Section headings: 1.45rem, weight 600 ([S6]).
- **Color:**
  - Light: background `#fff`, text `#282828`, secondary `#504945`, links and nav `#676767`, surface `#f3f3f2`.
  - Dark: background `#1b1a19`, text `#e8e5df`, headings `#f4f1eb`, nav `#aaa59e`, surface `#242321`.
  - Hairlines are the text color at 10% (light) or 18% (dark), made with `color-mix()` ([S6]).
- **Interactions:**
  - Hovering the list dims the other rows to 0.8. This only applies with a precise pointer (`hover:hover and pointer:fine`).
  - Links are muted gray with 30%-opacity underlines that darken over 0.3 s.
  - The "Cursor" and "Vercel" links show those companies' logos as the mouse cursor.
  - The theme is switched with next-themes: an inline script sets a `.light` or `.dark` class before the page paints. There is no visible toggle on the home page. A global rule turns off transitions under reduced motion ([S5], [S6]).
- **Experience:** told in one bio sentence (ML at SpaceX, formerly Cursor, previously Vercel). There is no job list ([S5]).
- **Contact:** an email link inside the bio; the title links to X; no footer content ([S5]).
- **Polished (Judgment):** it reads like a real page of text: serif at 17 px, a balanced headline, warm neutrals, and one illustration that appears only on wide screens. The Default/Long bio toggle fits a CV directly.

#### 2.3 Guillermo Rauch: rauchg.com ([S7], [S8], [S9])

- **Layout:** one centered `max-w-2xl` (672 px) column with 24 px padding. The header has the bold name on the left and nav links ("About", "Follow me") on the right. The home page is a list of posts ([S7]).
- **Type:** Geist (variable, 100–900) and Geist Mono. List text 14 px, metadata 12 px, footer 12 px monospace ([S7], [S8]).
- **Color:** follows the OS setting; there is no toggle.
  - Background `#fff` / `#1c1c1c`; text is the browser default / `#f3f4f6`; metadata `#737373`.
  - Hover highlight `#e5e5e5` / `#404040`; text selection is inverted, black-on-white / white-on-black ([S8]).
- **Interactions:** only a rounded highlight behind the hovered title ([S7]).
- **List pattern:** the year is printed once per group in a fixed 40–56 px column. Then the title, then a right-aligned view count in 12 px muted text ([S7]).
- **Footer:** 12 px monospace, "Guillermo Rauch (@rauchg)" on the left and "Source" (the public repo) on the right ([S7], [S9]).
- **Polished (Judgment):** almost nothing is on the page, but every row aligns to one grid and the numbers line up on the right. Only two font files are preloaded, ≈60 KB (measured, [S7]).

#### 2.4 Paco Coursey: paco.me ([S10], [S11], [S12])

- **Layout:**
  - A three-column grid, `192px 640px 192px` with 24 px gaps. Content sits in the middle column. Below 768 px it stacks into one column ([S11]).
  - Order ([S10]):
    1. Name.
    2. A two-sentence intro whose first phrase is in italic serif.
    3. Three 192 px columns: *Building · Projects · Writing*. Each item is a link, a ↗ icon, and one line of dim text.
    4. *Now*.
    5. *Connect*.
    6. Footer.
- **Type:**
  - **Söhne** (Klim, commercial) is the main sans. Inter 4.0 variable handles UI text. **Newsreader italic** is used for serif emphasis. All three are self-hosted subsets whose names were read from the font files ([S11], [S12]).
  - Text is 16 px on a 28 px line height (1.75), with OpenType features `"kern","frac","ss02"` ([S11]).
- **Color:** follows the OS setting.
  - Dark: background `#1a1a1a`, text `#ededed`, dim text `#a0a0a0`, icons `#707070`, borders `#2e2e2e`.
  - Browser `theme-color`: `#ffffff` (light) and `#1c1c1c` (dark) ([S10], [S11]).
  - Light mode is white with a 12-step gray scale; the light gray values were not found in the shipped CSS (**Unverified**).
- **Interactions:**
  - Staggered entrance: opacity 0→1 and translateY 10 px→0 over 0.6 s. Each element waits index × 0.12 s. All of this sits inside `prefers-reduced-motion: no-preference`.
  - The top and bottom edges of the page are progressively blurred (`backdrop-filter: blur(5px)` plus a gradient mask).
  - The email address is drawn with CSS `::before` to make it harder to scrape ([S11]).
- **Experience/projects:** the current role is in the intro ("Webmaster at Linear"; earlier the Vercel design system). Projects are a text list: ⌘K, Writer, Next Themes ([S10]).
- **Footer:** a 48 px bar with a 1 px top border, a low-contrast motto, and the year in tabular figures ([S10], [S11]).
- **Polished (Judgment):** very short copy, an even vertical rhythm (16/28), and motion you feel more than see.

#### 2.5 Rauno Freiberg: rauno.me ([S13], [S14])

- **Layout:** a horizontal canvas of 1200×720 "frames" with a tick-mark minimap. Frames in order: intro, Devouring Details, Craft, History of Software Design, Projects, Field Notes, contact, manifesto ([S13]).
- **Type:** **PP Neue Montreal Medium** (Pangram Pangram, commercial), served under the alias "X", plus JetBrains Mono. Font sizes are 10/12/14/16/20/24 px ([S13], [S14]).
- **Color:** a gray scale in the style of Radix Colors (converted from HSL):
  - Light: background ≈`#fcfcfc`, text ≈`#171717`.
  - Dark: background ≈`#161616`, text ≈`#ededed`.
  - Blue accent ≈`#0090ff` ([S13]).
- **Interactions:**
  - The headline reveals line by line: each line slides up from `translateY(100px)` inside a mask. Frames scale in, and the minimap tracks the scroll position.
  - The contact frame puts X, GitHub and past versions of the site in the four corners. It adds a **Copy email** button whose "Copied" confirmation is announced through an `aria-live` region ([S13]).
- **For a CV (Judgment):** use it as a craft reference only.
  - Content starts at `opacity:0` and `scale(0)` until JS runs, and the horizontal navigation is unusual.
  - The CSS has no `prefers-reduced-motion` rule. Whether the JS handles it is **Unverified** ([S13], [S14]).
  - Worth copying: the copy-email button.

#### 2.6 Josh W. Comeau: joshwcomeau.com ([S15], [S16])

- **Layout:** a blog and course hub rather than a CV. Sections: hero, "Articles and Tutorials", "Browse By Category", "Popular Content", and a large footer ([S15]).
- **Type:** Wotfard (commercial) for text, Cartograph CF (commercial) for code, and Sriracha (Google Fonts) as a handwritten accent. Weights 500 and 600 ([S16]).
- **Color:** a light/dark toggle; values converted from HSL.
  - Light: text ≈`#0a0c10` on `#fff`, primary ≈`#4242fa`, secondary ≈`#e60067`.
  - Dark: background ≈`#0d0f12`, text ≈`#e3e6e8`, primary ≈`#809fff` ([S15]).
- **Interactions:**
  - A color-mode toggle and a "Disable sounds" toggle for the site's sound effects.
  - An inline script runs before the page paints. It swaps the color variables so the wrong theme never flashes.
  - The CSS has 27 `prefers-reduced-motion` references ([S15], [S16]).
- **Footer:** newsletter form, category and course columns, Bluesky/GitHub/LinkedIn icons, RSS, legal links ([S15]).
- **For a CV (Judgment):** playfulness is Josh's brand as an educator. Borrow at most one playful micro-interaction, plus his no-flash theme script and his motion discipline.

#### 2.7 Cassidy Williams: cassidoo.co ([S17], [S18], [S19])

- **Layout:**
  - A single column, `max-width: 70ch`, with 20 px padding. Built with Astro 7.0.3 ([S17]).
  - The header has the name and "Software Engineer in Chicago" beside a 200 px circular photo.
  - A sticky translucent nav in lowercase: home, newsletter, blog, github, socials.
  - Three short intro paragraphs, then recent posts with tags ([S17], [S18]).
- **Type:**
  - **iA Writer Mono** (400/700 plus italics, via Fontsource on jsDelivr) for everything. Headings are weight 400; body line height is 1.6.
  - Links have `.3ex` thick underlines with a `.3ex` offset. The active nav item is bolder and underlined ([S18]).
- **Color:** follows the OS setting.
  - Light: background `#faf5f6`, text `#252525`, gray `#6b6b6b`, selection `#e5ffc3`.
  - Dark: background `#252525`, text `#faf5f6`, gray `#a4a4a4` ([S18]).
- **Footer:** centered 0.8rem text, "© 2026 Cassidy Williams. This site is open source! <3" ([S17], [S19]).
- **Polished (Judgment):** the personality comes from her writing voice, one distinctive font and a warm off-white. The whole stylesheet is 6 KB ([S18]).

#### 2.8 Anthony Fu: antfu.me ([S20], [S21])

- **Layout:** a centered prose column (65ch, 1rem / 1.75). The logo is fixed at top left. A row of icon links sits top right: Blog, Projects, Talks, Sponsors, Podcasts, Photos, Demos, Bluesky, GitHub, RSS, and the theme toggle ([S20], [S21]).
- **Type:** Inter and DM Mono (plus Roboto Condensed and Bad Script), self-hosted through UnoCSS's web-font preset ([S21]).
- **Color:** a light/dark toggle.
  - Background `#fff` / `#050505`.
  - Three text tones: `#555` / `#222` / `#000` in light, `#bbb` / `#ddd` / `#fff` in dark.
  - Borders `#8884` ([S21]).
- **Interactions:**
  - A staggered entrance: elements move 10 px and fade in over 1 s, 90 ms apart. It is off under reduced motion.
  - The theme toggle uses the View Transitions API: the new theme spreads out as a circle from where you clicked. This is skipped under reduced motion ([S21], [S42]).
  - Generative "plum" or "dots" canvas art is picked per page ([S21]).
- **Experience:** intro lines with small inline logos next to each name: "Working at [Vercel] / [Nuxt]; Creator of [Vitest] [Slidev] [VueUse] …". It works as a two-line résumé ([S20]).
- **Projects page:**
  - Projects are grouped under huge outlined labels (`text-stroke`).
  - The grid has one to three columns. Each item has a monochrome logo at 50% opacity, the name, and a description at 50% opacity.
  - Hovered items get a light gray background (`#88888811`) ([S20], [S21]).
- **Caveat:** the 50%-opacity descriptions measure ≈2.3:1 on white and fail AA ([S33]).

#### 2.9 Emil Kowalski: emilkowal.ski ([S22], [S23])

- **Layout:** one column, `max-w-[692px]` with 24 px padding, which leaves ≈644 px for text. The header (name, "Design Engineer") is followed by a 128 px gap. Sections *Today → Projects → Writing → Newsletter → More* are 64 px apart on mobile and 128 px apart from the `sm` breakpoint up ([S22]).
- **Type:**
  - The fonts were identified from the font files ([S23]):
    - **Inter Variable 4.001**, aliased as "Sans", with OpenType features `cv01` and `ss03` and `opsz auto` optical sizing.
    - The Klim serifs Heldane Text and Tiempos Text.
    - Berkeley Mono.
  - Base size 16 px / 1.5; weights 400 and 500 ([S22], [S23]).
- **Color:** a 12-step warm "sand" gray scale.
  - Light: background `#fdfdfc`, text `#21201c`, secondary `#63635e`, border `#e9e9e7`, hover background `#f5f4f4`.
  - Dark: background `#111110`, text `#eeeeec`, secondary `#b5b3ad`.
  - Link underlines are 0.08em thick in `#bcbbb5` ([S23]).
- **Interactions:**
  - Rows are links with `-mx-3 px-3 rounded-md`, so the hover background extends past the text edge without moving the text.
  - An animated announcement bar.
  - Tailwind's `motion-reduce` utilities are present ([S22], [S23]).
- **Experience/projects:** "Today" is two sentences (Linear; previously Vercel). Projects are rows of a title plus a one-line description ([S22]).
- **Contact:** a closing sentence linking Twitter and GitHub, plus a rounded newsletter form ([S22]).
- **Polished (Judgment):** extreme restraint plus fine typographic detail (optical sizing, alternate letterforms). The cost is ≈600 KB of preloaded fonts across six files (measured, [S22]).

#### 2.10 Delba de Oliveira: delba.dev ([S24], [S25])

- **Layout:** `max-w-5xl` with 144 px top padding and a `md:grid-cols-[2fr_1fr]` grid ([S24]).
  - **Left column:**
    - "Portfolio" heading.
    - An availability line: "I'm looking for my next role in developer education or technical video production".
    - A **Let's talk** button that goes to LinkedIn.
    - *Work*: each item is a bold linked product name plus a one-line contribution.
    - *Personal*.
  - **Right column:** *About me* with a small round photo floated at `3lh`, then "LinkedIn · YouTube · GitHub · X".
- **Type:** the body font is **Fraunces** (variable); `.font-sans` is remapped to it. Tailwind Typography with the `prose-stone` palette ([S25]).
- **Color (light only):** background `#fafaf9`, body `#44403b`, headings and links `#1c1917`, intro text `#79716b`, button `#292524` ([S25]).
- **Polished vs generic:**
  - *Strong:* the clearest "hire me" CV page in this set. The availability line and one button sit above the fold, and contributions are short bullets.
  - *Costs:*
    - Nine font files are preloaded, ≈328 KB. The homepage uses only two of them: Fraunces for text and Geist Mono for its one inline `<code>`. Geist Sans, Radley and five Geist Pixel faces, ≈221 KB together, are referenced by neither the CSS nor the markup (measured, [S24], [S25]).
    - The `#a6a09b` side notes are 2.48:1 ([S33]).

### Templates and résumé-as-a-website

#### 2.11 RyanFitzgerald/devportfolio: the most-starred Astro portfolio found (4,974★) ([S26])

- **Stack:** Astro, Tailwind CSS v4 and TypeScript. One `src/config.ts` file drives all content; removing a section from it hides that section ([S26]).
- **Layout:** in order:
  1. Fixed top nav.
  2. Full-screen hero: "Hello! 👋 / I'm {name}" at up to 96 px, a radial blue gradient, social icons pinned to the bottom.
  3. About: split 4/8. A 72 px heading with a 75×5 px accent bar; bio and skill tags.
  4. Projects, Experience, Education.
  5. Footer ([S26]).
- **Type:** IBM Plex Mono on `body`. The Google Fonts request asks for 14 styles ([S26]).
- **Color:** light only. White background, gray-600/800/900 text, accent `#1d4ed8` ([S26]).
- **Interactions:** a CSS fade-in (20 px, 0.8 s, 200/400/600 ms delays) with no reduced-motion guard. Project cards lift by 4 px and gain `shadow-xl` on hover ([S26]).
- **Experience:** a timeline with accent dots and connecting lines. Each card has the role, the company in the accent color, the date on the right, and bullets ([S26]).
- **Projects:** numbered cards ("01") with a description, dark tag chips and a round ↗ button ([S26]).
- **Take (Judgment):** the content model is good, but it has the most "template" look of the set: giant hero, emoji, accent bars, timeline dots.

#### 2.12 midudev/minimalist-portfolio-json: an Astro one-page CV (946★) ([S27])

- **Layout:**
  - A single 700 px column ([S27]).
  - The header row has the name (2rem), the job title (1.1rem, `#444`), the location and contact icons (email, phone, LinkedIn, X, GitHub). A 128 px photo with 16 px rounded corners sits on the right.
  - Section order: About → Experience → Education → Projects → Skills.
- **Type:** no web fonts at all.
  - Body uses the system monospace stack (Menlo/Monaco); headings use system-ui; letter-spacing −0.025rem.
  - Paragraphs 0.9rem / 1.5 in `#666`; section headings 1.5rem, weight 700 ([S27]).
- **Data:** a single `cv.json` in the [JSON Resume](https://jsonresume.org/schema/) schema ([S27]).
- **Interactions:**
  - A ⌘K command menu.
  - Tooltips on dates.
  - A print stylesheet that hides the icon links, shows a plain-text contact line and keeps each entry together (`article{break-inside:avoid}`) ([S27]).
- **Take (Judgment):** a very small, print-first site. Great bones; it needs more visual character.

#### 2.13 BartoszJarocki/cv: the reference résumé-as-a-website (9,674★) ([S28])

- **Stack:** Next.js 16 and shadcn/ui. All content lives in one `src/data/resume-data.ts`. The site ships schema.org `ProfilePage`/`Person` structured data (JSON-LD) ([S28]).
- **Layout:**
  - A `max-w-2xl` (672 px) column ([S28]).
  - The header has:
    - The name (30 px bold, tight).
    - A one-line summary in monospace.
    - The location with timezone ("Wrocław, Poland, CET").
    - 32 px square icon buttons for contact links.
    - A 112 px avatar with rounded corners.
  - Section order: About → Work Experience → Education → Skills → Side projects.
  - A fixed hint at the bottom: "Press Ctrl+J to open the command menu".
- **Type:** Geist for body text, Geist Mono for metadata, tags and descriptions. Dates use tabular figures ([S28]).
- **Color:** shadcn's default gray theme.
  - Light: background `#fff`, text ≈`#030712`, muted ≈`#6b7280`, secondary ≈`#f3f4f6`, border ≈`#e5e7eb`.
  - Dark: background ≈`#030712`, text ≈`#f9fafb`, secondary ≈`#1f2937` ([S28]).
  - The dark colors are defined in the CSS, but no script or media query applies them, so the site renders light (**Unverified**).
- **Experience:** the company link with small monospace tech tags beside it (hidden on mobile), the date range on the right, then the role and a description ([S28]).
- **Projects:** a one- to three-column grid of bordered cards. A green dot marks active projects. Cards lift 2 px on hover (not in print) ([S28]).
- **Print:** 12 px type, a three-column project grid, icon buttons swapped for plain-text contact details, and animations turned off ([S28]).
- **Caveat:** the real content arrives inside `<div hidden id="S:0">`. A loading skeleton is shown until an inline `$RC()` script swaps it in, so visitors without JS see only the skeleton ([S28]).

#### 2.14 jsonresume-theme-even: a JSON Resume theme (≈2.8k npm downloads per month) ([S29])

- **Layout:** a CSS grid with named lines: a `minmax(min-content,12em)` column for section headings next to a `minmax(min-content,36em)` content column. On wide screens and in print the headings are right-aligned in that column. It uses `section{display:contents}` to put each section on the grid, and shows several roles at one company as a timeline ([S29]).
- **Type:** Lato 400/700 from Google Fonts. The type scale uses a 1.25 ratio ([S29]).
- **Color:** follows the OS setting; colors can be overridden with `themeOptions` ([S29]).
  - Light: background `#ffffff`, text `#191e23`, secondary `#6c7781`, tint `#f3f4f5`, accent `#0073aa`.
  - Dark: background `#191e23`, text `#fbfbfc`, secondary `#ccd0d4`, accent `#00a0d2`.
- **Take:** the classic résumé layout, with headings in a narrow left column, works on the web and in print from one JSON file.

---

## 3. Synthesis

### A) Patterns the best examples share

1. **One narrow reading column.**
   - Widths: Lee 600 px, paco 640 px, Emil ≈644 px, Rauch 672 px, cv.jarocki.me 672 px, midudev 700 px, Cassidy 70ch, Anthony Fu 65ch ([S6], [S11], [S22], [S7], [S28], [S27], [S18], [S21]).
   - Even Brittany Chiang's split keeps the reading column to 52% of 1280 px ([S1]).
2. **Hierarchy from tone, not size.**
   - Body text is 16–17 px. Names are modest, 30–48 px: cv.jarocki.me 30, midudev 32, Lee ≈35–42, Chiang 36–48 ([S28], [S27], [S6], [S1]).
   - Each site uses two or three text tones: Chiang slate-200/400/500, Emil 1200/1100, Anthony Fu `#000/#222/#555` ([S1], [S23], [S21]).
3. **Neutral first, one accent at most.**
   - Rauch, paco, Emil, Lee and Cassidy are practically all neutral. Chiang keeps teal for tags and hover states ([S8], [S11], [S23], [S6], [S18], [S1]).
   - Warm neutrals and 12-step gray scales are common (Radix-style at paco, Rauno and Emil).
4. **A fixed metadata column with tabular figures.** Dates or years sit left in muted small text:
   - Chiang: two of eight columns.
   - Rauch: a 40–56 px year column.
   - midudev: a `min-width:102px` time element.
   - jsonresume-theme-even: a 12em heading column.
   - cv.jarocki.me: `tabular-nums` ([S1], [S7], [S27], [S29], [S28]).
5. **Rows, not boxes.** Surfaces appear only on hover, and they extend past the text edge so text never moves: Chiang `-inset-x-6`, Emil `-mx-3 px-3`, Rauch's rounded highlight, Anthony Fu `#88888811` ([S1], [S22], [S7], [S21]).
6. **Dimming the rows you are not hovering** focuses attention without adding decoration: Chiang to 0.5, Lee to 0.8 ([S1], [S6]). Lee's gentler 0.8 keeps his body text at 7.7:1. Chiang's 0.5 drops body text to 2.69:1.
7. **Motion is small, staggered and switchable.**
   - Typical entrances: paco 0.6 s with 120 ms stagger, Anthony Fu 1 s with 90 ms stagger, cv.jarocki.me 0.4 s with 150 ms steps. They move only 4–20 px ([S11], [S21], [S28], [S26]).
   - Personal sites wrap motion in `prefers-reduced-motion`: paco, Anthony Fu, Chiang, Lee, and Josh with 27 references ([S11], [S21], [S2], [S6], [S16]). Templates often don't: devportfolio, cv.jarocki.me ([S26], [S28]).
8. **Typographic finish:**
   - `text-wrap: balance`/`pretty` (Lee, midudev, cv.jarocki.me).
   - Tabular figures (paco, cv.jarocki.me).
   - OpenType features: Emil `cv01`/`ss03`, paco `ss02`/`frac`.
   - A text-selection color that matches the theme (Chiang, Cassidy, Rauch).
   - A `theme-color` per color scheme (paco, cv.jarocki.me) ([S6], [S27], [S28], [S11], [S23], [S1], [S18], [S8], [S10]).
9. **Small, static and fast** (Judgment, with evidence):
   - Tiny CSS: Cassidy 6 KB, midudev 11.6 KB, Rauch 22 KB ([S18], [S27], [S8]).
   - Few font bytes: Rauch ≈60 KB, Lee ~0 (`local()`), midudev 0 ([S7], [S6], [S27]).
   - Counter-examples: Chiang ≈1.18 MB, Emil ≈600 KB, Delba ≈328 KB preloaded ([S1], [S22], [S24]).
10. **One personal detail, not ten.** Examples:
    - Chiang: Korok letters, Tardis.
    - Lee: logo cursors, bio toggle.
    - paco: CSS-drawn email.
    - Rauno: copy-email button.
    - Anthony Fu: logo chips, generative art ([S1], [S5], [S11], [S13], [S20]).
11. **Low-friction contact.**
    - Links go to email or social profiles, placed in the header or sidebar or in a closing sentence. No personal site uses a contact form; Emil and Josh have newsletter forms only ([S1], [S10], [S22], [S15]).
    - Résumé sites add a PDF link or a print stylesheet (Chiang `/resume.pdf`, cv.jarocki.me, midudev) ([S1], [S28], [S27]).
12. **Light/dark follows the OS by default:** Rauch, Cassidy, paco, jsonresume-theme-even ([S8], [S18], [S11], [S29]). Sites that switch themes with JS apply the theme before the page paints, so the wrong one never flashes: Josh with an inline script, Lee with next-themes. Anthony Fu animates the switch with View Transitions ([S15], [S5], [S21]).

### B) Three design directions

The choices below are **Judgment**; every hex value was contrast-checked with the WCAG formula ([S33]). All fonts were confirmed on both the Google Fonts CSS2 API ([S31]) and Fontsource ([S32]). Font file sizes are for Fontsource's Latin-subset variable WOFF2 files ([S32]).

| | **Night Shift** | **Paper Trail** | **Changelog** |
|---|---|---|---|
| Feel | Dark, focused, a bit cinematic | Warm, editorial, human | Precise, dense, engineer-y |
| Layout | Split, sticky left sidebar | One 640 px column | One 720 px column + date column |
| Default theme | Dark (light optional) | Light (dark optional) | Follows OS, both designed |
| Fonts | Inter | Newsreader + Inter | Geist Mono + Geist |
| Motion | Spotlight + hover dimming | Staggered fade-up | Almost none; ⌘K + print |
| Best if you… | Have 3–6 roles and want to keep the nav always visible | Want your writing and story to carry it | Want recruiters to scan it and print it |

#### B1. Night Shift: dark split layout with a sticky sidebar

*A dark, two-column CV. Your identity and nav stay pinned on the left while experience and projects scroll on the right, with a faint accent spotlight following the cursor.*

- **Draws from:** brittanychiang.com v5 for the layout and interactions ([S1], [S3]), and bchiang7/v4 for keyboard-friendly focus details ([S4]).
- **Content mapping:**
  - **Sidebar:** name, role, one-line pitch, scroll-spy nav (About · Experience · Projects · Contact), then GitHub/LinkedIn/email icons (at least 24×24 px targets) and a "Résumé (PDF)" link.
  - **Right column:** About (2–3 short paragraphs) → Experience rows → Projects rows with thumbnails → Contact sentence.
- **Fonts:** **Inter** variable, weights 400/500/600/700, with `font-variant-numeric: tabular-nums` on dates. One file, ≈48 KB for Latin ([S32]).

| Token | Dark (default) | Light |
|---|---|---|
| `--bg` | `#0b0f14` | `#f7f9fb` |
| `--surface` (hover card, sticky bars) | `#131922` | `#ffffff` |
| `--text` (headings, titles) | `#e7ecf2` | `#0b1220` |
| `--muted` (body copy, dates) | `#93a1b0` | `#526071` |
| `--border` | `#1f2a36` | `#dfe5ec` |
| `--accent` (links, tags, focus ring) | `#6ee7b7` | `#047857` |
| `--accent-soft` (tag background) | `rgb(110 231 183 / .10)` | `rgb(4 120 87 / .08)` |
| Spotlight | `rgb(110 231 183 / .06)` | off, or `rgb(4 120 87 / .04)` |

Contrast in dark mode: text 16.2:1, muted 7.3:1, accent 12.6:1, tag text 10.4:1. In light mode: 17.7, 6.1, 5.2 and 4.7:1. Unlike Chiang, dates use `--muted` rather than a dimmer third tone, which keeps them above 4.5:1.

| Role | Size / line height | Weight | Letter-spacing |
|---|---|---|---|
| Name (h1) | 48/52 px (mobile 36/40) | 700 | −0.025em |
| Role | 20/28 px (mobile 18/28) | 500 | −0.01em |
| Nav + section labels | 12/16 px, uppercase | 700 | 0.1em |
| Entry title ("Role · Company ↗") | 16/20 px | 500 | 0 |
| Body | 16/26 px (1.625) | 400 | 0 |
| Descriptions | 14/21 px | 400 | 0 |
| Dates / metadata | 12/16 px, uppercase, tabular figures | 600 | 0.05em |
| Tags | 12/20 px | 500 | 0 |

- **Spacing:**
  - 4 px base, using the steps 4 · 8 · 12 · 16 · 24 · 32 · 48 · 64 · 96 · 144.
  - Page max width 1280 px; gutters 24 px (mobile) / 48 px (≥768 px).
  - Columns 48% / 52% from 1024 px, with the sidebar `position: sticky; height: 100vh; padding-block: 96px`.
  - Sections 64 / 96 / 144 px apart (mobile / tablet / desktop); entries 48 px apart.
  - Each entry is an 8-column grid: date in two columns, content in six.
- **Signature interactions:**
  1. **Cursor spotlight:** a fixed, `pointer-events:none` radial gradient driven by CSS variables. Only enable it for `(hover:hover) and (pointer:fine)`, at widths ≥1024 px, and without reduced motion.
  2. **Scroll-spy:** an IntersectionObserver with `rootMargin: 0 0 -70% 0`. The indicator line grows from 32 to 64 px and turns `--text`.
  3. **Dim the other rows on pointer hover.** Dim by *color*: fade the siblings' titles from `--text` to `--muted`, which keeps them at 7.3:1 (dark) or 6.1:1 (light). If you use opacity instead, stay at ≥0.75 in dark mode and ≥0.9 in light mode to keep muted text at 4.5:1 or better. The whole card is clickable, and the ↗ arrow nudges on hover and `:focus-visible`.
- **Mobile:** the sidebar collapses into a top header. Section labels become sticky translucent bars. Set `scroll-padding-top` so these bars never cover the focused item ([S36]).
- **Avoid (Judgment):** this is the most-cloned developer layout. Keep your own accent color and content order, and skip the Tardis.

```css
:root{--bg:#0b0f14;--surface:#131922;--text:#e7ecf2;--muted:#93a1b0;--border:#1f2a36;--accent:#6ee7b7}
.spotlight{position:fixed;inset:0;pointer-events:none;z-index:0;
  background:radial-gradient(600px circle at var(--x,50%) var(--y,-10%),rgb(110 231 183/.06),transparent 80%)}
@media (hover:none),(pointer:coarse),(prefers-reduced-motion:reduce),(max-width:1023px){.spotlight{display:none}}
```

#### B2. Paper Trail: warm, editorial single column

*A one-page CV that reads like a well-set letter: a serif name and intro on warm paper, experience and projects as quiet ruled rows, and a closing "Reach me at…" sentence.*

- **Draws from:**
  - leerob.com: serif body, warm neutrals, hairline-ruled rows, row dimming, the Default/Long bio toggle ([S5], [S6]).
  - paco.me: a 640 px column, staggered entrance, a Connect section ([S10], [S11]).
  - Rauch: showing the year once per group ([S7]).
  - Emil: warm "sand" grays and a hover background on rows ([S23]).
- **Content mapping:**
  - Name, one-sentence role, 2–3 sentence intro, with a Short/Long toggle.
  - **Experience:** ruled rows laid out as `year | Role, Company | location/stack`. Earlier roles fold in underneath.
  - **Projects:** rows with a title and a one-line description, then ↗ link and GitHub stars in tabular figures.
  - **Contact:** a sentence with email plus LinkedIn and GitHub links, and a copy-email button.
- **Fonts:**
  - **Newsreader** (variable, optical size 6–72, weights 400–600, plus italic 400) for the name, headings and body. ≈58 KB for the Latin weight axis ([S32]).
  - **Inter** 400/500 for UI and metadata, ≈48 KB. Or use the system UI stack for zero bytes, as Lee does ([S6]).

| Token | Light (default) | Dark |
|---|---|---|
| `--bg` | `#faf9f6` | `#1a1917` |
| `--surface` (row hover, code) | `#f2f0eb` | `#23221f` |
| `--text` | `#22211e` | `#ecebe6` |
| `--muted` (dates, metadata) | `#6a665e` | `#a9a59c` |
| `--border` (hairlines; or `color-mix(in srgb, var(--text) 10%, transparent)`) | `#e3e0d8` | `#34322e` |
| `--accent` (link hover, focus ring, one highlight) | `#9a3412` | `#f0a07a` |

Contrast in light mode: text 15.3:1, muted 5.4:1 (5.0 on `--surface`), accent 6.9:1. In dark mode: 14.7, 7.2 and 8.4:1. Links are `--text` with an underline at 30% opacity (Lee's technique, [S6]) and turn `--accent` on hover.

| Role | Size / line height | Font / weight | Letter-spacing |
|---|---|---|---|
| Name | `clamp(2.25rem, 1.6rem + 2.2vw, 2.75rem)` / 1.15 | Newsreader 600, `text-wrap: balance` | −0.02em |
| Intro | 20/32 px | Newsreader 400 | −0.005em |
| Section heading | 23/32 px | Newsreader 600 | −0.015em |
| Body | 17/27 px (1.6) | Newsreader 400 | 0 |
| Row title | 17/24 px | Newsreader 500 | 0 |
| Metadata (dates, company, stack) | 13/20 px, tabular figures | Inter 400/500 | +0.01em |

- **Spacing:**
  - An 8 px rhythm, using the steps 4 · 8 · 12 · 16 · 24 · 32 · 48 · 64 · 96 · 128.
  - Column 640 px with 24 px side padding.
  - Top of page 64 px on mobile, 128 px on desktop (paco uses 128, [S11]).
  - Sections 64 px apart on mobile, 96–128 px on desktop (Emil uses 64/128, [S22]).
  - Rows have 12 px vertical padding and a 1 px hairline; paragraphs are 24 px apart.
- **Signature interactions:**
  1. **Staggered entrance:** each top-level block fades up 8 px over 600 ms, 90–120 ms after the previous one. Only under `prefers-reduced-motion: no-preference` ([S11], [S21], [S41]).
  2. **Row hover:** a `--surface` background that extends past the text edge, while the other rows dim. Dim them by switching their text to `--muted`. Lee's opacity 0.8 would take this palette's muted text to 3.6:1 ([S6]).
  3. **Short/Long bio toggle:** built from `aria-pressed` buttons ([S5], [S6]).
- **Avoid (Judgment):**
  - Justified text.
  - More than two families.
  - Setting metadata in the serif; keep dates and stack in the sans so they scan quickly.

```css
@media (prefers-reduced-motion:no-preference){
  [data-enter]{animation:enter .6s cubic-bezier(.2,.7,.2,1) both;animation-delay:calc(var(--i,0)*100ms)}
}
@keyframes enter{from{opacity:0;translate:0 8px}}
```

#### B3. Changelog: a monospace-led résumé that prints cleanly

*The CV as a release log. Each role is an entry with a monospace date range, role, and 2–3 impact bullets with tech tags. It is keyboard-first (⌘K) and prints to a clean one- or two-page PDF.*

- **Draws from:** cv.jarocki.me for the print layout, Ctrl+J menu, tech tags and JSON-LD ([S28]), and midudev's template for JSON Resume data, ⌘K, and print-only contact text ([S27]). The monospace voice comes from Cassidy's site and Rauch's footer ([S18], [S7]).
- **Content mapping:**
  - **Header:** name, a one-line headline, location · timezone · availability, and text-link contacts (`email ⧉`, GitHub, LinkedIn) rather than icons, so they print.
  - **Experience:** `2023 — now` in the date column, then **Role**, Company. Below that, bullets and tags.
  - **Projects:** a compact two-column grid of bordered cards with a status dot, one line, stars and tags.
  - **Footer:** "Last updated", the source link and "Download PDF".
- **Fonts:**
  - **Geist Mono** 400/500/600 for the name, section labels, dates, tags, nav and key hints.
  - **Geist** 400/500/600 for body text.
  - Both variable: ≈23 KB and ≈29 KB for Latin ([S32]).

| Token | Light | Dark |
|---|---|---|
| `--bg` | `#ffffff` | `#0a0a0a` |
| `--surface` (cards, tags, key hints) | `#f5f5f5` | `#141414` |
| `--text` | `#111111` | `#ededed` |
| `--muted` (dates, tags, descriptions) | `#5f5f5f` | `#a0a0a0` |
| `--border` | `#e5e5e5` | `#262626` |
| `--accent` (status dot, link hover, focus ring) | `#15803d` | `#4ade80` |

Contrast in light mode: text 18.9:1, muted 6.4:1 (5.9 on `--surface`), accent 5.0:1. In dark mode: 16.9, 7.6 and 11.4:1.

| Role | Size / line height | Font / weight | Letter-spacing |
|---|---|---|---|
| Name | 28/34 px | Geist Mono 600 | −0.02em |
| Headline | 15/24 px | Geist Mono 400, muted | 0 |
| Section label (prefixed with `##`) | 13/20 px, uppercase | Geist Mono 500 | +0.06em |
| Entry title | 16/24 px | Geist 600 | −0.005em |
| Body / bullets | 15/24 px | Geist 400 | 0 |
| Dates | 13/20 px, tabular figures | Geist Mono 400, muted | 0 |
| Tags / key hints | 12/18 px | Geist Mono 500 | 0 |
| Print | body 10.5 pt, metadata 9 pt | same | same |

- **Spacing:**
  - 4 px base, using the steps 4 · 8 · 12 · 16 · 24 · 32 · 48.
  - Max width 720 px. The date column is 120 px (7.5rem) with a 24 px gap; on mobile it moves above the title.
  - Entries 28–32 px apart; sections 48 px apart.
- **Signature interactions:**
  1. **⌘K / Ctrl+K menu:** jump to a section, copy email, open GitHub/LinkedIn, download the PDF, toggle the theme. Use a native `<dialog>` with a listbox, and show the shortcut as a visible hint ([S28], [S27]).
  2. **Print stylesheet:** hide the nav and menu, swap icon links for plain-text contact details, keep each entry on one page with `break-inside: avoid`, and turn off animation ([S28], [S27]).
  3. **Copy email:** a button with an `aria-live="polite"` "Copied" confirmation ([S13]).
  - Motion: none beyond 120–150 ms color transitions.
- **Avoid (Judgment):**
  - Monospace for long paragraphs; keep body text in Geist.
  - Terminal clichés such as blinking cursors and green-on-black everything.

```css
@media print{
  nav,.cmdk,.theme-toggle{display:none}
  body{font-size:10.5pt;color:#000;background:#fff}
  article{break-inside:avoid}
  .print-only{display:block}
}
```

### C) Pitfalls to avoid

| Don't | Evidence | Do instead |
|---|---|---|
| **Put content behind JS or animation** | The body is wrapped in `style="opacity:0"` until JS hydrates on brittanychiang.com ([S1]). Rauno starts frames at `opacity:0; scale(0)` ([S13]). cv.jarocki.me shows a skeleton until an inline script swaps in content held in a hidden div ([S28]). | Render the final content in HTML. Use CSS-only entrances whose starting state applies only under `prefers-reduced-motion: no-preference`. |
| **Animate a lot, or ignore reduced motion** | devportfolio and cv.jarocki.me fade-ins have no reduced-motion rule ([S26], [S28]). | Use one entrance per page, 8–10 px, ≤600 ms. Gate it with `prefers-reduced-motion` ([S41], [S37]). No scroll-jacking and no horizontal canvases for a CV. |
| **Faint gray for "tertiary" text** | Chiang's dates are 3.75:1 ([S1]). Rauch's dark-mode metadata is 3.59:1 ([S8]). Anthony Fu's 50%-opacity descriptions are 2.32:1 ([S21]). Delba's `#a6a09b` notes are 2.48:1 ([S25]). | Body and metadata text at ≥4.5:1, large text at ≥3:1 ([S33]). Use two text tones, not three. |
| **Dimming rows too far** | Chiang's `opacity-50` drops body text to 2.69:1 ([S1]). | Dim by color (text → muted), or keep opacity ≥0.75 on dark and ≥0.9 on light backgrounds. Lee uses 0.8 with near-black text ([S6]). Pointer hover only; never dim the focused item. |
| **Skill-percentage bars, star ratings, "90% JavaScript"** | None of the surveyed personal sites use them. The strong examples attach skills to jobs and projects as tags ([S1], [S28]). | Tags under each role or project, or a plain grouped skills list. |
| **Walls of text** | Strong sites keep intros to 2–3 paragraphs (Chiang, Cassidy) or two sentences (Emil). Lee offers a Default/Long toggle ([S1], [S17], [S22], [S5]). | 2–3 impact bullets per role, one-line project descriptions, optional "long bio". |
| **Heavy full-screen hero** | devportfolio uses an `md:h-screen` hero with a name up to 96 px, which pushes experience below the fold ([S26]). Lee's image appears only at ≥1100 px, beside the text ([S6]). | Name + role + pitch in the first 300 px. The first job visible on a laptop without scrolling. |
| **Font bloat** | Chiang preloads nine static, unsubsetted Inter files, ≈1.18 MB ([S1]). Delba preloads nine files, ≈328 KB, mostly unused on the page ([S24]). Emil preloads ≈600 KB ([S22]). | One variable file per family, Latin subset, `font-display: swap`. Preload at most two files. Inter variable Latin is 48 KB ([S32]). |
| **Generic template look** | Emoji "Hello! 👋", a gradient blob, 72 px headings with accent bars, timeline dots ([S26]). The navy/mint numbered-heading look of v4 has 4,210 forks ([S4]). | Neutral palette + one accent, your own content order, one personal detail. |
| **Icon-only contact that doesn't print or copy** | Icon rows without text (devportfolio hero, [S26]). paco's CSS-drawn email can't be selected ([S11]). | Visible text links or a copy button ([S13]), plus print-only text ([S28]). |
| **Flash of the wrong theme** | Josh and Lee both avoid it with a pre-paint script or next-themes ([S15], [S5]). | Default to `prefers-color-scheme`. If you add a toggle, save the choice and apply it before the page paints. |

#### Accessibility checklist (WCAG 2.2 AA)

- **Contrast:**
  - Text ≥4.5:1 and large text ≥3:1 ([S33]).
  - Focus rings, tag borders and icon buttons ≥3:1 ([S34]).
  - Check dimmed and hover states too, not just the resting state.
- **Reduced motion:** gate every entrance, spotlight, reveal and animated theme transition behind `prefers-reduced-motion` ([S41], [S37]). The good examples are paco, Anthony Fu, Chiang's `motion-reduce:` utilities and Lee's global override ([S11], [S21], [S2], [S6]).
- **Keyboard focus:**
  - Show a visible `:focus-visible` ring, e.g. Lee's `outline: 2px solid; outline-offset: 3px` ([S6], [S35]).
  - Every hover effect needs a focus equivalent. Chiang uses `group-focus-visible` on the nav line and the arrow ([S1]).
  - Sticky headers must not cover focused items; use `scroll-padding-top` ([S36]).
- **Semantic landmarks:**
  - One `<h1>`; `<header>`, `<nav aria-label>`, `<main>`, `<footer>`; one `<section>` per block, each with a heading or `aria-label` ([S40]).
  - Chiang labels sections ("Work experience", "Selected projects") and keeps headings for screen readers on desktop with `sr-only` ([S1]).
- **Skip link:** "Skip to content" as the first focusable element, visible on focus ([S1], [S38]).
- **Links and targets:**
  - Icon links need names ("GitHub (opens in a new tab)", [S1]).
  - Targets at least 24×24 CSS px ([S39]).
  - The active nav item must not rely on color alone; Chiang also changes the line length ([S1], [S43]).
- **Content and SEO:**
  - `lang`, alt text on the photo, and `<time datetime>` on dates (midudev, [S27]).
  - JSON-LD `Person` markup (cv.jarocki.me, [S28]).
  - A print stylesheet.

---

## Open questions / not verified

- The light-mode gray steps on paco.me: only the dark scale appears in the shipped CSS ([S11]).
- Whether rauno.me's JS-driven animations honor `prefers-reduced-motion`. There is no CSS rule for it ([S14]).
- The body size on joshwcomeau.com: the CSS uses Linaria hashed classes, so it was not extracted.
- Commercial fonts cannot be used without a license: Söhne, Calibre, PP Neue Montreal, Wotfard, Cartograph CF, Heldane, Tiempos, Berkeley Mono. The three directions use only Google Fonts / Fontsource families ([S31], [S32]).
- Hashed build asset URLs (`/_next/static/...`, `/_astro/...`) change on redeploy; they are cited as fetched on 2026-09-26.

---

## Sources

**Personal sites (live HTML, production CSS/JS, font files)**
- **S1**: Brittany Chiang, live site: https://brittanychiang.com/ (preloaded fonts under `/_next/static/media/*.woff2`)
- **S2**: Brittany Chiang, production CSS: https://brittanychiang.com/_next/static/css/1205f04d95fac248.css
- **S3**: Brittany Chiang, page JS (scroll-spy + spotlight): https://brittanychiang.com/_next/static/chunks/pages/index-6ba611d8c7cb61c9.js
- **S4**: bchiang7/v4 source: https://github.com/bchiang7/v4 (files: `src/styles/variables.js`, `src/styles/GlobalStyle.js`, `src/styles/fonts.js`, `src/config.js`, `src/components/sections/{hero,about,jobs,featured,projects,contact}.js`, `src/components/{footer,side,email}.js`)
- **S5**: Lee Robinson, live site: https://leerob.com/
- **S6**: Lee Robinson, production CSS: https://leerob.com/_next/static/chunks/38df25e856253ffd.css
- **S7**: Guillermo Rauch, live site: https://rauchg.com/
- **S8**: Guillermo Rauch, production CSS: https://rauchg.com/_next/static/chunks/dd7b830295a7d76f.css
- **S9**: rauchg/blog source: https://github.com/rauchg/blog
- **S10**: Paco Coursey, live site: https://paco.me/
- **S11**: Paco Coursey, production CSS: https://paco.me/_next/static/chunks/6f8cd1f2e1c78e16.css, https://paco.me/_next/static/chunks/043ac70fdbeb5d40.css, https://paco.me/_next/static/chunks/1902af4af6f089fe.css
- **S12**: Paco Coursey, font files: https://paco.me/fonts/sohne-subset-0.woff2, https://paco.me/fonts/inter-subset.woff2, https://paco.me/fonts/newsreader-subset-0.woff2
- **S13**: Rauno Freiberg, live site (with inline style tokens): https://rauno.me/
- **S14**: Rauno Freiberg, CSS + font: https://rauno.me/_next/static/css/e621362aa87785a2.css, https://rauno.me/dd.woff2
- **S15**: Josh W. Comeau, live site (with inline color-mode script): https://www.joshwcomeau.com/
- **S16**: Josh W. Comeau, production CSS: https://www.joshwcomeau.com/_next/static/css/5f479326fc7a6aa8.css (+ `8e8c255c1ff7ea73.css`, `7536305590e24225.css`)
- **S17**: Cassidy Williams, live site: https://cassidoo.co/
- **S18**: Cassidy Williams, production CSS: https://cassidoo.co/_astro/global.DhdD4Cab.css
- **S19**: cassidoo/blahg source (linked from the footer): https://github.com/cassidoo/blahg
- **S20**: Anthony Fu, live site + projects page: https://antfu.me/, https://antfu.me/projects
- **S21**: antfu/antfu.me source: https://github.com/antfu/antfu.me (files: `unocss.config.ts`, `src/styles/main.css`, `src/styles/markdown.css`, `src/styles/prose.css`, `src/logics/index.ts`, `src/components/ListProjects.vue`, `src/components/WrapperPost.vue`)
- **S22**: Emil Kowalski, live site (preloaded fonts under `/_next/static/media/*.woff2`): https://emilkowal.ski/
- **S23**: Emil Kowalski, production CSS: https://emilkowal.ski/_next/static/css/d54e455ee7d8468f.css (+ `4691d38b7dfb2187.css`)
- **S24**: Delba de Oliveira, live site (preloaded fonts under `/_next/static/media/*.woff2`): https://delba.dev/
- **S25**: Delba de Oliveira, production CSS: https://delba.dev/_next/static/chunks/65ad40b5b5fdc26c.css

**Templates and résumé sites**
- **S26**: RyanFitzgerald/devportfolio: https://github.com/RyanFitzgerald/devportfolio (README, `src/config.ts`) · demo https://ryanfitzgerald.github.io/devportfolio/ · CSS https://ryanfitzgerald.github.io/devportfolio/_astro/index.DqgN9Q-b.css
- **S27**: midudev/minimalist-portfolio-json: https://github.com/midudev/minimalist-portfolio-json (README, `cv.json`) · demo https://print-portfolio.vercel.app/ · CSS https://print-portfolio.vercel.app/_astro/index.qtalihPf.css
- **S28**: BartoszJarocki/cv: https://github.com/BartoszJarocki/cv (README) · live https://cv.jarocki.me/ · CSS https://cv.jarocki.me/_next/static/chunks/ad2b297c68b6c915.css
- **S29**: jsonresume-theme-even: https://github.com/rbardini/jsonresume-theme-even · demo https://jsonresume-theme-even.rbrd.in/ · package https://cdn.jsdelivr.net/npm/jsonresume-theme-even@0.26.1/dist/index.js · downloads https://api.npmjs.org/downloads/point/last-month/jsonresume-theme-even

**Discovery and tooling checks**
- **S30**: GitHub REST API, repo metadata (stars/forks) and repository search (discovery only): https://api.github.com/repos/bchiang7/v4, https://api.github.com/search/repositories?q=astro+cv+in:name,description&sort=stars (plus similar queries for "astro portfolio theme", "astro resume", `topic:astro-theme portfolio`)
- **S31**: Google Fonts CSS2 API (availability of Inter, Newsreader, Geist, Geist Mono, JetBrains Mono, IBM Plex Sans/Mono, Fraunces, Source Serif 4, Instrument Serif): https://fonts.googleapis.com/css2?family=Inter:opsz,wght@14..32,400..700
- **S32**: Fontsource API + Latin variable file sizes: https://api.fontsource.org/v1/fonts/inter, https://cdn.jsdelivr.net/fontsource/fonts/inter:vf@latest/latin-wght-normal.woff2 (same pattern for `newsreader`, `geist`, `geist-mono`, `jetbrains-mono`)

**Accessibility references**
- **S33**: WCAG 2.2 SC 1.4.3 Contrast (Minimum): https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html
- **S34**: WCAG 2.2 SC 1.4.11 Non-text Contrast: https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html
- **S35**: WCAG 2.2 SC 2.4.7 Focus Visible: https://www.w3.org/WAI/WCAG22/Understanding/focus-visible.html
- **S36**: WCAG 2.2 SC 2.4.11 Focus Not Obscured (Minimum): https://www.w3.org/WAI/WCAG22/Understanding/focus-not-obscured-minimum.html
- **S37**: WCAG 2.2 SC 2.3.3 Animation from Interactions: https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html
- **S38**: WCAG 2.2 SC 2.4.1 Bypass Blocks: https://www.w3.org/WAI/WCAG22/Understanding/bypass-blocks.html
- **S39**: WCAG 2.2 SC 2.5.8 Target Size (Minimum): https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html
- **S40**: WAI-ARIA APG, Landmark Regions: https://www.w3.org/WAI/ARIA/apg/practices/landmark-regions/
- **S41**: MDN, `prefers-reduced-motion`: https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion
- **S42**: MDN, View Transition API: https://developer.mozilla.org/en-US/docs/Web/API/View_Transition_API
- **S43**: WCAG 2.2 SC 1.4.1 Use of Color: https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html

[S1]: https://brittanychiang.com/
[S2]: https://brittanychiang.com/_next/static/css/1205f04d95fac248.css
[S3]: https://brittanychiang.com/_next/static/chunks/pages/index-6ba611d8c7cb61c9.js
[S4]: https://github.com/bchiang7/v4
[S5]: https://leerob.com/
[S6]: https://leerob.com/_next/static/chunks/38df25e856253ffd.css
[S7]: https://rauchg.com/
[S8]: https://rauchg.com/_next/static/chunks/dd7b830295a7d76f.css
[S9]: https://github.com/rauchg/blog
[S10]: https://paco.me/
[S11]: https://paco.me/_next/static/chunks/6f8cd1f2e1c78e16.css
[S12]: https://paco.me/fonts/sohne-subset-0.woff2
[S13]: https://rauno.me/
[S14]: https://rauno.me/_next/static/css/e621362aa87785a2.css
[S15]: https://www.joshwcomeau.com/
[S16]: https://www.joshwcomeau.com/_next/static/css/5f479326fc7a6aa8.css
[S17]: https://cassidoo.co/
[S18]: https://cassidoo.co/_astro/global.DhdD4Cab.css
[S19]: https://github.com/cassidoo/blahg
[S20]: https://antfu.me/
[S21]: https://github.com/antfu/antfu.me
[S22]: https://emilkowal.ski/
[S23]: https://emilkowal.ski/_next/static/css/d54e455ee7d8468f.css
[S24]: https://delba.dev/
[S25]: https://delba.dev/_next/static/chunks/65ad40b5b5fdc26c.css
[S26]: https://github.com/RyanFitzgerald/devportfolio
[S27]: https://github.com/midudev/minimalist-portfolio-json
[S28]: https://github.com/BartoszJarocki/cv
[S29]: https://github.com/rbardini/jsonresume-theme-even
[S30]: https://api.github.com/search/repositories?q=astro+cv+in:name,description&sort=stars
[S31]: https://fonts.googleapis.com/css2?family=Inter:opsz,wght@14..32,400..700
[S32]: https://api.fontsource.org/v1/fonts/inter
[S33]: https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html
[S34]: https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html
[S35]: https://www.w3.org/WAI/WCAG22/Understanding/focus-visible.html
[S36]: https://www.w3.org/WAI/WCAG22/Understanding/focus-not-obscured-minimum.html
[S37]: https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html
[S38]: https://www.w3.org/WAI/WCAG22/Understanding/bypass-blocks.html
[S39]: https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html
[S40]: https://www.w3.org/WAI/ARIA/apg/practices/landmark-regions/
[S41]: https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion
[S42]: https://developer.mozilla.org/en-US/docs/Web/API/View_Transition_API
[S43]: https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html
