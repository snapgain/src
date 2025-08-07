import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, Calculator } from 'lucide-react';

const SimpleComparisonResults = ({ selectedStore, purchaseAmount, onClose }) => {
  if (!selectedStore || !purchaseAmount || purchaseAmount <= 0) {
    return null;
  }

  const mockResults = [
    {
      platform: 'TopCashback',
      cashbackRate: '2.5%',
      estimatedCashback: (purchaseAmount * 0.025).toFixed(2),
      link: 'https://www.topcashback.co.uk',
      features: ['Highest rates', 'Fast payouts', 'Mobile app']
    },
    {
      platform: 'Quidco',
      cashbackRate: '2%',
      estimatedCashback: (purchaseAmount * 0.02).toFixed(2),
      link: 'https://www.quidco.com',
      features: ['Quick signup', 'Regular bonuses', 'Price alerts']
    },
    {
      platform: 'Honey',
      cashbackRate: '1.5%',
      estimatedCashback: (purchaseAmount * 0.015).toFixed(2),
      link: 'https://www.joinhoney.com',
      features: ['Browser extension', 'Auto-coupons', 'Easy to use']
    }
  ];

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Comparison Results for {selectedStore}</span>
          <Button variant="ghost" size="sm" onClick={onClose}>×</Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          {mockResults.map((result, index) => (
            <Card key={index} className={`relative ${index === 0 ? 'border-green-500 bg-green-50' : ''}`}>
              {index === 0 && (
                <div className="absolute top-0 right-0 px-3 py-1 bg-green-500 text-white text-xs font-bold rounded-bl-lg">
                  Best Option
                </div>
              )}
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-semibold text-lg">{result.platform}</h4>
                    <p className="text-sm text-gray-600">{result.cashbackRate} cashback</p>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold text-green-600">
                      £{result.estimatedCashback}
                    </div>
                    <p className="text-sm text-gray-500">estimated cashback</p>
                  </div>
                </div>
                <div className="space-y-2 mb-4">
                  {result.features.map((feature, idx) => (
                    <Badge key={idx} variant="outline" className="mr-2 mb-2">
                      {feature}
                    </Badge>
                  ))}
                </div>
                <Button 
                  className="w-full" 
                  onClick={() => window.open(result.link, '_blank')}
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Go to {result.platform}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export function ComparisonTool() {
  const [selectedStore, setSelectedStore] = useState('');
  const [purchaseAmount, setPurchaseAmount] = useState('');
  const [showComparison, setShowComparison] = useState(false);

  const stores = [
    'Amazon UK', 'Tesco', 'Sainsbury\'s', 'ASDA', 'John Lewis', 
    'Currys', 'Argos', 'Next', 'M&S', 'ASOS'
  ];

  const handleCompare = () => {
    if (selectedStore && purchaseAmount && parseFloat(purchaseAmount) > 0) {
      setShowComparison(true);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="shadow-xl border-0 rounded-2xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
          <CardTitle className="flex items-center text-3xl font-bold">
            <Calculator className="w-8 h-8 mr-3" />
            Reward Comparison
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8 space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <Label className="block font-semibold mb-2">Select Store</Label>
              <select
                value={selectedStore}
                onChange={(e) => setSelectedStore(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="">Choose a store...</option>
                {stores.map((store) => (
                  <option key={store} value={store}>{store}</option>
                ))}
              </select>
            </div>
            
            <div>
              <Label htmlFor="purchaseAmount" className="block font-semibold mb-2">
                Purchase Amount
              </Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-bold">
                  £
                </span>
                <Input
                  id="purchaseAmount"
                  type="number"
                  value={purchaseAmount}
                  onChange={(e) => setPurchaseAmount(e.target.value)}
                  placeholder="100.00"
                  className="pl-8 pr-4 py-3 h-12 text-lg border-gray-300 focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>
          </div>

          <div className="pt-4">
            <Button
              onClick={handleCompare}
              disabled={!selectedStore || !purchaseAmount || parseFloat(purchaseAmount) <= 0}
              size="lg"
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-4 text-lg"
            >
              Compare Rewards
            </Button>
          </div>
        </CardContent>
      </Card>

      {showComparison && (
        <SimpleComparisonResults 
          selectedStore={selectedStore}
          purchaseAmount={parseFloat(purchaseAmount)}
          onClose={() => setShowComparison(false)}
        />
      )}
    </div>
  );
}
