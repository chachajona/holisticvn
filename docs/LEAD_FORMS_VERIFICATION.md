# GH-12 booking/contact verification

Recorded 2026-10-29. Tracking: GitHub #12, child of #1.

## Scope decisions

- Owner confirmed on 2026-10-29 that only one clinic operates (see `PRODUCT.md`), so
  the "two branches" criterion became one clinic. Booking has no branch selector.
- Owner asked for no kind, source or branch labels in the email. The treatment row
  appears only when a visitor submits the treatment form. Templates, `lib/email.ts`
  and `/api/leads` are unchanged.
- Hero quick consult is included. Toasts use `sonner@2.0.8` for submit results; field
  errors stay inline.
- `/api/leads` returns no field names, so server 400s show in the error toast rather
  than under a field. Client and server share `leadSchema`, which makes them rare.

## Behavior

| State                    | `LeadForm` (contact, booking, treatment)                   | Hero quick consult                    |
| ------------------------ | ---------------------------------------------------------- | ------------------------------------- |
| Invalid input            | Inline error per field, `aria-invalid`, focus on first one | Toast, `aria-invalid`, focus on phone |
| Pending                  | Button disabled; second submit ignored                     | Button disabled                       |
| Network, 429, 502, 503   | Persistent toast with the server message and a `tel:` link | Same                                  |
| Success                  | Toast explaining staff will call back; form resets         | Same                                  |
| Data after failed submit | Kept                                                       | Kept                                  |

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
