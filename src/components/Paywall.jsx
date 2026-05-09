import React from 'react';
import { Link } from 'react-router-dom';
import { Lock, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useSubscription } from '@/hooks/useSubscription';

/**
 * Paywall — renders children only if the current user is premium
 * (active subscription OR within the 7-day free trial). Otherwise renders
 * a friendly upsell. Pass `fallback` for a custom non-premium state.
 *
 * Usage:
 *   <Paywall>
 *     <AdvancedComparisonChart />
 *   </Paywall>
 */
export function Paywall({ children, fallback }) {
  const { isPremium, loading } = useSubscription();

  if (loading) return null;
  if (isPremium) return <>{children}</>;
  if (fallback) return <>{fallback}</>;

  return (
    <Card className="bg-gradient-to-br from-light-pink/30 to-light-green/30 border-primary/30">
      <CardContent className="py-8 text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-primary/10 text-primary mx-auto flex items-center justify-center">
          <Lock className="w-6 h-6" />
        </div>
        <div>
          <p className="text-lg font-semibold flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4 text-secondary" />
            Premium feature
          </p>
          <p className="text-sm text-muted-foreground mt-1 max-w-sm mx-auto">
            Subscribe to unlock advanced comparison strategies, smart alerts,
            and unlimited simulations.
          </p>
        </div>
        <Button asChild>
          <Link to="/pricing">See plans</Link>
        </Button>
      </CardContent>
    </Card>
  );
}

export default Paywall;
