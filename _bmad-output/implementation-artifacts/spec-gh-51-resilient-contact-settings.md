---
title: "GH-51: Keep contact and booking usable during shared-settings failures"
type: "bugfix"
created: "2026-10-23"
status: "done"
baseline_commit: "0710a6eab8714848f47db8b274aac6052d7a705f"
review_loop_iteration: 0
context: ["PRODUCT.md", "docs/FRONTEND_CHECKLIST.md"]
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** Failed or stalled settings queries break shared layout/contact, preventing requests even when Redis and email work.

**Approach:** Bound settings reads to five seconds, fall back to approved contacts, and ensure cache recovery. Optional service context must not block booking or select an unrelated service.

## Boundaries & Constraints

**Always:** Preserve the sole confirmed clinic at 109/15 Lê Quốc Hưng, P. Xóm Chiếu, TP. Hồ Chí Minh; fallback phone 082 895 9598, email Holisticrep9@gmail.com, hours 09:00–21:00 every day. Keep valid published CMS contact overrides and existing location pinning. Keep `/api/leads` independent of CMS. Record verification and status against GitHub #51/#1.

**Confirmed clarification (2026-10-23):** The owner supplied production `NEXT_PUBLIC_ZALO_ID=4411042584729737012`; use this approved clinic identifier as the default while preserving configured overrides. Record its provenance in PRODUCT.md.

**Ask First:** Broader cache/product changes require agreement.

**Never:** Interrupt production Sanity; mutate or seed a dataset; restore a closed clinic; substitute sample services, treatments, prices, reviews or posts into configured content. Log provider bodies, credentials or visitor data. Treat mocked submissions as inbox-delivery evidence. Rename the current branch.

## I/O & Edge-Case Matrix

| Scenario           | Input / State                                              | Expected Output / Behavior                                 | Error Handling                                         |
| ------------------ | ---------------------------------------------------------- | ---------------------------------------------------------- | ------------------------------------------------------ |
| Published settings | Valid contact overrides plus legacy locations              | Use valid contact overrides, fixed clinic and hours        | Existing field normalization remains                   |
| Missing settings   | Null document or unconfigured CMS                          | Approved contact fallback                                  | No sample publication                                  |
| Settings failure   | Network rejection, 401/403/5xx, invalid result or JSON     | Layout, contact, footer and chat remain renderable         | Catch at shared settings boundary                      |
| Deadline           | Settings never settle or resolve/reject late               | Fallback within 5,000 ms total                             | Abort transport, disable settings retries, clean timer |
| Recovery           | Failure followed by valid published settings               | Fresh settings return under documented finite cache policy | Do not persist error fallback as settings              |
| Booking context    | Absent, repeated, unknown, failed or stalled service query | Usable form without a treatment assignment                 | Absent/repeated context avoids service query           |
| Submission         | Settings unavailable, allowed limiter and accepted email   | Contact and booking return success                         | CMS is never queried by the lead API                   |

</frozen-after-approval>

## Code Map

- `lib/sanity.ts`: unbounded `getSiteSettings`; shared `getPublicSiteData`; content readers preserve authoritative empty/outage distinctions.
- `app/layout.tsx`, `app/contact/page.tsx`, `components/holistic-footer.tsx`: async shared consumers. `components/site-data.tsx` supplies client contact data.
- `app/booking/page.tsx`: optional services catch rejection but can stall. `components/lead-form.tsx` sends optional treatment.
- `lib/content.ts`: approved contact and sole branch; Zalo is environment-only. `components/chat-widgets.tsx`: direct channels.
- `app/api/leads/route.ts`: validation → Redis → Resend, without CMS. Existing `tests/api-leads.test.ts`, `tests/sanity.test.ts`, `tests/services-sanity.test.tsx`, `tests/chat-widgets.test.tsx` cover related contracts.
- Read-only evidence: installed Next `fetch.md`, `caching-without-cache-components.md`; Sanity `src/data/dataMethods.ts`, `src/http/requestOptions.ts`. Configure retries on a dedicated client, not unsupported query options.

## Tasks & Acceptance

**Execution:**

