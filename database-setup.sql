-- SnapGain UK - Database Schema Setup
-- Tables for real-time cashback rates and user data

-- 1. Cashback Rates Table (Real-time updates)
CREATE TABLE IF NOT EXISTS cashback_rates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  store VARCHAR(100) NOT NULL,
  platform VARCHAR(50) NOT NULL,
  rate DECIMAL(5,2) NOT NULL, -- e.g., 5.50 for 5.50%
  currency VARCHAR(3) DEFAULT 'GBP',
  category VARCHAR(50),
  special_offer TEXT,
  is_active BOOLEAN DEFAULT true,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(store, platform)
);

-- 2. User Preferences Table
CREATE TABLE IF NOT EXISTS user_preferences (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  preferred_stores TEXT[], -- Array of store IDs
  preferred_platforms TEXT[], -- Array of platform IDs
  notification_threshold DECIMAL(3,2) DEFAULT 1.00, -- Notify when rate changes by X%
  email_notifications BOOLEAN DEFAULT true,
  push_notifications BOOLEAN DEFAULT true,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Rate History Table (For tracking changes)
CREATE TABLE IF NOT EXISTS rate_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  cashback_rate_id UUID REFERENCES cashback_rates(id) ON DELETE CASCADE,
  old_rate DECIMAL(5,2),
  new_rate DECIMAL(5,2),
  change_percentage DECIMAL(5,2),
  changed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. User Sessions Table (For analytics)
CREATE TABLE IF NOT EXISTS user_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  session_start TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  session_end TIMESTAMP WITH TIME ZONE,
  searches_count INTEGER DEFAULT 0,
  comparisons_made INTEGER DEFAULT 0,
  last_activity TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert sample UK data
INSERT INTO cashback_rates (store, platform, rate, category, special_offer) VALUES
-- TopCashback UK rates
('amazon-uk', 'topcashback', 1.50, 'marketplace', 'Prime members get extra 0.5%'),
('john-lewis', 'topcashback', 3.00, 'department-store', 'Double cashback on weekends'),
('currys', 'topcashback', 2.50, 'electronics', null),
('argos', 'topcashback', 2.00, 'general-retail', null),
('boots', 'topcashback', 4.00, 'health-beauty', 'Advantage Card holders get extra 1%'),
('tesco', 'topcashback', 1.00, 'grocery', 'Clubcard points + cashback'),

-- JamDoughnut rates (student-focused)
('asos', 'jamdoughnut', 6.00, 'fashion', 'Student discount + cashback'),
('boohoo', 'jamdoughnut', 8.00, 'fashion', 'Exclusive young professional deals'),
('nike', 'jamdoughnut', 3.00, 'sportswear', 'Student ID required'),
('spotify', 'jamdoughnut', 12.00, 'streaming', 'Annual subscriptions only'),
('uber-eats', 'jamdoughnut', 5.00, 'food-delivery', 'First 3 orders get double cashback'),

-- Amazon UK direct rates
('amazon-uk', 'amazon-direct', 1.00, 'marketplace', 'Lightning deals up to 3%'),
('amazon-fresh', 'amazon-direct', 2.00, 'grocery', 'Prime members only'),

-- Quidco rates
('sainsburys', 'quidco', 2.50, 'grocery', 'Nectar points eligible'),
('marks-spencer', 'quidco', 3.50, 'retail', 'M&S Sparks members get extra'),
('very', 'quidco', 4.00, 'retail', 'Pay monthly options available')
ON CONFLICT (store, platform) DO UPDATE SET
  rate = EXCLUDED.rate,
  special_offer = EXCLUDED.special_offer,
  updated_at = NOW();

-- Enable Row Level Security
ALTER TABLE cashback_rates ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE rate_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for cashback_rates (public read, admin write)
CREATE POLICY "Anyone can view cashback rates" ON cashback_rates
  FOR SELECT USING (true);

CREATE POLICY "Only authenticated users can insert rates" ON cashback_rates
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Only service role can update rates" ON cashback_rates
  FOR UPDATE USING (auth.role() = 'service_role');

-- RLS Policies for user_preferences (user-specific)
CREATE POLICY "Users can view own preferences" ON user_preferences
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own preferences" ON user_preferences
  FOR ALL USING (auth.uid() = user_id);

-- Functions for real-time updates
CREATE OR REPLACE FUNCTION update_cashback_rate_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION log_rate_change()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.rate != NEW.rate THEN
    INSERT INTO rate_history (cashback_rate_id, old_rate, new_rate, change_percentage)
    VALUES (
      NEW.id, 
      OLD.rate, 
      NEW.rate, 
      ROUND(((NEW.rate - OLD.rate) / OLD.rate * 100), 2)
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers
CREATE TRIGGER update_cashback_rates_timestamp
  BEFORE UPDATE ON cashback_rates
  FOR EACH ROW
  EXECUTE FUNCTION update_cashback_rate_timestamp();

CREATE TRIGGER log_cashback_rate_changes
  AFTER UPDATE ON cashback_rates
  FOR EACH ROW
  EXECUTE FUNCTION log_rate_change();

-- Enable realtime on tables
ALTER PUBLICATION supabase_realtime ADD TABLE cashback_rates;
ALTER PUBLICATION supabase_realtime ADD TABLE rate_history;
ALTER PUBLICATION supabase_realtime ADD TABLE user_preferences;
