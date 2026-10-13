---
title: "Address verified Methods review regressions in PR 44"
type: "bugfix"
created: "2026-10-13"
status: "done"
baseline_commit: "5c61b969f9e3445209da519e41e9fb9f3da0ce4c"
review_loop_iteration: 0
context:
  - "{project-root}/AGENTS.md"
  - "{project-root}/PRODUCT.md"
  - "{project-root}/docs/FRONTEND_CHECKLIST.md"
---

<frozen-after-approval reason="user authorized verifying and fixing attached review comments">

## Intent

**Problem:** Eight review findings identify regressions in the Methods explorer and its documented static and reduced-motion fallbacks. Browser reproduction confirms closed fragment targets, incorrectly expanded unfiltered rows, invisible no-JavaScript bodies and pathway dots, and animated reduced-motion chevrons; code inspection confirms the remaining findings.

**Approach:** Repair state precedence, CSS sizing and capability gating within the existing components. Preserve the reviewed page structure, native controls, CMS/fallback content and treatment anchors while adding behavioral regression coverage.

## Boundaries & Constraints

**Always:** Keep one condition and one goal with OR matching, preserve treatment links and real content, respect reduced motion and touch-only static decoration, make repeated fragment visits open their target while permitting later manual closure, follow existing Vitest patterns, and record honest verification. Read installed Next.js documentation before implementation. Work on the existing branch.

**Ask First:** Changes to product scope, public wording, data/schema, dependencies or deployment configuration beyond these verified fixes.

**Never:** Rewrite the design, disable existing tests, introduce another animation library, modify remote CMS data, merge the PR, or commit credentials/browser output.

## I/O & Edge-Case Matrix

| Scenario                 | Input / State                                                                            | Expected Output / Behavior                                                               | Error Handling                                                    |
| ------------------------ | ---------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- | ----------------------------------------------------------------- |
| Repeated fragment visit  | Unfiltered row manually opened then closed; same hero/footer fragment visited repeatedly | Each visit opens the target; a later toggle can close it again                           | Existing anchors remain valid                                     |
| Both categories cleared  | Choose a condition and goal; clear each to the empty value                               | No selected tags; rows have their unfiltered default                                     | Undefined values never count as tags                              |
| Last pill deselected     | A focused method pill clears the final selected tag                                      | All methods remain visible; focus stays on the pill                                      | Move focus only if that method becomes hidden                     |
| No JavaScript            | Mobile body and wide-screen thread render without hydration                              | Descriptions and related links are visible; toggles hidden; full thread and dots visible | No browser APIs required for this fallback                        |
| Long CMS headings        | Mobile title/subtitle occupy more than the default photo height                          | Photo and dark background cover the entire heading band, closed and expanded             | No overflow or light text on light ground                         |
| Touch and hybrid pointer | Touch-only device, or a touch event on a hybrid device                                   | Finished decoration on touch-only devices; touch does not add growth                     | Mouse hover and visible keyboard focus still work where supported |
| Reduced motion           | User requests reduced motion                                                             | Chevron immediately reflects state; no draw animation                                    | Static final presentation remains useful                          |

</frozen-after-approval>

## Code Map

