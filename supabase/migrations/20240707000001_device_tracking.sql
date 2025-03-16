-- Create device tracking table to track devices across accounts
CREATE TABLE IF NOT EXISTS device_tracking (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  device_fingerprint TEXT NOT NULL UNIQUE,
  user_ids TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_used TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add device_fingerprint column to device_usage table
ALTER TABLE device_usage ADD COLUMN IF NOT EXISTS device_fingerprint TEXT;

-- Create index on device_fingerprint for faster lookups
CREATE INDEX IF NOT EXISTS idx_device_tracking_fingerprint ON device_tracking(device_fingerprint);
CREATE INDEX IF NOT EXISTS idx_device_usage_fingerprint ON device_usage(device_fingerprint);
