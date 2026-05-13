-- ╔══════════════════════════════════════════════════════════════════╗
-- ║  SnapGain — Catalog Seed                                         ║
-- ║                                                                  ║
-- ║  Populates: platform, miles_programs, stores (UK supermarkets)   ║
-- ║  with the full list from the project brief.                      ║
-- ║                                                                  ║
-- ║  Safe to re-run: every INSERT uses ON CONFLICT to upsert by      ║
-- ║  the unique key (slug). Existing rows are updated in place.      ║
-- ║  Missing columns are added with ALTER TABLE … IF NOT EXISTS.     ║
-- ║                                                                  ║
-- ║  How to run:                                                     ║
-- ║    1. Open https://supabase.com/dashboard → your project         ║
-- ║    2. Left sidebar → "SQL Editor" → "+ New query"                ║
-- ║    3. Paste the whole file → click "Run" (green button)          ║
-- ║    4. Check "Table Editor" → platform / miles_programs / stores  ║
-- ╚══════════════════════════════════════════════════════════════════╝


-- ───────────────────────────────────────────────────────────────────
-- 0) Make sure required columns exist (idempotent — safe to re-run)
-- ───────────────────────────────────────────────────────────────────
ALTER TABLE public.platform        ADD COLUMN IF NOT EXISTS affiliate_url     text;
ALTER TABLE public.platform        ADD COLUMN IF NOT EXISTS base_rate_display text;
ALTER TABLE public.platform        ADD COLUMN IF NOT EXISTS notes             text;
ALTER TABLE public.platform        ADD COLUMN IF NOT EXISTS is_active         boolean DEFAULT true;

ALTER TABLE public.miles_programs  ADD COLUMN IF NOT EXISTS booster_url       text;
ALTER TABLE public.miles_programs  ADD COLUMN IF NOT EXISTS is_active         boolean DEFAULT true;

ALTER TABLE public.stores          ADD COLUMN IF NOT EXISTS domain            text;
ALTER TABLE public.stores          ADD COLUMN IF NOT EXISTS category          text;
ALTER TABLE public.stores          ADD COLUMN IF NOT EXISTS is_active         boolean DEFAULT true;
ALTER TABLE public.stores          ADD COLUMN IF NOT EXISTS is_featured       boolean DEFAULT false;

-- Make sure slug is unique on each table so ON CONFLICT works
CREATE UNIQUE INDEX IF NOT EXISTS platform_slug_key       ON public.platform (slug);
CREATE UNIQUE INDEX IF NOT EXISTS miles_programs_slug_key ON public.miles_programs (slug);
CREATE UNIQUE INDEX IF NOT EXISTS stores_slug_key         ON public.stores (slug);


-- ───────────────────────────────────────────────────────────────────
-- 1) CASHBACK & REWARD PLATFORMS  →  public.platform
-- ───────────────────────────────────────────────────────────────────
-- Schema assumed: id (uuid), code, slug, name, type, base_rate_display,
-- notes, is_active, affiliate_url
-- type values used: 'cashback', 'gift_card', 'card', 'bank_offer'

