import React from 'react';
import { Helmet } from 'react-helmet';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

function AboutPage() {
  const navigate = useNavigate();
  return (
    <>
      <Helmet>
        <title>About Us - SnapGain</title>
      </Helmet>
      <div className="bg-light-pink">
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Our Mission: <span className="gradient-text">Smarter Savings for Everyone</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            We believe that everyone deserves to get the most out of their money. SnapGain was born from a simple idea: make it easy to see the best way to pay for anything, anytime.
          </p>
        </div>
      </div>
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto prose lg:prose-xl">
          <h2>The SnapGain Story</h2>
          <p>
            In a world filled with countless loyalty programs, cashback offers, and credit card points, it's become incredibly complex to know if you're truly getting the best deal. Are you better off getting 5% cashback, or earning 10 Avios per pound? Should you buy a discounted gift card first? These questions used to require spreadsheets, multiple browser tabs, and a lot of guesswork.
          </p>
          <p>
            We decided to change that.
          </p>
          <p>
            <strong>SnapGain is your personal rewards strategist.</strong> Our powerful platform does the heavy lifting for you, running real-time calculations across hundreds of partners to show you the single best strategy to maximize your return on every single purchase. We consolidate offers from cashback sites, airline loyalty programs, bank rewards, and gift card platforms into one simple, actionable recommendation.
          </p>
          <h2>Our Commitment</h2>
          <p>
            Our goal is to empower you to make faster, smarter financial decisions. We are committed to providing transparent, accurate, and up-to-the-minute data to help you save money and earn more rewards than you ever thought possible.
          </p>
          <div className="text-center mt-12">
            <Button size="lg" onClick={() => navigate('/auth/signup')}>Join SnapGain Today</Button>
          </div>
        </div>
      </div>
    </>
  );
}

export default AboutPage;