import React, { useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Scale,
  Search,
  Trophy,
  Wallet,
  Check,
  Heart,
  Store as StoreIcon,
  CreditCard,
  Plus,
  Lock,
  Sparkles,
  Star,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  useStores,
  useStoreBySlug,
  useStoreOffers,
  useMilesPrograms,
} from '@/hooks/useCatalog';
import { useUserWallet, useUserFavourites } from '@/hooks/useUserState';
import { useSubscription } from '@/hooks/useSubscription';
import { computeStrategies } from '@/lib/strategies';
import { StoreLogo } from '@/components/StoreLogo';
import { resolveOpenUrl } from '@/lib/affiliateLinks';
import { cn } from '@/lib/utils';

const TABS = [
  { id: 'stores', label: 'Compare Stores', Icon: StoreIcon },
  { id: 'cards', label: 'Compare Cards', Icon: CreditCard },
];

function ComparePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // ─── Tabs ──────────────────────────────────────────────────────
  const [tab, setTab] = useState('stores');

  // ─── Catalog & user state ──────────────────────────────────────
  const { stores, loading: storesLoading } = useStores();
  const { favourites } = useUserFavourites();
  const favIds = useMemo(
    () => new Set(favourites.map((f) => f.store_id)),
    [favourites]
  );

  // ─── Store browser ─────────────────────────────────────────────
  const [query, setQuery] = useState('');
  const initialSlug = searchParams.get('store') || '';
  const initialAmount = Number(searchParams.get('amount')) || 100;
  const [selectedSlug, setSelectedSlug] = useState(initialSlug);
  const [amount, setAmount] = useState(String(initialAmount));
  const [walletOnly, setWalletOnly] = useState(false);

  useEffect(() => {
    setSelectedSlug(searchParams.get('store') || '');
    const a = Number(searchParams.get('amount'));
    if (a) setAmount(String(a));
  }, [searchParams]);

  // When there's no search, only show featured stores (12 max) so the
  // page isn't drowned by 7K+ rows. As soon as the user types, search
  // the full catalogue and cap results at 24 for performance.
  const FEATURED_CAP = 12;
  const SEARCH_CAP = 24;
  const filteredStores = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) {
      const featured = stores.filter((s) => s.is_featured);
      // Fall back to first N alphabetical if nothing is flagged featured.
      const pool = featured.length > 0 ? featured : stores;
      return pool.slice(0, FEATURED_CAP);
    }
    const matches = stores.filter((s) => {
      const name = String(s.name || '').toLowerCase();
      const category = String(s.category || '').toLowerCase();
      return name.includes(q) || category.includes(q);
    });
    return matches.slice(0, SEARCH_CAP);
  }, [stores, query]);

  const totalMatchingStores = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return stores.length;
    return stores.filter((s) => {
      const name = String(s.name || '').toLowerCase();
      const category = String(s.category || '').toLowerCase();
      return name.includes(q) || category.includes(q);
    }).length;
  }, [stores, query]);

  const pickStore = (slug) => {
    setSelectedSlug(slug);
    setSearchParams({
      store: slug,
      amount: String(Number(amount) || 100),
    });
    // Scroll to comparison section
    setTimeout(() => {
      document
        .getElementById('comparison-panel')
        ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
  };

  // ─── Selected store deep-dive ─────────────────────────────────
  const { store } = useStoreBySlug(selectedSlug || null);
  const {
    cashbackOffers,
    pointOffers,
    giftCardOffers,
    loading: offersLoading,
  } = useStoreOffers(store?.id);
  const { programs: milesPrograms } = useMilesPrograms();
  const wallet = useUserWallet();
  const { isPremium } = useSubscription();

  const numericAmount = Number(amount) || 0;

  const userWalletForStrategy = useMemo(() => {
    if (!walletOnly) return null;
    return {
      cashbackPlatformNames: wallet.cashbackPlatformNames,
      milesProgramNames: wallet.milesProgramNames,
    };
  }, [walletOnly, wallet.cashbackPlatformNames, wallet.milesProgramNames]);

  const strategies = useMemo(
    () =>
      computeStrategies({
        store,
        amount: numericAmount,
        cashbackOffers,
        pointOffers,
        giftCardOffers,
        milesPrograms,
        userWallet: userWalletForStrategy,
        includeStacks: isPremium,
      }),
    [
      store,
      numericAmount,
      cashbackOffers,
      pointOffers,
      giftCardOffers,
      milesPrograms,
      userWalletForStrategy,
      isPremium,
    ]
  );

  const premiumPreview = useMemo(() => {
    if (isPremium || !store || numericAmount <= 0) return null;
    const withStacks = computeStrategies({
      store,
      amount: numericAmount,
      cashbackOffers,
      pointOffers,
      giftCardOffers,
      milesPrograms,
      userWallet: userWalletForStrategy,
      includeStacks: true,
    });
    const bestStack = withStacks.find((s) => s.type === 'stack');
    if (!bestStack) return null;
    const bestFlat = strategies[0];
    if (!bestFlat) return null;
    const delta = bestStack.gbpReturn - bestFlat.gbpReturn;
    if (delta <= 0) return null;
    return { bestStack, delta };
  }, [
    isPremium,
    store,
    numericAmount,
    cashbackOffers,
    pointOffers,
    giftCardOffers,
    milesPrograms,
    userWalletForStrategy,
    strategies,
  ]);

  const top = strategies[0];
  const showWalletEmptyHint =
    walletOnly && wallet.isEmpty && !wallet.loading;

  const goToStrategy = () => {
    if (!store || numericAmount <= 0) return;
    navigate(
      `/strategy?store=${encodeURIComponent(store.slug)}&amount=${numericAmount}`
    );
  };

  return (
    <>
      <Helmet>
        <title>Compare — SnapGain</title>
      </Helmet>

      <div className="container mx-auto px-4 py-8 space-y-6">
        {/* ─── Title ────────────────────────────────────────────── */}
        <div className="space-y-3">
          <Link
            to="/home"
            className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Dashboard
          </Link>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex items-center gap-3"
          >
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-secondary text-white flex items-center justify-center shadow-md">
              <Scale className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
                Compare
              </h1>
              <p className="text-muted-foreground text-sm">
                Compare stores and cards side by side to find the best deals.
              </p>
            </div>
          </motion.div>
        </div>

        {/* ─── Tabs ─────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 gap-2 p-1 rounded-2xl bg-muted">
          {TABS.map(({ id, label, Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => setTab(id)}
              className={cn(
                'flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium transition-colors',
                tab === id
                  ? 'bg-card shadow-sm text-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              )}
              aria-pressed={tab === id}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>

        {/* ─── Compare Stores tab ──────────────────────────────── */}
        {tab === 'stores' && (
          <>
            {/* Prominent search bar */}
            <Card className="border-primary/20">
              <CardContent className="py-5">
                <label htmlFor="store-search" className="block text-sm font-semibold mb-2">
                  Which store are you buying from?
                </label>
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="store-search"
                    placeholder={
                      stores.length > 0
                        ? `Search ${stores.length.toLocaleString('en-GB')} stores — try "Amazon", "Tesco", "ASOS"…`
                        : 'Search stores…'
                    }
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="pl-12 h-14 text-base"
                    autoFocus
                  />
                </div>
                {query && (
                  <p className="text-xs text-muted-foreground mt-2">
                    {totalMatchingStores === 0
                      ? `No store matches "${query}".`
                      : totalMatchingStores <= SEARCH_CAP
                      ? `${totalMatchingStores} match${totalMatchingStores === 1 ? '' : 'es'}.`
                      : `Showing top ${SEARCH_CAP} of ${totalMatchingStores.toLocaleString('en-GB')} matches — keep typing to narrow.`}
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Featured / Search results */}
            <section className="space-y-3">
              <div className="flex items-end justify-between gap-2 flex-wrap">
                <h2 className="text-lg font-bold">
                  {query
                    ? `Search results`
                    : 'Featured stores'}
                </h2>
                <span className="text-xs text-muted-foreground">
                  {query
                    ? 'Click "Compare" to see all reward routes for that store.'
                    : 'Or search above for any of our 7,500+ stores.'}
                </span>
              </div>

              {storesLoading ? (
                <Card>
                  <CardContent className="py-12 text-center text-muted-foreground">
                    Loading stores…
                  </CardContent>
                </Card>
              ) : filteredStores.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center text-muted-foreground">
                    {query
                      ? `No store matches "${query}".`
                      : 'No featured stores yet.'}
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                  {filteredStores.map((s) => (
                    <StoreCompareCard
                      key={s.id}
                      store={s}
                      isFavourite={favIds.has(s.id)}
                      isSelected={s.slug === selectedSlug}
                      onPick={() => pickStore(s.slug)}
                    />
                  ))}
                </div>
              )}
            </section>

            {/* ─── Comparison panel (deep-dive on selected store) ── */}
            {selectedSlug && (
              <section
                id="comparison-panel"
                className="space-y-4 pt-2 scroll-mt-24"
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl flex items-center gap-2">
                      <Scale className="w-5 h-5 text-primary" />
                      Comparison for {store?.name || '…'}
                    </CardTitle>
                    <CardDescription>
                      Real-time rates from your catalog. Live updates via
                      Realtime when an admin edits a row.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="amount">Purchase amount</Label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-bold text-lg">
                            £
                          </span>
                          <Input
                            id="amount"
                            type="number"
                            min="0"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="pl-8 h-12 text-base"
                            placeholder="100"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Filter</Label>
                        <button
                          type="button"
                          onClick={() => setWalletOnly((v) => !v)}
                          className={cn(
                            'w-full h-12 px-4 rounded-xl border-2 text-sm font-medium transition-colors flex items-center justify-center gap-2',
                            walletOnly
                              ? 'border-primary bg-primary/10 text-primary'
                              : 'border-border bg-background hover:border-primary/50'
                          )}
                          aria-pressed={walletOnly}
                        >
                          <Wallet className="w-4 h-4" />
                          {walletOnly
                            ? 'Showing only my wallet'
                            : 'Show all routes'}
                          {walletOnly && (
                            <Check className="w-3.5 h-3.5 ml-auto" />
                          )}
                        </button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {showWalletEmptyHint && (
                  <Card className="bg-light-pink/40 border-primary/20">
                    <CardContent className="py-4 flex items-center justify-between gap-3 flex-wrap">
                      <div>
                        <p className="font-semibold">Your wallet is empty</p>
                        <p className="text-sm text-muted-foreground">
                          Add at least one cashback platform or miles program
                          on your Profile.
                        </p>
                      </div>
                      <Button asChild>
                        <Link to="/profile">Set up wallet</Link>
                      </Button>
                    </CardContent>
                  </Card>
                )}

                {/* Strategies */}
                <div className="space-y-3">
                  <div className="flex items-end justify-between gap-2 flex-wrap">
                    <div>
                      <h3 className="text-xl font-bold">
                        {strategies.length}{' '}
                        {strategies.length === 1 ? 'route' : 'routes'} for{' '}
                        {store?.name || '…'}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Ranked by estimated return on £{numericAmount}
                      </p>
                    </div>
                    {top && (
                      <Button onClick={goToStrategy}>
                        See best strategy step-by-step
                      </Button>
                    )}
                  </div>

                  {premiumPreview && (
                    <Card className="bg-gradient-to-br from-light-pink/30 to-light-green/30 border-primary/30">
                      <CardContent className="py-4 flex items-center justify-between gap-3 flex-wrap">
                        <div className="flex items-start gap-3">
                          <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                            <Lock className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="font-semibold flex items-center gap-1.5">
                              <Sparkles className="w-3.5 h-3.5 text-secondary" />
                              Stack strategies are premium
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Subscribe to see{' '}
                              <span className="font-medium">
                                {premiumPreview.bestStack.title}
                              </span>{' '}
                              at{' '}
                              <span className="font-bold gradient-text">
                                {premiumPreview.bestStack.gbpReturnDisplay}
                              </span>{' '}
                              — that&rsquo;s £{premiumPreview.delta.toFixed(2)}{' '}
                              more than the best flat route.
                            </p>
                          </div>
                        </div>
                        <Button asChild>
                          <Link to="/pricing">See plans</Link>
                        </Button>
                      </CardContent>
                    </Card>
                  )}

                  {offersLoading ? (
                    <Card>
                      <CardContent className="py-8 text-center text-muted-foreground">
                        Loading offers…
                      </CardContent>
                    </Card>
                  ) : strategies.length === 0 ? (
                    <Card>
                      <CardContent className="py-8 text-center text-muted-foreground">
                        No offers tracked for this store yet.
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="space-y-3">
                      {strategies.map((s, idx) => (
                        <Card
                          key={s.id}
                          className={
                            idx === 0
                              ? 'card-hover border-primary/40 bg-gradient-to-br from-light-pink/30 to-card'
                              : 'card-hover'
                          }
                        >
                          <CardContent className="py-4 flex flex-col sm:flex-row sm:items-center gap-3">
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                {idx === 0 && (
                                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary uppercase tracking-wide">
                                    <Trophy className="w-3.5 h-3.5" />
                                    Best route
                                  </span>
                                )}
                                <span className="text-xs uppercase tracking-wide text-muted-foreground">
                                  {s.type}
                                </span>
                              </div>
                              <div className="font-semibold text-lg pt-1">
                                {s.title}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {s.subtitle}
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-2xl font-bold gradient-text">
                                {s.gbpReturnDisplay}
                              </div>
                            </div>
                            <Button
                              size="sm"
                              variant={idx === 0 ? 'default' : 'outline'}
                              onClick={() => {
                                const aff = resolveOpenUrl({
                                  rowUrl: s.affiliateLink,
                                  platform: s.platform,
                                });
                                if (aff) {
                                  window.open(
                                    aff,
                                    '_blank',
                                    'noopener,noreferrer'
                                  );
                                } else {
                                  navigate(
                                    `/strategy?store=${encodeURIComponent(
                                      store.slug
                                    )}&route=${encodeURIComponent(
                                      s.id
                                    )}&amount=${numericAmount}`
                                  );
                                }
                              }}
                            >
                              Open
                            </Button>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              </section>
            )}
          </>
        )}

        {/* ─── Compare Cards tab ───────────────────────────────── */}
        {tab === 'cards' && (
          <Card>
            <CardContent className="py-12 text-center space-y-3">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-r from-primary to-secondary text-white flex items-center justify-center">
                <CreditCard className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold">Compare Cards coming soon</h3>
              <p className="text-sm text-muted-foreground max-w-md mx-auto">
                Pick credit / debit cards from your wallet and we&rsquo;ll
                compare their rewards rates side by side. Add your cards on{' '}
                <Link
                  to="/profile"
                  className="text-primary font-medium hover:underline"
                >
                  Profile
                </Link>{' '}
                to get ready.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </>
  );
}

/**
 * StoreCompareCard — visual card with logo, name, category, cashback rate,
 * favourite indicator and a "+ Compare" CTA. Matches the mockup layout.
 */
function StoreCompareCard({ store, isFavourite, isSelected, onPick }) {
  // We don't pre-load every store's offers (would be O(n) queries), so
  // we show the store's headline cashback if present in catalog metadata,
  // otherwise leave the rate blank until the user picks the card.
  const rate = store.headline_rate || store.cashback_rate;

  return (
    <Card
      className={cn(
        'card-hover h-full',
        isSelected && 'border-primary ring-2 ring-primary/30'
      )}
    >
      <CardContent className="p-4 space-y-3">
        <div className="flex items-start gap-3">
          <StoreLogo store={store} size="md" />
          <div className="min-w-0 flex-1">
            <div className="font-semibold truncate">{store.name}</div>
            {store.category && (
              <div className="text-xs text-muted-foreground capitalize truncate">
                {String(store.category).replace(/_/g, ' ')}
              </div>
            )}
          </div>
          {isFavourite && (
            <span className="text-pink-500" aria-label="Favourite">
              <Heart className="w-4 h-4 fill-current" />
            </span>
          )}
        </div>

        {rate != null && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Cashback:</span>
            <span className="font-bold text-primary">{rate}%</span>
          </div>
        )}

        {store.rating != null && (
          <div className="flex items-center gap-1 text-sm">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span className="font-medium">{Number(store.rating).toFixed(1)}</span>
          </div>
        )}

        <Button
          size="sm"
          onClick={onPick}
          className="w-full"
          variant={isSelected ? 'outline' : 'default'}
        >
          {isSelected ? (
            <>
              <Check className="w-4 h-4 mr-1.5" /> Selected
            </>
          ) : (
            <>
              <Plus className="w-4 h-4 mr-1.5" /> Compare
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}

export default ComparePage;
