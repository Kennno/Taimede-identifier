-- Create recent_searches table
CREATE TABLE IF NOT EXISTS recent_searches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  plant_name TEXT NOT NULL,
  scientific_name TEXT,
  search_data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Enable RLS
ALTER TABLE recent_searches ENABLE ROW LEVEL SECURITY;

-- Create policies
DROP POLICY IF EXISTS "Users can view their own searches";
CREATE POLICY "Users can view their own searches"
  ON recent_searches FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own searches";
CREATE POLICY "Users can insert their own searches"
  ON recent_searches FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own searches";
CREATE POLICY "Users can delete their own searches"
  ON recent_searches FOR DELETE
  USING (auth.uid() = user_id);

-- Enable realtime
alter publication supabase_realtime add table recent_searches;