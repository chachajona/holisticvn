# Methods acceptance — issue #9

Historical staging record. Current PR CI, production publishing/webhook and Chrome
zoom results are in [PR checklist verification](METHODS_PR_CHECKLIST_VERIFICATION.md)
(2026-10-13); the pending/local-only statements below describe the earlier session.

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
- Production content and deployment were unchanged. After renewed login, staging
  webhook configuration was updated; production's existing unfiltered hook was verified.
- Credentials, protection cookies, raw results and screenshots stay in ignored
  `.context/` files. Secret values are excluded from evidence and commits.

## Owner decisions

- [x] Five groups are official (owner, 2026-10-12). Updated issue #9 from four to five.
- [x] Price-list mapping to groups: spec section 10.
- [x] Owner approved tapping, dry needling and IASTM in manual, electroacupuncture in electro (2026-10-12).
- [x] Owner approved the position and label of the "Liệu pháp liên quan" block (2026-10-12).
- [x] Owner approved revised descriptions, titles, intro/CTA and shared filter labels, and requested CMS/website updates (2026-10-12). See `docs/methods-wording-proposal.md` and `docs/METHODS_FILTERS_VERIFICATION.md`.

## Staging setup

- [x] Seed: `npx sanity documents create scripts/seed/methods-page.json --missing --project-id yjzexxml --dataset staging`; re-run printed `Skipped (already exists): methodsPage`.
- [x] Approved clinic photos, alt and real references populated through the SDK with a revision guard; authenticated Studio editing and reference selection also verified.
- [x] Staging filter includes `methodsPage`; production's unfiltered hook already includes it. Studio Publish triggered automatic staging `/api/revalidate` 200; production endpoint authentication returned 200.

## Checks

- [x] SDK/manual revalidation and authenticated Studio/automatic webhook both updated a group and reference. All three detail links were clicked; original content restored.
- [x] All five anchors land below sticky nav at 320, 768 and 1440; screenshots inspected.
- [x] Keyboard: Tab reaches index cards, treatment links and CTAs in order; focus is visible; fragment focus does not hide the heading.
- [x] Missing image/group and removed reference tested on staging; missing singleton/invalid/unresolved references covered by automated parser/render tests.
- [x] Unpublish and delete of a strongly referenced temporary treatment both rejected with 409 by the API; probes removed.
- [x] Real Studio schema validated through the CLI: missing/duplicate groups and repeated references/tags fail; cross-group treatment reuse passes.
- [x] Authenticated Studio: actual Publish, reference picker, Vietnamese validation errors and disabled Publish verified; test drafts removed.
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

CLI fixtures were not published. Actual editor interaction and Publish-button behavior
were subsequently verified after renewed login, as recorded below.

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

## Authenticated Studio and webhook follow-up

The owner renewed Sanity CLI login on 2026-10-12. Dataset listing and authenticated
Webhook API access succeeded. Added the exact Preview origin as a credential-enabled
CORS origin so its embedded Studio can connect. The Chrome-extension browser provider
was unavailable; the isolated Playwright browser used the renewed CLI user token for
Studio authentication. Credentials stayed out of tool output and screenshots.

PR #40 was already merged, so reused its staging webhook rather than adding another
webhook slot. Hook `73iQNVV10WENgFmC`, renamed `Methods/services staging revalidation`,
now targets this tested Preview's `/api/revalidate` and remains **staging only**:

```text
_type in ["servicesPage", "methodsPage", "treatment", "sanity.imageAsset"]
```

Preserved Create/Update/Delete triggers, `{_id, _type}` projection, private authentication
headers and exclusion of draft/version changes. This hook no longer targets the retired
#8 Preview. The existing production hook `Syff8uI7XZEcKd5Q` has no filter, so it already
matches `methodsPage`; its configuration was preserved exactly. A request using its
configured authentication returned **200** from the production endpoint. No production
content was published or seeded.

In Studio, changed the manual title and removed its cupping reference, then clicked
**Publish**. Without a manual revalidation request or deployment, the staging webhook
returned **200** and the public page showed the changed title and omitted the link.
Then restored the title, selected Giác hơi through Studio's reference picker, restored
the original internal reference key in the draft, and clicked **Publish** again.
The second automatic delivery returned **200** and the original title/link returned.

| Studio publish (UTC) | Webhook attempt (UTC) | HTTP | Attempt ID                        |
| -------------------- | --------------------- | ---- | --------------------------------- |
| 06:37:42             | 06:37:43.658          | 200  | `atm-3KaE1e748ROUYvJ4sAFo5vh4ASD` |
| 06:40:14             | 06:40:15.425          | 200  | `atm-3KaEKbmbpKCB0XXgTBXBCAMm2ii` |

An isolated methods probe also produced three successful **200** webhook messages
for Create, Update and Delete at `06:43:26.002Z`, `06:43:27.381Z` and
`06:43:28.377Z`; the delete payload retained `_type: methodsPage`. Probe removed.
Production automatic delivery for a `methodsPage` publish was not tested because its
production singleton has not been seeded.

An unpublished validation draft showed eight errors in Studio: duplicate manual,
missing electro/infrared, repeated/empty tags and duplicate treatment references.
The validation panel used the expected Vietnamese messages and **Publish was disabled**.
Removed the fixture with a revision guard; it was never published.

Ran the actual `getMethods()` GROQ projection in authenticated Vision with dataset
`staging`, API `v2025-01-01` and perspective `published`. It returned all five groups,
staging assets and the three real treatment links.

Final check: groups exactly match the baseline, including reference keys; no draft or
probe remains. Restored revision: `dJcZuCdFvtR9fvJhrIw5Wc`. Studio emitted project-plan
release capability probes returning 403 (`active release count exceeds the limit of 0`);
catalogue editing, validation, publishing and Vision requests succeeded.

Screenshots inspected:

- `.context/methods-studio-before-publish.png`
- `.context/methods-studio-automatic-refresh.png`
- `.context/methods-studio-restored-public.png`
- `.context/methods-studio-validation.png`
- `.context/methods-studio-vision.png`

## Remaining acceptance

Owner copy approval is complete, and approved copy plus interactive filters are now applied to staging and the local website. Updated evidence: `docs/METHODS_FILTERS_VERIFICATION.md`. Hosted CI and production content rollout remain deferred while the user keeps the branch local.

Webhook operations are documented in the
[Sanity Webhooks API reference](https://www.sanity.io/docs/http-reference/webhooks).
Preview browser access used a domain-scoped cookie following
[Vercel Protection Bypass for Automation](https://vercel.com/docs/deployment-protection/methods-to-bypass-deployment-protection/protection-bypass-automation).

Issue #9 remains open until pending acceptance evidence is recorded.
