// StrategyLibraryPage — the 9 stacking strategies from the SnapGain
// ebook, presented as an interactive library inside the app.
//
// Trial-first model (Alt A): trial users see all 9 cards but only
// "One4all + NX" is fully expandable (the unlocked teaser stack).
// The other 8 show their title + return + tier badge with a "lock"
// overlay that links to /pricing. Paying users see everything.

import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import {
  Layers,
  Wallet,
  ShoppingBag,
  Car,
  Pizza,
  Fuel,
  Sparkles,
  Home,
  Plane,
  Coffee,
  ArrowRight,
  ChevronDown,
  CheckCircle2,
  Trophy,
  Lock,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useSubscription } from '@/hooks/useSubscription';

// Which strategy ID is unlocked during the free trial.
// Chosen for: instant savings, point-of-sale usable, 150+ UK retailers,
// 5-min setup, the entry-level stack that builds trust without giving
// away the advanced playbooks.
const TRIAL_UNLOCKED_ID = 'one4all-nx';

// ────────────────────────────────────────────────────────────────────
// Strategy catalogue — sourced from the SnapGain ebook
// ────────────────────────────────────────────────────────────────────
const STRATEGIES = [
  {
    id: 'one4all-nx',
    icon: Wallet,
    name: 'One4all + NX Rewards',
    tier: 'Beginner',
    tierColor: 'bg-green-100 text-green-800',
    return: '20%',
    returnDetail: 'guaranteed on every gift card',
    teaser: 'Buy a £100 gift card for £80. The simplest stack in the UK, and the foundation everything else builds on.',
    timeToSetup: '5 min',
    steps: [
      'Sign up to NX Rewards (free with one partner purchase per month).',
      'Buy a One4all gift card at 20 percent off (£100 face value for £80).',
      'Download the One4all app and redeem the code into your digital wallet.',
      'Use it like a prepaid debit card in any One4all partner store.',
      'Pay the original £80 with an Avios-earning card (Amex BA or Barclays Avios) for an extra 80 Avios.',
    ],
    bestFor: 'Boots, Currys, Argos, M&S, Sainsbury\'s, and 150+ other UK retailers.',
  },
  {
    id: 'nx-airtime',
    icon: ShoppingBag,
    name: 'NX + Airtime Rewards',
    tier: 'Intermediate',
    tierColor: 'bg-blue-100 text-blue-800',
    return: '24%',
    returnDetail: '20 percent + 4 percent stacked',
    teaser: 'Layer Airtime Rewards on top of your One4all gift card and earn extra cashback at partner retailers.',
    timeToSetup: '10 min',
    steps: [
      'Buy your One4all gift card via NX Rewards as in the beginner stack (20 percent saved).',
      'Add the One4all card to the Airtime Rewards app.',
      'Shop at any Airtime partner (Boots, Halfords, Pizza Express, etc.).',
      'Airtime auto-credits an extra 4 percent cashback to your mobile bill.',
      'Pay the original £80 with an Avios card for the third layer.',
    ],
    bestFor: 'Anywhere the Airtime partner list overlaps with One4all acceptance.',
  },
  {
    id: 'sainsburys-triple',
    icon: Layers,
    name: 'Sainsbury\'s Triple Stack',
    tier: 'Advanced',
    tierColor: 'bg-purple-100 text-purple-800',
    return: '34%+',
    returnDetail: '20% + 10% + 10% + Avios via Nectar',
    teaser: 'The jewel of the SnapGain library. Multi-layer stack that compounds cashback at every step.',
    timeToSetup: '20 min',
    steps: [
      'Buy a One4all £100 gift card for £80 via NX Rewards (20 percent).',
      'Walk into a Currys store and buy a £100 Currys gift card with the One4all.',
      'Back to NX Rewards. Use the Currys gift card to buy a YouChoose or Every-wish gift card (+10 percent NX cashback).',
      'On YouChoose, swap that gift card for a Sainsbury\'s gift card.',
      'Go to Sainsbury\'s online via the NX Rewards portal (+10 percent NX cashback again).',
      'Pay with the Sainsbury\'s gift card — earns Nectar Points (which convert to Avios at 0.625 ratio).',
    ],
    bestFor: 'Your monthly grocery shop. Every £100 spent returns ~£40 plus Avios.',
  },
  {
    id: 'amazon-optimiser',
    icon: ShoppingBag,
    name: 'Amazon Optimiser',
    tier: 'Intermediate',
    tierColor: 'bg-blue-100 text-blue-800',
    return: '5% to 26%',
    returnDetail: 'simple to advanced',
    teaser: 'Amazon doesn\'t do direct cashback. But you can route through gift cards to capture 5 to 26 percent anyway.',
    timeToSetup: '10 min',
    steps: [
      'Simple route: Uphold Mastercard (1 percent) plus JamDoughnut Tesco gift card (4 percent), pay for Amazon gift card at Tesco. Total: 5 percent.',
      'Advanced: NX Rewards One4all (20 percent) plus Airtime at partner (4 percent) plus receipt scanning apps (2 percent). Total: 26 percent.',
      'Either way, top up Amazon balance with the discounted gift card.',
      'Pay all Amazon purchases from your topped-up balance.',
    ],
    bestFor: 'Amazon Prime shoppers, especially £100+ orders.',
  },
  {
    id: 'uber-avios',
    icon: Car,
    name: 'Uber + Avios',
    tier: 'Specialist (Transport)',
    tierColor: 'bg-amber-100 text-amber-800',
    return: '5% + 1 Avios/£',
    returnDetail: 'on every ride',
    teaser: 'Link Uber to your BA Executive Club account and pay rides with discounted gift cards.',
    timeToSetup: '5 min',
    steps: [
      'In your BA Executive Club app, link Uber as a partner (1 Avios per £1 spent on Uber).',
      'Buy Uber gift cards via EverUp (5 percent cashback).',
      'Add the gift card to Uber as your primary payment method.',
      'Every ride: 5 percent cashback plus 1 Avios per £1.',
    ],
    bestFor: 'Regular Uber riders, Uber Eats users. Compounds fast.',
  },
  {
    id: 'deliveroo-stack',
    icon: Pizza,
    name: 'Deliveroo Multi-Stack',
    tier: 'Specialist (Food)',
    tierColor: 'bg-amber-100 text-amber-800',
    return: '15%+',
    returnDetail: 'plus Avios via Amex',
    teaser: 'Order food, earn cashback and Avios. Works for Just Eat too.',
    timeToSetup: '10 min',
    steps: [
      'Buy a Deliveroo gift card with your best rewards card (Amex BA for Avios).',
      'Log into Deliveroo via the NX Rewards link to earn 10 percent NX cashback.',
      'Pay with the Deliveroo gift card.',
      'Example £100 order: 5 percent gift card cashback + 10 percent NX = £15 back, plus 100 Amex points convertible to Avios.',
    ],
    bestFor: 'Anyone who orders takeaway weekly. £30+ saved monthly easily.',
  },
  {
    id: 'fuel-stack',
    icon: Fuel,
    name: 'BP Me + Esso Fuel',
    tier: 'Specialist (Fuel)',
    tierColor: 'bg-amber-100 text-amber-800',
    return: '4% to 8%',
    returnDetail: 'plus Avios on every litre',
    teaser: 'Fuel is one of the biggest monthly expenses. Route it through BPme and Esso apps for cashback and Avios.',
    timeToSetup: '5 min',
    steps: [
      'Install BPme (BP filling stations) and the Esso app.',
      'Link your Nectar account inside the BPme app.',
      'Pay at the pump through the app — earns Nectar Points (convertible to Avios at 0.625).',
      'For Esso: link Tesco Clubcard or BA Avios partner card.',
      'Pay the bill itself with an Amex BA card for an extra 1 Avios per £.',
    ],
    bestFor: 'Anyone with a car. £40-£60 monthly fuel returns ~£4 in equivalent Avios value.',
  },
  {
    id: 'beauty-grooming',
    icon: Sparkles,
    name: 'Beauty & Grooming',
    tier: 'Specialist',
    tierColor: 'bg-amber-100 text-amber-800',
    return: '8% to 15%',
    returnDetail: 'at major retailers',
    teaser: 'Boots, Superdrug and Lookfantastic all sit in cashback networks. Stack them.',
    timeToSetup: '5 min',
    steps: [
      'Buy a Boots or Superdrug gift card via JamDoughnut (5 to 10 percent cashback).',
      'Use the gift card in-store or online.',
      'For Lookfantastic, route purchases through TopCashback or Quidco (5 to 10 percent variable).',
      'Pay original gift card purchase with an Amex BA card for Avios.',
    ],
    bestFor: 'Monthly skincare, haircare, and pharmacy spend.',
  },
  {
    id: 'rent-ribbon',
    icon: Home,
    name: 'Rent via Ribbon Rewards',
    tier: 'Specialist (Housing)',
    tierColor: 'bg-amber-100 text-amber-800',
    return: '1% to 1.5%',
    returnDetail: 'on your biggest monthly bill',
    teaser: 'The most under-used hack in the UK. Earn cashback on rent itself — now from just 1,000 points (Nov 2025 update).',
    timeToSetup: '15 min',
    steps: [
      'Sign up to Ribbon Rewards (free).',
      'Add your landlord or letting agent as a recipient.',
      'Pay rent through Ribbon. They forward the full amount to your landlord, then credit you 1.0 percent (any property) or 1.5 percent (partner properties).',
      'NEW (Nov 2025): cash out from 1,000 points = £10 voucher. Vouchers range from £10 up to £150. Previously the minimum was 2,500 points = £25, so you can redeem 2.5x faster now.',
      'Cashback can be redeemed as bank transfer or partner gift cards.',
    ],
    bestFor: '£1,000/month rent = £120/year. £1,500 = £180/year. £2,000 = £240/year. £2,500 = £300/year.',
  },
];

