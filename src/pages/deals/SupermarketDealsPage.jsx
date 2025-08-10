import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useProfile } from '@/contexts/ProfileContext';
import { useNavigate } from 'react-router-dom';
import { 
  ShoppingCart, 
  Search, 
  ExternalLink, 
  Star, 
  TrendingUp,
  Clock,
  Target,
  SortAsc,
  SortDesc,
  Filter,
  RefreshCw,
  ArrowLeft,
  Percent,
  MapPin,
  Users
} from 'lucide-react';

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
      membershipRequired: false,
      deliveryOptions: ['Click & Collect', 'Home Delivery', 'Rapid'],
      avgBasketSize: '£65',
      customerSatisfaction: 96
    },
    {
      id: 6,
      store: 'Iceland',
      title: 'Frozen Food Cashback',
      description: 'Special cashback on frozen foods and ready meals',
      cashbackRate: 3.2,
      maxCashback: 20,
      originalRate: 2.2,
      increase: 1.0,
      category: 'Frozen Foods',
      validUntil: '2025-08-25',
      featured: false,
      trending: true,
      logo: '🧊',
      color: 'from-cyan-400 to-blue-500',
      recommendedCard: 'Iceland Bonus Card',
      isFavorite: favoriteStores.includes('Iceland'),
      terms: 'Bonus Card members only. Frozen section only.',
      rating: 4.2,
      specialOffer: 'Buy 2 get 1 free on selected ranges',
      regions: ['England', 'Wales', 'Scotland', 'Northern Ireland'],
      membershipRequired: true,
      deliveryOptions: ['Click & Collect', 'Home Delivery'],
      avgBasketSize: '£28',
      customerSatisfaction: 85
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

  // Filtered and sorted deals
  const filteredDeals = useMemo(() => {
    let filtered = supermarketDeals.filter(deal => {
      const matchesSearch = deal.store.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           deal.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           deal.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFavorites = !showFavoritesOnly || deal.isFavorite;
      const matchesRegion = selectedRegion === 'all' || deal.regions.includes(selectedRegion);
      return matchesSearch && matchesFavorites && matchesRegion;
    });

    // Sort deals
    filtered.sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];
      
      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [searchQuery, sortBy, sortOrder, showFavoritesOnly, selectedRegion]);

  const getBestSupermarketDeal = () => {
    return filteredDeals.reduce((best, current) => {
      return current.cashbackRate > (best?.cashbackRate || 0) ? current : best;
    }, null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-8"
        >
          {/* Header */}
          <motion.div variants={itemVariants}>
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-4">
                <Button 
                  variant="outline" 
                  onClick={() => navigate('/dashboard')}
                  className="flex items-center space-x-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>Back to Dashboard</span>
                </Button>
                <div className="flex items-center space-x-3">
                  <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                    <ShoppingCart className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h1 className="text-4xl font-bold">🛒 Supermarket Deals</h1>
                    <p className="text-muted-foreground text-lg">
                      Best cashback deals for your grocery shopping
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Quick Stats */}
          <motion.div variants={itemVariants}>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <Target className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-green-600 font-medium">Best Rate</p>
                      <p className="text-xl font-bold text-green-800">
                        {getBestSupermarketDeal()?.cashbackRate}% at {getBestSupermarketDeal()?.store}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <ShoppingCart className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground font-medium">Total Stores</p>
                      <p className="text-xl font-bold">{filteredDeals.length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                      <Star className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground font-medium">Your Favorites</p>
                      <p className="text-xl font-bold">
                        {supermarketDeals.filter(d => d.isFavorite).length}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                      <TrendingUp className="h-5 w-5 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground font-medium">Trending</p>
                      <p className="text-xl font-bold">
                        {supermarketDeals.filter(d => d.trending).length}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.div>

          {/* Search and Filters */}
          <motion.div variants={itemVariants}>
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-4">
                  {/* Search Bar */}
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      placeholder="Search supermarkets..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>

                  {/* Region Filter */}
                  <select
                    value={selectedRegion}
                    onChange={(e) => setSelectedRegion(e.target.value)}
                    className="px-3 py-2 border border-gray-200 rounded-md min-w-[150px]"
                  >
                    {regions.map(region => (
                      <option key={region} value={region}>
                        {region === 'all' ? 'All Regions' : region}
                      </option>
                    ))}
                  </select>

                  {/* Sort Options */}
                  <div className="flex gap-2">
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="px-3 py-2 border border-gray-200 rounded-md min-w-[140px]"
                    >
                      <option value="cashbackRate">Cashback Rate</option>
                      <option value="rating">Rating</option>
                      <option value="customerSatisfaction">Satisfaction</option>
                      <option value="avgBasketSize">Basket Size</option>
                    </select>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                    >
                      {sortOrder === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
                    </Button>
                  </div>

                  {/* Favorites Filter */}
                  <Button
                    variant={showFavoritesOnly ? "default" : "outline"}
                    onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
                    className="flex items-center space-x-2"
                  >
                    <Star className={`h-4 w-4 ${showFavoritesOnly ? 'fill-current' : ''}`} />
                    <span>Favorites</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Supermarket Deals */}
          <motion.div variants={itemVariants}>
            <div className="space-y-6">
              {filteredDeals.map((deal) => (
                <motion.div key={deal.id} variants={itemVariants}>
                  <Card className={`transition-all duration-300 hover:shadow-xl ${deal.featured ? 'ring-2 ring-green-200 bg-gradient-to-r from-green-50/50 to-emerald-50/50' : ''}`}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        {/* Store Info */}
                        <div className="flex items-start space-x-4 flex-1">
                          <div className={`w-16 h-16 bg-gradient-to-r ${deal.color} rounded-xl flex items-center justify-center text-2xl shadow-lg flex-shrink-0`}>
                            {deal.logo}
                          </div>
                          
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <h3 className="text-2xl font-bold">{deal.store}</h3>
                              {deal.featured && (
                                <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white">
                                  Featured
                                </Badge>
                              )}
                              {deal.trending && (
                                <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white">
                                  📈 Trending
                                </Badge>
                              )}
                              {deal.isFavorite && (
                                <Badge variant="outline" className="text-red-600 border-red-200">
                                  <Star className="h-3 w-3 mr-1 fill-current" />
                                  Favorite
                                </Badge>
                              )}
                              <Badge variant="outline">{deal.category}</Badge>
                            </div>
                            
                            <h4 className="text-lg font-semibold mb-2">{deal.title}</h4>
                            <p className="text-muted-foreground mb-4">{deal.description}</p>

                            {/* Special Offer */}
                            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 mb-4">
                              <p className="text-sm font-medium text-yellow-800">
                                ✨ Special Offer: {deal.specialOffer}
                              </p>
                            </div>

                            {/* Metadata Grid */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                              <div className="flex items-center space-x-2">
                                <Star className="h-4 w-4 text-yellow-500 fill-current" />
                                <span className="text-sm">
                                  <span className="font-medium">{deal.rating}</span>
                                  <span className="text-muted-foreground ml-1">rating</span>
                                </span>
                              </div>
                              
                              <div className="flex items-center space-x-2">
                                <Users className="h-4 w-4 text-green-600" />
                                <span className="text-sm">
                                  <span className="font-medium">{deal.customerSatisfaction}%</span>
                                  <span className="text-muted-foreground ml-1">satisfied</span>
                                </span>
                              </div>
                              
                              <div className="flex items-center space-x-2">
                                <ShoppingCart className="h-4 w-4 text-blue-600" />
                                <span className="text-sm">
                                  <span className="font-medium">{deal.avgBasketSize}</span>
                                  <span className="text-muted-foreground ml-1">avg basket</span>
                                </span>
                              </div>
                              
                              <div className="flex items-center space-x-2">
                                <MapPin className="h-4 w-4 text-purple-600" />
                                <span className="text-sm">
                                  <span className="font-medium">{deal.regions.length}</span>
                                  <span className="text-muted-foreground ml-1">regions</span>
                                </span>
                              </div>
                            </div>

                            {/* Delivery Options */}
                            <div className="flex flex-wrap gap-2 mb-4">
                              {deal.deliveryOptions.map((option) => (
                                <Badge key={option} variant="secondary" className="text-xs">
                                  {option}
                                </Badge>
                              ))}
                              {deal.membershipRequired && (
                                <Badge variant="outline" className="text-xs text-orange-600 border-orange-200">
                                  Membership Required
                                </Badge>
                              )}
                            </div>

                            {/* Terms */}
                            <p className="text-xs text-muted-foreground italic">{deal.terms}</p>
                          </div>
                        </div>

                        {/* Cashback & Actions */}
                        <div className="flex items-start space-x-6">
                          <div className="text-center">
                            <div className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                              {deal.cashbackRate}%
                            </div>
                            <div className="text-sm text-muted-foreground">Cashback</div>
                            <div className="text-xs text-green-600 font-medium mt-1">
                              +{deal.increase}% boost
                            </div>
                            <div className="text-xs text-muted-foreground">
                              Max £{deal.maxCashback}
                            </div>
                          </div>
                          
                          <div className="flex flex-col space-y-3">
                            <Button 
                              className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-6"
                              onClick={() => window.open(`https://${deal.store.toLowerCase().replace(' ', '').replace('\'', '')}.com`, '_blank')}
                            >
                              <ExternalLink className="h-4 w-4 mr-2" />
                              Shop Now
                            </Button>
                            
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => navigate('/compare')}
                            >
                              Compare All
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Empty State */}
          {filteredDeals.length === 0 && (
            <motion.div variants={itemVariants}>
              <Card>
                <CardContent className="p-12 text-center">
                  <ShoppingCart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No supermarket deals found</h3>
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
      </div>
    </div>
  );
}

export default SupermarketDealsPage;