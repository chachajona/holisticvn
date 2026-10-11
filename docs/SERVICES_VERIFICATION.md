# Services acceptance — issue #8 / PR #40

Recorded on 2026-10-12 (Asia/Ho_Chi_Minh). Application revision: `4387714`;
staging deployment source: `e730f47`. CLI follow-up: `5227617`. Authenticated Studio/Vision acceptance ran on that
preview; validation localization follow-up: `d67fd39`. Public application behavior
is unchanged by these follow-ups.

## Environment and owner decisions

- Vercel project: `chachajonas-projects/holisticvn`.
- Tested staging deployment: `https://holisticvn-dcox0jho6-chachajonas-projects.vercel.app`.
- Branch alias: `https://holisticvn-git-feat-8-services-sanity-cta-chachajonas-projects.vercel.app`.
- Sanity project: `yjzexxml`. The owner created public `staging` for this acceptance.
- Only Preview branch `feat/8-services-sanity-cta` uses `staging` through
  `NEXT_PUBLIC_SANITY_DATASET`, `SANITY_API_DATASET` and `SANITY_STUDIO_DATASET`.
  Pulling another branch's Preview environment confirmed it still uses `production`.
- The owner deferred live email sends. Browser submissions were intercepted before
  reaching `/api/leads`; no provider or staff message was sent.
- Credentials, protection cookies, raw SDK results and screenshots are kept in ignored
  `.context/acceptance/` files. Secret values are excluded from evidence and commits.

## Completed staging checks

### Seed, photos and references

Seeded the published `servicesPage` singleton with the checked-in three-group copy.
Uploaded existing approved clinic photos (`Iastm.jpg`, `Coaching.jpg`, `Infrared.jpg`,
`Cupping.jpg`, `ColdPlungeTub.jpg`; provenance in `PRODUCT.md`) to staging.
Copied the three real published treatments into staging with staging image assets:

| Group      | Linked treatment slugs      |
| ---------- | --------------------------- |
| `therapy`  | `cupping`                   |
| `training` | None                        |
| `recovery` | `heat-light`, `cold-plunge` |

References are strong. No missing `dry-needling` or `iastm` treatment was invented.
Rendered CMS image URLs point to `/images/yjzexxml/staging/`.

Installed CLI 8.13.1 accepts the single-object JSON seed but refused to run without a
CLI config even with project/dataset flags. Added `sanity.cli.ts` using the same settings
as Studio. With a private `SANITY_AUTH_TOKEN` environment value, this actual command passed:

```bash
npx sanity documents create scripts/seed/services-page.json --missing \
  --project-id yjzexxml --dataset staging
```

Repeating it reported `Skipped (already exists): servicesPage`. Enriched copy, images
and references were preserved; this checks content preservation, not revision-ID stability.

### Published content and cache

On staging only, temporarily changed training title/summary/image, reordered the groups
to recovery/training/therapy, removed the therapy treatment reference and removed its CMS
image. After an authenticated manual `POST /api/revalidate`, the deployed page showed the
changed copy/order/image, omitted the cupping link and loaded local `Iastm.jpg` for the
missing image. Booking and its intercepted payload used the changed training title
without a code deployment.

Restored the original groups using a revision guard and revalidated again. Confirmed
therapy/training/recovery order, original titles/images and the cupping link returned.
All three treatment links were clicked and reached their actual detail routes with the
expected heading and booking form. No acceptance markers or probe documents remain.

The endpoint returned **200** with the branch secret and `{"revalidated":true}`;
omitting the secret returned **401**. These initial requests tested manual invalidation.
Automatic webhook evidence is recorded separately below.

### Responsive, keyboard and mocked booking

At **320 × 900, 768 × 900 and 1440 × 900**, populated `/services` had one `h1`, one
`main#main`, no horizontal overflow and no broken images after scrolling through lazy
images. Screenshots were inspected at all three widths.

Tab reached all three group cards and three booking CTAs in order at each width.
Each showed a visible browser focus outline. After scrolling the focused control into
view, its center was unobstructed. CTA accessible names distinguish the three groups.

Clicked every group CTA and checked the matching booking context. At 320/768/1440 px,
respectively, therapy/training/recovery forms were submitted with intercepted responses:

- **503:** error shown, entered phone retained, clinic call link available.
- **200:** fields reset; success explains the staff callback and that this is not a
  confirmed appointment.
- Each payload contained `kind: booking`, `source: /booking` and the correct full
  service title in `treatment`. No live request reached the lead endpoint.

A separately intercepted cupping-page submission carried `source: /treatments/cupping`
and `treatment: Giác hơi`, preserving treatment context.

Public pages showed existing unused route-CSS preload warnings. Intercepted 503s produce
the expected resource error; no additional public application error was observed.

### Schema and Content Lake

Six temporary credentialed SDK tests ran the real Sanity validator against the seeded
staging document and real targets. All passed: valid published content; missing group;
duplicate group; missing summary; asset without alt (Vietnamese error); duplicate
reference. Authenticated Studio checks additionally confirmed that Publish is disabled for
missing summary/alt, duplicate treatment references, and duplicate/missing groups.

Created a malformed `drafts.servicesPage` with duplicate groups. The published-perspective
query continued returning the valid page. Removed the test draft and confirmed published
content unchanged. Repeated this in authenticated Studio: Discard changes removed the malformed draft
and preserved the published groups exactly. Also discarded the invalid copy/alt and
duplicate-reference drafts through the actual confirmation dialog.

