---
title: "Treatment SEO based on OpenSEO research"
type: feature
created: "2026-10-22"
status: done
baseline_commit: 9ee486081de0c5df33e4add13babd6a0f8305e7b
review_loop_iteration: 0
context: [PRODUCT.md, docs/FRONTEND_CHECKLIST.md]
---

<frozen-after-approval reason="user authorized optimizing all eleven treatments; preserve existing workspace work">

## Intent

**Problem:** The eleven treatment pages have educational CMS metadata, but their search snippets do not consistently express the service, local market or terminology supported by OpenSEO research. The catalogue sync also deletes the CMS SEO field, making editorial improvements fragile.

**Approach:** Provide reviewed treatment metadata defaults and apply the same titles/descriptions to Sanity staging. Preserve editor overrides and prevent catalogue synchronization from erasing SEO. The parent agent handles research, reporting and revision-guarded staging publishing; implementation is local only.

## Boundaries & Constraints

**Always:** Preserve existing uncommitted work, prices, titles displayed in the UI, slugs, photos, FAQs, educational medical copy, canonical URLs, image precedence, and unknown-slug 404s. Use the exact researched copy in `.context/openseo/reviewed-seo.json`. Metadata defaults omit the brand suffix because root layout adds it. Existing nonblank CMS SEO overrides each default field independently. Treat blank CMS fields as absent. Keep catalogue seed SEO-free so it cannot overwrite future editorial work. All changes remain narrowly scoped to treatment metadata and SEO preservation.

**Ask First:** Production publishing, changing clinic service names or slugs, medical assertions beyond the audited content, recurring paid tracking. These are not required for this implementation.

**Never:** Invent keyword volume/rankings; equate missing demand data with zero; introduce meta keyword stuffing, device-specific claims, credentials or treatment guarantees; change global SEO for unrelated pages; touch unrelated dirty files; commit, push or deploy a website.

## I/O & Edge-Case Matrix

| Scenario         | Input / State                                        | Expected Output / Behavior                                              | Error Handling                                     |
| ---------------- | ---------------------------------------------------- | ----------------------------------------------------------------------- | -------------------------------------------------- |
| CMS override     | Known slug with complete or partial SEO              | Each supplied nonblank field wins; other fields use reviewed defaults   | Existing CMS parser behavior retained              |
| Local defaults   | Known slug without SEO, including no-Sanity fallback | Reviewed title and description; treatment image remains eligible for OG | No network dependency added                        |
| Future treatment | Unknown slug with a real treatment object            | Its own title/shortDescription and existing image precedence            | Do not invent a treatment record                   |
| Unknown route    | No matching treatment object                         | Existing notFound remains                                               | Return real 404                                    |
| Catalogue sync   | Existing treatment with editor SEO                   | Neither set nor unset touches SEO                                       | Preserve revision guard and other cleanup behavior |

</frozen-after-approval>

## Code Map

- `app/treatments/[slug]/page.tsx:generateMetadata` currently delegates CMS title/description and own fallback to createMetadata. Only its metadata resolver should change; page markup stays intact.
- `lib/seo.ts:createMetadata` creates absolute canonical and OG URLs. Reuse unchanged.
- `app/layout.tsx:metadata` adds `%s | HolisticVN`; reviewed titles plus suffix are at most 60 characters, descriptions at most 160.
- `lib/content.ts:Treatment` defines optional SEO; bundled catalogue deliberately has none. Do not modify catalogue or types.
- `lib/sanity.ts:treatmentSchema/getTreatments` already trims and validates optional SEO. Preserve configured-empty/outage behavior and CDN image validation.
- `scripts/lib/treatment-sync.mjs:UNSET` currently includes seo, benefits, protocols, duration. Remove only seo; keep cleanup of unreviewed medical fields and identity guards.
- `tests/treatment-sync.test.ts` has an exact UNSET expectation. `tests/treatment-detail-page.test.tsx` tests metadata, 404, rendering and CMS behavior. Extend these without discarding prior work.
- `.context/openseo/baseline/` captures this task's starting versions of existing changed files for a focused review. `.context/openseo/keyword-metrics.json` and SERP snapshots are research evidence, not executable app dependencies.
- Read relevant installed Next.js metadata documentation before writing code, as required by AGENTS.md.

## Tasks & Acceptance

**Execution:**

- [x] `lib/treatment-seo.json` — add the exact eleven reviewed entries from the working research file, containing title and description only.
- [x] `lib/treatment-seo.ts` — provide a small typed resolver that uses CMS → reviewed default → treatment fields independently, preserving OG image precedence. Avoid extra runtime validation already handled at the CMS boundary; handle blank optional strings defensively.
- [x] `app/treatments/[slug]/page.tsx` — use the resolver through createMetadata for existing treatments; keep route and page behavior.
- [x] `scripts/lib/treatment-sync.mjs` — preserve editor SEO during catalogue sync, including existing metadata/media fields.
- [x] `tests/treatment-seo.test.ts`, `tests/treatment-sync.test.ts`, `tests/treatment-detail-page.test.tsx` — cover the matrix, exact coverage of catalogue slugs, metadata bounds/uniqueness, canonical/image precedence and SEO-preserving synchronization. Keep seed editorial tests unchanged.

**Acceptance Criteria:**

- Given the current eleven treatments, when rendered using staging or bundled fallback, then each page exposes the reviewed title/description unless an editor supplies an override, with correct canonical and unchanged content.
- Given a future editorial change, when catalogue sync is planned, then its SEO fields and OG media survive.
- Given the completed implementation, when full required checks run, then lint, typecheck, tests and production build pass without introducing client JavaScript or dependencies.

## Spec Change Log

## Verification

**Commands:**

- `npm test -- tests/treatment-seo.test.ts tests/treatment-detail-page.test.tsx tests/treatment-sync.test.ts tests/treatments-seed.test.ts` — targeted behavior passes.
- `npm run lint`, `npm run typecheck`, `npm test`, `npm run build` — required full validation, run sequentially to avoid Next type-generation races.
- Parent: inspect rendered metadata for all eleven routes with staging and fallback, including final title suffix once, canonical, description and OG image. Read back staging after revision-guarded publishing and verify all other fields and production revisions are unchanged.

## Suggested Review Order

- Use the resolver without altering public page markup.
  [page.tsx:24](../../app/treatments/[slug]/page.tsx#L24)

- Preserve field-level CMS ownership with reviewed defaults.
  [treatment-seo.ts:7](../../lib/treatment-seo.ts#L7)

- Compare the eleven reviewed snippets with research evidence.
  [treatment-seo.json:1](../../lib/treatment-seo.json#L1)

- Catalogue synchronization no longer deletes editorial SEO.
  [treatment-sync.mjs:5](../../scripts/lib/treatment-sync.mjs#L5)

- Cover default scope, precedence and optional fields.
  [treatment-seo.test.ts:8](../../tests/treatment-seo.test.ts#L8)

- Inspect measured evidence, limitations and staging readback.
  [TREATMENT_SEO_AUDIT.md:1](../../docs/TREATMENT_SEO_AUDIT.md#L1)

## Completion evidence

351 tests, lint, typecheck, build and 66 browser route/viewport checks passed. Sanity staging transaction 99Fs6oltvVcm55dsWzmlaM read back 11/11, other fields and production revisions unchanged. OpenSEO report saved privately. Website production not deployed; no commit or push performed because existing workspace changes are intentionally preserved.
