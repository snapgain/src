import React, { useMemo, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Star,
  ExternalLink,
  Trophy,
  Calculator,
  Clock,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import {
  useStoreBySlug,
  useStoreOffers,
  useMilesPrograms,
} from '@/hooks/useCatalog';
import { resolveOpenUrl } from '@/lib/affiliateLinks';
import { useUserFavourites } from '@/hooks/useUserState';
import { computeStrategies } from '@/lib/strategies';
import { StoreLogo } from '@/components/StoreLogo';

const TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'cashback', label: 'Cashback' },
  { id: 'points',   label: 'Points & Miles' },
  { id: 'strategy', label: 'Best strategy' },
];

const DEFAULT_AMOUNT = 100;

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

function CashbackOfferCard({ offer }) {
  return (
    <Card className="card-hover">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <span className="text-3xl" aria-hidden="true">💰</span>
          <span className="text-xs font-medium px-2 py-1 rounded-full bg-light-pink text-secondary">
            cashback
          </span>
        </div>
        <CardTitle className="text-lg pt-2">{offer.platform}</CardTitle>
        <CardDescription>{offer.rate}% cashback</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="text-2xl font-bold gradient-text">{offer.rate}%</div>
        {offer.last_verified_at && (
          <div className="text-xs text-muted-foreground inline-flex items-center gap-1">
            <Clock className="w-3 h-3" />
            Verified {fmtTimeAgo(offer.last_verified_at)}
          </div>
        )}
        {(() => {
          const href = resolveOpenUrl({
            rowUrl: offer.affiliate_link,
            platform: offer.platform,
          });
          if (!href) return null;
          return (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-primary inline-flex items-center hover:underline"
            >
              Open {offer.platform} <ExternalLink className="w-3.5 h-3.5 ml-1" />
            </a>
          );
        })()}
      </CardContent>
    </Card>
  );
}

