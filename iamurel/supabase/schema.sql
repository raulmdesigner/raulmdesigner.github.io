-- Schema Setup for IAMUREL
-- Run this in your Supabase SQL Editor

-- Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enum Types
CREATE TYPE lead_status AS ENUM ('novo', 'em_analise', 'contatado', 'proposta_enviada', 'ganho', 'perdido', 'arquivado');
CREATE TYPE lead_priority AS ENUM ('low', 'medium', 'high');
CREATE TYPE package_level AS ENUM ('Essencial', 'Recomendado', 'Profissional', 'Ultra');
CREATE TYPE package_price_type AS ENUM ('fixed', 'starting_at', 'on_request', 'hidden');
CREATE TYPE active_status AS ENUM ('active', 'archived');
CREATE TYPE task_status AS ENUM ('pending', 'completed');

-- 1. Site Settings
CREATE TABLE iamurel_site_settings (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL DEFAULT 'IAMUREL',
  description text NOT NULL,
  hero_title text NOT NULL,
  hero_subtitle text NOT NULL,
  primary_cta_text text NOT NULL DEFAULT 'Falar sobre um projeto',
  secondary_cta_text text NOT NULL DEFAULT 'Ver como funciona',
  contact_email text NOT NULL,
  updated_at timestamptz DEFAULT now()
);

-- 2. Services
CREATE TABLE iamurel_services (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  title text NOT NULL,
  problem_solved text NOT NULL,
  deliverables text NOT NULL,
  target_audience text NOT NULL,
  not_included text NOT NULL,
  timeframe text NOT NULL,
  investment_range text,
  image_url text,
  order_index integer NOT NULL DEFAULT 0,
  status active_status NOT NULL DEFAULT 'active',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 3. Packages
CREATE TABLE iamurel_packages (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  level package_level NOT NULL,
  commercial_role text NOT NULL,
  description text NOT NULL,
  price numeric(10,2),
  price_type package_price_type NOT NULL DEFAULT 'on_request',
  revisions text NOT NULL,
  timeframe text NOT NULL,
  is_highlighted boolean NOT NULL DEFAULT false,
  order_index integer NOT NULL DEFAULT 0,
  status active_status NOT NULL DEFAULT 'active',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE iamurel_package_items (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  package_id uuid REFERENCES iamurel_packages(id) ON DELETE CASCADE,
  title text NOT NULL,
  quantity text,
  order_index integer NOT NULL DEFAULT 0
);

-- 4. Showcases
CREATE TABLE iamurel_showcases (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  title text NOT NULL,
  label text NOT NULL CHECK (label IN ('demonstration', 'author_study', 'process_example')),
  context text NOT NULL,
  decision text NOT NULL,
  deliverable text NOT NULL,
  image_url text,
  order_index integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- 5. FAQ
CREATE TABLE iamurel_faq (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  question text NOT NULL,
  answer text NOT NULL,
  order_index integer NOT NULL DEFAULT 0
);

-- 6. Leads (CRM)
CREATE TABLE iamurel_leads (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  business_name text NOT NULL,
  need text NOT NULL,
  objective text NOT NULL,
  timeframe text NOT NULL,
  investment_range text,
  preferred_channel text NOT NULL,
  message text,
  origin text,
  consent boolean NOT NULL DEFAULT true,
  status lead_status NOT NULL DEFAULT 'novo',
  priority lead_priority NOT NULL DEFAULT 'medium',
  service_interest text,
  package_interest text,
  last_contact_at timestamptz,
  next_follow_up_at timestamptz,
  assigned_to uuid, -- references auth.users in real implementation
  tags text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 7. Lead Notes
CREATE TABLE iamurel_lead_notes (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  lead_id uuid REFERENCES iamurel_leads(id) ON DELETE CASCADE,
  content text NOT NULL,
  created_by uuid, -- references auth.users
  created_at timestamptz DEFAULT now()
);

-- 8. Lead Events (Audit)
CREATE TABLE iamurel_lead_events (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  lead_id uuid REFERENCES iamurel_leads(id) ON DELETE CASCADE,
  event_type text NOT NULL,
  old_value text,
  new_value text,
  created_by uuid, -- references auth.users
  created_at timestamptz DEFAULT now()
);

-- 9. Tasks
CREATE TABLE iamurel_tasks (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  lead_id uuid REFERENCES iamurel_leads(id) ON DELETE CASCADE,
  title text NOT NULL,
  due_date timestamptz NOT NULL,
  status task_status NOT NULL DEFAULT 'pending',
  created_by uuid, -- references auth.users
  created_at timestamptz DEFAULT now()
);

-- 10. Audit Log
CREATE TABLE iamurel_audit_log (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  table_name text NOT NULL,
  record_id uuid NOT NULL,
  action text NOT NULL,
  changes jsonb,
  created_by uuid, -- references auth.users
  created_at timestamptz DEFAULT now()
);

-- ---
-- RLS POLICIES
-- ---
ALTER TABLE iamurel_site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE iamurel_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE iamurel_packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE iamurel_package_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE iamurel_showcases ENABLE ROW LEVEL SECURITY;
ALTER TABLE iamurel_faq ENABLE ROW LEVEL SECURITY;
ALTER TABLE iamurel_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE iamurel_lead_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE iamurel_lead_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE iamurel_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE iamurel_audit_log ENABLE ROW LEVEL SECURITY;

-- Public Read Access for Site Content
CREATE POLICY "Public Read Settings" ON iamurel_site_settings FOR SELECT USING (true);
CREATE POLICY "Public Read Services" ON iamurel_services FOR SELECT USING (status = 'active');
CREATE POLICY "Public Read Packages" ON iamurel_packages FOR SELECT USING (status = 'active');
CREATE POLICY "Public Read Package Items" ON iamurel_package_items FOR SELECT USING (true);
CREATE POLICY "Public Read Showcases" ON iamurel_showcases FOR SELECT USING (true);
CREATE POLICY "Public Read FAQ" ON iamurel_faq FOR SELECT USING (true);

-- Public Insert Access for Leads (Forms)
CREATE POLICY "Public Insert Lead" ON iamurel_leads FOR INSERT WITH CHECK (true);
-- Note: NO public select policy for leads to prevent data leakage!

-- Admin Access (Requires authenticated user)
-- In a real scenario, check if the auth.uid() belongs to an admin group.
CREATE POLICY "Admin All Access Settings" ON iamurel_site_settings FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin All Access Services" ON iamurel_services FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin All Access Packages" ON iamurel_packages FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin All Access Package Items" ON iamurel_package_items FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin All Access Showcases" ON iamurel_showcases FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin All Access FAQ" ON iamurel_faq FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin All Access Leads" ON iamurel_leads FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin All Access Lead Notes" ON iamurel_lead_notes FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin All Access Lead Events" ON iamurel_lead_events FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin All Access Tasks" ON iamurel_tasks FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin All Access Audit Log" ON iamurel_audit_log FOR ALL USING (auth.role() = 'authenticated');

-- Indexes for performance
CREATE INDEX idx_leads_status ON iamurel_leads(status);
CREATE INDEX idx_services_order ON iamurel_services(order_index);
CREATE INDEX idx_packages_order ON iamurel_packages(order_index);
