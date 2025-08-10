import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';

export function StripePayment({ plan, onSuccess, onCancel }) {
  const handlePayment = () => {
    // Simular pagamento bem-sucedido por enquanto
    setTimeout(() => {
      onSuccess();
    }, 2000);
  };

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onCancel}
            className="p-2"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <CardTitle>Complete Payment</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-semibold">{plan.title}</h3>
          <p className="text-2xl font-bold text-[#7D4DFB]">£{plan.price}</p>
        </div>
        
        <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
          <p className="text-sm text-yellow-800">
            🚧 Payment integration coming soon! This is a demo version.
          </p>
        </div>
        
        <div className="space-y-2">
          <Button 
            onClick={handlePayment}
            className="w-full bg-gradient-to-r from-[#7D4DFB] to-[#FF3FCE] hover:from-purple-700 hover:to-pink-600"
          >
            Continue to Dashboard (Demo)
          </Button>
          
          <Button 
            variant="outline"
            onClick={onCancel}
            className="w-full"
          >
            Cancel
          </Button>
        </div>
        
        <p className="text-xs text-gray-500 text-center">
          Real Stripe integration will be implemented in production.
        </p>
      </CardContent>
    </Card>
  );
}