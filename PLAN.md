# Fatni BBQ Website — Implementation Plan

**Project:** Adapt `yobowl-web-final` template → `fatni-website` for Fat Ni BBQ / 胖妮烧烤 (Chinese BBQ, Dallas area)

---

## 1. Baseline Findings

### Stack
- **Framework:** None — plain HTML + CSS + vanilla JS
- **Build tooling:** None. No npm, no package manager, no bundler
- **Deployment:** Hostinger static hosting (`public_html`), manual file upload; Hostinger MCP also available
- **Pages:** 5 standalone HTML files — `index.html`, `Menu.html`, `Gallery.html`, `Location.html`, `Catering.html`
- **Styling:** Single `css/styles.css` with CSS custom properties (`:root` token system). Design system is named "Chili Oil & Porcelain." Mobile-first, responsive via `@media` breakpoints at 860px and 560px
- **JS files:**
  - `js/reveal.js` — header scroll-state + IntersectionObserver scroll reveals + hero parallax
  - `js/external-links.js` — intercepts absolute links, opens in new window (frame-safety for embedded previews)
  - `js/order-locations.js` — location-picker modal wired to `[data-order-toggle]` buttons
  - `js/menu.js` — category filter pills + dish-photo `<dialog>` modal
  - `js/gallery.js` — full admin gallery system (IndexedDB preview, ZIP publish bundle, drag-to-reorder)
- **Routing:** No routing — each page is a full HTML document
- **Content/data layer:** Menu items are static HTML buttons in `Menu.html`. Gallery images listed in `gallery-photo/photos.json`. Ordering URLs hardcoded in `js/order-locations.js`
- **Images:** Yobowl uses CDN (`static.hungerrush.com`). Local images in `gallery-photo/`, `location-photo/`, `menu-photo/menu-dish-photo/`. `gbp-photo/` and `ig-photo/` are unused by the HTML pages (raw source material)
- **SEO:** Per-page `<title>`, `<meta name="description">`, canonical `<link>`, OG tags, Twitter Card, and `application/ld+json` JSON-LD (Restaurant schema on most pages, Menu schema on Menu.html)
- **Analytics:** None present in the template
- **Fonts:** Bodoni Moda (brand italic wordmark), Montserrat (headings/UI), Open Sans (body) — Google Fonts
- **Cache busting:** `?v=N` query strings on all CSS/JS asset links; bump required across all pages on every file change
- **Contact form:** `Catering.html` only → Web3Forms API (`api.web3forms.com`); recipient email is in Web3Forms dashboard, not in code; hCaptcha + honeypot

### Reusable pieces (keep as-is, or minimal changes)
- The entire CSS design system structure — token names, layout patterns, responsive breakpoints
- `js/reveal.js` — no changes needed
- `js/external-links.js` — no changes needed
- `js/order-locations.js` — only update the `ORDER_LOCATIONS` and `REVIEW_LOCATIONS` arrays
- `js/menu.js` — no code changes; CSS lives in `Menu.html`'s `<style>` block
- `js/gallery.js` — rename `DB_NAME` constant and `ADMIN_PASSCODE`; update `img.alt` text
- All HTML layout patterns: `page-head`, `band`, `band-dark`, `feature`, `loc-grid`, `photo-grid`, `review-card`, `order-modal-overlay`, contact form, `catering-hero`
- `gallery-photo/photos.json` data contract (just clear Yobowl photos, add Fatni photos)

### Yobowl-specific content that MUST be replaced
| Area | What to find/change |
|------|-------------------|
| Brand name | "Yo Bowl", "Yo! Bowl", "YB" → "Fat Ni BBQ", "胖妮烧烤" |
| Tagline | "Authentic Chinese Comfort Food" / "Noodle House in DFW" |
| All 5 `<title>` tags | yobowl.com domain, "Yo Bowl Carrollton" |
| All canonical `<link>` URLs | `https://www.yobowl.com/…` |
| All OG/Twitter tags | title, description, image, url |
| All JSON-LD | name, url, telephone, address, geo, hours, orderAction, sameAs, image, logo |
| Ordering URLs | toasttab.com → order.mealkeyway.com (MenuSifu) |
| Review URLs | Google search for "Yo Bowl" |
| Social links | @yobowl.us on Instagram/TikTok/Facebook |
| Phone numbers | (469) 892-6267, (972) 758-9292 |
| Street addresses | Yobowl Carrollton + Plano addresses |
| All CDN image URLs | `static.hungerrush.com` URLs |
| Logo files | `logo.png`, `hero-logo.png` |
| Footer copyright | "© 2026 Yo Bowl Carrollton" |
| Menu items | Mifen, Build Your Own Bowl, Braised Beef, Dumplings, Yogurt, etc. |
| Review text | Three Yobowl customer quotes |
| About copy | Yobowl founding story |
| Gallery DB name | `'yobowl-gallery'` → `'fatni-gallery'` (in `gallery.js`) |
| Admin passcode | `'yobowl'` → new passcode TBD |
| Gallery localStorage keys | `yobowl-gallery-order`, `yobowl-gallery-removed`, `yobowl-gallery-admin` |
| Web3Forms `access_key` | Yobowl key → new Fatni key |
| Web3Forms `from_name` | "Yo Bowl" → "Fat Ni BBQ" |
| Catering hero copy | Office lunches / "Yo Bowl" references |

