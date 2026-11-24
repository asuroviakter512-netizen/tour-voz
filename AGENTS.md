<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# tour-voz

Next.js 16 (App Router) app with shadcn/ui, Tailwind v4, and Biome. Single package; all source under `src/`.

## Commands

- Dev server: `npm run dev` (reuses an existing server if `.next/dev/lock` exists; check it before starting another).
- Production build: `npm run build`
- Start prod server: `npm run start`
- Lint: `npm run lint` (`biome check`)
- Format + organize imports: `npm run format` (`biome format --write`)
- Typecheck: `npx tsc --noEmit` (no script; `tsconfig` is strict)
- No test runner is configured.

## Verification order

`npm run lint` -> `npx tsc --noEmit` -> `npm run build`.

## Structure

- Routes/layouts: `src/app/`
- shadcn/ui components: `src/components/ui/`
- Utilities: `src/lib/` (`utils.ts` re-exports `cn`)
- Hooks: `src/hooks/`
- Path alias: `@/*` -> `src/*`

## Conventions

- Lint/format is Biome, not ESLint/Prettier. Biome organizes imports via `assist.actions.source.organizeImports`.
- `cn` comes from the `cn` package; `src/lib/utils.ts` just re-exports it. Components import `cn` from `"cn"` directly; keep that pattern.
- shadcn style is `base-nova` (neutral base, CSS variables); config in `components.json`; theme lives in `src/app/globals.css`. Add components with the shadcn CLI rather than hand-copying.
- Tailwind v4 is CSS-first; there is no `tailwind.config`. Turbopack loads Tailwind via `@tailwindcss/turbopack` for `*.css`.
- `next.config.ts` enables `cacheComponents`, `partialPrefetching`, and `reactCompiler`, plus the Turbopack Tailwind rule. Do not disable casually.

## Quirks

- Next.js 16 APIs differ from training data; consult `node_modules/next/dist/docs/` before coding.
- `src/lib/highlighter.tsx` uses shiki's core with the JS regex engine; languages are lazy-loaded and only the listed ones/aliases are supported.
- `reactCompiler` is on; avoid redundant manual memoization unless profiling shows need.