function PointOfferCard({ offer }) {
  return (
    <Card className="card-hover">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <span className="text-3xl" aria-hidden="true">✈️</span>
          <span className="text-xs font-medium px-2 py-1 rounded-full bg-light-pink text-secondary">
            points
          </span>
        </div>
        <CardTitle className="text-lg pt-2">{offer.airline}</CardTitle>
        <CardDescription>{offer.earn_rate} points per £1</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="text-2xl font-bold gradient-text">
          {offer.earn_rate} pts/£
        </div>
        {offer.booster_available && (
          <span className="text-xs px-2 py-1 rounded-full bg-light-green text-accent-foreground">
            Booster available
          </span>
        )}
        {offer.last_verified_at && (
          <div className="text-xs text-muted-foreground inline-flex items-center gap-1">
            <Clock className="w-3 h-3" />
            Verified {fmtTimeAgo(offer.last_verified_at)}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function StoreDetailPage() {
  const { storeId: slug } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  const { store, loading: storeLoading } = useStoreBySlug(slug);
  const { cashbackOffers, pointOffers, giftCardOffers, loading: offersLoading } = useStoreOffers(store?.id);
  const { programs: milesPrograms } = useMilesPrograms();
  const { isFavourite, toggle: toggleFav } = useUserFavourites();

  const strategies = useMemo(
    () =>
      computeStrategies({
        store,
        amount: DEFAULT_AMOUNT,
        cashbackOffers,
        pointOffers,
        giftCardOffers,
        milesPrograms,
      }),
    [store, cashbackOffers, pointOffers, giftCardOffers, milesPrograms]
  );

  const bestStrategy = strategies[0] || null;

  if (storeLoading) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <p className="text-muted-foreground">Loading store…</p>
      </div>
    );
  }

  if (!store) {
    return (
      <div className="container mx-auto px-4 py-20 text-center space-y-4">
        <h1 className="text-3xl font-bold">Store not found</h1>
        <p className="text-muted-foreground">
          We don&rsquo;t have rewards mapped for &ldquo;{slug}&rdquo; yet.
        </p>
        <Button asChild>
          <Link to="/search">Browse stores</Link>
        </Button>
      </div>
    );
  }

  const renderTabBody = () => {
    if (offersLoading) {
      return <p className="text-muted-foreground">Loading offers…</p>;
    }
    switch (activeTab) {
      case 'cashback':
        return cashbackOffers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {cashbackOffers.map((o) => (
              <CashbackOfferCard key={o.id} offer={o} />
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              No cashback offers tracked for this store yet.
            </CardContent>
          </Card>
        );
      case 'points':
        return pointOffers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pointOffers.map((o) => (
              <PointOfferCard key={o.id} offer={o} />
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              No points/miles offers tracked for this store yet.
            </CardContent>
          </Card>
        );
      case 'strategy':
        return bestStrategy ? (
          <Card className="bg-gradient-to-br from-light-pink/40 to-card">
            <CardHeader>
              <div className="flex items-center gap-2 text-primary">
                <Trophy className="w-5 h-5" />
                <span className="text-sm font-semibold uppercase tracking-wide">
                  Recommended route (on £{DEFAULT_AMOUNT})
                </span>
              </div>
              <CardTitle className="text-2xl pt-2">{bestStrategy.title}</CardTitle>
              <CardDescription>{bestStrategy.subtitle}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-3xl font-bold gradient-text">
                {bestStrategy.gbpReturnDisplay}
              </div>
              <p className="text-sm text-muted-foreground">
                Highest expected return among the {strategies.length} routes we
                track for {store.name} on a £{DEFAULT_AMOUNT} purchase. Run a
                full comparison to plug in your own amount and wallet.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button
                  onClick={() =>
                    navigate(
                      `/strategy?store=${encodeURIComponent(
                        store.slug
                      )}&amount=${DEFAULT_AMOUNT}`
                    )
                  }
                >
                  See step-by-step strategy
                </Button>
                <Button
                  asChild
                  variant="outline"
                  onClick={() =>
                    navigate(
                      `/compare?store=${encodeURIComponent(store.slug)}`
                    )
                  }
                >
                  <span>
                    <Calculator className="w-4 h-4 mr-2" />
                    Run full comparison
                  </span>
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              No strategies computed yet — we don&rsquo;t have enough offer data
              for this store.
            </CardContent>
          </Card>
        );
      case 'overview':
      default: {
        const allOffers = [...cashbackOffers, ...pointOffers];
        return (
          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-semibold mb-3">
                Available routes ({allOffers.length})
              </h3>
              {allOffers.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {cashbackOffers.map((o) => (
                    <CashbackOfferCard key={`cb-${o.id}`} offer={o} />
                  ))}
                  {pointOffers.map((o) => (
                    <PointOfferCard key={`pt-${o.id}`} offer={o} />
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="py-8 text-center text-muted-foreground">
                    No offers tracked for {store.name} yet. Check back soon — or
                    suggest one from the admin panel.
                  </CardContent>
                </Card>
              )}
            </div>
            <Card className="bg-light-green/30 border-accent/30">
              <CardContent className="py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <p className="font-semibold">
                    Want the best route for {store.name}?
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Plug in your purchase amount and we&rsquo;ll rank every
                    route by £ return.
                  </p>
                </div>
                <Button
                  onClick={() =>
                    navigate(
                      `/compare?store=${encodeURIComponent(store.slug)}`
                    )
                  }
                >
                  <Calculator className="w-4 h-4 mr-2" />
                  Compare
                </Button>
              </CardContent>
            </Card>
          </div>
        );
      }
    }
  };

  const fav = isFavourite(store.id);

  return (
    <>
      <Helmet>
        <title>{store.name} — SnapGain</title>
      </Helmet>

      <div className="container mx-auto px-4 py-8 space-y-6">
        <Link
          to="/search"
          className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          All stores
        </Link>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col sm:flex-row sm:items-center gap-4"
        >
          <StoreLogo store={store} size="xl" />
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
                {store.name}
              </h1>
              <button
                onClick={() => toggleFav(store.id)}
                aria-label={fav ? 'Remove from favourites' : 'Add to favourites'}
                className="text-secondary"
                type="button"
              >
                <Star
                  className={`w-6 h-6 ${
                    fav ? 'fill-secondary' : 'opacity-40 hover:opacity-100'
                  }`}
                />
              </button>
            </div>
            <p className="text-muted-foreground">
              Compare cashback, points, and gift card routes for {store.name}.
            </p>
          </div>
          <Button
            onClick={() =>
              navigate(`/compare?store=${encodeURIComponent(store.slug)}`)
            }
            size="lg"
          >
            <Calculator className="w-5 h-5 mr-2" />
            Compare rewards
          </Button>
        </motion.section>

        <div className="border-b">
          <nav
            className="-mb-px flex gap-1 overflow-x-auto"
            role="tablist"
            aria-label="Store reward categories"
          >
            {TABS.map((tab) => {
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  role="tab"
                  aria-selected={active}
                  className={`px-4 py-2.5 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                    active
                      ? 'border-primary text-primary'
                      : 'border-transparent text-muted-foreground hover:text-foreground'
                  }`}
                  type="button"
                >
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        <div role="tabpanel">{renderTabBody()}</div>
      </div>
    </>
  );
}

export default StoreDetailPage;
