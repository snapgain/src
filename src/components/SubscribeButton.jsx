import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/customSupabaseClient';
import { useAuth } from '@/contexts/SupabaseAuthContext';

/**
 * SubscribeButton — calls the `create-checkout-session` Edge Function and
 * redirects the browser to the Stripe-hosted checkout. On error, surfaces a
 * toast with the message.
 *
 * Props:
 *   plan: 'monthly' | 'yearly' (default 'monthly')
 *   children: button label (default depends on plan)
 *   any other Button props are forwarded.
 */
export function SubscribeButton({ plan = 'monthly', children, ...buttonProps }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [busy, setBusy] = useState(false);

  const handleClick = async () => {
    if (busy) return;
    if (!user) {
      navigate('/auth/login', { state: { from: location } });
      return;
    }
    setBusy(true);
    try {
      const { data, error } = await supabase.functions.invoke(
        'create-checkout-session',
        { body: { plan } }
      );
      if (error) throw error;
      if (!data?.url) throw new Error('No checkout URL returned');
      window.location.href = data.url;
    } catch (err) {
      toast({
        title: 'Could not start checkout',
        description:
          err?.message ||
          'Stripe may not be configured yet. Set STRIPE_SECRET_KEY, STRIPE_PRICE_MONTHLY, STRIPE_PRICE_YEARLY, and STRIPE_WEBHOOK_SECRET in your Supabase Edge Function secrets.',
        variant: 'destructive',
      });
      setBusy(false);
    }
  };

  return (
    <Button onClick={handleClick} disabled={busy} {...buttonProps}>
      {busy && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
      {children || (plan === 'yearly' ? 'Subscribe yearly' : 'Subscribe monthly')}
    </Button>
  );
}

export default SubscribeButton;
