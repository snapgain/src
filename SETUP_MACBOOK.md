# SnapGain — MacBook Migration Guide

> Author: written by Claude for Bárbara on 2026-05-23 during Windows→Mac transition.
> This is a self-contained checklist — you don't need access to the original
> chat to follow it. Lives at `src-1/SETUP_MACBOOK.md` so it syncs via OneDrive.

## What lives where

**Local files (sync via OneDrive):**
```
~/Library/CloudStorage/OneDrive-Personal/
  ├── Principais estrutura SnapGain - SRC/
  │   └── src-1/                    ← main app (snapgain.uk frontend + edge fns)
  └── SnapGain/
      └── Marketing/                ← copy: IG, TikTok, email, lead-magnet PDFs
```

**Remote (GitHub):**
- `github.com/Denysmelo2/snapgain-scraper`  (TC/Quidco/JD/NX scrapers + GHA cron)
- `github.com/Denysmelo2/snapgain-shop`     (snapgain.shop marketing landing)
- (private) `github.com/.../snapgain-src`   (this app, if pushed)

**Remote services (no migration needed — cloud-hosted):**
- Supabase project `ffowgyjdbgkphsflxybk` (eu-west-2)
- Vercel projects (snapgainuk, snapgain-shop)
- Stripe (live mode)

---

## Step-by-step setup (do in order)

### 1. OneDrive — sync first (start it, leave running)

1. Install: <https://www.microsoft.com/microsoft-365/onedrive/download>
2. Login with your usual account.
3. Choose "sync all folders". It'll create `~/Library/CloudStorage/OneDrive-Personal/`.
4. Leave it syncing in background — can take **hours** for large folders.

**Exclude from sync (avoids 200k+ files thrash):**
- OneDrive menu → Settings → Account → Choose folders
- Untick anything ending in `/node_modules` (you'll regenerate locally with `npm install`)

### 2. Homebrew + core tools (≈5 min)

```bash
# Install Homebrew (Mac's package manager)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Add brew to PATH (follow the post-install instructions it prints, then:)
eval "$(/opt/homebrew/bin/brew shellenv)"

# Install Node, Git, GitHub CLI
brew install node git gh

# Verify
node --version    # expect v20.x or newer
git --version
gh --version
```

### 3. Git + GitHub auth

```bash
git config --global user.name "Barbara Ferreira"
git config --global user.email "babiferreir@gmail.com"

# Login via browser
gh auth login
```

Follow prompts: GitHub.com → HTTPS → Yes (auth via browser) → paste device code.

### 4. Editor (optional but recommended)

```bash
# VS Code
brew install --cask visual-studio-code

# Or Cursor if you prefer
brew install --cask cursor
```

### 5. Claude Code — grant folder permission

When you first open Claude on the Mac and try to read/edit files, it asks
to allow access to a folder. Grant access to:

```
/Users/YOUR_USERNAME/Library/CloudStorage/OneDrive-Personal/Principais estrutura SnapGain - SRC/src-1
```

Replace `YOUR_USERNAME` with your Mac short name (you can check with
`whoami` in Terminal).

### 6. Install dependencies for the main app

```bash
cd "/Users/$(whoami)/Library/CloudStorage/OneDrive-Personal/Principais estrutura SnapGain - SRC/src-1"
npm install
```

Expect 5-10 min. Installs ~1300 packages into `node_modules/` (locally,
not in OneDrive — see exclude in step 1).

### 7. Start dev server

```bash
npm run dev
```

Opens at <http://localhost:5173>. Same Supabase database, same user accounts
as Windows. Login with `babiferreir@gmail.com`.

### 8. Verify it works

- [ ] `/` loads (or `/home` if logged in)
- [ ] Login flow works (Google OAuth or email/password)
- [ ] `/admin/platform-changes` opens (you're admin)
- [ ] `/compare` lets you search a store
- [ ] No console errors in browser DevTools

### 9. ⚠️ Important rules (don't break them)

1. **`MAINTENANCE_MODE` flag** at `src/App.jsx:220` is `false` for local dev.
   **Do NOT commit it as `false`** — flip back to `true` before any commit,
   or use `git diff` to confirm it's not in your changes.

2. **Rule 8.5** — never seed/update platform rates with numeric values without:
   - reading the source first
   - cross-checking the official site
   - citing URL + date
   - asking Bárbara for explicit approval

3. **Rule 9** — never touch `stores.in_nx_network` (manual curation by Bárbara
   across 1,530 stores).

### 10. Clone the other repos (optional)

If you want the scraper and shop locally:

```bash
cd ~/Documents
mkdir -p snapgain && cd snapgain

gh repo clone Denysmelo2/snapgain-scraper
gh repo clone Denysmelo2/snapgain-shop

cd snapgain-scraper && npm install
cd ../snapgain-shop && npm install
```

The scraper needs secrets in **GitHub Actions** (already set there) — you
don't need them locally unless you want to run scrapes from your Mac.

### 11. Environment variables

The main app uses fallback Supabase keys hardcoded in `src/lib/supabase.js`
so an empty `.env` works. If you want to override, create `src-1/.env`:

```env
VITE_SUPABASE_URL=https://ffowgyjdbgkphsflxybk.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOi...  # from Supabase dashboard → Settings → API
```

For other services (Stripe test keys, etc.) ask Claude to help you pull them
from the Supabase Vault or the Vercel env vars — they live there, not in any
local file.

---

## Common issues

| Symptom | Fix |
|---|---|
| `npm install` fails with EACCES | `sudo chown -R $(whoami) ~/.npm` |
| Port 5173 already in use | `lsof -ti:5173 \| xargs kill -9` |
| OneDrive sync stuck | Restart OneDrive: menu bar → quit → reopen |
| Claude Code says "no access to file" | macOS System Settings → Privacy → Files & Folders → enable Claude |
| Login works on site, but `/home` redirects to `/pricing` | Profile data issue. Check `user_profiles` table in Supabase — `subscription_status` must be `'active'` or `'trialing'`, OR you're admin (role='admin') |
| Browser caches old maintenance page | Hard refresh: ⌘+Shift+R |
| `gh repo clone` says permission denied | Run `gh auth refresh -s repo` |

---

## What's already running in the cloud (no migration needed)

- **Supabase edge functions** — all 16 are deployed: stripe-webhook,
  user-registration, create-checkout-session, platforms-meta-sync (daily
  cron), nx-sync, jamdoughnut-sync, topcashback-uk, jamdoughnut-uk,
  amazon-uk, cj-sync, etc.
- **pg_cron** — `platforms-meta-sync-daily` runs every day at 04:00 UTC
- **GitHub Actions** — `scrape-daily.yml` + `enrich-weekly.yml` in the scraper repo
- **Vercel** — main app, shop, and any preview branches
- **Stripe** — webhooks pointing at the edge function URL

None of this depends on your Mac being on. The Mac is just your dev environment.

---

## When you're stuck — quick context to give Claude on the new Mac

> "I'm Bárbara, founder of SnapGain. I just migrated from Windows to Mac.
> Read `src-1/HANDOFF.md` and `src-1/SETUP_MACBOOK.md` for the full state.
> The app is React/Vite + Supabase. Database project ID is
> `ffowgyjdbgkphsflxybk`. I'm admin (`babiferreir@gmail.com`)."

That's all the context a fresh Claude session needs to pick up.

---

_Last updated: 2026-05-23 by Claude during Windows→Mac handoff._
