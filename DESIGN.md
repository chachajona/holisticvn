---
name: HolisticVN
description: A warm clay-and-linen editorial system for a Ho Chi Minh City rehab/performance clinic, carried across the homepage, Methods, and Services indexes.
colors:
  card: "#fdfaf6"
  ink: "#3a2a24"
  muted: "#5c4b44"
  clay: "#90776e"
  clay-deep: "#744d40"
  clay-hover: "#5f3d32"
  sage: "#48614c"
  numeral: "#ab917e"
  warm-band: "#f6efe6"
  warm-band-deep: "#ede6dc"
  dark-cta: "#181f1a"
  blush-selection: "#ddb6af"
  off-white: "#f7f3f0"
  hero-emphasis: "#e0c1af"
  hero-thread: "rgba(224, 193, 175, 0.5)"
  mist: "#ddd5d1"
  mist-deep: "#c9bdb6"
  widget-clay: "#826b63"
  widget-clay-soft: "#9a7f74"
  widget-shadow: "rgba(0, 0, 0, 0.1)"
typography:
  display:
    fontFamily: "Roboto Slab"
    fontSize: "clamp(2rem, 4.4vw, 60px)"
    fontWeight: 300
    lineHeight: 1.1
    letterSpacing: "-0.015em"
  headline:
    fontFamily: "Roboto Slab"
    fontSize: "clamp(1.5rem, 3vw, 42px)"
    fontWeight: 300
    lineHeight: 1.2
    letterSpacing: "-0.015em"
  title:
    fontFamily: "Roboto Slab"
    fontSize: "clamp(1.5rem, 3vw, 34px)"
    fontWeight: 300
    lineHeight: 1.2
  numeral:
    fontFamily: "Roboto Slab"
    fontSize: "clamp(28px, 3vw, 36px)"
    fontWeight: 200
    lineHeight: 1
  body:
    fontFamily: "Roboto Serif"
    fontSize: "16px"
    fontWeight: 300
    lineHeight: 1.75
  label:
    fontFamily: "Roboto Mono"
    fontSize: "11px"
    fontWeight: 500
    letterSpacing: "0.16em"
    textTransform: "uppercase"
  display-compact:
    fontFamily: "Roboto Slab"
    fontSize: "clamp(2rem, 3.4vw, 50px)"
    fontWeight: 300
    lineHeight: 1.08
    letterSpacing: "-0.015em"
  headline-wide:
    fontFamily: "Roboto Slab"
    fontSize: "clamp(1.6rem, 3vw, 38px)"
    fontWeight: 300
    lineHeight: 1.2
  title-wide:
    fontFamily: "Roboto Slab"
    fontSize: "clamp(1.6rem, 3vw, 36px)"
    fontWeight: 300
    lineHeight: 1.2
  lead:
    fontFamily: "Roboto Serif"
    fontSize: "17px"
    fontWeight: 300
    lineHeight: 1.65
  body-small:
    fontFamily: "Roboto Serif"
    fontSize: "14.5px"
    fontWeight: 300
    lineHeight: 1.55
  caption:
    fontFamily: "Roboto Serif"
    fontSize: "14px"
    fontWeight: 300
    lineHeight: 1.5
  note:
    fontFamily: "Roboto Serif"
    fontSize: "13px"
    fontWeight: 300
    lineHeight: 1.5
rounded:
  sm: "10px"
  md: "14px"
  lg: "16px"
  xl: "18px"
  pill: "999px"
  circle: "50%"
