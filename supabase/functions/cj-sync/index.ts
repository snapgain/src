// ╔══════════════════════════════════════════════════════════════════╗
// ║  cj-sync — Pull advertisers + commissions from CJ Affiliate      ║
// ║                                                                  ║
// ║  Calls CJ's Advertiser Lookup API for every joined advertiser,   ║
// ║  upserts them into public.stores (catalog) and public.cashback_  ║
// ║  offers (rates) with the SnapGain deep-link.                     ║
// ║                                                                  ║
// ║  Env vars (set in Supabase Dashboard → Functions → cj-sync):     ║
// ║    CJ_PAT             Personal Access Token (Bearer)             ║
// ║    CJ_PUBLISHER_CID   Your CJ publisher CID (numeric)            ║
// ║    SUPABASE_URL       (auto-provided)                            ║
// ║    SUPABASE_SERVICE_ROLE_KEY  (auto-provided)                    ║
// ║                                                                  ║
// ║  Invoke:                                                         ║
// ║    curl -X POST https://<project>.functions.supabase.co/cj-sync  ║
// ║      -H "Authorization: Bearer $SERVICE_ROLE"                    ║
// ║                                                                  ║
// ║  Or schedule via pg_cron / Supabase Schedules → daily            ║
// ╚══════════════════════════════════════════════════════════════════╝

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type',
};

const CJ_BASE = 'https://advertiser-lookup.api.cj.com/v2/advertiser-lookup';

interface CJAdvertiser {
  'advertiser-id': string;
  'account-status': string;
  'seven-day-epc': string;
  'three-month-epc': string;
  'language': string;
  'advertiser-name': string;
  'program-url': string;
  'relationship-status': string;
  'mobile-tracking-certified': string;
  'cookieless-tracking-enabled': string;
  'network-rank': string;
  'primary-category'?: { parent?: string; child?: string };
  'performance-incentives': string;
  'actions'?: {
    action?: Array<{
      name?: string;
      type?: string;
      'commission'?: { default?: string };
    }>;
  };
}

/**
 * Fetch one page of advertisers from CJ.
 * CJ paginates with `page-number` (1-indexed) and returns `records-returned`.
 * Page size is 100.
 */
async function fetchCJPage(pat: string, cid: string, page: number) {
  const url = `${CJ_BASE}?advertiser-ids=joined&records-per-page=100&page-number=${page}`;
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${pat}`,
      Accept: 'application/xml',
      'requestor-cid': cid,
    },
  });
  if (!res.ok) {
    throw new Error(
      `CJ API page ${page} returned ${res.status}: ${await res.text()}`
    );
  }
  return await res.text();
}

/**
 * Very small XML parser specialised for CJ's advertiser-lookup format.
 * Each <advertiser> block becomes a flat object.
 * Avoids pulling a full XML library into the Edge Function bundle.
 */
function parseAdvertisers(xml: string): CJAdvertiser[] {
  const out: CJAdvertiser[] = [];
  const blockRe = /<advertiser>([\s\S]*?)<\/advertiser>/g;
  let m: RegExpExecArray | null;
  while ((m = blockRe.exec(xml)) !== null) {
    const block = m[1];
    const get = (tag: string) => {
      const re = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`);
      const x = block.match(re);
      return x ? x[1].trim() : '';
    };
    // Try to find an "action" with a commission percentage for the default rate.
    const commission = (() => {
      const actions = block.match(
        /<action>[\s\S]*?<commission>[\s\S]*?<default>([^<]+)<\/default>[\s\S]*?<\/commission>[\s\S]*?<\/action>/
      );
      return actions ? actions[1].trim() : '';
    })();

    out.push({
      'advertiser-id': get('advertiser-id'),
      'account-status': get('account-status'),
      'seven-day-epc': get('seven-day-epc'),
      'three-month-epc': get('three-month-epc'),
      'language': get('language'),
      'advertiser-name': get('advertiser-name'),
      'program-url': get('program-url'),
      'relationship-status': get('relationship-status'),
      'mobile-tracking-certified': get('mobile-tracking-certified'),
      'cookieless-tracking-enabled': get('cookieless-tracking-enabled'),
      'network-rank': get('network-rank'),
      'primary-category': {
        parent: get('parent'),
        child: get('child'),
      },
      'performance-incentives': get('performance-incentives'),
      actions: {
        action: commission
          ? [{ commission: { default: commission } }]
          : undefined,
      },
    });
  }
  return out;
}

