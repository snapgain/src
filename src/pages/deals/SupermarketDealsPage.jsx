import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  ShoppingCart, 
  Search, 
  SortAsc, 
  SortDesc, 
  Star, 
  MapPin, 
  Users,
  Heart,
  Filter
} from 'lucide-react';
import { useProfile } from '@/contexts/ProfileContext';

function SupermarketDealsPage() {
  const navigate = useNavigate();
  const { favoriteStores, cards } = useProfile();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('cashback');
  const [sortOrder, setSortOrder] = useState('desc');
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  // Mock data - supermarket deals
  const supermarketDeals = [
    {
      id: 1,
      store: 'ASDA',
      title: 'Grocery Cashback Plus',
      description: 'Enhanced cashback on groceries, fresh produce and household essentials',
      cashbackRate: 4.0,
      maxCashback: 40,
      originalRate: 2.5,
      increase: 1.5,
      category: 'Grocery',
      validUntil: '2025-08-31',
      featured: true,
      trending: true,
      logo: '🛒',
      color: 'from-green-500 to-green-600',
      recommendedCard: 'ASDA Cashback Credit Card',
      isFavorite: favoriteStores.includes('ASDA'),
      terms: 'Minimum spend £20. Fresh produce included.',
      rating: 4.7,
      specialOffer: 'Double cashback on organic products',
      regions: ['England', 'Wales', 'Scotland'],
      membershipRequired: false,
      deliveryOptions: ['Click & Collect', 'Home Delivery'],
      avgBasketSize: '£45',
      customerSatisfaction: 94
    },
    {
      id: 2,
      store: 'Tesco',
      title: 'Clubcard Plus Cashback',
      description: 'Extra cashback for Clubcard members on all grocery shopping',
      cashbackRate: 3.5,
      maxCashback: 35,
      originalRate: 2.0,
      increase: 1.5,
      category: 'Grocery',
      validUntil: '2025-09-15',
      featured: true,
      trending: false,
      logo: '🏪',
      color: 'from-blue-400 to-blue-500',
      recommendedCard: 'Tesco Bank Credit Card',
      isFavorite: favoriteStores.includes('Tesco'),
      terms: 'Clubcard required. Excludes fuel and gift cards.',
      rating: 4.6,
      specialOffer: 'Triple points on Tesco Finest range',
      regions: ['England', 'Wales', 'Scotland', 'Northern Ireland'],
      membershipRequired: true,
      deliveryOptions: ['Click & Collect', 'Home Delivery', 'Express'],
      avgBasketSize: '£52',
      customerSatisfaction: 92
    },
    {
      id: 3,
      store: 'Sainsbury\'s',
      title: 'Nectar Points Boost',
      description: 'Enhanced Nectar points plus cashback on grocery purchases',
      cashbackRate: 3.0,
      maxCashback: 30,
      originalRate: 1.5,
      increase: 1.5,
      category: 'Grocery',
      validUntil: '2025-08-20',
      featured: false,
      trending: true,
      logo: '🛍️',
      color: 'from-orange-400 to-orange-500',
      recommendedCard: 'Sainsbury\'s Nectar Credit Card',
      isFavorite: favoriteStores.includes('Sainsbury\'s'),
      terms: 'Nectar card required. Online and in-store.',
      rating: 4.5,
      specialOffer: 'Extra points on Taste the Difference products',
      regions: ['England', 'Wales', 'Scotland'],
      membershipRequired: true,
      deliveryOptions: ['Click & Collect', 'Home Delivery', 'Chop Chop'],
      avgBasketSize: '£48',
      customerSatisfaction: 90
    },
    {
      id: 4,
      store: 'Morrison\'s',
      title: 'More Card Rewards',
      description: 'Cashback on fresh food, groceries and household items',
      cashbackRate: 2.8,
      maxCashback: 25,
      originalRate: 1.8,
      increase: 1.0,
      category: 'Grocery',
      validUntil: '2025-09-30',
      featured: false,
      trending: false,
      logo: '🥬',
      color: 'from-green-400 to-green-500',
      recommendedCard: 'Morrison\'s More Credit Card',
      isFavorite: favoriteStores.includes('Morrison\'s'),
      terms: 'More card required. Fresh Market included.',
      rating: 4.3,
      specialOffer: 'Extra cashback on local produce',
      regions: ['England', 'Wales', 'Scotland'],
      membershipRequired: true,
      deliveryOptions: ['Click & Collect', 'Home Delivery'],
      avgBasketSize: '£41',
      customerSatisfaction: 88
    },
    {
      id: 5,
      store: 'Waitrose',
      title: 'myWaitrose Premium',
      description: 'Premium cashback on quality groceries and luxury items',
      cashbackRate: 2.5,
      maxCashback: 50,
      originalRate: 1.0,
      increase: 1.5,
      category: 'Premium Grocery',
      validUntil: '2025-10-15',
      featured: true,
      trending: false,
      logo: '🍾',
      color: 'from-purple-500 to-purple-600',
      recommendedCard: 'John Lewis Partnership Card',
      isFavorite: favoriteStores.includes('Waitrose'),
      terms: 'myWaitrose membership included. Premium brands.',
      rating: 4.8,
      specialOffer: 'Free delivery on orders over £60',
      regions: ['England', 'Wales', 'Scotland'],
      membershipRequired: true,
      deliveryOptions: ['Click & Collect', 'Home Delivery', 'Rapid'],
      avgBasketSize: '£65',
      customerSatisfaction: 96
    }
  ];

  const regions = ['all', 'England', 'Wales', 'Scotland', 'Northern Ireland'];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  // Filtrar e ordenar deals
  const filteredAndSortedDeals = useMemo(() => {
    let filtered = supermarketDeals.filter(deal => {
      const matchesSearch = deal.store.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           deal.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesRegion = selectedRegion === 'all' || deal.regions.includes(selectedRegion);
      const matchesFavorites = !showFavoritesOnly || deal.isFavorite;
      return matchesSearch && matchesRegion && matchesFavorites;
    });

    return filtered.sort((a, b) => {
      const order = sortOrder === 'asc' ? 1 : -1;
      switch (sortBy) {
        case 'cashback':
          return (a.cashbackRate - b.cashbackRate) * order;
        case 'store':
          return a.store.localeCompare(b.store) * order;
        case 'rating':
          return (a.rating - b.rating) * order;
        default:
          return 0;
      }
    });
  }, [supermarketDeals, searchQuery, sortBy, sortOrder, selectedRegion, showFavoritesOnly]);

  const handleViewDeal = (deal) => {
    // Redirecionar para a loja ou abrir modal com detalhes
    window.open(`https://www.${deal.store.toLowerCase().replace(' ', '').replace('\'', '')}.co.uk`, '_blank');
  };

  return (
    <DashboardLayout
      title="🛒 Supermarket Deals"
      subtitle="Best grocery cashback deals from UK supermarkets"
      icon={{
        element: <ShoppingCart className="h-8 w-8 text-white" />,
        bgColor: "bg-gradient-to-r from-green-500 to-blue-500"
      }}
    >
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-8"
      >
        {/* FILTROS E BUSCA */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Filter className="h-5 w-5" />
              <span>Filter Supermarket Deals</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search supermarkets..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="rounded-md border border-input bg-background px-3 py-2"
              >
                <option value="cashback">Sort by Cashback</option>
                <option value="store">Sort by Store</option>
                <option value="rating">Sort by Rating</option>
              </select>
              
              <select
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                className="rounded-md border border-input bg-background px-3 py-2"
              >
                {regions.map(region => (
                  <option key={region} value={region}>
                    {region === 'all' ? 'All Regions' : region}
                  </option>
                ))}
              </select>
              
              <Button
                variant="outline"
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="flex items-center space-x-2"
              >
                {sortOrder === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
                <span>{sortOrder === 'asc' ? 'Ascending' : 'Descending'}</span>
              </Button>
              
              <Button
                variant={showFavoritesOnly ? "default" : "outline"}
                onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
                className="flex items-center space-x-2"
              >
                <Heart className={`h-4 w-4 ${showFavoritesOnly ? 'fill-current' : ''}`} />
                <span>Favorites Only</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* GRID DE DEALS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAndSortedDeals.map((deal, index) => (
            <motion.div key={deal.id} variants={itemVariants}>
              <Card className="h-full hover:shadow-lg transition-shadow duration-300 relative overflow-hidden">
                {deal.featured && (
                  <Badge className="absolute top-2 right-2 bg-green-500 text-white">
                    Featured
                  </Badge>
                )}
                {deal.trending && (
                  <Badge className="absolute top-2 left-2 bg-orange-500 text-white">
                    📈 Trending
                  </Badge>
                )}
                
                <CardHeader className={`bg-gradient-to-r ${deal.color} text-white`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{deal.logo}</span>
                      <div>
                        <CardTitle className="text-lg">{deal.store}</CardTitle>
                        <p className="text-sm opacity-90">{deal.category}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold">{deal.cashbackRate}%</div>
                      <div className="text-xs opacity-90">was {deal.originalRate}%</div>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="p-6 space-y-4">
                  <div>
                    <h3 className="font-semibold text-lg mb-2">{deal.title}</h3>
                    <p className="text-muted-foreground text-sm">{deal.description}</p>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Max Cashback:</span>
                      <span className="font-semibold">£{deal.maxCashback}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Avg Basket:</span>
                      <span className="font-semibold">{deal.avgBasketSize}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Satisfaction:</span>
                      <span className="font-semibold">{deal.customerSatisfaction}%</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">{deal.rating}</span>
                    </div>
                    <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                      <MapPin className="h-3 w-3" />
                      <span>{deal.regions.length} regions</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Badge variant="outline" className="text-xs">
                      {deal.specialOffer}
                    </Badge>
                    <div className="flex flex-wrap gap-1">
                      {deal.deliveryOptions.map(option => (
                        <Badge key={option} variant="secondary" className="text-xs">
                          {option}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div className="pt-4 space-y-2">
                    <Button 
                      onClick={() => handleViewDeal(deal)}
                      className="w-full"
                    >
                      Shop & Earn Cashback
                    </Button>
                    <p className="text-xs text-muted-foreground">{deal.terms}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {filteredAndSortedDeals.length === 0 && (
          <motion.div variants={itemVariants}>
            <Card>
              <CardContent className="text-center py-12">
                <ShoppingCart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Supermarket Deals Found</h3>
                <p className="text-muted-foreground mb-6">
                  Try adjusting your search terms or region filters
                </p>
                <Button 
                  variant="outline"
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedRegion('all');
                    setShowFavoritesOnly(false);
                  }}
                >
                  Clear Filters
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </motion.div>
    </DashboardLayout>
  );
}

export default SupermarketDealsPage;