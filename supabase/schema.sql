-- FlowLeads Supabase Schema
-- Run in Supabase SQL Editor

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- LEADS table
CREATE TABLE IF NOT EXISTS leads (
  id            uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at    timestamptz DEFAULT now(),
  icon          text,
  title         text NOT NULL,
  detail        text,
  category      text NOT NULL,
  location      text,
  budget_min    integer,
  budget_max    integer,
  price         integer NOT NULL,
  contact_name  text,
  contact_email text,
  contact_phone text,
  status        text DEFAULT 'available',
  exclusive     boolean DEFAULT true,
  verified      boolean DEFAULT false
);

-- LEAD_PURCHASES table
CREATE TABLE IF NOT EXISTS lead_purchases (
  id                uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at        timestamptz DEFAULT now(),
  lead_id           uuid REFERENCES leads(id),
  buyer_name        text NOT NULL,
  buyer_email       text NOT NULL,
  buyer_phone       text,
  buyer_company     text,
  amount_paid       integer,
  stripe_payment_id text,
  status            text DEFAULT 'pending'
);

-- LEAD_REQUESTS table (contact form submissions)
CREATE TABLE IF NOT EXISTS lead_requests (
  id         uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at timestamptz DEFAULT now(),
  name       text NOT NULL,
  email      text NOT NULL,
  phone      text,
  lead_type  text,
  location   text,
  budget     text,
  status     text DEFAULT 'new'
);

-- RLS
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_requests ENABLE ROW LEVEL SECURITY;

-- Public can view available leads (without contact info)
CREATE POLICY "Public view available leads" ON leads FOR SELECT USING (status = 'available');

-- Service role full access
CREATE POLICY "Service role leads" ON leads FOR ALL TO service_role USING (true);
CREATE POLICY "Service role purchases" ON lead_purchases FOR ALL TO service_role USING (true);
CREATE POLICY "Service role requests" ON lead_requests FOR ALL TO service_role USING (true);

-- SEED DATA
INSERT INTO leads (icon, title, detail, category, location, budget_min, budget_max, price, status, verified) VALUES
('🍕', 'Pizza concept, East London', 'Ghost kitchen · £1,500–3,000/mo budget · ready to start immediately', 'commercial_kitchen', 'East London', 1500, 3000, 4500, 'available', true),
('🚐', 'Street food trader, Manchester', 'Catering van buyer · budget £25–40k · experienced operator', 'catering_van', 'Manchester', 25000, 40000, 9500, 'available', true),
('☕', 'Coffee subscription startup, Birmingham', 'Food startup · needs accountant + insurance · just launched', 'food_startup', 'Birmingham', 0, 0, 3500, 'available', true),
('🥡', 'Dark kitchen operator, Leeds', 'Commercial kitchen · immediate start · needs Deliveroo-compatible kitchen', 'commercial_kitchen', 'Leeds', 2000, 4000, 6000, 'available', true),
('🌮', 'Mexican street food, Bristol', 'Catering van buyer · first van · budget £20–35k · events focused', 'catering_van', 'Bristol', 20000, 35000, 8500, 'available', true),
('🧁', 'Bakery brand, North London', 'Commercial kitchen · 3 days/week needed · pastry and bread production', 'commercial_kitchen', 'North London', 800, 2000, 4000, 'available', true),
('🍱', 'Meal prep business, Glasgow', 'Food startup · looking for accountant + food safety consultancy', 'food_startup', 'Glasgow', 0, 0, 3000, 'available', false),
('🔧', 'Restaurant fit-out, Cardiff', 'Equipment buyer · full commercial kitchen fit-out · budget £15–30k', 'equipment', 'Cardiff', 15000, 30000, 7500, 'available', true);