components:
  button-primary:
    backgroundColor: "{colors.clay-deep}"
    textColor: "{colors.off-white}"
    rounded: "{rounded.pill}"
    padding: "13px 24px"
  button-primary-hover:
    backgroundColor: "{colors.clay-hover}"
  button-light:
    backgroundColor: "{colors.off-white}"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    padding: "13px 24px"
  button-light-hover:
    backgroundColor: "{colors.clay-deep}"
    textColor: "#ffffff"
  button-outline:
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    padding: "13px 24px"
  nav-cta:
    backgroundColor: "{colors.clay-deep}"
    textColor: "{colors.off-white}"
    rounded: "{rounded.pill}"
    padding: "11px 22px"
  category-card:
    backgroundColor: "#ffffff"
    textColor: "{colors.ink}"
    rounded: "{rounded.lg}"
    padding: "32px"
  index-card:
    backgroundColor: "#ffffff"
    textColor: "{colors.ink}"
    rounded: "{rounded.lg}"
    padding: "28px 24px"
  testimonial-card:
    backgroundColor: "#ffffff"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "32px"
---

# Design System: HolisticVN

## Overview

**Creative North Star: "Warm Clay Editorial v2"**

This is a single shared chrome — nav, footer, palette, type stack — expressed across three pages: the homepage, the Methods index (`/treatments`), and the Services index (`/services`). All three ship from the same comp-led v2 build, and all three run the same CSS custom-property set (`--card`, `--ink`, `--muted`, `--clay`, `--clay-deep`, `--clay-hover`, `--sage`, `--numeral`, `--warm-band`) on their own `.root`, plus `HolisticNav`/`HolisticFooter` and the shared button classes in `holistic-chrome.module.css`. There is no separate "older" design system left anywhere in the current build; every page in scope draws from this one.

The system reads as bright, editorial, and largely flat: near-white card grounds, warm-tinted section bands, one structural cool note (deep sage) doing double duty as headline color and as the footer's background, and exactly two near-black CTA closes that differ page to page (see Colors → Named Rules). Motion is minimal and almost entirely a hover response; the only continuous, always-on animation in the shipped build is the homepage's word ticker marquee, which is the one thing `prefers-reduced-motion: reduce` actually disables.

Key Characteristics:

- Roboto Serif (300) is the workhorse body/nav/button face; Roboto Slab (200–300) is reserved for headings and large numerals — the inverse of a "slab-for-everything" reading.
- Deep sage (`#48614c`) is a structural role color: it colors most section-opening `<h2>`s, the footer background site-wide, the homepage concern band, and category/pillar icon rings — not a single reserved CTA accent.
- Two different "dark CTA" treatments coexist: the homepage's offer-dark card uses `clay-deep` (warm brown); the Methods/Services closing CTA card uses a separate near-black (`#181f1a`, `--dark-cta`) that the homepage never declares. This is a real cross-page inconsistency, not a rule to extend.
- Elevation is almost entirely flat; the nav gains a shadow only after it contracts on scroll, and the mobile nav drawer has a shadow when open.
- The homepage hero is a pathway triptych: an ink text field (46%) beside three photo panels — 01 Tư vấn, 02 Trị liệu, 03 Tập luyện — each a link, with Trị liệu open by default. Hover/focus widens a panel (`flex-grow`, 500ms) and reveals its one-line copy; below 700px the triptych is replaced by a swipeable scroll-snap photo carousel (`HeroMobileStage`, starts at Tư vấn) with a three-segment chip control whose cream indicator follows the scroll position; the active photo settles from a 1.07 scale, and the headline and quick-consult pill sit below over a gradient into the ink ground. No autoplay. The quick-consult pill (`HeroQuickConsult`) keeps the label “Tư vấn ngay”, posts a phone-only request to `/api/leads`, and reports via a top toast. The route now sends email to Holistic through Resend without storing customer requests in a website database; it only acknowledges success after Resend accepts the email. Staff call back, check availability and confirm the appointment manually. On error the toast stays visible with a direct call link. A 1px `#e0c1af` hairline with one dot per panel threads the numeral row. Photos carry a warm sepia/clay tint. `Consultation.jpg` (Tư vấn), `Therapy.jpg` (Trị liệu) and `Coaching.jpg` (Tập luyện) in `public/images/` are cropped from posts on the clinic's Facebook fanpage, supplied by the owner, with each post's headline and watermark strips cropped off. Methods/Services heroes remain static full-bleed photo cards with a static scrim; no hero ships any motion beyond this hover response.

