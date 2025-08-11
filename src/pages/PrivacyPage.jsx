import React from 'react';
import { Helmet } from 'react-helmet';
import { Header } from '@/components/layout/Header';   // ✅ ADICIONAR
import { Footer } from '@/components/layout/Footer';   // ✅ ADICIONAR
import { motion } from 'framer-motion';
import { Shield, Lock, Eye, Database } from 'lucide-react';

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

function PrivacyPage() {
  return (
    <>
      <Helmet>
        <title>Privacy Policy - SnapGain</title>
        <meta name="description" content="SnapGain's Privacy Policy - How we collect, use, and protect your personal data." />
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
              Privacy Policy
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Your privacy is important to us. This policy explains how we collect, use, and protect your information.
            </p>
          </motion.div>

          <motion.div className="space-y-8" variants={itemVariants}>
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-[#7D4DFB] to-[#FF3FCE] rounded-lg flex items-center justify-center flex-shrink-0">
                <Database className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-4">Information We Collect</h2>
                <p className="text-muted-foreground mb-4">
                  We collect information you provide directly to us, such as when you create an account, use our services, or contact us.
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                  <li>Account information (name, email address, password)</li>
                  <li>Profile information and preferences</li>
                  <li>Usage data and interaction with our platform</li>
                  <li>Device information and IP addresses</li>
                  <li>Cookies and similar tracking technologies</li>
                </ul>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-[#99FF33] to-[#BFFFB4] rounded-lg flex items-center justify-center flex-shrink-0">
                <Eye className="h-6 w-6 text-gray-800" />
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-4">How We Use Your Information</h2>
                <p className="text-muted-foreground mb-4">
                  We use the information we collect to provide, maintain, and improve our services:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                  <li>Provide and personalize our cashback comparison services</li>
                  <li>Send you notifications about deals and account updates</li>
                  <li>Analyze usage patterns to improve our platform</li>
                  <li>Prevent fraud and ensure platform security</li>
                  <li>Comply with legal obligations</li>
                </ul>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-[#FF3FCE] to-[#7D4DFB] rounded-lg flex items-center justify-center flex-shrink-0">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-4">Information Sharing</h2>
                <p className="text-muted-foreground mb-4">
                  We do not sell, trade, or rent your personal information to third parties. We may share information in the following circumstances:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                  <li>With your consent or at your direction</li>
                  <li>With service providers who help us operate our platform</li>
                  <li>To comply with legal requirements or protect our rights</li>
                  <li>In connection with a business transfer or acquisition</li>
                </ul>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-[#7D4DFB] to-[#FF3FCE] rounded-lg flex items-center justify-center flex-shrink-0">
                <Lock className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-4">Data Security</h2>
                <p className="text-muted-foreground mb-4">
                  We implement appropriate security measures to protect your personal information:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                  <li>Encryption of data in transit and at rest</li>
                  <li>Regular security assessments and updates</li>
                  <li>Limited access to personal information</li>
                  <li>Secure data centers and infrastructure</li>
                </ul>
              </div>
            </div>

            <div className="bg-[#FEE4F9] rounded-lg p-6 mt-8">
              <h3 className="text-xl font-bold mb-4">Your Rights</h3>
              <p className="text-muted-foreground mb-4">
                Under UK data protection laws, you have the right to:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                <li>Access your personal data</li>
                <li>Correct inaccurate information</li>
                <li>Delete your account and data</li>
                <li>Object to processing</li>
                <li>Data portability</li>
              </ul>
              <p className="text-muted-foreground mt-4">
                To exercise these rights, contact us at <a href="mailto:privacy@snapgain.uk" className="text-[#7D4DFB] hover:text-purple-800">privacy@snapgain.uk</a>.
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-6 mt-8">
              <h3 className="text-xl font-bold mb-4">Contact Information</h3>
              <p className="text-muted-foreground">
                <strong>Last Updated:</strong> January 9, 2025<br />
                <strong>Questions?</strong> Contact us at <a href="mailto:privacy@snapgain.uk" className="text-[#7D4DFB] hover:text-purple-800">privacy@snapgain.uk</a><br />
                <strong>Address:</strong> SnapGain Ltd, London, United Kingdom
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>

      <Footer />  {/* ✅ ADICIONAR FOOTER */}
    </>
  );
}

export default PrivacyPage;