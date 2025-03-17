// This file is a wrapper around the server-side Supabase client
// It's designed to be used only in server components

export async function getSupabaseServer() {
  // Dynamically import the server module to prevent next/headers from being imported at module level
  const { createServerClient } = await import("../supabase/server");
  return createServerClient();
}
