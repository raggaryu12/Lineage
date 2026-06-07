# Handoff: Takuma Watanabe — "Living Light" Artist Site

## Overview
A 5-page bilingual (English / Japanese) portfolio site for **渡辺琢真 (Takuma Watanabe)**, a Japanese abstract painter. The aesthetic — codenamed **"Living Light"** — is a near-black, museum-monograph treatment in which the paintings are the only source of color. Pages: **Home, Works, Projects, Concept, About**, plus a shared nav + footer and an EN|JP language toggle whose choice persists across pages.

## About the Design Files
The files in this bundle are **design references created in static HTML/CSS/JS** — prototypes that demonstrate the intended look, layout, motion, and behavior. They are **not** meant to be shipped as-is. The task is to **recreate these designs in the target codebase's environment** (e.g. React/Next.js, Vue/Nuxt, Astro, SwiftUI, etc.), using that project's established routing, component, and styling patterns. If no environment exists yet, choose the most appropriate framework (a static-first framework like **Astro or Next.js** suits this content-driven, image-heavy site well) and implement there.

The shared `assets/site.css` and `assets/site.js` show the single source of truth for tokens, nav, footer, motion, and the language system — port these into your framework's global styles + a small client script (or component equivalents).

## Fidelity
**High-fidelity (hifi).** Final colors, typography, spacing, motion, and copy are all specified. Recreate the UI faithfully. Exact values are in **Design Tokens** below; per-page specifics are in **Screens / Views**.

---

## Global System

### Layout shell
- Every page: fixed top `nav`, a `main`, and a shared `footer.foot`.
- Content max width `--maxw: 1400px`, centered; horizontal padding `--pad: clamp(22px, 5vw, 68px)`.
- Background is a single flat near-black (`#0a0a0a`). No gradients except the soft radial "glow" accents and image scrims described below.

### Navigation (identical on all pages)
- `position: fixed; top:0`, full width, `padding: 22px var(--pad)`, `mix-blend-mode: difference` so the cream text stays legible over any painting beneath it.
- Left: **wordmark** — "Takuma Watanabe" (Archivo Expanded, 13px, `letter-spacing:0.16em`, uppercase) stacked over a small subtitle "渡辺琢真" (10px, `letter-spacing:0.22em`, color `#bdb9b0`).
- Right (`.nav-right`, flex, gap `clamp(16px,2.4vw,34px)`): the nav links, then the language toggle, then a hamburger (mobile only).
- **Nav links**: Home / Works / Projects / Concept / About. 11.5px, `letter-spacing:0.18em`, uppercase, `opacity:.72` (1 on hover/active). Animated 1px underline grows from left on hover; the current page link is always underlined (`aria-current="page"`).
- **Active page** is marked with `aria-current="page"` on its link.
- **Mobile (≤820px)**: nav links collapse into a full-screen overlay (`rgba(8,7,6,.97)`, `backdrop-filter: blur(8px)`) that slides down; hamburger animates into an X. The language toggle stays visible in the bar.

### Language toggle (EN | JP)
- Markup: a `.lang-toggle` group with two `<button data-setlang="en">EN</button>` / `<button data-setlang="jp">JP</button>` separated by a `/` `.sep`.
- Buttons are cream `#fff` text, 11.5px, `letter-spacing:.16em`, `opacity:.42`; active button is `opacity:1` with a 1px underline (`::after`, `transform: scaleX(1)`).
- **Mechanism (see `assets/site.js`)**: clicking sets `document.documentElement.classList.toggle('lang-jp')`, stores `localStorage['tw-lang'] = 'en'|'jp'`, and updates the active button.
- **Dual-render approach (not runtime string swap)**: every translatable string exists twice in the DOM — `<span class="lng-en">…</span><span class="lng-jp">…</span>`. CSS controls visibility:
  ```css
  .lng-jp { display:none; }                 /* default EN */
  html.lang-jp .lng-en { display:none; }
  html.lang-jp .lng-jp { display:revert; }
  ```
  Japanese spans also get `font-family:"Noto Sans JP"; font-feature-settings:"palt" 1`.
- **Flash-free init**: a tiny inline script in each `<head>` runs *before* paint and adds `lang-jp` to `<html>` if the stored pref is `jp`:
  ```html
  <script>try{if((localStorage.getItem('tw-lang')||'en')==='jp')document.documentElement.classList.add('lang-jp');}catch(e){}</script>
  ```
