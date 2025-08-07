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
    { value: 'lloyds', label: 'Lloyds Bank' },
    { value: 'hsbc', label: 'HSBC UK' },
    { value: 'natwest', label: 'NatWest' },
    { value: 'santander', label: 'Santander UK' },
    { value: 'halifax', label: 'Halifax' },
    { value: 'nationwide', label: 'Nationwide Building Society' },
    { value: 'monzo', label: 'Monzo' },
    { value: 'starling', label: 'Starling Bank' },
    { value: 'revolut', label: 'Revolut' },
    { value: 'rbs', label: 'Royal Bank of Scotland' },
    { value: 'virgin-money', label: 'Virgin Money' },
    { value: 'metro-bank', label: 'Metro Bank' },
    { value: 'tesco-bank', label: 'Tesco Bank' },
    { value: 'first-direct', label: 'First Direct' },
    { value: 'co-op-bank', label: 'The Co-operative Bank' },
    { value: 'tsb', label: 'TSB Bank' },
    { value: 'charter-savings', label: 'Charter Savings Bank' },
    { value: 'atom-bank', label: 'Atom Bank' },
    { value: 'cynergy-bank', label: 'Cynergy Bank' },
  ],
  cards: [
    { value: 'amex-platinum', label: 'American Express Platinum Card' },
    { value: 'amex-gold', label: 'American Express Gold Card' },
    { value: 'ba-premium-plus', label: 'British Airways Premium Plus Credit Card' },
    { value: 'ba-amex', label: 'British Airways American Express Credit Card' },
    { value: 'virgin-atlantic-reward', label: 'Virgin Atlantic Reward Credit Card' },
    { value: 'barclays-platinum-cashback', label: 'Barclays Platinum Cashback Credit Card' },
    { value: 'halifax-clarity', label: 'Halifax Clarity Credit Card' },
    { value: 'tesco-clubcard', label: 'Tesco Clubcard Credit Card' },
    { value: 'marks-spencer', label: 'M&S Credit Card' },
    { value: 'john-lewis-partnership', label: 'John Lewis Partnership Credit Card' },
  ],
  programmes: [
    { value: 'topcashback', label: 'TopCashback' },
    { value: 'quidco', label: 'Quidco' },
    { value: 'jamdoughnut', label: 'Jam Doughnut' },
    { value: 'airtime-rewards', label: 'Airtime Rewards' },
    { value: 'honey', label: 'Honey (PayPal)' },
    { value: 'ba-estore', label: 'British Airways eStore' },
    { value: 'virgin-red', label: 'Virgin Red' },
    { value: 'nectar', label: 'Nectar (Sainsbury\'s)' },
    { value: 'tesco-clubcard-loyalty', label: 'Tesco Clubcard' },
    { value: 'boots-advantage', label: 'Boots Advantage Card' },
    { value: 'giftcloud', label: 'GiftCloud' },
    { value: 'zeek', label: 'Zeek' },
    { value: 'cardyard', label: 'Cardyard' },
    { value: 'curve-cashback', label: 'Curve Cashback' },
    { value: 'zilch', label: 'Zilch' },
    { value: 'plutus', label: 'Plutus' },
    { value: 'lemoney', label: 'Lemoney' },
    { value: 'cashback-earned', label: 'Cashback Earned' },
  ],
  favourites: [
    { value: 'amazon-uk', label: 'Amazon UK' },
    { value: 'john-lewis', label: 'John Lewis' },
    { value: 'currys', label: 'Currys' },
    { value: 'argos', label: 'Argos' },
    { value: 'very', label: 'Very' },
    { value: 'tesco', label: 'Tesco' },
    { value: 'sainsburys', label: 'Sainsbury\'s' },
    { value: 'waitrose', label: 'Waitrose' },
    { value: 'boots', label: 'Boots' },
    { value: 'marks-spencer-store', label: 'Marks & Spencer' },
    { value: 'next', label: 'Next' },
    { value: 'asos', label: 'ASOS' },
    { value: 'h-and-m', label: 'H&M' },
    { value: 'zara', label: 'Zara' },
    { value: 'primark', label: 'Primark' },
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