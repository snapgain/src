# SnapGain — OAuth (Google + Apple) setup

The frontend code is already wired (`OAuthButtons` on the auth page,
`signInWithProvider` in `SupabaseAuthContext`). To activate the buttons
you only need to enable each provider in the Supabase dashboard and paste
in the credentials.

---

## Google

1. Go to [Google Cloud Console](https://console.cloud.google.com/) and
   create (or pick) a project.
2. **APIs & Services → Credentials → Create credentials → OAuth client
   ID**.
   - Application type: **Web application**
   - Authorised redirect URI:
     `https://ffowgyjdbgkphsflxybk.supabase.co/auth/v1/callback`
3. Copy the **Client ID** and **Client secret**.
4. Supabase Dashboard → **Authentication → Providers → Google**:
   - Enable
   - Paste Client ID + Client secret
   - Save
5. **Authentication → URL Configuration**:
   - **Site URL**: `http://localhost:5173` for dev, your production
     domain in production.
   - **Redirect URLs**: add `http://localhost:5173/home` and your prod
     equivalent so users land on `/home` after consent.

---

## Apple

Apple is a bit more involved — you need an Apple Developer account
(£79/year) and a registered Service ID.

1. [Apple Developer → Certificates, Identifiers & Profiles → Identifiers](https://developer.apple.com/account/resources/identifiers/list).
2. **+ → App IDs**: create an app id (e.g. `shop.snapgain.app`). Enable
   **Sign In with Apple**.
3. **+ → Services IDs**: create a Service ID (e.g.
   `shop.snapgain.web`). Enable Sign In with Apple, configure web
   authentication:
   - Domain: your production domain (without protocol)
   - Return URL:
     `https://ffowgyjdbgkphsflxybk.supabase.co/auth/v1/callback`
4. **Keys → +**: create a key with Sign In with Apple enabled. Download
   the `.p8` file.
5. Supabase Dashboard → **Authentication → Providers → Apple**:
   - Enable
   - **Service ID**: `shop.snapgain.web`
   - **Team ID**: from your Apple Developer membership page
   - **Key ID**: from the key you generated
   - **Secret key**: paste the contents of the `.p8` file
   - Save

For local dev, Apple sign-in won't work on `http://localhost` — Apple
requires HTTPS. Test it on a deployed environment.

---

## How it's wired

- **`src/contexts/SupabaseAuthContext.jsx`** exports
  `signInWithProvider(provider)` which calls
  `supabase.auth.signInWithOAuth({ provider, options: { redirectTo: '/home' } })`.
- **`src/components/auth/OAuthButtons.jsx`** renders two styled buttons
  with the official-ish Google and Apple icons.
- **`src/components/auth/AuthForm.jsx`** drops the buttons under the
  email form on both `/auth/login` and `/auth/signup`.

Once you finish the dashboard config above the buttons just work — no
frontend changes needed.