- In a component framework, replace this with: a root `lang` class/attribute driven by a store/cookie (SSR-set to avoid flash), and `<Lang en="…" jp="…" />` helper components (or i18n dictionaries) instead of duplicated spans. The DOM-duplication approach is a static-HTML workaround; an i18n library (e.g. `next-intl`, `vue-i18n`) is the idiomatic port. **All EN + JP copy is in this bundle's HTML** — extract it into your message catalogs.

### Footer (identical structure on all pages)
- `border-top:1px solid var(--line)`, `padding: 9vh var(--pad) 6vh`.
- Top row: 3 columns (`1.5fr 1fr 1fr`): a large display line (`.big`, Archivo Expanded 200, `clamp(28px,4.4vw,58px)`) + a CTA link; an "Index" page-link column; a "Connect" column (Instagram, Email, watanabetakuma.com).
- Base row: `© 2025 Takuma Watanabe` and the tagline; 11px uppercase `letter-spacing:.16em`, color `--ink-faint`, with a hairline top border.
- ≤820px: columns reflow to 2-up, `.big` spans full width.

### Motion
- **Scroll reveals**: elements with `.reveal` start `opacity:0; translateY(28px)` and animate to visible (`transition: 1.2s cubic-bezier(.2,.7,.2,1)`) when scrolled into view. Implemented with IntersectionObserver + a scroll fallback + a 1.6s safety timeout that force-shows everything (so nothing can get stuck hidden). Honors `prefers-reduced-motion`. Switching language also force-reveals so swapped-in text is never stuck at `opacity:0`.
- **Parallax**: any `.bleed[data-parallax="0.12…0.22"]` layer translates vertically on scroll at the given fraction of viewport height (see `initParallax` in `site.js`). Used on every full-bleed painting.
- **Reduced-motion**: reveals appear immediately; parallax can be skipped.

### Full-bleed painting treatment ("plate")
A recurring pattern: a section with a `.bleed` image layer (overscanned `inset:-10% 0` for parallax travel), plus two non-interactive overlays:
- `.vignette` — radial darkening at the edges so the gallery-wall background of the photo melts into the page: `radial-gradient(125% 110% at 50% 44%, transparent 46%, rgba(8,7,6,.62) 82%, rgba(8,7,6,.86) 100%)`.
- `.scrim-b` — bottom-up gradient for caption legibility: `linear-gradient(to top, rgba(8,7,6,.86), rgba(8,7,6,.05) 46%)`.
- `.scrim-full` — top+bottom gradient used on the home hero.
Captions sit at `z-index:4` above the scrims.

---

## Screens / Views

### 1. Home (`index.html`)
- **Hero**: 100vh. Full-bleed `art/hero.webp` with parallax `0.2`, vignette + `.scrim-full`. Bottom-left: H1 name (Archivo Expanded 200, `clamp(46px,9.4vw,150px)`, `line-height:.9`) — EN "Takuma / Watanabe", JP "渡辺 / 琢真". Below: tagline (`.tag`, max 38ch) with the first sentence in `--ink` and the remainder in `--ink-mute`. Vertical "Scroll / スクロール" cue bottom-right with an animated dripping 1px line.
- **Intro**: centered statement on black with a soft golden radial **glow** behind it (`radial-gradient(ellipse 38% 44% at 50% 50%, rgba(201,162,75,0.14), … transparent 66%)`, blurred). Text Archivo Expanded 200, `clamp(26px,4vw,56px)`.
- **Featured plate ×2**: full-bleed `p1.webp` (left-aligned caption) and `archives.webp` (`.right`, right-aligned caption). Each caption = series label (`.pl`, 11.5px `letter-spacing:.24em` `--ink-mute`) + title H2 + dimensions (`.dim`).
- **Bodies of work**: section header ("Four bodies of work" / "作品について" + "View all works →"). A 2-col grid of 4 **series cards** (`a.series`, `aspect-ratio:4/3`): painting image that scales 1.04 on hover, bottom gradient `.ov`, label (series name + 2-digit number), and a diagonal-arrow icon that fades in on hover. Each links to `works.html#<series-slug>`.
- **Concept teaser**: bordered section, centered pull-quote (Archivo Expanded 200, `clamp(24px,3.4vw,46px)`) + "Read the concept" CTA → `concept.html`.
- Series slugs: `color-of-silence`, `day-dream`, `portrait-in-art`, `archives`.

