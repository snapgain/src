import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  Zap, 
  Calculator, 
  TrendingUp, 
  ArrowRight,
  ShoppingBag
} from 'lucide-react';
import { MultiSelectCombobox } from '@/components/ui/multi-select-combobox';

// Avios earning rates for shopping (not flights)
const shoppingAviosRates = {
  'ba-estore': {
    name: 'BA eStore',
    baseRate: 1, // 1 Avios per £1
    bonusRate: 6, // Up to 6 Avios per £1 at selected retailers
    categories: {
      'fashion': { min: 2, max: 6 },
      'electronics': { min: 1, max: 3 },
      'home': { min: 1, max: 4 },
      'travel': { min: 3, max: 8 },
      'groceries': { min: 1, max: 2 }
    }
  },
  'nectar-avios': {
    name: 'Nectar to Avios',
    conversionRate: 300, // 300 Nectar points = 150 Avios
    multiplier: 0.5
  }
};

// UK shopping categories for Avios earning
const shoppingCategories = [
  { value: 'fashion', label: 'Fashion & Clothing', aviosRate: '2-6 per £1', icon: '👕' },
  { value: 'electronics', label: 'Electronics & Tech', aviosRate: '1-3 per £1', icon: '📱' },
  { value: 'home', label: 'Home & Garden', aviosRate: '1-4 per £1', icon: '🏠' },
  { value: 'travel', label: 'Travel & Hotels', aviosRate: '3-8 per £1', icon: '✈️' },
  { value: 'groceries', label: 'Groceries & Food', aviosRate: '1-2 per £1', icon: '🛒' },
  { value: 'general', label: 'General Shopping', aviosRate: '1-2 per £1', icon: '🛍️' }
];

// Avios value for spending (not flights)
const aviosSpendingValue = {
  cashValue: 0.008, // £0.8p per Avios when used for shopping
  flightValue: 0.015, // £1.5p per Avios when used for flights (average)
  upgradeValue: 0.025 // £2.5p per Avios when used for upgrades
};

// Popular destinations with Avios requirements
const destinations = [
  { 
    value: 'london-edinburgh', 
    label: 'London to Edinburgh', 
    type: 'domestic',
    economy: 7500, 
    premium: 15000, 
    business: 22500,
    distance: '393 miles'
  },
  { 
    value: 'london-paris', 
    label: 'London to Paris', 
    type: 'europe',
    economy: 7500, 
    premium: 15000, 
    business: 25000,
    distance: '214 miles'
  },
  { 
    value: 'london-madrid', 
    label: 'London to Madrid', 
    type: 'europe',
    economy: 10000, 
    premium: 20000, 
    business: 30000,
    distance: '785 miles'
  },
  { 
    value: 'london-rome', 
    label: 'London to Rome', 
    type: 'europe',
    economy: 12500, 
    premium: 25000, 
    business: 37500,
    distance: '895 miles'
  },
  { 
    value: 'london-new-york', 
    label: 'London to New York', 
    type: 'longHaul',
    economy: 26000, 
    premium: 52000, 
    business: 78000,
    first: 130000,
    distance: '3459 miles'
  },
  { 
    value: 'london-dubai', 
    label: 'London to Dubai', 
    type: 'longHaul',
    economy: 25000, 
    premium: 50000, 
    business: 75000,
    first: 125000,
    distance: '3420 miles'
  },
  { 
    value: 'london-singapore', 
    label: 'London to Singapore', 
    type: 'longHaul',
    economy: 30000, 
    premium: 60000, 
    business: 90000,
    first: 150000,
    distance: '6765 miles'
  },
  { 
    value: 'london-sydney', 
    label: 'London to Sydney', 
    type: 'longHaul',
    economy: 35000, 
    premium: 70000, 
    business: 105000,
    first: 175000,
    distance: '10573 miles'
  }
];

const cabinClasses = [
  { value: 'economy', label: 'Economy', icon: '🎫' },
  { value: 'premium', label: 'Premium Economy', icon: '🥉' },
  { value: 'business', label: 'Business Class', icon: '🥈' },
  { value: 'first', label: 'First Class', icon: '🥇' }
];