---

## 2. Proposed Site Map & Section-to-Component Mapping

| File | Page | Sections | Maps from Yobowl |
|------|------|----------|-----------------|
| `index.html` | Home | Header, Hero, About, Instagram grid, Reviews, Footer | index.html 1:1 |
| `Menu.html` | Menu | Header, Page-head, Menu board images, Filter pills, Browsable menu, Dish dialog, Footer | Menu.html 1:1 |
| `Gallery.html` | Gallery | Header, Page-head, Admin toolbar, Drop zone, Gallery grid, Footer | Gallery.html 1:1 |
| `Location.html` | Locations & Hours | Header, Page-head, Two-location cards, Map embeds, Hours table, Order buttons, Parking, Footer | Location.html 1:1 |
| `Catering.html` | Catering & Events | Header, Catering hero, Services section, Whole-lamb pre-order note, Contact form, Footer | Catering.html 1:1 |

### Navigation labels
Home · Menu · Gallery · Locations & Hours · Catering & Events

---

## 3. Theme Proposal

### Design System Name
**"Charcoal & Ember"** — replacing "Chili Oil & Porcelain"

The Yobowl palette is already warm and fiery, but its ground is light cream (`#f8f2e8`). Fatni BBQ is a late-night charcoal grill experience — the site should feel like stepping up to a glowing grill after dark: near-black background, fire-orange and ember-red accents, warm gold highlights, cream text.

### Proposed CSS Tokens (`:root` in `styles.css`)

```css
/* Ground — near-black charcoal */
--charcoal:        #181210;   /* page background */
--charcoal-mid:    #251a14;   /* card/band backgrounds */
--charcoal-light:  #3a2820;   /* borders, dividers */
--charcoal-lift:   #4a342a;   /* hover states, secondary bg */

/* Accent — fire and ember */
--ember:           #e05c28;   /* primary CTA, chili red-orange */
--ember-dark:      #b84820;   /* hover / deeper ember */
--fire:            #f07c38;   /* lighter fire highlight */
--gold:            #d49030;   /* warm gold accent, stars */
--gold-light:      #f0ba60;   /* highlighted text, Chinese chars */

/* Text on dark ground */
--cream:           #f2e8d8;   /* primary text */
--cream-soft:      rgba(242,232,216,.72); /* secondary text */
--cream-mute:      rgba(242,232,216,.42); /* disabled/hint text */

/* Functional */
--paper:           #251a14;   /* card backgrounds (same as charcoal-mid) */
--line:            rgba(255,255,255,.10); /* subtle dividers */
--ink:             #f2e8d8;   /* repurpose --ink as cream (for body copy) */

/* Gradients */
--ember-grad:      linear-gradient(125deg, #b84820 0%, #e05c28 42%, #f07c38 100%);
--charcoal-grad:   linear-gradient(160deg, #1f1510 0%, #120e09 100%);
--fire-glow:       radial-gradient(ellipse at 50% 30%, rgba(224,92,40,.25), transparent 65%);

/* Shadows */
--shadow-sm:       0 2px 8px rgba(0,0,0,.25);
--shadow-md:       0 10px 28px rgba(0,0,0,.40);
--shadow-lg:       0 28px 60px rgba(0,0,0,.55);
--shadow-accent:   0 14px 32px rgba(224,92,40,.35);
```

