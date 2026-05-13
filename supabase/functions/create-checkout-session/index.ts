// create-checkout-session — Edge Function that creates a Stripe
// Checkout Session for a logged-in user and returns the URL the
// browser should redirect to.
//
// Requires Supabase Edge Function secrets:
//   STRIPE_SECRET_KEY     sk_live_... or sk_test_...
//   STRIPE_PRICE_MONTHLY  price_xxx (recurring £14.99/mo)
//   STRIPE_PRICE_YEARLY   price_yyy (recurring £120/yr)
//
// Body: { plan: 'monthly' | 'yearly' }
// Returns: { url: string }
//
// JWT verification is enabled at the function level (verify_jwt:true)
// so the function only runs for authenticated users.

import Stripe from 'https://esm.sh/stripe@17.5.0?target=denonext';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.4';

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
    const authHeader = req.headers.get('Authorization') ?? req.headers.get('authorization');
    if (!authHeader) {
      return json({ error: 'Missing Authorization header' }, 401);
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Verify JWT and get the user
    const token = authHeader.replace(/^Bearer\s+/i, '');
    const { data: userData, error: authError } = await supabase.auth.getUser(token);
    if (authError || !userData?.user) {
      return json({ error: 'Invalid authentication' }, 401);
    }
    const user = userData.user;

    // Parse plan from body
    const body = await req.json().catch(() => ({}));
    const plan = body.plan === 'yearly' ? 'yearly' : 'monthly';
    const priceId = plan === 'yearly' ? PRICE_YEARLY : PRICE_MONTHLY;

    if (!priceId) {
      return json(
        { error: `STRIPE_PRICE_${plan.toUpperCase()} is not set in Supabase secrets` },
        500
      );
    }

    // Look up the user's existing stripe_customer_id, create if missing
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('stripe_customer_id')
      .eq('user_id', user.id)
      .maybeSingle();

    let customerId = profile?.stripe_customer_id;
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: { supabase_user_id: user.id },
      });
      customerId = customer.id;

      // Upsert so users without a profile yet still get linked.
      await supabase
        .from('user_profiles')
        .upsert(
          {
            user_id: user.id,
            email: user.email,
            stripe_customer_id: customerId,
          },
          { onConflict: 'user_id' }
        );
    }

    // Create Checkout Session
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      customer: customerId,
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${SITE_URL}/subscription/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${SITE_URL}/pricing`,
      allow_promotion_codes: true,
      billing_address_collection: 'auto',
      metadata: {
        supabase_user_id: user.id,
        plan,
      },
      subscription_data: {
        metadata: {
          supabase_user_id: user.id,
          plan,
        },
      },
    });

    return json({ url: session.url });
  } catch (err) {
    console.error('[create-checkout-session] error:', err);
    return json({ error: err?.message || 'Internal error' }, 500);
  }
});

function json(payload: unknown, status = 200) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { ...cors, 'Content-Type': 'application/json' },
  });
}
