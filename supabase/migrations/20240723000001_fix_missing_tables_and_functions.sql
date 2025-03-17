-- Create usage_tracking table if it doesn't exist
CREATE TABLE IF NOT EXISTS usage_tracking (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  device_id TEXT NOT NULL,
  is_premium BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create device_tracking table if it doesn't exist
CREATE TABLE IF NOT EXISTS device_tracking (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  device_id TEXT NOT NULL,
  is_premium BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add RLS policies for usage_tracking
ALTER TABLE usage_tracking ENABLE ROW LEVEL SECURITY;

-- Allow users to see only their own usage
DROP POLICY IF EXISTS "Users can view their own usage" ON usage_tracking;
CREATE POLICY "Users can view their own usage"
  ON usage_tracking FOR SELECT
  USING (auth.uid() = user_id);

-- Allow the service role to manage all records
DROP POLICY IF EXISTS "Service role can manage all usage records" ON usage_tracking;
CREATE POLICY "Service role can manage all usage records"
  ON usage_tracking FOR ALL
  USING (auth.jwt() ->> 'role' = 'service_role');

-- Add RLS policies for device_tracking
ALTER TABLE device_tracking ENABLE ROW LEVEL SECURITY;

-- Allow the service role to manage all records
DROP POLICY IF EXISTS "Service role can manage all device records" ON device_tracking;
CREATE POLICY "Service role can manage all device records"
  ON device_tracking FOR ALL
  USING (auth.jwt() ->> 'role' = 'service_role');

-- Add these tables to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE usage_tracking;
ALTER PUBLICATION supabase_realtime ADD TABLE device_tracking;

-- Fix permissions for recent_searches table
ALTER TABLE IF EXISTS recent_searches ENABLE ROW LEVEL SECURITY;

-- Allow anonymous access to recent_searches
DROP POLICY IF EXISTS "Allow anonymous access" ON recent_searches;
CREATE POLICY "Allow anonymous access"
  ON recent_searches FOR SELECT
  USING (true);

-- Allow service role to manage all records
DROP POLICY IF EXISTS "Service role can manage all recent searches" ON recent_searches;
CREATE POLICY "Service role can manage all recent searches"
  ON recent_searches FOR ALL
  USING (auth.jwt() ->> 'role' = 'service_role');

-- Ensure the premium_usage functions are created
CREATE OR REPLACE FUNCTION increment_premium_usage(user_uuid UUID)
RETURNS void AS $$
DECLARE
  current_month VARCHAR(7);
BEGIN
  -- Get current month in YYYY-MM format
  current_month := to_char(NOW(), 'YYYY-MM');
  
  -- Insert or update the usage record
  INSERT INTO premium_usage (user_id, month, usage_count)
  VALUES (user_uuid, current_month, 1)
  ON CONFLICT (user_id, month)
  DO UPDATE SET 
    usage_count = premium_usage.usage_count + 1,
    updated_at = NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a function to get premium usage for the current month
CREATE OR REPLACE FUNCTION get_premium_usage(user_uuid UUID)
RETURNS INTEGER AS $$
DECLARE
  current_month VARCHAR(7);
  usage_count INTEGER;
BEGIN
  -- Get current month in YYYY-MM format
  current_month := to_char(NOW(), 'YYYY-MM');
  
  -- Get the usage count for the current month
  SELECT pu.usage_count INTO usage_count
  FROM premium_usage pu
  WHERE pu.user_id = user_uuid AND pu.month = current_month;
  
  -- Return 0 if no record found
  RETURN COALESCE(usage_count, 0);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
