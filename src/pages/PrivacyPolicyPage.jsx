import React from 'react';
import { Helmet } from 'react-helmet';

function PrivacyPolicyPage() {
  return (
    <>
      <Helmet>
        <title>Privacy Policy - SnapGain</title>
      </Helmet>
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto prose lg:prose-xl">
          <h1>Privacy Policy</h1>
          <p className="text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>
          
          <h2>Introduction</h2>
          <p>SnapGain ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our application. We are compliant with the General Data Protection Regulation (GDPR) and UK data protection laws.</p>

          <h2>Information We Collect</h2>
          <p>We may collect information about you in a variety of ways. The information we may collect includes:</p>
          <ul>
            <li><strong>Personal Data:</strong> Personally identifiable information, such as your name and email address, that you voluntarily give to us when you register with the application.</li>
            <li><strong>Preference Data:</strong> Information you provide about your preferred banks, loyalty programs, and credit cards to personalize your experience. This data is optional and used solely for tailoring reward strategies.</li>
          </ul>

          <h2>Use of Your Information</h2>
          <p>Having accurate information about you permits us to provide you with a smooth, efficient, and customized experience. Specifically, we may use information collected about you to:</p>
          <ul>
            <li>Create and manage your account.</li>
            <li>Personalize and improve your experience.</li>
            <li>Monitor and analyze usage and trends to improve your experience with the application.</li>
          </ul>

          <h2>Affiliate Links and Tracking</h2>
          <p>Our service uses affiliate links to redirect you to partner platforms (e.g., cashback sites, loyalty programs). When you click on these links, a cookie may be placed on your device to track the referral. This is necessary for us to earn a commission from our partners, which helps us keep SnapGain running. We do not receive any personal purchase data from these transactions.</p>

          <h2>Disclaimer</h2>
          <p>SnapGain is an independent service and is not an official partner of any of the platforms featured. We utilize publicly available information, APIs, or data from affiliate partners to provide our comparisons. While we strive for accuracy, we cannot guarantee the rates and offers provided by third-party platforms.</p>

          <h2>Data Protection</h2>
          <p>We use administrative, technical, and physical security measures to help protect your personal information. While we have taken reasonable steps to secure the personal information you provide to us, please be aware that despite our efforts, no security measures are perfect or impenetrable.</p>
        </div>
      </div>
    </>
  );
}

export default PrivacyPolicyPage;