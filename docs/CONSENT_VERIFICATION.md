# Consent and analytics verification (#19)

Verified 2026-11-08 on a production build (`NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID=GTM-TEST123`) with Google hosts route-mocked in Playwright Chromium. No real GTM container or GA property was used.

## Rules

- Consent lives in the `holisticvn-cookie-consent-v1` cookie (`accepted` / `rejected`, 12 months). No choice = rejected.
- GTM loads only when the cookie is `accepted`. `track()` pushes only then and never receives name, phone, email or message.
- The first page view of a document belongs to the GTM container. `PageViewTracker` pushes `page_view` with `page_path` for later client navigations only. Confirm the container does not also fire a History Change page view at the launch gate, or navigations will count twice.
- Footer "Tùy chọn cookie" deletes the choice and `_ga*`/`_gid`/`_gat*` cookies, then reloads so no tag stays loaded and the banner asks again with focus on its first button. Rejecting also clears those cookies.
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

## Not verified

Real GTM/GA containers and tags, physical devices, screen readers, and Safari. The new policy copy needs owner review.
