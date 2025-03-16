-- Fix for recent searches table

-- Add indexes to improve query performance
CREATE INDEX IF NOT EXISTS idx_recent_searches_user_id ON recent_searches(user_id);

-- Ensure cascade delete is set up properly
ALTER TABLE recent_searches DROP CONSTRAINT IF EXISTS recent_searches_user_id_fkey;
ALTER TABLE recent_searches ADD CONSTRAINT recent_searches_user_id_fkey 
  FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- Update RLS policies to ensure proper access
DROP POLICY IF EXISTS "Users can view their own recent searches" ON recent_searches;
CREATE POLICY "Users can view their own recent searches"
  ON recent_searches FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own recent searches" ON recent_searches;
CREATE POLICY "Users can insert their own recent searches"
  ON recent_searches FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Enable RLS on the table
ALTER TABLE recent_searches ENABLE ROW LEVEL SECURITY;

-- Enable realtime for the table
ALTER PUBLICATION supabase_realtime ADD TABLE recent_searches;
