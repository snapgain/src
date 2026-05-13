/**
 * SnapGain — strategy computation engine.
 *
 * Pure functions. Given a store + purchase amount + the offers we have on
 * file (cashback, points) + miles program metadata (for points → £
 * conversion), produces a ranked list of strategies the user can execute,
 * each with an estimated GBP return.
 *
 * Stacking strategies (cashback × gift card × card × bank-offer) come in a
 * later iteration — for now this is a flat per-route list which is the most
 * common case and mirrors the original mock data shape.
 */

import { getAffiliateLink } from '@/lib/affiliateLinks';

const POINT_LABELS_BY_PROGRAM = [
  { match: /avios/i, unit: 'Avios' },
  { match: /virgin/i, unit: 'Virgin Points' },
  { match: /flying ?blue/i, unit: 'Flying Blue miles' },
  { match: /skywards/i, unit: 'Skywards miles' },
  { match: /etihad/i, unit: 'Etihad Guest miles' },
  { match: /nectar/i, unit: 'Nectar pts' },
  { match: /amex|membership/i, unit: 'MR points' },
];

function pointUnitLabel(programName) {
  const hit = POINT_LABELS_BY_PROGRAM.find((row) => row.match.test(programName || ''));
  return hit ? hit.unit : 'points';
}

function safeNumber(value, fallback = 0) {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

/**
 * Compute ranked strategies for a store + amount.
 *
 * Generates flat per-route strategies AND multi-layer "stack" strategies
 * (gift_card × cashback, gift_card × points). Stacks are ranked alongside
 * single routes by total £ return so the best route — be it flat or
 * stacked — surfaces at the top.
 *
 * @param {object} args
 * @param {object} [args.store]            { id, slug, name, ... }
 * @param {number} args.amount             Purchase amount in £
 * @param {Array}  args.cashbackOffers     rows from public.cashback_offers
 * @param {Array}  args.pointOffers        rows from public.point_offers
 * @param {Array}  [args.giftCardOffers]   rows from public.gift_card_offers
 * @param {Array}  args.milesPrograms      rows from public.miles_programs (has conversion_rate)
 * @param {object} [args.userWallet]       { cashbackPlatformNames: Set<string>, milesProgramNames: Set<string> }
 * @param {boolean} [args.includeStacks=true]  When false, only flat per-route
 *                                              strategies are returned (gates the
 *                                              stacking feature behind premium).
 * @returns {Array<object>} Strategies sorted by gbpReturn desc.
 */
export function computeStrategies({
  store,
  amount,
  cashbackOffers = [],
  pointOffers = [],
  giftCardOffers = [],
  milesPrograms = [],
  userWallet = null,
  includeStacks = true,
}) {
  const out = [];
  const numAmount = safeNumber(amount, 0);

  // Synthesise a 10% NX Rewards offer ONLY for stores that NX actually
  // partners with (flagged via stores.in_nx_network). NX guarantees a
  // minimum 10% rebate on every retailer in its network — but it doesn't
  // cover every retailer in the world. Real DB rows take precedence over
  // the synthetic.
  const NX_PLATFORM_NAME = 'NX Rewards';
  const NX_FLOOR_PCT = 10;
  const storeIsNxPartner = Boolean(store?.in_nx_network);
  const hasNxOffer = (cashbackOffers || []).some(
    (o) => String(o.platform || '').toLowerCase().includes('nx')
  );
  const cashbackOffersWithNx =
    storeIsNxPartner && !hasNxOffer
      ? [
          ...cashbackOffers,
          {
            id: store ? `synthetic-nx-${store.id}` : 'synthetic-nx',
            store_id: store?.id,
            platform: NX_PLATFORM_NAME,
            rate: NX_FLOOR_PCT,
            affiliate_link: null,
            last_verified_at: null,
            synthetic: true,
          },
        ]
      : cashbackOffers;

  let cashbackToUse = cashbackOffersWithNx;
  let pointsToUse = pointOffers;
  // Gift card platforms aren't user-scoped — anyone can use JamDoughnut etc.

  if (userWallet) {
    const cb = userWallet.cashbackPlatformNames;
    const mp = userWallet.milesProgramNames;
    if (cb instanceof Set) {
      // Filter on the NX-augmented list so the synthetic 10% offer is
      // still visible when the user has NX in their wallet.
      cashbackToUse = cashbackOffersWithNx.filter((o) => cb.has(o.platform));
    }
    if (mp instanceof Set) {
      pointsToUse = pointOffers.filter((o) => mp.has(o.airline));
    }
  }

  // Platform-specific cashback floors. NX Rewards guarantees a minimum
  // 10% rebate on every retailer, regardless of the listed base rate —
  // so any NX offer must be lifted to at least 10% before ranking.
  const CASHBACK_FLOOR_PCT = {
    'nx rewards': 10,
    'nxrewards': 10,
    'nx': 10,
  };
  const cashbackFloor = (platform) => {
    if (!platform) return 0;
    return CASHBACK_FLOOR_PCT[String(platform).trim().toLowerCase()] || 0;
  };

  // Helper: build the cashback layer object
  const cashbackLayer = (o) => {
    const raw = safeNumber(o.rate, 0);
    const floor = cashbackFloor(o.platform);
    const ratePct = Math.max(raw, floor);
    return {
      kind: 'cashback',
      platform: o.platform || 'Cashback',
      ratePct,
      // Expose the floor so the UI can label "min 10% (NX Rewards)" if useful
      flooredAt: floor && raw < floor ? floor : null,
      gbpReturn: numAmount * (ratePct / 100),
      affiliateLink: o.affiliate_link || getAffiliateLink(o.platform),
      lastVerifiedAt: o.last_verified_at,
      offerId: o.id,
    };
  };

  // Helper: build the points layer object
  const pointsLayer = (o) => {
    const program = milesPrograms.find((p) => p.name === o.airline);
    const earnRate = safeNumber(o.earn_rate, 0);
    const points = numAmount * earnRate;
    const conversionRate = program ? safeNumber(program.conversion_rate, 0) : 0;
    const unit = pointUnitLabel(o.airline);
    return {
      kind: 'points',
      platform: o.airline || 'Points',
      earnRate,
      points,
      pointUnit: unit,
      conversionRate,
      gbpReturn: points * conversionRate,
      boosterAvailable: o.booster_available,
      lastVerifiedAt: o.last_verified_at,
      offerId: o.id,
    };
  };

  // Helper: build the gift_card layer
  const giftCardLayer = (g) => {
    const discountPct = safeNumber(g.discount_pct, 0);
    return {
      kind: 'gift_card',
      platform: g.platform || 'Gift card',
      discountPct,
      gbpReturn: numAmount * (discountPct / 100),
      affiliateLink: g.affiliate_link || getAffiliateLink(g.platform),
      lastVerifiedAt: g.last_verified_at,
      offerId: g.id,
    };
  };

  // ─── Flat: cashback only ─────────────────────────────────────────────
  cashbackToUse.forEach((o) => {
    const layer = cashbackLayer(o);
    out.push({
      id: `cashback-${o.id}`,
      type: 'cashback',
      title: layer.platform,
      subtitle: `${layer.ratePct}% cashback`,
      gbpReturn: layer.gbpReturn,
      gbpReturnDisplay: `£${layer.gbpReturn.toFixed(2)}`,
      providerName: layer.platform,
      affiliateLink: layer.affiliateLink,
      lastVerifiedAt: layer.lastVerifiedAt,
      layers: [layer],
      raw: o,
    });
  });

  // ─── Flat: points only ───────────────────────────────────────────────
  pointsToUse.forEach((o) => {
    const layer = pointsLayer(o);
    out.push({
      id: `points-${o.id}`,
      type: 'points',
      title: layer.platform,
      subtitle: `${layer.earnRate} ${layer.earnRate === 1 ? 'point' : 'points'} per £1`,
      gbpReturn: layer.gbpReturn,
      gbpReturnDisplay: `£${layer.gbpReturn.toFixed(2)} (${Math.round(layer.points).toLocaleString()} ${layer.pointUnit})`,
      providerName: layer.platform,
      lastVerifiedAt: layer.lastVerifiedAt,
      points: layer.points,
      pointUnit: layer.pointUnit,
      boosterAvailable: layer.boosterAvailable,
      layers: [layer],
      raw: o,
    });
  });

  // ─── Flat: gift card only ────────────────────────────────────────────
  giftCardOffers.forEach((g) => {
    const layer = giftCardLayer(g);
    out.push({
      id: `giftcard-${g.id}`,
      type: 'gift_card',
      title: layer.platform,
      subtitle: `${layer.discountPct}% off gift card`,
      gbpReturn: layer.gbpReturn,
      gbpReturnDisplay: `£${layer.gbpReturn.toFixed(2)}`,
      providerName: layer.platform,
      affiliateLink: layer.affiliateLink,
      lastVerifiedAt: layer.lastVerifiedAt,
      layers: [layer],
      raw: g,
    });
  });

  // ─── Stacks (premium-only) ───────────────────────────────────────────
  if (!includeStacks) {
    out.sort((a, b) => b.gbpReturn - a.gbpReturn);
    return out;
  }

  // ─── Stack: gift_card × cashback ─────────────────────────────────────
  giftCardOffers.forEach((g) => {
    const gc = giftCardLayer(g);
    cashbackToUse.forEach((c) => {
      const cb = cashbackLayer(c);
      const total = gc.gbpReturn + cb.gbpReturn;
      out.push({
        id: `stack-gc${g.id}-cb${c.id}`,
        type: 'stack',
        title: `${gc.platform} + ${cb.platform}`,
        subtitle: `${gc.discountPct}% off + ${cb.ratePct}% cashback`,
        gbpReturn: total,
        gbpReturnDisplay: `£${total.toFixed(2)}`,
        providerName: `${gc.platform} + ${cb.platform}`,
        layers: [gc, cb],
        raw: { giftCard: g, cashback: c },
      });
    });
  });

  // ─── Stack: gift_card × points ───────────────────────────────────────
  giftCardOffers.forEach((g) => {
    const gc = giftCardLayer(g);
    pointsToUse.forEach((p) => {
      const pt = pointsLayer(p);
      const total = gc.gbpReturn + pt.gbpReturn;
      out.push({
        id: `stack-gc${g.id}-pt${p.id}`,
        type: 'stack',
        title: `${gc.platform} + ${pt.platform}`,
        subtitle: `${gc.discountPct}% off + ${pt.earnRate} pts/£`,
        gbpReturn: total,
        gbpReturnDisplay: `£${total.toFixed(2)} (${Math.round(pt.points).toLocaleString()} ${pt.pointUnit})`,
        providerName: `${gc.platform} + ${pt.platform}`,
        layers: [gc, pt],
        raw: { giftCard: g, points: p },
      });
    });
  });

  out.sort((a, b) => b.gbpReturn - a.gbpReturn);
  return out;
}

/**
 * Build the step-by-step instructions for executing a strategy. Pure UI helper.
 *
 * Handles:
 *   - cashback     : portal → retailer → buy → wait for tracking
 *   - points       : partner portal → retailer → buy → wait for credit
 *   - gift_card    : buy gift card at discount → use at retailer
 *   - stack        : compose the layers in execution order so the user
 *                    captures every saving (buy gift card, then activate
 *                    cashback / open points portal, then click through and
 *                    pay with the gift card)
 */
export function buildStrategySteps(strategy, store) {
  if (!strategy) return [];

  const storeName = store?.name || 'the store';

  if (strategy.type === 'cashback') {
    return [
      { title: `Open ${strategy.providerName}`,
        detail: `Sign in to ${strategy.providerName} so cashback is tracked to your account.` },
      { title: `Search for ${storeName}`,
        detail: `Find ${storeName} on the cashback page and click through to the retailer.` },
      { title: 'Complete the purchase',
        detail: 'Add items to your cart and check out without leaving the tracked session. Avoid coupon-injecting browser extensions.' },
      { title: 'Wait for cashback to track',
        detail: 'Cashback usually appears within 7 days as "pending" and confirms after the retailer’s return window.',
        warning: 'Some retailers exclude gift card purchases from cashback eligibility.' },
    ];
  }

  if (strategy.type === 'points') {
    return [
      { title: `Open the ${strategy.providerName} partner portal`,
        detail: `Sign in to your ${strategy.providerName} account so the points are credited correctly.` },
      { title: `Click through to ${storeName}`,
        detail: `Find ${storeName} on the partner page and click through.` },
      { title: 'Complete the purchase',
        detail: 'Add items to your cart and check out. Keep the order confirmation.' },
      { title: 'Watch for the points credit',
        detail: 'Points typically post within 4–8 weeks. Keep your order confirmation in case you need to chase a missing claim.' },
    ];
  }

  if (strategy.type === 'gift_card') {
    const layer = strategy.layers?.[0];
    return [
      { title: `Open ${layer?.platform || 'the gift card app'}`,
        detail: `Buy a ${storeName} gift card at ${layer?.discountPct || 0}% off the face value.` },
      { title: `Pay with the gift card at ${storeName}`,
        detail: 'The discount is locked in upfront — no waiting for tracking.' },
    ];
  }

  if (strategy.type === 'stack') {
    const layers = strategy.layers || [];
    const gc = layers.find((l) => l.kind === 'gift_card');
    const cb = layers.find((l) => l.kind === 'cashback');
    const pt = layers.find((l) => l.kind === 'points');
    const steps = [];

    if (gc) {
      steps.push({
        title: `Buy a ${storeName} gift card via ${gc.platform}`,
        detail: `${gc.discountPct}% off — saves £${gc.gbpReturn.toFixed(2)} on this purchase.`,
      });
    }
    if (cb) {
      steps.push({
        title: `Open ${cb.platform} and click through to ${storeName}`,
        detail: 'Sign in first so cashback tracks to your account.',
      });
    } else if (pt) {
      steps.push({
        title: `Open the ${pt.platform} partner portal and click through to ${storeName}`,
        detail: 'Sign in to your program account so the points credit correctly.',
      });
    }
    steps.push({
      title: 'Pay using the gift card',
      detail: 'Add items, check out, redeem the gift card at the retailer.',
    });
    if (cb) {
      steps.push({
        title: 'Wait for cashback to track',
        detail: `${cb.ratePct}% cashback (£${cb.gbpReturn.toFixed(2)}) usually shows as "pending" within 7 days.`,
        warning: 'Some retailers exclude gift-card-funded purchases — check the conditions on the cashback page.',
      });
    }
    if (pt) {
      steps.push({
        title: 'Watch for the points credit',
        detail: `${Math.round(pt.points).toLocaleString()} ${pt.pointUnit} typically post within 4–8 weeks.`,
      });
    }
    return steps;
  }

  return [];
}
