# Services layout verification — GH-41

> Historical verification for the first implementation. The owner rejected its visual density; the subsequent minimal revision is documented in [services-minimal-refinement.md](./services-minimal-refinement.md).

Implemented on 2026-11-14 against the approved
[execution spec](../_bmad-output/implementation-artifacts/spec-gh-41-services-layout.md).
GitHub #41 under #1 remains the task-status authority.

## Repository checks

All commands used the installed dependencies; no dependency installation or upgrade.

| Check               | Result                                  |
| ------------------- | --------------------------------------- |
| `npm run lint`      | Passed, zero warnings                   |
| `npm run typecheck` | Passed                                  |
| `npm test`          | Passed: 61 files, 548 tests             |
| `npm run build`     | Passed: 31 generated pages, no warnings |
| `git diff --check`  | Passed                                  |

Regression coverage includes reordered/partial/empty CMS services, long navigation labels,
resolved public contact settings, server-rendered optional channel links, consent-gated
contact channel events, all three closing exits grouped before contact links, floating/inline
consent acceptance/rejection and preference focus, both blocked-storage choices in both layouts,
fixed-height cleanup across layout changes, exact-route chrome switching with unset/accepted/rejected
consent, and Studio exclusion.

The navigation and resolved-contact tests failed against the previous implementation.
A closing-action grouping regression was reproduced by its test and fixed before the final checks.

## Browser evidence

Validated on local Chromium with fallback content:

- 320, 390, 700/701, 768, 860/861, 980, 1024, 1280/1281 and 1440 CSS px: no horizontal overflow in visible headings, summaries, links or copy; mobile navigation and CTA switch at their specified breakpoints.
- All four groups individually opened at 320/768/1440: one disclosure open at a time, no content overflow. Enter opens a focused summary; Space closes it.
- Navigation to recovery/training, repeated hash, legacy `#svc-therapy`, and browser Back/Forward open the intended group. Recovery summary settles at approximately 222px below viewport top, clear of the sticky navigation.
- Inline consent is static in the document flow, ending exactly where main begins; floating chat is absent. Client navigation services→contact→services restores fixed consent/chat on contact and clears `--cookie-h` on services.
- Accept, reject and reopening cookie preferences work in the browser; reopening preferences focuses the rejection control. Storage-blocked behavior is covered in regression tests rather than a browser-storage experiment.
- JavaScript disabled at 320px: first disclosure remains open in server HTML; another summary opens natively with exclusivity; four phone/Zalo links remain in HTML across intro and closing CTA; navigation points at real summaries. No promise of automatic hash opening without JavaScript.
- Doubled navigation and CTA labels at 320/768/1281/1440 wrap without clipping, including inspection of child scroll widths.
- Reduced-motion context exercised. Reflow at 720 CSS px/DPR2 models a 1440px display at 200% zoom and has no overflow; native browser-toolbar zoom and physical Safari/mobile-device testing were not performed.
- No browser console errors. Existing dev warnings about images inside closed details having zero rendered height and the first image's LCP loading hint were also observed before this change; production build has no warnings. A separate local production server was checked at 320/768/1440px with no overflow or console errors. After a delay, Chromium reported an unused preloaded CSS warning for the prefetched Methods chunk (`treatments-module`), a condition previously recorded in `docs/homepage-comparison-checklist.md`; no new services runtime errors were observed.

Screenshots (local, gitignored): `.context/services-after-mobile.png`,
`.context/services-after-mobile-cookie.png`, `.context/services-after-390-full.png`,
`.context/services-after-cta-1024.png`, `.context/services-after-320.png`,
`.context/services-after-768.png`, `.context/services-after-desktop.png`. The original before images remain under the
same directory. Attach before/after files when preparing an external review.

## Data scope and limits

The local production build used fallback content. CMS order and public settings behavior
were exercised through validated mocked Sanity responses, including missing and partial records.
Messenger conditional rendering was tested in the contact component using synthetic resolved
site data. Production Messenger availability comes from the existing fallback/environment
`site.messengerId`; the CMS `socialMedia` mapping does not supply a Messenger identifier.
This is not evidence of real Sanity staging verification. No CMS writes, live booking requests,
publishing or deployment were performed.

Live Sanity staging, physical Safari/mobile devices and native browser-toolbar 200% zoom
remain unverified. The Chromium reflow simulation above does not complete those checks.

Inline consent retains the existing hydration gate: the banner can appear after hydration
and shift the page. This change does not claim zero layout shift or measured conversion gains.

## Initial consent displacement

An instrumented local production load with unset consent observed an inline banner
height of approximately 103px and a corresponding main-content displacement on ordinary
320/390px loads. Early buffered layout-shift entries summed to approximately 0.102
(on a 390px load, approximately 0.113 for a direct recovery hash load). These are
single local observations without controlled networking, not field Core Web Vitals.
The existing hydration gate is retained; the plan explicitly accepts this tradeoff
rather than introducing server consent detection. Settled hash navigation remains
clear of the sticky header, as verified above.

## Review follow-up

Final review added dark-link hover feedback, restored blocked-cookie coverage for
both banner layouts and both choices, and added saved accepted/rejected consent
route-transition regressions. The final check count is 548 tests in 61 files.
Browser geometry was checked as described above; no new CI browser runner or CSS
snapshot tests were introduced. Sanity staging, native browser-toolbar zoom, and
Safari/physical-device acceptance remain explicitly unverified.
