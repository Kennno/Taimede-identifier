-- This migration safely adds tables to the supabase_realtime publication
-- First check if the publication exists
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime') THEN
        -- Add tables to the existing publication if they're not already part of it
        IF NOT EXISTS (
            SELECT 1 FROM pg_publication_tables 
            WHERE pubname = 'supabase_realtime' AND tablename = 'chat_messages'
        ) THEN
            ALTER PUBLICATION supabase_realtime ADD TABLE chat_messages;
        END IF;
        
        IF NOT EXISTS (
            SELECT 1 FROM pg_publication_tables 
            WHERE pubname = 'supabase_realtime' AND tablename = 'chat_conversations'
        ) THEN
            ALTER PUBLICATION supabase_realtime ADD TABLE chat_conversations;
        END IF;
        
        IF NOT EXISTS (
            SELECT 1 FROM pg_publication_tables 
            WHERE pubname = 'supabase_realtime' AND tablename = 'recent_searches'
        ) THEN
            ALTER PUBLICATION supabase_realtime ADD TABLE recent_searches;
        END IF;
        
        IF NOT EXISTS (
            SELECT 1 FROM pg_publication_tables 
            WHERE pubname = 'supabase_realtime' AND tablename = 'subscriptions'
        ) THEN
            ALTER PUBLICATION supabase_realtime ADD TABLE subscriptions;
        END IF;
        
        IF NOT EXISTS (
            SELECT 1 FROM pg_publication_tables 
            WHERE pubname = 'supabase_realtime' AND tablename = 'webhook_events'
        ) THEN
            ALTER PUBLICATION supabase_realtime ADD TABLE webhook_events;
        END IF;
    ELSE
        -- Create the publication if it doesn't exist
        CREATE PUBLICATION supabase_realtime FOR TABLE 
            chat_messages, 
            chat_conversations, 
            recent_searches, 
            subscriptions, 
            webhook_events;
    END IF;
END
$$;
