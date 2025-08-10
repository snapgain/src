import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useProfile } from '@/contexts/ProfileContext';
import { 
  User, 
  CreditCard, 
  Building, 
  Plane, 
  Heart, 
  Plus, 
  X, 
  Edit3,
  Save,
  Star
} from 'lucide-react';

function ProfilePage() {
  const { user } = useAuth();
  const { 
    profileData, 
    updateProfileData,
    banks, 
    addBank, 
    removeBank,
    cards, 
    addCard, 
    removeCard,
    programs, 
    addProgram, 
    removeProgram,
    favoriteStores, 
    addFavoriteStore, 
    removeFavoriteStore
  } = useProfile();

  const [editMode, setEditMode] = useState(false);
  const [localProfileData, setLocalProfileData] = useState({
    name: profileData.name || user?.name || '',
    email: profileData.email || user?.email || '',
    phone: profileData.phone || '',
    location: profileData.location || ''
  });

  // Estados para adicionar novos itens
  const [newBank, setNewBank] = useState('');
  const [newCard, setNewCard] = useState('');
  const [newProgram, setNewProgram] = useState('');
  const [newStore, setNewStore] = useState('');

  // Listas para seleção
  const availableBanks = [
    'Chase', 'Santander', 'Barclays', 'HSBC', 'Lloyds Banking Group', 
    'NatWest', 'TSB', 'Nationwide', 'Halifax', 'Monzo', 'Starling Bank'
  ];

  const availableCards = [
    'American Express Gold', 'American Express Platinum', 'Visa Cashback',
    'Mastercard Cashback', 'Chase Sapphire', 'Santander 123 Credit Card',
    'Barclaycard Rewards', 'HSBC Cashback Credit Card', 'Tesco Bank Credit Card'
  ];

  const availablePrograms = [
    'British Airways Executive Club', 'Virgin Atlantic Flying Club', 'Avios',
    'Tesco Clubcard', 'Sainsbury\'s Nectar', 'ASDA Rewards', 'Boots Advantage Card',
    'Costa Coffee Club', 'Starbucks Rewards', 'M&S Sparks'
  ];

  const availableStores = [
    'Amazon', 'ASDA', 'Tesco', 'Sainsbury\'s', 'John Lewis', 'ASOS', 
    'Next', 'M&S', 'Boots', 'Currys PC World', 'Argos', 'B&Q',
    'Waitrose', 'Morrison\'s', 'Costa Coffee', 'Starbucks'
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  const handleSaveProfile = () => {
    // Atualizar os dados no context
    updateProfileData(localProfileData);
    console.log('Saving profile:', localProfileData);
    setEditMode(false);
  };

  const handleAddBank = () => {
    if (newBank) {
      addBank(newBank);
      setNewBank('');
    }
  };

  const handleAddCard = () => {
    if (newCard) {
      addCard(newCard);
      setNewCard('');
    }
  };

  const handleAddProgram = () => {
    if (newProgram) {
      addProgram(newProgram);
      setNewProgram('');
    }
  };

  const handleAddStore = () => {
    if (newStore) {
      addFavoriteStore(newStore);
      setNewStore('');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-8"
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="text-center">
            <div className="w-20 h-20 bg-gradient-to-r from-[#7D4DFB] to-[#FF3FCE] rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold">Profile Settings</h1>
            <p className="text-muted-foreground">
              Configure your preferences for personalized cashback comparisons
            </p>
          </motion.div>

          {/* Personal Information */}
          <motion.div variants={itemVariants}>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center space-x-2">
                  <User className="h-5 w-5" />
                  <span>Personal Information</span>
                </CardTitle>
                <Button
                  variant="outline"
                  onClick={() => editMode ? handleSaveProfile() : setEditMode(true)}
                  className="flex items-center space-x-2"
                >
                  {editMode ? <Save className="h-4 w-4" /> : <Edit3 className="h-4 w-4" />}
                  <span>{editMode ? 'Save' : 'Edit'}</span>
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={localProfileData.name}
                      onChange={(e) => setLocalProfileData({...localProfileData, name: e.target.value})}
                      disabled={!editMode}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={localProfileData.email}
                      onChange={(e) => setLocalProfileData({...localProfileData, email: e.target.value})}
                      disabled={!editMode}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={localProfileData.phone}
                      onChange={(e) => setLocalProfileData({...localProfileData, phone: e.target.value})}
                      disabled={!editMode}
                      placeholder="+44 7XXX XXXXXX"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={localProfileData.location}
                      onChange={(e) => setLocalProfileData({...localProfileData, location: e.target.value})}
                      disabled={!editMode}
                      placeholder="London, UK"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Banks Configuration */}
          <motion.div variants={itemVariants}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Building className="h-5 w-5 text-blue-600" />
                  <span>My Banks</span>
                  <Badge variant="outline">{banks.length}</Badge>
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Add your banks to get personalized cashback recommendations
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Current Banks */}
                  <div className="flex flex-wrap gap-2">
                    {banks.map((bank) => (
                      <Badge key={bank} variant="secondary" className="flex items-center space-x-2">
                        <span>{bank}</span>
                        <X 
                          className="h-3 w-3 cursor-pointer hover:text-red-500" 
                          onClick={() => removeBank(bank)}
                        />
                      </Badge>
                    ))}
                  </div>

                  {/* Add New Bank */}
                  <div className="flex space-x-2">
                    <select
                      value={newBank}
                      onChange={(e) => setNewBank(e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-200 rounded-md"
                    >
                      <option value="">Select a bank...</option>
                      {availableBanks.filter(bank => !banks.includes(bank)).map((bank) => (
                        <option key={bank} value={bank}>{bank}</option>
                      ))}
                    </select>
                    <Button
                      onClick={handleAddBank}
                      disabled={!newBank}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Credit Cards Configuration */}
          <motion.div variants={itemVariants}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CreditCard className="h-5 w-5 text-green-600" />
                  <span>My Credit Cards</span>
                  <Badge variant="outline">{cards.length}</Badge>
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Track your credit cards for better cashback optimization
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Current Cards */}
                  <div className="flex flex-wrap gap-2">
                    {cards.map((card) => (
                      <Badge key={card} variant="secondary" className="flex items-center space-x-2">
                        <span>{card}</span>
                        <X 
                          className="h-3 w-3 cursor-pointer hover:text-red-500" 
                          onClick={() => removeCard(card)}
                        />
                      </Badge>
                    ))}
                  </div>

                  {/* Add New Card */}
                  <div className="flex space-x-2">
                    <select
                      value={newCard}
                      onChange={(e) => setNewCard(e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-200 rounded-md"
                    >
                      <option value="">Select a credit card...</option>
                      {availableCards.filter(card => !cards.includes(card)).map((card) => (
                        <option key={card} value={card}>{card}</option>
                      ))}
                    </select>
                    <Button
                      onClick={handleAddCard}
                      disabled={!newCard}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Rewards Programs */}
          <motion.div variants={itemVariants}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Plane className="h-5 w-5 text-purple-600" />
                  <span>Rewards Programs</span>
                  <Badge variant="outline">{programs.length}</Badge>
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Add loyalty programs, airline miles, and store rewards
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Current Programs */}
                  <div className="flex flex-wrap gap-2">
                    {programs.map((program) => (
                      <Badge key={program} variant="secondary" className="flex items-center space-x-2">
                        <span>{program}</span>
                        <X 
                          className="h-3 w-3 cursor-pointer hover:text-red-500" 
                          onClick={() => removeProgram(program)}
                        />
                      </Badge>
                    ))}
                  </div>

                  {/* Add New Program */}
                  <div className="flex space-x-2">
                    <select
                      value={newProgram}
                      onChange={(e) => setNewProgram(e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-200 rounded-md"
                    >
                      <option value="">Select a rewards program...</option>
                      {availablePrograms.filter(program => !programs.includes(program)).map((program) => (
                        <option key={program} value={program}>{program}</option>
                      ))}
                    </select>
                    <Button
                      onClick={handleAddProgram}
                      disabled={!newProgram}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Favorite Stores */}
          <motion.div variants={itemVariants}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Heart className="h-5 w-5 text-red-600" />
                  <span>Favorite Stores</span>
                  <Badge variant="outline">{favoriteStores.length}</Badge>
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Get priority deals from your most shopped stores
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Current Stores */}
                  <div className="flex flex-wrap gap-2">
                    {favoriteStores.map((store) => (
                      <Badge key={store} variant="secondary" className="flex items-center space-x-2">
                        <span>{store}</span>
                        <X 
                          className="h-3 w-3 cursor-pointer hover:text-red-500" 
                          onClick={() => removeFavoriteStore(store)}
                        />
                      </Badge>
                    ))}
                  </div>

                  {/* Add New Store */}
                  <div className="flex space-x-2">
                    <select
                      value={newStore}
                      onChange={(e) => setNewStore(e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-200 rounded-md"
                    >
                      <option value="">Select a store...</option>
                      {availableStores.filter(store => !favoriteStores.includes(store)).map((store) => (
                        <option key={store} value={store}>{store}</option>
                      ))}
                    </select>
                    <Button
                      onClick={handleAddStore}
                      disabled={!newStore}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Profile Completion Status */}
          <motion.div variants={itemVariants}>
            <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <Star className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-green-800">
                        Profile Completion: {profileData.completionPercentage}%
                      </h3>
                      <p className="text-green-700">
                        Complete your profile to get the most accurate cashback comparisons
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-green-600">
                      {(banks.length + cards.length + programs.length + favoriteStores.length)}
                    </div>
                    <div className="text-sm text-green-600">Items configured</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

export default ProfilePage;