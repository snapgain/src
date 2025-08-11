import React from 'react';
import { Helmet } from 'react-helmet';
import { Header } from '@/components/layout/Header';   // ✅ ADICIONAR
import { Footer } from '@/components/layout/Footer';   // ✅ ADICIONAR
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Star, Clock, Heart, Smartphone, Shield } from 'lucide-react';

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

function FeaturesPage() {
  return (
    <>
      <Helmet>
        <title>Features - SnapGain UK</title>
        <meta name="description" content="Discover SnapGain's powerful features: real-time reward comparison, personalized strategies, and smart calculations to maximize your UK cashback." />
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
            Powerful <span className="bg-gradient-to-r from-[#7D4DFB] to-[#FF3FCE] bg-clip-text text-transparent">Features</span>
          </motion.h1>
          
          <motion.p 
            className="text-xl md:text-2xl text-muted-foreground mb-8"
            variants={itemVariants}
          >
            Discover how SnapGain's intelligent features help you maximize rewards across all major UK platforms with smart comparison technology.
          </motion.p>
        </motion.div>

        {/* Features Section */}
        <motion.div 
          className="container mx-auto px-4 py-20"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div className="text-center mb-16" variants={itemVariants}>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Why Choose SnapGain?
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Discover how SnapGain's powerful features help you maximize rewards across all major UK platforms with intelligent strategy comparison.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {features.map((feature, index) => (
              <motion.div 
                key={index} 
                variants={itemVariants}
                initial="rest"
                whileHover="hover"
                className="w-full"
              >
                <motion.div variants={cardHoverVariants} className="h-full">
                  <Card className="h-full cursor-pointer transition-shadow duration-300 hover:shadow-xl">
                    <CardHeader className="pb-4">
                      <div className="flex items-center space-x-4">
                        <motion.div 
                          className="w-12 h-12 bg-gradient-to-r from-[#7D4DFB] to-[#FF3FCE] rounded-lg flex items-center justify-center flex-shrink-0"
                          variants={iconHoverVariants}
                        >
                          <feature.icon className="h-6 w-6 text-white" />
                        </motion.div>
                        <CardTitle className="text-xl flex-1">{feature.title}</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="text-muted-foreground">{feature.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Additional Features Section */}
        <motion.div 
          className="container mx-auto px-4 py-20 bg-gradient-to-br from-purple-50 via-white to-pink-50"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div className="text-center mb-16" variants={itemVariants}>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Built for <span className="bg-gradient-to-r from-[#7D4DFB] to-[#FF3FCE] bg-clip-text text-transparent">UK Users</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Every feature is designed specifically for the UK market, ensuring you get the most accurate and relevant reward comparisons.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <motion.div variants={itemVariants}>
              <Card className="p-6 h-full">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-[#99FF33] to-[#7D4DFB] rounded-lg flex items-center justify-center">
                    <TrendingUp className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold">Real-Time Data</h3>
                </div>
                <p className="text-muted-foreground">
                  Our platform updates reward rates in real-time across all major UK cashback platforms, ensuring you always have the latest information.
                </p>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card className="p-6 h-full">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-[#7D4DFB] to-[#FF3FCE] rounded-lg flex items-center justify-center">
                    <Shield className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold">Privacy First</h3>
                </div>
                <p className="text-muted-foreground">
                  Your personal data and shopping habits remain completely private. We never store or share your sensitive information.
                </p>
              </Card>
            </motion.div>
          </div>
        </motion.div>
      </div>

      <Footer />  {/* ✅ ADICIONAR FOOTER */}
    </>
  );
}

export default FeaturesPage;