- `app/treatments/methods-explorer.tsx`: `Choice`, `MethodTags`, `MethodArticle`, `MethodsExplorer.reveal`; cleared keys retain undefined values and old toggles override every identical fragment. Use one defined-tag helper for all selection calculations. A fresh reveal request object per visit can invalidate only older toggle state; later toggles remember that request.
- `app/treatments/page.tsx`: mobile `noscript` rule changes display but not the body's hidden visibility.
- `app/treatments/treatments.module.css`: mobile media fixed height 112/200px, chevron transitions outside motion gating, dot scale rule applies before JavaScript is ready. Media needs automatic stretch sizing with minimum heights and an opaque backing; update its existing height transition accordingly.
- `app/treatments/scroll-thread.tsx`: `update` establishes progress/reached markers; a host readiness attribute should gate hiding dots and be cleaned up on teardown.
- `app/treatments/cta-garland.tsx`: observer and pointerenter listeners run without pointer capabilities. Gate draw setup for hover/fine capabilities (including hybrids), ignore touch pointer events, and retain timer/listener cleanup. Reduced-motion users see the completed initial garland.
- `DESIGN.md`: Methods overview incorrectly lists the removed combination note. Align mobile sizing wording with minimum-height bands.
- `lib/method-tags.ts`: existing matching behavior expects defined tag IDs; preserve it.
- `tests/` and `vitest.config.ts`: use existing Vitest, happy-dom and React act patterns. Browser/CSS verification runs separately through Playwright against localhost, with artifacts in `.context/`.
- Read-only evidence: attached PR comments, existing product/design constraints, installed Next.js `use-client` and `link` documentation. Older #9 verification is not acceptance evidence for this rewrite.

## Tasks & Acceptance

**Execution:**

- [x] `app/treatments/methods-explorer.tsx` — normalize selected values and repair fragment/toggle precedence.
- [x] `app/treatments/page.tsx`, `app/treatments/treatments.module.css`, `app/treatments/scroll-thread.tsx` — repair visibility, stretch photo bands, reduced-motion chevrons and thread readiness.
- [x] `app/treatments/cta-garland.tsx` — gate initial drawing and touch growth while preserving desktop and keyboard behavior.
- [x] `DESIGN.md` — remove obsolete content description and describe minimum-height mobile bands.
- [x] `tests/methods-explorer.test.tsx` — restore meaningful regression tests for repeated fragments, clearing and focus; test capability gating where practical.
- [x] Run repository checks and browser reproduction for every matrix scenario; save evidence under `.context/`.

**Acceptance Criteria:**

- Given the attached reviews, when fixes are inspected, then all eight findings map to a code/doc change and verifiable behavior.
- Given the final branch, when CI commands run, then formatting, lint, types, tests and build pass without lowering existing checks.

## Spec Change Log

- Review follow-up: clarify that last-pill focus retention describes the desktop comment. When clearing the last selection collapses a mobile body, focus must recover to the visible select. Preserve repeated-fragment behavior and all passing desktop scenarios. Capability checks must allow later mouse attachment or reduced-motion preference changes without remounting; touch remains static. Longer mobile headings need the scrim to maintain the documented contrast.

## Verification

**Commands:**

- `npm test` — regression tests and existing suite pass.
- `npm run lint` and `npm run typecheck` — zero-warning lint and types pass.
- `npm run build` — production build succeeds.
- Tracked-file Prettier and `git diff --check` — pass.

**Browser checks:**

Exercise mobile fragment reopening, both empty selects and final pill focus; use JavaScript-disabled contexts at mobile and desktop widths, long injected headings, touch/hybrid pointer contexts, and reduced motion. Check no horizontal overflow at 320, 768 and 1440px. The primary agent runs these checks after implementation and records any limits.

## Browser Verification Results — 2026-10-13

- Repeated hero and footer fragments reopen a manually closed row; a later toggle closes it again.
- Choosing and clearing both categories leaves all five rows at their closed default; deselecting the last tag retains focus on that pill.
- At 320/768/1440px, no horizontal overflow and exactly one `h1` and `main#main`.
- With JavaScript disabled at all three widths, all five descriptions and related links are visible. Desktop pathway dots have no hidden transform; mobile method toggles are hidden.
- Injected long title/subtitle at 320px produces a 244.5px band that fully covers the heading in both states. This tests DOM layout without changing CMS data.
- Touch context: no drawing state, and a touch pointer event leaves the decoration at eight items. On desktop, touch is ignored, mouse hover grows eight to nine items and keyboard focus grows to ten.
- Reduced-motion chevron transition duration is `0s`; the open-state direction still changes.
- Script and screenshots: `.context/review-44-browser.js`, `.context/review-44-long-title-320.png`, `.context/review-44-nojs-320.png`, `.context/review-44-desktop-1440.png`.
- Boundaries: local Chromium with fallback content, emulated touch/reduced motion, and injected long labels. Native Safari, actual hybrid hardware, screen-reader output, real 200% zoom and Sanity staging were not verified in this run.

