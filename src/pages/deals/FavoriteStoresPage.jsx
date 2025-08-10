import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useProfile } from '@/contexts/ProfileContext';
import { useNavigate } from 'react-router-dom';
import { 
  Heart, 
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
  Plus,
  Settings,
  AlertTriangle,
  CheckCircle,
  Zap,
  Gift,
  Calendar,
  Users
} from 'lucide-react';

function FavoriteStoresPage() {
  const navigate = useNavigate();
  const { favoriteStores, addFavoriteStore, removeFavoriteStore, cards } = useProfile();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('cashback');
  const [sortOrder, setSortOrder] = useState('desc');
  const [showOnlyActive, setShowOnlyActive] = useState(false);

  // Mock data - deals específicos para lojas favoritas
  const favoriteStoreDeals = [
    {
      id: 1,
      store: 'Amazon',
      title: 'Prime Member Exclusive Cashback',
      description: 'Your favorite store is offering exclusive enhanced cashback for loyal customers',
      cashbackRate: 7.5,
      maxCashback: 75,
      originalRate: 5.0,
      increase: 2.5,
      category: 'General Shopping',
      validUntil: '2025-08-31',
      featured: true,
      trending: true,
      logo: '🛒',
      color: 'from-orange-500 to-orange-600',
      recommendedCard: 'American Express Gold',
      isFavorite: true,
      terms: 'Prime members only. Valid on all categories.',
      rating: 4.9,
      lastPurchase: '2025-07-15',
      totalEarned: '£124.50',
      purchaseCount: 23,
      avgMonthlySpend: '£180',
      personalizedOffer: 'Based on your electronics purchases',
      dealType: 'exclusive',
      loyaltyBonus: 15,
      nextMilestone: 'Spend £50 more for VIP status'
    },
    {
      id: 2,
      store: 'John Lewis',
      title: 'Partnership Rewards Plus',
      description: 'Premium cashback for your continued loyalty to John Lewis & Partners',
      cashbackRate: 6.0,
      maxCashback: 90,
      originalRate: 3.5,
      increase: 2.5,
      category: 'Department Store',
      validUntil: '2025-09-15',
      featured: true,
      trending: false,
      logo: '🏬',
      color: 'from-purple-500 to-purple-600',
      recommendedCard: 'John Lewis Partnership Card',
      isFavorite: true,
      terms: 'Valid on fashion and home categories.',
      rating: 4.8,
      lastPurchase: '2025-07-20',
      totalEarned: '£89.30',
      purchaseCount: 12,
      avgMonthlySpend: '£220',
      personalizedOffer: 'Fashion-focused based on your history',
      dealType: 'loyalty',
      loyaltyBonus: 20,
      nextMilestone: '2 more purchases for free delivery upgrade'
    },
    {
      id: 3,
      store: 'ASOS',
      title: 'Fashion Forward Rewards',
      description: 'Style rewards tailored specifically to your fashion preferences',
      cashbackRate: 5.5,
      maxCashback: 55,
      originalRate: 3.0,
      increase: 2.5,
      category: 'Fashion',
      validUntil: '2025-08-20',
      featured: false,
      trending: true,
      logo: '👗',
      color: 'from-pink-500 to-pink-600',
      recommendedCard: 'Mastercard Cashback',
      isFavorite: true,
      terms: 'Valid on full-price and sale items.',
      rating: 4.4,
      lastPurchase: '2025-07-25',
      totalEarned: '£67.80',
      purchaseCount: 18,
      avgMonthlySpend: '£95',
      personalizedOffer: 'Young professional fashion focus',
      dealType: 'personalized',
      loyaltyBonus: 10,
      nextMilestone: 'Complete profile for extra 1% cashback'
    },
    {
      id: 4,
      store: 'Tesco',
      title: 'Clubcard Super Saver',
      description: 'Enhanced grocery cashback for your weekly shopping needs',
      cashbackRate: 4.5,
      maxCashback: 40,
      originalRate: 2.0,
      increase: 2.5,
      category: 'Grocery',
      validUntil: '2025-09-30',
      featured: false,
      trending: false,
      logo: '🏪',
      color: 'from-blue-400 to-blue-500',
      recommendedCard: 'Tesco Bank Credit Card',
      isFavorite: true,
      terms: 'Clubcard required. Valid on groceries only.',
      rating: 4.6,
      lastPurchase: '2025-08-05',
      totalEarned: '£156.20',
      purchaseCount: 34,
      avgMonthlySpend: '£125',
      personalizedOffer: 'Family grocery shopping pattern detected',
      dealType: 'regular',
      loyaltyBonus: 25,
      nextMilestone: 'Spend £200 this month for bonus points'
    },
    {
      id: 5,
      store: 'Currys PC World',
      title: 'Tech Enthusiast Rewards',
      description: 'Special tech deals curated for your electronics interests',
      cashbackRate: 5.0,
      maxCashback: 100,
      originalRate: 4.5,
      increase: 0.5,
      category: 'Electronics',
      validUntil: '2025-08-25',
      featured: false,
      trending: true,
      logo: '💻',
      color: 'from-blue-500 to-blue-600',
      recommendedCard: 'Chase Sapphire',
      isFavorite: true,
      terms: 'Valid on laptops, phones and accessories.',
      rating: 4.3,
      lastPurchase: '2025-06-30',
      totalEarned: '£45.60',
      purchaseCount: 6,
      avgMonthlySpend: '£280',
      personalizedOffer: 'Gaming and productivity focus',
      dealType: 'seasonal',
      loyaltyBonus: 5,
      nextMilestone: '1 more purchase for extended warranty'
    }
  ];

  // Dados de outras lojas disponíveis para adicionar aos favoritos
  const availableStores = [
    { name: 'Boots', category: 'Beauty & Health', logo: '💄', avgCashback: '3.2%' },
    { name: 'Argos', category: 'Home & Garden', logo: '🏠', avgCashback: '2.8%' },
    { name: 'M&S', category: 'Department Store', logo: '🛍️', avgCashback: '3.5%' },
    { name: 'Waitrose', category: 'Premium Grocery', logo: '🍾', avgCashback: '2.5%' },
    { name: 'Next', category: 'Fashion', logo: '👔', avgCashback: '4.0%' },
    { name: 'Very', category: 'General Shopping', logo: '🛍️', avgCashback: '3.8%' },
    { name: 'Spotify', category: 'Entertainment', logo: '🎵', avgCashback: '6.0%' },
    { name: 'Netflix', category: 'Entertainment', logo: '🎬', avgCashback: '5.5%' }
  ];

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
    let filtered = favoriteStoreDeals.filter(deal => {
      const matchesSearch = deal.store.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           deal.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           deal.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesActive = !showOnlyActive || new Date(deal.validUntil) > new Date();
      return matchesSearch && matchesActive;
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
  }, [searchQuery, sortBy, sortOrder, showOnlyActive]);

  // Lojas disponíveis que não são favoritas
  const nonFavoriteStores = availableStores.filter(store => 
    !favoriteStores.includes(store.name)
  );

  const getDealTypeColor = (type) => {
    switch (type) {
      case 'exclusive': return 'bg-gradient-to-r from-purple-500 to-purple-600 text-white';
      case 'loyalty': return 'bg-gradient-to-r from-blue-500 to-blue-600 text-white';
      case 'personalized': return 'bg-gradient-to-r from-pink-500 to-pink-600 text-white';
      case 'seasonal': return 'bg-gradient-to-r from-orange-500 to-orange-600 text-white';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getDealTypeLabel = (type) => {
    switch (type) {
      case 'exclusive': return '👑 Exclusive';
      case 'loyalty': return '🏆 Loyalty';
      case 'personalized': return '🎯 Personal';
      case 'seasonal': return '🌟 Seasonal';
      default: return '📦 Regular';
    }
  };

  const getTotalEarnings = () => {
    return favoriteStoreDeals.reduce((total, deal) => {
      return total + parseFloat(deal.totalEarned.replace('£', ''));
    }, 0).toFixed(2);
  };

  const getTotalPurchases = () => {
    return favoriteStoreDeals.reduce((total, deal) => total + deal.purchaseCount, 0);
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
                  <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center">
                    <Heart className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h1 className="text-4xl font-bold">❤️ Your Favorite Stores</h1>
                    <p className="text-muted-foreground text-lg">
                      Personalized deals from stores you love most
                    </p>
                  </div>
                </div>
              </div>
              <Button 
                onClick={() => navigate('/profile')} 
                className="flex items-center space-x-2"
              >
                <Settings className="h-4 w-4" />
                <span>Manage Favorites</span>
              </Button>
            </div>
          </motion.div>

          {/* Personal Stats */}
          <motion.div variants={itemVariants}>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <Card className="bg-gradient-to-r from-red-50 to-pink-50 border-red-200">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                      <Heart className="h-5 w-5 text-red-600" />
                    </div>
                    <div>
                      <p className="text-sm text-red-600 font-medium">Favorite Stores</p>
                      <p className="text-xl font-bold text-red-800">{favoriteStores.length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <Target className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground font-medium">Total Earned</p>
                      <p className="text-xl font-bold">£{getTotalEarnings()}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <Users className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground font-medium">Total Purchases</p>
                      <p className="text-xl font-bold">{getTotalPurchases()}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                      <Zap className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground font-medium">Active Deals</p>
                      <p className="text-xl font-bold">{filteredDeals.length}</p>
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
                      placeholder="Search your favorite stores..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>

                  {/* Sort Options */}
                  <div className="flex gap-2">
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="px-3 py-2 border border-gray-200 rounded-md min-w-[140px]"
                    >
                      <option value="cashbackRate">Cashback Rate</option>
                      <option value="totalEarned">Total Earned</option>
                      <option value="lastPurchase">Last Purchase</option>
                      <option value="loyaltyBonus">Loyalty Bonus</option>
                    </select>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                    >
                      {sortOrder === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
                    </Button>
                  </div>

                  {/* Active Only Filter */}
                  <Button
                    variant={showOnlyActive ? "default" : "outline"}
                    onClick={() => setShowOnlyActive(!showOnlyActive)}
                    className="flex items-center space-x-2"
                  >
                    <CheckCircle className={`h-4 w-4 ${showOnlyActive ? 'fill-current' : ''}`} />
                    <span>Active Only</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Your Favorite Store Deals */}
          <motion.div variants={itemVariants}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Heart className="h-6 w-6 text-red-500" />
                  <span>Personalized Deals from Your Favorites</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {filteredDeals.map((deal) => (
                    <motion.div key={deal.id} variants={itemVariants}>
                      <Card className="transition-all duration-300 hover:shadow-xl bg-gradient-to-r from-red-50/30 to-pink-50/30 border-red-100">
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
                                  <Badge className={getDealTypeColor(deal.dealType)}>
                                    {getDealTypeLabel(deal.dealType)}
                                  </Badge>
                                  <Badge variant="outline" className="text-red-600 border-red-200">
                                    <Heart className="h-3 w-3 mr-1 fill-current" />
                                    Favorite
                                  </Badge>
                                </div>
                                
                                <h4 className="text-lg font-semibold mb-2">{deal.title}</h4>
                                <p className="text-muted-foreground mb-4">{deal.description}</p>

                                {/* Personalized Insight */}
                                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-400 p-3 mb-4">
                                  <p className="text-sm font-medium text-blue-800">
                                    🎯 Personalized: {deal.personalizedOffer}
                                  </p>
                                </div>

                                {/* Personal Stats Grid */}
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 p-4 bg-white rounded-lg border">
                                  <div>
                                    <div className="text-sm text-muted-foreground">Total Earned</div>
                                    <div className="text-lg font-bold text-green-600">{deal.totalEarned}</div>
                                  </div>
                                  <div>
                                    <div className="text-sm text-muted-foreground">Purchases</div>
                                    <div className="text-lg font-bold">{deal.purchaseCount}</div>
                                  </div>
                                  <div>
                                    <div className="text-sm text-muted-foreground">Monthly Avg</div>
                                    <div className="text-lg font-bold">{deal.avgMonthlySpend}</div>
                                  </div>
                                  <div>
                                    <div className="text-sm text-muted-foreground">Last Purchase</div>
                                    <div className="text-lg font-bold">{new Date(deal.lastPurchase).toLocaleDateString()}</div>
                                  </div>
                                </div>

                                {/* Loyalty Progress */}
                                <div className="mb-4">
                                  <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-medium">Loyalty Bonus: +{deal.loyaltyBonus}%</span>
                                    <span className="text-xs text-muted-foreground">Next milestone</span>
                                  </div>
                                  <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div 
                                      className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-300"
                                      style={{ width: `${Math.min(deal.loyaltyBonus * 4, 100)}%` }}
                                    ></div>
                                  </div>
                                  <p className="text-xs text-muted-foreground mt-1">{deal.nextMilestone}</p>
                                </div>

                                {/* Terms */}
                                <p className="text-xs text-muted-foreground italic">{deal.terms}</p>
                              </div>
                            </div>

                            {/* Cashback & Actions */}
                            <div className="flex items-start space-x-6">
                              <div className="text-center">
                                <div className="text-4xl font-bold bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent">
                                  {deal.cashbackRate}%
                                </div>
                                <div className="text-sm text-muted-foreground">Base Rate</div>
                                <div className="text-xs text-green-600 font-medium mt-1">
                                  +{deal.loyaltyBonus}% Loyalty
                                </div>
                                <div className="text-xs text-purple-600 font-medium">
                                  = {(deal.cashbackRate + deal.loyaltyBonus).toFixed(1)}% Total
                                </div>
                              </div>
                              
                              <div className="flex flex-col space-y-3">
                                <Button 
                                  className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white px-6"
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
              </CardContent>
            </Card>
          </motion.div>

          {/* Add More Favorites */}
          {nonFavoriteStores.length > 0 && (
            <motion.div variants={itemVariants}>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Plus className="h-6 w-6 text-green-500" />
                    <span>Add More Favorites</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {nonFavoriteStores.slice(0, 8).map((store) => (
                      <Card key={store.name} className="hover:shadow-md transition-shadow cursor-pointer">
                        <CardContent className="p-4">
                          <div className="flex items-center space-x-3 mb-3">
                            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-xl">
                              {store.logo}
                            </div>
                            <div>
                              <h4 className="font-semibold">{store.name}</h4>
                              <p className="text-xs text-muted-foreground">{store.category}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-green-600">
                              Avg {store.avgCashback}
                            </span>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => addFavoriteStore(store.name)}
                              className="flex items-center space-x-1"
                            >
                              <Heart className="h-3 w-3" />
                              <span>Add</span>
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                  
                  <div className="text-center mt-6">
                    <Button 
                      variant="outline" 
                      onClick={() => navigate('/profile')}
                      className="flex items-center space-x-2"
                    >
                      <Settings className="h-4 w-4" />
                      <span>Manage All Favorites</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Empty State for No Favorites */}
          {favoriteStores.length === 0 && (
            <motion.div variants={itemVariants}>
              <Card>
                <CardContent className="p-12 text-center">
                  <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No favorite stores yet</h3>
                  <p className="text-muted-foreground mb-6">
                    Add your favorite stores to get personalized deals and track your earnings
                  </p>
                  <Button 
                    onClick={() => navigate('/profile')}
                    className="bg-gradient-to-r from-red-500 to-pink-500 text-white"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Your First Favorite
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Empty State for Search */}
          {filteredDeals.length === 0 && favoriteStores.length > 0 && (
            <motion.div variants={itemVariants}>
              <Card>
                <CardContent className="p-12 text-center">
                  <Search className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No deals found</h3>
                  <p className="text-muted-foreground mb-6">
                    Try adjusting your search terms or filters
                  </p>
                  <Button 
                    variant="outline"
                    onClick={() => {
                      setSearchQuery('');
                      setShowOnlyActive(false);
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

export default FavoriteStoresPage;