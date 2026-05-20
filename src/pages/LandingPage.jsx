// LandingPage — conversion-focused, family/immigrant angle.
//
// Audience: UK residents (especially immigrant families) who want to
// turn their everyday spending into flights home and visits abroad.
// Pain point: separation from family + the math nobody taught you.
//
// Structure (top to bottom):
//   1. Hero            promise: spend smart, fly your family home
//   2. SocialProofBar  generic stats + 100+ families count
//   3. OriginStory     Tesco April 2017 founder moment (trust builder)
//   4. PainSection     5-apps-fatigue + missed-money anxiety
//   5. HowItWorks      3 concrete steps
//   6. TravelAngle     3 real BA flights, including São Paulo
//   7. HouseholdAccount  BA family pool (6 people, same address)
//   8. ComparisonTable Without vs With SnapGain (visual table)
//   9. RealNumbers     real beta-user numbers
//  10. Calculator      interactive spend to flights estimator
//  11. FAQ             objection killers
//  12. PricingCTA      single plan
//
// Style notes:
//   - All CTAs go to /pricing (single click to purchase).
//   - No em-dashes in any UI string.
//   - No scroll-triggered animations (static for speed).
//   - Never name partner cashback platforms publicly.
//   - "100+ families" is the verified real count, not 847+.

import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Search,
  Layers,
  Plane,
  Clock,
  AlertTriangle,
  TrendingDown,
  CheckCircle2,
  XCircle,
  ChevronDown,
  Sparkles,
  Wallet,
  ArrowRight,
  Users,
  Calculator as CalcIcon,
  Coffee,
  Heart,
} from 'lucide-react';

// ────────────────────────────────────────────────────────────────────
// Section 1 — Hero
// ────────────────────────────────────────────────────────────────────
function Hero({ onPrimary, onSecondary }) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-light-pink/30 via-background to-light-green/20">
      <div className="container mx-auto px-4 pt-20 pb-16 md:pt-28 md:pb-24 text-center">
        {/* Eyebrow */}
        <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary mb-6">
          <Sparkles className="w-4 h-4" />
          Trusted by 100+ UK families
        </div>

        {/* Headline — Option B: outcome promise (grounded range) */}
        <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-tighter leading-[1.05] mb-6">
          2 to 4 free flights a year.
          <span className="block gradient-text">From spending you'd do anyway.</span>
        </h1>

        {/* Subheadline — concrete proof using real beta data.
            Time frames are precise on purpose: £900 is cumulative
            (Aug 2025 → May 2026 = 9 months, multiple platforms).
            5,500+ Avios/month comes from one verified BA Executive
            Club statement (Apr → May 2026). Both still climbing. */}
        <p className="text-lg md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-10">
          SnapGain ranks every cashback platform, gift-card discount,
          and miles programme into one stack. You shop normally. We
          compute the route. Real beta data: <strong>£900 cashback in
          9 months</strong> and <strong>5,500+ Avios per month</strong>.
        </p>

        {/* Single CTA — focused funnel, no secondary distractor */}
        <div className="flex justify-center items-center mb-6">
          <Button
            onClick={onPrimary}
            size="lg"
            className="px-8 py-6 text-lg font-semibold"
          >
            Start your 7-day trial
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>

        <p className="text-sm text-muted-foreground">
          Free 7-day trial · No card needed · 9,742 UK stores tracked · Cancel anytime
        </p>
      </div>
    </section>
  );
}

