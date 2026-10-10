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
| Mobile hero destinations                                               | **Gap in the original run**, resolved by the 2026-10-10 follow-up below                                                                                    |
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

## Mobile fixes follow-up — 2026-10-10

The production review found chat links covering the cookie consent button at
320/390 px, and mobile hero controls without destination links. These fixes were
verified against a local production build in Chrome; the protected Vercel preview
was not accessible and production still serves the earlier main-branch build.

- Chat now uses the cookie banner's measured height to sit above it on mobile and
  returns to its usual 16 px bottom offset after either consent choice. The banner
  and its buttons wrap when text is enlarged.
- Mobile chips and swipe still select a step. A separate native link follows that
  selection: consultation → `/booking`, therapy → `/treatments`, training →
  `/services#svc-training`. Labels name the destination and the arrow is decorative.
- Browser checks passed at **320, 390, 500, 700, 701, 768, 1024 and 1440 px** with
  all three chat links enabled using local fixture IDs. Every cookie button was
  hit-tested at 5%, 50%, 85% and 95% of its width after scrolling 500 px. Mobile chat
  cleared the entire banner by at least 12 px, including with root text size enlarged
  to 200%. Accept and reject persisted after reload and restored the chat offset.
- All three mobile destination links opened the intended page at every tested
  mobile width. Tab reached the destination after the last chip; the focus outline
  was visible and Enter opened the training anchor. Scrolling updated the link and
  pressed chip with reduced motion enabled.
- With normal motion at 320/390 px, smooth chip selection and simulated touch swipe
  updated the destination. Keeping focus on the link for longer than the autoplay
  interval held the selected step, and Enter opened the correct page.
- No horizontal overflow, broken loaded images or browser errors were observed.
  The new link uses the existing ink/milk tokens on a solid background, independent
  of photo contrast. No form was submitted or chat destination opened.
- Three server-rendering regression cases verify native destination links alongside
  the chip controls. All three fail against the original component and pass with
  the fix. The full suite passed: **64 tests across 15 files**. Lint, typecheck,
  production build, tracked-file formatting and the existing HTTP smoke also passed.

Local evidence is in `.context/deployment-review/mobile-fixes-results.json`,
`mobile-hero-touch-results.json`, `fixed-cookie-*.png` and `fixed-hero-*.png`.
The browser scripts and screenshots are workspace artifacts, not CI browser tests.

## Not covered

- Real device touch and screen reader passes.
- Real submission to `/api/leads` (mocked here).
- Real Sanity data and the owner questions in the Sanity spec (issue #37).
- Protected preview deployment and verification of these fixes on production after merge.
