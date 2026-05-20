/**
 * Affiliate links — your referral URLs per platform.
 *
 * HOW TO EDIT:
 *   Just open this file and paste your link in the right field.
 *   Empty string ('') means "no affiliate link, use the platform's
 *   public site instead". The app will keep working either way.
 *
 * MATCHING:
 *   The lookup is case-insensitive and tries (in order):
 *     1. The platform `code` (e.g. 'TOPCASHBACK')
 *     2. The platform `slug` (e.g. 'topcashback')
 *     3. The platform `name` lowercased (e.g. 'topcashback')
 *
 * If a row in Supabase has its own `affiliate_link` set, that wins
 * over this file. So you can override per-store/per-offer in the DB
 * if you ever want to.
 *
 * Last refresh: 2026-05-17 (Bárbara's full referral set).
 */

// ─── Cashback platforms ────────────────────────────────────────────
export const CASHBACK_AFFILIATE_LINKS = {
  topcashback: 'https://www.topcashback.co.uk/ref/denys%20melo',
  quidco: 'https://quidco.com/raf/14425585/',
  cheddar: 'https://get.cheddar.me/app/CPLTBMB',
  airtime: 'https://airtimerewards.app.link/B3GxIXjhbYb', // 2026-05-20: canonical key (matches platform='airtime' in DB seed)
  airtime_rewards: 'https://airtimerewards.app.link/B3GxIXjhbYb',
  airtimerewards: 'https://airtimerewards.app.link/B3GxIXjhbYb',
  everup: 'https://everup.onelink.me/9lgD/r2phpwig',
  shopmium: 'https://www.shopmium.com/uk/referral/u53bu8',
  rakuten: 'https://www.rakuten.co.uk/r/denysf20',
  snoop: 'https://click.snoop.app/M2Tu/zlmka778',
  greenjinn: '', // ⚠️ paste your GreenJinn referral link here (or leave blank)
};

// ─── Gift card / instant cashback platforms ────────────────────────
export const GIFT_CARD_AFFILIATE_LINKS = {
  jamdoughnut: 'https://jamdoughnut.onelink.me/vv6d/referrals?&deep_link_sub10=UFDN',
  // NX Rewards — operated by Webloyalty Intl, NOT National Express
  // (that was an old mistake — fixed in /learn/platforms 2026-05-19).
  // Bárbara: drop your real NX referral code in here when you have it.
  nx_rewards: 'https://www.nxrewards.com/',
  nxrewards: 'https://www.nxrewards.com/',
  'NX Rewards': 'https://www.nxrewards.com/', // canonical platform label
  // Secondary Everup link kept here in case we want to A/B split
  // gift-card flow vs cashback flow:
  everup_gift: 'https://everup.onelink.me/9lgD/t8t7luj6',
};

// ─── Loyalty / miles programs ──────────────────────────────────────
export const MILES_AFFILIATE_LINKS = {
  avios: 'https://avios.mention-me.com/m/ol/yv2wt-denys-ferreira-goncalves-de-melo',
  virgin_points: 'https://virginred.mention-me.com/m/ol/tj5jm-denys-ferreira-goncalves-de-melo',
  virgin_red: 'https://virginred.mention-me.com/m/ol/tj5jm-denys-ferreira-goncalves-de-melo',
  flying_blue: 'https://afklm.tcux.net/Qjo3bM',
  qatar_privilege_club: 'https://qatarpts.pxf.io/DyPzOj',
  qatar: 'https://qatarpts.pxf.io/DyPzOj',
  nectar: '', // Sainsbury's Nectar — no public referral
  clubcard: '', // Tesco Clubcard — no public referral
};

