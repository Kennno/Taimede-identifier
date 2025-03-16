-- Drop beta-related tables with CASCADE to remove dependent objects
DROP TABLE IF EXISTS beta_applications CASCADE;
DROP TABLE IF EXISTS beta_users CASCADE;
DROP TABLE IF EXISTS beta_feedback CASCADE;

-- Remove beta-related feature flags
DELETE FROM feature_flags WHERE name LIKE '%beta%';

-- Remove beta-related email templates
DELETE FROM email_templates WHERE name LIKE '%beta%';