INSERT INTO public.platform (code, slug, name, type, base_rate_display, notes, is_active, affiliate_url)
VALUES
  -- ─── Cashback / general rewards ────────────────────────────────
  ('TOPCASHBACK',  'topcashback',  'TopCashback',    'cashback', 'Up to 10%',  'Largest UK cashback site. Affiliate-supported.',
    true, 'https://www.topcashback.co.uk/ref/denys%20melo'),
  ('QUIDCO',       'quidco',       'Quidco',         'cashback', 'Up to 8%',   'Major UK cashback competitor to TopCashback.',
    true, 'https://quidco.com/raf/14425585/'),
  ('JAMDOUGHNUT',  'jamdoughnut',  'JamDoughnut',    'gift_card','Up to 20%',  'Instant cashback via digital gift cards. Mobile-first.',
    true, 'https://app.jamdoughnut.com/UFDN'),
  ('AIRTIME',      'airtime',      'Airtime Rewards','cashback', 'Varies',     'Stack cashback by linking your card. UK-only.',
    true, 'https://airtimerewards.app.link/XlgKV6ABNWb'),
  ('CHEDDAR',      'cheddar',      'Cheddar',        'cashback', 'Up to 15%',  'In-app cashback, fast payouts.',
    true, 'https://get.cheddar.me/app/CPLTBMB'),
  ('NX_REWARDS',   'nx-rewards',   'NX Rewards',     'cashback', 'Up to 10%',  '1,000+ UK retailers. Monthly bonus up to £180/year.',
    true, NULL),
  ('EVERUP',       'everup',       'Everup',         'cashback', 'Varies',     'Round-ups + cashback.',
    true, 'https://everup.onelink.me/9lgD/vg866wd3'),
  ('SHOPMIUM',     'shopmium',     'Shopmium',       'cashback', 'Varies',     'Receipt-scan cashback on groceries.',
    true, 'https://www.shopmium.com/uk/referral/u53bu8'),
  ('GREENJINN',    'greenjinn',    'GreenJinn',      'cashback', 'Varies',     'Receipt-scan cashback. Tesco / Sainsbury / Asda.',
    true, 'https://www.greenjinn.com/'),
  ('RAKUTEN_UK',   'rakuten-uk',   'Rakuten UK',     'cashback', 'Up to 12%',  'Global cashback portal.',
    true, 'https://www.rakuten.co.uk/'),

  -- ─── Student-only ──────────────────────────────────────────────
  ('UNIDAYS',      'unidays',      'UNiDAYS',        'cashback', 'Student',    'Student-only discounts.',
    true, NULL),
  ('STUDENTBEANS', 'studentbeans', 'Student Beans',  'cashback', 'Student',    'Student-only discounts.',
    true, NULL),
  ('TOTUM',        'totum',        'TOTUM',          'cashback', 'Student',    'Official NUS student card discounts.',
    true, NULL),

  -- ─── Other UK rewards / cashback platforms ─────────────────────
  ('ACCESS_CARD',  'access-card',  'Access Card',    'cashback', 'Varies',     'Disability discount card with retail offers.',
    true, NULL),
  ('HYPERJAR',     'hyperjar',     'HyperJar',       'gift_card','Up to 4.8%', 'Prepaid jars with retailer bonuses.',
    true, NULL),
  ('MORRISONS_MORE','morrisons-more','Morrisons More Partners', 'cashback', '5,000 pts = £5', 'Morrisons loyalty + partners.',
    true, NULL),
  ('CURVE',        'curve',        'Curve Rewards',  'cashback', 'Varies',     'Card-of-cards with cashback layer.',
    true, NULL),
  ('DAALI',        'daali',        'Daali',          'cashback', 'Varies',     'Receipt cashback.',
    true, NULL),
  ('ZIPZERO',      'zipzero',      'Zipzero',        'cashback', 'Varies',     'Use cashback to pay bills.',
    true, NULL),
  ('SWAGBUCKS',    'swagbucks',    'Swagbucks',      'cashback', 'Varies',     'Cashback + paid surveys.',
    true, NULL),
  ('KARMA',        'karma-vouchers','Karma Vouchers','gift_card','Varies',     'Discounted gift cards.',
    true, NULL),
  ('KIDSTART',     'kidstart',     'KidStart',       'cashback', 'Varies',     'Cashback into a kids savings pot.',
    true, NULL),
  ('LOYALBE',      'loyalbe',      'Loyalbe',        'cashback', 'Varies',     'Local-business loyalty.',
    true, NULL),
  ('OHMYDOSH',     'ohmydosh',     'OhMyDosh',       'cashback', 'Varies',     'Sign-up offers cashback.',
    true, NULL),
  ('TASTECARD',    'tastecard',    'Tastecard',      'cashback', 'Varies',     '2-for-1 restaurant deals.',
    true, NULL),
  ('ONSI',         'onsi',         'Onsi',           'cashback', 'Varies',     'Workplace perks platform.',
    true, NULL),

  -- ─── Cards (rewards / cashback) ────────────────────────────────
  ('AMEX_GOLD',          'amex-gold',          'Amex Gold',                  'card', '2 pts/£', 'Membership Rewards → Avios.', true, NULL),
  ('AMEX_PLAT_CASHBACK', 'amex-platinum-cashback','Amex Platinum Cashback',  'card', 'Up to 5%','5% intro, then 0.5%-1%.', true, NULL),
  ('AMEX_VITALITY',      'amex-vitality',      'Amex Vitality',              'card', 'Up to 1%','Health-linked rewards.', true, NULL),
  ('BA_AMEX',            'ba-amex',            'British Airways Amex',       'card', 'Avios',   'Earn Avios directly.', true, NULL),
  ('BARCLAYCARD_AVIOS',  'barclaycard-avios',  'Barclaycard Avios',          'card', 'Avios',   'Collect Avios on every spend.', true, NULL),
  ('BARCLAYCARD_REWARDS','barclaycard-rewards','Barclaycard Rewards',        'card', 'Cashback','Competitive international rates.', true, NULL),
  ('CHASE_UK',           'chase-uk',           'Chase UK',                   'card', '1% (debit)','Debit cashback, time-limited.', true, NULL),
  ('TESCO_CLUBCARD_CC',  'tesco-clubcard-cc',  'Tesco Clubcard Credit Card', 'card', 'Clubcard','Convert to partner vouchers.', true, NULL),
  ('VIRGIN_MONEY_CC',    'virgin-money-cc',    'Virgin Money Credit Card',   'card', '0.25%',   'Basic cashback.', true, NULL),
  ('NATWEST_REWARD',     'natwest-reward',     'NatWest Reward',             'card', 'Reward',  'Rewards from selected retailers.', true, NULL),
  ('HALIFAX_CASHBACK',   'halifax-cashback',   'Halifax Cashback Credit Card','card','0.25%',   'Basic cashback card.', true, NULL),
  ('HALIFAX_ELITE',      'halifax-elite',      'Halifax Elite',              'card', '1%',      'Premium cashback.', true, NULL),
  ('LLOYDS_CASHBACK',    'lloyds-cashback',    'Lloyds Bank Cashback CC',    'card', '0.25%',   'Basic cashback card.', true, NULL),
  ('LLOYDS_ELITE',       'lloyds-elite',       'Lloyds Elite',               'card', '1%',      'Premium cashback.', true, NULL),
  ('SANTANDER_EDGE',     'santander-edge',     'Santander Edge',             'card', '2% Y1, 1%','£36/year, 2% first year.', true, NULL),
  ('MS_REWARD',          'ms-bank-reward',     'M&S Bank Reward Card',       'card', 'M&S pts', 'Points usable at M&S.', true, NULL),
  ('NECTAR_CC',          'nectar-cc',          'Sainsbury''s Nectar CC',     'card', 'Nectar',  'Earn Nectar points.', true, NULL),
  ('JOHN_LEWIS',         'john-lewis-card',    'John Lewis Partnership Card','card', 'Pts',     'John Lewis & Waitrose points.', true, NULL),
  ('HSBC_REWARDS',       'hsbc-rewards',       'HSBC Rewards',               'card', 'Pts/CB',  'Points + cashback options.', true, NULL),
  ('ASDA_MONEY',         'asda-money-cc',      'Asda Money Credit Card',     'card', 'CB+Asda', 'Cashback + extra Asda pts.', true, NULL),
  ('MONESE_CASHBACK',    'monese-cashback',    'Monese Cashback',            'card', 'Up to 1.5%','In-app cashback.', true, NULL),
  ('MONZO_FLEX',         'monzo-flex',         'Monzo Flex',                 'card', 'Varies',  'BNPL with cashback offers.', true, NULL),
  ('REVOLUT_METAL',      'revolut-metal',      'Revolut Metal',              'card', 'Up to 1%','Tiered cashback.', true, NULL),
  ('REVOLUT_ULTRA',      'revolut-ultra',      'Revolut Ultra',              'card', '1 pt/£',  'Points convertible to miles.', true, NULL),
  ('SUMUP',              'sumup-card',         'SumUp',                      'card', '0.5%',    'Small-business card cashback.', true, NULL),
  ('TRADING212',         'trading212-card',    'Trading 212 Card',           'card', '1.5%',    'Cashback into your portfolio.', true, NULL),
  ('NATIONWIDE_FLEX',    'nationwide-flex',    'Nationwide Flex Direct',     'card', '1%',      'Cashback on selected spend.', true, NULL),
  ('YONDER',             'yonder',             'Yonder Credit Card',         'card', '2.5%',    'Premium UK cashback card.', true, NULL),
  ('UPHOLD',             'uphold-card',        'Uphold Card',                'card', '1%',      'Crypto/cash cashback.', true, NULL)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  type = EXCLUDED.type,
  base_rate_display = EXCLUDED.base_rate_display,
  notes = EXCLUDED.notes,
  is_active = EXCLUDED.is_active,
  affiliate_url = COALESCE(EXCLUDED.affiliate_url, platform.affiliate_url);