### 2. Works (`works.html`)
- **Page head**: eyebrow "Works · 2018 — 2025", H1 "Works/作品" (`clamp(46px,8vw,120px)`), intro paragraph (max 48ch).
- **Sticky filter bar** (`position:sticky; top:0; z-index:70`, `rgba(10,10,10,.78)` + `blur(10px)`, hairline borders): filter buttons **All / The Color of Silence / DAY DREAM / Portrait in Art / Archives** (each carries `data-f="<slug>"`). Active button = `--ink` color + a bottom 1px bar. Right side: a live **count** (`#count`).
- **Gallery**: a vertical stack of full-bleed **plates** (96vh each), alternating caption side via `.right`. Each `<section class="plate" data-series="<slug>">` carries the series; captions show series label, "Untitled, YYYY" / "無題, YYYY", and a right block with `Pl. NN` + medium + dimensions.
- **Filtering** (inline script): clicking a filter toggles `.hide` (`display:none`) on non-matching plates, updates the active button, scrolls to the bar, and rewrites the count. Deep-link: an incoming `#<slug>` hash pre-selects that filter on load.
- **Language-aware count**: EN → `"09 works"` / `"01 work"`; JP → `"09 点"` / `"01 点"`. The count re-renders on a `langchange` event dispatched by the toggle. Port this as a computed/derived string from `(count, locale)`.
- Inventory: 5× The Color of Silence (`hero, p1, p2, p6, p8`), 1× DAY DREAM (`daydream`), 1× Portrait in Art (`portrait-art`), 2× Archives (`archives, p4`). 9 plates total.

### 3. Projects (`projects.html`)
- **Page head**: eyebrow, H1 "Projects/プロジェクト", intro.
- **3 project rows** (`.proj`, `min-height:100vh`, 2-col `1fr 1fr`): one half is a full-bleed parallax image with a soft radial `.vg`; the other half (`.body`) is centered text with a hairline divider. Rows alternate image side via `.flip`. Body = index ("01 / 03"), category (`.cat`, uppercase), H2 title, year (`.yr`), description (max 42ch), and a faint `.place` line.
  1. **Public Art / パブリックアート** — "COTRA Mural / COTRA 壁画" — `proj-public.webp`.
  2. **Solo Exhibition / 個展** — "DAY DREAM / デイドリーム", 2023 — `proj-2023.webp` (`.flip`).
  3. **Solo Exhibition / 個展** — "Fields of Color / 色の場", 2021 — `proj-2021.webp`.
- ≤880px: each row stacks (image on top, body below).

### 4. Concept (`concept.html`)
- **Opening**: 92vh, centered, golden glow behind. Eyebrow "Concept/コンセプト" + large H1 statement ("My paintings begin not with answers, but with questions." — mid-clause in `--ink-mute`).
- **Statement**: a 760px reading column. A `.lead` paragraph (Archivo Expanded 200, `clamp(22px,2.6vw,34px)`) then body paragraphs (`clamp(17px,1.65vw,22px)`, `line-height:1.95`; JP `2.15`). Secondary clauses use `.mute`.
- **Interlude**: 96vh full-bleed `p6.webp` with a centered white pull-quote over a stronger center-out vignette (`.vignette2`).
- **Closing**: reading column resumes; final line is a larger `.big` statement.
- Full EN + JP statement text is in the file. JP body is the artist's official statement (provided by the client) — keep verbatim.

### 5. About (`about.html`)
- **Hero**: 2-col 100vh. Left = full-bleed `portrait-art.webp` (parallax + radial `.vg`). Right = centered text with hairline divider: eyebrow "About the artist/作家について", H1 name (EN "Takuma / Watanabe", JP "渡辺 / 琢真"), sub line.
- **Bio**: 760px column, 4 paragraphs; first is a larger `.lead`. Secondary clauses `.mute`. Full EN + JP provided — JP bio verbatim from client.
- **Details band**: bordered, 4-col grid — **Born** 1985 (Japan) · **Practice** Painting (Abstraction) · **Based** Japan / US · **Medium** Acrylic, oil. Each cell: micro label + `.v` value (Archivo Expanded) + `.vsub`. Hairline column dividers. ≤880px → 2-col.
- **Closing plate**: 90vh full-bleed `p8.webp` with a bottom caption (series label + a closing quote H2).
- Footer CTA is a `mailto:` link.

