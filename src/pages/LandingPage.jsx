import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Header } from '@/components/layout/Header';   // ✅ ADICIONAR
import { Footer } from '@/components/layout/Footer';   // ✅ ADICIONAR
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, ArrowRight, TrendingUp, Star, Clock, Heart, Smartphone, Shield } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

// Hook para detectar mobile:
const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  return isMobile;
};

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

const cardHoverVariants = {
  rest: { scale: 1, y: 0 },
  hover: { 
    scale: 1.05, 
    y: -10,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 20
    }
  }
};

const buttonHoverVariants = {
  rest: { scale: 1 },
  hover: { 
    scale: 1.05,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 10
    }
  },
  tap: { scale: 0.95 }
};

const iconHoverVariants = {
  rest: { scale: 1, rotate: 0 },
  hover: { 
    scale: 1.1, 
    rotate: 5,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 10
    }
  }
};

const features = [
  {
    icon: TrendingUp,
    title: "Real-Time UK Reward Comparison",
    description: "Instantly compare cashback, Avios points, gift cards, and promotions across major UK retailers."
  },
  {
    icon: Star,
    title: "Personalized Strategies",
    description: "Get custom recommendations based on your banks, cards, and loyalty programs."
  },
  {
    icon: Clock,
    title: "Maximize Every Pound",
    description: "Smart GBP calculations insuring you get the best cashback rates across UK platforms."
  },
  {
    icon: Heart,
    title: "Favorites & History",
    description: "Save your favorite stores and view your simulation history for easy access and tracking."
  },
  {
    icon: Smartphone,
    title: "Mobile Alerts & Reminders",
    description: "Never miss a new offer - get notified instantly."
  },
  {
    icon: Shield,
    title: "Secure & Private",
    description: "Your data is protected with industry-standard security and privacy practices."
  }
];

function LandingPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  
  if (user) {
    navigate('/dashboard');
    return null;
  }

  // Variantes de animação adaptadas para mobile:
  const sectionVariants = {
    hidden: { 
      opacity: 0, 
      y: isMobile ? 20 : 50 
    },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: isMobile ? 0.4 : 0.6,
        ease: "easeOut"
      }
    }
  };

  const itemVariantsMobile = {
    hidden: { 
      opacity: 0, 
      y: isMobile ? 10 : 30 
    },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: isMobile ? 0.3 : 0.5
      }
    }
  };

  return (
    <>
      <Helmet>
        <title>SnapGain - UK's Smartest Cashback Comparison</title>
        <meta name="description" content="Compare cashback rates, loyalty points, and gift card promotions instantly. Make every purchase count with SnapGain - your intelligent rewards companion." />
      </Helmet>
      
      <Header />  {/* ✅ ADICIONAR HEADER */}
      
      <div className="min-h-screen pt-16">
        {/* Hero Section */}
        <motion.div 
          className="text-center max-w-4xl mx-auto mb-16 pt-16 px-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.h1 
            className="text-4xl md:text-6xl font-bold mb-6"
            variants={itemVariants}
          >
            UK's Smartest <span className="bg-gradient-to-r from-[#7D4DFB] to-[#FF3FCE] bg-clip-text text-transparent">Rewards Comparison</span>
          </motion.h1>
          
          <motion.p 
            className="text-xl md:text-2xl text-muted-foreground mb-8"
            variants={itemVariants}
          >
            Compare cashback rates, loyalty points, and gift card promotions instantly. Make every purchase count with <span className="text-[#7D4DFB] font-semibold">SnapGain</span> - your intelligent rewards companion.
          </motion.p>

          <motion.div variants={itemVariants}>
            <motion.div
              variants={buttonHoverVariants}
              initial="rest"
              whileHover="hover"
              whileTap="tap"
            >
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-[#7D4DFB] to-[#FF3FCE] hover:from-purple-700 hover:to-pink-600 text-white px-8 py-3 text-lg"
                onClick={() => navigate('/auth/signup')}
              >
                Start Saving Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Features Section */}
        <motion.section 
          id="features"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: isMobile ? 0.1 : 0.3 }}
          variants={sectionVariants}
          className="py-20 bg-white"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div 
              variants={itemVariants}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Powerful Features
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Everything you need to maximize your cashback rewards
              </p>
            </motion.div>
            
            <motion.div 
              variants={{
                visible: {
                  transition: {
                    staggerChildren: isMobile ? 0.1 : 0.2
                  }
                }
              }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  variants={itemVariantsMobile}
                  className="bg-gray-50 rounded-xl p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-center space-x-4 mb-4">
                    <motion.div 
                      className="w-12 h-12 bg-gradient-to-r from-[#7D4DFB] to-[#FF3FCE] rounded-lg flex items-center justify-center flex-shrink-0"
                      variants={iconHoverVariants}
                    >
                      <feature.icon className="h-6 w-6 text-white" />
                    </motion.div>
                    <h3 className="text-xl font-semibold">{feature.title}</h3>
                  </div>
                  <p className="text-gray-700">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.section>

        {/* Pricing Section */}
        <motion.section 
          id="pricing"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: isMobile ? 0.1 : 0.3 }}
          variants={sectionVariants}
          className="py-20 bg-gray-50"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div 
              variants={itemVariants}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Simple Pricing
              </h2>
              <p className="text-xl text-gray-600">
                Choose the plan that works for you
              </p>
            </motion.div>
            
            <motion.div 
              variants={{
                visible: {
                  transition: {
                    staggerChildren: isMobile ? 0.15 : 0.3
                  }
                }
              }}
              className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto"
            >
              {/* Free Trial Plan */}
              <motion.div 
                variants={itemVariants}
                initial="rest"
                whileHover="hover"
              >
                <motion.div variants={cardHoverVariants}>
                  <Card className="relative h-full border-2 cursor-pointer transition-shadow duration-300 hover:shadow-xl">
                    <CardHeader className="text-center pb-2">
                      <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-r from-[#99FF33] to-[#7D4DFB] flex items-center justify-center">
                        <Clock className="h-8 w-8 text-white" />
                      </div>
                      <CardTitle className="text-2xl">Free Trial</CardTitle>
                      <div className="text-3xl font-bold">£0 <span className="text-lg font-normal text-muted-foreground">3 days</span></div>
                      <p className="text-sm text-muted-foreground">Try SnapGain for free with no commitment.</p>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <div className="space-y-4 mb-8">
                        <div className="flex items-center space-x-3">
                          <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                          <span>Unlimited reward comparisons</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                          <span>Access to all UK platforms</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                          <span>Real-time rate updates</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                          <span>Personalized Strategies</span>
                        </div>
                      </div>
                      <motion.div
                        variants={buttonHoverVariants}
                        initial="rest"
                        whileHover="hover"
                        whileTap="tap"
                      >
                        <Button 
                          className="w-full bg-gradient-to-r from-[#99FF33] to-[#7D4DFB] hover:from-green-500 hover:to-purple-700 text-white"
                          onClick={() => navigate('/auth/signup')}
                        >
                          Start 3-Day Free Trial
                        </Button>
                      </motion.div>
                    </CardContent>
                  </Card>
                </motion.div>
              </motion.div>

              {/* Monthly Plan */}
              <motion.div 
                variants={itemVariants}
                initial="rest"
                whileHover="hover"
              >
                <motion.div variants={cardHoverVariants}>
                  <Card className="relative h-full border-2 border-purple-200 cursor-pointer transition-shadow duration-300 hover:shadow-xl">
                    <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-[#7D4DFB] text-white">
                      Most Popular
                    </Badge>
                    <CardHeader className="text-center pb-2">
                      <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-r from-[#7D4DFB] to-[#FF3FCE] flex items-center justify-center">
                        <TrendingUp className="h-8 w-8 text-white" />
                      </div>
                      <CardTitle className="text-2xl">Monthly</CardTitle>
                      <div className="text-3xl font-bold">£7.99 <span className="text-lg font-normal text-muted-foreground">/per month</span></div>
                      <p className="text-sm text-muted-foreground">Perfect for trying things out.</p>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <div className="space-y-4 mb-8">
                        <div className="flex items-center space-x-3">
                          <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                          <span>Everything in Free Trial</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                          <span>Advanced strategy breakdowns</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                          <span>Favourites & History</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                          <span>Smart Card Integration</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                          <span>Premium customer support</span>
                        </div>
                      </div>
                      <motion.div
                        variants={buttonHoverVariants}
                        initial="rest"
                        whileHover="hover"
                        whileTap="tap"
                      >
                        <Button 
                          className="w-full bg-gradient-to-r from-[#7D4DFB] to-[#FF3FCE] hover:from-purple-700 hover:to-pink-600 text-white"
                          onClick={() => navigate('/auth/signup')}
                        >
                          Start 3-Day Free Trial
                        </Button>
                      </motion.div>
                    </CardContent>
                  </Card>
                </motion.div>
              </motion.div>

              {/* Yearly Plan */}
              <motion.div 
                variants={itemVariants}
                initial="rest"
                whileHover="hover"
              >
                <motion.div variants={cardHoverVariants}>
                  <Card className="relative h-full border-2 border-pink-200 cursor-pointer transition-shadow duration-300 hover:shadow-xl">
                    <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-[#FF3FCE] text-white">
                      Best Value
                    </Badge>
                    <CardHeader className="text-center pb-2">
                      <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-r from-[#FF3FCE] to-[#7D4DFB] flex items-center justify-center">
                        <Star className="h-8 w-8 text-white" />
                      </div>
                      <CardTitle className="text-2xl">Yearly</CardTitle>
                      <div className="text-3xl font-bold">£60 <span className="text-lg font-normal text-muted-foreground">/per year</span></div>
                      <div className="bg-[#BFFFB4] text-green-800 text-sm px-3 py-1 rounded-full inline-block mb-2">
                        Save over 35% and commit to saving.
                      </div>
                      <p className="text-sm text-muted-foreground">Best value for serious reward optimizers.</p>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <div className="space-y-4 mb-8">
                        <div className="flex items-center space-x-3">
                          <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                          <span>Everything in Monthly plan</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                          <span>2 months free (35%+ savings)</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                          <span>Priority feature access</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                          <span>Exclusive strategy insights</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                          <span>Annual rate trend reports</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                          <span>VIP customer support</span>
                        </div>
                      </div>
                      <motion.div
                        variants={buttonHoverVariants}
                        initial="rest"
                        whileHover="hover"
                        whileTap="tap"
                      >
                        <Button 
                          className="w-full bg-gradient-to-r from-[#FF3FCE] to-[#99FF33] hover:from-pink-600 hover:to-green-500 text-white"
                          onClick={() => navigate('/auth/signup')}
                        >
                          Start 3-Day Free Trial
                        </Button>
                      </motion.div>
                    </CardContent>
                  </Card>
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </motion.section>
      </div>

      <Footer />  {/* ✅ ADICIONAR FOOTER */}
    </>
  );
}

export default LandingPage;