import React from 'react';
import RewardCard from '../rewards/RewardCard';

export function ComparisonResults({ results, selectedStore, purchaseAmount, onGoToPlatform }) {
  if (!results || results.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Nenhum resultado encontrado.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-6">
      {results.map((result, index) => (
        <RewardCard
          key={index}
          platform={result.platform}
          reward={result.reward}
          description={result.description}
          isBest={result.isBest}
          affiliateLink={result.affiliateLink}
          strategy={result.strategy}
          canCollectSameDay={result.canCollectSameDay}
          onGoToPlatform={onGoToPlatform}
        />
      ))}
    </div>
  );
}
