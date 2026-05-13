import React, { useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import {
  User,
  Building,
  CreditCard,
  Plane,
  Heart,
  Edit3,
  Save,
  Globe,
  Info,
  CheckCircle2,
  X,
} from 'lucide-react';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useToast } from '@/components/ui/use-toast';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PillMultiSelect } from '@/components/PillMultiSelect';
import { useStores, useMilesPrograms, usePlatforms } from '@/hooks/useCatalog';
import { useUserWallet, useUserFavourites } from '@/hooks/useUserState';
import {
  loadUserPrefs,
  saveUserPrefs,
  UK_BANKS,
  LANGUAGES,
  COUNTRIES,
  PRONOUN_PRESETS,
} from '@/lib/userPrefs';
import { useTranslation } from '@/lib/i18n';

function ProfilePage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const { t, setLanguage } = useTranslation();

  // ─── Catalogs ───────────────────────────────────────────────────
  const { stores } = useStores();
  const { programs: milesPrograms } = useMilesPrograms();
  const { platforms: cardPlatforms } = usePlatforms({ type: 'card' });
  const { platforms: cashbackPlatforms } = usePlatforms({ type: 'cashback' });
  const { platforms: giftCardPlatforms } = usePlatforms({ type: 'gift_card' });

  // ─── Wallet (cards + miles + cashback) and favourites ───────────
  const wallet = useUserWallet();
  const favourites = useUserFavourites();

  // ─── Personal preferences (localStorage + Supabase) ─────────────
  const [prefs, setPrefs] = useState(null);
  const [savingPrefs, setSavingPrefs] = useState(false);
  const [editingInfo, setEditingInfo] = useState(false);

  useEffect(() => {
    let alive = true;
    if (!user) {
      setPrefs(null);
      return;
    }
    loadUserPrefs(user.id).then((p) => {
      if (alive) setPrefs(p);
    });
    return () => {
      alive = false;
    };
  }, [user]);

  const handleSaveInfo = async () => {
    if (!user || !prefs) return;
    setSavingPrefs(true);
    try {
      await saveUserPrefs(user.id, prefs);
      toast({
        title: t('profile.updated'),
        description: t('profile.updatedDesc'),
      });
      setEditingInfo(false);
    } finally {
      setSavingPrefs(false);
    }
  };

  // ─── Selected ID sets for each multi-select ─────────────────────
  const selectedBankIds = useMemo(
    () => new Set(prefs?.bankIds || []),
    [prefs]
  );
  const selectedCardIds = useMemo(
    () => new Set(wallet.cards.map((c) => c.card_provider).filter(Boolean)),
    [wallet.cards]
  );
  const selectedProgramIds = useMemo(() => {
    const s = new Set();
    wallet.milesPrograms.forEach((m) => s.add(`miles:${m.miles_program_id}`));
    wallet.cashbackPlatforms.forEach((c) => s.add(`platform:${c.platform_id}`));
    return s;
  }, [wallet]);
  const selectedStoreIds = useMemo(
    () => new Set(favourites.favourites.map((f) => f.store_id)),
    [favourites.favourites]
  );

  // ─── Options for each multi-select ──────────────────────────────
  const bankOptions = UK_BANKS;

  const cardOptions = useMemo(() => {
    const fromPlatforms = (cardPlatforms || []).map((p) => ({
      id: p.code || p.slug || p.name,
      label: p.name,
      sublabel: p.base_rate_display || undefined,
    }));
    // If the catalog is empty (no rows), inline a small starter list so
    // the user can at least express common UK cards.
    if (fromPlatforms.length > 0) return fromPlatforms;
    return [
      { id: 'amex_gold', label: 'American Express Gold' },
      { id: 'amex_platinum', label: 'American Express Platinum' },
      { id: 'visa_cashback', label: 'Visa Cashback' },
      { id: 'mastercard_world', label: 'Mastercard World' },
      { id: 'barclaycard_rewards', label: 'Barclaycard Rewards' },
      { id: 'natwest_reward', label: 'NatWest Reward' },
      { id: 'amazon_barclaycard', label: 'Amazon Barclaycard' },
      { id: 'chase_credit', label: 'Chase (debit cashback)' },
    ];
  }, [cardPlatforms]);

  const programOptions = useMemo(() => {
    const miles = (milesPrograms || []).map((m) => ({
      id: `miles:${m.id}`,
      label: m.name,
      sublabel: 'Miles & points',
    }));
    const cashback = (cashbackPlatforms || []).map((p) => ({
      id: `platform:${p.id}`,
      label: p.name,
      sublabel: 'Cashback',
    }));
    const giftCards = (giftCardPlatforms || []).map((p) => ({
      id: `platform:${p.id}`,
      label: p.name,
      sublabel: 'Gift cards',
    }));
    return [...miles, ...cashback, ...giftCards];
  }, [milesPrograms, cashbackPlatforms, giftCardPlatforms]);

  const storeOptions = useMemo(
    () =>
      (stores || []).map((s) => ({
        id: s.id,
        label: s.name,
        sublabel: s.category || undefined,
      })),
    [stores]
  );

  // ─── Handlers for each multi-select ─────────────────────────────
  const handleAddBank = async (id) => {
    if (!prefs) return;
    const next = { ...prefs, bankIds: [...(prefs.bankIds || []), id] };
    setPrefs(next);
    await saveUserPrefs(user.id, next);
  };
  const handleRemoveBank = async (id) => {
    if (!prefs) return;
    const next = {
      ...prefs,
      bankIds: (prefs.bankIds || []).filter((x) => x !== id),
    };
    setPrefs(next);
    await saveUserPrefs(user.id, next);
  };

  const handleAddCard = async (providerCode) => {
    const opt = cardOptions.find((c) => c.id === providerCode);
    if (!opt) return;
    await wallet.addCard({ cardProvider: providerCode, nickname: opt.label });
  };
  const handleRemoveCard = async (providerCode) => {
    const row = wallet.cards.find((c) => c.card_provider === providerCode);
    if (row) await wallet.removeCard(row.id);
  };

  const handleAddProgram = async (id) => {
    if (id.startsWith('miles:')) {
      await wallet.addMilesProgram({ milesProgramId: id.slice(6) });
    } else if (id.startsWith('platform:')) {
      await wallet.addCashbackPlatform({ platformId: id.slice(9) });
    }
  };
  const handleRemoveProgram = async (id) => {
    if (id.startsWith('miles:')) {
      const row = wallet.milesPrograms.find(
        (m) => m.miles_program_id === id.slice(6)
      );
      if (row) await wallet.removeMilesProgram(row.id);
    } else if (id.startsWith('platform:')) {
      const row = wallet.cashbackPlatforms.find(
        (c) => c.platform_id === id.slice(9)
      );
      if (row) await wallet.removeCashbackPlatform(row.id);
    }
  };

  const handleToggleStore = async (id) => {
    await favourites.toggle(id);
  };

  // ─── Profile completion ─────────────────────────────────────────
  const completion = useMemo(() => {
    const checks = [
      selectedBankIds.size > 0,
      selectedCardIds.size > 0,
      selectedProgramIds.size > 0,
      selectedStoreIds.size > 0,
      Boolean(prefs?.preferredName || user?.user_metadata?.name),
    ];
    const filled = checks.filter(Boolean).length;
    return Math.round((filled / checks.length) * 100);
  }, [
    selectedBankIds.size,
    selectedCardIds.size,
    selectedProgramIds.size,
    selectedStoreIds.size,
    prefs?.preferredName,
    user?.user_metadata?.name,
  ]);

  if (!prefs) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            {t('profile.loading')}
          </CardContent>
        </Card>
      </div>
    );
  }

  const updatePref = (patch) => {
    setPrefs((p) => ({ ...p, ...patch }));
    // Apply language live so the user can immediately see the effect.
    if (patch.language) setLanguage(patch.language);
  };

  return (
    <>
      <Helmet>
        <title>Profile — SnapGain</title>
      </Helmet>

      <div className="container mx-auto px-4 py-8 max-w-3xl space-y-5">
        {/* ─── Title ─────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-center space-y-2"
        >
          <div className="w-14 h-14 mx-auto bg-gradient-to-r from-primary to-secondary rounded-2xl flex items-center justify-center text-white shadow-md">
            <User className="w-7 h-7" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold">{t('profile.title')}</h1>
          <p className="text-muted-foreground text-sm">
            {t('profile.subtitle')}
          </p>
        </motion.div>

        {/* ─── Personal Information ──────────────────────────────── */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <User className="w-5 h-5 text-primary" />
              {t('profile.personalInformation')}
            </CardTitle>
            <Button
              size="sm"
              variant={editingInfo ? 'default' : 'ghost'}
              onClick={() => (editingInfo ? handleSaveInfo() : setEditingInfo(true))}
              disabled={savingPrefs}
            >
              {editingInfo ? (
                <>
                  <Save className="w-3.5 h-3.5 mr-1.5" />
                  {t('profile.save')}
                </>
              ) : (
                <>
                  <Edit3 className="w-3.5 h-3.5 mr-1.5" />
                  {t('profile.edit')}
                </>
              )}
            </Button>
          </CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label={t('profile.fullName')}>
              <ReadOnly value={user?.user_metadata?.name || '—'} />
            </Field>

            <Field
              label={t('profile.preferredName')}
              hint={t('profile.preferredNameHint')}
            >
              {editingInfo ? (
                <Input
                  value={prefs.preferredName}
                  onChange={(e) => updatePref({ preferredName: e.target.value })}
                  placeholder={t('profile.preferredNamePlaceholder')}
                />
              ) : (
                <ReadOnly value={prefs.preferredName || '—'} />
              )}
            </Field>

            <Field label={t('profile.email')}>
              <ReadOnly value={user?.email || '—'} />
            </Field>

            <Field label={t('profile.phone')} hint={t('profile.phoneHint')}>
              {editingInfo ? (
                <Input
                  type="tel"
                  value={prefs.phone}
                  onChange={(e) => updatePref({ phone: e.target.value })}
                  placeholder="+44 7XXX XXXXXX"
                />
              ) : (
                <ReadOnly value={prefs.phone || '—'} />
              )}
            </Field>

            <Field
              label={t('profile.pronouns')}
              hint={t('profile.pronounsHint')}
            >
              {editingInfo ? (
                <select
                  value={prefs.pronouns}
                  onChange={(e) => updatePref({ pronouns: e.target.value })}
                  className="w-full h-10 px-3 rounded-md border bg-background text-sm"
                >
                  {PRONOUN_PRESETS.map((p) => (
                    <option key={p || 'blank'} value={p}>
                      {p || '—'}
                    </option>
                  ))}
                </select>
              ) : (
                <ReadOnly value={prefs.pronouns || '—'} />
              )}
            </Field>

            <Field
              label={t('profile.location')}
              hint={t('profile.locationHint')}
            >
              {editingInfo ? (
                <Input
                  value={prefs.location}
                  onChange={(e) => updatePref({ location: e.target.value })}
                  placeholder={t('profile.locationPlaceholder')}
                />
              ) : (
                <ReadOnly value={prefs.location || '—'} />
              )}
            </Field>

            <Field label={t('profile.language')} hint={t('profile.languageHint')}>
              {editingInfo ? (
                <select
                  value={prefs.language}
                  onChange={(e) => updatePref({ language: e.target.value })}
                  className="w-full h-10 px-3 rounded-md border bg-background text-sm"
                >
                  {LANGUAGES.map((l) => (
                    <option key={l.id} value={l.id}>
                      {l.label}
                    </option>
                  ))}
                </select>
              ) : (
                <ReadOnly
                  value={
                    LANGUAGES.find((l) => l.id === prefs.language)?.label || '—'
                  }
                />
              )}
            </Field>

            <Field
              label={t('profile.homeCountry')}
              hint={t('profile.homeCountryHint')}
            >
              {editingInfo ? (
                <select
                  value={prefs.homeCountry}
                  onChange={(e) => {
                    const c = COUNTRIES.find((x) => x.id === e.target.value);
                    updatePref({
                      homeCountry: e.target.value,
                      displayCurrency: c?.currency || 'GBP',
                    });
                  }}
                  className="w-full h-10 px-3 rounded-md border bg-background text-sm"
                >
                  {COUNTRIES.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.label} ({c.currency})
                    </option>
                  ))}
                </select>
              ) : (
                <ReadOnly
                  value={
                    COUNTRIES.find((c) => c.id === prefs.homeCountry)?.label ||
                    '—'
                  }
                />
              )}
            </Field>
          </CardContent>
        </Card>

        {/* ─── My Banks ──────────────────────────────────────────── */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Building className="w-5 h-5 text-primary" />
              {t('profile.myBanks')}
              <CountBadge n={selectedBankIds.size} />
            </CardTitle>
            <CardDescription>{t('profile.myBanksDesc')}</CardDescription>
          </CardHeader>
          <CardContent>
            <PillMultiSelect
              options={bankOptions}
              selectedIds={selectedBankIds}
              onAdd={handleAddBank}
              onRemove={handleRemoveBank}
              placeholder={t('profile.selectBank')}
            />
          </CardContent>
        </Card>

        {/* ─── My Credit Cards ───────────────────────────────────── */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-primary" />
              {t('profile.myCards')}
              <CountBadge n={selectedCardIds.size} />
            </CardTitle>
            <CardDescription>{t('profile.myCardsDesc')}</CardDescription>
          </CardHeader>
          <CardContent>
            <PillMultiSelect
              options={cardOptions}
              selectedIds={selectedCardIds}
              onAdd={handleAddCard}
              onRemove={handleRemoveCard}
              placeholder={t('profile.selectCard')}
              busy={wallet.loading}
            />
          </CardContent>
        </Card>

        {/* ─── Rewards Programs ──────────────────────────────────── */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Plane className="w-5 h-5 text-primary" />
              {t('profile.rewardsPrograms')}
              <CountBadge n={selectedProgramIds.size} />
            </CardTitle>
            <CardDescription>{t('profile.rewardsProgramsDesc')}</CardDescription>
          </CardHeader>
          <CardContent>
            <PillMultiSelect
              options={programOptions}
              selectedIds={selectedProgramIds}
              onAdd={handleAddProgram}
              onRemove={handleRemoveProgram}
              placeholder={t('profile.selectProgram')}
              busy={wallet.loading}
            />
          </CardContent>
        </Card>

        {/* ─── Favorite Stores ───────────────────────────────────── */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Heart className="w-5 h-5 text-primary" />
              {t('profile.favoriteStores')}
              <CountBadge n={selectedStoreIds.size} />
            </CardTitle>
            <CardDescription>{t('profile.favoriteStoresDesc')}</CardDescription>
          </CardHeader>
          <CardContent>
            <PillMultiSelect
              options={storeOptions}
              selectedIds={selectedStoreIds}
              onAdd={handleToggleStore}
              onRemove={handleToggleStore}
              placeholder={t('profile.selectStore')}
              busy={favourites.loading}
            />
          </CardContent>
        </Card>

        {/* ─── Profile Completion ────────────────────────────────── */}
        <Card className="bg-gradient-to-br from-light-pink/30 to-light-green/30 border-primary/30">
          <CardContent className="py-5 flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <p className="font-semibold text-foreground">
                  {t('profile.profileCompletion')}: {completion}%
                </p>
                <p className="text-xs text-muted-foreground">
                  {t('profile.completionHint')}
                </p>
              </div>
            </div>
            <div className="flex-1 min-w-[120px] max-w-xs">
              <div className="h-2 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-primary to-secondary transition-all"
                  style={{ width: `${completion}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}

function Field({ label, hint, children }) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center gap-1.5">
        <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          {label}
        </Label>
        {hint && (
          <span title={hint} className="text-muted-foreground cursor-help">
            <Info className="w-3 h-3" />
          </span>
        )}
      </div>
      {children}
    </div>
  );
}

function ReadOnly({ value }) {
  return (
    <div className="h-10 px-3 rounded-md bg-muted/40 flex items-center text-sm">
      {value}
    </div>
  );
}

function CountBadge({ n }) {
  if (!n) return null;
  return (
    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-light-green text-accent-foreground">
      {n}
    </span>
  );
}

export default ProfilePage;
