# jonasahlers.github.io

My personal CV site: a single page with my experience, projects, skills, education, and contact
details. Built with [Astro](https://astro.build), deployed to GitHub Pages on every push to `main`.

**Live:** https://jonasahlers.github.io

## Edit the content

Everything personal lives in one file: [`src/data/profile.ts`](src/data/profile.ts). Change it,
push, and the site redeploys. The build type-checks the file, so a missing field or a malformed
date (`"2023"` or `"2023-04"`) fails the build and the live site stays on the last good version.

- The site is in Danish (`/`, the default) and English (`/en/`). Text that differs is written as
  `{ da: '…', en: '…' }`; a plain string is used for both languages. Labels around the content
  (section names, buttons) live in [`src/i18n/ui.ts`](src/i18n/ui.ts).
- Leave a list empty (for example `education: []`) to hide that section and its menu item.
- Leave out `end` for your current job; it shows as "Present".
- To show a project screenshot, put the image in `src/assets/`, import it at the top
  (`import shot from '../assets/shot.png'`), and set `image: shot` on the project. Projects
  without one get a generated pattern cover.
- Add a square photo the same way as `avatar` (otherwise your initials are shown), and set or
  remove `availability` to control the status pill next to it.

## Run it locally

Requires Node 22.18 or newer (Node 24 LTS recommended); the tests run TypeScript directly.

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
| `src/layouts/CvPage.astro` | The page: sidebar plus sections, in order (rendered at `/` and `/en/`) |
| `src/components/` | One component per section, plus small building blocks |
| `src/layouts/Base.astro` | `<head>`: SEO tags, fonts, theme bootstrapping |
| `src/lib/` | Date formatting, structured data, icons |
| `src/i18n/` | Languages, interface text, and resolving `{ da, en }` content |
| `.github/workflows/deploy.yml` | Builds and deploys to GitHub Pages |
