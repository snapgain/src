import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { CheckCircle, X, ExternalLink, PlusCircle, MinusCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

const StrategyStep = ({ number, title, description }) => (
    <div className="flex items-start space-x-3">
        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">{number}</div>
        <div>
            <p className="font-semibold">{title}</p>
            <p className="text-sm text-muted-foreground">{description}</p>
        </div>
    </div>
);

const RewardCard = ({ reward, purchaseAmount, isBestValue, userBanks = [], userCards = [] }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const gainValue = reward.type === 'cashback' || reward.type === 'gift-card'
        ? `£${(reward.amount * (purchaseAmount / 100)).toFixed(2)}`
        : `${Math.floor(reward.amount * (purchaseAmount / 100))} pts`;

    const handleGoToPlatform = () => {
        window.open(reward.affiliateLink, '_blank', 'noopener,noreferrer');
    };

    // Gerar estratégia personalizada baseada na recompensa específica
    const generateStrategy = (reward) => {
        const cashbackAmount = reward.type === 'cashback' ? (reward.amount * (purchaseAmount / 100)) : 0;
        const aviosFromBooster = cashbackAmount > 0 ? Math.floor(cashbackAmount * 2000 / 37) : 0;
        
        const strategies = {
            'topcashback': [
                { number: "1", title: "Visit TopCashback", description: "Log into your TopCashback account and search for the retailer." },
                { number: "2", title: "Click Through", description: "Click the 'Get Cashback' button to be redirected to the retailer's website." },
                { number: "3", title: "Complete Purchase", description: `Make your £${purchaseAmount} purchase as normal to earn ${gainValue} cashback.` },
                ...(cashbackAmount > 0 ? [{ number: "4", title: "Avios Booster Option", description: `Use your £${cashbackAmount.toFixed(2)} cashback to buy ~${aviosFromBooster} Avios via Avios Booster for maximum value.` }] : [])
            ],
            'quidco': [
                { number: "1", title: "Access Quidco", description: "Log into your Quidco account and find the retailer." },
                { number: "2", title: "Activate Cashback", description: "Click through to the retailer to activate cashback tracking." },
                { number: "3", title: "Shop & Earn", description: `Complete your purchase to earn ${gainValue} cashback.` },
                ...(cashbackAmount > 0 ? [{ number: "4", title: "Avios Booster Option", description: `Convert your £${cashbackAmount.toFixed(2)} cashback to ~${aviosFromBooster} Avios via Avios Booster.` }] : [])
            ],
            'avios': [
                { number: "1", title: "BA eStore Login", description: "Visit the British Airways eStore and log in with your Executive Club details." },
                { number: "2", title: "Find Retailer", description: "Search for your chosen retailer and click through to their website." },
                { number: "3", title: "Earn Avios", description: `Complete your £${purchaseAmount} purchase to earn ${gainValue}.` },
                { number: "4", title: "Best for Miles", description: "This strategy maximizes your Avios earning directly without conversions." }
            ],
            'amex-gold': [
                { number: "1", title: "Use Amex Gold", description: "Pay with your American Express Gold Card to earn points." },
                { number: "2", title: "Combine with Platform", description: "Use through a cashback portal for double rewards." },
                { number: "3", title: "Maximize Points", description: `Earn both credit card points and platform rewards on your £${purchaseAmount} purchase.` }
            ]
        };

        return strategies[reward.id] || [
            { number: "1", title: "Visit Platform", description: `Log into ${reward.name} and find your chosen retailer.` },
            { number: "2", title: "Activate Rewards", description: "Click through to activate reward tracking." },
            { number: "3", title: "Complete Purchase", description: `Make your £${purchaseAmount} purchase to earn ${gainValue}.` }
        ];
    };

    const currentStrategy = generateStrategy(reward);

    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className={`p-4 rounded-lg border-2 relative overflow-hidden ${isBestValue ? 'border-accent bg-light-green' : 'border-border'}`}
        >
            {isBestValue && <div className="absolute top-0 right-0 px-3 py-1 bg-accent text-accent-foreground text-xs font-bold rounded-bl-lg">Best Option</div>}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                <div className="flex items-center space-x-4 col-span-1">
                    <div className="text-4xl">{reward.icon}</div>
                    <div>
                        <h4 className="font-semibold text-lg">{reward.name}</h4>
                        <p className="text-muted-foreground text-sm">{reward.description}</p>
                    </div>
                </div>

                <div className="col-span-1 text-left md:text-center">
                    <p className="text-sm font-medium">Reward Gain</p>
                    <p className="text-2xl font-bold text-primary">{gainValue}</p>
                    <p className="text-sm text-muted-foreground">{reward.rate}</p>
                </div>
                
                <div className="col-span-1 flex flex-col items-start md:items-end space-y-2">
                    <Button onClick={handleGoToPlatform} size="sm" className="bg-secondary text-secondary-foreground hover:bg-secondary/90">
                        Go to Platform <ExternalLink className="w-4 h-4 ml-2" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => setIsExpanded(!isExpanded)}>
                        {isExpanded ? <MinusCircle className="w-4 h-4 mr-2" /> : <PlusCircle className="w-4 h-4 mr-2" />}
                        {isExpanded ? 'Hide Strategy' : 'Show Strategy'}
                    </Button>
                </div>
            </div>
            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0, marginTop: 0 }}
                        animate={{ height: 'auto', opacity: 1, marginTop: '1rem' }}
                        exit={{ height: 0, opacity: 0, marginTop: 0 }}
                        className="overflow-hidden border-t pt-4"
                    >
                        <h5 className="font-bold mb-3">Step-by-step Strategy:</h5>
                        <div className="space-y-3">
                            {currentStrategy.map((step, index) => (
                                <StrategyStep 
                                    key={index}
                                    number={step.number} 
                                    title={step.title} 
                                    description={step.description} 
                                />
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export function ComparisonResults({ rewards, purchaseAmount, onClose, userBanks = [], userCards = [] }) {
  if (!rewards || rewards.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -30 }}
        transition={{ duration: 0.5 }}
        className="text-center p-8 border rounded-lg bg-white"
      >
        <p className="text-lg text-muted-foreground">No matching rewards found. Try adjusting your filters!</p>
      </motion.div>
    )
  }

  // Ordenar por valor considerando Avios Booster
  const sortedRewards = [...rewards].sort((a, b) => {
      let valueA = a.type === 'points' ? (a.amount * 0.008) : a.amount;
      let valueB = b.type === 'points' ? (b.amount * 0.008) : b.amount;
      
      // Se for cashback, considerar potencial compra de Avios Booster
      if (a.type === 'cashback') {
        const cashbackAmount = a.amount * (purchaseAmount / 100);
        const aviosFromBooster = cashbackAmount * 2000 / 37; // Aproximadamente 54 Avios por £1
        valueA = Math.max(valueA, aviosFromBooster * 0.008);
      }
      
      if (b.type === 'cashback') {
        const cashbackAmount = b.amount * (purchaseAmount / 100);
        const aviosFromBooster = cashbackAmount * 2000 / 37;
        valueB = Math.max(valueB, aviosFromBooster * 0.008);
      }
      
      return valueB - valueA;
  });

  // Mostrar apenas as 5 melhores opções
  const topRewards = sortedRewards.slice(0, 5);

  return (
    <Card
      as={motion.div}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ duration: 0.5 }}
      className="shadow-lg"
    >
      <CardHeader className="flex flex-row items-center justify-between bg-light-pink">
        <div>
          <CardTitle className="text-2xl text-primary">Comparison Results</CardTitle>
          <CardDescription className="font-semibold">Based on a £{purchaseAmount} purchase.</CardDescription>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="w-5 h-5" />
        </Button>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid gap-4">
          {topRewards.map((reward, index) => (
            <RewardCard 
              key={reward.id} 
              reward={reward} 
              purchaseAmount={purchaseAmount} 
              isBestValue={index === 0}
              userBanks={userBanks}
              userCards={userCards}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default ComparisonResults;