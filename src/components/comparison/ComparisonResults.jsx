import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ExternalLink } from 'lucide-react';

export function ComparisonResults({ results, selectedStore, purchaseAmount }) {
  if (!results || results.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Nenhum resultado encontrado.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {results.map((result, index) => (
        <Card key={index} className="relative">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-lg">{result.platform}</CardTitle>
                <p className="text-sm text-gray-600">{result.cashbackRate} cashback</p>
              </div>
              <div className="text-right">
                <div className="text-xl font-bold text-green-600">
                  £{result.estimatedCashback}
                </div>
                <p className="text-sm text-gray-500">estimated cashback</p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {result.features.map((feature, idx) => (
                <Badge key={idx} variant="outline" className="mr-2 mb-2">
                  {feature}
                </Badge>
              ))}
            </div>
            <Button 
              className="w-full mt-4" 
              onClick={() => window.open(result.link, '_blank')}
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Go to {result.platform}
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
