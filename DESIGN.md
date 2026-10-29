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

The system reads as bright, editorial, and largely flat: near-white card grounds, warm-tinted section bands, one structural cool note (deep sage) doing double duty as headline color and as the footer's background, and exactly two near-black CTA closes that differ page to page (see Colors → Named Rules). Motion is minimal and almost entirely a response to the visitor's own action (hover, tap, changing a filter); the only continuous, always-on animation in the shipped build is the homepage's word ticker marquee. The Methods pathway thread is the one scroll-driven exception and the closing CTA garland draws once when scrolled to and grows with each hover (see Components → Methods finder and pathway stages). `prefers-reduced-motion: reduce` disables the ticker and every Methods transition described under Components → Methods finder and pathway stages; the thread then simply stays finished.

Key Characteristics:

- Roboto Serif (300) is the workhorse body/nav/button face; Roboto Slab (200–300) is reserved for headings and large numerals — the inverse of a "slab-for-everything" reading.
- Deep sage (`#48614c`) is a structural role color: it colors most section-opening `<h2>`s, the footer background site-wide, the homepage concern band, and category/pillar icon rings — not a single reserved CTA accent.
- Two different "dark CTA" treatments coexist: the homepage's offer-dark card uses `clay-deep` (warm brown); the Methods/Services closing CTA card uses a separate near-black (`#181f1a`, `--dark-cta`) that the homepage never declares. This is a real cross-page inconsistency, not a rule to extend.
- Elevation is almost entirely flat; the nav gains a shadow only after it contracts on scroll, and the mobile nav drawer has a shadow when open.
- The homepage hero is a pathway triptych: an ink text field (46%) beside three photo panels — 01 Tư vấn, 02 Trị liệu, 03 Tập luyện — each a link, with Trị liệu open by default. Hover/focus widens a panel (`flex-grow`, 500ms) and reveals its one-line copy; below 700px the triptych is replaced by a swipeable scroll-snap photo carousel (`HeroMobileStage`, starts at Tư vấn) with a three-segment chip control whose cream indicator follows the scroll position; the active photo settles from a 1.07 scale, and the headline and quick-consult pill sit below over a gradient into the ink ground. No autoplay. The quick-consult pill (`HeroQuickConsult`) keeps the label “Tư vấn ngay”, posts a phone-only request to `/api/leads`, and reports via a top toast. The route now sends email to Holistic through Resend without storing customer requests in a website database; it only acknowledges success after Resend accepts the email. Staff call back, check availability and confirm the appointment manually. On error the toast stays visible with a direct call link. A 1px `#e0c1af` hairline with one dot per panel threads the numeral row. Photos carry a warm sepia/clay tint. `Consultation.jpg` (Tư vấn), `Therapy.jpg` (Trị liệu) and `Coaching.jpg` (Tập luyện) in `public/images/` are cropped from posts on the clinic's Facebook fanpage, supplied by the owner, with each post's headline and watermark strips cropped off. Methods/Services heroes remain static full-bleed photo cards with a static scrim; no hero ships any motion beyond this hover response. The Methods hero adds a pathway ribbon along the card's foot — a 1px `#e0c1af` hairline at 50% with one dot per stage (Trị liệu, Tập luyện, Hồi phục), each stage name over its method titles, linking to that stage's first method (`#mtd-…`) — the same thread-and-dot motif as the homepage numeral row, backed by a bottom-only scrim layer (ribbon text measures ≥6.2:1 and the description ≥4.7:1 on the lightest 2% of pixels, from 701px up; the horizontal scrim holds its second stop at `min(620px, 88%)` so it still covers the text on narrow cards). At ≤700px the card turns into the homepage mobile pattern: a 270px photo fading into the ink ground under the title, copy and ribbon, whose method titles are dropped there.

## Colors

A warm, low-saturation clay-and-linen family with sage as the one structural cool note, plus a distinct unrelated near-black reserved for two of the three pages' closing CTA.

### Primary

- **Clay Deep** (`#744d40`): the default action color — primary buttons, nav CTA, homepage's dark offer-card background, link/tag hover colors.
- **Clay** (`#90776e`): mid-tone accent — quick-link/category-card hover border, arrow/scrollbar accents, small label text (`.compareLegend`). Quick-link detail text uses `muted` for clearer contrast.
- **Clay Hover** (`#5f3d32`): hover/pressed state for every clay-deep-backed control.

### Secondary

