-- Drop all admin-related tables with CASCADE to remove dependent objects
DROP TABLE IF EXISTS admin_logs CASCADE;
DROP TABLE IF EXISTS admins CASCADE;

-- Drop beta-related tables that depend on admin roles
DROP TABLE IF EXISTS beta_applications CASCADE;
DROP TABLE IF EXISTS beta_users CASCADE;
DROP TABLE IF EXISTS beta_feedback CASCADE;

-- Remove admin-related feature flags
DELETE FROM feature_flags WHERE name LIKE '%admin%';

-- Remove admin-related email templates
DELETE FROM email_templates WHERE name LIKE '%admin%';

-- Update policies for remaining tables to remove admin dependencies
-- Feature flags
DROP POLICY IF EXISTS "Only admins can modify feature flags" ON feature_flags;

-- Roadmap milestones
DROP POLICY IF EXISTS "Only content managers and super admins can modify roadmap milestones" ON roadmap_milestones;
CREATE POLICY "Only authenticated users can modify roadmap milestones"
  ON roadmap_milestones FOR ALL
  USING (auth.role() = 'authenticated');

-- Plants
DROP POLICY IF EXISTS "Only content managers and super admins can modify plants" ON plants;
CREATE POLICY "Only authenticated users can modify plants"
  ON plants FOR ALL
  USING (auth.role() = 'authenticated');

-- Plant reports
DROP POLICY IF EXISTS "Admins can view all reports" ON plant_reports;
DROP POLICY IF EXISTS "Content managers and super admins can update reports" ON plant_reports;
CREATE POLICY "Authenticated users can view all reports"
  ON plant_reports FOR SELECT
  USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can update reports"
  ON plant_reports FOR UPDATE
  USING (auth.role() = 'authenticated');

-- Site settings
DROP POLICY IF EXISTS "Only super admins can modify site settings" ON site_settings;
CREATE POLICY "Only authenticated users can modify site settings"
  ON site_settings FOR ALL
  USING (auth.role() = 'authenticated');

-- Email templates
DROP POLICY IF EXISTS "Admins can view email templates" ON email_templates;
DROP POLICY IF EXISTS "Only super admins can modify email templates" ON email_templates;
CREATE POLICY "Authenticated users can view email templates"
  ON email_templates FOR SELECT
  USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can modify email templates"
  ON email_templates FOR ALL
  USING (auth.role() = 'authenticated');
