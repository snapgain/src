import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calculator, TrendingUp, Search, ShoppingCart, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { stores, filterOptions, rewardOptions } from '@/data/appData';
import { affiliateId, aviosPartners, cashbackPlatforms, getAffiliateLink, fetchApi, normalizeRewards } from '@/data/platforms';
import { ComparisonResults } from './ComparisonResults';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { MultiSelectCombobox } from '@/components/ui/multi-select-combobox';
import { usePlatformComparison } from '@/hooks/useEdgeFunctions';
import { usePriceComparison } from '@/hooks/usePriceComparison';

export function ComparisonTool() {
<<<<<<<< HEAD:src/components/comparison/ComparisonTool.jsx
  const { user } = useAuth();
========
  const { user, isTrialExpired } = useAuth();
  const { comparePlatforms, loading: edgeLoading, results: edgeResults } = usePlatformComparison();
  const { loading: priceLoading, error: priceError, resultados: priceResults, compararPrecos } = usePriceComparison();
  
>>>>>>>> 6c70c49fb6aada2cec871bdeecbebd2474a097b3:components/comparison/ComparisonTool.jsx
  const [selectedStore, setSelectedStore] = useState([]);
  const [purchaseAmount, setPurchaseAmount] = useState('100');
  const [productSearch, setProductSearch] = useState('');
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [showComparison, setShowComparison] = useState(false);
  const [showPriceComparison, setShowPriceComparison] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const resultsRef = useRef(null);

  const [isBankConnected, setIsBankConnected] = useState(false);
  const [isCardConnected, setIsCardConnected] = useState(false);
  const [bankOffers, setBankOffers] = useState([]);
  const [cardOffers, setCardOffers] = useState([]);

  const userFavouriteStores = stores.filter(s => s.isFavourite);
  const allStoreOptions = stores.map(s => ({ value: s.id, label: s.name }));

  // Função para comparar plataformas usando Edge Function
  const performComparison = async () => {
    if (selectedStore.length === 0 || !purchaseAmount) return;

    setIsLoading(true);
    setShowComparison(true);

    try {
      const platforms = selectedStore.map(storeId => {
        const store = stores.find(s => s.id === storeId);
        return store?.name;
      }).filter(Boolean);

      const criteria = {
        purchaseAmount: parseFloat(purchaseAmount),
        filters: selectedFilters,
        userPreferences: user?.preferences || {}
      };

      await comparePlatforms(platforms, criteria);
      
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (error) {
      console.error('Erro na comparação:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Atualiza resultados em tempo real
  useEffect(() => {
    if (selectedStore.length > 0 && purchaseAmount) {
      performComparison();
    } else {
      setShowComparison(false);
    }
  }, [selectedStore, purchaseAmount, selectedFilters]);

  // Busca dados em tempo real das APIs das plataformas
  const [apiRewards, setApiRewards] = useState([]);

  useEffect(() => {
    async function fetchRewards() {
      if (selectedStore.length === 0) return;
      setIsLoading(true);
      // Exemplo de URLs reais (substitua pelas APIs oficiais)
      const cashbackUrl = `https://api.topcashback.co.uk/store/${selectedStore[0]?.value}`;
      const aviosUrl = `https://api.avios.com/partners/${selectedStore[0]?.value}`;
      // Fetch de múltiplas plataformas
      const cashbackData = await fetchApi(cashbackUrl);
      const aviosData = await fetchApi(aviosUrl);
      // Normaliza e une os dados
      const rewards = [
        ...normalizeRewards(cashbackData?.offers || []),
        ...normalizeRewards(aviosData?.offers || [])
      ];
      setApiRewards(rewards);
      setIsLoading(false);
    }
    fetchRewards();
  }, [selectedStore]);

  // Filtra e monta opções de estratégia usando função centralizada
  const filteredRewards = apiRewards.length > 0
    ? apiRewards.filter(reward => {
        if (selectedFilters.length === 0) return true;
        const filterIds = selectedFilters.map(f => f.id);
        const conditions = [];
        if (filterIds.includes('cashback')) conditions.push(reward.type === 'cashback');
        if (filterIds.includes('points')) conditions.push(reward.type === 'points');
        if (filterIds.includes('gift-cards')) conditions.push(reward.type === 'gift-card');
        return conditions.some(c => c);
      }).map(reward => {
        return { ...reward, affiliateLink: getAffiliateLink(reward, selectedStore) };
      })
    : rewardOptions.filter(reward => {
        if (selectedFilters.length === 0) return true;
        const filterIds = selectedFilters.map(f => f.id);
        const conditions = [];
        if (filterIds.includes('cashback')) conditions.push(reward.type === 'cashback');
        if (filterIds.includes('points')) conditions.push(reward.type === 'points');
        if (filterIds.includes('gift-cards')) conditions.push(reward.type === 'gift-card');
        return conditions.some(c => c);
      }).map(reward => {
        return { ...reward, affiliateLink: getAffiliateLink(reward, selectedStore) };
      });

  // Simula autenticação OAuth/API Key para banco
  async function handleConnectBank() {
    setIsLoading(true);
    try {
      // Em produção, use OpenBanking ou Plaid
      // const token = await startOAuthFlow();
      // const offers = await fetchApi(`https://api.openbanking.com/user/offers?token=${token}`);
      const offers = await fetchApi('https://api.mockbank.com/user/offers');
      setBankOffers(normalizeRewards(offers?.offers || []));
      setIsBankConnected(true);
      toast({ title: 'Banco conectado!', description: 'Ofertas personalizadas carregadas.' });
    } catch (err) {
      toast({ title: 'Erro ao conectar banco', description: err.message, variant: 'destructive' });
    }
    setIsLoading(false);
  }

  // Simula autenticação OAuth/API Key para cartão
  async function handleConnectCard() {
    setIsLoading(true);
    try {
      // const token = await startCardOAuthFlow();
      // const offers = await fetchApi(`https://api.cardprovider.com/user/offers?token=${token}`);
      const offers = await fetchApi('https://api.mockcard.com/user/offers');
      setCardOffers(normalizeRewards(offers?.offers || []));
      setIsCardConnected(true);
      toast({ title: 'Cartão conectado!', description: 'Ofertas personalizadas carregadas.' });
    } catch (err) {
      toast({ title: 'Erro ao conectar cartão', description: err.message, variant: 'destructive' });
    }
    setIsLoading(false);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="space-y-10 max-w-4xl mx-auto px-2 md:px-0"
    >
      <Card className="shadow-xl border-0 rounded-2xl overflow-hidden bg-gradient-to-br from-white via-light-pink to-white">
        <CardHeader className="bg-light-pink/60 backdrop-blur-md">
          <CardTitle className="flex items-center text-3xl md:text-4xl font-extrabold text-primary gap-2">
            <Calculator className="w-8 h-8 mr-3" />
            Reward Comparison
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8 space-y-8">
          <div className="grid md:grid-cols-2 gap-8">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <Label className="block font-semibold mb-2 text-lg">1. Select Store</Label>
              <MultiSelectCombobox
                options={allStoreOptions}
                selected={selectedStore}
                onChange={setSelectedStore}
                placeholder="Select a store..."
                searchPlaceholder="Search stores..."
                isSingleSelect={true}
                favourites={userFavouriteStores.map(s => ({ value: s.id, label: s.name }))}
              />
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
              <Label htmlFor="purchaseAmount" className="block font-semibold mb-2 text-lg">2. Purchase Amount</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground font-bold text-lg">£</span>
                <Input
                  id="purchaseAmount"
                  type="number"
                  value={purchaseAmount}
                  onChange={(e) => setPurchaseAmount(e.target.value)}
                  placeholder="100.00"
                  className="pl-8 pr-4 py-3 h-14 text-xl font-bold border-2 border-primary/30 rounded-xl focus:border-primary"
                />
              </div>
            </motion.div>
          </div>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
            <Label className="block font-semibold mb-2 text-lg">3. Filter Options (Optional)</Label>
            <div className="flex flex-wrap gap-3">
              {filterOptions.map((filter) => (
                <motion.button
                  key={filter.id}
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => {
                    setSelectedFilters(prev => 
                      prev.find(f => f.id === filter.id)
                        ? prev.filter(f => f.id !== filter.id)
                        : [...prev, filter]
                    )
                  }}
                  className={`px-5 py-2 rounded-full border-2 transition-all flex items-center text-base font-semibold shadow-sm ${
                    selectedFilters.find(f => f.id === filter.id)
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-border bg-background hover:border-primary/50'
                  }`}
                  aria-label={`Filtrar por ${filter.label}`}
                  tabIndex={0}
                >
                  <span className="mr-2" aria-hidden="true">{filter.icon}</span>
                  {filter.label}
                </motion.button>
              ))}
            </div>
          </motion.div>
        </CardContent>
      </Card>

      <div className="flex gap-4 mt-4">
        <Button
          variant={isBankConnected ? 'secondary' : 'default'}
          onClick={handleConnectBank}
          disabled={isBankConnected || isLoading}
          className="font-bold"
        >
          {isBankConnected ? 'Banco Conectado' : 'Conectar Banco'}
        </Button>
        <Button
          variant={isCardConnected ? 'secondary' : 'default'}
          onClick={handleConnectCard}
          disabled={isCardConnected || isLoading}
          className="font-bold"
        >
          {isCardConnected ? 'Cartão Conectado' : 'Conectar Cartão'}
        </Button>
      </div>

      <div ref={resultsRef} className="mt-8">
        {isLoading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-10">
            <span className="animate-spin rounded-full h-10 w-10 border-t-4 border-b-4 border-primary"></span>
            <span className="mt-4 text-primary text-lg font-semibold">Calculando melhores opções...</span>
          </motion.div>
        )}
        <AnimatePresence>
          {showComparison && !isLoading && (
            <ComparisonResults 
              rewards={[
                ...filteredRewards,
                ...(isBankConnected ? bankOffers : []),
                ...(isCardConnected ? cardOffers : [])
              ]} 
              purchaseAmount={purchaseAmount}
              onClose={() => setShowComparison(false)}
            />
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}