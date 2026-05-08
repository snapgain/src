import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Bookmark,
  Calculator,
  ExternalLink,
  Trash2,
  ArrowLeft,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useSavedStrategies } from '@/hooks/useUserState';

function SavedStrategiesPage() {
  const { strategies, loading, remove, clear } = useSavedStrategies();

  return (
    <>
      <Helmet>
        <title>Saved strategies — SnapGain</title>
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
          className="flex items-end justify-between gap-4 flex-wrap"
        >
          <div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight flex items-center gap-2">
              <Bookmark className="w-8 h-8 text-primary" />
              Saved strategies
            </h1>
            <p className="text-muted-foreground mt-1">
              Reuse winning reward routes you&rsquo;ve saved.
            </p>
          </div>
          {strategies.length > 0 && (
            <Button variant="outline" size="sm" onClick={clear}>
              <Trash2 className="w-4 h-4 mr-2" />
              Clear all
            </Button>
          )}
        </motion.section>

        {loading ? (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              Loading…
            </CardContent>
          </Card>
        ) : strategies.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center space-y-4">
              <Bookmark className="w-12 h-12 mx-auto text-muted-foreground" />
              <div>
                <p className="text-lg font-medium">No saved strategies yet</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Run a comparison and tap{' '}
                  <span className="font-medium">Save strategy</span> on a
                  strategy you want to reuse.
                </p>
              </div>
              <Button asChild>
                <Link to="/compare">
                  <Calculator className="w-4 h-4 mr-2" />
                  Run a comparison
                </Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {strategies.map((s) => (
              <Card key={s.id} className="card-hover">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      {s.platform?.type && (
                        <span className="text-xs uppercase tracking-wide text-muted-foreground">
                          {s.platform.type}
                        </span>
                      )}
                      <CardTitle className="text-lg pt-1">
                        {s.nickname || 'Strategy'}
                      </CardTitle>
                      {s.store && (
                        <CardDescription>at {s.store.name}</CardDescription>
                      )}
                    </div>
                    <button
                      onClick={() => remove(s.id)}
                      className="text-muted-foreground hover:text-destructive p-1"
                      aria-label="Remove strategy"
                      type="button"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {s.notes && (
                    <p className="text-sm text-muted-foreground">{s.notes}</p>
                  )}
                  {s.amount != null && (
                    <div className="text-sm text-muted-foreground">
                      Saved for purchase of{' '}
                      <span className="font-semibold">£{s.amount}</span>
                    </div>
                  )}
                  <div className="flex flex-wrap gap-2">
                    {s.store?.slug && (
                      <Button asChild size="sm">
                        <Link
                          to={`/strategy?${new URLSearchParams({
                            store: s.store.slug,
                            ...(s.amount ? { amount: String(s.amount) } : {}),
                          }).toString()}`}
                        >
                          Open <ExternalLink className="w-3.5 h-3.5 ml-1.5" />
                        </Link>
                      </Button>
                    )}
                    {s.store?.slug && (
                      <Button asChild size="sm" variant="outline">
                        <Link to={`/store/${s.store.slug}`}>View store</Link>
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default SavedStrategiesPage;
