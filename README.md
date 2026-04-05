# The Mighty Owl

Monorepo for **ApplianceAI**, a mobile-first web app that helps people use unfamiliar home appliances: take a photo, add a bit of context, and get step-by-step guidance powered by Claude (vision) behind Supabase Edge Functions.

## Repository layout

| Path | Purpose |
|------|---------|
| [`applianceai-prototype/`](applianceai-prototype/) | Astro + Tailwind frontend, Supabase schema, and the `analyze` Edge Function |

Detailed setup, Supabase migrations, deployment, and troubleshooting live in [**`applianceai-prototype/README.md`**](applianceai-prototype/README.md). There is also a shorter [**`applianceai-prototype/QUICK_START.md`**](applianceai-prototype/QUICK_START.md).

## Quick start

```bash
cd applianceai-prototype
cp .env.example .env
# Edit .env: set PUBLIC_SUPABASE_URL and PUBLIC_SUPABASE_ANON_KEY from Supabase → Settings → API
npm install
npm run dev
```

Configure the backend (database, Edge Function, and **Anthropic API key as a Supabase secret**) using the steps in the prototype README. The Claude key is read only inside the Edge Function via `ANTHROPIC_API_KEY`; it is not used in the static frontend.

## Deploy (GitHub Pages)

The workflow [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) builds on pushes to `main`. Add these **repository secrets** (Settings → Secrets and variables → Actions):

- `PUBLIC_SUPABASE_URL`
- `PUBLIC_SUPABASE_ANON_KEY`

They are the same public values as in `.env.example`; they are not your Claude or database password.

## Security and secrets (public repo)

- **Anthropic / Claude API key** — Set with Supabase only, for example: `supabase secrets set ANTHROPIC_API_KEY=your-key`. Do not put it in `.env` for the Astro app, in GitHub Actions (unless you add a dedicated server-side step that needs it), or anywhere in committed files.
- **`.env`** — Gitignored under `applianceai-prototype/`. Copy from `.env.example` locally; never commit real values.
- **`.claude/settings.local.json`** — Can contain API keys; it is gitignored at the repo root. Prefer environment variables or your global git ignore for local Claude tooling.
- **Supabase service role / DB passwords** — Never commit. The anon key in `.env.example` is the public client key; keep service role keys out of the repo.
- **`supabase/.temp/`** — CLI metadata (project ref, pooler host, etc.); it should not be committed. It is listed in `.gitignore`.

If a secret was ever committed, rotate it in the provider’s dashboard and consider [removing it from Git history](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/removing-sensitive-data-from-a-repository) so clones and forks do not retain it.

## License

Add a `LICENSE` file if you want to specify terms for reuse.
