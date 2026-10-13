# CLAUDE.md

This file provides guidance to Claude Code when working with code in this repository.

## What this is

A static, multi-page marketing website for **Fat Ni BBQ / 胖妮烧烤** (Chinese BBQ restaurant, two DFW locations: Plano, TX and Carrollton, TX). Plain HTML + CSS + vanilla JS — no build step, no package manager, no backend, no tests. Deployed by uploading files to Hostinger static hosting (`public_html`).

Adapted from the `yobowl-web-final` template (see `../yobowl-web-final/CLAUDE.md` for deeper architectural notes — most of those patterns apply here too).

## Locations

- **Plano:** 111 W Spring Creek Pkwy #130, Plano, TX 75023 · (469) 661-9898
- **Carrollton:** 2528 Old Denton Rd, Ste 310, Carrollton, TX 75006 · (469) 900-8887

## Running / developing

Open any `.html` file in a browser, or serve over HTTP (needed for `gallery-photo/photos.json` fetch and IndexedDB):

```bash
python -m http.server 8000   # visit http://localhost:8000/
```

No build step. Edits to `.html`/`.css`/`.js` are the deliverable as-is.

## Deploying

Hostinger static hosting (`public_html`). Updated by uploading files via Hostinger File Manager, or via the Hostinger MCP (`hosting_deployStaticWebsite`). Confirm with owner before pushing live.

## Cache busting (important)

CSS and JS are linked with version query strings, e.g. `css/styles.css?v=1`, `js/gallery.js?v=1`. **When you change one of these files, bump its `?v=` number in every HTML page that references it**, or returning visitors get stale cached copies. Search across all `.html` files since the same asset is linked from each page.

## Architecture

Five standalone pages — `index.html`, `Menu.html`, `Gallery.html`, `Location.html`, `Catering.html` — each a full HTML document that repeats the same header/footer markup. No templating: **changes to shared chrome (nav, footer, header actions) must be applied to every page by hand**.

Each page also carries its own duplicated SEO/social `<head>` block: canonical URL, Open Graph + Twitter Card tags, and JSON-LD structured data. **When business facts change (name, address, hours, ordering URL), update them across all five pages, not just the visible body copy.**

Shared assets:
- `css/styles.css` — "Charcoal & Ember" design system. CSS custom properties at `:root`. Dark-ground theme (near-black charcoal + ember-orange + gold accents + cream text).
- `js/reveal.js` — header `.scrolled` state, `[data-reveal]` scroll-in animations, hero parallax. Respects `prefers-reduced-motion`.
- `js/external-links.js` — intercepts absolute `http(s)` links and opens them with `window.open`. Do not simplify this back to `target="_blank"` — see Yobowl CLAUDE.md for why.
- `js/order-locations.js` — `[data-order-toggle]` and `[data-review-toggle]` buttons show a location-picker modal. **Update `ORDER_LOCATIONS` and `REVIEW_LOCATIONS` arrays at the top whenever ordering URLs, review URLs, addresses, or hours change.**
- `js/menu.js` — category filter pills + dish photo `<dialog>`. No code changes needed for content updates.
- `js/gallery.js` — gallery admin system (IndexedDB preview, ZIP publish bundle). DB name: `fatni-gallery`. Admin passcode: see `ADMIN_PASSCODE` constant (owner should change before go-live).

Ordering URLs (in `js/order-locations.js`):
- Plano → MenuSifu: `https://order.mealkeyway.com/…mid=506733…` (confirmed)
- Carrollton → **PLACEHOLDER** — owner to provide MenuSifu URL

## Placeholder items (owner must supply before go-live)

- `logo.svg` / `hero-logo.svg` — replace with real logo files (PNG or SVG)
- Hero background photo (1920×1080+, sizzling skewers/charcoal grill)
- Confirmed hours for both locations
- Carrollton ordering URL (MenuSifu mid= param)
- Social media handles (Instagram, TikTok, etc.)
- Contact form email (configure in Web3Forms dashboard) + new `access_key` in `Catering.html`
- Domain decision for canonical URLs (currently using `PLACEHOLDER_DOMAIN`)

## Gallery + admin (`js/gallery.js`, `Gallery.html`)

Same system as Yobowl template. Admin unlocked at `Gallery.html#admin`. Owner uses "Download publish bundle" to get a `gallery-photo.zip`, then uploads + extracts on Hostinger. See `js/gallery.js` HOW-TO constant for step-by-step instructions.

## Contact form (`Catering.html` only)

Posts to Web3Forms (`https://api.web3forms.com/submit`). The `access_key` in `Catering.html` is a **placeholder** — create a new Web3Forms account, get a key, set the recipient email in the Web3Forms dashboard, and replace the key. The current key must not be used in production.

## Menu (`Menu.html` + `js/menu.js`)

Menu items are static HTML `<button class="menu-item">` elements inside `.menu-cat` sections. Each item has:
- `.menu-item-en` — English name
- `.menu-item-cn` — Chinese name (uses `--font-cn` / Noto Serif SC)
- `.menu-item-price` — price
- `.menu-flag` — spice/popular badges
- `data-photo` — path to dish photo (optional; shows placeholder if absent)

Filter pills' `data-filter` values must match `.menu-cat` ids. When prices or dishes change, update this markup. The JSON-LD `Menu` schema in `<head>` is separate and only partial — update it too.

## Fonts

Google Fonts: Bodoni Moda (brand italic), Montserrat (headings/UI), Open Sans (body), Noto Serif SC (Chinese characters). CJK fallback stack: `'Noto Serif SC', 'PingFang SC', 'Microsoft YaHei', 'Hiragino Sans GB', serif`.
