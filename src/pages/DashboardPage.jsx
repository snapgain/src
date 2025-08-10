import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
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
  Clock,
  Flame
} from 'lucide-react';

function DashboardPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const userName = user?.user_metadata?.name?.split(' ')[0] || user?.email?.split('@')[0] || 'there';

  // ✅ QUICK ACTIONS CORRIGIDOS
  const quickActions = [
    {
      title: 'Hot Deals',
      description: 'Limited time offers',
      icon: <Flame className="h-6 w-6" />,
      color: 'from-red-500 to-red-600',
      path: '/deals/hot'
    },
    {
      title: 'Highest Supermarket Deal',
      description: 'Best grocery cashback offers',
      icon: <ShoppingCart className="h-6 w-6" />,
      color: 'from-green-500 to-green-600',
      path: '/deals/supermarket'
    },
    {
      title: 'Top Gift Card',
      description: 'Best gift card deals',
      icon: <Gift className="h-6 w-6" />,
      color: 'from-purple-500 to-purple-600',
      path: '/deals/giftcards'
    },
    {
      title: 'My Favorites',
      description: 'Your favorite stores',
      icon: <Heart className="h-6 w-6" />,
      color: 'from-pink-500 to-red-500',
      path: '/deals/favorite-stores'
    }
  ];

  const recentActivity = [
    {
      id: 1,
      type: 'cashback_earned',
      store: 'Amazon',
      amount: 12.50,
      date: '2 hours ago',
      icon: '🛒'
    },
    {
      id: 2,
      type: 'new_deal',
      store: 'John Lewis',
      amount: 8.0,
      date: '1 day ago',
      icon: '🏪'
    },
    {
      id: 3,
      type: 'cashback_earned',
      store: 'ASOS',
      amount: 5.75,
      date: '3 days ago',
      icon: '👕'
    }
  ];

  const topPerformingCards = [
    {
      name: 'American Express Gold',
      category: 'Dining & Travel',
      cashbackEarned: 145.30,
      monthlySpend: 1250,
      efficiency: 95
    },
    {
      name: 'Chase Sapphire',
      category: 'General Shopping',
      cashbackEarned: 89.20,
      monthlySpend: 890,
      efficiency: 88
    },
    {
      name: 'Santander 123',
      category: 'Utilities & Bills',
      cashbackEarned: 67.85,
      monthlySpend: 650,
      efficiency: 82
    }
  ];

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

  return (
    <DashboardLayout
      title="Dashboard"
      subtitle={`Welcome back, ${userName}! 👋 Welcome to your Dashboard.`}
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
        {/* STATS OVERVIEW */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <motion.div variants={itemVariants}>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <DollarSign className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Cashback</p>
                    <p className="text-2xl font-bold">£{(145.30 + 89.20 + 67.85).toFixed(2)}</p>
                    <p className="text-xs text-green-600">+12% this month</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <CreditCard className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Active Cards</p>
                    <p className="text-2xl font-bold">3</p>
                    <p className="text-xs text-blue-600">All optimized</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                    <Target className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Monthly Goal</p>
                    <p className="text-2xl font-bold">78%</p>
                    <p className="text-xs text-purple-600">£156 to go</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                    <TrendingUp className="h-6 w-6 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Efficiency</p>
                    <p className="text-2xl font-bold">88%</p>
                    <p className="text-xs text-orange-600">Above average</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* QUICK ACTIONS */}
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Zap className="h-5 w-5 text-[#7D4DFB]" />
                <span>Quick Actions</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {quickActions.map((action, index) => (
                  <motion.div
                    key={action.title}
                    variants={itemVariants}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Card 
                      className="cursor-pointer transition-all duration-200 hover:shadow-md"
                      onClick={() => navigate(action.path)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-3">
                          <div className={`w-12 h-12 bg-gradient-to-r ${action.color} rounded-full flex items-center justify-center text-white`}>
                            {action.icon}
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-sm">{action.title}</h3>
                            <p className="text-xs text-muted-foreground">{action.description}</p>
                          </div>
                          <ArrowRight className="h-4 w-4 text-muted-foreground" />
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* RECENT ACTIVITY & TOP CARDS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Activity */}
          <motion.div variants={itemVariants}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Clock className="h-5 w-5 text-[#FF3FCE]" />
                  <span>Recent Activity</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <span className="text-xl">{activity.icon}</span>
                      <div>
                        <p className="font-medium">{activity.store}</p>
                        <p className="text-sm text-muted-foreground">{activity.date}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-green-600">
                        {activity.type === 'cashback_earned' ? `+£${activity.amount}` : `${activity.amount}%`}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {activity.type === 'cashback_earned' ? 'Cashback' : 'New Rate'}
                      </p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>

          {/* Top Performing Cards */}
          <motion.div variants={itemVariants}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Star className="h-5 w-5 text-yellow-500" />
                  <span>Top Performing Cards</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {topPerformingCards.map((card, index) => (
                  <div key={card.name} className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">{card.name}</h4>
                        <p className="text-sm text-muted-foreground">{card.category}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">£{card.cashbackEarned}</p>
                        <p className="text-xs text-muted-foreground">This month</p>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>Efficiency</span>
                        <span>{card.efficiency}%</span>
                      </div>
                      <Progress value={card.efficiency} className="h-2" />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </motion.div>
    </DashboardLayout>
  );
}

export default DashboardPage;