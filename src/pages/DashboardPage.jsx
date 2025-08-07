
import React from 'react';
import { Helmet } from 'react-helmet';
import ComparisonTool from '@/components/comparison/ComparisonTool';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Crown, Clock, CheckCircle } from 'lucide-react';

function DashboardPage() {
  const { user, isTrialExpired } = useAuth();
  const navigate = useNavigate();

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

        <ComparisonTool />
      </div>
    </>
  );
}

export default DashboardPage;