- **Deep Sage** (`#48614c`): the system's one cool color, but it is structural, not a single accent — it is the color of most section headline `<h2>`s across all three pages (intro, services carousel head, compare, team, testimonials, categories head, Methods' stage headings, and the pillars label), the background of every page's footer (`.footer`), the homepage concern-CTA band, and the category/quick-link icon rings. The Methods stage headings (Trị liệu, Tập luyện, Hồi phục) are sage like the other section openers; the older `.pathCopy h2` ink exception no longer exists.
- **Dark CTA** (`#181f1a`): a separate near-black used only for the Methods and Services closing CTA card backgrounds. The homepage does not declare this token; its equivalent closing CTA card (`.offerDark`) uses `clay-deep` instead. Treat these as two different closing treatments that happen to coexist, not one shared "dark" token.

### Neutral

- **Card** (`#fdfaf6`): base page background on all three pages.
- **Ink** (`#3a2a24`): primary text color, default heading color, hairline-border source (all hairlines are `rgba(58, 42, 36, α)` at α between .1 and .25 depending on context).
- **Muted** (`#5c4b44`): secondary/body copy color — story, card, and dive/method paragraph text — consistent across all three pages.
- **Numeral** (`#ab917e`): the dedicated color for large `200`-weight display numerals only (step numerals, process numerals, index numerals; the Methods page carries none) — never used as text color elsewhere.
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
- **Numeral** (200, 28–36px/1): step/process/index numerals only, color `numeral` (`#ab917e`) — never reused as a text size for anything else.
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
- **Repeating 3-up grids:** pillars, offers, categories, and process cards use three- or four-column grids, collapsing to 1–2 columns at 980px and 700px. Homepage quick links form a three-column navigation strip, becoming three horizontal rows at 980px.
- **Two-column story/dive rows:** intro, path, team (homepage) and dive sections (Services) use `1fr 1fr` with `order` flipping which side carries the image; all collapse to one column under 980px, image-first. Methods rows are the exception: a fixed `5fr / 6fr` image-then-copy row with no flipping (see Components).
- **Breakpoints:** 980px (grid-to-stack for most two-column rows and 3-up grids), 700px (nav collapses to drawer, mobile type/padding steps down; homepage core values become three compact rows).
- There is no small-step spacing token scale (4px/8px grid) in this build; treat the section-rhythm band and the two container frames above as the real, repeated system.

## Elevation & Depth

This is a flat system by default; almost nothing carries a shadow. Across all three page modules and the shared chrome, exactly two real shadows exist:

### Shadow Vocabulary

- **Scrolled nav pill** (`box-shadow: 0 6px 24px -16px rgba(58, 42, 36, .4)`): appears as the full-width, square-edged nav contracts on scroll. The nav has no shadow at the top of the page.
- **Mobile nav drawer** (`box-shadow: 0 12px 28px rgba(58, 42, 36, .16)`): under the open mobile nav-links panel, distinguishing it from the page below.

### Named Rules

**The Flat-Except-Nav Rule.** No card, section band, or grid item anywhere in the current build carries a box-shadow — depth is conveyed by tonal layering (card/warm-band/sage stacking) alone. The only exceptions are the floating nav pill and its mobile drawer. Don't add ambient shadow to quick-link cards, testimonial cards, category cards, or any content panel; the prior system's "quick-link ambient shadow" rule no longer matches the shipped CSS and should not be reintroduced.

## Shapes

Radii cluster into four bands rather than one strict scale: `10px` (Instagram-grid tiles only), `14px` (quick-link/step/process/testimonial/service-image cards), `16px` (larger media and content panels — offer, category, index, dive/method media, Methods/Services CTA and note cards), and `18px` (hero cards, the homepage concern band). A full pill (`999px`) covers every button, tag, and badge-shaped control; the one exception is the Methods finder sentence, whose two `<select>`s are underlined text, not pills. Circles (`50%`) cover the hamburger button, footer social glyphs, and the carousel arrows. Borders are a single hairline family — `rgba(58, 42, 36, α)` with α stepping between .1 and .25 by context — never a heavier stroke.

## Components

### Buttons

- **Shape:** full pill (`999px`) for every filled/light/outline button, no exceptions.
- **Primary** (`.primaryButton`): `clay-deep` background, off-white text; hover shifts to `clay-hover` plus a 2px lift.
- **Light** (`.lightButton`, used on dark or sage grounds): off-white/card background, ink text; hover inverts to `clay-deep` background with white text (lift only on the homepage variant).
- **Outline** (`.outlineButton`): transparent, hairline border, ink text; hover shifts text and border to `clay-deep`.
- **Dark outline** (`.darkOutlineButton`, used on dark hero/CTA grounds): transparent, semi-transparent off-white border and text; hover brightens the border to pure white.
- **Nav CTA:** small pill, `clay-deep` fill, hover `clay-hover` — no lift.

