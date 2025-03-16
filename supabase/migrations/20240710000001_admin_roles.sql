-- This migration is superseded by 20240713000001_remove_all_admin_related_code.sql

-- Create feature_flags table
CREATE TABLE IF NOT EXISTS feature_flags (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  enabled BOOLEAN NOT NULL DEFAULT false,
  beta_only BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable row level security
ALTER TABLE feature_flags ENABLE ROW LEVEL SECURITY;

-- Create policies for feature_flags table
DROP POLICY IF EXISTS "Everyone can view feature flags" ON feature_flags;
CREATE POLICY "Everyone can view feature flags"
  ON feature_flags FOR SELECT
  USING (true);

-- Create roadmap_milestones table for content management
CREATE TABLE IF NOT EXISTS roadmap_milestones (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('completed', 'in-progress', 'planned', 'future')),
  icon TEXT,
  sort_order INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable row level security
ALTER TABLE roadmap_milestones ENABLE ROW LEVEL SECURITY;

-- Create policies for roadmap_milestones table
DROP POLICY IF EXISTS "Everyone can view roadmap milestones" ON roadmap_milestones;
CREATE POLICY "Everyone can view roadmap milestones"
  ON roadmap_milestones FOR SELECT
  USING (true);

-- Create plants table if it doesn't exist
CREATE TABLE IF NOT EXISTS plants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  scientific_name TEXT NOT NULL,
  description TEXT,
  care_instructions JSONB,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on name and scientific_name for faster lookups
CREATE INDEX IF NOT EXISTS plants_name_idx ON plants(name);
CREATE INDEX IF NOT EXISTS plants_scientific_name_idx ON plants(scientific_name);

-- Enable row level security
ALTER TABLE plants ENABLE ROW LEVEL SECURITY;

-- Create policies for plants table
DROP POLICY IF EXISTS "Everyone can view plants" ON plants;
CREATE POLICY "Everyone can view plants"
  ON plants FOR SELECT
  USING (true);

-- Create plant_reports table for misidentifications
CREATE TABLE IF NOT EXISTS plant_reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  plant_id UUID REFERENCES plants(id) ON DELETE CASCADE,
  search_id UUID REFERENCES recent_searches(id) ON DELETE SET NULL,
  issue TEXT NOT NULL,
  suggested_name TEXT,
  status TEXT NOT NULL CHECK (status IN ('pending', 'reviewed', 'resolved', 'rejected')) DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on user_id and status for faster lookups
CREATE INDEX IF NOT EXISTS plant_reports_user_id_idx ON plant_reports(user_id);
CREATE INDEX IF NOT EXISTS plant_reports_status_idx ON plant_reports(status);

-- Enable row level security
ALTER TABLE plant_reports ENABLE ROW LEVEL SECURITY;

-- Create policies for plant_reports table
DROP POLICY IF EXISTS "Users can view their own reports" ON plant_reports;
CREATE POLICY "Users can view their own reports"
  ON plant_reports FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own reports" ON plant_reports;
CREATE POLICY "Users can insert their own reports"
  ON plant_reports FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create site_settings table for global settings
CREATE TABLE IF NOT EXISTS site_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key TEXT NOT NULL UNIQUE,
  value JSONB NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable row level security
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Create policies for site_settings table
DROP POLICY IF EXISTS "Everyone can view site settings" ON site_settings;
CREATE POLICY "Everyone can view site settings"
  ON site_settings FOR SELECT
  USING (true);

-- Create email_templates table
CREATE TABLE IF NOT EXISTS email_templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  subject TEXT NOT NULL,
  body TEXT NOT NULL,
  variables JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable row level security
ALTER TABLE email_templates ENABLE ROW LEVEL SECURITY;

-- Add realtime publication for all tables
alter publication supabase_realtime add table feature_flags;
alter publication supabase_realtime add table roadmap_milestones;
alter publication supabase_realtime add table plants;
alter publication supabase_realtime add table plant_reports;
alter publication supabase_realtime add table site_settings;
alter publication supabase_realtime add table email_templates;
