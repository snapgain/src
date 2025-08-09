import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TrendingUp, Star, Zap, Clock } from 'lucide-react';

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
  return (
    <>
      <Helmet>
        <title>Dashboard - SnapGain</title>
        <meta name="description" content="Your SnapGain dashboard - track savings and compare cashback rates." />
      </Helmet>
      
      <div className="container mx-auto px-4 py-12 pt-32">
        <motion.div 
          className="max-w-6xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div className="mb-12" variants={itemVariants}>
            <h1 className="text-4xl font-bold mb-4">Welcome back!</h1>
            <p className="text-xl text-muted-foreground">
              Here's your cashback optimization overview
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <motion.div variants={itemVariants}>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Total Savings
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">£234.50</div>
                  <p className="text-xs text-muted-foreground">
                    +20.1% from last month
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Active Deals
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">12</div>
                  <p className="text-xs text-muted-foreground">
                    3 expiring soon
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Best Rate Today
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">5.2%</div>
                  <p className="text-xs text-muted-foreground">
                    TopCashback - Electronics
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    This Month
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">£45.20</div>
                  <p className="text-xs text-muted-foreground">
                    8 transactions tracked
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <motion.div variants={itemVariants}>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <TrendingUp className="h-5 w-5 text-[#7D4DFB]" />
                    <span>Recent Activity</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">Amazon UK</p>
                      <p className="text-sm text-muted-foreground">2.5% cashback earned</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-green-600">+£12.50</p>
                      <p className="text-xs text-muted-foreground">2 days ago</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">John Lewis</p>
                      <p className="text-sm text-muted-foreground">3.0% cashback earned</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-green-600">+£18.75</p>
                      <p className="text-xs text-muted-foreground">1 week ago</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Star className="h-5 w-5 text-[#FF3FCE]" />
                    <span>Top Opportunities</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-3 bg-gradient-to-r from-[#7D4DFB]/10 to-[#FF3FCE]/10 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-medium">Currys PC World</p>
                      <span className="text-sm font-medium text-[#7D4DFB]">4.8%</span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      Electronics sale - ends in 2 days
                    </p>
                    <Button size="sm" className="w-full">
                      Shop Now
                    </Button>
                  </div>
                  
                  <div className="p-3 bg-gradient-to-r from-[#99FF33]/10 to-[#BFFFB4]/10 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-medium">ASOS</p>
                      <span className="text-sm font-medium text-green-600">6.0%</span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      Fashion week special offer
                    </p>
                    <Button size="sm" className="w-full">
                      Shop Now
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </>
  );
}

export default DashboardPage;
