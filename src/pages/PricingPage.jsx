import React from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';

const PlanCard = ({ title, price, description, features, bestValue, onSelect }) => (
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
            onClick={onSelect}
            className={`w-full text-lg h-12 ${bestValue ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'}`}
        >
            Get Started
        </Button>
    </div>
);

function PricingPage() {
  const navigate = useNavigate();
  const handleSubscribe = () => navigate('/auth/signup');

  const plans = {
      monthly: {
          title: 'Monthly',
          price: '£7.99',
          description: 'Per month, billed monthly.',
          features: ['Unlimited comparisons', 'Real-time data', 'Personalized alerts', 'Cancel anytime'],
          bestValue: false
      },
      annual: {
          title: 'Annual',
          price: '£60',
          description: 'Per year, billed annually.',
          features: ['All monthly features', 'Save over 40% (£35+)', 'Priority support'],
          bestValue: true
      }
  };

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
            Start with a 7-day free trial. No commitments, cancel anytime. Unlock the full power of SnapGain today.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <PlanCard {...plans.monthly} onSelect={handleSubscribe} />
          <PlanCard {...plans.annual} onSelect={handleSubscribe} />
        </div>
      </div>
    </>
  );
}

export default PricingPage;