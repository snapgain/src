import React from 'react';
import { Helmet } from 'react-helmet';
import AviosCalculator from '@/components/comparison/AviosCalculator';

export default function AviosCalculatorPage() {
  return (
    <>
      <Helmet>
        <title>Avios Calculator - SnapGain UK</title>
        <meta name="description" content="Calculate the real value of your British Airways Avios points. Plan redemptions, check flight costs, and maximize your Avios value across UK routes." />
        <meta name="keywords" content="Avios calculator, British Airways points, BA Avios value, flight redemption calculator, UK Avios routes" />
        <meta property="og:title" content="Avios Calculator - SnapGain UK" />
        <meta property="og:description" content="Free Avios calculator for British Airways points. Calculate redemption values and plan your next flight." />
      </Helmet>
      <AviosCalculator />
    </>
  );
}
