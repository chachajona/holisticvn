# Consent and analytics verification (#19)

Verified 2026-11-08 on a production build (`NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID=GTM-TEST123`) with Google hosts route-mocked in Playwright Chromium. No real GTM container or GA property was used.

## Rules

- Consent lives in the `holisticvn-cookie-consent-v1` cookie (`accepted` / `rejected`, 12 months). No choice = rejected.
- GTM loads only when an `accepted` cookie is visible and no `rejected` cookie is visible. A rejection overrides stale acceptance at another cookie path or domain. `track()` applies the same rule and never receives name, phone, email or message.
- The first page view of a document belongs to the GTM container. `PageViewTracker` pushes `page_view` with `page_path` for later client navigations only. Confirm the container does not also fire a History Change page view at the launch gate, or navigations will count twice.
- Footer "Tùy chọn cookie" deletes the choice (at the root and every path prefix of the current page) and `_ga*`/`_gid`/`_gat*` cookies, then reloads so no tag stays loaded and the banner asks again with focus on its first button. Rejecting also clears those cookies.
- Cookies blocked: the banner hides for the current page view without reloading; nothing is pushed.
- Newsletter has no UI in the app, so there is no newsletter event. Chat/call/Zalo/Messenger are plain links with no SDK. Instagram images go through `next/image`, so the browser never contacts Meta's CDN.

## Evidence

| State                                      | Result                                                                                      |
| ------------------------------------------ | ------------------------------------------------------------------------------------------- |
| No choice, then client navigation          | 0 requests to Google hosts, `dataLayer` absent, banner shown                                |
| Accept                                     | banner gone, one GTM request, `gtm.js` start event                                          |
| Client navigation after accept             | one `page_view` each: `/services`, `/treatments`                                            |
| Reload                                     | choice persists, banner stays hidden                                                        |
| Footer revoke (with `_ga`, `_ga_TEST` set) | all cookies removed, banner back, focus on "Từ chối", hash removed from URL, no `dataLayer` |
| Reject, then navigation                    | 0 new Google requests, no `dataLayer`, only the `rejected` cookie                           |
| Booking submit failure (HTTP 500, mocked)  | no event                                                                                    |
| Booking submit success (mocked)            | exactly one `booking_submit`                                                                |
| 320 px banner                              | 300 px wide, no horizontal overflow                                                         |

Unit tests: `tests/consent.test.tsx` (13). Full suite 504 tests, lint, typecheck and format pass.

## Review regressions (2026-11-09)

- Reproduced conflicting path cookies before the fix: both `track()` and the GTM bootstrap allowed analytics despite a visible rejection. Regression tests now cover both root acceptance / narrower-path rejection and root rejection / narrower-path acceptance.
- Added a cookie-jar test at `www.holisticvn.com` with `_ga` on both the host and `holisticvn.com`, plus host-domain `_ga_*` and parent-domain `_gid`. Withdrawal removes those identifiers and preserves unrelated cookies at both scopes. The existing domain cleanup needed no code change.
- Verified in isolated Playwright Chromium contexts against the local production build, with a synthetic `www.holisticvn.com` origin routed locally, images stubbed and Google responses mocked. Both conflicting-consent cases generated zero Google requests and no analytics events. Footer withdrawal removed host and parent-domain Google cookies, preserved unrelated cookies, made no further Google requests and focused "Từ chối". No page errors occurred.
- Consent tests: 19; full suite: 510. Lint, typecheck, format, production build and production smoke checks pass.

- Withdrawal now expires the choice cookie at every path prefix of the current page, so a stale `accepted` cookie at e.g. `/services` no longer survives the footer control.
- If GTM is already running and a rejection that is only visible on the new path appears after client navigation, `PageViewTracker` clears Google cookies and reloads; the bootstrap gate then keeps GTM off. Consent Mode was not used because the container's tags are not configured for it. Between navigation and reload a tag with its own trigger could still fire; this is a known ceiling.
- Consent tests: 21.

## Banner copy and cookie policy (2026-11-10)

- Banner is one sentence stating the purpose ("cookie phân tích để cải thiện website, chỉ khi bạn đồng ý") plus the Chính sách cookie link. "Từ chối" and "Chấp nhận" share the `.button` style so neither choice is visually demoted; a unit test pins both.
- `/cookie-policy` now also names the `_ga` cookies, the identifiers and IP/device data Google may receive, possible processing outside Vietnam, and the controller's address and email (from `site` in `lib/content.ts`).
- Basis: Law 91/2025/QH15 Art. 9 (consent must be informed, specific and not silent) and Decree 356/2025/NĐ-CP Art. 6 (no default consent, consent must be stored and provable). This is a developer reading from secondary sources, not legal advice.
- Controller identity (name, tax ID) was supplied by the owner on 2026-11-10 and checked by the owner on masothue.com (tax ID 8596619400-001; the registry spells the name "HOLISITC ... PERFORMANCES"). Retention: no real GA property exists yet, so `/cookie-policy` says retention is set by HolisticVN in Google Analytics and gives no number (cookies: Google default, up to 2 years); replace with the real figure once GA4 Data retention is set. Open: the choice is stored only in a browser cookie, so there is no server-side proof of consent.

## Not verified

Real GTM/GA containers and tags, physical devices, screen readers, and Safari. The new policy copy needs owner review.
