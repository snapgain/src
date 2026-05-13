import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import {
  ExternalLink,
  Sparkles,
  PiggyBank,
  Gift,
  CreditCard,
  Smartphone,
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/customSupabaseClient';
import { useTranslation } from '@/lib/i18n';
import { cn } from '@/lib/utils';

const TYPE_META = {
  cashback: { Icon: PiggyBank, label: 'Cashback', accent: 'from-green-400 to-emerald-600' },
  gift_card: { Icon: Gift, label: 'Gift cards', accent: 'from-pink-400 to-secondary' },
  card: { Icon: CreditCard, label: 'Cards', accent: 'from-primary to-secondary' },
  bank_offer: { Icon: Smartphone, label: 'Bank offers', accent: 'from-orange-400 to-red-500' },
};

function AppsPage() {
  const { t } = useTranslation();
  const [platforms, setPlatforms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    supabase
      .from('platform')
      .select('id, slug, name, type, base_rate_display, notes, affiliate_url')
      .eq('is_active', true)
      .not('affiliate_url', 'is', null)
      .order('type')
      .order('name')
      .then(({ data, error }) => {
        if (!alive) return;
        if (error) console.warn('[AppsPage] fetch error:', error.message);
        setPlatforms(data || []);
        setLoading(false);
      }, (err) => {
        if (!alive) return;
        console.warn('[AppsPage] unexpected error:', err);
        setLoading(false);
      });
    return () => { alive = false; };
  }, []);

  // Group by type
  const byType = platforms.reduce((acc, p) => {
    (acc[p.type] ||= []).push(p);
    return acc;
  }, {});

  return (
    <>
      <Helmet>
        <title>Partner Apps — SnapGain</title>
      </Helmet>

      <div className="container mx-auto px-4 py-8 max-w-5xl space-y-6">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-center space-y-3"
        >
          <div className="w-14 h-14 mx-auto bg-gradient-to-r from-primary to-secondary rounded-2xl flex items-center justify-center text-white shadow-md">
            <Sparkles className="w-7 h-7" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
            Partner Apps
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto text-sm">
            Many of the rewards SnapGain compares come from these apps. Sign
            up via the buttons below — it&rsquo;s free, and signing up via
            SnapGain often unlocks a welcome bonus.
          </p>
        </motion.div>

        {loading ? (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              Loading partners…
            </CardContent>
          </Card>
        ) : platforms.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              No partner apps configured yet.
            </CardContent>
          </Card>
        ) : (
          Object.entries(byType).map(([type, items]) => {
            const meta = TYPE_META[type] || TYPE_META.cashback;
            const Icon = meta.Icon;
            return (
              <section key={type} className="space-y-3">
                <div className="flex items-center gap-2">
                  <div
                    className={cn(
                      'w-9 h-9 rounded-xl bg-gradient-to-br text-white flex items-center justify-center shadow-sm',
                      meta.accent
                    )}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <h2 className="text-lg font-bold">{meta.label}</h2>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                    {items.length}
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {items.map((p) => (
                    <PartnerCard key={p.id} platform={p} />
                  ))}
                </div>
              </section>
            );
          })
        )}

        {/* Disclosure */}
        <Card className="bg-muted/30 border-dashed">
          <CardContent className="py-4 text-xs text-muted-foreground space-y-1.5">
            <p className="font-semibold text-foreground">
              How these partnerships work
            </p>
            <p>
              When you sign up to a platform through SnapGain, we may earn a
              small referral bonus. This keeps SnapGain free for you. We never
              recommend a platform based on its commission — we only list ones
              we use and trust.
            </p>
            <p>
              SnapGain is not an official partner of these brands. Each
              platform&rsquo;s own terms apply.
            </p>
          </CardContent>
        </Card>
      </div>
    </>
  );
}

function PartnerCard({ platform }) {
  return (
    <Card className="card-hover h-full">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-base leading-tight">
            {platform.name}
          </CardTitle>
          {platform.base_rate_display && (
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-primary/10 text-primary whitespace-nowrap shrink-0">
              {platform.base_rate_display}
            </span>
          )}
        </div>
        {platform.notes && (
          <CardDescription className="text-xs leading-snug">
            {platform.notes}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent className="pt-0">
        <Button asChild className="w-full" size="sm">
          <a
            href={platform.affiliate_url}
            target="_blank"
            rel="noopener noreferrer"
          >
            Sign up
            <ExternalLink className="w-3.5 h-3.5 ml-1.5" />
          </a>
        </Button>
      </CardContent>
    </Card>
  );
}

export default AppsPage;