// ─── Cards / banks / fintech ───────────────────────────────────────
export const CARD_AFFILIATE_LINKS = {
  curve: 'https://www.curve.com/join#NVOGMMLD',
  revolut: 'https://revolut.com/referral/?referral-code=denysfxts!NOV1-25-AR-H2-MDL-CTRL&geo-redirect',
  monzo: 'https://join.monzo.com/c/s2rr0z7',
  trading_212: 'https://www.trading212.com/invite/19BZz1hIEi',
  trading212: 'https://www.trading212.com/invite/19BZz1hIEi',
  amex: '', // Amex referrals are per-card and rotate; left empty.
  starling: '',
  chase: '',
  chase_uk: '',
};

// ─── Travel (booking sites) ────────────────────────────────────────
export const TRAVEL_AFFILIATE_LINKS = {
  booking: '',
  expedia: '',
  trivago: '',
  skyscanner: '',
};

// ─── Services / extras (used by strategy library or future features) ─
// These don't match a "platform" row but are kept here so they live
// in one place. Reach them via getServiceAffiliateLink('treatwell').
export const SERVICE_AFFILIATE_LINKS = {
  // Rent rewards (referenced by the Ribbon strategy)
  ribbon_rewards: 'https://www.ribbonrewards.io/?ref=DENYD11D',
  ribbon: 'https://www.ribbonrewards.io/?ref=DENYD11D',
  // Beauty + grooming strategy
  treatwell: 'https://trea.tw/xJuh9D',
  // Creator / SaaS partners
  invideo: 'https://invideo.sjv.io/e17dzX',
  invideo_alt: 'https://invideo.sjv.io/c/6471292/987845/12258',
  capcut: 'https://capcutaffiliateprogram.pxf.io/c/6471292/2107580/22474',
  shopify: 'https://shopify.pxf.io/c/6471292/2974326/13624',
  // Crypto
  gemini: 'https://gemini.sjv.io/c/6471292/3062995/11829',
};

// ─── Combined lookup table (built once, used by the helper) ────────
const ALL_LINKS = {
  ...CASHBACK_AFFILIATE_LINKS,
  ...GIFT_CARD_AFFILIATE_LINKS,
  ...MILES_AFFILIATE_LINKS,
  ...CARD_AFFILIATE_LINKS,
  ...TRAVEL_AFFILIATE_LINKS,
};

/**
 * Normalise a platform identifier so 'TopCashback', 'top-cashback',
 * 'Top Cashback' and 'topcashback' all resolve to the same key.
 */
function norm(s) {
  return String(s || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');
}

/**
 * Resolve the best affiliate URL for a platform.
 *
 * Pass either a platform object `{ code, slug, name }` or a string.
 * Returns the affiliate URL if known, otherwise an empty string.
 *
 * @example
 *   getAffiliateLink('TopCashback')
 *   getAffiliateLink({ code: 'TOPCASHBACK', slug: 'topcashback' })
 */
export function getAffiliateLink(platform) {
  if (!platform) return '';
  const candidates =
    typeof platform === 'string'
      ? [platform]
      : [platform.code, platform.slug, platform.name].filter(Boolean);
  for (const c of candidates) {
    const key = norm(c);
    if (ALL_LINKS[key]) return ALL_LINKS[key];
  }
  return '';
}

/**
 * Look up a non-platform service (Treatwell, Ribbon, InVideo, etc.).
 * These don't live in the `platform` table so the regular matcher
 * won't find them — call this helper directly from a strategy step
 * or a tool-recommendation card.
 */
export function getServiceAffiliateLink(name) {
  const key = norm(name);
  return SERVICE_AFFILIATE_LINKS[key] || '';
}

/**
 * Resolve the URL we should send the user to when they click "Open"
 * on an offer/deal. Priority:
 *   1. Explicit URL on the row (DB beats config)
 *   2. Affiliate link from this file, looked up by platform
 *   3. Fallback URL (e.g. internal `/store/:slug`)
 */
export function resolveOpenUrl({ rowUrl, platform, fallback } = {}) {
  if (rowUrl) return rowUrl;
  const aff = getAffiliateLink(platform);
  if (aff) return aff;
  return fallback || '';
}
