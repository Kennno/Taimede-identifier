import { createServerClient } from "@/supabase/server";

export async function createServerSideClient() {
  return await createServerClient();
}
