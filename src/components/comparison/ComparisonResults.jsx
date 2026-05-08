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

const RewardCard = ({ reward, purchaseAmount, isBestValue }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const gainValue = reward.type === 'cashback' || reward.type === 'gift-card'
        ? `£${(reward.amount * (purchaseAmount / 100)).toFixed(2)}`
        : `${Math.floor(reward.amount * (purchaseAmount / 100))} pts`;

    const handleGoToPlatform = () => {
        window.open(reward.affiliateLink, '_blank', 'noopener,noreferrer');
    };

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
                            <StrategyStep number="1" title="Buy Gift Card" description="Purchase a £100 gift card from JamDoughnut using your Amex Gold card." />
                            <StrategyStep number="2" title="Shop via Avios" description="Go to the Avios eStore and click through to the retailer's website." />
                            <StrategyStep number="3" title="Pay with Gift Card" description="At checkout, use the gift card you purchased to complete the transaction." />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export function ComparisonResults({ rewards, purchaseAmount, onClose }) {
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

  const sortedRewards = [...rewards].sort((a, b) => {
      const valueA = a.type === 'points' ? (a.amount * 0.008) : a.amount;
      const valueB = b.type === 'points' ? (b.amount * 0.008) : b.amount;
      return valueB - valueA;
  });

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
          {sortedRewards.map((reward, index) => (
            <RewardCard key={reward.id} reward={reward} purchaseAmount={purchaseAmount} isBestValue={index === 0} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}