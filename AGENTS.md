# Repository Guidelines

Quick guide for contributing to the 리뷰박사 MVP. Keep changes small, keep Korean merchant UX clear, and prefer shipping safely over adding scope.

## Project Structure & Module Organization
- `app/page.tsx`: single-page UI (industry/tone/type selectors, templates drawer, replies, toasts, feedback box). If it grows, split into small components under `app/components/`.
- `app/api/generate-replies/route.ts`: server-only OpenAI prompt/validation; never call the OpenAI SDK from the client.
- `app/api/feedback/route.ts`: Supabase insert endpoint for user feedback.
- `app/globals.css`: Tailwind base styles/tokens. Add minimal custom classes; favor utilities.

## Build, Test, and Development Commands
- Install deps: `npm install`
- Dev server: `npm run dev` (hot reload on :3000)
- Lint: `npm run lint`
- Prod build/start: `npm run build` then `npm run start`
- If you add a new API route, hit it with `curl` or `npm run dev` smoke tests before opening a PR.

## Environment & Secrets
- Required: `.env.local` with `OPENAI_API_KEY=...`
- Optional: `OPENAI_MODEL` (defaults to `gpt-4o-mini`)
- Feedback storage (Supabase): add `SUPABASE_URL=https://<project>.supabase.co` and `SUPABASE_SERVICE_ROLE_KEY=...`. Service role must stay server-only.
- Never commit `.env.local` or log secrets. Restart `npm run dev` after env changes.

## Coding Style & Naming Conventions
- Stack: Next.js 14 (App Router) + TypeScript + TailwindCSS. Use 2-space indent, kebab-case filenames, PascalCase components.
- Keep components controlled; colocate related state/hooks; extract reusable helpers to `utils/` if they cross files.
- Add short comments only for non-obvious logic (prompt shaping, validation, Supabase error handling).

## Testing Guidelines
- No automated suite yet. If you add features, prefer React Testing Library for UI pieces and mock OpenAI/Supabase calls.
- Manual checks per change: required-field validation, tone/type badges, template drawer toggle, reply rendering, copy buttons, toasts (top-center), feedback submit success/failure paths.

## Commit & PR Guidelines
- Commits: clear, present-tense, scope-limited (e.g., `feat: add template drawer toggle`).
- PRs: include user-facing summary, screenshots for UI tweaks, commands run (`npm run lint`, dev smoke), and env/setup notes when relevant.

## Security & Configuration Tips
- Validate all API inputs server-side (industry/reviews/type presence). Block client-side OpenAI usage.
- Avoid promise leaks in API routes; return consistent JSON error shapes.
- Keep dependencies pinned via `package-lock.json`; run `npm audit` when adding new packages.
