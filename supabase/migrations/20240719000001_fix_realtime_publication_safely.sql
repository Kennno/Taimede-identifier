-- Safely add tables to the supabase_realtime publication
-- First check if the publication exists
DO $$
BEGIN
    -- Check if the publication exists
    IF EXISTS (SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime') THEN
        -- Check if chat_conversations is already a member of the publication
        IF NOT EXISTS (
            SELECT 1 
            FROM pg_publication_tables 
            WHERE pubname = 'supabase_realtime' 
            AND schemaname = 'public' 
            AND tablename = 'chat_conversations'
        ) THEN
            -- Add chat_conversations to the publication if it's not already a member
            ALTER PUBLICATION supabase_realtime ADD TABLE public.chat_conversations;
        END IF;
        
        -- Check if chat_messages is already a member of the publication
        IF NOT EXISTS (
            SELECT 1 
            FROM pg_publication_tables 
            WHERE pubname = 'supabase_realtime' 
            AND schemaname = 'public' 
            AND tablename = 'chat_messages'
        ) THEN
            -- Add chat_messages to the publication if it's not already a member
            ALTER PUBLICATION supabase_realtime ADD TABLE public.chat_messages;
        END IF;
    END IF;
END
$$;