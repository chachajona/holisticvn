# Methods acceptance — issue #9

Recorded on 2026-10-12 (Asia/Ho_Chi_Minh). Tested application revision:
`5f18ee273e7810cd38d0255b34880fc986c785d2`.

Spec: `docs/superpowers/specs/2026-10-12-methods-sanity-design.md`.
Plan: `docs/superpowers/plans/2026-10-12-methods-sanity.md`.

## Environment

- Vercel project: `chachajonas-projects/holisticvn`.
- Tested Preview: <https://holisticvn-ovk94f619-chachajonas-projects.vercel.app/treatments>.
- Sanity project/dataset: `yjzexxml/staging`, the staging dataset created for #8.
- This CLI Preview overrides `NEXT_PUBLIC_SANITY_DATASET`, `SANITY_API_DATASET`,
  `SANITY_STUDIO_DATASET` and the revalidation secret at build and runtime. Shared
  Preview defaults still point at production; branch overrides require a remote Git branch.
- Production content, production deployment and webhook configuration were unchanged.
- Credentials, protection cookies, raw results and screenshots stay in ignored
  `.context/` files. Secret values are excluded from evidence and commits.

## Owner decisions

- [x] Five groups are official (owner, 2026-10-12). Updated issue #9 from four to five.
- [x] Price-list mapping to groups: spec section 10.
- [ ] Owner confirms the placement of tapping, dry needling, IASTM (manual) and electroacupuncture (electro).
- [ ] Owner approves the position and label of the "Liệu pháp liên quan" block.
- [ ] Owner confirms `tags` and `body` copy is approved.

## Staging setup

- [x] Seed: `npx sanity documents create scripts/seed/methods-page.json --missing --project-id yjzexxml --dataset staging`; re-run printed `Skipped (already exists): methodsPage`.
- [x] Approved clinic photos, alt and real references populated through the SDK with a revision guard. Studio editing remains pending.
- [ ] Webhook filter includes `methodsPage` (staging and production); publish returns `/api/revalidate` 200.

## Checks

- [x] SDK published a group edit and reference removal; deployed page updated after authenticated manual revalidation. All three detail links were clicked. Studio Publish remains pending.
- [x] All five anchors land below sticky nav at 320, 768 and 1440; screenshots inspected.
- [x] Keyboard: Tab reaches index cards, treatment links and CTAs in order; focus is visible; fragment focus does not hide the heading.
- [x] Missing image/group and removed reference tested on staging; missing singleton/invalid/unresolved references covered by automated parser/render tests.
- [x] Unpublish and delete of a strongly referenced temporary treatment both rejected with 409 by the API; probes removed.
- [x] Real Studio schema validated through the CLI: missing/duplicate groups and repeated references/tags fail; cross-group treatment reuse passes.
- [ ] Authenticated Studio: verify actual Publish action and validation UI.
- [x] Local gate green: format, lint, typecheck, 175 tests, build and smoke. Hosted CI pending branch publication.

## Completed staging evidence

### Seed, photos and references

CLI seed authentication used the existing content-write token privately as
`SANITY_AUTH_TOKEN`. Added images and references after seeding, with a revision guard.
Reused the approved images already in staging and uploaded the existing
`ElectroPulse.jpg`. Provenance is in `PRODUCT.md`.

| Group      | Clinic image        | Published treatment slug |
| ---------- | ------------------- | ------------------------ |
| `manual`   | `Iastm.jpg`         | `cupping`                |
| `electro`  | `ElectroPulse.jpg`  | None                     |
| `rehab`    | `Coaching.jpg`      | None                     |
| `cold`     | `ColdPlungeTub.jpg` | `cold-plunge`            |
| `infrared` | `Infrared.jpg`      | `heat-light`             |

References use real legacy UUIDs and are strong. No new treatment content or claim
was created for the public catalogue. CMS images use staging asset paths. The three
links reached headings Giác hơi, Ngâm lạnh and Đèn hồng ngoại.

### Published edits, fallback and cache

Temporarily changed the manual title, removed its image asset and reference, reversed
the groups and removed rehab, on staging only. After SDK publishing, authenticated
manual `POST /api/revalidate` returned **200**; omitting the Sanity secret returned **401**.

