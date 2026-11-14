---
title: "Make the services layout readable and usable across screen widths"
type: "feature"
created: "2026-11-14"
status: "done"
baseline_commit: "a5bd2debfdbc731421671a51b185cb631c7eb1b7"
review_loop_iteration: 0
context:
  - "{project-root}/AGENTS.md"
  - "{project-root}/PRODUCT.md"
  - "{project-root}/docs/FRONTEND_CHECKLIST.md"
  - "{project-root}/design-plans/services-layout-plan.md"
  - "{project-root}/design-plans/services-mobile-discovery.md"
  - "{project-root}/design-plans/services-responsive-cta.md"
  - "{project-root}/design-plans/services-unobscured-content.md"
---

<frozen-after-approval reason="User approved the concrete plans and requested implementation on 2026-11-14">

## Intent

**Problem:** Mobile visitors encounter the expanded first service before discovering the remaining choices; floating contacts and consent obscure content. At 1024px, closing CTA buttons squeeze its copy into a narrow column.

**Approach:** Implement the three approved linked plans as one cohesive services layout update: mobile anchor navigation, responsive CTA, and route-specific inline contacts/consent. The existing plans are the detailed UI contract; preserve their constraints while resolving ordinary implementation choices autonomously.

## Boundaries & Constraints

**Always:** Work in the current branch/workspace. Keep native exclusive details, first-open server HTML, CMS order/labels, static service anchors and legacy alias, booking context, recovery cards, training link, Vietnamese content, current fonts/colors/photos. Read installed Next.js docs before code. Keep contacts from resolved public settings and preserve consent-gated chat_click events. Modify the shared chrome only through the explicit services variant; other routes retain defaults. User authorization already covers all three plans and existing untracked plan files.

**Ask First:** Any substantive change to product scope, medical copy, CMS data/schema, or contact identity; ordinary layout/test choices do not need renewed permission.

**Never:** Push, rename branches, publish/deploy, mutate CMS, change dependency versions, create new routes, add sticky docks or replace the accordion. Do not invoke bmad-build recursively or stop to reapprove the already approved plan. Do not commit changes during implementation.

</frozen-after-approval>

## Code Map

- `app/services/page.tsx`, `services.module.css`: server services map and local styling. Add a <=860px two-column wrapping group nav before the details, sourced from the actual service records. Move CTA column breakpoint from980 to1280 without changing panel/process breakpoints. Add contact links to intro and closing CTA, with an action-side wrapper.
- `app/services/hash-open.tsx`: existing hash/click/legacy opening owner; preserve and verify. Only fix here if browser evidence reveals navigation failure.
- `lib/sanity.ts`: `getServices` and cached `getPublicSiteData`; resolve in parallel in ServicesPage. Reader/query/data stay unchanged.
- `app/services/services-contact-links.tsx` (new): thin client adapter receiving public site data and light/dark tone, preserving dial/zalo/messenger chat_click via `components/gtm.tsx` track. Native links must remain SSR-visible.
- `components/site-chrome.tsx`: omit floating chat on exact `/services`; render one inline CookieConsent after nav. Other routes/defaults/Studio preserved.
- `components/cookie-consent.tsx`, `app/globals.css`: optional layout default floating; inline data attribute and styles. Only floating publishes --cookie-h; cleanup on transition. Inline does not trigger footer fixed-banner padding. Existing persistence, reload, preference focus and analytics gates stay intact.
- `app/contact/page.tsx`: in-flow links/data exemplar. `components/chat-widgets.tsx`: URL/analytics exemplar; do not change visibility logic.
- `tests/services-sanity.test.tsx`: CMS order, links, aliases, exclusive disclosure; fetch fixtures may need query dispatch for public settings.
- `tests/consent.test.tsx`, `tests/chat-widgets.test.tsx`: consent/hydration coverage. Add meaningful integration tests for route variants and link events using existing React/happy-dom conventions.
- `DESIGN.md`: maintain Services description and new route-specific overlay exception after implementation; stale hero/dive wording is not a requirement to restore it.

## Tasks & Acceptance

**Execution:**

- [x] Implement mobile group navigation and preserve disclosure/hash behavior.
- [x] Implement responsive CTA including wrapping/long-label resilience.
- [x] Implement inline contact adapter, services chrome variant and inline consent.
- [x] Cover changed data/route/consent/tracking behavior with meaningful regression tests.
- [x] Run repository checks and document actual results; update design/verification documentation.

**Acceptance Criteria:**

- Given partial/reordered/empty CMS service records, when rendered, navigation matches only existing groups in their order or is absent when empty; booking/treatment links still resolve from the same data.
- Given widths320/390/768/860/861/980/1024/1280/1281/1440, when viewed, content stays inside its frame; nav appears only<=860, CTA stacks<=1280 and mobile buttons stack<=700. Long labels wrap without clipping.
- Given initial/direct/legacy/repeated hash navigation, when a group is selected, the intended disclosure is visible and native exclusivity survives. Without JS, summaries still operate and links target real summaries.
- Given services or another public route, when navigating between them, services has inline contact links and exactly one inline banner when consent is needed, no floating chat; other routes recover the existing fixed/banner/chat presentation with no stale cookie height. Studio has no marketing chrome.
- Given optional Zalo/Messenger settings, when contacts render/click, channels match resolved public data and preserve chat_click channel semantics without tracking before consent.
- Given accepted/rejected/blocked storage or reopened preferences, when using the inline banner, existing consent behavior remains and content is not obscured by that banner.

## Spec Change Log

## Design Notes

All plans were already approved by the user; this spec records the execution handoff rather than asking again. No user testing or conversion uplift is claimed. Layout values are verified using browser measurements and screenshots, not CSS snapshot tests. Local screenshot evidence belongs under `.context/`; GitHub #41 under #1 remains task-status authority. New public copy is limited to functional navigation/contact labels.

## Verification

- `npm run lint`, `npm run typecheck`, `npm test`, `npm run build`: pass without new warnings. Use installed executables, no dependency installation.
- Real browser at320/768/desktop plus breakpoint neighbors, keyboard, zoom200%, reduced motion, each group open, contact/consent variants, hash aliases, no-JS. Capture after images under `.context/`.
- Record fallback and real Sanity testing separately; do not claim staging verification without credentials/configuration. Do not send real booking requests.

## Suggested Review Order

**Services composition**

- Follow the page composition, shared data, group navigation and closing actions.
  [page.tsx:26](../../app/services/page.tsx#L26)

- Check the navigation and responsive CTA layout against the approved widths.
  [services.module.css:89](../../app/services/services.module.css#L89)

**Route-specific overlays**

- Services replaces floating controls while other public routes retain their defaults.
  [site-chrome.tsx:19](../../components/site-chrome.tsx#L19)

- Inline consent preserves choices and cleans up floating height measurements.
  [cookie-consent.tsx:30](../../components/cookie-consent.tsx#L30)

- Verify inline positioning and fixed-banner footer spacing isolation.
  [globals.css:178](../../app/globals.css#L178)

**Contact behavior**

- Native links preserve public contact values and consent-gated channel events.
  [services-contact-links.tsx:7](../../app/services/services-contact-links.tsx#L7)

**Evidence and regressions**

- Review route changes with unset and saved consent.
  [site-chrome.test.tsx:58](../../tests/site-chrome.test.tsx#L58)

- Review both banner variants and blocked-storage behavior.
  [consent.test.tsx:190](../../tests/consent.test.tsx#L190)

- Read browser evidence and explicitly unverified environments.
  [services-layout-verification.md:1](../../docs/services-layout-verification.md#L1)
