# Approved methods copy and filters — issue #9

Historical staging record. Current PR CI, production publishing/webhook and Chrome
zoom results are in [PR checklist verification](METHODS_PR_CHECKLIST_VERIFICATION.md)
(2026-10-13); the pending/local-only statements below describe the earlier session.

Owner requested CMS and website updates on 2026-10-12 after reviewing the revised
[wording proposal](methods-wording-proposal.md). Branch remains local; no push, PR,
production deployment or production content mutation was performed.

## Applied content and mapping

Updated all five descriptions, the introduction and assessment CTA, the two display
names “Trị liệu bằng thiết bị” / “Tập luyện phục hồi & tăng cường”, and index subtitles.
Removed the old numeric “2–3 methods” assertion from the combination note. Homepage highlights use consistent device naming and revised infrared/cold/rehab excerpts, replacing the older self-healing and recurrence assertions.
Fallback and JSON seed mirror the approved content.

`filterTags` is an additive CMS array of stable IDs selected from
`lib/method-tags.ts`. The old `tags` field retains Vietnamese display labels for
older deployed readers during the deployment handoff and is read-only in the new Studio. It is a deployment-time snapshot; future filter edits do not synchronize legacy readers, and the active Preview uses the new field. The new reader uses
`filterTags`; when that field is absent/null it recognizes exact approved display
labels only. Explicit `[]` stays empty. Unknown IDs are dropped individually. Independent review identified focus, navigation copy and test coverage gaps; all were patched. The verification reviewer confirmed the tracked interaction coverage closes both reported gaps.

| Group    | Assigned filter IDs                                                     |
| -------- | ----------------------------------------------------------------------- |
| manual   | neck-pain, back-pain, muscle-stiffness, limited-movement, pain-relief   |
| electro  | muscle-stiffness, pain-relief                                           |
| rehab    | limited-movement, pain-relief, injury-rehab, strength, movement-control |
| cold     | post-workout-recovery                                                   |
| infrared | muscle-stiffness                                                        |

The registry contains ten labels; nine currently have related content and appear
on the website. `hip-pain` is available in Studio but is not assigned or offered on
the public filter yet. Regional labels for devices/infrared were not inferred from
generic clinical aims or photos. Filtering finds related reading, not a prescription.

## CMS and Preview

- Project/dataset: `yjzexxml/staging`.
- Preview: <https://holisticvn-26xvu8er2-chachajonas-projects.vercel.app/treatments>.
- Checked for an existing editor draft, saved the published snapshot privately,
  then patched copy/labels with `ifRevisionId`.
- Published copy revision: `0WplzLrkq33JxwTO2DKrEd`.
- Images, image metadata, group keys and all existing treatment references were
  preserved exactly; no treatment document was added.
- Actual Studio showed the new **Nhãn bộ lọc** field with ten checkbox choices.
  Isolated browser authentication used the authorized CLI token only in memory;
  browser context was closed afterward.
- CLI validated the updated published singleton against the current Studio schema:
  exit 0 and no reported issues. Clean NDJSON validation emits no document row.
- Existing staging webhook `73iQNVV10WENgFmC` now targets the new Preview. Dataset,
  filter, triggers and private headers were preserved. Production webhook was
  compared before/after and remained unchanged. Added this Preview origin to CORS.

Temporarily removed `strength` from rehab's `filterTags`. Without manual
revalidation or deployment, the public strength filter disappeared. Restored the
approved groups with a revision guard; the filter returned automatically.
Final published revision: `8aI8S9xlkRICgxHcEtQGGU`; no editor draft was overwritten.

| Automatic attempt (UTC) | HTTP | Attempt ID                      |
| ----------------------- | ---- | ------------------------------- |
| 2026-10-12 10:10:13.558 | 200  | atm-3KadrvNrYc098tuMUxorBrKdYQM |
| 2026-10-12 10:10:18.230 | 200  | atm-3KadsLLvlvJvGEYCiMeDMSDYlRa |

Webhook operations follow the [Sanity Webhooks API](https://www.sanity.io/docs/http-reference/webhooks).
Use its document-webhook API version; the older `v2021-06-07` list only exposed
legacy hooks and returned an empty list here. No hook was created or deleted.

## Website behavior and verification

Server rendering retains all five sections, images and real detail links. A small
client boundary controls filters and receives rendered section slots. Multiple
selections use OR across both categories. Buttons show pressed state and a check
mark, selected labels and result count are visible, and clear restores all groups.
Selections do not enter URLs or analytics. A no-result state offers clear and
assessment actions without implying the clinic cannot help.

Hidden groups remain in the DOM; canonical numerals and image alignment do not
change. Index/footer fragment links clear filters, reveal their target and move
focus after the visibility update commits, including a click to the same current hash. When deselecting
a group tag hides its own section, focus moves to the corresponding top filter and that control scrolls into view immediately. Clearing an empty-result state focuses the persistent heading. Controls are disabled until hydration; without JavaScript all five groups remain readable.

Passed:

- Format, lint, typecheck, **189 tests**, production build.
- Production fallback smoke: seven routes, 25 local image URLs and invalid form input.
- Homepage on final staging: revised excerpts and device category present, older self-healing/inflammation phrases absent, one h1 and no horizontal overflow at 320/768/1440.
- Six tracked DOM interaction tests run in the normal `npm test` path: selection/OR, pressed states, count, clear, index/footer same-hash navigation, focus recovery, empty results after CMS refresh and disabled SSR controls. The earlier ignored browser script remains supplementary real-browser evidence.
- Unit/schema tests: OR matching, exact legacy normalization, unknown-ID siblings,
  missing versus empty IDs, controlled choices beyond the old five-tag cap,
  duplicate/unknown ID rejection and seed/fallback parity.
- Isolated Chrome against fallback and real staging: multi-select across categories,
  toggle/clear, synchronized group controls, count updates, keyboard Space and visible
  focus, focus recovery, index and footer same-hash recovery, direct fragment load.
- All five fragment targets remained below the sticky header at 320/768/1440 widths;
  also checked 720×450 reflow. No horizontal overflow or observed broken images.
- Final fallback and staging interaction runs had no uncaught JavaScript exceptions, console errors or warnings. An earlier Preview run observed two transient Next route-prefetch CSS preload warnings; the final run was clean without disabling shared route prefetching.
- Impeccable detector: advisory type/color ramp findings only; incumbent visual
  system preserved. Selected controls use sage with a light foreground and visible
  check marks, and keyboard controls have explicit focus outlines.

Native Safari and actual browser zoom were not tested; the 720×450 check establishes
reflow only. Hosted CI remains pending branch publication. Production rollout is
deferred under the user's local-branch preference.

Evidence remains in ignored `.context/`: `method-filters-staging-final-{320,768,1440}.png`,
`method-filters-studio.png`, browser check results, schema validation, CMS snapshots
and webhook proof. Credential-bearing snapshots are mode 600 and excluded from git.