## Colors

A warm, low-saturation clay-and-linen family with sage as the one structural cool note, plus a distinct unrelated near-black reserved for two of the three pages' closing CTA.

### Primary

- **Clay Deep** (`#744d40`): the default action color — primary buttons, nav CTA, homepage's dark offer-card background, link/tag hover colors.
- **Clay** (`#90776e`): mid-tone accent — quick-link/category-card hover border, arrow/scrollbar accents, small label text (`.compareLegend`). Quick-link detail text uses `muted` for clearer contrast.
- **Clay Hover** (`#5f3d32`): hover/pressed state for every clay-deep-backed control.

### Secondary

- **Deep Sage** (`#48614c`): the system's one cool color, but it is structural, not a single accent — it is the color of most section headline `<h2>`s across all three pages (intro, services carousel head, compare, team, testimonials, categories head, Methods' combination note, and the pillars label), the background of every page's footer (`.footer`), the homepage concern-CTA band, and the category/quick-link icon rings. One documented exception: the Methods-page `.pathCopy h2` stays default ink instead of sage — a real, singular drift, not a second rule.
- **Dark CTA** (`#181f1a`): a separate near-black used only for the Methods and Services closing CTA card backgrounds. The homepage does not declare this token; its equivalent closing CTA card (`.offerDark`) uses `clay-deep` instead. Treat these as two different closing treatments that happen to coexist, not one shared "dark" token.

### Neutral

- **Card** (`#fdfaf6`): base page background on all three pages.
- **Ink** (`#3a2a24`): primary text color, default heading color, hairline-border source (all hairlines are `rgba(58, 42, 36, α)` at α between .1 and .25 depending on context).
- **Muted** (`#5c4b44`): secondary/body copy color — story, card, and dive/method paragraph text — consistent across all three pages.
- **Numeral** (`#ab917e`): the dedicated color for large `200`-weight display numerals only (step numerals, method-rail numerals, process numerals, index numerals) — never used as text color elsewhere.
- **Warm Band** (`#f6efe6`) and **Warm Band Deep** (`#ede6dc`): two light warm section-tint bands. **The token name collides across pages**: the homepage defines both (`--warm-band` = `#f6efe6`, `--warm-band-2` = `#ede6dc`); Methods' `--warm-band` = `#f6efe6` (matches homepage's lighter value); Services' `--warm-band` = `#ede6dc` (matches homepage's _deeper_ value). The two hex values are the real, consistent tokens — don't rely on the `--warm-band` custom-property name alone to know which one a given page means.
- **Off-white** (`#f7f3f0`) and **pure white** (`#fff`): both used loosely as "light surface" — button/card backgrounds and text-on-dark are not drawn from a single strict neutral step; treat both as the same light-neutral role rather than two distinct tokens.
- **Blush selection** (`#ddb6af`): the one text-selection (`::selection`) color, consistent on all three pages.

### Named Rules

**The Sage-Is-Structural Rule.** Deep sage colors section-opening headlines, the site-wide footer, and the homepage's one concern band — it is a recurring structural role color, not a rare accent to be spent sparingly. Don't read its frequency as a violation of restraint; it _is_ the restraint device (nothing else uses a second hue).
**The Two Dark Closes Rule.** The homepage's dark CTA is warm (`clay-deep`); Methods'/Services' dark CTA is near-black (`#181f1a`). Both are real and shipped, but they are not the same token — pick per page, don't invent a third dark value assuming a shared system exists.

## Typography

**Body/UI Font:** Roboto Serif (weights 300–400, loaded up to 500) — carries all paragraph copy, nav links, and every button label across all three pages. This is the inverse of a slab-for-body system: Roboto Slab never sets body text anywhere in the shipped build.
**Display/Heading Font:** Roboto Slab (weights 200–300, loaded up to 500) — every `<h1>`/`<h2>`/`<h3>` and every large display numeral.
**Label Font:** Roboto Mono (weights 400–500) — small uppercase captions, tags, and the utility bar only.

