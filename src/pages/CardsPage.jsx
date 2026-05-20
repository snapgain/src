// /cards — Side-by-side comparison of UK reward + cashback cards.
//
// All data verified via official sites and reliable UK rewards
// sources in May 2026. Some figures (welcome bonuses, promo periods)
// rotate — always verify on the issuer's site before applying.
//
// Cards intentionally NOT included (deprecated or out of scope):
//   - Ribbon Rewards (not a card; rent rewards platform)
//   - Barclaycard Hilton Honors (closed to new applications)
//   - Halifax Clarity (travel card; no cashback)
//   - SumUp Card (B2B only)

import React, { useMemo, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { CreditCard, Sparkles, Award, Filter } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const CARDS = [
  // ── Avios / miles powerhouses ─────────────────────────────────
  {
    id: 'amex-ba-premium',
    name: 'BA Amex Premium Plus',
    issuer: 'American Express',
    annualFee: '£300',
    earnRate: '3 Avios / £1 with BA · 1.5 Avios / £1 elsewhere',
    welcomeBonus: '30,000 Avios after £6,000 spend in 3 months',
    perks: 'Companion Voucher after £15k yearly spend (valid 2 years)',
    bestFor: 'Heavy BA flyers who can hit the £15k spend threshold',
    tag: 'Premium',
  },
  {
    id: 'amex-ba-free',
    name: 'BA Amex (Free)',
    issuer: 'American Express',
    annualFee: '£0',
    earnRate: '1 Avios / £1',
    welcomeBonus: '5,000 Avios after £2,000 spend in 3 months',
    perks: 'Companion Voucher after £12k yearly spend (1-year validity)',
    bestFor: 'Avios entry point — no fee',
    tag: 'Avios',
  },
  {
    id: 'amex-gold',
    name: 'Amex Preferred Rewards Gold',
    issuer: 'American Express',
    annualFee: '£195 (first year free)',
    earnRate: '1 MR / £1 · 2 MR / £1 on airline websites',
    welcomeBonus: '40,000 MR after £5,000 spend in 6 months (boosted; standard 20k)',
    perks: '+5,000 MR per £10k yearly spend (max 10k). Lounge passes, travel insurance.',
    bestFor: 'Flexible travellers across multiple airline programs',
    tag: 'Premium',
  },
  {
    id: 'amex-platinum',
    name: 'Amex Platinum (Charge)',
    issuer: 'American Express',
    annualFee: '£650',
    earnRate: '1 MR / £1',
    welcomeBonus: 'Up to 75,000 MR + £250 travel credit (boosted offers rotate)',
    perks: 'Centurion + Priority Pass lounges, hotel status (FHR), £400 dining credit',
    bestFor: 'Frequent international travellers with £6k+ first-3-month spend',
    tag: 'Premium',
  },
  {
    id: 'barclaycard-avios',
    name: 'Barclaycard Avios',
    issuer: 'Barclaycard',
    annualFee: '£0',
    earnRate: '1 Avios / £1',
    welcomeBonus: 'Welcome bonus when offered (varies)',
    perks: 'Earn Avios where Amex is not accepted',
    bestFor: 'Avios earners shopping where Amex is not accepted',
    tag: 'Avios',
  },
  {
    id: 'barclaycard-avios-plus',
    name: 'Barclaycard Avios Plus',
    issuer: 'Barclaycard',
    annualFee: '£20/month (£240/year)',
    earnRate: '1.5 Avios / £1',
    welcomeBonus: '25,000 Avios after £3,000 spend in 3 months (35k boosted at times)',
    perks: 'Spend £10k yearly → choose 7,000 Avios or upgrade voucher. Lounge access at discount.',
    bestFor: 'Avios power-users without Amex acceptance',
    tag: 'Avios',
  },
  {
    id: 'virgin-atlantic-free',
    name: 'Virgin Atlantic Reward',
    issuer: 'Virgin Money',
    annualFee: '£0',
    earnRate: '0.75 Virgin Points / £1 (3 / £1 with Virgin Atlantic)',
    welcomeBonus: 'Lower welcome bonus (free tier)',
    perks: 'Reward Flight Saver access',
    bestFor: 'Casual Virgin Atlantic flyers',
    tag: 'Miles',
  },
  {
    id: 'virgin-atlantic-plus',
    name: 'Virgin Atlantic Reward+',
    issuer: 'Virgin Money',
    annualFee: '£160',
    earnRate: '1.5 Virgin Points / £1 (3 / £1 with Virgin Atlantic)',
    welcomeBonus: '36,000 Virgin Points (boosted; check offer dates)',
    perks: 'Reward Flight discounts in Upper Class',
    bestFor: 'Virgin Atlantic flyers and transatlantic travel',
    tag: 'Miles',
  },
  {
    id: 'hsbc-premier-elite',
    name: 'HSBC Premier World Elite',
    issuer: 'HSBC UK',
    annualFee: '£290',
    earnRate: '3 pts / £1 (4 pts / £1 in foreign currency)',
    welcomeBonus: '60,000 reward points after £3,000 spend in 90 days',
    perks: 'Points convert to Avios + several airline partners. Travel benefits.',
    bestFor: 'HSBC Premier customers with international spend',
    tag: 'Premium',
  },
  {
    id: 'hsbc-premier-free',
    name: 'HSBC Premier Credit Card',
    issuer: 'HSBC UK',
    annualFee: '£0',
    earnRate: '1.5 pts / £1 (2 pts / £1 in foreign currency)',
    welcomeBonus: '30,000 reward points after £2,000 spend in 90 days',
    perks: 'Premier-only product. Points convertible to Avios.',
    bestFor: 'HSBC Premier customers who want a free Avios route',
    tag: 'Avios',
  },

  // ── Cashback credit cards ─────────────────────────────────────
  {
    id: 'amex-platinum-cashback-everyday',
    name: 'Amex Platinum Cashback Everyday',
    issuer: 'American Express',
    annualFee: '£0',
    earnRate: '0.5% first £10k / 1% above £10k yearly',
    welcomeBonus: '5% cashback for first 5 months (boosted, max £125)',
    perks: 'Must spend £3k+/year to earn standard cashback',
    bestFor: 'Free cashback card for moderate spenders',
    tag: 'Cashback',
  },
  {
    id: 'santander-edge-cc',
    name: 'Santander Edge Credit Card',
    issuer: 'Santander UK',
    annualFee: '£48 (£4/month)',
    earnRate: '1% cashback (max £10/month)',
    welcomeBonus: 'Occasional referral bonus (~£48)',
    perks: 'No FX fees. Up to 3 additional cardholders.',
    bestFor: 'Foreign-currency spend + steady cashback',
    tag: 'Cashback',
  },
  {
    id: 'barclaycard-rewards',
    name: 'Barclaycard Rewards',
    issuer: 'Barclaycard',
    annualFee: '£0',
    earnRate: '1% cashback (promo, 6-12 months) → 0.25% standard',
    welcomeBonus: 'Tied to the promo rate above',
    perks: 'No FX fees. Visa worldwide acceptance.',
    bestFor: 'Foreign-currency spend without a fee',
    tag: 'Cashback',
  },
  {
    id: 'lloyds-ultra',
    name: 'Lloyds Ultra',
    issuer: 'Lloyds',
    annualFee: '£0',
    earnRate: '1% cashback first year → 0.25% standard',
    welcomeBonus: 'Tied to the intro rate above',
    perks: 'No FX fees. No monthly account fees.',
    bestFor: 'Fee-free cashback in the first year',
    tag: 'Cashback',
  },
  {
    id: 'natwest-reward',
    name: 'NatWest Reward',
    issuer: 'NatWest',
    annualFee: '£24 (waived with Reward current account)',
    earnRate: '1% at major supermarkets · 0.5% at petrol & elsewhere',
    welcomeBonus: '—',
    perks: '10 supermarkets in the list. Convert rewards to cash or to NatWest balance.',
    bestFor: 'Supermarket-heavy shoppers',
    tag: 'Cashback',
  },
  {
    id: 'hsbc-rewards',
    name: 'HSBC Rewards',
    issuer: 'HSBC UK',
    annualFee: '£0',
    earnRate: '1 pt / £5 standard · up to 10 pts / £1 at selected retailers',
    welcomeBonus: '2,500 pts (£25) on first transaction + 2,500 anniversary pts on £10k yearly spend',
    perks: 'Points expire 3 years after the calendar month earned',
    bestFor: 'HSBC customers wanting flexible reward points',
    tag: 'Cashback',
  },
  {
    id: 'asda-money',
    name: 'Asda Money Credit Card',
    issuer: 'Asda Money',
    annualFee: '£0',
    earnRate: '0.75% at Asda (incl. fuel) · 0.2% elsewhere',
    welcomeBonus: '—',
    perks: 'Cashback in Asda Pounds',
    bestFor: 'Asda regulars who fuel up there',
    tag: 'Retailer',
  },

  // ── Retailer-specific reward cards ───────────────────────────
  {
    id: 'tesco-clubcard-cc',
    name: 'Tesco Bank Clubcard Credit Card',
    issuer: 'Tesco Bank',
    annualFee: '£0',
    earnRate: '1 Clubcard pt / £4 at Tesco · 1 pt / £8 elsewhere (100 pts = £1 voucher)',
    welcomeBonus: '—',
    perks: 'Points convert to partner rewards (incl. Avios)',
    bestFor: 'Heavy Tesco shoppers (Clubcard → Avios route)',
    tag: 'Retailer',
  },
  {
    id: 'mands-reward',
    name: 'M&S Bank Reward Credit Card',
    issuer: 'M&S Bank',
    annualFee: '£0',
    earnRate: '1 pt / £1 at M&S · 1 pt / £5 elsewhere (100 pts = £1 voucher)',
    welcomeBonus: '4,000 pts (£40 in vouchers) after £1,000 spend in 3 months',
    perks: 'Club Rewards (£10/mo) adds 2 extra pts/£ at M&S',
    bestFor: 'M&S regulars',
    tag: 'Retailer',
  },
  {
    id: 'john-lewis-partnership',
    name: 'John Lewis Partnership Card',
    issuer: 'NewDay',
    annualFee: '£0',
    earnRate: '5 pts / £4 at JL & Waitrose (≈1.25%) · 1 pt / £10 elsewhere (0.1%)',
    welcomeBonus: 'Double points at JL/Waitrose for first 60 days',
    perks: '500 pts = £5 voucher (issued 3× per year)',
    bestFor: 'Heavy John Lewis + Waitrose shoppers',
    tag: 'Retailer',
  },

  // ── Fintech debit & specialty cards ──────────────────────────
  {
    id: 'yonder-free',
    name: 'Yonder (Free)',
    issuer: 'Yonder',
    annualFee: '£0',
    earnRate: '1 point / £1',
    welcomeBonus: 'Occasional promo points',
    perks: 'Access to Yonder dining/experience perks',
    bestFor: 'Trying Yonder without paying',
    tag: 'Fintech',
  },
  {
    id: 'yonder-full',
    name: 'Yonder (Full Membership)',
    issuer: 'Yonder',
    annualFee: '£15/month (£180/year)',
    earnRate: '5 points / £1 base · up to 25 pts / £1 at partner merchants',
    welcomeBonus: 'Free trial of full membership',
    perks: 'Curated London restaurant/experience perks',
    bestFor: 'Foodies + Londoners using experiences',
    tag: 'Fintech',
  },
  {
    id: 'uphold',
    name: 'Uphold Card',
    issuer: 'Uphold (Optimus Cards UK)',
    annualFee: '£0 (virtual) · £9.95 shipping for physical',
    earnRate: '1% on GBP-funded purchases (max £100/month)',
    welcomeBonus: '—',
    perks: 'No FX fees, multi-asset wallet (incl. crypto)',
    bestFor: 'Stack with Airtime Rewards / gift cards',
    tag: 'Fintech',
  },
  {
    id: 'curve-pay-pro',
    name: 'Curve Pay Pro',
    issuer: 'Curve',
    annualFee: 'Paid tier (monthly)',
    earnRate: '1% Curve Cash at 6 chosen retailers (max £25/month)',
    welcomeBonus: '—',
    perks: 'Use hidden Amex anywhere; chargebacks; FX-friendly',
    bestFor: 'Routing Amex spend through non-Amex retailers',
    tag: 'Fintech',
  },
  {
    id: 'curve-pay-pro-plus',
    name: 'Curve Pay Pro+',
    issuer: 'Curve',
    annualFee: 'Paid tier (monthly)',
    earnRate: '1% Curve Cash at 12 chosen retailers (max £50/month)',
    welcomeBonus: '—',
    perks: '60+ partner brands available, premium FX',
    bestFor: 'Heavy Curve users wanting more retailer cashback',
    tag: 'Fintech',
  },
  {
    id: 'trading-212',
    name: 'Trading 212 Card',
    issuer: 'Trading 212',
    annualFee: '£0',
    earnRate: '1.5% cashback with active subscription + Cashback Reinvest ON (max £15/month) — post 7 June 2026',
    welcomeBonus: 'Free-share offer for new accounts',
    perks: 'Multi-currency, free FX, interest on uninvested cash',
    bestFor: 'Trading 212 investors who keep subscription active',
    tag: 'Fintech',
  },
  {
    id: 'chase-uk-debit',
    name: 'Chase UK Debit',
    issuer: 'Chase UK',
    annualFee: '£0',
    earnRate: '1% on groceries / transport / fuel / EV charging (max £15/month), year 1',
    welcomeBonus: '—',
    perks: 'No FX fees. Round-up savings. Year 2+ needs £1,500/mo deposit + £500 spend.',
    bestFor: 'Travel debit + cashback on essential categories',
    tag: 'Debit',
  },
  {
    id: 'nationwide-flex-direct',
    name: 'Nationwide FlexDirect',
    issuer: 'Nationwide',
    annualFee: '£0',
    earnRate: '1% on debit-card spend (max £5/month, first 12 months)',
    welcomeBonus: '5% AER in-credit interest year 1 + £175 switch bonus (when active)',
    perks: 'Requires £1,000+/mo deposit. ATM and gambling excluded.',
    bestFor: 'New Nationwide customers in year 1',
    tag: 'Debit',
  },

  // ── Hotel rewards ────────────────────────────────────────────
  {
    id: 'hilton-honors-debit',
    name: 'Hilton Honors Debit Card',
    issuer: 'Currensea',
    annualFee: '£60/year (£30 promo until 28 May 2026)',
    earnRate: '3 Hilton points / £1',
    welcomeBonus: 'Welcome points offer (varies)',
    perks: 'No FX fees, free hotel status uplift',
    bestFor: 'Hilton-loyal travellers (Barclaycard Hilton CC is closed)',
    tag: 'Miles',
  },

  // ── Revolut paid tiers (technically plans not cards but compared here) ──
  {
    id: 'revolut-metal',
    name: 'Revolut Metal',
    issuer: 'Revolut',
    annualFee: '£14.99/month',
    earnRate: '1 RevPoint / £2 (convertible to Avios + others)',
    welcomeBonus: 'Plan-based welcome bonus',
    perks: 'Lounge access, FX, no monthly conversion fees',
    bestFor: 'Travel-heavy users wanting Avios via points',
    tag: 'Miles',
  },
  {
    id: 'revolut-ultra',
    name: 'Revolut Ultra',
    issuer: 'Revolut',
    annualFee: '£45/month',
    earnRate: '1 RevPoint / £1 (2x Metal earn rate)',
    welcomeBonus: 'Plan-based welcome bonus',
    perks: 'Unlimited lounges, premium partner perks, multi-currency',
    bestFor: 'Power users who spend across all categories',
    tag: 'Premium',
  },
];

const TAG_COLOR = {
  Premium: 'bg-purple-100 text-purple-800',
  Avios: 'bg-blue-100 text-blue-800',
  Miles: 'bg-red-100 text-red-800',
  Cashback: 'bg-amber-100 text-amber-800',
  Retailer: 'bg-pink-100 text-pink-800',
  Fintech: 'bg-teal-100 text-teal-800',
  Debit: 'bg-slate-100 text-slate-700',
};

const TAG_FILTERS = ['All', 'Avios', 'Miles', 'Cashback', 'Retailer', 'Fintech', 'Premium', 'Debit'];

function CardsPage() {
  const [filter, setFilter] = useState('All');

  const filtered = useMemo(() => {
    if (filter === 'All') return CARDS;
    return CARDS.filter((c) => c.tag === filter);
  }, [filter]);

  return (
    <>
      <Helmet>
        <title>Compare UK Cards — SnapGain</title>
      </Helmet>

      <div className="container mx-auto px-4 py-8 md:py-12 max-w-5xl space-y-6">
        <div className="text-center space-y-2 mb-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-teal-500 text-white shadow-md mb-2">
            <CreditCard className="w-6 h-6" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
            Compare UK Cards
          </h1>
          <p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto">
            Cashback, Avios, miles and retailer cards verified for
            May 2026. Welcome bonuses rotate frequently — always
            verify on the issuer&rsquo;s site before applying.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2">
          <Filter className="w-4 h-4 text-muted-foreground" />
          {TAG_FILTERS.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                filter === f
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {filtered.map((c) => (
            <Card key={c.id} className="card-hover">
              <CardContent className="p-5 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <h3 className="font-bold text-lg leading-tight">
                      {c.name}
                    </h3>
                    <span className="text-xs text-muted-foreground">
                      {c.issuer}
                    </span>
                  </div>
                  <span
                    className={`text-xs font-bold uppercase tracking-wider px-2 py-1 rounded-full ${
                      TAG_COLOR[c.tag] || 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {c.tag}
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-2 text-xs pt-2 border-t">
                  <div>
                    <div className="text-muted-foreground uppercase tracking-wider mb-0.5">
                      Annual fee
                    </div>
                    <div className="font-bold">{c.annualFee}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground uppercase tracking-wider mb-0.5">
                      Earn rate
                    </div>
                    <div className="font-bold leading-tight">{c.earnRate}</div>
                  </div>
                </div>

                <div className="space-y-2 text-sm pt-2 border-t">
                  <div className="flex items-start gap-2">
                    <Sparkles className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                    <div>
                      <span className="font-semibold">Welcome bonus:</span>{' '}
                      <span className="text-muted-foreground">
                        {c.welcomeBonus}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Award className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                    <div>
                      <span className="font-semibold">Perks:</span>{' '}
                      <span className="text-muted-foreground">{c.perks}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t">
                  <p className="text-xs">
                    <span className="font-semibold text-primary">
                      Best for:{' '}
                    </span>
                    <span className="text-muted-foreground">{c.bestFor}</span>
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/20">
          <CardContent className="p-5 text-center">
            <p className="text-sm text-muted-foreground">
              Pick a card + a strategy from the{' '}
              <Link to="/strategies" className="font-semibold text-primary hover:underline">
                Strategy Library
              </Link>{' '}
              to maximise the return per pound.
            </p>
          </CardContent>
        </Card>

        <p className="text-xs text-muted-foreground text-center">
          Card terms change frequently and welcome bonuses rotate. Always
          verify on the issuer&rsquo;s site before applying. Credit cards
          only — pay the balance in full each month to keep rewards
          positive-sum.
        </p>
      </div>
    </>
  );
}

export default CardsPage;
