# Baseline verification — issue #2

Verified on 2026-10-05, branch `chore/2-reproducible-baseline`.
GitHub issue #1 and its child issues remain the task-status source.

## Reproduction

A detached Git worktree at `/tmp/holisticvn-issue-2-verification` was created
from the committed baseline. No `.env.local`, credentials, or installed packages
were copied from the development workspace. The public pages used local fallback
content. Node.js 24 is required by `.nvmrc`, package engines, and CI.

| Command | Result |
| --- | --- |
| `npm ci` | Passed from the clean checkout; upstream package deprecation notices remain |
| `npm run lint` | Passed, zero warnings |
| `npm run typecheck` | Passed: `next typegen`, then the explicit TypeScript 7 compiler |
| `npm test` | Passed: 6 files, all 24 existing tests |
| `npm run build` | Passed: Next.js 16.3.8 / Turbopack, 29 static pages generated |
| `npm run start -- --hostname 127.0.0.1 --port 3102` | Production fallback server started |
| `npm run smoke` | Four public pages returned 200; 14 local image URLs returned 200; invalid lead input returned 400 |
| `npm outdated --json` | Empty result for the declared direct dependencies |
| `npm ls --depth=0` | Passed, no invalid direct dependencies |
| `git diff --check origin/main...HEAD` | Passed |

The final tooling correction was checked in the separate worktree again: route
types are generated before explicitly invoking TypeScript 7. Next.js also runs
its own build check through the TypeScript 6 compatibility package. See
[dependency upgrade decisions](DEPENDENCY_UPGRADE.md) for the official sources,
compiler/API aliases, and ESLint compatibility adapters.

`.github/workflows/baseline.yml` repeats clean installation, lint, typecheck,
tests, production build, and HTTP smoke checks on pull requests to `main` and
pushes to `main`. Browser interactions below were checked locally; they are not
part of this workflow. Check the pull request for the remote CI result.

## Production browser checks

Playwright checked `/`, `/services`, `/treatments`, and `/booking` at each of
320, 768, and 1440 CSS pixels: 12 page/viewport combinations.

- All returned 200, with Vietnamese document language, one page `h1`, viewport
  metadata, title, description, and absolute canonical URL.
- No horizontal page overflow or broken rendered images occurred at these widths.
- Normal page loads produced no JavaScript runtime errors or console warnings.
- Production documents and browser requests contained no localhost live-preview
  script. Same-origin requests to the local verification server are expected.
- Keyboard Tab reached the visible skip link first; Enter targeted `#main`.
  Keyboard activation opened the mobile menu, Escape closed it, and focus returned
  to its trigger.
- Rejecting analytics stored the consent choice and hid the banner after reload.
  No analytics requests occurred in this unconfigured fallback environment;
  behavior with configured tracking IDs needs separate consent verification.
- Submitting synthetic booking input against the checkout without Resend
  configuration returned 503, displayed the retry/call message, retained inputs,
  and re-enabled submission. No real email or customer data was used.
- All four pages also fit a 720 CSS-pixel viewport. This is a narrower-viewport
  check, not direct verification of browser zoom. A separate CSS `zoom: 2` stress
  check exposed home-page overflow at a 768-pixel viewport; include this in the
  responsive follow-up review.

Screenshots and local command/browser evidence are stored in the gitignored
workspace `.context/` directory. The PR contains the durable verification summary.

## Frontend Checklist review

The user-requested [Frontend Checklist MCP](https://mcp.frontendchecklist.io)
provided its launch workflow and `review_code` checks for rendered HTML, filtered
to high/critical priority. Each page received 105 checks:

| Page | Raw findings | Critical / high |
| --- | --- | --- |
| Home | 10 | 1 / 9 |
| Services | 9 | 0 / 9 |
| Treatments | 10 | 1 / 9 |
| Booking | 12 | 1 / 11 |

Home exceeded the service's 100 KB request limit; its inline hydration scripts
were removed for the semantic HTML review. Production scripts were independently
checked through HTTP and browser requests. Raw counts include heuristic findings;
they do not establish that every finding is a defect, or that the checklist passes.

Confirmed follow-up observations:

- Treatments skips from `h1` to method-card `h3` headings; review under issue #9.
- The response has no CSP header. Deployment/security configuration needs review
  under the security and launch work in issues #3 and #27.
- The reviewed public documents have no JSON-LD. Structured data, canonical domain,
  and preview indexing policy belong to SEO work in issue #18.
- Responsive/zoom behavior needs the broader UI review in issue #7.

Findings requiring context:

- The unlabelled input is the intentionally hidden anti-spam honeypot, with
  `aria-hidden` and removal from the tab order. Visible inputs have labels.
- Forms handle submission in React and send JSON using `fetch` with POST. The
  missing HTML `method` warning does not describe their hydrated submission path.
- Three logos are SVGs with intrinsic dimensions and responsive CSS; raster
  `srcset` variants are unnecessary. Content images use Next.js responsive image
  output; absence of `<picture>` alone does not prove a responsive-image failure.
- The head script without `async` is Next.js's generated `noModule` polyfill.
  Modern browsers skip it; it is not the removed live-preview script.
- An absent robots meta tag does not by itself establish conflicting directives.
  Preview `noindex` still needs verification on the actual deployment.

## Verification boundaries

Latest stable dependencies and compatible transitive refreshes still produce
24 npm audit findings: 13 high, 11 moderate, zero critical. The remaining chains
and suggested direct-package downgrades are documented in
[DEPENDENCY_UPGRADE.md](DEPENDENCY_UPGRADE.md). This baseline is not a security
or launch sign-off.

Live Resend delivery, configured Sanity Studio, Supabase auth/RLS and historical
CRM behavior, configured analytics consent, Safari/Firefox, actual browser zoom,
contrast measurement, and Core Web Vitals were not verified here. Their acceptance
criteria remain in the corresponding child issues of #1.

Only `.env.example` is tracked. Local environment files, provider secrets,
generated output, editor/agent caches, private workspace documents, and the
Supabase CLI cache are excluded. The development-only live-preview script was
removed before the application baseline was committed.
