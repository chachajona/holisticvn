# Treatment catalogue verification (#10)

Spec: `docs/superpowers/specs/2026-10-15-treatment-catalog-design.md`. Mark an item only after it has been checked; attach the evidence (command output, screenshot path, staging URL).

The sync script needs `SANITY_AUTH_TOKEN` (write access) in the environment, even for a dry run. Set it privately; never commit it or paste it into chat, logs or this file. Every `--apply` writes its own backup to `.context/treatments-before-<dataset>-<UTC timestamp>.json` (one file per apply, never overwritten).

## Automated

- [x] `npm run lint`: clean, 0 warnings (2026-10-15)
- [x] `npm run typecheck`: clean (2026-10-15)
- [x] `npm test`: 39 files, 255 tests passed (2026-10-15)
- [x] `npm run build`: succeeded (2026-10-15)

## Copy and prices

- [ ] Every `description`, English name and price in `scripts/seed/treatments.json` compared with the owner's price-list image (Vietnamese and English): <result>
- [ ] `*` shown on Châm khô, Điện châm, Nắn chỉnh cột sống only: <result>
- [ ] Static section wording on the page (“Điều bạn có thể mong đợi”, “Quy trình”, the booking text) reviewed by the owner: <result>

## Merge and production order (gate)

Merging to `main` deploys production (production branch is `main`, see `docs/EMAIL_VERIFICATION.md`). Production currently holds prices `99`, `149000` and `99000` on the three legacy treatments (`99` would render "99 ₫"), plus unreviewed 6-7-step `protocols` and English `seo.*` that this branch starts to render.

- Do not merge to `main` until staging is verified and the owner has confirmed.
- Run the production sync immediately before (or together with) the merge, never after a delay.
- If the code must ship first, the three legacy documents show wrong data until the sync runs.

- [ ] Owner confirmed staging result: <who, when>
- [ ] Production sync applied before/with merge: <time, backup path>

## Staging (project yjzexxml, dataset staging)

- [ ] Open drafts and release versions for the 3 legacy treatments and the two pages are discarded or published (the dry run lists them under WARNING); `--apply` refuses to run otherwise
- [ ] Dry run output reviewed: `node --env-file=.env.local scripts/sync-treatments.mjs --project yjzexxml --dataset staging`
- [ ] Applied: `... --apply --confirm yjzexxml/staging`; backup at `.context/treatments-before-staging-<UTC timestamp>.json`
- [ ] Second dry run plans no creates (11 treatments exist) and only idempotent patches
- [ ] `/treatments` and `/services` link all 11 pages under their groups
- [ ] Full document, document missing optional fields, and unknown slug (real 404) checked
- [ ] Price, English subtitle and `*` note correct at 1280, 768 and 375 px; keyboard; no horizontal scroll
- [ ] Form submit on one `*` treatment and one other: email row "Liệu pháp" shows the Vietnamese name; success text does not confirm an appointment
- [ ] Sanity webhook filter includes `treatment`, `methodsPage`, `servicesPage`; a publish revalidates the page

## Production (only after the owner confirms the staging result)

- [ ] Owner confirmation recorded: <who, when>
- [ ] Open drafts and release versions for the 3 legacy treatments and the two pages are discarded or published (the dry run lists them under WARNING)
- [ ] Dry run reviewed: `node --env-file=.env.local scripts/sync-treatments.mjs --project yjzexxml --dataset production`
- [ ] Applied: `node --env-file=.env.local scripts/sync-treatments.mjs --project yjzexxml --dataset production --apply --confirm yjzexxml/production`. The backup `.context/treatments-before-production-<UTC timestamp>.json` holds every document the run changes (the three legacy treatments and the two pages it patches). Add `--allow-drafts` only after reading the warning
- [ ] Spot check of the three overwritten treatments and one new treatment on the live site
