/**
 * Avios value math — implements the "Golden Rule" from Bárbara's
 * ebook: when deciding between a cashback platform vs the Avios
 * eStore for a given purchase, check whether the cashback you'd earn
 * could buy MORE Avios via the Avios Booster than you'd accrue
 * directly through the eStore. If yes, take the cashback route.
 *
 * Reference values from the ebook:
 *   - 1,000 Avios ≈ £9.20 in average redemption value
 *   - 1 Avios ≈ £0.0092
 *   - Avios Booster lets you buy Avios at promotional rates that
 *     sometimes beat the £0.0092 par price by 20–50%
 *
 * For simplicity (and conservatism) the comparison here uses the
 * par price. When a Booster promo is live, the "cashback wins"
 * threshold widens further in cashback's favour.
 */

// 1 Avios ≈ £0.0092 — average redemption value across European short-haul
export const GBP_PER_AVIOS = 0.0092;

/** £X cashback → equivalent Avios if used to buy Avios at Booster par price. */
export function gbpToAviosBooster(gbp) {
  const n = Number(gbp);
  if (!Number.isFinite(n) || n <= 0) return 0;
  return Math.round(n / GBP_PER_AVIOS);
}

/** Avios value in £ at the par redemption price. */
export function aviosToGbp(avios) {
  const n = Number(avios);
  if (!Number.isFinite(n) || n <= 0) return 0;
  return n * GBP_PER_AVIOS;
}

/**
 * Compare a cashback option against a direct Avios eStore option for
 * the same purchase. Returns the recommendation + the delta.
 *
 * @param {object} args
 * @param {number} args.cashbackGbp — £ cashback you'd earn via the cashback route
 * @param {number} args.directAvios — Avios you'd earn via the Avios eStore route (or 0/null if not available)
 * @returns {{
 *   cashbackAvios: number,
 *   directAvios: number,
 *   winner: 'cashback' | 'avios' | 'tie' | 'cashback-only' | 'avios-only',
 *   deltaAvios: number,  // positive = cashback wins by this many Avios
 *   note: string,
 * }}
 */
export function compareCashbackVsAvios({ cashbackGbp = 0, directAvios = 0 }) {
  const cb = Number(cashbackGbp) || 0;
  const av = Number(directAvios) || 0;
  const cashbackAvios = gbpToAviosBooster(cb);

  if (cb > 0 && av === 0) {
    return {
      cashbackAvios,
      directAvios: 0,
      winner: 'cashback-only',
      deltaAvios: cashbackAvios,
      note: `≈ ${cashbackAvios.toLocaleString('en-GB')} Avios if you buy via Avios Booster.`,
    };
  }
  if (av > 0 && cb === 0) {
    return {
      cashbackAvios: 0,
      directAvios: av,
      winner: 'avios-only',
      deltaAvios: -av,
      note: `${av.toLocaleString('en-GB')} Avios via the eStore.`,
    };
  }
  if (cashbackAvios === av) {
    return {
      cashbackAvios,
      directAvios: av,
      winner: 'tie',
      deltaAvios: 0,
      note: 'Cashback and Avios routes are equal — pick the one you trust to track.',
    };
  }
  if (cashbackAvios > av) {
    return {
      cashbackAvios,
      directAvios: av,
      winner: 'cashback',
      deltaAvios: cashbackAvios - av,
      note: `Cashback wins: ${cashbackAvios.toLocaleString('en-GB')} Avios via Booster vs ${av.toLocaleString('en-GB')} Avios via eStore (+${(cashbackAvios - av).toLocaleString('en-GB')} Avios).`,
    };
  }
  return {
    cashbackAvios,
    directAvios: av,
    winner: 'avios',
    deltaAvios: cashbackAvios - av,
    note: `Avios eStore wins: ${av.toLocaleString('en-GB')} Avios direct vs ${cashbackAvios.toLocaleString('en-GB')} via cashback Booster.`,
  };
}
