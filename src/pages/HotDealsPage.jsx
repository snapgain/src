import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Zap, ArrowLeft } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useHotDeals } from '@/hooks/useCatalog';
import { StoreLogo } from '@/components/StoreLogo';

function HotDealsPage() {
  const { deals, loading } = useHotDeals({ limit: 50 });

  return (
    <>
      <Helmet>
        <title>Hot deals — SnapGain</title>
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
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight flex items-center gap-2">
            <Zap className="w-8 h-8 text-secondary" />
            Hot deals
          </h1>
          <p className="text-muted-foreground mt-1">
            Featured opportunities the SnapGain team is tracking right now.
            Updates live via Realtime.
          </p>
        </motion.section>

        {loading ? (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              Loading deals…
            </CardContent>
          </Card>
        ) : deals.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              No deals featured right now — check back soon.
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {deals.map((deal) => {
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
                      <p className="text-sm text-muted-foreground">
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
        )}
      </div>
    </>
  );
}

export default HotDealsPage;
