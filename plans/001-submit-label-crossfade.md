# 001 — Reuse the submit-label fade on Contact and Booking

- **Status**: DONE — source and browser verification complete; physical-phone follow-up remains.
- **Commit**: 6627f5e
- **Severity**: LOW
- **Category**: Missed opportunities / state indication
- **Estimated scope**: Two source files, plus this plan and its index.

## Problem

`app/contact/page.tsx:89` and `app/booking/page.tsx:42` render `LeadForm` with
`variant="page"` and the default `motion=false`. The label switches immediately
between the submit text and “Đang gửi…”. The component already has a two-label
opacity transition, but it is coupled to the broader `motion` option:

```tsx
// components/lead-form.tsx:283 — current
{
  motion ? (
    <span className={styles.buttonLabels}>
      <span aria-hidden={sending}>{submitLabel}</span>
      <span aria-hidden={!sending}>Đang gửi…</span>
    </span>
  ) : (
    buttonLabel
  );
}
```

Turning on `motion` for either route would also replace the native Booking
disclosure marker with an animated chevron. That is outside this request.

## Target

Enable only the existing label fade for the two page forms. The frequency is
occasional, once into and out of sending per request; its purpose is **state
indication**. Keyboard submission remains instantaneous.

- Keep the existing opacity endpoints: idle label `1 → 0`, sending label `0 → 1`.
- Preserve `transition: opacity 120ms ease` for pointer-initiated changes.
- Preserve `80ms ease` under `prefers-reduced-motion: reduce`.
- Keyboard interaction has no transition (`0s` computed duration).
- Keep both visual labels in the same CSS grid cell. Only the current label is
  exposed to assistive technology, using the existing `aria-hidden` values.
- Review refinement: on `.page` only, set `visibility: hidden` on the label with
  `aria-hidden="true"`. This removes double-exposed lettering during the fade,
  retains the grid width and preserves CSS opacity retargeting on quick responses.
  Only the current label is painted; visibility changes immediately, not animated.
- Preserve immediate request dispatch, disabling, accessible naming, validation,
  status announcements, focus behavior, reset, consent-gated tracking and payload.
- Do not add minimum sending times, timers, keyframes, blur, transform, easing
  tokens or dependencies. Responses can interrupt and reverse the CSS transition.

## Repo conventions to follow

The repository has no named easing/duration tokens for these forms. Reuse the
approved local vocabulary in `components/lead-form.module.css:154`:

```css
.buttonLabels {
  display: grid;
}
.buttonLabels > span {
  grid-area: 1 / 1;
}
.motion[data-motion-input="pointer"] .buttonLabels > span {
  transition: opacity 120ms ease;
}
@media (prefers-reduced-motion: reduce) {
  .motion[data-motion-input="pointer"] .buttonLabels > span {
    transition-duration: 80ms;
  }
}
```

These exact values were selected for opportunity 1. Preserve that existing
tradeoff instead of introducing a second motion vocabulary. The Next.js forms
and CSS guides are in `node_modules/next/dist/docs/01-app/02-guides/forms.md` and
`node_modules/next/dist/docs/01-app/01-getting-started/11-css.md`.

## Steps

1. In `components/lead-form.tsx`, after `isPage`, derive
   `const labelMotion = motion || isPage;`.
2. Use `labelMotion` to enable the existing two-label button markup and the
   existing `data-motion-input`, pointer-capture and keyboard-capture handlers.
   Leave the `styles.motion` class and note-chevron rendering controlled by
   `motion` alone. No route edits or new props are needed.
3. In `components/lead-form.module.css`, change only the four selectors that
   currently start with `.motion` and control button-label opacity or transition
   timing to start with `:is(.motion, .page)`. Retain the declarations verbatim.
4. Add `.page .buttonLabels > span[aria-hidden="true"] { visibility: hidden; }`.
   This is a page-only review correction; leave legacy `motion` forms unchanged.
5. Run the focused browser checks below, then review the incremental diff with
   Emil's `review-animations` standards. Fix any new motion defect within scope.

## Boundaries

- Keep all pre-existing uncommitted work.
- Do not edit route markup, note disclosure, success/error regions, form
  submission, validation, API, email, analytics or any other page.
- A successful submission acknowledges a callback request; it does not create or
  confirm an appointment.
- Hover capability gating remains `(hover: hover) and (pointer: fine)`. This fade
  follows actual pointer input (including touch), not hover or viewport width.
- Keep the behavior of forms without `variant="page"` and `motion=false` intact.
- Re-read the snippets if the source has drifted; do not overwrite newer changes.

## Verification

- **Mechanical**: `npm run lint`, `npm run typecheck`, `npm run build`,
  `git diff --check`. Do not run the test suite without a user request.
- **Browser**: on both `/contact` and `/booking`, intercept `/api/leads` locally;
  never send a real email. Check slow success, fast success, error, retry,
  duplicate submission, pointer/touch and keyboard submission, and reduced motion.
- **State/accessibility**: request and disabled state take effect immediately;
  exactly one label is exposed; messages and focus keep their existing behavior.
- **Geometry**: button and label-grid dimensions remain stable across states at
  320px, 390px and desktop widths. Native Booking disclosure remains unchanged.
- **Feel check**: inspect the transition frame by frame or at 2–5× playback time
  using browser animation controls. It must retarget on a quick response, settle
  promptly and avoid a persistent double-exposed label. Do not slow production CSS.
- **Phone follow-up**: real iOS/Android hardware is needed to confirm touch feel
  with the software keyboard open, browser chrome and real display rendering.
- **Done when**: the narrow crossfade meets the exact timing/input rules, review
  has no unresolved in-scope findings, and submission behavior is unchanged.

## Execution and motion review

Implemented in `components/lead-form.tsx` and `components/lead-form.module.css`.
The two route files and their page styles match the start of this execution.
The entire submit handler also matches the start of this execution.

| Before                                             | After                                                                                   | Why                                                                                                             |
| -------------------------------------------------- | --------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| At 60ms, both labels painted on top of each other. | The inactive page-form label has `visibility: hidden`; only the current label fades in. | Removes double-exposed text while retaining the grid dimensions, existing timing and CSS interruption behavior. |

**Verdict: Approve** for the scoped label change. No unresolved in-scope findings.
The approved local `120ms ease` / `80ms ease` preset is deliberately retained;
no parallel easing vocabulary or unrelated motion was introduced.

Verified in Chromium and its touch/reduced-motion emulation:

- Actual CSS opacity transitions: 120ms for pointer input, 80ms for reduced motion;
  keyboard submission produces 0s transitions and no animation objects.
- Frame inspection at 0, 30, 60, 90 and 120ms: one painted label, fixed label-grid
  width, correct final opacity. Switching to keyboard while pending snaps correctly.
- Production local at 320, 390 and 1440px: no horizontal overflow; at 320px the
  button remains 236 × 50px in both idle and sending states on both routes.
- Accessible button name updates immediately to “Đang gửi…” and the button is
  disabled immediately. Repeated submissions while pending produce one request.
- Mock success/error preserve the existing focus, reset and error-data behavior;
  focus outside the form stays outside. Booking service context is preserved.
- Immediate mocked production responses finish in roughly 15–16ms, before the
  120ms animation budget; there is no artificial sending delay.
- `npm run lint`, `npm run typecheck`, `npm run build`, formatting checks for the
  changed source files and `git diff --check` pass. No test suite or real email.

Remaining physical-phone check: label clarity and touch feel on iOS Safari and
Android Chrome with the software keyboard open. Emulation is not hardware proof.