-- ───────────────────────────────────────────────────────────────────
-- 2) AIRLINE / LOYALTY PROGRAMS  →  public.miles_programs
-- ───────────────────────────────────────────────────────────────────
-- Schema assumed: id, slug, name, conversion_rate (pence per point),
-- booster_url, is_active

INSERT INTO public.miles_programs (slug, name, conversion_rate, booster_url, is_active)
VALUES
  ('avios',           'Avios (BA / Iberia / Aer Lingus)', 0.92, 'https://www.britishairways.com/travel/loyalty/public/en_gb', true),
  ('virgin-points',   'Virgin Atlantic Flying Club',      1.50, 'https://flyingclub.virginatlantic.com/', true),
  ('emirates',        'Emirates Skywards',                1.10, 'https://www.emirates.com/skywards/', true),
  ('flying-blue',     'Flying Blue (Air France/KLM)',     1.35, 'https://www.flyingblue.com/en/', true),
  ('qatar',           'Qatar Privilege Club',             1.20, 'https://www.qatarairways.com/en/privilege-club.html', true),
  ('etihad',          'Etihad Guest',                     1.00, 'https://www.etihadguest.com/', true),
  ('lufthansa',       'Lufthansa Miles & More',           1.10, 'https://www.miles-and-more.com/', true),
  ('tap-miles',       'TAP Miles & Go',                   1.00, 'https://www.flytap.com/en-us/miles-and-go', true),
  ('nectar',          'Nectar (Sainsbury''s)',            0.50, 'https://www.nectar.com/', true),
  ('tesco-clubcard',  'Tesco Clubcard',                   1.00, 'https://www.tesco.com/clubcard/', true),
  ('morrisons-more',  'Morrisons More',                   0.10, 'https://www.morrisons.com/more', true),
  ('ms-sparks',       'M&S Sparks',                       0.50, 'https://www.marksandspencer.com/sparks', true),
  ('waitrose',        'My Waitrose',                      0.50, 'https://www.waitrose.com/ecom/my-waitrose', true),
  ('lidl-plus',       'Lidl Plus',                        0.10, 'https://www.lidl.co.uk/lidl-plus', true),
  ('coop',            'Co-op Membership',                 0.02, 'https://membership.coop.co.uk/', true)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  conversion_rate = EXCLUDED.conversion_rate,
  booster_url = EXCLUDED.booster_url,
  is_active = EXCLUDED.is_active;


