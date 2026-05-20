// /banks — Side-by-side comparison of UK banks for what they offer
// in rewards, switching bonuses, and travel partnerships.
//
// All data verified via official sites and reliable UK finance
// sources in May 2026. Switch bonuses fluctuate frequently — always
// verify on the bank's site before acting.

import React, { useMemo, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { Building2, Sparkles, Plane, Coins, Filter } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const BANKS = [
  // ── Digital banks ─────────────────────────────────────────────
  {
    id: 'monzo',
    name: 'Monzo',
    type: 'Digital',
    rewards: 'Monzo Perks (£7/mo): weekly Greggs, monthly cinema ticket, annual Railcard, Uber One subscription, 2-10% cashback offers, 1 bill paid back up to £150/mo (raffle).',
    miles: 'No native miles partner',
    switchBonus: 'Occasional referral schemes',
    bestFor: 'Budgeting + bundled lifestyle perks (Perks tier)',
  },
  {
    id: 'starling',
    name: 'Starling Bank',
    type: 'Digital',
    rewards: 'No native cashback. No in-credit interest since Feb 2025. Easy Saver 4% AER and Fixed Saver 3.70% AER. Cashback offers via Tail marketplace.',
    miles: 'No native miles partner',
    switchBonus: 'Occasional referral schemes',
    bestFor: 'Fee-free overseas spend + savings goals via Spaces',
  },
  {
    id: 'chase-uk',
    name: 'Chase UK',
    type: 'Digital (JPMorgan)',
    rewards: '1% cashback (£15/mo cap) on groceries/transport/fuel/EV charging — year 1. Round-Up Saver 5% AER. Boosted Saver 4.5% AER (year 1).',
    miles: 'No native miles partner',
    switchBonus: 'Occasional via referral (£50)',
    bestFor: 'Travel-friendly debit + tiered savings',
  },
  {
    id: 'revolut',
    name: 'Revolut',
    type: 'Digital (multi-currency)',
    rewards: 'Plans: Standard (free), Plus (£3.99/mo), Premium (£7.99/mo), Metal (£14.99/mo), Ultra (£55/mo). Metal/Ultra earn RevPoints (1/£2 and 1/£1).',
    miles: 'RevPoints → Avios (via BA, Aer Lingus, Iberia, Vueling)',
    switchBonus: 'Plan-based welcome bonuses',
    bestFor: 'Multi-currency travellers + Avios via points',
  },
  {
    id: 'monese',
    name: 'Monese',
    type: 'Digital (fintech)',
    rewards: '4 tiers: Pay As You Go (free), Everyday, Cashback (£7.95/mo with up to £2.50/mo cashback), Premium. Multi-currency accounts.',
    miles: 'No native miles partner',
    switchBonus: 'Refer-a-friend bonus',
    bestFor: 'Multi-currency accounts for non-UK residents',
  },

  // ── Card aggregator ───────────────────────────────────────────
  {
    id: 'curve',
    name: 'Curve',
    type: 'Card aggregator (digital)',
    rewards: 'Plans: Pay (free), Pay X (£5.99/mo), Pay Pro (£9.99/mo) with 1% Curve Cash at 6 retailers (£25/mo cap), Pay Pro+ (£17.99/mo) with 12 retailers (£50/mo cap).',
    miles: 'Earn miles via the underlying card (e.g. Amex BA)',
    switchBonus: '—',
    bestFor: 'Using Amex where Amex is not accepted (acquired by Lloyds Banking Group Nov 2026)',
  },

  // ── Multi-currency / travel ───────────────────────────────────
  {
    id: 'wise',
    name: 'Wise',
    type: 'Multi-currency (travel)',
    rewards: 'No traditional rewards. One-time £7 card fee, no monthly fees. ATM free up to £250/mo (2.69% after). Real mid-market FX.',
    miles: 'No native miles partner',
    switchBonus: '—',
    bestFor: 'Cheap international transfers + travel debit',
  },

  // ── High street banks ─────────────────────────────────────────
  {
    id: 'barclays',
    name: 'Barclays',
    type: 'High street',
    rewards: 'Blue Rewards £5/mo: includes Apple TV+ (£9.99/mo value), Rainy Day Saver 4.21% AER on £0-£5k, partner cashback offers (must activate in app). Monthly £5 loyalty cash REMOVED in 2026.',
    miles: 'Barclaycard Avios card (1-1.5 Avios/£) — separate product',
    switchBonus: '£175 (when active)',
    bestFor: 'Apple TV+ users + savers wanting high instant-access rate',
  },
  {
    id: 'hsbc',
    name: 'HSBC UK',
    type: 'High street',
    rewards: 'HSBC Premier: free travel insurance, GP appointments, mental health support, foreign payments. Standard account: no native rewards.',
    miles: 'HSBC Premier credit card earns convertible reward points',
    switchBonus: '£500 (Premier, plus up to £500 ISA cashback)',
    bestFor: 'Premier customers (£100k savings/investments or £100k income)',
  },
  {
    id: 'lloyds',
    name: 'Lloyds Bank',
    type: 'High street',
    rewards: 'Club Lloyds (£5/mo, waived with £2k+ monthly deposit): pick one yearly perk (Disney+, 6 cinema tickets, magazine, or Gourmet Society + Coffee Club). Monthly Saver 6.25% AER for £25-£400.',
    miles: 'No native miles partner',
    switchBonus: '£200 Club Lloyds / £500 Lloyds Premier (until 30 Apr 2026)',
    bestFor: 'Lifestyle perk picker + high-rate monthly saver',
  },
  {
    id: 'natwest',
    name: 'NatWest',
    type: 'High street',
    rewards: 'Reward account: £4/mo with 2+ direct debits of £2+, £1/mo for app login, 1% at partner retailers. Convert rewards to cash or NatWest balance.',
    miles: 'No native miles partner',
    switchBonus: '£200 (from 6 May 2026, £1,250 pay-in within 60 days)',
    bestFor: 'Stacking direct debits + partner retailer cashback',
  },
  {
    id: 'santander',
    name: 'Santander UK',
    type: 'High street',
    rewards: 'Edge (£3/mo): 1% cashback on selected household bills (£10/mo cap). Edge Explorer (£17/mo): higher cap. Cashback on debit-card spend REMOVED Sep 2025.',
    miles: 'No native miles partner',
    switchBonus: 'Periodic switch incentives',
    bestFor: 'Cashback on essential bills (post-Sep-2025 reduced offering)',
  },
  {
    id: 'metro-bank',
    name: 'Metro Bank',
    type: 'High street (newer)',
    rewards: 'No native cashback. Free EU spending (no FX fees in Europe). Mastercard partner discounts (e.g. 4% wallet credit on Booking.com).',
    miles: 'No native miles partner',
    switchBonus: 'Occasional bonuses',
    bestFor: 'Branch banking 7 days a week + free EU spend',
  },
  {
    id: 'halifax',
    name: 'Halifax',
    type: 'High street (Lloyds Group)',
    rewards: 'Reward account (£3/mo, waived with £1,500+ pay-in): up to 3.00% AER on £4k-£5k + 2 DDs. £5/mo monthly cash REMOVED Sep 2025. Up to 15% cashback at selected retailers via Reward debit card.',
    miles: 'No native miles partner',
    switchBonus: '£150 + up to £75 bonus (when active)',
    bestFor: 'Interest on a small in-credit balance + retailer cashback',
  },
  {
    id: 'tsb',
    name: 'TSB',
    type: 'High street',
    rewards: 'Spend & Save: £5/mo cashback for 20+ debit card payments (first 6 months only on standard). Spend & Save Plus continues £5/mo indefinitely. Account-level interest available.',
    miles: 'No native miles partner',
    switchBonus: '£150 switch + £50 deposit + £30 cashback (~£230 total)',
    bestFor: 'High-frequency debit users (need 20+ payments/month)',
  },
];

const TYPE_FILTERS = ['All', 'High street', 'Digital', 'Card aggregator', 'Multi-currency'];

function BanksPage() {
  const [filter, setFilter] = useState('All');

  const filtered = useMemo(() => {
    if (filter === 'All') return BANKS;
    return BANKS.filter((b) => b.type.toLowerCase().includes(filter.toLowerCase()));
  }, [filter]);

  return (
    <>
      <Helmet>
        <title>Compare UK Banks — SnapGain</title>
      </Helmet>

      <div className="container mx-auto px-4 py-8 md:py-12 max-w-5xl space-y-6">
        <div className="text-center space-y-2 mb-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 text-white shadow-md mb-2">
            <Building2 className="w-6 h-6" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
            Compare UK Banks
          </h1>
          <p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto">
            What each UK high-street, digital and multi-currency bank
            offers in rewards, switching bonuses, and travel partnerships.
            Verified for May 2026 — always verify on the bank&rsquo;s
            site before switching.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2">
          <Filter className="w-4 h-4 text-muted-foreground" />
          {TYPE_FILTERS.map((f) => (
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
          {filtered.map((b) => (
            <Card key={b.id} className="card-hover">
              <CardContent className="p-5 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-bold text-lg leading-tight">
                      {b.name}
                    </h3>
                    <span className="text-xs text-muted-foreground uppercase tracking-wider">
                      {b.type}
                    </span>
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-start gap-2">
                    <Coins className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                    <div>
                      <span className="font-semibold">Rewards:</span>{' '}
                      <span className="text-muted-foreground">
                        {b.rewards}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Plane className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                    <div>
                      <span className="font-semibold">Miles:</span>{' '}
                      <span className="text-muted-foreground">{b.miles}</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Sparkles className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                    <div>
                      <span className="font-semibold">Switch bonus:</span>{' '}
                      <span className="text-muted-foreground">
                        {b.switchBonus}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t">
                  <p className="text-xs">
                    <span className="font-semibold text-primary">
                      Best for:{' '}
                    </span>
                    <span className="text-muted-foreground">{b.bestFor}</span>
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/20">
          <CardContent className="p-5 text-center">
            <p className="text-sm text-muted-foreground">
              Got an account with one of these? Pair it with the right
              stack in the{' '}
              <Link to="/strategies" className="font-semibold text-primary hover:underline">
                Strategy Library
              </Link>
              .
            </p>
          </CardContent>
        </Card>

        <p className="text-xs text-muted-foreground text-center">
          Rates and bonuses change frequently. Always verify on the
          bank&rsquo;s site before switching. Switch bonuses typically
          require 2+ active direct debits and a £1,000+ deposit within
          30-60 days.
        </p>
      </div>
    </>
  );
}

export default BanksPage;