### Homepage concern CTA

The sage panel pairs the question heading with a single off-white pill linking to `/treatments`. The symptom subtext is removed by owner decision. Three original broad SVG curves add a tonal background; a hand-drawn arrow connects heading and action on desktop. At 1050px and below the decorative arrow disappears; at 700px and below the content stacks centrally and the button spans the available width. When half the panel is visible, `ConcernPattern` uses IntersectionObserver to reveal three brush strokes over 2.45 seconds. This runs once per mount using ordinary CSS animations, without scroll timelines. Reduced motion or unavailable JavaScript leaves the completed pattern visible. The heading and native link remain server-rendered. Pattern, layout and motion were approved through the standalone preview; research: `docs/homepage-concern-cta-proposals.md`.

### Homepage closing CTAs

The two closing cards each contain a short `h2` and one native link; their repeated descriptive sentences are removed. The clay-deep card says “Bắt đầu từ tư vấn” with a light “Đặt lịch tư vấn” button to `/booking`. The linen card says “Trị liệu & tập luyện” with an outline “Xem dịch vụ” button to `/services`, giving consultation the stronger action treatment. On desktop, each card places its heading on the left and its button on the right, vertically centered, with 28px × 32px padding and a 140px minimum height. Below 980px the cards occupy separate rows. Below 700px, the heading and button stack with 28px × 20px padding; buttons span the card and height follows content. The consultation button has no hover transition or lift.

The brown card carries the actual paper/plaster texture extracted from the owner's `HoliBrandBrief_9.pdf`, converted to `public/assets/textures/brand-paper.webp` (626×417, about 21 KB). It is a static decorative background with soft-light blending at 60% opacity. Text and controls sit above it; the light button keeps a light hover surface and a visible off-white focus outline. The guideline supplies a material texture, not a repeating logo pattern. Sources and review: `docs/homepage-closing-cta-research.md`.

### Homepage integrated care and core values

The section after the comparison table explains the benefit of combining therapy and training, with the heading “Trị liệu và tập luyện, cùng một lộ trình.” The earlier numbered pathway explains the stages. This section uses one short paragraph and three core values — Toàn diện / Xuyên suốt / Bền vững — each with its own concise benefit, avoiding guaranteed recovery or reinjury-prevention claims.

Keep the linen panel (`warm-band`, 18px radius), a sage heading, and the real `ManualTherapy.jpg` photo of a specialist using a manual-therapy tool on a client's back. This photo comes from the clinic's fanpage post of 31 May 2025; its source and original dimensions are documented in PRODUCT.md. It does not show an identifiable face. The image is 300px tall on desktop/tablet and 220–260px on mobile, with a cover crop at `50% 40%` on desktop/tablet and centered on mobile to retain the hands and treatment while keeping the poster's title and bottom wordmark outside the visible frame.

Panel padding is 48px on desktop/tablet and 28px × 20px on mobile. The top copy/photo row stacks at 980px. Core values use a native unordered list: three columns above 700px, three rows below. Original transparent sage/clay icon illustrations replace the tiny circled glyphs: supportive hands (Toàn diện), three interlocking chain links (Xuyên suốt), and a rooted plant (Bền vững). Each icon is 56px on desktop and 48px below 980px, beside its `h3`; the paragraph spans the item's full width below. No individual card shell or outer icon circle. Artwork is decorative with empty alt text; generation provenance and prompts are in `docs/core-value-icons.md`. A single hairline separates the values from the story; the former visible “Giá trị cốt lõi” label is replaced by the list's accessible name. No new client JavaScript or motion is needed. Review and references: `.impeccable/critique/2026-10-09T10-08-03Z__app-page-tsx.md`.

### Floating contact buttons

Three round icon-only buttons fixed bottom-right (`components/chat-widgets.tsx`), carried over from the previous holisticvn.com: Call (sage `#48614c`, outline phone), Zalo (`widget-clay`) and Messenger (`widget-clay-soft`), each with the brand glyph in white. Size steps 48px (mobile) / 56px (≥768) / 64px (≥1024), gap 12–16px, 150ms `scale(1.1)` on hover. They carry a soft drop shadow so they separate from the page; this is a third shadow in the build, scoped to this component only, alongside the nav pill and mobile drawer. On the homepage at ≤700px they stay hidden until the user scrolls ~240px so they never cover the hero's quick-consult button.

