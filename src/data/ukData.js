// Dados específicos do Reino Unido
import { TrendingUp, CreditCard, Gift, Percent, Coins, ShoppingBag } from 'lucide-react';

// Bancos do Reino Unido (lista completa)
export const ukBanks = [
  // Big Four Banks
  {
    id: 'barclays',
    name: 'Barclays',
    logo: '/logos/barclays.png',
    cashbackRate: '1-5%',
    specialOffers: ['Double cashback on groceries', 'Travel insurance included'],
    categories: ['Groceries', 'Petrol', 'Travel'],
    annualFee: '£0-£195',
    website: 'https://www.barclays.co.uk',
    popular: true
  },
  {
    id: 'lloyds',
    name: 'Lloyds Bank',
    logo: '/logos/lloyds.png',
    cashbackRate: '0.25-1%',
    specialOffers: ['Cashback on everyday spending', 'No foreign transaction fees'],
    categories: ['Everyday spending', 'Online shopping'],
    annualFee: '£0-£24',
    website: 'https://www.lloydsbank.com',
    popular: true
  },
  {
    id: 'hsbc',
    name: 'HSBC UK',
    logo: '/logos/hsbc.png',
    cashbackRate: '1-3%',
    specialOffers: ['Global banking', 'Exclusive travel offers'],
    categories: ['Travel', 'Dining', 'Shopping'],
    annualFee: '£0-£300',
    website: 'https://www.hsbc.co.uk',
    popular: true
  },
  {
    id: 'natwest',
    name: 'NatWest',
    logo: '/logos/natwest.png',
    cashbackRate: '1-2%',
    specialOffers: ['Student cashback', 'Reward accounts'],
    categories: ['Everyday spending', 'Student purchases'],
    annualFee: '£0-£60',
    website: 'https://www.natwest.com',
    popular: true
  },
  
  // Major Banks
  {
    id: 'santander',
    name: 'Santander UK',
    logo: '/logos/santander.png',
    cashbackRate: '1-3%',
    specialOffers: ['123 Cashback', 'Rail season ticket loans'],
    categories: ['Bills', 'Transport', 'Shopping'],
    annualFee: '£0-£48',
    website: 'https://www.santander.co.uk',
    popular: true
  },
  {
    id: 'halifax',
    name: 'Halifax',
    logo: '/logos/halifax.png',
    cashbackRate: '0.5-2%',
    specialOffers: ['Clarity Credit Card', 'Reward Current Account'],
    categories: ['Overseas spending', 'Everyday purchases'],
    annualFee: '£0',
    website: 'https://www.halifax.co.uk',
    popular: true
  },
  {
    id: 'nationwide',
    name: 'Nationwide Building Society',
    logo: '/logos/nationwide.png',
    cashbackRate: '0.5-1%',
    specialOffers: ['Member exclusive rates', 'FlexDirect account'],
    categories: ['Banking', 'Mortgages'],
    annualFee: '£0',
    website: 'https://www.nationwide.co.uk',
    popular: true
  },
  
  // Digital Banks
  {
    id: 'monzo',
    name: 'Monzo',
    logo: '/logos/monzo.png',
    cashbackRate: '1-3%',
    specialOffers: ['Plus perks', 'Premium benefits'],
    categories: ['Digital banking', 'Budgeting'],
    annualFee: '£0-£180',
    website: 'https://monzo.com',
    popular: true
  },
  {
    id: 'starling',
    name: 'Starling Bank',
    logo: '/logos/starling.png',
    cashbackRate: '0.5-1%',
    specialOffers: ['No foreign fees', 'Business banking'],
    categories: ['Travel', 'Business'],
    annualFee: '£0',
    website: 'https://www.starlingbank.com',
    popular: true
  },
  {
    id: 'revolut',
    name: 'Revolut',
    logo: '/logos/revolut.png',
    cashbackRate: '1-8%',
    specialOffers: ['Crypto cashback', 'Metal card perks'],
    categories: ['Travel', 'Dining', 'Transport'],
    annualFee: '£0-£540',
    website: 'https://www.revolut.com',
    popular: true
  },
  
  // Other Major Banks
  {
    id: 'rbs',
    name: 'Royal Bank of Scotland',
    logo: '/logos/rbs.png',
    cashbackRate: '1-2%',
    specialOffers: ['Reward accounts', 'Student banking'],
    categories: ['Everyday spending', 'Student'],
    annualFee: '£0-£60',
    website: 'https://www.rbs.co.uk'
  },
  {
    id: 'virgin-money',
    name: 'Virgin Money',
    logo: '/logos/virgin-money.png',
    cashbackRate: '0.5-2%',
    specialOffers: ['Virgin Points', 'Travel benefits'],
    categories: ['Virgin services', 'Travel'],
    annualFee: '£0-£160',
    website: 'https://uk.virginmoney.com'
  },
  {
    id: 'metro-bank',
    name: 'Metro Bank',
    logo: '/logos/metro-bank.png',
    cashbackRate: '1%',
    specialOffers: ['7-day banking', 'Local service'],
    categories: ['Local banking', 'Personal service'],
    annualFee: '£0',
    website: 'https://www.metrobankonline.co.uk'
  },
  {
    id: 'tesco-bank',
    name: 'Tesco Bank',
    logo: '/logos/tesco-bank.png',
    cashbackRate: '0.5-3%',
    specialOffers: ['Clubcard points', 'Tesco benefits'],
    categories: ['Groceries', 'Tesco shopping'],
    annualFee: '£0',
    website: 'https://www.tescobank.com'
  },
  {
    id: 'first-direct',
    name: 'First Direct',
    logo: '/logos/first-direct.png',
    cashbackRate: '1%',
    specialOffers: ['24/7 telephone banking', 'Switching bonus'],
    categories: ['Premium service', 'Telephone banking'],
    annualFee: '£0',
    website: 'https://www1.firstdirect.com'
  },
  {
    id: 'co-op-bank',
    name: 'The Co-operative Bank',
    logo: '/logos/co-op-bank.png',
    cashbackRate: '1%',
    specialOffers: ['Ethical banking', 'Smile digital'],
    categories: ['Ethical banking', 'Digital services'],
    annualFee: '£0',
    website: 'https://www.co-operativebank.co.uk'
  },
  {
    id: 'tsb',
    name: 'TSB Bank',
    logo: '/logos/tsb.png',
    cashbackRate: '0.5-1%',
    specialOffers: ['Local banking', 'Classic Plus'],
    categories: ['Local banking', 'Current accounts'],
    annualFee: '£0',
    website: 'https://www.tsb.co.uk'
  },
  {
    id: 'charter-savings',
    name: 'Charter Savings Bank',
    logo: '/logos/charter-savings.png',
    cashbackRate: '0%',
    specialOffers: ['High interest savings', 'Fixed rate bonds'],
    categories: ['Savings', 'Investments'],
    annualFee: '£0',
    website: 'https://www.chartersavingsbank.co.uk'
  },
  {
    id: 'atom-bank',
    name: 'Atom Bank',
    logo: '/logos/atom-bank.png',
    cashbackRate: '0%',
    specialOffers: ['Digital-only banking', 'Competitive savings'],
    categories: ['Digital banking', 'Savings'],
    annualFee: '£0',
    website: 'https://www.atombank.co.uk'
  },
  {
    id: 'cynergy-bank',
    name: 'Cynergy Bank',
    logo: '/logos/cynergy-bank.png',
    cashbackRate: '0%',
    specialOffers: ['High yield savings', 'Business banking'],
    categories: ['Savings', 'Business'],
    annualFee: '£0',
    website: 'https://www.cynergybank.co.uk'
  }
];

