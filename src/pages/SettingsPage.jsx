import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { Sparkles, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MultiSelectCombobox } from '@/components/ui/multi-select-combobox';
import { registrationOptions } from '@/data/appData.jsx';
import { useSubscription } from '@/hooks/useSubscription';
import { ManageBillingButton } from '@/components/ManageBillingButton';

function SettingsPage() {
  const { user } = useAuth();
  const sub = useSubscription();
  const [name, setName] = useState(user?.user_metadata?.name || '');
  const [email, setEmail] = useState(user?.email || '');

  const [selectedBanks, setSelectedBanks] = useState([]);
  const [selectedCards, setSelectedCards] = useState([]);
  const [selectedProgrammes, setSelectedProgrammes] = useState([]);
  const [selectedFavourites, setSelectedFavourites] = useState([]);

  const handleUpdate = (e) => {
    e.preventDefault();
    toast({
        title: "🚧 This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀",
        description: "Profile updates will be available soon."
    });
  };

  const subBadge = sub.isActive
    ? { label: `Subscribed · ${sub.plan || 'monthly'}`, color: 'bg-primary/10 text-primary', icon: CheckCircle2 }
    : sub.inTrial
    ? { label: `Trial · ${sub.trialDaysLeft} day${sub.trialDaysLeft === 1 ? '' : 's'} left`, color: 'bg-light-pink text-secondary', icon: Clock }
    : { label: 'Free plan', color: 'bg-muted text-muted-foreground', icon: AlertCircle };
  const SubIcon = subBadge.icon;

  return (
    <>
      <Helmet>
        <title>Settings - SnapGain</title>
      </Helmet>
      <div className="container mx-auto px-4 py-12 max-w-4xl space-y-6">
        <h1 className="text-3xl font-bold">Settings</h1>

        <Card>
          <CardHeader>
            <div className="flex items-start justify-between gap-3 flex-wrap">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary" />
                  Subscription
                </CardTitle>
                <CardDescription className="mt-1">
                  £7.99/month or £60/year. Cancel anytime.
                </CardDescription>
              </div>
              <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${subBadge.color}`}>
                <SubIcon className="w-3.5 h-3.5" />
                {subBadge.label}
              </span>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {sub.isActive && sub.periodEndsAt && (
              <p className="text-sm text-muted-foreground">
                Renews on{' '}
                <span className="font-semibold">
                  {new Date(sub.periodEndsAt).toLocaleDateString()}
                </span>
                {sub.periodDaysLeft ? ` (${sub.periodDaysLeft} days)` : ''}.
              </p>
            )}
            {sub.inTrial && sub.trialEndsAt && (
              <p className="text-sm text-muted-foreground">
                Trial ends on{' '}
                <span className="font-semibold">
                  {new Date(sub.trialEndsAt).toLocaleDateString()}
                </span>
                . Subscribe before then to keep premium access.
              </p>
            )}
            {!sub.isPremium && (
              <p className="text-sm text-muted-foreground">
                You&rsquo;re on the free plan. Subscribe to unlock advanced
                comparison strategies, smart alerts, and unlimited simulations.
              </p>
            )}
            <div className="flex flex-wrap gap-2 pt-1">
              {!sub.isActive ? (
                <Button asChild>
                  <Link to="/pricing">
                    {sub.inTrial ? 'Upgrade now' : 'See plans'}
                  </Link>
                </Button>
              ) : (
                <Button asChild variant="outline">
                  <Link to="/pricing">Change plan</Link>
                </Button>
              )}
              {sub.isActive && (
                <ManageBillingButton variant="outline">
                  Manage subscription
                </ManageBillingButton>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-1">
                <Card>
                    <CardHeader>
                        <CardTitle>Profile</CardTitle>
                        <CardDescription>Update your personal information.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleUpdate} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Full Name</Label>
                                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" type="email" value={email} disabled />
                            </div>
                            <Button type="submit" className="w-full">Save Profile</Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
            <div className="md:col-span-2">
                <Card>
                    <CardHeader>
                        <CardTitle>My Preferences</CardTitle>
                        <CardDescription>Manage your banks, cards, and loyalty programmes to get personalized strategies.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleUpdate} className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>My Banks</Label>
                                    <MultiSelectCombobox options={registrationOptions.banks} selected={selectedBanks} onChange={setSelectedBanks} placeholder="Select banks..." />
                                </div>
                                <div className="space-y-2">
                                    <Label>My Cards</Label>
                                    <MultiSelectCombobox options={registrationOptions.cards} selected={selectedCards} onChange={setSelectedCards} placeholder="Select cards..." />
                                </div>
                                <div className="space-y-2">
                                    <Label>My Programmes</Label>
                                    <MultiSelectCombobox options={registrationOptions.programmes} selected={selectedProgrammes} onChange={setSelectedProgrammes} placeholder="Select programmes..." />
                                </div>
                                <div className="space-y-2">
                                    <Label>My Favourites</Label>
                                    <MultiSelectCombobox options={registrationOptions.favourites} selected={selectedFavourites} onChange={setSelectedFavourites} placeholder="Select stores..." />
                                </div>
                            </div>
                            <div className="flex justify-end pt-4">
                                <Button type="submit">Save Preferences</Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
      </div>
    </>
  );
}

export default SettingsPage;