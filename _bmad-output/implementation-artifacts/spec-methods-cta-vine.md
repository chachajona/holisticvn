---
title: "Grow a vine inside the Methods closing CTA"
type: "feature"
created: "2026-10-13"
status: "in-review"
superseded_by: "DESIGN.md — Methods closing CTA garland (030ca55)"
baseline_commit: "90c2e8c56ad3131f7aab001c126f31cdf0303916"
review_loop_iteration: 0
context:
  - "/Users/chachajona/conductor/workspaces/holisticvn/tripoli/AGENTS.md"
  - "/Users/chachajona/conductor/workspaces/holisticvn/tripoli/PRODUCT.md"
  - "/Users/chachajona/conductor/workspaces/holisticvn/tripoli/docs/FRONTEND_CHECKLIST.md"
  - "/Users/chachajona/.codex/skills/impeccable/reference/craft-floor.md"
---

> **Historical specification — superseded.** The lower/right vine and temporary, action-specific growth below describe an earlier iteration. The implemented top-right garland and persistent leaf/blossom growth are documented in `DESIGN.md`, updated in commit `030ca55` after the garland implementation in `53b2f4d`. Use that current design description for PR #44 review. The frozen intent and unchecked acceptance criteria are retained as historical context; they are not acceptance evidence for the current garland. Final owner acceptance of the page remains pending.

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** The Methods closing CTA currently has a small upright decorative vine beside two buttons. The user wants a more distinctive, connected ending to the page, with different botanical responses to each action.

**Approach:** Grow a pen-drawn vine around the inside of the CTA as the visitor scrolls to it. Root it near the lower left, extend it along the lower edge and up the right side, leaving the heading and buttons clear. Hovering or keyboard-focusing the booking action opens a small clay-tinted flower; the contact action opens additional sage-tinted leaves. The user explicitly approved this direction with “Okay chốt” after the detailed proposal; no further design approval is required.

## Boundaries & Constraints

**Always:** Preserve the dark green card, existing Vietnamese heading, both action labels and destinations, and surrounding page. Keep decoration inside the card, away from text, focus rings and hit areas. Use existing palette, serif typography and thin botanical line vocabulary. Animate in response to scrolling and user interaction only. Retain maximum growth on reverse scroll. Support keyboard focus, responsive sizes, touch, no JavaScript and reduced motion. Existing uncommitted work belongs to the user/session and must be preserved. Implement only this approved feature; parent handles review and final verification.

**Ask First:** Any change to factual copy, routes, brand direction or dependencies.

**Never:** Add autoplay, looping movement, medical claims, tracking, assets from third parties, a new dependency, global styles, a replacement hero, or changes to the pathway thread. Do not commit, stage, push or change branches. Do not invoke build or review skills recursively.

</frozen-after-approval>

## Code Map

- `app/treatments/page.tsx` — server-rendered page, closing `section.cta` contains `div.ctaCard`, `Vine`, `ctaCopy` and `ctaActions`; swap only the decoration and add action hooks if needed. Both routes are native Next links.
- `app/treatments/treatments.module.css` — owns palette (`--dark-cta`, `--hero-emphasis`, existing sage-tinted leaf stroke), CTA card geometry, 980px stacking and 700px mobile rules. Replace the old `ctaVine` rules and its shared hover trigger with scoped frame/action behavior.
- `app/treatments/scroll-thread.tsx` — useful existing pattern: passive scroll events, requestAnimationFrame batching, media-query change listening, ResizeObserver and cleanup. Reuse the pattern, never modify its pathway behavior.
- `components/vine.tsx` and `components/sprig.tsx` — existing pen-drawn leaves/petals, decorative SVG semantics, normalized pathLength and linecap vocabulary. Avoid changing these shared components; the CTA needs a local responsive frame rather than an upright vine.
- `DESIGN.md` — current Methods CTA paragraph describes the old upright vine; update that paragraph and related motion exception to reflect this owner-approved direction. Preserve existing unrelated edits.
- `node_modules/next/dist/docs/01-app/03-api-reference/01-directives/use-client.md` — read before writing code: browser-dependent decoration is a small client entry point, while the page and its content remain server-rendered.

## Tasks & Acceptance

**Execution:**

- [ ] `app/treatments/cta-vine.tsx` — implement a local decorative frame that fits the actual CTA, scroll-driven growth that never decreases, cleanup, and safe static fallbacks. Keep browser work limited to the decoration.
- [ ] `app/treatments/page.tsx` and `app/treatments/treatments.module.css` — integrate the frame and distinguish booking flowers from contact leaves on hover/focus. Fit both stacked and horizontal CTA layouts without shifting content or clipping decoration.
- [ ] `DESIGN.md` — document the approved frame and separate interactions, mobile and reduced-motion behavior.
- [ ] Verify the CTA in the real browser at 320px, 768px and desktop, including scroll, reverse scroll, booking/contact hover, keyboard focus, touch and reduced motion. Run existing repository checks; new mirror tests are unnecessary for this decoration.

**Acceptance Criteria:**

- Given the CTA below the viewport, when scrolling reveals it, then the vine grows along its inner lower and right edges, without first-paint animation elsewhere.
- Given partial or complete growth, when scrolling back up, then the maximum growth remains, and returning to the CTA does not replay it.
- Given an interactive pointer, when booking is hovered, then flowers open; when contact is hovered, then additional leaves open. Leaving the action closes only that temporary growth gently.
- Given keyboard navigation, when each CTA link receives focus, then its matching botanical response appears and a visible focus indicator remains unobstructed.
- Given touch input or reduced motion, when the CTA is viewed, then it has a complete static composition without relying on sticky hover. Reduced motion disables drawing and opening transitions.
- Given JavaScript disabled, when the page is read, then both actions still work and the decoration has a coherent visible default.
- Given any supported width or filtering-induced page height change, when CTA geometry changes, then no decorative path covers words or links and there is no horizontal overflow.

## Spec Change Log

## Design Notes

Preserve the existing flat Warm Clay Editorial identity. The frame should read as an organic vine rather than a second card border: give the lower run slight hand-drawn curvature and a sparse scattering of small leaves. The far upper edge can remain open. Place temporary flowers/leaves in the reserved margins near their action area, rather than overlaying controls. The dark card retains its present short copy, which was previously approved. Favor a small local component and CSS-driven hover/focus over React rerenders on every pointer movement.

## Verification

**Commands:**

- `npm run lint` — no errors or warnings.
- `npm run typecheck` — types pass.
- `npm test` — existing suite passes.
- `npm run build` — production compilation succeeds.
- Impeccable mechanical detector on changed UI targets — explain any brief-pinned exceptions.

**Browser:** Inspect desktop and mobile in one bounded round, fix verified issues together, then confirm once. Save screenshots under `.context/`.
