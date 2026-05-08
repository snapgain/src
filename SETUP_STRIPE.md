# SnapGain — Stripe subscription setup

Everything is coded. The only thing left is plugging your Stripe credentials
into the **Supabase Edge Function secrets** so the deployed
`create-checkout-session` and `stripe-webhook` functions can talk to
Stripe.

The frontend never touches a Stripe key — checkout sessions are created
server-side and the browser is redirected to Stripe's hosted checkout.

---

## 1. Create products in Stripe (test mode first)

In your Stripe dashboard → **Products → Add product**:

| Product            | Price        | Recurring | Note                        |
| ------------------ | ------------ | --------- | --------------------------- |
| SnapGain Premium   | **£7.99**    | Monthly   | Use GBP                     |
| SnapGain Premium   | **£60.00**   | Yearly    | Same product, second price  |

After creating each price, copy its **price ID** (looks like `price_1Abc…`).
You'll need both.

---

## 2. Set Edge Function secrets in Supabase

Go to your Supabase dashboard for project `ffowgyjdbgkphsflxybk` →
**Edge Functions → Secrets**. Add these five:

| Secret name               | Value                                                                         |
| ------------------------- | ----------------------------------------------------------------------------- |
| `STRIPE_SECRET_KEY`       | `sk_test_…` (from Stripe → Developers → API keys)                             |
| `STRIPE_WEBHOOK_SECRET`   | `whsec_…` (you'll get this in step 3 after registering the webhook)           |
| `STRIPE_PRICE_MONTHLY`    | `price_…` for the £7.99/month price                                           |
| `STRIPE_PRICE_YEARLY`     | `price_…` for the £60/year price                                              |
| `SITE_URL`                | `http://localhost:5173` for local dev, your domain in production              |

(Supabase already provides `SUPABASE_URL`, `SUPABASE_ANON_KEY`, and
`SUPABASE_SERVICE_ROLE_KEY` to Edge Functions automatically — no need to
set those.)

---

## 3. Register the webhook in Stripe

In Stripe → **Developers → Webhooks → Add endpoint**:

- **Endpoint URL**:
  `https://ffowgyjdbgkphsflxybk.supabase.co/functions/v1/stripe-webhook`
- **Events to send**:
  - `checkout.session.completed`
  - `customer.subscription.created`
  - `customer.subscription.updated`
  - `customer.subscription.deleted`

Stripe will show you the **signing secret** (`whsec_…`) once. Copy it and
paste it into the `STRIPE_WEBHOOK_SECRET` slot in Supabase Edge Function
secrets (step 2).

---

## 4. Test it

1. `npm run dev` and sign in as a non-admin user.
2. Go to `/pricing` → click **Start subscription** on either plan.
3. You'll be redirected to Stripe's hosted checkout.
4. Use Stripe's test card: `4242 4242 4242 4242`, any future expiry, any
   CVC, any postcode.
5. On success, Stripe redirects to `/subscription/success`. The webhook
   fires within ~2 seconds and updates your `user_profiles` row. The page
   polls and flips to "Welcome to Premium" automatically.
6. Verify in the Supabase SQL editor:
   ```sql
   select user_id, plan, subscription_status, current_period_end, stripe_customer_id
   from public.user_profiles
   where user_id = auth.uid();
   ```
   Should show `subscription_status = 'active'` and your plan.

---

## 5. Going to production

When you're ready for live payments:

1. Create the same two products in **live mode** in Stripe and copy the
   new live price IDs.
2. Replace the Edge Function secrets:
   - `STRIPE_SECRET_KEY` → `sk_live_…`
   - `STRIPE_WEBHOOK_SECRET` → from a new live-mode webhook endpoint
   - `STRIPE_PRICE_MONTHLY` / `STRIPE_PRICE_YEARLY` → live price IDs
   - `SITE_URL` → your production domain
3. Add the production webhook endpoint in Stripe live mode pointing to
   the same Edge Function URL.

---

## How it's wired (for reference)

- **`supabase/migrations/0007_user_profiles_auto_create_and_trial.sql`** —
  creates the trigger that gives every new auth user a `user_profiles`
  row with a 7-day `trial_end`. Backfills existing users.
- **Edge Function `create-checkout-session`** (verify_jwt: true) — called
  from the React `SubscribeButton`. Looks up the user's
  `stripe_customer_id` (or creates one), then creates a Stripe Checkout
  Session and returns its URL.
- **Edge Function `stripe-webhook`** (verify_jwt: false, signature-validated)
  — handles `checkout.session.completed` and the subscription lifecycle
  events. Writes `subscription_status`, `plan`, `current_period_end`, and
  Stripe IDs back to `user_profiles`.
- **`src/hooks/useSubscription.js`** — reads the user's profile row,
  derives `isPremium` (active OR in trial), `trialDaysLeft`,
  `periodDaysLeft`. Subscribes to Realtime so webhook updates appear
  without refresh.
- **`src/components/Paywall.jsx`** — wraps any element/route to gate it
  to premium users.
