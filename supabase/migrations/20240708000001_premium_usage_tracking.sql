-- Create a new table for tracking premium user identification usage
CREATE TABLE IF NOT EXISTS premium_usage (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  month VARCHAR(7) NOT NULL, -- Format: YYYY-MM
  usage_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, month)
);

-- Add RLS policies
ALTER TABLE premium_usage ENABLE ROW LEVEL SECURITY;

-- Allow users to see only their own usage
DROP POLICY IF EXISTS "Users can view their own usage" ON premium_usage;
CREATE POLICY "Users can view their own usage"
  ON premium_usage FOR SELECT
  USING (auth.uid() = user_id);

-- Allow the service role to manage all records
DROP POLICY IF EXISTS "Service role can manage all usage records" ON premium_usage;
CREATE POLICY "Service role can manage all usage records"
  ON premium_usage FOR ALL
  USING (auth.jwt() ->> 'role' = 'service_role');

-- Create a function to increment premium usage
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

-- Add this table to realtime publication
alter publication supabase_realtime add table premium_usage;