### Cards / Containers

- **Quick-link strip** (homepage only): three discovery links — Dịch vụ (`/services`), Phương pháp (`/treatments`), Về Holistic (`/about`). Cream ground with top/bottom hairlines and vertical separators, no shadow or individual card framing. Three equal columns above 980px, three horizontal rows with horizontal separators below. Artwork, title/description and arrow stay on one row. Padding is 20px × 24px desktop, 16px below 980px, with 12px inline padding below 700px. Hover/focus tint to `warm-band`; the fine arrow moves 3px. Existing keyboard focus remains visible and reduced-motion disables the transition/transform. Descriptions use Roboto Serif at 13px.
- **Quick-link illustrations** (homepage only): three transparent 512px WebP assets named `{services,methods,about}-editorial-v3.webp` in `public/images/quick-links/`, rendered at 72px desktop / 64px below 980px. Original editorial pen-and-ink contours in sage (`#48614C`) and muted clay (`#90776E`): supported mobility with a specialist, manual shoulder therapy hands, and three symbolic adults representing the people behind the clinic. The group is conceptual, not actual staff portraits. Images are decorative with empty alt text; visible link labels carry their accessible names. Generation prompts and references are in `docs/quick-link-illustrations-v3.md`.
- **Category / index card** (Services): `16px` radius, white background, hairline border, no shadow; hover lifts 2px (category) or tints background to `warm-band` (index). Methods no longer has an index strip.
- **Testimonial card:** `14px` radius, white background, no border, no shadow. Each card opens with a decorative display-font quote mark and closes with a hairline-separated attribution pinned to the card bottom: an initial in a warm-band circle, the reviewer in sage mono, the source after a thin divider, and the card's own 5-star rating at the right. Cards are verbatim Google review excerpts (see `docs/CONTENT_INVENTORY.md`); no reviewer photos. One verbatim phrase per quote (`highlight` in `lib/content.ts`) carries a soft clay underline-marker, drawn once from its first word to its last (line by line when it wraps) as it enters the viewport; marks that appear together draw one after another, 450ms apart, in reading order (`components/highlight-stage.tsx`). With `prefers-reduced-motion: reduce` the underline is simply present. The first quote is a lead card (56ch measure) with the faceless `Studio.jpg` clinic photo as a 360px left column (a top banner at 980px), spanning the full row above a single row of four smaller cards (two columns below 1180px, one column only below 640px) so the whole section fits a 1440×900 viewport; the sourced Google score is an unboxed two-line badge (score and stars, then the review count as an underlined link) beside the section heading, not a panel.
- **Dive section (Services):** no card shell — a full two-column copy/media row per category, differentiated only by alternating image side.

### Methods finder and pathway stages

Issue #42. The Methods page (`/treatments`) has no timeline, no numbers and no index strip: a finder sentence, then three pathway stages and the dark CTA.

