import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';
import StripePayment from '@/components/payment/StripePayment';
import { useAuth } from '@/contexts/AuthContext';

const PlanCard = ({ title, price, priceValue, description, features, bestValue, onSelect, billingCycle }) => (
    <div className={`rounded-xl p-8 border-2 ${bestValue ? 'border-primary shadow-2xl' : 'border-border'} relative card-hover bg-white`}>
        {bestValue && (
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-semibold">
                Best Value
            </div>
        )}
        <h3 className="text-2xl font-bold mb-2">{title}</h3>
        <p className="text-muted-foreground mb-6">{description}</p>
        <div className="text-4xl font-bold mb-6">{price}</div>
        
        <ul className="space-y-3 text-left mb-8">
            {features.map((feature, i) => (
                <li key={i} className="flex items-center">
                    <Check className="w-5 h-5 mr-3 text-green-500" />
                    <span>{feature}</span>
                </li>
            ))}
        </ul>
        
        <Button
            onClick={() => onSelect({ title, priceValue, billingCycle, type: 'premium' })}
            className={`w-full text-lg h-12 ${bestValue ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'}`}
        >
            Get Started
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
      monthly: {
          title: 'Monthly Plan',
          price: '£7.99/month',
          priceValue: 7.99,
          billingCycle: 'monthly',
          description: 'Per month, billed monthly.',
          features: [
            'Unlimited comparisons', 
            'Real-time cashback rates', 
            'Personalized alerts', 
            'Priority customer support',
            'Cancel anytime'
          ],
          bestValue: false
      },
      annual: {
          title: 'Annual Plan',
          price: '£59.99/year',
          priceValue: 59.99,
          billingCycle: 'annual',
          description: 'Per year, billed annually.',
          features: [
            'All monthly features', 
            'Save over 37% (£36+ savings)', 
            'Priority support',
            'Advanced analytics',
            'API access',
            'Custom notifications'
          ],
          bestValue: true
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
        
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
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