// ────────────────────────────────────────────────────────────────────
// Difficulty badge
// ────────────────────────────────────────────────────────────────────
function Badge({ tier, tierColor }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${tierColor}`}
    >
      {tier}
    </span>
  );
}

// ────────────────────────────────────────────────────────────────────
// Strategy card with expandable details (or lock overlay during trial)
// ────────────────────────────────────────────────────────────────────
function StrategyCard({ strategy, locked }) {
  const [open, setOpen] = useState(false);
  const Icon = strategy.icon;

  if (locked) {
    // Locked card during trial — show meta, hide playbook, link upgrade.
    return (
      <Card className="border-2 overflow-hidden relative card-hover">
        <Link to="/pricing?subscribe=required" className="block">
          <CardContent className="p-6 opacity-70">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg md:text-xl font-bold leading-tight">
                    {strategy.name}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge tier={strategy.tier} tierColor={strategy.tierColor} />
                  </div>
                </div>
              </div>
              <div className="w-9 h-9 rounded-full bg-foreground/80 text-background flex items-center justify-center shrink-0">
                <Lock className="w-4 h-4" />
              </div>
            </div>

            <div className="mb-3">
              <div className="text-3xl font-extrabold gradient-text">
                {strategy.return}
              </div>
              <div className="text-xs text-muted-foreground uppercase tracking-wide">
                {strategy.returnDetail}
              </div>
            </div>

            <p className="text-sm text-muted-foreground">
              {strategy.teaser}
            </p>
          </CardContent>

          <div className="border-t bg-foreground/5 px-6 py-3 text-center">
            <span className="text-xs font-bold uppercase tracking-wider text-primary inline-flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5" />
              Unlock with Premium
            </span>
          </div>
        </Link>
      </Card>
    );
  }

  // Unlocked card — full expandable playbook.
  return (
    <Card className="border-2 border-primary/40 overflow-hidden card-hover ring-1 ring-primary/20">
      <button
        onClick={() => setOpen(!open)}
        className="w-full text-left"
        aria-expanded={open}
      >
        <CardContent className="p-6">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <Icon className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg md:text-xl font-bold leading-tight">
                  {strategy.name}
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  <Badge tier={strategy.tier} tierColor={strategy.tierColor} />
                  <span className="text-xs text-muted-foreground">
                    {strategy.timeToSetup} setup
                  </span>
                </div>
              </div>
            </div>
            <ChevronDown
              className={`w-5 h-5 text-muted-foreground transition-transform shrink-0 mt-2 ${
                open ? 'rotate-180' : ''
              }`}
            />
          </div>

          <div className="mb-4">
            <div className="text-3xl font-extrabold gradient-text">
              {strategy.return}
            </div>
            <div className="text-xs text-muted-foreground uppercase tracking-wide">
              {strategy.returnDetail}
            </div>
          </div>

          <p className="text-sm text-muted-foreground">{strategy.teaser}</p>
        </CardContent>
      </button>

      {open && (
        <div className="border-t bg-muted/30 p-6 space-y-4">
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-3">
              Step by step
            </h4>
            <ol className="space-y-3">
              {strategy.steps.map((step, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center">
                    {i + 1}
                  </span>
                  <span className="text-sm pt-0.5">{step}</span>
                </li>
              ))}
            </ol>
          </div>

          <div className="bg-background rounded-lg p-4 border">
            <h4 className="text-sm font-bold mb-1 flex items-center gap-2">
              <Trophy className="w-4 h-4 text-primary" />
              Best for
            </h4>
            <p className="text-sm text-muted-foreground">{strategy.bestFor}</p>
          </div>
        </div>
      )}
    </Card>
  );
}

// ────────────────────────────────────────────────────────────────────
// Page
// ────────────────────────────────────────────────────────────────────
function StrategyLibraryPage() {
  const tiers = ['Beginner', 'Intermediate', 'Advanced', 'Specialist (Transport)', 'Specialist (Food)', 'Specialist (Fuel)', 'Specialist', 'Specialist (Housing)'];

  // Detect trial vs paid: only paying subscribers see all 9 playbooks.
  // Trial users get exactly one unlocked card (TRIAL_UNLOCKED_ID).
  const { isActive } = useSubscription();
  const isPaying = !!isActive;

  // Group: keep the unlocked strategy at the top during trial so it
  // is the first thing the user sees. For paying users, default tier
  // sort applies (Beginner → Intermediate → Advanced → Specialist).
  const tierOrder = { Beginner: 1, Intermediate: 2, Advanced: 3 };
  const sorted = [...STRATEGIES].sort((a, b) => {
    if (!isPaying) {
      if (a.id === TRIAL_UNLOCKED_ID) return -1;
      if (b.id === TRIAL_UNLOCKED_ID) return 1;
    }
    const aOrder = tierOrder[a.tier] || 4;
    const bOrder = tierOrder[b.tier] || 4;
    return aOrder - bOrder;
  });

  return (
    <>
      <Helmet>
        <title>Strategy Library — SnapGain</title>
        <meta
          name="description"
          content="9 stacking strategies, from beginner 20 percent guaranteed to advanced 34 percent plus Avios."
        />
      </Helmet>

      <div className="container mx-auto px-4 py-12 md:py-16 max-w-5xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-secondary text-white shadow-lg mb-4">
            <Layers className="w-7 h-7" />
          </div>
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-3">
            The Strategy Library
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            9 tested stacks, from the beginner 20 percent guaranteed
            return to the advanced 34 percent plus Avios. Click any card
            to see the step-by-step.
          </p>
          {!isPaying && (
            <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm text-primary">
              <Sparkles className="w-4 h-4" />
              Free trial: 1 strategy unlocked. Upgrade to unlock the other 8.
            </div>
          )}
        </div>

        {/* Quick legend */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          <Badge tier="Beginner" tierColor="bg-green-100 text-green-800" />
          <Badge tier="Intermediate" tierColor="bg-blue-100 text-blue-800" />
          <Badge tier="Advanced" tierColor="bg-purple-100 text-purple-800" />
          <Badge tier="Specialist" tierColor="bg-amber-100 text-amber-800" />
        </div>

        {/* Strategy grid — paying users see all unlocked; trial users
            see TRIAL_UNLOCKED_ID unlocked and the other 8 locked. */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {sorted.map((strategy) => (
            <StrategyCard
              key={strategy.id}
              strategy={strategy}
              locked={!isPaying && strategy.id !== TRIAL_UNLOCKED_ID}
            />
          ))}
        </div>

        {/* Coffee block */}
        <Card className="bg-gradient-to-br from-primary/10 via-background to-primary/5 border-primary/20">
          <CardContent className="p-8 md:p-10 text-center">
            <Coffee className="w-10 h-10 text-primary mx-auto mb-4" />
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-3">
              Pick one. Just one.
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto mb-6">
              You don&rsquo;t need to run all 9 to see results. Start with the
              Beginner stack today, master it in a week, then layer in the
              next one. The Triple Stack alone returns about £400 over a
              year of normal grocery spending.
            </p>
            <Button asChild size="lg" className="px-8">
              <Link to="/home">
                Back to dashboard
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </>
  );
}

export default StrategyLibraryPage;