No weight in the shipped build exceeds 500 on any of the three families, despite all three loaders (`Roboto_Slab`, `Roboto_Serif`, `Roboto_Mono`) requesting up to `"500"`. Nothing in the current CSS calls for 600 or 700.

**Character:** weight runs inverse to size — the largest elements (numerals, hero/section headlines) are the _lightest_ weight (200–300); the smallest elements (mono labels, the one active nav link) carry the _heaviest_ weight the system uses (500). Card titles and buttons sit in between at 400.

### Hierarchy

- **Display** (300, `clamp(2rem, 4.4–5vw, 52–60px)`, ~1.1): hero `<h1>` only, on all three pages; color is `#f7f3f0` on the dark hero scrim.
- **Numeral** (200, 28–36px/1): step/process/method-rail/index numerals only, color `numeral` (`#ab917e`) — never reused as a text size for anything else.
- **Headline** (300, `clamp(1.5rem, 2.6–3.4vw, 30–42px)`, 1.15–1.25, color `sage` with the one `.pathCopy` exception): section-opening `<h2>`s.
- **Title** (300–400, roughly 18–22px for card-scale titles, `clamp(1.5–1.6rem, 3vw, 32–34px)` for method/dive `<h3>`s): item-level headings; these stay default ink color, distinguishing them from the sage-colored section `<h2>`s above them.
- **Body** (300, 15–18px, 1.65–1.8, color `muted` for secondary copy / `ink` for primary): all paragraph and list copy.
- **Compact steps** (`display-compact`, `lead`, `body-small`, `caption`, `note`; 13–17px and the wide-clamp headline/title variants): sizes the shipped homepage already uses outside the main ramp — recorded in the frontmatter so they are documented, not drift.
- **Label** (Mono, 400–500, 10–12px, letter-spacing 0.06–0.24em, uppercase): utility bar, footer column labels, testimonial attribution, comparison-table legend, standalone section markers (see Do's and Don'ts).

### Named Rules

**The Weight-Inverts-Size Rule.** The largest type in the system (numerals, headlines) is the lightest weight it uses (200–300); the smallest type (mono labels, the active nav link) is the heaviest (500). Don't set a large heading at 500+ or a caption at 300 — both invert the observed pattern.
**The Color-Not-Italic Emphasis Rule.** The hero `<em>` phrase on the homepage is de-italicized (`font-style: normal`) and carried entirely by color (`#e0c1af` on the dark hero scrim) — even though Roboto Serif is loaded with an italic style available. Don't reach for italic to mark emphasis in this system; reach for color on the same weight and size instead.

## Layout

Two container frames coexist and haven't been reconciled: the shared chrome (nav, footer) constrains to `max(24px, calc((100vw - 1240px) / 2))`, while all three page bodies (hero, sections, timelines, grids) use `max(24px, calc((100vw - 1360px) / 2))`. A new surface has to pick one; don't assume they're interchangeable.

- **Section rhythm:** vertical section padding runs roughly 56–96px on desktop, collapsing at the 980px and 700px breakpoints (e.g. 36–44px at mobile).
- **Repeating 3-up grids:** pillars, testimonials, offers, categories, and process cards use three- or four-column grids, collapsing to 1–2 columns at 980px and 700px. Homepage quick links form a three-column navigation strip, becoming three horizontal rows at 980px.
- **Two-column story/dive rows:** intro, path, team (homepage), method rows (Methods), and dive sections (Services) all use `1fr 1fr` with `order` flipping which side carries the image; all collapse to one column under 980px, image-first.
- **Breakpoints:** 1080px (pillars-only), 980px (grid-to-stack for most two-column rows and 3-up grids), 700px (nav collapses to drawer, mobile type/padding steps down).
- There is no small-step spacing token scale (4px/8px grid) in this build; treat the section-rhythm band and the two container frames above as the real, repeated system.

## Elevation & Depth

