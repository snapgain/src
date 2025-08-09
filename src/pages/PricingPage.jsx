import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';
import StripePayment from '@/components/payment/StripePayment';
import { useAuth } from '@/contexts/AuthContext';

const PlanCard = ({ title, price, priceSubtext, priceValue, description, features, bestValue, onSelect, billingCycle, buttonText, buttonClass }) => (
    <div className={`rounded-xl p-8 border-2 ${bestValue ? 'border-primary shadow-2xl' : 'border-border'} relative card-hover bg-white h-full`}>
        {bestValue && (
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-semibold">
                Best Value
            </div>
        )}
        
        <div className="text-center mb-6">
            <h3 className="text-2xl font-bold mb-2">{title}</h3>
            <div className="text-3xl font-bold">
                {price}
                <span className="text-lg font-normal text-muted-foreground ml-1">{priceSubtext}</span>
            </div>
            <p className="text-sm text-muted-foreground mt-2">{description}</p>
        </div>
        
        <ul className="space-y-4 text-left mb-8">
            {features.map((feature, i) => (
                <li key={i} className="flex items-center space-x-3">
                    <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span>{feature}</span>
                </li>
            ))}
        </ul>
        
        <Button
            onClick={() => onSelect({ title, priceValue, billingCycle, type: billingCycle === 'trial' ? 'trial' : 'premium' })}
            className={buttonClass}
        >
            {buttonText}
        </Button>
    </div>
);

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

  const plans = {
      freeTrial: {
          title: 'Free Trial',
          price: '£0',
          priceSubtext: '3 days',
          priceValue: 0,
          billingCycle: 'trial',
          description: 'Try SnapGain for free with no commitment.',
          features: [
              'Unlimited reward comparisons',
              'Access to all UK platforms', 
              'Real-time rate updates',
              'Personalized Strategies'
          ],
          bestValue: false,
          buttonText: 'Start 3-Day Free Trial',
          buttonClass: 'w-full bg-gradient-to-r from-[#99FF33] to-[#7D4DFB] hover:from-green-500 hover:to-purple-700 text-white'
      },
      monthly: {
          title: 'Monthly Plan',
          price: '£7.99',
          priceSubtext: 'per month',
          priceValue: 7.99,
          billingCycle: 'monthly',
          description: 'Perfect for getting started with smarter rewards.',
          features: [
              'Everything in Free Trial',
              'Priority customer support', 
              'Advanced analytics',
              'Custom notifications',
              'Cancel anytime'
          ],
          bestValue: false,
          buttonText: 'Get Started',
          buttonClass: 'w-full bg-secondary text-secondary-foreground hover:bg-secondary/80'
      },
      annual: {
          title: 'Annual Plan',
          price: '£60',
          priceSubtext: 'per year',
          priceValue: 60,
          billingCycle: 'annual',
          description: 'Best value - save over 37% compared to monthly billing.',
          features: [
              'Everything in Monthly plan',
              'Save over 37% (£36+ savings)',
              'Priority support',
              'API access',
              'Advanced analytics',
              'Custom integrations'
          ],
          bestValue: true,
          buttonText: 'Get Started',
          buttonClass: 'w-full bg-primary text-primary-foreground hover:bg-primary/90'
      }
  };

  if (showPayment) {
    return (
      <>
        <Helmet>
          <title>Payment - SnapGain</title>
        </Helmet>
        <div className="container mx-auto px-4 py-16 flex justify-center">
          <StripePayment 
            plan={{ ...selectedPlan, price: selectedPlan.priceValue }}
            onSuccess={handlePaymentSuccess}
            onCancel={handlePaymentCancel}
          />
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Pricing - SnapGain</title>
      </Helmet>
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Choose Your <span className="gradient-text">Perfect Plan</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Start with a 3-day free trial. No commitments, cancel anytime. Unlock the full power of SnapGain today.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <PlanCard {...plans.freeTrial} onSelect={handleSubscribe} />
          <PlanCard {...plans.monthly} onSelect={handleSubscribe} />
          <PlanCard {...plans.annual} onSelect={handleSubscribe} />
        </div>
        
        <div className="text-center mt-12">
          <p className="text-sm text-muted-foreground mb-4">
            💳 Secure payments powered by Stripe
          </p>
          <p className="text-sm text-muted-foreground">
            Questions? Contact us at support@snapgain.co.uk
          </p>
        </div>
      </div>
    </>
  );
}

export default PricingPage;