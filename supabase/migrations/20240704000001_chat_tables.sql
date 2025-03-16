-- Create chat conversations table
CREATE TABLE IF NOT EXISTS chat_conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create chat messages table
CREATE TABLE IF NOT EXISTS chat_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID NOT NULL REFERENCES chat_conversations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_chat_messages_conversation_id ON chat_messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_chat_conversations_user_id ON chat_conversations(user_id);

-- Create function to delete old conversations (older than 4 days)
CREATE OR REPLACE FUNCTION delete_old_chat_conversations()
RETURNS TRIGGER AS $$
BEGIN
  DELETE FROM chat_conversations
  WHERE created_at < NOW() - INTERVAL '4 days';
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to run the function daily
DROP TRIGGER IF EXISTS trigger_delete_old_chat_conversations ON chat_conversations;
CREATE TRIGGER trigger_delete_old_chat_conversations
AFTER INSERT ON chat_conversations
EXECUTE PROCEDURE delete_old_chat_conversations();

-- Add tables to realtime publication (commented out to prevent errors if already added)
-- ALTER PUBLICATION supabase_realtime ADD TABLE chat_conversations;
-- ALTER PUBLICATION supabase_realtime ADD TABLE chat_messages;