## Review Follow-up Verification

- Local checks: zero-warning lint, typecheck, 202 tests across 34 files (18 explorer/garland regressions), production build and formatting passed.
- Mobile last-pill deselection: collapsed body sends focus to `method-filter-condition`; a manually opened row stays open and retains pill focus.
- Live reduced-motion changes: eight initial items, eight while reduced motion is active, nine after disabling reduced motion and hovering; no remount required. Pointer capability changes are covered by the DOM regression tests, not physical hybrid hardware.
- The mobile scrim now has opacity .86 at the bottom and a .74 minimum elsewhere. Over a worst-case white image, WCAG luminance calculation yields >5.5:1 for both the heading and .92-opacity subtitle.
- Review layers accepted live capability and hidden mobile focus fixes. Suggestions for a recurring browser CI harness are beyond this patch: existing CI remains DOM/HTTP based, and the computed-style checks above were run manually through Playwright.

## Review Comment Disposition

| Review comments                                     | Verified disposition                                                                                    |
| --------------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| Greptile 4257721624; CodeRabbit 4257735020          | Fix mobile no-JavaScript visibility; browser verifies content and links.                                |
| Greptile 4257721650                                 | Fresh fragment requests override old manual closure; repeated visits tested.                            |
| Greptile 4257721661                                 | Ignore undefined selections; restore defaults and appropriate focus.                                    |
| Greptile 4257721671                                 | Stretch photo backing to long headings; preserve contrast.                                              |
| Greptile 4257721682; CodeRabbit 4257735016          | Gate drawing by capabilities and ignore touch growth.                                                   |
| Greptile 4257721692                                 | Hide dots only after thread readiness; no-JavaScript dots verified.                                     |
| Greptile 4257721701                                 | Gate chevron transitions on motion preference.                                                          |
| Greptile 4257721707                                 | Remove obsolete combination-note references from DESIGN.md.                                             |
| CodeRabbit 4257734993                               | Mark earlier vine specification superseded; preserve its frozen historical intent.                      |
| CodeRabbit 4257735006                               | Do not change current persistent/random garland to the superseded temporary/action-specific design.     |
| General Vercel / bot progress / docstring threshold | Informational; no source change required. The 80% docstring threshold is not a repository quality gate. |

## Suggested Review Order

**Interaction state**

- Defined selections and fresh requests preserve filtering and repeated fragment navigation.
  [methods-explorer.tsx:22](../../app/treatments/methods-explorer.tsx#L22)

- Mobile focus recovers when clearing filters closes a body.
  [methods-explorer.tsx:77](../../app/treatments/methods-explorer.tsx#L77)

**Static and responsive presentation**

- No-JavaScript mobile content stays visible.
  [page.tsx:81](../../app/treatments/page.tsx#L81)

- Photo bands cover long labels; chevrons respect reduced motion.
  [treatments.module.css:756](../../app/treatments/treatments.module.css#L756)

**Decorative enhancement**

- Capability gating preserves static touch and live desktop growth.
  [cta-garland.tsx:76](../../app/treatments/cta-garland.tsx#L76)

- Readiness gates hidden dots and teardown restores fallback.
  [scroll-thread.tsx:35](../../app/treatments/scroll-thread.tsx#L35)

**Evidence and documentation**

- Behavioral regressions cover navigation, focus and decoration capabilities.
  [methods-explorer.test.tsx:110](../../tests/methods-explorer.test.tsx#L110)

- Current structure and garland behavior distinguish concept choice from final acceptance.
  [DESIGN.md:287](../../DESIGN.md#L287)
