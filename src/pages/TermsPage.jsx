import React from 'react';
import { Helmet } from 'react-helmet';
import { Header } from '@/components/layout/Header';   // ✅ ADICIONAR
import { Footer } from '@/components/layout/Footer';   // ✅ ADICIONAR
import { motion } from 'framer-motion';
import { FileText, AlertCircle, CheckCircle, XCircle } from 'lucide-react';

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

function TermsPage() {
  return (
    <>
      <Helmet>
        <title>Terms of Service - SnapGain</title>
        <meta name="description" content="SnapGain's Terms of Service - Rules and guidelines for using our cashback comparison platform." />
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
              Terms of Service
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              These terms govern your use of SnapGain's cashback comparison services.
            </p>
          </motion.div>

          <motion.div className="space-y-8" variants={itemVariants}>
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-[#7D4DFB] to-[#FF3FCE] rounded-lg flex items-center justify-center flex-shrink-0">
                <FileText className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-4">Acceptance of Terms</h2>
                <p className="text-muted-foreground mb-4">
                  By accessing and using SnapGain, you accept and agree to be bound by the terms and provision of this agreement.
                </p>
                <p className="text-muted-foreground">
                  If you do not agree to abide by the above, please do not use this service.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-[#99FF33] to-[#BFFFB4] rounded-lg flex items-center justify-center flex-shrink-0">
                <CheckCircle className="h-6 w-6 text-gray-800" />
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-4">Use License</h2>
                <p className="text-muted-foreground mb-4">
                  Permission is granted to temporarily use SnapGain for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                  <li>Modify or copy the materials</li>
                  <li>Use the materials for any commercial purpose</li>
                  <li>Attempt to reverse engineer any software</li>
                  <li>Remove any copyright or other proprietary notations</li>
                </ul>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-[#FF3FCE] to-[#7D4DFB] rounded-lg flex items-center justify-center flex-shrink-0">
                <AlertCircle className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-4">Disclaimer</h2>
                <p className="text-muted-foreground mb-4">
                  SnapGain is a comparison service. We are not responsible for:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                  <li>Accuracy of cashback rates from third-party platforms</li>
                  <li>Changes in rates after you make a purchase</li>
                  <li>Third-party platform policies and procedures</li>
                  <li>Payment processing or cashback tracking by external providers</li>
                  <li>Technical issues with affiliate partner websites</li>
                </ul>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-[#7D4DFB] to-[#FF3FCE] rounded-lg flex items-center justify-center flex-shrink-0">
                <XCircle className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-4">Limitations</h2>
                <p className="text-muted-foreground mb-4">
                  In no event shall SnapGain or its suppliers be liable for any damages arising out of the use or inability to use the materials on SnapGain's website.
                </p>
                <p className="text-muted-foreground">
                  Because some jurisdictions do not allow limitations on implied warranties, or limitations of liability for consequential or incidental damages, these limitations may not apply to you.
                </p>
              </div>
            </div>

            <div className="bg-[#FEE4F9] rounded-lg p-6 mt-8">
              <h3 className="text-xl font-bold mb-4">Account Responsibilities</h3>
              <p className="text-muted-foreground mb-4">
                You are responsible for:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                <li>Maintaining the confidentiality of your account</li>
                <li>All activities that occur under your account</li>
                <li>Providing accurate and current information</li>
                <li>Complying with all applicable laws and regulations</li>
                <li>Respecting the intellectual property of others</li>
              </ul>
            </div>

            <div className="bg-gray-50 rounded-lg p-6 mt-8">
              <h3 className="text-xl font-bold mb-4">Governing Law</h3>
              <p className="text-muted-foreground">
                <strong>Last Updated:</strong> January 9, 2025<br />
                <strong>Governing Law:</strong> These terms are governed by the laws of England and Wales<br />
                <strong>Questions?</strong> Contact us at <a href="mailto:support@snapgain.uk" className="text-[#7D4DFB] hover:text-purple-800">legal@snapgain.uk</a>
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>

      <Footer />  {/* ✅ ADICIONAR FOOTER */}
    </>
  );
}

export default TermsPage;