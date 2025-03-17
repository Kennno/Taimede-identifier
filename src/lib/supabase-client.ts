// Import from the supabase/client.ts file to avoid duplication
import { createClient as createBrowserClient } from "../../supabase/client";

export function createClientSideClient() {
  return createBrowserClient();
}