// Cartões de Crédito do Reino Unido (lista completa)
export const ukCreditCards = [
  // Premium Travel Cards
  {
    id: 'amex-platinum',
    name: 'American Express Platinum Card',
    issuer: 'American Express',
    logo: '/logos/amex-platinum.png',
    cashbackRate: '1-5%',
    pointsRate: '1-5 MR points per £1',
    annualFee: '£575',
    specialOffers: ['Airport lounge access', 'Travel credits', 'Concierge service'],
    categories: ['Travel', 'Dining', 'Shopping'],
    applyUrl: 'https://www.americanexpress.com/uk/credit-cards/platinum',
    popular: true
  },
  {
    id: 'amex-gold',
    name: 'American Express Gold Card',
    issuer: 'American Express',
    logo: '/logos/amex-gold.png',
    cashbackRate: '1-3%',
    pointsRate: '1-3 MR points per £1',
    annualFee: '£140',
    specialOffers: ['Dining credits', 'Shopping protection', 'Extended warranty'],
    categories: ['Dining', 'Shopping', 'Entertainment'],
    applyUrl: 'https://www.americanexpress.com/uk/credit-cards/gold',
    popular: true
  },
  
  // Airline Cards
  {
    id: 'ba-premium-plus',
    name: 'British Airways Premium Plus Credit Card',
    issuer: 'American Express',
    logo: '/logos/ba-amex.png',
    cashbackRate: '0%',
    pointsRate: '3 Avios per £1',
    annualFee: '£195',
    specialOffers: ['Up to 25,000 bonus Avios', '2-4-1 voucher', 'Priority boarding'],
    categories: ['Travel', 'BA purchases', 'General spending'],
    applyUrl: 'https://www.britishairways.com/en-gb/executive-club/credit-cards',
    popular: true
  },
  {
    id: 'ba-amex',
    name: 'British Airways American Express Credit Card',
    issuer: 'American Express', 
    logo: '/logos/ba-amex.png',
    cashbackRate: '0%',
    pointsRate: '1.5 Avios per £1',
    annualFee: '£36',
    specialOffers: ['Up to 9,000 bonus Avios', 'Avios on BA flights'],
    categories: ['Travel', 'BA purchases', 'General spending'],
    applyUrl: 'https://www.britishairways.com/en-gb/executive-club/credit-cards',
    popular: true
  },
  {
    id: 'virgin-atlantic-reward',
    name: 'Virgin Atlantic Reward Credit Card',
    issuer: 'Virgin Money',
    logo: '/logos/virgin-atlantic.png',
    cashbackRate: '0%',
    pointsRate: '1.5 Flying Club miles per £1',
    annualFee: '£160',
    specialOffers: ['Companion voucher', 'Priority check-in', 'Bonus miles'],
    categories: ['Travel', 'Virgin purchases', 'General spending'],
    applyUrl: 'https://uk.virginmoney.com/credit-cards/virgin-atlantic-reward',
    popular: true
  },
  
  // Cashback Cards
  {
    id: 'barclays-platinum-cashback',
    name: 'Barclays Platinum Cashback Credit Card',
    issuer: 'Barclays',
    logo: '/logos/barclays-cashback.png',
    cashbackRate: '0.25-1%',
    pointsRate: '0%',
    annualFee: '£0',
    specialOffers: ['Up to 1% cashback', 'No annual fee', '0% purchase period'],
    categories: ['General spending', 'Online shopping'],
    applyUrl: 'https://www.barclays.co.uk/credit-cards/cashback',
    popular: true
  },
  {
    id: 'halifax-clarity',
    name: 'Halifax Clarity Credit Card',
    issuer: 'Halifax',
    logo: '/logos/halifax-clarity.png', 
    cashbackRate: '0%',
    pointsRate: '0%',
    annualFee: '£0',
    specialOffers: ['No foreign transaction fees', 'Competitive exchange rates', 'Travel friendly'],
    categories: ['Travel', 'Overseas spending'],
    applyUrl: 'https://www.halifax.co.uk/credit-cards/clarity',
    popular: true
  },
  
  // Store Cards
  {
    id: 'tesco-clubcard',
    name: 'Tesco Clubcard Credit Card',
    issuer: 'Tesco Bank',
    logo: '/logos/tesco-clubcard.png',
    cashbackRate: '0%',
    pointsRate: '1 Clubcard point per £1',
    annualFee: '£0',
    specialOffers: ['Clubcard points', 'Exclusive Tesco offers', 'Partner rewards'],
    categories: ['Tesco shopping', 'General spending'],
    applyUrl: 'https://www.tescobank.com/credit-cards/clubcard',
    popular: false
  },
  {
    id: 'marks-spencer',
    name: 'M&S Credit Card',
    issuer: 'M&S Bank',
    logo: '/logos/ms-bank.png',
    cashbackRate: '0%',
    pointsRate: '1 point per £1',
    annualFee: '£0',
    specialOffers: ['M&S points', 'Exclusive offers', 'Member events'],
    categories: ['M&S shopping', 'General spending'],
    applyUrl: 'https://bank.marksandspencer.com/credit-cards',
    popular: false
  },
  {
    id: 'john-lewis-partnership',
    name: 'John Lewis Partnership Credit Card',
    issuer: 'John Lewis Financial Services',
    logo: '/logos/john-lewis-card.png',
    cashbackRate: '0%',
    pointsRate: '1 point per £1',
    annualFee: '£0',
    specialOffers: ['myJL points', 'Exclusive shopping events', 'Extended returns'],
    categories: ['John Lewis', 'Waitrose', 'General spending'],
    applyUrl: 'https://www.johnlewis.com/credit-card',
    popular: false
  }
];

