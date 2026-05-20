// 2026-05-20: Imported from snapgain-shop (was misleadingly named
// "AviosComparator" there — it actually compares Nectar earning vs
// Avios earning per £ spent). Renamed for clarity.

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Award, Calculator as CalcIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

// Sainsbury's Nectar → BA Avios conversion: 400 Nectar = 250 Avios
// (0.625 Avios per Nectar point). Hard-coded since this is the
// public mechanic, not a user input.
const NECTAR_TO_AVIOS_RATE = 250 / 400;

/**
 * Earning-side comparison: a merchant offers EITHER Nectar (e.g.
 * Sainsbury's 1 Nectar per £1) OR Avios direct (e.g. Avios eStore at
 * 2 Avios per £1). Which yields more total Avios on a given spend?
 */
export function NectarVsAviosCalculator() {
  const [nectarRate, setNectarRate] = useState('');
  const [aviosRate, setAviosRate] = useState('');
  const [amount, setAmount] = useState('');
  const [results, setResults] = useState(null);

  const calculate = () => {
    const n = parseFloat(nectarRate) || 0;
    const a = parseFloat(aviosRate) || 0;
    const amt = parseFloat(amount) || 0;
    if (amt <= 0) {
      setResults(null);
      return;
    }
    const viaNectar = Math.round(amt * n * NECTAR_TO_AVIOS_RATE);
    const viaAvios = Math.round(amt * a);
    setResults({
      viaNectar,
      viaAvios,
      winner: viaNectar > viaAvios ? 'nectar' : 'avios',
      amount: amt,
    });
  };

  return (
    <div className="bg-card border-2 border-primary/15 rounded-2xl p-6 shadow-sm">
      <div className="flex items-start gap-3 mb-5">
        <div className="p-2.5 bg-primary rounded-xl text-primary-foreground">
          <TrendingUp className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-primary">Nectar vs Avios earning</h3>
          <p className="text-xs text-muted-foreground">
            Pick the earning side that wins on this spend
          </p>
        </div>
      </div>

      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor="nectar-rate" className="text-xs">Nectar per £1</Label>
            <Input
              id="nectar-rate"
              type="number"
              step="0.1"
              placeholder="e.g. 1"
              value={nectarRate}
              onChange={(e) => setNectarRate(e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="nva-avios-rate" className="text-xs">Avios per £1</Label>
            <Input
              id="nva-avios-rate"
              type="number"
              step="0.1"
              placeholder="e.g. 2"
              value={aviosRate}
              onChange={(e) => setAviosRate(e.target.value)}
              className="mt-1"
            />
          </div>
        </div>
        <div>
          <Label htmlFor="nva-amount" className="text-xs">Amount spent (£)</Label>
          <Input
            id="nva-amount"
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
          Compare earning sides
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
            Total Avios on £{results.amount.toFixed(2)}
          </h4>
          <div className="grid grid-cols-2 gap-3">
            <div className="text-center">
              <div className="text-[10px] uppercase tracking-wider opacity-80 mb-1">
                Via Nectar
              </div>
              <div
                className={`p-2 rounded-lg ${
                  results.winner === 'nectar' ? 'bg-secondary' : 'bg-white/15'
                }`}
              >
                <div className="text-xl font-extrabold">
                  {results.viaNectar.toLocaleString('en-GB')}
                </div>
                <div className="text-[10px] opacity-80">→ 0.625 Avios/pt</div>
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
                  {results.viaAvios.toLocaleString('en-GB')}
                </div>
                <div className="text-[10px] opacity-80">at merchant rate</div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}

export default NectarVsAviosCalculator;
