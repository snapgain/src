// /subscription/success — Stripe redirect target after successful checkout.
//
// In the pay-first flow the visitor is NOT signed in yet when they
// land here. The webhook creates their Supabase account and sends a
// magic-link email. This page's job is to:
//   1. Reassure the payment went through.
//   2. Tell them to check their email.
//   3. Offer a fallback "resend email" path if needed.
//
// If a user IS already signed in (existing account that just upgraded),
// we still show the welcome card and link them to /home.

import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle2, Mail, Sparkles, ArrowRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useSubscription } from '@/hooks/useSubscription';

function SubscriptionSuccessPage() {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const { user } = useAuth();
  const { isActive, plan, periodEndsAt, refresh } = useSubscription();

  const [polled, setPolled] = useState(0);
  const POLL_LIMIT = 8;

  // Poll the profile to flip "Confirming…" → "Welcome" once webhook lands.
  useEffect(() => {
    if (isActive || polled >= POLL_LIMIT) return;
    const t = setTimeout(() => {
      refresh();
      setPolled((c) => c + 1);
    }, 1500);
    return () => clearTimeout(t);
  }, [isActive, polled, refresh]);

  // ── Already signed in: returning user just upgraded ────────────
  if (user) {
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
                  <p className="text-sm text-muted-foreground">
                    Stripe is confirming the payment. This usually takes a
                    couple of seconds — your access will unlock automatically.
                  </p>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </>
    );
  }

  // ── Pay-first new user: show "check your email" flow ─────────────
  return (
    <>
      <Helmet>
        <title>Payment received — SnapGain</title>
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
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <CardTitle className="text-2xl flex items-center justify-center gap-2">
                <Sparkles className="w-5 h-5 text-secondary" />
                Payment received
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-5">
              <div className="flex items-start gap-3 text-left bg-background/60 rounded-lg p-4">
                <Mail className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                <div className="space-y-2 text-sm">
                  <p className="font-semibold">Check your email</p>
                  <p className="text-muted-foreground">
                    We just sent a one-click sign-in link to the email
                    you used at checkout. Click it to open SnapGain — no
                    password required on the first sign-in.
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Not in your inbox? Check spam, or use the resend
                    option below.
                  </p>
                </div>
              </div>

              <div className="flex flex-col items-center gap-2">
                <p className="text-xs text-muted-foreground">
                  Already paid but did not get the email?
                </p>
                <Button asChild variant="outline">
                  <Link to="/auth/login">Resend sign-in link</Link>
                </Button>
              </div>

              {sessionId && (
                <p className="text-[10px] text-muted-foreground font-mono break-all opacity-50">
                  Reference: {sessionId}
                </p>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </>
  );
}

export default SubscriptionSuccessPage;