// Plataformas de Cashback do Reino Unido (lista completa)
export const ukCashbackPlatforms = [
  // Major Cashback Sites
  {
    id: 'topcashback',
    name: 'TopCashback',
    logo: '/logos/topcashback.png',
    description: 'UK\'s most generous cashback site',
    baseRate: '1-15%',
    specialFeatures: ['Price protection', 'Snap & Save', 'In-store cashback'],
    partners: ['Amazon UK', 'John Lewis', 'ASOS', 'Tesco', 'Argos'],
    signupBonus: '£10',
    website: 'https://www.topcashback.co.uk',
    category: 'Cashback Platform',
    popular: true
  },
  {
    id: 'quidco',
    name: 'Quidco',
    logo: '/logos/quidco.png',
    description: 'UK\'s original cashback website',
    baseRate: '1-12%',
    specialFeatures: ['Quidco Plus membership', 'Higher rates', 'Instant payouts'],
    partners: ['Sainsbury\'s', 'M&S', 'Very', 'Currys', 'Boots'],
    signupBonus: '£5',
    website: 'https://www.quidco.com',
    category: 'Cashback Platform',
    popular: true
  },
  {
    id: 'jamdoughnut',
    name: 'Jam Doughnut',
    logo: '/logos/jamdoughnut.png',
    description: 'Cashback and rewards for students and young professionals',
    baseRate: '2-20%',
    specialFeatures: ['Student discounts', 'Young professional offers', 'Social shopping'],
    partners: ['ASOS', 'Boohoo', 'Nike', 'Spotify', 'Uber Eats'],
    signupBonus: '£15',
    website: 'https://jamdoughnut.com',
    category: 'Student Cashback',
    targetAudience: 'Students & Young Professionals',
    popular: true
  },
  {
    id: 'airtime-rewards',
    name: 'Airtime Rewards',
    logo: '/logos/airtime-rewards.png',
    description: 'Earn mobile credit through shopping',
    baseRate: '1-10%',
    specialFeatures: ['Mobile bill credit', 'In-store and online', 'Automatic rewards'],
    partners: ['Greggs', 'Wilko', 'Argos', 'Iceland', 'New Look'],
    signupBonus: '£1',
    website: 'https://www.airtimerewards.co.uk',
    category: 'Mobile Credit Platform',
    popular: true
  },
  {
    id: 'honey',
    name: 'Honey (PayPal)',
    logo: '/logos/honey.png',
    description: 'Automatic coupon finder and cashback',
    baseRate: '1-8%',
    specialFeatures: ['Automatic coupons', 'Price tracking', 'Gold rewards'],
    partners: ['eBay', 'AliExpress', 'Nike', 'ASOS', 'Booking.com'],
    signupBonus: '500 Gold',
    website: 'https://www.joinhoney.com',
    category: 'Browser Extension',
    popular: true
  },
  
  // Loyalty Programme Cashback Sites
  {
    id: 'ba-estore',
    name: 'British Airways eStore',
    logo: '/logos/ba-estore.png',
    description: 'Earn Avios points on online shopping',
    baseRate: '1-15 Avios per £1',
    specialFeatures: ['Avios earning', 'Partner airlines', 'Tier point bonuses'],
    partners: ['John Lewis', 'M&S', 'Apple', 'Booking.com', 'Expedia'],
    signupBonus: '0',
    website: 'https://www.shopping.ba.com',
    category: 'Airline Points',
    popular: true
  },
  {
    id: 'virgin-red',
    name: 'Virgin Red',
    logo: '/logos/virgin-red.png',
    description: 'Virgin\'s loyalty programme with rewards',
    baseRate: '1-10 points per £1',
    specialFeatures: ['Virgin services integration', 'Experience rewards', 'Member exclusive offers'],
    partners: ['Virgin Atlantic', 'Virgin Media', 'Virgin Active', 'Trainline'],
    signupBonus: '0',
    website: 'https://www.virgin.com/virgin-red',
    category: 'Loyalty Programme',
    popular: false
  },
  {
    id: 'nectar',
    name: 'Nectar (Sainsbury\'s)',
    logo: '/logos/nectar.png',
    description: 'Sainsbury\'s loyalty programme with partner rewards',
    baseRate: '1-2 points per £1',
    specialFeatures: ['Sainsbury\'s integration', 'eBay points', 'Partner network'],
    partners: ['Sainsbury\'s', 'Argos', 'eBay', 'Caffè Nero', 'Esso'],
    signupBonus: '150 points',
    website: 'https://www.nectar.com',
    category: 'Supermarket Loyalty',
    popular: true
  },
  {
    id: 'tesco-clubcard',
    name: 'Tesco Clubcard',
    logo: '/logos/tesco-clubcard.png',
    description: 'Tesco\'s loyalty programme with partner rewards',
    baseRate: '1 point per £1',
    specialFeatures: ['Tesco integration', 'Reward partners', 'Fuel points'],
    partners: ['Tesco', 'Esso', 'Hotels.com', 'Expedia', 'Pizza Express'],
    signupBonus: '150 points',
    website: 'https://www.tesco.com/clubcard',
    category: 'Supermarket Loyalty',
    popular: true
  },
  {
    id: 'boots-advantage',
    name: 'Boots Advantage Card',
    logo: '/logos/boots-advantage.png',
    description: 'Boots loyalty programme with health and beauty rewards',
    baseRate: '4 points per £1',
    specialFeatures: ['Health and beauty focus', 'Prescription rewards', 'Partner offers'],
    partners: ['Boots', 'Walgreens Boots Alliance', 'Selected partners'],
    signupBonus: '500 points',
    website: 'https://www.boots.com/advantage-card',
    category: 'Health & Beauty',
    popular: true
  },
  
  // Gift Card Platforms
  {
    id: 'giftcloud',
    name: 'GiftCloud',
    logo: '/logos/giftcloud.png',
    description: 'Discounted gift cards and cashback',
    baseRate: '2-15% discount',
    specialFeatures: ['Discounted gift cards', 'Instant delivery', 'Corporate solutions'],
    partners: ['Amazon', 'Tesco', 'M&S', 'John Lewis', 'ASOS'],
    signupBonus: '£5',
    website: 'https://giftcloud.com',
    category: 'Gift Cards',
    popular: false
  },
  {
    id: 'zeek',
    name: 'Zeek',
    logo: '/logos/zeek.png',
    description: 'Buy and sell discounted gift cards',
    baseRate: '5-30% discount',
    specialFeatures: ['Marketplace model', 'Peer-to-peer', 'Mobile app'],
    partners: ['Various retailers', 'User-generated content'],
    signupBonus: '£0',
    website: 'https://zeek.me',
    category: 'Gift Card Marketplace',
    popular: false
  },
  {
    id: 'cardyard',
    name: 'Cardyard',
    logo: '/logos/cardyard.png',
    description: 'Corporate gift card solutions with discounts',
    baseRate: '3-12% discount',
    specialFeatures: ['B2B focus', 'Bulk purchasing', 'API integration'],
    partners: ['Major UK retailers', 'Corporate clients'],
    signupBonus: '£0',
    website: 'https://www.cardyard.co.uk',
    category: 'Corporate Gift Cards',
    popular: false
  },
  
  // Fintech Cashback
  {
    id: 'curve-cashback',
    name: 'Curve Cashback',
    logo: '/logos/curve.png',
    description: 'Banking app with cashback rewards',
    baseRate: '1-31%',
    specialFeatures: ['Card aggregation', 'Time travel feature', 'Anti-embarrassment mode'],
    partners: ['Selected merchants', 'Rotating categories'],
    signupBonus: '£5',
    website: 'https://www.curve.com',
    category: 'Fintech Banking',
    popular: true
  },
  {
    id: 'zilch',
    name: 'Zilch',
    logo: '/logos/zilch.png',
    description: 'Buy now, pay later with cashback rewards',
    baseRate: '2-10%',
    specialFeatures: ['BNPL integration', 'Virtual cards', 'Flexible payments'],
    partners: ['Amazon', 'eBay', 'Nike', 'ASOS', 'JD Sports'],
    signupBonus: '£10',
    website: 'https://www.payzilch.com',
    category: 'Buy Now Pay Later',
    popular: true
  },
  {
    id: 'plutus',
    name: 'Plutus',
    logo: '/logos/plutus.png',
    description: 'Crypto rewards debit card',
    baseRate: '3-8% PLU rewards',
    specialFeatures: ['Cryptocurrency rewards', 'DEX aggregation', 'Perks system'],
    partners: ['Various merchants', 'Crypto-friendly'],
    signupBonus: '£10 PLU',
    website: 'https://plutus.it',
    category: 'Crypto Rewards',
    popular: false
  },
  
  // Niche Platforms
  {
    id: 'lemoney',
    name: 'Lemoney',
    logo: '/logos/lemoney.png',
    description: 'Cashback on subscriptions and bills',
    baseRate: '1-15%',
    specialFeatures: ['Subscription management', 'Bill cashback', 'Automatic tracking'],
    partners: ['Netflix', 'Spotify', 'Energy suppliers', 'Insurance companies'],
    signupBonus: '£5',
    website: 'https://lemoney.com',
    category: 'Subscription Cashback',
    popular: false
  },
  {
    id: 'cashback-earned',
    name: 'Cashback Earned',
    logo: '/logos/cashback-earned.png',
    description: 'Travel and lifestyle cashback',
    baseRate: '2-12%',
    specialFeatures: ['Travel focus', 'Lifestyle brands', 'Premium partnerships'],
    partners: ['Booking.com', 'Expedia', 'Hotels.com', 'Luxury brands'],
    signupBonus: '£10',
    website: 'https://cashbackearned.co.uk',
    category: 'Travel Cashback',
    popular: false
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
        period: '3 days',
        features: [
          'Basic cashback comparison',
          'Up to 5 searches per day',
          'All UK cashback platforms',
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
        price: 60.00,
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
