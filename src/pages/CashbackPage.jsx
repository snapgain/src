import React, { useMemo } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PiggyBank, ArrowLeft, ArrowRight, Wallet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { usePlatforms } from '@/hooks/useCatalog';
import { useUserWallet } from '@/hooks/useUserState';

function CashbackPage() {
  const { platforms, loading } = usePlatforms({ type: 'cashback' });
  const wallet = useUserWallet();

  const ownedByPlatformId = useMemo(() => {
    const m = new Map();
    wallet.cashbackPlatforms.forEach((p) => m.set(p.platform_id, p));
    return m;
  }, [wallet.cashbackPlatforms]);

  const ownedTotalGbp = wallet.cashbackPlatforms.reduce(
    (sum, c) => sum + Number(c.balance || 0),
    0
  );

  return (
    <>
      <Helmet>
        <title>Cashback — SnapGain</title>
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
            <PiggyBank className="w-8 h-8 text-primary" />
            Cashback
          </h1>
          <p className="text-muted-foreground mt-1">
            Track your cashback balances and find the platforms with the
            highest rates for your usual stores.
          </p>
        </motion.section>

        {wallet.cashbackPlatforms.length > 0 && (
          <Card className="bg-gradient-to-br from-light-pink/40 to-white">
            <CardHeader>
              <CardDescription>Tracked balance</CardDescription>
              <CardTitle className="text-3xl gradient-text">
                £{ownedTotalGbp.toFixed(2)}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Across {wallet.cashbackPlatforms.length}{' '}
                platform{wallet.cashbackPlatforms.length === 1 ? '' : 's'} in your
                wallet.
              </p>
            </CardContent>
          </Card>
        )}

        <section className="space-y-3">
          <div className="flex items-end justify-between gap-3">
            <h2 className="text-xl font-semibold">All cashback platforms</h2>
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
                Loading platforms…
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {platforms.map((p) => {
                const owned = ownedByPlatformId.get(p.id);
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
                        {p.base_rate_display || 'Cashback platform'}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {owned ? (
                        <div className="text-lg font-bold gradient-text">
                          £{Number(owned.balance || 0).toFixed(2)}
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

export default CashbackPage;