export default function AviosCalculator() {
  const [currentAvios, setCurrentAvios] = useState('');
  const [spendAmount, setSpendAmount] = useState('');
  const [selectedCategory, setSelectedCategory] = useState([]);
  const [calculations, setCalculations] = useState(null);

  const calculateShoppingStrategy = () => {
    if (!spendAmount || !selectedCategory.length) {
      return;
    }

    const spend = parseFloat(spendAmount);
    const category = shoppingCategories.find(c => c.value === selectedCategory[0].value);
    
    if (!category) return;

    const categoryRates = shoppingAviosRates['ba-estore'].categories[category.value];
    const aviosFromBAStore = Math.floor(spend * categoryRates.max); // Using maximum rate
    const currentAviosCount = parseInt(currentAvios) || 0;
    const totalAvios = currentAviosCount + aviosFromBAStore;

    const calculations = {
      spendAmount: spend,
      category: category.label,
      currentAvios: currentAviosCount,
      aviosFromShopping: aviosFromBAStore,
      totalAvios: totalAvios,
      cashValue: (totalAvios * aviosSpendingValue.cashValue).toFixed(2),
      flightValue: (totalAvios * aviosSpendingValue.flightValue).toFixed(2),
      upgradeValue: (totalAvios * aviosSpendingValue.upgradeValue).toFixed(2),
      effectiveDiscount: ((aviosFromBAStore * aviosSpendingValue.flightValue) / spend * 100).toFixed(1)
    };

    setCalculations(calculations);
  };

  useEffect(() => {
    calculateShoppingStrategy();
  }, [currentAvios, spendAmount, selectedCategory]);

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Plane className="w-8 h-8 text-blue-500" />
            <h1 className="text-4xl font-bold">Avios Calculator</h1>
          </div>
          <p className="text-xl text-muted-foreground">
            Calculate the real value of your British Airways Avios and plan your next redemption
          </p>
        </div>

        {/* Calculator Form */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="w-5 h-5" />
              Calculate Shopping Avios Strategy
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="currentAvios">Current Avios Balance</Label>
                <Input
                  id="currentAvios"
                  type="number"
                  placeholder="e.g. 50000"
                  value={currentAvios}
                  onChange={(e) => setCurrentAvios(e.target.value)}
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label>Shopping Category</Label>
                <MultiSelectCombobox
                  options={shoppingCategories}
                  selected={selectedCategory}
                  onChange={setSelectedCategory}
                  placeholder="Select category..."
                  isSingleSelect={true}
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="spendAmount">Shopping Amount (£)</Label>
                <Input
                  id="spendAmount"
                  type="number"
                  placeholder="e.g. 500"
                  value={spendAmount}
                  onChange={(e) => setSpendAmount(e.target.value)}
                  className="mt-1"
                />
                <p className="text-sm text-muted-foreground mt-1">
                  How much do you plan to spend via BA eStore?
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        {calculations && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Shopping Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-green-500" />
                  Shopping Strategy: {calculations.category}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-4 gap-4">
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      £{calculations.spendAmount}
                    </div>
                    <div className="text-sm text-muted-foreground">Spend Amount</div>
                  </div>
                  
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">
                      {calculations.aviosFromShopping.toLocaleString()}
                    </div>
                    <div className="text-sm text-muted-foreground">Avios Earned</div>
                  </div>
                  
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">
                      {calculations.totalAvios.toLocaleString()}
                    </div>
                    <div className="text-sm text-muted-foreground">Total Avios</div>
                  </div>
                  
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      {calculations.effectiveDiscount}%
                    </div>
                    <div className="text-sm text-muted-foreground">Effective Discount</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Value Analysis */}
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-blue-500" />
                    Avios Value Comparison
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Shopping Value:</span>
                      <Badge variant="outline">£{calculations.cashValue}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Flight Value:</span>
                      <Badge className="bg-blue-100 text-blue-800">£{calculations.flightValue}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Upgrade Value:</span>
                      <Badge className="bg-green-100 text-green-800">£{calculations.upgradeValue}</Badge>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t">
                    <div className="text-sm text-muted-foreground">
                      Best use: Save for flights for {((parseFloat(calculations.flightValue) / parseFloat(calculations.cashValue) - 1) * 100).toFixed(0)}% more value
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calculator className="w-5 h-5 text-orange-500" />
                    Strategy Recommendation
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="text-blue-800 font-semibold">
                      💡 Smart Strategy
                    </div>
                    <div className="text-sm text-blue-600 mt-2">
                      1. Shop via BA eStore for {calculations.category.toLowerCase()}<br />
                      2. Earn {calculations.aviosFromShopping.toLocaleString()} Avios<br />
                      3. Save for flights (worth £{calculations.flightValue})<br />
                      4. Effective {calculations.effectiveDiscount}% discount on purchase
                    </div>
                  </div>
                  
                  <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="text-green-800 font-semibold">
                      🎯 Alternative Strategy
                    </div>
                    <div className="text-sm text-green-600 mt-2">
                      Compare with TopCashback ({calculations.category.toLowerCase()}: 2-6%)<br />
                      vs BA eStore ({calculations.effectiveDiscount}% effective)
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Platform Comparison */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ArrowRight className="w-5 h-5 text-purple-500" />
                  UK Platform Comparison
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-semibold mb-2 flex items-center gap-2">
                      ✈️ BA eStore
                    </h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      Earn Avios for future flights
                    </p>
                    <ul className="text-sm space-y-1">
                      <li>• 1-6 Avios per £1</li>
                      <li>• Best for frequent flyers</li>
                      <li>• Higher value when saved</li>
                    </ul>
                  </div>
                  
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-semibold mb-2 flex items-center gap-2">
                      💰 TopCashback
                    </h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      Immediate cash rewards
                    </p>
                    <ul className="text-sm space-y-1">
                      <li>• 1-15% cashback</li>
                      <li>• Instant value</li>
                      <li>• Direct bank transfer</li>
                    </ul>
                  </div>
                  
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-semibold mb-2 flex items-center gap-2">
                      🍩 JamDoughnut
                    </h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      Student & young professional rates
                    </p>
                    <ul className="text-sm space-y-1">
                      <li>• 2-20% cashback</li>
                      <li>• Age-specific offers</li>
                      <li>• Social features</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
