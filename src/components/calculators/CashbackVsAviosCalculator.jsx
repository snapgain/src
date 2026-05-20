// 2026-05-20: Imported from snapgain-shop (calculator product
// integration). Adapted to use main app's theme tokens (--primary,
// --secondary) and gbpToAviosBooster from lib/aviosMath.js so the
// Booster rate is in ONE place across the codebase.

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Percent, Award, Calculator as CalcIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { gbpToAviosBooster } from '@/lib/aviosMath';

/**
 * Compare two earning strategies for a single purchase:
 *   Strategy A: take cashback (£) and convert to Avios via Booster
 *   Strategy B: earn Avios directly from the merchant
 *
 * Useful when both options are available — e.g. "Tesco gives me 10%
 * via NX vs 4 Avios/£ via the Avios eStore — which yields more
 * Avios?"
 */
export function CashbackVsAviosCalculator() {
  const [cashbackRate, setCashbackRate] = useState('');
  const [aviosRate, setAviosRate] = useState('');
  const [amount, setAmount] = useState('');
  const [results, setResults] = useState(null);

  const calculate = () => {
    const cb = parseFloat(cashbackRate) || 0;
    const av = parseFloat(aviosRate) || 0;
    const amt = parseFloat(amount) || 0;
    if (amt <= 0) {
      setResults(null);
      return;
    }
    const cashbackValue = (cb / 100) * amt;
    const aviosFromCashback = gbpToAviosBooster(cashbackValue);
    const aviosDirect = Math.round(av * amt);
    setResults({
      cashbackValue,
      aviosFromCashback,
      aviosDirect,
      winner: aviosFromCashback > aviosDirect ? 'cashback' : 'avios',
      amount: amt,
    });
  };

  return (
    <div className="bg-card border-2 border-primary/15 rounded-2xl p-6 shadow-sm">
      <div className="flex items-start gap-3 mb-5">
        <div className="p-2.5 bg-primary rounded-xl text-primary-foreground">
          <Percent className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-primary">Cashback vs Avios eStore</h3>
          <p className="text-xs text-muted-foreground">
            Per-purchase: which gives more Avios?
          </p>
        </div>
      </div>

      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor="cb-rate" className="text-xs">Cashback %</Label>
            <Input
              id="cb-rate"
              type="number"
              step="0.1"
              placeholder="e.g. 10"
              value={cashbackRate}
              onChange={(e) => setCashbackRate(e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="av-rate" className="text-xs">Avios per £1</Label>
            <Input
              id="av-rate"
              type="number"
              step="0.1"
              placeholder="e.g. 4"
              value={aviosRate}
              onChange={(e) => setAviosRate(e.target.value)}
              className="mt-1"
            />
          </div>
        </div>
        <div>
          <Label htmlFor="cb-amount" className="text-xs">Amount spent (£)</Label>
          <Input
            id="cb-amount"
            type="number"
            step="0.01"
            placeholder="e.g. 100"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="mt-1"
          />
        </div>
        <Button onClick={calculate} className="w-full" size="sm">
          <CalcIcon className="w-4 h-4 mr-2" />
          Compare
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
                Via cashback
              </div>
              <div
                className={`p-2 rounded-lg ${
                  results.winner === 'cashback' ? 'bg-secondary' : 'bg-white/15'
                }`}
              >
                <div className="text-xl font-extrabold">
                  {results.aviosFromCashback.toLocaleString('en-GB')}
                </div>
                <div className="text-[10px] opacity-80">
                  £{results.cashbackValue.toFixed(2)} → Booster
                </div>
              </div>
            </div>
            <div className="text-center">
              <div className="text-[10px] uppercase tracking-wider opacity-80 mb-1">
                Via Avios eStore
              </div>
              <div
                className={`p-2 rounded-lg ${
                  results.winner === 'avios' ? 'bg-secondary' : 'bg-white/15'
                }`}
              >
                <div className="text-xl font-extrabold">
                  {results.aviosDirect.toLocaleString('en-GB')}
                </div>
                <div className="text-[10px] opacity-80">direct</div>
              </div>
            </div>
          </div>
          <p className="text-[11px] text-center mt-3 opacity-90">
            🏆 Best:{' '}
            <span className="font-bold">
              {results.winner === 'cashback' ? 'Cashback → Booster' : 'Avios eStore'}
            </span>
          </p>
        </motion.div>
      )}
    </div>
  );
}

export default CashbackVsAviosCalculator;
