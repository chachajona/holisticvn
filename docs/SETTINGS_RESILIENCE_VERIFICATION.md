# GH-51 settings resilience verification

Recorded 2026-10-23 against baseline `0710a6eab8714848f47db8b274aac6052d7a705f`.
Application revision: `d834a018099c1723fbfc84f848e37d2a0490efbc`.
Tracking: GitHub #51, child of #1. Implementation, BMad review and local verification are complete. No dataset or remote issue was changed; GitHub #51 remains open pending integration.

## Behavior and cache policy

`getSiteSettings` catches transport, JSON and schema failures at the shared boundary.
It returns `null`, letting layout, contact, footer and client site data use the
approved phone, email, daily hours and sole Lê Quốc Hưng clinic. Valid published
contact overrides still win; legacy CMS locations cannot reopen a closed branch.
The owner-confirmed Zalo default is `4411042584729737012`; environment and valid CMS
overrides still work. Its provenance is recorded in `PRODUCT.md`.

Settings and optional booking service context use a separate Sanity client with
`maxRetries: 0`, a 5,000 ms transport timeout, and an outer 5,000 ms deadline. The
outer timer aborts stalled transport and settles even if a transport ignores the
signal. Its timer is cleared on success, failure and timeout, and late resolution
or rejection cannot change the returned fallback. The five seconds bound each
settings read, not total route TTFB. Other content readers keep their existing
empty-dataset, error and caching behavior.

The existing successful-response data cache remains `next.revalidate: 3600` with
the `sanity` tag. React `cache` still shares a settings read within a server render;
passing an abort signal opts out of native fetch memoization, so this explicit
React memoization matters. No caught error fallback object is put in a persistent
settings cache. The root layout also exports `revalidate = 3600`: even a cold build
that receives no cacheable settings response creates finite ISR fallback HTML.

These are separate cache layers. A warm static page can keep fallback contacts
until its next request after the one-hour interval starts revalidation. A valid
warm settings response can hide a later transport outage until data revalidation.
A malformed HTTP-200 response can enter Next's raw fetch cache and remain there
for an hour even though application validation rejects it. Next can serve that
stale raw response while refreshing it in the background; a static route can then
regenerate fallback HTML for a second one-hour interval. Recovery is demand driven
and can require two successful revalidation cycles across the layers, rather than
being a wall-clock one-hour delivery guarantee. The existing authenticated Sanity
webhook expires the shared tag and layout paths when used.

Booking skips service lookup when context is absent, repeated or unknown. A valid
group receives only its exact published match; failed, stalled or missing matches
omit `treatment` from the form submission. `/api/leads` remains independent of CMS:
its validation → Redis limiter → email acceptance path is unchanged.

## Required checks

| Check               | Baseline                                        | Implementation                  |
| ------------------- | ----------------------------------------------- | ------------------------------- |
| `npm run lint`      | Passed                                          | Passed                          |
| `npm run typecheck` | Passed                                          | Passed                          |
| `npm test`          | 362 tests / 49 files passed                     | 387 tests / 50 files passed     |
| `npm run build`     | Passed; `/contact` had no finite route interval | Passed; `/contact` reports `1h` |
| `git diff --check`  | —                                               | Passed                          |

New `tests/site-settings.test.tsx` covers published mapping, missing/unconfigured
CMS, invalid results, network/status/JSON failure, actual async layout/contact/footer
calls, direct chat channels, five-second fake timers, abort and cleanup, late
settlements, recovery and Zalo overrides. Existing booking tests now cover stalled
context and unrelated-service avoidance. API tests mock an unavailable CMS plus
allowed limiter/accepted email for both contact and booking; neither calls CMS.

## Isolated production reproduction

Run `node scripts/verify-settings-resilience.mjs`. The harness acquires an exclusive
run lock before replacing its isolated build, clears old pass evidence and screenshots,
and preserves logs across restarts. Independent 15-second page deadlines and a
five-second shutdown grace prevent a broken application from hanging verification.
A second invocation fails without deleting an active fixture. Add `--serve` to keep the fixture
running for browser checks. The script builds a separate allowlisted source copy
under `.context/settings-resilience/site`, uses the installed dependencies and
loads `scripts/fixtures/settings-resilience-preload.mjs` only through that child
process's `NODE_OPTIONS`. No production failure toggle enters application code.

