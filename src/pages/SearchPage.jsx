import React, { useEffect, useMemo } from 'react';
import { Helmet } from 'react-helmet';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { useStores } from '@/hooks/useCatalog';
import { useRecentSearches, useUserFavourites } from '@/hooks/useUserState';
import { SearchAutocomplete } from '@/components/SearchAutocomplete';
import { StoreLogo } from '@/components/StoreLogo';

const FILTERS = [
  { id: 'cashback',   label: 'Cashback',       icon: '💰' },
  { id: 'points',     label: 'Points & Miles', icon: '✈️' },
  { id: 'gift-cards', label: 'Gift Cards',     icon: '🎁' },
];

function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const [activeFilters, setActiveFilters] = React.useState([]);

  const { stores, loading } = useStores();
  const { push: pushRecent } = useRecentSearches();
  const { isFavourite } = useUserFavourites();

  // Record any query that came in via URL
  useEffect(() => {
    if (initialQuery) pushRecent(initialQuery);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialQuery]);

  const results = useMemo(() => {
    const q = initialQuery.trim().toLowerCase();
    if (!q) return stores;
    return stores.filter((s) => s.name.toLowerCase().includes(q));
  }, [initialQuery, stores]);

  const handleSubmit = (query) => {
    const next = new URLSearchParams(searchParams);
    if (query?.trim()) next.set('q', query.trim());
    else next.delete('q');
    setSearchParams(next, { replace: true });
  };

  const toggleFilter = (filter) => {
    setActiveFilters((prev) =>
      prev.find((f) => f.id === filter.id)
        ? prev.filter((f) => f.id !== filter.id)
        : [...prev, filter]
    );
  };

  return (
    <>
      <Helmet>
        <title>
          {initialQuery
            ? `Search: ${initialQuery} — SnapGain`
            : 'Search stores — SnapGain'}
        </title>
      </Helmet>

      <div className="container mx-auto px-4 py-10 space-y-8">
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="space-y-4"
        >
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
            Search stores
          </h1>

          <SearchAutocomplete
            initialValue={initialQuery}
            onSubmit={handleSubmit}
            placeholder="Type a store name…"
            autoFocus
          />

          <div className="flex flex-wrap gap-2 pt-2">
            {FILTERS.map((filter) => {
              const active = !!activeFilters.find((f) => f.id === filter.id);
              return (
                <button
                  key={filter.id}
                  onClick={() => toggleFilter(filter)}
                  className={`px-4 py-1.5 rounded-full border text-sm font-medium transition-colors ${
                    active
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-border bg-background hover:border-primary/50'
                  }`}
                  type="button"
                >
                  <span className="mr-1.5" aria-hidden="true">
                    {filter.icon}
                  </span>
                  {filter.label}
                </button>
              );
            })}
          </div>
        </motion.section>

        <section className="space-y-4">
          <p className="text-sm text-muted-foreground">
            {loading
              ? 'Loading stores…'
              : `${results.length} ${results.length === 1 ? 'store' : 'stores'}${
                  initialQuery ? ` matching "${initialQuery}"` : ''
                }`}
          </p>

          {!loading && results.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center space-y-3">
                <p className="text-lg font-medium">
                  No stores match your search.
                </p>
                <p className="text-sm text-muted-foreground">
                  Try a different name or browse the full list from the home
                  page.
                </p>
                <Button asChild variant="outline">
                  <Link to="/home">Back to home</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {results.map((store) => (
                <Link key={store.id} to={`/store/${store.slug}`}>
                  <Card className="card-hover h-full">
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <StoreLogo store={store} size="lg" />
                        {(store.is_featured || isFavourite(store.id)) && (
                          <Star className="w-5 h-5 text-secondary fill-secondary" />
                        )}
                      </div>
                      <CardTitle className="text-xl pt-2">{store.name}</CardTitle>
                      <CardDescription className="capitalize">
                        {store.category?.[0] || 'Retailer'} · Cashback · Points
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <span className="text-sm font-medium text-primary inline-flex items-center">
                        Compare rewards <ArrowRight className="w-4 h-4 ml-1" />
                      </span>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>
    </>
  );
}

export default SearchPage;
