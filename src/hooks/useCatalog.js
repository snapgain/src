import { useEffect, useState } from 'react';
import { supabase } from '@/lib/customSupabaseClient';

/**
 * useStores — list of UK retailers from public.stores.
 * @param {{ featuredOnly?: boolean }} [opts]
 */
export function useStores({ featuredOnly = false } = {}) {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    // The stores table has ~10k rows. Postgrest defaults to 1000 max per
    // request, which silently truncates results alphabetically (so
    // Tesco, Boots etc. were missing from search results). Explicit
    // .range() pulls the full catalogue so client-side filtering works
    // for any store name. TODO: replace with server-side ilike search
    // for performance on lower-end mobile devices.
    let q = supabase
      .from('stores')
      .select('id, slug, name, category, is_featured, logo_url, domain, in_nx_network')
      .eq('is_active', true)
      .order('name')
      .range(0, 19999);
    if (featuredOnly) q = q.eq('is_featured', true);
    q.then(({ data, error }) => {
      if (!alive) return;
      if (error) setError(error);
      else setStores(data || []);
      setLoading(false);
    }, (err) => {
      if (!alive) return;
      console.warn('[useStores] unexpected error:', err);
      setError(err);
      setLoading(false);
    });
    return () => {
      alive = false;
    };
  }, [featuredOnly]);

  return { stores, loading, error };
}

/**
 * useStoreBySlug — single store row matched by slug.
 */
export function useStoreBySlug(slug) {
  const [store, setStore] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!slug) {
      setStore(null);
      setLoading(false);
      return;
    }
    let alive = true;
    setLoading(true);
    supabase
      .from('stores')
      .select('id, slug, name, category, is_featured, logo_url, domain, in_nx_network')
      .eq('slug', slug)
      .eq('is_active', true)
      .maybeSingle()
      .then(({ data, error }) => {
        if (!alive) return;
        if (error) setError(error);
        else setStore(data);
        setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, [slug]);

  return { store, loading, error };
}

/**
 * useStoreOffers — cashback + point + gift card offers for a store,
 * with Realtime updates on all three tables.
 */
export function useStoreOffers(storeId) {
  const [cashbackOffers, setCashbackOffers] = useState([]);
  const [pointOffers, setPointOffers] = useState([]);
  const [giftCardOffers, setGiftCardOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!storeId) {
      setCashbackOffers([]);
      setPointOffers([]);
      setGiftCardOffers([]);
      setLoading(false);
      return;
    }
    let alive = true;
    setLoading(true);

    const fetchAll = () =>
      Promise.all([
        supabase
          .from('cashback_offers')
          .select('id, store_id, platform, rate, affiliate_link, conditions, last_verified_at, is_active')
          .eq('store_id', storeId)
          .eq('is_active', true)
          .order('rate', { ascending: false }),
        supabase
          .from('point_offers')
          .select('id, store_id, airline, earn_rate, booster_available, conditions, last_verified_at, is_active')
          .eq('store_id', storeId)
          .eq('is_active', true)
          .order('earn_rate', { ascending: false }),
        supabase
          .from('gift_card_offers')
          .select('id, store_id, platform, discount_pct, affiliate_link, conditions, last_verified_at, is_active')
          .eq('store_id', storeId)
          .eq('is_active', true)
          .order('discount_pct', { ascending: false }),
      ]);

    const apply = ([cbRes, ptRes, gcRes]) => {
      if (!alive) return;
      if (cbRes.error) setError(cbRes.error);
      else setCashbackOffers(cbRes.data || []);
      if (ptRes.error) setError(ptRes.error);
      else setPointOffers(ptRes.data || []);
      if (gcRes.error) setError(gcRes.error);
      else setGiftCardOffers(gcRes.data || []);
      setLoading(false);
    };

    fetchAll().then(apply);

    // Realtime: refetch on any change to this store's rows on any of the three offer tables
    const refresh = () => fetchAll().then(apply);
    const channel = supabase
      .channel(`store_offers:${storeId}:${Math.random().toString(36).slice(2)}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'cashback_offers',  filter: `store_id=eq.${storeId}` }, refresh)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'point_offers',     filter: `store_id=eq.${storeId}` }, refresh)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'gift_card_offers', filter: `store_id=eq.${storeId}` }, refresh)
      .subscribe();

    return () => {
      alive = false;
      supabase.removeChannel(channel);
    };
  }, [storeId]);

  return { cashbackOffers, pointOffers, giftCardOffers, loading, error };
}

/**
 * useMilesPrograms — all active airline / loyalty programs (with conversion_rate).
 */
export function useMilesPrograms() {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    supabase
      .from('miles_programs')
      .select('id, slug, name, conversion_rate, booster_url, is_active')
      .eq('is_active', true)
      .order('name')
      .then(({ data, error }) => {
        if (!alive) return;
        if (error) console.warn('[useMilesPrograms] error:', error.message);
        setPrograms(data || []);
        setLoading(false);
      }, (err) => {
        if (!alive) return;
        console.warn('[useMilesPrograms] unexpected error:', err);
        setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, []);

  return { programs, loading };
}

/**
 * useHotDeals — admin-curated featured deals from public.hot_deals,
 * filtered server-side to currently-active items in their valid window
 * via the public-read RLS policy. Live updates via Realtime.
 */
export function useHotDeals({ limit = 8 } = {}) {
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    const fetchAll = () =>
      supabase
        .from('hot_deals')
        .select(
          'id, title, description, platform, badge, rate_display, cta_url, rank, valid_from, valid_to, store:stores(id, slug, name, domain, logo_url)'
        )
        .order('rank', { ascending: true })
        .limit(limit);

    fetchAll().then(({ data }) => {
      if (!alive) return;
      setDeals(data || []);
      setLoading(false);
    });

    // Realtime: refetch on any change to hot_deals
    const channel = supabase
      .channel(`hot_deals:${Math.random().toString(36).slice(2)}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'hot_deals' }, () => {
        fetchAll().then(({ data }) => {
          if (!alive) return;
          setDeals(data || []);
        });
      })
      .subscribe();

    return () => {
      alive = false;
      supabase.removeChannel(channel);
    };
  }, [limit]);

  return { deals, loading };
}

