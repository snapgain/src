// Dados específicos do Reino Unido
import { TrendingUp, CreditCard, Gift, Percent, Coins, ShoppingBag } from 'lucide-react';

// Bancos do Reino Unido
export const ukBanks = [
  {
    id: 'barclays',
    name: 'Barclays',
    logo: '/logos/barclays.png',
    cashbackRate: '1-5%',
    specialOffers: ['Double cashback on groceries', 'Travel insurance included'],
    categories: ['Groceries', 'Petrol', 'Travel'],
    annualFee: '£0-£195',
    website: 'https://www.barclays.co.uk'
  },
  {
    id: 'lloyds',
    name: 'Lloyds Bank',
    logo: '/logos/lloyds.png',
    cashbackRate: '0.25-1%',
    specialOffers: ['Cashback on everyday spending', 'No foreign transaction fees'],
    categories: ['Everyday spending', 'Online shopping'],
    annualFee: '£0-£24',
    website: 'https://www.lloydsbank.com'
  },
  {
    id: 'natwest',
    name: 'NatWest',
    logo: '/logos/natwest.png',
    cashbackRate: '1-3%',
    specialOffers: ['Reward points on purchases', 'Cashback on bills'],
    categories: ['Bills', 'Shopping', 'Transport'],
    annualFee: '£0',
    website: 'https://www.natwest.com'
  },
  {
    id: 'hsbc',
    name: 'HSBC UK',
    logo: '/logos/hsbc.png',
    cashbackRate: '1-5%',
    specialOffers: ['Flexible rewards', 'Travel benefits'],
    categories: ['Travel', 'Dining', 'Shopping'],
    annualFee: '£0-£195',
    website: 'https://www.hsbc.co.uk'
  }
];

// Cartões de Crédito do Reino Unido
export const ukCreditCards = [
  {
    id: 'amex-platinum',
    name: 'American Express Platinum',
    issuer: 'American Express',
    logo: '/logos/amex.png',
    cashbackRate: '1-5%',
    annualFee: '£575',
    specialOffers: ['Airport lounge access', 'Travel credits', 'Concierge service'],
    categories: ['Travel', 'Dining', 'Shopping'],
    applyUrl: 'https://www.americanexpress.com/uk'
  },
  {
    id: 'virgin-money',
    name: 'Virgin Money Credit Card',
    issuer: 'Virgin Money',
    logo: '/logos/virgin.png',
    cashbackRate: '0.5-2%',
    annualFee: '£0',
    specialOffers: ['Virgin Points on purchases', 'Travel insurance'],
    categories: ['Everyday spending', 'Virgin services'],
    applyUrl: 'https://uk.virginmoney.com'
  },
  {
    id: 'tesco-clubcard',
    name: 'Tesco Clubcard Credit Card',
    issuer: 'Tesco Bank',
    logo: '/logos/tesco.png',
    cashbackRate: '0.5-3%',
    annualFee: '£0',
    specialOffers: ['Clubcard points', 'Special Tesco offers'],
    categories: ['Groceries', 'Fuel', 'Tesco services'],
    applyUrl: 'https://www.tescobank.com'
  }
];

// Plataformas de Cashback do Reino Unido
export const ukCashbackPlatforms = [
  {
    id: 'topcashback',
    name: 'TopCashback',
    logo: '/logos/topcashback.png',
    description: 'UKs most generous cashback site',
    baseRate: '1-15%',
    specialFeatures: ['Price protection', 'Snap & Save', 'In-store cashback'],
    partners: ['Amazon UK', 'John Lewis', 'ASOS', 'Tesco', 'Argos'],
    signupBonus: '£10',
    website: 'https://www.topcashback.co.uk',
    category: 'Cashback Platform'
  },
  {
    id: 'jamdoughnut',
    name: 'Jam Doughnut',
    logo: '/logos/jamdoughnut.png',
    description: 'Cashback and rewards for students and young professionals',
    baseRate: '2-20%',
    specialFeatures: ['Student discounts', 'Exclusive deals', 'Social shopping'],
    partners: ['ASOS', 'Boohoo', 'Missguided', 'Nike', 'Adidas'],
    signupBonus: '£5',
    website: 'https://www.jamdoughnut.com',
    category: 'Student Cashback'
  },
  {
    id: 'quidco',
    name: 'Quidco',
    logo: '/logos/quidco.png',
    description: 'UKs original cashback site',
    baseRate: '0.5-10%',
    specialFeatures: ['ClickSnap technology', 'Quidco Plus membership', 'Mobile app'],
    partners: ['Currys', 'Very', 'Boots', 'Sainsburys', 'M&S'],
    signupBonus: '£5',
    website: 'https://www.quidco.com',
    category: 'Cashback Platform'
  }
];