-- ───────────────────────────────────────────────────────────────────
-- 3) STORES — UK supermarkets + popular retailers
-- ───────────────────────────────────────────────────────────────────
-- Schema assumed: id, slug, name, domain, category, is_active, is_featured
-- domain is what powers Clearbit logo lookup automatically.

INSERT INTO public.stores (slug, name, domain, category, is_active, is_featured)
VALUES
  -- Supermarkets
  ('asda',           'Asda',           'asda.com',         'grocery',     true, true),
  ('tesco',          'Tesco',          'tesco.com',        'grocery',     true, true),
  ('morrisons',      'Morrisons',      'morrisons.com',    'grocery',     true, true),
  ('sainsburys',     'Sainsbury''s',   'sainsburys.co.uk', 'grocery',     true, true),
  ('aldi',           'Aldi',           'aldi.co.uk',       'grocery',     true, false),
  ('farmfoods',      'Farmfoods',      'farmfoods.com',    'grocery',     true, false),
  ('iceland',        'Iceland',        'iceland.co.uk',    'grocery',     true, false),
  ('marks-spencer',  'M&S',            'marksandspencer.com','grocery',   true, true),
  ('waitrose',       'Waitrose',       'waitrose.com',     'grocery',     true, true),
  ('lidl',           'Lidl',           'lidl.co.uk',       'grocery',     true, false),
  ('coop',           'Co-op',          'coop.co.uk',       'grocery',     true, false),
  ('booths',         'Booths',         'booths.co.uk',     'grocery',     true, false),
  ('heron-foods',    'Heron Foods',    'heronfoods.com',   'grocery',     true, false),
  ('oseyo',          'Oseyo',          'oseyo.co.uk',      'grocery',     true, false),

  -- General / Fashion / Electronics (the "usual suspects")
  ('amazon-uk',      'Amazon',         'amazon.co.uk',     'general',     true, true),
  ('john-lewis',     'John Lewis',     'johnlewis.com',    'department',  true, true),
  ('argos',          'Argos',          'argos.co.uk',      'general',     true, true),
  ('currys',         'Currys',         'currys.co.uk',     'electronics', true, true),
  ('very',           'Very',           'very.co.uk',       'general',     true, false),
  ('asos',           'ASOS',           'asos.com',         'fashion',     true, true),
  ('next',           'Next',           'next.co.uk',       'fashion',     true, false),
  ('boots',          'Boots',          'boots.com',        'health',      true, true),
  ('superdrug',      'Superdrug',      'superdrug.com',    'health',      true, false),
  ('debenhams',      'Debenhams',      'debenhams.com',    'department',  true, false),
  ('ikea',           'IKEA',           'ikea.com',         'home',        true, true),
  ('bq',             'B&Q',            'diy.com',          'home',        true, false),

  -- Travel
  ('booking',        'Booking.com',    'booking.com',      'travel',      true, true),
  ('expedia',        'Expedia',        'expedia.co.uk',    'travel',      true, false),
  ('hotels-com',     'Hotels.com',     'hotels.com',       'travel',      true, false),
  ('trainline',      'Trainline',      'thetrainline.com', 'travel',      true, false),

  -- Food delivery
  ('deliveroo',      'Deliveroo',      'deliveroo.co.uk',  'food-delivery', true, true),
  ('uber-eats',      'Uber Eats',      'ubereats.com',     'food-delivery', true, true),
  ('just-eat',       'Just Eat',       'just-eat.co.uk',   'food-delivery', true, false),

  -- Fuel
  ('bp',             'BP',             'bp.com',           'fuel',        true, false),
  ('esso',           'Esso',           'esso.co.uk',       'fuel',        true, false),
  ('shell',          'Shell',          'shell.co.uk',      'fuel',        true, false)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  domain = EXCLUDED.domain,
  category = EXCLUDED.category,
  is_active = EXCLUDED.is_active,
  is_featured = EXCLUDED.is_featured;


-- ───────────────────────────────────────────────────────────────────
-- Done. To verify, run:
--   SELECT count(*) FROM public.platform;        -- should be ~50
--   SELECT count(*) FROM public.miles_programs;  -- should be 15
--   SELECT count(*) FROM public.stores;          -- should be ~35
-- ───────────────────────────────────────────────────────────────────
