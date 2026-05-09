import React, { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  PiggyBank,
  Plane,
  Gift,
  CreditCard,
  ArrowRight,
  ArrowLeft,
  Check,
  Wallet,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { supabase } from '@/lib/customSupabaseClient';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useSubscription } from '@/hooks/useSubscription';
import { useUserWallet } from '@/hooks/useUserState';
import { usePlatforms, useMilesPrograms } from '@/hooks/useCatalog';

const TEACHING = [
  {
    icon: PiggyBank,
    title: 'Cashback',
    body: 'Earn money back on what you already buy via TopCashback, Quidco, Cheddar and more.',
  },
  {
    icon: Plane,
    title: 'Miles & points',
    body: 'Avios, Virgin Points, Flying Blue and other programs convert your spend into flights.',
  },
  {
    icon: Gift,
    title: 'Gift card discounts',
    body: 'JamDoughnut, NX Rewards and HyperJar give you upfront % off retailer gift cards.',
  },
  {
    icon: CreditCard,
    title: 'Stacking',
    body: 'The killer move: gift card + cashback portal + rewards card. SnapGain ranks every combo.',
  },
];

function StepWelcome({ onNext, displayName }) {
  return (
    <Card className="bg-gradient-to-br from-light-pink/40 via-white to-light-green/30 border-primary/30">
      <CardContent className="py-10 text-center space-y-5">
        <div className="w-16 h-16 mx-auto bg-gradient-to-r from-primary to-secondary rounded-2xl flex items-center justify-center text-3xl text-white font-bold shadow-lg">
          S
        </div>
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            Welcome, <span className="gradient-text">{displayName}</span>
          </h2>
          <p className="text-muted-foreground mt-2 max-w-md mx-auto">
            SnapGain finds the smartest way to pay for everything you buy
            online. Two minutes of setup and we&rsquo;ll personalise every
            comparison to your cards and programs.
          </p>
        </div>
        <Button size="lg" onClick={onNext}>
          Get started <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </CardContent>
    </Card>
  );
}

