import React, { useMemo, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Bookmark,
  BookmarkCheck,
  ExternalLink,
  Trophy,
  CheckCircle2,
  AlertCircle,
  BookOpen,
  Clock,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';
import {
  useStoreBySlug,
  useStoreOffers,
  useMilesPrograms,
} from '@/hooks/useCatalog';
import { useSavedStrategies } from '@/hooks/useUserState';
import { useSubscription } from '@/hooks/useSubscription';
import { computeStrategies, buildStrategySteps } from '@/lib/strategies';

function fmtTimeAgo(iso) {
  if (!iso) return null;
  const ms = Date.now() - new Date(iso).getTime();
  if (Number.isNaN(ms)) return null;
  const mins = Math.round(ms / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.round(hrs / 24);
  return `${days}d ago`;
}

function StrategyPage() {
  const [searchParams] = useSearchParams();
  const storeSlug = searchParams.get('store');
  const routeId = searchParams.get('route'); // e.g. 'cashback-<uuid>' or 'points-<uuid>'
  const amount = Number(searchParams.get('amount')) || 100;

  const { store, loading: storeLoading } = useStoreBySlug(storeSlug);
  const { cashbackOffers, pointOffers, giftCardOffers, loading: offersLoading } = useStoreOffers(store?.id);
  const { programs: milesPrograms } = useMilesPrograms();
  const { strategies: savedStrategies, save, reachedFreeCap, FREE_SAVED_CAP } = useSavedStrategies();
  const { isPremium } = useSubscription();

  const strategies = useMemo(
    () =>
      computeStrategies({
        store,
        amount,
        cashbackOffers,
        pointOffers,
        giftCardOffers,
        milesPrograms,
        includeStacks: isPremium,
      }),
    [store, amount, cashbackOffers, pointOffers, giftCardOffers, milesPrograms, isPremium]
  );

  // Pick the highlighted strategy: routeId from URL > best by GBP return
  const highlighted =
    (routeId && strategies.find((s) => s.id === routeId)) || strategies[0] || null;

  const steps = useMemo(
    () => buildStrategySteps(highlighted, store),
    [highlighted, store]
  );

  // Check if this exact (store, route, amount) combo was already saved
  const isAlreadySaved = useMemo(() => {
    if (!store || !highlighted) return false;
    return savedStrategies.some(
      (s) =>
        s.store_id === store.id &&
        s.amount === amount &&
        s.nickname === highlighted.title
    );
  }, [savedStrategies, store, highlighted, amount]);

  const [savingNow, setSavingNow] = useState(false);

  const handleSave = async () => {
    if (!store || !highlighted || savingNow) return;
    if (!isPremium && reachedFreeCap && !isAlreadySaved) {
      toast({
        title: 'Free plan limit reached',
        description: `Free plan includes ${FREE_SAVED_CAP} saved strategies. Subscribe to save unlimited routes.`,
        variant: 'destructive',
      });
      return;
    }
    setSavingNow(true);
    try {
      await save({
        storeId: store.id,
        platformId: null, // not resolving platform.id from provider name yet
        amount,
        nickname: highlighted.title,
        notes: `${highlighted.subtitle} → ${highlighted.gbpReturnDisplay}`,
      });
      toast({
        title: 'Strategy saved',
        description: 'Find it in Saved strategies.',
      });
    } catch (err) {
      toast({
        title: "Couldn't save",
        description: err.message || 'Try again in a moment.',
        variant: 'destructive',
      });
    } finally {
      setSavingNow(false);
    }
  };

  if (storeLoading || offersLoading) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <p className="text-muted-foreground">Loading strategies…</p>
      </div>
    );
  }

  if (!store) {
    return (
      <div className="container mx-auto px-4 py-20 text-center space-y-4">
        <h1 className="text-3xl font-bold">No store selected</h1>
        <p className="text-muted-foreground">
          Pick a store and run a comparison to see the recommended strategy.
        </p>
        <Button asChild>
          <Link to="/search">Browse stores</Link>
        </Button>
      </div>
    );
  }

  if (strategies.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 text-center space-y-4">
        <h1 className="text-3xl font-bold">No strategies yet</h1>
        <p className="text-muted-foreground">
          We don&rsquo;t have enough offer data for {store.name} to recommend a
          route. Check back soon.
        </p>
        <Button asChild variant="outline">
          <Link to={`/store/${store.slug}`}>Back to {store.name}</Link>
        </Button>
      </div>
    );
  }

  const alternatives = strategies.filter((s) => s.id !== highlighted.id);

  return (
    <>
      <Helmet>
        <title>Strategy for {store.name} — SnapGain</title>
      </Helmet>

      <div className="container mx-auto px-4 py-8 space-y-6">
        <Link
          to={`/store/${store.slug}`}
          className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to {store.name}
        </Link>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Card className="bg-gradient-to-br from-light-pink/40 to-white">
            <CardHeader>
              <div className="flex items-center gap-2 text-primary">
                <Trophy className="w-5 h-5" />
                <span className="text-sm font-semibold uppercase tracking-wide">
                  {highlighted.id === strategies[0].id
                    ? 'Best route'
                    : 'Selected route'}
                </span>
              </div>
              <CardTitle className="text-2xl pt-1">
                {highlighted.title} · {store.name}
              </CardTitle>
              <CardDescription>{highlighted.subtitle}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap items-baseline gap-x-6 gap-y-2">
                <div>
                  <div className="text-xs uppercase tracking-wide text-muted-foreground">
                    Estimated return
                  </div>
                  <div className="text-2xl font-bold gradient-text">
                    {highlighted.gbpReturnDisplay}
                  </div>
                </div>
                <div>
                  <div className="text-xs uppercase tracking-wide text-muted-foreground">
                    Purchase
                  </div>
                  <div className="text-2xl font-bold">£{amount}</div>
                </div>
                {highlighted.lastVerifiedAt && (
                  <div className="text-xs text-muted-foreground inline-flex items-center gap-1 self-end">
                    <Clock className="w-3 h-3" />
                    Rate verified {fmtTimeAgo(highlighted.lastVerifiedAt)}
                  </div>
                )}
              </div>

              <div className="flex flex-wrap gap-3">
                <Button
                  onClick={handleSave}
                  disabled={savingNow || isAlreadySaved}
                  variant={isAlreadySaved ? 'outline' : 'default'}
                >
                  {isAlreadySaved ? (
                    <>
                      <BookmarkCheck className="w-4 h-4 mr-2" />
                      Saved
                    </>
                  ) : (
                    <>
                      <Bookmark className="w-4 h-4 mr-2" />
                      {savingNow ? 'Saving…' : 'Save strategy'}
                    </>
                  )}
                </Button>
                {highlighted.affiliateLink && (
                  <a
                    href={highlighted.affiliateLink}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button variant="outline">
                      Open {highlighted.providerName}{' '}
                      <ExternalLink className="w-3.5 h-3.5 ml-2" />
                    </Button>
                  </a>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold">Step by step</h2>
          <ol className="space-y-3">
            {steps.map((step, idx) => (
              <li key={idx}>
                <Card>
                  <CardContent className="py-4 flex gap-4">
                    <div className="shrink-0 w-9 h-9 rounded-full bg-primary text-primary-foreground font-bold flex items-center justify-center">
                      {idx + 1}
                    </div>
                    <div className="space-y-2">
                      <div className="font-semibold flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-primary" />
                        {step.title}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {step.detail}
                      </p>
                      {step.warning && (
                        <div className="text-sm text-secondary inline-flex items-start gap-2">
                          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                          <span>{step.warning}</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </li>
            ))}
          </ol>
        </section>

        {alternatives.length > 0 && (
          <section className="space-y-3">
            <h2 className="text-xl font-bold">Alternative routes</h2>
            <p className="text-sm text-muted-foreground">
              Sorted by estimated return on £{amount}.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {alternatives.map((s) => (
                <Link
                  key={s.id}
                  to={`/strategy?store=${encodeURIComponent(
                    store.slug
                  )}&route=${encodeURIComponent(s.id)}&amount=${amount}`}
                >
                  <Card className="card-hover h-full">
                    <CardHeader className="pb-2">
                      <span className="text-xs uppercase tracking-wide text-muted-foreground">
                        {s.type}
                      </span>
                      <CardTitle className="text-lg pt-1">{s.title}</CardTitle>
                      <CardDescription>{s.subtitle}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-xl font-bold gradient-text">
                        {s.gbpReturnDisplay}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </section>
        )}

        <Card className="bg-light-green/30 border-accent/30">
          <CardContent className="py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-start gap-3">
              <BookOpen className="w-5 h-5 text-primary mt-0.5" />
              <div>
                <p className="font-semibold">Want to understand why this wins?</p>
                <p className="text-sm text-muted-foreground">
                  Read the chapter on stacking {highlighted.type} routes.
                </p>
              </div>
            </div>
            <Button asChild variant="outline">
              <Link to="/library">Open library</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </>
  );
}

export default StrategyPage;
