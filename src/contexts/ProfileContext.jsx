import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const ProfileContext = createContext();

export function useProfile() {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
}

export function ProfileProvider({ children }) {
  const { user } = useAuth();
  
  // Estados do perfil do usuário
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    isProfileComplete: false,
    completionPercentage: 0,
    setupStep: 'welcome' // welcome, banks, cards, programs, stores, complete
  });

  const [banks, setBanks] = useState([]);
  const [cards, setCards] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [favoriteStores, setFavoriteStores] = useState([]);

  // Calcular completion quando dados mudarem
  useEffect(() => {
    const completionItems = [
      banks.length > 0,
      cards.length > 0, 
      programs.length > 0,
      favoriteStores.length > 0
    ];
    
    const completedCount = completionItems.filter(Boolean).length;
    const percentage = Math.round((completedCount / 4) * 100);
    
    setProfileData(prev => ({
      ...prev,
      completionPercentage: percentage,
      isProfileComplete: percentage === 100
    }));
  }, [banks, cards, programs, favoriteStores]);

  // Carregar dados do usuário quando logar
  useEffect(() => {
    if (user) {
      // Em produção, carregaria da API
      // Por enquanto, mock data para demo
      loadUserProfileData();
    }
  }, [user]);

  const loadUserProfileData = () => {
    // Mock data - em produção viria da API
    const mockData = {
      banks: ['Chase', 'Santander'],
      cards: ['American Express Gold', 'Visa Cashback'],
      programs: ['British Airways Executive Club', 'Tesco Clubcard'],
      favoriteStores: ['Amazon', 'ASDA', 'John Lewis']
    };

    setBanks(mockData.banks);
    setCards(mockData.cards);
    setPrograms(mockData.programs);
    setFavoriteStores(mockData.favoriteStores);

    setProfileData(prev => ({
      ...prev,
      name: user?.name || '',
      email: user?.email || '',
      setupStep: mockData.banks.length > 0 ? 'complete' : 'welcome'
    }));
  };

  const updateProfileData = (newData) => {
    setProfileData(prev => ({ ...prev, ...newData }));
  };

  const addBank = (bank) => {
    if (bank && !banks.includes(bank)) {
      setBanks(prev => [...prev, bank]);
    }
  };

  const removeBank = (bank) => {
    setBanks(prev => prev.filter(b => b !== bank));
  };

  const addCard = (card) => {
    if (card && !cards.includes(card)) {
      setCards(prev => [...prev, card]);
    }
  };

  const removeCard = (card) => {
    setCards(prev => prev.filter(c => c !== card));
  };

  const addProgram = (program) => {
    if (program && !programs.includes(program)) {
      setPrograms(prev => [...prev, program]);
    }
  };

  const removeProgram = (program) => {
    setPrograms(prev => prev.filter(p => p !== program));
  };

  const addFavoriteStore = (store) => {
    if (store && !favoriteStores.includes(store)) {
      setFavoriteStores(prev => [...prev, store]);
    }
  };

  const removeFavoriteStore = (store) => {
    setFavoriteStores(prev => prev.filter(s => s !== store));
  };

  const completeOnboarding = () => {
    setProfileData(prev => ({
      ...prev,
      setupStep: 'complete',
      isProfileComplete: true
    }));
  };

  const value = {
    // Profile data
    profileData,
    updateProfileData,
    
    // Banks
    banks,
    addBank,
    removeBank,
    
    // Cards
    cards,
    addCard,
    removeCard,
    
    // Programs
    programs,
    addProgram,
    removeProgram,
    
    // Favorite Stores
    favoriteStores,
    addFavoriteStore,
    removeFavoriteStore,
    
    // Actions
    completeOnboarding
  };

  return (
    <ProfileContext.Provider value={value}>
      {children}
    </ProfileContext.Provider>
  );
}