/**
 * Extract a numeric commission rate from CJ's free-text "default" field,
 * which can be "5%", "5.00%", "£5.00", "Up to 5%", etc.
 * Returns the first percentage found or null.
 */
function parseRatePct(text: string | undefined): number | null {
  if (!text) return null;
  const m = text.match(/([0-9]+(?:\.[0-9]+)?)\s*%/);
  return m ? parseFloat(m[1]) : null;
}

/** Slugify an advertiser name (used as `stores.slug`). */
function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

/** Best-guess at the retailer domain from the program-url. */
function domainFrom(url: string): string | null {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return null;
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  const PAT = Deno.env.get('CJ_PAT');
  const CID = Deno.env.get('CJ_PUBLISHER_CID');
  if (!PAT || !CID) {
    return new Response(
      JSON.stringify({
        error: 'Missing env vars CJ_PAT and/or CJ_PUBLISHER_CID',
      }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  );

  const summary = {
    pagesFetched: 0,
    advertisersSeen: 0,
    storesUpserted: 0,
    offersUpserted: 0,
    errors: [] as string[],
  };

  try {
    // Walk CJ pages until we get fewer than 100 records.
    let page = 1;
    while (true) {
      const xml = await fetchCJPage(PAT, CID, page);
      summary.pagesFetched += 1;
      const advertisers = parseAdvertisers(xml);
      if (advertisers.length === 0) break;
      summary.advertisersSeen += advertisers.length;

      // Build the stores upsert payload
      const storeRows = advertisers
        .filter((a) => a['advertiser-name'])
        .map((a) => ({
          slug: slugify(a['advertiser-name']),
          name: a['advertiser-name'],
          domain: domainFrom(a['program-url']),
          category: a['primary-category']?.child
            ? [a['primary-category'].child]
            : null,
          is_active: a['relationship-status'] === 'joined',
        }));

      if (storeRows.length > 0) {
        const { error } = await supabase
          .from('stores')
          .upsert(storeRows, { onConflict: 'slug', ignoreDuplicates: false });
        if (error) summary.errors.push(`stores upsert: ${error.message}`);
        else summary.storesUpserted += storeRows.length;
      }

      // Now build cashback_offers rows. We need each store's id, so
      // re-select by slug. (One round-trip per page is fine for 100 rows.)
      const slugs = storeRows.map((s) => s.slug);
      const { data: storeIds } = await supabase
        .from('stores')
        .select('id, slug')
        .in('slug', slugs);
      const slugToId = new Map((storeIds || []).map((r) => [r.slug, r.id]));

      const offerRows = advertisers
        .map((a) => {
          const ratePct = parseRatePct(a.actions?.action?.[0]?.commission?.default);
          if (ratePct == null) return null;
          const storeId = slugToId.get(slugify(a['advertiser-name']));
          if (!storeId) return null;
          return {
            store_id: storeId,
            platform: 'CJ Affiliate',
            rate: ratePct,
            affiliate_link: a['program-url'] || null,
            last_verified_at: new Date().toISOString(),
            is_active: true,
          };
        })
        .filter(Boolean);

      if (offerRows.length > 0) {
        const { error } = await supabase
          .from('cashback_offers')
          .insert(offerRows);
        if (error) summary.errors.push(`offers insert: ${error.message}`);
        else summary.offersUpserted += offerRows.length;
      }

      if (advertisers.length < 100) break;
      page += 1;
      // Be polite — small pause between pages
      await new Promise((r) => setTimeout(r, 250));
    }

    return new Response(JSON.stringify({ ok: true, summary }, null, 2), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ ok: false, error: String(err), summary }, null, 2),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