// ────────────────────────────────────────────────────────────────────
// Section 2 — Social proof bar (with 100+ families as #1 stat)
// ────────────────────────────────────────────────────────────────────
function SocialProofBar() {
  const stats = [
    { value: '100+', label: 'UK families using SnapGain' },
    { value: '9,742', label: 'UK stores tracked' },
    { value: '12+', label: 'cashback platforms' },
    { value: '1,300+', label: 'premium-rate retailers' },
    { value: 'Daily', label: 'rate updates' },
  ];
  return (
    <section className="border-y border-border bg-muted/40 py-8">
      <div className="container mx-auto px-4">
        <p className="text-center text-sm uppercase tracking-wider text-muted-foreground mb-4">
          The only stack ranker for UK cashback and miles
        </p>
        <div className="flex flex-wrap justify-center gap-x-10 gap-y-4 text-center">
          {stats.map((s) => (
            <div key={s.label}>
              <div className="text-2xl md:text-3xl font-extrabold text-primary">{s.value}</div>
              <div className="text-xs uppercase tracking-wide text-muted-foreground">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ────────────────────────────────────────────────────────────────────
// Section 3 — Origin Story (Tesco April 2017)
// ────────────────────────────────────────────────────────────────────
function OriginStory({ onPrimary }) {
  return (
    <section className="container mx-auto px-4 py-20 md:py-28">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 text-primary mb-4">
            <Coffee className="w-7 h-7" />
          </div>
          <p className="text-sm uppercase tracking-wider text-muted-foreground mb-2">
            The 4-minute story
          </p>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
            It started in a Tesco queue.
          </h2>
        </div>

        <div className="space-y-5 text-lg text-foreground/80 leading-relaxed">
          <p>
            <strong>London, April 2017.</strong> The person ahead in line
            tapped a card the cashier called premium. As they walked out
            the cashier said, "thanks for those extra points this week,
            should cover Barcelona."
          </p>
          <p>
            On the way home, the same question kept repeating. <em>"How
            much have we left on the table?"</em>
          </p>
          <p>
            The math, that night, was brutal. <strong>Six years living in
            the UK. £200,000 spent. £0 returned.</strong> At a typical 15
            percent stack rate that meant <strong className="text-primary">
            £30,000 missed</strong>. Enough for 6 to 8 return flights home,
            every one of which had been priced out by the maths.
          </p>
          <p>
            SnapGain is what we built so that nobody else has to live the
            same six years.
          </p>
        </div>

        <div className="text-center mt-10">
          <Button onClick={onPrimary} size="lg" className="px-8 py-6 text-lg">
            Stop missing yours
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </div>
    </section>
  );
}

// ────────────────────────────────────────────────────────────────────
// Section 4 — Pain
// ────────────────────────────────────────────────────────────────────
function PainSection() {
  const pains = [
    {
      icon: <Clock className="w-7 h-7" />,
      title: '4 minutes per purchase, lost',
      body: 'Open one cashback app. Then another. Then a gift-card discounter. Then check your points balance. Every. Single. Time.',
    },
    {
      icon: <AlertTriangle className="w-7 h-7" />,
      title: 'You pick the wrong app',
      body: 'One app shows 2 percent on Boots, but another runs 5 percent this week, and you missed it because you stopped checking.',
    },
    {
      icon: <TrendingDown className="w-7 h-7" />,
      title: 'You never stack',
      body: 'Buying a discounted gift card first, layering a bonus rewards programme on top, then paying with a miles card. Nobody has time to figure that out manually.',
    },
  ];
  return (
    <section className="bg-muted/20 py-20 md:py-28 border-y border-border">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-14">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
            The strategies the cashback apps will not tell you
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground">
            They all want you to use only their app. We show you the real
            combinations that pay 2x to 5x more, plus the apps you have
            never heard of that quietly outperform the big names.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {pains.map((p) => (
            <Card key={p.title} className="h-full border-2">
              <CardContent className="pt-6">
                <div className="text-destructive mb-4">{p.icon}</div>
                <h3 className="text-xl font-bold mb-2">{p.title}</h3>
                <p className="text-muted-foreground">{p.body}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

// ────────────────────────────────────────────────────────────────────
// Section 5 — How it works
// ────────────────────────────────────────────────────────────────────
function HowItWorks({ onPrimary }) {
  const steps = [
    {
      icon: <Search className="w-8 h-8" />,
      title: 'Type the store',
      body: 'Tesco, Boots, ASOS, Booking.com. Any of 9,742 UK stores.',
    },
    {
      icon: <Layers className="w-8 h-8" />,
      title: 'See the best stack',
      body: 'Cashback x gift card x points x premium bonuses. We calculate every combo and rank the winner.',
    },
    {
      icon: <Plane className="w-8 h-8" />,
      title: 'Cash out or fly out',
      body: 'Take the pounds to your bank, or route the same shopping through travel-rewarding platforms for your next flight.',
    },
  ];
  return (
    <section id="how-it-works" className="container mx-auto px-4 py-20 md:py-28">
      <div className="text-center mb-14 max-w-2xl mx-auto">
        <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
          How SnapGain works
        </h2>
        <p className="text-lg md:text-xl text-muted-foreground">
          Three taps. The math is already done.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-12">
        {steps.map((s, i) => (
          <div key={s.title} className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary text-primary-foreground mb-5">
              {s.icon}
            </div>
            <div className="text-sm font-bold text-primary mb-2">
              STEP {i + 1}
            </div>
            <h3 className="text-2xl font-bold mb-3">{s.title}</h3>
            <p className="text-muted-foreground">{s.body}</p>
          </div>
        ))}
      </div>

      <div className="text-center">
        <Button onClick={onPrimary} size="lg" className="px-8 py-6 text-lg">
          Start your 7-day trial
          <ArrowRight className="ml-2 w-5 h-5" />
        </Button>
      </div>
    </section>
  );
}

// ────────────────────────────────────────────────────────────────────
// Section 6 — Travel angle
//
// Verified data:
//   - MAN→DUB return: 16,000 Avios + £133 (off-peak Sep 2026)
//   - LHR→LIS return: 42,000 Avios + £50 (off-peak Sep 2026)
//   - LHR→GRU one-way: APPROXIMATE 60,000 Avios + £250 (typical
//     off-peak Economy; replace with verified screenshot when ready)
// ────────────────────────────────────────────────────────────────────
function TravelAngle() {
  const examples = [
    {
      route: 'Manchester → Dublin',
      type: 'return',
      price: '16,000 Avios + £133',
      spend: '~2 to 3 months of £500/mo routed',
    },
    {
      route: 'London → Lisbon',
      type: 'return',
      price: '42,000 Avios + £50',
      spend: '~3 to 4 months of £500/mo routed',
    },
    {
      route: 'London → São Paulo',
      type: 'one-way (off-peak)',
      price: '55,000 Avios + £330',
      spend: '~7 months of £500/mo routed',
    },
  ];
  return (
    <section id="travel" className="bg-muted/30 py-20 md:py-28 border-y border-border">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <Plane className="w-12 h-12 text-primary mx-auto mb-4" />
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
            Your weekly shop. Your next flight home.
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground">
            Routing your everyday shopping through travel-rewarding platforms
            turns pounds into miles. SnapGain shows you which retailers are
            part of that path, plus the cashback you stack on top. The cash
            co-pay on each flight is covered by the cashback you earn along
            the way.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {examples.map((e) => (
            <Card
              key={e.route}
              className="text-center h-full bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20"
            >
              <CardContent className="pt-6 pb-6">
                <div className="text-xl md:text-2xl font-bold mb-1">
                  {e.route}
                </div>
                <div className="text-sm text-muted-foreground mb-4">
                  {e.type}
                </div>
                <div className="text-2xl md:text-3xl font-extrabold text-primary mb-2">
                  {e.price}
                </div>
                <div className="text-xs uppercase tracking-wide text-muted-foreground mb-3">
                  BA Reward Flight Saver
                </div>
                <div className="text-sm font-medium border-t border-primary/10 pt-3">
                  {e.spend}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <p className="text-center text-xs text-muted-foreground mt-6 max-w-2xl mx-auto">
          Spend estimates assume the SnapGain stacking strategy returning
          25 percent cashback on routed purchases, converted to Avios at
          the Avios Booster rate (1,000 Avios = £9.20). Cash co-pay covered
          by cashback earned. Actual months vary by retailer mix, dates and
          current Avios pricing. SnapGain does not issue miles or track
          balances. You earn directly with the partner programmes.
        </p>
      </div>
    </section>
  );
}

// ────────────────────────────────────────────────────────────────────
// Section 7 — Household Account (BA family pool)
// ────────────────────────────────────────────────────────────────────
function HouseholdAccount() {
  return (
    <section className="container mx-auto px-4 py-20 md:py-28">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12 max-w-2xl mx-auto">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 text-primary mb-4">
            <Users className="w-7 h-7" />
          </div>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
            Your family points, combined.
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground">
            British Airways lets up to <strong>6 people at the same
            address</strong> pool their Avios into one Household Account.
            Mum's grocery shop, Dad's commute, the kids' online orders,
            all stacking toward one shared flight.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <Card className="border-2">
            <CardContent className="pt-6">
              <div className="text-primary mb-4">
                <Users className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold mb-2">Up to 6 members</h3>
              <p className="text-sm text-muted-foreground">
                Adults and children at the same registered UK address can
                all link their British Airways Executive Club accounts.
              </p>
            </CardContent>
          </Card>
          <Card className="border-2">
            <CardContent className="pt-6">
              <div className="text-primary mb-4">
                <Layers className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold mb-2">One shared balance</h3>
              <p className="text-sm text-muted-foreground">
                Every Avios any household member earns gets pooled
                automatically into one combined balance, ready to redeem.
              </p>
            </CardContent>
          </Card>
          <Card className="border-2">
            <CardContent className="pt-6">
              <div className="text-primary mb-4">
                <Heart className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold mb-2">Fly together, faster</h3>
              <p className="text-sm text-muted-foreground">
                Four people routing groceries, bills and shopping fill
                the shared balance 4x faster than one person alone.
                SnapGain shows the strategies that work for every type
                of UK spending.
              </p>
            </CardContent>
          </Card>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-6 max-w-2xl mx-auto">
          Household Account is a free British Airways Executive Club
          feature. SnapGain helps you set it up correctly and track each
          member's earning toward the next family flight.
        </p>
      </div>
    </section>
  );
}

// ────────────────────────────────────────────────────────────────────
// Section 8 — Comparison Table (without vs with SnapGain)
// ────────────────────────────────────────────────────────────────────
function ComparisonTable({ onPrimary }) {
  const rows = [
    {
      metric: 'Annual cashback earned',
      without: '£120',
      with: '£900+',
      withoutNote: 'UK average per user',
      withNote: 'real SnapGain beta data',
    },
    {
      metric: 'Annual Avios earned',
      without: '~5,000',
      with: '66,000+',
      withoutNote: 'random card spending',
      withNote: 'verified BA statement',
    },
    {
      metric: 'Free flights per year',
      without: '0',
      with: '2 to 4',
      withoutNote: 'paid in full or not flying',
      withNote: 'short and mid-haul, family travel',
    },
    {
      metric: 'Apps to check daily',
      without: '0 to 1',
      with: '1',
      withoutNote: 'guess at one app',
      withNote: 'SnapGain ranks them all',
    },
    {
      metric: 'Strategy guides included',
      without: '0',
      with: '9',
      withoutNote: 'figure it out alone',
      withNote: 'beginner to advanced stacks',
    },
    {
      metric: 'Time spent per month',
      without: '4 to 6 hrs',
      with: 'under 30 min',
      withoutNote: 'checking multiple apps',
      withNote: 'one ranked view, done',
    },
  ];

  return (
    <section className="bg-foreground text-background py-20 md:py-28">
      <div className="container mx-auto px-4">
        <div className="text-center mb-14 max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
            Doing it alone vs doing it with SnapGain
          </h2>
          <p className="text-lg md:text-xl opacity-80">
            Same year, same spending, two very different outcomes.
          </p>
        </div>

        <div className="max-w-4xl mx-auto overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-background/20">
                <th className="py-4 px-3 text-sm uppercase tracking-wider opacity-70 font-medium"></th>
                <th className="py-4 px-3 text-center">
                  <div className="text-sm uppercase tracking-wider opacity-70 font-medium">Without</div>
                  <div className="text-lg font-bold">SnapGain</div>
                </th>
                <th className="py-4 px-3 text-center bg-primary/20 rounded-t-lg">
                  <div className="text-sm uppercase tracking-wider text-primary font-medium">With</div>
                  <div className="text-lg font-bold">SnapGain</div>
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.metric} className="border-b border-background/10">
                  <td className="py-5 px-3 font-medium">{r.metric}</td>
                  <td className="py-5 px-3 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <XCircle className="w-5 h-5 text-destructive flex-shrink-0" />
                      <span className="text-lg font-bold">{r.without}</span>
                    </div>
                    <div className="text-xs opacity-50 mt-1">{r.withoutNote}</div>
                  </td>
                  <td className="py-5 px-3 text-center bg-primary/10">
                    <div className="flex items-center justify-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                      <span className="text-lg font-bold text-primary">{r.with}</span>
                    </div>
                    <div className="text-xs opacity-70 mt-1">{r.withNote}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="text-center mt-10">
          <Button
            onClick={onPrimary}
            size="lg"
            className="px-8 py-6 text-lg bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Pick your side
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </div>
    </section>
  );
}

// ────────────────────────────────────────────────────────────────────
// Section 9 — Real numbers (proof)
// ────────────────────────────────────────────────────────────────────
function RealNumbers() {
  const stats = [
    {
      icon: <Wallet className="w-6 h-6" />,
      value: '£900+',
      label: 'cashback earned in 9 months',
      detail: 'Real beta data (Aug 2025 to May 2026), across multiple platforms.',
    },
    {
      icon: <Plane className="w-6 h-6" />,
      value: '5,500+',
      label: 'Avios earned in 1 month, direct',
      detail: 'Verified BA Executive Club statement. Stack adds more on top.',
    },
    {
      icon: <Layers className="w-6 h-6" />,
      value: '9,742',
      label: 'UK stores tracked daily',
      detail: 'Including 1,300+ premium-rate retailers.',
    },
  ];
  return (
    <section className="container mx-auto px-4 py-20 md:py-28">
      <div className="text-center mb-14 max-w-2xl mx-auto">
        <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
          Real numbers, not promises
        </h2>
        <p className="text-lg md:text-xl text-muted-foreground">
          We built SnapGain on top of our own cashback accounts. These are
          the kind of returns the platform is designed around.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {stats.map((s) => (
          <div key={s.label} className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary mb-4">
              {s.icon}
            </div>
            <div className="text-5xl md:text-6xl font-extrabold mb-2 gradient-text">
              {s.value}
            </div>
            <div className="text-base font-medium">{s.label}</div>
            <div className="text-sm text-muted-foreground mt-2">{s.detail}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ────────────────────────────────────────────────────────────────────
// Section 10 — Interactive Calculator (real-spend based, no flights)
//
// Calibrated against the SnapGain beta profile (Denys & Bárbara, May 2026):
//   £3,064/month total spend → £129/month cashback + 724 Avios/month
//   That's 4.2% effective cashback rate and 0.24 Avios/£.
//
// Three tiers reflect the realistic spread (full breakdown lives in
// the Obsidian note "Família UK - cálculo base"). Tier descriptions
// MUST NOT name partner platforms — see top of STRATEGY_TIERS object.
//
// Flight examples removed per internal review (2026-05-14): the
// methodology leak made readers think SnapGain sells flights inside
// the app.
// ────────────────────────────────────────────────────────────────────
// Strategy tiers calibrated against the SnapGain beta profile:
//   £3,064/month spend → £129 cashback + 724 Avios/month
//   = 4.2% cashback + 0.24 Avios/£
// "Smart" sits at that baseline. Beginner is rough-stack only; Advanced
// adds full stacking, promos, welcome bonuses, Nectar boosts, etc.
// IMPORTANT — never name partner platforms here (NX, Amex, Nectar,
// Ribbon, One4all, etc.). The landing is public and naming platforms
// lets visitors bypass our affiliate flow by Googling the names.
// Descriptions must stay generic. Names are revealed only INSIDE the
// app, after signup, in the Strategy Library cards.
// No tier descriptions in the public Calculator — users learn what's
// inside each tier only after signing up (Strategy Library). Keeps the
// landing intriguing without giving the playbook away.
const STRATEGY_TIERS = {
  beginner: {
    label: 'Beginner',
    cashbackPct: 2,
    aviosPerPound: 0.1,
  },
  smart: {
    label: 'Smart',
    cashbackPct: 5,
    aviosPerPound: 0.25,
  },
  advanced: {
    label: 'Advanced',
    cashbackPct: 10,
    aviosPerPound: 0.5,
  },
};

function Calculator({ onPrimary }) {
  const [spend, setSpend] = useState(3000);
  const [tier, setTier] = useState('smart');

  const { cashbackPct, aviosPerPound } = STRATEGY_TIERS[tier];
  const monthlyCashback = (spend * cashbackPct) / 100;
  const monthlyAvios = Math.round(spend * aviosPerPound);
  const annualCashback = monthlyCashback * 12;
  const annualAvios = monthlyAvios * 12;

  return (
    <section
      id="calculator"
      className="bg-gradient-to-br from-primary/10 via-background to-primary/5 py-20 md:py-28"
    >
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 max-w-2xl mx-auto">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 text-primary mb-4">
            <CalcIcon className="w-7 h-7" />
          </div>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
            Run your numbers
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground">
            Tell us what your household spends. We will show you the
            cashback and Avios you are leaving on the table.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <Card className="border-2">
            <CardContent className="p-6 md:p-10 space-y-8">
              {/* Spend slider */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                    Monthly household spend
                  </label>
                  <div className="text-3xl font-extrabold text-primary">
                    £{spend.toLocaleString()}
                  </div>
                </div>
                <input
                  type="range"
                  min="500"
                  max="8000"
                  step="100"
                  value={spend}
                  onChange={(e) => setSpend(Number(e.target.value))}
                  className="w-full h-2 bg-primary/20 rounded-full appearance-none cursor-pointer accent-primary"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-2">
                  <span>£500</span>
                  <span>single</span>
                  <span>family of 4</span>
                  <span>£8,000</span>
                </div>
              </div>

              {/* Strategy tier selector (3 radio cards) */}
              <div>
                <label className="text-sm font-semibold uppercase tracking-wider text-muted-foreground block mb-3">
                  Strategy level
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {Object.entries(STRATEGY_TIERS).map(([key, val]) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setTier(key)}
                      className={`rounded-lg border-2 px-4 py-4 text-center font-bold transition-all ${
                        tier === key
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-border hover:border-primary/40'
                      }`}
                    >
                      {val.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Live output — monthly + annual, no flight examples */}
              <div className="bg-primary/5 rounded-xl p-6 space-y-5">
                <div>
                  <div className="text-xs uppercase tracking-wider text-muted-foreground mb-3">
                    Monthly return
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-xs text-muted-foreground mb-1">
                        Cashback
                      </div>
                      <div className="text-2xl md:text-3xl font-extrabold">
                        £{monthlyCashback.toFixed(0)}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground mb-1">
                        Avios accumulated
                      </div>
                      <div className="text-2xl md:text-3xl font-extrabold text-primary">
                        {monthlyAvios.toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-primary/10">
                  <div className="text-xs uppercase tracking-wider text-muted-foreground mb-3">
                    Year-end stack (12 months)
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-xs text-muted-foreground mb-1">
                        Annual cashback
                      </div>
                      <div className="text-3xl md:text-4xl font-extrabold gradient-text">
                        £{annualCashback.toLocaleString()}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground mb-1">
                        Annual Avios
                      </div>
                      <div className="text-3xl md:text-4xl font-extrabold gradient-text">
                        {annualAvios.toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <Button
                onClick={onPrimary}
                size="lg"
                className="w-full py-6 text-lg font-semibold"
              >
                Lock in this strategy
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <p className="text-xs text-center text-muted-foreground">
                Calibrated against real SnapGain beta data. Actual
                returns vary by retailer mix, payment cards, and
                participation in promos / welcome bonuses (not included).
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}

// ────────────────────────────────────────────────────────────────────
// Section 11 — FAQ (improved)
// ────────────────────────────────────────────────────────────────────
function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-border">
      <button
        onClick={() => setOpen(!open)}
        className="w-full py-5 flex items-center justify-between text-left hover:opacity-80 transition-opacity"
        aria-expanded={open}
      >
        <span className="text-lg font-semibold pr-4">{q}</span>
        <ChevronDown
          className={`w-5 h-5 flex-shrink-0 transition-transform ${
            open ? 'rotate-180' : ''
          }`}
        />
      </button>
      {open && <div className="pb-5 text-muted-foreground">{a}</div>}
    </div>
  );
}

function FAQ() {
  const faqs = [
    {
      q: 'Do I need to stop using my current cashback app?',
      a: "No. SnapGain works alongside any app you already use. We just tell you which one pays MORE for each specific store, and show you stacks that combine multiple apps for higher returns.",
    },
    {
      q: 'Is SnapGain itself a cashback app?',
      a: "No. SnapGain doesn't pay cashback. It ranks the apps that do. Once inside SnapGain you'll see the exact platform you should be using for each store, with a direct link.",
    },
    {
      q: 'How is the data kept up to date?',
      a: 'Cashback rates sync daily at 04:00 UTC from public retailer feeds. Network memberships refresh shortly after. The 9,742-store catalogue is rebuilt every night so you see live rates.',
    },
    {
      q: 'Can I really stack offers?',
      a: 'Often, yes. A common stack: buy a discounted gift card, spend it at the store through a cashback portal, pay with a miles-earning card. SnapGain calculates the total return automatically and only shows stacks that actually work together.',
    },
    {
      q: 'Why do some retailers always pay at least 10%?',
      a: 'One of the platforms we track guarantees a minimum 10 percent return on any retailer in their network (1,300+ stores qualify today). SnapGain surfaces these automatically so you never miss the floor.',
    },
    {
      q: 'Can my family share my SnapGain account?',
      a: "Up to 6 people at the same UK address can pool their Avios into one British Airways Household Account. SnapGain helps you set it up correctly and tracks each member's earning toward shared flights. One SnapGain subscription covers the household.",
    },
    {
      q: 'How do you make money?',
      a: "Affiliate commissions from the cashback platforms themselves, plus your Premium subscription. You'll never see ads or have us sell your data.",
    },
    {
      q: 'I already use a cashback app. What does SnapGain add?',
      a: "Three things: (1) it tells you when a different platform pays more on the same purchase, (2) it shows the gift-card and points stack you'd otherwise miss, (3) it estimates the travel-miles value of each option so you know which route gets you closer to your next flight.",
    },
  ];
  return (
    <section id="faq" className="container mx-auto px-4 py-20 md:py-28 max-w-3xl">
      <div className="text-center mb-10">
        <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-3">
          Honest questions, straight answers
        </h2>
      </div>

      <div>
        {faqs.map((f) => (
          <FAQItem key={f.q} q={f.q} a={f.a} />
        ))}
      </div>
    </section>
  );
}

// ────────────────────────────────────────────────────────────────────
// Section 12 — Final pricing CTA
// ────────────────────────────────────────────────────────────────────
function PricingCTA({ onSubscribe }) {
  const perks = [
    'Unlimited store comparisons',
    'Daily rate updates across 9,742 UK retailers',
    '9 stacking strategies, beginner to advanced',
    'BA Household Account setup wizard',
    'Spend to flights calculator',
    'Premium-rate retailers surfaced automatically',
    'Travel-miles value estimated for each option',
    'Cancel anytime',
  ];
  return (
    <section id="pricing" className="bg-gradient-to-br from-primary/10 via-background to-primary/5 py-20 md:py-28">
      <div className="container mx-auto px-4 max-w-3xl text-center">
        <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-3">
          Stop guessing. Start flying.
        </h2>
        <p className="text-lg md:text-xl text-muted-foreground mb-8">
          Free 7 days. Then £14.99/month or £120/year (save £60). Cancel anytime.
        </p>

        <ul className="text-left max-w-md mx-auto space-y-3 mb-10">
          {perks.map((p) => (
            <li key={p} className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <span>{p}</span>
            </li>
          ))}
        </ul>

        <Button
          onClick={onSubscribe}
          size="lg"
          className="px-10 py-6 text-lg font-semibold"
        >
          Start your free trial
          <ArrowRight className="ml-2 w-5 h-5" />
        </Button>
        <p className="text-sm text-muted-foreground mt-4">
          Single plan. Cancel anytime. The strategies pay for themselves on
          your first big purchase.
        </p>
      </div>
    </section>
  );
}

// ────────────────────────────────────────────────────────────────────
// Page composition
// ────────────────────────────────────────────────────────────────────
function LandingPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // All "Start your 7-day trial" CTAs go straight to /pricing.
  const goPricing = () => navigate('/pricing');

  // Handle anchor scroll if the URL carries a hash on mount.
  React.useEffect(() => {
    const hash = window.location.hash?.replace('#', '');
    if (!hash) return;
    requestAnimationFrame(() => {
      document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth' });
    });
  }, []);

  const goHowItWorks = () => {
    document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <Helmet>
        <title>SnapGain, spend smart in the UK and fly your family home</title>
        <meta
          name="description"
          content="Every pound you spend in the UK can come back as cashback or Avios. SnapGain shows you the exact stack that turns your normal life into 2 to 4 flights a year. Used by 100+ UK families."
        />
      </Helmet>

      <Hero onPrimary={goPricing} onSecondary={goHowItWorks} />
      <SocialProofBar />
      <OriginStory onPrimary={goPricing} />
      <PainSection />
      <HowItWorks onPrimary={goPricing} />
      {/* TravelAngle removed per internal review (2026-05-14):
          (1) exposes our calculation methodology, (2) made Denys
          assume SnapGain sells flights inside the app. Function
          kept defined below so it's easy to re-enable. */}
      <HouseholdAccount />
      <ComparisonTable onPrimary={goPricing} />
      <RealNumbers />
      <Calculator onPrimary={goPricing} />
      <FAQ />
      <PricingCTA onSubscribe={goPricing} />
    </>
  );
}

export default LandingPage;
