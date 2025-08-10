import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useProfile } from '@/contexts/ProfileContext';
import { useNavigate } from 'react-router-dom';
import { 
  CreditCard, 
  TrendingUp, 
  DollarSign, 
  Target, 
  Star,
  ExternalLink,
  ArrowRight,
  Zap,
  ShoppingCart,
  Gift,
  Heart,
  BarChart3,
  Users,
  Clock
} from 'lucide-react';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: 0.1,
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100
    }
  }
};

function DashboardPage() {
  const navigate = useNavigate();
  const { profile, cards, favoriteStores } = useProfile();
  
  const [timeOfDay, setTimeOfDay] = useState('');
  
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setTimeOfDay('morning');
    else if (hour < 17) setTimeOfDay('afternoon');
    else setTimeOfDay('evening');
  }, []);

  const getGreeting = () => {
    const greetings = {
      morning: '🌅 Good morning',
      afternoon: '☀️ Good afternoon', 
      evening: '🌙 Good evening'
    };
    return greetings[timeOfDay] || '👋 Hello';
  };

  // Mock data for dashboard stats
  const stats = {
    totalCashback: 847.32,
    monthlyEarnings: 124.50,
    bestCard: 'Chase Sapphire',
    activeCashback: 5.2
  };

  const quickActions = [
    {
      title: 'Compare Cards',
      description: 'Find the best cashback rates',
      icon: <CreditCard className="h-6 w-6" />,
      color: 'from-blue-500 to-blue-600',
      path: '/compare'
    },
    {
      title: 'Hot Deals',
      description: 'Limited time offers',
      icon: <Zap className="h-6 w-6" />,
      color: 'from-red-500 to-red-600',
      path: '/deals/hot'
    },
    {
      title: 'Supermarket Deals',
      description: 'Grocery cashback offers',
      icon: <ShoppingCart className="h-6 w-6" />,
      color: 'from-green-500 to-green-600',
      path: '/deals/supermarket'
    },
    {
      title: 'Gift Cards',
      description: 'Bonus gift card deals',
      icon: <Gift className="h-6 w-6" />,
      color: 'from-purple-500 to-purple-600',
      path: '/deals/giftcards'
    }
  ];

  const recentActivity = [
    {
      store: 'Amazon',
      amount: 2.50,
      date: '2 hours ago',
      type: 'cashback'
    },
    {
      store: 'Tesco',
      amount: 1.75,
      date: '1 day ago',
      type: 'cashback'
    },
    {
      store: 'John Lewis',
      amount: 8.20,
      date: '3 days ago',
      type: 'cashback'
    }
  ];

  return (
    <DashboardLayout
      title="Dashboard"
      subtitle={`${getGreeting()}, ${profile?.name?.split(' ')[0] || 'there'}! Welcome to your cashback hub.`}
      showBackButton={false}
      icon={{
        element: <BarChart3 className="h-8 w-8 text-white" />,
        bgColor: "bg-gradient-to-r from-blue-500 to-purple-600"
      }}
    >
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-8"
      >
        {/* Stats Overview */}
        <motion.div variants={itemVariants}>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <DollarSign className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-green-600 font-medium">Total Cashback</p>
                    <p className="text-2xl font-bold text-green-800">£{stats.totalCashback}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-blue-50 to-blue-50 border-blue-200">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <TrendingUp className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-blue-600 font-medium">This Month</p>
                    <p className="text-2xl font-bold text-blue-800">£{stats.monthlyEarnings}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-purple-50 to-purple-50 border-purple-200">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                    <CreditCard className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-purple-600 font-medium">Best Card</p>
                    <p className="text-lg font-bold text-purple-800">{stats.bestCard}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-orange-50 to-orange-50 border-orange-200">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                    <Target className="h-6 w-6 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm text-orange-600 font-medium">Active Rate</p>
                    <p className="text-2xl font-bold text-orange-800">{stats.activeCashback}%</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Zap className="h-5 w-5" />
                <span>Quick Actions</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {quickActions.map((action, index) => (
                  <Card 
                    key={index}
                    className="cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105"
                    onClick={() => navigate(action.path)}
                  >
                    <CardContent className="p-6">
                      <div className={`w-12 h-12 bg-gradient-to-r ${action.color} rounded-full flex items-center justify-center mb-4 text-white`}>
                        {action.icon}
                      </div>
                      <h3 className="font-semibold mb-2">{action.title}</h3>
                      <p className="text-sm text-muted-foreground">{action.description}</p>
                      <ArrowRight className="h-4 w-4 mt-3 text-muted-foreground" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Activity & Favorite Stores */}
        <motion.div variants={itemVariants}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Clock className="h-5 w-5" />
                  <span>Recent Cashback</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">{activity.store}</p>
                        <p className="text-sm text-muted-foreground">{activity.date}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-green-600">+£{activity.amount}</p>
                        <p className="text-xs text-muted-foreground">cashback</p>
                      </div>
                    </div>
                  ))}
                </div>
                <Button variant="outline" className="w-full mt-4">
                  View All Activity
                </Button>
              </CardContent>
            </Card>

            {/* Favorite Stores */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Heart className="h-5 w-5" />
                  <span>Favorite Stores</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {favoriteStores.slice(0, 5).map((store, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                          {store[0]}
                        </div>
                        <span className="font-medium">{store}</span>
                      </div>
                      <Button size="sm" variant="ghost">
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
                <Button 
                  variant="outline" 
                  className="w-full mt-4"
                  onClick={() => navigate('/deals/favorite-stores')}
                >
                  Manage Favorites
                </Button>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </motion.div>
    </DashboardLayout>
  );
}

export default DashboardPage;