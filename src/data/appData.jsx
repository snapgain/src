import { TrendingUp, Filter, Clock } from 'lucide-react';
import React from 'react';

export const stores = [
  { id: 'amazon', name: 'Amazon', logo: '🛒', isFavourite: true },
  { id: 'tesco', name: 'Tesco', logo: '🛍️', isFavourite: true },
  { id: 'john-lewis', name: 'John Lewis', logo: '🏪', isFavourite: false },
  { id: 'argos', name: 'Argos', logo: '📦', isFavourite: false },
  { id: 'currys', name: 'Currys', logo: '💻', isFavourite: true },
  { id: 'boots', name: 'Boots', logo: '💊', isFavourite: false },
  { id: 'waitrose', name: 'Waitrose', logo: '🍏', isFavourite: false },
  { id: 'sainsburys', name: 'Sainsbury\'s', logo: '🍊', isFavourite: false },
];

export const rewardOptions = [
  {
    id: 'topcashback',
    name: 'TopCashback',
    type: 'cashback',
    rate: '4.5%',
    amount: 4.50,
    icon: '💰',
    description: '4.5% cashback',
    clickCollect: true,
    affiliateLink: 'https://www.topcashback.co.uk/ref/snapgain'
  },
  {
    id: 'quidco',
    name: 'Quidco',
    type: 'cashback',
    rate: '3.8%',
    amount: 3.80,
    icon: '💳',
    description: '3.8% cashback',
    clickCollect: true,
    affiliateLink: 'https://www.quidco.com/raf/snapgain/'
  },
  {
    id: 'avios',
    name: 'Avios eStore',
    type: 'points',
    rate: '6 Avios per £1',
    amount: 600,
    icon: '✈️',
    description: '600 Avios points',
    clickCollect: false,
    affiliateLink: 'https://www.shopping.ba.com/'
  },
  {
    id: 'amex-gold',
    name: 'Amex Gold Card',
    type: 'points',
    rate: '2 pts/£',
    amount: 200,
    icon: '💎',
    description: '200 Amex Points',
    clickCollect: true,
    affiliateLink: '#'
  },
  {
    id: 'jamdoughnut',
    name: 'JamDoughnut Gift Card',
    type: 'gift-card',
    rate: '5% discount',
    amount: 5.00,
    icon: '🎁',
    description: 'Save 5% upfront',
    clickCollect: true,
    affiliateLink: 'https://jamdoughnut.com/'
  }
];

export const filterOptions = [
  { id: 'cashback', label: 'Cashback', icon: '💰' },
  { id: 'points', label: 'Points & Miles', icon: '✈️' },
  { id: 'gift-cards', label: 'Gift Cards', icon: '🎁' }
];

export const features = [
  {
    icon: <TrendingUp />,
    title: "Real-Time Comparison",
    description: "Instantly compare cashback, points, and gift cards to find the best value for your purchase."
  },
  {
    icon: <Filter />,
    title: "Personalized Strategy",
    description: "Get step-by-step strategies based on the banks, cards, and loyalty programs you actually use."
  },
  {
    icon: <Clock />,
    title: "Maximize Every Penny",
    description: "Our smart algorithm calculates the optimal way to pay, ensuring you never miss out on rewards."
  }
];

export const registrationOptions = {
  banks: [
    { value: 'barclays', label: 'Barclays' },
    { value: 'chase', label: 'Chase' },
    { value: 'halifax', label: 'Halifax' },
    { value: 'hsbc', label: 'HSBC' },
    { value: 'lloyds', label: 'Lloyds' },
    { value: 'monzo', label: 'Monzo' },
    { value: 'natwest', label: 'NatWest' },
    { value: 'revolut', label: 'Revolut' },
    { value: 'santander', label: 'Santander' },
    { value: 'starling', label: 'Starling' },
  ],
  cards: [
    { value: 'amex-gold', label: 'Amex Gold' },
    { value: 'amex-platinum', label: 'Amex Platinum' },
    { value: 'barclays-avios', label: 'Barclays Avios' },
    { value: 'virgin-atlantic-reward', label: 'Virgin Atlantic Reward' },
  ],
  programmes: [
    { value: 'avios', label: 'Avios' },
    { value: 'nectar', label: 'Nectar' },
    { value: 'clubcard', label: 'Tesco Clubcard' },
    { value: 'virgin-red', label: 'Virgin Red' },
  ],
  favourites: [
    { value: 'amazon', label: 'Amazon' },
    { value: 'tesco', label: 'Tesco' },
    { value: 'sainsburys', label: 'Sainsbury\'s' },
    { value: 'john-lewis', label: 'John Lewis' },
    { value: 'waitrose', label: 'Waitrose' },
  ]
};

export const cashbackPlatforms = [
    { value: 'topcashback', label: 'TopCashback' },
    { value: 'quidco', label: 'Quidco' },
    { value: 'jamdoughnut', label: 'JamDoughnut' },
    { value: 'airtime-rewards', label: 'Airtime Rewards' },
    { value: 'cheddar', label: 'Cheddar' },
    { value: 'curve', label: 'Curve' },
    { value: 'virgin-red', label: 'Virgin Red' },
];