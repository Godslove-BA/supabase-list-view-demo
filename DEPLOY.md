# Deploying to Vercel

The demo is a stock Next.js app — Vercel will detect it and deploy in one click.

## One-time setup (you, in a terminal you've already logged into Vercel from)

```bash
npm install -g vercel
vercel login

# From the repo root:
vercel deploy --prod
```

Vercel will ask which project to link / create. Accept the defaults.

## Required environment variables

Set these two in the Vercel dashboard (Project → Settings → Environment Variables), or pass them with `--env` on the deploy command:

| Key | Value |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://<your-project-ref>.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | The project's publishable / anon key (it's safe to expose — the schema has public-read RLS on the demo tables) |

After deploy, edit the `[DEMO URL — fill after vercel deploy]` placeholder in `README.md` with the production URL.

## Optional: a Loom walkthrough

A 60-90s screen recording of the keyboard interactions is much more compelling than the static screenshots. Suggested script:

1. Land on the page — pause, let the rows render
2. `↓ ↓ ↓ ↓ ↓` to show focus indicator moving
3. `Enter` to expand row, `Enter` to collapse
4. `/` then type "failed" — show counter dropping
5. `Esc` to clear
6. `⌘+K` — toggle a column on/off
7. `⌘+\` — switch to grid view, scroll, switch back
8. End on the list view

Then drop the Loom URL into `README.md` under the **Live demo** line.