The page showed the changed title, retained five groups in canonical order, restored
rehab from bundled copy, removed the cupping link and paired local `Iastm.jpg` with its
bundled alt rather than stale CMS alt. Screenshot: `.context/methods-staging-mutation.png`.

Restored the original groups with a revision guard and revalidated again. Original
title, staging images and three links returned. Restored singleton revision:
`dJcZuCdFvtR9fvJhrIY1M2`. No acceptance markers or probe documents remain.

Missing singleton was verified through parser/render tests, rather than deleting the
real staging singleton. Tests also cover invalid groups, unresolved references, missing
slugs and outage handling that retains ISR's last good page.

### Reference and schema behavior

An isolated published methods document strongly referenced a temporary copy of a
treatment. Both deletion and `sanity.action.document.unpublish` returned **409**;
the target remained published. All probe documents were removed. This resolves API
behavior for this published strong-reference setup; Studio's dialog remains untested.

Actual `sanity documents validate` against staging found no `methodsPage` errors or
warnings. Legacy treatment fields emitted unrelated unknown-field warnings and were
preserved. Six local NDJSON fixtures validated against the real Studio schema:

- Valid five groups and cross-group treatment reuse: no errors.
- Missing rehab: `Thiếu nhóm "rehab".`
- Duplicate manual: duplicate-group and missing-electro errors.
- Repeated reference: `Không chọn cùng một liệu pháp nhiều lần.`
- Repeated/empty tags: `Không lặp nhãn.` and `Mỗi nhãn dài 1 đến 40 ký tự.`

Fixtures were not published. Actual editor interaction and Publish-button behavior
remain pending.

### Browser and keyboard

Chromium inspected populated staging and the local fallback production build at
**320 × 900, 768 × 900 and 1440 × 900**. Each of the five anchors was clicked at each
width. No horizontal overflow or broken section images; one `h1` and `main#main`.

| Width | Sticky nav bottom | Lowest group heading top | Result |
| ----- | ----------------- | ------------------------ | ------ |
| 320   | 66 px             | 455.6 px                 | Clear  |
| 768   | 82 px             | 440.1 px                 | Clear  |
| 1440  | 98 px             | 152.6 px                 | Clear  |

The `7rem` offset is sufficient at these widths. Mobile/tablet images precede headings.
Tab reached all five index cards, the three CMS links and assessment/contact CTAs in
DOM order with visible native outlines. Enter on the manual card scrolled to its group;
the next Tab reached cupping. Local fallback keyboard navigation reached a detail page.

Staging console check: zero errors/warnings. Local production navigation had transient
Next.js CSS-preload warnings, with no failed assets or runtime/CSP errors. A 720 × 450
reflow check passed; actual 200% browser zoom and Safari were not tested.

Screenshots inspected at all three widths:

- `.context/methods-staging-anchor-{320,768,1440}-{manual,electro,rehab,cold,infrared}.png`
- `.context/methods-staging-keyboard-{320,768,1440}.png`
- `.context/methods-anchor-{320,768,1440}-{manual,electro,rehab,cold,infrared}.png`

### Review and gates

Fixed the four minor follow-ups: duplicate links within a group, stale CMS alt on
fallback photos, numeral/order assertions and cross-group rendering coverage.
Three independent review layers checked the follow-up; added navigation-count,
sparse-CMS and rendered-alt assertions after review.

Passed format, lint, typecheck, **175 tests**, production build and local smoke:
seven routes, 25 local image URLs and invalid lead input rejected. No dependency or
quality-threshold changes. Generated BMad snapshots are excluded from formatting;
private Vercel metadata is ignored by Git.

## Pending external acceptance

Automatic webhook delivery, authenticated Studio interaction and the three owner
confirmations above remain pending. Manual revalidation is not automatic webhook evidence.

Sanity CLI reports an expired session. The configured content token can seed, query
and validate staging, but the Webhooks API returned **401** for that token. Run
`npx sanity login` to continue management/Studio acceptance. Neither webhook was edited.

Webhook operations are documented in the
[Sanity Webhooks API reference](https://www.sanity.io/docs/http-reference/webhooks).
Preview browser access used a domain-scoped cookie following
[Vercel Protection Bypass for Automation](https://vercel.com/docs/deployment-protection/methods-to-bypass-deployment-protection/protection-bypass-automation).

Issue #9 remains open until pending acceptance evidence is recorded.