This is a flat system by default; almost nothing carries a shadow. Across all three page modules and the shared chrome, exactly two real shadows exist:

### Shadow Vocabulary

- **Scrolled nav pill** (`box-shadow: 0 6px 24px -16px rgba(58, 42, 36, .4)`): appears as the full-width, square-edged nav contracts on scroll. The nav has no shadow at the top of the page.
- **Mobile nav drawer** (`box-shadow: 0 12px 28px rgba(58, 42, 36, .16)`): under the open mobile nav-links panel, distinguishing it from the page below.

### Named Rules

**The Flat-Except-Nav Rule.** No card, section band, or grid item anywhere in the current build carries a box-shadow — depth is conveyed by tonal layering (card/warm-band/sage stacking) alone. The only exceptions are the floating nav pill and its mobile drawer. Don't add ambient shadow to quick-link cards, testimonial cards, category cards, or any content panel; the prior system's "quick-link ambient shadow" rule no longer matches the shipped CSS and should not be reintroduced.

## Shapes

Radii cluster into four bands rather than one strict scale: `10px` (Instagram-grid tiles only), `14px` (quick-link/step/process/testimonial/service-image cards), `16px` (larger media and content panels — offer, category, index, dive/method media, Methods/Services CTA and note cards), and `18px` (hero cards, the homepage concern band, the Methods path panel). A full pill (`999px`) covers every button, tag, and badge-shaped control. Circles (`50%`) cover the hamburger button, footer social glyphs, and the carousel arrows. Borders are a single hairline family — `rgba(58, 42, 36, α)` with α stepping between .1 and .25 by context — never a heavier stroke.

## Components

### Buttons

- **Shape:** full pill (`999px`) for every filled/light/outline button, no exceptions.
- **Primary** (`.primaryButton`): `clay-deep` background, off-white text; hover shifts to `clay-hover` plus a 2px lift.
- **Light** (`.lightButton`, used on dark or sage grounds): off-white/card background, ink text; hover inverts to `clay-deep` background with white text (lift only on the homepage variant).
- **Outline** (`.outlineButton`): transparent, hairline border, ink text; hover shifts text and border to `clay-deep`.
- **Dark outline** (`.darkOutlineButton`, used on dark hero/CTA grounds): transparent, semi-transparent off-white border and text; hover brightens the border to pure white.
- **Nav CTA:** small pill, `clay-deep` fill, hover `clay-hover` — no lift.

### Floating contact buttons

Three round icon-only buttons fixed bottom-right (`components/chat-widgets.tsx`), carried over from the previous holisticvn.com: Call (sage `#48614c`, outline phone), Zalo (`widget-clay`) and Messenger (`widget-clay-soft`), each with the brand glyph in white. Size steps 48px (mobile) / 56px (≥768) / 64px (≥1024), gap 12–16px, 150ms `scale(1.1)` on hover. They carry a soft drop shadow so they separate from the page; this is a third shadow in the build, scoped to this component only, alongside the nav pill and mobile drawer. On the homepage at ≤700px they stay hidden until the user scrolls ~240px so they never cover the hero's quick-consult button.

### Cards / Containers

- **Quick-link strip** (homepage only): three discovery links — Dịch vụ (`/services`), Phương pháp (`/treatments`), Về Holistic (`/about`). Cream ground with top/bottom hairlines and vertical separators, no shadow or individual card framing. Three equal columns above 980px, three horizontal rows with horizontal separators below. Artwork, title/description and arrow stay on one row. Padding is 20px × 24px desktop, 16px below 980px, with 12px inline padding below 700px. Hover/focus tint to `warm-band`; the fine arrow moves 3px. Existing keyboard focus remains visible and reduced-motion disables the transition/transform. Descriptions use Roboto Serif at 13px.
- **Quick-link illustrations** (homepage only): three transparent 512px WebP assets named `{services,methods,about}-editorial-v3.webp` in `public/images/quick-links/`, rendered at 72px desktop / 64px below 980px. Original editorial pen-and-ink contours in sage (`#48614C`) and muted clay (`#90776E`): supported mobility with a specialist, manual shoulder therapy hands, and three symbolic adults representing the people behind the clinic. The group is conceptual, not actual staff portraits. Images are decorative with empty alt text; visible link labels carry their accessible names. Generation prompts and references are in `docs/quick-link-illustrations-v3.md`.
- **Category / index card** (Services / Methods): `16px` radius, white background, hairline border, no shadow; hover lifts 2px (category) or tints background to `warm-band` (index).
- **Testimonial card:** `14px` radius, white background, no border, no shadow.
- **Timeline row (Methods):** no card shell — a numbered rail plus a two-column copy/media row; the rail's vertical connector line is a `1px` hairline, not a border.
- **Dive section (Services):** no card shell — a full two-column copy/media row per category, differentiated only by alternating image side.

