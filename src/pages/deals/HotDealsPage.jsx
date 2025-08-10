import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Flame, 
  Search, 
  SortAsc, 
  SortDesc, 
  Star, 
  Clock, 
  Users,
  Heart,
  Filter
} from 'lucide-react';
import { useProfile } from '@/hooks/useProfile';

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
      title: 'Summer Sale Cashback Boost',
      description: 'Extra cashback on fashion, home & beauty during summer sale',
      cashbackRate: 6.0,
      maxCashback: 80,
      originalRate: 3.0,
      increase: 3.0,
      category: 'Fashion',
      validUntil: '2025-07-31',
      featured: true,
      trending: false,
      logo: '🏪',
      color: 'from-blue-500 to-blue-600',
      recommendedCard: 'John Lewis Partnership Card',
      isFavorite: favoriteStores.includes('John Lewis'),
      terms: 'Online purchases only. Cannot be combined.',
      rating: 4.7,
      totalSavings: '£890K',
      usersUsed: 8320,
      timeLeft: '5 days',
      dealType: 'seasonal'
    },
    {
      id: 3,
      store: 'ASOS',
      title: 'Student Discount + Cashback',
      description: 'Double rewards: student discount plus enhanced cashback',
      cashbackRate: 12.0,
      maxCashback: 60,
      originalRate: 4.0,
      increase: 8.0,
      category: 'Fashion',
      validUntil: '2025-09-30',
      featured: false,
      trending: true,
      logo: '👕',
      color: 'from-pink-500 to-purple-500',
      recommendedCard: 'Jam Doughnut Student Card',
      isFavorite: favoriteStores.includes('ASOS'),
      terms: 'Valid student ID required. Online only.',
      rating: 4.8,
      totalSavings: '£1.2M',
      usersUsed: 12850,
      timeLeft: '1 week',
      dealType: 'student'
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

  // Filtrar e ordenar deals
  const filteredAndSortedDeals = useMemo(() => {
    let filtered = hotDeals.filter(deal => {
      const matchesSearch = deal.store.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           deal.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFavorites = !showFavoritesOnly || deal.isFavorite;
      return matchesSearch && matchesFavorites;
    });

    return filtered.sort((a, b) => {
      const order = sortOrder === 'asc' ? 1 : -1;
      switch (sortBy) {
        case 'cashback':
          return (a.cashbackRate - b.cashbackRate) * order;
        case 'store':
          return a.store.localeCompare(b.store) * order;
        case 'timeLeft':
          return (new Date(a.validUntil) - new Date(b.validUntil)) * order;
        default:
          return 0;
      }
    });
  }, [hotDeals, searchQuery, sortBy, sortOrder, showFavoritesOnly]);

  const handleViewDeal = (deal) => {
    // Redirecionar para a loja ou abrir modal com detalhes
    window.open(`https://www.${deal.store.toLowerCase().replace(' ', '')}.co.uk`, '_blank');
  };

  return (
    <DashboardLayout
      title="🔥 Hot Deals"
      subtitle="The hottest cashback deals available right now"
      icon={{
        element: <Flame className="h-8 w-8 text-white" />,
        bgColor: "bg-gradient-to-r from-orange-500 to-red-500"
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
              <span>Filter Deals</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search deals..."
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
                <option value="timeLeft">Sort by Time Left</option>
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
                  <Badge className="absolute top-2 right-2 bg-orange-500 text-white">
                    Featured
                  </Badge>
                )}
                {deal.trending && (
                  <Badge className="absolute top-2 left-2 bg-red-500 text-white">
                    🔥 Trending
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
                      <span>Users Saved:</span>
                      <span className="font-semibold">{deal.totalSavings}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Time Left:</span>
                      <span className="font-semibold text-orange-600">{deal.timeLeft}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">{deal.rating}</span>
                      <span className="text-xs text-muted-foreground">({deal.usersUsed})</span>
                    </div>
                    <Badge variant="outline">
                      {deal.recommendedCard}
                    </Badge>
                  </div>
                  
                  <div className="pt-4 space-y-2">
                    <Button 
                      onClick={() => handleViewDeal(deal)}
                      className="w-full"
                    >
                      Get This Deal
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
                <Flame className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Hot Deals Found</h3>
                <p className="text-muted-foreground mb-6">
                  Try adjusting your search terms or filters
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
    </DashboardLayout>
  );
}

export default HotDealsPage;