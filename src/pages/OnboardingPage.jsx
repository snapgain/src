import React, { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight,
  ArrowLeft,
  Check,
  X,
  Wallet,
  Building2,
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

// UK banks list — aligned with /banks comparison page (May 2026).
// Free-text in user_cards.card_provider (no master table yet).
const UK_BANKS = [
  { id: 'barclays', name: 'Barclays' },
  { id: 'chase-uk', name: 'Chase UK' },
  { id: 'curve', name: 'Curve' },
  { id: 'halifax', name: 'Halifax' },
  { id: 'hsbc', name: 'HSBC UK' },
  { id: 'lloyds', name: 'Lloyds Bank' },
  { id: 'metro-bank', name: 'Metro Bank' },
  { id: 'monese', name: 'Monese' },
  { id: 'monzo', name: 'Monzo' },
  { id: 'natwest', name: 'NatWest' },
  { id: 'revolut', name: 'Revolut' },
  { id: 'santander', name: 'Santander UK' },
  { id: 'starling', name: 'Starling Bank' },
  { id: 'tsb', name: 'TSB' },
  { id: 'wise', name: 'Wise' },
];

function StepWelcome({ onNext, displayName, trialDaysLeft }) {
  return (
    <Card className="bg-gradient-to-br from-light-pink/40 to-light-green/30 border-primary/30">
      <CardContent className="py-10 text-center space-y-5">
        <img
          src="/snapgain-logo.png"
          alt="SnapGain"
          className="w-40 mx-auto object-contain"
        />
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            Welcome, <span className="gradient-text">{displayName}</span>
          </h2>
          <p className="text-muted-foreground mt-2 max-w-md mx-auto">
            {trialDaysLeft > 0
              ? `Your ${trialDaysLeft}-day free trial is live.`
              : 'Your account is ready.'}{' '}
            We&rsquo;ll show every UK cashback platform and loyalty
            programme by default. You can personalise the view any
            time from{' '}
            <span className="font-medium text-foreground">
              Settings → My wallet
            </span>
            .
          </p>
        </div>
        <Button size="lg" onClick={onNext}>
          Open the app <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </CardContent>
    </Card>
  );
}

// StepTeach removed (Bárbara, 17/05/2026): the "What we compare for
// you" explanation step felt like filler — the user can intuit it from
// the actual app on first use. Cuts onboarding from 4 → 3 steps.

// ─── MultiSelectDropdown ────────────────────────────────────────────
// Native <select> + chips above. Selecting an option from the dropdown
// adds it to the chips; clicking the X on a chip removes it. Cleaner
// than 20+ pill buttons when the master list is long.
function MultiSelectDropdown({ options, selected, onAdd, onRemove, placeholder }) {
  const selectedSet = new Set(selected.map((s) => s.id));
  const available = options.filter((o) => !selectedSet.has(o.id));

  return (
    <div className="space-y-2">
      {selected.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {selected.map((item) => (
            <span
              key={item.id}
              className="inline-flex items-center gap-1 rounded-full bg-primary/10 text-primary px-3 py-1 text-sm font-medium"
            >
              {item.name}
              <button
                type="button"
                onClick={() => onRemove(item.id)}
                aria-label={`Remove ${item.name}`}
                className="hover:bg-primary/20 rounded-full p-0.5 -mr-1"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      )}
      <select
        value=""
        onChange={(e) => {
          const id = e.target.value;
          if (id) onAdd(id);
        }}
        className="w-full border border-input rounded-md px-3 py-2 text-sm bg-background hover:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/30"
      >
        <option value="">{placeholder}</option>
        {available.map((opt) => (
          <option key={opt.id} value={opt.id}>
            {opt.name}
          </option>
        ))}
      </select>
    </div>
  );
}

function StepWallet({ onNext, onBack }) {
  const wallet = useUserWallet();
  const { platforms: cashbackPlatforms } = usePlatforms({ type: 'cashback' });
  const { programs: milesPrograms } = useMilesPrograms();

  // Track full {id,name} objects so chips above the dropdown can render
  // the label without doing a second lookup.
  const [selectedCashback, setSelectedCashback] = useState([]);
  const [selectedMiles, setSelectedMiles] = useState([]);
  const [selectedBanks, setSelectedBanks] = useState([]);
  const [busy, setBusy] = useState(false);

  // Filter out anything already in the wallet so onboarding only shows
  // new items the user has not added before.
  const ownedCashbackIds = new Set(
    (wallet.cashbackPlatforms || []).map((c) => c.platform_id)
  );
  const ownedMilesIds = new Set(
    (wallet.milesPrograms || []).map((m) => m.miles_program_id)
  );
  const cashbackOptions = (cashbackPlatforms || [])
    .filter((p) => !ownedCashbackIds.has(p.id))
    .map((p) => ({ id: p.id, name: p.name }));
  const milesOptions = (milesPrograms || [])
    .filter((p) => !ownedMilesIds.has(p.id))
    .map((p) => ({ id: p.id, name: p.name }));

  const addBy = (list, setter, options) => (id) => {
    const opt = options.find((o) => String(o.id) === String(id));
    if (opt && !list.find((s) => String(s.id) === String(opt.id))) {
      setter([...list, opt]);
    }
  };
  const removeBy = (list, setter) => (id) =>
    setter(list.filter((s) => String(s.id) !== String(id)));

  const handleSave = async () => {
    setBusy(true);
    try {
      await Promise.allSettled([
        ...selectedCashback.map((item) =>
          wallet.addCashbackPlatform({ platformId: item.id })
        ),
        ...selectedMiles.map((item) =>
          wallet.addMilesProgram({ milesProgramId: item.id })
        ),
        // Banks save into user_cards with card_provider = bank name.
        // No master table → we store the human label directly.
        ...selectedBanks.map((bank) =>
          wallet.addCard
            ? wallet.addCard({ cardProvider: bank.name, nickname: bank.name })
            : Promise.resolve()
        ),
      ]);
      onNext();
    } catch (err) {
      console.warn('[OnboardingPage] StepWallet save error:', err);
      onNext();
    } finally {
      setBusy(false);
    }
  };

  const totalSelected =
    selectedCashback.length + selectedMiles.length + selectedBanks.length;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wallet className="w-5 h-5 text-primary" />
          Set up your wallet (optional)
        </CardTitle>
        <CardDescription>
          Add only what you already use, or skip and we&rsquo;ll show every
          platform by default. You can personalise this any time in
          <span className="font-medium"> Settings → My wallet</span>.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="space-y-2">
          <Label className="text-sm font-semibold flex items-center gap-2">
            <Wallet className="w-4 h-4 text-primary" /> Cashback platforms
          </Label>
          <MultiSelectDropdown
            options={cashbackOptions}
            selected={selectedCashback}
            onAdd={addBy(selectedCashback, setSelectedCashback, cashbackOptions)}
            onRemove={removeBy(selectedCashback, setSelectedCashback)}
            placeholder="Add a cashback platform…"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-semibold flex items-center gap-2">
            <Wallet className="w-4 h-4 text-primary" /> Miles &amp; loyalty
            programmes
          </Label>
          <MultiSelectDropdown
            options={milesOptions}
            selected={selectedMiles}
            onAdd={addBy(selectedMiles, setSelectedMiles, milesOptions)}
            onRemove={removeBy(selectedMiles, setSelectedMiles)}
            placeholder="Add a miles or loyalty programme…"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-semibold flex items-center gap-2">
            <Building2 className="w-4 h-4 text-primary" /> Banks &amp; card
            issuers
          </Label>
          <MultiSelectDropdown
            options={UK_BANKS}
            selected={selectedBanks}
            onAdd={addBy(selectedBanks, setSelectedBanks, UK_BANKS)}
            onRemove={removeBy(selectedBanks, setSelectedBanks)}
            placeholder="Add a bank or card issuer…"
          />
        </div>

        <div className="flex justify-between pt-1">
          <Button variant="ghost" onClick={onBack} disabled={busy}>
            <ArrowLeft className="w-4 h-4 mr-2" /> Back
          </Button>
          <Button onClick={handleSave} disabled={busy}>
            {totalSelected > 0
              ? `Add ${totalSelected} & continue`
              : 'Skip — show all'}
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
      try {
        // Upsert so we still flip the flag even if the profile row
        // wasn't pre-created by a trigger on signup.
        const { error: upsertErr } = await supabase
          .from('user_profiles')
          .upsert(
            { user_id: user.id, onboarding_done: true },
            { onConflict: 'user_id' }
          );
        if (upsertErr) {
          // Fall back to a plain update — older schemas may lack the
          // unique constraint that upsert needs.
          await supabase
            .from('user_profiles')
            .update({ onboarding_done: true })
            .eq('user_id', user.id);
        }
      } catch (err) {
        console.warn('[OnboardingPage] finish() error:', err);
      }
    }
    navigate('/home', { replace: true });
  };

  // Onboarding shrunk from 4 → 1 step on 2026-05-17. Default is now
  // "show every platform" — personalisation happens later in
  // Settings, not in onboarding (per Bárbara's review). StepWallet
  // and StepDone are kept defined below for future reuse / a path
  // back to multi-step if we change our mind.
  const stepNodes = [
    <StepWelcome
      key="w"
      onNext={finish}
      displayName={displayName}
      trialDaysLeft={sub.trialDaysLeft}
    />,
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
