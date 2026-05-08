-- =====================================================================
-- SnapGain — Phase B.3: seed initial UK catalog
--
-- Adds slug + is_active + updated_at to miles_programs (consistency).
-- Seeds:
--   stores          — 15 popular UK retailers
--   platform        — 24 platforms split by type:
--                       cashback   (8): TopCashback, Quidco, Complete Savings,
--                                       Airtime Rewards, Cheddar, Rakuten, Honey, Widilo
--                       gift_card  (4): JamDoughnut, NX Rewards, EverUp, HyperJar
--                       card       (7): Amex Gold, Barclaycard Avios, Chase UK,
--                                       Monzo, Revolut, Curve, HSBC Premier
--                       bank_offer (5): Amex Offers, Barclays Blue Rewards,
--                                       Lloyds Everyday Offers, HSBC Home & Away,
--                                       Santander Boost
--   miles_programs  — 8 airline & loyalty programs with GBP conversion rates
--   cashback_offers — sample TopCashback + Quidco rate per store
--   point_offers    — sample Avios earn rate per store
--
-- Idempotent on slug / code (UPSERT). Re-running won't duplicate.
-- =====================================================================

-- ---------------------------------------------------------------------
-- Add slug + is_active + updated_at to miles_programs (was missing)
-- ---------------------------------------------------------------------
alter table public.miles_programs add column if not exists slug       text;
alter table public.miles_programs add column if not exists is_active  boolean not null default true;
alter table public.miles_programs add column if not exists updated_at timestamptz not null default now();
create unique index if not exists miles_programs_slug_uniq on public.miles_programs (slug) where slug is not null;

drop trigger if exists miles_programs_set_updated_at on public.miles_programs;
create trigger miles_programs_set_updated_at
  before update on public.miles_programs
  for each row execute function public.tg_set_updated_at();

-- ---------------------------------------------------------------------
-- 1. STORES (15 popular UK retailers)
-- ---------------------------------------------------------------------
insert into public.stores (slug, name, category, is_featured, is_active) values
  ('amazon',         'Amazon',          array['general'],     true,  true),
  ('apple',          'Apple',           array['electronics'], true,  true),
  ('argos',          'Argos',           array['general'],     false, true),
  ('asos',           'ASOS',            array['fashion'],     true,  true),
  ('booking-com',    'Booking.com',     array['travel'],      true,  true),
  ('boots',          'Boots',           array['health'],      false, true),
  ('currys',         'Currys',          array['electronics'], true,  true),
  ('ikea',           'IKEA',            array['home'],        true,  true),
  ('john-lewis',     'John Lewis',      array['department'],  false, true),
  ('marks-spencer',  'Marks & Spencer', array['department'],  false, true),
  ('next',           'Next',            array['fashion'],     false, true),
  ('nike',           'Nike',            array['fashion'],     true,  true),
  ('sainsburys',     'Sainsbury''s',    array['groceries'],   false, true),
  ('tesco',          'Tesco',           array['groceries'],   true,  true),
  ('waitrose',       'Waitrose',        array['groceries'],   false, true)
on conflict (slug) do update set
  name        = excluded.name,
  category    = excluded.category,
  is_featured = excluded.is_featured,
  is_active   = excluded.is_active,
  updated_at  = now();

-- ---------------------------------------------------------------------
-- 2. PLATFORMS (cashback, gift_card, card, bank_offer)
--    code is the unique key, slug mirrors it.
-- ---------------------------------------------------------------------
insert into public.platform (code, slug, name, type, country, is_active, base_rate_display, notes) values
  -- Cashback
  ('topcashback',           'topcashback',           'TopCashback',             'cashback',   'UK', true, 'up to 12%',       'Largest UK cashback site'),
  ('quidco',                'quidco',                'Quidco',                  'cashback',   'UK', true, 'up to 10%',       null),
  ('complete-savings',      'complete-savings',      'Complete Savings',        'cashback',   'UK', true, '£10 cashback',    'Subscription required'),
  ('airtime-rewards',       'airtime-rewards',       'Airtime Rewards',         'cashback',   'UK', true, 'mobile bill off', 'Cashback applied to mobile bill'),
  ('cheddar',               'cheddar',               'Cheddar',                 'cashback',   'UK', true, 'instant',         'Open Banking cashback app'),
  ('rakuten-uk',            'rakuten-uk',            'Rakuten',                 'cashback',   'UK', true, 'up to 10%',       null),
  ('honey',                 'honey',                 'Honey',                   'cashback',   'UK', true, 'Honey Gold',      'Browser extension + coupons'),
  ('widilo',                'widilo',                'Widilo',                  'cashback',   'UK', true, 'up to 8%',        null),
  -- Gift card discount platforms
  ('jamdoughnut',           'jamdoughnut',           'JamDoughnut',             'gift_card',  'UK', true, 'up to 15% off',   'Buy gift cards at a discount'),
  ('nx-rewards',            'nx-rewards',            'NX Rewards',              'gift_card',  'UK', true, 'up to 10% off',   null),
  ('everup',                'everup',                'EverUp',                  'gift_card',  'UK', true, 'up to 8% off',    'Round-up + gift cards'),
  ('hyperjar',              'hyperjar',              'HyperJar',                'gift_card',  'UK', true, 'up to 4.8% off',  'Jam Jar money management'),
  -- Cards
  ('amex-gold',             'amex-gold',             'Amex Gold',               'card',       'UK', true, '1 MR/£ + offers',  null),
  ('amex-platinum',         'amex-platinum',         'Amex Platinum',           'card',       'UK', true, '1 MR/£ + offers',  null),
  ('barclaycard-avios',     'barclaycard-avios',     'Barclaycard Avios',       'card',       'UK', true, '1 Avios/£',        null),
  ('chase-uk',              'chase-uk',              'Chase UK Debit',          'card',       'UK', true, '1% cashback',      'On eligible spend, capped'),
  ('monzo',                 'monzo',                 'Monzo',                   'card',       'UK', true, '—',                'Used for tracking/Plus offers'),
  ('revolut',               'revolut',               'Revolut',                 'card',       'UK', true, 'RevPoints',        'Tier-based rewards'),
  ('curve',                 'curve',                 'Curve',                   'card',       'UK', true, 'pass-through',     'Stack underlying card rewards'),
  ('hsbc-premier',          'hsbc-premier',          'HSBC Premier',            'card',       'UK', true, 'home & away',      null),
  -- Bank-linked offers
  ('amex-offers',           'amex-offers',           'Amex Offers',             'bank_offer', 'UK', true, 'spend & save',     'Card-linked statement credits'),
  ('barclays-blue-rewards', 'barclays-blue-rewards', 'Barclays Blue Rewards',   'bank_offer', 'UK', true, 'tiered cashback',  null),
  ('lloyds-everyday',       'lloyds-everyday',       'Lloyds Everyday Offers',  'bank_offer', 'UK', true, '1-15% cashback',   null),
  ('hsbc-home-and-away',    'hsbc-home-and-away',    'HSBC Home & Away',        'bank_offer', 'UK', true, 'spend & save',     null),
  ('santander-boost',       'santander-boost',       'Santander Boost',         'bank_offer', 'UK', true, 'tiered cashback',  null)
