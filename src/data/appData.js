code src/pages/LandingPage.jsx// UK-focused data for SnapGain UK
import { TrendingUp, Filter, Clock } from 'lucide-react';
import React from 'react';
import { ukBanks, ukRetailers, ukCashbackPlatforms, formatGBP } from './ukData.js';

export const stores = ukRetailers.map(retailer => ({
  id: retailer.id,
  name: retailer.name,
  logo: retailer.icon,
  isFavourite: retailer.popular,
  cashbackRate: retailer.cashbackRate,
  category: retailer.category
}));

export const rewardOptions = [
  // Primary Cashback Platforms
  {
    id: 'topcashback',
    name: 'TopCashback UK',
    type: 'cashback',
    rate: '1-8%',
    amount: 5.50,
    icon: '💰',
    description: 'Up to 8% cashback',
    clickCollect: true,
    affiliateLink: 'https://www.topcashback.co.uk/ref/snapgainuk'
  },
  {
    id: 'quidco',
    name: 'Quidco',
    type: 'cashback',
    rate: '2-6%',
    amount: 4.20,
    icon: '💳',
    description: 'UK\'s original cashback site',
    clickCollect: true,
    affiliateLink: 'https://www.quidco.com/raf/snapgainuk/'
  },
  {
    id: 'airtime-rewards',
    name: 'Airtime Rewards',
    type: 'cashback',
    rate: '0.5-10%',
    amount: 3.80,
    icon: '📱',
    description: 'Cashback credited to mobile phone bill',
    clickCollect: true,
    affiliateLink: 'https://airtimerewards.co.uk/'
  },
  {
    id: 'cashbackearners',
    name: 'Cashback Earners',
    type: 'cashback',
    rate: '1-15%',
    amount: 4.50,
    icon: '💰',
    description: 'High cashback rates for UK shoppers',
    clickCollect: true,
    affiliateLink: 'https://cashbackearners.co.uk/'
  },
  {
    id: 'easyfundraising',
    name: 'easyfundraising',
    type: 'donation',
    rate: '0.5-5%',
    amount: 2.10,
    icon: '💝',
    description: 'Raise money for charity while shopping',
    clickCollect: true,
    affiliateLink: 'https://www.easyfundraising.org.uk/'
  },
  
  // Student & Young Professional Platforms
  {
    id: 'jamdoughnut',
    name: 'JamDoughnut',
    type: 'cashback',
    rate: '4-20%',
    amount: 8.50,
    icon: '🍩',
    description: 'Student & young professional cashback',
    clickCollect: true,
    affiliateLink: 'https://jamdoughnut.com/refer/snapgainuk',
    targetAudience: 'Students & Young Professionals'
  },
  {
    id: 'unidays',
    name: 'UNiDAYS',
    type: 'discount',
    rate: '5-50%',
    amount: 12.00,
    icon: '🎓',
    description: 'Student discounts and offers',
    clickCollect: false,
    affiliateLink: 'https://www.myunidays.com/',
    targetAudience: 'Students'
  },
  {
    id: 'studentbeans',
    name: 'Student Beans',
    type: 'discount',
    rate: '10-30%',
    amount: 8.75,
    icon: '📚',
    description: 'Student discounts on popular brands',
    clickCollect: false,
    affiliateLink: 'https://www.studentbeans.com/',
    targetAudience: 'Students'
  },

  // Airline & Travel Points
  {
    id: 'avios',
    name: 'British Airways eStore',
    type: 'points',
    rate: '1-6 Avios per £1',
    amount: 450,
    icon: '✈️',
    description: 'BA Avios points',
    clickCollect: false,
    affiliateLink: 'https://www.shopping.ba.com/'
  },
  {
    id: 'virgin-atlantic-shop',
    name: 'Virgin Atlantic Red Shop',
    type: 'points',
    rate: '1-4 miles per £1',
    amount: 320,
    icon: '🔴',
    description: 'Virgin Flying Club miles',
    clickCollect: false,
    affiliateLink: 'https://www.virgin-atlantic-shop.com/'
  },
  {
    id: 'emirates-skywards',
    name: 'Emirates Skywards Shop',
    type: 'points',
    rate: '1-3 miles per £1',
    amount: 280,
    icon: '🦅',
    description: 'Emirates Skywards miles',
    clickCollect: false,
    affiliateLink: 'https://www.emiratesskywardsmall.com/'
  },

  // Credit Card Rewards
  {
    id: 'amex-gold',
    name: 'Amex Gold Card',
    type: 'points',
    rate: '1-2 pts/£',
    amount: 150,
    icon: '💎',
    description: 'Membership Rewards points',
    clickCollect: true,
    affiliateLink: '#'
  },
  {
    id: 'amex-platinum',
    name: 'Amex Platinum Card',
    type: 'points',
    rate: '1-3 pts/£',
    amount: 200,
    icon: '💎',
    description: 'Premium Membership Rewards',
    clickCollect: true,
    affiliateLink: '#'
  },
  {
    id: 'chase-sapphire',
    name: 'Chase Sapphire',
    type: 'points',
    rate: '1-2 pts/£',
    amount: 125,
    icon: '💳',
    description: 'Chase Ultimate Rewards',
    clickCollect: true,
    affiliateLink: '#'
  },
  {
    id: 'barclays-avios',
    name: 'Barclays Avios Plus',
    type: 'points',
    rate: '1-2 Avios/£',
    amount: 180,
    icon: '✈️',
    description: 'Direct Avios earning',
    clickCollect: true,
    affiliateLink: '#'
  },

  // Retailer Loyalty Programs
  {
    id: 'nectar',
    name: 'Sainsbury\'s Nectar',
    type: 'points',
    rate: '1-3 pts/£',
    amount: 85,
    icon: '🛒',
    description: 'Nectar points at Sainsbury\'s',
    clickCollect: true,
    affiliateLink: 'https://www.nectar.com/'
  },
  {
    id: 'clubcard',
    name: 'Tesco Clubcard',
    type: 'points',
    rate: '1-2 pts/£',
    amount: 65,
    icon: '🛍️',
    description: 'Clubcard points at Tesco',
    clickCollect: true,
    affiliateLink: 'https://www.tesco.com/clubcard/'
  },
  {
    id: 'mymarks',
    name: 'M&S Sparks',
    type: 'points',
    rate: '1 pt/£',
    amount: 45,
    icon: '🏪',
    description: 'M&S Sparks rewards',
    clickCollect: true,
    affiliateLink: 'https://sparks.marksandspencer.com/'
  },
  {
    id: 'boots-advantage',
    name: 'Boots Advantage Card',
    type: 'points',
    rate: '4 pts/£',
    amount: 120,
    icon: '💊',
    description: 'Boots Advantage points',
    clickCollect: true,
    affiliateLink: 'https://www.boots.com/advantage-card'
  },

  // Bank Cashback & Rewards
  {
    id: 'santander-cashback',
    name: 'Santander 123 Cashback',
    type: 'cashback',
    rate: '1-3%',
    amount: 4.80,
    icon: '🏦',
    description: 'Cashback on purchases',
    clickCollect: true,
    affiliateLink: '#'
  },
  {
    id: 'natwest-rewards',
    name: 'NatWest Reward Card',
    type: 'cashback',
    rate: '1-2%',
    amount: 3.20,
    icon: '🏦',
    description: 'NatWest cashback rewards',
    clickCollect: true,
    affiliateLink: '#'
  },

  // Alternative Reward Platforms
  {
    id: 'honey',
    name: 'Honey (PayPal)',
    type: 'cashback',
    rate: '1-10%',
    amount: 3.50,
    icon: '🍯',
    description: 'PayPal Honey Gold rewards',
    clickCollect: true,
    affiliateLink: 'https://www.joinhoney.com/'
  },
  {
    id: 'rakuten',
    name: 'Rakuten UK',
    type: 'cashback',
    rate: '1-15%',
    amount: 4.70,
    icon: '💰',
    description: 'Global cashback platform',
    clickCollect: true,
    affiliateLink: 'https://www.rakuten.co.uk/'
  },
  {
    id: 'shopmium',
    name: 'Shopmium',
    type: 'cashback',
    rate: '£0.50-5',
    amount: 2.80,
    icon: '📱',
    description: 'Grocery cashback app',
    clickCollect: false,
    affiliateLink: 'https://www.shopmium.com/'
  },
  {
    id: 'checkout-smart',
    name: 'CheckoutSmart',
    type: 'cashback',
    rate: '£0.25-3',
    amount: 1.95,
    icon: '✅',
    description: 'Scan receipts for cashback',
    clickCollect: false,
    affiliateLink: 'https://www.checkoutsmart.com/'
  },

  // Gift Card & Voucher Platforms
  {
    id: 'tesco-clubcard-boost',
    name: 'Clubcard Boost',
    type: 'gift-cards',
    rate: '2x value',
    amount: 10.00,
    icon: '🎁',
    description: 'Double Clubcard value on partners',
    clickCollect: false,
    affiliateLink: 'https://www.tesco.com/clubcard/boost'
  },
  {
    id: 'zeek',
    name: 'Zeek',
    type: 'gift-cards',
    rate: '5-25% off',
    amount: 7.50,
    icon: '🎫',
    description: 'Discounted gift cards marketplace',
    clickCollect: false,
    affiliateLink: 'https://www.zeek.me/'
  }
];

