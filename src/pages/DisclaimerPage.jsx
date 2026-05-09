import React from 'react';
import { Helmet } from 'react-helmet';
import { Header } from '@/components/layout/Header';   // ✅ ADICIONAR
import { Footer } from '@/components/layout/Footer';   // ✅ ADICIONAR
import { motion } from 'framer-motion';
import { AlertTriangle, Info, ExternalLink, Shield } from 'lucide-react';

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

function DisclaimerPage() {
  return (
    <>
      <Helmet>
        <title>Disclaimer - SnapGain</title>
        <meta name="description" content="SnapGain's Disclaimer - Important information about our cashback comparison service." />
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
              Disclaimer
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Important information about SnapGain's cashback comparison service and limitations.
            </p>
          </motion.div>

          <motion.div className="space-y-8" variants={itemVariants}>
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-[#FF6B6B] to-[#FF8E53] rounded-lg flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-4">Rate Accuracy</h2>
                <p className="text-muted-foreground mb-4">
                  While we strive to provide accurate and up-to-date cashback rates, SnapGain cannot guarantee the accuracy of all information displayed on our platform.
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                  <li>Rates may change without notice from cashback providers</li>
                  <li>Special terms and conditions may apply to specific offers</li>
                  <li>Some rates may be personalized or location-specific</li>
                  <li>Promotional rates may have limited time availability</li>
                </ul>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-[#7D4DFB] to-[#FF3FCE] rounded-lg flex items-center justify-center flex-shrink-0">
                <ExternalLink className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-4">Third-Party Relationships</h2>
                <p className="text-muted-foreground mb-4">
                  SnapGain is not affiliated with or endorsed by any of the cashback platforms, retailers, or financial institutions mentioned on our website.
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                  <li>We are an independent comparison service</li>
                  <li>We may earn commissions through affiliate partnerships</li>
                  <li>Our recommendations are based on publicly available data</li>
                  <li>We do not control third-party website functionality</li>
                </ul>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-[#99FF33] to-[#BFFFB4] rounded-lg flex items-center justify-center flex-shrink-0">
                <Info className="h-6 w-6 text-gray-800" />
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-4">Financial Advice</h2>
                <p className="text-muted-foreground mb-4">
                  SnapGain provides information for comparison purposes only and does not constitute financial advice.
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                  <li>Always read the terms and conditions of cashback providers</li>
                  <li>Consider your personal financial situation</li>
                  <li>Past performance does not guarantee future results</li>
                  <li>Consult with financial advisors for investment decisions</li>
                </ul>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-[#FF3FCE] to-[#7D4DFB] rounded-lg flex items-center justify-center flex-shrink-0">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-4">Limitation of Liability</h2>
                <p className="text-muted-foreground mb-4">
                  SnapGain shall not be liable for any direct, indirect, incidental, or consequential damages arising from:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                  <li>Use of information on our platform</li>
                  <li>Inability to access cashback through third parties</li>
                  <li>Changes in cashback rates or terms</li>
                  <li>Technical issues with external websites</li>
                  <li>Loss of potential earnings or savings</li>
                </ul>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mt-8">
              <h3 className="text-xl font-bold mb-4 text-yellow-800">Important Reminder</h3>
              <p className="text-yellow-700 mb-4">
                <strong>Always verify cashback rates and terms directly with the cashback provider before making any purchase.</strong>
              </p>
              <p className="text-yellow-700">
                SnapGain is a tool to help you compare options, but the final responsibility for verifying terms and earning cashback lies with you and the cashback provider.
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-6 mt-8">
              <h3 className="text-xl font-bold mb-4">Contact Information</h3>
              <p className="text-muted-foreground">
                <strong>Last Updated:</strong> January 9, 2025<br />
                <strong>Questions about this disclaimer?</strong> Contact us at <a href="mailto:legal@snapgain.uk" className="text-[#7D4DFB] hover:text-purple-800">legal@snapgain.uk</a><br />
                <strong>Company:</strong> SnapGain Ltd, London, United Kingdom
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>

      <Footer />  {/* ✅ ADICIONAR FOOTER */}
    </>
  );
}

export default DisclaimerPage;