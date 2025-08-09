import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, TrendingUp, Star, Clock } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { StripePayment } from '@/components/payments/StripePayment';

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

function PricingPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showPayment, setShowPayment] = useState(false);

  const handleSubscribe = (plan) => {
    if (!user) {
      navigate('/auth/signup');
      return;
    }
    setSelectedPlan(plan);
    setShowPayment(true);
  };

  const handlePaymentSuccess = () => {
    setShowPayment(false);
    navigate('/dashboard');
  };

  const handlePaymentCancel = () => {
    setShowPayment(false);
    setSelectedPlan(null);
  };

  if (showPayment) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 pt-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <StripePayment
            plan={{ ...selectedPlan, price: selectedPlan.priceValue }}
            onSuccess={handlePaymentSuccess}
            onCancel={handlePaymentCancel}
          />
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Pricing - SnapGain UK</title>
        <meta name="description" content="Choose the perfect SnapGain plan for your cashback needs. Start with a free trial and upgrade when ready." />
      </Helmet>
      
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
            Choose Your <span className="bg-gradient-to-r from-[#7D4DFB] to-[#FF3FCE] bg-clip-text text-transparent">Plan</span>
          </motion.h1>
          
          <motion.p 
            className="text-xl md:text-2xl text-muted-foreground mb-8"
            variants={itemVariants}
          >
            Start free, upgrade when you're ready to maximize your rewards
          </motion.p>
        </motion.div>

        {/* Pricing Section */}
        <motion.div 
          className="container mx-auto px-4 py-20"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
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
                        onClick={() => handleSubscribe({ title: 'Free Trial', priceValue: 0, billingCycle: 'trial' })}
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
                        onClick={() => handleSubscribe({ title: 'Monthly Plan', priceValue: 7.99, billingCycle: 'monthly' })}
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
                        onClick={() => handleSubscribe({ title: 'Annual Plan', priceValue: 60, billingCycle: 'annual' })}
                      >
                        Start 3-Day Free Trial
                      </Button>
                    </motion.div>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </>
  );
}

export default PricingPage;