The child environment omits local `.env` files and credentials. Only synthetic
`resiliencefixture.api.sanity.io` queries to dataset `verification` are answered;
other external fetches and non-query Sanity operations fail. Other CMS content is
authoritatively empty. Settings and service fixtures are test-only data and never
published. Transport evidence records target, mode and abort only, without URLs,
provider bodies, credentials or visitor payloads.

The harness checks cold build failure, warm cached HTML, the production failure
matrix, one settings read per dynamic render, aborted stalled settings/services,
expired fallback HTML recovery, warm successful data during an outage and recovery
from cached malformed HTTP-200 data. It accelerates time only by aging file times
and `routeCacheLastModified` in the isolated `.next/server/app`,
`.next/server/route-cache` and `.next/cache/fetch-cache` trees while the child server
is stopped. It does not change the production one-hour policy or wait an actual
hour. Next 16.3's promoted ISR artifacts are separate from immutable build seeds;
both are aged. Child servers are restarted to discard memory caches.

Machine evidence: `.context/settings-resilience/results.json`,
`transport-events.jsonl`, `build.log` and `server.log`.

All 15 production checks passed after review patches. Dynamic errors rendered in
69–89 ms; the stalled settings/service case completed in 5,063 ms and recorded both aborts. Every dynamic
failure used one settings read. Expired fallback HTML changed from `STALE` to `HIT`
with the published fixture contacts; warm valid settings served through a new
outage without a transport read. Malformed HTTP-200 data recovered after expiry on dynamic booking and static contact.
The static case recovered in one accelerated revalidation cycle in this run; the
policy still allows the second cycle described above. Settings failure with healthy
services retained the exact published training context.

## Browser reproduction and evidence

With `--serve` running, execute the generated
`.context/settings-resilience/browser-check.cjs` through Playwright MCP's
`browser_run_code_unsafe` `filename` parameter. Its source is maintained in
`scripts/fixtures/settings-resilience-browser.mjs`; it needs no added project
dependency. Save the returned JSON result as
`.context/settings-resilience/browser-results.json`. Each of nine cases uses a fresh browser context against the production
build with settings/service failures: `/contact`, `/booking` and `/booking?service=training`
at widths 320, 768 and 1440 px.

The fixture checks first-Tab skip-link focus and activation, one `h1`, approved
phone/email/Zalo links, exactly one clinic, cookie rejection and reload persistence,
zero tracker requests, horizontal overflow, real Tab navigation and keyboard typing/submission, and console/page
errors. Direct footer channels must be visible and reachable by Tab. Submitted
kind must match the route; rejected consent must produce no dataLayer events. It intercepts `/api/leads` with a synthetic success, verifies absent
`treatment`, and records only submission kind and treatment absence.

All nine cases passed, with zero console/page errors, zero tracking requests, no
horizontal overflow and one synthetic keyboard submission per case. Representative screenshots
were inspected across all three widths.

Browser submissions demonstrate UI behavior only. The API unit tests demonstrate
server independence with mocked limiter/email providers. Neither demonstrates
Resend delivery or inbox receipt. There was no access to a production dataset,
Redis limiter or real email transport.

Screenshots and browser machine evidence are saved under
`.context/settings-resilience/`: `contact-320.png`, `contact-768.png`,
`contact-1440.png`, `booking-320.png`, `booking-768.png`, `booking-1440.png`,
`booking-context-error-{320,768,1440}.png`, and
`browser-results.json`. This directory is intentionally ignored by git; rerun the
tracked harness and browser fixture to regenerate it.

## Post-refactor browser rerun

Reran on 2026-10-23 at 13:08 UTC using Chromium 155.0.8059.85 and the current
working tree. All 15 isolated production checks and all nine browser cases passed.
The browser cases covered the same three routes at 320, 768 and 1440 px, with zero
console errors/warnings and tracking requests, no horizontal overflow, working
keyboard submissions and direct contact links, and persistent cookie rejection.
Representative screenshots were inspected across all three widths. Fresh results
and nine screenshots are in `.context/settings-resilience/`; `/api/leads` remained
mocked, so this run does not establish email delivery.
