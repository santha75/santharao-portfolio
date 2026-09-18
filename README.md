# Santharao Nowpada — Portfolio

Personal portfolio site for **Santharao Nowpada**, a UI/UX designer with 11+ years in enterprise B2B SaaS — clinical decision support, human-in-the-loop AI workflows, and developer platforms.

> **Complex systems, made obvious.**

The site is **static and dependency-free** — plain HTML, CSS, and JavaScript with imagery inlined as SVG. No build step, no framework, no `node_modules`. Open it in a browser and it runs.

---

## Contents

- [Live site](#live-site)
- [Project structure](#project-structure)
- [What's inside](#whats-inside)
- [Running locally](#running-locally)
- [Before you deploy](#before-you-deploy)
- [Deploying](#deploying)
- [Editing the site](#editing-the-site)
- [Design tokens](#design-tokens)
- [Browser support](#browser-support)

---

## Live site

<!-- Replace once deployed -->
**https://your-domain.com**

---

## Project structure

```
.
├── index.html                 # markup only — every section of the page
├── assets/
│   ├── css/
│   │   ├── main.css           # design tokens, components, responsive rules
│   │   └── loader.css         # intro loader overlay, scoped to `.pl-*`
│   ├── js/
│   │   ├── loader.js          # intro loader — the reel, the arrival card
│   │   └── main.js            # sticky nav, reveals, work tabs, FAQ, motion
│   └── img/
│       └── santharao.jpg      # portrait — used by the loader and #short
└── README.md
```

`main.css` loads before `loader.css` because the loader styles use tokens declared on `:root`. `loader.js` sits in the body where the loader markup ends, so the intro starts as soon as that markup is parsed; `main.js` loads at the end of `<body>` once the whole document exists. Both are classic scripts — they execute in document order, no `defer`/`module` needed.

Everything stays relative, so the site works from `file://` as well as from a server.

---

## What's inside

A single-page site with nine sections, in order:

| Section | ID | Purpose |
| --- | --- | --- |
| Hero | — | Positioning statement and primary calls to action |
| Clients | `#clients` | Logo band of companies worked with |
| Work | `#work` | Seven case studies (see below) |
| Experience | `#experience` | Six-step career timeline |
| Capabilities | `#capabilities` | How the work gets done — four-part method |
| About | `#about` | Background and recognition |
| Feedback | `#feedback` | Testimonials from leaders |
| FAQ | `#faq` | Questions that come up in hiring conversations |
| Short version | `#short` | The one-screen summary |

### Case studies

- **Brightcone.ai** — Enterprise AI Workflow Platform
- **InpharmD** — Formulary IQ
- **R-Clinic** — Consultation Platform
- **RunCode.io** — Cloud Dev Platform
- **Veridx.ai / EzMedTech.ai**
- **Pietrack** — Workforce Management
- **Refactored.ai** — AI-Powered Career Solutions Platform

### Technical notes

**Zero dependencies.** Beyond the two local stylesheets and two local scripts, the only external requests are Google Fonts (Space Grotesk, Inter, JetBrains Mono), preconnected for speed. Icons and imagery are inlined as SVG, so there are no icon requests to wait on. The one bitmap — the portrait — is a real file, preloaded in `<head>` so the loader's arrival card never renders blank.

**Motion, done responsibly.** Scroll-driven reveals use `IntersectionObserver` and animation runs through `requestAnimationFrame`; `visibilitychange` pauses work when the tab is backgrounded. Every animated treatment is gated behind `prefers-reduced-motion` — 17 separate guards — so the site degrades to a static page for anyone who asks for that.

**Accessible by construction.** Semantic `<section>` landmarks, labelled regions, an ARIA tab interface for the work browser, `aria-expanded` accordions for the FAQ, `aria-live` regions for dynamic content, and focus management via `focusin`/`focusout` and `keydown` handlers.

**Social-ready.** Open Graph and Twitter `summary_large_image` cards are wired up and only need real URLs (see below).

### The intro loader

Before the page hands over, a ~5.4-second sequence runs in two acts:

1. **The reel** — six beats, one per delivered capability, each with a small system diagram that draws itself in the accent color, the headline result, and the product it shipped on. A step counter and progress rail track `01/06 → 06/06`.
2. **The arrival card** — portrait inside a ring that draws, the name resolving through the original decode effect, the designation, and the line the whole site is built around: *Complex systems, made obvious.*

It never traps anyone. Click anywhere, press <kbd>Esc</kbd>, scroll, or hit the **Skip** button (visible from 1.1s) and the loader tears down immediately. A safety timeout removes it regardless, and `prefers-reduced-motion` skips the reel entirely — straight to a static arrival card for 1.5s.

Both the copy and the pacing live at the top of [`assets/js/loader.js`](assets/js/loader.js):

```js
var REEL = [ { kicker, line, who, glyph }, … ];   // the six beats
var BEAT = 520;    // ms each beat holds (.2s of that is the cross-fade)
var LEAD = 220;    // ms before the first beat lands
var CARD = 2050;   // ms the arrival card holds
```

Total runtime is `LEAD + 6*BEAT + CARD`. Add or drop a beat and the counter, rail, and timing all follow — nothing else needs touching. The six `glyph` keys map to the diagrams in the `GLYPHS` object just below; their rendered size is `.pl-glyph` in `loader.css`, and because the strokes are `non-scaling`, resizing them means adjusting the `stroke-width` on the `<svg>` in `loader.js` to match.

If you shorten `BEAT`, keep it comfortably above the `.pl-slide` transition (200ms) and the glyph draw (300ms) in `loader.css`, or beats start cutting each other off.

**On smoothness.** The intro is deliberately built out of compositor-only work — every transition is `opacity` and `transform`, with no animated `filter`. Three things were costing frames and are now gone: an animated `blur()` on each slide, a `filter`/`transform` on `.pl-bg` (which re-rasterized the whole backdrop on every frame the globe canvas painted), and a drop-shadow on the continuously spinning watch hands. The hero globe is also held back until the loader signals `pl:done`, since it was redrawing a second full canvas per frame behind an opaque overlay. Measured over the full intro in headless Chrome: median frame 16.7ms (60fps), worst frame down from ~350ms to ~50ms, and p95 under a 4× CPU throttle down from 217ms to 117ms.

---

## Running locally

Because it's all static files, just open the entry point:

```bash
xdg-open index.html      # Linux
open index.html          # macOS
start index.html         # Windows
```

To serve it over HTTP — closer to production, and required if you add anything that needs a real origin:

```bash
python3 -m http.server 8000
# → http://localhost:8000
```

Any static server works (`npx serve`, `php -S localhost:8000`, etc.).

---

## Before you deploy

Three placeholders ship in the file. Fix them or things will quietly break:

- [ ] **Set the canonical URL.** `index.html:13` and `index.html:14` contain `your-domain.com` in the `og:url` and `og:image` tags. Social previews will 404 until these point at the real domain.
- [ ] **Add `og-image.png`.** A 1200×630 preview image in the repo root, referenced by the Open Graph and Twitter card tags.
- [ ] **Add the CV.** `index.html:160` and `index.html:853` link to `Santharao-Nowpada-CV.pdf` at the repo root. Drop the PDF in place or the download buttons 404.

Optional polish:

- [ ] Add a `favicon.ico` alongside the existing inline SVG favicon, for older browsers and bookmark bars.
- [ ] Add JSON-LD `Person` structured data for richer search results.

---

## Deploying

Any static host will serve this. Three good options:

### Cloudflare Pages — recommended

Fastest path for a static site. In the dashboard: **Workers & Pages → Create → Pages → Upload assets**, then drag this folder in. Free tier includes unlimited bandwidth, a global CDN, custom domains, and automatic HTTPS. Connect the Git repo instead if you want pushes to auto-deploy.

### GitHub Pages

Best if you want the source public and versioned — a reasonable signal on a portfolio.

```bash
gh repo create santharao-portfolio --public --source=. --push
```

Then **Settings → Pages → Source: `main` / root**. The site lands at `https://<username>.github.io/santharao-portfolio/`. Name the repo `<username>.github.io` instead if you'd prefer the clean root URL.

### Netlify Drop

Drag the folder onto [app.netlify.com/drop](https://app.netlify.com/drop) for a live link in about ten seconds. No account needed to start — useful for sharing a draft.

Whichever you pick, the entry point must stay named **`index.html`** so it's served at the root path, and the `assets/` folder must be uploaded alongside it — the paths are relative, so the folder layout has to survive the deploy.

---

## Editing the site

Find the file by what you're changing:

| You want to change | Edit |
| --- | --- |
| Copy, sections, markup | `index.html` |
| Colors, type, spacing, layout, responsive rules | `assets/css/main.css` |
| The intro loader's look | `assets/css/loader.css` |
| The intro loader's copy, beats, and timing | `assets/js/loader.js` — the `REEL` list and the `BEAT`/`LEAD`/`CARD` constants |
| The portrait (loader card and `#short`) | replace `assets/img/santharao.jpg` |
| Nav, scroll reveals, work tabs, FAQ, animations | `assets/js/main.js` |

`main.css` runs top to bottom as design tokens → base elements → components → responsive rules, matching the section order of the page.

To add a case study, copy an existing `<article>` inside `#work`, change the `id` (the pattern is `#w-<name>`), and add a matching entry to the tab list so the ARIA `aria-controls` wiring stays intact.

---

## Design tokens

Colors are CSS custom properties on `:root` at the top of `assets/css/main.css`, so the whole palette can be retuned from one place:

```css
--bg:          #05080D;                      /* page background        */
--bg-2:        #090D15;                      /* alternating band       */
--accent:      #B8EF43;                      /* signature lime         */
--accent-ink:  #0A0B06;                      /* text on accent         */
--accent-glow: rgba(184,239,67,0.30);        /* halos and focus rings  */
--line:        rgba(150,180,220,0.10);       /* hairline dividers      */
--line-strong: rgba(150,180,220,0.18);       /* emphasized dividers    */
```

The site is dark-mode only by design — there is no theme toggle.

Type is set in **Space Grotesk** (display), **Inter** (body), and **JetBrains Mono** (code and metadata).

---

## Browser support

Modern evergreen browsers — Chrome, Edge, Firefox, and Safari. Uses `IntersectionObserver`, CSS custom properties, and CSS Grid; no polyfills are bundled.

---

## Contact

- **Email** — [san.nowpada@gmail.com](mailto:san.nowpada@gmail.com)
- **LinkedIn** — [santharao-nowpada](https://www.linkedin.com/in/santharao-nowpada)
- **Behance** — [santha75](https://behance.net/santha75)

---

© Santharao Nowpada. Design, copy, and case study content are not licensed for reuse.
