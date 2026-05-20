// 2026-05-20: UTM attribution for the "Voo de Volta" campaign and
// any future campaigns. Lifecycle:
//
//   1. Visitor lands on snapgain.uk/* with ?utm_source=tiktok&...
//   2. We snapshot the UTMs into sessionStorage + localStorage
//      (sessionStorage drops on tab close, localStorage persists for
//      90 days so a slow funnel doesn't lose attribution).
//   3. When the user finally signs up, the SignUp form reads the
//      latest UTMs and attaches them to:
//        - Supabase auth user_metadata (auth.users.raw_user_meta_data)
//        - the row we insert into `signup_attributions` (for reporting)
//   4. analytics dashboards aggregate signup_attributions to know
//      which content piece drove how many trials.
//
// Why both localStorage and sessionStorage?
//   - sessionStorage = "this visit", lets us know if the trial they
//     started THIS session came from a known campaign
//   - localStorage = "last touch within 90d", handles the common case
//     of "saw TikTok Tuesday → signed up Saturday"
//
// We use localStorage for the FINAL attribution write, but read
// session first if it has the same campaign (more recent intent).

const STORAGE_KEY = 'snapgain.utm';
const TTL_MS = 90 * 24 * 60 * 60 * 1000; // 90 days

const UTM_FIELDS = [
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_content',
  'utm_term',
  'ref',          // referral code shorthand
  'gclid',        // Google Ads click id (future paid)
  'fbclid',       // Meta click id (future paid)
];

/**
 * Reads UTM params from the current URL. Returns null if none present.
 */
export function readUtmsFromUrl(url = window.location.href) {
  try {
    const u = new URL(url);
    const out = {};
    let foundAny = false;
    for (const f of UTM_FIELDS) {
      const v = u.searchParams.get(f);
      if (v) {
        out[f] = v;
        foundAny = true;
      }
    }
    return foundAny ? out : null;
  } catch {
    return null;
  }
}

/**
 * Snapshot the current URL's UTMs into storage. Call on every page
 * load (cheap — only writes when params present). Idempotent.
 */
export function captureUtms() {
  const fromUrl = readUtmsFromUrl();
  if (!fromUrl) return;
  const payload = {
    ...fromUrl,
    captured_at: new Date().toISOString(),
    landing_page: window.location.pathname,
    landing_search: window.location.search,
    referrer: document.referrer || null,
  };
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch {
    // Storage blocked (Safari private mode etc.) — silent fail. Worth
    // tracking later via PostHog/etc but not blocking the user.
  }
}

/**
 * Returns the most recent UTM snapshot if it's still within TTL.
 * Used by SignUp form right before submit so we attach the
 * attribution to the new user record.
 */
export function getStoredUtms() {
  try {
    const raw =
      sessionStorage.getItem(STORAGE_KEY) || localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    const captured = new Date(parsed.captured_at).getTime();
    if (Number.isNaN(captured)) return null;
    if (Date.now() - captured > TTL_MS) return null;
    return parsed;
  } catch {
    return null;
  }
}

/**
 * Clear stored UTMs (call after we've written them to Supabase, so
 * subsequent funnels can capture new attribution without conflating).
 */
export function clearStoredUtms() {
  try {
    sessionStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}

/**
 * Convenience: build a snapgain.uk URL with UTM params already
 * attached. Used by internal links and (future) email templates.
 */
export function buildUtmUrl(path, params = {}) {
  const base = path.startsWith('http')
    ? path
    : `${window.location.origin}${path}`;
  const u = new URL(base);
  for (const [k, v] of Object.entries(params)) {
    if (v != null && v !== '') u.searchParams.set(k, String(v));
  }
  return u.toString();
}