Ran the exact `getServices()` projection against Content Lake and confirmed copy,
staging image URLs and resolved slugs. With isolated temporary reference probes, deleting
a strongly referenced target was rejected with **409**. After making the probe reference
weak and deleting its target, `treatments[]->{...}` returned **[null]** and
`array::compact(...)` returned **[]**. Both probes were removed. In authenticated Vision on `staging`, API `v2025-01-01`,
perspective `published`, the exact `getServices()` projection returned all three
groups with staging images and real treatment slugs. A read-only literal weak
reference to an absent target returned `[null]`; its compacted projection returned
`[]`. Treatment Unpublish behavior remains untested.

Studio has no global Create option for `servicesPage`, no group Add control, and
only Copy in each group menu (no Remove/Duplicate/Add before/after). Group radios
are disabled. Singleton document actions expose Discard without Delete/Unpublish.

The deployed schema initially showed English `Required` and duplicate-reference
messages. `d67fd39` localizes required title/summary/body and duplicate-reference
errors; real-validator regression assertions failed before the fix and pass after it.
On the updated preview, missing summary/alt and duplicate references show the
Vietnamese messages and keep Publish disabled. Discard removed both test drafts.

### Authenticated Publish and automatic webhook

Using the owner-authenticated Sanity Manage session, created enabled webhook
`PR40 staging revalidation` (`73iQNVV10WENgFmC`) for **staging only**:

- Branch alias `/api/revalidate`, POST, Create/Update/Delete.
- Filter: `_type in ["servicesPage", "treatment", "sanity.imageAsset"]`;
  projection `{_id, _type}`; draft/version triggers disabled.
- Private custom `x-sanity-secret` and `x-vercel-protection-bypass` headers. Reused
  the existing project automation bypass via authenticated Vercel CLI; no secret
  values are included in screenshots or this report.

Primed the deployed `/services` page, edited only the training title in Studio and
clicked **Publish**. The published update at `2026-10-11T19:14:23Z` was followed by
an actual branch POST `/api/revalidate` **200** at `19:14:24.814Z` (1.814 seconds).
The deployed HTML and browser then showed the marker without any manual POST or
code deployment. Restored the title through Studio Publish at `19:16:05Z`; a second
automatic POST returned **200** at `19:16:07.195Z` (2.195 seconds). The first HTML
request after restoration still contained the marker; subsequent HTML and browser
reload showed the original title. Published groups match the baseline exactly and
no draft remains. This demonstrates automatic refresh, without guaranteeing the
first post-webhook request is fresh.

The existing production webhook targets `www.holisticvn.com` with **All datasets**;
its configuration was left untouched. Staging changes may therefore also invalidate
production cache, although production content was not edited. The staging webhook
occupies the second included webhook slot and should be removed when this preview
is retired. Configuration follows [Sanity custom headers and triggers](https://www.sanity.io/docs/content-lake/webhooks)
and [Vercel automation bypass](https://vercel.com/docs/deployment-protection/methods-to-bypass-deployment-protection/protection-bypass-automation).

### Email regression and legacy inventory

Five email-render tests cover all three service-booking labels (`Dịch vụ`), treatment-page
labels (`Liệu pháp`) and plain booking without context. The three service assertions fail
against renderer `0de7dac` and pass with the current one. Rendering does not prove delivery
or mailbox appearance. Repository suite: **120 tests / 25 files**.

Read-only production inspection found four legacy `service` records: Giác hơi,
Đèn hồng ngoại and Bể ngâm lạnh have resolving strong references; Tập luyện trị liệu
has none. No production content was changed or deleted. Production `servicesPage`
is still absent.

## Remaining acceptance and rollout

CORS follow-up: the owner added the credentialed branch origin. A real preflight to
Sanity returned **204**, the exact branch `Access-Control-Allow-Origin`,
`Access-Control-Allow-Credentials: true` and authorization-header permission.
Opening Studio in a separate test Chrome profile now reaches Sanity's GitHub sign-in
instead of the connection/CORS screen, with zero observed CORS errors. The owner
signed into this isolated profile; authenticated Studio and Vision checks passed.

- [x] Create isolated staging; seed the singleton, photos and real references; configure
      only this branch's Preview and verify its deployed dataset.
- [x] Verify CLI `--missing` preserves enriched content.
- [x] Verify published copy/order/image/reference changes and restore original content.
- [x] Verify treatment destinations, all three booking contexts, responsive and keyboard
      behavior on populated staging.
- [x] Verify manual authenticated revalidation, SDK validation, draft isolation and
      reference dereferencing.
- [x] Review legacy references before cleanup.
- [x] Add and verify the branch alias as a **credentialed CORS origin**.
      Direct deployment URLs require their own entry if used for Studio.
- [x] Sign into the test browser and verify Studio validation, locked controls,
      Discard and Vision in an authenticated Sanity session.
- [x] Confirm the localized validation messages on the updated deployed Studio.
- [x] Configure and verify an actual staging webhook through Vercel deployment
      protection, with HTTP 200 and an automatically refreshed published page.
- [ ] Send a controlled booking and confirm received email with staff when the owner
      enables live sends. Preview has no `RESEND_API_KEY` and an empty `RESEND_FROM_EMAIL`;
      delivery is deferred by owner decision.
- [ ] Seed/publish production before merging/deploying this catalogue change.
      Staging acceptance does not seed production.

Keep PR #40 as a draft and issue #8 open until outstanding checks have evidence.
Screenshots: `.context/acceptance/services-staging-{320,768,1440}.png`,
`services-staging-mutation.png`, `booking-staging-{320,768,1440}.png`,
`studio-validation-{missing-copy-alt,duplicate-reference,duplicate-group}.png`,
`studio-vision-services.png`, `studio-vision-dangling-reference.png`,
`studio-validation-vietnamese.png`, `studio-validation-vietnamese-duplicate.png`,
`staging-webhook-configured.png` and `services-webhook-published.png`.
