-- Drop cookie_consent table if it exists
DROP TABLE IF EXISTS cookie_consent;

-- Drop cookie_preferences table if it exists
DROP TABLE IF EXISTS cookie_preferences;

-- Drop any functions related to cookies
DROP FUNCTION IF EXISTS get_cookie_consent(user_id UUID);
DROP FUNCTION IF EXISTS set_cookie_consent(user_id UUID, consent BOOLEAN);
