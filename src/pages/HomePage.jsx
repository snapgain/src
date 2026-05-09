import React from 'react';
import { Helmet } from 'react-helmet';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Search,
  Bookmark,
  BookOpen,
  Zap,
  ArrowRight,
  Calculator,
  Wallet,
  Bell,
} from 'lucide-react';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useStores, useHotDeals } from '@/hooks/useCatalog';
import { useRecentSearches } from '@/hooks/useUserState';
import { SearchAutocomplete } from '@/components/SearchAutocomplete';
import { StoreLogo } from '@/components/StoreLogo';

function HomePage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const { stores, loading: storesLoading } = useStores();
  const { deals: hotDeals } = useHotDeals({ limit: 4 });
  const { searches: recentSearches, push: pushRecent } = useRecentSearches();

  const featuredStores = stores.filter((s) => s.is_featured);
  const otherStores = stores.filter((s) => !s.is_featured);

  const firstName =
    user?.user_metadata?.name?.split(' ')[0] ||
    user?.email?.split('@')[0] ||
    'there';

  const quickLinks = [
    { to: '/compare', icon: Calculator, label: 'Compare' },
    { to: '/saved-strategies', icon: Bookmark, label: 'Saved strategies' },
    { to: '/wallet', icon: Wallet, label: 'My wallet' },
    { to: '/alerts', icon: Bell, label: 'Alerts' },
  ];

  const handleSearchSubmit = (query) => {
    if (query) pushRecent(query);
    navigate(query ? `/search?q=${encodeURIComponent(query)}` : '/search');
  };

  return (
    <>
      <Helmet>
        <title>Home — SnapGain</title>
      </Helmet>

      <div className="container mx-auto px-4 py-10 space-y-12">
        {/* Hero + Search */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          <div>
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight">
              Welcome back, <span className="gradient-text">{firstName}</span>
            </h1>
            <p className="mt-2 text-lg text-muted-foreground">
              What are you buying today? We&rsquo;ll find the best reward route.
            </p>
          </div>

          <SearchAutocomplete
            placeholder="Search a store (e.g. Amazon, Tesco, John Lewis)"
            onSubmit={handleSearchSubmit}
          />

          <div className="flex flex-wrap gap-2">
            {quickLinks.map(({ to, icon: Icon, label }) => (
              <Link key={to} to={to}>
                <Button variant="outline" size="sm" className="rounded-full">
                  <Icon className="w-4 h-4 mr-2" />
                  {label}
                </Button>
              </Link>
            ))}
          </div>
        </motion.section>

        {/* Featured Stores */}
        <section className="space-y-4">
          <div className="flex items-end justify-between">
            <div>
              <h2 className="text-2xl font-bold">Featured stores</h2>
              <p className="text-sm text-muted-foreground">
                Top picks for cashback and points
              </p>
            </div>
            <Link
              to="/search"
              className="text-sm font-medium text-primary hover:underline inline-flex items-center"
            >
              See all <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {storesLoading
              ? Array.from({ length: 4 }).map((_, i) => (
                  <Card key={i} className="h-full">
                    <CardContent className="py-6 text-center text-muted-foreground text-sm">
                      Loading…
                    </CardContent>
                  </Card>
                ))
              : featuredStores.map((store) => (
                  <Link key={store.id} to={`/store/${store.slug}`}>
                    <Card className="card-hover h-full">
                      <CardContent className="flex flex-col items-center justify-center py-6 space-y-2">
                        <StoreLogo store={store} size="lg" />
                        <span className="font-semibold text-center">
                          {store.name}
                        </span>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
          </div>
        </section>

        {/* Hot Deals */}
        {hotDeals.length > 0 && (
          <section className="space-y-4">
            <div className="flex items-end justify-between">
              <div>
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <Zap className="w-6 h-6 text-secondary" />
                  Hot deals
                </h2>
                <p className="text-sm text-muted-foreground">
                  Featured opportunities the SnapGain team is tracking right now
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {hotDeals.map((deal) => {
                const href =
                  deal.cta_url ||
                  (deal.store?.slug ? `/store/${deal.store.slug}` : null);
                const inner = (
                  <Card className="card-hover h-full">
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between gap-2">
                        {deal.store ? (
                          <StoreLogo store={deal.store} size="sm" />
                        ) : (
                          <div className="w-8 h-8 rounded-lg bg-secondary/10 text-secondary flex items-center justify-center">
                            <Zap className="w-4 h-4" />
                          </div>
                        )}
                        {deal.badge && (
                          <span className="text-xs font-bold uppercase tracking-wide px-2 py-1 rounded-full bg-light-pink text-secondary">
                            {deal.badge}
                          </span>
                        )}
                      </div>
                      <CardTitle className="text-lg pt-2 leading-tight">
                        {deal.title}
                      </CardTitle>
                      {deal.platform && (
                        <CardDescription>via {deal.platform}</CardDescription>
                      )}
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {deal.rate_display && (
                        <div className="text-xl font-bold gradient-text">
                          {deal.rate_display}
                        </div>
                      )}
                      {deal.description && (
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {deal.description}
                        </p>
                      )}
                    </CardContent>
                  </Card>
                );
                return href ? (
                  <Link key={deal.id} to={href}>
                    {inner}
                  </Link>
                ) : (
                  <div key={deal.id}>{inner}</div>
                );
              })}
            </div>
          </section>
        )}

        {/* Saved Strategies + Continue Reading */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="card-hover bg-gradient-to-br from-light-pink/40 to-white">
            <CardHeader>
              <div className="flex items-center gap-2 text-primary">
                <Bookmark className="w-5 h-5" />
                <span className="text-sm font-semibold uppercase tracking-wide">
                  Saved strategies
                </span>
              </div>
              <CardTitle className="text-xl">Reuse your best routes</CardTitle>
              <CardDescription>
                Save winning reward strategies and replay them on your next
                purchase.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="outline">
                <Link to="/saved-strategies">View saved strategies</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="card-hover bg-gradient-to-br from-light-green/40 to-white">
            <CardHeader>
              <div className="flex items-center gap-2 text-accent-foreground">
                <BookOpen className="w-5 h-5" />
                <span className="text-sm font-semibold uppercase tracking-wide">
                  Keep learning
                </span>
              </div>
              <CardTitle className="text-xl">
                From Cashback to Flights
              </CardTitle>
              <CardDescription>
                Premium guide on stacking rewards. Read a chapter and apply the
                strategy here.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="outline">
                <Link to="/library">Open library</Link>
              </Button>
            </CardContent>
          </Card>
        </section>

        {/* Recent searches */}
        {recentSearches.length > 0 && (
          <section className="space-y-3">
            <h2 className="text-2xl font-bold">Recent searches</h2>
            <div className="flex flex-wrap gap-2">
              {recentSearches.map((s) => (
                <Link key={s.id} to={`/search?q=${encodeURIComponent(s.query)}`}>
                  <Button variant="outline" size="sm" className="rounded-full">
                    <Search className="w-3.5 h-3.5 mr-2" />
                    {s.query}
                  </Button>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* All stores */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold">All stores</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {otherStores.map((store) => (
              <Link key={store.id} to={`/store/${store.slug}`}>
                <Card className="card-hover h-full">
                  <CardContent className="flex flex-col items-center justify-center py-4 space-y-1">
                    <StoreLogo store={store} size="md" />
                    <span className="text-sm font-medium text-center">
                      {store.name}
                    </span>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}

export default HomePage;
