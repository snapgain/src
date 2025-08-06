import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, Check, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useSubscriptionHandler } from '@/hooks/useEdgeFunctions';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/components/ui/use-toast';

const subscriptionPlans = [
  {
    id: 'premium',
    name: 'Premium',
    price: 9.99,
    features: [
      'Comparações ilimitadas',
      'Alerts de ofertas em tempo real',
      'Suporte prioritário',
      'Relatórios avançados'
    ]
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 19.99,
    features: [
      'Tudo do Premium',
      'API Access',
      'Integração com bancos',
      'Analytics avançados',
      'Consultoria personalizada'
    ]
  }
];

export function SubscriptionManager() {
  const { user } = useAuth();
  const { handleSubscription, loading } = useSubscriptionHandler();
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [paymentData, setPaymentData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: ''
  });
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedPlan) {
      toast({
        title: "Plano não selecionado",
        description: "Por favor, selecione um plano antes de continuar.",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);

    try {
      // Simular processamento de pagamento
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Processar assinatura via Edge Function
      const result = await handleSubscription(selectedPlan.id, {
        ...paymentData,
        amount: selectedPlan.price,
        currency: 'USD',
        paymentMethod: 'card'
      });

      toast({
        title: "Assinatura ativada!",
        description: `Bem-vindo ao plano ${selectedPlan.name}!`
      });

      // Reset form
      setSelectedPlan(null);
      setPaymentData({
        cardNumber: '',
        expiryDate: '',
        cvv: '',
        cardholderName: ''
      });

    } catch (error) {
      console.error('Erro no processamento:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleInputChange = (field, value) => {
    setPaymentData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (!user) {
    return (
      <div className="text-center p-8">
        <p>Faça login para gerenciar sua assinatura.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2">Escolha seu Plano</h1>
        <p className="text-muted-foreground">
          Desbloqueie todo o potencial da nossa plataforma
        </p>
      </div>

      {/* Planos de Assinatura */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {subscriptionPlans.map((plan) => (
          <motion.div
            key={plan.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Card 
              className={`cursor-pointer transition-all ${
                selectedPlan?.id === plan.id 
                  ? 'ring-2 ring-primary border-primary' 
                  : 'hover:shadow-lg'
              }`}
              onClick={() => setSelectedPlan(plan)}
            >
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  <span>{plan.name}</span>
                  <span className="text-2xl font-bold">${plan.price}/mês</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <Check className="h-4 w-4 text-green-500 mr-2" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                {selectedPlan?.id === plan.id && (
                  <div className="mt-4 p-3 bg-primary/10 rounded-lg">
                    <p className="text-sm text-primary font-medium">
                      ✓ Plano selecionado
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Formulário de Pagamento */}
      {selectedPlan && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CreditCard className="h-5 w-5 mr-2" />
                Informações de Pagamento
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePaymentSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="cardholderName">Nome no Cartão</Label>
                  <Input
                    id="cardholderName"
                    value={paymentData.cardholderName}
                    onChange={(e) => handleInputChange('cardholderName', e.target.value)}
                    placeholder="João Silva"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="cardNumber">Número do Cartão</Label>
                  <Input
                    id="cardNumber"
                    value={paymentData.cardNumber}
                    onChange={(e) => handleInputChange('cardNumber', e.target.value)}
                    placeholder="**** **** **** ****"
                    maxLength="19"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="expiryDate">Data de Expiração</Label>
                    <Input
                      id="expiryDate"
                      value={paymentData.expiryDate}
                      onChange={(e) => handleInputChange('expiryDate', e.target.value)}
                      placeholder="MM/AA"
                      maxLength="5"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="cvv">CVV</Label>
                    <Input
                      id="cvv"
                      value={paymentData.cvv}
                      onChange={(e) => handleInputChange('cvv', e.target.value)}
                      placeholder="***"
                      maxLength="3"
                      required
                    />
                  </div>
                </div>

                <div className="pt-4">
                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={isProcessing || loading}
                  >
                    {isProcessing || loading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Processando...
                      </>
                    ) : (
                      `Assinar ${selectedPlan.name} - $${selectedPlan.price}/mês`
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