- [x] `lib/sanity.ts` — bound settings reads; catch failures; retain published mapping, request memoization and general content semantics.
- [x] `app/layout.tsx` — bound static fallback revalidation without replacing ISR architecture.
- [x] `app/booking/page.tsx` — bound optional service lookup; never substitute unrelated context.
- [x] `lib/content.ts` and `PRODUCT.md` — add and document the owner-confirmed Zalo default 4411042584729737012; retain one branch.
- [x] `tests/site-settings.test.tsx` and existing booking/API tests — exercise the matrix, async consumers, fake timers, abort/cleanup, late settlement, recovery and API independence.
- [x] `scripts/verify-settings-resilience.mjs` and `.context/` fixtures — production-build failure injection; synthetic browser submissions against a mocked API.
- [x] `docs/SETTINGS_RESILIENCE_VERIFICATION.md` — record baseline results, cache/recovery policy, cold/warm behavior, mock boundaries and screenshots.

**Acceptance Criteria:**

- Given settings errors, when shared consumers render, then approved contacts and exactly one clinic remain available without rejection.
- Given stalled transport, when five seconds elapse, then fallback settles with abort and timer cleanup.
- Given recovery, when finite caches revalidate, then published settings return.
- Given unavailable service context, when booking submits, then no unrelated treatment is sent.
- Given isolated settings failure, when contact/booking open at 320/768/1440 px, then keyboard submission, direct channels and analytics rejection work without overflow.

## Spec Change Log

## Design Notes

Retain the existing 3,600-second settings cache/tag policy and explicitly bound static fallback route revalidation. Test cold build/render and warm cache separately. Five seconds bounds settings, not total TTFB. Browser mock submission proves UI behavior; provider-mocked API tests prove server independence, not inbox delivery.

## Verification

**Commands:**

- `npm run lint`, `npm run typecheck`, `npm test`, `npm run build` — required baseline checks pass.
- `node scripts/verify-settings-resilience.mjs` — isolated failures, deadlines and recovery are reproducible without production access. Use server-side transport injection/preload in an isolated build; never add a production failure toggle. Browser automation may use the available Playwright MCP. Keep fixtures repeatable and do not print request bodies.
- Production browser checks — both pages at all three widths; keyboard/skip link, reject consent and reload, synthetic submit, links, console and overflow; screenshots under `.context/`.
- `git diff --check` — clean patch formatting.

## Suggested Review Order

**Shared boundary**

- Bound settings failures and deadlines before shared consumers receive data.
  [sanity.ts:299](../../lib/sanity.ts#L299)

- Disable retries and abort reads while also bounding transports that ignore abort.
  [sanity.ts:37](../../lib/sanity.ts#L37)

**Recovery**

- Keep fallback-rendered HTML on a finite revalidation schedule.
  [layout.tsx:10](../../app/layout.tsx#L10)

**Booking isolation**

- Treat optional service context as bounded and match only its exact group.
  [sanity.ts:219](../../lib/sanity.ts#L219)

- Use bounded optional context before rendering the existing request form.
  [page.tsx:17](../../app/booking/page.tsx#L17)

**Approved contacts**

- Retain the sole clinic and use the owner-confirmed Zalo default.
  [content.ts:87](../../lib/content.ts#L87)

**Evidence**

- Explain cache layers, recovery limits and mock boundaries.
  [SETTINGS_RESILIENCE_VERIFICATION.md:8](../../docs/SETTINGS_RESILIENCE_VERIFICATION.md#L8)

- Exercise real async consumers, fake timers and late settlements.
  [site-settings.test.tsx:1](../../tests/site-settings.test.tsx#L1)

- Check lead acceptance stays independent of unavailable CMS.
  [api-leads.test.ts:68](../../tests/api-leads.test.ts#L68)

- Reproduce failures and cache recovery with an isolated production build.
  [verify-settings-resilience.mjs:1](../../scripts/verify-settings-resilience.mjs#L1)

- Verify keyboard forms, rejected analytics and direct contact channels at three widths.
  [settings-resilience-browser.mjs:1](../../scripts/fixtures/settings-resilience-browser.mjs#L1)
