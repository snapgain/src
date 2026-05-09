import React from 'react';
import { Helmet } from 'react-helmet';
import { Header } from '@/components/layout/Header';   // ✅ ADICIONAR
import { Footer } from '@/components/layout/Footer';   // ✅ ADICIONAR
import { motion } from 'framer-motion';
import { Clock, AlertCircle, Zap } from 'lucide-react';

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

function RealTimePolicyPage() {
  return (
    <>
      <Helmet>
        <title>Real Time Policy - SnapGain</title>
        <meta name="description" content="SnapGain's Real Time Policy - How we update and maintain accurate cashback rates." />
      </Helmet>
      
       <Header />  {/* ✅ ADICIONAR HEADER */}

      <div className="container mx-auto px-4 py-12 pt-32">
        <motion.div 
          className="max-w-4xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div className="text-center mb-16" variants={itemVariants}>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Real Time Policy
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              How SnapGain maintains accurate, up-to-date cashback rates and reward information across all UK platforms.
            </p>
          </motion.div>

          <motion.div className="space-y-8" variants={itemVariants}>
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-[#7D4DFB] to-[#FF3FCE] rounded-lg flex items-center justify-center flex-shrink-0">
                <Clock className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-4">Rate Update Frequency</h2>
                <p className="text-muted-foreground mb-4">
                  SnapGain updates cashback rates and promotional offers in real-time across all supported UK platforms. Our automated systems check for changes every 15 minutes during business hours and hourly during off-peak times.
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                  <li>Major platforms (TopCashback, Quidco): Every 15 minutes</li>
                  <li>Credit card programs (Amex, BA): Every 30 minutes</li>
                  <li>Promotional rates: Immediate updates when detected</li>
                  <li>Special offers: Real-time notifications</li>
                </ul>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-[#99FF33] to-[#BFFFB4] rounded-lg flex items-center justify-center flex-shrink-0">
                <Zap className="h-6 w-6 text-gray-800" />
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-4">Data Sources</h2>
                <p className="text-muted-foreground mb-4">
                  We aggregate data from multiple sources to ensure accuracy and completeness:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                  <li>Official platform APIs where available</li>
                  <li>Affiliate network data feeds</li>
                  <li>Public promotional pages and announcements</li>
                  <li>User-reported offers (verified before publication)</li>
                  <li>Direct partnerships with select retailers</li>
                </ul>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-[#FF3FCE] to-[#7D4DFB] rounded-lg flex items-center justify-center flex-shrink-0">
                <AlertCircle className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-4">Accuracy Disclaimer</h2>
                <p className="text-muted-foreground mb-4">
                  While we strive for 100% accuracy, cashback rates can change without notice. SnapGain is not responsible for:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                  <li>Rate changes that occur after you make a purchase</li>
                  <li>Platform-specific terms and conditions</li>
                  <li>Temporary technical issues affecting rate display</li>
                  <li>Regional or user-specific rate variations</li>
                </ul>
                <p className="text-muted-foreground mt-4">
                  <strong>Always verify rates directly with the cashback platform before making purchases.</strong>
                </p>
              </div>
            </div>

            <div className="bg-[#FEE4F9] rounded-lg p-6 mt-8">
              <h3 className="text-xl font-bold mb-4">Last Updated: January 9, 2025</h3>
              <p className="text-muted-foreground">
                This Real Time Policy is subject to change. We will notify users of significant updates through our platform and email communications. For questions about our data accuracy or update processes, contact us at <a href="mailto:support@snapgain.uk" className="text-[#7D4DFB] hover:text-purple-800">support@snapgain.uk</a>.
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>

      <Footer />  {/* ✅ ADICIONAR FOOTER */}
    </>
  );
}

export default RealTimePolicyPage;
