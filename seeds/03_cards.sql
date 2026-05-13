-- ╔══════════════════════════════════════════════════════════════════╗
-- ║  Credit / Debit Cards — public.platform (type = 'card')          ║
-- ║                                                                  ║
-- ║  Hardcoded catalog of ~30 UK reward cards with their headline    ║
-- ║  cashback / points rate and optional affiliate URL.              ║
-- ║                                                                  ║
-- ║  Idempotent (ON CONFLICT). Re-run any time you update rates.     ║
-- ║                                                                  ║
-- ║  After running:                                                  ║
-- ║   - All cards appear in Profile's "My Credit Cards" dropdown     ║
-- ║   - Compare page can factor card rewards into the strategy       ║
-- ║   - When you click "Apply for this card" we use affiliate_url    ║
-- ╚══════════════════════════════════════════════════════════════════╝

-- Defensive: ensure required columns exist
ALTER TABLE public.platform ADD COLUMN IF NOT EXISTS affiliate_url     text;
ALTER TABLE public.platform ADD COLUMN IF NOT EXISTS base_rate_display text;
ALTER TABLE public.platform ADD COLUMN IF NOT EXISTS notes             text;

INSERT INTO public.platform (code, slug, name, type, base_rate_display, notes, is_active, affiliate_url) VALUES
  -- ─── American Express ─────────────────────────────────────────
  ('AMEX_PLAT_CASHBACK_EVERYDAY','amex-platinum-cashback-everyday','Amex Platinum Cashback Everyday','card','Up to 5%','Up to 5% intro (£2.5k/3mo), 0.5% on first £10k/year then 1%. No annual fee.',true,NULL),
  ('AMEX_PLAT_CASHBACK','amex-platinum-cashback','Amex Platinum Cashback','card','Up to 5%','Up to 5% intro, then 0.75% / 1.25%. £25/year annual fee.',true,NULL),
  ('AMEX_PREFERRED_REWARDS_GOLD','amex-preferred-rewards-gold','Amex Preferred Rewards Gold','card','1 pt/£','MR points → Avios 1:1, Nectar 1:1. £160/year, fee-free Y1.',true,NULL),
  ('AMEX_PLATINUM_CHARGE','amex-platinum-charge','Amex Platinum Charge','card','1 pt/£','MR points + Priority Pass + insurance. £650/year.',true,NULL),
  ('AMEX_BA','ba-amex','British Airways Amex','card','1 Avios/£','2,000 Avios bonus + 5,000 spent £2k. Free card.',true,NULL),
  ('AMEX_BA_PREMIUM','ba-amex-premium-plus','BA Amex Premium Plus','card','1.5 Avios/£','£250/year. Companion voucher with £15k annual spend.',true,NULL),
  ('AMEX_VITALITY','amex-vitality','Amex Vitality','card','Up to 1%','Health-linked rewards (Apple Watch path, gym).',true,NULL),

  -- ─── Barclaycard ─────────────────────────────────────────────
  ('BARCLAYCARD_AVIOS_PLUS','barclaycard-avios-plus','Barclaycard Avios Plus','card','1.5 Avios/£','£20/month. Companion voucher with £10k annual spend.',true,NULL),
  ('BARCLAYCARD_AVIOS','barclaycard-avios','Barclaycard Avios','card','1 Avios/£','Free card. 5,000 Avios sign-up bonus.',true,NULL),
  ('BARCLAYCARD_REWARDS','barclaycard-rewards','Barclaycard Rewards','card','0.25%','Cashback + good FX rates. Free.',true,NULL),

  -- ─── High street banks ───────────────────────────────────────
  ('CHASE_UK','chase-uk','Chase UK','card','1%','1% cashback on debit purchases (intro period). Free.',true,NULL),
  ('NATWEST_REWARD','natwest-reward','NatWest Reward','card','1%','£2/month. Cashback at selected partners.',true,NULL),
  ('HALIFAX_CASHBACK','halifax-cashback','Halifax Cashback Credit Card','card','0.25%','Free. 0.5% in promo periods.',true,NULL),
  ('HALIFAX_ELITE','halifax-elite','Halifax Elite','card','1%','Tiered cashback.',true,NULL),
  ('LLOYDS_CASHBACK','lloyds-cashback','Lloyds Bank Cashback Credit Card','card','0.25%','Free card.',true,NULL),
  ('LLOYDS_ELITE','lloyds-elite','Lloyds Elite','card','1%','Premium tier.',true,NULL),
  ('SANTANDER_EDGE_CC','santander-edge-cc','Santander Edge Credit Card','card','2% / 1%','2% first year (£36/year fee), then 1%.',true,NULL),
  ('SANTANDER_EDGE_DEBIT','santander-edge-debit','Santander Edge Debit','card','1%','£3/month. Cashback on bills and grocery.',true,NULL),
  ('HSBC_REWARDS','hsbc-rewards','HSBC Rewards','card','1%','Tiered, free card.',true,NULL),
  ('NATIONWIDE_FLEX_DIRECT','nationwide-flex-direct','Nationwide FlexDirect','card','1%','Debit cashback on selected partners.',true,NULL),

  -- ─── Store cards (loyalty + credit) ───────────────────────────
  ('TESCO_CLUBCARD_CC','tesco-clubcard-cc','Tesco Clubcard Credit Card','card','1 pt/£4','Points convert to partner vouchers.',true,NULL),
  ('SAINSBURYS_NECTAR_CC','sainsburys-nectar-cc','Sainsbury''s Nectar Credit Card','card','3 pts/£1','At Sainsbury''s. 1 pt/£1 elsewhere.',true,NULL),
  ('JOHN_LEWIS_CC','john-lewis-card','John Lewis Partnership Card','card','5 pts/£4','At John Lewis & Waitrose. 1 pt/£1 elsewhere.',true,NULL),
  ('ASDA_MONEY_CC','asda-money-cc','Asda Money Credit Card','card','Up to 2%','Higher rate at Asda.',true,NULL),
  ('MS_BANK_REWARD','ms-bank-reward','M&S Bank Reward Credit Card','card','1 pt/£','Points usable at M&S.',true,NULL),
  ('VIRGIN_MONEY_CC','virgin-money-cc','Virgin Money Credit Card','card','0.25%','Free card.',true,NULL),

  -- ─── Fintech ──────────────────────────────────────────────────
  ('REVOLUT_METAL','revolut-metal','Revolut Metal','card','Up to 1%','£14.99/month. 1% cashback outside Europe.',true,NULL),
  ('REVOLUT_ULTRA','revolut-ultra','Revolut Ultra','card','1 pt/£','£55/month. Convert points to Avios/Virgin Points.',true,NULL),
  ('MONESE_CASHBACK','monese-cashback','Monese Cashback','card','Up to 1.5%','In-app cashback partners.',true,NULL),
  ('MONZO_FLEX','monzo-flex','Monzo Flex','card','Varies','BNPL with cashback partners.',true,NULL),
  ('TRADING_212_CARD','trading-212-card','Trading 212 Card','card','1.5%','Cashback paid into your portfolio.',true,NULL),
  ('YONDER_CARD','yonder-card','Yonder Credit Card','card','Up to 2.5%','£15/month premium. Points + perks.',true,NULL),
  ('CURVE','curve-card','Curve','card','1%','Wallet-of-cards. 1% cashback on selected retailers (tiered).',true,NULL),
  ('UPHOLD_CARD','uphold-card','Uphold Card','card','1%','Crypto/cash cashback.',true,NULL),
  ('SUMUP_CARD','sumup-card','SumUp Card','card','0.5%','Small-business friendly.',true,NULL)
ON CONFLICT (slug) DO UPDATE SET
  name              = EXCLUDED.name,
  type              = EXCLUDED.type,
  base_rate_display = EXCLUDED.base_rate_display,
  notes             = EXCLUDED.notes,
  affiliate_url     = COALESCE(EXCLUDED.affiliate_url, platform.affiliate_url),
  is_active         = EXCLUDED.is_active,
  updated_at        = now();

-- Verify
SELECT count(*) AS total_cards FROM public.platform WHERE type = 'card';
