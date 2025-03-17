-- Add indexes to improve query performance

-- Add index to recent_searches table for faster user-specific queries
CREATE INDEX IF NOT EXISTS idx_recent_searches_user_id ON recent_searches(user_id);

-- Add index to chat_messages table for faster conversation-specific queries
CREATE INDEX IF NOT EXISTS idx_chat_messages_conversation_id ON chat_messages(conversation_id);

-- Add index to chat_conversations table for faster user-specific queries
CREATE INDEX IF NOT EXISTS idx_chat_conversations_user_id ON chat_conversations(user_id);

-- Add index to subscriptions table for faster user-specific queries
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);
