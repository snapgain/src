// 2026-05-20: Imported from snapgain-shop. Uses native range input
// instead of Radix Slider (not in main app's UI primitives, no need
// to add a new dep just for this).

import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, TrendingUp, TrendingDown, HelpCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

// Sainsbury's Nectar→Avios conversion mechanic (public, fixed):
//   400 Nectar = 250 Avios → 0.625 Avios per Nectar
//   1 Nectar at Sainsbury's = £0.005 (well-known baseline)
const NECTAR_TO_AVIOS = 250 / 400;
const NECTAR_GBP = 0.005;

/**
 * Sliding-scale "should I convert?" tool. User puts in Nectar
 * balance + their personal valuation of 1 Avios (£0.005 break-even
 * default, £0.01 typical, £0.02+ for premium redemptions). Shows
 * whether converting is worth it in £ terms.
 */
export function NectarToAviosConverter() {
  const [nectar, setNectar] = useState(400);
  const [aviosValue, setAviosValue] = useState(0.01);
  const [showHelp, setShowHelp] = useState(false);

  const { convertedAvios, nectarGBP, aviosGBP, gain, gainPct, worthIt } =
    useMemo(() => {
      const pts = Number(nectar) || 0;
      const avios = Math.floor(pts * NECTAR_TO_AVIOS);
      const nValue = pts * NECTAR_GBP;
      const aValue = avios * aviosValue;
      const diff = aValue - nValue;
      const pct = nValue > 0 ? (diff / nValue) * 100 : 0;
      return {
        convertedAvios: avios,
        nectarGBP: nValue,
        aviosGBP: aValue,
        gain: diff,
        gainPct: pct,
        worthIt: aValue > nValue,
      };
    }, [nectar, aviosValue]);

  return (
    <div className="bg-card border-2 border-primary/15 rounded-2xl p-6 shadow-sm">
      <div className="flex items-start justify-between gap-3 mb-5">
        <div>
          <h3 className="text-lg font-bold text-primary">Nectar → Avios converter</h3>
          <p className="text-xs text-muted-foreground">
            Worth it depends on how much YOU value 1 Avios
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowHelp((v) => !v)}
          className="p-2 rounded-full hover:bg-muted text-muted-foreground"
          aria-label="How this works"
        >
          <HelpCircle className="w-4 h-4" />
        </button>
      </div>

      {showHelp && (
        <div className="mb-4 p-3 bg-muted/50 rounded-lg text-xs text-foreground/80 space-y-1">
          <p>
            <strong>Sainsbury's Nectar → Avios</strong> converts at 400 → 250
            (≈ 0.625 Avios per Nectar). At Sainsbury's, 1 Nectar = £0.005.
          </p>
          <p>
            <strong>Your "value per Avios"</strong> depends on how you redeem.
            £0.005 = break-even. £0.01 = typical short-haul. £0.02+ = premium
            long-haul.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <Label htmlFor="nectar-pts" className="text-xs">Nectar points</Label>
          <Input
            id="nectar-pts"
            type="number"
            value={nectar}
            onChange={(e) => setNectar(parseInt(e.target.value, 10) || 0)}
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="avios-val" className="text-xs">
            Your value per Avios: £{aviosValue.toFixed(4)}
          </Label>
          <input
            id="avios-val"
            type="range"
            min={0.005}
            max={0.03}
            step={0.0005}
            value={aviosValue}
            onChange={(e) => setAviosValue(Number(e.target.value))}
            className="w-full h-2 bg-primary/20 rounded-full appearance-none cursor-pointer accent-primary mt-3"
          />
          <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
            <span>£0.005 break-even</span>
            <span>£0.03 premium</span>
          </div>
        </div>
      </div>

      <div className="flex justify-center my-3">
        <ArrowRight className="w-6 h-6 text-secondary animate-pulse" />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <Cell label="Nectar value" value={`£${nectarGBP.toFixed(2)}`} />
        <Cell label="Avios generated" value={convertedAvios.toLocaleString('en-GB')} />
        <Cell label="Avios value" value={`£${aviosGBP.toFixed(2)}`} />
        <motion.div
          key={worthIt ? 'good' : 'bad'}
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          className={`p-3 rounded-lg text-center ${
            worthIt
              ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
              : 'bg-amber-100 text-amber-900 border border-amber-300'
          }`}
        >
          <p className="text-[10px] font-semibold">
            {worthIt ? 'Good deal' : 'Not worth it'}
          </p>
          <div className="flex items-center justify-center gap-1 text-base font-extrabold">
            {worthIt ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
            <span>
              {gain >= 0 ? '+' : ''}£{gain.toFixed(2)}
            </span>
          </div>
          <p className="text-[10px] font-semibold opacity-80">
            ({gainPct >= 0 ? '+' : ''}{gainPct.toFixed(1)}%)
          </p>
        </motion.div>
      </div>

      <p className="text-[10px] text-center text-muted-foreground mt-3">
        Break-even at £0.008 per Avios. Most travellers value at £0.01–0.02.
      </p>
    </div>
  );
}

function Cell({ label, value }) {
  return (
    <div className="bg-muted/40 p-3 rounded-lg text-center">
      <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{label}</p>
      <p className="text-lg font-bold text-primary">{value}</p>
    </div>
  );
}

export default NectarToAviosConverter;
