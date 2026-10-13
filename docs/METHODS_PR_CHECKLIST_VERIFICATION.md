# PR #43 checklist verification — issue #9

Recorded on 2026-10-13 (Asia/Ho_Chi_Minh). Application revision:
`5daaa8ae51daad3edb8dad7d0fff3f52f8260fa9`. This follow-up records current
verification after the earlier staging acceptance and final hero copy update.

## Environment and baseline

- PR: <https://github.com/chachajona/holisticvn/pull/43>, ready for review.
- Verified Preview: <https://holisticvn-7mrg45ron-chachajonas-projects.vercel.app/treatments>.
- Sanity project/dataset: `yjzexxml/production`. The Preview's public reader,
  server reader and embedded Studio dataset settings all resolve to production.
- [Head `5daaa8a` baseline](https://github.com/chachajona/holisticvn/actions/runs/38300466728):
  format, lint, typecheck, **189 tests across 34 files**, production build and
  fallback smoke passed. CodeRabbit, GitGuardian and Vercel also passed.
- Application code was not changed during this verification. Production CMS
  publishing was explicitly authorized by the owner; application rollout follows
  PR review and merge.

## Current browser checks

- [x] Latest shorter hero: “Holistic đánh giá khả năng vận động, rồi kết hợp trị
      liệu và bài tập phù hợp với nhu cầu của bạn.”
- [x] Five canonical groups, stable numbering/anchors, nine assigned filters and
      three resolved related-treatment links on the production-backed Preview.
- [x] OR selection across condition/goal categories; selected state, result count,
      synchronized group buttons and clear action.
- [x] Keyboard Space toggles filters, visible focus and focus recovery when a
      selected group becomes hidden.
- [x] Index/footer navigation clears filters even when the URL fragment is already
      the same; direct fragment navigation works. All five anchors clear the sticky
      header at each tested viewport.
- [x] Chrome at 320×1000, 768×1000, 1440×1000 and 720×450: document width equals
      viewport width, with no horizontal overflow or broken visible images.
- [x] Actual Chrome page zoom **200%**, set through Chrome's native Page zoom
      control in a separate persistent profile. Keyboard selection, clearing and
      all five anchor positions passed without horizontal overflow.
- [x] Native Safari 27.2: after the owner enabled remote automation, verified the
      hero, nine filters, OR selection/count/clear, focus recovery, index/footer
      navigation and all five anchors. All three detail links opened the correct
      pages. Native WebDriver keyboard actions verified Option-Tab traversal,
      Space selection/deselection and a visible 2 px solid focus ring.

Measured Chrome zoom geometry:

| Metric                | Before | At 200% |
| --------------------- | ------ | ------- |
| Window outer width    | 1440   | 1440    |
| Layout viewport width | 1440   | 720     |
| Document scroll width | 1440   | 720     |
| Device pixel ratio    | 2      | 4       |
| Visual viewport scale | 1      | 1       |

The final responsive run recorded two CSS preload warnings for
`1_rvy1l_ycbni.css` and `10h_42sizrb29.css`; no uncaught JavaScript error or console
error was observed. Functional/layout checks passed. These warnings remain
recorded for follow-up; this is not a warning-free console claim.

### Native Safari follow-up

Safari's native MCP driver handled page interactions, viewport resizing, DOM
measurements and screenshots. A separate native WebDriver session verified
keyboard modality and focus styling, because MCP's targeted key action selected
the filter without enabling `:focus-visible`. Application code and Safari settings
were unchanged during these checks.

| Measured Safari viewport | Document width | Broken visible images | All five anchors    |
| ------------------------ | -------------- | --------------------- | ------------------- |
| 336×819                  | 336            | 0                     | Clear sticky header |
| 768×819                  | 768            | 0                     | Clear sticky header |
| 1440×819                 | 1440           | 0                     | Clear sticky header |
| 720×346                  | 720            | 0                     | Clear sticky header |

The requested 320 px native window was clamped to 336 px by Safari. Requested
height 1000 was clamped to an 819 px layout viewport; the shorter 450 px window
produced a 346 px viewport. The table records actual browser measurements.
These are desktop Safari checks at responsive widths; no physical iOS device was
tested.

Safari accessed the same immutable Preview through a localhost verification
proxy, with the authorized Vercel protection bypass held server-side. The proxy
only forwards GET/HEAD. Its rejection of an `OPTIONS /` request generated an HTTP
405 console error, retained in the raw evidence. Safari also recorded the same
two CSS preload warnings as Chrome. No uncaught application JavaScript error was
observed; the verification does not establish a warning-free console.

Native keyboard navigation used Option-Tab without changing the owner's keyboard
preferences, following [Apple's Safari keyboard shortcuts](https://support.apple.com/en-gb/guide/safari/cpsh003/mac).

## Production content and references

Before publishing, authenticated reads found no published or draft `methodsPage`.
The proposed document passed validation against the current Studio schema with
exit 0 and no reported issues. A create operation published the singleton without
overwriting an existing document or editor draft.

| Group      | Approved clinic image | Resolved existing treatment   |
| ---------- | --------------------- | ----------------------------- |
| `manual`   | `Iastm.jpg`           | `cupping` — Giác hơi          |
| `electro`  | `ElectroPulse.jpg`    | None                          |
| `rehab`    | `Coaching.jpg`        | None                          |
| `cold`     | `ColdPlungeTub.jpg`   | `cold-plunge` — Ngâm lạnh     |
| `infrared` | `Infrared.jpg`        | `heat-light` — Đèn hồng ngoại |

- Five groups use the approved seed copy, filter IDs, image metadata and existing
  strong references. No new treatment or medical claim was introduced.
- Reused three production assets and uploaded only the missing `ElectroPulse.jpg`
  and `ColdPlungeTub.jpg`. Local SHA-1 values match the approved staging assets;
  provenance is documented in [PRODUCT.md](../PRODUCT.md).
- Published at **2026-10-13 04:39:15.717 UTC**, revision
  `4va9zR1kOKU6h4oimKAZr7`.
- All **79 pre-existing production records** retained their original revisions.
  Additions were exactly two image assets and the singleton.
- Public production projection resolves all five groups and three references.
  All five image URLs returned HTTP 200; all three Preview detail routes returned
  HTTP 200 and the index renders their links.

## Automatic webhook and Preview configuration

Production webhook `Syff8uI7XZEcKd5Q` retained its configuration and target
`https://www.holisticvn.com/api/revalidate`. Its automatic delivery was correlated
with the newly published production singleton through the message dataset and
payload `_id`/`_type`, then checked against the delivery attempt.

| Evidence            | Observed value                    |
| ------------------- | --------------------------------- |
| Dataset / document  | `production` / `methodsPage`      |
| Message             | `msg-3KcokCs39IPTXg1Tf5DZeUd55IH` |
| Attempt             | `atm-3Kcok7IiOUqCLqlcdBz9h2m98bd` |
| Attempt time (UTC)  | 2026-10-13 04:39:17.345           |
| HTTP / failure flag | 200 / false                       |
| Response            | `{"revalidated":true}`            |

The production endpoint also returned **200 with its configured secret** and
**401 without a secret**. Delivery records were queried through the
[Sanity Webhooks API](https://www.sanity.io/docs/http-reference/webhooks).

The branch Preview initially had an empty revalidation secret. Added a dedicated
secret scoped to this branch's Preview environment and redeployed the existing
application revision to Preview. Corrected an initial newline in the environment
value, then verified the final Preview's authenticated revalidation returned
**200** and rendered the seeded production groups, images and related links.
Production environment values and webhook configuration were preserved.

## Evidence and remaining work

Current browser screenshots, runtime JSON, schema validation output, production
revision comparisons and webhook delivery records are saved in the workspace's
ignored `.context/` directory. Credentials and protection cookies are excluded
from this report and commits.

The existing PR attachments and [initial methods acceptance](METHODS_VERIFICATION.md)
and [copy/filter acceptance](METHODS_FILTERS_VERIFICATION.md) document the earlier
staging Studio publishing, invalid-draft validation, Vision, fallback tests and
temporary webhook edits/restoration. Those editor interactions were not rerun
during this production verification; current staging content was read and
validated against the current schema without mutation.

All PR acceptance/verification checklist items are complete. Remaining: review/merge
the PR and deploy application code through the normal release flow. Issue #9 stays
open for this handoff. CSS preload warnings remain recorded for follow-up.
