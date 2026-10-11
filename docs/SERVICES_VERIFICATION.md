# Services acceptance — issue #8 / PR #40

Recorded on 2026-10-12 (Asia/Ho_Chi_Minh). Application revision: `4387714`.
The subsequent acceptance commit adds tests and this record; application code is unchanged.

## Environment and owner decisions

- Vercel project: `chachajonas-projects/holisticvn`.
- Tested deployment: `https://holisticvn-qqruj85op-chachajonas-projects.vercel.app`.
- Branch alias: `https://holisticvn-git-feat-8-services-sanity-cta-chachajonas-projects.vercel.app`.
- Sanity project: `yjzexxml`. At inspection, the only dataset was public `production`.
- The owner chose a separate `staging` dataset and branch-specific Preview settings.
  No production content was changed during this verification.
- The owner chose mocked form responses rather than real email sends. Mailbox delivery
  and staff confirmation remain pending; no acceptance email was sent.
- Downloaded Preview credentials and protection cookies are kept only in ignored
  `.context/acceptance/` files and are not included in evidence or commits.

## Completed checks

### Deployed empty state and booking UI

The actual GROQ response contains no `servicesPage` document. The deployed `/services`
page returns its heading, pathway and general CTAs, with **zero service sections**.
`/booking?service=training` remains usable but has no selected-service context.
This verifies the missing-singleton behavior, not a completed catalogue rollout.

At **320 × 900, 768 × 900 and 1440 × 900**, `/services` and
`/booking?service=training` each have one `h1`, one `main#main`, no horizontal overflow
and no observed broken images. These checks cover the current empty catalogue only.

At 320 px, booking name, phone and submit controls are keyboard reachable. Input focus
uses the existing coral border and box shadow; the submit button has a browser outline.
Group cards, group CTAs and real treatment navigation still need a populated dataset.

### Mocked booking responses

Playwright intercepted both `/api/leads` requests before they reached the server.
Synthetic input was used, with no live provider or staff message:

- Mocked 503: error is shown, entered phone is retained and a call link is available.
- Mocked 200: fields reset and success explains the staff callback and that the request
  is not a confirmed appointment.
- Both captured payloads have `kind: booking` and `source: /booking`; neither has
  treatment context because the singleton is absent.

The intercepted 503 produces the expected browser resource error. Otherwise public
pages showed existing unused route-CSS preload warnings, rather than application errors.
Studio errors are recorded separately below.

### Email context regression

Five new tests render HTML and plain text without sending email:

- Every one of the three service-group bookings uses `Dịch vụ` and its service title.
- A `/treatments/cupping` request retains `Liệu pháp: Giác hơi`.
- A plain booking omits both context labels.

Running these tests with `lib/email.ts` from `0de7dac` produces the three expected
service-label failures. All five pass with the current email renderer. This verifies
rendering, not Resend delivery or how Gmail displays received messages.

The existing real Sanity-validator, mocked CMS, singleton-configuration and seed tests
also pass. They are automated schema evidence, not authenticated Studio acceptance.

### Seed input format

The installed CLI (`@sanity/cli` 8.13.1) accepts a single JSON object or an array.
Its `documents create` implementation wraps an object in an array and maps `--missing`
to `createIfNotExists`; the checked-in seed format is valid and repeat imports preserve
an existing document. CLI help confirms both project and dataset override flags.

After staging exists and its treatment documents are available:

```bash
npx sanity documents create scripts/seed/services-page.json --missing \
  --project-id yjzexxml --dataset staging
```

The seed contains copy only. Resolve real published treatment IDs by slug before adding
strong references; upload approved clinic photos to staging before selecting assets.
Production currently has `cupping`, `heat-light` and `cold-plunge` treatments. Do not
invent missing `dry-needling` or `iastm` records to match the local fallback.

### Legacy service inventory

Read-only inspection found four legacy `service` documents:

| Title              | Treatment slug | Reference |
| ------------------ | -------------- | --------- |
| Giác hơi           | `cupping`      | Strong    |
| Đèn hồng ngoại     | `heat-light`   | Strong    |
| Bể ngâm lạnh       | `cold-plunge`  | Strong    |
| Tập luyện trị liệu | None           | None      |

All three references resolve to existing treatments. No legacy document was deleted.
These references remain relevant to future treatment deletion even though the new
Studio schema no longer exposes the old service type. Full IDs are retained in the
ignored local inventory file.

## Access and configuration blockers

1. Creating `staging` was rejected with HTTP 401: the current write token lacks
   `sanity.project.datasets/create`. It can read production content and list datasets.
   The owner must create public `staging` or supply suitable Preview credentials before
   dataset population and branch configuration can proceed.
2. Webhook inspection was rejected with HTTP 401: the token lacks
   `sanity.project.webhooks/read`. Webhook setup and delivery cannot be claimed verified.
3. Preview has no configured `SANITY_REVALIDATE_SECRET`. Configure a branch-specific
   secret and a staging webhook that calls `/api/revalidate` with `x-sanity-secret`.
   The webhook must also pass Vercel deployment protection; browser access alone does
   not establish that a Sanity webhook can reach the endpoint.
4. The deployed Studio shows **“Connect this Studio to your project”**. Its requests
   to Sanity are blocked by CORS. Add the branch alias as a credentialed CORS origin,
   then use an authenticated Sanity session for Studio and Vision checks. A deployment
   URL used directly also requires its own origin entry.
5. Preview has no `RESEND_API_KEY` and an empty `RESEND_FROM_EMAIL`. Live delivery is
   deferred by owner decision, regardless of the passing mocked UI and render tests.

## Remaining acceptance

- [ ] Populate public `staging`, seed/publish `servicesPage`, add real references and
      optional approved images, and point only this branch's Preview variables to it.
- [ ] Publish changed copy/order/image/references and verify deployed services,
      treatment navigation and all three booking contexts.
- [ ] Verify authenticated Studio validation, locked group controls, reference removal
      and draft recovery; run the exact query in Vision.
- [ ] Verify an actual staging webhook updates cached public content promptly.
- [ ] Verify group cards/CTAs with keyboard and at 320/768/1440 px after seeding.
- [ ] Send a controlled booking and confirm received email with staff when the owner
      enables live sends.
- [x] Review retained legacy service documents and strong references before cleanup.

Production also needs its own published `servicesPage` before merging/deploying the
catalogue change. Staging acceptance must not be mistaken for production seeding.
Keep issue #8 open until the outstanding checks have evidence.