- **Finder sentence:** one line of Roboto Slab 300 (`clamp(1.35rem, 3.2vw, 40px)`) — "Tôi đang gặp **vấn đề nào ▾** và muốn **cải thiện điều gì ▾**" — in which the two native `<select>`s are inline, underlined text. Empty: `clay-deep` text with a dashed `clay` underline. Chosen: `sage` text, lowercase, with a solid `sage` underline that is drawn left to right. Each chosen value gets a 44px × 44px `×` button right after it that clears only that value and returns focus to its select. There is no separate heading or hint above the sentence; the region is labelled "Lọc phương pháp". One value per select; the two values combine as a union (a method shows if it carries either tag).
- **Result count:** a 1px hairline separates the sentence from the results and doubles as the count's rule: with a filter it carries "N phương pháp" at its left; without one it is the plain rule, and only a screen-reader status ("Đang hiển thị N phương pháp") remains.
- **Pathway stages:** Trị liệu (manual therapy, device therapy), Tập luyện (rehab and strengthening) and Hồi phục (cold plunge, infrared). The grouping is defined once in `lib/content.ts` (`methodStages`) and was confirmed by the owner in the workspace on 2026-10-12. Each stage is a two-column row — sage `h2` at left, methods stacked at right — closed by a hairline; a stage with no matching method hides its heading too. Stage headings are `h2`, method titles `h3`.
- **Pathway thread (≥1100px):** a 1px `clay` hairline (50%) runs down the gutter beside the stage titles with a 9px `clay` dot at each title — the hero ribbon's thread-and-dot motif (`app/treatments/scroll-thread.tsx`). The line lengthens as the visitor scrolls, to a line 70% of the way down the viewport, and each dot pops (scale 0 → 1, 0.4s) when the line reaches its stage; a passive scroll listener drives it, so it works in every browser, and it is rebuilt when a filter changes the stages' height. Reduced motion and no JavaScript show it finished; hidden below 1100px, where it would meet the titles. It is the methods list's only illustration: the methods already have their own photos, so whitespace is preferred over more art (per-stage illustrations, geometric SVG sketches, a sticky sprig, a scroll-grown leafy vine and per-stage sprouts were tried and rejected).
- **Closing CTA garland (all widths, owner-chosen 2026-10-13 from four concepts):** the dark CTA is the heading and the two native links, nothing else (the explanatory sentence was removed by owner decision). A pen-drawn garland (`app/treatments/cta-garland.tsx`) runs along the top edge from the top-right corner: a `hero-emphasis` 1.3px stem with fifteen spots along it; eight alternate spots start with a sage-tinted leaf hanging from the stem. Its proportions are fixed (692×90 box anchored top-right, shrinking uniformly to `100% − 540px` on narrower cards so it stays clear of the heading, and 520px / 100% when the card stacks at 980px and 700px, where the card's top padding grows to 76px / 64px). The first time the card is half in view the stem draws (1.6s) and then each leaf (0.7s, 0.12s apart); a card already on screen at load, touch-only devices, reduced motion and no-JavaScript show it finished. Drawing and growth require hover and fine-pointer capabilities, including on hybrid devices; touch events never add growth. Growth reads the current capabilities and motion preference on each action, so attaching a mouse or disabling reduced motion can enable later growth without replaying the initial draw. After that it keeps growing, only in answer to the visitor: each time either button is hovered with a non-touch pointer or visibly keyboard-focused (at most one per 0.7s) a new leaf (60%) or five-petal blossom (40%) sprouts on a random free spot (leaf draws in 0.8s, blossom opens 0.8s, exponential ease-out); growth stays when the pointer leaves. When all fifteen spots are taken the oldest item drops (1s, 52px down with a 40° turn, fading, ease-in) and a new one grows where it was. State is not stored: a reload returns to the eight leaves. Alternatives tried and rejected: a reaching branch in the gap, a sunrise halo of rays, tonal brush strokes with a sprig, a vine frame along the lower and right edges, and blossoms that only opened during hover.
- **Method row:** `5fr / 6fr` image (260px, 16px radius) then copy: Roboto Slab `h3`, a one-line `sage` subtitle (`indexSubtitle`), the approved body, two tag rows, and the existing "Liệu pháp liên quan" links. No numerals, no alternating sides.
- **Method tags:** two rows that echo the sentence — "Khi bạn gặp" (conditions) and "Khi bạn muốn" (goals) — each a label plus pills. Pills are `warm-band` with `muted` text, 40px tall; the pill matching the active filter is `sage` with a check that draws in. A tag toggles its own category's select value. If clearing the final tag collapses its mobile body, focus returns to that category's select; visible desktop pills and manually opened mobile rows retain focus.
- **Mobile (≤700px) photo bands:** each method is a photo band with a 112px minimum height (16px radius) with the title and subtitle over a bottom-weighted dark scrim and a 32px outlined chevron ring at the bottom right; tapping the whole band raises its minimum height to 200px and reveals the body. The photo and opaque dark backing stretch to cover longer CMS headings in either state. The scrim is at least 74% opaque across the band, increasing to 86% at its bottom, so long title and subtitle lines stay on dark ground. The scrim keeps light text at 5.5:1 or better on all five shipped photos (measured on the lightest 2% of pixels); re-measure when a photo is replaced. Rows open themselves while a filter is active and when a footer `#mtd-…` link targets them. The toggle is a native `<button>` with `aria-expanded`; with JavaScript off, a `<noscript>` rule shows every body. From 701px up the state is ignored and everything shows.
- **Motion:** only in response to the visitor, all inside `prefers-reduced-motion: no-preference`. Underline draw 0.4s; band open/close 0.4s (`grid-template-rows` 0fr → 1fr, closed content `visibility: hidden` so it leaves the tab order); `×` and count fade in; methods and stages leaving after a filter change fade out in 0.15s, then the ones coming back wait for that and fade and rise 10px over 0.4s with a 40ms stagger per stage; the "N phương pháp" count replays a 0.3s fade-rise whenever it changes; after a hero-ribbon or footer `#mtd-…` jump, the target method gets a soft `warm-band` wash that starts 0.3s after the scroll begins and fades over 1.6s, with all transitions in the list switched off while the scroll runs so nothing resizes under it; the same open-and-mark runs when the page is loaded or navigated to with a `#mtd-…` already in the URL (a footer link from another page). Pills and the buttons below them scale to 0.97 while pressed (160ms release); on mobile the body text of an opening band fades in over 0.25s after an 80ms wait and the ring darkens while pressed; in the Methods hero ribbon, hover/focus fades the underline in over 0.2s and swells the stage's dot to 1.3 (pointer devices only). Entrances are gated on `data-touched`, so nothing animates on first paint. Easing is exponential ease-out (`cubic-bezier(0.22, 1, 0.36, 1)`).
- **Pending final page acceptance (#42 is HITL):** the owner selected the current garland concept on 2026-10-13; final acceptance of the page, including the scroll-lengthened pathway thread, garland behavior and their exception to the first-paint rule below, remains pending. This also covers the sentence copy, the "Khi bạn gặp / Khi bạn muốn" labels, the dropped heading and hint (the older "Bạn đang gặp vấn đề gì…" heading in `docs/methods-wording-proposal.md` is superseded), and the photo-band presentation on mobile.

### Treatment detail (`/treatments/[slug]`)

Issue #10. The owner approved the combined design on 2026-10-20 and requested production-code implementation on 2026-10-21. It uses the same Warm Clay palette, local fonts, navigation and footer as the rest of the site.

- **Hero:** breadcrumb with real method-group links; copy on the left, treatment image on the right (475px, 18px radius), stacked below 760px with a 280px image. Title is ink, upright English subtitle is clay; the primary “Gửi yêu cầu tư vấn” pill always appears beside the phone link. The pathway ribbon sits below a hairline in the copy column. A missing image produces one text column. Existing editorial badge data remains visible as a small chip, over the image when present.
- **Facts and contents:** the unboxed strip contains only available price, duration and step-count cells, with no duplicate CTA. A horizontal contents list links only to sections that actually render; it can scroll on mobile.
- **Retained sections:** Giới thiệu keeps the statement-left/body-right layout and its sage heading with a running hairline. “Dành cho ai, hướng tới gì” uses tag rows only when the treatment has supporting data. Group discovery filters do not establish clinical indications for individual treatments; the 2026-10-22 content audit removes that inference and its source footnote.
- **Session:** “Một buổi diễn ra thế nào” pairs a sticky explanation and treatment-room photo with an ordered vertical sequence. The first step circle is sage, the rest paper with clay numerals; a fine connector follows the sequence. Mobile stacks the explanation above the steps and omits the secondary room photo. Step text, numbering, count and duration come from the treatment document.
- **FAQ:** “Bạn có thể đang băn khoăn” sits left of native disclosure rows, the first initially open. The section stacks on mobile and renders only when CMS FAQs exist.
- **Related:** “Cùng nhóm …” names a single shared group, or “Liệu pháp cùng nhóm” for several. Two columns of image-and-text links lead to real sibling treatment pages; mobile has one column. Missing photos render as text; prices and descriptions come from the sibling documents.
- **Callback panel:** a linen panel (18px) pairs the selected question heading, operational copy and phone link with the real lead form. Treatment context is visible below the form and remains in its request payload. Other pages retain their default form button wording.
- **Selected dock C:** opaque paper, one hairline, 15px radius, max 650px. A 70px treatment thumbnail precedes the title and inline price/duration, with the consultation pill at the right. Below 600px the image is 58px and the full-width CTA moves to a second row. A document without an image uses the same summary without a photo slot. Existing scroll/reached-form behavior remains; `--dock-h` keeps mobile chat clear and `--cookie-h` lifts the dock above consent controls. Wide layouts reserve side space for chat. Reduced motion removes dock/button transitions.

The demo establishes visual direction, not missing clinical data: no demo duration, benefit, protocol or FAQ is copied into the bundled catalogue. CMS content is authoritative; sections and their contents links are omitted together when optional content is absent. See `docs/treatment-detail-selected-ui.md` for the decision and implementation boundary.

### Contact (`/contact`)

Implemented refresh proposal (2026-10-30; final visual acceptance pending): a standalone mono marker and hairline introduce the two-column contact area. The left column pairs an ink/sage Roboto Slab heading with full-row phone, Zalo and email links separated by rules; the right holds the shared callback form on linen (`#f6efe6`, 18px radius). Form fields use paper, 10px corners and 16px text, with sage focus outlines and a clay pill submit action. Below, the approved clinic entrance photo sits beside the address, Google Maps link and opening hours in one linen band. At 700px and below, both sections stack in reading order. No new animation, client component or map embed. Contact values still come from `getPublicSiteData()`. Sources and verification: `docs/contact-page-awwwards-inspiration.md`.

The subsequent copy-preserving critique/polish uses clay (`#90776e`) for resting field borders, the treatment form's warm placeholder color (`#75645b`), Roboto Slab 300 at 20px for the clinic title, and a 13px/400 privacy note. Keyboard focus keeps the submit pill's shape. The channel list uses the existing chat-exclusion mechanism so floating phone/Zalo controls step aside while the direct links are visible. No section spacing or page composition changed. Review, measurements and the inherited consent-layout observation: `docs/contact-page-polish-review.md`.

### Homepage comparison table

The same native table stays visible at every viewport. The criteria and Holistic columns stay fixed during horizontal scrolling, with opaque backgrounds. Desktop uses a 26% criteria column and 14% Holistic column; mobile uses 136px and 88px (112px and 80px below 360px). Each mobile comparison column fills the remaining visible width, so a complete provider column is readable at either end of the scroll area. Header/body text stays at 16px/15.5px on mobile.

Use the native horizontal scroll area with visible keyboard focus. At narrow widths, the line “Vuốt ngang để xem các giải pháp khác.” explains the gesture. Scrollbar visibility follows browser and OS behavior. The owner preferred this to a separate range control on 2026-10-09. Keep the same rows, headers, caption and state labels on desktop and mobile.

### Navigation

The nav starts as a full-width white bar with straight sides, no border, and no shadow. On screens wider than 700px, past 48px of scroll it contracts into an inset white pill with rounded ends, a hairline border, and a soft shadow; its vertical padding also decreases. Width, padding, radius, border, and shadow transition over 320ms, with transitions disabled for reduced motion. On mobile (700px and below), the sticky nav stays full-width and square-edged after scrolling so its logo, booking CTA, and 44px menu button have room; a bottom hairline separates it from the page. The static `VI` label is hidden on mobile because it does not switch languages. Ink-colored links shift to `clay-deep` on hover, and the active route uses `sage` at weight `500` (`.navLinks a[data-active="true"]`). At 1000px and below, links collapse into a shadowed drawer toggled by a circular hamburger button; the nav CTA remains available beside it.

### Utility bar

Thin ink-colored (`#3a2a24`) strip above the nav (`.utility` in `components/holistic-nav.tsx`), mono caps at 11px (10px on mobile) in off-white at reduced opacity, one line, two groups: opening hours on the left; on the right the hotline (tap-to-call, desktop only) and **Chỉ đường**. Chỉ đường is a native `<details>` that opens a small card (`#fdfaf6`, hairline border, 14px radius, no shadow) listing the sole clinic — _Cơ sở Xóm Chiếu_ (109/15 Lê Quốc Hưng), confirmed by the owner on 2026-10-07 — as a Google Maps search link in the same tab (`mapsHref`, `branches` in `lib/content.ts`), consistent with the deliberate Google/social/address link behavior recorded in commit `e1cacf1`. Escape or an outside click closes it. Pattern borrowed from hawthorneskinandbeauty.com.au (slim single-row bar with tappable contact items). On mobile the hotline and the "all days" note are dropped: the floating Call button covers the phone and the hero form note repeats the hours.

### Logos

Brand logos live in `public/assets/logo/`, cropped to their visible bounds (viewBox) from the brand-guideline exports (Dark and Light sets, SVG + PNG). Use the variant that matches the ground; there is no single logo for the whole site.

- `lockup-on-dark.svg`: symbol + "holistic rehab & performance", horizontal, pale `#DCD1CD`. Used in the footer (sage ground).
- `lockup-on-light.svg` / `symbol-on-light.svg`: same shapes for light grounds. The supplied Light set is a soft dusty rose (`#B69F97`), which read too faint in the nav pill, so these two files are **recolored to clay-deep `#744D40`** (the nav CTA colour). The untouched originals stay in the brand export.
- `symbol-on-dark.svg`: symbol only, pale; `watermark-on-dark.svg`: the large translucent "Logo_Opacity" symbol, used as the footer watermark at 5% opacity.
- Nav: horizontal lockup at 30px; **at ≤700px the symbol alone** (34px) replaces it so the mark stays legible.
- There is no site-wide dark theme; "light/dark" here means which variant sits on a light or dark ground. The unused exports (`Original_FullName`, `Original_Symbol`, `Symbol+FullName_Variant1`) are kept in the brand export for later.

### Footer

Sage-background band (`.footer`), modelled on the Hawthorne Skin & Beauty footer: nothing decorative beyond the brand. Four columns on desktop (1.5fr / 1fr / 1fr / 1.1fr): the on-dark lockup, then contact as plain **underlined text lines** (the sole Lê Quốc Hưng clinic as a Google Maps link under a small mono location label, then phone, email, then Facebook / Instagram / Zalo as three 40px outline icon buttons, so the column carries no extra words); Dịch vụ and Holistic link columns with muted mono labels; and **Giờ mở cửa** above a full-width light "Đặt lịch ngay" pill: on desktop (>1000px) the hours list every day (Thứ 2 … Chủ nhật, same 09:00 — 21:00 each), on tablet and mobile one short row ("Tất cả các ngày 09:00 — 21:00"). A translucent brand symbol (`watermark-on-dark.svg`, 5% opacity, bottom-right, cropped by the edge) sits behind the content. At ≤1000px the brand and hours blocks go full width and the two link columns sit side by side (1.15fr / .85fr below 700px). Clinic rows reuse `branches` and `mapsHref`, so they match the utility bar. On mobile the floating contact buttons hide while the footer is in view.

### Raster provenance

The active three homepage quick-link illustrations were generated with OpenAI’s built-in image generation tool on 2026-10-04. Prompt contract: original mature editorial contour drawings, natural adult proportions, deep sage `#48614C` and muted clay `#90776E`, transparent alpha, no text, logos, panels, borders, or watermarks. The previous therapy illustration informed the new services drawing, which then served as the style reference for methods and about. PNG sources are preserved in `.context/imagegen/quick-links/`; production WebP assets are resized to 512px with alpha preserved. Exact prompts and research links are in `docs/quick-link-illustrations-v3.md`. Previous v2 and relief-style assets are retained for comparison.

## Do's and Don'ts

### Do:

- **Do** treat Roboto Serif (300) as the body/UI face and Roboto Slab (200–300) as the heading/numeral-only face — the reverse of a slab-for-everything system.
- **Do** use sage as the structural section-headline and footer color; it is not a rare accent to be rationed.
- **Do** keep section-marker mono labels (`.stepsHead`, `.indexHead`, `.processHead`) as standalone markers paired with a trailing hairline rule, sitting above a full section — not directly tagging a single heading beneath them. That is the one mono-label pattern actually shipped; it reads differently from a per-heading kicker/eyebrow and should stay that way.
- **Do** show the sourced aggregate Google rating and review count as the unboxed two-line badge next to the testimonials heading, linking to Google (`reviewSummary` in `lib/content.ts`). Per-card stars appear only on cards that are real, individually rated Google reviews; never infer a card's rating from the aggregate. See PRODUCT.md's Evidence on Hand.
- **Do** keep the two container frames distinct in code (chrome at 1240px, page bodies at 1360px) until they're deliberately reconciled — don't silently pick one when extending a page.

### Don't:

- **Don't** add a box-shadow to any content card or section band; the system is flat except for the nav pill and its mobile drawer.
- **Don't** reintroduce ambient hero motion (radial glow drift, image-mount fade/scale, autoplay) — the only hero motion is the homepage triptych's hover/focus panel expansion and the mobile carousel's swipe/tap transition; the word ticker is the only always-on animation. `prefers-reduced-motion` disables both.
- **Don't** use italic Roboto Serif as an emphasis device even though the font loads an italic style; the one shipped emphasis instance uses color on upright text instead.
- **Don't** number or order the five Methods families as a sequence, and **don't** animate anything on the Methods page on first paint; its motion answers the visitor's action only (the pathway thread and the closing CTA garland respond to scroll; both stay static when already visible on initial load).
- **Don't** assume `--dark-cta` and the homepage's `clay-deep` offer-dark background are the same token; they are two different closing treatments that currently coexist across pages.

**Not canonized:** the homepage team section and its photo placeholder were removed (issue #4); the real team photo now sits on /about, without individual bios per owner decision on 2026-10-07. Don't reintroduce a placeholder card. (The footer's old two-letter FB/IG marks were replaced by real icon links.)
