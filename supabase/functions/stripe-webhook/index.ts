// stripe-webhook — Edge Function that receives Stripe webhook events
// and syncs subscription state into public.user_profiles.
//
// verify_jwt is FALSE because Stripe doesn't send a Supabase JWT.
// Authentication is via the Stripe-Signature header, verified with
// the STRIPE_WEBHOOK_SECRET that matches the endpoint we created in
// the Stripe Dashboard.
//
// Requires Supabase Edge Function secrets:
//   STRIPE_SECRET_KEY        for the Stripe SDK
//   STRIPE_WEBHOOK_SECRET    whsec_... signing secret of THIS endpoint
//   SUPABASE_URL             auto-provided
//   SUPABASE_SERVICE_ROLE_KEY  auto-provided (full DB write access)
//
// Handles:
//   checkout.session.completed       → activate user's subscription
//   customer.subscription.updated    → sync status / period
//   customer.subscription.deleted    → mark canceled
//   invoice.payment_succeeded        → log
//   invoice.payment_failed           → log (past_due is also reflected
//                                       via customer.subscription.updated)

import Stripe from 'https://esm.sh/stripe@17.5.0?target=denonext';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.4';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') ?? '', {
  apiVersion: '2024-12-18.acacia',
  httpClient: Stripe.createFetchHttpClient(),
});

const WEBHOOK_SECRET = Deno.env.get('STRIPE_WEBHOOK_SECRET') ?? '';
const cryptoProvider = Stripe.createSubtleCryptoProvider();

function supabaseAdmin() {
  return createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  );
}

Deno.serve(async (req) => {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  const signature = req.headers.get('stripe-signature');
  if (!signature) {
    return new Response('Missing stripe-signature header', { status: 400 });
  }

  const body = await req.text();

  let event: Stripe.Event;
  try {
    event = await stripe.webhooks.constructEventAsync(
      body,
      signature,
      WEBHOOK_SECRET,
      undefined,
      cryptoProvider
    );
  } catch (err) {
    console.error('[stripe-webhook] signature verification failed:', err);
    return new Response(`Webhook signature error: ${(err as Error).message}`, {
      status: 400,
    });
  }

  const supabase = supabaseAdmin();

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.supabase_user_id;
        const plan = session.metadata?.plan ?? 'monthly';
        const customerId =
          typeof session.customer === 'string' ? session.customer : session.customer?.id;
        const subscriptionId =
          typeof session.subscription === 'string'
            ? session.subscription
            : session.subscription?.id;

        if (!userId) {
          console.warn('[stripe-webhook] checkout.session.completed missing supabase_user_id');
          break;
        }
        if (!subscriptionId) {
          console.warn('[stripe-webhook] checkout.session.completed missing subscription id');
          break;
        }

        const subscription = await stripe.subscriptions.retrieve(subscriptionId);

        await supabase.from('user_profiles').upsert(
          {
            user_id: userId,
            stripe_customer_id: customerId,
            stripe_subscription_id: subscriptionId,
            plan,
            subscription_status: subscription.status,
            current_period_end: new Date(
              subscription.current_period_end * 1000
            ).toISOString(),
          },
          { onConflict: 'user_id' }
        );
        break;
      }

      case 'customer.subscription.updated':
      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        const userId = subscription.metadata?.supabase_user_id;

        const payload = {
          subscription_status: subscription.status,
          current_period_end: new Date(
            subscription.current_period_end * 1000
          ).toISOString(),
          ...(event.type === 'customer.subscription.deleted'
            ? { subscription_status: 'canceled' }
            : {}),
        };

        if (userId) {
          await supabase
            .from('user_profiles')
            .update(payload)
            .eq('user_id', userId);
        } else {
          // Fallback: locate by stripe_subscription_id
          await supabase
            .from('user_profiles')
            .update(payload)
            .eq('stripe_subscription_id', subscription.id);
        }
        break;
      }

      case 'invoice.payment_succeeded': {
        // Could insert into a payments_log table here in the future.
        console.log('[stripe-webhook] invoice.payment_succeeded', event.data.object.id);
        break;
      }

      case 'invoice.payment_failed': {
        console.log('[stripe-webhook] invoice.payment_failed', event.data.object.id);
        break;
      }

      default:
        console.log('[stripe-webhook] unhandled event:', event.type);
    }

    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('[stripe-webhook] handler error:', err);
    return new Response(
      JSON.stringify({ error: (err as Error)?.message ?? 'Internal error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
});
