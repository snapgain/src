// 2026-05-20: Imported from snapgain-shop. Original had mixed PT/EN
// labels — fully translated to EN here. Plan→divisor table comes from
// Revolut's own RevPoints earning rate (verified 2026-05-19 against
// revolut.com/our-pricing-plans).

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Repeat, Award, Calculator as CalcIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// RevPoints earning rates per Revolut plan (verified May 2026).
//   Plus    £3.99/mo  → 1 RevPoint per £10 spent (Plus is the entry paid tier)
//   Premium £7.99/mo  → 1 per £4
//   Metal   £14.99/mo → 1 per £2
//   Ultra   £55/mo    → 1 per £1
// Stored as "£ per RevPoint" so the math is `amount / divisor`.
const REVOLUT_DIVISORS = {
  plus: 10,
  premium: 4,
  metal: 2,
  ultra: 1,
};

/**
 * Compare two strategies for stacking Avios:
 *   A) Revolut spend → RevPoints → Revolut Shop boost → Avios
 *   B) Avios eStore direct
 *
 * The Revolut Shop "boost" multiplier is variable per retailer
 * (advertised as e.g. "10× RevPoints at Tesco") — user provides it
 * since it changes daily.
 */
export function RevolutVsAviosCalculator() {
  const [plan, setPlan] = useState('premium');
  const [shopBoost, setShopBoost] = useState('');
  const [amount, setAmount] = useState('');
  const [aviosRate, setAviosRate] = useState('');
  const [results, setResults] = useState(null);

  const calculate = () => {
    const divisor = REVOLUT_DIVISORS[plan] || 4;
    const amt = parseFloat(amount) || 0;
    const direct = parseFloat(aviosRate) || 0;
    const boost = parseFloat(shopBoost) || 1;
    if (amt <= 0) {
      setResults(null);
      return;
    }
    // RevPoints transfer 1:1 to Avios.
    const viaRevolut = Math.round((amt / divisor) * boost);
    const viaDirect = Math.round(amt * direct);
    setResults({
      viaRevolut,
      viaDirect,
      winner: viaRevolut > viaDirect ? 'revolut' : 'avios',
      amount: amt,
      plan,
    });
  };

  return (
    <div className="bg-card border-2 border-primary/15 rounded-2xl p-6 shadow-sm">
      <div className="flex items-start gap-3 mb-5">
        <div className="p-2.5 bg-primary rounded-xl text-primary-foreground">
          <Repeat className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-primary">Revolut vs Avios eStore</h3>
          <p className="text-xs text-muted-foreground">
            RevPoints → Avios (1:1) vs Avios direct
          </p>
        </div>
      </div>

      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor="rev-plan" className="text-xs">Revolut plan</Label>
            <Select value={plan} onValueChange={setPlan}>
              <SelectTrigger id="rev-plan" className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="plus">Plus · 1 pt per £10</SelectItem>
                <SelectItem value="premium">Premium · 1 pt per £4</SelectItem>
                <SelectItem value="metal">Metal · 1 pt per £2</SelectItem>
                <SelectItem value="ultra">Ultra · 1 pt per £1</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="rev-boost" className="text-xs">Revolut Shop boost (×)</Label>
            <Input
              id="rev-boost"
              type="number"
              step="0.5"
              placeholder="e.g. 10"
              value={shopBoost}
              onChange={(e) => setShopBoost(e.target.value)}
              className="mt-1"
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor="rev-amount" className="text-xs">Amount spent (£)</Label>
            <Input
              id="rev-amount"
              type="number"
              step="0.01"
              placeholder="e.g. 100"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="rev-av" className="text-xs">Direct Avios per £1</Label>
            <Input
              id="rev-av"
              type="number"
              step="0.1"
              placeholder="e.g. 2"
              value={aviosRate}
              onChange={(e) => setAviosRate(e.target.value)}
              className="mt-1"
            />
          </div>
        </div>
        <Button onClick={calculate} className="w-full" size="sm">
          <CalcIcon className="w-4 h-4 mr-2" />
          Compare strategies
        </Button>
      </div>

      {results && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-5 bg-primary text-primary-foreground rounded-xl p-4"
        >
          <h4 className="text-sm font-bold mb-3 flex items-center gap-2">
            <Award className="w-4 h-4 text-secondary" />
            Avios outcome on £{results.amount.toFixed(2)}
          </h4>
          <div className="grid grid-cols-2 gap-3">
            <div className="text-center">
              <div className="text-[10px] uppercase tracking-wider opacity-80 mb-1">
                Via Revolut ({results.plan})
              </div>
              <div
                className={`p-2 rounded-lg ${
                  results.winner === 'revolut' ? 'bg-secondary' : 'bg-white/15'
                }`}
              >
                <div className="text-xl font-extrabold">
                  {results.viaRevolut.toLocaleString('en-GB')}
                </div>
                <div className="text-[10px] opacity-80">Shop boost applied</div>
              </div>
            </div>
            <div className="text-center">
              <div className="text-[10px] uppercase tracking-wider opacity-80 mb-1">
                Via Avios direct
              </div>
              <div
                className={`p-2 rounded-lg ${
                  results.winner === 'avios' ? 'bg-secondary' : 'bg-white/15'
                }`}
              >
                <div className="text-xl font-extrabold">
                  {results.viaDirect.toLocaleString('en-GB')}
                </div>
                <div className="text-[10px] opacity-80">no plan needed</div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}

export default RevolutVsAviosCalculator;
