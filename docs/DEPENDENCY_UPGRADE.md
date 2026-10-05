# Dependency upgrade — 2026-10-05

Direct dependencies were resolved from npm’s stable `latest` tags on this date and pinned exactly.
`npm update` also refreshed transitive dependencies within their declared ranges.
Install with `npm ci` on Node.js 24; `.nvmrc` and CI use the same runtime.

| Package | Before | Baseline |
| --- | --- | --- |
| `@react-email/components` | `^1.0.12` | `1.0.12` |
| `@react-email/render` | `^2.1.0` | `2.1.0` |
| `@sanity/client` | `^6.29.0` | `8.9.0` |
| `@sanity/vision` | `^3.61.0` | `6.17.0` |
| `@supabase/ssr` | `^0.7.0` | `0.12.7` |
| `@supabase/supabase-js` | `^2.75.0` | `2.117.2` |
| `next` | `15.5.9` | `16.3.8` |
| `next-sanity` | `^9.5.5` | `13.3.4` |
| `react` | `^19.1.1` | `19.3.0` |
| `react-dom` | `^19.1.1` | `19.3.0` |
| `resend` | `^4.0.0` | `6.32.0` |
| `sanity` | `^3.61.0` | `6.17.0` |
| `zod` | `^3.23.8` | `4.6.5` |
| `styled-components` | `added` | `6.5.3` |
| `@types/node` | `^22.10.2` | `26.6.4` |
| `@types/react` | `^19.0.2` | `19.3.0` |
| `@types/react-dom` | `^19.0.2` | `19.3.0` |
| `eslint` | `^9.17.0` | `10.12.0` |
| `eslint-config-next` | `15.5.9` | `16.3.8` |
| `typescript` | `^5.7.2` | `npm:@typescript/typescript6@6.0.2` |
| `vitest` | `^3.0.5` | `5.0.3` |
| `@typescript/native` | `added` | `npm:typescript@7.0.2` |
| `@eslint/compat` | `added` | `2.1.1` |

## Compatibility and code changes

- Next.js 16 uses Turbopack by default and runs the native `tsc` CLI during build. Lint is a separate CI step. Request APIs already await `params`/`cookies`; no synchronous compatibility calls remain. The build generated `react-jsx` and `.next/dev/types` changes in `tsconfig.json`.
- TypeScript 7 has no JavaScript compiler API yet. Use the officially documented aliases: `@typescript/native` supplies TypeScript 7’s `tsc`; the `typescript` alias supplies the latest `@typescript/typescript6` compatibility API for typescript-eslint. This is a tooling compatibility dependency, not a downgrade of the compiler.
- ESLint 10 removed legacy rule context methods. Next’s React/import/a11y plugins still declare ESLint 9 peer support. `@eslint/compat` wraps their rules, and scoped peer overrides resolve them against the pinned ESLint 10. Remove these adapters once upstream plugins support ESLint 10 directly; keep lint at zero warnings.
- Vitest 5 / Vite 8 use Oxc JSX configuration. The project declares ESM, replacing the old esbuild config and avoiding the native config-loader warning.
- Zod 4 uses top-level `z.email` and `z.uuid`. Email input is trimmed before validation through a pipeline, preserving the previous form behavior.
- Sanity 3 → 4 → 5 → 6 requires a supported Node runtime and React 19.2.2+. Existing schemas/structure config remain supported; there are no custom auth providers or deprecated search settings to migrate. `styled-components` is explicitly declared as a Studio peer dependency.
- React’s recommended lint rules reject synchronous state changes in effects. Cookie/hydration reads now use `useSyncExternalStore`; observers update state only in callbacks; dashboard requests update state from async callbacks and cancel on unmount. Search remains a local filter, while status changes fetch with the latest search snapshot via `useEffectEvent`.
- Resend continues to require provider acceptance before returning success. Existing mocked email/API tests cover the upgraded SDK. Live delivery and CRM RLS remain separate acceptance work.

## Official sources

- [Next.js 16 migration](https://nextjs.org/docs/app/guides/upgrading/version-16)
- [Next.js TypeScript 7](https://nextjs.org/docs/app/api-reference/config/typescript#using-typescript-7)
- [Next.js ESLint flat config](https://nextjs.org/docs/app/api-reference/config/eslint)
- [TypeScript 7: running side by side with TypeScript 6](https://devblogs.microsoft.com/typescript/announcing-typescript-7-0/#running-side-by-side-with-typescript-6.0)
- [ESLint 10 migration](https://eslint.org/docs/latest/use/migrate-to-10.0.0)
- [ESLint compatibility utilities](https://eslint.org/blog/2024/05/eslint-compatibility-utilities/)
- [Sanity v3 → v4](https://www.sanity.io/docs/help/v3-to-v4), [v4 → v5](https://www.sanity.io/docs/help/v4-to-v5), [v5 → v6](https://www.sanity.io/docs/help/v5-to-v6)
- [next-sanity migration guides](https://github.com/sanity-io/next-sanity#migration-guides)
- [Vitest 5 migration](https://vitest.dev/guide/migration/)
- [Zod 4 migration](https://zod.dev/v4/changelog)
- [Supabase SSR clients](https://supabase.com/docs/guides/auth/server-side/creating-a-client)
- [Resend with Next.js](https://resend.com/docs/send-with-nextjs)
- [React external store hydration](https://react.dev/reference/react/useSyncExternalStore)
- [React Effect Events](https://react.dev/reference/react/useEffectEvent)
- [React effect state rule](https://react.dev/reference/eslint-plugin-react-hooks/lints/set-state-in-effect)
- [React Email setup](https://react.email/docs/getting-started/manual-setup)

## Audit boundary

After the latest upgrade and compatible transitive refresh, npm audit reports 24 affected packages (13 high, 11 moderate, no critical). These are dependency chains rooted in Sanity CLI tooling and Next ESLint’s glob dependencies. The report proposes downgrading current direct packages; that conflicts with this upgrade. No forced downgrade or unverified major transitive override was applied. This baseline is not a production security sign-off; review the remaining advisories before launch.
