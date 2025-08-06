import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MultiSelectCombobox } from '@/components/ui/multi-select-combobox';
import { registrationOptions } from '@/data/appData.jsx';

function SettingsPage() {
  const { user } = useAuth();
  const [name, setName] = useState(user?.user_metadata?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  
  const [selectedBanks, setSelectedBanks] = useState(user?.user_metadata?.banks || []);
  const [selectedCards, setSelectedCards] = useState(user?.user_metadata?.cards || []);
  const [selectedProgrammes, setSelectedProgrammes] = useState(user?.user_metadata?.programmes || []);
  const [selectedFavourites, setSelectedFavourites] = useState(user?.user_metadata?.favourites || []);

  const handleUpdate = (e) => {
    e.preventDefault();
    toast({
        title: "🚧 This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀",
        description: "Profile updates will be available soon."
    });
  };

  return (
    <>
      <Helmet>
        <title>Settings - SnapGain</title>
      </Helmet>
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="text-3xl font-bold mb-8">Settings</h1>
        
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