---

## Interactions & Behavior
- **Nav link click** → standard navigation between the 5 pages (relative hrefs).
- **Hamburger (mobile)** → toggles `.open` on `.nav` (overlay menu + X icon). Selecting a link closes it.
- **Language toggle** → swaps EN/JP everywhere, persists to `localStorage`, updates active state, dispatches `langchange`. No full reload.
- **Works filters** → show/hide plates by series, update count, smooth-scroll to the filter bar; support `#slug` deep links from the Home series cards.
- **Scroll** → parallax on `.bleed` layers; `.reveal` fade-ups as sections enter view.
- **Hover** → nav underline grow; series-card image zoom + arrow reveal; CTA underline extends.
- **Responsive** → documented per page; main breakpoints **880px** (layout splits stack) and **820px** (nav collapses).

## State Management
Minimal, all client-side:
- `language: 'en' | 'jp'` — persisted in `localStorage['tw-lang']`; drives a root class. (In a framework: a global store/cookie, ideally SSR-aware to prevent a flash.)
- `activeFilter: <series-slug> | 'all'` — Works page only; also derivable from the URL hash.
- No data fetching, no backend. Images are local static assets.

## Design Tokens
```
/* Color */
--bg:        #0a0a0a   /* page background (near-black) */
--bg-soft:   #100f0d   /* raised surfaces */
--ink:       #e8e2d6   /* primary cream text */
--ink-mute:  #928c80   /* secondary text */
--ink-faint: #5f5a51   /* tertiary / meta text */
--line:      rgba(232,226,214,0.14)   /* hairline borders */
--line-soft: rgba(232,226,214,0.07)   /* faint borders */
/* Accent used ONLY as soft radial glows behind type, never as fills: */
glow gold:   rgba(201,162,75, 0.13–0.16)
/* Image scrims: rgba(8,7,6, …) blacks */

/* Type */
--display: "Archivo Expanded", "Archivo", sans-serif;  /* headings; weights 200/300/400 */
--sans:    "Hanken Grotesk", system-ui, sans-serif;     /* body/UI; weights 300/400/500 */
JP:        "Noto Sans JP", weights 200–500, font-feature-settings:"palt" 1;
/* Google Fonts: Archivo, Archivo Expanded, Hanken Grotesk, Noto Sans JP */

/* Layout */
--pad:  clamp(22px, 5vw, 68px);   /* page gutters */
--maxw: 1400px;                   /* content max width */

/* Motion */
easing:        cubic-bezier(.2,.7,.2,1)
reveal:        opacity+translateY(28px) over 1.2s
parallax:      0.12–0.22 × viewport height
nav underline: 0.45s ; reveal safety force at 1600ms

/* Breakpoints */
880px (layout stacks) · 820px (nav → overlay) · 600px (hide works count)
```

## Assets
All under `art/` (WebP, sourced from the artist's existing website, photographed on gallery walls — the vignette is what hides the wall):
- `hero.webp`, `p1.webp`, `p2.webp`, `p4.webp`, `p6.webp`, `p8.webp` — *The Color of Silence* (luminous woven abstracts)
- `daydream.webp` — *DAY DREAM* (soft yellow-green field)
- `portrait-art.webp` — *Portrait in Art* (dense magenta gesture)
- `archives.webp` — *Archives* (red-orange impasto)
- `proj-public.webp` (COTRA mural), `proj-2023.webp` (DAY DREAM solo show), `proj-2021.webp` (2021 grid show)
Replace/expand with the artist's master files for production. Fonts load from Google Fonts.

## Name / localization note
The artist's name kanji is **渡辺琢真** (surname 渡辺, given 琢真). Romanized **Takuma Watanabe**. Use these forms exactly. All JP body copy (Concept statement, About bio) is the client's official text — keep verbatim.

## Files
Source design references included in this bundle:
- `index.html`, `works.html`, `projects.html`, `concept.html`, `about.html` — the 5 pages
- `assets/site.css` — all shared tokens, nav, footer, motion, language CSS
- `assets/site.js` — parallax, reveals, mobile nav, language toggle + persistence
- `art/` — all painting/photo assets
- `explorations/` (optional reference) — three earlier full-site direction studies ("Catalogue", "Living Light", "Archive") that informed the chosen direction; not part of the production site.
```
```
