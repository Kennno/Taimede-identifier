-- Create storage bucket for chat images if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('chat_images', 'chat_images', true)
ON CONFLICT (id) DO NOTHING;

-- Set up storage policy for chat_images
DROP POLICY IF EXISTS "Users can upload their own chat images" ON storage.objects;
CREATE POLICY "Users can upload their own chat images"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'chat_images' AND auth.uid()::text = SPLIT_PART(name, '/', 1));

DROP POLICY IF EXISTS "Anyone can view chat images" ON storage.objects;
CREATE POLICY "Anyone can view chat images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'chat_images');

-- Add image_url column to chat_messages if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_schema = 'public' 
                 AND table_name = 'chat_messages' 
                 AND column_name = 'image_url') THEN
    ALTER TABLE chat_messages ADD COLUMN image_url TEXT;
  END IF;
END$$;

-- Add realtime publication for chat_messages if not already added
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' 
    AND schemaname = 'public' 
    AND tablename = 'chat_messages'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE chat_messages;
  END IF;
END$$;