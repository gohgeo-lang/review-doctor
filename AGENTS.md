# Repository Guidelines

Contributor guide for the 리뷰박사 MVP. Keep changes small, bias to shipping safely, and protect merchant-facing clarity.

## Project Structure & Module Organization
- `app/page.tsx`: single-page UI (industry/tone/type selectors, templates drawer, recent history, toasts, feedback). If it grows, extract subcomponents under `app/components/`.
- `app/api/generate-replies/route.ts`: OpenAI prompt, validation, and reply shaping (intro/body/outro). Server-only; never expose the SDK to the client.
- `app/api/feedback/route.ts`: Supabase insert for user feedback; appends context (path, userAgent).
- `app/globals.css`: Tailwind base styles and a few utility classes. Prefer utilities over custom CSS.

## Build, Test, and Development Commands
- Install: `npm install`
- Dev: `npm run dev` (Next.js dev server on :3000)
- Lint: `npm run lint`
- Prod: `npm run build` then `npm run start`
- Spot-check API changes with `curl` or the dev server before merging.

## Environment & Secrets
- Required: `.env.local` with `OPENAI_API_KEY=...`
- Optional: `OPENAI_MODEL` (defaults to `gpt-4o-mini`)
- Feedback storage (Supabase): `SUPABASE_URL=https://<project>.supabase.co`, `SUPABASE_SERVICE_ROLE_KEY=...` (service role must stay server-only).
- Auth (NextAuth Google): `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `NEXTAUTH_SECRET`, and `NEXTAUTH_URL` for deployments.
- Never commit `.env.local` or print keys. Restart `npm run dev` after env changes.

## Coding Style & Naming Conventions
- Stack: Next.js 14 (App Router) + TypeScript + TailwindCSS. Use 2-space indent, kebab-case filenames, PascalCase components.
- Keep components controlled; colocate state/hooks near usage; extract shared helpers to `utils/` when they cross files.
- Add concise comments only for non-obvious logic (prompt rules, validation, Supabase failure handling).

## Testing Guidelines
- No automated suite yet; prefer React Testing Library for new UI logic and mock OpenAI/Supabase.
- Manual pass for each change: required-field validation, tone/type selection rules (free plan defaults), template drawer toggle, reply rendering/copy, recent history, toasts (top-center), feedback submit success/failure.

## Commit & PR Guidelines
- Commits: present-tense, scoped (e.g., `fix: toast z-index for recent modal`).
- PRs: summarize user-facing impact, add screenshots for UI tweaks, list commands run (`npm run lint`, dev smoke), and note env prerequisites if relevant.

## Plans & Feature Flags
- Default plan is free: 톤 기본형(정중)·답글유형 기본형만 허용; keep plan checks aligned between UI and submit handler.
- Plus/Pro unlock all tones·유형 and higher monthly limits (100/무제한); enforce limits in both client guardrails and API.
- If adding new gating logic, centralize constants so UI/submit share the same rules.

## Deployment & Environments
- Local dev only: avoid pushing `.env.local`; Vercel env vars go in Project Settings → Environment Variables (Production/Preview aligned).
- Before deploy: `npm run lint && npm run build`; watch for large assets and keep `node_modules` out of git.
- Supabase keys: service role stays server-side; never expose in client bundles. Rotate keys if leaked.

## Security & Configuration Tips
- Validate all API inputs server-side; reject missing industry/review/type and block client-side OpenAI calls.
- Keep promises awaited; return consistent JSON error shapes.
- Pin deps via `package-lock.json`; consider `npm audit` on new packages. Guard prompt rules to avoid unsafe responses.
