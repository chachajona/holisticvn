# Contact UI critique and polish — 2026-10-30

Scope: refine `/contact` through Impeccable critique then polish; compare with Holistic's design using Dembrandt; preserve every word, URL, image and form function. Related tracking remains in GitHub #12 and #33; no issue was closed.

## Independent critique

Method: two isolated agents, authorized by the owner. Assessment A performed a source and rendered design review; Assessment B independently ran the detector, measured responsive layouts and exercised mocked form states. Assessment A completed before B's findings entered synthesis.

- Initial Nielsen score: **28/36**, with heuristic 7 (application accelerators) not applicable. This is the initial qualitative review, not a claimed post-polish conversion or usability measurement.
- Design specificity: the page already belongs to Holistic's Warm Clay Editorial system. Keep its two-column composition, mobile stacking, real entrance photo and calm motion policy.
- Cognitive load: low overall; duplicate floating contact controls and the consent layer introduce the practical distraction.
- Strengths: familiar direct channels; clear staff-callback explanation; real location/photo and approved hours.
- Personas: first-time visitors can understand the options; low-vision visitors need clearer idle fields; distracted mobile visitors need separated tap targets.

| Priority                          | Evidence                                                                                                | Correction                                                                                                                                                                              |
| --------------------------------- | ------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| P2: faint resting field edges     | The old 18% ink border measured about 1.28:1 against linen and 1.40:1 against paper.                    | Contact-only clay `#90776e` field border: 4.00:1 against paper, approximately 3.65:1 against linen. Decorative hairlines stay light.                                                    |
| P2: floating phone over email row | At 390px, the call widget occupied the email row's trailing action region before the form entered view. | Add the existing `data-chat-exclusion` attribute to the channel list. Floating controls step aside while equivalent direct channels are visible; their behavior elsewhere is unchanged. |

Minor refinements: restore the location h3 to Roboto Slab 300 / 20px; use the existing 13px note role with weight 400 for the privacy sentence; preserve the submit pill during keyboard focus; match heading tracking and button weight to the design system. Placeholders reuse the treatment form's warm `#75645b` (5.41:1 on paper). Caret and text selection use existing brand colors. No new animation, dependency, client component or shared-form logic.

Full independent artifacts are local: `.context/contact-critique-a.md` and `.context/contact-critique-b.md`. The synthesized snapshot is `.impeccable/critique/2026-10-29T19-27-47Z__app-contact-page-tsx.md`; both in-scope Priority Issues were resolved and its backlog closed. This was the target's first critique, so there is no historical trend.

## Dembrandt comparison

Extracted the current homepage and contact before editing, then extracted contact again after the production build.

- Shared palette, font families, flat surfaces and pill controls agree with DESIGN.md. Keep the distinct 1240px chrome / 1360px page frames.
- The initial contact extraction reported one typography consistency warning: the branch h3 shared a 15px/400 body/link style. The final extraction reports **no findings**, with consistency/contrast analyzer scores of 100. These numbers describe the extraction's checks, not a complete UX or accessibility score.
- The final extraction has no failing rendered text-color pairs. A separate `check_contrast` call verifies the new field boundary and placeholder colors; full WCAG conformance is not inferred from this sample.
- Homepage/contact drift scored 37, with the tool explicitly warning that the pages are different surfaces. That is context, not a defect count. Same-page before/after drift scored 14, caused by deliberate typography and color changes; spacing, radius, shadows, logo and technology categories were unchanged. Do not force this score to zero by undoing approved corrections.
- Full raw extractions and drift evidence live under `.context/contact-polish/dembrandt-*.json`.

## Verification

- `npm run lint`, `npm run typecheck`, `npm test`, `npm run build`: pass; **53 test files / 417 tests**. `/contact` remains static/ISR with a one-hour recovery interval.
- Impeccable detector: **0 findings** before and after. It scans the route's TSX, so it is not treated as certification of imported CSS or runtime layout.
- Production browser at 320, 390, 768 and 1440px: one h1, no horizontal overflow, loaded clinic image and visible brand images. Hidden responsive logos and footer images that had not yet lazy-loaded initially appeared in an overbroad image probe; scrolling the footer into view and decoding its image confirmed that they were not broken assets.
- Fresh-visit consent remains available, with floating widgets hidden while channels/form are visible. Verified again after rejecting consent. This does not require analytics acceptance.
- Keyboard order: name, phone, optional email, message, submit, privacy link; visible outlines throughout. Input text remains 16px. Focused submit retains 999px corners; inputs retain 10px corners.
- Empty submission: focus reaches name, both field errors and validation live region appear, invalid field border remains clay-deep. After scrolling settles, focused name is below the sticky header.
- Mock 503: values retained and `tel:0828959598` fallback remains present. Mock delayed success: submit disabled while sending, fields reset only on success, existing callback acknowledgement shown. **No real email was sent.**
- Copy/function preservation: the route TSX is byte-identical to its pre-polish version after removing the one added `data-chat-exclusion` attribute. Shared LeadForm, lead-client and content files match their pre-polish SHA-256 hashes. Existing unrelated work in the workspace was retained.
- Desktop/mobile visual review plus one confirmation round completed. No extra animations or broad redesign were introduced.

## Remaining shared-chrome observation

The existing fixed cookie banner can still cover part of the contact introduction or controls at some viewport/scroll positions before a consent choice is made. Both assessments identified this inherited behavior. It remains a shared consent-layout follow-up; this pass does not redesign consent or change either choice. Do not claim the entire frontend checklist is satisfied while this observation remains.

## Diagnostic run notes

Target slug `app-contact-page-tsx`; no critique ignore list. Assessments were isolated. The Chrome extension browser was unavailable, so B used fresh isolated plain-Playwright pages. Mutable preflight passed, but the diagnostic overlay script was blocked by production CSP. No reliable user-visible overlay exists; source detector, screenshots, computed styles and mocked interactions supplied the evidence. Product CSP was not relaxed. Both temporary overlay server instances were stopped; temporary browser contexts and the critique-body temp file were cleaned up. Existing application preview servers were retained.

Preview artifacts:

- `.context/contact-polish/contact-desktop.png` — main contact surface.
- `.context/contact-polish/contact-320.png`, `contact-390.png`, `contact-768.png`, `contact-1440.png` — full pages after rejecting consent.
- `.context/contact-polish/contact-mobile-consent.png` — first-visit state, including the inherited consent layer.
