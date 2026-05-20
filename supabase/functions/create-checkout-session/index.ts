// create-checkout-session — Edge Function that creates a Stripe
// Checkout Session for ANYONE (no account required).
//
// Pay-first flow:
//   1. Visitor clicks Subscribe on the public site.
//   2. This function returns a Stripe Checkout URL.
//   3. Visitor enters card + email on Stripe.
//   4. Stripe fires checkout.session.completed.
//   5. stripe-webhook (sibling function) creates/links the Supabase
//      user from the collected email and sends a magic-link email.
//
// verify_jwt is FALSE because the visitor may not have an account yet.
//
// Secrets required:
//   STRIPE_SECRET_KEY
//   STRIPE_PRICE_MONTHLY
//   STRIPE_PRICE_YEARLY

import Stripe from 'https://esm.sh/stripe@17.5.0?target=denonext';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') ?? '', {
  apiVersion: '2024-12-18.acacia',
  httpClient: Stripe.createFetchHttpClient(),
});

const PRICE_MONTHLY = Deno.env.get('STRIPE_PRICE_MONTHLY') ?? '';
const PRICE_YEARLY = Deno.env.get('STRIPE_PRICE_YEARLY') ?? '';
const SITE_URL = 'https://snapgain.uk';

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors });

  try {
    const body = await req.json().catch(() => ({}));
    const plan = body.plan === 'yearly' ? 'yearly' : 'monthly';
    const priceId = plan === 'yearly' ? PRICE_YEARLY : PRICE_MONTHLY;

    if (!priceId) {
      return json(
        { error: `STRIPE_PRICE_${plan.toUpperCase()} is not set in Supabase secrets` },
        500
      );
    }

    // Subscription mode automatically creates a Stripe Customer and
    // collects the email at checkout. The email is what we use later
    // (in the webhook) to bootstrap the Supabase account.
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${SITE_URL}/subscription/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${SITE_URL}/pricing`,
      allow_promotion_codes: true,
      billing_address_collection: 'auto',
      metadata: { plan },
      subscription_data: {
        metadata: { plan },
      },
    });

    return json({ url: session.url });
  } catch (err) {
    console.error('[create-checkout-session] error:', err);
    return json({ error: (err as Error)?.message || 'Internal error' }, 500);
  }
});

function json(payload: unknown, status = 200) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { ...cors, 'Content-Type': 'application/json' },
  });
}