### Navigation

The nav starts as a full-width white bar with straight sides, no border, and no shadow. On screens wider than 700px, past 48px of scroll it contracts into an inset white pill with rounded ends, a hairline border, and a soft shadow; its vertical padding also decreases. Width, padding, radius, border, and shadow transition over 320ms, with transitions disabled for reduced motion. On mobile (700px and below), the sticky nav stays full-width and square-edged after scrolling so its logo, booking CTA, and 44px menu button have room; a bottom hairline separates it from the page. The static `VI` label is hidden on mobile because it does not switch languages. Ink-colored links shift to `clay-deep` on hover, and the active route uses `sage` at weight `500` (`.navLinks a[data-active="true"]`). At 1000px and below, links collapse into a shadowed drawer toggled by a circular hamburger button; the nav CTA remains available beside it.

### Utility bar

Thin ink-colored (`#3a2a24`) strip above the nav (`.utility` in `components/holistic-nav.tsx`), mono caps at 11px (10px on mobile) in off-white at reduced opacity, one line, two groups: opening hours on the left; on the right the hotline (tap-to-call, desktop only) and **Chỉ đường**. Chỉ đường is a native `<details>` that opens a small card (`#fdfaf6`, hairline border, 14px radius, no shadow) listing the two clinics — _Chi nhánh Bàn Cờ_ (205 Nguyễn Đình Chiểu) and _Chi nhánh Xóm Chiếu_ (109/15 Lê Quốc Hưng) — each a Google Maps search link in a new tab (`mapsHref`, `branches` in `lib/content.ts`). Escape or an outside click closes it. Pattern borrowed from hawthorneskinandbeauty.com.au (slim single-row bar with tappable contact items). On mobile the hotline and the "all days" note are dropped: the floating Call button covers the phone and the hero form note repeats the hours.

### Logos

Brand logos live in `public/assets/logo/`, cropped to their visible bounds (viewBox) from the brand-guideline exports (Dark and Light sets, SVG + PNG). Use the variant that matches the ground; there is no single logo for the whole site.

- `lockup-on-dark.svg`: symbol + "holistic rehab & performance", horizontal, pale `#DCD1CD`. Used in the footer (sage ground).
- `lockup-on-light.svg` / `symbol-on-light.svg`: same shapes for light grounds. The supplied Light set is a soft dusty rose (`#B69F97`), which read too faint in the nav pill, so these two files are **recolored to clay-deep `#744D40`** (the nav CTA colour). The untouched originals stay in the brand export.
- `symbol-on-dark.svg`: symbol only, pale; `watermark-on-dark.svg`: the large translucent "Logo_Opacity" symbol, used as the footer watermark at 5% opacity.
- Nav: horizontal lockup at 30px; **at ≤700px the symbol alone** (34px) replaces it so the mark stays legible.
- There is no site-wide dark theme; "light/dark" here means which variant sits on a light or dark ground. The unused exports (`Original_FullName`, `Original_Symbol`, `Symbol+FullName_Variant1`) are kept in the brand export for later.

### Footer