/**
 * useAdminHotDeals — full CRUD on the hot_deals table for admins.
 * Admins see ALL rows (including scheduled / inactive) thanks to the
 * `hot_deals_admin_read` RLS policy plus the public-read policy.
 */
export function useAdminHotDeals() {
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    const { data } = await supabase
      .from('hot_deals')
      .select(
        'id, title, description, store_id, platform, badge, rate_display, cta_url, rank, valid_from, valid_to, is_active, created_at, updated_at, store:stores(id, slug, name)'
      )
      .order('rank', { ascending: true });
    setDeals(data || []);
    setLoading(false);
  };

  useEffect(() => {
    refresh();
  }, []);

  const create = async (payload) => {
    const { data, error } = await supabase
      .from('hot_deals')
      .insert(payload)
      .select(
        'id, title, description, store_id, platform, badge, rate_display, cta_url, rank, valid_from, valid_to, is_active, created_at, updated_at, store:stores(id, slug, name)'
      )
      .single();
    if (error) throw error;
    setDeals((prev) => [...prev, data].sort((a, b) => a.rank - b.rank));
    return data;
  };

  const update = async (id, patch) => {
    const { data, error } = await supabase
      .from('hot_deals')
      .update(patch)
      .eq('id', id)
      .select(
        'id, title, description, store_id, platform, badge, rate_display, cta_url, rank, valid_from, valid_to, is_active, created_at, updated_at, store:stores(id, slug, name)'
      )
      .single();
    if (error) throw error;
    setDeals((prev) => prev.map((d) => (d.id === id ? data : d)).sort((a, b) => a.rank - b.rank));
    return data;
  };

  const remove = async (id) => {
    await supabase.from('hot_deals').delete().eq('id', id);
    setDeals((prev) => prev.filter((d) => d.id !== id));
  };

  return { deals, loading, refresh, create, update, remove };
}

/**
 * usePlatforms — all active reward providers, optionally filtered by type.
 * @param {{ type?: 'cashback'|'gift_card'|'card'|'bank_offer' }} [opts]
 */
export function usePlatforms({ type } = {}) {
  const [platforms, setPlatforms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    let q = supabase
      .from('platform')
      .select('id, code, slug, name, type, base_rate_display, notes, is_active')
      .eq('is_active', true)
      .order('name');
    if (type) q = q.eq('type', type);
    q.then(({ data, error }) => {
      if (!alive) return;
      if (error) console.warn('[usePlatforms] error:', error.message);
      setPlatforms(data || []);
      setLoading(false);
    }, (err) => {
      if (!alive) return;
      console.warn('[usePlatforms] unexpected error:', err);
      setLoading(false);
    });
    return () => {
      alive = false;
    };
  }, [type]);

  return { platforms, loading };
}