function StepTeach({ onNext, onBack }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary" />
          What we&rsquo;ll compare for you
        </CardTitle>
        <CardDescription>
          Four reward types — SnapGain ranks every combination by £ return.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {TEACHING.map(({ icon: Icon, title, body }) => (
            <div key={title} className="border rounded-xl p-4 bg-background">
              <div className="flex items-center gap-2 mb-1.5">
                <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                  <Icon className="w-4 h-4" />
                </div>
                <h3 className="font-semibold">{title}</h3>
              </div>
              <p className="text-sm text-muted-foreground">{body}</p>
            </div>
          ))}
        </div>
        <div className="flex justify-between pt-3">
          <Button variant="ghost" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" /> Back
          </Button>
          <Button onClick={onNext}>
            Next <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function StepWallet({ onNext, onBack }) {
  const wallet = useUserWallet();
  const { platforms: cashbackPlatforms } = usePlatforms({ type: 'cashback' });
  const { programs: milesPrograms } = useMilesPrograms();
  const [selectedCashback, setSelectedCashback] = useState(new Set());
  const [selectedMiles, setSelectedMiles] = useState(new Set());
  const [busy, setBusy] = useState(false);

  const toggleCashback = (id) =>
    setSelectedCashback((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const toggleMiles = (id) =>
    setSelectedMiles((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  // Filter out anything already in the wallet
  const ownedCashbackIds = new Set(wallet.cashbackPlatforms.map((c) => c.platform_id));
  const ownedMilesIds = new Set(wallet.milesPrograms.map((m) => m.miles_program_id));
  const availableCashback = cashbackPlatforms.filter((p) => !ownedCashbackIds.has(p.id));
  const availableMiles = milesPrograms.filter((p) => !ownedMilesIds.has(p.id));

  const handleSave = async () => {
    setBusy(true);
    try {
      // Bulk-add selected items in parallel
      await Promise.all([
        ...Array.from(selectedCashback).map((id) =>
          wallet.addCashbackPlatform({ platformId: id })
        ),
        ...Array.from(selectedMiles).map((id) =>
          wallet.addMilesProgram({ milesProgramId: id })
        ),
      ]);
      onNext();
    } finally {
      setBusy(false);
    }
  };

  const totalSelected = selectedCashback.size + selectedMiles.size;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wallet className="w-5 h-5 text-primary" />
          Set up your wallet
        </CardTitle>
        <CardDescription>
          Tick the platforms and programs you already use. We&rsquo;ll filter
          comparisons to routes you can actually act on.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="space-y-2">
          <Label className="text-sm font-semibold">Cashback platforms</Label>
          <div className="flex flex-wrap gap-2">
            {availableCashback.map((p) => {
              const active = selectedCashback.has(p.id);
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => toggleCashback(p.id)}
                  className={`px-3 py-1.5 rounded-full border text-sm font-medium transition-colors ${
                    active
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-border bg-background hover:border-primary/50'
                  }`}
                >
                  {active && <Check className="w-3.5 h-3.5 mr-1.5 inline" />}
                  {p.name}
                </button>
              );
            })}
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-semibold">Miles & loyalty programs</Label>
          <div className="flex flex-wrap gap-2">
            {availableMiles.map((p) => {
              const active = selectedMiles.has(p.id);
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => toggleMiles(p.id)}
                  className={`px-3 py-1.5 rounded-full border text-sm font-medium transition-colors ${
                    active
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-border bg-background hover:border-primary/50'
                  }`}
                >
                  {active && <Check className="w-3.5 h-3.5 mr-1.5 inline" />}
                  {p.name}
                </button>
              );
            })}
          </div>
        </div>

        <p className="text-xs text-muted-foreground">
          You can add more (cards, gift card apps, balances) any time from{' '}
          <span className="font-medium">Settings → My wallet</span>.
        </p>

        <div className="flex justify-between pt-1">
          <Button variant="ghost" onClick={onBack} disabled={busy}>
            <ArrowLeft className="w-4 h-4 mr-2" /> Back
          </Button>
          <Button onClick={handleSave} disabled={busy}>
            {totalSelected > 0
              ? `Add ${totalSelected} & continue`
              : 'Skip for now'}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function StepDone({ onFinish, trialDaysLeft }) {
  return (
    <Card className="bg-gradient-to-br from-light-pink/30 to-light-green/30 border-primary/30">
      <CardContent className="py-10 text-center space-y-5">
        <div className="w-14 h-14 rounded-full bg-primary text-primary-foreground mx-auto flex items-center justify-center">
          <Check className="w-7 h-7" />
        </div>
        <div>
          <h2 className="text-2xl font-bold tracking-tight">You&rsquo;re all set</h2>
          <p className="text-muted-foreground mt-2 max-w-md mx-auto">
            {trialDaysLeft > 0
              ? `You have ${trialDaysLeft} days of free premium to explore stacking strategies and unlimited comparisons.`
              : `Welcome to SnapGain. Start by searching a store you'd like to buy from.`}
          </p>
        </div>
        <Button size="lg" onClick={onFinish}>
          Open the app <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </CardContent>
    </Card>
  );
}

function OnboardingPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const sub = useSubscription();
  const [step, setStep] = useState(0);

  const displayName = useMemo(
    () =>
      user?.user_metadata?.name?.split(' ')[0] ||
      user?.email?.split('@')[0] ||
      'there',
    [user]
  );

  // If profile already onboarded, skip the page entirely
  if (!sub.loading && sub.profile?.onboarding_done) {
    return <Navigate to="/home" replace />;
  }

  const finish = async () => {
    if (user) {
      await supabase
        .from('user_profiles')
        .update({ onboarding_done: true })
        .eq('user_id', user.id);
    }
    navigate('/home', { replace: true });
  };

  const stepNodes = [
    <StepWelcome key="w" onNext={() => setStep(1)} displayName={displayName} />,
    <StepTeach key="t" onNext={() => setStep(2)} onBack={() => setStep(0)} />,
    <StepWallet key="wl" onNext={() => setStep(3)} onBack={() => setStep(1)} />,
    <StepDone key="d" onFinish={finish} trialDaysLeft={sub.trialDaysLeft} />,
  ];

  return (
    <>
      <Helmet>
        <title>Welcome to SnapGain</title>
      </Helmet>

      <div className="container mx-auto px-4 py-12 max-w-2xl">
        {/* Step indicator */}
        <div className="flex items-center justify-center gap-2 mb-6">
          {stepNodes.map((_, i) => (
            <span
              key={i}
              className={`h-1.5 rounded-full transition-all ${
                i === step
                  ? 'w-8 bg-primary'
                  : i < step
                  ? 'w-4 bg-primary/40'
                  : 'w-4 bg-muted'
              }`}
            />
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
          >
            {stepNodes[step]}
          </motion.div>
        </AnimatePresence>

        <div className="text-center mt-4">
          <button
            type="button"
            onClick={finish}
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            Skip onboarding
          </button>
        </div>
      </div>
    </>
  );
}

export default OnboardingPage;