// Lojas de Comparação de Preços do Reino Unido
export const ukRetailers = [
  {
    id: 'amazon-uk',
    name: 'Amazon UK',
    logo: '/logos/amazon-uk.png',
    description: 'Everything from A to Z',
    website: 'https://www.amazon.co.uk',
    categories: ['Electronics', 'Books', 'Home', 'Fashion', 'Groceries'],
    priceMatchPolicy: false,
    deliveryOptions: ['Prime Next Day', 'Standard', 'Same Day'],
    cashbackRate: '1-8%'
  },
  {
    id: 'john-lewis',
    name: 'John Lewis',
    logo: '/logos/johnlewis.png',
    description: 'Quality, value and service',
    website: 'https://www.johnlewis.com',
    categories: ['Fashion', 'Home', 'Electronics', 'Beauty'],
    priceMatchPolicy: true,
    deliveryOptions: ['Next Day', 'Standard', 'Click & Collect'],
    cashbackRate: '2-6%'
  },
  {
    id: 'currys',
    name: 'Currys',
    logo: '/logos/currys.png',
    description: 'Technology made simple',
    website: 'https://www.currys.co.uk',
    categories: ['Electronics', 'Computing', 'Gaming', 'Smart Home'],
    priceMatchPolicy: true,
    deliveryOptions: ['Next Day', 'Standard', 'Installation'],
    cashbackRate: '1-4%'
  },
  {
    id: 'argos',
    name: 'Argos',
    logo: '/logos/argos.png',
    description: 'Shop the Argos range',
    website: 'https://www.argos.co.uk',
    categories: ['Home', 'Garden', 'Technology', 'Toys', 'Sports'],
    priceMatchPolicy: false,
    deliveryOptions: ['Fast Track', 'Standard', 'Same Day'],
    cashbackRate: '1-3%'
  },
  {
    id: 'very',
    name: 'Very',
    logo: '/logos/very.png',
    description: 'Fashion, home & electricals',
    website: 'https://www.very.co.uk',
    categories: ['Fashion', 'Home', 'Electronics', 'Beauty', 'Kids'],
    priceMatchPolicy: false,
    deliveryOptions: ['Next Day', 'Standard', 'Nominated Day'],
    cashbackRate: '2-8%'
  }
];

// Categorias de filtros para o Reino Unido
export const ukFilterOptions = [
  { id: 'cashback-rate', label: 'Cashback Rate', icon: Percent },
  { id: 'annual-fee', label: 'Annual Fee', icon: CreditCard },
  { id: 'signup-bonus', label: 'Sign-up Bonus', icon: Gift },
  { id: 'travel-benefits', label: 'Travel Benefits', icon: TrendingUp },
  { id: 'insurance', label: 'Insurance Included', icon: TrendingUp },
  { id: 'student-offers', label: 'Student Offers', icon: TrendingUp }
];

// Opções de recompensas para o Reino Unido
export const ukRewardOptions = [
  { id: 'cashback', label: 'Cashback (£)', icon: Coins },
  { id: 'points', label: 'Reward Points', icon: TrendingUp },
  { id: 'avios', label: 'Avios Points', icon: TrendingUp },
  { id: 'nectar', label: 'Nectar Points', icon: TrendingUp },
  { id: 'clubcard', label: 'Clubcard Points', icon: ShoppingBag }
];

// Configuração de moeda para o Reino Unido
export const ukCurrency = {
  code: 'GBP',
  symbol: '£',
  name: 'British Pound Sterling',
  locale: 'en-GB'
};

// Dados de aplicação específicos do Reino Unido
export const ukAppData = {
  hero: {
    title: "UK's Smartest Rewards Comparison",
    subtitle: "Compare cashback, credit cards, and loyalty programmes to maximise your spending power",
    description: "SnapGain compares cashback, points, and rewards in real-time across the UK's top retailers and financial providers",
    cta: "Start Saving Today",
    features: [
      "Real-time price and cashback comparison",
      "UK's top retailers and cashback sites", 
      "Credit card and loyalty programme analysis",
      "Personalised recommendations"
    ]
  },
  features: [
    {
      icon: TrendingUp,
      title: "Real-Time Comparison",
      description: "Instantly compare cashback rates, points, and rewards across TopCashback, Jam Doughnut, and major UK retailers"
    },
    {
      icon: CreditCard,
      title: "UK Financial Products",
      description: "Compare credit cards, current accounts, and loyalty programmes from Barclays, Lloyds, NatWest, and more"
    },
    {
      icon: Coins,
      title: "Maximise Your Pounds",
      description: "Our intelligent algorithm finds the optimal payment method to maximise your cashback and rewards in £"
    }
  ],
  pricing: {
    currency: ukCurrency,
    plans: [
      {
        name: 'Free',
        price: 0,
        period: 'month',
        features: [
          'Basic cashback comparison',
          'Up to 5 searches per day',
          'TopCashback integration',
          'Email support'
        ]
      },
      {
        name: 'Premium',
        price: 7.99,
        period: 'month',
        features: [
          'Unlimited comparisons',
          'All UK cashback platforms',
          'Credit card recommendations',
          'Price alerts',
          'Priority support'
        ]
      },
      {
        name: 'Pro',
        price: 59.99,
        period: 'year',
        features: [
          'Everything in Premium',
          'Advanced analytics',
          'API access',
          'Custom integrations',
          'Dedicated account manager'
        ]
      }
    ]
  }
};

// Utilitários para formatação de moeda britânica
export const formatGBP = (amount) => {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP'
  }).format(amount);
};

export const formatPercentage = (rate) => {
  return `${rate}%`;
};
