import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle2, Sparkles, ArrowRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useSubscription } from '@/hooks/useSubscription';

/**
 * /subscription/success — Stripe redirect target after successful checkout.
 *
 * The webhook is the source of truth for subscription_status. It usually
 * fires within a second or two of the redirect, so we poll user_profiles
 * for ~10 seconds and reflect the live state. If the polling completes
 * without seeing an active status, the user can still continue — the
 * webhook will catch up shortly.
 */
function SubscriptionSuccessPage() {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const { isActive, plan, periodEndsAt, refresh } = useSubscription();
  const [polled, setPolled] = useState(0);
  const POLL_LIMIT = 10;

  useEffect(() => {
    if (isActive || polled >= POLL_LIMIT) return;
    const t = setTimeout(() => {
      refresh();
      setPolled((c) => c + 1);
    }, 1000);
    return () => clearTimeout(t);
  }, [isActive, polled, refresh]);

  return (
    <>
      <Helmet>
        <title>Welcome to SnapGain Premium</title>
      </Helmet>

      <div className="container mx-auto px-4 py-16 max-w-xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
        >
          <Card className="bg-gradient-to-br from-light-pink/40 to-light-green/40 border-primary/30">
            <CardHeader className="text-center pb-2">
              <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground mx-auto flex items-center justify-center mb-3">
                {isActive ? (
                  <CheckCircle2 className="w-8 h-8" />
                ) : (
                  <Loader2 className="w-8 h-8 animate-spin" />
                )}
              </div>
              <CardTitle className="text-2xl flex items-center justify-center gap-2">
                <Sparkles className="w-5 h-5 text-secondary" />
                {isActive ? 'Welcome to Premium' : 'Confirming your subscription…'}
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              {isActive ? (
                <>
                  <p className="text-sm text-muted-foreground">
                    You&rsquo;re on the{' '}
                    <span className="font-semibold">{plan || 'monthly'}</span>{' '}
                    plan.
                    {periodEndsAt && (
                      <>
                        {' '}Your next renewal is{' '}
                        <span className="font-semibold">
                          {new Date(periodEndsAt).toLocaleDateString()}
                        </span>
                        .
                      </>
                    )}
                  </p>
                  <Button asChild size="lg">
                    <Link to="/home">
                      Open the app <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                  </Button>
                </>
              ) : (
                <>
                  <p className="text-sm text-muted-foreground">
                    We&rsquo;re waiting for Stripe to confirm the payment. This
                    usually takes a couple of seconds — feel free to head to the
                    home page; access will unlock automatically when the webhook
                    lands.
                  </p>
                  {sessionId && (
                    <p className="text-xs text-muted-foreground font-mono break-all">
                      Session: {sessionId}
                    </p>
                  )}
                  <Button asChild variant="outline">
                    <Link to="/home">Continue to home</Link>
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </>
  );
}

export default SubscriptionSuccessPage;
