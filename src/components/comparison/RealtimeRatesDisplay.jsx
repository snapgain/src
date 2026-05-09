import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  TrendingUp, 
  TrendingDown, 
  Clock, 
  Zap, 
  Info, 
  Bell,
  RefreshCw,
  CheckCircle
} from 'lucide-react';
import { useRealtimeCashbackRates, useRateNotifications } from '@/hooks/useRealtimeCashbackRates';
import { formatGBP } from '@/data/ukData';

export function RealtimeRatesDisplay() {
  const { rates, loading, error, lastUpdate, refetch } = useRealtimeCashbackRates();
  const { notifications, dismissNotification } = useRateNotifications();
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', label: 'All Stores', icon: '🏪' },
    { id: 'fashion', label: 'Fashion', icon: '👗' },
    { id: 'electronics', label: 'Electronics', icon: '📱' },
    { id: 'grocery', label: 'Grocery', icon: '🛒' },
    { id: 'health-beauty', label: 'Health & Beauty', icon: '💄' },
    { id: 'marketplace', label: 'Marketplace', icon: '🏬' }
  ];

  const platforms = {
    'topcashback': { name: 'TopCashback', color: 'bg-blue-500', icon: '💰' },
    'jamdoughnut': { name: 'JamDoughnut', color: 'bg-pink-500', icon: '🍩' },
    'amazon-direct': { name: 'Amazon UK', color: 'bg-orange-500', icon: '📦' },
    'quidco': { name: 'Quidco', color: 'bg-green-500', icon: '💳' }
  };

  const filteredRates = selectedCategory === 'all' 
    ? rates 
    : rates.filter(rate => rate.category === selectedCategory);

  const groupedRates = filteredRates.reduce((acc, rate) => {
    if (!acc[rate.store]) {
      acc[rate.store] = [];
    }
    acc[rate.store].push(rate);
    return acc;
  }, {});

  const formatStoreName = (storeId) => {
    return storeId.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const getTimeAgo = (timestamp) => {
    if (!timestamp) return 'Unknown';
    const now = new Date();
    const diff = now - new Date(timestamp);
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return new Date(timestamp).toLocaleDateString();
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-8">
          <RefreshCw className="animate-spin mr-2" />
          Loading real-time rates...
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          Error loading rates: {error}
          <Button variant="outline" size="sm" onClick={refetch} className="ml-2">
            Retry
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      {/* Real-time Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-green-500" />
              Live Cashback Rates
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse"></div>
                LIVE
              </Badge>
            </div>
            <div className="text-sm text-muted-foreground flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Last update: {lastUpdate ? getTimeAgo(lastUpdate) : 'Never'}
            </div>
          </CardTitle>
        </CardHeader>
      </Card>

      {/* Notifications */}
      {notifications.length > 0 && (
        <div className="space-y-2">
          {notifications.slice(0, 3).map(notification => (
            <Alert key={notification.id} className="border-blue-200 bg-blue-50">
              <Bell className="w-4 h-4" />
              <AlertDescription className="flex items-center justify-between">
                <span>
                  <strong>{formatStoreName(notification.store)}</strong> on {platforms[notification.platform]?.name}
                  {notification.isIncrease ? (
                    <span className="text-green-600 font-medium">
                      ↗ {notification.oldRate}% → {notification.newRate}% 
                      (+{notification.changePercentage}%)
                    </span>
                  ) : (
                    <span className="text-red-600 font-medium">
                      ↘ {notification.oldRate}% → {notification.newRate}% 
                      ({notification.changePercentage}%)
                    </span>
                  )}
                </span>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => dismissNotification(notification.id)}
                >
                  ×
                </Button>
              </AlertDescription>
            </Alert>
          ))}
        </div>
      )}

      {/* Category Filter */}
      <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
        <TabsList className="grid w-full grid-cols-6">
          {categories.map(category => (
            <TabsTrigger key={category.id} value={category.id} className="text-xs">
              <span className="mr-1">{category.icon}</span>
              {category.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {/* Rates Display */}
        <TabsContent value={selectedCategory} className="space-y-4">
          {Object.entries(groupedRates).map(([store, storeRates]) => (
            <Card key={store} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center justify-between">
                  {formatStoreName(store)}
                  <Badge variant="outline">{storeRates.length} platform{storeRates.length > 1 ? 's' : ''}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {storeRates
                    .sort((a, b) => b.rate - a.rate)
                    .map(rate => (
                    <div key={`${rate.store}-${rate.platform}`} 
                         className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span>{platforms[rate.platform]?.icon}</span>
                          <span className="font-medium text-sm">
                            {platforms[rate.platform]?.name}
                          </span>
                        </div>
                        <Badge className={`${platforms[rate.platform]?.color} text-white`}>
                          {rate.rate}%
                        </Badge>
                      </div>
                      
                      {rate.special_offer && (
                        <p className="text-xs text-muted-foreground mb-2">
                          {rate.special_offer}
                        </p>
                      )}
                      
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>Updated {getTimeAgo(rate.updated_at)}</span>
                        <CheckCircle className="w-3 h-3 text-green-500" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>

      {/* Real-time Policy */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-800">
            <Info className="w-5 h-5" />
            Real-Time Update Policy
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-blue-700">
          <div className="flex items-start gap-2">
            <Zap className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium">Instant Updates</p>
              <p className="text-sm">Cashback rates are updated in real-time as soon as retailers change them.</p>
            </div>
          </div>
          
          <div className="flex items-start gap-2">
            <TrendingUp className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium">Automatic Monitoring</p>
              <p className="text-sm">Our system continuously monitors TopCashback, JamDoughnut, and Amazon UK for rate changes.</p>
            </div>
          </div>
          
          <div className="flex items-start gap-2">
            <Bell className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium">Smart Notifications</p>
              <p className="text-sm">Get notified instantly when rates change for your favorite stores and categories.</p>
            </div>
          </div>
          
          <div className="flex items-start gap-2">
            <Clock className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium">Update Frequency</p>
              <p className="text-sm">Rates are checked every 5 minutes and updated immediately when changes are detected.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
