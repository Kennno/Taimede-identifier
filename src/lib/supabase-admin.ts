import { createClient } from "@supabase/supabase-js";

// This is a direct Supabase client that doesn't use cookies
// It's meant for server-side operations that don't need cookie auth
export const createAdminClient = () => {
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.SUPABASE_SERVICE_KEY
  ) {
    throw new Error("Missing Supabase environment variables");
  }

  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY,
    {
      auth: {
        persistSession: false,
      },
    },
  );
};
