# Homepage verification

Issue [#7](https://github.com/chachajona/holisticvn/issues/7). Run 2026-10-09 against a production build (`npm run build && npm run start`, port 3100) with Playwright in Chromium. Screenshots stay local in `.context/verify-7-*.png`.

## Checks

| Check                                                                  | Result                                                                                                                                                     |
| ---------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `npm run lint`, `tsc --noEmit`, `npm test` (59 tests), `npm run build` | Pass                                                                                                                                                       |
| Every internal homepage link (10 unique) returns 200                   | Pass. Each `#anchor` id exists on its target page. `tests/home-copy.test.ts` also enforces this                                                            |
| Desktop hero panels click through                                      | Pass: Tư vấn → `/booking`, Trị liệu → `/treatments`, Tập luyện → `/services#svc-training`                                                                  |
| Desktop hero keyboard                                                  | Pass: Tab moves between panels, the focused panel opens, visible outline, Enter follows the link                                                           |
| Hero autoplay (desktop and mobile)                                     | Advances every ~4.5s. Pauses on hover, focus and after a chip click. Does not run with `prefers-reduced-motion: reduce`. Owner keeps autoplay (2026-10-09) |
| Mobile hero chips and swipe (390px)                                    | Pass: chip click and scroll update the pressed chip                                                                                                        |
| Mobile hero destinations                                               | Chips/swipe select images; the extra destination link was removed at the owner’s request (2026-10-10)                                                      |
| Quick consult pending                                                  | Pass: button disabled, label "Đang gửi"                                                                                                                    |
| Quick consult success (mocked 200)                                     | Pass: toast "Đã nhận yêu cầu. Holistic sẽ gọi lại để tư vấn; lịch hẹn sẽ được xác nhận sau."; field cleared; payload `source: home-hero`                   |
| Quick consult failure (mocked 500, 400, network abort)                 | Pass: error toast with "Gọi ngay" (`tel:0828959598`); the typed number is kept; 400 shows the server message                                               |
| Services carousel (Embla)                                              | Pass at 1440: next/prev arrows, aria-disabled at both ends, right fade hides at the end, drag, 8 slides, Tab through every card scrolls it into view       |
| Services carousel on mobile                                            | Pass at 320, 390, 768: swipe works, the next card peeks, arrows hidden below 700px                                                                         |
| Horizontal overflow at 320, 390, 768, 1440                             | None                                                                                                                                                       |
| Layout shift on load (CLS) at 320, 390, 768, 1440                      | 0 at each width                                                                                                                                            |
| Broken images                                                          | 0                                                                                                                                                          |
| Hero CTAs and quick-consult not covered (hit test)                     | Pass at 320, 390, 768, 1440                                                                                                                                |
| Console                                                                | No errors from the page. The only error comes from the mocked failure cases. Next logs unused-preload warnings for two CSS chunks                          |

## Cookie/chat fix and mobile hero decision — 2026-10-10

The production review found chat links covering the cookie consent button at
320/390 px. The chat fix was verified against a local production build in Chrome;
the protected Vercel preview was not accessible.

- Chat uses the cookie banner's measured height to sit above it on mobile and
  returns to its usual 16 px bottom offset after either consent choice. The banner
  and its buttons wrap when text is enlarged.
- Browser checks passed at **320, 390, 500, 700, 701, 768, 1024 and 1440 px** with
  all three chat links enabled using local fixture IDs. Every cookie button was
  hit-tested at 5%, 50%, 85% and 95% of its width after scrolling 500 px. Mobile chat
  cleared the entire banner by at least 12 px, including with root text size enlarged
  to 200%. Accept and reject persisted after reload and restored the chat offset.
- An extra selected-step destination link was initially added below the mobile
  chips. The owner requested its removal on 2026-10-10. The final mobile hero keeps
  the original chips, swipe and quick-consult form, with no additional destination
  button. The link labels, styles and three tests for the removed link were deleted.
  Desktop hero destination links are unchanged.

Cookie evidence is in `.context/deployment-review/mobile-fixes-results.json` and
`fixed-cookie-*.png`. Hero link checks and screenshots from the earlier revision
are historical evidence and do not describe the final mobile hero.

## Review fixes — 2026-10-10

PR #39 review findings were reproduced against `687e7e3` and fixed locally:

- The homepage reads only the Instagram Redis cache. Meta synchronization and
  token refresh remain in the authenticated scheduled route. A separate server
  component and Suspense boundary prevent a slow feed read from holding the hero.
- Services default to visible cards and native horizontal scrolling. Reveal and
  Embla styles activate after client initialization. Quote highlights likewise
  remain visible before JavaScript enhancement.
- Desktop hero images use lazy loading and retain the desktop-only default-image
  preload. No additional mobile destination button was introduced.
- Testimonial seed planning retains the approved Thanh X. excerpt; omitted reviews
  are Thái Đ., Nhi L. and Giang T., with outcome-claim flags matching their content.
  Maps documentation now matches the deliberate same-tab links. Legacy testimonial
  history and the inventory status column were corrected.

Verification against local production builds:

- **67 tests across 16 files**, zero-warning lint, typecheck, production build and
  HTTP smoke passed. The new regression tests produced five failures against the
  previous source: synchronous feed refresh/bootstrap, token replacement, blocked
  streaming and eager desktop hero loading.
- Chrome passed at **320, 390, 700, 701, 768, 1024 and 1440 px**, with JavaScript
  enabled and disabled: eight service cards, native scrolling and keyboard access
  without JavaScript, initialized carousel swipe/arrows with JavaScript, visible
  quote highlights, no page overflow and no browser errors. Reduced motion passed.
- With JavaScript enabled, hidden desktop hero images were not requested on mobile;
  the active desktop hero image loaded at widths above 700 px. Chrome disables native
  lazy loading when JavaScript is disabled, so that mode still downloads hidden
  images. The service and highlight fallbacks remain usable in that mode.
- A configured-feed production build used a local Redis fixture without Meta calls.
  With a **3,000 ms** Redis response, hero HTML arrived after **123 ms** and the feed
  completed after **3,129 ms**. With a **6,000 ms** response, hero HTML arrived after
  **21 ms** and the feed failed safely at the **5,039 ms** timeout. Both requests made
  only a Redis `GET`; no sync or cache write ran during page rendering. These are
  local timings, not production latency or LCP measurements.

Evidence stays in `.context/review-fixes/`: `before.json`,
`before-regression.log`, `browser-results.json`, `streaming-results.json` and
`after-services-*.png`. The real Instagram account, Safari, physical devices and
protected Vercel preview remain unverified.

## Not covered

- Real device touch and screen reader passes.
- Real submission to `/api/leads` (mocked here).
- Real Sanity data and the owner questions in the Sanity spec (issue #37).
- Protected preview deployment and verification of these fixes on production after merge.