Sage-background band (`.footer`), modelled on the Hawthorne Skin & Beauty footer: nothing decorative beyond the brand. Four columns on desktop (1.5fr / 1fr / 1fr / 1.1fr): the on-dark lockup, then contact as plain **underlined text lines** (each clinic as a Google Maps link under a small mono branch label, then phone, email, then Facebook / Instagram / Zalo as three 40px outline icon buttons, so the column carries no extra words); Dịch vụ and Holistic link columns with muted mono labels; and **Giờ mở cửa** above a full-width light "Đặt lịch ngay" pill: on desktop (>1000px) the hours list every day (Thứ 2 … Chủ nhật, same 09:00 — 21:00 each), on tablet and mobile one short row ("Tất cả các ngày 09:00 — 21:00"). A translucent brand symbol (`watermark-on-dark.svg`, 5% opacity, bottom-right, cropped by the edge) sits behind the content. At ≤1000px the brand and hours blocks go full width and the two link columns sit side by side (1.15fr / .85fr below 700px). Clinic rows reuse `branches` and `mapsHref`, so they match the utility bar. On mobile the floating contact buttons hide while the footer is in view.

### Raster provenance

The active three homepage quick-link illustrations were generated with OpenAI’s built-in image generation tool on 2026-10-04. Prompt contract: original mature editorial contour drawings, natural adult proportions, deep sage `#48614C` and muted clay `#90776E`, transparent alpha, no text, logos, panels, borders, or watermarks. The previous therapy illustration informed the new services drawing, which then served as the style reference for methods and about. PNG sources are preserved in `.context/imagegen/quick-links/`; production WebP assets are resized to 512px with alpha preserved. Exact prompts and research links are in `docs/quick-link-illustrations-v3.md`. Previous v2 and relief-style assets are retained for comparison.

## Do's and Don'ts

### Do:

- **Do** treat Roboto Serif (300) as the body/UI face and Roboto Slab (200–300) as the heading/numeral-only face — the reverse of a slab-for-everything system.
- **Do** use sage as the structural section-headline and footer color; it is not a rare accent to be rationed.
- **Do** keep section-marker mono labels (`.stepsHead`, `.indexHead`, `.processHead`) as standalone markers paired with a trailing hairline rule, sitting above a full section — not directly tagging a single heading beneath them. That is the one mono-label pattern actually shipped; it reads differently from a per-heading kicker/eyebrow and should stay that way.
- **Do** ship real star ratings and an aggregate review count in testimonial UI (`reviewSummary` in `lib/content.ts`, rendered via the `Stars` component and "NN / 41 ĐÁNH GIÁ" copy) — this is now a confirmed-real, sourced data point per PRODUCT.md's Evidence on Hand, not an invented claim.
- **Do** keep the two container frames distinct in code (chrome at 1240px, page bodies at 1360px) until they're deliberately reconciled — don't silently pick one when extending a page.

### Don't:

- **Don't** add a box-shadow to any content card or section band; the system is flat except for the nav pill and its mobile drawer.
- **Don't** reintroduce ambient hero motion (radial glow drift, image-mount fade/scale, autoplay) — the only hero motion is the homepage triptych's hover/focus panel expansion and the mobile carousel's swipe/tap transition; the word ticker is the only always-on animation. `prefers-reduced-motion` disables both.
- **Don't** use italic Roboto Serif as an emphasis device even though the font loads an italic style; the one shipped emphasis instance uses color on upright text instead.
- **Don't** assume `--dark-cta` and the homepage's `clay-deep` offer-dark background are the same token; they are two different closing treatments that currently coexist across pages.
- **Don't** treat the homepage's inline mono-text team-photo placeholder as a reusable pattern (see below) — it is a carried defect, not house style.

**Not canonized:** the homepage's team section renders an inline-styled placeholder card (`var(--warm-band-2)` background, ad hoc mono caption) instead of a real photo. It ships in the current build and is recorded here as a known defect, not as a design-system rule for a future surface to copy. (The footer's old two-letter FB/IG marks were replaced by real icon links.)
