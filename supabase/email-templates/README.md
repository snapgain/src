# Email Templates — Supabase Auth (SnapGain brand)

These 4 HTML templates apply the SnapGain logo + brand colours
(violet → magenta gradient) to the Supabase Auth emails. Paste them
into the Supabase Dashboard.

## Where to paste

1. Go to **https://supabase.com/dashboard/project/ffowgyjdbgkphsflxybk/auth/templates**
2. For each template, click → paste the HTML from the corresponding
   file → "Save changes"
3. **IMPORTANT:** also set the **subject** lines (shown below each).

## Files

| File | Maps to Supabase template | Trigger |
|------|---------------------------|---------|
| `confirm-signup.html`     | "Confirm signup"            | User signs up with email/password and Email Confirmation is enabled |
| `magic-link.html`         | "Magic Link"                | User signs in with passwordless / OTP |
| `reset-password.html`     | "Reset Password"            | User requests a password reset |
| `invite-user.html`        | "Invite user"               | Admin invites via `admin.inviteUserByEmail` (Stripe-direct fallback) |

## Subjects

| Template | Subject line to paste |
|----------|-----------------------|
| Confirm signup    | `Welcome to SnapGain — confirm your email` |
| Magic Link        | `Your SnapGain sign-in link` |
| Reset Password    | `Reset your SnapGain password` |
| Invite user       | `You have access to SnapGain — claim your account` |

## Notes

- All templates inline CSS (most email clients strip `<style>` blocks).
- Logo URL: `https://snapgain.uk/snapgain-logo.png` (must be live in
  production for clients to render the image).
- Variables used: `{{ .ConfirmationURL }}` is what Supabase replaces
  with the magic / confirm / reset link. Don't change that.
- Brand colours are violet `#7c3aed` to magenta `#ec4899`.
- Footer includes the "We never share your data" disclaimer to match
  the signup form copy about the phone number.

## Updating later

If you tweak a template, edit the corresponding HTML file in this
folder, then paste the new content back into the Supabase Dashboard.
Keep the version-controlled file in sync — the Dashboard is the
runtime source, the file here is the canonical reference.
