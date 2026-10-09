# Launch content inventory

Issue [#4](https://github.com/chachajona/holisticvn/issues/4). Source of truth for what may ship. Status: **confirmed** (evidence recorded), **hidden** (no verified evidence), **omitted** (owner decision), **removed** (no longer applicable). Last reviewed 2026-10-07.

| Item                                         | Value / location                                                      | Source                                                                                                                                                                  | Status    |
| -------------------------------------------- | --------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------- |
| Phone                                        | 082 895 9598 (`site.phone`)                                           | Live [holisticvn.com](https://holisticvn.com); Google Maps listing (+84 828 959 598)                                                                                    | confirmed |
| Email                                        | Holisticrep9@gmail.com (`site.email`)                                 | Live holisticvn.com, per `PRODUCT.md`                                                                                                                                   | confirmed |
| Sole clinic                                  | 109/15 Lê Quốc Hưng, P. Xóm Chiếu, TP. Hồ Chí Minh (`site.address`)   | Owner explicitly confirmed 2026-10-07: “Xác nhận chỉ có cơ sở ở Lê Quốc Hưng”                                                                                           | confirmed |
| Former clinic                                | 205 Nguyễn Đình Chiểu, P. Bàn Cờ                                      | Owner 2026-10-06: only one clinic remains; 2026-10-07 confirms Lê Quốc Hưng. Removed from public locations and booking form                                             | removed   |
| Opening hours                                | 09:00–21:00, all seven days (`site.hours`)                            | Owner, per `PRODUCT.md`; Google Maps shows “Opens 9 AM”                                                                                                                 | confirmed |
| Testimonials (5 Google reviews)              | `testimonials` in `lib/content.ts`; excerpts listed below | Verbatim excerpts from the public Google Maps listing, read 2026-10-09 in the Vietnamese view; each card names the reviewer as given name + last initial and "Google" | confirmed |
| Legacy quotes (3)                            | removed from `testimonials`; still in git history | Not found on the Google listing (searches "uy tín" and "an tâm" returned none, in a limited signed-out view). Source was the old homepage screenshot + brand deck | removed   |
| Aggregate rating / review count              | 5.0 stars, 645 Google reviews (`reviewSummary`)                                                                                                                        | [Google Maps: Holistic Rehab & Performance](https://maps.app.goo.gl/9RmecBoycrAkhBE39), re-read 2026-10-09 (638×5★, 2×4★, 3×3★, 0×2★, 2×1★; 644 on 2026-10-06). Replaces the unsourced “41 reviews”                                         | confirmed |
| Individual testimonial stars                 | 5★ on each Google review card (`rating`)                  | Each excerpt is a 5-star review on the listing (see below)                                                                                                       | confirmed |
| Public domain / canonical                    | `https://holisticvn.com`                                              | Owner decision 2026-10-06; all `NEXT_PUBLIC_SITE_URL` fallbacks aligned                                                                                                 | confirmed |
| Team photo                                   | `public/images/team.jpg`, shown on `/about` without personal captions | Owner supplied `public/images/team.jpg` directly on 2026-10-07 (1920×1281); identical to the approved legacy `Link3` image. Rendered at quality 90                      | confirmed |
| Clinic photos in `public/images`             | Signage, Massage, Stretching, Therapy, team, etc.                     | Owner 2026-10-06: photos come from the [clinic fanpage](https://web.facebook.com/vatlytrilieuganday.phuchoichucnangganday) and may be reused                            | confirmed |
| Service model copy                           | “Đồng hành xuyên suốt từ tư vấn đến tập luyện”; “lộ trình xuyên suốt” | Reworded 2026-10-06 per owner; does not claim a single practitioner or single record                                                                                    | confirmed |
| Founder story                                | Removed from homepage intro                                           | No evidence for “phòng trị liệu nhỏ, do những người từng chấn thương lập nên”                                                                                           | hidden    |
| Individual bios                              | None; team photo only                                                 | Owner confirmed 2026-10-07: “Không cần tiểu sử cá nhân”                                                                                                                 | omitted   |
| Personal names, credentials, teaching claims | None in UI                                                            | No verified evidence; do not infer credentials from the team photo                                                                                                      | hidden    |
| Numeric outcome claims                       | None as site claims; customer words remain inside quotes              | No evidence for independent site claims                                                                                                                                 | hidden    |

## Confirmed launch decisions

- Only Lê Quốc Hưng is public. Legacy Sanity location settings cannot restore the closed clinic; other CMS contact channels remain editable.
- Individual bios are not required and are not an outstanding owner action.
- Show the real team photo. Earlier decision: retain the three sourced legacy quotes. Superseded 2026-10-09 on the workspace request to use real Google reviews: the legacy quotes were removed from the homepage and can be restored from git. Show the Google aggregate as a linked badge; per-card stars appear only on cards that are real Google reviews, never inferred from the aggregate.
- No owner content decisions remain open for this inventory. Preview verification and acceptance are tracked in issue #4 and its PR; staging with real Sanity data remains a separate verification step.

The prior owner decisions are recorded in the supplied brainstorming transcript; the 2026-10-07 confirmations above come from the current workspace conversation.

## Google review excerpts on the homepage

Source: [Google Maps listing](https://maps.app.goo.gl/9RmecBoycrAkhBE39), Reviews tab, Vietnamese view (`?hl=vi`), read 2026-10-09 (the signed-out view loads only 8 reviews). Evidence screenshots are kept locally under `.context/` (`google-reviews-vi-source.png`, `gr-evidence-*.jpg`). Google shows only relative ages, so the month is approximate. Reviewers are shown as given name + last initial. No reviewer avatar or review photo is used: review photos show customers' and staff faces, which the faceless rule in `PRODUCT.md` forbids, and the photos belong to the reviewers.

Selection rule (2026-10-09, owner request on the checklist review; relaxed 2026-10-10 for the lead card): the **excerpt shown** says nothing about treatment outcomes (pain, recovery, improvement). Staff, space, process and convenience are fine. Four of the five reviews are outcome-free in full; the lead (Thanh X.) is an outcome-free span of a review that claims an outcome elsewhere, cut at "…" on the owner's request for a longer lead. The full review stays readable through the Google link. The only text edit is dropping the space before commas in Giang H.'s excerpt.

Shown on the homepage:

| Shown as | Age on Google at read time | Rating | Excerpt (verbatim span, "…" where the review continues)                                                                                        |
| -------- | -------------------------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| Thanh X. | 8 months                   | 5★     | "… Không gian phòng trị liệu sạch sẽ, … không bị đau hay khó chịu. …" (sentences 2–4, lead card). The full review also says "lưng nhẹ hẳn … giảm đau rõ rệt" in the cut part; "không bị đau" refers to comfort during treatment, not a result |
| Thảo V.  | 11 months                  | 5★     | "… Ai cần giãn cơ sau khi tập thể dục thể thao thì nên đến đây …" (a use case, not a result; the original ends with an informal "nhaâ")        |
| Giang H. | 3 months                   | 5★     | "… kỹ thuật tay nghề tốt, cơ sở vật chất hiện đại, mọi người nên tới trải nghiệm" (starts after an emoji gap; spaces before commas removed)    |
| Dong L.  | 10 months                  | 5★     | Full review                                                                                                                                      |
| Phi H.   | 4 months                   | 5★     | Full review                                                                                                                                      |

Not shown (2026-10-09 and 2026-10-10):

| Reviewer | Age   | Why not shown                                                              |
| -------- | ----- | -------------------------------------------------------------------------- |
| Thái Đ.  | 5 mo  | "cảm giác đau viêm đã thuyên giảm", "hết đau" — outcome claim; its outcome-free span is shorter than Thanh X.'s |
| Nhi L.   | 6 mo  | "Có giảm đau rõ rệt sau khi làm xong" — outcome claim                      |
| Giang T. | 1 yr  | Outcome-free (4 sentences) but dropped on 2026-10-10 as the owner did not like it as the lead |

Homepage lead photo `Studio.jpg` is the clinic's own photo from the Google Maps listing ("By owner" photos), downloaded 2026-10-09 and resized to 1400 px; it shows gym equipment and no people.
