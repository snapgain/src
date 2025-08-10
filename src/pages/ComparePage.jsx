import React, { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useProfile } from '@/contexts/ProfileContext';
import { useAuth } from '@/contexts/AuthContext';
import { 
  CreditCard, 
  Search, 
  Star, 
  TrendingUp, 
  DollarSign, 
  Percent,
  Filter,
  SortAsc,
  SortDesc,
  ExternalLink
} from 'lucide-react';

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

function ComparePage() {
  const { cards, addCard } = useProfile();
  const { user } = useAuth(); 
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('cashbackRate');
  const [sortOrder, setSortOrder] = useState('desc');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    const getGreeting = () => {
      const hour = new Date().getHours();
      if (hour < 12) return '🌅 Good morning';
      else if (hour < 17) return '☀️ Good afternoon';
      else return '🌙 Good evening';
    };
    
    setGreeting(getGreeting());
  }, []);

  const userName = user?.user_metadata?.name?.split(' ')[0] || user?.email?.split('@')[0] || 'there';

  // Mock credit card data
  const creditCards = [
    {
      id: 1,
      name: 'Chase Sapphire Preferred',
      bank: 'Chase',
      cashbackRate: 5.0,
      annualFee: 95,
      welcomeBonus: 500,
      category: 'Travel',
      features: ['Travel Insurance', 'No Foreign Transaction Fees', 'Priority Boarding'],
      color: 'from-blue-600 to-blue-700',
      rating: 4.8,
      isRecommended: true
    },
    {
      id: 2,
      name: 'Cashback Freedom Card',
      bank: 'Bank of America',
      cashbackRate: 4.5,
      annualFee: 0,
      welcomeBonus: 200,
      category: 'Cashback',
      features: ['No Annual Fee', 'Rotating Categories', 'Mobile Banking'],
      color: 'from-green-500 to-green-600',
      rating: 4.6,
      isRecommended: false
    },
    {
      id: 3,
      name: 'Premium Rewards Card',
      bank: 'American Express',
      cashbackRate: 6.0,
      annualFee: 150,
      welcomeBonus: 750,
      category: 'Premium',
      features: ['Concierge Service', 'Airport Lounge Access', 'Global Acceptance'],
      color: 'from-purple-600 to-purple-700',
      rating: 4.9,
      isRecommended: true
    }
  ];

  const categories = ['all', 'Travel', 'Cashback', 'Premium', 'Business'];

  const filteredCards = useMemo(() => {
    let filtered = creditCards.filter(card => {
      const matchesSearch = card.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           card.bank.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || card.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });

    filtered.sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [searchQuery, sortBy, sortOrder, selectedCategory]);

  return (
    <DashboardLayout
      title="💳 Compare"
      subtitle={`${greeting}, ${userName}! 👋 Find the perfect deal for maximum cashback & miles rewards`}
      icon={{
        element: <CreditCard className="h-8 w-8 text-white" />,
        bgColor: "bg-gradient-to-r from-blue-500 to-purple-600"
      }}
    >
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-8"
      >
        {/* Search and Filters */}
        <motion.div variants={itemVariants}>
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search credit cards..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>

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

                <div className="flex gap-2">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-3 py-2 border border-gray-200 rounded-md"
                  >
                    <option value="cashbackRate">Cashback Rate</option>
                    <option value="annualFee">Annual Fee</option>
                    <option value="welcomeBonus">Welcome Bonus</option>
                    <option value="rating">Rating</option>
                  </select>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                  >
                    {sortOrder === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Credit Cards */}
        <motion.div variants={itemVariants}>
          <div className="space-y-6">
            {filteredCards.map((card) => (
              <motion.div key={card.id} variants={itemVariants}>
                <Card className={`transition-all duration-300 hover:shadow-xl ${card.isRecommended ? 'ring-2 ring-blue-200 bg-gradient-to-r from-blue-50/50 to-purple-50/50' : ''}`}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4 flex-1">
                        <div className={`w-16 h-16 bg-gradient-to-r ${card.color} rounded-xl flex items-center justify-center text-white text-2xl font-bold shadow-lg`}>
                          {card.bank[0]}
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="text-2xl font-bold">{card.name}</h3>
                            {card.isRecommended && (
                              <Badge className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                                ⭐ Recommended
                              </Badge>
                            )}
                            <Badge variant="outline">{card.category}</Badge>
                          </div>
                          
                          <p className="text-lg text-muted-foreground mb-4">{card.bank}</p>

                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                            <div className="flex items-center space-x-2">
                              <Star className="h-4 w-4 text-yellow-500 fill-current" />
                              <span className="text-sm">
                                <span className="font-medium">{card.rating}</span>
                                <span className="text-muted-foreground ml-1">rating</span>
                              </span>
                            </div>
                            
                            <div className="flex items-center space-x-2">
                              <DollarSign className="h-4 w-4 text-green-600" />
                              <span className="text-sm">
                                <span className="font-medium">£{card.welcomeBonus}</span>
                                <span className="text-muted-foreground ml-1">bonus</span>
                              </span>
                            </div>
                            
                            <div className="flex items-center space-x-2">
                              <CreditCard className="h-4 w-4 text-blue-600" />
                              <span className="text-sm">
                                <span className="font-medium">£{card.annualFee}</span>
                                <span className="text-muted-foreground ml-1">annual fee</span>
                              </span>
                            </div>
                            
                            <div className="flex items-center space-x-2">
                              <Percent className="h-4 w-4 text-purple-600" />
                              <span className="text-sm">
                                <span className="font-medium">{card.cashbackRate}%</span>
                                <span className="text-muted-foreground ml-1">cashback</span>
                              </span>
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-2">
                            {card.features.map((feature) => (
                              <Badge key={feature} variant="secondary" className="text-xs">
                                {feature}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-start space-x-6">
                        <div className="text-center">
                          <div className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                            {card.cashbackRate}%
                          </div>
                          <div className="text-sm text-muted-foreground">Cashback</div>
                        </div>
                        
                        <div className="flex flex-col space-y-3">
                          <Button 
                            className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-6"
                            onClick={() => addCard(card)}
                          >
                            <ExternalLink className="h-4 w-4 mr-2" />
                            Apply Now
                          </Button>
                          
                          <Button 
                            variant="outline" 
                            size="sm"
                          >
                            Learn More
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
        {filteredCards.length === 0 && (
          <motion.div variants={itemVariants}>
            <Card>
              <CardContent className="p-12 text-center">
                <CreditCard className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No cards found</h3>
                <p className="text-muted-foreground mb-6">
                  Try adjusting your search terms or category filters
                </p>
                <Button 
                  variant="outline"
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('all');
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

export default ComparePage;