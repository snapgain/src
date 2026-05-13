import React, { useMemo } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Flame,
  ShoppingCart,
  Gift,
  Heart,
  Search,
  Bookmark,
  Wallet,
  CheckCircle2,
  Star,
  ArrowRight,
  Check,
} from 'lucide-react';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  useRecentSearches,
  useSavedStrategies,
  useUserFavourites,
  useUserWallet,
} from '@/hooks/useUserState';
import { useSubscription } from '@/hooks/useSubscription';
import { useTranslation } from '@/lib/i18n';

/**
 * Format a date as a friendly "X ago" — used by the Recent Activities feed.
 */
function fmtAgo(iso) {
  if (!iso) return '';
  const ms = Date.now() - new Date(iso).getTime();
  if (Number.isNaN(ms) || ms < 0) return '';
  const mins = Math.round(ms / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins} min${mins === 1 ? '' : 's'} ago`;
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return `${hrs} hour${hrs === 1 ? '' : 's'} ago`;
  const days = Math.round(hrs / 24);
  if (days < 30) return `${days} day${days === 1 ? '' : 's'} ago`;
  const months = Math.round(days / 30);
  return `${months} month${months === 1 ? '' : 's'} ago`;
}

const QUICK_ACTIONS = [
  {
    labelKey: 'dashboard.hotDeals',
    subKey: 'dashboard.hotDealsSub',
    to: '/hot-deals',
    Icon: Flame,
    gradient: 'from-orange-400 to-red-500',
  },
  {
    labelKey: 'dashboard.highestSupermarket',
    subKey: 'dashboard.highestSupermarketSub',
    to: '/compare?category=grocery',
    Icon: ShoppingCart,
    gradient: 'from-green-400 to-emerald-600',
  },
  {
    labelKey: 'dashboard.topGiftcards',
    subKey: 'dashboard.topGiftcardsSub',
    to: '/compare?type=gift_card',
    Icon: Gift,
    gradient: 'from-primary to-secondary',
  },
  {
    labelKey: 'dashboard.favouriteStores',
    subKey: 'dashboard.favouriteStoresSub',
    to: '/profile#favourites',
    Icon: Heart,
    gradient: 'from-pink-400 to-secondary',
  },
];

function HomePage() {
  const { user } = useAuth();
  const { t } = useTranslation();
  const { searches } = useRecentSearches();
  const { strategies } = useSavedStrategies();
  const { favourites } = useUserFavourites();
  const wallet = useUserWallet();
  const sub = useSubscription();

  const firstName =
    user?.user_metadata?.name?.split(' ')[0] ||
    user?.email?.split('@')[0] ||
    'there';

  // ─── Recent Activities: merge real events from multiple sources ────
  const activities = useMemo(() => {
    const items = [];

    for (const s of (searches || []).slice(0, 10)) {
      items.push({
        id: `search-${s.id}`,
        kind: 'search',
        title: `${t('dashboard.searchedFor')} "${s.query}"`,
        at: s.searched_at,
      });
    }
    for (const st of (strategies || []).slice(0, 10)) {
      const where = st.store?.name || '—';
      items.push({
        id: `strategy-${st.id}`,
        kind: 'strategy',
        title: `${t('dashboard.savedStrategyFor')} ${where}`,
        at: st.created_at,
      });
    }
    for (const f of (favourites || []).slice(0, 10)) {
      const where = f.store?.name || '—';
      items.push({
        id: `fav-${f.store_id}`,
        kind: 'favorite',
        title: t('dashboard.addedToFavorites', { store: where }),
        at: f.created_at,
      });
    }
    // Onboarding-complete pseudo-event so a brand-new user still sees one row
    if (sub.profile?.onboarding_done) {
      items.push({
        id: 'onboarding',
        kind: 'onboarding',
        title: t('dashboard.profileSetupCompleted'),
        at: sub.profile?.updated_at || sub.profile?.created_at || null,
      });
    }

    return items
      .filter((i) => i.at)
      .sort((a, b) => new Date(b.at).getTime() - new Date(a.at).getTime())
      .slice(0, 6);
  }, [searches, strategies, favourites, sub.profile]);

  // ─── Your Setup: live counts and overall completion ────────────────
  const setup = useMemo(() => {
    const banks = wallet.cards?.length || 0; // bank-issued cards
    const cards = wallet.cards?.length || 0;
    const programs =
      (wallet.milesPrograms?.length || 0) +
      (wallet.cashbackPlatforms?.length || 0);
    const favs = favourites?.length || 0;

    const filledSections = [banks > 0, cards > 0, programs > 0, favs > 0].filter(
      Boolean
    ).length;
    const completion = Math.round((filledSections / 4) * 100);

    return { banks, cards, programs, favs, completion };
  }, [wallet, favourites]);

  return (
    <>
      <Helmet>
        <title>Dashboard — SnapGain</title>
      </Helmet>

      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* ─── Welcome banner ──────────────────────────────────────── */}
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="rounded-2xl px-6 py-7 md:py-8 bg-gradient-to-r from-primary via-primary to-secondary text-primary-foreground shadow-lg"
        >
          <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
            {t('dashboard.welcomeBack')}, {firstName}!{' '}
            <span aria-hidden="true">👋</span>
          </h1>
          <p className="mt-1.5 text-primary-foreground/90 text-sm md:text-base">
            {t('dashboard.subtitle')}
          </p>
        </motion.section>

        {/* ─── Quick Actions ──────────────────────────────────────── */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold">{t('dashboard.quickActions')}</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            {QUICK_ACTIONS.map(({ labelKey, subKey, to, Icon, gradient }) => (
              <Link key={labelKey} to={to}>
                <Card className="card-hover h-full">
                  <CardContent className="p-4 md:p-5 space-y-2.5">
                    <div
                      className={`w-10 h-10 rounded-xl bg-gradient-to-br ${gradient} text-white flex items-center justify-center shadow-sm`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="font-semibold leading-tight">
                      {t(labelKey)}
                    </div>
                    <p className="text-xs text-muted-foreground leading-snug">
                      {t(subKey)}
                    </p>
                    <div className="flex items-center text-xs font-medium text-primary pt-1">
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        {/* ─── Two-column: Recent Activities + Your Setup ─────────── */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Recent Activities */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-primary" />
                {t('dashboard.recentActivities')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2.5">
              {activities.length === 0 ? (
                <p className="text-sm text-muted-foreground py-4 text-center">
                  {t('dashboard.noActivityYet')}
                </p>
              ) : (
                activities.map((a) => (
                  <div
                    key={a.id}
                    className="flex items-start gap-3 py-2 border-b last:border-b-0"
                  >
                    <ActivityIcon kind={a.kind} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{a.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {fmtAgo(a.at)}
                      </p>
                    </div>
                  </div>
                ))
              )}
              {activities.length > 0 && (
                <div className="pt-2">
                  <Link
                    to="/compare"
                    className="text-xs font-medium text-primary hover:underline inline-flex items-center"
                  >
                    {t('dashboard.viewAllActivities')}{' '}
                    <ArrowRight className="w-3 h-3 ml-1" />
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Your Setup */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between gap-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Star className="w-5 h-5 text-primary" />
                  {t('dashboard.yourSetup')}
                </CardTitle>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-light-green text-accent-foreground">
                  {setup.completion}%
                </span>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <SetupRow label={t('dashboard.banks')} count={setup.banks} />
              <SetupRow label={t('dashboard.cards')} count={setup.cards} />
              <SetupRow label={t('dashboard.programs')} count={setup.programs} />
              <SetupRow
                label={t('dashboard.favoriteStores')}
                count={setup.favs}
              />

              <div className="pt-3 border-t">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    {t('dashboard.profileCompletion')}
                  </span>
                  <span className="font-bold gradient-text">
                    {setup.completion}%
                  </span>
                </div>
                <div className="h-2 rounded-full bg-muted mt-2 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-primary to-secondary transition-all"
                    style={{ width: `${setup.completion}%` }}
                  />
                </div>
                {setup.completion < 100 && (
                  <Link
                    to="/profile"
                    className="text-xs font-medium text-primary hover:underline inline-flex items-center mt-3"
                  >
                    {t('dashboard.completeProfile')}{' '}
                    <ArrowRight className="w-3 h-3 ml-1" />
                  </Link>
                )}
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </>
  );
}

function ActivityIcon({ kind }) {
  const map = {
    search: { Icon: Search, bg: 'bg-light-pink/60 text-secondary' },
    strategy: { Icon: Bookmark, bg: 'bg-primary/10 text-primary' },
    favorite: { Icon: Heart, bg: 'bg-pink-100 text-pink-600' },
    onboarding: { Icon: CheckCircle2, bg: 'bg-light-green text-accent-foreground' },
  };
  const { Icon, bg } = map[kind] || map.search;
  return (
    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${bg}`}>
      <Icon className="w-4 h-4" />
    </div>
  );
}

function SetupRow({ label, count }) {
  const has = count > 0;
  return (
    <div className="flex items-center justify-between text-sm">
      <div className="flex items-center gap-2">
        {has ? (
          <Check className="w-4 h-4 text-green-600" />
        ) : (
          <div className="w-4 h-4 rounded-full border-2 border-muted" />
        )}
        <span className={has ? '' : 'text-muted-foreground'}>{label}</span>
      </div>
      <span
        className={`font-semibold px-2 py-0.5 rounded-full text-xs ${
          has ? 'bg-light-green text-accent-foreground' : 'bg-muted text-muted-foreground'
        }`}
      >
        {count}
      </span>
    </div>
  );
}

export default HomePage;
