import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useProfile } from '@/contexts/ProfileContext';
import { useNavigate } from 'react-router-dom';
import { 
  Flame, 
  Search, 
  ExternalLink, 
  Star, 
  TrendingUp,
  Clock,
  Target,
  SortAsc,
  SortDesc,
  Filter,
  RefreshCw
} from 'lucide-react';

function HotDealsPage() {
  const navigate = useNavigate();
  const { favoriteStores, cards } = useProfile();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('cashback');
  const [sortOrder, setSortOrder] = useState('desc');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  // Mock data - deals mais quentes
  const hotDeals = [
    {
      id: 1,
      store: 'Amazon',
      title: 'Prime Day Special - Electronics',
      description: 'Massive cashback on electronics, laptops, phones and gadgets',
      cashbackRate: 8.5,
      maxCashback: 100,
      originalRate: 5.0,
      increase: 3.5,
      category: 'Electronics',
      validUntil: '2025-08-15',
      featured: true,
      trending: true,
      logo: '🛒',
      color: 'from-orange-500 to-orange-600',
      recommendedCard: 'American Express Gold',
      isFavorite: favoriteStores.includes('Amazon'),
      terms: 'Prime members only. Excludes gift cards.',
      rating: 4.9,
      totalSavings: '£2.4M',
      usersUsed: 15420,
      timeLeft: '2 days',
      dealType: 'limited_time'
    },
    {
      id: 2,
      store: 'John Lewis',
      title: 'Fashion Week Cashback Boost',
      description: 'Enhanced cashback on designer clothing and accessories',
      cashbackRate: 7.0,
      maxCashback: 75,
      originalRate: 3.5,
      increase: 3.5,
      category: 'Fashion',
      validUntil: '2025-08-20',
      featured: true,
      trending: true,
      logo: '🏬',
      color: 'from-purple-500 to-purple-600',
      recommendedCard: 'American Express Platinum',
      isFavorite: favoriteStores.includes('John Lewis'),
      terms: 'Minimum spend £50. Full price items only.',
      rating: 4.8,
      totalSavings: '£890K',
      usersUsed: 8950,
      timeLeft: '5 days',
      dealType: 'seasonal'
    },
    {
      id: 3,
      store: 'Currys PC World',
      title: 'Tech Tuesday Mega Deal',
      description: 'Huge cashback on laptops, tablets and gaming equipment',
      cashbackRate: 6.5,
      maxCashback: 120,
      originalRate: 4.5,
      increase: 2.0,
      category: 'Electronics',
      validUntil: '2025-08-12',
      featured: true,
      trending: false,
      logo: '💻',
      color: 'from-blue-500 to-blue-600',
      recommendedCard: 'Chase Sapphire',
      isFavorite: favoriteStores.includes('Currys PC World'),
      terms: 'Excludes Apple products and extended warranties.',
      rating: 4.6,
      totalSavings: '£1.2M',
      usersUsed: 12300,
      timeLeft: '1 day',
      dealType: 'flash_sale'
    },
    {
      id: 4,
      store: 'ASOS',
      title: 'Summer Clearance Cashback',
      description: 'Extra cashback on summer fashion and accessories clearance',
      cashbackRate: 6.0,
      maxCashback: 60,
      originalRate: 3.0,
      increase: 3.0,
      category: 'Fashion',
      validUntil: '2025-08-25',
      featured: false,
      trending: true,
      logo: '👗',
      color: 'from-pink-500 to-pink-600',
      recommendedCard: 'Mastercard Cashback',
      isFavorite: favoriteStores.includes('ASOS'),
      terms: 'Sale items only. Student discount not applicable.',
      rating: 4.4,
      totalSavings: '£650K',
      usersUsed: 9800,
      timeLeft: '10 days',
      dealType: 'seasonal'
    },
    {
      id: 5,
      store: 'Boots',
      title: 'Beauty Bonanza Weekend',
      description: 'Triple points plus cashback on skincare and makeup',
      cashbackRate: 5.5,
      maxCashback: 45,
      originalRate: 2.5,
      increase: 3.0,
      category: 'Beauty',
      validUntil: '2025-08-14',
      featured: false,
      trending: true,
      logo: '💄',
      color: 'from-pink-400 to-rose-500',
      recommendedCard: 'Boots Advantage Card',
      isFavorite: favoriteStores.includes('Boots'),
      terms: 'Advantage Card required. Premium brands excluded.',
      rating: 4.7,
      totalSavings: '£420K',
      usersUsed: 7650,
      timeLeft: '3 days',
      dealType: 'weekend_special'
    },
    {
      id: 6,
      store: 'Argos',
      title: 'Home & Garden Cashback Surge',
      description: 'Massive cashback on furniture, garden equipment and home decor',
      cashbackRate: 5.0,
      maxCashback: 80,
      originalRate: 2.0,
      increase: 3.0,
      category: 'Home & Garden',
      validUntil: '2025-08-30',
      featured: false,
      trending: false,
      logo: '🏠',
      color: 'from-green-500 to-green-600',
      recommendedCard: 'Visa Cashback',
      isFavorite: favoriteStores.includes('Argos'),
      terms: 'Large items delivery charges apply.',
      rating: 4.3,
      totalSavings: '£380K',
      usersUsed: 5200,
      timeLeft: '15 days',
      dealType: 'extended'
    }
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
    let filtered = hotDeals.filter(deal => {
      const matchesSearch = deal.store.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           deal.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           deal.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFavorites = !showFavoritesOnly || deal.isFavorite;
      return matchesSearch && matchesFavorites;
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
  }, [searchQuery, sortBy, sortOrder, showFavoritesOnly]);

  const getTimeLeftColor = (timeLeft) => {
    if (timeLeft.includes('1 day') || timeLeft.includes('hour')) return 'text-red-600 bg-red-50';
    if (timeLeft.includes('2 day') || timeLeft.includes('3 day')) return 'text-orange-600 bg-orange-50';
    return 'text-green-600 bg-green-50';
  };

  const getDealTypeLabel = (type) => {
    switch (type) {
      case 'limited_time': return { label: 'Limited Time', color: 'bg-red-100 text-red-700' };
      case 'flash_sale': return { label: 'Flash Sale', color: 'bg-orange-100 text-orange-700' };
      case 'seasonal': return { label: 'Seasonal', color: 'bg-blue-100 text-blue-700' };
      case 'weekend_special': return { label: 'Weekend Special', color: 'bg-purple-100 text-purple-700' };
      case 'extended': return { label: 'Extended Deal', color: 'bg-green-100 text-green-700' };
      default: return { label: 'Special Offer', color: 'bg-gray-100 text-gray-700' };
    }
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
            <div className="text-center mb-8">
              <div className="flex items-center justify-center space-x-3 mb-4">
                <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center">
                  <Flame className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold">🔥 Hot Deals</h1>
                  <p className="text-muted-foreground text-lg">
                    The hottest cashback deals available right now
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Quick Stats */}
          <motion.div variants={itemVariants}>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <Card className="bg-gradient-to-r from-red-50 to-orange-50 border-red-200">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                      <Flame className="h-5 w-5 text-red-600" />
                    </div>
                    <div>
                      <p className="text-sm text-red-600 font-medium">Hottest Deal</p>
                      <p className="text-xl font-bold text-red-800">
                        {Math.max(...hotDeals.map(d => d.cashbackRate))}% Amazon
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <TrendingUp className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground font-medium">Total Deals</p>
                      <p className="text-xl font-bold">{filteredDeals.length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <Target className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground font-medium">Your Favorites</p>
                      <p className="text-xl font-bold">
                        {hotDeals.filter(d => d.isFavorite).length}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                      <Clock className="h-5 w-5 text-yellow-600" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground font-medium">Ending Soon</p>
                      <p className="text-xl font-bold">
                        {hotDeals.filter(d => d.timeLeft.includes('day') && parseInt(d.timeLeft) <= 3).length}
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
                      placeholder="Search hot deals..."
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
                      <option value="increase">Increase Amount</option>
                      <option value="maxCashback">Max Cashback</option>
                      <option value="rating">Rating</option>
                      <option value="usersUsed">Popularity</option>
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
                    <span>Favorites Only</span>
                  </Button>

                  {/* Refresh */}
                  <Button variant="outline" className="flex items-center space-x-2">
                    <RefreshCw className="h-4 w-4" />
                    <span className="hidden md:inline">Refresh</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Hot Deals Grid */}
          <motion.div variants={itemVariants}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredDeals.map((deal) => {
                const dealTypeInfo = getDealTypeLabel(deal.dealType);
                
                return (
                  <motion.div key={deal.id} variants={itemVariants}>
                    <Card className={`h-full transition-all duration-300 hover:shadow-xl ${deal.featured ? 'ring-2 ring-orange-200 shadow-lg' : ''} ${deal.trending ? 'border-orange-300' : ''}`}>
                      <CardContent className="p-6">
                        {/* Header */}
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center space-x-4">
                            <div className={`w-16 h-16 bg-gradient-to-r ${deal.color} rounded-xl flex items-center justify-center text-2xl shadow-lg`}>
                              {deal.logo}
                            </div>
                            <div>
                              <h3 className="text-xl font-bold">{deal.store}</h3>
                              <p className="text-sm text-muted-foreground">{deal.category}</p>
                            </div>
                          </div>
                          
                          <div className="text-right">
                            <div className="text-3xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                              {deal.cashbackRate}%
                            </div>
                            <div className="text-xs text-muted-foreground">was {deal.originalRate}%</div>
                          </div>
                        </div>

                        {/* Badges */}
                        <div className="flex flex-wrap gap-2 mb-4">
                          {deal.featured && (
                            <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white">
                              🔥 Featured
                            </Badge>
                          )}
                          {deal.trending && (
                            <Badge className="bg-gradient-to-r from-green-500 to-green-600 text-white">
                              📈 Trending
                            </Badge>
                          )}
                          {deal.isFavorite && (
                            <Badge variant="outline" className="text-red-600 border-red-200">
                              <Star className="h-3 w-3 mr-1 fill-current" />
                              Favorite
                            </Badge>
                          )}
                          <Badge className={dealTypeInfo.color}>
                            {dealTypeInfo.label}
                          </Badge>
                          <Badge className={`${getTimeLeftColor(deal.timeLeft)} font-medium`}>
                            ⏰ {deal.timeLeft} left
                          </Badge>
                        </div>

                        {/* Title and Description */}
                        <h4 className="text-lg font-semibold mb-2">{deal.title}</h4>
                        <p className="text-muted-foreground mb-4">{deal.description}</p>

                        {/* Stats */}
                        <div className="grid grid-cols-2 gap-4 mb-4 p-4 bg-gray-50 rounded-lg">
                          <div>
                            <div className="text-sm text-muted-foreground">Increase</div>
                            <div className="text-lg font-bold text-green-600">+{deal.increase}%</div>
                          </div>
                          <div>
                            <div className="text-sm text-muted-foreground">Max Cashback</div>
                            <div className="text-lg font-bold">£{deal.maxCashback}</div>
                          </div>
                          <div>
                            <div className="text-sm text-muted-foreground">Users Used</div>
                            <div className="text-lg font-bold">{deal.usersUsed.toLocaleString()}</div>
                          </div>
                          <div>
                            <div className="text-sm text-muted-foreground">Total Savings</div>
                            <div className="text-lg font-bold">{deal.totalSavings}</div>
                          </div>
                        </div>

                        {/* Rating and Best Card */}
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-2">
                            <div className="flex items-center space-x-1">
                              <Star className="h-4 w-4 fill-current text-yellow-500" />
                              <span className="font-medium">{deal.rating}</span>
                            </div>
                            <span className="text-muted-foreground">|</span>
                            <span className="text-sm text-muted-foreground">Best with {deal.recommendedCard}</span>
                          </div>
                        </div>

                        {/* Terms */}
                        <p className="text-xs text-muted-foreground mb-4 italic">{deal.terms}</p>

                        {/* Actions */}
                        <div className="flex space-x-3">
                          <Button 
                            className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white"
                            onClick={() => window.open(`https://${deal.store.toLowerCase().replace(' ', '')}.com`, '_blank')}
                          >
                            <ExternalLink className="h-4 w-4 mr-2" />
                            Shop Now
                          </Button>
                          <Button 
                            variant="outline"
                            onClick={() => navigate('/compare')}
                          >
                            Compare
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* Empty State */}
          {filteredDeals.length === 0 && (
            <motion.div variants={itemVariants}>
              <Card>
                <CardContent className="p-12 text-center">
                  <Flame className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No hot deals found</h3>
                  <p className="text-muted-foreground mb-6">
                    Try adjusting your search terms or check back later for new deals
                  </p>
                  <Button 
                    variant="outline"
                    onClick={() => {
                      setSearchQuery('');
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

export default HotDealsPage;