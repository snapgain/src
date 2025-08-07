import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Star, Clock, ChevronRight } from "lucide-react";

const RewardCard = ({ 
  platform, 
  reward, 
  description, 
  isBest, 
  affiliateLink, 
  strategy, 
  canCollectSameDay, 
  onGoToPlatform 
}) => {
  return (
    <Card className={`relative ${isBest ? 'border-2 border-[#7D4DFB] bg-gradient-to-r from-[#7D4DFB]/5 to-[#FF3FCE]/5' : 'border border-gray-200'} transition-all hover:shadow-lg`}>
      {isBest && (
        <div className="absolute -top-3 left-4">
          <Badge className="bg-gradient-to-r from-[#7D4DFB] to-[#FF3FCE] text-white px-3 py-1 rounded-full">
            <Star className="w-3 h-3 mr-1" />
            Melhor Opção
          </Badge>
        </div>
      )}
      
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <span className="text-lg font-bold text-gray-900">{platform}</span>
          <span className="text-xl font-bold text-[#7D4DFB]">{reward}</span>
        </CardTitle>
        <p className="text-sm text-gray-600">{description}</p>
        {canCollectSameDay && (
          <div className="flex items-center text-green-600 text-sm">
            <Clock className="w-4 h-4 mr-1" />
            Disponível no mesmo dia
          </div>
        )}
      </CardHeader>
      
      <CardContent className="pt-0">
        {strategy && strategy.length > 0 && (
          <div className="mb-4">
            <h4 className="font-semibold text-gray-900 mb-2">Como proceder:</h4>
            <ol className="space-y-1">
              {strategy.map((step, index) => (
                <li key={index} className="flex items-start text-sm text-gray-600">
                  <span className="flex-shrink-0 w-5 h-5 bg-[#7D4DFB] text-white rounded-full flex items-center justify-center text-xs mr-2 mt-0.5">
                    {index + 1}
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </div>
        )}
        
        <Button
          onClick={() => onGoToPlatform(affiliateLink)}
          className="w-full bg-gradient-to-r from-[#7D4DFB] to-[#FF3FCE] hover:from-[#7D4DFB]/90 hover:to-[#FF3FCE]/90 text-white font-semibold"
        >
          <ExternalLink className="w-4 h-4 mr-2" />
          Ir para {platform}
          <ChevronRight className="w-4 h-4 ml-2" />
        </Button>
      </CardContent>
    </Card>
  );
};

export default RewardCard;
