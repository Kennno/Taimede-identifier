-- Create device_usage table for tracking anonymous users
CREATE TABLE IF NOT EXISTS device_usage (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  device_id TEXT NOT NULL UNIQUE,
  usage_count INTEGER NOT NULL DEFAULT 0,
  last_used TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Add index on device_id for faster lookups
CREATE INDEX IF NOT EXISTS device_usage_device_id_idx ON device_usage(device_id);

-- Enable row level security
ALTER TABLE device_usage ENABLE ROW LEVEL SECURITY;

-- Create policy for device_usage table
DROP POLICY IF EXISTS "Public device usage access" ON device_usage;
CREATE POLICY "Public device usage access"
ON device_usage FOR ALL
USING (true);

-- Enable realtime for device_usage table (commented out to prevent errors if already added)
-- ALTER PUBLICATION supabase_realtime ADD TABLE device_usage;
