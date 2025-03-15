-- Create plants table
CREATE TABLE IF NOT EXISTS plants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  scientific_name TEXT,
  image_url TEXT,
  plant_data JSONB NOT NULL,
  identified_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Enable RLS
ALTER TABLE plants ENABLE ROW LEVEL SECURITY;

-- Create policies
DROP POLICY IF EXISTS "Users can view their own plants";
CREATE POLICY "Users can view their own plants"
  ON plants FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own plants";
CREATE POLICY "Users can insert their own plants"
  ON plants FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own plants";
CREATE POLICY "Users can update their own plants"
  ON plants FOR UPDATE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own plants";
CREATE POLICY "Users can delete their own plants"
  ON plants FOR DELETE
  USING (auth.uid() = user_id);

-- Enable realtime
alter publication supabase_realtime add table plants;