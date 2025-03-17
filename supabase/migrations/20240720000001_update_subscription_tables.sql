-- Add is_premium field to usage_tracking table if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'usage_tracking' AND column_name = 'is_premium') THEN
        ALTER TABLE usage_tracking ADD COLUMN is_premium BOOLEAN DEFAULT false;
    END IF;
END $$;

-- Add is_premium field to device_tracking table if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'device_tracking' AND column_name = 'is_premium') THEN
        ALTER TABLE device_tracking ADD COLUMN is_premium BOOLEAN DEFAULT false;
    END IF;
END $$;

-- Ensure subscriptions table has all necessary fields
CREATE TABLE IF NOT EXISTS subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    stripe_customer_id TEXT,
    stripe_subscription_id TEXT,
    status TEXT,
    plan_id TEXT,
    current_period_start TIMESTAMP WITH TIME ZONE,
    current_period_end TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    cancel_at TIMESTAMP WITH TIME ZONE,
    canceled_at TIMESTAMP WITH TIME ZONE,
    trial_start TIMESTAMP WITH TIME ZONE,
    trial_end TIMESTAMP WITH TIME ZONE
);

-- Add tables to realtime publication
alter publication supabase_realtime add table subscriptions;
alter publication supabase_realtime add table usage_tracking;
alter publication supabase_realtime add table device_tracking;
