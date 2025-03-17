-- Add last_message field to chat_conversations table
ALTER TABLE chat_conversations ADD COLUMN IF NOT EXISTS last_message TEXT;
ALTER TABLE chat_conversations ADD COLUMN IF NOT EXISTS message_count INTEGER DEFAULT 0;

-- Add index for faster chat history retrieval
CREATE INDEX IF NOT EXISTS chat_messages_conversation_id_idx ON chat_messages(conversation_id);
CREATE INDEX IF NOT EXISTS chat_conversations_user_id_idx ON chat_conversations(user_id);

-- Enable realtime for chat tables
-- Only add tables to realtime if they're not already members
DO $
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' 
    AND tablename = 'chat_conversations'
  ) THEN
    EXECUTE 'ALTER PUBLICATION supabase_realtime ADD TABLE chat_conversations';
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' 
    AND tablename = 'chat_messages'
  ) THEN
    EXECUTE 'ALTER PUBLICATION supabase_realtime ADD TABLE chat_messages';
  END IF;
END
$;

-- Create function to delete old chats (older than 30 days)
CREATE OR REPLACE FUNCTION delete_old_chats()
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  -- Delete old messages
  DELETE FROM chat_messages
  WHERE conversation_id IN (
    SELECT id FROM chat_conversations
    WHERE updated_at < NOW() - INTERVAL '30 days'
  );
  
  -- Delete old conversations
  DELETE FROM chat_conversations
  WHERE updated_at < NOW() - INTERVAL '30 days';
  
  RETURN;
END;
$$;

-- Create a trigger to update conversation's updated_at when a new message is added
CREATE OR REPLACE FUNCTION update_conversation_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE chat_conversations
  SET 
    updated_at = NOW(),
    last_message = NEW.content,
    message_count = (SELECT COUNT(*) FROM chat_messages WHERE conversation_id = NEW.conversation_id)
  WHERE id = NEW.conversation_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop the trigger if it exists
DROP TRIGGER IF EXISTS update_conversation_on_message ON chat_messages;

-- Create the trigger
CREATE TRIGGER update_conversation_on_message
AFTER INSERT ON chat_messages
FOR EACH ROW
EXECUTE FUNCTION update_conversation_timestamp();
