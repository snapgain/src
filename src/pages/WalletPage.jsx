import React, { useMemo, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Wallet,
  ArrowLeft,
  CreditCard,
  Plane,
  PiggyBank,
  Plus,
  Trash2,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useUserWallet } from '@/hooks/useUserState';
import { useMilesPrograms, usePlatforms } from '@/hooks/useCatalog';

const SELECT_CLS =
  'w-full h-11 px-3 rounded-xl border-2 border-primary/30 bg-background text-base focus:outline-none focus:border-primary';

// =====================================================================
// Cashback platforms section
// =====================================================================

function CashbackSection({ wallet }) {
  const { cashbackPlatforms, addCashbackPlatform, removeCashbackPlatform } = wallet;
  const { platforms } = usePlatforms({ type: 'cashback' });
  const [adding, setAdding] = useState(false);
  const [platformId, setPlatformId] = useState('');
  const [balance, setBalance] = useState('');

  const ownedIds = new Set(cashbackPlatforms.map((c) => c.platform_id));
  const available = platforms.filter((p) => !ownedIds.has(p.id));

  const reset = () => {
    setAdding(false);
    setPlatformId('');
    setBalance('');
  };

  const handleAdd = async () => {
    if (!platformId) return;
    await addCashbackPlatform({ platformId, balance: balance ? Number(balance) : 0 });
    reset();
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <PiggyBank className="w-5 h-5" />
            </div>
            <div>
              <CardTitle className="text-lg">Cashback platforms</CardTitle>
              <CardDescription className="mt-1">
                The cashback sites you actually use. Personalised comparisons
                will only suggest these.
              </CardDescription>
            </div>
          </div>
          {!adding && available.length > 0 && (
            <Button size="sm" variant="outline" onClick={() => setAdding(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {cashbackPlatforms.length === 0 && !adding && (
          <p className="text-sm text-muted-foreground">
            No cashback platforms added yet.
          </p>
        )}

        {cashbackPlatforms.map((c) => (
          <div
            key={c.id}
            className="flex items-center justify-between gap-3 p-3 rounded-xl border bg-background"
          >
            <div>
              <div className="font-semibold">{c.platform?.name}</div>
              <div className="text-xs text-muted-foreground">
                Balance £{Number(c.balance || 0).toFixed(2)}
              </div>
            </div>
            <button
              onClick={() => removeCashbackPlatform(c.id)}
              className="text-muted-foreground hover:text-destructive p-1"
              aria-label="Remove platform"
              type="button"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}

        {adding && (
          <div className="space-y-3 border rounded-xl p-4 bg-muted/30">
            <div className="space-y-1">
              <Label htmlFor="cb-platform">Platform</Label>
              <select
                id="cb-platform"
                value={platformId}
                onChange={(e) => setPlatformId(e.target.value)}
                className={SELECT_CLS}
              >
                <option value="">Pick a platform…</option>
                {available.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                    {p.base_rate_display ? ` — ${p.base_rate_display}` : ''}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1">
              <Label htmlFor="cb-balance">Current balance (£, optional)</Label>
              <Input
                id="cb-balance"
                type="number"
                min="0"
                step="0.01"
                value={balance}
                onChange={(e) => setBalance(e.target.value)}
                placeholder="0.00"
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleAdd} disabled={!platformId}>
                Save
              </Button>
              <Button variant="ghost" onClick={reset}>
                <X className="w-4 h-4 mr-1" />
                Cancel
              </Button>
            </div>
          </div>
        )}

        {!adding && available.length === 0 && cashbackPlatforms.length > 0 && (
          <p className="text-xs text-muted-foreground">
            You&rsquo;ve added every cashback platform we track.
          </p>
        )}
      </CardContent>
    </Card>
  );
}

// =====================================================================
// Miles programs section
// =====================================================================

function MilesSection({ wallet }) {
  const { milesPrograms: owned, addMilesProgram, removeMilesProgram } = wallet;
  const { programs } = useMilesPrograms();
  const [adding, setAdding] = useState(false);
  const [programId, setProgramId] = useState('');
  const [balance, setBalance] = useState('');
  const [accountNumber, setAccountNumber] = useState('');

  const ownedIds = new Set(owned.map((m) => m.miles_program_id));
  const available = programs.filter((p) => !ownedIds.has(p.id));

  const reset = () => {
    setAdding(false);
    setProgramId('');
    setBalance('');
    setAccountNumber('');
  };

  const handleAdd = async () => {
    if (!programId) return;
    await addMilesProgram({
      milesProgramId: programId,
      balance: balance ? Number(balance) : 0,
      accountNumber: accountNumber || null,
    });
    reset();
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <Plane className="w-5 h-5" />
            </div>
            <div>
              <CardTitle className="text-lg">Miles &amp; loyalty programs</CardTitle>
              <CardDescription className="mt-1">
                Airline programs and loyalty schemes you collect. We use the
                conversion rates to value points in £ when comparing.
              </CardDescription>
            </div>
          </div>
          {!adding && available.length > 0 && (
            <Button size="sm" variant="outline" onClick={() => setAdding(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {owned.length === 0 && !adding && (
          <p className="text-sm text-muted-foreground">
            No programs added yet.
          </p>
        )}

        {owned.map((m) => {
          const rate = Number(m.miles_program?.conversion_rate || 0);
          const gbpValue = Number(m.balance || 0) * rate;
          return (
            <div
              key={m.id}
              className="flex items-center justify-between gap-3 p-3 rounded-xl border bg-background"
            >
              <div>
                <div className="font-semibold">{m.miles_program?.name}</div>
                <div className="text-xs text-muted-foreground">
                  {Math.round(Number(m.balance || 0)).toLocaleString()} pts ·
                  ≈ £{gbpValue.toFixed(2)}
                </div>
              </div>
              <button
                onClick={() => removeMilesProgram(m.id)}
                className="text-muted-foreground hover:text-destructive p-1"
                aria-label="Remove program"
                type="button"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          );
        })}

        {adding && (
          <div className="space-y-3 border rounded-xl p-4 bg-muted/30">
            <div className="space-y-1">
              <Label htmlFor="mp-program">Program</Label>
              <select
                id="mp-program"
                value={programId}
                onChange={(e) => setProgramId(e.target.value)}
                className={SELECT_CLS}
              >
                <option value="">Pick a program…</option>
                {available.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1">
              <Label htmlFor="mp-balance">Balance (points, optional)</Label>
              <Input
                id="mp-balance"
                type="number"
                min="0"
                value={balance}
                onChange={(e) => setBalance(e.target.value)}
                placeholder="0"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="mp-account">Account number (optional)</Label>
              <Input
                id="mp-account"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                placeholder="Membership reference"
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleAdd} disabled={!programId}>
                Save
              </Button>
              <Button variant="ghost" onClick={reset}>
                <X className="w-4 h-4 mr-1" />
                Cancel
              </Button>
            </div>
          </div>
        )}

        {!adding && available.length === 0 && owned.length > 0 && (
          <p className="text-xs text-muted-foreground">
            You&rsquo;ve added every program we track.
          </p>
        )}
      </CardContent>
    </Card>
  );
}

// =====================================================================
// Cards section
// =====================================================================

function CardsSection({ wallet }) {
  const { cards, addCard, removeCard } = wallet;
  const { platforms } = usePlatforms({ type: 'card' });
  const [adding, setAdding] = useState(false);
  const [cardProvider, setCardProvider] = useState('');
  const [nickname, setNickname] = useState('');
  const [last4, setLast4] = useState('');

  const ownedSlugs = new Set(cards.map((c) => c.card_provider));
  const available = platforms.filter((p) => !ownedSlugs.has(p.slug || p.code));

  const reset = () => {
    setAdding(false);
    setCardProvider('');
    setNickname('');
    setLast4('');
  };

  const handleAdd = async () => {
    if (!cardProvider) return;
    await addCard({
      cardProvider,
      nickname: nickname || null,
      last4: last4 || null,
    });
    reset();
  };

  const slugToName = useMemo(() => {
    const m = new Map();
    platforms.forEach((p) => m.set(p.slug || p.code, p.name));
    return m;
  }, [platforms]);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <CardTitle className="text-lg">Cards</CardTitle>
              <CardDescription className="mt-1">
                Credit and debit cards you carry. Used to highlight card-linked
                offers and stack the right card-points routes.
              </CardDescription>
            </div>
          </div>
          {!adding && available.length > 0 && (
            <Button size="sm" variant="outline" onClick={() => setAdding(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {cards.length === 0 && !adding && (
          <p className="text-sm text-muted-foreground">No cards added yet.</p>
        )}

        {cards.map((c) => (
          <div
            key={c.id}
            className="flex items-center justify-between gap-3 p-3 rounded-xl border bg-background"
          >
            <div>
              <div className="font-semibold">
                {slugToName.get(c.card_provider) || c.card_provider}
              </div>
              <div className="text-xs text-muted-foreground">
                {c.nickname && <>{c.nickname}</>}
                {c.nickname && c.last_4 ? ' · ' : ''}
                {c.last_4 && <>•••• {c.last_4}</>}
                {!c.nickname && !c.last_4 && 'no nickname'}
              </div>
            </div>
            <button
              onClick={() => removeCard(c.id)}
              className="text-muted-foreground hover:text-destructive p-1"
              aria-label="Remove card"
              type="button"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}

        {adding && (
          <div className="space-y-3 border rounded-xl p-4 bg-muted/30">
            <div className="space-y-1">
              <Label htmlFor="card-provider">Card</Label>
              <select
                id="card-provider"
                value={cardProvider}
                onChange={(e) => setCardProvider(e.target.value)}
                className={SELECT_CLS}
              >
                <option value="">Pick a card…</option>
                {available.map((p) => (
                  <option key={p.id} value={p.slug || p.code}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="card-nickname">Nickname (optional)</Label>
                <Input
                  id="card-nickname"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  placeholder="e.g. travel card"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="card-last4">Last 4 (optional)</Label>
                <Input
                  id="card-last4"
                  value={last4}
                  onChange={(e) => setLast4(e.target.value.replace(/\D/g, '').slice(0, 4))}
                  placeholder="1234"
                  maxLength={4}
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleAdd} disabled={!cardProvider}>
                Save
              </Button>
              <Button variant="ghost" onClick={reset}>
                <X className="w-4 h-4 mr-1" />
                Cancel
              </Button>
            </div>
          </div>
        )}

        {!adding && available.length === 0 && cards.length > 0 && (
          <p className="text-xs text-muted-foreground">
            You&rsquo;ve added every card we track.
          </p>
        )}
      </CardContent>
    </Card>
  );
}

// =====================================================================
// Page
// =====================================================================

function WalletPage() {
  const wallet = useUserWallet();

  return (
    <>
      <Helmet>
        <title>My wallet — SnapGain</title>
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
            <Wallet className="w-8 h-8 text-primary" />
            My wallet
          </h1>
          <p className="text-muted-foreground mt-1 max-w-2xl">
            Tell SnapGain which cashback platforms, airline programs, and cards
            you actually use. Switch on{' '}
            <span className="font-medium">Show only my wallet</span> on the
            comparison page and we&rsquo;ll only suggest routes you can act on.
          </p>
        </motion.section>

        {wallet.loading ? (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              Loading your wallet…
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <CashbackSection wallet={wallet} />
            <MilesSection wallet={wallet} />
            <div className="lg:col-span-2">
              <CardsSection wallet={wallet} />
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default WalletPage;