export const filterOptions = [
  { id: 'cashback', label: 'Cashback', icon: '💰' },
  { id: 'points', label: 'Points & Miles', icon: '✈️' },
  { id: 'student', label: 'Student Offers', icon: '🎓' },
  { id: 'gift-cards', label: 'Gift Cards', icon: '🎁' },
  { id: 'discount', label: 'Discounts', icon: '🏷️' },
  { id: 'donation', label: 'Charity Fundraising', icon: '💝' },
  { id: 'credit-cards', label: 'Credit Cards', icon: '💳' },
  { id: 'loyalty', label: 'Store Loyalty', icon: '🛒' }
];

export const features = [
  {
    icon: <TrendingUp />,
    title: "Real-Time UK Comparison",
    description: "Compare TopCashback, JamDoughnut, and Amazon UK offers instantly with GBP calculations."
  },
  {
    icon: <Filter />,
    title: "UK-Focused Strategy",
    description: "Optimized for UK banks, retailers, and cashback platforms including student-specific offers."
  },
  {
    icon: <Clock />,
    title: "Maximize Every Pound",
    description: "Smart GBP calculations ensuring you get the best cashback rates across UK platforms."
  }
];

export const registrationOptions = {
  banks: ukBanks.map(bank => ({
    value: bank.id,
    label: bank.name,
    popular: bank.popular
  })),
  cards: [
    // Premium Credit Cards
    { value: 'amex-platinum', label: 'Amex Platinum', category: 'premium' },
    { value: 'amex-gold', label: 'Amex Gold', category: 'premium' },
    { value: 'amex-green', label: 'Amex Green', category: 'premium' },
    { value: 'chase-sapphire', label: 'Chase Sapphire', category: 'premium' },
    
    // Airline Credit Cards
    { value: 'barclays-avios', label: 'Barclays Avios Plus', category: 'airline' },
    { value: 'ba-premium', label: 'BA Premium Plus', category: 'airline' },
    { value: 'virgin-atlantic-reward', label: 'Virgin Atlantic Reward', category: 'airline' },
    { value: 'emirates-signature', label: 'Emirates Signature Card', category: 'airline' },
    
    // Cashback Credit Cards
    { value: 'santander-123', label: 'Santander 123 Cashback', category: 'cashback' },
    { value: 'natwest-reward', label: 'NatWest Reward Card', category: 'cashback' },
    { value: 'tesco-clubcard-credit', label: 'Tesco Clubcard Credit Card', category: 'cashback' },
    { value: 'sainsburys-nectar-credit', label: 'Sainsbury\'s Nectar Credit Card', category: 'cashback' },
    
    // Store Cards
    { value: 'john-lewis-partnership', label: 'John Lewis Partnership Card', category: 'store' },
    { value: 'marks-spencer-credit', label: 'M&S Credit Card', category: 'store' },
    { value: 'argos-card', label: 'Argos Card', category: 'store' },
    { value: 'next-credit', label: 'Next Credit Card', category: 'store' },
    
    // Budget/Basic Cards
    { value: 'aqua-reward', label: 'Aqua Reward Card', category: 'basic' },
    { value: 'capital-one-classic', label: 'Capital One Classic', category: 'basic' },
    { value: 'vanquis-chrome', label: 'Vanquis Chrome Card', category: 'basic' }
  ],
  programmes: [
    // Airline Programmes
    { value: 'avios', label: 'British Airways Avios', category: 'airline' },
    { value: 'virgin-flying-club', label: 'Virgin Flying Club', category: 'airline' },
    { value: 'emirates-skywards', label: 'Emirates Skywards', category: 'airline' },
    { value: 'etihad-guest', label: 'Etihad Guest', category: 'airline' },
    
    // Retail Loyalty
    { value: 'nectar', label: 'Sainsbury\'s Nectar', category: 'retail' },
    { value: 'clubcard', label: 'Tesco Clubcard', category: 'retail' },
    { value: 'mymarks', label: 'M&S Sparks', category: 'retail' },
    { value: 'boots-advantage', label: 'Boots Advantage Card', category: 'retail' },
    { value: 'currys-rewards', label: 'Currys Smart Tech Rewards', category: 'retail' },
    { value: 'john-lewis-partnership', label: 'John Lewis Partnership', category: 'retail' },
    
    // Bank Rewards
    { value: 'lloyds-avios', label: 'Lloyds Avios Rewards', category: 'bank' },
    { value: 'natwest-rewards', label: 'NatWest Rewards', category: 'bank' },
    { value: 'santander-123-rewards', label: 'Santander 123 Rewards', category: 'bank' },
    
    // Alternative Rewards
    { value: 'virgin-red', label: 'Virgin Red', category: 'lifestyle' },
    { value: 'o2-priority', label: 'O2 Priority', category: 'mobile' },
    { value: 'three-rewards', label: 'Three Rewards', category: 'mobile' },
    { value: 'ee-rewards', label: 'EE Rewards', category: 'mobile' }
  ],
  favourites: ukRetailers.filter(retailer => retailer.popular).map(retailer => ({
    value: retailer.id,
    label: retailer.name
  }))
};

export const cashbackPlatforms = ukCashbackPlatforms.map(platform => ({
  value: platform.id,
  label: platform.name,
  rate: platform.rate,
  specialFeature: platform.specialFeature
}));

// UK-specific currency formatting
export const formatCurrency = formatGBP;

// UK market metadata
export const marketConfig = {
  country: 'UK',
  currency: 'GBP',
  symbol: '£',
  locale: 'en-GB',
  primaryCashback: 'TopCashback',
  studentCashback: 'JamDoughnut',
  marketplace: 'Amazon UK'
};

export default {
  stores,
  rewardOptions,
  filterOptions,
  features,
  registrationOptions,
  cashbackPlatforms,
  formatCurrency,
  marketConfig
};