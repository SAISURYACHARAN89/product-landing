# product-landing

A **Next.js** product landing page set up for a **prompt → see live site → prompt again** loop you can run entirely from a phone — no laptop needed.

## The loop

1. Open **[claude.ai/code](https://claude.ai/code)** on your phone → pick this repo → prompt
   (e.g. *"change the headline to X"*, *"add a testimonials section"*).
2. Claude edits the code and opens a Pull Request.
3. **Vercel auto-builds** the PR and posts a **preview URL** — open it to see the change.
4. Happy with it? **Merge the PR** (one tap in GitHub mobile) → it goes **live** on the production URL.
5. Prompt again. 🔁

## One-time setup

**Connect Vercel (the deploy side):**
1. Go to **[vercel.com](https://vercel.com)** → sign in with GitHub.
2. **Add New → Project → Import** this repo → **Deploy**.
3. Done. Vercel auto-detects Next.js and now deploys on every push:
   `main` → production URL, every other branch/PR → a preview URL.

**Connect Claude Code (the editing side):**
1. Go to **[claude.ai/code](https://claude.ai/code)** → connect GitHub → grant access to this repo.
2. Start a session on the repo and prompt away.

## Local dev (optional, needs a computer)

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # production build
```

## Where to edit

- `app/page.tsx` — the whole landing page (hero, features, pricing, FAQ, CTA, footer).
- `app/layout.tsx` — page `<title>` / description (SEO).
- `app/globals.css` — global styles / theme.

Built with Next.js 16 (App Router) + React 19 + Tailwind CSS v4.
