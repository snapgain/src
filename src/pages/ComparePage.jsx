import React, { useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Calculator, Trophy, Wallet, Check } from 'lucide-react';
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
import { useUserWallet } from '@/hooks/useUserState';
import { useSubscription } from '@/hooks/useSubscription';
import { computeStrategies } from '@/lib/strategies';
import { Lock, Sparkles } from 'lucide-react';

function ComparePage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const initialSlug = searchParams.get('store') || '';
  const initialAmount = Number(searchParams.get('amount')) || 100;

  const { stores, loading: storesLoading } = useStores();
  const [selectedSlug, setSelectedSlug] = useState(initialSlug);
  const [amount, setAmount] = useState(String(initialAmount));
  const [walletOnly, setWalletOnly] = useState(false);

  // Sync state with URL
  useEffect(() => {
    setSelectedSlug(searchParams.get('store') || '');
    const a = Number(searchParams.get('amount'));
    if (a) setAmount(String(a));
  }, [searchParams]);

  const { store } = useStoreBySlug(selectedSlug || null);
  const { cashbackOffers, pointOffers, giftCardOffers, loading: offersLoading } =
    useStoreOffers(store?.id);
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
    [store, numericAmount, cashbackOffers, pointOffers, giftCardOffers, milesPrograms, userWalletForStrategy, isPremium]
  );

  // What the user is missing without premium: best stack we'd otherwise show
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
  }, [isPremium, store, numericAmount, cashbackOffers, pointOffers, giftCardOffers, milesPrograms, userWalletForStrategy, strategies]);

  const top = strategies[0];
  const showWalletEmptyHint = walletOnly && wallet.isEmpty && !wallet.loading;

  const goToStrategy = () => {
    if (!store || numericAmount <= 0) return;
    navigate(
      `/strategy?store=${encodeURIComponent(store.slug)}&amount=${numericAmount}`
    );
  };

  return (
    <>
      <Helmet>
        <title>Compare rewards — SnapGain</title>
      </Helmet>

      <div className="container mx-auto px-4 py-8 space-y-6">
        <Link
          to="/home"
          className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Home
        </Link>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
            Compare rewards
          </h1>
          <p className="text-muted-foreground mt-2">
            Pick a store and an amount, and we&rsquo;ll rank every reward route
            we track by estimated £ return.
          </p>
        </motion.section>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <Calculator className="w-5 h-5 text-primary" />
              Comparison
            </CardTitle>
            <CardDescription>
              Real-time rates from your Supabase catalog. Live updates via
              Realtime when an admin edits a row.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="store">1. Select store</Label>
              <select
                id="store"
                value={selectedSlug}
                onChange={(e) => setSelectedSlug(e.target.value)}
                disabled={storesLoading}
                className="w-full h-12 px-3 rounded-xl border-2 border-primary/30 bg-background text-base focus:outline-none focus:border-primary"
              >
                <option value="">— pick a store —</option>
                {stores.map((s) => (
                  <option key={s.id} value={s.slug}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">2. Purchase amount</Label>
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

            <div className="md:col-span-2 pt-2 flex items-start justify-between gap-3 flex-wrap border-t mt-2 pt-4">
              <div>
                <p className="font-semibold flex items-center gap-2">
                  <Wallet className="w-4 h-4 text-primary" />
                  Show only my wallet
                </p>
                <p className="text-xs text-muted-foreground">
                  Filter strategies down to platforms and programs you actually use.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setWalletOnly((v) => !v)}
                className={`px-4 py-2 rounded-full border text-sm font-medium transition-colors ${
                  walletOnly
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-border bg-background hover:border-primary/50'
                }`}
                aria-pressed={walletOnly}
              >
                {walletOnly ? (
                  <>
                    <Check className="w-3.5 h-3.5 mr-1.5 inline" />
                    Personalised
                  </>
                ) : (
                  'All routes'
                )}
              </button>
            </div>
          </CardContent>
        </Card>

        {showWalletEmptyHint && (
          <Card className="bg-light-pink/40 border-primary/20">
            <CardContent className="py-4 flex items-center justify-between gap-3 flex-wrap">
              <div>
                <p className="font-semibold">Your wallet is empty</p>
                <p className="text-sm text-muted-foreground">
                  Add at least one cashback platform or miles program so we can
                  filter routes you can actually use.
                </p>
              </div>
              <Button asChild>
                <Link to="/wallet">Set up wallet</Link>
              </Button>
            </CardContent>
          </Card>
        )}

        {selectedSlug && (
          <section className="space-y-4">
            <div className="flex items-end justify-between gap-4 flex-wrap">
              <div>
                <h2 className="text-2xl font-bold">
                  {strategies.length}{' '}
                  {strategies.length === 1 ? 'route' : 'routes'} for{' '}
                  {store?.name || '…'}
                </h2>
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
                        Subscribe to see <span className="font-medium">{premiumPreview.bestStack.title}</span> at{' '}
                        <span className="font-bold gradient-text">
                          {premiumPreview.bestStack.gbpReturnDisplay}
                        </span>
                        {' '}— that&rsquo;s £{premiumPreview.delta.toFixed(2)} more than the best flat route.
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
                        ? 'card-hover border-primary/40 bg-gradient-to-br from-light-pink/30 to-white'
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
                        onClick={() =>
                          navigate(
                            `/strategy?store=${encodeURIComponent(
                              store.slug
                            )}&route=${encodeURIComponent(
                              s.id
                            )}&amount=${numericAmount}`
                          )
                        }
                      >
                        Open
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </section>
        )}
      </div>
    </>
  );
}

export default ComparePage;
