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
 */

// ─── Cashback platforms ────────────────────────────────────────────
export const CASHBACK_AFFILIATE_LINKS = {
  topcashback: 'https://www.topcashback.co.uk/ref/denys%20melo',
  quidco: 'https://quidco.com/raf/14425585/',
  cheddar: 'https://get.cheddar.me/app/CPLTBMB',
  airtime_rewards: 'https://airtimerewards.app.link/XlgKV6ABNWb',
  airtimerewards: 'https://airtimerewards.app.link/XlgKV6ABNWb',
  everup: 'https://everup.onelink.me/9lgD/vg866wd3',
  shopmium: 'https://www.shopmium.com/uk/referral/u53bu8',
  rakuten: '', // ⚠️ paste your clean Rakuten UK referral link here
  greenjinn: '', // ⚠️ paste your GreenJinn referral link here (or leave blank)
};

// ─── Gift card / instant cashback platforms ────────────────────────
export const GIFT_CARD_AFFILIATE_LINKS = {
  jamdoughnut: 'https://app.jamdoughnut.com/UFDN',
  nx_rewards: '', // ⚠️ paste your real NX Rewards referral link here
  nxrewards: '', // ⚠️ same — keep both spellings in sync
  hyperjar: '', // ⚠️ paste your HyperJar referral link if you have one
};

// ─── Loyalty / miles programs (usually no public referral link) ─────
export const MILES_AFFILIATE_LINKS = {
  avios: '', // British Airways Executive Club join link
  virgin_points: '', // Virgin Atlantic Flying Club join link
  flying_blue: '', // Air France/KLM
  nectar: '', // Sainsbury's Nectar
  clubcard: '', // Tesco Clubcard
};

// ─── Cards / banks / fintech (referral programs) ───────────────────
export const CARD_AFFILIATE_LINKS = {
  amex: '',
  curve: '',
  revolut: '',
  monzo: '',
  starling: '',
  chase: '',
};

// ─── Travel (booking sites) ────────────────────────────────────────
export const TRAVEL_AFFILIATE_LINKS = {
  booking: '',
  expedia: '',
  trivago: '',
  skyscanner: '',
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
