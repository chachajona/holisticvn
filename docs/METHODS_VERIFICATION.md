# Methods acceptance — issue #9

Spec: `docs/superpowers/specs/2026-10-12-methods-sanity-design.md`. Plan: `docs/superpowers/plans/2026-10-12-methods-sanity.md`.

## Owner decisions

- [x] Five groups are official (owner, 2026-10-12). Issue #9 text still says four: edit it.
- [x] Price-list mapping to groups: spec section 10.
- [ ] Owner confirms the placement of tapping, dry needling, IASTM (manual) and electroacupuncture (electro).
- [ ] Owner approves the position and label of the "Liệu pháp liên quan" block.
- [ ] Owner confirms `tags` and `body` copy is approved.

## Staging setup

- [ ] Seed: `npx sanity documents create scripts/seed/methods-page.json --missing --project-id <id> --dataset <staging>`; re-run prints `Skipped (already exists): methodsPage`.
- [ ] Upload approved clinic photos and set `alt` per group; pick real `treatment` references in Studio.
- [ ] Webhook filter includes `methodsPage` (staging and production); publish returns `/api/revalidate` 200.

## Checks

- [ ] Publish an edit to one group (title/body/tag) and one treatment reference; `/treatments` updates; demo index → section → detail.
- [ ] Anchors: `/treatments#mtd-<group>` for all five lands with the heading below the sticky nav at 320, 768 and 1440 (screenshots attached).
- [ ] Keyboard: Tab reaches index cards, treatment links and CTAs in order; focus is visible; fragment focus does not hide the heading.
- [ ] Missing singleton, missing image, group removed, treatment unpublished or removed: page renders five sections and no dead link.
- [ ] Unpublish a referenced treatment: record whether Studio or the API refuses (open question in the research doc).
- [ ] Studio: duplicate/missing group blocks Publish; same treatment twice in one group is rejected.
- [ ] CI gate green (format, lint, typecheck, tests, build, smoke).
