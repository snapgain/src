
import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useNavigate } from 'react-router-dom';
import { Crown, Clock, CheckCircle, Calculator, Search, ExternalLink } from 'lucide-react';

// Inline stores data to avoid import issues
const stores = [
  { id: 'amazon', name: 'Amazon UK' },
  { id: 'tesco', name: 'Tesco' },
  { id: 'sainsburys', name: "Sainsbury's" },
  { id: 'asda', name: 'ASDA' },
  { id: 'johnlewis', name: 'John Lewis' },
  { id: 'argos', name: 'Argos' },
  { id: 'currys', name: 'Currys' },
  { id: 'very', name: 'Very' },
  { id: 'next', name: 'Next' }
];

const rewardOptions = [
  { id: 'cashback', label: 'Cashback' },
  { id: 'points', label: 'Points' },
  { id: 'vouchers', label: 'Vouchers' }
];

function DashboardPage() {
  const { user, isTrialExpired } = useAuth();
  const navigate = useNavigate();
  
  // Comparison tool state
  const [selectedStore, setSelectedStore] = useState('');
  const [purchaseAmount, setPurchaseAmount] = useState('');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleCompare = async () => {
    if (!selectedStore || !purchaseAmount) {
      return;
    }

    setIsLoading(true);
    
    // Simular comparação com dados mockados
    const mockResults = [
      {
        id: 1,
        platform: 'TopCashback',
        cashbackRate: '2.5%',
        estimatedCashback: (parseFloat(purchaseAmount) * 0.025).toFixed(2),
        type: 'cashback',
        link: 'https://www.topcashback.co.uk',
        features: ['No annual fee', 'Instant cashback']
      },
      {
        id: 2,
        platform: 'Quidco',
        cashbackRate: '2%',
        estimatedCashback: (parseFloat(purchaseAmount) * 0.02).toFixed(2),
        type: 'cashback',
        link: 'https://www.quidco.com',
        features: ['Quick payout', 'App rewards']
      },
      {
        id: 3,
        platform: 'Honey',
        cashbackRate: '1.5%',
        estimatedCashback: (parseFloat(purchaseAmount) * 0.015).toFixed(2),
        type: 'cashback',
        link: 'https://www.joinhoney.com',
        features: ['Automatic coupons', 'Price tracking']
      }
    ];

    setTimeout(() => {
      setResults(mockResults);
      setIsLoading(false);
    }, 1000);
  };

  const getSubscriptionStatus = () => {
    if (!user) return null;
    
    if (user.subscription === 'premium') {
      return {
        status: 'Premium',
        color: 'bg-yellow-500',
        icon: <Crown className="h-4 w-4" />,
        description: 'You have full access to all features'
      };
    } else if (isTrialExpired) {
      return {
        status: 'Trial Expired',
        color: 'bg-red-500',
        icon: <Clock className="h-4 w-4" />,
        description: 'Your trial has expired. Upgrade to continue'
      };
    } else {
      const trialDaysLeft = user.trialStart ? 
        Math.max(0, 3 - Math.floor((new Date() - new Date(user.trialStart)) / (24 * 60 * 60 * 1000))) : 3;
      
      return {
        status: `Trial (${trialDaysLeft} days left)`,
        color: 'bg-blue-500',
        icon: <CheckCircle className="h-4 w-4" />,
        description: `Enjoy your free trial for ${trialDaysLeft} more days`
      };
    }
  };

  const subscriptionStatus = getSubscriptionStatus();

  return (
    <>
      <Helmet>
        <title>Dashboard - SnapGain</title>
      </Helmet>
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              Welcome back, <span className="gradient-text">{user?.name || 'User'}!</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Ready to maximize your rewards? Let's find the best deals.
            </p>
          </div>
          
          {subscriptionStatus && (
            <Card className="mt-4 md:mt-0 md:ml-8">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Subscription Status</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center space-x-2 mb-2">
                  <Badge className={`${subscriptionStatus.color} text-white`}>
                    {subscriptionStatus.icon}
                    <span className="ml-1">{subscriptionStatus.status}</span>
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mb-3">
                  {subscriptionStatus.description}
                </p>
                {(user?.subscription !== 'premium') && (
                  <Button 
                    size="sm" 
                    onClick={() => navigate('/pricing')}
                    className="w-full"
                  >
                    Upgrade Now
                  </Button>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {isTrialExpired && (
          <Card className="mb-8 border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <div className="flex items-center space-x-3">
                <Clock className="h-8 w-8 text-red-500" />
                <div>
                  <h3 className="font-semibold text-red-900">Trial Expired</h3>
                  <p className="text-red-700">
                    Your free trial has ended. Upgrade to Premium to continue using SnapGain.
                  </p>
                  <Button 
                    className="mt-3" 
                    onClick={() => navigate('/pricing')}
                  >
                    View Pricing Plans
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Inline Comparison Tool */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5" />
                Compare Cashback & Rewards
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Select Store</label>
                  <select 
                    value={selectedStore} 
                    onChange={(e) => setSelectedStore(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Choose a store</option>
                    {stores.map((store) => (
                      <option key={store.id} value={store.name}>
                        {store.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-2 block">Purchase Amount (£)</label>
                  <Input
                    type="number"
                    placeholder="100"
                    value={purchaseAmount}
                    onChange={(e) => setPurchaseAmount(e.target.value)}
                  />
                </div>
                
                <div className="flex items-end">
                  <Button 
                    onClick={handleCompare} 
                    disabled={!selectedStore || !purchaseAmount || isLoading}
                    className="w-full"
                  >
                    <Search className="h-4 w-4 mr-2" />
                    {isLoading ? 'Comparing...' : 'Compare'}
                  </Button>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">Reward Types</label>
                <div className="flex flex-wrap gap-2">
                  {rewardOptions.map((option) => (
                    <Badge key={option.id} variant="outline" className="cursor-pointer">
                      {option.label}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {results.length > 0 && (
            <div className="grid gap-4">
              {results.map((result, index) => (
                <Card key={index} className="relative">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{result.platform}</CardTitle>
                        <p className="text-sm text-gray-600">{result.cashbackRate} cashback</p>
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-bold text-green-600">
                          £{result.estimatedCashback}
                        </div>
                        <p className="text-sm text-gray-500">estimated cashback</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {result.features.map((feature, idx) => (
                        <Badge key={idx} variant="outline" className="mr-2 mb-2">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                    <Button 
                      className="w-full mt-4" 
                      onClick={() => window.open(result.link, '_blank')}
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Go to {result.platform}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default DashboardPage;
