import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { registrationOptions } from '@/data/appData.jsx';
import { MultiSelectCombobox } from '@/components/ui/multi-select-combobox';
import { useUserRegistration } from '@/hooks/useEdgeFunctions';

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0 },
};

function RegistrationForm() {
  const navigate = useNavigate();
  const { user, completeRegistration } = useAuth();
  const { registerUser, loading: registrationLoading } = useUserRegistration();
  const [selectedBanks, setSelectedBanks] = useState([]);
  const [selectedCards, setSelectedCards] = useState([]);
  const [selectedProgrammes, setSelectedProgrammes] = useState([]);
  const [selectedFavourites, setSelectedFavourites] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const userData = {
      banks: selectedBanks,
      cards: selectedCards,
      programmes: selectedProgrammes,
      favourites: selectedFavourites,
      registrationDate: new Date().toISOString(),
      preferences: {
        notifications: true,
        emailUpdates: true
      }
    };

    try {
      // Usar Edge Function para registro
      await registerUser(user.email, userData);
      
      // Completar registro local
      completeRegistration(userData);
      navigate('/dashboard');
    } catch (error) {
      console.error('Erro no registro:', error);
    }
  };

  if (!user) return null;

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="w-full max-w-4xl"
    >
      <motion.div variants={itemVariants}>
        <h1 className="text-3xl font-bold mb-2 text-center">Almost there, {user.name}!</h1>
        <p className="text-muted-foreground text-center mb-8">
          Help us personalize your experience by selecting your preferences.
        </p>
      </motion.div>
      
      <form onSubmit={handleSubmit}>
        <div className="grid md:grid-cols-2 gap-x-8 gap-y-6">
          <motion.div variants={itemVariants} className="space-y-2">
            <Label>My Banks</Label>
            <MultiSelectCombobox
              options={registrationOptions.banks}
              selected={selectedBanks}
              onChange={setSelectedBanks}
              placeholder="Select banks..."
              searchPlaceholder="Search banks..."
            />
          </motion.div>
          <motion.div variants={itemVariants} className="space-y-2">
            <Label>My Programmes</Label>
            <MultiSelectCombobox
              options={registrationOptions.programmes}
              selected={selectedProgrammes}
              onChange={setSelectedProgrammes}
              placeholder="Select programmes..."
              searchPlaceholder="Search programmes..."
            />
          </motion.div>
          <motion.div variants={itemVariants} className="space-y-2">
            <Label>My Cards</Label>
            <MultiSelectCombobox
              options={registrationOptions.cards}
              selected={selectedCards}
              onChange={setSelectedCards}
              placeholder="Select cards..."
              searchPlaceholder="Search cards..."
            />
          </motion.div>
          <motion.div variants={itemVariants} className="space-y-2">
            <Label>My Favourites</Label>
            <MultiSelectCombobox
              options={registrationOptions.favourites}
              selected={selectedFavourites}
              onChange={setSelectedFavourites}
              placeholder="Select favourite stores..."
              searchPlaceholder="Search stores..."
            />
          </motion.div>
        </div>
        <motion.div variants={itemVariants} className="mt-8">
          <Button 
            type="submit" 
            size="lg" 
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
            disabled={registrationLoading}
          >
            {registrationLoading ? 'Registrando...' : 'Complete Registration'}
          </Button>
        </motion.div>
      </form>
    </motion.div>
  );
}

export default RegistrationForm;