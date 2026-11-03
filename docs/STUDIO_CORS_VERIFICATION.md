# Production Studio CORS — issue #57

Refs [#57](https://github.com/chachajona/holisticvn/issues/57), under release
acceptance #27 and roadmap #1. Recorded 2026-11-03 (Asia/Ho_Chi_Minh).

## Cause and applied change

The embedded Studio at `https://www.holisticvn.com/studio` uses Sanity project
`yjzexxml`, dataset `production`. The original investigation found that the exact
www origin was missing from the project's CORS allowlist. Browser preflights for
`/v2026-05-04/users/me?tag=sanity.studio.users.get-current.initial` lacked
`Access-Control-Allow-Origin`, and Studio displayed “Connect this Studio to your
project”.

The owner authorized this production configuration change in the attached
brainstorming session:

```bash
NEXT_PUBLIC_SANITY_PROJECT_ID=yjzexxml npx sanity cors add https://www.holisticvn.com --credentials
```

That command was already applied before this documentation PR. It added one exact
origin with credentials; the earlier investigation reported the existing localhost
and Vercel preview origins were preserved. A read-only `sanity cors list` recheck
still shows www alongside those six existing origins, with no wildcard.

No application change, dependency installation change, dataset write or Studio
registration change is included in this PR. Successful login-provider rendering
does not establish whether Studio is registered for Sanity's additional hosted
schema features; that registration state was not independently verified here.

## Before and after evidence

The two original 1280 × 720 production browser captures and the original console log
were retained from the preceding investigation. Its transcript reported 24 console
errors before the fix, zero after, and a successful credentialed preflight after
the change. The missing-header baseline cannot be rerun without removing the fix;
it is represented by those preserved artifacts, rather than a new baseline test.

Before/after screenshots are presented directly in the
[PR #65 Evidence section](https://github.com/chachajona/holisticvn/pull/65).
Screenshot binaries are hosted as GitHub user attachments outside the repository.

| Before: connection prompt                                                                                      | After: login providers (fresh recheck)                                                                        |
| -------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| ![Studio before the CORS fix](https://github.com/user-attachments/assets/55ae25f3-a0f5-4c01-87b0-f76fd752e426) | ![Studio after the CORS fix](https://github.com/user-attachments/assets/4f9e6be2-6be3-450c-b917-b1760f96edc2) |

Original [before console log](review-evidence/issue-57/console-before.log).
The screenshots contain no editor session or customer content.

## Independent production recheck

At **2026-11-03 03:50:17 UTC / 10:50:17 ICT**, a fresh unauthenticated browser
context in Chrome **156.0.8078.80**, viewport **1280 × 720**, verified:

- “Choose login provider” is visible with Google, GitHub and E-mail/password;
  the connection prompt is absent.
- **Zero console errors, zero warnings and zero page errors** during navigation
  through network idle and login-provider rendering.
- The actual `users/me` GET returns **200**, with
  `Access-Control-Allow-Origin: https://www.holisticvn.com` and
  `Access-Control-Allow-Credentials: true`. This anonymous response does not prove
  an editor session or dataset access.

Fresh [browser result](review-evidence/issue-57/after-recheck.json) and
[login capture](https://github.com/user-attachments/assets/4f9e6be2-6be3-450c-b917-b1760f96edc2).

Separate read-only HTTP checks at **03:49 UTC** verified:

| Check                                   | Observed result                                                         |
| --------------------------------------- | ----------------------------------------------------------------------- |
| Credentialed preflight for `users/me`   | HTTP 204; exact www allow-origin; allow-credentials `true`; GET allowed |
| `https://holisticvn.com/studio`         | HTTP 308 to `https://www.holisticvn.com/studio`                         |
| `https://www.holisticvn.com/studio`     | HTTP 200; `X-Robots-Tag: noindex, nofollow`                             |
| `https://www.holisticvn.com/robots.txt` | `Disallow: /studio` and `Disallow: /api`                                |
| Public homepage                         | HTTP 200; one `h1`; Holistic brand present in HTML                      |

This homepage check is an HTTP smoke check, not a complete public-site browser or
SEO audit. Raw HTTP headers remain ignored workspace artifacts in
`.context/evidence/`.

Reproduce the non-mutating preflight check with:

```bash
curl -i -X OPTIONS \
  'https://yjzexxml.api.sanity.io/v2026-05-04/users/me?tag=sanity.studio.users.get-current.initial' \
  -H 'Origin: https://www.holisticvn.com' \
  -H 'Access-Control-Request-Method: GET' \
  -H 'Access-Control-Request-Headers: content-type'
```

## Acceptance boundary and rollback

An authorized editor still needs to sign in and open the `production` dataset.
No authenticated editor read, permission-matrix test, publish, webhook or content
mutation was performed. Keep #57 open for review and that remaining verification;
this PR uses `Refs #57` rather than an automatic closing reference. GitHub remains
the source of task status.

This PR contains documentation and text review artifacts only; application tests and
build were not rerun for these files. Markdown formatting and diff checks apply.

Reverting the documentation does **not** undo the already-applied remote Sanity
setting. A project administrator can remove only the exact
`https://www.holisticvn.com` CORS entry to roll back that configuration; doing so
would restore the production Studio failure. Preserve all other origins and
existing authentication permissions.