on conflict (code) do update set
  slug              = excluded.slug,
  name              = excluded.name,
  type              = excluded.type,
  country           = excluded.country,
  is_active         = excluded.is_active,
  base_rate_display = excluded.base_rate_display,
  notes             = excluded.notes,
  updated_at        = now();

-- ---------------------------------------------------------------------
-- 3. MILES_PROGRAMS (8 airline & loyalty programs)
--    conversion_rate = approx GBP value per unit (£0.01 = 1 pence)
-- ---------------------------------------------------------------------
insert into public.miles_programs (id, slug, name, conversion_rate, booster_url, is_active) values
  (gen_random_uuid(), 'ba-avios',          'British Airways Avios',         0.010, 'https://www.shopping.ba.com/',     true),
  (gen_random_uuid(), 'virgin-points',     'Virgin Points',                 0.010, 'https://shop.virginatlantic.com/', true),
  (gen_random_uuid(), 'flying-blue',       'Flying Blue (Air France/KLM)',  0.012, null,                                true),
  (gen_random_uuid(), 'emirates-skywards', 'Emirates Skywards',             0.015, null,                                true),
  (gen_random_uuid(), 'qatar-avios',       'Qatar Privilege Club (Avios)',  0.010, null,                                true),
  (gen_random_uuid(), 'etihad-guest',      'Etihad Guest',                  0.010, null,                                true),
  (gen_random_uuid(), 'nectar',            'Nectar',                        0.005, 'https://www.nectar.com/',          true),
  (gen_random_uuid(), 'amex-mr',           'Amex Membership Rewards',       0.010, null,                                true)
on conflict (slug) do update set
  name            = excluded.name,
  conversion_rate = excluded.conversion_rate,
  booster_url     = excluded.booster_url,
  is_active       = excluded.is_active,
  updated_at      = now();

-- ---------------------------------------------------------------------
-- 4. SAMPLE CASHBACK_OFFERS — TopCashback baseline rate per store
--    These are placeholder rates; admin can refine per-store later.
-- ---------------------------------------------------------------------
insert into public.cashback_offers (store_id, platform, rate, affiliate_link, is_active, last_verified_at)
select s.id, 'TopCashback', 4.50, 'https://www.topcashback.co.uk/' || s.slug, true, now()
from public.stores s
where s.slug in ('amazon','argos','asos','boots','currys','ikea','john-lewis','marks-spencer','next','nike','sainsburys','tesco','waitrose','booking-com');

insert into public.cashback_offers (store_id, platform, rate, affiliate_link, is_active, last_verified_at)
select s.id, 'Quidco', 3.80, 'https://www.quidco.com/' || s.slug, true, now()
from public.stores s
where s.slug in ('amazon','asos','currys','ikea','john-lewis','nike','tesco','booking-com');

-- Apple typically pays a tiny cashback rate; reflect that
insert into public.cashback_offers (store_id, platform, rate, affiliate_link, is_active, last_verified_at)
select s.id, 'TopCashback', 1.00, 'https://www.topcashback.co.uk/apple', true, now()
from public.stores s where s.slug = 'apple';

-- ---------------------------------------------------------------------
-- 5. SAMPLE POINT_OFFERS — Avios earn rate per store
-- ---------------------------------------------------------------------
insert into public.point_offers (store_id, airline, earn_rate, booster_available, is_active, last_verified_at)
select s.id, 'British Airways Avios', 6.0, false, true, now()
from public.stores s
where s.slug in ('amazon','apple','argos','asos','boots','currys','ikea','john-lewis','marks-spencer','next','nike','tesco','waitrose');

-- Booking.com runs higher Avios bonuses periodically; mark booster_available
insert into public.point_offers (store_id, airline, earn_rate, booster_available, is_active, last_verified_at)
select s.id, 'British Airways Avios', 8.0, true, true, now()
from public.stores s where s.slug = 'booking-com';

-- Sainsbury's = Nectar territory
insert into public.point_offers (store_id, airline, earn_rate, booster_available, is_active, last_verified_at)
select s.id, 'Nectar', 1.0, false, true, now()
from public.stores s where s.slug = 'sainsburys';
