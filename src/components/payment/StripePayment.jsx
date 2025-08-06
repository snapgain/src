import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  CardElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { Check, CreditCard, Loader2 } from 'lucide-react';

// Chave pública do Stripe (substitua pela sua chave real)
const stripePromise = loadStripe('pk_test_51234567890abcdef...');

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      color: '#424770',
      fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
      fontSmoothing: 'antialiased',
      fontSize: '16px',
      '::placeholder': {
        color: '#aab7c4'
      }
    },
    invalid: {
      color: '#9e2146',
      iconColor: '#9e2146'
    }
  }
};

function CheckoutForm({ plan, onSuccess }) {
  const stripe = useStripe();
  const elements = useElements();
  const { user, updateSubscription } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);
    setIsProcessing(true);

    const cardElement = elements.getElement(CardElement);

    try {
      // Simular pagamento (em produção, você criaria um PaymentIntent no backend)
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
        billing_details: {
          name: user?.name || 'Customer',
          email: user?.email || '',
        },
      });

      if (error) {
        console.error('Payment error:', error);
        toast({
          title: "Payment Failed",
          description: error.message,
          variant: "destructive"
        });
      } else {
        // Simular sucesso do pagamento
        console.log('PaymentMethod created:', paymentMethod);
        
        // Atualizar subscription do usuário
        updateSubscription('premium');
        
        toast({
          title: "Payment Successful!",
          description: `Welcome to SnapGain ${plan.name}!`,
        });
        
        onSuccess();
      }
    } catch (err) {
      console.error('Payment processing error:', err);
      toast({
        title: "Payment Error",
        description: "Something went wrong processing your payment.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="p-4 border rounded-lg bg-gray-50">
        <CardElement options={CARD_ELEMENT_OPTIONS} />
      </div>
      
      <Button 
        type="submit" 
        disabled={!stripe || isLoading}
        className="w-full bg-primary hover:bg-primary/90"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing...
          </>
        ) : (
          <>
            <CreditCard className="mr-2 h-4 w-4" />
            Pay £{plan.price}/month
          </>
        )}
      </Button>
      
      <p className="text-xs text-gray-500 text-center">
        Secure payment powered by Stripe. Cancel anytime.
      </p>
    </form>
  );
}

export function StripePayment({ plan, onSuccess, onCancel }) {
  const [showForm, setShowForm] = useState(false);

  const planFeatures = {
    premium: [
      'Unlimited comparisons',
      'Real-time rate alerts',
      'Advanced analytics',
      'Priority support',
      'API access',
      'Custom notifications'
    ]
  };

  if (!showForm) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">
            Upgrade to {plan.name}
          </CardTitle>
          <div className="text-center">
            <span className="text-3xl font-bold">£{plan.price}</span>
            <span className="text-gray-500">/month</span>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            {planFeatures[plan.type]?.map((feature, index) => (
              <div key={index} className="flex items-center space-x-2">
                <Check className="h-4 w-4 text-green-500" />
                <span className="text-sm">{feature}</span>
              </div>
            ))}
          </div>
          
          <div className="space-y-2">
            <Button 
              onClick={() => setShowForm(true)}
              className="w-full bg-primary hover:bg-primary/90"
            >
              <CreditCard className="mr-2 h-4 w-4" />
              Subscribe Now
            </Button>
            <Button 
              variant="outline" 
              onClick={onCancel}
              className="w-full"
            >
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Elements stripe={stripePromise}>
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">
            Payment Details
          </CardTitle>
          <div className="text-center">
            <span className="text-lg font-semibold">{plan.name}</span>
            <span className="text-gray-500"> - £{plan.price}/month</span>
          </div>
        </CardHeader>
        <CardContent>
          <CheckoutForm plan={plan} onSuccess={onSuccess} />
          <Button 
            variant="outline" 
            onClick={() => setShowForm(false)}
            className="w-full mt-4"
          >
            Back
          </Button>
        </CardContent>
      </Card>
    </Elements>
  );
}

export default StripePayment;
