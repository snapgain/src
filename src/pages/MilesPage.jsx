import React, { useMemo } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plane, ArrowLeft, ArrowRight, Wallet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useMilesPrograms } from '@/hooks/useCatalog';
import { useUserWallet } from '@/hooks/useUserState';

function MilesPage() {
  const { programs, loading } = useMilesPrograms();
  const wallet = useUserWallet();

  const ownedById = useMemo(() => {
    const m = new Map();
    wallet.milesPrograms.forEach((p) => m.set(p.miles_program_id, p));
    return m;
  }, [wallet.milesPrograms]);

  const ownedTotalGbp = wallet.milesPrograms.reduce((sum, m) => {
    const rate = Number(m.miles_program?.conversion_rate || 0);
    return sum + Number(m.balance || 0) * rate;
  }, 0);

  return (
    <>
      <Helmet>
        <title>Miles & loyalty — SnapGain</title>
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
            <Plane className="w-8 h-8 text-primary" />
            Miles &amp; loyalty
          </h1>
          <p className="text-muted-foreground mt-1">
            Track your miles balances and discover the highest-earning routes.
          </p>
        </motion.section>

        {wallet.milesPrograms.length > 0 && (
          <Card className="bg-gradient-to-br from-light-pink/40 to-card">
            <CardHeader>
              <CardDescription>Your portfolio</CardDescription>
              <CardTitle className="text-3xl gradient-text">
                ≈ £{ownedTotalGbp.toFixed(2)}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Estimated value across {wallet.milesPrograms.length}{' '}
                program{wallet.milesPrograms.length === 1 ? '' : 's'} you&rsquo;ve
                added to your wallet.
              </p>
            </CardContent>
          </Card>
        )}

        <section className="space-y-3">
          <div className="flex items-end justify-between gap-3">
            <h2 className="text-xl font-semibold">All programs</h2>
            <Button asChild variant="outline" size="sm">
              <Link to="/wallet">
                <Wallet className="w-4 h-4 mr-2" />
                Manage wallet
              </Link>
            </Button>
          </div>
          {loading ? (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                Loading programs…
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {programs.map((p) => {
                const owned = ownedById.get(p.id);
                const rate = Number(p.conversion_rate || 0);
                return (
                  <Card key={p.id} className={owned ? 'border-primary/40' : ''}>
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between gap-2">
                        <CardTitle className="text-base">{p.name}</CardTitle>
                        {owned && (
                          <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                            in wallet
                          </span>
                        )}
                      </div>
                      <CardDescription>
                        Worth ≈ £{(rate * 1000).toFixed(2)} per 1,000 pts
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {owned ? (
                        <div className="text-lg font-bold gradient-text">
                          {Math.round(Number(owned.balance || 0)).toLocaleString()} pts
                        </div>
                      ) : (
                        <Link
                          to="/wallet"
                          className="text-sm font-medium text-primary inline-flex items-center"
                        >
                          Add to wallet
                          <ArrowRight className="w-4 h-4 ml-1" />
                        </Link>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </>
  );
}

export default MilesPage;
