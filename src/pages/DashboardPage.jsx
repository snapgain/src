import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useProfile } from '@/contexts/ProfileContext';
import { useNavigate } from 'react-router-dom';
import { 
  Flame, 
  ShoppingCart, 
  Gift, 
  Heart, 
  Clock, 
  TrendingUp, 
  Star,
  ArrowRight,
  Activity,
  Timer
} from 'lucide-react';
import ProfileOnboarding from '@/components/onboarding/ProfileOnboarding';

function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { banks, cards, programs, favoriteStores, profileData } = useProfile();
  const [showOnboarding, setShowOnboarding] = useState(false);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
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
        duration: 0.5
      }
    }
  };

  // Função para calcular dias restantes do trial
  const getTrialDaysLeft = () => {
    if (!user?.trialStart) return 3;
    const trialStart = new Date(user.trialStart);
    const now = new Date();
    const diffTime = (3 * 24 * 60 * 60 * 1000) - (now - trialStart);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  };

  const trialDaysLeft = getTrialDaysLeft();

  // Verificar se é primeiro acesso e precisa do onboarding
  React.useEffect(() => {
    if (profileData.setupStep === 'welcome' && profileData.completionPercentage === 0) {
      setShowOnboarding(true);
    }
  }, [profileData]);

  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
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
          {/* Welcome Section */}
          <motion.div variants={itemVariants} className="mb-8">
            <Card className="bg-gradient-to-r from-[#7D4DFB] to-[#FF3FCE] text-white border-0">
              <CardContent className="p-6">
                <h1 className="text-2xl md:text-3xl font-bold mb-2">
                  Welcome back, {user?.name || user?.email?.split('@')[0] || 'User'}! 👋
                </h1>
                <p className="text-white/90 text-lg">
                  Here's how you're maximizing your rewards with SnapGain
                </p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Quick Actions - 4 Cards Principais */}
          <motion.div variants={itemVariants}>
            <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {/* Hot Deals */}
              <Card className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105" onClick={() => navigate('/deals/hot')}>
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Flame className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">Hot Deals</h3>
                  <p className="text-sm text-muted-foreground mb-3">General stores with best offers</p>
                  <ArrowRight className="h-4 w-4 text-muted-foreground mx-auto" />
                </CardContent>
              </Card>

              {/* Highest Supermarket Deal */}
              <Card className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105" onClick={() => navigate('/deals/supermarket')}>
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <ShoppingCart className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">Highest Supermarket Deal</h3>
                  <p className="text-sm text-muted-foreground mb-3">Best cashback for groceries</p>
                  <ArrowRight className="h-4 w-4 text-muted-foreground mx-auto" />
                </CardContent>
              </Card>

              {/* Top Giftcards */}
              <Card className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105" onClick={() => navigate('/deals/giftcards')}>
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-[#7D4DFB] to-[#FF3FCE] rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Gift className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">Top Giftcards</h3>
                  <p className="text-sm text-muted-foreground mb-3">Best gift card deals available</p>
                  <ArrowRight className="h-4 w-4 text-muted-foreground mx-auto" />
                </CardContent>
              </Card>

              {/* My Favourite Stores */}
              <Card className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105" onClick={() => navigate('/deals/favorites')}>
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-rose-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Heart className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">My Favourite Stores</h3>
                  <p className="text-sm text-muted-foreground mb-3">Your personalized top deals</p>
                  <ArrowRight className="h-4 w-4 text-muted-foreground mx-auto" />
                </CardContent>
              </Card>
            </div>
          </motion.div>

          {/* Recent Activities e Your Setup */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Recent Activities */}
            <motion.div variants={itemVariants}>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Clock className="h-5 w-5 text-[#7D4DFB]" />
                    <span>Recent Activities</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <TrendingUp className="h-4 w-4 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Compared Amazon deals</p>
                        <p className="text-xs text-muted-foreground">2 hours ago</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                        <Heart className="h-4 w-4 text-red-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Added ASDA to favorites</p>
                        <p className="text-xs text-muted-foreground">1 day ago</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <Activity className="h-4 w-4 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Profile setup completed</p>
                        <p className="text-xs text-muted-foreground">2 days ago</p>
                      </div>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full mt-4" onClick={() => navigate('/activities')}>
                    View All Activities
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            {/* Your Setup */}
            <motion.div variants={itemVariants}>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Star className="h-5 w-5 text-[#FF3FCE]" />
                    <span>Your Setup</span>
                    <Badge 
                      variant={profileData.isProfileComplete ? "default" : "outline"}
                      className={profileData.isProfileComplete ? "bg-green-500" : ""}
                    >
                      {profileData.completionPercentage}%
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center py-2">
                      <span className="text-sm font-medium">Banks</span>
                      <span className={`text-sm font-bold px-2 py-1 rounded ${banks.length > 0 ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-muted-foreground'}`}>
                        {banks.length}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-sm font-medium">Cards</span>
                      <span className={`text-sm font-bold px-2 py-1 rounded ${cards.length > 0 ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-muted-foreground'}`}>
                        {cards.length}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-sm font-medium">Programs</span>
                      <span className={`text-sm font-bold px-2 py-1 rounded ${programs.length > 0 ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-muted-foreground'}`}>
                        {programs.length}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-sm font-medium">Favorite Stores</span>
                      <span className={`text-sm font-bold px-2 py-1 rounded ${favoriteStores.length > 0 ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-muted-foreground'}`}>
                        {favoriteStores.length}
                      </span>
                    </div>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="mt-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span>Profile Completion</span>
                      <span className="font-medium">{profileData.completionPercentage}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-[#7D4DFB] to-[#FF3FCE] h-2 rounded-full transition-all duration-300"
                        style={{ width: `${profileData.completionPercentage}%` }}
                      />
                    </div>
                  </div>
                  
                  <div className="flex space-x-2 mt-4">
                    <Button 
                      variant="outline" 
                      className="flex-1 hover:bg-gradient-to-r hover:from-[#7D4DFB] hover:to-[#FF3FCE] hover:text-white transition-all" 
                      onClick={() => navigate('/profile')}
                    >
                      {profileData.isProfileComplete ? 'Manage Profile' : 'Complete Setup'}
                    </Button>
                    
                    {!profileData.isProfileComplete && (
                      <Button 
                        className="bg-gradient-to-r from-[#7D4DFB] to-[#FF3FCE] hover:from-purple-700 hover:to-pink-700 text-white" 
                        onClick={() => setShowOnboarding(true)}
                      >
                        Quick Setup
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Trial Countdown Card */}
          <motion.div variants={itemVariants}>
            <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
              <CardContent className="p-6">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <Timer className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg text-green-800">
                        Free Trial: {trialDaysLeft} days left
                      </h3>
                      <p className="text-green-700">
                        Unlock unlimited comparisons and premium features
                      </p>
                    </div>
                  </div>
                  <Button 
                    className="bg-gradient-to-r from-[#99FF33] to-[#7D4DFB] hover:from-green-500 hover:to-purple-700 text-white px-6 py-2"
                    onClick={() => navigate('/pricing')}
                  >
                    Upgrade Now
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>

      {/* Onboarding Modal */}
      {showOnboarding && (
        <ProfileOnboarding onComplete={handleOnboardingComplete} />
      )}
    </div>
  );
}

export default DashboardPage;