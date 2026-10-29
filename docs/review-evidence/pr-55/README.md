# PR #55 visual evidence

Captured 2026-10-30 from a local production build of the application source committed at `88b81761e64a1db488da67d151971d1998c8f4fd`. The contact page is unchanged from `8122b67`; the hero capture includes the inline-validation fix. These files are review artifacts, not public-site assets or authenticated Vercel Preview screenshots.

| Capture                                              | Viewport    | State                                                                                    |
| ---------------------------------------------------- | ----------- | ---------------------------------------------------------------------------------------- |
| [Contact desktop](contact-desktop-1440.jpg)          | 1440 × 1000 | Full main surface, consent rejected, loaded clinic image                                 |
| [Contact mobile](contact-mobile-390.jpg)             | 390 × 844   | Full main surface, consent rejected, loaded clinic image                                 |
| [Hero phone error](hero-inline-error-mobile-390.jpg) | 390 × 844   | Invalid synthetic `12`, focused input and linked error still visible after seven seconds |

The hero error capture is viewport-only after focus scrolling; it deliberately shows the input, error and callback guidance. The contact captures show the full main element rather than the footer. Screenshots were saved as JPEG directly by Playwright, without image edits.

No personal customer data appears in these captures. The clinic entrance photo and public contact values follow PRODUCT.md. Valid browser submissions were intercepted locally and sent no email.

Before the fix, an invalid phone had only a six-second toast and `aria-invalid`, with no `aria-describedby`; its explanation disappeared after the timeout. Three regression tests failed against that version and pass after the fix. Full verification: 420 tests in 54 files, formatting, lint, typecheck, production build and fallback smoke; browser widths 320/390/1440 for the hero and 390/1440 for refreshed contact captures.

See [lead-form verification](../../LEAD_FORMS_VERIFICATION.md) for behavior and remaining acceptance boundaries, and [contact polish review](../../contact-page-polish-review.md) for the independent design/Dembrandt review. Physical-device autofill, actual screen-reader behavior, final-page real-Sanity coverage and inherited consent-layout overlap are not certified by these images.
