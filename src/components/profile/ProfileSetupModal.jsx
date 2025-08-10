import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useProfile } from '@/contexts/ProfileContext';
import { useNavigate } from 'react-router-dom';
import { 
  User, 
  CreditCard, 
  Building, 
  Heart, 
  Plus, 
  X,
  ArrowRight,
  Skip
} from 'lucide-react';

const ProfileSetupModal = ({ isOpen, onClose, onComplete }) => {
  const navigate = useNavigate();
  const { 
    addBank, 
    addCard, 
    addFavoriteStore, 
    updateProfileData 
  } = useProfile();

  const [step, setStep] = useState(1);
  const [profileData, setProfileData] = useState({
    name: '',
    phone: '',
    location: ''
  });
  const [selectedBanks, setSelectedBanks] = useState([]);
  const [selectedCards, setSelectedCards] = useState([]);
  const [selectedStores, setSelectedStores] = useState([]);

  const banks = [
    'Chase', 'Santander', 'Barclays', 'HSBC', 'Lloyds Banking Group', 
    'NatWest', 'TSB', 'Nationwide', 'Halifax', 'Monzo', 'Starling Bank'
  ];

  const cards = [
    'American Express Gold', 'American Express Platinum', 'Visa Cashback',
    'Mastercard Cashback', 'Chase Sapphire', 'Santander 123 Credit Card',
    'Barclaycard Rewards', 'HSBC Cashback Credit Card'
  ];

  const stores = [
    'Amazon', 'ASDA', 'Tesco', 'Sainsbury\'s', 'John Lewis', 'ASOS', 
    'Next', 'M&S', 'Boots', 'Currys PC World', 'Argos', 'B&Q'
  ];

  const handleSaveAndCompare = () => {
    // Salvar todos os dados
    updateProfileData(profileData);
    selectedBanks.forEach(bank => addBank(bank));
    selectedCards.forEach(card => addCard(card));
    selectedStores.forEach(store => addFavoriteStore(store));
    
    // Fechar modal e navegar para comparação
    onComplete();
    navigate('/compare');
  };

  const handleSkipNow = () => {
    // Salvar apenas os dados preenchidos
    if (profileData.name || profileData.phone || profileData.location) {
      updateProfileData(profileData);
    }
    selectedBanks.forEach(bank => addBank(bank));
    selectedCards.forEach(card => addCard(card));
    selectedStores.forEach(store => addFavoriteStore(store));
    
    // Fechar modal e navegar para comparação
    onComplete();
    navigate('/compare');
  };

  const toggleSelection = (item, list, setList) => {
    if (list.includes(item)) {
      setList(list.filter(i => i !== item));
    } else {
      setList([...list, item]);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog open={isOpen} onOpenChange={onClose}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-2 text-2xl">
                <User className="h-6 w-6" />
                <span>Complete Your Profile</span>
              </DialogTitle>
              <p className="text-muted-foreground">
                Help us personalize your cashback experience
              </p>
            </DialogHeader>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Progress Bar */}
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(step / 4) * 100}%` }}
                />
              </div>

              {/* Step 1: Personal Info */}
              {step === 1 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-4"
                >
                  <h3 className="text-lg font-semibold">Personal Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        value={profileData.name}
                        onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                        placeholder="Enter your full name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        value={profileData.phone}
                        onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                        placeholder="+44 7XXX XXXXXX"
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        value={profileData.location}
                        onChange={(e) => setProfileData({...profileData, location: e.target.value})}
                        placeholder="London, UK"
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 2: Banks */}
              {step === 2 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-4"
                >
                  <div className="flex items-center space-x-2">
                    <Building className="h-5 w-5 text-blue-600" />
                    <h3 className="text-lg font-semibold">Select Your Banks</h3>
                    <Badge variant="outline">{selectedBanks.length} selected</Badge>
                  </div>
                  <p className="text-muted-foreground">Choose the banks you use for personalized recommendations</p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {banks.map(bank => (
                      <Card 
                        key={bank}
                        className={`cursor-pointer transition-all duration-200 ${
                          selectedBanks.includes(bank) 
                            ? 'bg-blue-50 border-blue-300 shadow-md' 
                            : 'hover:bg-gray-50'
                        }`}
                        onClick={() => toggleSelection(bank, selectedBanks, setSelectedBanks)}
                      >
                        <CardContent className="p-3 text-center">
                          <p className="text-sm font-medium">{bank}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Step 3: Credit Cards */}
              {step === 3 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-4"
                >
                  <div className="flex items-center space-x-2">
                    <CreditCard className="h-5 w-5 text-green-600" />
                    <h3 className="text-lg font-semibold">Select Your Credit Cards</h3>
                    <Badge variant="outline">{selectedCards.length} selected</Badge>
                  </div>
                  <p className="text-muted-foreground">Add your credit cards for better cashback optimization</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {cards.map(card => (
                      <Card 
                        key={card}
                        className={`cursor-pointer transition-all duration-200 ${
                          selectedCards.includes(card) 
                            ? 'bg-green-50 border-green-300 shadow-md' 
                            : 'hover:bg-gray-50'
                        }`}
                        onClick={() => toggleSelection(card, selectedCards, setSelectedCards)}
                      >
                        <CardContent className="p-3">
                          <p className="text-sm font-medium">{card}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Step 4: Favorite Stores */}
              {step === 4 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-4"
                >
                  <div className="flex items-center space-x-2">
                    <Heart className="h-5 w-5 text-red-600" />
                    <h3 className="text-lg font-semibold">Select Favorite Stores</h3>
                    <Badge variant="outline">{selectedStores.length} selected</Badge>
                  </div>
                  <p className="text-muted-foreground">Choose stores you shop at frequently for priority deals</p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {stores.map(store => (
                      <Card 
                        key={store}
                        className={`cursor-pointer transition-all duration-200 ${
                          selectedStores.includes(store) 
                            ? 'bg-red-50 border-red-300 shadow-md' 
                            : 'hover:bg-gray-50'
                        }`}
                        onClick={() => toggleSelection(store, selectedStores, setSelectedStores)}
                      >
                        <CardContent className="p-3 text-center">
                          <p className="text-sm font-medium">{store}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between pt-6 border-t">
                <div>
                  {step > 1 && (
                    <Button 
                      variant="outline" 
                      onClick={() => setStep(step - 1)}
                    >
                      Previous
                    </Button>
                  )}
                </div>

                <div className="flex space-x-3">
                  {step < 4 ? (
                    <>
                      <Button 
                        variant="ghost" 
                        onClick={handleSkipNow}
                        className="flex items-center space-x-2"
                      >
                        <Skip className="h-4 w-4" />
                        <span>Skip Now</span>
                      </Button>
                      <Button 
                        onClick={() => setStep(step + 1)}
                        className="flex items-center space-x-2"
                      >
                        <span>Next</span>
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button 
                        variant="outline" 
                        onClick={handleSkipNow}
                        className="flex items-center space-x-2"
                      >
                        <Skip className="h-4 w-4" />
                        <span>Skip Now</span>
                      </Button>
                      <Button 
                        onClick={handleSaveAndCompare}
                        className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 flex items-center space-x-2"
                      >
                        <span>Compare Now</span>
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  );
};

export default ProfileSetupModal;