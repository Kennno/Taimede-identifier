-- Update the delete_old_chats function to delete chats older than 7 days instead of 30 days
CREATE OR REPLACE FUNCTION delete_old_chats()
RETURNS void AS $$
BEGIN
  -- Delete messages from conversations older than 7 days
  DELETE FROM chat_messages
  WHERE conversation_id IN (
    SELECT id FROM chat_conversations
    WHERE created_at < NOW() - INTERVAL '7 days'
  );
  
  -- Delete conversations older than 7 days
  DELETE FROM chat_conversations
  WHERE created_at < NOW() - INTERVAL '7 days';
  
  -- Delete AI chat messages older than 7 days
  DELETE FROM ai_messages
  WHERE chat_id IN (
    SELECT id FROM ai_chats
    WHERE created_at < NOW() - INTERVAL '7 days'
  );
  
  -- Delete AI chats older than 7 days
  DELETE FROM ai_chats
  WHERE created_at < NOW() - INTERVAL '7 days';
END;
$$ LANGUAGE plpgsql;
