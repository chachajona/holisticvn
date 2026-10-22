# PR #45 — review follow-up, 22 October 2026

Verified the five inline findings against `f7b8f16`; all reproduced. The three
general comments are deployment status and summaries of those findings, with the
additional bot-tool/documentation warnings assessed below.

| Finding                                                                                                             | Change                                                                                                                                                                                                    | Regression coverage                                                                                                      |
| ------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| [Legacy badge cannot be removed](https://github.com/chachajona/holisticvn/pull/45#discussion_r4346195498)           | Studio offers **Không hiển thị huy hiệu** (`none`), which overrides `isPopular`. Unset selection still preserves legacy behavior; the field explains the distinction. No content migration or CMS writes. | Schema options and explicit opt-out with/without the legacy flag.                                                        |
| [Dock stays over the form](https://github.com/chachajona/holisticvn/pull/45#discussion_r4346195504)                 | Observe the main content's size as well as scroll/resize, coalesce measurements into animation frames and disconnect on teardown.                                                                         | A mounted-component test moves the panel without scroll/resize; the dock becomes inert and stays hidden after expansion. |
| [Stock thumbnails lack disclosure](https://github.com/chachajona/holisticvn/pull/45#discussion_r4346195514)         | Related cards place a visible **Ảnh minh hoạ** figcaption beside each bundled stock thumbnail, including CMS image fallbacks. Clinic photos and no-photo cards retain their existing meaning.             | Mixed stock/clinic/no-photo cards; browser checks on real staging content.                                               |
| [Blank intro leaves dead link](https://github.com/chachajona/holisticvn/pull/45#discussion_r4346195525)             | Section visibility uses nonblank trimmed copy; the hero also skips a whitespace-only short description.                                                                                                   | Empty/space/newline copy omits both intro and its navigation link; hero fallback stays useful.                           |
| [Future treatment's empty SEO description](https://github.com/chachajona/holisticvn/pull/45#discussion_r4346211184) | Keep CMS → reviewed defaults → trimmed short copy → trimmed long copy → empty-string precedence.                                                                                                          | Future slug without reviewed defaults, whitespace short copy, all-blank copy and existing CMS/reviewed precedence.       |

## Executed verification

- The initial regression run failed on all five findings (eight failing cases).
- Format, zero-warning lint, typecheck, **361 tests / 49 files**, and production
  build passed after the fixes. Remote CI is linked separately in the PR description.
- Chromium against local code and Sanity staging, 390 and 1440 px: collapsing
  the first FAQ moved the consultation panel into view while `scrollY` and viewport
  dimensions remained identical. Dock changed from visible to inert in both cases.
- The same pages showed two visible stock-photo captions in related cards and
  no horizontal overflow. Screenshots are GitHub attachments in the PR description;
  detailed geometry is in `.context/review-fixes/browser.json` (gitignored).

## General comments and bot warnings

- Vercel's general comment reports deployment status; it does not request a code fix.
- Greptile's general summary duplicates the four inline findings above.
- CodeRabbit's SEO finding is fixed above. Its **31.43% docstring coverage** warning
  is informational: no repository configuration or CI task enforces an 80% JSDoc
  requirement. Existing purpose/behavior comments are retained; no metric-only
  boilerplate or lowered quality threshold was added.
- CodeRabbit's LanguageTool budget exhaustion and ESLint sandbox install timeout
  are tool execution limitations. Local repository lint and CI run independently;
  no dependency or bot configuration change was needed.
- Form/email end-to-end testing remains waived by the owner. This follow-up does
  not publish CMS content, promote staging to production, or claim final owner acceptance.
