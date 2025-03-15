-- Add a usage_count field to users table to track identification usage
ALTER TABLE IF EXISTS users 
ADD COLUMN IF NOT EXISTS identification_count INTEGER DEFAULT 0;

-- Add a subscription_tier field to users table
ALTER TABLE IF EXISTS users 
ADD COLUMN IF NOT EXISTS subscription_tier TEXT DEFAULT 'registered' CHECK (subscription_tier IN ('registered', 'premium'));

-- Create a function to increment the identification count
CREATE OR REPLACE FUNCTION increment_identification_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE users
  SET identification_count = identification_count + 1
  WHERE user_id = NEW.user_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create a trigger to increment the count when a new search is added
DROP TRIGGER IF EXISTS increment_count_on_search ON recent_searches;
CREATE TRIGGER increment_count_on_search
AFTER INSERT ON recent_searches
FOR EACH ROW
EXECUTE FUNCTION increment_identification_count();
