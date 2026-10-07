# PR #34 visual evidence

Before: `941793866d67ce654be4610cf4b52f4d97a40a49` (origin/main / PR #32).
After: `0c6a45e3b8413c80308f2f3ece575f8197a6d8d0` (PR #34).

Full-page PNG pairs cover home, about and booking at 320, 768 and 1440 CSS pixels, viewport height 1000. Captures use local production fallback builds with the cookie banner dismissed and sections scrolled into view before capture. Sources are in the originating workspace `.context/pr34-visual/`.

The isolated base build used a local-only `turbopack.root` override to reuse the same installed dependencies; no public UI source was changed. The after build is the committed PR head.

Inspected in detail: desktop home/about pairs and mobile booking pair. Basic DOM and overflow checks passed for all nine route/width combinations on each version. Other full-page pairs are supplied for reviewer inspection.

Cookie screenshots use a fresh browser context with the banner open. Home/about/booking were checked at 320×900, 768×900, 1440×900 and 720×450: no horizontal overflow; the footer booking CTA and three legal links were visible, hittable at their centers and did not intersect the banner.

720×450 approximates 200% zoom of a 1440×900 viewport; it is not native browser zoom. Actual browser zoom and Safari remain unverified. The additional 320×256 stress screenshot documents an inherited limitation; see REVIEW.md.

These images live on a separate evidence branch and are not included in the application PR diff. Use repository-relative image URLs with the immutable evidence commit SHA when embedding in the PR, so private repository access is preserved.
