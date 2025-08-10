import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Gift, 
  Search, 
  SortAsc, 
  SortDesc, 
  Star, 
  Percent,
  Heart,
  Filter,
  Clock
} from 'lucide-react';
import { useProfile } from '@/contexts/ProfileContext';

function GiftcardsDealsPage() {
  const navigate = useNavigate();
  const { favoriteStores, cards } = useProfile();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('cashback');
  const [sortOrder, setSortOrder] = useState('desc');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  // Mock data - gift card deals
  const giftCardDeals = [
    {
      id: 1,
      store: 'Amazon',
      title: 'Amazon Gift Cards Cashback',
      description: 'Get cashback on Amazon gift cards for shopping, gifts, or personal use',
      cashbackRate: 5.0,
      maxCashback: 50,
      originalRate: 2.0,
      increase: 3.0,
      category: 'General Shopping',
      validUntil: '2025-12-31',
      featured: true,
      trending: true,
      logo: '🛒',
      color: 'from-orange-500 to-yellow-500',
      recommendedCard: 'Amazon Rewards Card',
      isFavorite: favoriteStores.includes('Amazon'),
      terms: 'Valid for all Amazon purchases. No expiry.',
      rating: 4.9,
      denominations: ['£10', '£25', '£50', '£100'],
      instantDelivery: true,
      giftWrap: true,
      popularFor: 'Birthday gifts, Christmas presents'
    },
    {
      id: 2,
      store: 'John Lewis',
      title: 'John Lewis Gift Vouchers',
      description: 'Premium gift vouchers with enhanced cashback for luxury shopping',
      cashbackRate: 4.5,
      maxCashback: 75,
      originalRate: 2.5,
      increase: 2.0,
      category: 'Department Store',
      validUntil: '2025-12-31',
      featured: true,
      trending: false,
      logo: '🏪',
      color: 'from-blue-500 to-purple-500',
      recommendedCard: 'John Lewis Partnership Card',
      isFavorite: favoriteStores.includes('John Lewis'),
      terms: 'Valid in-store and online. 2-year validity.',
      rating: 4.8,
      denominations: ['£20', '£50', '£100', '£200'],
      instantDelivery: false,
      giftWrap: true,
      popularFor: 'Wedding gifts, anniversary presents'
    },
    {
      id: 3,
      store: 'Spotify',
      title: 'Spotify Premium Gift Cards',
      description: 'Gift the joy of music with Spotify Premium subscriptions',
      cashbackRate: 8.0,
      maxCashback: 30,
      originalRate: 3.0,
      increase: 5.0,
      category: 'Entertainment',
      validUntil: '2025-11-30',
      featured: false,
      trending: true,
      logo: '🎵',
      color: 'from-green-500 to-green-600',
      recommendedCard: 'Entertainment Cashback Card',
      isFavorite: favoriteStores.includes('Spotify'),
      terms: 'Digital delivery only. Instant activation.',
      rating: 4.7,
      denominations: ['1 month', '3 months', '6 months', '12 months'],
      instantDelivery: true,
      giftWrap: false,
      popularFor: 'Music lovers, students'
    },
    {
      id: 4,
      store: 'Netflix',
      title: 'Netflix Gift Subscriptions',
      description: 'Give the gift of entertainment with Netflix gift cards',
      cashbackRate: 6.0,
      maxCashback: 40,
      originalRate: 2.0,
      increase: 4.0,
      category: 'Entertainment',
      validUntil: '2025-12-31',
      featured: false,
      trending: true,
      logo: '🎬',
      color: 'from-red-500 to-red-600',
      recommendedCard: 'Streaming Rewards Card',
      isFavorite: favoriteStores.includes('Netflix'),
      terms: 'Email delivery. No expiry date.',
      rating: 4.6,
      denominations: ['£15', '£25', '£50', '£100'],
      instantDelivery: true,
      giftWrap: false,
      popularFor: 'Movie nights, binge watchers'
    },
    {
      id: 5,
      store: 'Apple',
      title: 'Apple Store Gift Cards',
      description: 'Perfect for Apple products, apps, and services',
      cashbackRate: 3.5,
      maxCashback: 100,
      originalRate: 1.0,
      increase: 2.5,
      category: 'Technology',
      validUntil: '2025-12-31',
      featured: true,
      trending: false,
      logo: '🍎',
      color: 'from-gray-500 to-gray-600',
      recommendedCard: 'Apple Card',
      isFavorite: favoriteStores.includes('Apple'),
      terms: 'Valid for hardware, software, and services.',
      rating: 4.8,
      denominations: ['£25', '£50', '£100', '£200'],
      instantDelivery: true,
      giftWrap: true,
      popularFor: 'Tech enthusiasts, iPhone users'
    },
    {
      id: 6,
      store: 'ASOS',
      title: 'ASOS Fashion Gift Cards',
      description: 'Fashion-forward gift cards for style enthusiasts',
      cashbackRate: 7.0,
      maxCashback: 60,
      originalRate: 4.0,
      increase: 3.0,
      category: 'Fashion',
      validUntil: '2025-10-31',
      featured: false,
      trending: true,
      logo: '👗',
      color: 'from-pink-500 to-purple-500',
      recommendedCard: 'Fashion Cashback Card',
      isFavorite: favoriteStores.includes('ASOS'),
      terms: 'Online use only. Valid for 12 months.',
      rating: 4.5,
      denominations: ['£20', '£40', '£75', '£150'],
      instantDelivery: true,
      giftWrap: false,
      popularFor: 'Fashion lovers, young adults'
    }
  ];

  const categories = ['all', 'General Shopping', 'Department Store', 'Entertainment', 'Technology', 'Fashion'];

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
    let filtered = giftCardDeals.filter(deal => {
      const matchesSearch = deal.store.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           deal.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || deal.category === selectedCategory;
      const matchesFavorites = !showFavoritesOnly || deal.isFavorite;
      return matchesSearch && matchesCategory && matchesFavorites;
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
  }, [giftCardDeals, searchQuery, sortBy, sortOrder, selectedCategory, showFavoritesOnly]);

  const handleBuyGiftCard = (deal) => {
    // Redirecionar para a loja ou abrir modal com detalhes
    window.open(`https://www.${deal.store.toLowerCase().replace(' ', '')}.co.uk/gift-cards`, '_blank');
  };

  return (
    <DashboardLayout
      title="🎁 Gift Card Deals"
      subtitle="Maximum cashback on gift cards for yourself or loved ones"
      icon={{
        element: <Gift className="h-8 w-8 text-white" />,
        bgColor: "bg-gradient-to-r from-purple-500 to-pink-500"
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
              <span>Filter Gift Card Deals</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search gift cards..."
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
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="rounded-md border border-input bg-background px-3 py-2"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category}
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
                  <Badge className="absolute top-2 right-2 bg-purple-500 text-white">
                    Featured
                  </Badge>
                )}
                {deal.trending && (
                  <Badge className="absolute top-2 left-2 bg-pink-500 text-white">
                    🎁 Trending
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
                      <span>Delivery:</span>
                      <span className="font-semibold">
                        {deal.instantDelivery ? 'Instant' : 'Standard'}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Gift Wrap:</span>
                      <span className="font-semibold">
                        {deal.giftWrap ? 'Available' : 'Digital Only'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">{deal.rating}</span>
                    </div>
                    {deal.instantDelivery && (
                      <Badge variant="outline" className="text-green-600">
                        <Clock className="h-3 w-3 mr-1" />
                        Instant
                      </Badge>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <div className="text-sm">
                      <span className="font-medium">Popular for:</span>
                      <p className="text-muted-foreground">{deal.popularFor}</p>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {deal.denominations.slice(0, 3).map(denom => (
                        <Badge key={denom} variant="secondary" className="text-xs">
                          {denom}
                        </Badge>
                      ))}
                      {deal.denominations.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{deal.denominations.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  <div className="pt-4 space-y-2">
                    <Button 
                      onClick={() => handleBuyGiftCard(deal)}
                      className="w-full"
                    >
                      Buy Gift Card
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
                <Gift className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Gift Card Deals Found</h3>
                <p className="text-muted-foreground mb-6">
                  Try adjusting your search terms or category filters
                </p>
                <Button 
                  variant="outline"
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('all');
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

export default GiftcardsDealsPage;