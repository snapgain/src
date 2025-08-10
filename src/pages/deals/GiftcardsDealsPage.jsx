import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useProfile } from '@/contexts/ProfileContext';
import { useNavigate } from 'react-router-dom';
import { 
  Gift, 
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
  CreditCard,
  DollarSign,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

function GiftcardsDealsPage() {
  const navigate = useNavigate();
  const { favoriteStores, cards } = useProfile();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('cashback');
  const [sortOrder, setSortOrder] = useState('desc');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [minAmount, setMinAmount] = useState('');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  // Mock data - giftcard deals
  const giftcardDeals = [
    {
      id: 1,
      store: 'Amazon',
      title: 'Amazon Gift Cards Mega Deal',
      description: 'Maximum cashback on Amazon gift cards - perfect for future purchases',
      cashbackRate: 5.0,
      maxCashback: 50,
      originalRate: 2.0,
      increase: 3.0,
      category: 'General Shopping',
      validUntil: '2025-08-31',
      featured: true,
      trending: true,
      logo: '🛒',
      color: 'from-orange-500 to-orange-600',
      recommendedCard: 'American Express Gold',
      isFavorite: favoriteStores.includes('Amazon'),
      terms: 'Valid on digital gift cards £10-£500. No expiry on gift cards.',
      rating: 4.9,
      denominations: ['£10', '£25', '£50', '£100', '£250', '£500'],
      deliveryMethods: ['Digital', 'Email', 'Print at Home'],
      processingTime: 'Instant',
      restrictions: 'Cannot be used for other gift cards',
      popularity: 98,
      avgPurchase: '£75'
    },
    {
      id: 2,
      store: 'John Lewis',
      title: 'John Lewis & Partners Gift Cards',
      description: 'Enhanced cashback on premium department store gift cards',
      cashbackRate: 4.5,
      maxCashback: 75,
      originalRate: 2.5,
      increase: 2.0,
      category: 'Department Store',
      validUntil: '2025-09-15',
      featured: true,
      trending: false,
      logo: '🏬',
      color: 'from-purple-500 to-purple-600',
      recommendedCard: 'John Lewis Partnership Card',
      isFavorite: favoriteStores.includes('John Lewis'),
      terms: '2-year validity. Valid in-store and online at John Lewis & Waitrose.',
      rating: 4.8,
      denominations: ['£20', '£50', '£100', '£200'],
      deliveryMethods: ['Digital', 'Physical Card', 'Email'],
      processingTime: '24 hours',
      restrictions: 'Cannot purchase alcohol with gift cards',
      popularity: 92,
      avgPurchase: '£100'
    },
    {
      id: 3,
      store: 'ASOS',
      title: 'ASOS Fashion Gift Cards',
      description: 'Stylish savings on fashion gift cards for trendy shoppers',
      cashbackRate: 4.0,
      maxCashback: 40,
      originalRate: 1.5,
      increase: 2.5,
      category: 'Fashion',
      validUntil: '2025-08-20',
      featured: false,
      trending: true,
      logo: '👗',
      color: 'from-pink-500 to-pink-600',
      recommendedCard: 'Mastercard Cashback',
      isFavorite: favoriteStores.includes('ASOS'),
      terms: '12-month validity. Valid on full-price and sale items.',
      rating: 4.4,
      denominations: ['£15', '£30', '£50', '£75', '£150'],
      deliveryMethods: ['Digital', 'Email'],
      processingTime: 'Instant',
      restrictions: 'UK and EU delivery only',
      popularity: 87,
      avgPurchase: '£50'
    },
    {
      id: 4,
      store: 'Currys PC World',
      title: 'Tech Gift Cards Bonanza',
      description: 'High cashback on electronics and tech gift cards',
      cashbackRate: 3.8,
      maxCashback: 60,
      originalRate: 2.0,
      increase: 1.8,
      category: 'Electronics',
      validUntil: '2025-09-30',
      featured: false,
      trending: false,
      logo: '💻',
      color: 'from-blue-500 to-blue-600',
      recommendedCard: 'Chase Sapphire',
      isFavorite: favoriteStores.includes('Currys PC World'),
      terms: '18-month validity. Valid on all products except Apple.',
      rating: 4.3,
      denominations: ['£25', '£50', '£100', '£200', '£500'],
      deliveryMethods: ['Digital', 'Physical Card'],
      processingTime: '2-4 hours',
      restrictions: 'Excludes Apple products and warranties',
      popularity: 79,
      avgPurchase: '£125'
    },
    {
      id: 5,
      store: 'M&S',
      title: 'Marks & Spencer Gift Cards',
      description: 'Quality gift cards for food, clothing and home products',
      cashbackRate: 3.5,
      maxCashback: 45,
      originalRate: 1.8,
      increase: 1.7,
      category: 'Department Store',
      validUntil: '2025-10-15',
      featured: false,
      trending: true,
      logo: '🛍️',
      color: 'from-green-500 to-green-600',
      recommendedCard: 'M&S Credit Card',
      isFavorite: favoriteStores.includes('M&S'),
      terms: '24-month validity. Valid on food, clothing and home.',
      rating: 4.6,
      denominations: ['£20', '£30', '£50', '£100'],
      deliveryMethods: ['Digital', 'Physical Card', 'Email'],
      processingTime: '1-2 hours',
      restrictions: 'Cannot be used for financial services',
      popularity: 84,
      avgPurchase: '£60'
    },
    {
      id: 6,
      store: 'Spotify',
      title: 'Spotify Premium Gift Cards',
      description: 'Music streaming gift cards with enhanced cashback',
      cashbackRate: 6.0,
      maxCashback: 30,
      originalRate: 0,
      increase: 6.0,
      category: 'Entertainment',
      validUntil: '2025-08-25',
      featured: true,
      trending: true,
      logo: '🎵',
      color: 'from-green-400 to-green-500',
      recommendedCard: 'Visa Cashback',
      isFavorite: favoriteStores.includes('Spotify'),
      terms: '12-month redemption period. Premium subscription included.',
      rating: 4.7,
      denominations: ['1 Month', '3 Months', '6 Months', '12 Months'],
      deliveryMethods: ['Digital Code', 'Email'],
      processingTime: 'Instant',
      restrictions: 'New subscribers only for promotional rates',
      popularity: 91,
      avgPurchase: '3 Months'
    },
    {
      id: 7,
      store: 'Netflix',
      title: 'Netflix Streaming Gift Cards',
      description: 'Entertainment gift cards for movie and series lovers',
      cashbackRate: 5.5,
      maxCashback: 25,
      originalRate: 0,
      increase: 5.5,
      category: 'Entertainment',
      validUntil: '2025-09-10',
      featured: false,
      trending: true,
      logo: '🎬',
      color: 'from-red-500 to-red-600',
      recommendedCard: 'Entertainment Rewards Card',
      isFavorite: favoriteStores.includes('Netflix'),
      terms: 'No expiry date. Valid for any Netflix plan.',
      rating: 4.5,
      denominations: ['£15', '£30', '£60', '£120'],
      deliveryMethods: ['Digital Code', 'Email'],
      processingTime: 'Instant',
      restrictions: 'Valid in UK only',
      popularity: 88,
      avgPurchase: '£30'
    },
    {
      id: 8,
      store: 'Steam',
      title: 'Steam Gaming Gift Cards',
      description: 'Gaming gift cards with mega cashback for gamers',
      cashbackRate: 4.2,
      maxCashback: 35,
      originalRate: 1.0,
      increase: 3.2,
      category: 'Gaming',
      validUntil: '2025-08-18',
      featured: false,
      trending: false,
      logo: '🎮',
      color: 'from-gray-600 to-gray-700',
      recommendedCard: 'Gaming Rewards Card',
      isFavorite: favoriteStores.includes('Steam'),
      terms: 'No expiry date. Valid for games, DLC and in-game purchases.',
      rating: 4.8,
      denominations: ['£10', '£20', '£50', '£100'],
      deliveryMethods: ['Digital Code', 'Email'],
      processingTime: 'Instant',
      restrictions: 'Valid for Steam platform only',
      popularity: 93,
      avgPurchase: '£35'
    }
  ];

  const categories = [
    'all', 'General Shopping', 'Department Store', 'Fashion', 
    'Electronics', 'Entertainment', 'Gaming'
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
    let filtered = giftcardDeals.filter(deal => {
      const matchesSearch = deal.store.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           deal.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           deal.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFavorites = !showFavoritesOnly || deal.isFavorite;
      const matchesCategory = selectedCategory === 'all' || deal.category === selectedCategory;
      const matchesAmount = !minAmount || deal.maxCashback >= parseInt(minAmount);
      return matchesSearch && matchesFavorites && matchesCategory && matchesAmount;
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
  }, [searchQuery, sortBy, sortOrder, showFavoritesOnly, selectedCategory, minAmount]);

  const getBestGiftcardDeal = () => {
    return filteredDeals.reduce((best, current) => {
      return current.cashbackRate > (best?.cashbackRate || 0) ? current : best;
    }, null);
  };

  const getProcessingTimeColor = (time) => {
    if (time === 'Instant') return 'text-green-600 bg-green-50';
    if (time.includes('hour')) return 'text-yellow-600 bg-yellow-50';
    return 'text-blue-600 bg-blue-50';
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
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                    <Gift className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h1 className="text-4xl font-bold">🎁 Gift Card Deals</h1>
                    <p className="text-muted-foreground text-lg">
                      Maximum cashback on gift cards for yourself or loved ones
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Quick Stats */}
          <motion.div variants={itemVariants}>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                      <Target className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm text-purple-600 font-medium">Best Rate</p>
                      <p className="text-xl font-bold text-purple-800">
                        {getBestGiftcardDeal()?.cashbackRate}% at {getBestGiftcardDeal()?.store}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <Gift className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground font-medium">Total Cards</p>
                      <p className="text-xl font-bold">{filteredDeals.length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground font-medium">Instant Delivery</p>
                      <p className="text-xl font-bold">
                        {giftcardDeals.filter(d => d.processingTime === 'Instant').length}
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
                        {giftcardDeals.filter(d => d.trending).length}
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
                      placeholder="Search gift cards..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>

                  {/* Category Filter */}
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="px-3 py-2 border border-gray-200 rounded-md min-w-[150px]"
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>
                        {category === 'all' ? 'All Categories' : category}
                      </option>
                    ))}
                  </select>

                  {/* Min Amount Filter */}
                  <Input
                    type="number"
                    placeholder="Min £"
                    value={minAmount}
                    onChange={(e) => setMinAmount(e.target.value)}
                    className="w-24"
                  />

                  {/* Sort Options */}
                  <div className="flex gap-2">
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="px-3 py-2 border border-gray-200 rounded-md min-w-[140px]"
                    >
                      <option value="cashbackRate">Cashback Rate</option>
                      <option value="popularity">Popularity</option>
                      <option value="rating">Rating</option>
                      <option value="maxCashback">Max Cashback</option>
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

          {/* Gift Card Deals Grid */}
          <motion.div variants={itemVariants}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredDeals.map((deal) => (
                <motion.div key={deal.id} variants={itemVariants}>
                  <Card className={`h-full transition-all duration-300 hover:shadow-xl ${deal.featured ? 'ring-2 ring-purple-200 bg-gradient-to-r from-purple-50/50 to-pink-50/50' : ''}`}>
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
                          <div className="text-3xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
                            {deal.cashbackRate}%
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {deal.originalRate > 0 ? `was ${deal.originalRate}%` : 'NEW!'}
                          </div>
                        </div>
                      </div>

                      {/* Badges */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {deal.featured && (
                          <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                            ⭐ Featured
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
                        <Badge className={`${getProcessingTimeColor(deal.processingTime)} font-medium`}>
                          ⚡ {deal.processingTime}
                        </Badge>
                      </div>

                      {/* Title and Description */}
                      <h4 className="text-lg font-semibold mb-2">{deal.title}</h4>
                      <p className="text-muted-foreground mb-4">{deal.description}</p>

                      {/* Denominations */}
                      <div className="mb-4">
                        <p className="text-sm font-medium mb-2">Available Amounts:</p>
                        <div className="flex flex-wrap gap-2">
                          {deal.denominations.map((amount) => (
                            <Badge key={amount} variant="secondary" className="text-xs">
                              {amount}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Stats */}
                      <div className="grid grid-cols-2 gap-4 mb-4 p-4 bg-gray-50 rounded-lg">
                        <div>
                          <div className="text-sm text-muted-foreground">Max Cashback</div>
                          <div className="text-lg font-bold text-green-600">£{deal.maxCashback}</div>
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground">Popularity</div>
                          <div className="text-lg font-bold">{deal.popularity}%</div>
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground">Rating</div>
                          <div className="flex items-center space-x-1">
                            <Star className="h-4 w-4 fill-current text-yellow-500" />
                            <span className="font-bold">{deal.rating}</span>
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground">Avg Purchase</div>
                          <div className="text-lg font-bold">{deal.avgPurchase}</div>
                        </div>
                      </div>

                      {/* Delivery Methods */}
                      <div className="mb-4">
                        <p className="text-sm font-medium mb-2">Delivery:</p>
                        <div className="flex flex-wrap gap-2">
                          {deal.deliveryMethods.map((method) => (
                            <Badge key={method} variant="outline" className="text-xs">
                              {method}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Terms & Restrictions */}
                      <div className="space-y-2 mb-4">
                        <p className="text-xs text-muted-foreground italic">
                          <strong>Terms:</strong> {deal.terms}
                        </p>
                        <p className="text-xs text-muted-foreground italic">
                          <strong>Restrictions:</strong> {deal.restrictions}
                        </p>
                      </div>

                      {/* Actions */}
                      <div className="flex space-x-3">
                        <Button 
                          className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
                          onClick={() => window.open(`https://${deal.store.toLowerCase().replace(' ', '')}.com`, '_blank')}
                        >
                          <Gift className="h-4 w-4 mr-2" />
                          Buy Gift Card
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
              ))}
            </div>
          </motion.div>

          {/* Empty State */}
          {filteredDeals.length === 0 && (
            <motion.div variants={itemVariants}>
              <Card>
                <CardContent className="p-12 text-center">
                  <Gift className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No gift card deals found</h3>
                  <p className="text-muted-foreground mb-6">
                    Try adjusting your search terms or filters
                  </p>
                  <Button 
                    variant="outline"
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory('all');
                      setMinAmount('');
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

export default GiftcardsDealsPage;