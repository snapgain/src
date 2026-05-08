import React, { useState } from 'react';
import { Loader2, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/customSupabaseClient';

/**
 * ManageBillingButton — invokes the create-portal-session Edge Function
 * and redirects to the Stripe-hosted Customer Portal where the user
 * can update payment method, change plan, or cancel.
 */
export function ManageBillingButton({ children = 'Manage subscription', ...buttonProps }) {
  const [busy, setBusy] = useState(false);

  const handleClick = async () => {
    if (busy) return;
    setBusy(true);
    try {
      const { data, error } = await supabase.functions.invoke(
        'create-portal-session',
        { body: {} }
      );
      if (error) throw error;
      if (!data?.url) throw new Error('No portal URL returned');
      window.location.href = data.url;
    } catch (err) {
      toast({
        title: "Couldn't open billing portal",
        description: err?.message || 'Try again later.',
        variant: 'destructive',
      });
      setBusy(false);
    }
  };

  return (
    <Button onClick={handleClick} disabled={busy} {...buttonProps}>
      {busy ? (
        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
      ) : (
        <ExternalLink className="w-4 h-4 mr-2" />
      )}
      {children}
    </Button>
  );
}

export default ManageBillingButton;