**Contrast check (WCAG AA requirement ≥ 4.5:1 for normal text):**
- `--cream` (#f2e8d8) on `--charcoal` (#181210): ~14:1 ✓
- `--ember` (#e05c28) on `--charcoal` (#181210): ~4.6:1 ✓ (borderline; use for large/bold text only)
- `--gold` (#d49030) on `--charcoal` (#181210): ~6.2:1 ✓
- `--cream-soft` on `--charcoal-mid`: ~8:1 ✓

**Light/white sections** (About band, review cards): use `--charcoal-mid` background with `--cream` text. There is no true white/cream page background in the Fatni theme — the whole site is dark.

### Typography

**Proposed Google Fonts import:**
```
Bodoni+Moda:ital,wght@1,700;1,900 — brand italic wordmark (EN)
Montserrat:wght@600;700;800 — headings, UI, filter pills
Open+Sans:wght@400;600 — body copy
Noto+Serif+SC:wght@400;700 — Chinese characters (menu items, brand subtitle, bilingual labels)
```

**CSS font stacks:**
```css
--font-brand-en:  'Bodoni Moda', Georgia, serif;           /* "Fat Ni BBQ" */
--font-brand-cn:  'Noto Serif SC', 'PingFang SC', 'Microsoft YaHei', 'Hiragino Sans GB', serif; /* 胖妮烧烤 */
--font-head:      'Montserrat', system-ui, sans-serif;
--font-ui:        'Montserrat', system-ui, sans-serif;
--font-body:      'Open Sans', system-ui, sans-serif;
--font-cn:        'Noto Serif SC', 'PingFang SC', 'Microsoft YaHei', 'Hiragino Sans GB', serif;
```

The `.menu-item-cn` class (Chinese name on each menu item, already present in the Yobowl template) will use `--font-cn`.

**Recommendation on EN/中文 language toggle:**
> **Recommendation: DO NOT implement a full language toggle for launch.** The added scope is significant — every text node needs a translation, you need URL routing or `?lang=` query param logic, and the content must be provided in both languages before development starts. Estimated additional cost: **8–14 hours** plus translation time. Instead, implement **bilingual touches** throughout: Chinese name in the brand/header (`Fat Ni BBQ · 胖妮烧烤`), Chinese subtitles on menu item names (already the Yobowl pattern), and a few Chinese-language marketing phrases in the hero/about. A full toggle can be a Phase 2 feature.

### Imagery Direction
- **Hero:** Sizzling lamb skewers over a charcoal grill, shot from a low angle or close-up with visible smoke/flame. Warm and dark.
- **About section:** Charcoal grill setup, or hands placing skewers on grill. Shows craft.
- **Instagram grid (6 photos):** Mix of plated skewers, sauce bar spread, group table at night, cumin lamb close-up, scallop/squid on the grill, cold beer with skewers.
- **Menu photos:** Per-item shots against dark surface. Charcoal-lit ambiance.
- **Location photos:** Storefront at night (sign lit up), interior dining area, sauce bar display.
- **Catering hero:** Long-table event spread with skewers, or whole lamb on a grill.

---

## 4. Data Model

### Menu Data (static HTML in `Menu.html`, same pattern as Yobowl)
Menu items are `<button class="menu-item">` elements inside `.menu-cat` sections. No JSON file for the browsable menu — items are markup. A `<style>` block in `Menu.html` heads all menu-specific CSS.

**Proposed categories and sample items:**

| Category ID | EN Label | CN Label | Sample Items |
|-------------|----------|----------|-------------|
| `skewers` | Skewers | 串串 | Lamb / 羊肉串, Beef / 牛肉串, Chicken / 鸡肉串, Pork Belly / 五花肉串, Beef Tendon / 牛筋串, Chicken Heart / 鸡心, Gizzard / 鸡胗 |
| `seafood` | Seafood | 海鲜 | Scallop / 扇贝, Squid / 鱿鱼, Shrimp / 大虾, Fish Fillet / 鱼片, Oyster / 生蚝 |
| `vegetables` | Vegetables | 蔬菜 | Corn / 玉米, Eggplant / 茄子, Mushrooms / 香菇, Bell Pepper / 彩椒, Enoki Mushroom / 金针菇, Leek / 韭菜 |
| `sausages` | Sausages | 肠类 | Chinese Sausage / 烤肠, Cheddar Sausage / 芝士肠, Blood Sausage / 血肠 |
| `noodles` | Noodles & Flatbread | 主食 | Hand-Pulled Noodles / 拉面, Garlic Flatbread / 蒜香烤饼, Sesame Flatbread / 芝麻烧饼 |
| `sides` | Sides & Salads | 小食 | Cucumber Salad / 拍黄瓜, Peanut Salad / 花生拌菜, Pickled Cabbage / 泡菜, Edamame / 毛豆 |
| `drinks` | Drinks & Beer | 饮料 | Tsingtao Beer / 青岛啤酒, Yanjing Beer / 燕京啤酒, Soda / 饮料, Bottled Water |
| `desserts` | Desserts | 甜点 | *TBD from owner — placeholder* |

**Each item markup pattern:**
```html
<button class="menu-item" data-photo="menu-photo/menu-dish-photo/Lamb Skewer.jpg">
  <div class="menu-item-name">
    <span class="menu-item-en">Lamb Skewer</span>
    <span class="menu-item-cn">羊肉串</span>
  </div>
  <span class="menu-item-price">$2.50</span>
  <span class="menu-flag menu-flag--spicy" aria-label="Spicy">🌶</span>
  <span class="menu-flag menu-flag--popular" aria-label="Popular">⭐</span>
</button>
```

**Per-location menu differences:** The filter bar can include a location selector pill (`data-location="plano"` / `data-location="carrollton"`) as a future enhancement. For launch, one unified menu is sufficient. A note in the page copy can say "Availability may vary by location."

### Locations Data (hardcoded in `Location.html` + `js/order-locations.js`)

| Field | Location A (Plano) | Location B (Carrollton) |
|-------|-------------------|------------------------|
| Name | Fat Ni BBQ – Plano | Fat Ni BBQ – Carrollton |
| Address | 111 W Spring Creek Pkwy #130, Plano, TX 75023 | 2528 Old Denton Rd, Ste 310, Carrollton, TX 75006 |
| Phone | (469) 661-9898 | (469) 900-8887 |
| Domain listed | fatnitx.com | fatni-bbq.com |
| Order URL | `https://order.mealkeyway.com/…?mid=506733…` (CONFIRMED) | **PLACEHOLDER — needs owner** |
| Hours | **UNCONFIRMED — needs owner** | Mon–Thu 11:30 AM–9:30 PM, Fri–Sat 11:30 AM–10 PM, Sun 11:30 AM–9:30 PM (**UNVERIFIED**, conflict with late-night reports) |
| Geo | **needs lookup** | **needs lookup** |
| Google Maps embed | **needs URL** | **needs URL** |

### Hours / "Open Now" Logic
The same approach as Yobowl: hours displayed in a static table. An "open now" badge can be computed client-side using `new Date()` in `America/Chicago` timezone via `Intl.DateTimeFormat`. A small inline script in `Location.html` can compute and display a green "Open Now" or gray "Closed" badge on page load. This is a pure progressive-enhancement add-on (no build tooling required).

### Ordering Links (in `js/order-locations.js`)
```js
var ORDER_LOCATIONS = [
  {
    name: "Plano, TX",
    addr: "111 W Spring Creek Pkwy #130, Plano, TX 75023",
    url: "https://order.mealkeyway.com/customer/release/index?mid=506733344d65316e615a445156487862392b677549773d3d#/main"
  },
  {
    name: "Carrollton, TX",
    addr: "2528 Old Denton Rd, Ste 310, Carrollton, TX 75006",
    url: "PLACEHOLDER"  // ← need owner to provide
  }
];
```

**Ordering CTA design:** Link-out (new tab, `target="_blank" rel="noopener"`) recommended over iframe/embed. MenuSifu is an SPA with its own auth/cart; embedding it in an iframe is fragile and the platform may block framing. Buttons on: header, hero, location cards, footer, and a sticky mobile bottom bar.

**Third-party delivery (Uber Eats, DoorDash):** Placeholder section at the bottom of each location card. Owner to provide links.

**UTM params:** Append `?utm_source=website&utm_medium=order-button` to the MenuSifu URL if the platform passes them through; test before adding.

---

## 5. Placeholders Table

| Placeholder | File(s) | Content needed | Owner input required | Status |
|-------------|---------|---------------|---------------------|--------|
| Logo (header) | All pages (`logo.png`) | PNG, transparent bg, ~48×48px or scalable | ✅ Owner | Missing |
| Logo (hero plate) | `index.html` (`hero-logo.png`) | Wider version or combined EN+CN name | ✅ Owner | Missing |
| Hero background photo | `index.html` | Sizzling skewer/charcoal grill, 1920×1080+, landscape | ✅ Owner or stock | Missing |
| About section photo | `index.html` | Interior/grill photo, approx 4:3 | ✅ Owner or stock | Missing |
| Instagram grid (6 imgs) | `index.html` | 6 square food/vibe photos | ✅ Owner (IG export) | Missing |
| Instagram handle | `index.html` | @handle | ✅ Owner | Missing |
| Review #1, #2, #3 | `index.html` | Quotes + reviewer name (with permission) | ✅ Owner | Missing |
| Google Review URLs (per location) | `js/order-locations.js` | Google Maps review link per location | Derived once confirmed | Missing |
| Menu board image | `Menu.html` | Menu photo/PDF (optional visual board) | ✅ Owner | Missing |
| Menu item list | `Menu.html` | All items, EN+CN names, prices, spice level | ✅ Owner | Partial (template above) |
| Menu item photos | `menu-photo/menu-dish-photo/` | Per-item photos | ✅ Owner | Missing |
| Plano map embed | `Location.html` | Google Maps iframe embed URL | Derived | Missing |
| Carrollton map embed | `Location.html` | Google Maps iframe embed URL | Derived | Missing |
| Location photos | `location-photo/` | Storefront, interior (×2 per location) | ✅ Owner | Missing |
| Parking photo/note | `location-photo/` | Parking map or description | ✅ Owner | Missing |
| Confirmed hours (Plano) | `Location.html`, JSON-LD | All days + times, incl. late-night clarification | ✅ Owner | **Unconfirmed** |
| Confirmed hours (Carrollton) | `Location.html`, JSON-LD | All days + times | ✅ Owner | **Unconfirmed** |
| Plano order URL | `js/order-locations.js`, Location.html | MenuSifu `mid=` param for Plano location | ✅ Owner | 1 URL provided (unclear which location) |
| Carrollton order URL | `js/order-locations.js`, Location.html | MenuSifu `mid=` param for Carrollton | ✅ Owner | Missing |
| Catering hero photo | `Catering.html` | Large-party/event photo | ✅ Owner or stock | Missing |
| Catering menu image | `Catering.html` | Catering menu PDF or image | ✅ Owner | Missing |
| Contact form email | Web3Forms dashboard (not in code) | Email address for inquiry notifications | ✅ Owner | Missing |
| Web3Forms `access_key` | `Catering.html` | New account + key for Fatni | Developer sets up | Missing |
| Favicon | All pages | `.ico` or `<link rel="icon">` PNG | ✅ Owner (from logo) | Missing |
| OG share image | All pages `<meta og:image>` | 1200×630 branded image | Derived from logo + hero | Missing |
| Canonical domain | All pages | Which domain to use for canonical URLs | ✅ Owner decision | **Open question** |
| Geo coordinates (Plano) | JSON-LD on all pages | lat/lng for 111 W Spring Creek Pkwy #130 | Derivable from Maps | ~32.992, -96.726 (verify) |
| Geo coordinates (Carrollton) | JSON-LD on all pages | lat/lng for 2528 Old Denton Rd Ste 310 | Derivable from Maps | ~32.981, -96.912 (verify) |
| Social links (all) | All pages footer | Instagram, TikTok, WeChat/Xiaohongshu, Facebook URLs | ✅ Owner | Missing |
| About story copy | `index.html` | 2–3 paragraph brand story | ✅ Owner | Missing |
| Catering copy | `Catering.html` | Large-party details, whole-lamb note, group inquiry process | ✅ Owner | Partial |
| GA4 Measurement ID | All pages (or not) | If owner wants analytics | ✅ Owner | Unknown |
| Coit Rd listing | All pages | Confirm if 2001 Coit Rd, Plano is a 3rd location | ✅ Owner | **Unconfirmed** |
| Sauce bar description | `index.html` or `Menu.html` | Copy describing sauce bar experience | ✅ Owner | Missing |

---

## 6. Ordering Integration Design

**Approach:** Link-out, same architecture as Yobowl's `order-locations.js` modal.

**Changes to `js/order-locations.js`:**
1. Update `ORDER_LOCATIONS` array — 2 Fatni locations with MenuSifu URLs
2. Update `REVIEW_LOCATIONS` array — 2 Fatni Google Maps review links
3. No structural code changes needed

**Modal behavior (unchanged):** Click any `[data-order-toggle]` → modal pops with 2 location options → click opens MenuSifu in new tab via `external-links.js`

**`[data-order-toggle]` button placement:**
- Header `<a class="btn">Order Online</a>`
- Hero `<a class="btn btn--lg">Start Your Order</a>`
- About section `<a class="btn btn--ghost">Order Now →</a>`
- Each location card in `Location.html`
- Footer nav link
- Sticky mobile bottom bar (NEW — to add, see Phase 3)

**Sticky mobile order bar (new addition):**
```html
<div class="sticky-order-bar">
  <a class="btn btn--lg" href="#" data-order-toggle>Order Online</a>
</div>
```
CSS: `position: fixed; bottom: 0; left: 0; right: 0; display: none;` shown via `@media (max-width: 860px)`. Hidden on scroll-up, shown on scroll-down (small JS addition to `reveal.js` or inline script). This is high-impact for the mobile-heavy, late-night use case.

**Third-party delivery (Uber Eats, DoorDash):** Each location card in `Location.html` gets a row of delivery app links as plain `<a>` tags (not `data-order-toggle`, since they link directly). Placeholder `href="#"` until URLs are provided.

---

## 7. SEO / Local Search Plan

### JSON-LD (Schema.org `Restaurant`) — per location, on every page

Two separate `Restaurant` entities:
```json
[
  {
    "@type": "Restaurant",
    "@id": "https://[domain]/#restaurant-plano",
    "name": "Fat Ni BBQ – Plano",
    "servesCuisine": ["Chinese", "Barbecue", "Chinese BBQ", "Skewers"],
    "address": { "streetAddress": "111 W Spring Creek Pkwy #130", "addressLocality": "Plano", "addressRegion": "TX", "postalCode": "75023" },
    "telephone": "+1-469-661-9898",
    "openingHoursSpecification": [ … ],
    "potentialAction": { "@type": "OrderAction", "target": "https://order.mealkeyway.com/…" }
  },
  {
    "@type": "Restaurant",
    "@id": "https://[domain]/#restaurant-carrollton",
    "name": "Fat Ni BBQ – Carrollton",
    "address": { "streetAddress": "2528 Old Denton Rd, Ste 310", "addressLocality": "Carrollton", "addressRegion": "TX", "postalCode": "75006" },
    "telephone": "+1-469-900-8887"
  }
]
```

### Per-page SEO
| Page | `<title>` pattern | Description |
|------|------------------|-------------|
| `index.html` | `Fat Ni BBQ 胖妮烧烤 | Chinese BBQ Skewers in Dallas` | Brand + cuisine + geo |
| `Menu.html` | `Menu | Fat Ni BBQ — Lamb Skewers, Seafood & More` | Menu-specific |
| `Gallery.html` | `Gallery | Fat Ni BBQ — Charcoal Grill Photos` | Gallery-specific |
| `Location.html` | `Locations & Hours | Fat Ni BBQ — Plano & Carrollton TX` | Both locations |
| `Catering.html` | `Catering & Events | Fat Ni BBQ — Group BBQ Dallas` | Event/catering keywords |

### Canonical URL strategy
The domain used in canonical, OG, and JSON-LD URLs is a decision for the owner. **Recommendation:** Use a single primary domain. The current options (`fatni-bbq.com`, `fatnitx.com`, `fatnibbqtx.com`) suggest fragmented presence. Recommend consolidating on one domain and 301-redirecting the others. Flagged as open question for owner.

### Google Business Profile linkage
The `sameAs` field in JSON-LD should link to each location's Google Business Profile. The "Write a Review" modal can link directly to the GBP review URL.

### Sitemap
A static `sitemap.xml` listing all 5 pages (with `<lastmod>` dates). Created once and updated when pages change. No tooling required — hand-written XML.

### Analytics
No analytics are currently in the template. Recommend adding Google Analytics 4 via a `<script>` tag in each page's `<head>`. An owner-provided Measurement ID (`G-XXXXXXXXXX`) is required. Track: page views, order button clicks (via GA4 `event` on `[data-order-toggle]` clicks), phone/directions taps (`tel:` and maps links).

---

## 8. Accessibility, Performance & Mobile-First Checklist

### Accessibility
- [ ] All images have meaningful `alt` text (not just "Fatni BBQ")
- [ ] Menu filter pills use `aria-pressed` (already in `menu.js`)
- [ ] Dish dialog uses `aria-modal="true"` + `aria-labelledby` (already in `menu.js`)
- [ ] Order modal uses `aria-modal="true"` + `aria-labelledby` (already in `order-locations.js`)
- [ ] `tel:` links (phone numbers) are tappable — not just text
- [ ] Maps links have `aria-label` with the full destination description
- [ ] Sticky order bar is `hidden` or off-screen for keyboard users when modal is open
- [ ] Focus management on modal open/close (already in `gallery.js` pattern)
- [ ] Color contrast ≥ 4.5:1 for body text (verified above in token section)
- [ ] `prefers-reduced-motion` respected (already in `reveal.js`)
- [ ] Chinese text has correct `lang` attribute where needed (`<span lang="zh-Hant">` or `zh-Hans`)

### Performance (mobile-first, late-night users on mobile)
- [ ] Hero image: provide a WebP version, `width` + `height` attributes, `fetchpriority="high"`, `decoding="async"`
- [ ] All other images: `loading="lazy"` + `decoding="async"` + explicit `width`/`height`
- [ ] Noto Serif SC: load only weights 400 and 700, use `display=swap`, add `<link rel="preconnect">` to `fonts.googleapis.com` and `fonts.gstatic.com`
- [ ] `?v=N` cache-bust all CSS/JS on first deploy; document bump procedure in `CLAUDE.md`
- [ ] No external CDN images beyond Google Fonts — all images served from Hostinger
- [ ] Review cards and gallery images deferred to scroll (already via `data-reveal` + lazy)
- [ ] Single CSS file — no additional requests beyond fonts

### Mobile-specific
- [ ] Sticky order bar visible on mobile (major UX win for late-night ordering)
- [ ] Header collapses gracefully at 360px — brand name + Order button + hamburger
- [ ] Phone numbers rendered as `<a href="tel:+1XXXXXXXXXX">` (tapable on iOS/Android)
- [ ] Maps links open native Maps app on mobile (`https://www.google.com/maps/…` links work)
- [ ] Menu filter pills scroll horizontally on small screens (already in Yobowl)

---

## 9. Implementation Phases

The goal: **deployable early with placeholders**, real content filled in progressively.

### Phase 0 — Repo Bootstrap (1–2 hrs)
**Goal:** Clone template into `fatni-website`, establish dev workflow.

1. Copy all files from `../yobowl-web-final/` into `fatni-website/` (excluding `.git/`, `.thumbnail`, `uploads/`, `gbp-photo/`, `ig-photo/`, Yobowl-specific images)
2. Clear `gallery-photo/websitepic*.jpg` and update `gallery-photo/photos.json` to `[]`
3. Clear `menu-photo/menu-dish-photo/` (Yobowl dish photos), keep directory
4. Clear `location-photo/` and `menu-photo/main-menu.webp`, keep directories
5. Replace `logo.png` and `hero-logo.png` with placeholder SVG files
6. Write `CLAUDE.md` for `fatni-website` (fork of Yobowl's, updated for Fatni)
7. `git add -A && git commit -m "Bootstrap: clone yobowl-web-final template"`

**Deliverable:** Site opens in browser with Yobowl structure, Fatni placeholder logos.

---

### Phase 1 — Design System Re-theme (2–3 hrs)
**Files:** `css/styles.css`

1. Replace `:root` token values with "Charcoal & Ember" palette (see Section 3)
2. Add `--font-brand-cn` and `--font-cn` tokens
3. Update `body { background: var(--charcoal); color: var(--cream); }` (global flip)
4. Update `.band` background to `--charcoal-mid` (was `--paper` / white)
5. Update `.site-header` to use dark semi-transparent background instead of white
6. Update `.review-card` and form inputs for dark theme
7. Update Google Fonts `<link>` in all 5 pages to add `Noto+Serif+SC:wght@400;700`
8. Bump CSS `?v=` to `?v=1` on all pages
9. Verify in browser: hero, header, reviews, footer all look correct

**Deliverable:** All pages render in dark "Charcoal & Ember" theme.

---

### Phase 2 — Global Chrome: Header + Footer (2–3 hrs)
**Files:** All 5 HTML files (header and footer blocks)

1. Update brand name in header: `<span class="brand-name">Fat Ni BBQ <small>胖妮烧烤</small></span>`
2. Update `<img src="logo.png" alt="Fat Ni BBQ logo">` alt text on all pages
3. Update nav links (add "Catering & Events" label)
4. Update footer brand, locations (addresses/phones), hours display
5. Update footer social links (placeholder `href="#"` until owner provides)
6. Update footer copyright: "© 2026 Fat Ni BBQ. All rights reserved."
7. Update `js/order-locations.js` ORDER_LOCATIONS and REVIEW_LOCATIONS arrays
8. **Apply to all 5 pages** (no templating — manual copy to each)

**Deliverable:** Header and footer are Fatni-branded across all pages.

---

### Phase 3 — Home Page (3–4 hrs)
**File:** `index.html`

1. Update `<title>`, `<meta description>`, canonical, OG/Twitter tags
2. Update JSON-LD (both Restaurant entities, placeholder hours)
3. Replace hero `<img>` with placeholder + new copy: tagline, "胖妮烧烤", CTA
4. Add sticky mobile order bar (new `<div class="sticky-order-bar">`) with CSS in `styles.css`
5. Rewrite About section: Fatni founding story, charcoal grill, DFW, sauce bar
6. Replace Instagram grid: 6 `<img>` placeholders + correct IG handle
7. Replace review cards: 3 placeholder reviews (or real ones if provided)
8. Remove or update "Ingredients feature" section → rename to "About Fat Ni"

**Deliverable:** Home page tells the Fatni story with correct structure and placeholder imagery.

---

### Phase 4 — Menu Page (4–6 hrs)
**File:** `Menu.html`

1. Update `<title>`, `<meta>`, canonical, OG, JSON-LD (Menu schema with all categories)
2. Remove Yobowl menu board images (or replace with Fatni menu board placeholder)
3. Rewrite all `.menu-cat` sections with Fatni categories (see Section 4)
4. Each `button.menu-item`: EN name, `.menu-item-cn` for Chinese name, price, spice/popular flags
5. Update filter pill `data-filter` values and labels to match new category IDs
6. Replace `menu-photo/menu-dish-photo/` filenames in `data-photo` attributes
7. `showPlaceholder()` in `menu.js` references `logo.png` — update alt text
8. Update `<style>` block (inline CSS) for dark-theme menu cards

**Deliverable:** Menu page shows all Fatni categories with correct EN+CN item names, dark theme.

---

### Phase 5 — Locations Page (3–4 hrs)
**File:** `Location.html`

1. Update `<title>`, `<meta>`, canonical, OG, JSON-LD (two Restaurant entities)
2. Rewrite two location cards with Fatni addresses, phones, hours tables
3. Add "Open Now" badge script (inline `<script>` using `Intl.DateTimeFormat` for `America/Chicago`)
4. Replace map `<iframe>` embeds with Fatni locations (generate embed URLs from Google Maps)
5. Add per-location "Order Online" button (`data-order-toggle`)
6. Add third-party delivery links section (placeholder)
7. Update location photos (placeholders)
8. Update parking notes

**Deliverable:** Both Fatni locations displayed with correct addresses, phones, hours, maps.

---

### Phase 6 — Catering Page (2–3 hrs)
**File:** `Catering.html`

1. Update `<title>`, `<meta>`, canonical, OG
2. Rewrite catering hero: "Book Your Group BBQ" / large-party event copy
3. Add prominent note: "Whole-grilled lamb (whole roast) requires advance reservation — please inquire at least 3–5 days in advance."
4. Replace catering menu image with placeholder
5. Update contact form: new Web3Forms `access_key`, new `from_name`, new `subject`
6. Update form fields if needed (add "Number of guests" field)

**Deliverable:** Catering page live with group/event inquiry form and whole-lamb pre-order note.

---

### Phase 7 — Gallery Page (1–2 hrs)
**File:** `Gallery.html`, `js/gallery.js`

1. Update `<title>`, `<meta>`, canonical, OG
2. In `gallery.js`: rename `DB_NAME = 'fatni-gallery'`, update `ADMIN_PASSCODE` (new passcode — get from owner), rename `localStorage` keys (`fatni-gallery-order`, `fatni-gallery-removed`, `fatni-gallery-admin`)
3. Update `img.alt` default text in `gallery.js` build function
4. Update `Gallery.html` page head copy
5. Update admin "How to publish" HOW-TO text in `gallery.js` (HOWTO constant)
6. Bump `js/gallery.js?v=` across all pages

**Deliverable:** Gallery page operational; owner can manage photos via admin mode.

---

### Phase 8 — SEO, Favicon & Sitemap (2 hrs)
**Files:** All pages, new `sitemap.xml`

1. Verify JSON-LD is consistent across all 5 pages (both Restaurant entities)
2. Add `<link rel="icon" href="favicon.ico">` (or `favicon.png`) to all pages — generate from logo
3. Create `sitemap.xml` with all 5 pages + `<lastmod>` today
4. Create `robots.txt` (allow all, point to sitemap)
5. Add GA4 snippet to all pages (if owner provides Measurement ID)
6. Add order-button click tracking event to `order-locations.js` (or inline script)

---

### Phase 9 — QA, Performance & Accessibility (2–3 hrs)
1. Test all pages in mobile viewport (360px, 390px, 430px)
2. Test all `[data-order-toggle]` buttons → modal → correct URLs in new tab
3. Test `[data-review-toggle]` → correct review URLs
4. Verify `tel:` links open dialer on mobile
5. Verify map links open Google Maps
6. Verify contact form submits (Web3Forms test)
7. Run contrast check on key color pairs (browser DevTools accessibility panel)
8. Check `prefers-reduced-motion` behavior (all animations off)
9. Check keyboard navigation (tab through nav, modals, menu filter, form)
10. Verify `lang="en"` on `<html>` and `lang="zh-Hans"` on Chinese text spans

---

### Effort Summary

| Phase | Description | Est. Hours |
|-------|-------------|-----------|
| 0 | Repo bootstrap | 1–2 |
| 1 | Design system re-theme | 2–3 |
| 2 | Global chrome (header/footer) × 5 pages | 2–3 |
| 3 | Home page | 3–4 |
| 4 | Menu page | 4–6 |
| 5 | Locations page | 3–4 |
| 6 | Catering page | 2–3 |
| 7 | Gallery page | 1–2 |
| 8 | SEO, favicon, sitemap | 2 |
| 9 | QA, performance, accessibility | 2–3 |
| **Total** | | **22–32 hrs** |

*Excludes time for content gathering (photos, copy, menu data from owner).*
*Language toggle (full EN/中文): add 8–14 hrs if desired as Phase 2 feature.*

---

## 10. Open Questions & Risks

| # | Question | Risk level | Action |
|---|----------|-----------|--------|
| 1 | **Conflicting addresses:** Is `2001 Coit Rd, Plano TX 75075 / (469) 443-0345 / fatnibbqtx.com` a third location, a closed location, or a stale directory listing? | HIGH — wrong address on site = bad UX + SEO harm | Confirm with owner before any location data is finalized |
| 2 | **Hours conflict:** Directory-reported Carrollton hours end at 9:30–10 PM; other sources report open until ~2 AM on weekends. Which is correct? | HIGH — "Open Now" logic and JSON-LD will be wrong | Owner must provide verified hours for each day/location |
| 3 | **Plano order link:** The known MenuSifu URL (`mid=506733…`) — which location does it belong to? Need both. | HIGH — broken ordering experience | Owner to provide both `mid=` values or both full URLs |
| 4 | **Domain decision:** Three domains listed across directories. Which is the primary? What should canonical URLs use? | MEDIUM — SEO dilution if not consolidated | Owner decision; plan recommends one domain + 301 redirects |
| 5 | **Logo / brand files:** No logo files provided. Hero logo unclear for bilingual treatment. | MEDIUM — can use SVG placeholder until resolved | Owner to provide PNG files (transparent bg) |
| 6 | **Image rights:** All placeholder images must be replaced with Fatni's own photos or properly licensed stock. Yobowl photos must not be used. | HIGH — legal / brand risk | Owner to supply all photography |
| 7 | **Review quotes:** Review cards on home page need real reviews. Using fake or unattributed reviews is deceptive. | MEDIUM | Use only real quotes with customer permission, or link to Google/Yelp reviews |
| 8 | **Web3Forms account:** Yobowl's `access_key` must not be used for Fatni's form. A new Web3Forms account (free plan sufficient) and recipient email are needed. | MEDIUM — form submissions would go to wrong party | Developer creates new Web3Forms account before Phase 6 |
| 9 | **Chinese character encoding:** No risk — UTF-8 in `<meta charset="UTF-8">` handles CJK. Noto Serif SC covers simplified Chinese. If traditional Chinese (Taiwan/HK customers) is important, add `Noto Serif TC` as well. | LOW | Note in implementation: use `lang="zh-Hans"` for simplified, `lang="zh-Hant"` for traditional |
| 10 | **Sauce bar:** Mentioned as a Fatni feature; whether it is a self-serve bar (like Korean BBQ condiments) or staff-applied changes the copy significantly. | LOW | Clarify with owner for accurate About copy |

---

## 11. Materials Needed from Owner

**Priority 1 — Needed before any page goes live**
- [ ] Logo file (PNG, transparent background, any resolution ≥ 512px wide)
- [ ] Hero image (sizzling skewers / charcoal grill, landscape, ≥ 1920×1080px, or a short video clip)
- [ ] Confirmed hours for each location, each day of week (including whether late-night applies)
- [ ] Confirmation: Is `2001 Coit Rd, Plano` a current location, a closed one, or a data error?
- [ ] MenuSifu ordering URLs for **both** locations (the `mid=` value or full URL per location)
- [ ] Email address for contact/catering form inquiries
- [ ] Domain decision: which domain (fatni-bbq.com / fatnitx.com / fatnibbqtx.com) is the primary?

**Priority 2 — Needed to complete pages beyond placeholder state**
- [ ] Social media handles: Instagram, TikTok, Facebook, WeChat public account or Xiaohongshu (if applicable)
- [ ] 6 food/vibe photos for Instagram-style homepage grid (square, ≥ 400×400px)
- [ ] About / founding story (2–3 paragraphs in English; Chinese optional)
- [ ] 3 real customer review quotes with first name / initial (with permission)
- [ ] Google review links for each location (from Google Business Profile)
- [ ] Location photos: storefront (×1–2 per location), interior dining area (×1–2 per location)
- [ ] Parking information or photos for each location
- [ ] Full menu with prices (EN + CN names, per-item spice level, popular-item designation)
- [ ] Gallery admin passcode preference (replaces 'yobowl')

**Priority 3 — Nice to have**
- [ ] Menu board image (poster/PDF of the physical menu, if one exists)
- [ ] Per-dish food photography for menu dialog (any/all items)
- [ ] Catering menu image or PDF
- [ ] Uber Eats / DoorDash links per location (if applicable)
- [ ] Google Analytics 4 Measurement ID (if owner wants analytics)
- [ ] Any events or promotions to feature (happy hour, AYCE nights, etc.)
- [ ] Whole-grilled lamb advance notice policy (days required, min party size, deposit?)

---

*Plan written 2026-10-13. All business facts above are derived from public directories and the prompt; verify with owner before finalizing any data in the live site.*
