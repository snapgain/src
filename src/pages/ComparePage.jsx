import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useProfile } from '@/contexts/ProfileContext';
import { useNavigate } from 'react-router-dom';
import { 
  Scale, 
  Search, 
  ExternalLink, 
  Star, 
  TrendingUp,
  ArrowRight,
  Plus,
  X,
  ArrowLeft,
  Calculator,
  Award,
  CreditCard,
  Store,
  Zap,
  CheckCircle,
  AlertCircle,
  Info,
  Target,
  Heart,
  Filter
} from 'lucide-react';

function ComparePage() {
  const navigate = useNavigate();
  const { favoriteStores, cards } = useProfile();
  
  const [activeTab, setActiveTab] = useState('stores');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItems, setSelectedItems] = useState([]);
  const [comparisonMode, setComparisonMode] = useState('side-by-side'); // 'side-by-side' or 'table'
  const [purchaseAmount, setPurchaseAmount] = useState('100');

  // Mock data para comparação
  const storeData = [
    {
      id: 1,
      name: 'Amazon',
      logo: '🛒',
      color: 'from-orange-500 to-orange-600',
      cashbackRate: 5.0,
      maxCashback: 50,
      category: 'General Shopping',
      rating: 4.9,
      processingTime: '2-3 days',
      minSpend: 10,
      restrictions: 'Prime members only',
      specialOffer: 'Double cashback on electronics',
      popularProducts: ['Electronics', 'Books', 'Home & Garden'],
      membershipRequired: true,
      isFavorite: favoriteStores.includes('Amazon'),
      pros: ['Huge selection', 'Fast delivery', 'Prime benefits'],
      cons: ['Prime membership required', 'Lower cashback on some categories'],
      bestFor: 'Electronics and general shopping'
    },
    {
      id: 2,
      name: 'John Lewis',
      logo: '🏬',
      color: 'from-purple-500 to-purple-600',
      cashbackRate: 3.5,
      maxCashback: 75,
      category: 'Department Store',
      rating: 4.8,
      processingTime: '5-7 days',
      minSpend: 20,
      restrictions: 'Excludes sale items',
      specialOffer: 'Extra points on fashion',
      popularProducts: ['Fashion', 'Home', 'Beauty'],
      membershipRequired: false,
      isFavorite: favoriteStores.includes('John Lewis'),
      pros: ['Premium quality', 'Excellent service', 'Price matching'],
      cons: ['Higher prices', 'Limited sales eligibility'],
      bestFor: 'Premium fashion and home goods'
    },
    {
      id: 3,
      name: 'ASOS',
      logo: '👗',
      color: 'from-pink-500 to-pink-600',
      cashbackRate: 4.0,
      maxCashback: 40,
      category: 'Fashion',
      rating: 4.4,
      processingTime: '3-5 days',
      minSpend: 15,
      restrictions: 'Full price items only',
      specialOffer: 'Student discount + cashback',
      popularProducts: ['Fashion', 'Accessories', 'Beauty'],
      membershipRequired: false,
      isFavorite: favoriteStores.includes('ASOS'),
      pros: ['Trendy fashion', 'Student discounts', 'Free returns'],
      cons: ['Quality varies', 'Sizing inconsistent'],
      bestFor: 'Trendy fashion for young adults'
    },
    {
      id: 4,
      name: 'Tesco',
      logo: '🏪',
      color: 'from-blue-400 to-blue-500',
      cashbackRate: 2.0,
      maxCashback: 35,
      category: 'Grocery',
      rating: 4.6,
      processingTime: '1-2 days',
      minSpend: 25,
      restrictions: 'Clubcard required',
      specialOffer: 'Triple points on Finest range',
      popularProducts: ['Groceries', 'Household', 'Clothing'],
      membershipRequired: true,
      isFavorite: favoriteStores.includes('Tesco'),
      pros: ['Convenient locations', 'Clubcard benefits', 'Wide range'],
      cons: ['Lower cashback rate', 'Membership required'],
      bestFor: 'Weekly grocery shopping'
    }
  ];

  const cardData = [
    {
      id: 1,
      name: 'American Express Gold',
      logo: '💳',
      color: 'from-yellow-500 to-amber-600',
      type: 'Credit Card',
      baseRate: 1.0,
      bonusCategories: [
        { category: 'Dining', rate: 4.0 },
        { category: 'Groceries', rate: 4.0 },
        { category: 'Travel', rate: 3.0 }
      ],
      annualFee: 140,
      signupBonus: '70,000 points',
      benefits: ['Airport lounge access', 'Dining credits', 'Travel insurance'],
      acceptanceRate: 'Excellent credit required',
      pros: ['High rewards on dining', 'Premium benefits', 'Strong customer service'],
      cons: ['High annual fee', 'Limited acceptance', 'Foreign transaction fees'],
      bestFor: 'Frequent diners and travelers'
    },
    {
      id: 2,
      name: 'Chase Sapphire Preferred',
      logo: '💎',
      color: 'from-blue-600 to-indigo-600',
      type: 'Credit Card',
      baseRate: 1.0,
      bonusCategories: [
        { category: 'Travel', rate: 2.0 },
        { category: 'Dining', rate: 2.0 }
      ],
      annualFee: 95,
      signupBonus: '60,000 points',
      benefits: ['Travel protection', 'Primary car rental insurance', 'No foreign fees'],
      acceptanceRate: 'Good to excellent credit',
      pros: ['No foreign fees', 'Great travel benefits', 'Transfer partners'],
      cons: ['Limited bonus categories', 'Annual fee'],
      bestFor: 'Travelers who value flexibility'
    },
    {
      id: 3,
      name: 'Cashback Mastercard',
      logo: '🏦',
      color: 'from-green-500 to-emerald-600',
      type: 'Credit Card',
      baseRate: 1.5,
      bonusCategories: [
        { category: 'All purchases', rate: 1.5 }
      ],
      annualFee: 0,
      signupBonus: '£150 cashback',
      benefits: ['No annual fee', 'Simple cashback', 'Wide acceptance'],
      acceptanceRate: 'Fair to good credit',
      pros: ['No annual fee', 'Simple structure', 'Good base rate'],
      cons: ['No bonus categories', 'Limited benefits'],
      bestFor: 'Simple cashback without fees'
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

  // Get current data based on active tab
  const getCurrentData = () => {
    return activeTab === 'stores' ? storeData : cardData;
  };

  // Filtered data
  const filteredData = useMemo(() => {
    const data = getCurrentData();
    if (!searchQuery) return data;
    
    return data.filter(item => 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.category && item.category.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.type && item.type.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [activeTab, searchQuery]);

  // Add item to comparison
  const addToComparison = (item) => {
    if (selectedItems.length < 4 && !selectedItems.find(selected => selected.id === item.id)) {
      setSelectedItems([...selectedItems, item]);
    }
  };

  // Remove item from comparison
  const removeFromComparison = (itemId) => {
    setSelectedItems(selectedItems.filter(item => item.id !== itemId));
  };

  // Calculate potential cashback
  const calculateCashback = (item, amount) => {
    const purchaseValue = parseFloat(amount) || 0;
    if (activeTab === 'stores') {
      return Math.min(purchaseValue * (item.cashbackRate / 100), item.maxCashback);
    } else {
      // For cards, use base rate
      return purchaseValue * (item.baseRate / 100);
    }
  };

  const ComparisonCard = ({ item, index }) => (
    <motion.div
      variants={itemVariants}
      className="flex-1 min-w-[300px]"
    >
      <Card className="h-full border-2 hover:shadow-lg transition-all duration-300">
        <CardHeader className={`bg-gradient-to-r ${item.color} text-white relative`}>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => removeFromComparison(item.id)}
            className="absolute top-2 right-2 text-white hover:bg-white/20"
          >
            <X className="h-4 w-4" />
          </Button>
          
          <div className="flex items-center space-x-3">
            <div className="text-3xl">{item.logo}</div>
            <div>
              <CardTitle className="text-white">{item.name}</CardTitle>
              <p className="text-white/80 text-sm">
                {activeTab === 'stores' ? item.category : item.type}
              </p>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-6 space-y-4">
          {/* Key Metrics */}
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {activeTab === 'stores' ? `${item.cashbackRate}%` : `${item.baseRate}%`}
              </div>
              <div className="text-sm text-muted-foreground">
                {activeTab === 'stores' ? 'Cashback Rate' : 'Base Rate'}
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">
                {activeTab === 'stores' ? `£${item.maxCashback}` : `£${item.annualFee}`}
              </div>
              <div className="text-sm text-muted-foreground">
                {activeTab === 'stores' ? 'Max Cashback' : 'Annual Fee'}
              </div>
            </div>
          </div>

          {/* Cashback Calculator */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Potential Cashback</span>
              <Calculator className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="text-xl font-bold text-green-600">
              £{calculateCashback(item, purchaseAmount).toFixed(2)}
            </div>
            <div className="text-xs text-muted-foreground">
              On £{purchaseAmount} purchase
            </div>
          </div>

          {/* Rating */}
          {item.rating && (
            <div className="flex items-center space-x-2">
              <Star className="h-4 w-4 fill-current text-yellow-500" />
              <span className="font-medium">{item.rating}</span>
              <span className="text-muted-foreground text-sm">rating</span>
            </div>
          )}

          {/* Key Features */}
          <div className="space-y-2">
            <h4 className="font-medium">Key Features</h4>
            {activeTab === 'stores' ? (
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>Min Spend:</span>
                  <span>£{item.minSpend}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Processing:</span>
                  <span>{item.processingTime}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Membership:</span>
                  <span className={item.membershipRequired ? 'text-orange-600' : 'text-green-600'}>
                    {item.membershipRequired ? 'Required' : 'Not Required'}
                  </span>
                </div>
              </div>
            ) : (
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>Signup Bonus:</span>
                  <span>{item.signupBonus}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Credit Req:</span>
                  <span>{item.acceptanceRate}</span>
                </div>
              </div>
            )}
          </div>

          {/* Pros */}
          <div className="space-y-2">
            <h4 className="font-medium text-green-600">✓ Pros</h4>
            <ul className="space-y-1">
              {item.pros.slice(0, 3).map((pro, idx) => (
                <li key={idx} className="text-sm text-muted-foreground flex items-start">
                  <CheckCircle className="h-3 w-3 text-green-500 mt-1 mr-2 flex-shrink-0" />
                  {pro}
                </li>
              ))}
            </ul>
          </div>

          {/* Cons */}
          <div className="space-y-2">
            <h4 className="font-medium text-red-600">✗ Cons</h4>
            <ul className="space-y-1">
              {item.cons.slice(0, 2).map((con, idx) => (
                <li key={idx} className="text-sm text-muted-foreground flex items-start">
                  <AlertCircle className="h-3 w-3 text-red-500 mt-1 mr-2 flex-shrink-0" />
                  {con}
                </li>
              ))}
            </ul>
          </div>

          {/* Best For */}
          <div className="bg-blue-50 p-3 rounded-lg">
            <h4 className="font-medium text-blue-800 mb-1">Best For</h4>
            <p className="text-sm text-blue-700">{item.bestFor}</p>
          </div>

          {/* Actions */}
          <div className="space-y-2">
            <Button 
              className={`w-full bg-gradient-to-r ${item.color} text-white`}
              onClick={() => {
                if (activeTab === 'stores') {
                  window.open(`https://${item.name.toLowerCase().replace(' ', '')}.com`, '_blank');
                } else {
                  // Link to card application
                  window.open('#', '_blank');
                }
              }}
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              {activeTab === 'stores' ? 'Shop Now' : 'Apply Now'}
            </Button>
            {item.isFavorite && (
              <Badge variant="outline" className="w-full justify-center text-red-600 border-red-200">
                <Heart className="h-3 w-3 mr-1 fill-current" />
                Favorite
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

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
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                    <Scale className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h1 className="text-4xl font-bold">⚖️ Compare</h1>
                    <p className="text-muted-foreground text-lg">
                      Compare stores and cards side by side to find the best deals
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Comparison Summary */}
          {selectedItems.length > 0 && (
            <motion.div variants={itemVariants}>
              <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-bold">Comparison Active</h3>
                      <p className="text-muted-foreground">
                        Comparing {selectedItems.length} {activeTab} • Purchase amount: £{purchaseAmount}
                      </p>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <Calculator className="h-4 w-4" />
                        <Input
                          type="number"
                          value={purchaseAmount}
                          onChange={(e) => setPurchaseAmount(e.target.value)}
                          className="w-24"
                          placeholder="Amount"
                        />
                      </div>
                      <Button
                        variant="outline"
                        onClick={() => setSelectedItems([])}
                      >
                        Clear All
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Tabs */}
          <motion.div variants={itemVariants}>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="stores" className="flex items-center space-x-2">
                  <Store className="h-4 w-4" />
                  <span>Compare Stores</span>
                </TabsTrigger>
                <TabsTrigger value="cards" className="flex items-center space-x-2">
                  <CreditCard className="h-4 w-4" />
                  <span>Compare Cards</span>
                </TabsTrigger>
              </TabsList>

              {/* Search and Filters */}
              <Card className="mt-6">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                      <Input
                        placeholder={`Search ${activeTab}...`}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    <Badge variant="secondary">
                      {filteredData.length} {activeTab} available
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Available Items to Add */}
              <TabsContent value={activeTab} className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>Available {activeTab === 'stores' ? 'Stores' : 'Cards'}</span>
                      <span className="text-sm font-normal text-muted-foreground">
                        Select up to 4 items to compare
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                      {filteredData.map((item) => {
                        const isSelected = selectedItems.find(selected => selected.id === item.id);
                        const canAdd = selectedItems.length < 4;
                        
                        return (
                          <Card 
                            key={item.id} 
                            className={`cursor-pointer transition-all duration-300 hover:shadow-md ${
                              isSelected ? 'ring-2 ring-blue-500 bg-blue-50' : ''
                            } ${!canAdd && !isSelected ? 'opacity-50' : ''}`}
                          >
                            <CardContent className="p-4">
                              <div className="flex items-center space-x-3 mb-3">
                                <div className={`w-12 h-12 bg-gradient-to-r ${item.color} rounded-lg flex items-center justify-center text-xl`}>
                                  {item.logo}
                                </div>
                                <div className="flex-1">
                                  <h4 className="font-semibold">{item.name}</h4>
                                  <p className="text-xs text-muted-foreground">
                                    {activeTab === 'stores' ? item.category : item.type}
                                  </p>
                                </div>
                              </div>
                              
                              <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                  <span>
                                    {activeTab === 'stores' ? 'Cashback:' : 'Base Rate:'}
                                  </span>
                                  <span className="font-medium text-green-600">
                                    {activeTab === 'stores' ? `${item.cashbackRate}%` : `${item.baseRate}%`}
                                  </span>
                                </div>
                                
                                {item.rating && (
                                  <div className="flex items-center space-x-1">
                                    <Star className="h-3 w-3 fill-current text-yellow-500" />
                                    <span className="text-sm">{item.rating}</span>
                                  </div>
                                )}
                                
                                {item.isFavorite && (
                                  <Badge variant="outline" className="text-red-600 border-red-200 text-xs">
                                    <Heart className="h-2 w-2 mr-1 fill-current" />
                                    Favorite
                                  </Badge>
                                )}
                              </div>
                              
                              <Button
                                className="w-full mt-3"
                                size="sm"
                                variant={isSelected ? "secondary" : "default"}
                                onClick={() => {
                                  if (isSelected) {
                                    removeFromComparison(item.id);
                                  } else if (canAdd) {
                                    addToComparison(item);
                                  }
                                }}
                                disabled={!canAdd && !isSelected}
                              >
                                {isSelected ? (
                                  <>
                                    <X className="h-3 w-3 mr-1" />
                                    Remove
                                  </>
                                ) : (
                                  <>
                                    <Plus className="h-3 w-3 mr-1" />
                                    Compare
                                  </>
                                )}
                              </Button>
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </motion.div>

          {/* Comparison Results */}
          {selectedItems.length > 0 && (
            <motion.div variants={itemVariants}>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Scale className="h-6 w-6" />
                    <span>Side-by-Side Comparison</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex space-x-6 overflow-x-auto pb-4">
                    {selectedItems.map((item, index) => (
                      <ComparisonCard key={item.id} item={item} index={index} />
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Empty State */}
          {selectedItems.length === 0 && (
            <motion.div variants={itemVariants}>
              <Card>
                <CardContent className="p-12 text-center">
                  <Scale className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Start Your Comparison</h3>
                  <p className="text-muted-foreground mb-6">
                    Select up to 4 {activeTab} from the list above to compare them side by side
                  </p>
                  <div className="flex items-center justify-center space-x-4 text-sm text-muted-foreground">
                    <div className="flex items-center space-x-2">
                      <Target className="h-4 w-4" />
                      <span>Compare rates</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calculator className="h-4 w-4" />
                      <span>Calculate savings</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Award className="h-4 w-4" />
                      <span>Find the best deal</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

export default ComparePage;