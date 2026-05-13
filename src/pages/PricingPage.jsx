import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { Check, Sparkles, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { SubscribeButton } from '@/components/SubscribeButton';
import { useSubscription } from '@/hooks/useSubscription';

const PlanCard = ({ title, price, period, description, features, bestValue, plan, currentPlan, isActive }) => {
  const isCurrent = isActive && currentPlan === plan;
  return (
    <div
      className={`rounded-xl p-8 border-2 ${
        bestValue ? 'border-primary shadow-2xl' : 'border-border'
      } relative card-hover bg-card`}
    >
      {bestValue && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-semibold">
          Best value
        </div>
      )}
      <h3 className="text-2xl font-bold mb-2">{title}</h3>
      <p className="text-muted-foreground mb-6">{description}</p>
      <div className="mb-6">
        <span className="text-4xl font-bold">{price}</span>
        {period && (
          <span className="text-base text-muted-foreground ml-1">{period}</span>
        )}
      </div>

      <ul className="space-y-3 text-left mb-8">
        {features.map((feature, i) => (
          <li key={i} className="flex items-start">
            <Check className="w-5 h-5 mr-3 text-green-500 mt-0.5 shrink-0" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      {isCurrent ? (
        <Button disabled className="w-full text-lg h-12">
          <Check className="w-5 h-5 mr-2" />
          Current plan
        </Button>
      ) : (
        <SubscribeButton
          plan={plan}
          className={`w-full text-lg h-12 ${
            bestValue
              ? 'bg-primary text-primary-foreground'
              : 'bg-secondary text-secondary-foreground'
          }`}
        >
          {isActive ? 'Switch to this plan' : 'Start subscription'}
        </SubscribeButton>
      )}
    </div>
  );
};

function PricingPage() {
  const { isPremium, inTrial, isActive, plan, trialDaysLeft, periodDaysLeft, periodEndsAt } = useSubscription();

  const plans = {
    monthly: {
      title: 'Monthly',
      price: '£14.99',
      period: '/ month',
      plan: 'monthly',
      description: 'Per month, billed monthly. Cancel anytime.',
      features: [
        'Unlimited comparisons',
        'Real-time rate updates',
        'Personalised wallet routing',
        'Stack strategies (gift card + cashback + points)',
        '9 strategy guides (beginner to advanced)',
        'Smart alerts',
      ],
      bestValue: false,
    },
    yearly: {
      title: 'Annual',
      price: '£120',
      period: '/ year',
      plan: 'yearly',
      description: 'Per year, billed annually. Save £60 vs monthly.',
      features: [
        'Everything in Monthly',
        'Save £60 per year vs monthly',
        'Priority support',
        'Early access to new features',
        'BA Household Account setup wizard',
      ],
      bestValue: true,
    },
  };

  return (
    <>
      <Helmet>
        <title>Pricing — SnapGain</title>
      </Helmet>
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-10 space-y-3">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            Choose your <span className="gradient-text">perfect plan</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Start with a 7-day free trial. No commitments, cancel anytime.
          </p>
        </div>

        {/* Live status banner */}
        {isPremium && (
          <Card className="mb-8 max-w-3xl mx-auto bg-gradient-to-br from-light-pink/30 to-light-green/30 border-primary/30">
            <CardContent className="py-4 flex items-center justify-between gap-3 flex-wrap">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" />
                <div>
                  <p className="font-semibold">
                    {isActive
                      ? `Subscribed (${plan || 'monthly'})`
                      : `Trial: ${trialDaysLeft} day${trialDaysLeft === 1 ? '' : 's'} left`}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {isActive && periodEndsAt
                      ? `Renews ${new Date(periodEndsAt).toLocaleDateString()}${
                          periodDaysLeft ? ` · ${periodDaysLeft} days left` : ''
                        }`
                      : 'Free trial — no card needed yet.'}
                  </p>
                </div>
              </div>
              {isActive && (
                <Button asChild variant="outline" size="sm">
                  <Link to="/settings">
                    Manage <ExternalLink className="w-3.5 h-3.5 ml-1.5" />
                  </Link>
                </Button>
              )}
            </CardContent>
          </Card>
        )}

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <PlanCard
            {...plans.monthly}
            currentPlan={plan}
            isActive={isActive}
          />
          <PlanCard {...plans.yearly} currentPlan={plan} isActive={isActive} />
        </div>

        <p className="text-xs text-muted-foreground text-center mt-8 max-w-2xl mx-auto">
          Payments are securely processed by Stripe. SnapGain never stores your
          card details. You can cancel anytime from the Settings page.
        </p>
      </div>
    </>
  );
}

export default PricingPage;
