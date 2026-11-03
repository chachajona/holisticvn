---
title: "GH-58 Restore missing production treatments"
type: "bugfix"
created: "2026-11-03"
status: "done"
baseline_commit: "4e53a8ac4cc1b9c9a2a76882a5b6611e729fe5c6"
review_loop_iteration: 0
context: ["{project-root}/PRODUCT.md"]
---

<!-- prettier-ignore-start -->

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** Eight treatment URLs return 404. Production has three published treatments; staging has eleven. Services and methods expose only three links.

**Approach:** Restore missing documents and catalogue references atomically, preserving existing treatments. Verify publication, invalidation and public output; hand off a field-level change record.

## Boundaries & Constraints

**Always:** Explicitly target `yjzexxml/production` in Vercel project `holisticvn`. Reconfirm deployment identity, source hashes and revisions before applying. Back up changed fields. Preserve all three existing treatment documents. Use reviewed seed content and per-slug SEO for new documents. Keep secrets in ignored local files.

**Ask First:** Approve the concrete production manifest. Request new approval if target, source or field scope changes.

**Never:** Run overwrite-oriented sync, replace/import a dataset, copy staging wholesale, modify existing treatment content/prices/SEO, add sample blogs, hardcode routes, change canonical configuration or infer protocols. Omit staging-only protocols from new records.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
| --- | --- | --- | --- |
| Reviewed target | Three published treatments, no relevant drafts | Eight creates, two page patches, three reference paths | Atomic commit |
| Concurrent change | Revision, deployment or source changed | No write | Regenerate plan |
| Identity conflict | Duplicate slug, occupied ID, draft/release | No write | Report conflict |
| Invalid catalogue | Missing/duplicate group, unsafe key, unexpected reference | Preserve data | Report conflict |
| Repeat execution | Documents and references match | No mutations | Report complete |
| Rollback | Post-apply revisions unchanged | Restore changed arrays; delete created records | Abort on later edits |

</frozen-after-approval>

<!-- prettier-ignore-end -->

## Code Map

- `.context/issue-58/target-manifest.json`: approved concrete create payloads, patches, hashes, before values and rollback intent; applied in production transaction `vizRdHsiIb9i1QjTzr4I8E` on 2026-11-03.
- `.context/issue-58/{production,staging}-before.json`: scoped snapshots, 3/11 treatments respectively, two singletons each, no relevant drafts/releases.
- `.context/issue-58/deployment.json`: active production deployment `dpl_GfDViPAzqo79cV4VBCq247BdABjR`, commit `4e53a8ac4cc1b9c9a2a76882a5b6611e729fe5c6`. Environment evidence and webhook configuration are adjacent files. Production env updates precede deployment; SDK state matches public output. Retrospective official API evidence confirms all ten production webhook deliveries returned HTTP 200 for the restoration transaction; sanitized evidence is in `webhook-delivery-evidence.json`.
- `scripts/seed/treatments.json`, `lib/treatment-seo.json`: approved new content, compared against staging by field. Bundled image fallbacks avoid cross-dataset assets.
- `scripts/seed/treatment-links.json`: approved grouping. Preserve existing reference keys.
- `scripts/lib/treatment-sync.mjs:planSync`: overwrites existing treatments; unsuitable here.
- `lib/sanity.ts`: published CMS authoritative; no per-record fallback.
- `app/treatments/[slug]/page.tsx`, `app/sitemap.ts`, `app/api/revalidate/route.ts`: deployed runtime routes, dynamic sitemap and authenticated invalidation already exist. No Next.js edits expected.

## Tasks & Acceptance

**Execution:**

- [x] `scripts/lib/treatment-restore.mjs`, `scripts/restore-treatments.mjs`: separate missing-only planner/application with manifest identity, revision checks, atomic creates and narrow patches.
- [x] `tests/treatment-restore.test.ts`: test preservation, conflicts, reference keys, idempotency and rollback guards.
- [x] `.context/issue-58/`: recheck target/snapshots, apply reviewed plan, record transaction, revisions and field diff; capture public evidence.
- [x] `docs/TREATMENT_PRODUCTION_RESTORATION.md`: sanitized target/change/check handoff. GitHub #58 remains status authority.

**Acceptance Criteria:**

- Given the approved target, when rechecked before applying, then deployment, hashes, revisions, published/draft state and references match evidence.
- Given restoration, when visiting all eleven URLs, then each returns 200, correct therapy, one H1 and consultation CTA; unknown slug remains 404.
- Given published references, when viewing `/services` and methods at `/treatments`, then all eleven appear in approved groups without broken/draft links.
- Given publication and authenticated invalidation, when reading public pages/sitemap, then eleven published treatment URLs appear without internal/draft additions.
- Given post-apply snapshots, when compared with backup, then only eight new documents and three reference arrays differ; existing treatments retain every field/revision.

## Execution Authorization

The user explicitly approved this spec and its concrete production manifest by replying `A` on 2026-11-03. This authorizes implementation and the narrow production restoration/application described here, including necessary remote reads, writes, invalidation and verification. No further confirmation is needed within this exact scope. No git push or production code deployment is requested. Recheck the current target and revisions before applying; any conflict stops the write. The approved source snapshot and payloads are available under `.context/issue-58/`.

## Spec Change Log

## Verification

- Run targeted restoration tests, `npm run lint`, `npm run typecheck`, `npm test` after implementation.
- Compare exact new fields to seed/SEO and preserved fields to snapshots.
- Browser-check production at 320/768/1440 px; save statuses, H1, CTA, links, sitemap and before/after screenshots. Do not submit forms.
- Record automatic webhook delivery separately from explicit authenticated revalidation; never claim unobserved delivery.

## Suggested Review Order

**Entry and production result**

- Start with the verified target, production result and field ownership.
  [TREATMENT_PRODUCTION_RESTORATION.md:1](../../docs/TREATMENT_PRODUCTION_RESTORATION.md#L1)

**Execution boundaries**

- Follow explicit hashes, read-only defaults and guarded transaction orchestration.
  [restore-treatments.mjs:48](../../scripts/restore-treatments.mjs#L48)

- Review missing-only planning and preservation of existing treatment content.
  [treatment-restore.mjs:57](../../scripts/lib/treatment-restore.mjs#L57)

**Evidence and recovery**

- Check snapshot identity, receipt integrity and original transaction revision checks.
  [treatment-restore.mjs:190](../../scripts/lib/treatment-restore.mjs#L190)

- Inspect narrow rollback patches and revision-guarded deletion.
  [treatment-restore.mjs:326](../../scripts/lib/treatment-restore.mjs#L326)

**Verification**

- Trace controlled CLI failure cases through actual GROQ and SDK boundaries.
  [treatment-restore-cli.test.ts:249](../../tests/treatment-restore-cli.test.ts#L249)

- Confirm catalogue identity, preservation and idempotency edge cases.
  [treatment-restore.test.ts:90](../../tests/treatment-restore.test.ts#L90)
