# Services: minimal refinement after owner feedback

Date: 2026-11-14. Starting revision: `5329bd3`.

The owner rejected the previous visual density and asked for inspiration before further work. Their specific direction is that site CTAs are minimal and do not need the added information. This supersedes the earlier plans' repeated contacts, multi-action closing section and boxed mobile navigation.

## References inspected before editing

- [Hawthorne Skin & Beauty](https://www.hawthorneskinandbeauty.com.au/): the full desktop capture shows the concern band using one question and one action, and its closing consultation band using a heading and booking action. It is already a named reference for Holistic in `DESIGN.md` and `docs/homepage-concern-cta-proposals.md`. Apply its restrained action hierarchy, not its imagery or medical wording.
- [MOOI Cosmetic Clinic](https://www.mooiclinic.com.au/): Awwwards screenshot and live full-page capture show cream/olive grounds, generous typography and short booking labels. Its dense promotional grid is not adopted; the project’s existing CTA pattern is the stronger constraint.
- Holistic homepage, `app/page.tsx` offers and `app/page.module.css`: “Bắt đầu từ tư vấn” with a single “Đặt lịch tư vấn” link already implements the appropriate content and composition. This is the direct implementation exemplar.
- Holistic Methods, `app/treatments/page.tsx`: closing CTA has a short heading and actions without a supporting paragraph; do not add explanatory copy to Services merely to fill its card.

Evidence limits: the dental reference timed out on live capture and was excluded. Hawthorne desktop capture succeeded; its mobile capture contained unrevealed sections and is not evidence of its complete mobile footer. Automated structure analysis timed out, so no numeric band-map equivalence is claimed. No reference animation is implemented. The installed inspiration skill's `scripts/skill-memory.mjs` is unavailable; this note records the verification lesson locally.

## Implemented direction

- Closing card contains only the existing homepage heading and one booking link. The three-exit group, paragraph, and repeated phone/Zalo/Messenger rows are removed.
- Composition reuses the homepage offer proportions: 28px heading, 28px × 32px padding, 140px minimum height; below 701px use 28px × 20px padding and stack the full-width action. Keep the Services dark ground and current brand fonts.
- Mobile discovery stays available through plain underlined links in two columns, without cards, corner radii, arrows or a visible helper label. Native anchors, CMS order and exclusive disclosures remain.
- Services no longer fetches public settings just to repeat contacts. The unused local contact component and its component-only tests are removed. Contact channels remain in the shared footer; cookie presentation and other routes are unchanged.

## Verification

- Targeted services, consent and route-chrome regression tests passed before broader checks.
- Browser at 320, 390, 700/701, 768, 860/861, 1024 and 1440px: no horizontal overflow or clipped visible links/headings; exactly one closing CTA link. Closing card measures 140px above 700px and 157px below it with current copy.
- Source contract regression checks one closing booking action with no paragraph or repeated phone/Zalo rows. Existing service/group/booking and consent tests remain.
- Screenshots saved locally under `.context/services-minimal-{mobile,desktop}.png` and `.context/services-minimal-cta-{mobile,desktop}.png`.
- `npm run lint`, `npm run typecheck`, `npm test` (543 tests across 60 files), `npm run build` (31 pages), formatting and diff checks passed. The reduced test count reflects removal of the discarded contact-link component and its component-only tests. Real Sanity staging, native browser zoom and physical Safari/device testing are not claimed.
- Browser clicking the compact group links opens the intended exclusive disclosure, including reopening a manually closed current-hash group. The single closing link still targets `/booking`.

## Verification lesson

Removing an overlap is not a reason to repeat every contact channel in the intro and closing CTA. Check the product’s existing CTA content budget and inspect complete reference sections before composing a replacement. For this site, one heading and one action is an established, adequate closing pattern.

## Remaining sections: sequential refinement

The owner's next request was to walk through the remaining sections. Each part was edited, rendered and inspected before moving to the next; the minimal closing CTA remains the accepted direction.

1. **Opening:** reduce the oversized heading from the earlier 64–148px range to 48–88px; replace duplicated navigation instructions with one sentence about the existing treatment/training/recovery pathway. Align the two desktop columns and tighten mobile spacing. Four viewport checks passed before proceeding.
2. **Group navigation:** retain the plain two-column native links from the preceding minimal pass. Their 44px touch height, destinations and order already fit the direction; no new decoration or labels were added.
3. **Service details:** align summary and content columns using equal tracks and a 48px gutter; reduce group headings to 26–42px. Replace small mono pills with 14.5px underlined treatment links, top-align bullets, and flatten recovery entries to hairline-separated text links with their original descriptions. Inspect all four groups at 320/390/768/980/981/1440px. Keep all CMS copy, certifications, images, booking context, training link and legacy aliases. Tablet images cap at 360px; existing subject crops remain. The first image loads eagerly and sizes match the actual layout.
4. **Process:** preserve the three descriptions in a semantic ordered list, with actual headings and 28px decorative numerals beside each text group. Remove three repeated step-level exits, leaving the closing consultation action as the next step. Retain three desktop columns and use compact rows below 981px. This also removes the old span rule that unintentionally reduced numeral size to 15px.

Reference evidence: the previously inspected Hawthorne intro/story/pillars composition and Holistic's own steps/pillars typography informed this pass. A fresh DOM inspection confirmed Hawthorne's intro and pillars owners; a subsequent per-section capture timed out, so no new reference geometry or comparison score is claimed. This is a refinement in Holistic's own system, not a 1:1 replica of an external page.

Final checks passed: lint, typecheck, 544 tests in 60 files, and production build of 31 pages. Browser checks across 320/390/700/701/768/860/861/980/981/1024/1440px found no horizontal overflow, one h1, three ordered process items and exactly one closing CTA link. Repeated hash, legacy alias and Enter/Space disclosure interaction passed. The earlier Sanity/Safari/native-zoom limits still apply.

Final local images: `.context/services-sections-final-desktop.png`, `.context/services-sections-final-mobile.png`; focused images use the `.context/services-section-{intro,manual,recovery,process}-*.png` names. Screenshots are local and gitignored.

## Opening: shorter copy and a distinctive brand detail

The owner's latest feedback clarified that the right-hand text was too long and
that the opening should have a small distinguishing feature. This supersedes the
short pathway paragraph from the previous pass.

- Remove the paragraph completely. Shorten the visible Methods link to “Tìm theo triệu chứng”; retain the full destination context in its accessible name.
- Pair the title with the existing three-link illustration used for Holistic's “Xuyên suốt” value. Provenance is already recorded in `PRODUCT.md` and `docs/core-value-icons.md`; this is reused brand artwork, not a new clinical illustration or claim.
- Artwork is decorative (`alt=""`), static and local, with explicit 112×112 intrinsic dimensions. It displays at 112px desktop, 80px collapsed tablet and 72px mobile. No client component or new animation is needed.
- The first screen retains one heading and one Methods link; the compact service-group navigation still follows it. No new promotional content or action is added.
- Browser checks at 320/390/700/768/860/861/1024/1440px found no clipping. The opening measures 184px tall on mobile instead of the earlier approximately 246px, and 208px on desktop.
- Targeted inspiration search for line-art elements yielded no usable candidates; the existing Holistic brand artwork is the primary visual source. No externally unverified design pattern is claimed.

Latest preview files: `.context/services-intro-thread-desktop.png` and
`.context/services-intro-thread-mobile.png`. The opening regression now checks
that it has no paragraph, one Methods link, decorative image alt and one page h1.

Latest opening checks: lint, typecheck, 544 tests across 60 files and the production build passed. The revision is confined to the opening composition; the other previously reviewed sections retain their behavior.

## Selected opening E — 2026-11-25

The owner selected E with a slightly smaller heading, balanced spacing, one thin
rule and one link. This supersedes the illustrated opening above.

- `ServicesIntro` now renders the typographic masthead directly in all environments.
  The display heading scales from 64px to 128px (prototype E capped at 148px).
- The link now reads “Khám phá phương pháp trị liệu” and keeps `/treatments` as
  its destination. Its visible wording also supplies its accessible name.
- The heading and rail have 16px spacing on desktop / 12px on mobile; opening
  padding is 48px top / 32px bottom on desktop and 32px / 28px on mobile.
- The demo import, client switcher and prototype CSS are removed from the app.
  The previous study files are preserved locally in
  `.context/services-intro-study-archive/`.
- Local browser checks at 320/390/768/1024/1440px found one h1, one opening link
  and no horizontal overflow. Tab reaches the link with a visible 2px focus
  outline; Enter navigates to `/treatments`. Old `?variant=E` URLs render the
  selected opening without demo controls.
- Production browser checks at 320/768/1440px confirmed the same composition and
  no console warnings or errors on `/services`. These checks used local fallback
  content; no live Sanity verification is claimed for this opening-only change.
- Lint, typecheck, all 544 tests across 60 files, production build and formatting
  checks passed. No new tests were added; the existing opening check now reflects E.

Captures: `.context/services-e-desktop.png`, `.context/services-e-mobile.png`,
`.context/services-e-production-desktop.png`. Check logs: `.context/services-e-{lint,typecheck,test,build}.log`.

## Service-group navigation — 2026-11-26

The owner clarified that the requested tablet/mobile layout change concerns the
four group-selection links below the opening, not the Methods link. The trial
change to the opening rail was reverted.

At 701–1024px the four group links use two columns; at ≤700px they become four
full-width rows. Each row has a thin bottom separator and a decorative downward
arrow. Links retain the resolved CMS labels/order and existing native anchor
behavior. Above 1024px this navigation stays hidden.

Responsively previews checked at 320px and 768px. Browser measurements at
320/390/700/768/820/1024/1025/1440px confirmed no horizontal page overflow and
approximately 48px link heights where visible. Tab and Enter on the recovery
link navigated to `#svc-recovery` and opened the correct disclosure. Lint,
typecheck, all 544 tests and production build passed. This change adds no tests
or client JavaScript. Logs: `.context/services-group-links-{lint,test,typecheck,build}.log`.

## Collapsed service picker — 2026-11-26

The owner selected the compact navigation option from the Hallmark research.
The four anchors now sit inside a native `details`/`summary` labelled “Chọn nhóm
dịch vụ”, closed by default at tablet/mobile widths (≤1024px). The navigation
still stays hidden above 1024px. The first service group remains open by default;
the picker has no exclusive name and does not affect service accordion state.

The summary has a 48px minimum hit target, a decorative chevron and an immediate
sage focus outline. It works without added JavaScript. Existing labels, order,
anchors and booking destinations are preserved; repeated down arrows were removed
from the four anchor labels.

Browser measurements at 320/390/768/1024px found the collapsed navigation is 49px
high, versus approximately 193px for the previous mobile four-row list. Checks at
1025/1440px confirmed it remains hidden. No horizontal page overflow was observed.
Tab reaches the summary with a visible focus ring; Enter opens and closes it;
selecting recovery navigates to `#svc-recovery` and opens the recovery disclosure.
Responsively previews checked at 320px and 768px, with both collapsed and expanded
mobile states inspected. Lint, typecheck, all 544 tests and production build passed.
The existing page regression checks now distinguish the picker from service rows.
Logs: `.context/services-picker-{lint,typecheck,test,build}.log`.

## Web guidance audit (Chrome modern-web-guidance, Vercel web-interface-guidelines)

Applied:

- The `+`/`–` row markers use `content: "+" / ""` (with a plain `content` fallback
  first), so screen readers no longer read the glyph as part of the summary name.
- Display headings use `text-wrap: balance`.
- Font sizes in `services.module.css` are in `rem`, so they follow the browser's
  font-size setting. With the default 16px root the page looks the same; the
  `clamp()` ranges stay within 2.5×.
- `.textLink` has a 44px minimum target, matching the other page links.
- The page sets `--line` locally, so the group picker hairline uses the same warm
  hue as the rows.
- The first service image is the measured LCP at 1440px (on 390px it is the first
  body paragraph), so it gets `fetchPriority="high"` in addition to eager loading.
- Clicking a row summary writes its `#svc-*` hash with `history.replaceState(null, …)`
  (the App Router's documented native History API path); closing the open row
  clears it. No history entries are added. Only clicks write the hash, so client
  navigation to `/services` does not gain `#svc-manual` from the server-open row.
- Process numeral column is `2rem` (32px by default), so the numeral stays clear
  of its heading at 200% text size.
- Checked: hard load, client navigation from `/`, header `#svc-recovery` link
  (settles 222px from the top), legacy `#svc-therapy`, Back/Forward after opening
  a row by hand, and root font-size 200% at 320/1440px with no horizontal overflow.

Kept, contrary to the guides:

- `<h2>` inside `<summary>`: JAWS and TalkBack drop the heading role there. A
  button-in-heading accordion would fix that, but it breaks the documented no-JS
  check (rows open natively and exclusively without JavaScript) and Safari
  find-in-page (`hidden="until-found"` is unsupported).
- Exclusive rows (`name="services"`): recorded above as a deliberate choice.
- The `+`/`–` marker sits at the far edge, not beside the label: owner-approved
  composition.
- The `block-size` open/close animation: Chrome's accordion guide recommends it.
  Vercel's rule against animating layout properties conflicts with that, and
  reduced-motion users get the fade only.
