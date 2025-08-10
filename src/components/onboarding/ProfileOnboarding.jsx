import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useProfile } from '@/contexts/ProfileContext';
import { useNavigate } from 'react-router-dom';
import { 
  Building, 
  CreditCard, 
  Plane, 
  Heart, 
  CheckCircle, 
  ArrowRight,
  ArrowLeft,
  Plus,
  X
} from 'lucide-react';

function ProfileOnboarding({ onComplete }) {
  const navigate = useNavigate();
  const { 
    banks, addBank, removeBank,
    cards, addCard, removeCard,
    programs, addProgram, removeProgram,
    favoriteStores, addFavoriteStore, removeFavoriteStore,
    completeOnboarding
  } = useProfile();

  const [currentStep, setCurrentStep] = useState(0);
  const [newBank, setNewBank] = useState('');
  const [newCard, setNewCard] = useState('');
  const [newProgram, setNewProgram] = useState('');
  const [newStore, setNewStore] = useState('');

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
    'Next', 'M&S', 'Boots', 'Currys PC World', 'Argos', 'B&Q'
  ];

  const steps = [
    {
      title: 'Welcome to SnapGain!',
      subtitle: 'Let\'s set up your profile for personalized cashback recommendations',
      icon: CheckCircle,
      color: 'from-green-500 to-green-600'
    },
    {
      title: 'Your Banks',
      subtitle: 'Add your banks to get tailored cashback offers',
      icon: Building,
      color: 'from-blue-500 to-blue-600'
    },
    {
      title: 'Your Credit Cards',
      subtitle: 'Track your cards for optimal cashback strategies',
      icon: CreditCard,
      color: 'from-green-500 to-green-600'
    },
    {
      title: 'Rewards Programs',
      subtitle: 'Include your loyalty programs and airline miles',
      icon: Plane,
      color: 'from-purple-500 to-purple-600'
    },
    {
      title: 'Favorite Stores',
      subtitle: 'Select stores you shop at regularly',
      icon: Heart,
      color: 'from-red-500 to-red-600'
    }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      completeOnboarding();
      onComplete();
    }
  };

  const handleSkip = () => {
    completeOnboarding();
    onComplete();
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="text-center py-8">
            <div className="w-24 h-24 bg-gradient-to-r from-[#7D4DFB] to-[#FF3FCE] rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="h-12 w-12 text-white" />
            </div>
            <h2 className="text-2xl font-bold mb-4">Ready to maximize your cashback?</h2>
            <p className="text-muted-foreground mb-6">
              Complete your profile in 4 quick steps to get personalized recommendations 
              that could save you hundreds of pounds per year!
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <Building className="h-6 w-6 mx-auto mb-2 text-blue-600" />
                <div className="text-sm font-medium">Banks</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <CreditCard className="h-6 w-6 mx-auto mb-2 text-green-600" />
                <div className="text-sm font-medium">Cards</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <Plane className="h-6 w-6 mx-auto mb-2 text-purple-600" />
                <div className="text-sm font-medium">Programs</div>
              </div>
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <Heart className="h-6 w-6 mx-auto mb-2 text-red-600" />
                <div className="text-sm font-medium">Stores</div>
              </div>
            </div>
          </div>
        );

      case 1:
        return (
          <div className="space-y-6">
            <div className="flex flex-wrap gap-2 mb-4">
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
                onClick={() => {
                  addBank(newBank);
                  setNewBank('');
                }}
                disabled={!newBank}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              Don't see your bank? You can add more later in your profile settings.
            </p>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="flex flex-wrap gap-2 mb-4">
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
                onClick={() => {
                  addCard(newCard);
                  setNewCard('');
                }}
                disabled={!newCard}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="flex flex-wrap gap-2 mb-4">
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
                onClick={() => {
                  addProgram(newProgram);
                  setNewProgram('');
                }}
                disabled={!newProgram}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="flex flex-wrap gap-2 mb-4">
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
                onClick={() => {
                  addFavoriteStore(newStore);
                  setNewStore('');
                }}
                disabled={!newStore}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        <Card className="border-0">
          <CardHeader className="text-center">
            {/* Progress Indicator */}
            <div className="flex justify-center space-x-2 mb-4">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={`w-3 h-3 rounded-full ${
                    index <= currentStep ? 'bg-gradient-to-r from-[#7D4DFB] to-[#FF3FCE]' : 'bg-gray-200'
                  }`}
                />
              ))}
            </div>

            <CardTitle className="flex items-center justify-center space-x-3">
              <div className={`w-12 h-12 bg-gradient-to-r ${steps[currentStep].color} rounded-lg flex items-center justify-center`}>
                {React.createElement(steps[currentStep].icon, { className: "h-6 w-6 text-white" })}
              </div>
              <div className="text-left">
                <h3 className="text-xl font-bold">{steps[currentStep].title}</h3>
                <p className="text-sm text-muted-foreground">{steps[currentStep].subtitle}</p>
              </div>
            </CardTitle>
          </CardHeader>

          <CardContent className="px-8 pb-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {renderStepContent()}
              </motion.div>
            </AnimatePresence>

            {/* Navigation */}
            <div className="flex justify-between mt-8">
              <Button 
                variant="outline" 
                onClick={handleSkip}
                className="text-muted-foreground"
              >
                Skip Setup
              </Button>

              <div className="flex space-x-3">
                {currentStep > 0 && (
                  <Button 
                    variant="outline" 
                    onClick={() => setCurrentStep(currentStep - 1)}
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back
                  </Button>
                )}
                
                <Button 
                  onClick={handleNext}
                  className="bg-gradient-to-r from-[#7D4DFB] to-[#FF3FCE] hover:from-purple-700 hover:to-pink-700 text-white"
                >
                  {currentStep === steps.length - 1 ? 'Complete Setup' : 'Next'}
                  {currentStep < steps.length - 1 && <ArrowRight className="h-4 w-4 ml-2" />}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

export default ProfileOnboarding;