# Homepage verification

Issue [#7](https://github.com/chachajona/holisticvn/issues/7). Run 2026-10-09 against a production build (`npm run build && npm run start`, port 3100) with Playwright in Chromium. Screenshots stay local in `.context/verify-7-*.png`.

## Checks

| Check                                                                  | Result                                                                                                                                                                                       |
| ---------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `npm run lint`, `tsc --noEmit`, `npm test` (59 tests), `npm run build` | Pass                                                                                                                                                                                         |
| Every internal homepage link (10 unique) returns 200                   | Pass. Each `#anchor` id exists on its target page. `tests/home-copy.test.ts` also enforces this                                                                                              |
| Desktop hero panels click through                                      | Pass: Tư vấn → `/booking`, Trị liệu → `/treatments`, Tập luyện → `/services#svc-training`                                                                                                    |
| Desktop hero keyboard                                                  | Pass: Tab moves between panels, the focused panel opens, visible outline, Enter follows the link                                                                                             |
| Hero autoplay (desktop and mobile)                                     | Advances every ~4.5s. Pauses on hover, focus and after a chip click. Does not run with `prefers-reduced-motion: reduce`. Owner keeps autoplay (2026-10-09)                                   |
| Mobile hero chips and swipe (390px)                                    | Pass: chip click and scroll update the pressed chip                                                                                                                                          |
| Mobile hero destinations                                               | **Gap**: slides and chips on mobile are not links, so mobile hero has no direct path to `/booking`, `/treatments` or `/services#svc-training`. Quick links and the consult form are below it |
| Quick consult pending                                                  | Pass: button disabled, label "Đang gửi"                                                                                                                                                      |
| Quick consult success (mocked 200)                                     | Pass: toast "Đã nhận yêu cầu. Holistic sẽ gọi lại để tư vấn; lịch hẹn sẽ được xác nhận sau."; field cleared; payload `source: home-hero`                                                     |
| Quick consult failure (mocked 500, 400, network abort)                 | Pass: error toast with "Gọi ngay" (`tel:0828959598`); the typed number is kept; 400 shows the server message                                                                                 |
| Services carousel (Embla)                                              | Pass at 1440: next/prev arrows, aria-disabled at both ends, right fade hides at the end, drag, 8 slides, Tab through every card scrolls it into view                                         |
| Services carousel on mobile                                            | Pass at 320, 390, 768: swipe works, the next card peeks, arrows hidden below 700px                                                                                                           |
| Horizontal overflow at 320, 390, 768, 1440                             | None                                                                                                                                                                                         |
| Layout shift on load (CLS) at 320, 390, 768, 1440                      | 0 at each width                                                                                                                                                                              |
| Broken images                                                          | 0                                                                                                                                                                                            |
| Hero CTAs and quick-consult not covered (hit test)                     | Pass at 320, 390, 768, 1440                                                                                                                                                                  |
| Console                                                                | No errors from the page. The only error comes from the mocked failure cases. Next logs unused-preload warnings for two CSS chunks                                                            |

## Not covered

- Real device touch and screen reader passes.
- Real submission to `/api/leads` (mocked here).
- Mobile hero destinations (see gap above) and the owner questions in the Sanity spec (issue #37).
