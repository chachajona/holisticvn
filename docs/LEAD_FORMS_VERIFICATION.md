# GH-12 booking/contact verification

Recorded 2026-10-29. Tracking: GitHub #12, child of #1.

## Scope decisions

- Owner confirmed on 2026-10-29 that only one clinic operates (see `PRODUCT.md`), so
  the "two branches" criterion became one clinic. Booking has no branch selector.
- Owner asked for no kind, source or branch labels in the email. The treatment row
  appears only when a visitor submits the treatment form. Templates and
  `lib/email.ts` are unchanged. The API's user-facing error text was revised during
  the copy review below; validation, status codes and delivery behavior are unchanged.
- Hero quick consult is included. Toasts use `sonner@2.0.8` for submit results; field
  errors stay inline.
- `/api/leads` returns no field names, so server 400s show in the error toast rather
  than under a field. Client and server share `leadSchema`, which makes them rare.

## Behavior

| State                    | `LeadForm` (contact, booking, treatment)                   | Hero quick consult                                     |
| ------------------------ | ---------------------------------------------------------- | ------------------------------------------------------ |
| Invalid input            | Inline error per field, `aria-invalid`, focus on first one | Inline phone error, `aria-describedby`, focus on phone |
| Pending                  | Button disabled; second submit ignored                     | Button disabled                                        |
| Network, 429, 502, 503   | Persistent toast with the server message and a `tel:` link | Same                                                   |
| Success                  | Toast explaining staff will call back; form resets         | Same                                                   |
| Data after failed submit | Kept                                                       | Kept                                                   |

Contact shows the Lê Quốc Hưng address with a Google Maps link, phone, email and
09:00–21:00 daily hours. Direct phone and chat links load nothing third-party and
need no analytics consent; `track()` is a no-op without consent.

## Evidence

- `npm run build`, `eslint`, `tsc`, `prettier --check` and `vitest` pass, including the
  new `tests/lead-client.test.ts` and `tests/lead-form.test.tsx`.
- Browser (Playwright, production build): invalid input, aborted network, 502 and
  503 (mocked and the real local 503 with no Redis/Resend), success and reset at 320 px;
  hero invalid, 503 and success at 768 px; no horizontal overflow at 320, 768 and
  1280 px. Toaster region is `aria-live="polite"`. Cookie consent not accepted
  during these runs, and submission worked.
- Real delivery: with `RESEND_FROM_EMAIL=no-reply@holisticvn.com`, a treatment-page
  (Giác hơi) submission returned 200 and the notification arrived in the staging
  inbox with name, phone and "Liệu pháp: Giác hơi" in the unchanged template. A sender
  on `gmail.com` is rejected by Resend with 403, which the API reports as 502.

## Not covered

- Mobile autofill and keyboard behavior on a physical device.
- Error toasts use a polite live region; a screen-reader pass has not been done.

## Review fixes — 2026-10-30

- Error toasts now resolve the approved clay background even outside page-scoped
  color variables. Production Chromium measured `#744d40` behind `#f7f3f0` text
  (6.61:1 contrast). The call link is underlined with a visible keyboard focus
  outline; notification and close-button labels are Vietnamese.
- `LeadForm` has a persistent alert region for validation errors. Focus moves
  after the error descriptions and ARIA attributes have rendered. Regression tests
  reproduce the previous missing announcement and focus timing; corrected fields
  clear their error without moving focus again.
- Format, lint, typecheck, production build and 417 tests (53 files) pass. Build
  verification used an isolated copy; Next reported the additional lockfile from
  that copy, with no route or application warnings.
- Production-browser checks passed for contact errors (429/502/503 and aborted
  network), retained input, successful reset, booking validation and hero phone
  validation. The call link is reachable through toast keyboard navigation, and
  Enter closes the notification. No horizontal overflow at 320/768/1280 px.
  Cookies were rejected; all five API requests were intercepted, so this check
  sent no email. The earlier real-delivery evidence above still applies.
- These DOM and keyboard checks do not replace the physical-device and actual
  screen-reader checks listed above.

Copy was also reviewed with [Humanizer](https://github.com/blader/humanizer).
Success messages explain that Holistic will call to discuss or confirm the
appointment. Network errors ask the visitor to check their connection and retry;
other errors offer a retry without repeating the adjacent call link.

## Convention refactor — 2026-10-30

- Root layout now composes `LeadToaster`; Sonner configuration and toast styles
  live together in `components/lead-toast.tsx` and its CSS module. Theme variables
  apply directly to each toast so Sonner's inherited theme defaults cannot
  override the approved colors. Call-link styles no longer need global selectors.
- `LeadPayload` comes from `z.input<typeof leadSchema>`, preserving optional input
  defaults while checking submitted field names and kinds. `LeadInput` remains
  the parsed server input; `validateLead` still validates unknown data at runtime.
- Both forms use React's `SubmitEvent` type (the installed React types deprecate
  `FormEvent`), explicit payload checks and consistent names for form data and
  phone errors. `LeadForm` derives its sending flag and
  button label, narrows change-event targets without a cast, and only updates
  field errors when an error needs clearing. Copy and delivery behavior are unchanged.
- Format, lint, typecheck, all 417 tests in 53 files and an isolated production
  build pass. Existing behavioral assertions are unchanged; the client test
  fixture now checks the shared payload type.
- Production Chromium checks cover contact validation, retained values after
  429/502/503/network errors, successful reset, keyboard focus on the call link
  and Enter to dismiss. Booking, treatment context and hero validation/submission
  also pass. Contact has no horizontal overflow at 320/768/1280 px. Toast colors,
  font, focus outline and Vietnamese close label were checked after extraction.
  All API requests were intercepted; no email was sent. This run used fallback
  content without environment secrets.
- Console output includes the expected intercepted API failures and unused CSS
  preload warnings for prefetched services/treatments routes, whose styles are
  unchanged by this refactor. No application exceptions were observed. The
  physical-device and screen-reader checks above remain outstanding.

## PR #55 readiness follow-up — 2026-10-30

- Fixed the hero phone-validation gap identified by the independent spec review.
  Invalid input now has a persistent inline alert associated with the phone field
  through `aria-describedby`. Focus moves after the error text has rendered;
  editing clears the error without stealing focus. Submit results still use the
  shared success/error toasts; the unused timed validation-toast helper was removed.
- Three regression tests failed against the old component, then passed after the
  fix. They cover persistence beyond the old six-second timeout, the description
  available at focus, correction/repeated invalid submission, pending protection,
  quick-consult payload context and successful reset.
- Format, lint, typecheck, **420 tests in 54 files**, production build and fallback
  smoke pass. A focused independent follow-up found the original P2 resolved and
  no new concrete regression.
- Production Chromium at 320/390/1440px verified the linked error, focus and edit
  clearing without horizontal overflow. At 390px it remained visible after seven
  seconds. Mock 503 failures retained the phone and offered the direct call link;
  delayed success kept the button disabled, blocked another Enter submission and
  reset only after success. Cookies were rejected. All six valid requests were
  intercepted locally; no email was sent.
- Contact desktop/mobile and the hero inline-error state are published as review
  evidence in `docs/review-evidence/pr-55/`. These are local production captures,
  not authenticated Vercel Preview screenshots. Physical-device autofill, actual
  screen-reader behavior and final-page real-Sanity coverage remain unverified;
  the existing shared cookie-banner observation remains recorded separately.
