-- Create a function to delete old chat messages and conversations
CREATE OR REPLACE FUNCTION delete_old_chats()
RETURNS void AS $$
BEGIN
  -- Delete messages older than 4 days
  DELETE FROM chat_messages
  WHERE created_at < NOW() - INTERVAL '4 days';
  
  -- Delete conversations that have no messages
  DELETE FROM chat_conversations
  WHERE id NOT IN (SELECT DISTINCT conversation_id FROM chat_messages);
  
END;
$$ LANGUAGE plpgsql;

-- Create a scheduled job to run the function daily
CREATE EXTENSION IF NOT EXISTS pg_cron;

SELECT cron.schedule(
  'delete-old-chats',
  '0 0 * * *',  -- Run at midnight every day
  $$SELECT delete_old_chats()$$
);
