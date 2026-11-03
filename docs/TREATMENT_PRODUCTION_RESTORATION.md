# GH-58 production treatment restoration

Applied 2026-11-03 at 03:51 UTC under the approved GH-58 manifest. Sanity transaction
`vizRdHsiIb9i1QjTzr4I8E` created eight published treatments and updated three reference
arrays on two pages. The three existing treatments retain every field and revision.
[GitHub #58](https://github.com/chachajona/holisticvn/issues/58) owns task status.

## Verified target and approval identity

| Item                             | Value                                                              |
| -------------------------------- | ------------------------------------------------------------------ |
| Sanity project/dataset           | `yjzexxml/production`                                              |
| Vercel project                   | `holisticvn` / `prj_c7KdwuEk4uuqxIzAd4l8UQETqK5A`                  |
| Live domain                      | `https://www.holisticvn.com`                                       |
| Deployment                       | `dpl_GfDViPAzqo79cV4VBCq247BdABjR`                                 |
| Deployment commit                | `4e53a8ac4cc1b9c9a2a76882a5b6611e729fe5c6`                         |
| Approved manifest SHA-256        | `89519d754f7504552252ffa537ca24d27c5a810f8f4a4af98d57326886fedf89` |
| Reviewed before-snapshot SHA-256 | `7399573e7509f8b340dd97856e4f00207356d43e75ba0b8515a63ef01357b1d7` |

The CLI resolved the live domain through the Vercel deployment API, checked project,
commit, production/READY state and alias, and repeated that check immediately before
commit. A fresh production environment pull confirmed the public, Studio and API
Sanity project/dataset values. Raw SDK queries included published documents,
drafts/releases and potentially occupied IDs. The complete scoped snapshot still
matched the approved backup; there were no relevant drafts/releases or conflicts.
Source hashes matched before planning and immediately before commit:

| Source                              | SHA-256                                                            |
| ----------------------------------- | ------------------------------------------------------------------ |
| `scripts/seed/treatments.json`      | `d026fda0c6102c59c653ccf6a3ae9e88ae3124b3d2d9bcdf5e208a2f772f4486` |
| `scripts/seed/treatment-links.json` | `a4f0821386892e18488976833a8548e966d40871c2701c0f3d298f120f7b5832` |
| `lib/treatment-seo.json`            | `29c683f6107c1662d441e1905de2ff7e78c01c3b01c327cae6be4adf5b565784` |

## Field-level changes

Each new document uses its reviewed seed fields exactly: `_id`, `_type`, `title`,
`slug`, `shortDescription`, `description`, `price`,
`requiresCertifiedPractitioner`, `faqs`, plus `englishTitle` where present in the
seed. Each receives `seo._type = "seo"` and its per-slug reviewed SEO title and
description. No staging-only protocols, duration, benefits or image assets were
copied. Existing runtime image handling supplies the public presentation.

| New document ID                     | Slug                      | Price (VND) | English title           |
| ----------------------------------- | ------------------------- | ----------: | ----------------------- |
| `treatment-dry-needling`            | `dry-needling`            |     299,000 | Dry Needling            |
| `treatment-iastm`                   | `iastm`                   |     199,000 | Omitted                 |
| `treatment-tapping`                 | `tapping`                 |      99,000 | Omitted                 |
| `treatment-shockwave`               | `shockwave`               |     349,000 | Shockwave Therapy       |
| `treatment-bio-electric`            | `bio-electric`            |     349,000 | Bio-electric            |
| `treatment-therapeutic-ultrasound`  | `therapeutic-ultrasound`  |     349,000 | Therapeutic Ultrasound  |
| `treatment-electroacupuncture`      | `electroacupuncture`      |     249,000 | Electroacupuncture      |
| `treatment-chiropractic-adjustment` | `chiropractic-adjustment` |     299,000 | Chiropractic Adjustment |

Reference changes preserve complete existing reference objects, including `_key`:

| Document and field                                | Before      | After, in order (slugs)                                                                                                                               |
| ------------------------------------------------- | ----------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| `methodsPage.groups[_key=="manual"].treatments`   | `cupping`   | `dry-needling`, `cupping`, `iastm`, `tapping`, `chiropractic-adjustment`                                                                              |
| `methodsPage.groups[_key=="electro"].treatments`  | Empty array | `shockwave`, `bio-electric`, `therapeutic-ultrasound`, `electroacupuncture`                                                                           |
| `servicesPage.groups[_key=="therapy"].treatments` | `cupping`   | `dry-needling`, `cupping`, `iastm`, `tapping`, `chiropractic-adjustment`, `shockwave`, `bio-electric`, `therapeutic-ultrasound`, `electroacupuncture` |

Both patched pages have post-apply revision `vizRdHsiIb9i1QjTzr4I8E`. Aside from
Sanity-generated revision/update metadata, every other page field matches backup.
The methods cold/infrared and services recovery groups already referenced the
existing records and were preserved.

| Preserved treatment | Document ID                            | Unchanged revision       |
| ------------------- | -------------------------------------- | ------------------------ |
| `heat-light`        | `2a1fbe0a-10cf-4f07-a7e6-609d3ba64ec8` | `gwIM9HrfrZGbkuPtCyOKsx` |
| `cold-plunge`       | `4973b361-92ba-425f-8745-635630d8f7d1` | `JvOewJuGUOLzwNuDES0Yi8` |
| `cupping`           | `dd0ea224-8a3d-4cdc-9b99-bd97b47d13a0` | `JvOewJuGUOLzwNuDES0YyA` |

## Verification

- Restoration tests: 67 passed (33 planner and 34 CLI orchestration), covering preservation, exact source/manifest
  identity, drafts/releases, occupied IDs, duplicate slugs/groups/references,
  unsafe keys, revision/state changes, idempotency, rollback guards, and installed
  Sanity SDK transaction serialization. Controlled orchestration tests execute the
  actual raw GROQ query with `groq-js`, run real argv/file/preflight/receipt logic,
  and simulate lost commit responses, failed/unchanged post-reads, receipt tampering
  and guarded recovery without live production writes.
- `npm run lint`, `npm run typecheck` and `npm test` passed; full suite: 56 files,
  491 tests. These changes add operational scripts/tests/docs; no runtime source,
  routes, canonical settings, dependency versions or deployment changed.
- Repeating the production command with `--apply` returned `complete` and zero
  mutations. Rollback payloads were checked without applying a rollback.
- Automatic webhook delivery was confirmed retrospectively through Sanity's official
  attempts/messages API: all ten deliveries for hook `Syff8uI7XZEcKd5Q` succeeded
  with HTTP 200 at 03:51:03–04 UTC, before manual invalidation. Each matched the
  restoration transaction and one of the eight created records/two patched pages.
  Only sanitized identity/status/timing evidence was retained; raw request framing
  may contain secrets and was neither logged nor archived.
- Explicit authenticated `POST /api/revalidate` at 03:51:18 UTC also returned HTTP
  200 and `{"revalidated":true}`. No pre-manual public response was captured, so
  individual public results cannot be attributed solely to automatic delivery.
  Webhook configuration was preserved.
- All eleven treatment URLs returned 200 in a real browser at 320, 768 and 1440 px
  with the correct single H1 and consultation CTA. The 33 treatment checks found no
  horizontal overflow or broken loaded images. Screenshots were saved at each size.
- `/services` and `/treatments` each exposed all eleven links in the exact approved
  groups at all three sizes. Mobile methods groups opened with keyboard Enter and
  showed all eleven links. No forms were submitted.
- `/sitemap.xml` returned 200 with exactly eleven treatment URLs (21 URLs total)
  and no internal/draft paths. `/treatments/issue-58-unknown-slug` remained 404.
- Before/after screenshot inspection confirmed the former 404 now displays the
  treatment detail and both catalogue pages display the restored references.
  Two unchanged deployed CSS chunks emitted delayed unused-preload warnings on
  the initial detail-page load; no browser errors were observed.

## Evidence and guarded recovery

Local evidence is ignored by git under `.context/issue-58/`. This workspace is the
current recovery-evidence custodian:
`/Users/chachajona/conductor/workspaces/holisticvn/antananarivo`.
A clean checkout does not contain the approved manifest, snapshots or receipts.
Obtain the archive from this workspace before attempting recovery elsewhere.
Environment files contain secrets, remain local and are excluded from the archive.

- `target-manifest.json`, `production-before.json`, `staging-before.json`: approved
  payloads, backups and reviewed-source comparison.
- `apply-2026-11-03T03-50-59-539Z-{before,plan,receipt,after,verified}.json`: immediate
  backup, atomic payload, transaction result, post-apply snapshot and revisions.
- `apply-2026-11-03T03-50-59-539Z-integrity-verified.json` and
  `receipt-integrity-proof.json`: enhanced receipt and independent read-only proof.
  The original receipt/snapshot bytes and saved revisions were preserved. Before
  enrichment, the saved revision map was checked against the original snapshot,
  every changed revision was matched to the original transaction, and a fresh raw
  production snapshot was compared in full. The enhanced receipt binds manifest,
  reviewed before-snapshot and post-apply snapshot hashes; it is the recovery input.
- `field-diff.json`: exact changed arrays, created fields/revisions and preservation
  assertions. `browser-after.json`, `public-after.json`, `sitemap-after.xml`,
  `revalidation.json`, `webhook-delivery-evidence.json`, `completion-audit.json`,
  `before-*.png`, `after-*.png`: sanitized public/delivery evidence.

The non-secret archive is
`.context/issue-58-recovery-2026-11-03.tar.gz`, with its adjacent `.sha256` checksum.
It contains the approved inputs, original/enhanced receipts, sanitized evidence,
screenshots and copies of the recovery tooling/handoff. Its per-file inventory is
`issue-58/RECOVERY_CHECKSUMS.sha256`. It was retained locally; nothing was uploaded.
An isolated extraction verified all 84 payload checksums and the exact 85 archive
entries, including the checksum inventory; recovered manifest bytes matched approval.
From this workspace, verify and extract into a separate recovery directory:

```bash
shasum -a 256 -c .context/issue-58-recovery-2026-11-03.tar.gz.sha256
mkdir -p /tmp/holisticvn-issue-58-recovery
tar -xzf .context/issue-58-recovery-2026-11-03.tar.gz -C /tmp/holisticvn-issue-58-recovery
cd /tmp/holisticvn-issue-58-recovery
shasum -a 256 -c issue-58/RECOVERY_CHECKSUMS.sha256
```

The extracted `issue-58` directory belongs under the intended checkout's `.context/`.
Restore the archived tooling only after reviewing it against the checkout. Acquire
production credentials separately; the archive intentionally cannot authenticate.
The original archive preserves the tooling at restoration time. Use the current
repository tooling for later operations, including the subsequent PR review fixes.

The default invocation is read-only. It requires the approved manifest and snapshot hashes,
explicit target, authenticated Vercel CLI, and production environment values:

```bash
node --env-file=.context/issue-58-rechecked-production.env scripts/restore-treatments.mjs \
  --project yjzexxml --dataset production --vercel-project holisticvn \
  --manifest-sha256 89519d754f7504552252ffa537ca24d27c5a810f8f4a4af98d57326886fedf89 \
  --snapshot-sha256 7399573e7509f8b340dd97856e4f00207356d43e75ba0b8515a63ef01357b1d7
```

For an authorized restoration, add `--apply --confirm yjzexxml/production`. The
current approved state produces no mutations.

To preview recovery, add
`--rollback .context/issue-58/apply-2026-11-03T03-50-59-539Z-integrity-verified.json`.
Applying recovery also requires `--apply --confirm yjzexxml/production`. Recovery
restores only the saved arrays and deletes only the eight created documents in one
transaction. Every affected document is revision guarded; created-record deletes
are preceded by a same-value title patch carrying the saved post-apply revision.
Any later edit, target/source change, or missing evidence aborts recovery. Invalidate
and verify public output again after any recovery. Production recovery was not run.

Before any commit, the CLI stores its intended SDK transaction ID in a durable
`*-pending.json` receipt and supplies that ID with `transactionId()`. A lost commit
response leaves this receipt; a failed post-read leaves a `*-receipt.json` committed
receipt. Use the same base command plus `--reconcile <receipt-path>` to investigate.
This mode sends no mutations or retry writes. It requires complete resulting state,
unchanged preserved documents and every changed document's revision equal to the
original transaction ID. It cannot refresh rollback guards from later revisions.
Verified receipts additionally require exact stored revision maps and snapshot-byte
integrity. Reconciliation writes a new local verified receipt/snapshot only after
these checks succeed. An unchanged pre-restoration response is never marked verified.
New rollback receipts store their origin receipt path relative to their own directory,
including when `--rollback` was supplied as an absolute path. Preserve that relative
directory layout when moving recovery evidence. Regression tests move the checkout
before read-only reconciliation and cover both absolute and checkout-relative inputs.
Planner regression tests also reject unrelated documents occupying a seed ID even
when the seed's slug is already published under another ID.

Post-review production checks used dry-run, read-only reconciliation of the enhanced
receipt, and rollback preview only: zero restoration mutations, successful original
transaction verification, and 18 preview rollback operations. No additional production
mutation or rollback was performed. Successful apply/reconciliation output includes
explicit authenticated cache-invalidation and public-verification follow-up; the
original transaction's follow-up is already evidenced above.

Atomic guards protect the changed page revisions and occupied IDs for strict creates
(and each affected revision during rollback). Preflight/readback detect changes to
preserved treatments, other slugs and unpublished identities. Sanity provides no
exclusive dataset lock: a concurrent edit elsewhere between the final read and commit
can coexist with the transaction and be detected afterward. Those reads do not promise
an atomic lock across the complete dataset.
